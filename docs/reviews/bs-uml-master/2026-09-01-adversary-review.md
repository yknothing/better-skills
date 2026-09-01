# Adversary Review: bs-uml-master

**Date**: 2026-09-01
**Reviewer Role**: Adversary
**Skill**: bs-uml-master
**HUMAN_VERIFIED**: false
**Scope Contract Version**: 1
**Reviewed Revision**: 7f9fdae59ddd9ce37bb60d446952cc2176613b13
**Reviewed Skill SHA-256**: da8087e49d55d0f4c732f4adfe04021d2965153577fd9d780f6ae836f22e1abb
**Reviewed Manifest SHA-256**: caa8e19fb16a7b7427706cee14b0e181c0682601b3723d9e73857d06345d77de

## Summary

Fourth pass, after R6.3 (commit 7f9fdae) closed the third-pass finding F10 and the advocate-caught inline-FAIL regression. The final micro-replay confirms all ten findings from this round fixed by direct probe: the F10 false positives now exit 0 (FAIL-named diagram node, FAIL-leading prose line), the inline one-line FAIL receipt without a summary is caught by the new union scan, the F7/F8/F9 vectors stay closed (n1b/n2/n4 exit 1, n3 exits 0), and a last probe of the union logic (a FAIL verdict pushed beyond the window with no verdict token inside it) fails safe as a missing receipt. Every exploit vector from all four passes is pinned in the 47-fixture self-test, all passing. No finding remains open; the fit gate survives every bypass this round could construct, and the two-direction fixtures guard the precision/recall balance.

## Evidence Reviewed

Full manifest receipt `caa8e19fb16a7b7427706cee14b0e181c0682601b3723d9e73857d06345d77de` was received and independently verified.

All 21 manifest entries re-hashed with `sha256sum` against the regenerated prompt at revision 7f9fdae59ddd9ce37bb60d446952cc2176613b13 — all match.

Files read in full across the four passes: `skills/bs-uml-master/SKILL.md`, `skills/bs-uml-master/scripts/check-delivery.js` (all four revisions, plus `git show` on 617e76c, 1f4219a, and 7f9fdae for the R6.1/R6.2/R6.3 diffs), `skills/bs-uml-master/scripts/check-render-fit.js`, `skills/bs-uml-master/scripts/test-check-delivery.js`, `skills/bs-uml-master/references/layout-craft.md`, `skills/bs-uml-master/references/syntax-pitfalls.md`, `skills/bs-uml-master/references/rendering-validation.md`, `docs/reviews/bs-uml-master/2026-09-01-haiku-usage-review-3.md`, `docs/reviews/bs-uml-master/improvement-points.md`, `tools/peer-review.js`.

Commands run (cwd `/home/user/better-skills`):

- `git rev-parse HEAD` → 7f9fdae59ddd9ce37bb60d446952cc2176613b13.
- `node skills/bs-uml-master/scripts/test-check-delivery.js` → ALL PASS (47 fixtures; my p1/p1b/p2/p3/p3b/p4, n1b/n2/n3/n4, n5/n5b vectors confirmed pinned, plus the inline-FAIL regression fixture).
- `node skills/bs-uml-master/scripts/test-check-render-fit.js` → ALL PASS.
- 21 probe deliveries built and run through `node skills/bs-uml-master/scripts/check-delivery.js <file>` across the four passes under the session scratchpad `adv-r6/` directory: p-series (p1, p1b, p2, p3, p3b, p4, p5, p5b, p6, p6b, p6c, p7), n-series (n1, n1b, n2, n3, n4, n5, n5b), and this pass's fresh n6 (inline one-line FAIL receipt, no summary — exit 1 as required) and n7 (FAIL verdict 9 lines below the tool token with no verdict token in the window — exit 1 as a missing receipt, fails safe); per-probe exit codes and check lines cited in the findings.

## Findings

### F1: C8 exemption keyed on a substring match of the Backend field [MEDIUM] [RESOLVED]

**Location**: `skills/bs-uml-master/scripts/check-delivery.js` line 298 (was line 281 at 757ff4e).
**Exploit scenario**: First pass: `**Backend:** Mermaid (text annotations)` (probe p1) and the unreplaced template placeholder `**Backend:** [Mermaid|PlantUML|text|SVG]` (probe p1b) silently skipped the fit gate — exit 0, no C8 line emitted.
**Root cause**: `\btext\b`/`\bascii\b` word-boundary substring test on the Backend field instead of a whole-field match.
**Suggested fix**: Implemented in R6.1 (whole-field anchor) and hardened in R6.2 (see F7). Replay at 1f4219a: p1 and p1b exit 1 on C8; fixtures `fit-bypass-backend-substring` / `fit-bypass-backend-placeholder` pin both vectors.

### F2: FAIL-receipt smuggling via truncated or reordered verbatim tool output [MEDIUM] [RESOLVED]

**Location**: `skills/bs-uml-master/scripts/check-delivery.js` lines 301-318 (was line 288 at 757ff4e), with `skills/bs-uml-master/references/rendering-validation.md` checklist item 4.
**Exploit scenario**: First pass: pasting the fit tool's per-line `FAIL ... 8.3px < 11px` verdict without the trailing `1 FAIL` summary (probe p3), or the ordering `verdict FAIL (count: FAIL 1)` (probe p3b), passed C8 as "receipt present" — a measured fit failure shipped with exit 0 and no trade-off.
**Root cause**: The failing-receipt detector required the digits-then-FAIL summary shape, which per-line verdicts and reorderings never produce.
**Suggested fix**: Implemented in R6.1 (window FAIL scan) and generalized block-wide in R6.2 (see F8). Replay at 1f4219a: p3 and p3b exit 1 demanding the trade-off; fixture `fit-receipt-perline-fail-smuggle` pins the vector; rendering-validation.md now instructs pasting the output intact including the summary line.

### F3: Receipt shape satisfiable by scattered, negated prose [MEDIUM] [RESOLVED]

**Location**: `skills/bs-uml-master/scripts/check-delivery.js` lines 301-315 and `fitReceiptWindows` lines 325-338 (was lines 283-285 at 757ff4e).
**Exploit scenario**: First pass: "I did not run check-render-fit on this one. The canvas is roughly 1200x760 and labels use 16px, which should PASS comfortably." satisfied all four receipt tokens block-wide (probe p2, exit 0).
**Root cause**: No contiguity requirement — the four tokens were tested independently against the whole block.
**Suggested fix**: Implemented in R6.1 (co-occurrence window + hedge/negation guard), window made forward-only in R6.2. Replay at 1f4219a: p2 exits 1 on the hedge guard; fixtures `fit-receipt-scattered-tokens` and `fit-receipt-hedged` pin both halves.

### F4: Stray "sketch level" phrase relaxed gates on a declared deliverable [LOW] [RESOLVED]

**Location**: `skills/bs-uml-master/scripts/check-delivery.js` lines 201-204 (was lines 191-193 at 757ff4e).
**Exploit scenario**: First pass: `**Significance:** deliverable` plus the prose "This goes well beyond sketch level polish" softened C1/C3/C4/C8 to WARN (probe p4, exit 0 with a receipt-less RENDER_VERIFIED).
**Root cause**: The block-wide phrase fallback was ORed with, rather than subordinated to, the declared Significance field.
**Suggested fix**: Implemented in R6.1: the declared field is authoritative; the phrase fallback applies only when the field is absent. Replay at 1f4219a: p4 exits 1 with 3 FAILs; fixture `sketch-phrase-cannot-downgrade` pins it.

### F5: IP-24 quote guard hid real inline color behind a stray legal quote [LOW] [RESOLVED]

**Location**: `skills/bs-uml-master/scripts/check-delivery.js` lines 95, 118, 275 (the three quote-blanking sites).
**Exploit scenario**: First pass: a legal PlantUML comment containing one double quote (`' reviewer said "looks good`) paired across newlines with the next label's opening quote, swallowing the `state` keyword of `state "Fast Mode" as s1 #lightblue` — no C7 color WARN (probes p6, p6c).
**Root cause**: Document-scoped quote pairing matched across newlines.
**Suggested fix**: Implemented in R6.1: pairing is line-bounded at all three sites. Replay at 1f4219a: p6, p6b, and p6c all draw the C7 color WARN (WARN-tier as designed).

### F6: artifact-399ed2df replays are mechanically caught [LOW] [RESOLVED]

**Location**: `skills/bs-uml-master/scripts/check-delivery.js` C8 (lines 288-321) and C5 (lines 149-191); replayed against `docs/reviews/bs-uml-master/2026-09-01-haiku-usage-review-3.md`.
**Exploit scenario**: Retest of the previously reported theater, re-run at 1f4219a: probe p5 (the artifact's 说明 — RENDER_VERIFIED, self-graded ✅ rubric table, zero receipts) exits 1 on C8; probe p5b (diagram ④'s pseudo-class `graph TB` declared "Class Diagram") exits 1 on C5 + C8.
**Root cause**: Not applicable — recorded as retest evidence across all three revisions of this round.
**Suggested fix**: Keep p5/p5b encoded as fixtures alongside `fit-receipt-missing` so the CJK-flavored replay stays pinned.

### F7: "Backend: text" over a Mermaid fence exempted C8 with no cross-check [MEDIUM] [RESOLVED]

**Location**: `skills/bs-uml-master/scripts/check-delivery.js` lines 296-299 (`visualFence`; was lines 294-295 at 617e76c).
**Exploit scenario**: Second pass: `**Backend:** text` declared over a mermaid-tagged `flowchart TB` fence with `State: RENDER_VERIFIED — mmdc 11.4.0` exited 0 with C8 silently skipped (probe n2) — one self-declared word bought the exemption against checkable source.
**Root cause**: The C8 exemption trusted the Backend field in isolation, never comparing it to the fence language/header the checker already extracts for C5.
**Suggested fix**: Implemented in R6.2: the text exemption is void when any fence is mermaid/plantuml-shaped (`visualFence` via the same `fences()`/`DIAGRAM_HEADER` machinery). Replay at 1f4219a, re-confirmed at 7f9fdae: n2 exits 1 on C8; vector pinned as a fixture. The genuine text-backend fixture (` ```text ` fence) still passes, so the exemption survives for honest text deliveries.

### F8: FAIL verdicts outside the first matching receipt window escaped the trade-off gate [MEDIUM] [RESOLVED]

**Location**: `skills/bs-uml-master/scripts/check-delivery.js` lines 304-318 (`failing`, block-wide) and `fitReceiptWindows` lines 325-338 (was the single-window return at 617e76c), against the dual-profile instruction in `skills/bs-uml-master/references/layout-craft.md`.
**Exploit scenario**: Second pass: a layout-craft-compliant dual-media delivery — verbatim PASS(pc) receipt, six prose lines, then a verbatim `FAIL ...; 1 FAIL` (a4) receipt — exited 0 (probe n1b, no dishonesty required); padding a per-line FAIL below the window with a genuine PASS line inside also exited 0 (probe n4). A regression of R6's block-wide summary scan.
**Root cause**: `fitReceiptWindow` returned the first token-satisfying window and the FAIL scan ran only on it.
**Suggested fix**: Implemented in R6.2: FAIL verdicts are scanned block-wide (`^\s*FAIL\b` verdict lines plus `[1-9]\d*\s+FAIL` summaries after removing literal `0 FAIL`), and all matching windows are collected and hedge-scanned individually. Replay at 1f4219a, with n1b/n4 re-confirmed failing at 7f9fdae: all exit 1 demanding the trade-off; n1b/n4 pinned as fixtures. The block-wide scan trades this bypass for a new fails-safe false positive — split out as F10.

### F9: Hedge guard's lookback failed honest receipts on unrelated contract prose [LOW] [RESOLVED]

**Location**: `skills/bs-uml-master/scripts/check-delivery.js` line 333 (`lines.slice(i, i + 8)`; was the `i - 2` lookback at 617e76c).
**Exploit scenario**: Second pass: an honest verbatim PASS receipt placed directly under `**Excluded:** helper modules (roughly 20 files off-question)` exited 1 as hedge language — the hedge word sat in a neighboring contract field inside the 2-line lookback (probe n3).
**Root cause**: The hedge scan ran over the window's lookback lines, which the contract layout fills with prose-bearing fields.
**Suggested fix**: Implemented in R6.2: windows are forward-only from the tool token. Replay at 1f4219a, re-confirmed at 7f9fdae: n3 exits 0 with the receipt accepted; pinned as fixture `fit-receipt-neighbor-hedge-ok`.

### F10: Block-wide FAIL scan false-positives on FAIL-named diagram nodes and FAIL-leading prose lines [LOW] [RESOLVED]

**Location**: `skills/bs-uml-master/scripts/check-delivery.js` lines 301-324 (was the raw-block `/^\s*FAIL\b/m` scan at 1f4219a).
**Exploit scenario**: Third pass: an honest delivery with a genuinely passing receipt (`... PASS ...; 0 FAIL`) whose fenced flowchart models a failure path with a node named FAIL (`FAIL["Gate failed"]`, probe n5), or whose prose reading-note line starts with "FAIL states are modeled out of scope" (probe n5b), exited 1 demanding a trade-off for a failure that does not exist — fails-safe over-blocking whose cheapest silencer (writing "ladder" anywhere) trains the theater the gate exists to prevent.
**Root cause**: The R6.2 fix for F8 widened the FAIL scan from the receipt window to the raw block without masking fenced diagram source or requiring the tool's verdict-line shape.
**Suggested fix**: Implemented in R6.3: diagram-shaped fences are masked before receipt analysis, and FAIL detection is a three-way union — any FAIL in a matched window, block-wide line-start FAIL lines carrying fit vocabulary (px/screen/aspect/viewport/co-visible), and block-wide `N FAIL` summaries. Replay at 7f9fdae: n5 and n5b exit 0 (fixtures `fail-node-in-fence-clean-receipt`, `fail-prose-line-clean-receipt`); n1b/n4 still exit 1, so the precision fix did not reopen F8; the advocate-caught inline one-line FAIL receipt without a summary now exits 1 via the window scan (probe n6, fixture `fit-receipt-inline-fail-no-summary`); and the last union probe — a FAIL verdict pushed 9 lines below the tool token with no verdict token left in the window (probe n7) — fails safe as a missing receipt.

## Verdict

**Verdict**: APPROVED

Every finding this round produced — ten across three passes, including three MEDIUM C8 bypasses, a MEDIUM backend-laundering hole, and a MEDIUM receipt-window regression — is confirmed closed by direct replay at revision 7f9fdae: all twenty-one probes land where they should, every exploit vector is pinned as a regression fixture (47/47 passing, with both-direction fixtures guarding the F8-vs-F10 precision/recall balance), and the artifact-399ed2df theater that motivated R6 stays mechanically caught through all four revisions. The remaining residuals are the documented design ceiling, not open defects: the checker binds format, and a determined fabricator inventing a clean unhedged receipt wholesale remains out of scope for this layer (IP-9, Phase 2.A). With zero open findings and the attack surface of this round exhausted against the current checker, approval is the evidence-supported disposition.
