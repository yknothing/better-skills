---
name: safety-hook-interception
chinese_name: 安全 Hook 拦截
category: execution-control
sources:
  - Gstack
description: Intercept destructive commands at the OS level (PreToolUse hook) before they reach execution, blocking dangerous operations regardless of what the skill text says.
also_named_as: []
status: proposed
---

# 安全 Hook 拦截 · Safety Hook Interception

> **Category**: 06. 执行控制模式
> **Sources**: Gstack
> **Status**: proposed

## What this pattern is

Instead of relying solely on skill text to prevent destructive operations (e.g., "Never run `git push --force`"), a PreToolUse hook intercepts tool calls at the system level before they execute. The hook checks the command against a blocklist (or an allowlist) and either permits, blocks, or requires user confirmation.

This is defense in depth: the skill text is the first line of defense (agent self-regulation), and the hook is the second line (system enforcement). Even if the agent ignores or misreads the skill text, the hook catches the dangerous command.

## Why it works

Skill text is a soft constraint — it depends on the agent reading, understanding, and choosing to comply. Under pressure, agents skip constraints. A PreToolUse hook is a hard constraint — it executes before the tool call reaches the shell, and the agent cannot bypass it. The two layers together cover both the "agent is careful" case and the "agent is rushing" case.

## When to use it

- Any skill that touches production infrastructure, databases, or version control.
- Skills where a single destructive command could cause irreversible damage (`rm -rf`, `DROP TABLE`, `git push --force`).
- Multi-tenant or shared environments where one agent's mistake affects others.

Skip it for read-only skills or skills operating in sandboxed environments where destruction is impossible.

## Used by

No active references yet — extracted from Gstack.

## Examples

Extracted from Gstack; no in-repo example yet.

## Related patterns

- [`sentinel-mechanism`](../06-execution-control/sentinel-mechanism.md) — both are guard mechanisms at different layers (data vs. command)
- [`precise-commands`](../06-execution-control/precise-commands.md) — precise commands reduce the surface area that hooks need to monitor
- [`hard-rules-first`](../01-behavior-constraint/hard-rules-first.md) — hard rules are the text-layer complement to hook-level enforcement
