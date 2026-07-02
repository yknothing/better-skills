---
name: async-verification
chinese_name: 异步验证
category: execution-control
sources:
  - CE
description: Dispatch verification agents in parallel while the user is still thinking or reviewing, so verification latency is hidden behind human cognitive time — zero perceived wait.
also_named_as: []
status: proposed
---

# 异步验证 · Async Verification

> **Category**: 06. 执行控制模式
> **Sources**: CE
> **Status**: proposed

## What this pattern is

When a skill produces output that needs verification (code review, test run, lint check), the verification is dispatched asynchronously — before the user has finished reviewing the primary output. The verification agent runs in parallel while the human reads, thinks, or formulates their next request. By the time the user is ready to act on the verification results, they are already available.

This is not background execution for its own sake; it is latency-hiding: aligning machine work with human cognitive time.

## Why it works

Synchronous verification — "wait while I check this" — adds dead time to every interaction. The user stares at a spinner. Async verification exploits the fact that the user needs time to read and think anyway; the verification runs during that natural gap. From the user's perspective, verification is instant.

## When to use it

- Skills that produce output the user needs to review (code, documents, designs).
- Verification steps that are independent of the user's next input (lint, tests, type checks).
- Multi-step workflows where the user reviews intermediate output before proceeding.

Skip it for verification that depends on user input (e.g., "does this look right?") or for tasks where the output is consumed immediately by the next automated step.

## Used by

No active references yet — extracted from CE.

## Examples

Extracted from CE; no in-repo example yet.

## Related patterns

- [`worktree-isolation`](../06-execution-control/worktree-isolation.md) — async verification agents often run in isolated worktrees
- [`parallel-safety-check`](../06-execution-control/parallel-safety-check.md) — safety-check the verification agent's file scope before dispatch
- [`continuous-execution`](../06-execution-control/continuous-execution.md) — async verification is a form of continuous execution (no pause for verification)
