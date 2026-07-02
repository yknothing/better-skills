---
name: three-layer-separation
chinese_name: 三层分离架构
category: task-routing
sources:
  - Addy Osmani
description: Separate the agent system into three layers — Skills (capabilities), Personas (behavioral styles), and Commands (user-facing entry points) — each with distinct responsibilities and lifecycle.
also_named_as: []
status: proposed
---

# 三层分离架构 · Three-Layer Separation

> **Category**: 05. 任务路由模式
> **Sources**: Addy Osmani
> **Status**: proposed

## What this pattern is

The agent skill system is architected in three layers with distinct responsibilities:

- **Skills**: reusable capability units. Each does one thing well; composable.
- **Personas**: behavioral style overlays. Modify *how* a Skill executes (tone, verbosity, risk tolerance) without changing *what* it does.
- **Commands**: user-facing entry points. Map a user action ("deploy", "review PR") to one or more Skills, optionally with a Persona attached.

This prevents the common anti-pattern of baking behavioral style into capability code, where changing either requires touching the same file.

## Why it works

Mixed behavior + capability means changing one risks breaking the other. Separation lets a Skill be reused with different Personas, a Persona tuned independently, and Commands re-routed without modifying Skills.

## When to use it

- Skill libraries with >10 skills where cross-cutting behavioral concerns vary by use case.
- Multi-audience systems where the same capability needs different presentation.
- Systems where routing logic changes frequently.

Skip for small skill sets (≤5) where the three-layer overhead exceeds the benefit.

## Used by

No active references yet — extracted from Addy Osmani.

## Related patterns

- [`pipeline-architecture`](../05-task-routing/pipeline-architecture.md) — pipelines live inside the Skill layer
- [`task-domain-classification`](../05-task-routing/task-domain-classification.md) — the Command layer routes via domain classification
- [`depth-tiers`](../05-task-routing/depth-tiers.md) — depth is a Persona-layer concern
