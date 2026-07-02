<!-- Parent skill: skills/visual-design/SKILL.md -->
<!-- Open this file when: Phase 2 (Design Direction) is locked and any photography, illustration, iconography, or data visualization is in scope -->

# Imagery Direction

> **Parent skill**: [../SKILL.md](../SKILL.md) — this is Phase 5
> **Prerequisites**: Phase 2 (color, typography, spacing) and Phase 3 (design tokens, shape language, icon set) are locked. Imagery decisions depend on the established palette and shape language.
> **Depends on**: Phase 3.1 (shadow scale), Phase 3.2 (shape language / border radius), Phase 3.3 (icon set)

## Overview

Defaulting to unsplash-style stock photography or generic illustrations produces AI slop. Define the imagery language before generating or selecting any visual asset. This file covers photography/illustration style, image treatment tokens, data visualization, and iconography refinement.

> **Note**: Phases 5-7 (imagery, interaction states, motion) are independent design dimensions and can be executed in any order.

<HARD-GATE label="IMAGERY COHERENCE">
Every image treatment decision must be explicit. Defaulting to unsplash-style stock photography or generic illustrations produces AI slop. Define the imagery language before generating or selecting any visual asset.
</HARD-GATE>

---

## Photography / Illustration style

Pick one primary visual language and commit to it:

| Style | Use when | Characteristics |
|-------|----------|----------------|
| **Editorial photography** | Premium, lifestyle, journalism | High-contrast, natural light, human subjects with authentic expression |
| **Product photography** | E-commerce, SaaS, hardware | Clean background, consistent lighting, product-as-hero framing |
| **Abstract illustration** | Tech platforms, developer tools | Geometric, limited palette, metaphorical (not literal) |
| **Character illustration** | Onboarding, education, consumer | Consistent character style, expressive poses, storytelling scenes |
| **Data-driven imagery** | Analytics, dashboards, reports | Charts, data visualizations, infographics as primary visuals |
| **Typography-as-image** | Editorial, luxury, minimal | Large type treatments, custom lettering, text as the hero visual |
| **No imagery** | Developer docs, technical references | Content-first, no decorative images |

Define for the chosen style:
- **Color treatment**: warm or cool cast? desaturated or vibrant? duotone overlay?
- **Composition rule**: subject placement (centered, rule of thirds, off-frame). Consistent across all images.
- **Aspect ratios**: declare primary (e.g., 16:9 for hero, 4:3 for cards, 1:1 for avatars) and enforce consistently.
- **Lighting direction**: if using photography, declare light source (top-left key light, soft front fill) and apply uniformly.
- **Depth of field**: shallow (subject isolation) or deep (everything in focus). Pick one.

## Image treatment tokens

Define treatment tokens that apply uniformly to all imagery:

- **Overlay**: gradient direction + opacity for images with text overlay (e.g., `linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 50%)`).
- **Border radius**: match the shape language from Phase 3.2.
- **Shadow**: from the shadow scale in Phase 3.1, or none for flat treatments.
- **Hover effect**: scale (1.02-1.05), brightness shift, or color overlay on hover for interactive images.

## Data visualization (if applicable)

When charts, graphs, or data displays are in scope:

- **Chart palette**: 6-8 distinguishable hues that work on both light and dark backgrounds. Avoid the default library palettes (they are recognizable and generic). Test adjacency: no two adjacent data series should use colors that are indistinguishable when small (e.g., thin line charts).
- **Axis and grid style**: minimal. Light gray grid lines (gray-200 on light, gray-700 on dark). Remove chart junk: no 3D effects, no unnecessary borders, no redundant legends.
- **Number formatting**: declare formatting rules (commas for thousands, abbreviations for millions, decimal precision). Apply consistently across all data displays.
- **Empty data state**: what does a chart look like with no data? Define a placeholder visualization, not a blank container.

## Iconography refinement

Building on the icon set declared in Phase 3.3:

- **Style**: outline or solid? (Outline: modern, lightweight. Solid: bold, high-contrast. Pick one and use it everywhere.)
- **Custom icons**: if the 20% distinctive element requires custom icons, define their visual language now (stroke width, corner style, level of detail).
- **Icon + label pairing**: icons must always be paired with text labels unless the icon is universally recognized (search, close, menu, play). Never rely on icon-only communication for non-universal concepts.

---

## Related

- [SKILL.md Phase 3.1-3.3](../SKILL.md) — design tokens, shape language, icon set this reference depends on
- [SKILL.md Phase 9.6 — Imagery QA](../SKILL.md) — the checklist items that verify this reference was applied
