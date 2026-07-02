---
name: two-layer-testing
chinese_name: 两层测试系统
category: quality-assurance
sources:
  - Gstack
description: Layer 1 runs free static validation (syntax, structure, reference integrity); Layer 2 runs paid dynamic evaluation (LLM judge + E2E) — only when Layer 1 passes.
also_named_as: []
status: proposed
---

# 两层测试系统 · Two-Layer Testing

> **Category**: 03. 质量保证模式
> **Sources**: Gstack
> **Status**: proposed

## What this pattern is

Testing is split into two layers with a cost gate between them. Layer 1 is a free, fast static validation pass — syntax checks, structure validation, reference integrity, schema compliance. Only when Layer 1 passes clean does Layer 2 fire: a paid dynamic evaluation using an LLM judge and/or end-to-end tests. This ensures expensive evaluation tokens are never wasted on outputs that fail basic structural checks.

## Why it works

Running an LLM judge on an output with a broken frontmatter or a missing reference is a waste of tokens — the structural failure makes the qualitative evaluation meaningless. The two-layer design acts as a cost firewall: cheap static checks catch the deterministic failures, so the expensive dynamic evaluation only runs on structurally valid candidates.

## When to use it

- Skill evaluation pipelines where running an LLM judge has real token cost.
- Any quality pipeline where structural and qualitative checks are separable.
- Skills where the evaluation budget is limited and must be spent efficiently.

Skip it when all checks are free/static or when the cost of false negatives (missing a qualitative issue) far exceeds the evaluation cost.

## Used by

No active references yet — extracted from Gstack (layered testing strategy for skills).

## Examples

Extracted from Gstack; no in-repo example yet.

## Related patterns

- [`verification-rules`](../03-quality-assurance/verification-rules.md) — verification-rules is the canonical Layer 1 implementation; two-layer-testing adds the Layer 2 dynamic pass
- [`self-review-checklist`](../03-quality-assurance/self-review-checklist.md) — self-review sits at the boundary: partly structural (placeholder scan), partly qualitative (ambiguity audit)
- [`tiered-anti-pattern-rules`](../03-quality-assurance/tiered-anti-pattern-rules.md) — tiered rules can feed into both layers: P0 rules in Layer 1, P1/P2 in Layer 2
