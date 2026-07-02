---
name: per-decision-rejudgment
chinese_name: 每次决策重判断
category: interaction-design
sources:
  - Anthropic
description: At each decision point, re-evaluate whether a feature or behavior should be used — never default to "it was enabled earlier, so it applies now."
also_named_as: []
status: proposed
---

# 每次决策重判断 · Per-Decision Rejudgment

> **Category**: 02. 交互设计模式
> **Sources**: Anthropic
> **Status**: proposed

## What this pattern is

The agent must not carry forward decisions from earlier in the conversation as unexamined defaults. At each new decision point, it re-evaluates: *Should I use this tool? Should I ask this question? Should I apply this constraint?* The fact that the user enabled a mode, approved a direction, or accepted a tradeoff 10 turns ago does not mean that decision holds for the current context. Each new situation is a fresh judgment.

This is the antidote to "mode inertia" — the tendency of agents to stay in a previously selected mode (deep rigor, lightweight pass, headless execution) long after the conditions that justified it have changed.

## Why it works

Agents maintain state across turns, and state breeds assumption. When the user said "yes, full rigor" at turn 5, the agent may continue applying full rigor at turn 50 even though the task has shifted from a multi-stakeholder feature spec to a quick bug-fix. Per-decision rejudgment breaks this inertia by making "should I be doing this?" an explicit question at each boundary, not a one-time answer that persists indefinitely.

## When to use it

- Multi-stage skills where the scope or context can shift mid-session.
- Skills with tiered execution modes (full/standard/lightweight) that can be re-triggered by changing conditions.
- Skills that invoke sub-agents or other skills — each invocation should re-evaluate whether the target skill is still appropriate.

Skip it for skills where the task scope is fixed at invocation and cannot change (e.g., "format this JSON").

## Used by

No active references yet — extracted from Anthropic's agent interaction design guidelines.

## Examples

Extracted from Anthropic; no in-repo example yet — see Anthropic's agent design documentation for reference implementation.

## Related patterns

- [`rigor-gap`](../02-interaction-design/rigor-gap.md) — re-running gap detectors at each stage is a form of per-decision rejudgment
- [`scoping-synthesis`](../02-interaction-design/scoping-synthesis.md) — scope is the most common thing that shifts mid-session; per-decision rejudgment catches scope drift
- [`one-question-at-a-time`](../02-interaction-design/one-question-at-a-time.md) — each new answer may change the context enough that the previous decisions need re-evaluation
