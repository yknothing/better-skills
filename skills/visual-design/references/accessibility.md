<!-- Parent skill: skills/visual-design/SKILL.md -->
<!-- Open this file when: Phase 7 (Motion) is complete, before Phase 9 (Visual QA). Always read in full — accessibility is not optional. -->

# Accessibility Baseline

> **Parent skill**: [../SKILL.md](../SKILL.md) — this is Phase 8
> **Prerequisites**: Phases 2-7 complete (color, typography, spacing, layout, imagery, interaction states, motion all defined). Accessibility verification checks all of them.
> **Depends on**: Phase 2.2 (color palette), Phase 2.5 (dark mode if in scope), Phase 6 (interaction states incl. focus), Phase 7 (motion incl. reduced-motion)

## Overview

These are minimum requirements, not nice-to-haves. Every item below is mandatory. Accessibility work happens late in the pipeline precisely because it cross-cuts every earlier decision — color contrast, focus management, screen-reader semantics, motion safety, and touch targets all depend on choices made in Phases 2-7.

<HARD-GATE label="ACCESSIBILITY">
These are minimum requirements, not nice-to-haves. Every item below is mandatory.
</HARD-GATE>

---

## Color contrast

- All text must meet WCAG AA contrast minimums: 4.5:1 for normal text, 3:1 for large text (18px+ bold or 24px+ regular).
- All interactive elements (buttons, links, inputs) must have a 3:1 contrast ratio against adjacent colors.
- Never convey information through color alone. Always pair color with an icon, label, or pattern.

**Brand color vs. accessibility conflict resolution:** When the user's brand color fails WCAG AA contrast against the required background, do not silently violate either constraint. Apply this protocol:

1. **Detect the conflict.** If a brand primary color (e.g., bright yellow `#FFD700`, orange `#FF6B35`) does not meet 4.5:1 against white or the chosen background, flag it explicitly.
2. **Present the conflict and options.** *"Your brand color [hex] does not meet WCAG AA contrast (ratio: [X]:1, needs 4.5:1). Options: (a) Use a darker variant of the brand color for text/interactive elements while keeping the original for decorative use, (b) Use the brand color only on dark backgrounds where it passes contrast, (c) Use the brand color for large text only (3:1 threshold is easier to meet). Which approach works best?"*
3. **Document the resolution.** Record which option was chosen and the adjusted color values in the design tokens. If the user insists on using the non-compliant color despite the warning, document it as an explicit accessibility risk in the review synthesis.

## Focus management

- Every interactive element must have a visible focus style (do NOT use `:focus { outline: none }` without a replacement).
- Tab order must follow visual reading order.
- Modals must trap focus. Closing a modal must return focus to the triggering element.

## Screen reader support

- All images must have meaningful `alt` text (or `alt=""` if purely decorative).
- All form inputs must have associated `<label>` elements.
- Icon-only buttons must have `aria-label`.
- Use semantic HTML: `<nav>`, `<main>`, `<aside>`, `<header>`, `<footer>`, `<article>`, `<section>`.
- Headings must follow a logical hierarchy: one h1, h2s under it, h3s under those. Never skip levels.

## Motion safety

- Respect `prefers-reduced-motion`. Disable all non-essential animations when the user requests reduced motion. (Full motion rules are in [motion.md](./motion.md); this is the accessibility cross-check.)
- No auto-playing video or animation lasting more than 5 seconds.
- No flashing content exceeding 3 flashes per second (seizure risk).

## Touch targets

- Minimum touch target size: 44×44px (WCAG AAA: 48×48px for primary actions).
- Minimum spacing between touch targets: 8px.

---

## Related

- [SKILL.md Phase 2.2 — Color System](../SKILL.md) — the palette this reference checks against
- [SKILL.md Phase 8 — Accessibility gate](../SKILL.md) — the HARD-GATE in the main pipeline
- [motion.md](./motion.md) — reduced-motion rules this reference cross-checks
