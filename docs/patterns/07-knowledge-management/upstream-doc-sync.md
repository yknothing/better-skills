---
name: upstream-doc-sync
chinese_name: 上游文档同步
category: knowledge-management
sources:
  - Vercel
description: Automatically sync the latest information from official upstream documentation into the skill's knowledge base, so skills never reference stale docs.
also_named_as: []
status: proposed
---

# 上游文档同步 · Upstream Doc Sync

> **Category**: 07. 知识管理模式
> **Sources**: Vercel
> **Status**: proposed

## What this pattern is

A mechanism that keeps a skill's embedded knowledge current by periodically pulling from official upstream documentation sources. Instead of hardcoding API signatures, CLI flags, or configuration formats that will drift, the skill declares upstream sources and a sync strategy (on-trigger, scheduled, or manual). When the upstream docs change, the skill's knowledge updates without requiring a manual rewrite.

## Why it works

Hardcoded technical knowledge is a time bomb: API surfaces change, CLI flags get deprecated, configuration formats evolve. A skill that hardcodes `--flag-name` from the docs as of June 2026 will be silently wrong by December 2026. Upstream doc sync converts a static snapshot into a living reference — the skill always operates against the current truth.

## When to use it

- Skills that embed API references, CLI command signatures, or configuration schemas.
- Skills that reference rapidly evolving upstream projects (frameworks, platforms, tools with frequent releases).
- When the cost of stale knowledge is high (broken commands, incorrect configurations).

Skip it for skills whose knowledge domain is stable (design principles, workflow patterns, meta-skills).

## Used by

No active references yet — extracted from Vercel.

## Examples

Extracted from Vercel; no in-repo example yet.

## Related patterns

- [`knowledge-graph-linking`](../07-knowledge-management/knowledge-graph-linking.md) — both are Vercel-origin knowledge interconnection patterns; doc-sync handles vertical integration (upstream to skill), graph-linking handles horizontal (skill to skill)
- [`pattern-library`](../07-knowledge-management/pattern-library.md) — patterns themselves may reference upstream docs; doc-sync keeps those references current
- [`platform-degradation-rules`](../08-skill-creation/platform-degradation-rules.md) — when upstream docs describe features unavailable on the current platform, degradation rules define the fallback
