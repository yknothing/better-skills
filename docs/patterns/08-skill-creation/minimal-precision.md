---
name: minimal-precision
chinese_name: 极简精确
category: skill-creation
sources:
  - Cursor
description: Achieve a complete workflow in the fewest possible lines — every line earns its place by doing real work, not by explaining or hedging.
also_named_as: []
status: active
---

# 极简精确 · Minimal Precision

> **Category**: 08. 技能创建模式
> **Sources**: Cursor
> **Status**: active

## What this pattern is

A skill design philosophy that maximizes the ratio of actionable instruction to explanatory prose. Every line must earn its place: if a line can be removed without changing the agent's behavior, it should be. The skill still covers the full workflow — happy path, edge cases, error handling — but expresses it in the most compact form possible. The canonical Cursor example is a 13-line "babysit PR" skill that does everything a 200-line equivalent does.

## Why it works

Token budget is zero-sum: every explanatory sentence consumes context that could hold user data or other skills. A minimal-precision skill leaves more context budget for the actual task. It also reduces the surface area for misinterpretation — fewer words means fewer places where the agent can read ambiguity into the instruction.

## When to use it

- Lightweight-tier skills (high frequency, low failure cost) where context budget is precious.
- Skills with a narrow, well-defined action space — the workflow is simple enough that a compact expression suffices.
- When the skill's users are experienced agents that do not need extensive rationale to follow instructions.

Skip it for deep-tier skills where the failure cost justifies exhaustive explanation. Skip it when the action space has many edge cases that each require explicit handling.

## Used by

- `bs-social-card` — the repo's only lightweight-tier skill, at 116 lines total. It covers content extraction, layout selection, text escaping, font sizing, HTML building, screenshot, and verification — all in a single compact file. No `references/` files, no multi-paragraph rationale blocks. The Hard Rules are 4 numbered items. The workflow is 7 short steps.

## Examples

From `skills/bs-social-card/SKILL.md`, the entire Hard Rules block (4 rules, 4 lines):

```markdown
## HARD RULES

1. **OUTPUT**: 1200x630 PNG. No exceptions.
2. **NO PLACEHOLDER TEXT**: If the user did not provide content, ask.
   Never use lorem ipsum or filler.
3. **CONTRAST**: Text must meet WCAG AA minimum (4.5:1 normal, 3:1 large).
4. **LAYOUT**: Pick the variant that best fits the content (Step 2).
```

Each rule is one imperative sentence. No rationale, no examples inline — the rules are self-contained. The workflow steps that follow are equally terse: Step 1 is 7 lines, Step 2 is a 6-row table, Step 3 is one sentence.

## Related patterns

- [`exhaustive-precision`](../08-skill-creation/exhaustive-precision.md) — the antonym pair: minimal-precision maximizes instruction density, exhaustive-precision maximizes coverage of ambiguity
- [`hard-rules-first`](../01-behavior-constraint/hard-rules-first.md) — minimal-precision skills often use hard-rules-first to pack constraints into a compact block before the workflow
- [`tdd-skill-creation`](../08-skill-creation/tdd-skill-creation.md) — the REFACTOR phase of TDD often tightens a verbose skill toward minimal-precision by removing non-essential prose
- [`80-20-design-rules`](../08-skill-creation/80-20-design-rules.md) — both are about maximizing impact per unit of input; 80/20 maximizes design impact, minimal-precision maximizes instructional impact
