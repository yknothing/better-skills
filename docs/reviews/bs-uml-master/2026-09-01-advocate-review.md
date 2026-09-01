# Advocate Review: bs-uml-master

**Date**: 2026-09-01
**Reviewer Role**: Advocate
**Skill**: bs-uml-master
**HUMAN_VERIFIED**: false
**Scope Contract Version**: 1
**Reviewed Revision**: ae6eb2414f8bb92fdca00b635d14d60e7c56ab2b
**Reviewed Skill SHA-256**: 2dbe3df32e0968aff89a296f586a2e867e21a7f447d76b1a75d7384a5cb9f45d
**Reviewed Manifest SHA-256**: a4b8d8be703c8572619f5e0a296a2e78e89516fd09ac102b84d5b331f6268279

## Executive Summary

R5 makes the fit discipline medium-parametric instead of PC-absolute — named `--medium` presets, a viewport-relative aspect band, and the probed result that verdicts legitimately invert between media, which I reproduced on the real probe SVGs — and adds a color-semantics module that turns the observed decorative-rainbow failure into a governed second channel with a mechanical entry gate (check-delivery C7). The R5.1 rebind (this revision) closed the adversary's three real holes, and I verified each closure empirically: non-scrollable media (a4/slide) now collapse the linear scrolling allowance to one screen (the same tall sequence that legally scrolls on `pc` FAILs with a "cannot scroll" message on both), C7 detection was broadened against themeVariables/stroke-only/PlantUML-inline bypasses with an anti-silencing strip, and `--medium` is now documented where Phase 4 actually points. All changes are ledgered (IP-21/22/23; count 23 — upgrade trigger 1 exceeded) and fixture-pinned. I would ship this: every claim I tested reproduced exactly.

## Evidence Reviewed

Full manifest receipt acknowledged: a4b8d8be703c8572619f5e0a296a2e78e89516fd09ac102b84d5b331f6268279

Full manifest receipt `a4b8d8be703c8572619f5e0a296a2e78e89516fd09ac102b84d5b331f6268279` was received and independently verified.

Files examined in full:

- `skills/bs-uml-master/SKILL.md` (SHA verified: 2dbe3df3…) — Rule 9 color-as-second-channel with no-color default; rainbow red-flag row; Phase 3 classDef-driven color discipline; Phase 4 now names `--medium <profile>` with the non-scrollable caveat spelled out inline
- `skills/bs-uml-master/references/color-semantics.md` (SHA verified: abaa0de6…) — read in full: three laws (one dimension per set, hex-identical unified legend, never color alone), authentic Okabe-Ito palette (hex values checked against the published palette), ≤6-hue cap, per-backend implementation table, Phase 5 review checks, opt-in default
- `skills/bs-uml-master/references/layout-craft.md` (SHA verified: 443691dd…) — named media-profile table, the viewport-parametric essence statement, the probed inversion claims, the two-media rule (fit receipts for both profiles or two projections of one ledger)
- `skills/bs-uml-master/references/rendering-validation.md` (SHA verified: c4d3450e…) — inspection checklist now documents `--medium` profiles, the a4/slide non-scrollable rule, all flags, and last-flag-wins semantics
- `skills/bs-uml-master/scripts/check-render-fit.js` (SHA verified: ce446534…) — diffed across R5→R5.1: MEDIA entries now carry a `scrollable` property; non-scrollable media collapse the reading-axis allowance to 1 screen with a distinct FAIL message; INFO line echoes `(non-scrollable)`; bare `--viewport` documented as assumed-scrollable with later-flag-wins
- `skills/bs-uml-master/scripts/check-delivery.js` (SHA verified: 2b5ed391…) — C7 broadened: classDef/style stroke and color keys, themeVariables, PlantUML inline `#hex`/`#name` element colors (with an entity-safe guard so Mermaid `#quot;` escapes do not trip it), plus an anti-silencing strip so "no legend needed" cannot satisfy the legend check
- `skills/bs-uml-master/scripts/test-check-render-fit.js` (SHA verified: 7be5631a…) — 24 fixtures; the new five cover slide/a4 no-scroll FAILs, the pc contrast case, and the readme/phone-landscape profile gaps
- `skills/bs-uml-master/scripts/test-check-delivery.js` (SHA verified: 69c7fc38…) — 24 fixtures observed (`grep -c "^run("` = 24; 24 PASS lines), including `color-themevariables-bypass`, `color-plantuml-inline-bypass`, `color-no-legend-silencing`, and the entity-safe `entities-not-color`
- `docs/reviews/bs-uml-master/improvement-points.md` — IP-23 recorded with the three finding classes and fix summary; count 23, trigger 1 (≥20) exceeded, IP-9/IP-20 honestly still open
- All other reference modules, both harness files, `skills.json`, `tools/peer-review.js`, `tools/test-peer-review-scope.js` — every manifest SHA recomputed with `sha256sum` and matched

Commands rerun (all outputs observed directly, this session):

- `git rev-parse HEAD` → `ae6eb2414f8bb92fdca00b635d14d60e7c56ab2b` (matches Reviewed Revision); diffs `9986df3..a1f466c` and `a1f466c..ae6eb24` inspected in full for the scoped files
- `sha256sum` over all 21 manifest files → all hashes match the manifest
- `node skills/bs-uml-master/scripts/test-check-render-fit.js` → ALL PASS (24 fixtures, including `slide-linear-no-scroll`, `a4-linear-no-scroll`, `pc-same-linear-scrolls`, `readme-profile-works`, `phone-landscape-profile`)
- `node skills/bs-uml-master/scripts/test-check-delivery.js` → ALL PASS (24 fixtures, including all four new color-bypass/anti-silencing cases)
- Non-scrollable probe on a synthetic tall sequence SVG (700×1900, sequence roledescription): `--medium slide` → FAIL "reading axis spans 2.6 screens but medium \"slide\" cannot scroll", INFO echoes `medium=slide (non-scrollable)`; `--medium a4` → same FAIL class at 1.7 screens; default `pc` → exit 0 with the legal-scroll WARN — the scrollability distinction is live, not documentation
- Real-SVG medium-inversion probe (scratchpad `haiku-v2/`, R5 round, re-validated): `d1-elk.svg --medium phone` → FAIL (4.2px) with the phone-band aspect WARN; default → PASS (14.5px); `d1.svg --medium phone` → FAIL on volume with no aspect warning
- `bash tools/validate.sh skills/bs-uml-master` → 16 passed, 0 failed (bundled resources 11/11 including color-semantics.md)

## Dimension Scores

| Dimension | Score | Key Strength | Key Concern |
|-----------|------:|--------------|-------------|
| Clarity of trigger description | 9/10 | "Use when" form; enumerates the nine diagram families and the four quality dimensions that distinguish it from syntax-only skills | Long single sentence; borderline dense for a router |
| Hard rules / safety gates | 9/10 | Three HARD-GATE tags; two deterministic checkers with in-repo regression suites; C7 now resists themeVariables/stroke-only/inline-hex bypasses and "no legend needed" silencing; non-scrollable media can no longer borrow the scroll allowance | Fit receipts still self-attested (IP-20 open) |
| Workflow correctness | 9/10 | Phase 0 medium flows mechanically into Phase 4 via a now-documented `--medium`; the a4/slide no-scroll rule is stated at the exact point of use; two-media deliveries get an explicit rule (both receipts or two projections) | Growing per-delivery overhead at deliverable+: two checkers, a mirror contract for HTML, per-medium receipts |
| Pattern application | 9/10 | 8/8 declared patterns resolve (validate.sh) and are load-bearing — C7 extends verification-rules to a channel that was previously vibes-only | None material |
| Test prompt coverage | 8/10 | 4 prompts spanning happy/edge/adversarial/layout-stress with observed baselines; prompt 4 exercises medium discipline | No test prompt yet targets color discipline or a phone/slide medium; harness remains EVAL_SCHEMA_ONLY |
| Bundled resources | 9/10 | 11/11 exist; media profiles are viewport-parametric with a scrollability property rather than more hardcodes — the same rules produce inverted verdicts across media and hard-stop on print/slide, pinned by fixtures AND reproduced on real renders plus a live probe; color module uses the authentic Okabe-Ito palette with per-backend mechanics | Parts of the color module remain checklist-enforceable but unmechanized (hex-identity across a set, bidirectional legend coverage, 4.5:1 contrast); IP-23's ledger note says "25 delivery fixtures" where 24 exist — a harmless arithmetic slip worth correcting |
| Maintainability | 9/10 | 23-IP ledger with source, class, severity, fix revision — trigger 1 formally exceeded; three review rounds in a row turned adversary findings into same-day fixture-pinned fixes | Ledger discipline is manual; nothing enforces new-IP capture |
| Production readiness | 8/10 | Two usage rounds, three adversary rebinds, and two user-directed design rounds each landed as enforcement plus fixtures; real-SVG regression, the inversion probes, and the no-scroll probe all reproduce exactly | IP-20 (fit-receipt coupling) still open and more consequential now that receipts are per-medium; C7 remains a WARN-level nudge by design |

Total: 70/80

## Strongest Aspect

The single best design move in R5/R5.1 is refusing to fix the "PC hardcode" critique the cheap way, twice. The obvious patch would have been more constants; instead the aspect band became a function of the viewport (0.3×–1.5× of the medium's own aspect), the media became named profiles feeding the same unchanged rules, and — when the adversary showed the model was still one property short — scrollability joined the profile rather than being special-cased per medium, so a print page and a projected slide collapse the linear allowance to one screen through the same parametric path. The payoff is a checker that now correctly produces *different verdicts from the same SVG* along two independent axes — viewport shape and scrollability — and the repo proved both rather than asserting them: fixtures pin them synthetically, and I reproduced them live (the ELK layout that wins on `pc` fails with the opposite-direction aspect warning on `phone`; the tall sequence that legally scrolls on `pc` hard-fails with "cannot scroll" on `slide` and `a4`). That converts Phase 0's "capture the medium" from paperwork into a parameter with mechanical consequences at every declared destination. The color module rides the same philosophy — opt-in for one declared dimension, default untouched theme — and after R5.1 its C7 entry gate resists the cheap bypasses (stroke-only styling, themeVariables, PlantUML inline hex, "no legend needed" prose).

## One Improvement

Close IP-20, now with media awareness: `check-delivery.js` still has no knowledge of either fit checking or the declared medium, so an agent can pass the delivery checker while never running `check-render-fit.js` — and the media-profile work raises the stakes, because layout-craft requires *per-profile* receipts for multi-medium deliveries and nothing mechanical notices their absence. A checker extension that, when State is RENDER_VERIFIED, requires a fit-receipt token naming the medium (e.g. `fit: PASS 14.5px@pc` / a recorded trade-off-ladder step) and cross-checks it against the contract's Medium field would close the last self-attested link in the delivery chain and make the two-media rule enforceable rather than honor-system; the same pass could harden C7 further by extracting the hex values used in the source and checking each appears in a legend mapping — turning the color module's aspirational bidirectional-coverage check into a mechanical one — and fix the ledger's off-by-one fixture count while in the file.

## Verdict

**Verdict**: PASS (70/80)

R5.1 extends a skill whose defining habit — probe first, then legislate, then pin with fixtures — held again under my independent verification: both self-tests pass (24+24 fixtures), Gate 1 passes 16/16 with the color module registered, the medium-inversion claims reproduce on the real probe SVGs down to the pixel values, and the new scrollability rule is demonstrably live — the identical SVG exits 0 with a WARN on `pc` and exits 1 with a purpose-written "cannot scroll" message on `slide` and `a4`. My honest assessment of the color module is unchanged in kind but improved in degree: the entry gate is mechanical and now bypass-resistant with all four adversary vectors fixture-pinned, the three laws are concrete enough for in-context Phase 5 checking, and the remaining aspirational parts (hex-identity, bidirectional legend coverage, contrast) are visible targets rather than hidden gaps. Three consecutive rounds of adversary findings landing as same-day, fixture-encoded, ledgered fixes — with the open items (IP-9, IP-20) and even a fixture-count slip left honestly visible — is precisely the behavior this repo's review pipeline exists to produce.
