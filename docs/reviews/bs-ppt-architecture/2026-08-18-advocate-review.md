# Advocate Review: bs-ppt-architecture

**Date**: 2026-08-18
**Reviewer Role**: Advocate
**Skill**: bs-ppt-architecture
**HUMAN_VERIFIED**: false

## Executive Summary

The case for this skill rests on one move: it converts "be rigorous about your argument" from an instruction into a **file with named fields that a program reads**, and then makes the build order — ledger before pages — the thing that is gated. That is a real capability the no-skill baseline does not have, and the bundled checker plus its negative fixture make the claim verifiable rather than asserted. The value is concentrated: the claim ledger, the T0–T5 verb permission table, and Hard Rule 2 (self-exposure) carry most of it, while the L3 tier, the Recorder role, and the in-body `## Registration` section carry approximately none. I would ship it, with one blocking-quality caveat that is cheap to fix: the checker is tier-blind and never checks cardinality, so a legitimate L0 ledger fails it and a ledger with zero load-bearing assumptions passes it — both verified below.

## Dimension Scores

| Dimension | Score | Key Strength | Key Concern |
|-----------|------:|--------------|-------------|
| Clarity of trigger description | 9/10 | Names concrete venues (IC, board, due diligence, audit, peer review) and gives the routing predicate — "any reviewer with an incentive to reject it" — plus an explicit negative trigger ("Not for making slides look good") | Firing depends on the user disclosing that review is hostile. "Build the board deck for Thursday" carries no such signal and will not reliably route here |
| Hard rules / safety gates | 8/10 | Eight rules, each stating a mechanism rather than a preference; Rules 2, 3, 6 and 7 are individually falsifiable by a third party; two well-formed `<HARD-GATE id="...">` blocks | Rule 1's gate is enforced by a checker that cannot see ordering (it only format-validates `registered-at`), so a back-filled ledger satisfies it. Rule 6's independence is asserted but no bundled artefact detects a violation. No consolidated refusal ladder like `bs-requirements-engineering`'s |
| Workflow correctness | 8/10 | Phase order *is* the substantive claim and the ordering is right; every phase has a stated exit condition; Phase 7 has an attempt cap (5) with a defined escalation | Phase 4 is called "Render" but explicitly does not render — the actual rendering is handed to `pptx`. The L0/L1 branch of Phase 0 is correct advice that the tooling then contradicts |
| Pattern application | 7/10 | All seven declared patterns are genuinely instantiated and locatable in the body, not decorative; `validate.sh` resolves 7/7 | Three attributions contradict `docs/patterns/README.md`: `verification-rules` is Vercel not Superpowers, `named-anti-patterns` is Taste Skill not Superpowers, `format-significance-gates` is Anthropic not CE; `multi-perspective-review` drops Gstack |
| Test prompt coverage | 8/10 | Happy / edge / adversarial, each with an explicit `failure_mode_without_skill`, mirrored field-for-field in `evaluation/datasets/batch-1-test-prompts.json` | Prompt 2's delta over the baseline is thin (see below). Nothing exercises the two most likely real-world misfires: the L0 downgrade, and the case where the user supplies no data at all |
| Bundled resources | 8/10 | A working checker, four references with correct parent breadcrumbs, and — rare in this repo — a *negative* fixture that catalogues 15 violation types and is a genuine regression test | No L0 fixture, so the only worked example is the heaviest tier. The checker passes vacuously on an empty assumptions section |
| Maintainability | 9/10 | Every threshold and vocabulary sits in one commented constants block with its rationale; `module.exports = { runChecks, parseLedger }` makes it testable; the format contract is documented in the fixture header where a user will actually see it | No automated test invokes the fixtures — they are regression tests only if someone remembers to run them. The verb-permission regexes are a curation surface that will drift |
| Production readiness | 8/10 | Gate 1 passes 16/16; both fixtures behave exactly as documented; degradation table covers the five capabilities the workflow actually depends on | The tier-blindness defect will hit the first real L0/L1 user, which is the population most likely to try the skill first |

**Total: 65/80.**

## Baseline delta, per test prompt

The honest test is not "is this good advice" but "what changes." I assessed each prompt against what a competent frontier agent produces unaided.

### Prompt 1 — hostile investment committee (largest delta, but narrower than the skill implies)

**Baseline output**: a 15–20 page structure — executive summary, network constraints, proposal, unit economics with NPV/IRR, an alternatives slide, "Risks and mitigations," the ask. Because the prompt explicitly says the CFO has opposed this since spring, a good baseline agent *will* add a slide addressing the CFO's position; that behaviour is prompted, not skill-derived. It will also invent illustrative numbers, because none were supplied.

**What the skill actually changes**, in descending order of confidence:

1. Pages do not get written first. Nothing in baseline behaviour produces a pre-registration artefact, and this is the change with the largest downstream effect — thresholds and causal verbs get chosen before the author knows which data flatters them.
2. Verb licensing. The baseline writes "the pilot drove a 9% reduction" from a before/after with no control without hesitation; the skill forces "changed during the period" at T2 and the checker catches it (verified: `C2 uses "drove" at T2 (needs T3)`).
3. Switching point plus safety margin replaces ±10% sensitivity. This is a substantive analytic difference, not a formatting one — margin is third-party recomputable, ±10% bands are author-chosen.
4. Falsifier with numeric threshold, date, and named source per claim. Baseline agents produce "we'll monitor closely."
5. Concession count as a reported metric, with zero treated as a failure. Genuinely absent from baseline behaviour.

**Where the delta is smaller than claimed**: the SKILL's stated no-skill failure mode ("generic risks page, unlabelled causal verbs, charts lacking denominators") is accurate, but a single sentence appended to the prompt — "include a falsifier and a switching point for each claim" — recovers maybe half of items 2–4 without any of the protocol. The skill's marginal value over a well-prompted baseline is the *ordering* and the *artefact*, not the individual analytic techniques. Also worth stating plainly: with no data attached to this prompt, the correct output under this skill is a ledger scaffold plus a data request, not a deck. That is the right behaviour and the Boundaries section says so, but it is a different deliverable than the user asked for.

### Prompt 2 — reader-paced material (smallest delta; I would not defend this one hard)

**Baseline output**: told "circulated by email, there's no meeting," a competent agent already produces denser, more self-contained pages and frequently says so unprompted. Q1 of Phase 0 is answered *by the prompt itself*; the skill adds discipline in stating it, not discrimination in deriving it.

**The real delta on this prompt is elsewhere in Phase 0**: Q2 correctly routes this to L0/L1 (regional heads, no irreversible commitment, no stated opposing interest), which means the skill's contribution here is telling the agent to do *less* — an over-engineering guard. And Q3's product taxonomy (persuasion / archival / coverage-proof / compliance) is a distinction baseline agents essentially never draw and which does change the deliverable. Both are worth having. Neither is what the test prompt claims to be testing. The prompt as written mostly validates a behaviour the baseline already exhibits.

### Prompt 3 — skip the ledger, drop the churn page (clearest delta, unambiguous)

**Baseline output**: compliance, on both requests. "We can handle it if someone asks" is a plausible-sounding rationale and there is no competing instruction; the agent removes the page. Some frontier models will register a soft "you may want to keep this," then comply.

**What the skill changes**: Rule 2 supplies a reason the agent can state that is not moralising — a reviewer who finds the churn number unprompted prices it as concealment, so removal *increases* risk rather than reducing it. The attack catalogue's drawer-problem entry and concealment-signal list turn that from an opinion into a named, checkable failure mode. And the escape hatch is well designed: if the user insists, the removal is recorded as an accepted gate failure rather than silently absorbed. This is the prompt where the skill is doing work no prompt-engineering shortcut replicates.

## Which mechanism carries the value

Ranked by how much output actually changes if you delete the mechanism and keep everything else:

1. **The claim ledger as a parseable artefact** (`assets/claims.example.md` plus the format contract). Everything else in the skill is advice until there is a file with fields. This is also what makes the build-order rule enforceable at all.
2. **Hard Rule 2 (self-exposure) with the concealment-signals and fake-defences tables.** The highest density of genuinely non-obvious content in the bundle, and the only mechanism that changes behaviour on prompt 3. "Uniform ±10% sensitivity tests the parameters the author chose" is the kind of line that redirects an agent mid-draft.
3. **The T0–T5 verb permission table.** Best value per line in the skill: one table, mechanically checkable, aimed at the single most common overreach in analytical writing, and actually enforced by the checker including nominalised forms ("improvement", "uplift") that a verb-only scan would miss.
4. **Phase 0 tiering.** What makes the skill adoptable rather than a thing people avoid invoking. The decision rule — irreversible AND opposing interest ⇒ at least L2, otherwise the full protocol is over-engineering — is stated crisply enough to be followed. Undercut by tooling, see below.
5. **Falsifier form and switching-point analysis.** Real analytic value, but heavily dependent on data the agent frequently does not have, at which point they degrade into well-formed placeholders that pass the checker.
6. **Phase 5 independent attack.** High value in principle and the diagnosis (assigned devil's advocacy produces bolstering) is correct. Discounted because independence is unverifiable by anything in the bundle and depends on sub-agent dispatch; the honest fallback is documented, but a degraded pass is much weaker than the protocol implies.
7. **`references/attack-catalog.md`.** An excellent, well-organised checklist whose value is recall and completeness rather than novelty — a strong model asked to attack a deck generates approximations of perhaps two-thirds of it. The three-question budget and the fake-defence inventory are the parts that are hard to reproduce.
8. **The 7-phase scaffold itself.** Mostly a container for 1–7. Useful sequencing, modest independent value.

### Ballast

- **`## Registration`** (SKILL.md, final section). Duplicates `skills.json` verbatim, is the only such section across all ten skills in the repo, and argues a batch-placement decision to an audience — the agent at load time — that cannot act on it. Pure context cost. Move to `skills.json` notes or a docs file.
- **L3's external adjudicator, published calibration log, and settlement-date retrospective.** Aspirational. No team reachable by this repo will staff an external adjudicator, and nothing in the bundle supports a calibration log. It costs little to leave in, but it should not be counted as a delivered capability.
- **The Recorder role** in `review-protocol.md` (artefact hashes, timestamp ledger, ordering verification). Described as something "which may be a script"; no such script exists, and its absence is exactly why G1 is unenforced. Either build it or stop describing it as part of the protocol.
- **Roughly half the Red Flags table.** Eleven rows against eight hard rules with substantial restatement. Not worthless — the "user is in a hurry, use the light tier" row and the HARKing framing add something the rules do not — but it is the section to cut first if the body ever needs to shrink.

## Verification of the checker's stated claims

I ran the checker independently. Both stated results hold exactly.

**Compliant fixture** — `node scripts/check-claim-ledger.js assets/claims.example.md`:

```
=== Results: 16 passed, 0 failed ===
EXIT=0
```

All 16 named checks reported PASS, including the warrant-tautology heuristic.

**Non-compliant fixture** — `node scripts/check-claim-ledger.js assets/claims.noncompliant-example.md`:

```
=== Results: 3 passed, 1 warned, 12 failed ===
EXIT=1
```

The failures are specific and correctly attributed, not generic. A representative sample of the actual output:

```
  FAIL: Causal verbs licensed by evidence grade
        C1 uses "caused" at T1 (needs T4); C1 uses "improvement" at T1 (needs T2);
        C2 uses "drove" at T2 (needs T3); C4 uses "proves" at T3 (needs T5)
  FAIL: Reference closure: no dangling refs, no orphan evidence (A2)
        C1 references undefined E9; E5 is defined but never referenced (move to appendix);
        A1 is defined but never referenced by any claim
  WARN: Warrants are general rules, not claim restatements (A3)
        C1 warrant overlaps claim by 70% — run the negation test; C2 warrant is too short
```

Two things deserve credit here. The nominalisation catch (`"improvement" at T1`) means the verb scan is not trivially evadable by rewriting "improved" as "an improvement in". And the warrant heuristic is correctly graded as WARN rather than FAIL, with the script's own comment acknowledging it is a heuristic — the skill does not overclaim what a regex can establish.

**Two defects I found that the fixtures do not cover.** Both trace to a single root cause: the checker never checks section cardinality and does not know what tier it is checking.

*A legitimate L0 ledger fails.* I wrote a minimal, honest L0 ledger — reader-paced, reversible team decision, one T2 claim with a well-formed falsifier, settlement triple, and one evidence entry, with no load-bearing assumptions and no rebuttals, which is exactly what Phase 0 says L0 requires ("Falsifiers (G2) and probability discipline (G3) only"):

```
  FAIL: Required sections present
        missing: assumptions, rebuttals
=== Results: 15 passed, 1 failed ===
EXIT=1
```

Since the Phase 1 HARD-GATE says no slide may be drafted until the checker "reports zero errors", an L0 user is blocked by a gate the skill's own tier table says does not apply to them. The workaround is two empty headings, which I confirmed produces `16 passed, 0 failed` — but it is undocumented, and a user who does not guess it will conclude either that the tool is broken or that L0 is not really supported.

*A ledger with zero load-bearing assumptions passes cleanly.* Taking the compliant fixture, deleting both assumption entries and both rebuttal entries, and removing the corresponding references, yields:

```
  PASS: Assumptions carry switching point and 6-part signpost (A5)
  PASS: No naked rebuttals — every rebuttal has a response (Rule 8)
=== Results: 16 passed, 0 failed ===
EXIT=0
```

Checks A5 and Rule 8 pass vacuously. So the skill's most distinctive analytic requirement — the switching point, ranked #5 in my value list and the thing that distinguishes this from generic "add a risks slide" advice — is the one requirement an author can drop entirely while collecting a clean 16/16. The checker enforces "assumptions that exist are well-formed", never "at least one exists".

Separately, and inherently rather than as a bug: the checker cannot see ordering. `checkPreregistration` only tests that `registered-at` matches `/\d{4}-\d{2}-\d{2}/`. G1 as written in `review-protocol.md` requires the Claim Statement's recorded time to precede the first deck version's; the check labelled `(G1)` does not verify that and cannot. The skill is candid about this class of limitation in `architecture.md` ("Automated checks falsify form, they never certify quality"), so this is a labelling over-reach rather than a deception — but Rule 1 is the skill's headline mechanism, and its gate is honour-system.

## Boundary clarity

**Against `pptx` (external, rendering): clean.** The Boundaries section hands off file generation explicitly, and nothing in the seven phases produces a `.pptx`. The one friction point is naming: Phase 4 is titled "Render" and does not render. A user scanning the phase list will reasonably expect it to produce the file. "Compose pages" would remove the collision at zero cost.

**Against `bs-visual-design`: mostly clean, with one genuine overlap.** The prose separation is stated in three places and is conceptually right — reception versus survival. But `references/exhibits.md`'s manipulation red lines include "Colour implying value — is a neutral variable rendered in red/green? Is ordered data using a categorical palette? Compare against Bertin's visual-variable hierarchy and the ColorBrewer palette types", while `bs-visual-design`'s Phase 5 imagery reference owns "data visualization (chart palette, axis style, number formatting)" and its QA item 9.6 checks "data visualizations use the declared chart palette, not a library default." A user building a chart under both skills has palette-semantics rules in two files and no stated precedence. The overlap is narrow and each file declares its scope — `exhibits.md` opens with "Not visual craft — see `bs-visual-design`" — but the sequential-versus-categorical palette rule genuinely sits in both. One sentence naming which skill wins on chart encoding would close it.

**Against `bs-requirements-engineering`: no overlap.** Different point in the lifecycle. The two do share a "user asks to skip a step" scenario and handle it at very different levels of ceremony, which is a convention observation rather than a conflict — see below.

## Compliance with repository conventions

Gate 1 passes cleanly: `bash tools/validate.sh skills/bs-ppt-architecture/` reports **16 passed, 0 failed**, including pattern-reference resolution (7/7), gate-syntax conformance (2 well-formed tags), bundled-resource existence (7/7), and frontmatter schema conformance. Against the conventions visible in sibling skills:

- **Frontmatter shape and tier**: matches `bs-visual-design` and `bs-requirements-engineering` exactly, including the `# tier: deep` comment form. `CLAUDE.md` notes a structured tier field arrives in Phase 1.B; the comment is the current house convention and the skill follows it rather than inventing something.
- **Hard-gate syntax**: uses `<HARD-GATE id="preregistration-before-pages">`. `bs-visual-design` uses `label="..."` and bare tags. The validator accepts all three, and `id` is arguably the better choice, but the repo now has three spellings of one construct.
- **Progressive disclosure**: 3,213 words in the body against a 5,000 cap, with each of the four references gated behind a "Required reading" line at the phase that needs it, and correct `<!-- Parent skill: ... -->` / `<!-- Open this file when: ... -->` breadcrumbs matching `bs-visual-design/references/motion.md`. This is the cleanest progressive-disclosure implementation in the repo.
- **Test prompts**: three, happy/edge/adversarial, mirrored in the eval dataset with `expected_behavior` and `failure_mode_without_skill` populated — schema-conformant with the other entries.
- **Pattern attribution**: the weakest compliance area. Three of seven source attributions disagree with `docs/patterns/README.md` (detailed in the scores table). `validate.sh` only checks that pattern *names* resolve, so this passes Gate 1 while being wrong, and Gate 3 (Pattern Alignment) will need to catch it. `bs-first-customer-finder` gets these right, so the convention is established and followed elsewhere. Separately, the index's "used by" column does not list `bs-ppt-architecture` — that is index staleness affecting new skills generally, not this skill's defect.
- **`## Registration` section**: no other SKILL.md has one. Divergence, and unnecessary — see Ballast.
- **Refusal handling**: `bs-requirements-engineering` has a named three-step Refusal Protocol plus a cumulative-skip escalation threshold. This skill's equivalent is distributed across Rule 1, Rule 2, and the Phase 1 gate text, with the de-escalation ladder appearing only in the test-prompt expectations. The behaviour is right; the packaging is less discoverable than the established house pattern.

## Adoptability

Would a real team use this? At L2/L3, in the venues named in the description, yes — but the adopting unit is one analyst who wants to not get destroyed at an IC, not a team adopting a process. The skill is realistic about this: `review-protocol.md` states plainly that the organisational cost is the binding constraint, "since it needs an attacker whose evaluation is not tied to approval — which in a small team frequently does not exist." That candour is worth more to adoption than any amount of advocacy would be.

**The smallest useful subset** is three things, none of which need tooling, a sub-agent, or a rework cycle:

1. Rule 3, verb permission — write "changed during the period" unless you have a control.
2. Rule 5, exhibit self-sufficiency — n, denominator, window, definition, baseline, uncertainty type, source on the exhibit.
3. One falsifier per core claim in the fixed form: date, named source, metric, comparator, numeric threshold.

Those three hit the three questions the attack catalogue itself identifies as dominating a reviewer's budget, and they are perhaps twenty minutes of work on an existing deck.

**Does the skill make that subset discoverable?** Partly. The L0–L3 table is in Phase 0, early and prominent, and the decision rule is stated crisply — that is much better than burying it. But three things work against it. The L0 row points at gate IDs (G2, G3) that live in a reference file the L0 user has no other reason to open. The only worked fixture is a full L2 ledger, so the lightweight user must subtract rather than start small. And as verified above, an honest L0 ledger fails the checker. The tiering is discoverable as *advice* and undelivered as *a path*. That gap is the difference between a skill people cite and a skill people run.

## Strongest Aspect

The single best design move is making **build order** the gated thing, and then backing that gate with a machine-readable artefact rather than an instruction. Every other treatment of this problem I can point to — "consider counter-arguments", "add a risks slide", "steelman the opposition" — asks the author to do more thinking at a moment when their reasoning is already committed to the conclusion, which is precisely when thinking is least reliable. This skill instead requires that the falsifier, the threshold, and the causal verb be written down *before the data has been looked at*, and it stakes the claim on the right evidence: the Registered Reports comparison in `review-protocol.md` (96% of standard psychology articles report support for their first hypothesis versus 44% of Registered Reports) isolates exactly the variable the skill manipulates, since what differs between those literatures is the moment of commitment rather than researcher honesty. The ledger is what makes the ordering checkable at all — you cannot audit the sequence of a thought, but you can audit the sequence of two files. That single structural choice is what separates this from a well-written essay about intellectual honesty.

## One Improvement

**Make the checker tier-aware, with per-tier minimum cardinality, and ship an L0 fixture.** Add a `--tier L0|L1|L2|L3` flag (defaulting to the `tier:` field already parsed out of the Triage block, so most users never pass it) that does two things. First, it scopes which checks run: at L0 the assumptions and rebuttals sections are not required and their absence is not a failure — this removes the contradiction where the skill's own tier table exempts a user from gates that the Phase 1 HARD-GATE then blocks them on. Second, and more importantly, it introduces minimum counts where the tier demands them: at L2 and above, at least one assumption with a switching point and at least one rebuttal with a response. Right now the checker verifies that assumptions are *well-formed* but never that any *exist*, so an L2 ledger with the entire Assumptions section deleted collects a clean 16/16 — I verified this. That is the one bypass that lets an author skip the skill's most distinctive analytic requirement while displaying a green result, which is worse than no check at all, because the green result is quotable. Pair the flag with `assets/claims.l0-example.md`: a six-field ledger that passes at L0, giving the lightweight adopter something to copy rather than something to subtract from. This is contained work in one script plus one fixture, and it converts the tiering from stated policy into an executable path.

## Verdict

**Verdict**: PASS (65/80)

Ship it. The skill delivers a capability the baseline does not have — a pre-committed, machine-checked argument artefact and an inverted build order — and it delivers it with unusual intellectual honesty, including four named limits in `architecture.md`, an explicit statement that automated checks falsify form and never certify quality, and a frank admission that the organisational precondition for the attacker role often does not exist. The verification held up: both fixtures behave exactly as documented, Gate 1 passes 16/16, and the failure messages are specific enough to act on. What holds the score at 65 rather than higher is that the tooling contradicts the tiering in two verified ways, and that the one bypass I found lets an author drop switching-point analysis while showing a clean pass. Both are fixed by the single change above. The pattern attributions should be corrected before Gate 3, and the `## Registration` section should come out of the body. None of that is load-bearing enough to withhold approval from a skill whose central mechanism is sound and whose weakest points it mostly names itself.
