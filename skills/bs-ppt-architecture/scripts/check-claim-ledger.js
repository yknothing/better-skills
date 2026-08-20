#!/usr/bin/env node
// Structural checker for a Claim Ledger (claims.md) — the machine-enforceable
// subset of the bs-ppt-architecture requirements.
//
// It checks two different things, and the distinction matters. Some checks serve
// the OBJECTIVE (does a belief delta exist, does every exhibit declare a
// comparison baseline, is there a sharpness trail) and some serve the
// CONSTRAINT (falsifiers, verb permission, honesty fields). Neither kind can
// measure excellence: whether a claim is actually sharp, whether the pillars
// actually carry weight, and whether an exhibit actually reveals anything are
// human judgements. What the script can do is refuse to let those steps be
// skipped silently.
//
// Slides cannot be mechanically checked; a structured ledger can. This script
// exists so the architecture and honesty rules that are machine-checkable
// are enforced by a program rather than by the author's good intentions.
//
// SCOPE, STATED PLAINLY: this checks FORM ONLY — presence, format, internal
// consistency, ordering, and reference closure. It cannot judge whether an
// argument is sound, whether a switching point came from real sensitivity
// analysis, or whether a warrant is true. A Gate 2 review of this
// script produced a ledger that passed every check while being substantively
// worthless; the checks below close the specific holes that review found, but
// the general point stands and cannot be engineered away. Passing this checker
// means nothing was caught, not that the architecture is excellent.
//
// Usage:
//   node scripts/check-claim-ledger.js <claims.md>
//   node scripts/check-claim-ledger.js <claims.md> --deck <first-deck-file>
//   node scripts/check-claim-ledger.js <claims.md> --json
//
// --deck enables the only real test of commitment ordering: it compares file
// modification times. Without it, ordering is reported as UNVERIFIED rather
// than passed, because a self-reported `registered-at:` string can be typed
// after the fact.
//
// Exit codes: 0=all pass, 1=at least one fail, 2=usage error, 5=file not found
"use strict";

const fs = require("fs");
const path = require("path");

// ---------------------------------------------------------------------------
// Constants — every threshold, vocabulary, and mapping lives here with its
// rationale. No literal thresholds appear below this block.
// ---------------------------------------------------------------------------

/** Claim count bounds (gate G2). More than three core claims means the author
 *  has not decided what the deck is asking for. */
const CLAIM_COUNT_MIN = 1;
const CLAIM_COUNT_MAX = 3;

/** Causal evidence ladder; array index is the grade's strength.
 *  Defined in references/architecture.md. */
const GRADES = ["T0", "T1", "T2", "T3", "T4", "T5"];

/** Minimum grade licensing each causal verb family.
 *
 *  DELIBERATELY INCOMPLETE. English has far more ways to assert causation than
 *  any word list can hold ("thanks to", "as a result of", "X unlocked Y",
 *  bare juxtaposition). This catches the common offenders; it does not and
 *  cannot certify that a claim's wording matches its evidence. That judgement
 *  belongs to the human reviewer. Treat a clean run as "no known offender
 *  found", not as "wording verified". */
const VERB_PERMISSIONS = [
  { pattern: /\b(caused?|causing|causal effect|because of|due to|thanks to|as a result of|resulted? (?:in|from))\b/i, minGrade: "T4" },
  { pattern: /\b(contributed?|attributable to|responsible for|accounts? for)\b/i, minGrade: "T3" },
  { pattern: /\b(drove|drives|driven by|led to|leads? to|delivered|unlocked|enabled|powered|generated|produced|created|yielded)\b/i, minGrade: "T3" },
  { pattern: /\b(improved?|increased?|reduced?|boosted?|lifted?|improvement|reduction|uplift|gains? of)\b/i, minGrade: "T2" },
  { pattern: /\b(proves?|proven|proof that|guarantees?|demonstrates? that|confirms? that)\b/i, minGrade: "T5" },
];

/** Grade at or above which a written counterfactual is mandatory: T3 is the
 *  first grade making an interventional claim. */
const COUNTERFACTUAL_MIN_GRADE = "T3";

/** Probability bands with their governing ranges (ICD 203). The declared
 *  numeric range must match the band it names — validating each half
 *  separately let "almost certain, 1-5 percent" through Gate 2 review. */
const PROBABILITY_BANDS = [
  { name: "almost no chance", lo: 1, hi: 5 },
  { name: "very unlikely", lo: 5, hi: 20 },
  { name: "unlikely", lo: 20, hi: 45 },
  { name: "roughly even chance", lo: 45, hi: 55 },
  { name: "likely", lo: 55, hi: 80 },
  { name: "very likely", lo: 80, hi: 95 },
  { name: "almost certain", lo: 95, hi: 99 },
];

/** Vague quantifiers banned outright — they transmit almost no information
 *  (Sherman Kent's finding on "serious possibility"). Matched on word
 *  boundaries so "unlikely" inside "very unlikely" is not a false positive. */
const BANNED_HEDGES = [
  "possibly", "hopefully", "cannot be ruled out", "can't be ruled out",
  "fairly confident", "quite likely", "should be fine", "more or less",
];

/** Placeholder text. A field filled with these is unfilled, and several gates
 *  were satisfiable by them before Gate 2 review. */
const PLACEHOLDER_RE = /^\s*(tbd|tba|todo|to be determined|xxx+|n\/?a|none|pending|unknown|\?+|-+)\s*$/i;

/** Evasions of the counterfactual requirement: denying a counterfactual exists
 *  is not stating one. Per the ladder, no counterfactual means the claim is
 *  T2, so the grade must come down rather than the field being explained away. */
const COUNTERFACTUAL_EVASION_RE = /\b(not applicable|no control|none exists?|cannot be|can't be|impossible to)\b/i;

/** A falsifier's source must name something specific. When the only substantive
 *  word after "via" is one of these, no source has been named. */
const VAGUE_SOURCE_WORDS = new Set([
  "internal", "review", "team", "discussion", "judgment", "judgement",
  "us", "me", "management", "leadership", "consensus", "analysis", "assessment",
]);

/** A settlement triple is date | source | rule. */
const SETTLEMENT_PART_COUNT = 3;

/** A signpost carries metric | threshold | cadence | source | owner | action
 *  (RAND assumption-based planning). */
const SIGNPOST_PART_COUNT = 6;

/** Review tiers and the analysis each one actually requires. Section presence
 *  is not enough: an empty `## Assumptions` heading used to satisfy the
 *  switching-point check vacuously, which meant omitting the analysis scored
 *  better than doing it badly. */
const TIER_REQUIREMENTS = {
  L0: { minAssumptions: 0, minRebuttals: 0 },
  L1: { minAssumptions: 1, minRebuttals: 0 },
  L2: { minAssumptions: 1, minRebuttals: 1 },
  L3: { minAssumptions: 2, minRebuttals: 2 },
};
const TIERS = Object.keys(TIER_REQUIREMENTS);
const PACING_MODES = ["speaker-paced", "reader-paced"];

/** Evidence basis. `qualitative` relaxes the numeric-threshold requirement on
 *  falsifiers — a qualitative proposal that must invent numbers to pass a gate
 *  produces exactly the false precision this skill names as a failure.
 *  It does NOT relax decidability: the falsifying event must still be
 *  observable, dated, and attributable to a named source. */
const EVIDENCE_BASES = ["quantitative", "qualitative", "mixed"];
const QUALITATIVE_BASES = new Set(["qualitative"]);

/** ISO-8601 date, and a number that is not part of a date. */
const ISO_DATE_RE = /\d{4}-\d{2}-\d{2}/g;
const NUMBER_RE = /-?\d+(?:[.,]\d+)?/;

/** Entry IDs are strictly one uppercase prefix letter plus digits. A lowercase
 *  `### c3` heading was invisible to every check while reading as a claim to
 *  any human, so malformed IDs are now a failure rather than a silent skip. */
const ENTRY_ID_RE = /^[CEAR]\d+$/;

const SECTION_HEADINGS = {
  triage: "triage",
  belief: "belief delta",
  prereg: "pre-registration",
  claims: "claims",
  evidence: "evidence",
  assumptions: "assumptions",
  rebuttals: "rebuttals",
};

const REQUIRED_TRIAGE_FIELDS = ["pacing", "tier", "product"];
/** The belief delta is the objective's entry point: who moves, from what to
 *  what, on what evidence, and what they then do differently. An empty
 *  will-do column means there is nothing to build yet. */
const REQUIRED_BELIEF_FIELDS = ["who", "believes-now", "should-believe", "evidence", "will-do"];
/** Non-identity heuristic. If the target belief is the current belief in a
 *  firmer tone, no shift is being proposed. Content-word overlap above this
 *  share is flagged; it is a heuristic, so it warns rather than fails. */
const BELIEF_OVERLAP_WARN_RATIO = 0.75;
/** A will-do entry must name an action, not an attitude. */
const ATTITUDE_ONLY_RE = /^\s*(pay (more )?attention|be aware|consider|think about|keep in mind|monitor|focus (more )?on)\b/i;
const REQUIRED_PREREG_FIELDS = [
  "registered-at", "data-freeze", "decision-request",
  "strongest-counter", "would-change-mind",
];
const REQUIRED_CLAIM_FIELDS = [
  "claim", "grade", "warrant", "evidence", "falsifier", "probability", "settlement",
  // Sharpness trail. `negation-test` records what the negated claim reads like
  // (if the negation is absurd rather than arguable, the claim is fluff);
  // `cost` records what is being given up, because a recommendation with no
  // loser needs no meeting. Both are cheap to fake — they force the step to be
  // visible, they do not verify it was performed.
  "negation-test", "cost",
];
/** Evidence entries had no required fields at all, so an empty `### E1` closed
 *  a claim's reference requirement while carrying nothing. */
/** `baseline` is first among these by design: every quantitative assertion is
 *  "X differs from Y by D", so with no Y there is no D and the exhibit is a
 *  numeric display. Choosing it is the first design decision, ahead of chart
 *  type. See references/exhibits.md Part 1. */
const REQUIRED_EVIDENCE_FIELDS = ["description", "baseline", "source", "definition"];
const REQUIRED_ASSUMPTION_FIELDS = ["assumption", "current", "switching-point", "signpost"];
const REQUIRED_REBUTTAL_FIELDS = ["rebuttal", "response"];

const ID_PREFIX = { claim: "C", evidence: "E", assumption: "A", rebuttal: "R" };

/** Warrant-tautology heuristic: a warrant restating the claim is not a warrant.
 *  Content-word overlap above this share is flagged for the negation test.
 *  Heuristic, hence a warning rather than a failure. */
const WARRANT_OVERLAP_WARN_RATIO = 0.6;
const WARRANT_MIN_CONTENT_WORDS = 4;

const STOPWORDS = new Set([
  "the", "a", "an", "and", "or", "of", "to", "in", "on", "for", "by", "with",
  "is", "are", "was", "were", "be", "been", "that", "this", "these", "those",
  "it", "its", "as", "at", "from", "will", "would", "than", "then", "we", "our",
]);

// ---------------------------------------------------------------------------
// Parser
// ---------------------------------------------------------------------------

/**
 * Parse a Claim Ledger into sections of ID-keyed field maps.
 *
 * Tolerates bold or italic field names (`- **claim**: x`), which previously
 * produced a false "missing claim" failure while silently disabling the checks
 * that read that field. Also joins indented continuation lines, so a wrapped
 * long value no longer loses everything after the wrap.
 *
 * @param {string} content Raw file contents.
 * @returns {{sections: Object, malformedIds: string[]}} Sections keyed by
 *   lowercased heading; entries keyed by `### ID`, section-level fields under `_`.
 */
function parseLedger(content) {
  const sections = {};
  const malformedIds = [];
  let currentSection = null;
  let currentEntry = null;
  let lastField = null;

  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();

    const h2 = line.match(/^##\s+([^#].*)$/);
    if (h2) {
      currentSection = h2[1].trim().toLowerCase();
      sections[currentSection] = sections[currentSection] || { _: {} };
      currentEntry = "_";
      lastField = null;
      continue;
    }

    const h3 = line.match(/^###\s+(.+)$/);
    if (h3 && currentSection) {
      const id = h3[1].trim();
      currentEntry = id;
      sections[currentSection][id] = {};
      lastField = null;
      // Record IDs that look like entries but break the naming contract, so a
      // lowercase or misspelled heading fails loudly instead of vanishing.
      if (/^[a-zA-Z]\d+$/.test(id) && !ENTRY_ID_RE.test(id)) malformedIds.push(id);
      continue;
    }

    // Field line, with optional bold/italic markers around the key.
    const field = line.match(/^[-*]\s+\*{0,2}_{0,2}([a-zA-Z][a-zA-Z0-9-]*)_{0,2}\*{0,2}\s*:\s*(.*)$/);
    if (field && currentSection && currentEntry !== null) {
      const bucket = sections[currentSection][currentEntry];
      if (bucket) {
        lastField = field[1].toLowerCase();
        bucket[lastField] = field[2].trim();
      }
      continue;
    }

    // Continuation of the previous field: an indented, non-empty, non-heading
    // line that is not itself a list item.
    if (lastField && rawLine.match(/^\s+\S/) && !line.startsWith("-") && !line.startsWith("#")) {
      const bucket = sections[currentSection] && sections[currentSection][currentEntry];
      if (bucket && bucket[lastField] !== undefined) bucket[lastField] += " " + line;
      continue;
    }

    if (!line) lastField = null;
  }

  return { sections, malformedIds };
}

function entriesOf(sections, sectionName, prefix) {
  const sec = sections[sectionName];
  if (!sec) return [];
  return Object.keys(sec)
    .filter((k) => k !== "_" && (!prefix || k.startsWith(prefix)))
    .map((id) => [id, sec[id]]);
}

function sectionFields(sections, sectionName) {
  return (sections[sectionName] && sections[sectionName]._) || {};
}

function extractIds(value, prefix) {
  if (!value) return [];
  return value.match(new RegExp(`\\b${prefix}\\d+\\b`, "g")) || [];
}

function contentWords(text) {
  return (text || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter((w) => w && w.length > 2 && !STOPWORDS.has(w));
}

function gradeIndex(grade) {
  return GRADES.indexOf((grade || "").toUpperCase().trim());
}

function isPlaceholder(value) {
  return !value || PLACEHOLDER_RE.test(value);
}

/** Strip ISO dates before looking for a numeric threshold: a date supplies
 *  digits that satisfied the threshold test on its own. */
function hasNonDateNumber(text) {
  return NUMBER_RE.test(String(text).replace(ISO_DATE_RE, " "));
}

// ---------------------------------------------------------------------------
// Result helpers
// ---------------------------------------------------------------------------

const results = [];
function pass(label, detail) { results.push({ status: "pass", label, detail: detail || "" }); }
function fail(label, detail) { results.push({ status: "fail", label, detail: detail || "" }); }
function warn(label, detail) { results.push({ status: "warn", label, detail: detail || "" }); }

function verdict(label, problems, okDetail) {
  if (problems.length === 0) pass(label, okDetail);
  else fail(label, problems.join("; "));
}

/** Fields that are present but filled with a placeholder count as missing. */
function missingOrPlaceholder(entry, fields, id) {
  const problems = [];
  for (const f of fields) {
    if (!entry[f]) problems.push(`${id} missing ${f}`);
    else if (isPlaceholder(entry[f])) problems.push(`${id} ${f} is a placeholder ("${entry[f]}")`);
  }
  return problems;
}

// ---------------------------------------------------------------------------
// Checks
// ---------------------------------------------------------------------------

function checkSections(sections) {
  const missing = Object.values(SECTION_HEADINGS).filter((s) => !sections[s]);
  verdict("Required sections present", missing.length ? [`missing: ${missing.join(", ")}`] : [],
    `${Object.keys(SECTION_HEADINGS).length} sections found`);
}

function checkEntryIds(malformedIds) {
  verdict("Entry IDs well-formed (C/E/A/R + digits, uppercase)",
    malformedIds.length ? [`malformed: ${malformedIds.join(", ")} — lowercase or unknown-prefix entries are skipped by every other check`] : [],
    "no malformed entry headings");
}

/**
 * Check 3: the belief delta exists and proposes an actual shift.
 * This is the objective's entry point, so it is checked before anything that
 * serves the constraint.
 */
function checkBeliefDelta(sections) {
  const f = sectionFields(sections, SECTION_HEADINGS.belief);
  const problems = missingOrPlaceholder(f, REQUIRED_BELIEF_FIELDS, "belief-delta");

  if (f["will-do"] && !isPlaceholder(f["will-do"]) && ATTITUDE_ONLY_RE.test(f["will-do"]))
    problems.push(`will-do names an attitude, not an action ("${f["will-do"].slice(0, 40)}...") — it must contain a verb and an object such as approve, cancel, or move X's budget`);

  verdict("Belief delta present with an actionable will-do", problems);

  // Non-identity is a matter of substance, so the textual overlap test can only
  // flag a suspicion, never establish one.
  const now = f["believes-now"];
  const should = f["should-believe"];
  if (now && should && !isPlaceholder(now) && !isPlaceholder(should)) {
    const sWords = contentWords(should);
    if (sWords.length >= WARRANT_MIN_CONTENT_WORDS) {
      const nWords = new Set(contentWords(now));
      const overlap = sWords.filter((w) => nWords.has(w)).length / sWords.length;
      if (overlap > BELIEF_OVERLAP_WARN_RATIO) {
        warn("Belief delta proposes a real shift, not a firmer restatement",
          `should-believe overlaps believes-now by ${Math.round(overlap * 100)}% — check that this is a shift rather than the same belief in a stronger tone`);
        return;
      }
    }
  }
  pass("Belief delta proposes a real shift, not a firmer restatement");
}

function checkTriage(sections) {
  const f = sectionFields(sections, SECTION_HEADINGS.triage);
  const problems = missingOrPlaceholder(f, REQUIRED_TRIAGE_FIELDS, "triage");
  if (f.pacing && !PACING_MODES.includes(f.pacing.toLowerCase()))
    problems.push(`pacing must be one of ${PACING_MODES.join(" | ")}`);
  if (f.tier && !TIERS.includes(f.tier.toUpperCase()))
    problems.push(`tier must be one of ${TIERS.join(" | ")}`);
  if (f["evidence-basis"] && !EVIDENCE_BASES.includes(f["evidence-basis"].toLowerCase()))
    problems.push(`evidence-basis must be one of ${EVIDENCE_BASES.join(" | ")}`);
  verdict("Triage block complete (pacing, tier, product)", problems);
}

/**
 * Field-level check on the pre-registration block.
 *
 * Deliberately NOT labelled G1. G1 is an ordering property between two
 * artefacts — the Claim Statement must predate the first deck version — and a
 * self-reported date string cannot establish it. Ordering is checked separately
 * by checkCommitmentOrdering, which needs --deck to say anything at all.
 */
function checkPreregistrationFields(sections) {
  const f = sectionFields(sections, SECTION_HEADINGS.prereg);
  const problems = missingOrPlaceholder(f, REQUIRED_PREREG_FIELDS, "pre-registration");
  for (const dateField of ["registered-at", "data-freeze"]) {
    if (f[dateField] && !new RegExp(ISO_DATE_RE.source).test(f[dateField]))
      problems.push(`${dateField} must contain an ISO date (YYYY-MM-DD)`);
  }
  verdict("Pre-registration fields present (field-level only, not G1 ordering)", problems);
}

/**
 * The real G1: did the ledger exist before the deck?
 * @param {string} ledgerPath Path to claims.md.
 * @param {string|null} deckPath Path to the first deck artefact, if supplied.
 */
function checkCommitmentOrdering(ledgerPath, deckPath) {
  const label = "Commitment ordering: ledger predates deck (G1)";
  if (!deckPath) {
    warn(label, "UNVERIFIED — pass --deck <file> to compare modification times. A self-reported registered-at date cannot establish ordering, and G1 remains unverified without an external check (git history or a recorded hash is stronger still).");
    return;
  }
  if (!fs.existsSync(deckPath)) {
    fail(label, `deck file not found: ${deckPath}`);
    return;
  }
  const ledgerTime = fs.statSync(ledgerPath).mtimeMs;
  const deckTime = fs.statSync(deckPath).mtimeMs;
  if (ledgerTime <= deckTime) pass(label, `ledger mtime precedes deck mtime`);
  else fail(label, `ledger was modified after the deck (ledger ${new Date(ledgerTime).toISOString()} > deck ${new Date(deckTime).toISOString()}); mtime is weak evidence, so treat a pass here as necessary, not sufficient`);
}

function checkClaimCount(claims) {
  const n = claims.length;
  const label = `Core claim count within ${CLAIM_COUNT_MIN}-${CLAIM_COUNT_MAX} (actual: ${n})`;
  if (n >= CLAIM_COUNT_MIN && n <= CLAIM_COUNT_MAX) { pass(label); return; }
  if (n === 0) { fail(label, "no valid ### C<n> entries found under ## Claims"); return; }
  fail(label, `promote the ${CLAIM_COUNT_MAX} load-bearing claims and demote the rest to evidence or supporting detail — do not merge distinct claims into one sentence, which produces a claim that cannot be falsified as a unit`);
}

function checkClaimFields(claims) {
  const problems = [];
  for (const [id, c] of claims) problems.push(...missingOrPlaceholder(c, REQUIRED_CLAIM_FIELDS, id));
  verdict(`Claims carry required fields (${REQUIRED_CLAIM_FIELDS.join(", ")})`, problems);
}

function checkEvidenceFields(evidence) {
  const problems = [];
  for (const [id, e] of evidence) problems.push(...missingOrPlaceholder(e, REQUIRED_EVIDENCE_FIELDS, id));
  verdict(`Evidence entries carry required fields (${REQUIRED_EVIDENCE_FIELDS.join(", ")})`, problems);
}

function checkGrades(claims) {
  const problems = [];
  for (const [id, c] of claims) {
    if (c.grade && gradeIndex(c.grade) < 0)
      problems.push(`${id} grade "${c.grade}" not in ${GRADES.join("/")}`);
  }
  verdict("Evidence grades are valid ladder values", problems);
}

function checkVerbPermissions(claims) {
  const problems = [];
  for (const [id, c] of claims) {
    const gi = gradeIndex(c.grade);
    if (gi < 0) continue;
    for (const rule of VERB_PERMISSIONS) {
      const hit = (c.claim || "").match(rule.pattern);
      if (hit && gi < gradeIndex(rule.minGrade))
        problems.push(`${id} uses "${hit[0]}" at ${c.grade.toUpperCase()} (needs ${rule.minGrade})`);
    }
  }
  verdict("No known unlicensed causal verb (word list is not exhaustive)", problems,
    "no blacklisted verb above its grade — this does not certify the wording");
}

function checkCounterfactuals(claims) {
  const problems = [];
  for (const [id, c] of claims) {
    const gi = gradeIndex(c.grade);
    if (gi < gradeIndex(COUNTERFACTUAL_MIN_GRADE)) continue;
    if (!c.counterfactual) { problems.push(`${id} is ${c.grade.toUpperCase()} but has no counterfactual field`); continue; }
    if (isPlaceholder(c.counterfactual)) { problems.push(`${id} counterfactual is a placeholder`); continue; }
    if (COUNTERFACTUAL_EVASION_RE.test(c.counterfactual))
      problems.push(`${id} counterfactual denies a counterfactual exists ("${c.counterfactual.slice(0, 48)}...") — without one the claim is ${GRADES[gradeIndex(COUNTERFACTUAL_MIN_GRADE) - 1]}, so lower the grade instead`);
  }
  verdict(`Counterfactual stated for ${COUNTERFACTUAL_MIN_GRADE}+ claims`, problems);
}

function checkFalsifiers(claims, qualitative) {
  const problems = [];
  for (const [id, c] of claims) {
    const f = c.falsifier;
    if (!f || isPlaceholder(f)) continue; // already reported by field check
    if (!qualitative && !hasNonDateNumber(f))
      problems.push(`${id} falsifier has no numeric threshold outside its date`);
    if (!new RegExp(ISO_DATE_RE.source).test(f)) problems.push(`${id} falsifier has no date`);

    const via = f.match(/\bvia\s+([^,;.]+)/i);
    if (!via) {
      problems.push(`${id} falsifier names no source (expected "via <source>")`);
    } else {
      const words = via[1].toLowerCase().split(/\s+/).filter((w) => w.length > 2 && !STOPWORDS.has(w));
      if (words.length > 0 && words.every((w) => VAGUE_SOURCE_WORDS.has(w.replace(/[^a-z]/g, ""))))
        problems.push(`${id} falsifier source "${via[1].trim()}" names no specific system or dataset`);
    }
  }
  const label = qualitative
    ? "Falsifiers carry date and specific source (numeric threshold waived: qualitative basis)"
    : "Falsifiers carry threshold, date, and specific source (G2)";
  verdict(label, problems);
}

/** Band name and declared range must agree — validating them separately let
 *  "almost certain, 1-5 percent" pass Gate 2 review. */
function checkProbabilities(claims) {
  const problems = [];
  for (const [id, c] of claims) {
    const p = (c.probability || "").toLowerCase().trim();
    if (!p || isPlaceholder(p)) continue;

    const band = PROBABILITY_BANDS.find((b) => p.startsWith(b.name));
    if (!band) { problems.push(`${id} probability must begin with an ICD-203 band`); continue; }

    const nums = (p.slice(band.name.length).match(/\d+/g) || []).map(Number);
    if (nums.length < 2) { problems.push(`${id} probability has no numeric range`); continue; }
    const [lo, hi] = [nums[0], nums[1]];
    if (lo !== band.lo || hi !== band.hi)
      problems.push(`${id} declares "${band.name}" but range ${lo}-${hi} does not match its governing range ${band.lo}-${band.hi}`);
  }
  verdict("Probability band and declared range agree (G3)", problems);
}

function checkSettlements(claims) {
  const problems = [];
  for (const [id, c] of claims) {
    if (!c.settlement || isPlaceholder(c.settlement)) continue;
    const parts = c.settlement.split("|").map((s) => s.trim()).filter(Boolean);
    if (parts.length !== SETTLEMENT_PART_COUNT) {
      problems.push(`${id} settlement needs ${SETTLEMENT_PART_COUNT} pipe-separated parts (date | source | rule), found ${parts.length}`);
    } else if (!new RegExp(ISO_DATE_RE.source).test(parts[0])) {
      problems.push(`${id} settlement date is not an ISO date`);
    } else if (parts.some((p) => isPlaceholder(p))) {
      problems.push(`${id} settlement contains a placeholder part`);
    }
  }
  verdict("Settlement triples well-formed (G3)", problems);
}

/** Banned hedges, on word boundaries, ignoring quoted text so that a ledger
 *  quoting a reviewer's objection verbatim is not penalised for it. */
function checkBannedHedges(content) {
  const unquoted = content.replace(/["'“”‘’][^"'“”‘’\n]{0,200}["'“”‘’]/g, " ");
  const found = BANNED_HEDGES.filter((h) =>
    new RegExp(`(^|[^a-z])${h.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}([^a-z]|$)`, "i").test(unquoted));
  verdict("No banned vague hedges outside quotations (G3)",
    found.length ? [`found: ${found.join(", ")}`] : [], `${BANNED_HEDGES.length} banned phrases checked`);
}

/**
 * Reference closure. Evidence cited by an assumption or a rebuttal counts as
 * referenced: requiring citation from a claim alone punished the Phase 4
 * body-placement of adverse evidence, since that evidence is usually cited
 * from the rebuttal it supports rather than from a claim.
 */
function checkReferenceClosure(claims, evidence, assumptions, rebuttals) {
  const problems = [];
  const definedE = new Set(evidence.map(([id]) => id));
  const definedA = new Set(assumptions.map(([id]) => id));
  const definedR = new Set(rebuttals.map(([id]) => id));
  const referencedE = new Set();
  const referencedA = new Set();

  const citeSources = [
    ...claims.map(([id, c]) => [id, c]),
    ...assumptions.map(([id, a]) => [id, a]),
    ...rebuttals.map(([id, r]) => [id, r]),
  ];

  for (const [id, entry] of citeSources) {
    const text = Object.values(entry).join(" ");
    for (const ref of extractIds(text, ID_PREFIX.evidence)) {
      referencedE.add(ref);
      if (!definedE.has(ref)) problems.push(`${id} references undefined ${ref}`);
    }
    for (const ref of extractIds(text, ID_PREFIX.assumption)) {
      referencedA.add(ref);
      if (!definedA.has(ref)) problems.push(`${id} references undefined ${ref}`);
    }
    for (const ref of extractIds(text, ID_PREFIX.rebuttal)) {
      if (!definedR.has(ref)) problems.push(`${id} references undefined ${ref}`);
    }
  }

  for (const [id, c] of claims) {
    if (extractIds(c.evidence, ID_PREFIX.evidence).length === 0)
      problems.push(`${id} references no evidence`);
  }
  for (const id of definedE) {
    if (!referencedE.has(id)) problems.push(`${id} is defined but never cited by any claim, assumption, or rebuttal`);
  }
  for (const id of definedA) {
    if (!referencedA.has(id)) problems.push(`${id} is defined but never cited`);
  }

  verdict("Reference closure: no dangling refs, no orphan evidence (A2)", problems);
}

function checkAssumptions(assumptions) {
  const problems = [];
  for (const [id, a] of assumptions) {
    problems.push(...missingOrPlaceholder(a, REQUIRED_ASSUMPTION_FIELDS, id));
    if (a["switching-point"] && !isPlaceholder(a["switching-point"]) && !NUMBER_RE.test(a["switching-point"]))
      problems.push(`${id} switching-point is not numeric`);
    if (a.signpost && !isPlaceholder(a.signpost)) {
      const parts = a.signpost.split("|").map((s) => s.trim()).filter(Boolean);
      if (parts.length !== SIGNPOST_PART_COUNT)
        problems.push(`${id} signpost needs ${SIGNPOST_PART_COUNT} parts (metric | threshold | cadence | source | owner | action), found ${parts.length}`);
      else if (parts.some((p) => isPlaceholder(p)))
        problems.push(`${id} signpost contains a placeholder part — an unfilled signpost is an unverifiable assumption`);
    }
  }
  verdict(`Assumptions carry switching point and ${SIGNPOST_PART_COUNT}-part signpost (A5)`, problems);
}

function checkRebuttals(rebuttals) {
  const problems = [];
  for (const [id, r] of rebuttals) problems.push(...missingOrPlaceholder(r, REQUIRED_REBUTTAL_FIELDS, id));
  verdict("No naked rebuttals — every rebuttal has a response (G5)", problems);
}

/** Tier-aware cardinality: an empty section must not satisfy the analysis it
 *  is supposed to contain. */
function checkTierCardinality(sections, assumptions, rebuttals) {
  const tier = (sectionFields(sections, SECTION_HEADINGS.triage).tier || "").toUpperCase();
  const req = TIER_REQUIREMENTS[tier];
  const label = `Analysis depth matches tier (${tier || "unknown"})`;
  if (!req) { fail(label, "tier is missing or invalid, so the required analysis depth cannot be determined"); return; }

  const problems = [];
  if (assumptions.length < req.minAssumptions)
    problems.push(`${tier} requires >= ${req.minAssumptions} assumption entr${req.minAssumptions === 1 ? "y" : "ies"} with switching points, found ${assumptions.length}`);
  if (rebuttals.length < req.minRebuttals)
    problems.push(`${tier} requires >= ${req.minRebuttals} rebuttal entr${req.minRebuttals === 1 ? "y" : "ies"}, found ${rebuttals.length}`);
  verdict(label, problems, `${assumptions.length} assumption(s), ${rebuttals.length} rebuttal(s)`);
}

function checkWarrantTautology(claims) {
  const flagged = [];
  for (const [id, c] of claims) {
    if (!c.warrant || !c.claim || isPlaceholder(c.warrant)) continue;
    const wWords = contentWords(c.warrant);
    if (wWords.length < WARRANT_MIN_CONTENT_WORDS) {
      flagged.push(`${id} warrant is too short to be a general rule`);
      continue;
    }
    const cWords = new Set(contentWords(c.claim));
    const overlap = wWords.filter((w) => cWords.has(w)).length / wWords.length;
    if (overlap > WARRANT_OVERLAP_WARN_RATIO)
      flagged.push(`${id} warrant overlaps claim by ${Math.round(overlap * 100)}% — run the negation test`);
  }
  if (flagged.length === 0) pass("Warrants are general rules, not claim restatements (A3)");
  else warn("Warrants are general rules, not claim restatements (A3)", flagged.join("; "));
}

// ---------------------------------------------------------------------------
// Orchestration
// ---------------------------------------------------------------------------

/**
 * Run every structural check against a ledger.
 * @param {string} content Raw claims.md contents.
 * @param {{ledgerPath?: string, deckPath?: string|null}} opts Paths for the
 *   ordering check; omit to have ordering reported as unverified.
 * @returns {{checks: Array, passed: number, failed: number, warned: number}}
 */
function runChecks(content, opts = {}) {
  results.length = 0;
  const { sections, malformedIds } = parseLedger(content);

  const claims = entriesOf(sections, SECTION_HEADINGS.claims, ID_PREFIX.claim).filter(([id]) => ENTRY_ID_RE.test(id));
  const evidence = entriesOf(sections, SECTION_HEADINGS.evidence, ID_PREFIX.evidence).filter(([id]) => ENTRY_ID_RE.test(id));
  const assumptions = entriesOf(sections, SECTION_HEADINGS.assumptions, ID_PREFIX.assumption).filter(([id]) => ENTRY_ID_RE.test(id));
  const rebuttals = entriesOf(sections, SECTION_HEADINGS.rebuttals, ID_PREFIX.rebuttal).filter(([id]) => ENTRY_ID_RE.test(id));

  const basis = (sectionFields(sections, SECTION_HEADINGS.triage)["evidence-basis"] || "").toLowerCase();
  const qualitative = QUALITATIVE_BASES.has(basis);

  checkSections(sections);
  checkEntryIds(malformedIds);
  checkBeliefDelta(sections);
  checkTriage(sections);
  checkPreregistrationFields(sections);
  checkCommitmentOrdering(opts.ledgerPath, opts.deckPath);
  checkClaimCount(claims);
  checkClaimFields(claims);
  checkEvidenceFields(evidence);
  checkGrades(claims);
  checkVerbPermissions(claims);
  checkCounterfactuals(claims);
  checkFalsifiers(claims, qualitative);
  checkProbabilities(claims);
  checkSettlements(claims);
  checkBannedHedges(content);
  checkReferenceClosure(claims, evidence, assumptions, rebuttals);
  checkAssumptions(assumptions);
  checkRebuttals(rebuttals);
  checkTierCardinality(sections, assumptions, rebuttals);
  checkWarrantTautology(claims);

  const checks = results.slice();
  return {
    checks,
    passed: checks.filter((c) => c.status === "pass").length,
    warned: checks.filter((c) => c.status === "warn").length,
    failed: checks.filter((c) => c.status === "fail").length,
  };
}

function formatHuman(res, filePath) {
  const lines = [`=== Claim Ledger check: ${filePath} ===`, ""];
  for (const c of res.checks) {
    const tag = c.status === "pass" ? "  PASS" : c.status === "warn" ? "  WARN" : "  FAIL";
    lines.push(`${tag}: ${c.label}`);
    if (c.detail) lines.push(`        ${c.detail}`);
  }
  lines.push("");
  const parts = [`${res.passed} passed`];
  if (res.warned) parts.push(`${res.warned} warned`);
  parts.push(`${res.failed} failed`);
  lines.push(`=== Results: ${parts.join(", ")} ===`);
  lines.push("Form only. It cannot tell whether the claim is sharp, whether the pillars carry");
  lines.push("weight, or whether an exhibit reveals anything. A clean run means nothing was caught.");
  return lines.join("\n");
}

function main(argv) {
  let jsonOut = false;
  let deckPath = null;
  const positional = [];

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--json") jsonOut = true;
    else if (arg === "--deck") { deckPath = argv[++i] || null; if (!deckPath) { console.error("check-claim-ledger: --deck requires a path"); return 2; } }
    else if (arg === "--help" || arg === "-h") {
      console.log("Usage: node check-claim-ledger.js <claims.md> [--deck <file>] [--json]");
      console.log("");
      console.log("Structural checker for a Claim Ledger. 22 checks.");
      console.log("");
      console.log("Serving the objective: belief delta present with an actionable will-do,");
      console.log("a real shift rather than a restatement, a sharpness trail per claim,");
      console.log("and a declared comparison baseline per exhibit.");
      console.log("");
      console.log("Serving the constraint: sections, entry IDs, triage, pre-registration,");
      console.log("commitment ordering, claim and evidence fields, grades, verb permission,");
      console.log("counterfactuals, falsifiers, probability band/range agreement, settlement");
      console.log("triples, banned hedges, reference closure, assumptions, rebuttals, tier");
      console.log("cardinality, warrants.");
      console.log("");
      console.log("  --deck <file>  Compare mtimes to test G1 commitment ordering.");
      console.log("                 Without it, ordering is reported UNVERIFIED, never passed.");
      console.log("");
      console.log("Checks FORM ONLY. A clean run means nothing was caught, not that");
      console.log("the architecture is excellent. See the header comment for limits.");
      console.log("");
      console.log("Exit codes: 0=all pass, 1=at least one fail, 2=usage, 5=file not found");
      return 0;
    } else if (!arg.startsWith("-")) positional.push(arg);
    else { console.error(`check-claim-ledger: unknown flag: ${arg}`); return 2; }
  }

  if (positional.length < 1) {
    console.error("Usage: node check-claim-ledger.js <claims.md> [--deck <file>] [--json]");
    return 2;
  }

  const filePath = path.resolve(positional[0]);
  if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
    const msg = `ledger file not found: ${filePath}`;
    if (jsonOut) console.log(JSON.stringify({ error: msg, exit_code: 5 }));
    else console.error(`check-claim-ledger: ${msg}`);
    return 5;
  }

  const content = fs.readFileSync(filePath, "utf-8");
  const res = runChecks(content, { ledgerPath: filePath, deckPath: deckPath ? path.resolve(deckPath) : null });

  if (jsonOut) console.log(JSON.stringify({ file: filePath, ...res, exit_code: res.failed > 0 ? 1 : 0 }, null, 2));
  else console.log(formatHuman(res, filePath));

  return res.failed > 0 ? 1 : 0;
}

if (require.main === module) {
  process.exit(main(process.argv.slice(2)));
}

module.exports = { runChecks, parseLedger };
