# Advocate Review: bs-uml-master

**Date**: 2026-09-01
**Reviewer Role**: Advocate
**Skill**: bs-uml-master
**HUMAN_VERIFIED**: false
**Scope Contract Version**: 1
**Reviewed Revision**: 7f9fdae59ddd9ce37bb60d446952cc2176613b13
**Reviewed Skill SHA-256**: da8087e49d55d0f4c732f4adfe04021d2965153577fd9d780f6ae836f22e1abb
**Reviewed Manifest SHA-256**: caa8e19fb16a7b7427706cee14b0e181c0682601b3723d9e73857d06345d77de

## Executive Summary

R6 is the strongest revision of this skill so far because it does the thing the whole repo exists to prove is possible: it took a live field failure (usage sample #3, artifact 399ed2df — four diagrams self-certified "medium fit ✅ / 0 crossings" that all measure FAIL at 8.3–9.6px), converted it into three ledger entries, and closed the exploit *mechanically* the same day with C8 fit-receipt coupling plus point-of-temptation prose counters. I replayed the exact 399ed2df failure pattern against both the R5 and R6 checkers: R5 passes it with exit 0, R6 fails it on C8 — the delta is real, demonstrated, and regression-locked by fixture. This review was rebound three times in-cycle: to R6.1 (617e76c), which closed the adversary round's F1–F5 and the residual my own probing found; to R6.2 (1f4219a), closing F7–F9, whose F8 fix I found had partially re-opened my probed vector in inline-condensed form; and to R6.3 (7f9fdae), which implements my updated One Improvement verbatim — union FAIL detection (window-scoped any-FAIL + block-wide line-start-with-fit-vocabulary + summary counts, over fence-masked text for F10) — with my exact probe shape pinned as fixture `fit-receipt-inline-fail-no-summary` and two no-false-positive companions. Closure re-verified by replay: the probe that exited 0 at R6.2 exits 1 at R6.3, and the honest-receipt probe still exits 0. I would ship this revision, while noting honestly that the checker binds receipt *format*, not receipt *truth* (IP-9 stays open until Phase 2.A).

## Evidence Reviewed

Full manifest receipt `caa8e19fb16a7b7427706cee14b0e181c0682601b3723d9e73857d06345d77de` was received and independently verified.

Files examined in full:

- `skills/bs-uml-master/SKILL.md` (sha256 locally recomputed: matches the manifest's `da8087e4…`)
- `skills/bs-uml-master/scripts/check-delivery.js` (R6.3: recomputed `b11a5a2b…`, matches manifest; read the full C8 evolution across revisions — R6.1's windowed receipt + hedge guard + whole-field backend exemption, R6.2's fence-over-field exemption veto and forward-only 8-line windows, R6.3's fence masking and three-scan union FAIL detection)
- `skills/bs-uml-master/scripts/test-check-delivery.js` (R6.3: recomputed `ddf300ac…`, matches manifest)
- `skills/bs-uml-master/scripts/check-render-fit.js` (arg parsing, media profiles, output shape)
- `skills/bs-uml-master/references/layout-craft.md` (R6 rubric preamble: receipts-fill-the-rubric, gestalt-never-scrolls, zoom-waives-nothing)
- `skills/bs-uml-master/references/syntax-pitfalls.md` and `references/rendering-validation.md` (R6 hunks via `git show 03d3a5a`)
- `docs/reviews/bs-uml-master/2026-09-01-haiku-usage-review-3.md` (the R6-triggering usage sample)
- `docs/reviews/bs-uml-master/improvement-points.md` (ledger consistency check)
- `tools/peer-review.js` (recomputed `702587f4…`, matches manifest)
- R6 commit set: `git show` on 32a78f4, 03d3a5a, d428cce, 757ff4e

Commands rerun (first at HEAD 757ff4e, re-verified after each rebind — R6.1 HEAD 617e76c, R6.2 HEAD 1f4219a, R6.3 HEAD 7f9fdae):

- `node skills/bs-uml-master/scripts/test-check-delivery.js` — ALL PASS; 33 fixtures at 757ff4e, 40 at 617e76c, 44 at 1f4219a, 47 at 7f9fdae (all counted from PASS lines), including `fit-receipt-perline-fail-smuggle` (verbatim-paste form of my Probe C), `fit-receipt-inline-fail-no-summary` (my Probe C's exact inline shape), and the companions `fail-node-in-fence-clean-receipt` / `fail-prose-line-clean-receipt` asserting no false positives
- `node skills/bs-uml-master/scripts/test-check-render-fit.js` — ALL PASS
- `bash tools/validate.sh skills/bs-uml-master/` — 16 passed, 0 failed at all four revisions (pattern references 8/8, bundled resources 11/11, gate syntax 3 tags well-formed)
- Probe A (theater replay, `scratchpad/adv-r6-advocate/probe-399ed2df-pattern.md`): an otherwise fully compliant delivery — tool+version State line, file:line evidence, budget-clean source — carrying a self-graded rubric ("0 crossings ✅ … medium fit ✅ (artifact is zoomable…)"), no fit receipt. R6 through R6.3: `FAIL … RENDER_VERIFIED without a check-render-fit receipt`, exit 1 (re-verified at 7f9fdae). Same file against the R5-era checker (`git show e48fb20:…/check-delivery.js`): `0 FAIL`, exit 0. This is the exploit-closure claim, verified end to end.
- Probe B (compliant delivery, `scratchpad/adv-r6-advocate/probe-compliant.md`): same block plus a **Fit:** line pasted verbatim from a real `check-render-fit.js` run on a probe SVG — `PASS … check-render-fit receipt present alongside RENDER_VERIFIED`, exit 0 at all four revisions. Confirms the honest path is not over-blocked and the tool's actual output shape (canvas WxH, effective px, verdict, "N FAIL" summary) satisfies C8's receipt regexes, including R6.3's union FAIL scan (the honest "0 FAIL" summary does not false-positive).
- Probe C (residual hunt, `scratchpad/adv-r6-advocate/probe-truncated-fail-receipt.md`): a one-line **Fit:** field carrying a mid-line FAIL verdict with the trailing "1 FAIL" summary omitted. At 757ff4e: "receipt present", exit 0 (my original One Improvement). At 617e76c: caught, exit 1. At 1f4219a: re-opened by the F8 fix's narrowed token — "receipt present", exit 0. At 7f9fdae: **closed again**, exit 1 via the window-scoped any-FAIL scan, and pinned as fixture `fit-receipt-inline-fail-no-summary`. The companion probe (`probe-verbatim-fail-receipt.md`, the tool's multi-line output pasted verbatim, FAIL at line start) exits 1 at every revision since R6.1. The full arc — found, closed, regressed under an unrelated fix, re-closed with the probe as a fixture — is the repair loop working as designed, with the R6.2 step also showing why replays on every rebind are not optional.

Ledger consistency: IP-1 through IP-27 enumerated, exactly one open (IP-9, Phase 2.A), footer "27 (26 fixed, 1 open)" — internally consistent. Doc-vs-code spot checks: SKILL.md's check-delivery description ("fit-receipt coupling — RENDER_VERIFIED requires a check-render-fit receipt") matches C8's code; the claim that C8 exemption keys on the Backend field only is verified by the `fit-bypass-fake-text-receipt` fixture and by reading the `textBackend` derivation from `field(block, "Backend")` (R6.1 tightened it to whole-field matching, so "Mermaid (text annotations)" and the unreplaced template placeholder no longer slip the gate; R6.2 added the fence veto — a "text" Backend declaration over a mermaid/plantuml-shaped fence no longer earns the exemption); no stale fixture counts found in SKILL.md (it deliberately states the fixtures' provenance, not a number); the checker's header comment now enumerates C1–C8 including C7, closing the doc-drift nit from my first pass.

## Dimension Scores

| Dimension | Score | Key Strength | Key Concern |
|-----------|------:|--------------|-------------|
| Clarity of trigger description | 9/10 | "Use when" description names the diagram types, the four modes, and the deliverable qualities that trigger it | Dense single sentence; borderline tasks (e.g. "sketch my db schema") rely on the reader parsing a long clause |
| Hard rules / safety gates | 9/10 | 9 numbered rules, 3 HARD-GATEs, and R6's receipts-or-silence rule land the counter at the exact layer the last exploit used | Receipts remain fabricable — the gates bind format, not truth, until Phase 2.A independent verification |
| Workflow correctness | 9/10 | Phases have explicit exits; EXPLAIN/REVIEW carve-out is precise; Phase 4 now names the exact fit command with medium flags | Full workflow is heavy for small asks; the sketch pressure valve exists but depends on correct self-classification |
| Pattern application | 9/10 | 8 declared patterns all resolve (validate.sh 8/8) and are visibly load-bearing, not decorative — confidence-anchors and verification-rules are the skill's spine | Pattern list is static prose; no per-pattern conformance check yet (Phase 2.C) |
| Test prompt coverage | 8/10 | 4 prompts span happy/edge/adversarial/page-bound with observed-baseline failure notes | No dataset prompt yet targets the review-layer theater vector R6 fixes; coverage evidence is schema-only (EVAL_SCHEMA_ONLY) |
| Bundled resources | 9/10 | 9 references + 4 scripts; 47 delivery fixtures + fit fixtures all pass; every fixture encodes a real observed failure vector, with both forms of my Probe C pinned (`fit-receipt-perline-fail-smuggle`, `fit-receipt-inline-fail-no-summary`) plus no-false-positive companions | Receipts remain fabricable — a forged-but-well-formed receipt window still passes until Phase 2.A truth verification |
| Maintainability | 9/10 | The ledger discipline is exemplary: 27 points, each with source, class, severity, and a closing revision; checker changes ship with fixtures in the same commit; the R6.2 regression was caught by rebind replay and re-closed in one commit | Checker regexes are accreting (hedge-word lists, window heuristics, three-scan unions) — the R6.2 episode shows interacting regexes can fix one hole by widening another; a structured receipt format would eventually be cleaner |
| Production readiness | 9/10 | R5-vs-R6 differential probe proves the field failure class is mechanically caught; ten adversary findings plus my probe closed same-cycle across R6.1–R6.3, every closure replay-verified and fixture-locked, and the one regression re-closed with the probe pinned | R6.3's changes await a fresh adversary pass; receipts are format-bound, not truth-bound, until Phase 2.A |

Total: **71/80**

## Strongest Aspect

The single best design move of R6 is closing the exploit at the layer where it actually occurred, with a differential proof available to anyone. Usage sample #3 showed that when R5 bound the delivery format mechanically, the compliance theater migrated to the one layer still claimable in prose — the review verdicts. R6's answer is not more prose exhortation (which the bindingness-ladder analysis in the usage review correctly predicts a weak model will satisfy *with* prose) but a mechanical coupling: C8 makes a RENDER_VERIFIED claim on a visual backend format-invalid unless the block carries the fit checker's own pasted output, and the FAIL-verdict path demands a recorded trade-off. My probes confirm the before/after: the identical theater block passes the R5 checker (exit 0) and fails the R6 checker (exit 1), while the honest receipt-bearing version passes. That is the repo's core thesis — "every layer that prose can satisfy, a weak model will satisfy with prose" — turned into a working countermeasure with a regression fixture, and it is why this skill keeps getting materially better rather than merely longer.

## One Improvement

Both of my earlier One Improvements are now implemented and replay-verified: R6.1 took the window-scoped FAIL detection, and R6.3 (7f9fdae) took the union proposal verbatim — window-scoped any-FAIL (restoring inline-receipt coverage), block-wide line-start verdict lines gated on fit-tool vocabulary, and "N FAIL" summary counts, all over fence-masked text so a legitimate `FAIL["Gate failed"]` node cannot false-positive (adversary F10); my probe shapes are pinned as fixtures with clean-receipt companions. The next improvement that would most raise quality: make C8 opportunistically truth-checking. When the delivery names the rendered SVG's path (the contract already says to include "rendered file path when one was produced") and that file exists, `check-delivery.js` should re-run `check-render-fit.js` on it with the declared medium and compare the live verdict against the pasted receipt — a mismatch is a FAIL ("receipt does not match the render"). This costs one child-process call, needs no new infrastructure, and converts the checker's biggest honest caveat (receipts are fabricable — IP-9) from fully open to open-only-when-the-artifact-is-withheld, which is itself a signal worth flagging. It would also have caught the class of forgery no format rule can: a perfectly shaped receipt that was never run. Fixture first, per house style: one delivery with a genuine matching receipt beside its SVG, one with a forged PASS receipt over a failing SVG.

## Verdict

**Verdict**: PASS (71/80)

R6, as hardened through R6.1–R6.3, earns a PASS on demonstrated, replayable evidence: the field-observed failure class (self-certified rubrics over failing renders) is caught mechanically, the honest path is verified not to be over-blocked at any of the four reviewed revisions, all 47 delivery fixtures and all fit fixtures pass, Gate 1 is 16/16, and the improvement ledger is internally consistent at 27 points / 26 fixed / 1 open. The score lands at 71 — one above R5 — and the movement across my rebinds (70 → 71 → 70 → 71) tracked evidence, not enthusiasm: the point came off when my Probe C vector regressed at R6.2 and comes back on now that R6.3 has re-closed it with the exact probe shape pinned as a fixture and no-false-positive companions proving the union scan doesn't over-block. What earns the point is not any single regex but the demonstrated property that matters most for production: ten adversary findings, my probe, and one regression were all closed same-cycle with replay-verified, fixture-locked fixes. The score goes no higher because receipts remain format-bound rather than truth-bound until Phase 2.A, the test-prompt dataset (hash unchanged all cycle) still lacks a review-layer-theater prompt, and R6.3's own changes await a fresh adversary pass. Ship it, take the truth-checking improvement in the next checker touch, and keep the usage-sample loop running.
