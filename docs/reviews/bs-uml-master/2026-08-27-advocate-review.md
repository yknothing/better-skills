# Advocate Review: bs-uml-master

**Date**: 2026-08-27
**Reviewer Role**: Advocate
**Skill**: bs-uml-master
**HUMAN_VERIFIED**: false
**Scope Contract Version**: 1
**Reviewed Revision**: 30ae1d835c8a527ae7291f2e5bc6fabd4591fcc3
**Reviewed Skill SHA-256**: 3fed930b64ea9cce2b91c86ace58f79489cb6b4cbb2280ef1e9004bb5a9bdd2b
**Reviewed Manifest SHA-256**: 17e4261ead25daa025fda1a2084c0766e05f1ccb1b794bd52bb82373821d5116

## Executive Summary

This revision pairs a genuinely layered architecture — the element ledger as canonical model with Mermaid/PlantUML/plain-text/SVG as four projections, each carrying only its own pitfalls, verification recipe, and budget correction — with an honesty system that survived two adversary rounds and got sharper both times: the current content forbids evidence-ceiling-lowering escalation to SVG, distrusts PlantUML's exit code (I reproduced the exit-0 error-placard it warns about, and confirmed the documented smetana remedy renders the real diagram), and makes verification claims falsifiable down to naming the display act for text diagrams. Rule 9 (layout as a semantic channel) with its 7-point rubric, ranked levers, and bounded repair loop is a quality raise rather than process weight, since it folds into the existing Phase 4 inspection and loads only by progressive disclosure. Every claim I probed empirically held, including two corrected in this commit. I would ship this at PASS; the remaining debt is execution breadth (one untested eval, no human verification), not design.

## Evidence Reviewed

I acknowledge full manifest receipt `17e4261ead25daa025fda1a2084c0766e05f1ccb1b794bd52bb82373821d5116` (Scope Contract Version 1). All 14 manifest file hashes, the skill SHA (`3fed930b…`), and the revision (`30ae1d83…` = `git rev-parse HEAD`) were recomputed locally with `sha256sum` and match the prompt verbatim.

Files examined in full at current content:

- `skills/bs-uml-master/SKILL.md`, plus `git show 30ae1d8` to confirm all 8 announced R2-adversary fixes (F1–F8) are present in the reviewed files and coherent with the unchanged modules
- All 8 reference modules: `diagram-selection.md`, `uml-semantics.md`, `modeling-from-code.md`, `layout-craft.md`, `syntax-pitfalls.md`, `text-diagrams.md`, `svg-presentation.md`, `rendering-validation.md`
- `skills/bs-uml-master/scripts/check-mermaid.js`
- `skills.json` (bs-uml-master entry: tier deep, 8 patterns, status active), `evaluation/datasets/batch-1-test-prompts.json` (all 4 uml evals, mirroring the SKILL.md test prompts), `evaluation/harness/runner.js`, `tools/peer-review.js`, `tools/test-peer-review-scope.js`, `evaluation/harness/test-runner-scope.js` (hash-verified)
- Context: `docs/research/uml-diagramming-analysis.md` including §五 (R2 rationale); `docs/patterns/README.md` (all 8 declared patterns present and `active`); prior records `2026-08-27-red-baseline.md`, `2026-08-27-forward-test.md`, `2026-08-27-gate2-response.md`

Commands actually executed and cited:

1. `bash tools/validate.sh skills/bs-uml-master` → **16 passed, 0 failed** (pattern references 8/8, gate syntax 3 tags well-formed, bundled resources 8/8).
2. `node skills/bs-uml-master/scripts/check-mermaid.js` (scratchpad, mermaid 11.17.2 + jsdom): valid `classDiagram` → exit 0 with the honest "SYNTAX_VERIFIED only" caveat; invalid `A <|--<< B` → exit 1 with line-pointed parse error; junk text → exit 1 "No diagram type detected". The exit-2 checker-fault path is separated in code from the exit-1 parse verdict.
3. **F2 probe (fixed claim)**: `A->>B: do this; then that` → parse error on mermaid 11.17.2; `A->>B: we end the loop here` → parses. Exactly matches the corrected pitfalls text (`;` still breaks message text and needs `#59;`; `end` in text is tolerated on 11.17+).
4. **F1 probe (fixed claim)**: with no `dot` binary on PATH, `java -jar plantuml.jar -tsvg` on a class diagram → **exit 0** while the output SVG contains "Cannot find Graphviz" — the error placard, not the diagram. Adding `!pragma layout smetana` per the module → exit 0 and a real diagram SVG containing both class nodes, no placard. Both halves of the corrected rendering-validation claim reproduce.
5. Earlier same-session probes on unchanged pitfalls content (mermaid 11.17.2): `usecaseDiagram` rejected (route-to-PlantUML claim), lowercase `end` as flowchart node ID breaks parsing while `End` parses.
6. `sha256sum` over all 14 manifest files + `git rev-parse HEAD` (receipts above).

## Dimension Scores

| Dimension | Score | Key Strength | Key Concern |
|-----------|------:|--------------|-------------|
| Clarity of trigger description | 9/10 | Names the verbs (creating/revising/reviewing), nine diagram types, both sources (codebase or design), and the quality stakes; Boundaries section cleanly fences off dataviz, mockups, bs-visual-article, and draw.io XML | Single long sentence; negative triggers live in the body's Boundaries section, not the frontmatter description |
| Hard rules / safety gates | 9/10 | 9 rules with deliberate escape-valve design (recorded `USER-OVERRIDE`, receipts-required ladder rungs 3/4); F3 closed the sketch-cue loophole (medium alone never reclassifies significance); F4 added the evidence-ceiling rule — escalation may never trade `RENDER_VERIFIED`-attainable for `UNVERIFIED`-beautiful; 3 HARD-GATE tags validated well-formed | Layout-rubric compliance remains self-reported; no mechanical check backs it the way check-mermaid.js backs syntax |
| Workflow correctness | 9/10 | Phase 0–5 with exit criteria; falsifiable-question test; EXPLAIN/REVIEW skip path; medium constraints captured in Phase 0 before rendering; both repair loops bounded at 5 with a named next move; F6 removed the one internal contradiction (budget-justification threshold now "exceeding 9" in both SKILL.md and diagram-selection) | The `authoritative` independent review degrades to `SELF_REVIEWED` when sub-agents are unavailable — honest, but the strongest tier is environment-dependent |
| Pattern application | 9/10 | All 8 declared patterns resolve to `active` entries (validator-confirmed 8/8) and each is visibly instantiated: confidence-anchors = evidence vocabulary, named-anti-patterns = Red Flags table, platform-degradation-rules = ladder + Dependencies section | The R2 layout-as-semantics material arguably constitutes a new extractable pattern not yet fed back into docs/patterns/ |
| Test prompt coverage | 8/10 | 4 prompts spanning vague-request, code-forensics, triple-pressure adversarial, and page-bound layout stress; mirrored in the eval dataset (verified); RED baseline with a 7-row failure taxonomy; forward tests 3/3 EXECUTED with renderer evidence | `uml-layout-edge` — the eval exercising exactly what R2 added — still has no EXECUTED forward-test record; all execution evidence is AI-run, awaiting HUMAN_VERIFIED |
| Bundled resources | 9/10 | 8 modules + working script, existence-validated 8/8; five independent empirical probes of module claims all reproduced, including both claims corrected in this commit (semicolon breakage; placard-despite-exit-0 plus the smetana remedy); F5 made text-diagram verification falsifiable (ASCII default with the EAW-width rationale, named display act required for full `RENDER_VERIFIED`); F8 pins the rubric to the geometry the reader will actually see (ELK ignored by embedded renderers) | The ELK/dagre embedded-renderer divergence and rasterize-to-inspect recipes were not re-executed in this review — credited on the modules' own probe-first instructions |
| Maintainability | 8/10 | Corrected claims now carry their reproduction conditions (spaceless `A---oB`, version scoping "11.17+"), making future re-probes cheap; projection architecture means a new backend is one new module; gate2-response and the R2 fix commit record every finding→fix mapping for future auditors | Version-dependent syntax claims will still rot as Mermaid moves; 9 cross-linked files must stay consistent with SKILL.md's tables by hand |
| Production readiness | 8/10 | Gate 1 16/16 (re-run at this revision); two adversary rounds fully dispositioned with fixes verifiably landed (I diffed 30ae1d8 and probed two of its eight fixes directly); registry entry complete; research basis documents the R2 rationale | HUMAN_VERIFIED false across all records; the layout eval remains the one pillar without execution evidence |

**Total: 69/80**

## Strongest Aspect

The single best design move is the **model/projection split**: declaring the evidence ledger the canonical model and demoting every notation — including hand-authored SVG — to a projection of it. This one decision does disproportionate work: it makes the SVG backend safe to offer at all (iron rule "no validated model → not ready for SVG", triple verification, no `SYNTAX_VERIFIED` tier), gives plain text a real niche with its own tighter budget and a mechanical verification recipe, and makes backend escalation under layout pressure a semantics-preserving operation rather than a rewrite risk. This revision completes the design with its missing guard: escalation is now bounded by the *evidence ceiling* (F4) — you may not move to a prettier projection if the environment cannot perform that projection's verification, so the architecture can never be used to launder an unverifiable diagram through its most impressive backend. Model-invariant semantics, per-backend verification, and now monotone-evidence escalation form a closed system.

## One Improvement

Run and record an EXECUTED forward test for `uml-layout-edge` (the A4-memo prompt), the way the other three prompts have records in `2026-08-27-forward-test.md`. Everything R2 added — Rule 9, the 7-point rubric, media profiles, the bounded layout repair loop, backend escalation — funnels into that one eval, and it is still the only test prompt with zero execution evidence. A single recorded run demonstrating a lowered practical budget chosen in Phase 0, a rubric check on the actual render (medium-fit point included), and either a repair iteration or a justified escalation would close the loop between the revision's design claims and observed behavior — and would also exercise the new F8 rule that the rubric must run on the geometry the reader's renderer will actually produce.

## Verdict

**Verdict**: PASS (69/80)

This is the most evidence-disciplined skill in the repo, and the current revision earned that description twice over: an adversary round probed it with real tools, found eight defects, and every fix is verifiably present in the reviewed content — two of which I re-reproduced independently (the `;` message-text breakage on mermaid 11.17.2, and PlantUML's exit-0 Graphviz placard together with its documented smetana remedy). Gate 1 passes 16/16 at this revision, the bundled checker discriminates valid/invalid/junk with correct exit codes and an honest capability caveat, all eight declared patterns resolve and are visibly applied, and the corrected claims now ship with their reproduction conditions, which is exactly what keeps a pitfalls catalog alive. The skill's core virtue — never letting a claim outrun its evidence — is now enforced at every layer: delivery states, degradation rungs, backend escalation, and even the phrasing of its own reference material. Remaining debt is verification breadth, not design: no human-verified run, and no execution record for the layout eval. Neither blocks a PASS at this stage of the pipeline; both are cheap to close and named above.
