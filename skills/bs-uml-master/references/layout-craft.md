# Layout Craft — position is a semantic channel

Readers extract meaning from position even where notation declares nothing: adjacency implies coupling, vertical order implies hierarchy or time, horizontal order implies flow. A bad layout therefore makes **false implicit claims** — it is a correctness failure of the wrong-by-position kind, not a cosmetic one. For page-bound media (memos, PDFs, printed docs) layout quality decides whether the diagram transmits or garbles the answer.

In text-to-diagram tools you do not *specify* layout; you *steer* a layout engine. Work the three tiers of levers in order of strength.

## Tier 1 — The model is the strongest layout lever (structural)

Most "layout problems" are scope problems: auto-layout rarely botches ≤9 elements and almost always botches 20. Before touching any layout knob, re-check: element budget, one question per diagram, single abstraction level, split-by-concern. Re-scoping beats every tactical lever below.

**Diagram types carry asymmetric layout risk.** Sequence diagrams and state machines have geometry pinned by semantics (time flows down; participants sit in declared order) — they are nearly impossible to lay out badly. Class, component, and flowchart diagrams are free graphs — high layout risk. When two types can answer the question, prefer the pinned-geometry type.

## Tier 2 — Engine levers (tactical, per tool)

Both engines rank nodes largely by **declaration order** — declare elements in narrative reading order. Then:

| Lever | Mermaid | PlantUML |
|---|---|---|
| Global direction | `direction TB`/`LR` (hierarchies TB with parents up; pipelines LR) | `top to bottom direction` (default) / `left to right direction` |
| Grouping to create visual clusters | `subgraph` / `namespace` | `package`/`together { }` |
| Rank distance | — | arrow length: `-->` one rank, `--->` two |
| Local direction hints | — | `-up->`, `-right->` etc. — use the **fewest** that work; delete no-ops (contradictory hints degrade layout) |
| Forced alignment without a visible edge | — | hidden edges: `A -[hidden]- B` (the strongest PlantUML trick) |
| Edge routing style | — | `skinparam linetype ortho` |
| Alternate engine | `%%{init: {"layout": "elk"}}%%` — ELK beats dagre on complex graphs and works in mermaid-cli. **Embedded renderers (GitHub included) silently ignore the directive and lay out with dagre** — for a diagram whose home is such a renderer, run the rubric on the dagre render (drop the directive locally), or your local `RENDER_VERIFIED` certifies a layout the reader never sees | Graphviz is the engine (`!pragma layout smetana` when dot is absent); tune via the levers above |
| Reduce label load | short edge labels (≤4 words); move prose to notes/reading notes | same, plus `hide empty members` |

## Tier 3 — Escalate the projection (strategic)

When the rubric below still fails after the repair loop, escalating is legitimate and expected — do not grind in a tool that has hit its ceiling, and do not deliver a garbled layout silently:

1. Re-split the model (back to Tier 1 — always reconsider first);
2. Switch engine/notation: Mermaid → PlantUML (more layout control), or D2 where available (strongest auto-layout);
3. Publication-grade requirement → SVG projected from the validated model ([SVG Presentation](./svg-presentation.md));
4. Human hand-tuning requirement → deliver the validated model + a draw.io/Excalidraw handoff note.

Record the escalation and its reason in the delivery.

## The layout rubric (checkable, run on the rendered image)

The rubric is filled from evidence, not intentions: point 6 (medium fit) comes from a pasted `check-render-fit.js` receipt, points 2 and 5 (crossings, label collisions) from actually looking at the render. A rubric row asserted without its evidence is not a passed check — it is the compliance theater the delivery checker (C8) exists to catch. The ≤3-screen scroll allowance below never applies to gestalt diagrams, and "the medium is zoomable" waives nothing.

1. **Flow monotonicity** — one dominant reading direction; backward edges only for genuine feedback/callbacks, visually distinct (dashed/labeled).
2. **Crossing budget** — target 0 crossings at ≤9 elements. Each surviving crossing must be one that declaration reordering demonstrably could not remove (you tried).
3. **Proximity honesty** — related elements adjacent; unrelated elements separated; ≥3 elements sharing a concern get a named group.
4. **Hierarchy convention** — abstractions/parents up (or left), details down. A superclass rendered below its subclass reads as inverted — fix the layout, or the reader fixes it for you, wrongly.
5. **Label discipline** — edge labels ≤4 words; no label sits on an edge it doesn't belong to; no label collisions.
6. **Medium fit** — the render's aspect ratio suits the declared medium (Phase 0). Page-bound media are width-limited and non-zoomable: a 3700px-wide render is unusable in a memo. Prefer portrait/stacked compositions; two stacked small diagrams beat one wide one.
7. **Density balance** — no dense knot beside empty space; a knot is a re-split signal, not a decoration problem.

## The layout repair loop (bounded, like the syntax loop)

1. Render; check the rubric on the image.
2. Apply the strongest applicable lever (Tier 1 re-scope first, then declaration order, direction, grouping, hints).
3. Re-render; re-check every rubric point (a fix can regress another point).
4. **Budget: 5 iterations**, then escalate per Tier 3. Delivering with a named rubric deficiency and its reason (e.g. a recorded `USER-OVERRIDE` mural's crossing density) is honest; delivering it unnamed is not.

## Media profiles for Phase 0

Capture with the medium: **available width/aspect** (chat pane, README column ~900px, A4 portrait, slide 16:9), **zoomable or fixed** (web renderers zoom; print and memo PDFs do not), **theme** (dark/light/both). Non-zoomable + width-limited media lower the practical element budget below the global one — say so when it bites.

**Named media profiles** (`check-render-fit.js --medium <name>`; `--viewport WxH` for anything else):

| Profile | Viewport | Notes |
|---|---|---|
| `pc` (default when unstated) | 1470×850 | Landscape laptop content area. Mermaid's vertical default growth fights this — the physical root of tower disease |
| `phone` | 390×740 | Portrait. Gestalt capacity collapses to ~4–5 boxes; vertical linear flows are native (scroll = reading gesture); wide row layouts die here |
| `phone-landscape` | 740×390 | Rotated phone; short bursts only |
| `a4` | 794×1123 | Print/PDF page, non-zoomable |
| `readme` | 900×850 | GitHub README column |
| `slide` | 1280×720 | 16:9 presentation |

**The rules are viewport-parametric — that is the essence.** Fit the cross axis, scroll only along the reading axis, keep every edge co-visible, stay near the medium's own aspect band: none of these mention a specific screen. The numbers flow from the profile, and conclusions legitimately invert between media — the 0.40:1 tower that fails a PC screen has the *right shape* for a phone (its remaining failure there is content volume, not direction), while the 1.59:1 ELK row layout that wins on PC draws the opposite-direction aspect warning on a phone (probed, both). Composition direction follows the medium's short axis: landscape media want row-stacked layouts, portrait media want single-column ones. A diagram that must serve two media either carries fit receipts for both profiles or ships as two projections of the same ledger — never assume one render serves all screens.

## Fit-to-screen discipline (the human-vision gate)

A diagram must be *seen whole* (gestalt: hierarchy, flow, clusters) and then *read locally* (labels). Both die when the render doesn't fit: fit the whole and the labels drop below legibility; read the labels and the whole is lost to scrolling. The gate is mechanical — run `scripts/check-render-fit.js <diagram.svg>` on every rendered SVG:

- **Effective label font at fit** = font-size × min(viewport/canvas per axis, 1) must be **≥ 11px**.
- **Gestalt diagrams** (class, component, ER, architecture — no linear reading order): BOTH axes fit one viewport at ≥11px. There is no legitimate scrolling for a picture whose point is the whole.
- **Linear diagrams** (sequence; genuinely line-by-line process flows, pass `--kind linear`): the cross axis must fit at ≥11px; the reading axis may extend to **≤3 viewport-screens** — scrolling along the reading axis is the native reading gesture (a 3-screen sequence diagram is legal). Each screenful must stand alone; participants ≤6 so lifelines survive working memory once headers scroll away.
- **Every edge's two endpoints must be co-visible** at display scale. An edge is the smallest unit of meaning; one that spans more than a screen is a sentence torn in half — a split-and-cross-reference signal.
- Aspect target for screen media: **0.5:1 – 2.5:1**, landscape-biased.

## When it genuinely doesn't fit: the trade-off ladder

One screen ≈ 9–15 boxes at legible size — the screen limit, the cognitive limit (7±2), and the one-question limit converge on the same number. "Doesn't fit" is usually an information-architecture problem showing up physically. Work the ladder top-down; the motto: **能拆不缩，能缩不滚，滚只沿读，巨图配图** (split before shrinking, shrink before scrolling, scroll only along the reading axis, and a mural always ships with a companion overview).

1. **Split + wayfinding** (Shneiderman: overview first, zoom and filter, details on demand). One ≤9-element overview (subsystems collapsed) + N one-screen detail diagrams. The craft is the navigation: identical names and stable per-layer colors across the whole set; each detail diagram carries a one-line breadcrumb ("Overview > Quality Pipeline"); long-range edges become cross-references ("→ see diagram 3"), never lines across screens.
2. **Compress presentation, not the model** (~30–50% capacity, zero loss): box text to 1–2 lines (detail belongs in reading notes, not boxes); hide off-question members; bundle parallel edges into one labeled edge ("×6 commands", "all but validate").
3. **Single-axis scrolling** where the diagram kind earns it (the linear rules above).
4. **Interactive progressive disclosure** (HTML/artifact media): tabs or stacked sections, each holding one screen-fit diagram — the *page* scrolls, the *diagrams* don't; optionally a clickable overview linking to detail anchors.
5. **USER-OVERRIDE murals** (audit walls, posters): the medium is now print/zoomable canvas — say so; deliver the mural *plus* a one-screen companion overview. The readable deliverable is the pair.

## The layered-architecture layout recipe (empirically probed, mermaid 11.x)

Layered systems ("N layers of boxes with layer-to-layer edges") are the most common architecture diagram and dagre's worst case:

- `graph TB` + subgraphs → each layer stacks its boxes **vertically** → a 0.4:1 tower (probed: 833×2094, 6.5px at fit).
- `graph LR` → layers AND their interiors run horizontally → an 8.7:1 strip (probed: 3860×446). No better.
- `direction LR` inside a subgraph is **silently ignored when the subgraph has external edges** — which layer diagrams always have. The obvious fix doesn't work; don't burn repair iterations on it.
- **The fix: the ELK engine** — `%%{init: {"layout":"elk"}}%%` on line 1. Probed on the same source: 1494×940 (1.59:1), 14.5px at fit, zero crossings, layers as wide rows. One line.
- ELK caveats: embedded renderers (GitHub) silently ignore the directive (dagre geometry is what those readers see — verify on dagre for GitHub-bound diagrams, per the engine row above); ELK does not preserve declaration order within a group — if internal order carries meaning (Gate 1→2→3→4), add invisible ordering edges (`G1 ~~~ G2`) or accept the shuffle knowingly.
- Where ELK is unavailable and dagre towers persist: ladder step 1 (split the layers into diagrams) beats fighting the engine.
