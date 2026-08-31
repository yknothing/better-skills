# bs-uml-master — External Usage Review #1 (Haiku 4.5)

- **Date:** 2026-08-31
- **Sample:** claude.ai artifact `86e2a28b` "Better-Skills Core Architecture UML" — two Mermaid diagrams of this repo, drawn by **Haiku 4.5 with the skill installed**, embedded in an HTML page pinning mermaid **10.6.1** via CDN.
- **Review mode:** the skill's own EXPLAIN/REVIEW — semantics tables + layout rubric as checklist, findings with evidence; every factual claim cross-checked against this repo's actual files.
- **Empirical probes run:** both diagram sources extracted; rendered with mmdc 11.x (d1 732×1376, d2 1355×1492) and PNGs visually inspected; parse-checked against the page's pinned mermaid **10.6.1** via `scripts/check-mermaid.js` (both parse — by luck, not by verification); element counts tallied against budgets.
- **Status:** AI-generated record; add `HUMAN_VERIFIED` on human re-run.

## What the skill visibly delivered (credit)

Two diagrams instead of one mural; subgraph grouping; per-diagram Type/Mode/State declarations; reading notes; titles; edge labels; mostly-correct headline numbers (13 skills, ~60 patterns, 4 real gates); syntax valid on both renderer versions probed.

## Findings

**HIGH**

1. **`RENDER_VERIFIED` claimed without receipts.** No tool+version+what-was-checked. Reader-facing rendering runs on CDN mermaid 10.6.1 while any authoring-time verification ran elsewhere — the exact renderer-skew gap (R2 finding F8). Probe shows 10.6.1 happens to parse both sources; luck ≠ verification.
2. **Faked class notation.** Diagram 2 claims "Class Diagram" but is `graph TB` with `<br/>---<br/>` pseudo-class boxes — in a tool that HAS `classDiagram`. All relationship semantics (aggregation, multiplicity, dependency kinds) are unexpressible; every edge degrades to a labeled arrow.

**MEDIUM — fabrications under a MODEL-FROM-CODE claim (each grep-checkable)**

3. `tier: enum[deep|standard|light]` — real enum is `lightweight` (tools/validate.js `VALID_TIERS`; skills.json). Paraphrased identifier = fabricated identifier.
4. `Skill.status: enum[active|frozen]` — `frozen` is a **Batch** status; skill entries are `active`. Two entities' fields conflated.
5. `Skill -->|referenced by| Source` — the depicted Skill class models self-developed entries (has patterns/tier), which sources.yaml never references; edge false, and its direction reads inverted.
6. `Pattern.examples: Skill[]` — invented attribute (real fields: name/status/sources/also_named_as).
7. Diagram 1's load-bearing edges are approximations: `Core -->|drive| QA` (skills.json doesn't drive gates; validate.js reads it), `QA -->|pass/fail| Core` (gates don't write the registry; registration is manual).

**MEDIUM — contract omissions**

8. Zero evidence layer: no ledger, no file:line, no Excluded/Assumptions/Evidence fields. The whole CLI layer (bin/ + lib/) is absent from an "architecture" diagram with no declared exclusion.
9. Mixed questions/altitudes: diagram 2 = data model + gate machinery + 5-step workflow in one 13-element picture, including the category error `Skill -->|goes through| STUDY` (entity → process step). Diagram 1 = 14 primary elements with no recorded budget justification.

**Layout rubric (on rendered PNGs)**

- D1: grouping honest, hierarchy direction OK; Core↔QA bidirectional edge pair loops at the bottom breaking flow monotonicity — and both those edges are also semantically wrong, so deleting the errors fixes the layout.
- D2: label pile-up at the REVIEW 5-edge fan-out; multiple subgraph-boundary crossings; the EvalContract→DEPLOY snake edge traverses the whole canvas; density imbalance (dense center, empty flanks). Rubric points 5 and 7 fail.

## Verdict

**Far above the RED baseline; below the skill contract.** The cheap, visible surface of the skill was adopted (structure, declarations, notes); the expensive, invisible load-bearing mechanisms were skipped (code-reading → ledger, verification receipts, real notation). Delivery states were claimed, not earned.

## The transferable insight: compliance theater

A weaker model under this skill exhibits **compliance theater** — it reproduces the skill's *format* while skipping the skill's *work*, and the format then lends false authority to unverified content (a State line saying RENDER_VERIFIED is worse than no State line when unearned). Countermeasure class: move enforcement down the bindingness ladder — from prose rules → structured contracts → fill-in templates → **deterministic validators** → separated generate/verify contexts. Prose binds strong models; only tools bind all models. Deposited as improvement points IP-1..IP-8 in `improvement-points.md`; R3 hardening implements the mechanical subset.
