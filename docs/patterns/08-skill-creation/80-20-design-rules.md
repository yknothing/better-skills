---
name: 80-20-design-rules
chinese_name: 80/20 设计规则
category: skill-creation
sources:
  - Open Design
description: 80% of every design must use proven, validated patterns; 20% must be distinctive — the reason someone would recognize this design in a screenshot.
also_named_as: []
status: active
---

# 80/20 设计规则 · 80/20 Design Rules

> **Category**: 08. 技能创建模式
> **Sources**: Open Design
> **Status**: active

## What this pattern is

A design constraint that splits every design into two mandatory components: 80% must come from proven, validated patterns (established layout patterns, WCAG-compliant color ratios, readable type scales, standard interaction states), and 20% must be distinctive — a unique structural element, an unexpected color application, a typographic moment that makes the design recognizable. If the 80% is absent, the design is a mess. If the 20% is absent, the design is a template. Both failures are equally unacceptable.

## Why it works

Pure templates (100% validated patterns) are invisible — they look like every other design and fail the Soul Test. Pure experimentation (100% distinctive choices) is incoherent — it violates user expectations and accessibility norms. The 80/20 split provides a floor and a ceiling: the 80% ensures the design is usable, the 20% ensures it is memorable. The split also gives the agent a concrete self-check: "can I point to the 20%? If not, I am not done."

## When to use it

- Any visual design skill. This is a core principle, not an optional enhancement.
- When the output will be judged by humans who have seen thousands of designs — only the 20% makes yours stand out.
- When you need a self-check gate: "identify your 20% or go back to design direction."

Skip it only for purely functional outputs (API responses, data formats, logs) where aesthetics are irrelevant.

## Used by

- `bs-ui-master` — `## Core Principle: 80/20 Design` at lines 11-18: "80% of every design must use proven, validated patterns. 20% must be distinctive — the reason someone would recognize this design in a screenshot. If the 20% is absent, you shipped a template. If the 80% is absent, you shipped a mess." The skill then specifies validated-pattern defaults for color (60-30-10), typography (sans-serif body + display heading), and layout (validated patterns list in Phase 4.2), each with a 20% distinctive modifier.

## Examples

From `skills/bs-ui-master/SKILL.md`:

```markdown
## Core Principle: 80/20 Design

80% of every design must use proven, validated patterns. 20% must be
distinctive — the reason someone would recognize this design in a screenshot.
If the 20% is absent, you shipped a template. If the 80% is absent, you
shipped a mess.

**Validated-pattern defaults** (use unless you have a specific reason to
deviate):
- **Color**: 60-30-10 distribution (dominant/secondary/accent). One unexpected
  color application for the 20%.
- **Typography**: one sans-serif body font + one display font for headings.
  One distinctive typographic moment for the 20%.
- **Layout**: 80% from validated layout patterns (Phase 4.2). 20%: one unique
  structural element.
```

Phase 9.5 (The "Soul" Test) then validates the 20%: "if someone screenshots this design, can someone outside this project identify which brand or product it belongs to? If the answer is no, your 20% distinctive choice is too weak."

## Related patterns

- [`soul-test`](../08-skill-creation/soul-test.md) — 80/20 is the process; soul-test is the result validation. If the 20% is strong enough, the soul test passes
- [`named-anti-patterns`](../08-skill-creation/named-anti-patterns.md) — named-anti-patterns guard the 80% (prevent AI defaults), while the 20% is where distinctive choices happen
- [`quantifiable-design-knobs`](../08-skill-creation/quantifiable-design-knobs.md) — the 20% distinctive choices can be tuned via quantifiable knobs
- [`minimal-precision`](../08-skill-creation/minimal-precision.md) — both are about maximizing impact per unit of input; 80/20 maximizes design impact, minimal-precision maximizes instructional impact
