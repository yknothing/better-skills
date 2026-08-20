---
name: named-anti-patterns
chinese_name: 命名禁止模式
category: skill-creation
sources:
  - Taste Skill
description: Give memorable, specific names to AI aesthetic biases (THE LILA BAN, NO INTER FONT) so the agent can self-detect and stop before producing generic AI-generated design.
also_named_as: []
status: active
---

# 命名禁止模式 · Named Anti-Patterns

> **Category**: 08. 技能创建模式
> **Sources**: Taste Skill
> **Status**: active

## What this pattern is

Identify the specific aesthetic biases that AI models default to — purple-to-blue gradients, Inter font, three-column icon cards, lorem ipsum, generic placeholder names — and give each one a memorable, specific name. These names become detection handles: the skill can include a HARD-GATE that says "check for THE LILA BAN," and the agent knows exactly what to scan for. Each named anti-pattern includes a detection signal (how to recognize it) and a fix (what to do instead), so the agent can self-correct without re-reading the full skill.

## Why it works

Generic prohibitions ("don't produce AI-looking design") are too vague to act on — the agent does not know what "AI-looking" means because it IS an AI. Named anti-patterns solve this by making each bias concrete and testable: "is your primary color purple? That's THE LILA BAN." The memorable name also acts as a mnemonic — once an agent has been told about THE LILA BAN, it is more likely to catch itself than if told "avoid purple-dominated palettes."

This is the same mechanism as [`anti-pattern-pre-naming`](../01-behavior-constraint/anti-pattern-pre-naming.md), applied to a different domain: anti-pattern-pre-naming targets behavioral shortcuts (ASSUMPTION SMUGGLING, RIGOR EVASION), while named-anti-patterns targets aesthetic biases (THE LILA BAN, NO INTER FONT). Both work by giving the agent a name it can self-recognize.

## When to use it

- Visual design skills where the agent's training distribution pulls toward generic AI aesthetics.
- Any skill where the agent has known default biases that produce low-quality output.
- When you want a HARD-GATE that the agent can self-check without human review.

Skip it for skills where the output domain is not visual or where AI biases are not a known failure mode.

## Used by

- `bs-ui-master` — `## HARD-GATE: Anti-Pattern Detection` lists 7 named anti-patterns: THE LILA BAN (purple-to-blue gradients), NO INTER FONT, NO 3-COLUMN CARD LAYOUTS, NO GENERIC NAMES, NO LOREM IPSUM, NO DUAL-TONE GRADIENT HERO, NO EMOJI AS FUNCTIONAL ICONS. Each includes a detection signal and a fix. Phase 9.2 re-scans for all 7 during Visual QA.

## Examples

From `skills/bs-ui-master/SKILL.md`:

```markdown
## HARD-GATE: Anti-Pattern Detection

The following named anti-patterns are banned. If you detect yourself using any
of them, STOP and restart the current phase.

- **THE LILA BAN**: Purple-to-blue gradients, indigo accents, violet overlays.
  No AI-purple palette. **Detection**: your palette's only chromatic hues are
  purple, blue, indigo. **Fix**: pick any non-purple primary hue.
- **NO INTER FONT**: Inter is the default LLM font. Use literally any other
  well-designed typeface. **Detection**: Inter is your heading or body font.
  **Fix**: swap to any other well-designed typeface.
- **NO 3-COLUMN CARD LAYOUTS**: generic three-column feature cards with icons
  on top. **Detection**: three equal-width cards, each icon+title+description.
  **Fix**: vary the layout (2-column, 4-column, asymmetric, bento).
```

Each anti-pattern has a memorable name, a clear detection rule, and a specific fix — the agent can self-correct without re-reading the full 460-line skill.

## Related patterns

- [`anti-pattern-pre-naming`](../01-behavior-constraint/anti-pattern-pre-naming.md) — the same mechanism (naming lets the agent self-recognize) applied to a different domain: behavioral shortcuts vs. aesthetic biases. These are related but distinct: anti-pattern-pre-naming targets rationalizations (ASSUMPTION SMUGGLING), named-anti-patterns targets design defaults (THE LILA BAN). Both live in the Hard Rules block of their respective skills
- [`80-20-design-rules`](../08-skill-creation/80-20-design-rules.md) — named-anti-patterns guard the 80% (prevent AI defaults from creeping in), while the 20% is where distinctive choices happen
- [`soul-test`](../08-skill-creation/soul-test.md) — if any named anti-pattern fires, the soul test will fail (generic output has no identity)
- [`quantifiable-design-knobs`](../08-skill-creation/quantifiable-design-knobs.md) — both are Taste Skill origin patterns; knobs control what TO do, anti-patterns name what NOT to do
