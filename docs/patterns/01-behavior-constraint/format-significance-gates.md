---
name: format-significance-gates
chinese_name: 格式显著性门禁
category: behavior-constraint
sources:
  - Anthropic
description: Use XML tags or all-caps to create visually unmissable barriers an agent cannot skim past.
also_named_as: []
status: active
---

# 格式显著性门禁 · Format Significance Gates

> **Category**: 01. 行为约束模式
> **Sources**: Anthropic
> **Status**: active

## What this pattern is

A format significance gate is a section of a SKILL.md that uses typographic or structural markers — XML tags (`<HARD-GATE>`), all-caps headers, horizontal rules — to create a visual "speed bump" that an LLM agent cannot skim past. Unlike prose, which agents can read loosely, these markers exploit the fact that LLMs are trained to pay heightened attention to structured markup and capitalized directives. A format significance gate says: *this instruction is not like the others; treat it with special care*.

This pattern is complementary to [`hard-rules-first`](../01-behavior-constraint/hard-rules-first.md). Hard-rules-first uses **positional priority** (rules before workflow). Format significance gates use **visual unmissability** (rules rendered in a format the agent cannot parse casually). They compound: a hard rule wrapped in a `<HARD-GATE>` tag and placed at the top of the file is doubly protected.

## Why it works

LLMs are trained on vast corpora of structured documents — HTML, XML, markdown with fenced blocks — where tags and all-caps text signal structural significance. A `<HARD-GATE>` tag triggers the same parsing attention that an `<h1>` or a `<warning>` block would. The agent treats the enclosed content as a discrete, named constraint rather than a sentence floating in prose. This reduces the probability that the agent will "read past" the rule when it is inconvenient.

## When to use it

- Any skill with a gate that must never be skipped (self-review before delivery, scope confirmation before proceeding, color checks before code generation).
- Skills where the agent is statistically likely to want to skip a step — the gate format makes the cost of skipping visible.
- Multi-phase skills where each phase gates the next — wrapping each gate in `<HARD-GATE>` creates a consistent visual language the agent learns to respect.

Skip it for skills with no gates, or skills where all constraints are naturally enforced by the workflow structure.

## Used by

- `bs-requirements-engineering` — Every stage gate (8 total) is wrapped in `<HARD-GATE id="...">` XML blocks. The Refusal Protocol, Gap Override Protocol, and Disengagement Protocol are all rendered inside format significance gates.
- `bs-visual-design` — 7 `<HARD-GATE>` blocks enforce phase sequencing, anti-pattern detection, color checks, state completeness, motion intentionality, accessibility baseline, and QA gate.

## Examples

From `skills/bs-requirements-engineering/SKILL.md`:

```markdown
<HARD-GATE id="understand-confirmed">
DO NOT proceed to Stage 2 until the user has explicitly confirmed the Raw Intent Summary.
</HARD-GATE>
```

From `skills/bs-visual-design/SKILL.md`:

```markdown
<HARD-GATE label="COLOR CHECK">
Before proceeding: count the distinct hues in your palette. If the only chromatic
hues are purple, blue, and indigo → you triggered THE LILA BAN. Restart color
selection.
</HARD-GATE>
```

The `<HARD-GATE>` wrapper elevates the instruction from "a thing to consider" to "a barrier you cannot pass." The `id` or `label` attribute gives each gate a name that can be referenced in error messages and self-review checklists.

In `bs-requirements-engineering`, the cumulative skip threshold explicitly counts gates: "If the user has skipped 3 or more stages or HARD-GATEs in a single session, do not silently accept further skips." The gates are countable, named entities — not prose paragraphs.

## Related patterns

- [`hard-rules-first`](../01-behavior-constraint/hard-rules-first.md) — same intent, complementary mechanism (positional priority vs. visual unmissability)
- [`anti-pattern-pre-naming`](../01-behavior-constraint/anti-pattern-pre-naming.md) — named anti-patterns often live inside format significance gates
- [`precise-terminal-states`](../01-behavior-constraint/precise-terminal-states.md) — gates define what must be true to proceed; terminal states define what to do when you cannot
