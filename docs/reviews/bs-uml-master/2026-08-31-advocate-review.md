# Advocate Review: bs-uml-master

**Date**: 2026-08-31
**Reviewer Role**: Advocate
**Skill**: bs-uml-master
**HUMAN_VERIFIED**: false
**Scope Contract Version**: 1
**Reviewed Revision**: 2b947008372bd45adf0ee46f7b43a0692828b9ef
**Reviewed Skill SHA-256**: bf50e9e81270da6cd27140debf9ad4baefdc779e8d79a79fc87acc581b7bf822
**Reviewed Manifest SHA-256**: 67a2fa56dd469f04de2e0b459b0e5eb0b8f377075b5c1755c330e4f977537db1

## Executive Summary

R4 converts the last major judgment call in this skill — "does the layout serve the reader?" — into a mechanical, dependency-free gate (`check-render-fit.js`) whose verdicts I reproduced against the real probe renders that motivated it, and it closes the two bypasses the second Haiku usage review exposed (HTML deliveries escaping the contract checker; edge fabrications hiding behind node-level evidence). The skill is now on its fourth empirically-driven revision, each traceable through a 16-entry improvement-points ledger from observed weak-model failures to specific enforcement. I would ship this: every claim I tested held up under rerun.

## Evidence Reviewed

Full manifest receipt acknowledged: 67a2fa56dd469f04de2e0b459b0e5eb0b8f377075b5c1755c330e4f977537db1

Full manifest receipt `67a2fa56dd469f04de2e0b459b0e5eb0b8f377075b5c1755c330e4f977537db1` was received and independently verified.

Files examined in full:

- `skills/bs-uml-master/SKILL.md` (SHA verified: bf50e9e8…) — R4 wiring: medium default in Phase 0, `check-render-fit.js` in Phase 4, HTML/artifact-closure paragraph in the Output Contract, per-edge Evidence requirement, fit-related red-flag rows
- `skills/bs-uml-master/scripts/check-render-fit.js` (SHA verified: 43755a32…) — read line by line; per-axis logic, kind auto-detection, edge-span extraction, exit codes
- `skills/bs-uml-master/scripts/test-check-render-fit.js` (SHA verified: 8b20c424…) — 8 fixtures, each tied to an observed case
- `skills/bs-uml-master/references/layout-craft.md` (SHA verified: 642ff4eb…) — fit-to-screen discipline, trade-off ladder, probed layered-architecture recipe
- `skills/bs-uml-master/scripts/check-delivery.js` and `test-check-delivery.js` (SHAs verified) — confirmed no fit-receipt coupling exists (see One Improvement)
- `docs/reviews/bs-uml-master/2026-08-31-haiku-usage-review-2.md` and `improvement-points.md` (IP-14/15/16) — the failure evidence R4 answers
- `docs/research/uml-diagramming-analysis.md` — STUDY basis, including the 25% relationship-correctness finding that IP-16 now mechanically addresses
- All 8 reference modules, both harness files, `skills.json`, `tools/peer-review.js`, `tools/test-peer-review-scope.js` — every manifest SHA recomputed with `sha256sum` and matched

Commands rerun (all outputs observed directly, this session):

- `git rev-parse HEAD` → `2b947008372bd45adf0ee46f7b43a0692828b9ef` (matches Reviewed Revision)
- `sha256sum` over all 20 manifest files → all 20 hashes match the manifest
- `node skills/bs-uml-master/scripts/test-check-delivery.js` → ALL PASS (18 fixtures)
- `node skills/bs-uml-master/scripts/test-check-render-fit.js` → ALL PASS (8 fixtures)
- `node skills/bs-uml-master/scripts/check-render-fit.js` on the four real probe SVGs from the Haiku #2 review (scratchpad `haiku-v2/`): `d1.svg` → FAIL (6.5px effective font, aspect 0.40:1 WARN), `d2.svg` → FAIL (7.0px), `d1-elk.svg` → PASS (14.5px), `d3.svg` → PASS (12.0px). All four verdicts match the human visual judgments recorded in the usage review, including the exact px figures (6.5/7.0/14.5/12.0)
- `bash tools/validate.sh skills/bs-uml-master` → 16 passed, 0 failed (pattern references 8/8, bundled resources 10/10, gate syntax 3/3, frontmatter schema)

## Dimension Scores

| Dimension | Score | Key Strength | Key Concern |
|-----------|------:|--------------|-------------|
| Clarity of trigger description | 9/10 | "Use when" form; enumerates the nine diagram families and the four quality dimensions that distinguish it from syntax-only skills | Long single sentence; borderline dense for a router |
| Hard rules / safety gates | 9/10 | Three well-formed HARD-GATE tags; two deterministic checkers with in-repo regression suites; receipt-bearing state vocabulary; USER-OVERRIDE is explicit and recorded | Fit gate is self-attested — check-delivery.js does not demand a fit receipt |
| Workflow correctness | 9/10 | Phases have exit criteria; medium constraints captured in Phase 0 where they can still shape scope; bounded repair loops (≤5) with a defined escalation ladder; EXPLAIN/REVIEW skip path specified | Two checkers plus mirror-contract for HTML adds real per-delivery overhead at deliverable+ |
| Pattern application | 9/10 | 8/8 declared patterns resolve (validate.sh) and are load-bearing, not decorative — confidence-anchors and verification-rules are enforced by code | None material |
| Test prompt coverage | 8/10 | 4 prompts spanning happy/edge/adversarial/layout-stress, each with an observed no-skill baseline; prompt 4 directly exercises the new fit discipline | Harness remains EVAL_SCHEMA_ONLY; behavioral evidence lives in usage reviews, not CI |
| Bundled resources | 9/10 | 10/10 exist; both checkers dependency-free Node with self-tests; layout-craft's layered-architecture recipe is probe-verified (ignored subgraph direction, ELK one-line fix with GitHub caveat) | Gestalt ≥2-long-edges FAIL branch is unreachable at fit scale (self-test comments acknowledge it) — harmless but dead |
| Maintainability | 9/10 | 16-IP ledger with source, class, severity, fix revision; regression fixtures in-repo after IP-12; scripts are small and readable | Ledger discipline is manual; nothing enforces new-IP capture |
| Production readiness | 8/10 | Two external weak-model usage rounds drove R3/R4; every R4 countermeasure traces to a quantified observed failure; fit verdicts reproduce exactly | ELK/GitHub renderer-skew handling and the HTML mirror-contract rely on agent compliance until Phase 2.A mechanizes receipts |

Total: 70/80

## Strongest Aspect

The single best design move in R4 is turning screen-fit from a rubric adjective into a falsifiable per-axis rule with the right shape: gestalt diagrams must fit one viewport at ≥11px effective font because their point is the whole; linear diagrams may scroll up to 3 screens along the reading axis only, because that is the native reading gesture; and an edge whose endpoints cannot be co-visible is flagged as a torn sentence. The constants are defensible defaults, not dogma — 1470×850 is a typical laptop browser content area and is the documented default medium (Phase 0 captures the real one; `--viewport`/`--kind`/`--font` override), and the 11px floor with mermaid's 16px default font permits ~2100px canvases before failing, so the gate is not trigger-happy. Most importantly, it is empirically calibrated: I reran it on the four real SVGs from the usage review that motivated it, and its verdicts and pixel numbers matched the human judgments in all four cases, while the accompanying layered-architecture recipe (dagre tower → ELK one-liner) gives the agent a probed exit from the exact failure the gate catches. The added process weight is one dependency-free node command per rendered SVG — cheap against the demonstrated alternative, which was a real agent shipping 6.5px towers as RENDER_VERIFIED without noticing.

## One Improvement

Wire the fit gate into the delivery gate: `check-delivery.js` currently accepts a `RENDER_VERIFIED` State line with a tool+version receipt but has no knowledge of `check-render-fit.js` (grep confirms zero coupling), so an agent can run the delivery checker, skip the fit checker, and ship a tower that would have failed — exactly the self-attestation gap class that IP-1 closed for tool versions. A modest extension — when State is RENDER_VERIFIED and a rendered SVG path appears in the delivery, require a fit-check receipt token (e.g. `fit: PASS 14.5px@1470x850` or a recorded ladder step) on the State line, plus two regression fixtures — would make the R4 gate as unskippable as the R3 one, and would also incidentally exercise the currently-dead gestalt long-edge FAIL branch or justify deleting it.

## Verdict

**Verdict**: PASS (70/80)

R4 is the strongest revision of an already unusually well-evidenced skill. Its distinguishing property is that nothing important is asserted on authority: the layout recipe was probed and its negative results recorded ("direction LR is silently ignored — don't burn iterations on it"), the fit gate's thresholds were validated against the very renders that exposed the problem and reproduce exactly on rerun, both checkers carry in-repo regression suites that pass, Gate 1 passes 16/16, and every one of IP-14/15/16 maps to a concrete, testable change in SKILL.md, layout-craft.md, or a script. The residual risks — self-attested fit receipts, agent-dependent HTML mirror discipline — are known, ledgered (IP-9 family), and scheduled rather than hidden, which is itself the honesty behavior this repo's review pipeline exists to produce.
