---
name: blocking-question-tools
chinese_name: 阻塞式提问工具
category: interaction-design
sources:
  - CE
description: Use platform-native blocking question tools (AskUserQuestion or equivalent) so the agent cannot continue execution until the user responds.
also_named_as: []
status: active
---

# 阻塞式提问工具 · Blocking Question Tools

> **Category**: 02. 交互设计模式
> **Sources**: CE
> **Status**: active

## What this pattern is

When the agent needs user input to proceed, use a blocking mechanism — a tool that literally prevents the agent from executing further instructions until the user responds. The canonical example is `AskUserQuestion` (a tool that pauses the agent's execution loop until the user submits an answer). If no such tool is available (headless mode, API-only contexts), the agent must simulate the block by emitting a standalone message ending with an explicit stop directive.

This pattern is the **mechanism** layer for [`one-question-at-a-time`](../02-interaction-design/one-question-at-a-time.md). The policy says "ask one question." Blocking question tools enforce "and don't do anything else until you get the answer."

## Why it works

Non-blocking questions are unreliable. An agent that asks a question and then continues working assumes the answer — or worse, generates output that depends on the answer before the user has even seen the question. Blocking tools remove the assumption path. The agent cannot proceed, so it cannot produce output that depends on unconfirmed input.

## When to use it

- Every skill that asks the user questions at gates (scope confirmation, direction approval, priority confirmation).
- Skills that operate in headless or API-only contexts — the degraded-mode protocol (standalone message + "STOP AND WAIT" directive) must be explicit.
- Skills where the cost of proceeding with unconfirmed assumptions is high (requirements, design, architecture).

Skip it for skills where user interaction is purely informational and no blocking is needed.

## Used by

- `requirements-engineering` — Hard Rule #4 (`BLOCKING QUESTIONS ONLY. Use AskUserQuestion or equivalent blocking tools.`) makes blocking the default mechanism for every gate in the pipeline (scope confirmation, gap clarification, priority approval, direction lock).

## Examples

From `skills/requirements-engineering/SKILL.md` Hard Rules:

```markdown
## HARD RULES — READ FIRST

...
- **BLOCKING QUESTIONS ONLY.** Use `AskUserQuestion` or equivalent blocking
  tools. Never ask a question and continue executing — the user has not
  answered yet, so anything you produce afterwards assumes an answer that
  doesn't exist.
- **DEGRADED MODE FALLBACK.** If no blocking tool is available, emit a
  standalone message ending in `[STOP — awaiting your answer]` and halt
  execution.
```

The Hard Rule sits before the workflow, so by the time the agent reaches Stage 3 (CLARIFY) and considers asking a question, the blocking-tool mechanism is already locked in as non-negotiable.

## Related patterns

- [`one-question-at-a-time`](../02-interaction-design/one-question-at-a-time.md) — the policy that blocking question tools enforce
- [`standalone-message-rule`](../02-interaction-design/standalone-message-rule.md) — in degraded mode (no blocking tool available), standalone messages with explicit stop directives are the fallback
- [`scoping-synthesis`](../02-interaction-design/scoping-synthesis.md) — the synthesis that follows after all blocking questions have been answered
