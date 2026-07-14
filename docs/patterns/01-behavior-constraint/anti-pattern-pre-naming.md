---
name: anti-pattern-pre-naming
chinese_name: 反模式预命名
category: behavior-constraint
sources:
  - Anthropic
  - CE
  - Addy Osmani
description: Give specific names to the rationalizations and shortcuts an agent is likely to use, so it can self-recognize and stop before acting on them.
also_named_as:
  - 反合理化预命名
status: active
---

# 反模式预命名 · Anti-Pattern Pre-Naming

> **Category**: 01. 行为约束模式
> **Sources**: Anthropic, CE, Addy Osmani
> **Status**: active

## What this pattern is

Predict the rationalizations the agent is statistically likely to use under pressure — *"I'll just quickly..."*, *"While I'm here, let me also..."*, *"This refactor is safe, no need to re-test"*, *"The test is obvious, I'll write it after"* — and **name them explicitly** in the skill, before they happen. The agent then has a self-recognition handle: when the rationalization arises mid-task, the named pattern fires as a stop signal.

The Chinese-source library originally split this into two near-duplicate names ("反模式预命名" emphasizing prediction, "反合理化预命名" emphasizing exhaustive listing of excuses). They are the same pattern, merged here under the canonical name; the older alternate is retained in `also_named_as` for backwards compatibility.

## Why it works

Generic warnings ("don't take shortcuts") rely on the agent recognizing in real time that *its current behavior* is a shortcut. That recognition is unreliable under task pressure. Naming the specific shortcut gives the agent a discrete pattern-match: when its own internal narrative produces a sentence like "I'll just quickly...", the named anti-pattern is already in working context, and the match is much harder to miss.

This is the same mechanism that makes `THE LILA BAN` (a [`named-anti-patterns`](../08-skill-creation/named-anti-patterns.md) instance) effective for visual design: a memorable, specific name beats a generic prohibition.

## When to use it

- Any skill where the agent will face standard pressure-shortcuts (TDD skipping, scope creep, "looks safe" refactors).
- Skills used by less-experienced agents that need explicit modeling of bad-actor behavior.
- Skills that have a long workflow with many decision points — each named anti-pattern is one decision point hardened.

Skip it for skills where the action space is too narrow for shortcuts to be meaningful.

## Used by

- `bs-requirements-engineering` — names "ASSUMPTION SMUGGLING", "RIGOR EVASION", "DEFERRAL DRIFT", "QUESTION DUMPING", "SILENCE-AS-CONSENT FALLACY".
- `bs-prose-craft` — "Red Flags — Editing Rationalizations" table maps each editing rationalization ("this sounds more professional", "the author clearly meant X") to the Hard Constraint it threatens.
- `bs-skill-health` — "Red Flags — Audit Rationalizations" table names the auditor's own shortcuts ("looks fine at a glance", "trusted repo, skip the secret scan") before they occur.

Other skills apply this pattern via the closely related [`named-anti-patterns`](../08-skill-creation/named-anti-patterns.md) (which is the bs-visual-design specialization of the same idea — naming AI aesthetic biases).

## Examples

From `skills/bs-requirements-engineering/SKILL.md`:

```markdown
## HARD RULES — READ FIRST

Violating any of these is a failure of the skill. The named anti-patterns
below are not warnings; they are stop signals.

- **ASSUMPTION SMUGGLING** — silently bridging a gap with an unstated belief.
  When you catch yourself "filling in" what the user "probably meant",
  that is smuggling. Surface the assumption as a question instead.
- **RIGOR EVASION** — hand-waving past a gap because resolving it is uncomfortable.
  Run the seven gap detectors anyway.
- **DEFERRAL DRIFT** — postponing every clarification to "later". Later is now.
- ...
```

The agent reading this skill enters Stage 1 already aware that "I'll just assume X" has a name, and that name is on the same page as the rule it would violate.

## Related patterns

- [`hard-rules-first`](../01-behavior-constraint/hard-rules-first.md) — anti-pattern names typically live inside the Hard Rules block
- [`format-significance-gates`](../01-behavior-constraint/format-significance-gates.md) — naming + visual unmissability compound
- [`named-anti-patterns`](../08-skill-creation/named-anti-patterns.md) — the design-domain specialization (THE LILA BAN, NO Inter Font); same mechanism, different domain
