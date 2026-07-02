---
name: tiered-anti-pattern-rules
chinese_name: 分级反模式规则
category: quality-assurance
sources:
  - Open Design
description: Classify anti-pattern violations into P0 (must fix before merge), P1 (should fix), and P2 (nice to fix) tiers, enabling proportional response.
also_named_as: []
status: proposed
---

# 分级反模式规则 · Tiered Anti-Pattern Rules

> **Category**: 03. 质量保证模式
> **Sources**: Open Design
> **Status**: proposed

## What this pattern is

Anti-pattern violations are classified into three severity tiers rather than treated as a flat list. **P0 (Must Fix)**: blocking — the output cannot ship until these are resolved. **P1 (Should Fix)**: significant — degrades quality but does not block delivery. **P2 (Nice to Fix)**: minor — would improve the output but the cost-benefit of fixing may not justify the effort.

Each tier has a different action: P0 triggers a hard stop and return to the relevant stage; P1 generates a warning with a recommended fix but allows progression; P2 is noted but does not interrupt the workflow.

## Why it works

Treating all anti-patterns as equally severe leads to two failure modes: (1) the agent spends disproportionate effort fixing minor issues while major ones slip through, or (2) the agent ignores all anti-pattern warnings because "there are too many to fix." Tiering gives the agent a proportional response — stop for P0, flag P1, note P2 — which makes the anti-pattern system sustainable under time pressure.

## When to use it

- Skills with a large number of known anti-patterns where not all are equally severe.
- Review pipelines where the reviewer must prioritize findings.
- Design systems where some violations are deal-breakers and others are style preferences.

Skip it when there are fewer than 5 anti-patterns or when all are genuinely equal in severity.

## Used by

No active references yet — extracted from Open Design (nexu-io).

## Examples

Extracted from Open Design; no in-repo example yet.

## Related patterns

- [`verification-rules`](../03-quality-assurance/verification-rules.md) — tiered rules add severity classification to the check-fix-route structure of verification-rules
- [`two-layer-testing`](../03-quality-assurance/two-layer-testing.md) — P0 rules can gate Layer 1; P1/P2 feed into Layer 2 dynamic evaluation
- [`anti-pattern-pre-naming`](../01-behavior-constraint/anti-pattern-pre-naming.md) — tiered-anti-pattern-rules organizes named anti-patterns by severity
