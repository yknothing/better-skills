---
name: confidence-anchors
chinese_name: Confidence Anchor
category: quality-assurance
sources:
  - CE
description: Use discrete confidence anchors (0/25/50/75/100) instead of continuous scores to prevent the false precision LLMs are prone to.
also_named_as: []
status: active
---

# Confidence Anchor · Confidence Anchors

> **Category**: 03. 质量保证模式
> **Sources**: CE
> **Status**: active

## What this pattern is

Confidence judgments use exactly five discrete anchors — 0, 25, 50, 75, 100 — each with a specific semantic meaning. Intermediate scores (e.g., "72", "68") are explicitly forbidden. This prevents the agent from producing false-precision numbers that look quantitative but carry no real information.

The standard scale: **0** = Fundamentally wrong, start over. **25** = Major issues, significant rework needed. **50** = Acceptable baseline, could ship with fixes. **75** = Strong, minor polish needed. **100** = Exceptional, no changes needed.

## Why it works

LLMs, when asked to rate something on a continuous 0–100 scale, tend to produce numbers like 72 or 68 — outputs that look precise but are statistically no more meaningful than "somewhere in the 60s–70s." Forcing the agent to pick one of five discrete buckets eliminates the illusion of precision and makes the semantic meaning of each score level explicit. A score of 50 means something specific; a score of 67 means nothing.

## When to use it

- Any skill that includes a review or evaluation phase with numerical scores.
- Skills using multi-perspective-review, where each perspective assigns a score — the anchors keep scores comparable across perspectives.
- Skills where score thresholds trigger routing decisions (e.g., "< 50 = redo").

Skip it for binary pass/fail checks where a checklist is more appropriate.

## Used by

- `bs-visual-design` — Phase 5 Multi-Perspective Review Panel: each role (CEO, Design Lead, Engineering, DX/User, Brand Guardian) assigns a 0/25/50/75/100 confidence score. Intermediate scores are explicitly forbidden: "Never use intermediate scores (e.g., '72', '68'). The anchors exist to prevent false precision."
- `bs-skill-health` — Phase 4 Multi-Perspective Review Panel: each role (Skill Author, Skill User, Maintainer, QA/Reviewer) assigns a confidence score on the same 5-anchor scale with the same routing thresholds.

## Examples

From `skills/bs-visual-design/references/phase-5-review.md`:

```markdown
### Confidence Scale

Use discrete anchors — never continuous numbers:

| Score | Meaning |
|-------|---------|
| **0** | Fundamentally wrong. Start over. |
| **25** | Major issues. Significant rework needed. |
| **50** | Acceptable baseline. Could ship with fixes. |
| **75** | Strong. Minor polish needed. |
| **100** | Exceptional. No changes needed. |

Never use intermediate scores (e.g., "72", "68"). The anchors exist
to prevent false precision.
```

The same scale appears in `bs-skill-health/references/phase-4-review.md` with domain-adapted meanings (e.g., "Audit is fundamentally wrong. Re-audit." for 0).

## Related patterns

- [`multi-perspective-review`](../03-quality-assurance/multi-perspective-review.md) — the primary consumer; every perspective uses this scale
- [`self-review-checklist`](../03-quality-assurance/self-review-checklist.md) — complementary: checklist for binary pass/fail, anchors for qualitative judgment
- [`cross-reviewer-agreement`](../03-quality-assurance/cross-reviewer-agreement.md) — agreement across perspectives boosts the confidence level by +1
