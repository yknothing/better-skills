---
name: independent-verification-pass
chinese_name: 独立验证 Pass
category: quality-assurance
sources:
  - CE
description: Launch a separate verification agent that was not involved in the original review, ensuring objectivity by eliminating reviewer blind spots.
also_named_as: []
status: proposed
---

# 独立验证 Pass · Independent Verification Pass

> **Category**: 03. 质量保证模式
> **Sources**: CE
> **Status**: proposed

## What this pattern is

After a primary review completes, a second, independent verification pass is executed — ideally by a separate agent that had no involvement in the original work or review. This agent checks the findings of the primary review, not the original output directly. Its job is to catch false positives (findings that look correct but aren't), false negatives (issues the primary reviewer missed), and reviewer blind spots.

## Why it works

A reviewer who just spent time analyzing an output develops attachment to their findings. They are statistically unlikely to catch their own errors on a re-read. A fresh agent, seeing only the findings and the criteria, has no such attachment and can apply the same criteria without the same blind spots.

## When to use it

- High-stakes reviews where a missed issue has significant cost (security, architecture, deployment).
- Multi-stage review pipelines where the primary review is complex enough to have error modes of its own.
- Skills where the primary reviewer and the builder are the same agent (self-review followed by independent verification).

Skip it for low-stakes reviews where the cost of a second pass exceeds the cost of a missed issue.

## Used by

No active references yet — extracted from CE (review skill's verification stage pattern).

## Examples

Extracted from CE; no in-repo example yet.

## Related patterns

- [`cross-reviewer-agreement`](../03-quality-assurance/cross-reviewer-agreement.md) — independent verification + agreement across reviewers compound to increase confidence
- [`multi-perspective-review`](../03-quality-assurance/multi-perspective-review.md) — multi-perspective provides breadth; independent verification provides depth on the findings
- [`self-review-checklist`](../03-quality-assurance/self-review-checklist.md) — self-review is the first pass; independent verification is the second
