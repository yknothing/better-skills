# Advocate Review: bs-uml-master

**Date**: 2026-08-31
**Reviewer Role**: Advocate
**Skill**: bs-uml-master
**HUMAN_VERIFIED**: false
**Scope Contract Version**: 1
**Reviewed Revision**: 16a1ae4179a842b1e2ad0c8e0f4a62aad14ace22
**Reviewed Skill SHA-256**: 2f3322de034c9ee6ca0bb5e1326274b04845f90a04895b79c7c74e1cbe0bc263
**Reviewed Manifest SHA-256**: 9c70b77340b4f981fc26fa80e1777ab6182ccf21a8df5fc449b153379ffeab93

## Executive Summary

R3 is the rare revision driven by a real cross-model usage failure rather than reviewer speculation: a Haiku 4.5 sample showed the skill's format being reproduced while its work was skipped (compliance theater), and the countermeasure moves enforcement down the bindingness ladder from prose to a deterministic validator. The loop then closed three times inside one day: an EXECUTED weak-model acceptance run (same Haiku 4.5 class, same task) passed with compliance theater not reproduced and exposed a checker blind spot fixed as R3.1; an adversary fixture round found six precision holes fixed as v3 (R3.2); and the fixtures that verify all of it now live in the repo as `scripts/test-check-delivery.js` — implementing my earlier One Improvement (ledgered as IP-12) — which I ran at this revision: ALL PASS, exit 0. I independently verified the checker across three revisions with fixtures I authored myself, and SKILL.md's description of the checker is now aligned with its actual behavior (WARN vs reject, element counter declared heuristic) — the honesty discipline applied to the skill's own tooling claims. I would ship this at PASS; the residue is inherent and ledgered: format-binding is not work-binding (IP-9 open), and the layout eval still lacks an executed record.

## Evidence Reviewed

I acknowledge full manifest receipt `9c70b77340b4f981fc26fa80e1777ab6182ccf21a8df5fc449b153379ffeab93` (Scope Contract Version 1). All 18 manifest file hashes, the skill SHA (`2f3322de…`), and the revision (`16a1ae41…`) were recomputed locally with `sha256sum` and match the regenerated prompt verbatim; the content deltas from the prior manifest are `check-delivery.js` (`51f4df69…`, v3), the new `test-check-delivery.js` (`6fca32f0…`), and SKILL.md's two wording alignments, whose diffs I read in full (`git show 16a1ae4`).

Files examined in full at current content:

- `skills/bs-uml-master/SKILL.md` (hash-identical to the embedded prompt copy), plus `git show ccd86f0`, `fe42ad1`, and `16a1ae4` to isolate exactly what R3, R3.1, and R3.2 changed
- `skills/bs-uml-master/scripts/check-delivery.js` (read at all three revisions), `scripts/test-check-delivery.js` (read line-by-line: 13 fixture runs asserting exit codes plus must-match/must-not-match output patterns, every fixture encoding a named failure vector from IP-10 or adversary F1–F6), and `scripts/check-mermaid.js`
- All 8 reference modules (hash-unchanged since my R2/R3 reads; `rendering-validation.md` re-read with its R3 edits)
- `skills.json`, `evaluation/datasets/batch-1-test-prompts.json` (hash-unchanged — 4 uml evals), `evaluation/harness/runner.js`, `tools/peer-review.js`, `tools/test-peer-review-scope.js`, `evaluation/harness/test-runner-scope.js` (hash-verified)
- Context: `2026-08-31-haiku-usage-review.md` (driving sample), `2026-08-31-forward-test-r3.md` (EXECUTED weak-model acceptance run: PASS, side-by-side vs the pre-R3 sample, checker run unprompted), `improvement-points.md` (IP-1..IP-12, count 12 = 11 fixed + 1 open) + schema, `docs/research/uml-diagramming-analysis.md` §六, the R3 adversary review's APPROVED verdict at this revision, and all prior records (RED baseline, forward tests, gate2 response, R2 reviews)

Commands actually executed and cited:

1. `node skills/bs-uml-master/scripts/test-check-delivery.js` at this revision → **13/13 fixture runs PASS, "ALL PASS", exit 0** — covering the compliant path, the Haiku failure profile, IP-10 frontmatter (with trailing space), tag laundering, receipts-block-first, edges-only classDiagram ceiling, prose-mimic receipts and file:lines, both sketch forms, PlantUML ceiling and type mismatch, and contract-less output.
2. My own independent fixtures across earlier revisions (all still consistent with v3 behavior): compliant delivery → 0 FAIL; Haiku profile → 4 FAIL + WARN, exit 1; contract-less → exit 1; YAML-frontmatter 10-element budget WARN firing; fake-class-behind-frontmatter C5 FAIL; PlantUML guard non-applicability (now superseded by real PlantUML counting in v3).
3. `bash tools/validate.sh skills/bs-uml-master` → **16 passed, 0 failed** (pattern references 8/8, gate syntax 3 tags, bundled resources 9/9).
4. **IP-7 probe**: `plantuml.jar -tsvg` without `dot` — state diagram → exit 0 + "Cannot find Graphviz" placard; sequence diagram → real render (the documented exception).
5. Same-session probes for hash-unchanged modules remain valid: mermaid 11.17.2 `;`-in-message breakage, `end` reserved word, `usecaseDiagram` rejection, check-mermaid.js 3-way discrimination, smetana remedy.
6. `sha256sum` over all 18 manifest files + git revision receipts above.

## Dimension Scores

| Dimension | Score | Key Strength | Key Concern |
|-----------|------:|--------------|-------------|
| Clarity of trigger description | 9/10 | Names the verbs, nine diagram types, both sources, and the quality stakes; Boundaries section fences off dataviz, mockups, bs-visual-article, draw.io XML | Single long sentence; negative triggers live in the body, not the frontmatter description |
| Hard rules / safety gates | 9/10 | Identifiers-are-quotations closes the paraphrase-fabrication gap; compliance-theater red flags name observed rationalizations; v3 makes the sketch path and the Minimum Compliant Path jointly satisfiable instead of gate-colliding | Layout-rubric compliance remains self-reported; a wholly fabricated receipt still passes C2 — the checker raises theater's cost from silent omission to explicit lying |
| Workflow correctness | 9/10 | Minimum Compliant Path floor proven in the acceptance run (checker executed unprompted); renderer-pin skew rule closes the verification-locus gap; step 6 now handles warnings honestly ("resolve or state why they stand") | The MCP is a parallel summary of the phases — a future edit to one but not the other could drift |
| Pattern application | 9/10 | All 8 declared patterns resolve (validator-confirmed); verification-rules is applied recursively — diagrams, the output contract, and now the contract checker itself (self-test) each have their own validator | The bindingness ladder in research §六 is a genuinely new, transferable pattern still not extracted into docs/patterns/ |
| Test prompt coverage | 9/10 | 4 dataset prompts (hash-verified) + RED baseline + 3/3 EXECUTED forward tests + the EXECUTED weak-model acceptance run on the failing model class — plus 13 in-repo checker fixtures that are themselves regression tests encoding every probed vector | The dataset gained no compliance-theater prompt; `uml-layout-edge` still has no EXECUTED record; all records await HUMAN_VERIFIED |
| Bundled resources | 10/10 | Three scripts, all runnable and all verified here; the checker survived an adversary fixture round and its six precision holes are fixed and pinned by the in-repo self-test (ALL PASS at this revision); SKILL.md's claims about the checker now match its measured behavior, down to declaring the counter heuristic and subordinating it to the agent's own count | Receipt *truth* remains unverifiable at this layer by design — that residual belongs to IP-9/Phase 2.A, not to these resources |
| Maintainability | 9/10 | The ledger (IP-1..IP-12, every row sourced) is demonstrably operating — two of its entries were filed and fixed within hours by the review loop itself; the self-test makes every future checker edit re-verifiable in one command; era-layer claims are probe-scoped | Version-scoped tool claims still rot on Mermaid's schedule; checker regexes remain an era-layer artifact tracking contract wording |
| Production readiness | 8/10 | Gate 1 16/16; Gate 2 closed both sides at this revision (adversary: APPROVED with non-gating residuals); four hardening rounds each driven by executed evidence; floor enforcement model-independent and acceptance-tested on the model class that failed | HUMAN_VERIFIED false across all records; IP-9 (generate/verify separation) open pending Phase 2.A; the layout eval remains unexecuted |

**Total: 72/80**

## Strongest Aspect

The single best design move is the **bindingness-ladder response to compliance theater**: instead of answering a weak-model failure with more prose (which the failure itself proved weak models skim), R3 moved the output contract's enforcement into a deterministic validator that is model-independent by construction. What elevates it from sensible to excellent is that the thesis has now been tested at every joint: each check maps one-to-one onto a numbered finding in the archived Haiku usage review; the acceptance rerun on the same model class shows the previously-skipped work being performed under the recipe and the machine gate; the gate itself was then adversarially probed, its six precision holes fixed, and the whole verification history frozen into an in-repo self-test that any future session can replay in one command. The skill's core philosophy — never let a claim outrun its evidence — is applied recursively three levels deep: diagrams are checked by renderers, deliveries are checked by check-delivery.js, and check-delivery.js is checked by test-check-delivery.js, with even SKILL.md's own description of the checker corrected to match measured behavior rather than intended behavior.

## One Improvement

Run and record an EXECUTED forward test for `uml-layout-edge` (the A4-memo prompt) — after three rounds of hardening, it is now the only test prompt in the dataset with zero execution evidence, and it exercises the one major R2 subsystem (media profiles, the 7-point rubric's medium-fit point, the bounded layout repair loop, backend escalation) that no adversary probe, usage sample, or acceptance run has yet touched. My two previous improvement picks (weak-model executed evidence; in-repo checker fixtures) were both implemented and ledgered, which is exactly why this one now tops the list: a single recorded run — ideally on the weak model class, combining it with a compliance-theater-shaped medium (CDN-pinned renderer in a page-bound layout) — would give every subsystem of the skill at least one executed data point and make the next refinement pass fully evidence-covered.

## Verdict

**Verdict**: PASS (72/80)

This revision completes the loop the repo's STUDY→EXTRACT→DEVELOP→REVIEW cycle promises but rarely achieves: a real usage failure archived with probes, converted into mechanical enforcement, acceptance-tested on the very model class that failed, adversarially probed, hardened again, and finished with an in-repo regression suite that pins every finding — with each step deposited in an auditable ledger now at 12 sourced entries. Every load-bearing claim I tested held across three revisions and two independent fixture sets (mine and the repo's): the self-test passes 13/13 at this revision, Gate 1 passes 16/16, the adversary's re-verdict is APPROVED, and SKILL.md's description of its own tooling was corrected down to match measured behavior — the same honesty the skill demands of diagram deliveries, applied to itself. The process-weight question resolves decisively: one sub-second command plus a short recipe buys a mechanical floor that held where it previously broke, and the floor's own maintenance cost is now covered by a one-command self-test. What keeps this at 72 is honest and ledgered residue — format-binding is not work-binding (IP-9), the layout eval is unexecuted, nothing is human-verified — verification gaps on a mechanism that has now proven itself under usage, acceptance, and adversarial pressure. Ship it.
