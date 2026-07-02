---
name: standalone-message-rule
chinese_name: 独立消息规则
category: interaction-design
sources:
  - Anthropic
description: Important information must occupy its own message, never mixed with other content, so the user cannot miss or dismiss it among less critical material.
also_named_as: []
status: proposed
---

# 独立消息规则 · Standalone Message Rule

> **Category**: 02. 交互设计模式
> **Sources**: Anthropic
> **Status**: proposed

## What this pattern is

When the agent needs to convey critical information — a question that requires an answer, a gate that requires confirmation, a warning that must not be missed — it must deliver that information in its own standalone message, not embedded among other content. The rule prevents the failure mode where a critical prompt gets lost in a multi-paragraph response: the user skims, answers the last or most visible question, and misses the gate entirely.

This pattern is the communication-side counterpart to [`one-question-at-a-time`](../02-interaction-design/one-question-at-a-time.md). One-question-at-a-time governs *how many questions per message*; standalone-message-rule governs *what else can share the message with the question*.

## Why it works

Human attention follows a serial-position curve: users remember the first and last items in a message, and the middle is a blur. When a critical gate or question is sandwiched between explanatory text, code output, and polite framing, it competes for attention and often loses. A standalone message eliminates the competition — the user has exactly one thing to process, and the interaction cannot proceed until they process it.

## When to use it

- Any skill that has user-facing gates (scope confirmation, direction approval, priority confirmation).
- Skills where the agent might be tempted to bundle a confirmation request with status updates or explanatory text.
- Skills with high failure cost if the user misses a prompt.

Skip it for skills where all user communication is purely informational (no gates, no confirmation loops).

## Used by

No active references yet — extracted from Anthropic's agent interaction design guidelines.

## Examples

Extracted from Anthropic; no in-repo example yet — see Anthropic's agent design documentation for reference implementation.

## Related patterns

- [`one-question-at-a-time`](../02-interaction-design/one-question-at-a-time.md) — standalone messages are the natural container for single questions; the two patterns compound
- [`blocking-question-tools`](../02-interaction-design/blocking-question-tools.md) — standalone messages delivered via blocking tools ensure the user cannot skip
- [`per-decision-rejudgment`](../02-interaction-design/per-decision-rejudgment.md) — each standalone message is a new decision point; the agent must re-evaluate, not batch
