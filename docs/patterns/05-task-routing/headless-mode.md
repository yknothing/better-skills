---
name: headless-mode
chinese_name: Headless Mode
category: task-routing
sources:
  - CE
  - Gstack
description: Execute unattended without user interaction, conservatively deferring ambiguous decisions rather than guessing — suitable for batch processing and CI-integrated skill invocations.
also_named_as: []
status: proposed
---

# Headless Mode · Headless Mode

> **Category**: 05. 任务路由模式
> **Sources**: CE, Gstack
> **Status**: proposed

## What this pattern is

A skill can operate in headless mode: no user interaction, no questions, no confirmations. When the skill encounters an ambiguous decision, it does not guess — it defers by flagging it in the output and continuing with the conservative default. The skill returns a structured result with both completed work and deferred decisions for later human review.

## Why it works

Many skill invocations happen in batch contexts (CI pipelines, scheduled jobs, bulk processing) where a human is not present to answer questions. A skill that blocks on ambiguity in these contexts stalls indefinitely. Headless mode trades perfect decisions for forward progress: the skill does what it can confidently, flags what it cannot, and lets a human resolve the flags later — in batch.

## When to use it

- Skills invoked from CI/CD pipelines or scheduled jobs.
- Bulk processing tasks (e.g., "run this skill on all 200 issues").
- Skills that are part of a larger automated pipeline where a human gate exists at the pipeline level, not per-skill.
- Skills where the cost of a wrong guess is higher than the cost of deferring.

Skip it for interactive, conversational skills where user guidance is the primary value.

## Used by

No active references yet — extracted from CE, Gstack.

## Examples

Extracted from CE, Gstack; no in-repo example yet.

## Related patterns

- [`pipeline-architecture`](../05-task-routing/pipeline-architecture.md) — headless mode is often a pipeline stage executed without user presence
- [`task-domain-classification`](../05-task-routing/task-domain-classification.md) — headless is a domain classification outcome (batch task vs. interactive task)
- [`continuous-execution`](../06-execution-control/continuous-execution.md) — headless mode naturally pairs with continuous execution (no pauses between tasks)
