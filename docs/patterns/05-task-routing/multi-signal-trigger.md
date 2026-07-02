---
name: multi-signal-trigger
chinese_name: 多信号触发
category: task-routing
sources:
  - Vercel
description: Detect skill relevance through multiple independent signals (path pattern, command, conversation context) rather than a single keyword match, reducing false positives and missed activations.
also_named_as: []
status: proposed
---

# 多信号触发 · Multi-Signal Trigger

> **Category**: 05. 任务路由模式
> **Sources**: Vercel
> **Status**: proposed

## What this pattern is

Instead of triggering a skill on a single keyword or pattern, define multiple independent activation signals that each independently indicate the skill is relevant. Typical signals include: file path patterns (e.g., `**/migrations/**`), command names (e.g., `prisma migrate`), and conversation context markers (e.g., the user mentioning "database schema change"). When any signal fires, the skill activates; when multiple fire simultaneously, confidence increases.

This reduces both false positives (a keyword match in an unrelated context) and false negatives (the user describes the task without using the canonical trigger word).

## Why it works

Single-signal triggers are brittle — one unexpected phrasing and the skill never loads. Multiple independent signals create a statistical safety net: the probability that all signals fail simultaneously is the product of their individual failure rates. For a skill that should activate on a task the user does frequently, missing it is worse than offering it when not needed.

## When to use it

- Skills triggered by natural-language descriptions where phrasing varies widely (e.g., "deploy", "ship", "push to prod", "go live" all mean the same thing).
- Skills tied to specific file types or directory structures (the path pattern is a strong signal).
- Skills that should activate on a family of related commands rather than a single verb.
- Skills where the cost of false activation is low (the agent can check and quickly decline).

Skip it for skills with a single, unambiguous trigger that users never paraphrase.

## Used by

No active references yet — extracted from Vercel.

## Examples

Extracted from Vercel; no in-repo example yet.

## Related patterns

- [`trigger-condition-separation`](../05-task-routing/trigger-condition-separation.md) — multi-signal is the activation side; trigger-condition-separation governs what the description field says
- [`pipeline-architecture`](../05-task-routing/pipeline-architecture.md) — multi-signal triggers help route into the correct stage of a pipeline
- [`task-domain-classification`](../05-task-routing/task-domain-classification.md) — multi-signal detection feeds into domain classification decisions
