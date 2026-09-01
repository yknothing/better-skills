# Advocate Review: bs-uml-master

**Date**: 2026-09-01
**Reviewer Role**: Advocate
**Skill**: bs-uml-master
**HUMAN_VERIFIED**: false
**Scope Contract Version**: 1
**Reviewed Revision**: a1f466c32c5bfb96c40fe15b030ca7e8aa4a8c0a
**Reviewed Skill SHA-256**: d2be2d55a53d87eef9064a6c98cadfb15b4304570a75f6d1a66a51b99af3410b
**Reviewed Manifest SHA-256**: dd0789cd92283241929afc13d0bf29ae01b87b9b761ab15aac46b13923e88b35

## Executive Summary

R5 makes the fit discipline medium-parametric instead of PC-absolute — named `--medium` presets, a viewport-relative aspect band, and the striking probed result that verdicts legitimately invert between media, which I reproduced on the real probe SVGs (the ELK layout that PASSes on `pc` FAILs at 4.2px with the opposite-direction aspect warning on `phone`, while the PC-failing tower is direction-correct there) — and adds a color-semantics module that turns the observed decorative-rainbow failure into a governed second channel with a mechanical entry gate (check-delivery C7). Both changes are user-directed, ledgered (IP-21/22, count now 22 — upgrade trigger 1 exceeded), and fixture-pinned (19 fit + 20 delivery fixtures, ALL PASS). I would ship this: every claim I tested reproduced exactly.

## Evidence Reviewed

Full manifest receipt acknowledged: dd0789cd92283241929afc13d0bf29ae01b87b9b761ab15aac46b13923e88b35

Full manifest receipt `dd0789cd92283241929afc13d0bf29ae01b87b9b761ab15aac46b13923e88b35` was received and independently verified.

Files examined in full:

- `skills/bs-uml-master/SKILL.md` (SHA verified: d2be2d55…) — Rule 9 extended to color as a second semantic channel with a no-color default; rainbow red-flag row; Phase 3 classDef-driven color discipline; Color Semantics wired into progressive disclosure and Bundled Resources
- `skills/bs-uml-master/references/color-semantics.md` (SHA verified: abaa0de6…) — new module read in full: three laws (one dimension per set, hex-identical unified legend, never color alone), authentic Okabe-Ito palette (hex values checked against the published palette), ≤6-hue cap, per-backend implementation table, Phase 5 review checks, opt-in default
- `skills/bs-uml-master/references/layout-craft.md` (SHA verified: 443691dd…) — named media-profile table (pc/phone/phone-landscape/a4/readme/slide), the viewport-parametric essence statement, the probed inversion claims, and the two-media rule (fit receipts for both profiles or two projections of one ledger)
- `skills/bs-uml-master/scripts/check-render-fit.js` (SHA verified: 0c06addd…) — diffed against R4.1: MEDIA presets, `--medium` flag with medium echoed in INFO, aspect band now viewport-relative (0.3×–1.5× the viewport aspect) instead of the hardcoded 0.5–2.5
- `skills/bs-uml-master/scripts/check-delivery.js` (SHA verified: 112c0c6f…) — C7: color-styling constructs (classDef/style fill, skinparam Color, fill:#) without a legend/declared-dimension mention draw a WARN
- `skills/bs-uml-master/scripts/test-check-render-fit.js` (SHA verified: 34e8b19e…) — 19 fixtures; 14-series pins the medium inversion (portrait-in-band on phone, tower-fails-volume-not-direction, landscape-shape-warned-on-phone, pc-band, usage error) with the new mustNotMatch capability
- `skills/bs-uml-master/scripts/test-check-delivery.js` (SHA verified: 89e028b6…) — 20 fixtures; the C7 pair covers both branches (WARN without, clean with declared dimension)
- `docs/reviews/bs-uml-master/improvement-points.md` — IP-21/22 recorded as user-directed with probe citations; count 22, trigger 1 (≥20) exceeded, IP-9/IP-20 honestly still open
- All other reference modules, both harness files, `skills.json`, `tools/peer-review.js`, `tools/test-peer-review-scope.js` — every manifest SHA recomputed with `sha256sum` and matched

Commands rerun (all outputs observed directly, this session):

- `git rev-parse HEAD` → `a1f466c32c5bfb96c40fe15b030ca7e8aa4a8c0a` (matches Reviewed Revision); diff `9986df3..a1f466c` inspected in full for the scoped files
- `sha256sum` over all 21 manifest files → all hashes match the manifest
- `node skills/bs-uml-master/scripts/test-check-render-fit.js` → ALL PASS (19 fixtures, including `phone-small-portrait-fits`, `phone-big-tower-volume-not-direction`, `phone-landscape-shape-warned`, `pc-landscape-shape-in-band`, `bad-medium-usage`)
- `node skills/bs-uml-master/scripts/test-check-delivery.js` → ALL PASS (20 fixtures, including `color-without-legend` and `color-with-dimension`)
- Real-SVG medium-inversion probe (scratchpad `haiku-v2/`): `check-render-fit.js d1-elk.svg --medium phone` → FAIL (4.2px) plus the aspect WARN naming the phone band (0.16–0.79 for viewport aspect 0.53); same file with default medium → PASS (14.5px, medium=pc echoed in INFO); `d1.svg --medium phone` → FAIL on volume (5.7px) with **no** aspect warning — confirming the ledgered claim that the tower's failure on phone is content volume, not direction
- `bash tools/validate.sh skills/bs-uml-master` → 16 passed, 0 failed (bundled resources now 11/11 including color-semantics.md)

## Dimension Scores

| Dimension | Score | Key Strength | Key Concern |
|-----------|------:|--------------|-------------|
| Clarity of trigger description | 9/10 | "Use when" form; enumerates the nine diagram families and the four quality dimensions that distinguish it from syntax-only skills | Long single sentence; borderline dense for a router |
| Hard rules / safety gates | 9/10 | Three HARD-GATE tags; two deterministic checkers with in-repo regression suites; C7 makes silent decorative color noisy; no-color default removes the most common styling failure by construction | Fit receipts still self-attested (IP-20 open); C7's legend regex is satisfiable by a trivial mention — a WARN-level nudge, not proof of a real legend |
| Workflow correctness | 9/10 | Phases have exit criteria; Phase 0 medium now flows mechanically into Phase 4 via `--medium`; Phase 3 routes color through classDef/stereotype discipline; two-media deliveries get an explicit rule (both receipts or two projections) | Growing per-delivery overhead at deliverable+; two checkers, a mirror contract for HTML, and now per-medium receipts |
| Pattern application | 9/10 | 8/8 declared patterns resolve (validate.sh) and are load-bearing — C7 extends verification-rules to a channel that was previously vibes-only | None material |
| Test prompt coverage | 8/10 | 4 prompts spanning happy/edge/adversarial/layout-stress with observed baselines; prompt 4 exercises medium discipline | No test prompt yet targets color discipline or a phone/slide medium; harness remains EVAL_SCHEMA_ONLY |
| Bundled resources | 9/10 | 11/11 exist; media profiles are viewport-parametric rather than a second set of hardcodes — the same four rules produce inverted verdicts across media, pinned by fixtures AND reproduced on real renders; color module uses the authentic Okabe-Ito palette with per-backend mechanics, not just exhortation | Parts of the color module are agent-checklist enforceable but not mechanized: hex-identity across a set, bidirectional legend coverage, and the 4.5:1 contrast check have no tooling yet |
| Maintainability | 9/10 | 22-IP ledger with source, class, severity, fix revision — trigger 1 formally exceeded with the schema CLAUDE.md envisioned; mustNotMatch added to the fixture harness exactly when negative assertions became load-bearing | Ledger discipline is manual; nothing enforces new-IP capture |
| Production readiness | 8/10 | Two usage rounds, two adversary rebinds, and two user-directed design rounds each landed as enforcement plus fixtures; real-SVG regression and the inversion probes reproduce exactly | IP-20 (fit-receipt coupling) still open and now more consequential — media profiles multiply the receipts an agent could silently skip |

Total: 70/80

## Strongest Aspect

The single best design move in R5 is refusing to fix the "PC hardcode" critique the cheap way. The obvious patch would have been more constants; instead the aspect band became a function of the viewport (0.3×–1.5× of the medium's own aspect) and the media became named profiles feeding the same four unchanged rules — fit the cross axis, scroll only along the reading axis, keep endpoints co-visible, stay near the medium's band. The payoff is that the checker now correctly produces *opposite verdicts from the same SVG* depending on the declared medium, and the repo proved it rather than asserting it: the fixtures pin the inversion synthetically, and I reproduced it on the real Haiku probe renders — the 1.59:1 ELK layout that wins on a PC screen fails on `phone` with an aspect warning pointing the *other* direction, while the 0.40:1 tower that fails a PC screen triggers no direction warning on phone at all, failing purely on volume. That is exactly what a medium-honest gate should do, and it converts Phase 0's "capture the medium" from paperwork into a parameter with mechanical consequences. The color module rides the same philosophy — color is opt-in for one declared dimension, with the default being the renderer's theme — so the most common observed failure (per-node decorative pastels) is now both discouraged by rule and surfaced mechanically by C7.

## One Improvement

Close IP-20, now with media awareness: `check-delivery.js` still has no knowledge of either fit checking or the declared medium, so an agent can pass the delivery checker while never running `check-render-fit.js` — and R5 raises the stakes, because layout-craft now requires *per-profile* receipts for multi-medium deliveries and nothing mechanical notices their absence. A checker extension that, when State is RENDER_VERIFIED, requires a fit-receipt token naming the medium (e.g. `fit: PASS 14.5px@pc` / a recorded trade-off-ladder step) and cross-checks it against the contract's Medium field would close the last self-attested link in the delivery chain and make the two-media rule enforceable rather than honor-system; the same pass could harden C7 from "a word like legend appears" toward extracting the hex values used in the source and checking that each appears in a legend mapping — turning the color module's currently aspirational bidirectional-coverage check into a mechanical one.

## Verdict

**Verdict**: PASS (70/80)

R5 extends a skill whose defining habit — probe first, then legislate, then pin with fixtures — held again under my independent verification: both self-tests pass (19+20 fixtures), Gate 1 passes 16/16 with the new module registered, the medium-inversion claims reproduce exactly on the real probe SVGs down to the pixel values and the absence of the direction warning on the phone-tower case, and the Okabe-Ito palette is the genuine article rather than an invented "safe" list. My honest assessment of the color module is that it is roughly half enforceable today — the entry gate (color present without a declared dimension) is mechanical via C7 with both fixture branches covered, and the three laws are concrete enough for in-context Phase 5 checking — and half aspirational (hex-identity, bidirectional legend coverage, contrast), which the module does not hide and which my One Improvement targets. Both R5 features were user-directed rather than reviewer-driven, ledgered as IP-21/22 with probe citations, pushing the ledger past upgrade trigger 1 exactly as the repo's own quality process intends. The open items (IP-9, IP-20) remain visible, scheduled, and honestly labeled — the behavior this pipeline exists to produce.
