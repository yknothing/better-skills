---
name: knowledge-distillation-pipeline
chinese_name: 知识沉淀管道
category: knowledge-management
sources:
  - CE
description: A structured two-track pipeline that captures problem-solving knowledge (Bug track) and generalizable insights (Knowledge track) into durable, searchable artifacts.
also_named_as: []
status: proposed
---

# 知识沉淀管道 · Knowledge Distillation Pipeline

> **Category**: 07. 知识管理模式
> **Sources**: CE
> **Status**: proposed

## What this pattern is

A structured pipeline that converts ad-hoc problem-solving into durable knowledge. Instead of letting solutions evaporate after a task completes, the pipeline splits capture into two tracks: a **Bug track** for specific issue resolutions (symptoms, root cause, fix) and a **Knowledge track** for generalizable insights (patterns, principles, rules). Each track produces artifacts stored in a standard location (`docs/bugs/`, `docs/knowledge/`), making them searchable and reusable across sessions.

## Why it works

Ad-hoc note-taking fails because there is no trigger to capture and no standard format to store. A two-track pipeline provides both: the trigger is the task completion gate (you must produce an artifact before closing), and the format ensures the artifact is machine-searchable. Splitting Bug from Knowledge prevents the common failure where general principles get buried inside specific bug reports.

## When to use it

- Any skill that produces knowledge worth reusing across sessions (debugging, design decisions, architecture rationales).
- Projects where the same problems recur because solutions are not recorded.
- Skills with a completion gate — the pipeline inserts a "capture artifact" step before the gate closes.

Skip it for one-shot tasks where the solution is genuinely not reusable.

## Used by

No active references yet — extracted from CE.

## Examples

Extracted from CE; no in-repo example yet.

## Related patterns

- [`pattern-library`](../07-knowledge-management/pattern-library.md) — knowledge-distillation-pipeline feeds the pattern library with raw material; pattern-library generalizes captured insights into reusable patterns
- [`concept-glossary`](../07-knowledge-management/concept-glossary.md) — the Knowledge track captures domain concepts that populate the glossary
- [`cross-session-decision-memory`](../07-knowledge-management/cross-session-decision-memory.md) — both persist knowledge across sessions; distillation-pipeline is pull (you extract), decision-memory is push (decisions auto-append)
