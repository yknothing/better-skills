---
name: concept-glossary
chinese_name: 概念词汇表
category: knowledge-management
sources:
  - CE
description: Maintain a shared project glossary (CONCEPTS.md) of domain vocabulary so agents and humans use terms consistently across skills and sessions.
also_named_as: []
status: proposed
---

# 概念词汇表 · Concept Glossary

> **Category**: 07. 知识管理模式
> **Sources**: CE
> **Status**: proposed

## What this pattern is

A shared glossary file (`CONCEPTS.md`) that defines domain-specific terms used across the project. Each entry includes the term, a concise definition, and optionally its relationship to other terms. The glossary is a single source of truth for vocabulary: when a skill says "depth tier," both the agent and the human should mean the same thing. Without a glossary, terms drift — "lightweight" means one thing in one skill and another thing in another.

## Why it works

Domain vocabulary is the substrate of all agent instructions. When terms are undefined, agents interpret them through their training distribution — which may not match the project's intent. A glossary pins each term to a specific meaning, removing a whole class of ambiguity. It also accelerates onboarding: new skills (and new contributors) start from a shared vocabulary rather than inferring meaning from scattered usage.

## When to use it

- Projects with 5+ skills that share domain concepts (tiers, gates, pipelines, phases).
- When the same term appears in multiple skills and consistency matters.
- When onboarding new contributors — the glossary is the first document they read.

Skip it for single-skill projects or projects where domain terms are so obvious that a glossary adds no value.

## Used by

No active references yet — extracted from CE.

## Examples

Extracted from CE; no in-repo example yet.

## Related patterns

- [`pattern-library`](../07-knowledge-management/pattern-library.md) — glossary captures vocabulary; pattern library captures design patterns. Together they form the knowledge backbone
- [`knowledge-distillation-pipeline`](../07-knowledge-management/knowledge-distillation-pipeline.md) — the Knowledge track of the pipeline populates the glossary with newly discovered domain terms
- [`cross-session-decision-memory`](../07-knowledge-management/cross-session-decision-memory.md) — decisions reference glossary terms to ensure consistent interpretation across sessions
