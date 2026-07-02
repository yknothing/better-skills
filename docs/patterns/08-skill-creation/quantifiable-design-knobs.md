---
name: quantifiable-design-knobs
chinese_name: 可量化设计旋钮
category: skill-creation
sources:
  - Taste Skill
description: Replace vague style descriptions with numeric parameters (1-10 scales) so the agent can make consistent, calibrated design decisions instead of interpreting fuzzy adjectives.
also_named_as: []
status: proposed
---

# 可量化设计旋钮 · Quantifiable Design Knobs

> **Category**: 08. 技能创建模式
> **Sources**: Taste Skill
> **Status**: proposed

## What this pattern is

Instead of describing design attributes with fuzzy adjectives ("more playful," "very professional," "a bit warmer"), expose them as numeric parameters on a bounded scale (typically 1-10). Each knob maps to a specific design dimension: color saturation, typographic contrast, border radius aggressiveness, whitespace density, animation frequency. The agent adjusts the knob value and gets a calibrated output, rather than interpreting "make it pop" through its training distribution.

## Why it works

Adjectives are ambiguous across agents and sessions — "playful" means different things to different models, and even to the same model on different days. A numeric knob on a bounded scale is unambiguous: 7 is always more than 5 on the same dimension. This enables reproducible design decisions and makes it possible to iterate ("turn the warmth knob from 6 to 4") without the drift that comes from re-interpreting adjectives.

## When to use it

- Design-oriented skills where the user wants calibrated control over aesthetic attributes.
- Skills that need reproducible output across sessions or across different agent models.
- When the user says "I'll know it when I see it" — knobs convert that into an iterable process.

Skip it for skills where design is not a primary output dimension. Skip it when the user prefers natural-language direction over numeric parameters.

## Used by

No active references yet — extracted from Taste Skill.

## Examples

Extracted from Taste Skill; no in-repo example yet.

## Related patterns

- [`named-anti-patterns`](../08-skill-creation/named-anti-patterns.md) — both are Taste Skill origin patterns; knobs control what TO do, anti-patterns name what NOT to do
- [`80-20-design-rules`](../08-skill-creation/80-20-design-rules.md) — the 20% distinctive choices can be tuned via quantifiable knobs
- [`soul-test`](../08-skill-creation/soul-test.md) — after adjusting knobs, the soul test validates that the result still has identity
