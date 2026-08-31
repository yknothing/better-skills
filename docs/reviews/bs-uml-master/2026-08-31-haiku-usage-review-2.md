# bs-uml-master — External Usage Review #2 (Haiku 4.5, updated artifact)

- **Date:** 2026-08-31
- **Sample:** updated artifact `86e2a28b` — three Mermaid diagrams of this repo (component architecture, lifecycle, data model), HTML page pinning mermaid 10.6.1.
- **Probes:** all three sources extracted and rendered (mmdc 11.x); PNGs visually inspected; **screen-fit metrics computed** (viewport 1470×850, 16px labels); recipe experiments run on the failing diagram.
- **Status:** AI-generated record; add `HUMAN_VERIFIED` on human re-run.

## Progress vs sample #1

Evidence blocks with file:line (node-level), Excluded lists, Reading notes, one-question-per-diagram, all headline facts verified correct (13/9/5/22, 12 repos, ~60 patterns, real gate tool names). The contract's *format* arrived.

## Findings

1. **HIGH — layout fails the viewing reality (the user's call, quantified).** d1: 833×2094 (0.40:1), d2: 732×1944 (0.38:1) — fitted to a landscape PC screen the labels drop to **6.5/7.0px**, below the ~11px legibility floor; readers must scroll+zoom, destroying the gestalt. d3 (1904×1131, 1.68:1) fits at 12px. Visual inspection of d1: five conceptually parallel layers rendered as a serial one-column tower, right half of the canvas empty, one long backward edge.
2. **HIGH — recipe experiments (the transferable craft):** `direction LR` inside subgraphs is **silently ignored when the subgraph has external edges** (probed — identical output); flipping to `graph LR` produces an 8.66:1 strip (probed); **the ELK engine fixes it in one line** — same source → 1494×940 (1.59:1), 14.5px at fit, zero crossings (probed + visually verified). ELK caveats: GitHub ignores the directive; declaration order within groups is not preserved.
3. **HIGH — HTML delivery bypassed the R3 contract.** "State: RENDER_VERIFIED" again bare (no tool+version), page pins CDN mermaid 10.6.1 (renderer skew): the delivery checker only bound markdown blocks, so an artifact-page delivery escaped the whole discipline.
4. **MED — errors concentrate on edges.** Node facts all verified; the recurring fabrications are edges/fields: `Skill -->|references| Source` (false for self-developed, third occurrence), `Pattern.examples: Skill[]` (invented), class diagram faked in `graph TB` (third occurrence), "Activity Diagram" claimed over a flowchart. Root cause: evidence was organized per-node; the contract did not force per-edge citations.

## Countermeasures (R4, implemented same day)

- `scripts/check-render-fit.js`: mechanical per-axis fit gate — gestalt diagrams fit one screen at ≥11px effective font; linear diagrams fit the cross axis, ≤3 screens along the reading axis; long-range-edge (torn-sentence) detection; PC screen (1470×850) as the default medium. Verdicts match human judgment on all four real SVGs probed (d1/d2 FAIL, d3 and the memo-test diagram PASS) + 8 synthetic fixtures.
- layout-craft: fit-to-screen discipline, the trade-off ladder (split+wayfinding → compress → single-axis scroll → progressive disclosure → mural+companion; 能拆不缩，能缩不滚，滚只沿读，巨图配图), and the probed layered-architecture recipe (dagre TB tower / LR strip / ignored subgraph direction / ELK one-line fix with caveats).
- Contract: HTML/artifact deliveries must pass a markdown mirror through check-delivery + fit checks against the page's pinned renderer; Evidence must cite **every edge's kind claim individually**.

Ledgered as IP-14 (screen-fit gate), IP-15 (HTML bypass), IP-16 (per-edge evidence).
