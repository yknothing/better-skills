---
name: worktree-isolation
chinese_name: Worktree 隔离
category: execution-control
sources:
  - CE
description: Run parallel sub-agents in isolated git worktrees so their file mutations never collide, enabling safe concurrent execution without merge conflicts or state corruption.
also_named_as: []
status: proposed
---

# Worktree 隔离 · Worktree Isolation

> **Category**: 06. 执行控制模式
> **Sources**: CE
> **Status**: proposed

## What this pattern is

When a task requires parallel execution (e.g., multiple sub-agents working on different parts of the same codebase), each sub-agent gets its own git worktree — an isolated filesystem checkout with its own working directory. Sub-agents can freely mutate files within their worktree without affecting each other or the main branch. Results are merged only after all sub-agents complete and their outputs are reviewed.

The pattern also includes cleanup: orphaned worktrees from crashed sessions are detected and reported before creating new ones.

## Why it works

Parallel file mutation without isolation is the fastest path to merge conflicts, lost work, and corrupted state. Git worktrees provide OS-level filesystem isolation — sub-agent A cannot accidentally overwrite sub-agent B's changes because they are in different directories. The isolation is enforced by the filesystem, not by agent discipline, making it reliable even under concurrent load.

## When to use it

- Multi-agent workflows where 2+ agents modify files in the same repository simultaneously.
- Large refactoring tasks that touch many files — isolation lets each agent work on a subset.
- Tasks where failure recovery is important — a worktree can be discarded without affecting the main branch.
- Any workflow using `EnterWorktree` or equivalent tooling.

Skip it for single-agent, sequential workflows where concurrency is not a concern.

## Used by

No active references yet — extracted from CE.

## Examples

Extracted from CE; no in-repo example yet.

## Related patterns

- [`parallel-safety-check`](../06-execution-control/parallel-safety-check.md) — before dispatching to parallel worktrees, check that file assignments don't overlap
- [`async-verification`](../06-execution-control/async-verification.md) — verification agents run in parallel worktrees while the user thinks
- [`sentinel-mechanism`](../06-execution-control/sentinel-mechanism.md) — sentinel markers prevent worktree outputs from interfering with each other
