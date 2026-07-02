---
name: context-as-commons
chinese_name: 上下文是公共品
category: context-management
sources:
  - Anthropic
description: Every token consumed by a skill displaces user conversation and other skills — conciseness is an ethical obligation, not a style preference.
also_named_as: []
status: proposed
---

# 上下文是公共品 · Context as Commons

> **Category**: 04. 上下文管理模式
> **Sources**: Anthropic
> **Status**: proposed

## What this pattern is

The context window is treated as a shared commons, not a private resource. Every token a skill consumes is a token the user cannot use for their actual task, and a token other concurrently loaded skills cannot use for theirs. This reframes conciseness from a stylistic preference ("short is nice") to an ethical obligation ("waste is harm"). The skill author's job is to maximize instruction density — say everything necessary and nothing more.

## Why it works

The tragedy of the commons applies to context windows: each skill author, optimizing locally, adds "just one more example" or "just one more edge case," and the aggregate effect is a bloated skill that crowds out the user's actual conversation. Making the commons explicit — naming it as a shared resource with real scarcity — changes the optimization function from "how thorough can I be?" to "what is the minimum instruction set that produces correct behavior?"

## When to use it

- Every skill, as a design principle. It is not a section to add but a constraint to internalize.
- Particularly important for skills that load alongside other skills (multi-skill pipelines).
- Skills with long reference material where the temptation to inline "just one more" detail is strong.

Skip it only when brevity would create ambiguity that costs more tokens in clarification than it saves in instruction length.

## Used by

No active references yet — extracted from Anthropic (built-in skills' conciseness principle).

## Examples

Extracted from Anthropic; no in-repo example yet.

## Related patterns

- [`progressive-disclosure`](../04-context-management/progressive-disclosure.md) — the primary mechanism for honoring the commons: keep deep material out of context until needed
- [`load-stub`](../04-context-management/load-stub.md) — load stubs honor the commons by replacing full reference content with precise loading instructions
- [`evidence-dossier`](../04-context-management/evidence-dossier.md) — evidence dossiers honor the commons by offloading bulk data to scratch files
