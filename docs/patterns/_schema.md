# Pattern File Schema

Every pattern in this library lives in its own file under `docs/patterns/<NN-category-slug>/<pattern-slug>.md`. This schema is the contract for those files. Tools (`tools/check-patterns.sh`, the future `validate.sh` in Phase 2.A, and the Pattern Alignment grader in Phase 2.C) parse pattern files using this contract.

## File location

```
docs/patterns/<NN>-<category-slug>/<pattern-slug>.md
```

- `NN` is the two-digit category number (`01`–`08`).
- `<category-slug>` is the kebab-case category name.
- `<pattern-slug>` is the pattern's canonical kebab-case identifier — the **same string** that appears in `skills.json` under any skill's `patterns:` array.

## Categories (canonical)

| NN | Slug | Chinese name | English name |
|----|------|--------------|--------------|
| 01 | `behavior-constraint`   | 行为约束模式 | Behavior Constraint |
| 02 | `interaction-design`    | 交互设计模式 | Interaction Design |
| 03 | `quality-assurance`     | 质量保证模式 | Quality Assurance |
| 04 | `context-management`    | 上下文管理模式 | Context Management |
| 05 | `task-routing`          | 任务路由模式 | Task Routing |
| 06 | `execution-control`     | 执行控制模式 | Execution Control |
| 07 | `knowledge-management`  | 知识管理模式 | Knowledge Management |
| 08 | `skill-creation`        | 技能创建模式 | Skill Creation |

## Required frontmatter

```yaml
---
name: format-significance-gates              # kebab-case; must match filename
chinese_name: 格式显著性门禁                  # original Chinese label from the source index
category: behavior-constraint                # one of the 8 canonical slugs above
sources:                                     # list of source-attribution short codes (see /docs/patterns/README.md "Sources")
  - Anthropic
description: >                               # one-sentence English summary, ≤200 chars
  Use XML tags or all-caps to create visually unmissable barriers an agent cannot skim past.
also_named_as: []                            # optional: list of alternate names (Chinese or English) merged into this pattern
status: active                               # active | deprecated | proposed
---
```

### Field reference

- **`name`** (string, required) — kebab-case canonical id. Must equal the filename without `.md`. This is what `skills.json` references.
- **`chinese_name`** (string, required) — original Chinese name from the source `docs/patterns/README.md` index. Allows tooling to cross-link.
- **`category`** (string, required) — one of the 8 canonical slugs in the table above.
- **`sources`** (list of strings, required) — short codes from the Sources table in `docs/patterns/README.md`. Examples: `Anthropic`, `CE`, `Cursor`, `Gstack`, `Vercel`, `Superpowers`, `Karpathy`, `Taste Skill`, `Open Design`, `Addy Osmani`.
- **`description`** (string, required) — one English sentence (≤200 chars). The fuller explanation goes in the body.
- **`also_named_as`** (list of strings, optional) — alternate names this pattern was historically called. Lets the canonical pattern absorb redundancy without breaking older references.
- **`status`** (string, required) — `active` (in use), `deprecated` (kept for history but new skills should not reference), `proposed` (extracted from research but not yet validated by a real skill).

## Required body sections

```markdown
# <chinese_name> · <Pretty English Name>

> **Category**: <NN. Chinese category name>
> **Sources**: <comma-separated source codes>
> **Status**: <active|deprecated|proposed>

## What this pattern is

<2-4 sentences explaining the pattern in plain English. Define the problem it solves and the shape of the solution.>

## Why it works

<1-3 sentences. The mechanism — why this specific shape produces the desired behavior.>

## When to use it

<Bullet list of contexts. Be specific about WHICH kinds of skills benefit; specificity is what makes a pattern reusable instead of a platitude.>

## Used by

<Auto-maintained list of skills referencing this pattern. Format:
- `<skill-name>` — <one-line note on how this skill applies the pattern>

If no skills reference this pattern yet (status: proposed), write: "No active references yet — extracted from <source(s)>.">

## Examples

<At least one concrete example showing the pattern in code or in a skill instruction. Optional for `proposed` status; required for `active`.>

## Related patterns

<Bullet list of related patterns with relative links:
- [`<other-pattern>`](../<NN>-<category>/<other-pattern>.md) — <relationship in 5-10 words>>
```

## Validation rules

`tools/check-patterns.sh` enforces:

1. **Filename ↔ frontmatter `name` match.** `format-significance-gates.md` must have `name: format-significance-gates` in frontmatter.
2. **Filename ↔ directory ↔ `category` match.** A file in `01-behavior-constraint/` must have `category: behavior-constraint`.
3. **`skills.json` reference resolution.** Every kebab-case string in any skill's `patterns:` array must resolve to exactly one pattern file (matching by `name` or any `also_named_as` entry). Unresolvable references are **ghost patterns** — must be fixed before merge.
4. **Orphan detection (warning, not blocker).** A pattern file with `status: active` and no `used_by` references gets flagged. Either the pattern should be downgraded to `proposed`, or a skill should be updated to reference it.
5. **Chinese-name uniqueness (within library).** No two pattern files may share the same `chinese_name` — duplicates indicate untracked merges. Use `also_named_as` to absorb alternates explicitly.

## Adding a new pattern

1. Pick the right category directory.
2. Copy [`_template.md`](./_template.md) to `<NN>-<category>/<your-pattern-slug>.md`.
3. Fill in frontmatter and body. Status starts as `proposed` if no skill uses it yet.
4. (Optional, recommended) Add the pattern to a skill's `skills.json` `patterns:` array — flips status to `active`.
5. Run `bash tools/check-patterns.sh` and fix any warnings before committing.

## Deprecating a pattern

1. Change `status` to `deprecated`.
2. Add a `## Deprecation note` section explaining why and what to use instead.
3. Search `skills.json` for references and migrate them. Run `bash tools/check-patterns.sh` to confirm no active skill still references it.
4. The file stays in place — history matters; deletion would break `also_named_as` resolution for older skill versions.
