---
name: parallel-safety-check
chinese_name: Parallel Safety Check
category: execution-control
sources:
  - CE
description: Before dispatching parallel sub-agents, build a file-to-unit mapping and detect overlapping file assignments to prevent two agents from mutating the same file simultaneously.
also_named_as: []
status: proposed
---

# Parallel Safety Check · Parallel Safety Check

> **Category**: 06. 执行控制模式
> **Sources**: CE
> **Status**: proposed

## What this pattern is

Before dispatching work to parallel sub-agents, the orchestrator builds a file-to-unit mapping: which files does each sub-agent intend to touch? It then checks for overlaps — any file assigned to two or more agents is a conflict risk. Overlapping assignments are resolved before dispatch: either by reassigning the file to a single agent, splitting the task differently, or sequencing the agents so they don't run concurrently on the same files.

This is a static safety check, not a runtime lock — it prevents conflicts at planning time, not at execution time.

## Why it works

Concurrent file mutation without coordination produces merge conflicts that are expensive to resolve and easy to miss. A static overlap check at dispatch time catches the conflict before any work is done — when reassignment is cheap. The file-to-unit mapping also serves as documentation: each agent knows exactly which files are in its scope and which are off-limits.

## When to use it

- Any workflow that dispatches 2+ sub-agents to work on the same codebase.
- Refactoring tasks where file ownership boundaries are fuzzy.
- Tasks where sub-agents are generated dynamically (e.g., one agent per module) and the file assignments are computed, not hand-written.

Skip it for single-agent workflows or workflows where sub-agents work on entirely disjoint codebases.

## Used by

No active references yet — extracted from CE.

## Examples

Extracted from CE; no in-repo example yet.

## Related patterns

- [`worktree-isolation`](../06-execution-control/worktree-isolation.md) — worktree isolation is the runtime mechanism; parallel safety check is the planning-time gate
- [`async-verification`](../06-execution-control/async-verification.md) — verification agents are dispatched in parallel and benefit from safety checks
- [`sentinel-mechanism`](../06-execution-control/sentinel-mechanism.md) — sentinels provide runtime collision detection as a complement to static overlap checks
