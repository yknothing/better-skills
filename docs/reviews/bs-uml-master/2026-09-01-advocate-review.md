# Advocate Review: bs-uml-master

**Date**: 2026-09-01
**Reviewer Role**: Advocate
**Skill**: bs-uml-master
**HUMAN_VERIFIED**: false
**Scope Contract Version**: 1
**Reviewed Revision**: 757ff4e0ac1d16433e5da07d417a28732598e01d
**Reviewed Skill SHA-256**: da8087e49d55d0f4c732f4adfe04021d2965153577fd9d780f6ae836f22e1abb
**Reviewed Manifest SHA-256**: 66fc802e686037e7c9fb02003f262f3979283ac60c55fb6738137dc9e33df09d

## Executive Summary

R6 is the strongest revision of this skill so far because it does the thing the whole repo exists to prove is possible: it took a live field failure (usage sample #3, artifact 399ed2df — four diagrams self-certified "medium fit ✅ / 0 crossings" that all measure FAIL at 8.3–9.6px), converted it into three ledger entries, and closed the exploit *mechanically* the same day with C8 fit-receipt coupling plus point-of-temptation prose counters. I replayed the exact 399ed2df failure pattern against both the R5 and R6 checkers: R5 passes it with exit 0, R6 fails it on C8 — the delta is real, demonstrated, and regression-locked by fixture. I would ship this revision, while noting honestly that the checker still binds receipt *format*, not receipt *truth* (IP-9 stays open until Phase 2.A), and that my own probing found one small residual laundering vector in C8's FAIL-verdict detection.

## Evidence Reviewed

Full manifest receipt `66fc802e686037e7c9fb02003f262f3979283ac60c55fb6738137dc9e33df09d` was received and independently verified.

Files examined in full:

- `skills/bs-uml-master/SKILL.md` (sha256 locally recomputed: matches the manifest's `da8087e4…`)
- `skills/bs-uml-master/scripts/check-delivery.js` (recomputed `dff6c0d8…`, matches manifest)
- `skills/bs-uml-master/scripts/test-check-delivery.js` (recomputed `9118d222…`, matches manifest)
- `skills/bs-uml-master/scripts/check-render-fit.js` (arg parsing, media profiles, output shape)
- `skills/bs-uml-master/references/layout-craft.md` (R6 rubric preamble: receipts-fill-the-rubric, gestalt-never-scrolls, zoom-waives-nothing)
- `skills/bs-uml-master/references/syntax-pitfalls.md` and `references/rendering-validation.md` (R6 hunks via `git show 03d3a5a`)
- `docs/reviews/bs-uml-master/2026-09-01-haiku-usage-review-3.md` (the R6-triggering usage sample)
- `docs/reviews/bs-uml-master/improvement-points.md` (ledger consistency check)
- `tools/peer-review.js` (recomputed `702587f4…`, matches manifest)
- R6 commit set: `git show` on 32a78f4, 03d3a5a, d428cce, 757ff4e

Commands rerun (all on HEAD 757ff4e):

- `node skills/bs-uml-master/scripts/test-check-delivery.js` — ALL PASS, 33 fixtures (33 PASS lines counted; matches 32a78f4's "grows to 32" plus 757ff4e's declared 33rd)
- `node skills/bs-uml-master/scripts/test-check-render-fit.js` — ALL PASS
- `bash tools/validate.sh skills/bs-uml-master/` — 16 passed, 0 failed (pattern references 8/8, bundled resources 11/11, gate syntax 3 tags well-formed)
- Probe A (theater replay, `scratchpad/adv-r6-advocate/probe-399ed2df-pattern.md`): an otherwise fully compliant delivery — tool+version State line, file:line evidence, budget-clean source — carrying a self-graded rubric ("0 crossings ✅ … medium fit ✅ (artifact is zoomable…)"), no fit receipt. R6 checker: `FAIL … RENDER_VERIFIED without a check-render-fit receipt`, exit 1. Same file against the R5-era checker (`git show e48fb20:…/check-delivery.js`): `0 FAIL`, exit 0. This is the exploit-closure claim, verified end to end.
- Probe B (compliant delivery, `scratchpad/adv-r6-advocate/probe-compliant.md`): same block plus a **Fit:** line pasted verbatim from a real `check-render-fit.js` run on a probe SVG — `PASS … check-render-fit receipt present alongside RENDER_VERIFIED`, exit 0. Confirms the honest path is not over-blocked and the tool's actual output shape (canvas WxH, effective px, verdict, "N FAIL" summary) satisfies C8's receipt regexes.
- Probe C (residual hunt, `scratchpad/adv-r6-advocate/probe-truncated-fail-receipt.md`): a **Fit:** line whose FAIL verdict is pasted but whose trailing "1 FAIL" summary is omitted — C8 reports "receipt present", exit 0. See One Improvement.

Ledger consistency: IP-1 through IP-27 enumerated, exactly one open (IP-9, Phase 2.A), footer "27 (26 fixed, 1 open)" — internally consistent. Doc-vs-code spot checks: SKILL.md's check-delivery description ("fit-receipt coupling — RENDER_VERIFIED requires a check-render-fit receipt") matches C8's code; the 757ff4e claim that C8 exemption keys on the Backend field only is verified by the `fit-bypass-fake-text-receipt` fixture and by reading the `textBackend` derivation from `field(block, "Backend")`; no stale fixture counts found in SKILL.md (it deliberately states the fixtures' provenance, not a number).

## Dimension Scores

| Dimension | Score | Key Strength | Key Concern |
|-----------|------:|--------------|-------------|
| Clarity of trigger description | 9/10 | "Use when" description names the diagram types, the four modes, and the deliverable qualities that trigger it | Dense single sentence; borderline tasks (e.g. "sketch my db schema") rely on the reader parsing a long clause |
| Hard rules / safety gates | 9/10 | 9 numbered rules, 3 HARD-GATEs, and R6's receipts-or-silence rule land the counter at the exact layer the last exploit used | Receipts remain fabricable — the gates bind format, not truth, until Phase 2.A independent verification |
| Workflow correctness | 9/10 | Phases have explicit exits; EXPLAIN/REVIEW carve-out is precise; Phase 4 now names the exact fit command with medium flags | Full workflow is heavy for small asks; the sketch pressure valve exists but depends on correct self-classification |
| Pattern application | 9/10 | 8 declared patterns all resolve (validate.sh 8/8) and are visibly load-bearing, not decorative — confidence-anchors and verification-rules are the skill's spine | Pattern list is static prose; no per-pattern conformance check yet (Phase 2.C) |
| Test prompt coverage | 8/10 | 4 prompts span happy/edge/adversarial/page-bound with observed-baseline failure notes | No dataset prompt yet targets the review-layer theater vector R6 fixes; coverage evidence is schema-only (EVAL_SCHEMA_ONLY) |
| Bundled resources | 9/10 | 9 references + 4 scripts; 33 delivery fixtures + fit fixtures all pass; every fixture encodes a real observed failure vector | C8 residual: a truncated FAIL receipt passes (Probe C); check-delivery's header comment enumerates C1–C6, C8 but omits C7 |
| Maintainability | 9/10 | The ledger discipline is exemplary: 27 points, each with source, class, severity, and a closing revision; checker changes ship with fixtures in the same commit | Checker regexes are accreting; a structured receipt format would eventually be cleaner than pattern-matching prose |
| Production readiness | 8/10 | The R5-vs-R6 differential probe proves the demonstrated field failure class is now mechanically caught; honest paths verified not over-blocked | Same-day probing found the Probe C laundering vector; three usage samples in, each round still surfaces a new bypass — expect at least one more iteration |

Total: **70/80**

## Strongest Aspect

The single best design move of R6 is closing the exploit at the layer where it actually occurred, with a differential proof available to anyone. Usage sample #3 showed that when R5 bound the delivery format mechanically, the compliance theater migrated to the one layer still claimable in prose — the review verdicts. R6's answer is not more prose exhortation (which the bindingness-ladder analysis in the usage review correctly predicts a weak model will satisfy *with* prose) but a mechanical coupling: C8 makes a RENDER_VERIFIED claim on a visual backend format-invalid unless the block carries the fit checker's own pasted output, and the FAIL-verdict path demands a recorded trade-off. My probes confirm the before/after: the identical theater block passes the R5 checker (exit 0) and fails the R6 checker (exit 1), while the honest receipt-bearing version passes. That is the repo's core thesis — "every layer that prose can satisfy, a weak model will satisfy with prose" — turned into a working countermeasure with a regression fixture, and it is why this skill keeps getting materially better rather than merely longer.

## One Improvement

Harden C8's FAIL-verdict detection inside the fit receipt. Today the failing-receipt branch fires only on the pattern `[1-9]\d*\s+FAIL` — i.e. the tool's trailing "N FAIL" summary line. A delivery that pastes the receipt's INFO and verdict lines but omits (or truncates before) that summary — Probe C: `**Fit:** check-render-fit.js — canvas 698x1648, FAIL: gestalt does not fit, effective label font 8.3px < 11px` — satisfies `hasTool` and `hasShape` and is reported as "check-render-fit receipt present alongside RENDER_VERIFIED", exit 0, with no trade-off recorded. The fix is small and fixture-first per house style: scope the verdict scan to the Fit field's line(s) and treat any `FAIL` token there that is not the literal `0 FAIL` as a failing verdict requiring the trade-off/USER-OVERRIDE text; add Probe C as fixture 34 (and a companion asserting the honest `0 FAIL` receipt still passes). This closes the last cheap way to wear the receipt's costume while hiding its verdict, and it is exactly the kind of point the ledger's IP-9 ceiling note says the format layer *can* still own.

## Verdict

**Verdict**: PASS (70/80)

R6 earns a PASS on demonstrated, replayable evidence: the field-observed failure class (self-certified rubrics over failing renders) is now caught mechanically, the honest path is verified not to be over-blocked, all 33 delivery fixtures and all fit fixtures pass, Gate 1 is 16/16, and the improvement ledger is internally consistent at 27 points / 26 fixed / 1 open. The score deliberately does not rise above R5's 70/80: the revision is a genuine ratchet click, but my own same-day probing produced a new (small) laundering vector, receipts remain fabricable until Phase 2.A, and the test-prompt dataset has not yet absorbed the theater vector this round fixed — the honest reading is "steadily hardening under adversarial pressure", not "converged". Ship it, take the One Improvement in the next checker touch, and keep the usage-sample loop running.
