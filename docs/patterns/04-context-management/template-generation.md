---
name: template-generation
chinese_name: 模板生成
category: context-management
sources:
  - Gstack
description: Generate SKILL.md from a template + config rather than hand-authoring every skill, ensuring structural consistency across a skill library.
also_named_as: []
status: proposed
---

# 模板生成 · Template Generation

> **Category**: 04. 上下文管理模式
> **Sources**: Gstack
> **Status**: proposed

## What this pattern is

Skills are generated from a template engine rather than hand-authored from scratch. A template file (`.tmpl`) defines the structural skeleton — frontmatter fields, required sections, standard phrasing — and a configuration file supplies the skill-specific values (name, description, pipeline phases, patterns). A generation script (e.g., `gen-skill-docs.ts`) compiles the template + config into the final `SKILL.md`. This ensures every skill in a library shares the same structure, phrasing conventions, and quality baseline.

## Why it works

Hand-authoring skills at scale leads to structural drift: one skill uses `## HARD RULES` while another uses `## Constraints`, one uses a table for its pipeline while another uses a list. Template generation eliminates this variance at the source. When a structural improvement is made to the template, all skills can be regenerated — a single change propagates everywhere.

## When to use it

- Skill libraries with 10+ skills where structural consistency matters.
- Projects where multiple authors contribute skills and need a shared baseline.
- Skills that follow a highly regular structure (pipeline with numbered phases, standard sections).

Skip it for one-off skills or libraries with fewer than 5 skills where template overhead exceeds the consistency benefit.

## Used by

No active references yet — extracted from Gstack (code-generation-based skill authoring).

## Examples

Extracted from Gstack; no in-repo example yet.

## Related patterns

- [`progressive-disclosure`](../04-context-management/progressive-disclosure.md) — template-generated skills can bake progressive disclosure into their structure by default
- [`context-as-commons`](../04-context-management/context-as-commons.md) — templates enforce conciseness by pre-defining what sections exist and how long they should be
- [`load-stub`](../04-context-management/load-stub.md) — templates can auto-generate load stubs for every `references/` link
