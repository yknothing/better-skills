---
name: model-tiering
chinese_name: 模型分层
category: execution-control
sources:
  - CE
  - Superpowers
description: Route mechanical/repetitive tasks to cheaper models and architecture/critical-review tasks to the strongest model, optimizing cost and quality per pipeline stage.
also_named_as: []
status: proposed
---

# 模型分层 · Model Tiering

> **Category**: 06. 执行控制模式
> **Sources**: CE, Superpowers
> **Status**: proposed

## What this pattern is

Different pipeline stages have different cognitive demands. Mechanical tasks (running tests, formatting code, generating boilerplate) need reliability but not deep reasoning. Architecture decisions, security reviews, and final quality gates need the strongest available model. Model tiering assigns each pipeline stage to the appropriate model tier: cheap/fast models for mechanical stages, expensive/capable models for judgment stages.

This is cost optimization without quality compromise — the strong model is used where it matters, and not wasted where it doesn't.

## Why it works

Using the strongest model for every stage wastes money and latency on tasks a simpler model handles perfectly. Using a cheap model for everything risks quality on the stages that need deep reasoning. Tiering matches model capability to stage demand: the model is only as expensive as the task requires.

## When to use it

- Multi-stage pipelines where stages have clearly different cognitive demands.
- Skills with high invocation frequency where per-invocation cost matters.
- Skills where some stages are trivially automatable (lint, format, type-check) and others require expert judgment (architecture review, security audit).

Skip it for single-stage skills or when the cost difference between models is negligible.

## Used by

No active references yet — extracted from CE, Superpowers.

## Examples

Extracted from CE, Superpowers; no in-repo example yet.

## Related patterns

- [`pipeline-architecture`](../05-task-routing/pipeline-architecture.md) — model tiering maps model strength to pipeline stages
- [`depth-tiers`](../05-task-routing/depth-tiers.md) — depth tier determines how many stages need the strong model
- [`freedom-spectrum`](../06-execution-control/freedom-spectrum.md) — high-freedom stages (creative) may need stronger models than low-freedom stages (mechanical)
