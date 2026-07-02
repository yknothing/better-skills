---
name: cross-reviewer-agreement
chinese_name: Cross-reviewer Agreement
category: quality-assurance
sources:
  - CE
description: When 2 or more independent reviewers converge on the same finding, bump confidence by 1 level — agreement is a signal.
also_named_as: []
status: proposed
---

# Cross-reviewer Agreement · Cross-reviewer Agreement

> **Category**: 03. 质量保证模式
> **Sources**: CE
> **Status**: proposed

## What this pattern is

When multiple independent reviewers — or multiple perspectives in a multi-perspective-review panel — converge on the same finding, the confidence level for that finding is automatically boosted by one tier (e.g., from 50 to 75). Agreement is treated as a signal: if two reviewers with different lenses see the same issue, it is more likely to be real.

## Why it works

Independent convergence is a strong Bayesian signal. Two reviewers who agree on a finding are unlikely to share the same hallucination or blind spot. Boosting confidence on convergent findings rewards genuine issues while preventing false positives from dominating the review output.

## When to use it

- Multi-reviewer pipelines where findings are compared across reviewers.
- Multi-perspective-review panels where different roles may independently flag the same concern.
- Any review process with 2+ independent evaluators.

Skip it for single-reviewer workflows where there is no second opinion to converge with.

## Used by

No active references yet — extracted from CE (multi-reviewer confidence boosting mechanism).

## Examples

Extracted from CE; no in-repo example yet.

## Related patterns

- [`independent-verification-pass`](../03-quality-assurance/independent-verification-pass.md) — independent verification provides the second reviewer needed for agreement detection
- [`multi-perspective-review`](../03-quality-assurance/multi-perspective-review.md) — the panel structure where cross-reviewer agreement most naturally applies
- [`confidence-anchors`](../03-quality-assurance/confidence-anchors.md) — the scale on which agreement triggers a +1 level bump
