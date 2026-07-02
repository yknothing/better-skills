---
name: tdd-skill-creation
chinese_name: TDD 技能创建
category: skill-creation
sources:
  - Superpowers
description: Apply the RED-GREEN-REFACTOR loop to skill creation: write test prompts first (RED), build the skill until prompts pass (GREEN), then tighten constraints to close loopholes (REFACTOR).
also_named_as: []
status: active
---

# TDD 技能创建 · TDD Skill Creation

> **Category**: 08. 技能创建模式
> **Sources**: Superpowers
> **Status**: active

## What this pattern is

The classic RED-GREEN-REFACTOR loop, applied to skills instead of code. **RED**: write test prompts that the skill should handle, and predict (or verify) that a skill-less agent would fail them. **GREEN**: build the skill body — workflow, gates, hard rules — until the test prompts produce the expected behavior. **REFACTOR**: read the skill with adversarial intent, tighten vague language, close loopholes, and audit exit conditions. The test prompts are written before the skill body, establishing a baseline that the completed skill must outperform.

## Why it works

Without TDD, skill authors write the skill body first and then (maybe) test it. This reverses the polarity: the test prompts define what "correct" means before the skill exists, so the skill is shaped by its requirements, not by the author's assumptions about what should work. The adversarial REFACTOR phase is especially important for skills — a lazy agent will find every loophole, and the only way to close them is to read with adversarial intent.

## When to use it

- Every new skill creation. This is a required pattern in `skill-bootstrap` Step 5.
- When modifying an existing skill — write new test prompts for the change before modifying the body.
- When auditing a skill for quality — the test prompts are the benchmark.

Skip it only for trivially short skills (under 30 lines) where the entire body is the test.

## Used by

- `skill-bootstrap` — Hard Rule 7: "TDD for skills: RED (write test prompts first, confirm they fail without the skill) → GREEN (write the skill, run validation, confirm prompts now succeed) → REFACTOR (tighten constraints, close loopholes, add edge case handling)." Step 5 invokes `references/tdd-for-skills.md` for the full RED-GREEN-REFACTOR procedure.

## Examples

From `skills/skill-bootstrap/references/tdd-for-skills.md`, the RED phase:

```markdown
### RED Phase — Baseline Verification

1. Write 3 test prompts that the new skill should handle. Each prompt must
   cover a distinct category:

   | Category | What it tests |
   |----------|--------------|
   | **Happy path** | The skill's core workflow. A straightforward, well-formed
                      request that exercises the full pipeline. |
   | **Edge case** | Ambiguous, incomplete, or boundary inputs. Tests the
                    skill's clarifying questions and error handling. |
   | **Adversarial** | A request that tries to bypass the skill's constraints.
                      Tests Hard Rules enforcement. |

2. **Control-prompt comparison:** Write a "naive" version of the task prompt
   — the kind of request a user would make without knowing the skill exists.
   Predict what a skill-less agent would miss.
```

The full procedure (RED-GREEN-REFACTOR, control-prompt comparison, adversarial loophole audit) lives in `skills/skill-bootstrap/references/tdd-for-skills.md`.

## Related patterns

- [`hard-rules-first`](../01-behavior-constraint/hard-rules-first.md) — the adversarial test prompt in RED phase specifically targets the Hard Rules block
- [`anti-pattern-pre-naming`](../01-behavior-constraint/anti-pattern-pre-naming.md) — the REFACTOR phase closes loopholes; anti-pattern-pre-naming gives those loopholes names
- [`pattern-library`](../07-knowledge-management/pattern-library.md) — tdd-skill-creation selects patterns from the library during the GREEN phase
- [`minimal-precision`](../08-skill-creation/minimal-precision.md) — tdd-skill-creation is the methodology; minimal-precision is one design philosophy that methodology can produce
- [`exhaustive-precision`](../08-skill-creation/exhaustive-precision.md) — the opposite design philosophy; both are valid outcomes of the same TDD methodology
