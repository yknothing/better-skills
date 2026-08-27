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
| Alternate engine | `%%{init: {"layout": "elk"}}%%` where available — ELK beats dagre on complex graphs; verify the target renderer supports it | Graphviz is the engine; tune via the levers above |
| Reduce label load | short edge labels (≤4 words); move prose to notes/reading notes | same, plus `hide empty members` |

## Tier 3 — Escalate the projection (strategic)

When the rubric below still fails after the repair loop, escalating is legitimate and expected — do not grind in a tool that has hit its ceiling, and do not deliver a garbled layout silently:

1. Re-split the model (back to Tier 1 — always reconsider first);
2. Switch engine/notation: Mermaid → PlantUML (more layout control), or D2 where available (strongest auto-layout);
3. Publication-grade requirement → SVG projected from the validated model ([SVG Presentation](./svg-presentation.md));
4. Human hand-tuning requirement → deliver the validated model + a draw.io/Excalidraw handoff note.

Record the escalation and its reason in the delivery.

## The layout rubric (checkable, run on the rendered image)

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
