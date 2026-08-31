# Advocate Review: bs-uml-master

**Date**: 2026-08-31
**Reviewer Role**: Advocate
**Skill**: bs-uml-master
**HUMAN_VERIFIED**: false
**Scope Contract Version**: 1
**Reviewed Revision**: 2c78b6199011ef44638212b518cebe3dc3117a01
**Reviewed Skill SHA-256**: 4d7dd265a50f83de14ea84990932499f8b3c09e0ccbcde8a6f6736c10ff73a27
**Reviewed Manifest SHA-256**: e3f8e564af9ef734217d12d9c21915ae7e159068141e53e63c75a4e4f8225aa8

## Executive Summary

R4 converts the last major judgment call in this skill — "does the layout serve the reader?" — into a mechanical, dependency-free gate (`check-render-fit.js`), and the R4.1 rebind (this revision) repaired the gate's real defects against actual mermaid 11 output: I independently reproduced the worst one (the v1 edge regex matched 0 of the real edges because mermaid emits `d=` before `class=`; the v2 order-independent parser matches 5/5 on the same file) and confirmed all five fixes are fixture-covered. The skill is now on its fifth empirically-driven iteration, each traceable through a 20-entry improvement-points ledger from observed failure to specific enforcement, with the rebind itself demonstrating that the adversary/advocate pipeline catches what synthetic self-tests miss. I would ship this: every claim I tested held up under rerun.

## Evidence Reviewed

Full manifest receipt acknowledged: e3f8e564af9ef734217d12d9c21915ae7e159068141e53e63c75a4e4f8225aa8

Full manifest receipt `e3f8e564af9ef734217d12d9c21915ae7e159068141e53e63c75a4e4f8225aa8` was received and independently verified.

Files examined in full:

- `skills/bs-uml-master/SKILL.md` (SHA verified: 4d7dd265…) — R4 wiring plus the R4.1 Phase 4 change: `--viewport WxH` must carry the Phase 0 medium ("certifying fit against the wrong medium is a false receipt"), and manual `--kind linear` is framed as a defensible claim, not a knob
- `skills/bs-uml-master/scripts/check-render-fit.js` (SHA verified: 21353bc5…) — v2 read line by line and diffed against v1: order-independent tag/attribute parsing, `<line>` sequence-message support, `isSequence` requiring markers on real elements (classDef text no longer spoofs), sequence-forces-vertical reading axis, audit WARN on manual linear without markers
- `skills/bs-uml-master/scripts/test-check-render-fit.js` (SHA verified: 9c8400de…) — 13 fixtures; 9–13 encode the adversary's findings (d-before-class, line edges, wide-sequence overflow, classDef spoof, laundering WARN)
- `skills/bs-uml-master/references/layout-craft.md` and `references/rendering-validation.md` (SHAs verified) — fit-to-screen discipline, trade-off ladder, probed layered-architecture recipe; R4.1 integrates the fit gate and its flags into the inspection checklist and folds fit output into the RENDER_VERIFIED receipt
- `skills/bs-uml-master/scripts/check-delivery.js` and `test-check-delivery.js` (SHAs verified) — confirmed no fit-receipt coupling exists; now ledgered open as IP-20
- `docs/reviews/bs-uml-master/2026-08-31-haiku-usage-review-2.md` and `improvement-points.md` (IP-14 through IP-20) — the failure evidence R4/R4.1 answer
- `docs/research/uml-diagramming-analysis.md` — STUDY basis, including the 25% relationship-correctness finding that IP-16 mechanically addresses
- All 8 reference modules, both harness files, `skills.json`, `tools/peer-review.js`, `tools/test-peer-review-scope.js` — every manifest SHA recomputed with `sha256sum` and matched

Commands rerun (all outputs observed directly, this session):

- `git rev-parse HEAD` → `2c78b6199011ef44638212b518cebe3dc3117a01` (matches Reviewed Revision); diff `2b94700..2c78b61` inspected in full for the scoped files
- `sha256sum` over all 20 manifest files → all 20 hashes match the manifest
- `node skills/bs-uml-master/scripts/test-check-delivery.js` → ALL PASS (18 fixtures)
- `node skills/bs-uml-master/scripts/test-check-render-fit.js` → ALL PASS (13 fixtures), including `edge-d-before-class`, `sequence-line-edges`, `wide-sequence-overflow`, `classdef-actor-spoof`, and `manual-linear-laundering-warn`
- Independent reproduction of the IP-17 defect on the real probe SVG (scratchpad `haiku-v2/d1.svg`): v1's edge regex → 0 matches; v2's parser → 5 matches (the file's `path` tags carry `d=` before `class=`, as the adversary reported)
- `node skills/bs-uml-master/scripts/check-render-fit.js` v2 on the four real probe SVGs from the Haiku #2 review: `d1.svg` → FAIL (6.5px, aspect 0.40:1 WARN), `d2.svg` → FAIL (7.0px), `d1-elk.svg` → PASS (14.5px), `d3.svg` → PASS (12.0px) — the real-SVG regression is unchanged by the v2 rework and all four verdicts still match the human judgments recorded in the usage review
- `bash tools/validate.sh skills/bs-uml-master` → 16 passed, 0 failed (pattern references 8/8, bundled resources 10/10, gate syntax 3/3, frontmatter schema)

## Dimension Scores

| Dimension | Score | Key Strength | Key Concern |
|-----------|------:|--------------|-------------|
| Clarity of trigger description | 9/10 | "Use when" form; enumerates the nine diagram families and the four quality dimensions that distinguish it from syntax-only skills | Long single sentence; borderline dense for a router |
| Hard rules / safety gates | 9/10 | Three well-formed HARD-GATE tags; two deterministic checkers with in-repo regression suites; receipt-bearing state vocabulary; R4.1 closes the kind-laundering and wrong-viewport receipt holes | Fit gate still self-attested — check-delivery.js does not demand a fit receipt (IP-20, open) |
| Workflow correctness | 9/10 | Phases have exit criteria; medium constraints captured in Phase 0 and now explicitly carried into the Phase 4 fit command; bounded repair loops (≤5) with a defined escalation ladder; EXPLAIN/REVIEW skip path specified | Two checkers plus mirror-contract for HTML adds real per-delivery overhead at deliverable+ |
| Pattern application | 9/10 | 8/8 declared patterns resolve (validate.sh) and are load-bearing, not decorative — confidence-anchors and verification-rules are enforced by code | None material |
| Test prompt coverage | 8/10 | 4 prompts spanning happy/edge/adversarial/layout-stress, each with an observed no-skill baseline; prompt 4 directly exercises the fit discipline | Harness remains EVAL_SCHEMA_ONLY; behavioral evidence lives in usage reviews, not CI |
| Bundled resources | 9/10 | 10/10 exist; both checkers dependency-free Node with self-tests; v2 fit checker is calibrated against real mermaid 11 output (5/5 edges parsed where v1 parsed 0/38) and its fixtures now encode adversary findings, not just the checker's own assumptions | The v1 edge gate shipped inert — synthetic fixtures had mirrored the checker's parsing assumptions; the risk class is now known but recurrence depends on continued real-output probing |
| Maintainability | 9/10 | 20-IP ledger with source, class, severity, fix revision; same-day defect-to-fixture turnaround on IP-17/18/19; scripts are small and readable | Ledger discipline is manual; nothing enforces new-IP capture |
| Production readiness | 8/10 | Two external weak-model usage rounds plus an adversary rebind drove R3→R4.1; every countermeasure traces to a quantified observed failure; fit verdicts and the real-SVG regression reproduce exactly | ELK/GitHub renderer-skew handling and the HTML mirror-contract rely on agent compliance; fit-receipt coupling (IP-20) still open |

Total: 70/80

## Strongest Aspect

The single best design move remains turning screen-fit from a rubric adjective into a falsifiable per-axis rule with the right shape — gestalt diagrams must fit one viewport at ≥11px effective font because their point is the whole; linear diagrams may scroll ≤3 screens along the reading axis only; a torn edge is flagged as a sentence split in half — and R4.1 made the rule's enforcement match its ambition. The v2 checker parses what mermaid 11 actually emits (order-independent attributes, `<line>` messages), pins the sequence reading axis to vertical so participant overflow can no longer masquerade as "horizontal reading", and treats manual `--kind linear` as an auditable claim rather than a silent escape hatch. The constants are defensible, documented defaults, not dogma — 1470×850 is a typical laptop content area, Phase 4 now explicitly requires passing the Phase 0 medium's viewport (with the memorable framing that certifying against the wrong medium is a false receipt), and the 11px floor with mermaid's 16px default permits ~2100px canvases before failing, so the gate is not trigger-happy. It is empirically calibrated twice over: its verdicts matched human judgment on all four real probe SVGs before the rework and still do after it, and its fixture suite now encodes an adversary's real-output findings. The added process weight is one dependency-free node command per rendered SVG — cheap against the demonstrated alternative, a real agent shipping 6.5px towers as RENDER_VERIFIED without noticing.

## One Improvement

Close IP-20: wire the fit gate into the delivery gate. `check-delivery.js` still accepts a `RENDER_VERIFIED` State line with a tool+version receipt but has no knowledge of `check-render-fit.js`, so an agent can run the delivery checker, skip the fit checker, and ship a tower that would have failed — the same self-attestation gap class that IP-1 closed for tool versions, and now the only unmechanized link in the delivery chain. `rendering-validation.md` already instructs recording the fit output as part of the RENDER_VERIFIED receipt, so the token format exists; a modest checker extension — when State is RENDER_VERIFIED for a screen medium, require a fit-receipt token (e.g. `fit: PASS 14.5px@1470x850` or a recorded trade-off-ladder step) plus regression fixtures written first, per the IP-20 note — would make the R4 gate as unskippable as the R3 one.

## Verdict

**Verdict**: PASS (70/80)

R4.1 is the strongest revision of an already unusually well-evidenced skill, and the rebind round is itself evidence the quality process works: an adversary probing real renderer output found the edge gate inert and the axis heuristic launderable, and within the same day the defects were fixed, fixture-encoded (13-fixture suite, ALL PASS), ledgered (IP-17/18/19 fixed, IP-20 honestly left open), and the real-SVG regression re-verified unchanged. Nothing important here is asserted on authority: the layout recipe's negative results are recorded, the fit gate's thresholds reproduce exactly on the renders that motivated them, I reproduced the 0-matches-to-5-matches edge-parsing fix myself on the real probe file, Gate 1 passes 16/16, and both self-test suites pass. The residual risks — self-attested fit receipts, agent-dependent HTML mirror discipline — are known, ledgered, and scheduled rather than hidden, which is precisely the honesty behavior this repo's review pipeline exists to produce.
