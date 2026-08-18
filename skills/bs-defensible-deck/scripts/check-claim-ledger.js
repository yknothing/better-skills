#!/usr/bin/env node
// Structural checker for a Claim Ledger (claims.md) — the machine-enforceable
// subset of the bs-defensible-deck gates.
//
// Slides cannot be mechanically checked; a structured ledger can. This script
// exists so the hard gates in references/review-protocol.md are enforced by a
// program rather than by the author's good intentions.
//
// It verifies FORM ONLY: presence, format, ordering, and reference closure.
// It cannot judge whether an argument is correct. Passing this checker is a
// precondition for human adversarial review, never a substitute for it.
//
// Usage:
//   node scripts/check-claim-ledger.js <path/to/claims.md>
//   node scripts/check-claim-ledger.js <path/to/claims.md> --json
//
// Exit codes: 0=all pass, 1=at least one fail, 2=usage error, 5=file not found
"use strict";

const fs = require("fs");
const path = require("path");

// ---------------------------------------------------------------------------
// Constants — every threshold and vocabulary lives here with its rationale.
// No literal thresholds appear below this block.
// ---------------------------------------------------------------------------

/** Claim count bounds. Upper bound from the Claim Statement field spec
 *  (references/review-protocol.md, gate G2): more than three core claims means
 *  the author has not decided what the deck is asking for. */
const CLAIM_COUNT_MIN = 1;
const CLAIM_COUNT_MAX = 3;

/** Causal evidence ladder. Order matters — index is the grade's strength.
 *  Defined in references/argument-architecture.md. */
const GRADES = ["T0", "T1", "T2", "T3", "T4", "T5"];

/** Minimum grade that licenses each causal verb family. A verb found in a
 *  claim whose grade sits below its threshold is a wording violation. */
const VERB_PERMISSIONS = [
  { pattern: /\b(caused|causes|causal effect)\b/i, minGrade: "T4" },
  { pattern: /\b(contributed|attributable to)\b/i, minGrade: "T3" },
  { pattern: /\b(drove|drives|driven by|led to|delivered|unlocked|enabled|powered)\b/i, minGrade: "T3" },
  // Nominalised forms smuggle the same causal claim past a verb-only scan
  // ("a large improvement in retention" asserts as much as "improved").
  { pattern: /\b(improved|increased|reduced|boosted|lifted|improvement|reduction|uplift)\b/i, minGrade: "T2" },
  { pattern: /\b(proves|proven|guarantees)\b/i, minGrade: "T5" },
];

/** Grade at or above which a written counterfactual is mandatory.
 *  Rationale: T3 is the first grade making an interventional claim, so the
 *  "without X, Y would have been Z" sentence must exist. */
const COUNTERFACTUAL_MIN_GRADE = "T3";

/** Probability bands (ICD 203). A probability statement must name one band and
 *  carry a numeric range; anything else is a tone of voice, not a probability. */
const PROBABILITY_BANDS = [
  "almost no chance", "very unlikely", "unlikely", "roughly even chance",
  "likely", "very likely", "almost certain",
];

/** Vague quantifiers banned outright — they transmit almost no information
 *  (Sherman Kent's finding on "serious possibility"). */
const BANNED_HEDGES = [
  "possibly", "hopefully", "cannot be ruled out", "can't be ruled out",
  "expected to be good", "fairly confident", "quite likely", "should be fine",
];

/** A settlement triple is date | source | rule. Three parts, pipe-separated. */
const SETTLEMENT_PART_COUNT = 3;

/** A signpost carries metric | threshold | cadence | source | owner | action.
 *  From RAND assumption-based planning; see references/argument-architecture.md. */
const SIGNPOST_PART_COUNT = 6;

/** Review tiers, set by decision reversibility and reviewer incentive. */
const TIERS = ["L0", "L1", "L2", "L3"];
const PACING_MODES = ["speaker-paced", "reader-paced"];

/** Warrant-tautology heuristic. A warrant restating the claim in different
 *  words is not a warrant. Measured as content-word overlap between warrant
 *  and claim; above this share the warrant is flagged for the negation test.
 *  Heuristic, not a proof — hence a warning rather than a failure. */
const WARRANT_OVERLAP_WARN_RATIO = 0.6;
const WARRANT_MIN_CONTENT_WORDS = 4;

/** Words carrying no discriminating content for the overlap heuristic. */
const STOPWORDS = new Set([
  "the", "a", "an", "and", "or", "of", "to", "in", "on", "for", "by", "with",
  "is", "are", "was", "were", "be", "been", "that", "this", "these", "those",
  "it", "its", "as", "at", "from", "will", "would", "than", "then", "we", "our",
]);

/** ISO-8601 date, optionally with a time component. */
const ISO_DATE_RE = /\d{4}-\d{2}-\d{2}/;
const NUMBER_RE = /-?\d+(?:[.,]\d+)?%?/;

/** Falsifier must name a data source. We accept "via <something>" as the
 *  source marker, matching the fixed prohibition sentence form in
 *  references/review-protocol.md. */
const FALSIFIER_SOURCE_RE = /\bvia\s+\S+/i;

const SECTION_HEADINGS = {
  triage: "triage",
  prereg: "pre-registration",
  claims: "claims",
  evidence: "evidence",
  assumptions: "assumptions",
  rebuttals: "rebuttals",
};

const REQUIRED_TRIAGE_FIELDS = ["pacing", "tier", "product"];
const REQUIRED_PREREG_FIELDS = [
  "registered-at", "data-freeze", "decision-request",
  "strongest-counter", "would-change-mind",
];
const REQUIRED_CLAIM_FIELDS = [
  "claim", "grade", "warrant", "evidence", "falsifier", "probability", "settlement",
];
const REQUIRED_ASSUMPTION_FIELDS = [
  "assumption", "current", "switching-point", "signpost",
];
const REQUIRED_REBUTTAL_FIELDS = ["rebuttal", "response"];

const ID_PREFIX = { claim: "C", evidence: "E", assumption: "A", rebuttal: "R" };

// ---------------------------------------------------------------------------
// Parser — markdown with `## Section` / `### ID` / `- field: value` structure.
// ---------------------------------------------------------------------------

/**
 * Parse a Claim Ledger markdown file into sections of ID-keyed field maps.
 * @param {string} content Raw file contents.
 * @returns {{sections: Object<string, Object>, flat: Object<string,string>}}
 *   `sections` maps a lowercased section name to its entries; entries are
 *   keyed by the `### ID` heading, or by `_` for section-level fields.
 */
function parseLedger(content) {
  const sections = {};
  let currentSection = null;
  let currentEntry = null;

  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();

    const h2 = line.match(/^##\s+(.+)$/);
    if (h2 && !line.startsWith("###")) {
      currentSection = h2[1].trim().toLowerCase();
      sections[currentSection] = sections[currentSection] || {};
      currentEntry = "_";
      sections[currentSection]._ = sections[currentSection]._ || {};
      continue;
    }

    const h3 = line.match(/^###\s+(.+)$/);
    if (h3 && currentSection) {
      currentEntry = h3[1].trim();
      sections[currentSection][currentEntry] = {};
      continue;
    }

    const field = line.match(/^[-*]\s+([a-zA-Z][a-zA-Z0-9-]*)\s*:\s*(.*)$/);
    if (field && currentSection && currentEntry !== null) {
      const bucket = sections[currentSection][currentEntry];
      if (bucket) bucket[field[1].toLowerCase()] = field[2].trim();
    }
  }

  return sections;
}

/** Entries of a section excluding the section-level `_` bucket. */
function entriesOf(sections, sectionName) {
  const sec = sections[sectionName];
  if (!sec) return [];
  return Object.keys(sec).filter((k) => k !== "_").map((id) => [id, sec[id]]);
}

/** Section-level fields (those written before any `###` heading). */
function sectionFields(sections, sectionName) {
  return (sections[sectionName] && sections[sectionName]._) || {};
}

/** Extract every `C1`, `E2`, `A3`, `R4`-style ID mentioned in a string. */
function extractIds(value, prefix) {
  if (!value) return [];
  const re = new RegExp(`\\b${prefix}\\d+\\b`, "g");
  return value.match(re) || [];
}

/** Content words of a sentence, lowercased, stopwords removed. */
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

// ---------------------------------------------------------------------------
// Result helpers
// ---------------------------------------------------------------------------

const results = [];
function pass(label, detail) { results.push({ status: "pass", label, detail: detail || "" }); }
function fail(label, detail) { results.push({ status: "fail", label, detail: detail || "" }); }
function warn(label, detail) { results.push({ status: "warn", label, detail: detail || "" }); }

/** Record pass when `problems` is empty, otherwise fail with the joined list. */
function verdict(label, problems, okDetail) {
  if (problems.length === 0) pass(label, okDetail);
  else fail(label, problems.join("; "));
}

// ---------------------------------------------------------------------------
// Checks
// ---------------------------------------------------------------------------

/** Check 1: required sections are present. */
function checkSections(sections) {
  const missing = Object.values(SECTION_HEADINGS).filter((s) => !sections[s]);
  verdict("Required sections present", missing.length ? [`missing: ${missing.join(", ")}`] : [],
    `${Object.keys(SECTION_HEADINGS).length} sections found`);
}

/** Check 2: triage block is complete and uses legal enum values (Phase 0). */
function checkTriage(sections) {
  const f = sectionFields(sections, SECTION_HEADINGS.triage);
  const problems = REQUIRED_TRIAGE_FIELDS.filter((k) => !f[k]).map((k) => `missing ${k}`);
  if (f.pacing && !PACING_MODES.includes(f.pacing.toLowerCase()))
    problems.push(`pacing must be one of ${PACING_MODES.join(" | ")}`);
  if (f.tier && !TIERS.includes(f.tier.toUpperCase()))
    problems.push(`tier must be one of ${TIERS.join(" | ")}`);
  verdict("Triage block complete (pacing, tier, product)", problems);
}

/** Check 3: pre-registration block is complete with a parseable timestamp (G1). */
function checkPreregistration(sections) {
  const f = sectionFields(sections, SECTION_HEADINGS.prereg);
  const problems = REQUIRED_PREREG_FIELDS.filter((k) => !f[k]).map((k) => `missing ${k}`);
  for (const dateField of ["registered-at", "data-freeze"]) {
    if (f[dateField] && !ISO_DATE_RE.test(f[dateField]))
      problems.push(`${dateField} must contain an ISO date (YYYY-MM-DD)`);
  }
  verdict("Pre-registration block complete (G1)", problems);
}

/** Check 4: claim count within bounds (G2). */
function checkClaimCount(claims) {
  const n = claims.length;
  if (n >= CLAIM_COUNT_MIN && n <= CLAIM_COUNT_MAX) {
    pass(`Core claim count within ${CLAIM_COUNT_MIN}-${CLAIM_COUNT_MAX} (actual: ${n})`);
  } else {
    fail(`Core claim count within ${CLAIM_COUNT_MIN}-${CLAIM_COUNT_MAX} (actual: ${n})`,
      n === 0 ? "no ### C<n> entries found under ## Claims" : "split or merge claims to fit the bound");
  }
}

/** Check 5: every claim carries all mandatory fields. */
function checkClaimFields(claims) {
  const problems = [];
  for (const [id, c] of claims) {
    for (const field of REQUIRED_CLAIM_FIELDS) {
      if (!c[field]) problems.push(`${id} missing ${field}`);
    }
  }
  verdict(`Every claim carries required fields (${REQUIRED_CLAIM_FIELDS.join(", ")})`, problems);
}

/** Check 6: grades are legal ladder values. */
function checkGrades(claims) {
  const problems = [];
  for (const [id, c] of claims) {
    if (c.grade && gradeIndex(c.grade) < 0)
      problems.push(`${id} grade "${c.grade}" not in ${GRADES.join("/")}`);
  }
  verdict("Evidence grades are valid ladder values", problems);
}

/** Check 7: causal verbs are licensed by the claim's evidence grade (Rule 3). */
function checkVerbPermissions(claims) {
  const problems = [];
  for (const [id, c] of claims) {
    const gi = gradeIndex(c.grade);
    if (gi < 0) continue;
    for (const rule of VERB_PERMISSIONS) {
      const hit = (c.claim || "").match(rule.pattern);
      if (hit && gi < gradeIndex(rule.minGrade)) {
        problems.push(`${id} uses "${hit[0]}" at ${c.grade.toUpperCase()} (needs ${rule.minGrade})`);
      }
    }
  }
  verdict("Causal verbs licensed by evidence grade", problems);
}

/** Check 8: interventional claims state their counterfactual. */
function checkCounterfactuals(claims) {
  const problems = [];
  for (const [id, c] of claims) {
    const gi = gradeIndex(c.grade);
    if (gi >= gradeIndex(COUNTERFACTUAL_MIN_GRADE) && !c.counterfactual)
      problems.push(`${id} is ${c.grade.toUpperCase()} but has no counterfactual field`);
  }
  verdict(`Counterfactual present for ${COUNTERFACTUAL_MIN_GRADE}+ claims`, problems);
}

/** Check 9: falsifiers carry threshold, date, and named source (G2). */
function checkFalsifiers(claims) {
  const problems = [];
  for (const [id, c] of claims) {
    const f = c.falsifier;
    if (!f) continue;
    if (!NUMBER_RE.test(f)) problems.push(`${id} falsifier has no numeric threshold`);
    if (!ISO_DATE_RE.test(f)) problems.push(`${id} falsifier has no date`);
    if (!FALSIFIER_SOURCE_RE.test(f)) problems.push(`${id} falsifier names no source (expected "via <source>")`);
  }
  verdict("Falsifiers carry threshold, date, and source (G2)", problems);
}

/** Check 10: probability statements use the band vocabulary with a range (G3). */
function checkProbabilities(claims) {
  const problems = [];
  for (const [id, c] of claims) {
    const p = (c.probability || "").toLowerCase().trim();
    if (!p) continue;
    // Match at the start rather than anywhere in the string: a substring test
    // would accept "quite likely", which is exactly the unbound phrasing the
    // band vocabulary exists to eliminate.
    if (!PROBABILITY_BANDS.some((b) => p.startsWith(b)))
      problems.push(`${id} probability must begin with an ICD-203 band`);
    if (!NUMBER_RE.test(p)) problems.push(`${id} probability has no numeric range`);
  }
  verdict("Probabilities use band vocabulary with numeric range (G3)", problems);
}

/** Check 11: every probability binds to a settlement triple (G3). */
function checkSettlements(claims) {
  const problems = [];
  for (const [id, c] of claims) {
    if (!c.settlement) continue;
    const parts = c.settlement.split("|").map((s) => s.trim()).filter(Boolean);
    if (parts.length !== SETTLEMENT_PART_COUNT)
      problems.push(`${id} settlement needs ${SETTLEMENT_PART_COUNT} pipe-separated parts (date | source | rule), found ${parts.length}`);
    else if (!ISO_DATE_RE.test(parts[0]))
      problems.push(`${id} settlement date is not an ISO date`);
  }
  verdict(`Settlement triples well-formed (G3)`, problems);
}

/** Check 12: banned vague hedges appear nowhere in the ledger (G3). */
function checkBannedHedges(content) {
  const lower = content.toLowerCase();
  const found = BANNED_HEDGES.filter((h) => lower.includes(h));
  verdict("No banned vague hedges (G3)", found.length ? [`found: ${found.join(", ")}`] : [],
    `${BANNED_HEDGES.length} banned phrases checked`);
}

/** Check 13: reference closure — no dangling refs, no orphan evidence (A2). */
function checkReferenceClosure(claims, evidence, assumptions) {
  const problems = [];
  const definedE = new Set(evidence.map(([id]) => id));
  const definedA = new Set(assumptions.map(([id]) => id));
  const referencedE = new Set();
  const referencedA = new Set();

  for (const [id, c] of claims) {
    const eRefs = extractIds(c.evidence, ID_PREFIX.evidence);
    if (eRefs.length === 0) problems.push(`${id} references no evidence`);
    for (const ref of eRefs) {
      referencedE.add(ref);
      if (!definedE.has(ref)) problems.push(`${id} references undefined ${ref}`);
    }
    for (const ref of extractIds(c.assumptions, ID_PREFIX.assumption)) {
      referencedA.add(ref);
      if (!definedA.has(ref)) problems.push(`${id} references undefined ${ref}`);
    }
  }

  for (const id of definedE) {
    if (!referencedE.has(id)) problems.push(`${id} is defined but never referenced (move to appendix)`);
  }
  for (const id of definedA) {
    if (!referencedA.has(id)) problems.push(`${id} is defined but never referenced by any claim`);
  }

  verdict("Reference closure: no dangling refs, no orphan evidence (A2)", problems);
}

/** Check 14: assumptions carry switching point and a six-part signpost (A5). */
function checkAssumptions(assumptions) {
  const problems = [];
  for (const [id, a] of assumptions) {
    for (const field of REQUIRED_ASSUMPTION_FIELDS) {
      if (!a[field]) problems.push(`${id} missing ${field}`);
    }
    if (a["switching-point"] && !NUMBER_RE.test(a["switching-point"]))
      problems.push(`${id} switching-point is not numeric`);
    if (a.signpost) {
      const parts = a.signpost.split("|").map((s) => s.trim()).filter(Boolean);
      if (parts.length !== SIGNPOST_PART_COUNT)
        problems.push(`${id} signpost needs ${SIGNPOST_PART_COUNT} parts (metric | threshold | cadence | source | owner | action), found ${parts.length}`);
    }
  }
  verdict(`Assumptions carry switching point and ${SIGNPOST_PART_COUNT}-part signpost (A5)`, problems);
}

/** Check 15: no naked rebuttals — each is paired with a response (Rule 8, A6). */
function checkRebuttals(rebuttals) {
  const problems = [];
  for (const [id, r] of rebuttals) {
    for (const field of REQUIRED_REBUTTAL_FIELDS) {
      if (!r[field]) problems.push(`${id} missing ${field} (naked rebuttal)`);
    }
  }
  verdict("No naked rebuttals — every rebuttal has a response (Rule 8)", problems);
}

/** Check 16: warrant is not a restatement of the claim (A3 negation test aid). */
function checkWarrantTautology(claims) {
  const flagged = [];
  for (const [id, c] of claims) {
    if (!c.warrant || !c.claim) continue;
    const wWords = contentWords(c.warrant);
    if (wWords.length < WARRANT_MIN_CONTENT_WORDS) {
      flagged.push(`${id} warrant is too short to be a general rule`);
      continue;
    }
    const cWords = new Set(contentWords(c.claim));
    const overlap = wWords.filter((w) => cWords.has(w)).length / wWords.length;
    if (overlap > WARRANT_OVERLAP_WARN_RATIO) {
      flagged.push(`${id} warrant overlaps claim by ${Math.round(overlap * 100)}% — run the negation test`);
    }
  }
  if (flagged.length === 0) pass("Warrants are general rules, not claim restatements (A3)");
  else warn("Warrants are general rules, not claim restatements (A3)", flagged.join("; "));
}

// ---------------------------------------------------------------------------
// Orchestration
// ---------------------------------------------------------------------------

/**
 * Run every structural check against a ledger file's contents.
 * @param {string} content Raw claims.md contents.
 * @returns {{checks: Array, passed: number, failed: number, warned: number}}
 */
function runChecks(content) {
  results.length = 0;
  const sections = parseLedger(content);

  const claims = entriesOf(sections, SECTION_HEADINGS.claims)
    .filter(([id]) => id.startsWith(ID_PREFIX.claim));
  const evidence = entriesOf(sections, SECTION_HEADINGS.evidence)
    .filter(([id]) => id.startsWith(ID_PREFIX.evidence));
  const assumptions = entriesOf(sections, SECTION_HEADINGS.assumptions)
    .filter(([id]) => id.startsWith(ID_PREFIX.assumption));
  const rebuttals = entriesOf(sections, SECTION_HEADINGS.rebuttals)
    .filter(([id]) => id.startsWith(ID_PREFIX.rebuttal));

  checkSections(sections);
  checkTriage(sections);
  checkPreregistration(sections);
  checkClaimCount(claims);
  checkClaimFields(claims);
  checkGrades(claims);
  checkVerbPermissions(claims);
  checkCounterfactuals(claims);
  checkFalsifiers(claims);
  checkProbabilities(claims);
  checkSettlements(claims);
  checkBannedHedges(content);
  checkReferenceClosure(claims, evidence, assumptions);
  checkAssumptions(assumptions);
  checkRebuttals(rebuttals);
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
  return lines.join("\n");
}

function main(argv) {
  let jsonOut = false;
  const positional = [];
  for (const arg of argv) {
    if (arg === "--json") jsonOut = true;
    else if (arg === "--help" || arg === "-h") {
      console.log("Usage: node check-claim-ledger.js <claims.md> [--json]");
      console.log("");
      console.log("Structural checker for a Claim Ledger. 16 checks: sections, triage,");
      console.log("pre-registration, claim fields, evidence grades, verb permission,");
      console.log("counterfactuals, falsifiers, probability bands, settlement triples,");
      console.log("banned hedges, reference closure, assumptions, rebuttals, warrants.");
      console.log("");
      console.log("Checks form only. Passing is a precondition for human review, not a");
      console.log("substitute for it.");
      console.log("");
      console.log("Exit codes: 0=all pass, 1=at least one fail, 2=usage, 5=file not found");
      return 0;
    } else if (!arg.startsWith("-")) positional.push(arg);
    else { console.error(`check-claim-ledger: unknown flag: ${arg}`); return 2; }
  }

  if (positional.length < 1) {
    console.error("Usage: node check-claim-ledger.js <claims.md> [--json]");
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
  const res = runChecks(content);

  if (jsonOut) console.log(JSON.stringify({ file: filePath, ...res, exit_code: res.failed > 0 ? 1 : 0 }, null, 2));
  else console.log(formatHuman(res, filePath));

  return res.failed > 0 ? 1 : 0;
}

if (require.main === module) {
  process.exit(main(process.argv.slice(2)));
}

module.exports = { runChecks, parseLedger };
