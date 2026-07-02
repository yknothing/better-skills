---
name: depth-tiers
chinese_name: 深度分层
category: task-routing
sources:
  - CE
description: Assign skills to depth tiers (Lightweight, Standard, Deep) based on frequency and failure cost, so the agent applies proportional rigor — not the same intensity to every task.
also_named_as: []
status: proposed
---

# 深度分层 · Depth Tiers

> **Category**: 05. 任务路由模式
> **Sources**: CE
> **Status**: proposed

## What this pattern is

Skills are assigned to one of three depth tiers based on two axes: usage frequency and failure cost. Lightweight skills (high frequency, low failure cost) use minimal structure — a few hard rules and a tight workflow. Standard skills (normal frequency, moderate cost) use principles plus hard gates. Deep skills (high frequency, high failure cost) use exhaustive precision — every edge case, every gate, every anti-pattern named.

The tier determines the skill's length, the number of gates, the granularity of error handling, and the review rigor required before the skill ships.

## Why it works

Applying the same rigor to every skill produces two failure modes: lightweight tasks get over-engineered (wasting tokens and user patience), and deep tasks get under-engineered (missing critical edge cases). Tiering makes the rigor proportional to the stakes. The agent knows from the tier annotation how much intensity to bring — it does not have to decide per-invocation.

## When to use it

- Skill libraries with more than 5 skills — tiering becomes necessary to manage diversity.
- Meta-skills that need to calibrate their own depth based on what they are orchestrating.
- When designing a new skill: pick the tier first, then design the structure to match.

Skip it for single-skill projects where there is no diversity to manage.

## Used by

No active references yet — extracted from CE.

## Examples

Extracted from CE; no in-repo example yet.

## Related patterns

- [`pipeline-architecture`](../05-task-routing/pipeline-architecture.md) — depth determines how many pipeline stages and gates a skill has
- [`task-domain-classification`](../05-task-routing/task-domain-classification.md) — domain classification and depth-tier are orthogonal routing dimensions
- [`model-tiering`](../06-execution-control/model-tiering.md) — model tiering (which model runs which stage) pairs with depth tiers (how much rigor per stage)
