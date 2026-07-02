---
name: cross-session-decision-memory
chinese_name: 跨会话决策记忆
category: knowledge-management
sources:
  - Gstack
description: An append-only, event-sourced decision log (decisions.jsonl) that persists why-choices across sessions, so agents do not re-litigate settled decisions.
also_named_as: []
status: proposed
---

# 跨会话决策记忆 · Cross-Session Decision Memory

> **Category**: 07. 知识管理模式
> **Sources**: Gstack
> **Status**: proposed

## What this pattern is

An append-only log file (`decisions.jsonl`) where every significant design or architectural decision is recorded as an immutable event: what was decided, when, by whom, what alternatives were considered, and why this choice won. Each entry is a single JSON line — append-only, never overwritten — creating an event-sourced audit trail. New sessions read the log to discover what has already been decided, preventing re-litigation of settled questions.

## Why it works

Agents are stateless across sessions. Without a decision log, every new session rediscovers the same tradeoffs from scratch — or worse, makes different choices and creates inconsistency. Append-only JSONL is the simplest format that is both human-readable and machine-parseable; event sourcing means the full decision history is preserved (you can see when a decision was reversed, and why), and the append-only constraint prevents accidental corruption.

## When to use it

- Projects where design decisions span multiple sessions and consistency matters.
- When the same tradeoff discussions recur (monorepo vs polyrepo, which database, which framework).
- Skills that produce durable artifacts (requirements documents, architecture decisions) — the log is the artifact of "why we chose this."

## Used by

No active references yet — extracted from Gstack.

## Examples

Extracted from Gstack; no in-repo example yet.

## Related patterns

- [`knowledge-distillation-pipeline`](../07-knowledge-management/knowledge-distillation-pipeline.md) — both persist knowledge across sessions; decision-memory is push (decisions auto-append), distillation-pipeline is pull (you extract insights)
- [`knowledge-graph-linking`](../07-knowledge-management/knowledge-graph-linking.md) — decisions can reference the knowledge graph to explain why a particular skill routing was chosen
- [`concept-glossary`](../07-knowledge-management/concept-glossary.md) — decisions reference glossary terms to ensure the rationale is interpretable across sessions
