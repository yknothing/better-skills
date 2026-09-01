# Advocate Review: bs-uml-master

**Date**: 2026-09-01
**Reviewer Role**: Advocate
**Skill**: bs-uml-master
**HUMAN_VERIFIED**: false
**Scope Contract Version**: 1
**Reviewed Revision**: 617e76c680bcc737f61125ac7037e4a713189026
**Reviewed Skill SHA-256**: da8087e49d55d0f4c732f4adfe04021d2965153577fd9d780f6ae836f22e1abb
**Reviewed Manifest SHA-256**: 722bc165f72decd301e2af1da9638465f994e39a422c23db50b77d97f63f812a

## Executive Summary

R6 is the strongest revision of this skill so far because it does the thing the whole repo exists to prove is possible: it took a live field failure (usage sample #3, artifact 399ed2df — four diagrams self-certified "medium fit ✅ / 0 crossings" that all measure FAIL at 8.3–9.6px), converted it into three ledger entries, and closed the exploit *mechanically* the same day with C8 fit-receipt coupling plus point-of-temptation prose counters. I replayed the exact 399ed2df failure pattern against both the R5 and R6 checkers: R5 passes it with exit 0, R6 fails it on C8 — the delta is real, demonstrated, and regression-locked by fixture. This review was rebound to R6.1 (617e76c), which closed the adversary round's F1–F5 and the residual laundering vector my own probing found (a per-line FAIL verdict pasted without the summary line) — closure verified by replaying my original probe, which now exits 1. I would ship this revision, while noting honestly that the checker still binds receipt *format*, not receipt *truth* (IP-9 stays open until Phase 2.A).

## Evidence Reviewed

Full manifest receipt `722bc165f72decd301e2af1da9638465f994e39a422c23db50b77d97f63f812a` was received and independently verified.

Files examined in full:

- `skills/bs-uml-master/SKILL.md` (sha256 locally recomputed: matches the manifest's `da8087e4…`)
- `skills/bs-uml-master/scripts/check-delivery.js` (R6.1: recomputed `f92e949e…`, matches manifest; read the new windowed `fitReceiptWindow` implementation, hedge guard, whole-field backend exemption, and window-scoped FAIL-verdict test in full)
- `skills/bs-uml-master/scripts/test-check-delivery.js` (R6.1: recomputed `c7f4359c…`, matches manifest)
- `skills/bs-uml-master/scripts/check-render-fit.js` (arg parsing, media profiles, output shape)
- `skills/bs-uml-master/references/layout-craft.md` (R6 rubric preamble: receipts-fill-the-rubric, gestalt-never-scrolls, zoom-waives-nothing)
- `skills/bs-uml-master/references/syntax-pitfalls.md` and `references/rendering-validation.md` (R6 hunks via `git show 03d3a5a`)
- `docs/reviews/bs-uml-master/2026-09-01-haiku-usage-review-3.md` (the R6-triggering usage sample)
- `docs/reviews/bs-uml-master/improvement-points.md` (ledger consistency check)
- `tools/peer-review.js` (recomputed `702587f4…`, matches manifest)
- R6 commit set: `git show` on 32a78f4, 03d3a5a, d428cce, 757ff4e

Commands rerun (first at HEAD 757ff4e, then re-verified after the rebind to R6.1 HEAD 617e76c):

- `node skills/bs-uml-master/scripts/test-check-delivery.js` — ALL PASS; 33 fixtures at 757ff4e, 40 fixtures at 617e76c (both counted from PASS lines), including the new `fit-receipt-perline-fail-smuggle` fixture that encodes my Probe C
- `node skills/bs-uml-master/scripts/test-check-render-fit.js` — ALL PASS
- `bash tools/validate.sh skills/bs-uml-master/` — 16 passed, 0 failed at both revisions (pattern references 8/8, bundled resources 11/11, gate syntax 3 tags well-formed)
- Probe A (theater replay, `scratchpad/adv-r6-advocate/probe-399ed2df-pattern.md`): an otherwise fully compliant delivery — tool+version State line, file:line evidence, budget-clean source — carrying a self-graded rubric ("0 crossings ✅ … medium fit ✅ (artifact is zoomable…)"), no fit receipt. R6/R6.1 checker: `FAIL … RENDER_VERIFIED without a check-render-fit receipt`, exit 1 (re-verified at 617e76c). Same file against the R5-era checker (`git show e48fb20:…/check-delivery.js`): `0 FAIL`, exit 0. This is the exploit-closure claim, verified end to end.
- Probe B (compliant delivery, `scratchpad/adv-r6-advocate/probe-compliant.md`): same block plus a **Fit:** line pasted verbatim from a real `check-render-fit.js` run on a probe SVG — `PASS … check-render-fit receipt present alongside RENDER_VERIFIED`, exit 0 at both revisions. Confirms the honest path is not over-blocked and the tool's actual output shape (canvas WxH, effective px, verdict, "N FAIL" summary) satisfies C8's receipt regexes, including R6.1's stricter 6-line co-occurrence window.
- Probe C (residual hunt, `scratchpad/adv-r6-advocate/probe-truncated-fail-receipt.md`): a **Fit:** line whose FAIL verdict is pasted but whose trailing "1 FAIL" summary is omitted. At 757ff4e C8 reported "receipt present", exit 0 — this was my One Improvement. Replayed unchanged at 617e76c: `FAIL … fit receipt contains a FAIL verdict with no recorded trade-off/USER-OVERRIDE`, exit 1. The vector is closed and fixture-locked.

Ledger consistency: IP-1 through IP-27 enumerated, exactly one open (IP-9, Phase 2.A), footer "27 (26 fixed, 1 open)" — internally consistent. Doc-vs-code spot checks: SKILL.md's check-delivery description ("fit-receipt coupling — RENDER_VERIFIED requires a check-render-fit receipt") matches C8's code; the claim that C8 exemption keys on the Backend field only is verified by the `fit-bypass-fake-text-receipt` fixture and by reading the `textBackend` derivation from `field(block, "Backend")` (R6.1 tightened it further to whole-field matching, so "Mermaid (text annotations)" and the unreplaced template placeholder no longer slip the gate); no stale fixture counts found in SKILL.md (it deliberately states the fixtures' provenance, not a number); the checker's header comment now enumerates C1–C8 including C7, closing the doc-drift nit from my first pass.

## Dimension Scores

| Dimension | Score | Key Strength | Key Concern |
|-----------|------:|--------------|-------------|
| Clarity of trigger description | 9/10 | "Use when" description names the diagram types, the four modes, and the deliverable qualities that trigger it | Dense single sentence; borderline tasks (e.g. "sketch my db schema") rely on the reader parsing a long clause |
| Hard rules / safety gates | 9/10 | 9 numbered rules, 3 HARD-GATEs, and R6's receipts-or-silence rule land the counter at the exact layer the last exploit used | Receipts remain fabricable — the gates bind format, not truth, until Phase 2.A independent verification |
| Workflow correctness | 9/10 | Phases have explicit exits; EXPLAIN/REVIEW carve-out is precise; Phase 4 now names the exact fit command with medium flags | Full workflow is heavy for small asks; the sketch pressure valve exists but depends on correct self-classification |
| Pattern application | 9/10 | 8 declared patterns all resolve (validate.sh 8/8) and are visibly load-bearing, not decorative — confidence-anchors and verification-rules are the skill's spine | Pattern list is static prose; no per-pattern conformance check yet (Phase 2.C) |
| Test prompt coverage | 8/10 | 4 prompts span happy/edge/adversarial/page-bound with observed-baseline failure notes | No dataset prompt yet targets the review-layer theater vector R6 fixes; coverage evidence is schema-only (EVAL_SCHEMA_ONLY) |
| Bundled resources | 9/10 | 9 references + 4 scripts; 40 delivery fixtures + fit fixtures all pass; every fixture encodes a real observed failure vector, including my Probe C as `fit-receipt-perline-fail-smuggle` | Receipts remain fabricable — a forged-but-well-formed receipt window still passes until Phase 2.A truth verification |
| Maintainability | 9/10 | The ledger discipline is exemplary: 27 points, each with source, class, severity, and a closing revision; checker changes ship with fixtures in the same commit | Checker regexes are accreting (hedge-word lists, window heuristics); a structured receipt format would eventually be cleaner than pattern-matching prose |
| Production readiness | 9/10 | R5-vs-R6 differential probe proves the field failure class is mechanically caught; R6.1 closed the adversary's F1–F5 and my Probe C vector same-cycle, each closure replay-verified and fixture-locked | R6.1's own changes have not yet had a fresh adversary pass; receipts are format-bound, not truth-bound, until Phase 2.A |

Total: **71/80**

## Strongest Aspect

The single best design move of R6 is closing the exploit at the layer where it actually occurred, with a differential proof available to anyone. Usage sample #3 showed that when R5 bound the delivery format mechanically, the compliance theater migrated to the one layer still claimable in prose — the review verdicts. R6's answer is not more prose exhortation (which the bindingness-ladder analysis in the usage review correctly predicts a weak model will satisfy *with* prose) but a mechanical coupling: C8 makes a RENDER_VERIFIED claim on a visual backend format-invalid unless the block carries the fit checker's own pasted output, and the FAIL-verdict path demands a recorded trade-off. My probes confirm the before/after: the identical theater block passes the R5 checker (exit 0) and fails the R6 checker (exit 1), while the honest receipt-bearing version passes. That is the repo's core thesis — "every layer that prose can satisfy, a weak model will satisfy with prose" — turned into a working countermeasure with a regression fixture, and it is why this skill keeps getting materially better rather than merely longer.

## One Improvement

My original One Improvement — scoping C8's FAIL-verdict detection into the fit-receipt window rather than relying on the tool's trailing "N FAIL" summary line — was implemented in R6.1 (617e76c) and verified by replay: the exact Probe C file that exited 0 at 757ff4e now exits 1 with "fit receipt contains a FAIL verdict with no recorded trade-off/USER-OVERRIDE", and the vector is regression-locked as fixture `fit-receipt-perline-fail-smuggle`. The next improvement that would most raise quality: make C8 opportunistically truth-checking. When the delivery names the rendered SVG's path (the contract already says to include "rendered file path when one was produced") and that file exists, `check-delivery.js` should re-run `check-render-fit.js` on it with the declared medium and compare the live verdict against the pasted receipt — a mismatch is a FAIL ("receipt does not match the render"). This costs one child-process call, needs no new infrastructure, and converts the checker's biggest honest caveat (receipts are fabricable — IP-9) from fully open to open-only-when-the-artifact-is-withheld, which is itself a signal. Fixture first, per house style: one delivery with a genuine matching receipt, one with a forged PASS receipt over a failing SVG.

## Verdict

**Verdict**: PASS (71/80)

R6, as hardened by R6.1, earns a PASS on demonstrated, replayable evidence: the field-observed failure class (self-certified rubrics over failing renders) is caught mechanically, the honest path is verified not to be over-blocked, all 40 delivery fixtures and all fit fixtures pass, Gate 1 is 16/16, and the improvement ledger is internally consistent at 27 points / 26 fixed / 1 open. The one-point rise over R5's 70 is earned narrowly and specifically: every concrete residual named in this round — my Probe C laundering vector, the adversary's F1–F5, the C7 header-comment drift — was closed within the cycle with replay-verified, fixture-locked fixes, which is the production property that matters most in this design. The score goes no higher because receipts remain format-bound rather than truth-bound until Phase 2.A, the test-prompt dataset (hash unchanged) still lacks a review-layer-theater prompt, and R6.1's own changes await a fresh adversary pass. The honest reading is "steadily hardening under adversarial pressure, with a working same-cycle repair loop" — ship it, take the truth-checking improvement in the next checker touch, and keep the usage-sample loop running.
