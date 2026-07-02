---
name: pattern-library
chinese_name: 模式库
category: knowledge-management
sources:
  - CE
description: Maintain a curated library of reusable patterns extracted from multiple solutions, so agents can select and compose proven approaches instead of reinventing them.
also_named_as:
  - pattern library integration
status: active
---

# 模式库 · Pattern Library

> **Category**: 07. 知识管理模式
> **Sources**: CE
> **Status**: active

## What this pattern is

A pattern library is a curated catalog of reusable design patterns, each documented with a canonical name, a description of the problem it solves, why the solution works, when to use it, and concrete examples. Patterns are organized by category and referenced by skills via their canonical slug. The library itself is the artifact: a directory of `.md` files, each one pattern, with a `README.md` index. Skills select patterns from the library rather than inventing approaches from scratch.

This is a meta-pattern: the `docs/patterns/` directory in this repository is a living instance of this pattern applied to agent skill design.

## Why it works

Patterns encode "what worked" across multiple solutions. Without a library, each skill author rediscovers the same patterns through trial and error — or worse, ships skills without any patterns at all. A library makes pattern selection a first-class step in skill creation (see `skill-bootstrap` Step 3), ensuring every skill benefits from accumulated experience. The library also enables automated validation: tools can check that every pattern referenced in `skills.json` resolves to a real file.

## When to use it

- Any project that produces more than 3 skills — the library pays for itself by preventing pattern rediscovery.
- When skills need cross-validation: are two skills using the same pattern correctly? The library is the source of truth.
- When you want tooling to enforce pattern usage (orphan detection, ghost reference resolution, deprecation tracking).

Skip it for single-skill projects where the overhead of a library exceeds the benefit.

## Used by

- `skill-bootstrap` — Step 3 requires selecting 3-5 patterns from `docs/patterns/README.md` with explicit rationale and source attribution. The skill itself lists "Pattern library integration" as a required pattern.

## Examples

From `skills/skill-bootstrap/SKILL.md`, Step 3:

```markdown
### Step 3: Select Patterns from the Library

Open `docs/patterns/README.md`. Select 3-5 patterns that apply to this skill.
For each pattern, write a one-line rationale explaining why it fits this
specific skill. Include the source in parentheses.

Required patterns (these must be considered for every new skill):
- **TDD for skills** (Superpowers): The RED → GREEN → REFACTOR loop applied
  to skill creation.
- **Progressive disclosure** (Anthropic/CE): The SKILL.md frontmatter is
  tier-1, the body is tier-2, referenced files are tier-3.
- **Hard rules first** (Cursor): Non-negotiable constraints appear before the
  workflow description.

Strongly recommended patterns (select at least one):
- **Pattern library integration** (CE): The skill should know how to read and
  apply patterns from `docs/patterns/README.md`.
```

The pattern library itself — `docs/patterns/` — is the living example: 59 patterns across 8 categories, each in a standalone `.md` file with frontmatter, canonical slug, source attribution, and cross-references. Every file follows `_schema.md` and `_template.md`.

## Related patterns

- [`knowledge-distillation-pipeline`](../07-knowledge-management/knowledge-distillation-pipeline.md) — the pipeline feeds raw material into the pattern library; the library generalizes captured insights into reusable patterns
- [`concept-glossary`](../07-knowledge-management/concept-glossary.md) — both are structured knowledge artifacts; glossary captures domain vocabulary, library captures design patterns
- [`tdd-skill-creation`](../08-skill-creation/tdd-skill-creation.md) — pattern-library provides the patterns that tdd-skill-creation selects from during the GREEN phase
