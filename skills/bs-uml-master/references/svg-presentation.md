# SVG Presentation — publication-grade projection of a validated model

Hand-authored SVG is the only backend with full visual control — and the only one with **no parser guarding the semantics**. Its danger lives inside its strength: SVG makes wrong diagrams look authoritative (*beautiful fiction*), and model↔picture drift is silent. These rules keep the control without the fiction.

## The iron rule: model first, always

**SVG is only ever generated as a projection of an already-validated element ledger.** Never draw SVG freehand from the task description. The pipeline is: model (Phases 0–3, ledger complete, semantics reviewed) → optionally a quick Mermaid/PlantUML render to sanity-check the structure → SVG projection. If no validated model exists, you are not ready for SVG.

## When to choose SVG

- Publication-grade output where visual quality carries information weight: article illustrations, teaching material, landing/summary pages, posters — the ByteByteGo class of diagram.
- Typically `authoritative` significance, or `deliverable` where the user explicitly asks for presentation quality.
- The layout rubric failed in the auto-layout backends for a diagram that genuinely cannot shrink, and the user accepts the cost below.
- NOT for: routine docs/PRs (Mermaid), anything the user will need to edit as text later without you.

## Cost disclosure (required in the delivery)

State plainly: the SVG is hand-laid-out; when the model changes, the SVG must be re-projected (regenerated or re-edited) — it will not update itself the way notation source does. Recommend keeping the ledger/notation source next to the SVG as the editable source of truth.

## Authoring rules

- Layout freedom means the [layout rubric](./layout-craft.md) applies **in full strictness** — with no engine to blame, every crossing, misalignment, and density knot is an authoring choice.
- Use UML notation faithfully (triangles hollow at the parent, diamonds at the whole, dashed dependencies): presentation styling may change colors and typography, never the notation's shape grammar. A legend is mandatory the moment any styling carries meaning.
- Text: real `<text>` elements (selectable, accessible), not paths; set `font-family` with fallbacks; check overflow at the final size — long identifiers clip silently.
- Theme: either commit to one background explicitly or verify legibility on light and dark; never rely on a transparent background inheriting a friendly color.
- Keep the file self-contained (no external images/fonts required to view).

## Verification recipe

`RENDER_VERIFIED` for this backend requires all three:

1. **Visual inspection** of the SVG at the intended display size (and both themes when applicable): no clipping, overlap, or illegible text.
2. **Ledger-sync check, both directions** — every visual element traces to a ledger row; every curated ledger row appears. This check matters *more* here than in any other backend: no parser will catch a drifted or invented element.
3. **Layout rubric pass** (all 7 points).

There is no meaningful `SYNTAX_VERIFIED` tier for SVG (XML well-formedness says nothing about the diagram); anything less than the three checks above is `UNVERIFIED`.

## Degradation

Without the capacity to do the design pass properly (time, rendering, or review), do not ship a half-designed SVG: deliver the validated model with a Mermaid/PlantUML projection now, and name the SVG pass as an explicit follow-up step.
