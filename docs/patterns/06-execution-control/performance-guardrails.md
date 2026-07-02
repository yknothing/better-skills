---
name: performance-guardrails
chinese_name: 性能护栏
category: execution-control
sources:
  - Taste Skill
description: Embed API-level performance constraints directly in skill instructions (e.g., "useMotionValue, not useState, for animation") so the agent cannot accidentally choose a slow path.
also_named_as: []
status: proposed
---

# 性能护栏 · Performance Guardrails

> **Category**: 06. 执行控制模式
> **Sources**: Taste Skill
> **Status**: proposed

## What this pattern is

Rather than giving the agent a general performance principle ("make it fast"), the skill specifies concrete API-level choices that enforce performance: "use `useMotionValue` instead of `useState` for animation properties", "use `React.memo` on components rendered in lists of 50+ items", "prefer CSS `transform` over `top`/`left` for positional animations."

These are guardrails, not suggestions — the skill treats choosing the slow API as a rule violation, not a style preference.

## Why it works

"Make it fast" is not actionable for an agent — it doesn't know which of the 10 possible implementations is fast. A concrete API guardrail eliminates the choice: there is one correct API for this performance-sensitive path, and the agent uses it. This is especially important for performance because slow choices often look identical to fast choices at the code level — the difference only appears under load.

## When to use it

- Skills that generate UI code where performance anti-patterns are common (animation, large lists, re-renders).
- Skills targeting frameworks with known performance footguns (React, Flutter, SwiftUI).
- Skills where the agent might choose a "cleaner" API that is slower (e.g., `useState` is simpler than `useMotionValue`).

Skip it for skills where performance is not a concern or where the framework handles optimization automatically.

## Used by

No active references yet — extracted from Taste Skill.

## Examples

Extracted from Taste Skill; no in-repo example yet.

## Related patterns

- [`precise-commands`](../06-execution-control/precise-commands.md) — performance guardrails are precise-commands applied to API selection instead of shell commands
- [`named-anti-patterns`](../08-skill-creation/named-anti-patterns.md) — slow API choices can be named as anti-patterns (e.g., "useState-for-animation")
- [`freedom-spectrum`](../06-execution-control/freedom-spectrum.md) — performance guardrails are a low-freedom zone: the API choice is not negotiable
