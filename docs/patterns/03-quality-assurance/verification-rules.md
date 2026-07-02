---
name: verification-rules
chinese_name: 验证规则 + 自动路由
category: quality-assurance
sources:
  - Vercel
description: Each verification check includes a defined pass/fail condition and an auto-routed fix recommendation, forming a self-service repair pipeline.
also_named_as: []
status: active
---

# 验证规则 + 自动路由 · Verification Rules + Auto-Routing

> **Category**: 03. 质量保证模式
> **Sources**: Vercel
> **Status**: active

## What this pattern is

Verification checks are structured as triples: (1) a specific, falsifiable rule with a pass/fail condition, (2) a concrete check command (often a `grep` or file-existence test), and (3) a recommended fix route that tells the agent exactly what action to take on failure. This transforms "find problems" into "find problems and route to their fix."

The rules are organized into categories (frontmatter verification, reference integrity, pattern correctness, registry integrity), each containing multiple check-fix pairs. The output format is standardized: `[PASS]`, `[FAIL] → Recommended fix:`, `[WARN] → Note:`.

## Why it works

A finding without a fix route leaves the agent to improvise a repair — and improvisation under time pressure is where errors compound. By pre-specifying the fix for each known failure mode, the pattern converts verification from a gate into a self-service repair pipeline. The agent doesn't need to figure out *how* to fix a missing `name` field; the rule already says "Add `name:` to frontmatter."

## When to use it

- Automated quality checks where failures have known, repeatable fixes.
- CI/CD-style skill validation pipelines.
- Meta-skills that audit other skills (like skill-health).

Skip it for checks where the fix is genuinely non-deterministic and requires human judgment.

## Used by

- `skill-health` — Phase 3 (VERIFICATION) implements four categories of verification rules: Frontmatter Verification (5 rules), Reference Integrity (4 rules), Pattern Correctness (3 rules), and skills.json Integrity (4 rules). Each rule has a Check column and a Fix Route column, with standardized `[PASS]/[FAIL]/[WARN]` output.

## Examples

From `skills/skill-health/references/phase-3-verification.md`:

```markdown
### Frontmatter Verification

| Rule | Check | Fix Route |
|------|-------|-----------|
| `name` field exists | `grep '^name:' SKILL.md` | Add `name:` to frontmatter |
| `name` is kebab-case | Validate against `/^[a-z][a-z0-9-]*$/` | Rename to kebab-case |
| `description` field exists | `grep '^description:' SKILL.md` | Add `description:` to frontmatter |
| Description ≥ 10 words | Word-count check | Expand description |
| No empty fields | Check for `: $` or `: ""` | Fill or remove |

### Output Format

For each check, report:
[PASS] Rule description
[FAIL] Rule description → Recommended fix: <action>
[WARN] Rule description → Note: <observation>
```

## Related patterns

- [`two-layer-testing`](../03-quality-assurance/two-layer-testing.md) — verification-rules is the static (free) layer; two-layer-testing adds a dynamic (paid) layer
- [`self-review-checklist`](../03-quality-assurance/self-review-checklist.md) — self-review is manual and judgment-based; verification-rules is automated and rule-based
- [`tiered-anti-pattern-rules`](../03-quality-assurance/tiered-anti-pattern-rules.md) — complementary: verification-rules checks structural compliance; tiered rules check anti-pattern severity
