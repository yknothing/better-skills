---
name: soul-test
chinese_name: "灵魂" 测试
category: skill-creation
sources:
  - Open Design
description: The final gate: if someone screenshots this design, can they identify which brand or product it belongs to? If not, the design has no soul — it is a template.
also_named_as: []
status: proposed
---

# "灵魂" 测试 · Soul Test

> **Category**: 08. 技能创建模式
> **Sources**: Open Design
> **Status**: proposed

## What this pattern is

A single, decisive gate applied at the end of the design process: take a screenshot of the design. Can someone outside the project identify which brand or product it belongs to? If yes, the design has a soul — its 20% distinctive choices are strong enough to create recognizable identity. If no, the design is a template — it could belong to any brand, which means it belongs to none. The soul test forces the designer to strengthen the distinctive 20% until the design passes.

## Why it works

Most AI-generated design passes technical checks (WCAG contrast, consistent spacing, valid type scale) but fails the only check that matters to users: is it memorable? The soul test is a single binary question that cuts through checklists and forces the designer to confront whether the output has identity. It is deliberately subjective — design identity cannot be reduced to a checklist — but the subjectivity is the point: if a human cannot tell whose design this is, no amount of checklist compliance will save it.

## When to use it

- The final gate of any visual design skill, after all technical QA checks pass.
- When the design will represent a brand or product in public (landing pages, marketing sites, product UIs).
- When the 80/20 rule is in use — the soul test validates the 20%.

Skip it for purely functional outputs where identity is irrelevant (internal tools, admin panels, data dashboards where brand recognition is not a goal).

## Used by

No active references yet — extracted from Open Design.

## Examples

Extracted from Open Design; no in-repo example yet.

## Related patterns

- [`80-20-design-rules`](../08-skill-creation/80-20-design-rules.md) — 80/20 is the process (80% validated + 20% distinctive); soul-test is the result validation. If the 20% is strong enough, the soul test passes. Both are from Open Design
- [`named-anti-patterns`](../08-skill-creation/named-anti-patterns.md) — if any named anti-pattern fires (THE LILA BAN, NO INTER FONT), the soul test will fail because generic output has no identity
- [`quantifiable-design-knobs`](../08-skill-creation/quantifiable-design-knobs.md) — after adjusting knobs, the soul test validates that the result still has identity
