# bs-uml-master — Final Audit (all gates, revisions R1+R2)

- **Date:** 2026-08-27
- **Final skill revision audited:** 30ae1d835c8a527ae7291f2e5bc6fabd4591fcc3
- **Status:** AI-generated audit; add `HUMAN_VERIFIED` on human re-run.

## Revision history audited

- **R1 (1294e71)** — initial skill: question-first framing, mode gate, evidence ledger, UML 2.5 semantics, element budget, Mermaid/PlantUML routing, render-verified delivery. Gate 2: advocate PASS 71/80, adversary APPROVED (after 7 probe-backed gating fixes; see gate2-response).
- **R2 (e7bfa08)** — projection-backend architecture (ledger = canonical model; Mermaid / PlantUML / plain text / SVG-from-model as four projections) and layout-as-semantics (Rule 9, layout-craft module: three lever tiers, 7-point rubric, bounded layout repair loop, media profiles); medium constraints in Phase 0.
- **R2 fixes (30ae1d8)** — 8 findings from a fresh empirical adversary (1 HIGH: PlantUML Graphviz-placard trap; 4 MEDIUM incl. refuted `;` claim, EAW-width charset, SVG evidence-ceiling, sketch-cue loophole; 3 LOW) all fixed; dispositions in gate2-response.

## Gate results (at 30ae1d8)

| Gate | Mechanism | Result |
|---|---|---|
| 1 — Self-Review | `node tools/validate.js skills/bs-uml-master` | PASS 16/16 (~3,150 words; 3 HARD-GATEs; 9/9 bundled resources incl. 3 new R2 modules + checker script) |
| 2 — Peer Review | Fresh independent manifest-bound reviewers with empirical-probe mandate; `node tools/peer-review.js check bs-uml-master` | PASS — advocate **PASS (69/80)**, adversary **APPROVED** (all 8 R2 findings verified fixed against the diff, re-probed where cheap); validator confirms scope contract, revision, SHA bindings for both files |
| 3 — Pattern Alignment | `node tools/pattern-alignment.js` + `bash tools/check-patterns.sh` | PASS — 8/8 declared patterns resolved AND alluded to in body; 0 ghost refs, 0 orphan actives |
| 4 — Evaluation Contract | `node evaluation/harness/runner.js --skill bs-uml-master` | PASS — structural_score 100; 4 evals (happy/edge/adversarial/layout-edge). Evidence scope `EVAL_SCHEMA_ONLY` by design |

## Behavioral evidence beyond Gate 4's schema scope (all EXECUTED, fresh contexts)

- **RED baseline**: skill-less agent on the happy-path prompt → everything-diagram, wrong-by-omission semantics, zero verification (`2026-08-27-red-baseline.md`).
- **GREEN forward tests 5/5** (`2026-08-27-forward-test.md`): happy (3-diagram split, RENDER_VERIFIED ×3); edge (MODEL-FROM-CODE, 21-message ledger with file:line + live execution corroboration); adversarial (verification pressure refused; exhaustive dump only as recorded exception); **R2 layout stress** (A4 memo: medium constraints captured, 14→9 curation, 7-point rubric with one real repair iteration, print-size judgment) — this is the executed evidence for the `uml-layout-edge` eval that the advocate's One Improvement requested; **R2 text backend** (code-comment medium → ASCII, mechanical alignment verification, correct non-loading of irrelevant modules).
- **Adversary probes across both rounds**: mermaid 11.17.2 parse behavior (comma generics, `end`, `%`, `;`, o/x, usecase), PlantUML with/without Graphviz (+smetana), ELK vs dagre geometry, East-Asian-width classification, checker exit codes — every factual claim in the reference files now matches probe data or is explicitly version-scoped with a probe instruction.

## Residual findings carried as follow-ups (non-gating)

1. LOW (R2 adversary F9) — the dot-dependent PlantUML type list omits state and deployment diagrams (probed: same placard behavior); contained by the type-independent "open the output and confirm it is the diagram" rule. One-line list amendment on next revision.
2. LOW (R1 carry-over) — gate receipts are self-attested pending Phase 2.A mechanization; Kroki consent is now consent-required (upgraded in R2).
3. Systemic note — registering any new skill re-hashes `skills.json`/dataset and marks earlier skills' review manifests stale (observed on bs-ppt-master); property of the manifest design, not of this skill.

## R3 addendum (2026-08-31, final revision 16a1ae4)

Driven by the first external usage sample (Haiku 4.5 compliance theater). Three tightening turns — R3 (enforcement moved from prose to `check-delivery.js` + Minimum Compliant Path), R3.1 (weak-model acceptance rerun PASSED, compliance theater not reproduced; found IP-10), R3.2 (adversary fixture round: 6 precision holes fixed; fixtures became the in-repo self-test, 14/14). Closing verdicts at 16a1ae4: adversary **APPROVED** (exploit fixtures re-run against v3, all caught; residuals IP-13 open, non-gating), advocate **PASS 72/80**, `peer-review.js check` 1/1 both files. Deposits: usage-review record, improvement-points ledger v1 (IP-1..13, founding CLAUDE.md trigger-1 tracking), research doc §六 (bindingness ladder, anti-degradation principles), acceptance-test record.

## R4 addendum (2026-08-31, final revision 9986df3)

Driven by usage sample #2 (tower layouts unread­able on PC screens — the user's observation, quantified at 6.5px effective font). R4 mechanizes the viewing reality: `check-render-fit.js` (per-axis fit rules — gestalt fits one screen at ≥11px, linear scrolls ≤3 screens along the reading axis only; torn-edge detection; PC-screen default medium), the trade-off ladder and probed layered-architecture recipe (dagre tower/strip pathology, subgraph-direction-ignored trap, ELK one-line fix) in layout-craft, HTML-delivery contract closure (IP-15), per-edge evidence (IP-16). The adversary round then broke the checker itself three times (inert edge gate 0/38 on real mermaid output; wide-sequence axis inversion; classDef-actor kind spoof) — all fixed (v2/v3, roledescription-first detection) and pinned as fixtures (self-test 14/14; real-edge parsing 36/36). **Weak-model acceptance (Haiku, HTML scenario): the fit gate forced two real layout-repair iterations (9.8px draft → 12.0px @ 1.87:1 pass)** — the compliance loop closing on layout exactly as R3 closed it on evidence. Closing verdicts at 9986df3: adversary **APPROVED** (5/5 findings verified RESOLVED; IP-20 LOW open), advocate **PASS 70/80**, validator 1/1 both files. Ledger stands at 20 improvement points (18 fixed, 2 open) — **upgrade trigger 1 (≥20 points) is now met**.

## Verdict

**All four gates PASS at 9986df3** (R1–R3 verdicts preserved above). bs-uml-master is active in `skills.json` (batch-1, deep) with projection backends, layout-as-semantics, screen-fit gating, and machine-checked delivery contracts in force. Terminal state follows from recorded evidence, not schedule pressure.
