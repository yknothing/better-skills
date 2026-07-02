---
name: sentinel-mechanism
chinese_name: 哨兵机制
category: execution-control
sources:
  - Cursor
description: Use unique identifiers (UUIDs, timestamps, sequence numbers) to tag outputs from different loop iterations or parallel agents, preventing cross-contamination between independent execution streams.
also_named_as: []
status: proposed
---

# 哨兵机制 · Sentinel Mechanism

> **Category**: 06. 执行控制模式
> **Sources**: Cursor
> **Status**: proposed

## What this pattern is

When an agent executes a loop or runs parallel sub-tasks, each iteration or sub-agent's output is tagged with a unique sentinel identifier — a UUID, timestamp, or sequence number. Before consuming any output, the agent verifies the sentinel matches the expected iteration. If a stale output from iteration N-1 accidentally appears in iteration N's context, the sentinel mismatch catches it.

This prevents the classic loop bug where the agent processes the same output twice or applies iteration N's logic to iteration N-1's data.

## Why it works

In loop-based workflows, context windows accumulate outputs from multiple iterations. Without explicit tagging, the agent cannot distinguish "output from this iteration" from "output from a previous iteration that happens to still be in context." Sentinels make the distinction machine-checkable: match the sentinel, or discard the output.

## When to use it

- Loop-based workflows where the agent iterates over a list (e.g., "process each issue in the milestone").
- Parallel agent dispatch where multiple agents return results that could be confused.
- Any workflow where stale context from a previous step could poison the current step's reasoning.

Skip it for linear, single-pass workflows where context accumulation is not a risk.

## Used by

No active references yet — extracted from Cursor.

## Examples

Extracted from Cursor; no in-repo example yet.

## Related patterns

- [`worktree-isolation`](../06-execution-control/worktree-isolation.md) — sentinels provide logical isolation; worktrees provide filesystem isolation
- [`parallel-safety-check`](../06-execution-control/parallel-safety-check.md) — sentinels catch runtime collisions that static overlap checks miss
- [`safety-hook-interception`](../06-execution-control/safety-hook-interception.md) — both are guard mechanisms; sentinels guard against data contamination, hooks guard against destructive actions
