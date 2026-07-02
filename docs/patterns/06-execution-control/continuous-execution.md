---
name: continuous-execution
chinese_name: 连续执行
category: execution-control
sources:
  - Superpowers
description: Do not pause or request confirmation between sub-tasks within a skill invocation — execute continuously and report progress via posture signals, reducing user interruption overhead.
also_named_as: []
status: proposed
---

# 连续执行 · Continuous Execution

> **Category**: 06. 执行控制模式
> **Sources**: Superpowers
> **Status**: proposed

## What this pattern is

Within a single skill invocation, the agent executes all sub-tasks continuously — no pauses for confirmation, no "shall I continue?" prompts between phases. Progress is communicated through execution posture signals (short status messages), not through interactive checkpoints. The user reads the signals to track progress but does not need to approve each step.

Confirmation is reserved for the few genuinely irreversible decisions (destructive operations, production changes), not for routine phase transitions.

## Why it works

Frequent confirmation prompts break the user's flow and train the user to click "yes" without reading — defeating the purpose of confirmation. Continuous execution with posture signals gives the user oversight without demanding interaction. The user can interrupt if a signal indicates a problem, but the default is forward progress.

## When to use it

- Multi-phase workflows where most phases are routine and low-risk.
- Skills designed for experienced users who trust the workflow and want speed.
- Batch processing where human attention is the bottleneck.

Skip it for skills where every step is high-stakes and requires explicit approval, or for users who prefer step-by-step control.

## Used by

No active references yet — extracted from Superpowers.

## Examples

Extracted from Superpowers; no in-repo example yet.

## Related patterns

- [`execution-posture-signals`](../06-execution-control/execution-posture-signals.md) — posture signals are the visibility mechanism that makes continuous execution safe
- [`headless-mode`](../05-task-routing/headless-mode.md) — headless mode is the extreme form: no user interaction at all
- [`async-verification`](../06-execution-control/async-verification.md) — async verification is continuous execution applied to the verification step
