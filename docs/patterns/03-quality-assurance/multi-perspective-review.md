---
name: multi-perspective-review
chinese_name: 多视角审查面板
category: quality-assurance
sources:
  - Gstack
  - CE
description: Review output from multiple role perspectives (CEO, Design Lead, Engineering, DX/User, Brand Guardian) with discrete confidence scores, not a single monolithic judgment.
also_named_as: []
status: active
---

# 多视角审查面板 · Multi-Perspective Review

> **Category**: 03. 质量保证模式
> **Sources**: Gstack, CE
> **Status**: active

## What this pattern is

Instead of a single "review" step, the skill deploys a panel of distinct role perspectives — each with its own question and confidence score — against the same output. The panel typically includes 4–5 roles: a strategic perspective (CEO), a craft perspective (Design Lead / Skill Author), a technical perspective (Engineering / Maintainer), and a user perspective (DX/User / Reader). Each role assigns a discrete confidence score on the confidence-anchors scale (0/25/50/75/100).

The panel's aggregated scores drive a routing decision: average below 50 sends the work back for major rework; 50–74 sends it back for fixes; 75+ allows progression. A single 0 from any perspective is a hard stop.

## Why it works

A single reviewer — human or agent — has a single lens. Asking "is this good?" produces a monolithic answer that conflates strategic, craft, and usability concerns. Forcing the agent to re-read the output through 4–5 distinct lenses produces 4–5 distinct observations, each surfacing issues the others would miss. The confidence scores prevent the agent from hand-waving: each perspective must produce a number and a concrete observation.

## When to use it

- Skills whose output has multiple stakeholders with different criteria (visual design, architecture, code, audits).
- Skills where a single "looks good" judgment is insufficient because craft quality and strategic alignment are orthogonal.
- Deep-tier skills where the failure cost justifies the extra review tokens.

Skip it for lightweight, single-stakeholder skills where a self-review checklist is sufficient.

## Used by

- `bs-ui-master` — Phase 5 deploys a 5-role panel: CEO, Design Lead, Engineering, DX/User, Brand Guardian. Average < 50 returns to Phase 3; 50–74 returns to Phase 4; ≥ 75 proceeds to Phase 6; any 0 returns to Phase 2.
- `bs-skill-auditor` — Phase 4 deploys a 4-role panel: Skill Author, Skill User, Maintainer, QA/Reviewer. Average < 50 returns to Phase 2; 50–74 returns to Phase 3; ≥ 75 proceeds to Phase 5; any 0 returns to Phase 1.
- `bs-visual-article` — Stage 4 includes a 4-role review: Editor, Designer, Reader, Developer, each noting one concrete observation.
- `bs-visual-article` — Stage 4 includes a 4-role review: Editor, Designer, Reader, Developer, each noting one concrete observation.
- `bs-insight-product` — Step 3 freezes demand, vision, positioning/distribution, and operator lenses before Step 4 exposes their conflicts.

## Examples

From `skills/bs-ui-master/references/phase-5-review.md`:

```markdown
## Multi-Perspective Review Panel

Review the design from multiple perspectives. For each perspective,
assign a **confidence score** (0–100) and at least one concrete
observation.

### The Panel

| Role | Asks | Confidence (0–100) |
|------|------|---------------------|
| **CEO** | Does this serve the goal? Is it strategically right? | |
| **Design Lead** | Is this visually excellent? Would you ship it? | |
| **Engineering** | Is this buildable? Are the constraints respected? | |
| **DX / User** | Would you enjoy using this? Is anything confusing? | |
| **Brand Guardian** | Does this respect the brand? Consistent identity? | |

### Action

- Average confidence < 50 → Return to PHASE 3 (EXPLORE).
- Average confidence 50–74 → Return to PHASE 4 (DESIGN) for fixes.
- Average confidence ≥ 75 → Proceed to PHASE 6 (ITERATE).
- Any perspective scores 0 → Return to PHASE 2 (CONCEPT).
```

## Related patterns

- [`self-review-checklist`](../03-quality-assurance/self-review-checklist.md) — self-review catches what the builder can see; multi-perspective catches what requires fresh eyes
- [`confidence-anchors`](../03-quality-assurance/confidence-anchors.md) — the scoring scale used by every perspective in the panel
- [`cross-reviewer-agreement`](../03-quality-assurance/cross-reviewer-agreement.md) — when multiple perspectives converge on the same finding, confidence is boosted
