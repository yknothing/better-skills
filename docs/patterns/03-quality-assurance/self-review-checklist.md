---
name: self-review-checklist
chinese_name: 自我审查清单
category: quality-assurance
sources:
  - Anthropic
  - CE
description: A blocking, itemized self-review checklist executed before delivery, covering placeholder scan, consistency, scope, and ambiguity.
also_named_as: []
status: active
---

# 自我审查清单 · Self-Review Checklist

> **Category**: 03. 质量保证模式
> **Sources**: Anthropic, CE
> **Status**: active

## What this pattern is

A structured, itemized checklist the agent runs against its own output before declaring the work complete. Each item has a specific pass/fail condition — not "check quality" but "scan for any remaining `TODO` or `TKTK` markers." The checklist is blocking: any failure sends the agent back to the offending stage rather than proceeding to delivery.

The canonical structure is a table or checkbox list covering at minimum: placeholder scan, consistency check, scope verification, and ambiguity audit. Additional items are domain-specific (testability, constraint completeness, anti-pattern check).

## Why it works

Agents, like humans, are subject to completion bias — the urge to declare "done" once the main creative work is finished. A blocking checklist forces a structured re-read with specific, falsifiable criteria. "Check quality" can be satisfied by vibes; "Are there any `TODO` strings remaining?" cannot.

## When to use it

- Any skill whose output is a complex artifact (spec, design, code, illustration, prose).
- Skills with a multi-stage pipeline where errors in early stages propagate silently.
- Skills where the cost of a missed issue is high (deployment, publication, handoff to another agent).

Skip it for single-shot, low-stakes skills where the output is immediately visible and trivially verifiable.

## Used by

- `requirements-engineering` — 10-item checklist at Stage 7 (Quality Check), blocking before Stage 8 Handoff. Items: Placeholder Scan, Consistency Check, Scope Verification, Ambiguity Audit, Constraint Completeness, Gap Detection, Anti-Pattern Check, Dependency Validation, Testability Check, Handoff Readiness.
- `prose-craft` — 5-item checklist at Step 5 (Self-Review): Voice preserved, No introduced facts, Structure improved, All filler cut, Reads aloud clean.
- `skill-health` — 9-dimension health framework with structured pass/fail checks per dimension (frontmatter, reference integrity, pattern correctness, skills.json integrity).
- `article-illustrate` — 8-item checklist at Stage 4 (Quality Check): Style Match, ViewBox, No Raster Fallbacks, Scalable, Accessible, Inline Styles, Color Coherence, Semantic Elements.

## Examples

From `skills/requirements-engineering/SKILL.md`, Stage 7:

```markdown
## Stage 7: QUALITY CHECK

Before Stage 8 (Handoff), run the full 10-item checklist.
All items must pass. Any failure = back to the offending stage.

### Self-Review Checklist

| # | Check | Look for |
|---|-------|----------|
| 1 | **Placeholder Scan** | Any `TODO`, `TKTK`, `???`, `[placeholder]` remaining? |
| 2 | **Consistency Check** | Do Stage 4/5/6 all reference the same entities by the same names? |
| 3 | **Scope Verification** | Does the spec address exactly what was asked? No scope creep, no scope shrink. |
| 4 | **Ambiguity Audit** | Any sentence that could be read two ways? Any undefined terms? |
| 5 | **Constraint Completeness** | Are all Stage 3 constraints reflected in the spec? |
| 6 | **Gap Detection** | Re-run the six rigor gap detectors from Stage 1. Any new gaps? |
| 7 | **Anti-Pattern Check** | Did any of the 5 named anti-patterns surface during this run? |
| 8 | **Dependency Validation** | Do task dependencies form a DAG? Any circular dependencies? |
| 9 | **Testability Check** | Can each spec item be verified with a concrete test? |
| 10 | **Handoff Readiness** | Would another agent understand this spec without asking questions? |

Run this checklist on the complete output (Stages 4–6 artifacts). Mark each
item PASS or FAIL with a 1-line reason. FAIL items must be fixed by returning
to the relevant stage before proceeding to Handoff.
```

Each check has a specific "Look for" column — falsifiable criteria, not subjective judgments.

## Related patterns

- [`multi-perspective-review`](../03-quality-assurance/multi-perspective-review.md) — external review counterpart; self-review catches what the builder can see, multi-perspective catches what requires fresh eyes
- [`confidence-anchors`](../03-quality-assurance/confidence-anchors.md) — often paired: checklist for pass/fail gating, confidence anchors for qualitative judgment
- [`verification-rules`](../03-quality-assurance/verification-rules.md) — automated counterpart; self-review is manual, verification-rules is automated
