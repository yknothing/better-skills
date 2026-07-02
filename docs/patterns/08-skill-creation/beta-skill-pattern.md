---
name: beta-skill-pattern
chinese_name: Beta Skill 模式
category: skill-creation
sources:
  - CE
description: Create a -beta parallel copy of a stable skill for experimentation; the beta version can break conventions without destabilizing the production skill.
also_named_as: []
status: proposed
---

# Beta Skill 模式 · Beta Skill Pattern

> **Category**: 08. 技能创建模式
> **Sources**: CE
> **Status**: proposed

## What this pattern is

When a stable skill needs significant changes — a new workflow, a different pattern set, an experimental architecture — create a `-beta` parallel copy rather than modifying the original. The beta skill lives alongside the production skill, clearly marked as experimental, and can break conventions (skip validation gates, use proposed patterns, experiment with different tier classifications) without destabilizing the production path. When the beta proves itself, its changes are merged back into the production skill and the beta is retired.

## Why it works

Modifying a production skill in-place is risky: if the experiment fails, you have broken the stable path and must revert under pressure. A parallel beta provides a safe sandbox — the production skill continues serving users while the beta accumulates evidence. The explicit `-beta` suffix also signals to agents and tooling that this skill is experimental, preventing accidental use in production contexts.

## When to use it

- When a stable skill needs a major refactor (new workflow, different tier, different pattern composition).
- When you want to A/B test two fundamentally different approaches to the same domain.
- When a proposed pattern needs a real skill to validate it before promotion to active.

Skip it for minor changes that can be validated through the standard TDD cycle. Skip it when the skill has no production users yet — just iterate in-place.

## Used by

No active references yet — extracted from CE.

## Examples

Extracted from CE; no in-repo example yet.

## Related patterns

- [`tdd-skill-creation`](../08-skill-creation/tdd-skill-creation.md) — the beta skill is itself created via TDD; the beta period is an extended RED-GREEN cycle before the REFACTOR merge
- [`platform-degradation-rules`](../08-skill-creation/platform-degradation-rules.md) — beta skills may need their own degradation rules if they use experimental platform features
- [`pattern-library`](../07-knowledge-management/pattern-library.md) — beta skills can reference proposed patterns, serving as the validation vehicle that promotes them to active
