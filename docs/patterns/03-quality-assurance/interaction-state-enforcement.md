---
name: interaction-state-enforcement
chinese_name: 交互状态强制
category: quality-assurance
sources:
  - Taste Skill
description: Require implementation of the full interaction state cycle — Loading, Empty, Error, Active — for every interactive element, not just the happy path.
also_named_as: []
status: active
---

# 交互状态强制 · Interaction State Enforcement

> **Category**: 03. 质量保证模式
> **Sources**: Taste Skill
> **Status**: active

## What this pattern is

Every interactive UI element must have all four interaction states explicitly implemented: **Loading** (skeleton, shimmer, or spinner), **Empty** (helpful empty state with a call to action), **Error** (clear error message plus recovery action), and **Active** (the normal interactive state as designed). The pattern forbids shipping a design that only handles the happy path.

Beyond the four core states, the pattern extends to hover states (`:hover`, `:focus-visible` with transitions), edge cases (long text overflow, missing images, dark mode, reduced motion), and responsive breakpoints (minimum 320px, tested at 320/768/1024/1440).

## Why it works

Agents — and humans — naturally design the happy path first and treat edge states as "later" work. By making interaction states a blocking requirement in the pipeline (not a suggestion), the pattern ensures that "later" becomes "now." The four-state taxonomy (Loading/Empty/Error/Active) gives the agent a concrete checklist: it cannot claim a component is "done" until all four states exist in code.

## When to use it

- Visual design and UI implementation skills where the output is interactive HTML/CSS/JS.
- Any skill that produces user-facing interfaces.
- Skills where the "happy path only" anti-pattern is a known failure mode.

Skip it for static, non-interactive outputs (posters, social cards, SVGs without interaction).

## Used by

- `bs-visual-design` — Phase 6 (ITERATE) enforces all four interaction states as a blocking requirement. The phase reference file (`phase-6-iterate.md`) includes a table mapping each state to its visual treatment and example, plus hover states, edge cases, and a polish pass checklist.

## Examples

From `skills/bs-visual-design/references/phase-6-iterate.md`:

```markdown
## Interaction State Enforcement

Every interactive element MUST have all four states implemented:

| State | Visual Treatment | Example |
|-------|-----------------|---------|
| **Loading** | Skeleton, shimmer, or spinner | `skeleton-pulse` animation on content placeholders |
| **Empty** | Helpful empty state with CTA | "No items yet — create your first" with a styled button |
| **Error** | Clear error message + recovery action | Red border + "Something went wrong" + Retry button |
| **Active** | Normal interactive state | Full styled component as designed |

## Hover States

Add `:hover` and `:focus-visible` for every interactive element.
Use `transition` (150–300ms) on color/background/border changes.

## Edge Cases

- **Long text**: `text-overflow: ellipsis` or line-clamp
- **Overflow**: `overflow: hidden` or `scroll` with styled scrollbar
- **Missing images**: `object-fit: cover` + fallback background color
- **Dark mode**: `prefers-color-scheme: dark` media query
- **Reduced motion**: `prefers-reduced-motion: reduce` media query
- **Narrow viewports**: Min 320px, test at 320/768/1024/1440
```

## Related patterns

- [`self-review-checklist`](../03-quality-assurance/self-review-checklist.md) — interaction states can be added as checklist items in a self-review
- [`multi-perspective-review`](../03-quality-assurance/multi-perspective-review.md) — the DX/User perspective in multi-perspective review naturally flags missing interaction states
- [`named-anti-patterns`](../08-skill-creation/named-anti-patterns.md) — "happy-path-only" is a named anti-pattern that interaction-state-enforcement directly counters
