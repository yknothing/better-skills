---
name: knowledge-graph-linking
chinese_name: 知识图谱关联
category: knowledge-management
sources:
  - Vercel
description: Create structured cross-references between skills (e.g., upgradeToSkill links) so the agent can navigate related capabilities as a connected knowledge graph rather than isolated tools.
also_named_as: []
status: proposed
---

# 知识图谱关联 · Knowledge Graph Linking

> **Category**: 07. 知识管理模式
> **Sources**: Vercel
> **Status**: proposed

## What this pattern is

Skills declare explicit relationships to other skills — `upgradeToSkill` for capability escalation, `relatedSkill` for complementary tools, `predecessorSkill` for pipeline sequencing. These links form a knowledge graph that agents can traverse at runtime: when a skill hits its boundary, the graph tells the agent which skill to hand off to, rather than leaving it to guess or ask the user. The graph is machine-readable (structured in `skills.json` or equivalent registry), enabling tooling to detect cycles, orphans, and broken links.

## Why it works

Without explicit links, skill handoffs rely on the agent's training knowledge or the user's manual routing — both fragile. A declared graph makes routing deterministic: "this skill's boundary is X; when X is reached, invoke Y." It also enables automated integrity checks (no cycles, no dead ends, every `upgradeToSkill` target exists).

## When to use it

- Multi-skill toolkits where skills form pipelines or escalation chains.
- When a skill's Handoff section names specific target skills — those names should be machine-readable links, not prose.
- When you want tooling to validate that the skill ecosystem is a DAG, not a tangle.

## Used by

No active references yet — extracted from Vercel.

## Examples

Extracted from Vercel; no in-repo example yet.

## Related patterns

- [`upstream-doc-sync`](../07-knowledge-management/upstream-doc-sync.md) — both are Vercel-origin knowledge interconnection patterns; graph-linking handles horizontal (skill-to-skill), doc-sync handles vertical (upstream-to-skill)
- [`cross-session-decision-memory`](../07-knowledge-management/cross-session-decision-memory.md) — decisions can reference the knowledge graph to route outcomes to the right skill
- [`pipeline-architecture`](../05-task-routing/pipeline-architecture.md) — knowledge-graph-linking provides the declarative map; pipeline-architecture provides the procedural execution of that map
