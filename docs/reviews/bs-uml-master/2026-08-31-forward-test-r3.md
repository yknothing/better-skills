# bs-uml-master — R3 Acceptance Forward Test (weak-model rerun)

- **Date:** 2026-08-31
- **Design:** the strongest possible test of the R3 compliance-theater countermeasures — the **same model class that produced the failing usage sample (Haiku 4.5)**, with the R3 skill, on the same task ("画 better-skills 仓库核心架构的 UML 图"). EXECUTED in a fresh sub-agent context.
- **Status:** AI-generated record; add `HUMAN_VERIFIED` on human re-run.

## Result: PASS — compliance theater not reproduced

Side-by-side against the 2026-08-31 usage sample (same model, pre-R3 skill):

| Dimension | Pre-R3 sample | R3 rerun |
|---|---|---|
| State line | bare `RENDER_VERIFIED`, no receipts | `RENDER_VERIFIED — mmdc 11.4.0, source compiled and rendered SVG visually inspected` |
| Evidence | none | file:line ledger (skills.json ranges, sources.yaml, CLAUDE.md sections) |
| Excluded | none | explicit 7-item exclusion list |
| Code read before drawing | no (fabricated `light` enum, `Skill referenced by Source`, etc.) | yes — cited real files; no fabricated identifiers found on check |
| Contract checker | n/a (didn't exist) | ran `check-delivery.js` unprompted-by-user (mandated by Minimum Compliant Path), pasted its 0-FAIL output |
| Scope | 2 diagrams, 14+13 elements, mixed altitudes | 1 diagram, 1 question, single altitude, 10 elements |

Residuals (honest): a few edge labels remain soft ("ES pass through EVAL" — the eval dataset covers self-developed skills only; "TOOLS manages SD" vague); 10 elements is 1 over target without a justification note — which exposed the checker bug below rather than a rule gap.

## By-product: checker defect found and fixed (IP-10)

The run's Mermaid source began with YAML frontmatter (`---\nconfig: layout: dagre\n---`), which broke `check-delivery.js` header detection — C5 (type-vs-header) and C6 (element budget) silently skipped, so the 10>9 WARN was missed. Fixed in R3.1: frontmatter stripped before header detection (regression fixture added), plus a PlantUML-source guard so the Mermaid header mapping cannot false-FAIL PlantUML deliveries. This is the improvement loop working as designed: an acceptance test on the enforcement tool found the enforcement tool's own blind spot.

## Reading

R3's bindingness-ladder thesis is supported: the same model that skipped the invisible work when bound only by prose performed it when bound by a recipe + a machine gate it had to satisfy. The remaining softness (edge-label precision) sits above the current floor — candidate for a future semantic-probe check, tracked via the ledger.
