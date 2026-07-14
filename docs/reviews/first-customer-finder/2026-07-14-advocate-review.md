# Advocate Review: first-customer-finder

**Date**: 2026-07-14  
**Reviewer Role**: Advocate  
**Skill**: first-customer-finder  
**HUMAN_VERIFIED**: false

## Executive Summary

The skill replaces generic lead generation with a reproducible customer-discovery system: product truth, competing search hypotheses, an evidence ledger, a binary eligibility gate, discrete confidence anchors, adversarial review, and a manual validation experiment. Its strongest design choice is that a failed evidence gate cannot be repaired by scoring or presentation quality. I would ship it.

## Dimension Scores

| Dimension | Score | Key Strength | Key Concern |
|---|---:|---|---|
| Clarity of trigger description | 9/10 | Covers first customers, early adopters, design partners, and beta users | “Prospect research” requests outside early-stage discovery should not trigger it |
| Hard rules / safety gates | 10/10 | Explicit evidence, privacy, no-quota, and no-send constraints | None material |
| Workflow correctness | 9/10 | Clear sequence from product truth to falsifiable outreach experiment | Anchor assignment still requires judgment |
| Pattern application | 10/10 | Six patterns are visible and operational, not decorative | None material |
| Test prompt coverage | 9/10 | Happy, sparse-evidence, and hostile-volume cases cover the main risk surface | A future multilingual case would improve coverage |
| Bundled resources | 9/10 | Evidence contract carries detail without bloating the runtime skill | Machine-readable schema is deferred |
| Maintainability | 9/10 | Small surface, no runtime packages, explicit terminal states | Source-class examples may need periodic refresh |
| Production readiness | 9/10 | Clean failure states and reproducible qualification contract | Dynamic calibration still needs real usage data |

## Strongest Aspect

The eligibility gate and rejection ledger prevent the central failure mode of customer-finding agents: producing plausible-looking companies that have no evidenced need or reachable owner. The skill treats `NO_QUALIFIED_PROSPECTS` as a successful research outcome and makes operational readiness part of qualification rather than an afterthought.

## One Improvement

After real-world usage produces enough examples, add a small machine-readable fixture set to calibrate borderline `50` versus `75` anchor assignments. Do not add this before evidence shows that calibration drift is a recurring problem.

## Verdict

**Verdict**: production-ready

The skill is compact for a deep-tier workflow, degrades safely when research access is missing, and produces a decision-ready experiment rather than a decorative report.
