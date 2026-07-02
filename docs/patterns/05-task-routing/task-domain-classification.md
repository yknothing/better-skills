---
name: task-domain-classification
chinese_name: 任务域分类
category: task-routing
sources:
  - CE
description: Classify incoming tasks into distinct domains (software tasks, non-software tasks, quick help) before routing to the appropriate skill or execution mode, preventing category errors.
also_named_as: []
status: proposed
---

# 任务域分类 · Task-Domain Classification

> **Category**: 05. 任务路由模式
> **Sources**: CE
> **Status**: proposed

## What this pattern is

Before executing any task, the skill performs a top-level classification: is this a software engineering task (code changes, architecture, debugging), a non-software task (research, writing, analysis), or a quick-help request (one-line answer, no workflow needed)? The classification determines which execution path the skill follows — or whether a different skill should handle the task entirely.

This prevents the agent from applying a code-oriented workflow to a research question, or from spinning up a full pipeline for a yes/no answer.

## Why it works

Category errors are among the most expensive failures in agent workflows — applying the wrong mental model to a task wastes tokens, time, and user trust. A mandatory classification step at the entry point forces the agent to explicitly reason about task type before committing to a workflow. It is cheaper to classify and route than to execute halfway and discover the mismatch.

## When to use it

- Meta-skills or orchestrator skills that handle diverse task types.
- Skills that have multiple execution modes (e.g., test-first vs. characterization-first).
- Skills where the wrong execution path has high cost (e.g., running a full TDD pipeline for a documentation fix).

Skip it for single-purpose skills where the task type is implicit in the skill's activation.

## Used by

No active references yet — extracted from CE.

## Examples

Extracted from CE; no in-repo example yet.

## Related patterns

- [`pipeline-architecture`](../05-task-routing/pipeline-architecture.md) — domain classification selects which pipeline variant to execute
- [`depth-tiers`](../05-task-routing/depth-tiers.md) — domain and depth are orthogonal axes; classification picks the domain, depth-tier picks the intensity
- [`headless-mode`](../05-task-routing/headless-mode.md) — certain domains (quick help) may route to headless execution
- [`multi-signal-trigger`](../05-task-routing/multi-signal-trigger.md) — signals that feed into the classification decision
