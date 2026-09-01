# Advocate Review: bs-uml-master

**Date**: 2026-09-01
**Reviewer Role**: Advocate
**Skill**: bs-uml-master
**HUMAN_VERIFIED**: false
**Scope Contract Version**: 1
**Reviewed Revision**: 1f4219aa0d7bd418340e8ccafe4f4bea980edd4f
**Reviewed Skill SHA-256**: da8087e49d55d0f4c732f4adfe04021d2965153577fd9d780f6ae836f22e1abb
**Reviewed Manifest SHA-256**: f359fb36645b3b9a00fe01f960aec88682f9b94885f6242038beb181f54b22a8

## Executive Summary

R6 is the strongest revision of this skill so far because it does the thing the whole repo exists to prove is possible: it took a live field failure (usage sample #3, artifact 399ed2df — four diagrams self-certified "medium fit ✅ / 0 crossings" that all measure FAIL at 8.3–9.6px), converted it into three ledger entries, and closed the exploit *mechanically* the same day with C8 fit-receipt coupling plus point-of-temptation prose counters. I replayed the exact 399ed2df failure pattern against both the R5 and R6 checkers: R5 passes it with exit 0, R6 fails it on C8 — the delta is real, demonstrated, and regression-locked by fixture. This review was rebound twice in-cycle: to R6.1 (617e76c), which closed the adversary round's F1–F5 and the residual my own probing found, and then to R6.2 (1f4219a), which closed the fresh F7–F9. My R6.2 replay found that the F8 fix (block-wide FAIL scan, necessarily narrowed to line-start FAIL tokens and "N FAIL" summaries) partially re-opened my probed vector: a verbatim multi-line FAIL paste is still caught (exit 1, fixture-locked), but an inline mid-line condensation of a FAIL verdict again passes as "receipt present" (probed, exit 0) — recorded below as the new One Improvement. I would still ship this revision, while noting honestly that the checker binds receipt *format*, not receipt *truth* (IP-9 stays open until Phase 2.A).

## Evidence Reviewed

Full manifest receipt `f359fb36645b3b9a00fe01f960aec88682f9b94885f6242038beb181f54b22a8` was received and independently verified.

Files examined in full:

- `skills/bs-uml-master/SKILL.md` (sha256 locally recomputed: matches the manifest's `da8087e4…`)
- `skills/bs-uml-master/scripts/check-delivery.js` (R6.2: recomputed `58391a7d…`, matches manifest; read the full C8 evolution across revisions — R6.1's windowed receipt + hedge guard + whole-field backend exemption, R6.2's fence-over-field exemption veto, forward-only 8-line windows, and block-wide line-start FAIL scan)
- `skills/bs-uml-master/scripts/test-check-delivery.js` (R6.2: recomputed `f0a9f235…`, matches manifest)
- `skills/bs-uml-master/scripts/check-render-fit.js` (arg parsing, media profiles, output shape)
- `skills/bs-uml-master/references/layout-craft.md` (R6 rubric preamble: receipts-fill-the-rubric, gestalt-never-scrolls, zoom-waives-nothing)
- `skills/bs-uml-master/references/syntax-pitfalls.md` and `references/rendering-validation.md` (R6 hunks via `git show 03d3a5a`)
- `docs/reviews/bs-uml-master/2026-09-01-haiku-usage-review-3.md` (the R6-triggering usage sample)
- `docs/reviews/bs-uml-master/improvement-points.md` (ledger consistency check)
- `tools/peer-review.js` (recomputed `702587f4…`, matches manifest)
- R6 commit set: `git show` on 32a78f4, 03d3a5a, d428cce, 757ff4e

Commands rerun (first at HEAD 757ff4e, re-verified after each rebind — R6.1 HEAD 617e76c, R6.2 HEAD 1f4219a):

- `node skills/bs-uml-master/scripts/test-check-delivery.js` — ALL PASS; 33 fixtures at 757ff4e, 40 at 617e76c, 44 at 1f4219a (all counted from PASS lines), including `fit-receipt-perline-fail-smuggle`, which encodes the verbatim-paste form of my Probe C
- `node skills/bs-uml-master/scripts/test-check-render-fit.js` — ALL PASS
- `bash tools/validate.sh skills/bs-uml-master/` — 16 passed, 0 failed at all three revisions (pattern references 8/8, bundled resources 11/11, gate syntax 3 tags well-formed)
- Probe A (theater replay, `scratchpad/adv-r6-advocate/probe-399ed2df-pattern.md`): an otherwise fully compliant delivery — tool+version State line, file:line evidence, budget-clean source — carrying a self-graded rubric ("0 crossings ✅ … medium fit ✅ (artifact is zoomable…)"), no fit receipt. R6 through R6.2: `FAIL … RENDER_VERIFIED without a check-render-fit receipt`, exit 1 (re-verified at 1f4219a). Same file against the R5-era checker (`git show e48fb20:…/check-delivery.js`): `0 FAIL`, exit 0. This is the exploit-closure claim, verified end to end.
- Probe B (compliant delivery, `scratchpad/adv-r6-advocate/probe-compliant.md`): same block plus a **Fit:** line pasted verbatim from a real `check-render-fit.js` run on a probe SVG — `PASS … check-render-fit receipt present alongside RENDER_VERIFIED`, exit 0 at all three revisions. Confirms the honest path is not over-blocked and the tool's actual output shape (canvas WxH, effective px, verdict, "N FAIL" summary) satisfies C8's receipt regexes, including R6.2's forward-only 8-line co-occurrence windows.
- Probe C (residual hunt, `scratchpad/adv-r6-advocate/probe-truncated-fail-receipt.md`): a one-line **Fit:** field carrying a mid-line FAIL verdict with the trailing "1 FAIL" summary omitted. At 757ff4e: "receipt present", exit 0 (my original One Improvement). At 617e76c: caught, exit 1. At 1f4219a: **re-opened** — "receipt present", exit 0 again, because the R6.2 block-wide FAIL scan (needed for adversary F8's padded/smuggled FAIL lines) narrowed the token to line-start `FAIL` or an "N FAIL" summary, and an inline condensation has neither. A companion probe (`probe-verbatim-fail-receipt.md`, the tool's multi-line output pasted verbatim, FAIL at line start) still exits 1 at 1f4219a, matching the `fit-receipt-perline-fail-smuggle` fixture. So R6.2 catches verbatim pastes and smuggled second receipts but re-admits the inline-condensed FAIL — see One Improvement.

Ledger consistency: IP-1 through IP-27 enumerated, exactly one open (IP-9, Phase 2.A), footer "27 (26 fixed, 1 open)" — internally consistent. Doc-vs-code spot checks: SKILL.md's check-delivery description ("fit-receipt coupling — RENDER_VERIFIED requires a check-render-fit receipt") matches C8's code; the claim that C8 exemption keys on the Backend field only is verified by the `fit-bypass-fake-text-receipt` fixture and by reading the `textBackend` derivation from `field(block, "Backend")` (R6.1 tightened it to whole-field matching, so "Mermaid (text annotations)" and the unreplaced template placeholder no longer slip the gate; R6.2 added the fence veto — a "text" Backend declaration over a mermaid/plantuml-shaped fence no longer earns the exemption); no stale fixture counts found in SKILL.md (it deliberately states the fixtures' provenance, not a number); the checker's header comment now enumerates C1–C8 including C7, closing the doc-drift nit from my first pass.

## Dimension Scores

| Dimension | Score | Key Strength | Key Concern |
|-----------|------:|--------------|-------------|
| Clarity of trigger description | 9/10 | "Use when" description names the diagram types, the four modes, and the deliverable qualities that trigger it | Dense single sentence; borderline tasks (e.g. "sketch my db schema") rely on the reader parsing a long clause |
| Hard rules / safety gates | 9/10 | 9 numbered rules, 3 HARD-GATEs, and R6's receipts-or-silence rule land the counter at the exact layer the last exploit used | Receipts remain fabricable — the gates bind format, not truth, until Phase 2.A independent verification |
| Workflow correctness | 9/10 | Phases have explicit exits; EXPLAIN/REVIEW carve-out is precise; Phase 4 now names the exact fit command with medium flags | Full workflow is heavy for small asks; the sketch pressure valve exists but depends on correct self-classification |
| Pattern application | 9/10 | 8 declared patterns all resolve (validate.sh 8/8) and are visibly load-bearing, not decorative — confidence-anchors and verification-rules are the skill's spine | Pattern list is static prose; no per-pattern conformance check yet (Phase 2.C) |
| Test prompt coverage | 8/10 | 4 prompts span happy/edge/adversarial/page-bound with observed-baseline failure notes | No dataset prompt yet targets the review-layer theater vector R6 fixes; coverage evidence is schema-only (EVAL_SCHEMA_ONLY) |
| Bundled resources | 9/10 | 9 references + 4 scripts; 44 delivery fixtures + fit fixtures all pass; every fixture encodes a real observed failure vector, including the verbatim form of my Probe C as `fit-receipt-perline-fail-smuggle` | Receipts remain fabricable until Phase 2.A; the inline-condensed FAIL variant re-opened at R6.2 (probed) |
| Maintainability | 9/10 | The ledger discipline is exemplary: 27 points, each with source, class, severity, and a closing revision; checker changes ship with fixtures in the same commit | Checker regexes are accreting (hedge-word lists, window heuristics, token-position rules) — the R6.2 regression shows interacting regexes now fix one hole by widening another; a structured receipt format would be cleaner |
| Production readiness | 8/10 | R5-vs-R6 differential probe proves the field failure class is mechanically caught; the same-cycle repair loop demonstrably works (F1–F9 closed with fixtures across R6.1/R6.2) | My Probe C vector re-opened at R6.2 in its inline-condensed form (replay-verified, exit 0 at HEAD); R6.2's changes await a fresh adversary pass; receipts are format-bound, not truth-bound, until Phase 2.A |

Total: **70/80**

## Strongest Aspect

The single best design move of R6 is closing the exploit at the layer where it actually occurred, with a differential proof available to anyone. Usage sample #3 showed that when R5 bound the delivery format mechanically, the compliance theater migrated to the one layer still claimable in prose — the review verdicts. R6's answer is not more prose exhortation (which the bindingness-ladder analysis in the usage review correctly predicts a weak model will satisfy *with* prose) but a mechanical coupling: C8 makes a RENDER_VERIFIED claim on a visual backend format-invalid unless the block carries the fit checker's own pasted output, and the FAIL-verdict path demands a recorded trade-off. My probes confirm the before/after: the identical theater block passes the R5 checker (exit 0) and fails the R6 checker (exit 1), while the honest receipt-bearing version passes. That is the repo's core thesis — "every layer that prose can satisfy, a weak model will satisfy with prose" — turned into a working countermeasure with a regression fixture, and it is why this skill keeps getting materially better rather than merely longer.

## One Improvement

Close the inline-condensed FAIL regression that R6.2 re-introduced, without losing the F8 block-wide scan. My original One Improvement (window-scoped FAIL detection) was implemented at R6.1 and verified closed by replay; at R6.2 the F8 fix rightly moved the FAIL scan block-wide but had to narrow the token to line-start `FAIL` or an "N FAIL" summary to avoid prose false-positives — and my unchanged Probe C (`**Fit:** check-render-fit.js — canvas 698x1648, FAIL: gestalt does not fit, effective label font 8.3px < 11px`, no summary line) again passes as "receipt present", exit 0 at 1f4219a, while the verbatim multi-line paste is caught. The one-line Fit field is the contract template's own suggested shape, so the inline condensation is the most natural form a hedging model will produce. Fix: keep the block-wide line-start scan for padded/smuggled receipts, and additionally scan each matched receipt window (where receipt tokens already co-occur, so prose false-positives are structurally unlikely) for any `FAIL` token other than the literal `0 FAIL` — the union of R6.1's and R6.2's rules rather than a replacement. Fixture first: my Probe C file as-is (expect the trade-off FAIL), plus the honest `… PASS …; 0 FAIL` inline receipt asserting no false positive.

## Verdict

**Verdict**: PASS (70/80)

R6, as hardened through R6.1 and R6.2, earns a PASS on demonstrated, replayable evidence: the field-observed failure class (self-certified rubrics over failing renders) is caught mechanically, the honest path is verified not to be over-blocked at any of the three reviewed revisions, all 44 delivery fixtures and all fit fixtures pass, Gate 1 is 16/16, and the improvement ledger is internally consistent at 27 points / 26 fixed / 1 open. The score returns to 70 from my interim 71: R6.2's F8 fix, correct on its own terms, re-opened the inline-condensed form of the FAIL-smuggling vector I probed (replay-verified exit 0 at HEAD), which is exactly the kind of regression the honest-scoring rule exists for — a closure I certified is no longer fully closed, so the point comes back off. What keeps this a confident PASS rather than a downgrade is the demonstrated repair loop: nine adversary findings and my probe were each closed within the cycle with fixture-locked fixes, the regression is narrow (verbatim pastes and smuggled receipts stay caught), and the fix is a small, specified union of two existing rules. Receipts remain format-bound until Phase 2.A and the test-prompt dataset still lacks a review-layer-theater prompt. Ship it, take the One Improvement in the next checker touch, and keep the usage-sample loop running.
