---
name: precise-terminal-states
chinese_name: 精确终端状态
category: behavior-constraint
sources:
  - Anthropic
  - Cursor
description: Explicitly name what the agent must do next AND what it must never do, so it cannot default to generic behavior when a task ends.
also_named_as: []
status: proposed
---

# 精确终端状态 · Precise Terminal States

> **Category**: 01. 行为约束模式
> **Sources**: Anthropic, Cursor
> **Status**: proposed

## What this pattern is

A precise terminal state is an explicit declaration of what the agent must do (and must not do) when a skill, phase, or sub-task completes. It answers two questions: "What is the next action?" and "What behaviors are prohibited?" Without a named terminal state, an agent defaults to its base behavior — which might mean continuing autonomously, asking the user something vague, or stopping without a handoff. The pattern closes the ambiguity at the boundary.

The key insight is that **what you forbid** is as important as **what you prescribe**. An agent told only "now hand off to the user" might generate a 500-word summary. An agent told "hand off to the user" plus "do NOT summarize, do NOT suggest next steps, do NOT ask if they want anything else" produces a clean exit.

## Why it works

LLMs have strong default tendencies at task boundaries — summarization, polite offers of further help, continuation without asking. These defaults are statistically useful but destructive when precision matters. Naming the terminal state (both the positive action and the negative prohibitions) overrides the default with a specific target. The agent doesn't have to guess what "done" means; it has a named state to steer toward.

## When to use it

- Multi-stage pipelines where each stage must cleanly hand off to the next without the agent going rogue.
- Skills that invoke sub-agents or other skills — the terminal state of the sub-agent must be unambiguous.
- Any skill where the final output is consumed by a machine or another agent rather than a human.

Skip it for skills where the terminal behavior is trivially obvious (e.g., "write the file and stop") and the agent's defaults are safe.

## Used by

No active references yet — extracted from Anthropic (explicit `STOP` directives in multi-step agent protocols) and Cursor (precise exit conditions in skill definitions).

## Examples

Extracted from Anthropic and Cursor; no in-repo example yet — see Anthropic's multi-step agent documentation and Cursor's skill authoring guides for reference implementations.

## Related patterns

- [`hard-rules-first`](../01-behavior-constraint/hard-rules-first.md) — hard rules specify what *not* to do during execution; precise terminal states specify what *not* to do at boundaries
- [`format-significance-gates`](../01-behavior-constraint/format-significance-gates.md) — terminal states are often wrapped in format significance gates to make them unmissable at exit points
- [`standalone-message-rule`](../02-interaction-design/standalone-message-rule.md) — terminal states that involve user communication benefit from the standalone message discipline
