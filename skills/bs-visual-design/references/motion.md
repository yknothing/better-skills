<!-- Parent skill: skills/bs-visual-design/SKILL.md -->
<!-- Open this file when: Phase 6 (Interaction States) is complete and any animation, transition, or motion is in scope -->

# Motion Design

> **Parent skill**: [../SKILL.md](../SKILL.md) — this is Phase 7
> **Prerequisites**: Phase 6 (Interaction States) is complete. You cannot animate what you have not defined.
> **Depends on**: Phase 6.1 (the interactive element states that motion will transition between)

## Overview

Motion comes AFTER interaction states. Every animation must have a purpose: guide attention, provide feedback, or create delight. Animation without purpose is distraction. This file covers the frequency gate, easing tokens, duration scale, stagger/orchestration, reduced-motion, and the animation-property allow-list.

> **Note**: Phases 5-7 are independent design dimensions and can be executed in any order — but Phase 7 specifically depends on Phase 6 being done.

<HARD-GATE label="MOTION INTENTIONALITY">
Every animation must have a purpose: guide attention, provide feedback, or create delight. Animation without purpose is distraction. Define the motion language before applying any animation.
</HARD-GATE>

---

## Frequency gate — should this animate at all?

Before picking easing or duration, classify how often the user will encounter the interaction:

| Exposure | Default |
|----------|---------|
| Very high (keyboard shortcuts, palette toggles, actions repeated many times per session) | **No animation** — or instant opacity only if state change would otherwise be jarring |
| High (hover on dense lists, frequent navigation) | Minimal feedback; durations at the low end of the scale |
| Occasional (modals, drawers, toasts) | Standard tokens from this reference |
| Rare / first-time (onboarding, empty-state delight) | Can use deliberate or ceremonial duration with justification |

Every animation must also answer **why** (spatial consistency, feedback, state change, preventing a jarring jump — not "it looks cool" on a high-exposure path).

---

## Reference skills (motion depth)

This file defines tokens and gates for `bs-visual-design`. For expert motion **implementation**, **strict diff review**, or **effect naming**, use Reference skills from [emilkowalski/skills](https://github.com/emilkowalski/skills) (synced via `external/sources.yaml`):

| Need | Reference skill |
|------|-----------------|
| Polish animation/interaction code | `emil-design-eng` |
| Audit motion diffs (Block/Approve) | `review-animations` (user-invoked) |
| "What's this effect called?" | `animation-vocabulary` |

Do not duplicate upstream skill bodies in this repo. See `docs/research/emilkowalski-analysis.md` for curation notes.

---

## Animation curves

Define easing tokens. Use the same curve family throughout:

| Token | CSS | Use |
|-------|-----|-----|
| **entrance** | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Elements appearing |
| **exit** | `cubic-bezier(0.4, 0, 1, 1)` | Elements disappearing |
| **emphasis** | `cubic-bezier(0.4, 0, 0.2, 1)` | Attention-drawing |
| **decelerate** | `cubic-bezier(0, 0, 0.2, 1)` | Entering screen |
| **accelerate** | `cubic-bezier(0.4, 0, 0.6, 1)` | Leaving screen |

## Duration scale

| Token | Duration | Use |
|-------|----------|-----|
| **instant** | 100ms | Micro-interactions |
| **quick** | 200ms | Hover, color shifts |
| **standard** | 300ms | UI entrance/exit, modals |
| **deliberate** | 500ms | Route changes, drag release |
| **ceremonial** | 700-1000ms | Brand moments only |

Never use durations between these tokens. Durations above 500ms must be rare and justified.

## Stagger and orchestration

- **Stagger interval**: 50-80ms per child. Direction: top-to-bottom (vertical), left-to-right (horizontal), center-out (grids).
- **Group limit**: never stagger >10 elements. Group larger sets and animate groups.
- **Initial load**: first paint shows final state — no entrance animations. Reserved for brand hero moments only.

## Reduced motion

<HARD-GATE label="REDUCED MOTION">
Respecting `prefers-reduced-motion` is mandatory. No exceptions.
</HARD-GATE>

- Wrap all animation declarations in `@media (prefers-reduced-motion: no-preference)`.
- When reduced motion is active, all animations must resolve to instant (0ms duration) or simple opacity cross-fades of 100ms or less.
- Do NOT disable all visual change — opacity fades preserve information flow. Instant state changes can be disorienting. A 100ms opacity transition is the safe default for reduced motion.
- Test: disable all non-opacity animations and verify the interface remains usable and all content is accessible.

## Animation properties

Restrict animated properties to GPU-composited properties only:

- **Allowed**: `opacity`, `transform` (translate, scale, rotate, skew). These trigger compositing only, no layout or paint.
- **Avoid**: `width`, `height`, `top`, `left`, `margin`, `padding`, `border-width`, `font-size`. These trigger layout recalculation and cause jank.
- **Conditional**: `background-color`, `color`, `box-shadow`, `border-color`, `filter`. These trigger paint but not layout. Acceptable for hover states and micro-interactions at quick duration or below.

If a design requires animating a layout-triggering property, redesign the animation to use `transform` instead (e.g., use `transform: scaleX()` instead of animating `width`).

---

## Related

- [SKILL.md Phase 6 — Interaction States](../SKILL.md) — the states motion transitions between
- [SKILL.md Phase 9.7 — Motion QA](../SKILL.md) — the checklist items that verify this reference was applied
