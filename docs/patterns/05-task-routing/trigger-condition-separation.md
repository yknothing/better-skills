---
name: trigger-condition-separation
chinese_name: 触发条件分离
category: task-routing
sources:
  - Anthropic
  - Superpowers
description: The skill description field states only the trigger condition (when to use), never a workflow summary — following the CSO principle (Condition, not Summary or Objective).
also_named_as: []
status: proposed
---

# 触发条件分离 · Trigger-Condition Separation

> **Category**: 05. 任务路由模式
> **Sources**: Anthropic, Superpowers
> **Status**: proposed

## What this pattern is

The `description` frontmatter field of a SKILL.md must state only the activation condition — when the agent should use this skill. It must not summarize the workflow, list the skill's capabilities, or state the objective. The rule (from Anthropic's CSO principle) is: Condition, not Summary or Objective.

A good description reads: "Use when the user wants to implement a feature, fix a bug, or make a code change from a spec." A bad one reads: "This skill helps you implement features using TDD with worktree isolation and automated review."

## Why it works

The agent reads the description field to decide whether to load the skill. If the description contains workflow detail, the agent must parse it to find the activation condition — adding latency and ambiguity. A pure condition is immediately machine-matchable: "Does this conversation match this condition? Yes/No." The workflow belongs in the body, after the skill is loaded.

## When to use it

- Every skill. This is a universal pattern for the `description` field.
- Especially important for skills with complex multi-phase workflows — the description is not the place to summarize them.
- Skills that might be confused with each other — a clean condition-only description makes the routing decision unambiguous.

Skip it nowhere. This is a lint rule, not an optional style choice.

## Used by

No active references yet — extracted from Anthropic and Superpowers.

## Examples

Extracted from Anthropic, Superpowers; no in-repo example yet.

## Related patterns

- [`multi-signal-trigger`](../05-task-routing/multi-signal-trigger.md) — the activation signals that feed into the condition check
- [`pipeline-architecture`](../05-task-routing/pipeline-architecture.md) — trigger-condition separation ensures the pipeline's entry point is unambiguous
- [`task-domain-classification`](../05-task-routing/task-domain-classification.md) — domain classification happens after the condition fires
