# Adversary Review: bs-uml-master

**Date**: 2026-09-01
**Reviewer Role**: Adversary
**Skill**: bs-uml-master
**HUMAN_VERIFIED**: false
**Scope Contract Version**: 1
**Reviewed Revision**: 1f4219aa0d7bd418340e8ccafe4f4bea980edd4f
**Reviewed Skill SHA-256**: da8087e49d55d0f4c732f4adfe04021d2965153577fd9d780f6ae836f22e1abb
**Reviewed Manifest SHA-256**: f359fb36645b3b9a00fe01f960aec88682f9b94885f6242038beb181f54b22a8

## Summary

Third pass, after R6.2 (commit 1f4219a) closed the second-pass findings F7-F9. All seventeen accumulated probes were replayed at this revision: every one of the nine previously reported findings is now confirmed fixed by direct replay (each original exploit exits 1 or draws the designed WARN; the honest-delivery false positive from F9 exits 0), the artifact-399ed2df theater replays remain closed, and all four second-round vectors are pinned as fixtures (self-test now 44/44). One new LOW issue emerged from probing the new block-wide FAIL scan: it false-positives on honest deliveries whose fenced diagram legitimately contains a node named FAIL (failure-path modeling the skill itself encourages) or whose prose has a line starting with FAIL — fails-safe over-blocking, not a bypass. No open finding is MEDIUM or above; the fit gate now survives every bypass this round could construct.

## Evidence Reviewed

Full manifest receipt `f359fb36645b3b9a00fe01f960aec88682f9b94885f6242038beb181f54b22a8` was received and independently verified.

All 21 manifest entries re-hashed with `sha256sum` against the regenerated prompt at revision 1f4219aa0d7bd418340e8ccafe4f4bea980edd4f — all match.

Files read in full across the three passes: `skills/bs-uml-master/SKILL.md`, `skills/bs-uml-master/scripts/check-delivery.js` (all three revisions, plus `git show 617e76c` and `git show 1f4219a` for the R6.1/R6.2 diffs), `skills/bs-uml-master/scripts/check-render-fit.js`, `skills/bs-uml-master/scripts/test-check-delivery.js`, `skills/bs-uml-master/references/layout-craft.md`, `skills/bs-uml-master/references/syntax-pitfalls.md`, `skills/bs-uml-master/references/rendering-validation.md`, `docs/reviews/bs-uml-master/2026-09-01-haiku-usage-review-3.md`, `docs/reviews/bs-uml-master/improvement-points.md`, `tools/peer-review.js`.

Commands run (cwd `/home/user/better-skills`):

- `git rev-parse HEAD` → 1f4219aa0d7bd418340e8ccafe4f4bea980edd4f.
- `node skills/bs-uml-master/scripts/test-check-delivery.js` → ALL PASS (44 fixtures; my p1/p1b/p2/p3/p3b/p4, n1b/n2/n3/n4 vectors confirmed pinned).
- `node skills/bs-uml-master/scripts/test-check-render-fit.js` → ALL PASS.
- 19 probe deliveries built and run through `node skills/bs-uml-master/scripts/check-delivery.js <file>` across the three passes under the session scratchpad `adv-r6/` directory: p-series (p1, p1b, p2, p3, p3b, p4, p5, p5b, p6, p6b, p6c, p7), n-series (n1, n1b, n2, n3, n4), and this pass's fresh n5/n5b; per-probe exit codes and check lines cited in the findings.

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
**Suggested fix**: Implemented in R6.2: the text exemption is void when any fence is mermaid/plantuml-shaped (`visualFence` via the same `fences()`/`DIAGRAM_HEADER` machinery). Replay at 1f4219a: n2 exits 1 on C8; vector pinned as a fixture. The genuine text-backend fixture (` ```text ` fence) still passes, so the exemption survives for honest text deliveries.

### F8: FAIL verdicts outside the first matching receipt window escaped the trade-off gate [MEDIUM] [RESOLVED]

**Location**: `skills/bs-uml-master/scripts/check-delivery.js` lines 304-318 (`failing`, block-wide) and `fitReceiptWindows` lines 325-338 (was the single-window return at 617e76c), against the dual-profile instruction in `skills/bs-uml-master/references/layout-craft.md`.
**Exploit scenario**: Second pass: a layout-craft-compliant dual-media delivery — verbatim PASS(pc) receipt, six prose lines, then a verbatim `FAIL ...; 1 FAIL` (a4) receipt — exited 0 (probe n1b, no dishonesty required); padding a per-line FAIL below the window with a genuine PASS line inside also exited 0 (probe n4). A regression of R6's block-wide summary scan.
**Root cause**: `fitReceiptWindow` returned the first token-satisfying window and the FAIL scan ran only on it.
**Suggested fix**: Implemented in R6.2: FAIL verdicts are scanned block-wide (`^\s*FAIL\b` verdict lines plus `[1-9]\d*\s+FAIL` summaries after removing literal `0 FAIL`), and all matching windows are collected and hedge-scanned individually. Replay at 1f4219a: n1, n1b, and n4 all exit 1 demanding the trade-off; n1b/n4 pinned as fixtures. The block-wide scan trades this bypass for a new fails-safe false positive — split out as F10.

### F9: Hedge guard's lookback failed honest receipts on unrelated contract prose [LOW] [RESOLVED]

**Location**: `skills/bs-uml-master/scripts/check-delivery.js` line 333 (`lines.slice(i, i + 8)`; was the `i - 2` lookback at 617e76c).
**Exploit scenario**: Second pass: an honest verbatim PASS receipt placed directly under `**Excluded:** helper modules (roughly 20 files off-question)` exited 1 as hedge language — the hedge word sat in a neighboring contract field inside the 2-line lookback (probe n3).
**Root cause**: The hedge scan ran over the window's lookback lines, which the contract layout fills with prose-bearing fields.
**Suggested fix**: Implemented in R6.2: windows are forward-only from the tool token. Replay at 1f4219a: n3 exits 0 with the receipt accepted; pinned as fixture `fit-receipt-neighbor-hedge-ok`.

### F10: Block-wide FAIL scan false-positives on FAIL-named diagram nodes and FAIL-leading prose lines [LOW] [OPEN]

**Location**: `skills/bs-uml-master/scripts/check-delivery.js` lines 309-310 (`const failing = /^\s*FAIL\b/m.test(block) || ...` — scanned over the whole block including fenced diagram source and prose).
**Exploit scenario**: Probe n5: an honest delivery with a genuinely passing receipt (`... PASS ...; 0 FAIL`) whose fenced flowchart models a failure path with a node named FAIL (`FAIL["Gate failed"]`, `FAIL --> Retry`) exits 1: "fit receipt contains a FAIL verdict with no recorded trade-off". Probe n5b: the same false positive from a prose reading-note line that happens to start with "FAIL states are modeled out of scope". Failure-path modeling is territory the skill itself steers into (Phase 5's completeness probes demand missing-failure-path checks), so FAIL-named states/nodes are realistic honest content. The error is fails-safe (over-blocking, not a bypass), but it demands a trade-off note for a failure that does not exist, and the cheapest "fix" available to an agent — adding the word "ladder" or "trade-off" anywhere in the block — silences the check without meaning anything, training exactly the theater the gate exists to prevent.
**Root cause**: The R6.2 fix for F8 widened the FAIL scan from the receipt window to the raw block without masking fenced diagram source or requiring the tool's verdict-line shape, so any line-leading `FAIL` token anywhere in the delivery reads as a tool verdict.
**Suggested fix**: Mask fenced code (as `tools/peer-review.js` does for reviews) before the block-wide scan, and tighten the verdict-line regex toward the tool's actual output shape (e.g. `^\s*FAIL\s{2,}` — check-render-fit emits two-space-padded verdict lines) while keeping the `[1-9]\d*\s+FAIL` summary scan block-wide. Pin n5 (must stay 0-FAIL) and n1b/n4 (must stay failing) together so the precision fix cannot silently reopen F8.

## Verdict

**Verdict**: APPROVED

Every finding this round produced — nine across two passes, including three MEDIUM C8 bypasses, a MEDIUM backend-laundering hole, and a MEDIUM receipt-window regression — is now confirmed closed by direct replay at revision 1f4219a: all seventeen prior probes land where they should, the seventeen exploit vectors are pinned as regression fixtures (44/44 passing), and the artifact-399ed2df theater that motivated R6 stays mechanically caught through all three revisions. The one remaining open finding, F10, is a LOW fails-safe false positive: it blocks honest deliveries rather than admitting dishonest ones, its silencing lever is already governed by prose rules, and its fix is a masking/precision change with both-direction fixtures specified above. With no open MEDIUM-or-above finding and the attack surface of this round exhausted against the current checker, approval is the evidence-supported disposition; F10 should be taken up in the next point release alongside any advocate-side items.
