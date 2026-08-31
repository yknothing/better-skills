# bs-uml-master — R4 Acceptance Forward Test (weak-model, HTML delivery + fit gate)

- **Date:** 2026-08-31
- **Design:** Haiku 4.5 + R4 skill, the scenario both usage reviews failed on — "画仓库核心架构 UML 图，做成 HTML 页面（PC 浏览器看）". Tests the two R4 mechanisms at once: the screen-fit gate and the HTML-delivery contract closure. EXECUTED in a fresh sub-agent.
- **Status:** AI-generated record; add `HUMAN_VERIFIED` on human re-run.

## Result: PASS — the fit gate drove real layout iteration

The decisive observation: **the agent's first draft failed the fit gate (9.8px effective font) and the gate forced two repair iterations** until the render fit one screen — final 1400×750 (aspect 1.87:1), 12.0px effective, 0 FAIL. This is the exact behavior R4 was built to force; in usage samples #1/#2 the same model shipped 6.5px towers labeled RENDER_VERIFIED without noticing.

Against the usage-review-2 failure profile:

| Dimension | Usage sample #2 (pre-R4) | R4 acceptance rerun |
|---|---|---|
| Screen fit | 0.40:1 towers, 6.5–7.0px at fit, unnoticed | fit gate run per SVG; failed draft repaired to 1.87:1 @ 12px |
| Layout craft | dagre defaults, no recipe | ELK init line from the layered-architecture recipe |
| HTML bypass | contract skipped entirely | markdown contract mirror written and passed through check-delivery.js (0 FAIL, output pasted) |
| Renderer pin | 10.6.1 pinned, never mentioned | pinned version (Mermaid 10.9.1) declared in the delivery |
| Scope | 3 diagrams, 14+13 elements, mixed questions | one gestalt diagram, 12 elements, one question |
| Checker use | n/a | both checkers + check-mermaid run unprompted-by-user, outputs pasted |

## Honest residuals (non-gating, ledger candidates)

1. "SVG hand-optimized and validated separately" from the CDN-rendered page — the fit evidence came from the locally produced SVG; pinned-renderer (10.9.1) geometry was not itself fit-checked. The skew statement exists, the cross-check doesn't. (Same class as IP-9 self-attestation: the checkers bind what they are run on.)
2. A few edge labels remain soft ("Gate1 passes Gate2" reads the documented pipeline order as tool-level sequencing); per-edge evidence was present but coarse for gate-chain edges.

## Reading

Third consecutive weak-model data point confirming the bindingness-ladder thesis: each mechanism moved into tooling (delivery contract in R3, screen fit in R4) shows up in the next run's behavior; each mechanism left in prose (edge-label precision nuance) still wobbles. The remaining wobble is small and ledgered.
