# Adversary Review: bs-uml-master

**Date**: 2026-09-01
**Reviewer Role**: Adversary
**Skill**: bs-uml-master
**HUMAN_VERIFIED**: false
**Scope Contract Version**: 1
**Reviewed Revision**: 617e76c680bcc737f61125ac7037e4a713189026
**Reviewed Skill SHA-256**: da8087e49d55d0f4c732f4adfe04021d2965153577fd9d780f6ae836f22e1abb
**Reviewed Manifest SHA-256**: 722bc165f72decd301e2af1da9638465f994e39a422c23db50b77d97f63f812a

## Summary

Second pass, after the R6.1 fixes (commit 617e76c) landed for this round's original findings F1-F5. All twelve original probes were replayed against the new checker: F1-F5 are confirmed fixed and flipped to RESOLVED (every original bypass now exits 1 or draws the correct WARN), and F6's artifact-399ed2df replays still fail as intended. A fresh probe round against the new window/anchor/hedge logic found three new issues: two MEDIUM bypasses still live — a self-declared `Backend: text` over a Mermaid fence exempts C8 with no backend-vs-source cross-check, and the first-matching-window FAIL scan lets a verbatim failing receipt (its "1 FAIL" summary included) ship silently whenever a passing receipt precedes it by more than a few lines, a regression of R6's block-wide summary scan against layout-craft's own dual-profile receipt instruction — plus one LOW hedge-guard false positive that fails honest receipts. Worst case: a dual-media delivery documented exactly as layout-craft prescribes ships a measured FAIL with exit 0.

## Evidence Reviewed

Full manifest receipt `722bc165f72decd301e2af1da9638465f994e39a422c23db50b77d97f63f812a` was received and independently verified.

All 21 manifest entries re-hashed with `sha256sum` against the regenerated prompt at revision 617e76c680bcc737f61125ac7037e4a713189026 — all match (including the four R6.1-changed files: `check-delivery.js` f92e949e…, `test-check-delivery.js` c7f4359c…, `rendering-validation.md` 9d25351a…, and the unchanged `SKILL.md` da8087e4…).

Files read in full: `skills/bs-uml-master/SKILL.md`, `skills/bs-uml-master/scripts/check-delivery.js` (both revisions), `skills/bs-uml-master/scripts/check-render-fit.js`, `skills/bs-uml-master/scripts/test-check-delivery.js`, `skills/bs-uml-master/references/layout-craft.md`, `skills/bs-uml-master/references/syntax-pitfalls.md`, `skills/bs-uml-master/references/rendering-validation.md`, `docs/reviews/bs-uml-master/2026-09-01-haiku-usage-review-3.md`, `docs/reviews/bs-uml-master/improvement-points.md`, `tools/peer-review.js`, plus `git show 617e76c` for the full R6.1 diff.

Commands run (cwd `/home/user/better-skills`):

- `git rev-parse HEAD` → 617e76c680bcc737f61125ac7037e4a713189026.
- `node skills/bs-uml-master/scripts/test-check-delivery.js` → ALL PASS (40 fixtures; my p1/p1b/p2/p3/p3b/p4 vectors confirmed pinned as fixtures 17+).
- `node skills/bs-uml-master/scripts/test-check-render-fit.js` → ALL PASS.
- Replay of all 12 first-pass probe deliveries (p1, p1b, p2, p3, p3b, p4, p5, p5b, p6, p6b, p6c, p7) plus 5 fresh probes (n1, n1b, n2, n3, n4) under the session scratchpad `adv-r6/` directory, each through `node skills/bs-uml-master/scripts/check-delivery.js <file>`; per-probe exit codes and check lines cited in the findings.

## Findings

### F1: C8 exemption keyed on a substring match of the Backend field [MEDIUM] [RESOLVED]

**Location**: `skills/bs-uml-master/scripts/check-delivery.js` line 294 (was line 281 at 757ff4e).
**Exploit scenario**: First pass: `**Backend:** Mermaid (text annotations)` (probe p1) and the unreplaced template placeholder `**Backend:** [Mermaid|PlantUML|text|SVG]` (probe p1b) silently skipped the fit gate — exit 0, no C8 line emitted.
**Root cause**: `\btext\b`/`\bascii\b` word-boundary substring test on the Backend field instead of a whole-field match.
**Suggested fix**: Implemented in R6.1: the exemption now anchors the whole trimmed field (`/^\s*(?:plain\s*[- ]?text|text|ascii(?:\s*art)?)\s*$/i`). Replay: p1 and p1b both now exit 1 with the C8 receipt FAIL; fixtures `fit-bypass-backend-substring` and `fit-bypass-backend-placeholder` pin both vectors. Resolved. (Residual: the exemption still trusts the field's word against the fenced source — split out as F7.)

### F2: FAIL-receipt smuggling via truncated or reordered verbatim tool output [MEDIUM] [RESOLVED]

**Location**: `skills/bs-uml-master/scripts/check-delivery.js` lines 296-303 (was line 288 at 757ff4e), with `skills/bs-uml-master/references/rendering-validation.md` checklist item 4.
**Exploit scenario**: First pass: pasting the fit tool's per-line `FAIL ... 8.3px < 11px` verdict without the trailing `1 FAIL` summary (probe p3), or the ordering `verdict FAIL (count: FAIL 1)` (probe p3b), passed C8 as "receipt present" — a measured fit failure shipped with exit 0 and no trade-off.
**Root cause**: The failing-receipt detector required the digits-then-FAIL summary shape (`[1-9]\d*\s+FAIL`), which per-line verdicts and reorderings never produce.
**Suggested fix**: Implemented in R6.1: any standalone `FAIL` token in the receipt window other than literal `0 FAIL` now demands the trade-off note, and rendering-validation.md now instructs pasting the output intact including the summary line. Replay: p3 and p3b both exit 1 ("fit receipt contains a FAIL verdict with no recorded trade-off"); fixture `fit-receipt-perline-fail-smuggle` pins the vector. Resolved within the window — the window scoping itself opens a new gap, split out as F8.

### F3: Receipt shape satisfiable by scattered, negated prose [MEDIUM] [RESOLVED]

**Location**: `skills/bs-uml-master/scripts/check-delivery.js` lines 296-300 and 310-321 (`fitReceiptWindow`) (was lines 283-285 at 757ff4e).
**Exploit scenario**: First pass: "I did not run check-render-fit on this one. The canvas is roughly 1200x760 and labels use 16px, which should PASS comfortably." satisfied all four receipt tokens block-wide (probe p2, exit 0).
**Root cause**: No contiguity requirement — the tool token, WxH, px, and verdict were tested independently against the whole block.
**Suggested fix**: Implemented in R6.1: the four tokens must co-occur within a 6-line window around the tool token, and hedge/negation language in the window (`should`, `not run`, `roughly`, 预计, 未运行…) disqualifies the receipt outright with a FAIL. Replay: p2 now exits 1 on the hedge guard; fixtures `fit-receipt-scattered-tokens` and `fit-receipt-hedged` pin both halves. Resolved (the hedge lookback overreaches slightly — see F9).

### F4: Stray "sketch level" phrase relaxed gates on a declared deliverable [LOW] [RESOLVED]

**Location**: `skills/bs-uml-master/scripts/check-delivery.js` lines 198-204 (was lines 191-193 at 757ff4e).
**Exploit scenario**: First pass: `**Significance:** deliverable` plus the prose "This goes well beyond sketch level polish" softened C1/C3/C4/C8 to WARN (probe p4, exit 0 with a receipt-less RENDER_VERIFIED).
**Root cause**: The block-wide phrase fallback was ORed with, rather than subordinated to, the declared Significance field.
**Suggested fix**: Implemented in R6.1: the declared field is authoritative; the phrase fallback applies only when the field is absent. Replay: p4 now exits 1 with 3 FAILs (Evidence, Excluded, C8); fixture `sketch-phrase-cannot-downgrade` pins it. Resolved.

### F5: IP-24 quote guard hid real inline color behind a stray legal quote [LOW] [RESOLVED]

**Location**: `skills/bs-uml-master/scripts/check-delivery.js` lines 95, 118, 275 (the three quote-blanking sites).
**Exploit scenario**: First pass: a legal PlantUML comment containing one double quote (`' reviewer said "looks good`) paired across newlines with the next label's opening quote, swallowing the `state` keyword of `state "Fast Mode" as s1 #lightblue` — no C7 color WARN (probes p6, p6c).
**Root cause**: Document-scoped quote pairing (`"[^"]*"` matches across newlines).
**Suggested fix**: Implemented in R6.1: pairing is line-bounded (`"[^"\n]*"`) at all three sites. Replay: p6, p6b, and p6c all now draw the C7 color WARN (exit 0, WARN-tier as designed). Resolved.

### F6: artifact-399ed2df replays are mechanically caught [LOW] [RESOLVED]

**Location**: `skills/bs-uml-master/scripts/check-delivery.js` C8 (lines 285-307) and C5 (lines 149-191); replayed against `docs/reviews/bs-uml-master/2026-09-01-haiku-usage-review-3.md`.
**Exploit scenario**: Retest of the previously reported exploit, re-run at 617e76c: probe p5 (the artifact's 说明 — RENDER_VERIFIED on a CDN-pinned Mermaid, self-graded ✅ rubric table, zero receipts) exits 1 on C8; probe p5b (diagram ④'s pseudo-class `graph TB` declared "Class Diagram") exits 1 on C5 + C8. The straight replay of usage-review-3's theater stays closed on the honest-format path.
**Root cause**: Not applicable — recorded as retest evidence.
**Suggested fix**: Keep p5/p5b encoded as fixtures alongside `fit-receipt-missing` so the CJK-flavored replay stays pinned.

### F7: Declaring "Backend: text" over a Mermaid fence exempts C8 with no backend-vs-source cross-check [MEDIUM] [OPEN]

**Location**: `skills/bs-uml-master/scripts/check-delivery.js` lines 294-295 (the `textBackend` exemption) versus `fences()`/C5, which never compare the Backend field to the fence language or header.
**Exploit scenario**: Probe n2: a deliverable-significance delivery with `**Backend:** text`, `**State:** RENDER_VERIFIED — mmdc 11.4.0, SVG inspected`, and a `mermaid`-tagged `flowchart TB` fence exits 0 with C8 silently skipped — no fit receipt required for a visual, rendered Mermaid delivery. One self-declared word buys the exemption while the very same State line names a Mermaid renderer and the fence is Mermaid source; the same family as the State-line dodge already pinned by fixture `fit-bypass-fake-text-receipt`, moved one field over.
**Root cause**: The C8 exemption trusts the Backend field in isolation. The mismatch is mechanically checkable — the checker already extracts every fence's language tag and header for C5 — but no rule ties the Backend claim to them, and a State line naming mmdc on a "text" backend raises no eyebrow either.
**Suggested fix**: When the Backend field claims a text backend but any diagram-shaped fence is mermaid/plantuml-tagged or carries a `DIAGRAM_HEADER` match (or the State line carries a visual-renderer receipt like mmdc/plantuml), FAIL with a backend-laundering message instead of granting the exemption; keep the exemption for genuinely fenceless/`text`-fenced deliveries. Add n2 as a fixture.

### F8: FAIL verdicts outside the first matching receipt window escape the trade-off gate — a regression for multi-receipt deliveries [MEDIUM] [OPEN]

**Location**: `skills/bs-uml-master/scripts/check-delivery.js` lines 296-303 and `fitReceiptWindow` lines 310-321 (first matching 8-line window returned; FAIL scan runs only on that window), against the dual-profile instruction in `skills/bs-uml-master/references/layout-craft.md` ("A diagram that must serve two media either carries fit receipts for both profiles…").
**Exploit scenario**: Probe n1b: a delivery carries two verbatim receipts exactly as layout-craft prescribes for dual-media targets — `**Fit (pc):** check-render-fit.js — … PASS …; 0 FAIL`, then six lines of reading notes, then `**Fit (a4):** check-render-fit.js — … FAIL gestalt does not fit; 1 FAIL` — and exits 0 with "check-render-fit receipt present". The a4 FAIL, summary count included, ships silently with no trade-off; no dishonesty is required, only ordinary prose spacing between the two receipts. R6's block-wide `[1-9]\d* FAIL` scan at 757ff4e would have caught this exact block, so the window scoping is a regression for the multi-receipt case. Probe n4 shows the same hole intra-receipt: padding lines push the per-line FAIL verdict below the window while a genuine PASS edge-line sits inside it — exit 0 (n4 requires reordering the paste, so it is closer to the fabrication ceiling; n1b needs no tampering at all). Probe n1 (receipts adjacent) is caught only because the second receipt happens to fall inside the first receipt's window — adjacency luck, not design.
**Root cause**: `fitReceiptWindow` returns the first token-satisfying window and the FAIL/hedge scans run only on it; later `check-render-fit` mentions are never inspected, and nothing re-checks the rest of the block for unresolved FAIL verdicts.
**Suggested fix**: Collect ALL matching windows (continue the loop) and require the trade-off note if any window contains a non-`0 FAIL` FAIL token; additionally, keep a block-wide `[1-9]\d*\s+FAIL` backstop outside fenced diagram source so a pasted summary count can never ship unexamined. Pin n1b and n4 as fixtures.

### F9: Hedge guard's 2-line lookback fails honest receipts on unrelated contract prose [LOW] [OPEN]

**Location**: `skills/bs-uml-master/scripts/check-delivery.js` lines 298-300 (hedge scan over the window) and line 317 (`lines.slice(Math.max(0, i - 2), i + 6)` — the window starts 2 lines above the tool token).
**Exploit scenario**: Probe n3: an honest, fully verbatim receipt (`**Fit:** check-render-fit.js — canvas 1200x760, 16px at fit, PASS …; 0 FAIL`) placed, per the contract template, directly under `**Excluded:** helper modules (roughly 20 files off-question)` exits 1: "fit receipt window contains hedge/negation language". The hedge word sits in the Excluded field two lines above the receipt — inside the lookback — so a compliant delivery cannot pass without rewording an unrelated field. The hedge list (`should`, `could`, `would`, `expect*`, `plan*`, `roughly`, `approximately`) is common contract prose; the contract layout puts Excluded/Assumptions/Evidence immediately above Fit, making collisions routine. A false FAIL is fail-safe but trains agents to treat checker FAILs as noise to be worded around, which corrodes the fix-every-FAIL loop.
**Root cause**: The hedge scan runs over the whole window including the i-2 lookback and neighboring contract fields, rather than over the receipt's own line(s).
**Suggested fix**: Scan hedge language only on the line containing the tool token plus following lines that look like tool output (or restrict to the `**Fit:**` field's value); alternatively drop the lookback (`slice(i, i + 6)`) since the tool token anchors the receipt's start. Add n3 as a must-not-FAIL fixture.

## Verdict

**Verdict**: NEEDS_IMPROVEMENT

R6.1 demonstrably closes everything from the first pass: all twelve original probes replayed at 617e76c land where they should (F1-F5 fixed and fixture-pinned, F6's theater replays still caught), and both self-test suites pass at 40/40 and 24/24. But the fresh probe round against the new logic leaves two MEDIUM findings open — the `Backend: text` one-word exemption over a Mermaid fence (F7, probe n2, exit 0) and the first-window-only FAIL scan that lets a layout-craft-compliant dual-profile delivery ship a verbatim "1 FAIL" receipt silently (F8, probe n1b, exit 0 — a regression from R6's block-wide scan) — plus a LOW hedge false positive that fails honest receipts (F9, probe n3). F7 and F8 are the same shape as the holes R6.1 just fixed: small, mechanically checkable, fixture-compatible. Until they are closed, the fit gate can still be dodged by a single self-declared word or by receipt ordering, so APPROVED is forbidden.
