---
name: execution-posture-signals
chinese_name: 执行姿态信号
category: execution-control
sources:
  - CE
  - Superpowers
description: Emit lightweight signals (e.g., "Writing failing test for [criterion]") at each phase transition so the user can track the agent's position in the pipeline without reading the full workflow.
also_named_as: []
status: active
---

# 执行姿态信号 · Execution Posture Signals

> **Category**: 06. 执行控制模式
> **Sources**: CE, Superpowers
> **Status**: active

## What this pattern is

At each phase transition in a multi-step workflow, the agent emits a short, standardized signal — a one-line status message that tells the user exactly where the agent is in the pipeline and what it is doing. The signals are lightweight (not full progress reports) and use a consistent format so the user learns to parse them at a glance.

The signals serve two functions: (1) the user can track progress without re-reading the workflow, and (2) the agent is forced to explicitly acknowledge which phase it is entering, reducing phase-skipping.

## Why it works

Multi-phase workflows create a transparency problem: the user sees output but doesn't know which phase produced it. Is the agent still understanding the task, or has it started implementing? Posture signals solve this by making phase transitions visible. They also create an accountability mechanism — if the agent claims to be in RED but hasn't written a test, the contradiction is immediately visible.

## When to use it

- Any skill with 3+ phases where the user needs to track progress.
- Skills where phase-skipping is a known failure mode (the signal makes skipping self-documenting).
- Skills used by agents that tend to rush — the signal forces a momentary pause to declare position.

Skip it for single-phase skills or skills where the output itself makes the phase obvious.

## Used by

- `bs-dev-flow` — Execution Posture Signals table maps each signal string to its pipeline phase: "Writing failing test for [criterion]" → Phase 3: RED, "Tests pass. Running full suite." → GREEN confirmed, "Committing: [type]: [summary]" → Phase 7.

## Examples

From `skills/bs-dev-flow/SKILL.md`:

```markdown
## Execution Posture Signals

Throughout this workflow, maintain these signals so the user can track your
position in the pipeline:

| Signal | Meaning |
|--------|---------|
| "Writing failing test for [criterion]" | Phase 3: RED |
| "Test fails as expected: [error]" | RED confirmed |
| "Implementing minimal change to pass test" | Phase 4: GREEN |
| "Tests pass. Running full suite." | GREEN confirmed |
| "Refactoring: [specific change]" | Phase 5 |
| "Self-reviewing diff" | Phase 6 |
| "Committing: [type]: [summary]" | Phase 7 |
```

Each signal is a short, imperative-form string the agent emits at the start of each phase transition.

## Related patterns

- [`pipeline-architecture`](../05-task-routing/pipeline-architecture.md) — posture signals are the visibility layer on top of a pipeline
- [`continuous-execution`](../06-execution-control/continuous-execution.md) — continuous execution relies on posture signals to keep the user informed without pausing
- [`freedom-spectrum`](../06-execution-control/freedom-spectrum.md) — posture signals communicate the current freedom zone implicitly (RED = low freedom, UNDERSTAND = higher freedom)
