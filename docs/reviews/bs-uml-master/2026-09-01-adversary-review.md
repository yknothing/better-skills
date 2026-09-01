# Adversary Review: bs-uml-master

**Date**: 2026-09-01
**Reviewer Role**: Adversary
**Skill**: bs-uml-master
**HUMAN_VERIFIED**: false
**Scope Contract Version**: 1
**Reviewed Revision**: 757ff4e0ac1d16433e5da07d417a28732598e01d
**Reviewed Skill SHA-256**: da8087e49d55d0f4c732f4adfe04021d2965153577fd9d780f6ae836f22e1abb
**Reviewed Manifest SHA-256**: 66fc802e686037e7c9fb02003f262f3979283ac60c55fb6738137dc9e33df09d

## Summary

Six findings from an empirical probe round against the R6 changes (C8 fit-receipt gate, IP-24 quote guard, receipts-or-silence text): three probed MEDIUM bypasses of the new C8 gate that let a `RENDER_VERIFIED` visual delivery ship with no fit receipt or with a smuggled FAIL receipt (exit 0 in every case), one LOW sketch-phrase relaxation hole, one LOW C7 quote-blanking false negative that is a design regression of the IP-24 fix, and one RESOLVED confirmation that the artifact-399ed2df replays are now mechanically caught. Worst case: the exact self-certification theater R6 was built to stop still passes the checker verbatim when the delivery says "Mermaid (text annotations)" in the Backend field, leaves the template's Backend placeholder unreplaced, or pastes a truncated fit receipt whose FAIL lines carry no "N FAIL" summary count. Both regression suites pass (33/33 delivery fixtures, 24/24 fit fixtures), so all findings below are holes the fixtures do not yet encode.

## Evidence Reviewed

Full manifest receipt `66fc802e686037e7c9fb02003f262f3979283ac60c55fb6738137dc9e33df09d` was received and independently verified.

Files read in full: `skills/bs-uml-master/SKILL.md`, `skills/bs-uml-master/scripts/check-delivery.js`, `skills/bs-uml-master/scripts/check-render-fit.js`, `skills/bs-uml-master/scripts/test-check-delivery.js`, `skills/bs-uml-master/references/layout-craft.md`, `skills/bs-uml-master/references/syntax-pitfalls.md`, `skills/bs-uml-master/references/rendering-validation.md`, `docs/reviews/bs-uml-master/2026-09-01-haiku-usage-review-3.md`, `docs/reviews/bs-uml-master/improvement-points.md`, `tools/peer-review.js`.

Commands run (cwd `/home/user/better-skills`):

- `git rev-parse HEAD` → 757ff4e0ac1d16433e5da07d417a28732598e01d; `sha256sum` on SKILL.md, check-delivery.js, test-check-delivery.js, check-render-fit.js, layout-craft.md, syntax-pitfalls.md, rendering-validation.md — all seven match the manifest hashes above.
- `node skills/bs-uml-master/scripts/test-check-delivery.js` → ALL PASS (33 fixtures).
- `node skills/bs-uml-master/scripts/test-check-render-fit.js` → ALL PASS.
- 11 hand-built probe deliveries under the session scratchpad `adv-r6/` directory (p1, p1b, p2, p3, p3b, p4, p5, p5b, p6, p6b, p6c), each run through `node skills/bs-uml-master/scripts/check-delivery.js <file>` with exit codes and per-check lines recorded. Probe outcomes are cited per finding.

## Findings

### F1: C8 exemption keys on a substring match of the Backend field — "Mermaid (text annotations)" and the unreplaced template placeholder both skip the fit gate entirely [MEDIUM] [OPEN]

**Location**: `skills/bs-uml-master/scripts/check-delivery.js` line 281 (`const textBackend = /\b(?:plain\s*)?(?:text|ascii)\b/i.test(backend || "")`), against the Output Contract template line in `skills/bs-uml-master/SKILL.md` (`**Backend:** [Mermaid|PlantUML|text|SVG]`).
**Exploit scenario**: Probe p1: a deliverable-significance delivery with `**Backend:** Mermaid (text annotations)` and `**State:** RENDER_VERIFIED — mmdc 11.4.0, SVG inspected`, no Fit line at all → exit 0, and no C8 line appears in the output (the gate is silently skipped, not warned). Probe p1b is worse: the delivery copies the SKILL.md template's Backend placeholder literally — `**Backend:** [Mermaid|PlantUML|text|SVG]` — and is likewise fully exempted (exit 0, no C8 check emitted), because the placeholder contains the word "text". The lazy-model profile R6 targets (artifact 399ed2df imitated contract vocabulary without doing the work) is exactly the profile that leaves template placeholders unreplaced; SKILL.md calls an unfilled placeholder "a format-invalid delivery", yet the checker both accepts it under C1 and lets it disable C8.
**Root cause**: The R6 exemption was deliberately moved from the State line to the Backend field (the fixture `fit-bypass-fake-text-receipt` covers the State-line variant), but the field test is a word-boundary substring match rather than a whole-field match, so any Backend value that mentions "text" or "ascii" anywhere — including the template's own placeholder — claims the plain-text exemption. Additionally, no check anywhere rejects an unreplaced `[...]` placeholder in a header field.
**Suggested fix**: Match the whole trimmed field, e.g. `/^(plain[\s-]*)?text$|^ascii([\s-]*art)?$/i` on `backend.trim()`; treat any other Backend containing "text"/"ascii" as visual (or WARN on the ambiguity). Separately, FAIL any header field whose value still matches the template placeholder shape (`/^\[.*\|.*\]$/`). Add both probes as fixtures.

### F2: FAIL-receipt smuggling — a verbatim-but-truncated check-render-fit receipt with no "N FAIL" summary line ships a failing fit silently [MEDIUM] [OPEN]

**Location**: `skills/bs-uml-master/scripts/check-delivery.js` line 288 (`/\b[1-9]\d*\s+FAIL\b/`), interacting with the paste instruction in `skills/bs-uml-master/references/rendering-validation.md` checklist item 4 ("paste the tool's line (canvas WxH, effective px, verdict)") and `check-render-fit.js` output format (per-line `  FAIL  gestalt diagram does not fit...` plus a final `N FAIL` summary).
**Exploit scenario**: Probe p3: a delivery pastes the fit tool's INFO line and its per-line FAIL verdict verbatim (`INFO canvas 698x1648 ... label font 16px` / `FAIL gestalt diagram does not fit one screen legibly: effective label font 8.3px < 11px`) but omits the trailing `1 FAIL` summary line. C8 reports "check-render-fit receipt present alongside RENDER_VERIFIED", exit 0 — a measured fit failure ships with no recorded trade-off, which is precisely the outcome the fail-needs-trade-off branch exists to block. Probe p3b: the ordering `verdict FAIL (count: FAIL 1)` also passes. Note the rendering-validation text itself instructs pasting "the tool's line", i.e. the verdict line — an agent following that instruction literally, honestly, produces exactly this bypass; no dishonesty is required.
**Root cause**: The failing-receipt detector requires the digits-then-FAIL summary shape (`[1-9]\d* FAIL`); the tool's per-line verdicts put FAIL first with no adjacent count, so any receipt truncated above the summary line — or reordered — reads as passing. The `hasShape` test (`PASS|FAIL` anywhere) is satisfied by the same FAIL token that the trade-off branch then fails to see.
**Suggested fix**: After confirming receipt shape, strip `0 FAIL` tokens and then treat any remaining standalone `FAIL` in the block's Fit context as a failing receipt requiring the trade-off note (e.g. `if (/\bFAIL\b/.test(fitContext.replace(/\b0\s+FAIL\b/g, "")))`); or require the receipt to include the summary-count line explicitly. Add p3/p3b as fixtures.

### F3: C8's receipt shape is satisfiable by scattered, even explicitly negated, prose — "I did not run check-render-fit" plus incidental numbers counts as a receipt [MEDIUM] [OPEN]

**Location**: `skills/bs-uml-master/scripts/check-delivery.js` lines 283–285 (`hasTool = /check-render-fit/i.test(block)`; `hasShape` = `\d+x\d+` anywhere + `px` anywhere + `PASS|FAIL` anywhere in the block).
**Exploit scenario**: Probe p2: a deliverable-significance `RENDER_VERIFIED` delivery whose only "receipt" is the Reading-notes sentence "I did not run check-render-fit on this one. The canvas is roughly 1200x760 and labels use 16px, which should PASS comfortably." → C8 emits "check-render-fit receipt present alongside RENDER_VERIFIED", exit 0. The four evidence tokens are tested independently against the whole block, so a delivery that names the tool only to disclaim running it, and mentions dimensions/font in ordinary layout prose (the artifact-399ed2df 说明 did exactly this kind of numeric self-description), clears the gate with zero receipt-shaped content anywhere. This is distinct from the acknowledged fabrication ceiling (the checker binds format, not truth — IP-9/Phase 2.A): here nothing receipt-shaped exists at all, so the format binding itself is not happening.
**Root cause**: No contiguity or field anchoring: the receipt's components may be scattered across the whole delivery block and are never required to co-occur on one line or inside the `**Fit:**` field the contract defines for them.
**Suggested fix**: Require the shape within a single line (or within the `**Fit:**` field's value) that also contains the `check-render-fit` token — the test suite's own FIT constant is exactly this one-line shape, so the stricter regex is already fixture-compatible. Optionally WARN when `check-render-fit` appears only in negated phrasing.

### F4: A stray "sketch level" phrase relaxes C1/C3/C4/C8 to warnings even when Significance explicitly declares deliverable [LOW] [OPEN]

**Location**: `skills/bs-uml-master/scripts/check-delivery.js` lines 191–193 (`const sketch = /sketch/.test(sig) || /sketch level/i.test(block)`), plus the SKILL.md Output Contract paragraph, which says the checker "rejects ... RENDER_VERIFIED claims on visual backends that lack a check-render-fit receipt" without mentioning this relaxation path.
**Exploit scenario**: Probe p4: a delivery with `**Significance:** deliverable` and the Reading-notes phrase "This goes well beyond sketch level polish" gets the sketch path: Evidence, Excluded and the C8 fit receipt all soften to WARN, exit 0 — a receipt-less deliverable `RENDER_VERIFIED` ships. The block-wide phrase search exists for legitimately compressed sketch deliveries that drop the Significance field, but it is ORed with — rather than subordinated to — an explicitly declared non-sketch field, so an incidental or deliberately planted phrase silently selects the weaker enforcement while the delivery presents itself to the reader as deliverable.
**Root cause**: Fallback phrase detection takes effect even when the authoritative field is present and contradicts it; the contradiction is not surfaced.
**Suggested fix**: Apply the `/sketch level/` block search only when no Significance field exists; when the field exists and is not sketch, ignore the phrase (or WARN on the contradiction, mirroring the IP-18 audit-WARN pattern). Document the sketch-relaxation of C8 in the SKILL.md contract paragraph while touching it.

### F5: IP-24 quote guard regressed into a false negative — one legal stray quote hides real PlantUML inline color from C7 [LOW] [OPEN]

**Location**: `skills/bs-uml-master/scripts/check-delivery.js` line 263 (`f.body.replace(/"[^"]*"/g, '""')` before the inline-color test).
**Exploit scenario**: Probe p6c: a PlantUML source containing a perfectly legal comment line with one double quote (`' reviewer said "looks good`) followed by `state "Fast Mode" as s1 #lightblue` draws no C7 color WARN (probed: exit 0, no WARN line), because `[^"]*` matches across newlines, so the comment's quote pairs with the opening quote of "Fast Mode" and the blanking consumes the intervening newline and the `state` keyword — the keyword-led colored line no longer exists when the inline-color regex runs. Probe p6 (unbalanced quote in a note) reproduces the same miss; probe p6b confirms balanced multi-line labels still behave. The delivery ships decorative color with no legend and no warning — the exact case IP-24's fixture pair was built to keep hot (`state "Fast Mode" as s1 #lightblue` still warns in the fixture, but only because no stray quote precedes it).
**Root cause**: The R6 quote-blanking is document-scoped, not line-scoped: quote pairing runs across newlines, so any odd quote earlier in the source (legal in `'` comments, note bodies, or Mermaid `%%` comments) shifts the pairing and swallows subsequent keyword-led lines.
**Suggested fix**: Blank quotes per line — `replace(/"[^"\n]*"/g, '""')` — and strip `'`-comment and `%%`-comment lines before the color tests. Add p6c as a fixture next to the two IP-24 fixtures. C7 is WARN-tier, hence LOW.

### F6: artifact-399ed2df replays are now mechanically caught — the R6 counter to IP-25/IP-20 holds on the straight replay [LOW] [RESOLVED]

**Location**: `skills/bs-uml-master/scripts/check-delivery.js` C8 (lines 273–294) and C5 (lines 142–184); replayed against the failure documented in `docs/reviews/bs-uml-master/2026-09-01-haiku-usage-review-3.md`.
**Exploit scenario**: Retest of the previously reported exploit. Probe p5 mimics the artifact's 说明 — `RENDER_VERIFIED` on a CDN-pinned Mermaid, a self-graded rubric table (流向单调性 ✅, 交叉预算 ✅ 0次交叉, 媒介适配 ✅ 可缩放), zero checker receipts → now exits 1 with the C8 FAIL naming IP-20/IP-25. Probe p5b mimics diagram ④ — pseudo-class `graph TB` boxes declared as "Class Diagram" → exits 1 on both C5 ("fake or mismatched notation") and C8. The straight replay of usage-review-3's theater no longer passes the checker; it survives only through the F1–F3 side doors above.
**Root cause**: Not applicable as an open defect — recorded as the retest evidence that the R6 gate closes the reported vector on the honest-format path.
**Suggested fix**: Keep p5/p5b as regression fixtures alongside the existing `fit-receipt-missing` fixture (which covers the same vector in English) so the CJK-flavored replay stays encoded.

## Verdict

**Verdict**: NEEDS_IMPROVEMENT

The R6 direction is correct and demonstrably effective on the honest path: both self-test suites pass, and the exact artifact-399ed2df theater that motivated this round now fails mechanically (F6). But the new C8 gate has three probed, currently-live format bypasses — a Backend-field substring exemption that the skill's own unreplaced template placeholder triggers (F1), FAIL-receipt smuggling via truncated or reordered verbatim tool output that the rendering-validation text's "paste the tool's line" instruction actively invites (F2), and a scattered/negated receipt shape with no contiguity requirement (F3) — each of which lets the targeted lazy-model profile ship an unearned or known-failing `RENDER_VERIFIED` with exit 0. These are checker-precision holes with small, fixture-compatible fixes rather than design flaws, matching the severity profile of prior point-release rounds (IP-11, IP-13, IP-23); with F1–F3 closed and fixtures added, plus the LOW items F4/F5 addressed or explicitly deferred, this round would be approvable. With three MEDIUM findings open, APPROVED is forbidden.
