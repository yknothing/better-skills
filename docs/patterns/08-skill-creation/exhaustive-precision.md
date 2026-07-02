---
name: exhaustive-precision
chinese_name: 穷举式精确
category: skill-creation
sources:
  - CE
description: Explicitly handle every possible ambiguity point — if an agent could misinterpret an instruction, add a clause that closes that interpretation, until no reasonable misinterpretation remains.
also_named_as: []
status: proposed
---

# 穷举式精确 · Exhaustive Precision

> **Category**: 08. 技能创建模式
> **Sources**: CE
> **Status**: proposed

## What this pattern is

A skill design philosophy that treats every instruction as having a surface area of possible misinterpretations. The author iteratively reads each sentence and asks: "How could an agent misinterpret this?" Each identified misinterpretation gets an explicit clause that closes it. The process repeats until no reasonable misinterpretation remains. The result is a skill that is longer but far more robust — the agent has no room to creatively reinterpret a vague instruction because every interpretation has been anticipated and closed.

## Why it works

Vague instructions are the root cause of most skill failures. An instruction like "ask the user clarifying questions" leaves open: how many? in what order? what format? when to stop? Exhaustive precision answers each of these before the agent encounters the ambiguity. The cost is token budget; the benefit is reliability. For deep-tier skills where failure cost is high, the tradeoff is worth it.

## When to use it

- Deep-tier skills where failure cost justifies the token budget.
- Skills whose action space has many legitimate but conflicting interpretations.
- Skills that will be used by less-experienced agents that benefit from explicit modeling.

Skip it for lightweight-tier skills where the token cost exceeds the reliability gain. Skip it when the action space is so narrow that only one reasonable interpretation exists.

## Used by

No active references yet — extracted from CE.

## Examples

Extracted from CE; no in-repo example yet.

## Related patterns

- [`minimal-precision`](../08-skill-creation/minimal-precision.md) — the antonym pair: exhaustive-precision maximizes coverage of ambiguity, minimal-precision maximizes instruction density
- [`tdd-skill-creation`](../08-skill-creation/tdd-skill-creation.md) — the REFACTOR phase of TDD applies exhaustive-precision thinking: "how could a lazy agent exploit this?"
- [`hard-rules-first`](../01-behavior-constraint/hard-rules-first.md) — exhaustive-precision skills often have longer Hard Rules blocks because every constraint is explicitly spelled out
- [`anti-pattern-pre-naming`](../01-behavior-constraint/anti-pattern-pre-naming.md) — exhaustive-precision applied to rationalizations: name every shortcut the agent might take
