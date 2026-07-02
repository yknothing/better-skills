---
name: karpathy-behavior-guardrails
chinese_name: Karpathy 行为护栏
category: behavior-constraint
sources:
  - Karpathy
description: Embed four core principles — think before coding, simplicity first, surgical changes, goal-driven execution — as persistent constraints that override task-level instructions.
also_named_as: []
status: proposed
---

# Karpathy 行为护栏 · Karpathy Behavior Guardrails

> **Category**: 01. 行为约束模式
> **Sources**: Karpathy
> **Status**: proposed

## What this pattern is

Karpathy behavior guardrails are a compact set of meta-level constraints derived from Andrej Karpathy's coding agent guidelines: **Think before coding** (reason step-by-step before writing code), **Simplicity first** (prefer the simplest solution that satisfies the requirements), **Surgical changes** (make the smallest possible edit, avoid scope creep), and **Goal-driven execution** (the goal determines the approach, not the other way around). These are not task-specific instructions; they are persistent behavioral defaults that override any single-task impulse.

The pattern sits at the same elevation as [`hard-rules-first`](../01-behavior-constraint/hard-rules-first.md) — both are constraint blocks that precede workflow instructions — but Karpathy guardrails target **general agent posture** (how the agent approaches any task) rather than **skill-specific prohibitions** (what this particular skill must never do).

## Why it works

These four principles address the most common failure modes of coding agents: jumping to implementation before understanding (Think before coding), over-engineering (Simplicity first), making changes beyond the stated scope (Surgical changes), and losing sight of the objective mid-execution (Goal-driven execution). By encoding them as persistent, non-negotiable guardrails — not as suggestions or guidelines — the agent treats them as hard constraints that override situational impulses.

## When to use it

- Any skill that involves code generation or modification where the agent might over-engineer or scope-creep.
- Skills used in large codebases where surgical precision is critical to avoid unintended side effects.
- Skills that execute autonomously (headless mode) where no human is available to catch drift.

Skip it for skills where the action space is too narrow for these guardrails to be meaningful (e.g., pure-text editing, format conversion).

## Used by

No active references yet — extracted from Karpathy's agent behavior guidelines.

## Examples

Extracted from Karpathy's coding agent guidelines; no in-repo example yet — see Karpathy's agent behavior documentation for reference implementation.

## Related patterns

- [`hard-rules-first`](../01-behavior-constraint/hard-rules-first.md) — similar constraint density; Karpathy guardrails are a specific instantiation of the hard-rules-first pattern
- [`precise-terminal-states`](../01-behavior-constraint/precise-terminal-states.md) — goal-driven execution requires knowing what "done" looks like
- [`minimal-precision`](../08-skill-creation/minimal-precision.md) — Cursor's minimal-precision philosophy (fewest lines to do the job) aligns with Karpathy's simplicity-first and surgical-changes principles
