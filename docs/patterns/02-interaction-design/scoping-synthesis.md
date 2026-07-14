---
name: scoping-synthesis
chinese_name: Scoping Synthesis
category: interaction-design
sources:
  - CE
  - Gstack
description: After gathering requirements, produce a three-bucket internal draft — Stated, Inferred, Out of Scope — and confirm with the user before proceeding.
also_named_as: []
status: active
---

# Scoping Synthesis · Scoping Synthesis

> **Category**: 02. 交互设计模式
> **Sources**: CE, Gstack
> **Status**: active

## What this pattern is

After gathering and clarifying requirements, the agent produces an internal three-bucket draft before proceeding to implementation or documentation:

1. **Stated Requirements**: What the user explicitly said they need, in their own words, with citations to specific messages.
2. **Inferred Requirements**: What logically follows from stated requirements. Every inference includes the stated requirement it derives from, the reasoning chain, and a discrete confidence anchor (0/25/50/75/100).
3. **Out of Scope**: What the user said they do NOT need, plus what the agent is intentionally deferring, each with a reason.

All three buckets are presented to the user together for confirmation before the agent proceeds. This converts "I think we're on the same page" (assumption) into "Here is exactly what I heard, what I inferred, and what I excluded — does this match your understanding?" (verifiable artifact).

## Why it works

Scope misalignment is the most expensive class of requirements error. When the agent and user have different mental models of what is in scope, every downstream artifact is built on a false premise. The three-bucket format forces the agent to make its inferences explicit and its exclusions intentional. The user can then correct specific items ("No, item 3 in Inferred is out of scope") rather than vague pushback ("This isn't what I meant"). The confidence anchors on inferences prevent the agent from presenting guesses as facts.

## When to use it

- Requirements-gathering skills where scope boundaries are critical.
- Any skill that takes ambiguous user input and must produce structured output with clear boundaries.
- Skills that will hand off to downstream execution — the three-bucket synthesis becomes the contract between stages.

Skip it for skills where the scope is trivially obvious (e.g., "fix this bug in this file") and there is nothing to synthesize.

## Used by

- `bs-requirements-engineering` — Stage 4 (SYNTHESIZE) produces the three-bucket draft (Stated/Inferred/Out of Scope) with discrete confidence anchors on every inference. The `<HARD-GATE id="scope-confirmed">` blocks progression until the user confirms.

## Examples

From `skills/bs-requirements-engineering/SKILL.md`:

```markdown
## Stage 4: SYNTHESIZE — Scoping Synthesis

Produce an internal three-bucket draft:

### Bucket 1: Stated Requirements
What the user explicitly said they need. Use their words. Cite specific messages.

### Bucket 2: Inferred Requirements
What logically follows from stated requirements. Every inference must include:
- The stated requirement it derives from
- The reasoning chain
- A confidence level using discrete anchors:

| Anchor | Confidence | Behavioral Description |
|--------|-----------|----------------------|
| **100** | Certain | Directly stated by the user; no inference needed. |
| **75** | High | Follows directly from a stated requirement with a single logical step. |
| **50** | Moderate | Follows from stated requirements but requires ≥2 logical steps or one unvalidated assumption. |
| **25** | Low | Plausible given context but depends on multiple unvalidated assumptions. |
| **0** | Speculative | Pure conjecture; included for completeness but must be flagged to the user for explicit confirmation. |

### Bucket 3: Out of Scope (Explicitly)
What the user said they do NOT need, PLUS what you are intentionally deferring.
Every exclusion must include a reason.

Present all three buckets to the user together. Ask: "Does this scope match
your understanding? What would you add, remove, or change?"
```

The confidence anchor table is integral to the pattern: it converts "I'm pretty sure" into a specific number with a behavioral description that tells the agent what to do at each level (present as option at 25, state as revisable at 50, commit at 75).

From `skills/bs-visual-design/SKILL.md` (Phase 1.2, scope synthesis variant):

```markdown
### 1.2 Scope synthesis

Before moving to Phase 2, present a three-bucket summary. Do not proceed until
the user confirms:

STATED (what you explicitly asked for):
  - [item 1]
  - [item 2]

INFERRED (what I'm assuming based on context):
  - [item 1]
  - [item 2]

OUT OF SCOPE (what I'm NOT designing):
  - [item 1]
  - [item 2]

Reply "go" to proceed, or adjust any bucket.
```

Visual design adapts the pattern for a design context — the buckets are Stated/Inferred/Out of Scope but without the full confidence anchor table, which is deferred to Phase 2's design-direction decisions.

## Related patterns

- [`rigor-gap`](../02-interaction-design/rigor-gap.md) — gap detection finds what is missing; scoping synthesis organizes what was found
- [`one-question-at-a-time`](../02-interaction-design/one-question-at-a-time.md) — the questions that fill the gaps happen before the synthesis
- [`confidence-anchors`](../03-quality-assurance/confidence-anchors.md) — the discrete confidence scale used on inferred requirements in the synthesis
- [`pipeline-architecture`](../05-task-routing/pipeline-architecture.md) — the three-bucket synthesis is the artifact that gates the transition from discovery to execution in a pipeline
