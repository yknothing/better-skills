---
name: hard-rules-first
chinese_name: 硬规则前置
category: behavior-constraint
sources:
  - Cursor
description: Place non-negotiable constraints before any workflow description so the agent reads them before it reads how-to text.
also_named_as: []
status: active
---

# 硬规则前置 · Hard Rules First

> **Category**: 01. 行为约束模式
> **Sources**: Cursor
> **Status**: active

## What this pattern is

A skill's frontmatter is followed immediately by a small block of non-negotiable rules — the things the agent must never do regardless of what comes later. These rules appear *before* the workflow, the phase descriptions, the examples, and the handoff. The block is short (3–9 bullets) and uses imperative, specific language: "Do X", "Never do Y", not "consider X" or "try to Y".

## Why it works

LLMs read sequentially. Rules placed *after* a long workflow description compete with the procedural detail for attention; rules placed *before* it become the lens through which everything that follows is interpreted. Putting the constraints first means by the time the agent encounters a tempting shortcut later in the file, the prohibition is already in its working context.

## When to use it

- Any skill that has even one "must never" rule (destructive operations, scope discipline, safety boundaries).
- Skills where the workflow is long enough that an agent might forget early constraints by the time it finishes reading.
- Skills with named anti-patterns that need to be active before the agent encounters the situations that trigger them.

Skip it for trivially short skills (≤50 lines) where the workflow itself is the rule.

## Used by

- `requirements-engineering` — `## HARD RULES — READ FIRST` block sits at line ~7, before any pipeline description.
- `prose-craft` — Hard Constraints (numbered list) appear before Soft Guidelines and the editing workflow.
- `dev-flow` — `## HARD RULES — read before any process step` block, including "Tests first, always" and "No `git add .`", before the pipeline overview.
- `skill-bootstrap` — Hard Rules block before the 8-step workflow.
- `social-card` — `## HARD RULES` (4 numbered rules) before Step 1.
- `article-illustrate` — Hard Rules block before Stage 1.

## Examples

```markdown
---
name: dev-flow
description: Use when ...
---

# Dev Flow

You orchestrate the end-to-end development workflow: ...

***

## HARD RULES — read before any process step

Violating any of these is a failure of the skill. No exceptions.

- **Tests first, always.** No implementation code before a failing test exists.
- **No `git add .` or `git add -A`.** Stage only named files.
- **No destructive git commands** without explicit user approval.
...

## Phase 1: UNDERSTAND
...
```

The Hard Rules block is the *second* major section, immediately after the one-line skill purpose statement. The agent sees the prohibitions before it sees Phase 1.

## Related patterns

- [`format-significance-gates`](../01-behavior-constraint/format-significance-gates.md) — same intent, complementary mechanism (visual unmissability vs. positional priority)
- [`anti-pattern-pre-naming`](../01-behavior-constraint/anti-pattern-pre-naming.md) — frequently lives inside the Hard Rules block as a list of named violations
- [`precise-terminal-states`](../01-behavior-constraint/precise-terminal-states.md) — Hard Rules tend to specify what *not* to do; precise terminal states specify what *to* do next
