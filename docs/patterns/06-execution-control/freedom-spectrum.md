---
name: freedom-spectrum
chinese_name: 自由度框架
category: execution-control
sources:
  - Anthropic
description: Match instruction precision to task fragility — high-freedom for creative exploration, low-freedom for brittle/destructive operations — so the agent knows how much latitude it has before starting.
also_named_as: []
status: proposed
---

# 自由度框架 · Freedom Spectrum

> **Category**: 06. 执行控制模式
> **Sources**: Anthropic
> **Status**: proposed

## What this pattern is

Every task sits on a freedom spectrum. At one end (high freedom), the agent is told *what* outcome to achieve but not *how* — suitable for creative tasks like brainstorming, design exploration, or prose drafting. At the other end (low freedom), the agent is given precise step-by-step instructions with explicit prohibitions — suitable for destructive operations, security-sensitive tasks, or workflows where deviation is catastrophic.

The skill declares which zone of the spectrum it operates in, and the agent calibrates its autonomy accordingly.

## Why it works

The most common agent failure mode is misjudging its own latitude — either over-constraining itself on creative tasks (producing safe, boring output) or over-reaching on dangerous tasks (making irreversible changes without confirmation). Explicitly declaring the freedom zone removes the guesswork: the agent knows before it starts whether this is an "explore freely" or "follow exactly" task.

## When to use it

- Skills that span the full spectrum — a single skill may have high-freedom phases (understanding) and low-freedom phases (committing).
- Destructive or irreversible operations (database migrations, force-push, production config changes).
- Creative tasks where over-constraint produces bland results.
- Skills used by agents of varying capability levels — less capable agents need narrower freedom.

Skip it for skills that are naturally narrow in scope where the freedom level is obvious.

## Used by

No active references yet — extracted from Anthropic.

## Examples

Extracted from Anthropic; no in-repo example yet.

## Related patterns

- [`execution-posture-signals`](../06-execution-control/execution-posture-signals.md) — posture signals communicate the current freedom zone to the user
- [`precise-commands`](../06-execution-control/precise-commands.md) — low-freedom execution: exact commands, no interpretation
- [`safety-hook-interception`](../06-execution-control/safety-hook-interception.md) — the extreme low-freedom zone: the system blocks certain actions entirely
