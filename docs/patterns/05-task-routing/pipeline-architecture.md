---
name: pipeline-architecture
chinese_name: 管道架构
category: task-routing
sources:
  - CE
  - Anthropic
description: Structure a skill as an upstream-to-downstream chain of phases, each producing a durable artifact consumed by the next, so the agent never loses context between stages.
also_named_as: []
status: active
---

# 管道架构 · Pipeline Architecture

> **Category**: 05. 任务路由模式
> **Sources**: CE, Anthropic
> **Status**: active

## What this pattern is

A skill is structured as a linear pipeline: Phase 1 produces an artifact (e.g., acceptance criteria), Phase 2 consumes that artifact to produce the next (e.g., a worktree), and so on. Each phase has a hard gate — the agent cannot proceed to Phase N+1 until Phase N's artifact is produced and verified. The pipeline is visualized at the top of the skill as an ASCII diagram so the agent always knows its position.

The phases are named imperatively (UNDERSTAND, SETUP, RED, GREEN, REFACTOR) and each phase ends with an explicit gate condition ("Do not proceed to Phase N+1 until X").

## Why it works

Agents without pipeline structure tend to skip steps under pressure — "I understand the task, I'll just start coding." A hard-gated pipeline removes the decision: the gate is a binary check, not a judgment call. The ASCII diagram provides spatial navigation; the agent can look at the overview and locate itself without re-reading the full workflow.

## When to use it

- Multi-step workflows where step ordering is non-negotiable (TDD, deployment, code review).
- Skills where skipping a step has high failure cost (security checks, test writing, approval gates).
- Skills long enough (>100 lines) that the agent could lose positional context mid-execution.

Skip it for single-step skills or skills where the order of operations is genuinely flexible.

## Used by

- `bs-sw-master` — Pipeline Overview section with ASCII diagram: UNDERSTAND → SETUP → [RED → GREEN → REFACTOR → REVIEW-DIFF → COMMIT] loop → FINALIZE. Each phase has a HARD-GATE.

## Examples

From `skills/bs-sw-master/SKILL.md`:

```markdown
## Pipeline Overview

Each phase produces a durable artifact that the next phase consumes.

```
UNDERSTAND → SETUP → ┌──────────────────────────────────────────┐
                      │  RED → GREEN → REFACTOR → REVIEW-DIFF → COMMIT
                      └──────────────────────────────────────────┘
                                         ↓ (all criteria done)
                                      FINALIZE
```

The loop (RED → GREEN → REFACTOR → REVIEW-DIFF → COMMIT) repeats for each slice
until the task is complete, then FINALIZE prepares the work for review.
```

Each phase ends with an explicit gate:
```markdown
**HARD-GATE**: Do not proceed to Phase 2 until you have written acceptance criteria
AND a file manifest. If either is missing, stay in Phase 1.
```

## Related patterns

- [`depth-tiers`](../05-task-routing/depth-tiers.md) — pipeline depth varies by tier; deep-tier skills have more gates
- [`task-domain-classification`](../05-task-routing/task-domain-classification.md) — domain classification determines which pipeline variant to use
- [`execution-posture-signals`](../06-execution-control/execution-posture-signals.md) — the signals the agent emits to mark its position in the pipeline
- [`model-tiering`](../06-execution-control/model-tiering.md) — different pipeline stages can be routed to different model strengths
