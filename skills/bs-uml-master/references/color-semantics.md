# Color Semantics — the second semantic channel

Position tells the truth (Rule 9); color is the second channel that can carry it. Used with discipline, color encodes a whole extra dimension on top of the graph structure — layer, lifecycle state, ownership, verification status — which is exactly what makes dense diagrams readable. Used without discipline, it is **decorative rainbow**: every box a different pastel, no legend, no meaning (the observed failure in both external usage samples). Decorative color is worse than no color — readers assume color means something and hunt for a pattern that isn't there.

## The three laws

1. **One dimension per set.** Color encodes exactly one declared dimension across a diagram (and across a diagram set): altitude/layer, OR state/lifecycle, OR ownership/team, OR status (pass/fail/pending) — never a mix, never per-box whim. Declare the dimension in the delivery ("color = architectural layer").
2. **Unified legend, same meaning = same color everywhere.** One legend defines the mapping; every diagram in the set reuses it exactly (hex-identical). A color that appears in the render but not in the legend is a defect; so is the same layer wearing two colors in two diagrams.
3. **Never color alone.** ~8% of male readers have color-vision deficiency, and prints go grayscale. Every color-encoded distinction is redundantly encoded — grouping (subgraph/package), stereotype text (`«service»`), border style, or an icon. Color accelerates; it must not be the only carrier.

## Default palette (colorblind-safe)

Use the Okabe-Ito palette unless the user's brand dictates otherwise — categorical, distinguishable under the common CVD types, print-safe:

| Slot | Hex | Suggested default role |
|---|---|---|
| Orange | `#E69F00` | entry/interface layer |
| Sky blue | `#56B4E9` | application/service layer |
| Bluish green | `#009E73` | passing/verified/active |
| Yellow | `#F0E442` | pending/in-progress (dark text only) |
| Blue | `#0072B2` | data/infrastructure layer |
| Vermillion | `#D55E00` | failing/blocked/deprecated |
| Reddish purple | `#CC79A7` | external/third-party |
| Grey | `#999999` | excluded-adjacent/context |

Rules of use: **≤6 hues per set** (beyond that, distinctions stop being pre-attentive — collapse categories or drop the encoding); fills light enough for dark text (use the hex at ~25–40% opacity or a tint as fill with the full hue as border, keeping text≈#1a1a1a contrast ≥4.5:1); check both light and dark themes when the medium renders both (mermaid `neutral` theme + tinted fills survives both; pure `#F0E442` fill with white text survives neither).

## Backend implementation

| Backend | Mechanism | Legend |
|---|---|---|
| Mermaid | `classDef layer_app fill:#56B4E9,stroke:#0072B2` + `class NodeA,NodeB layer_app` — one classDef per dimension value, applied by membership, never per-node `style` whims. Theme via `%%{init:{"theme":"neutral"}}%%` | No native legend: add a compact legend subgraph, or put the mapping in the caption/reading notes immediately below the diagram |
| PlantUML | Stereotype-driven skinparams: `skinparam class { BackgroundColor<<app>> #56B4E9 }` with `class Foo <<app>>` — the stereotype doubles as the redundant text encoding | Native `legend ... endlegend` block — use it |
| SVG (from model) | Direct fills per the same mapping; define once as CSS classes in `<style>`, never inline per-element | Draw the legend as part of the composition; verify in both themes |
| Plain text | No color channel — encode the dimension with markers (`[app]`, `*`) and say so |

## Review checks (Phase 5 additions when color is used)

- The color dimension is declared in the delivery, and the legend covers every color that appears (both directions).
- Same value → same hex across the whole set; ≤6 hues; no per-node one-off colors.
- Redundant encoding present for every color distinction; text contrast holds on the actual fills.
- Grayscale survival: would the diagram still read printed? (The redundant encoding answers this.)

Default when nothing needs encoding: **don't color** — the renderer's theme is already correct. Color is opt-in for a declared dimension, not decoration.
