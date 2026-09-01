# Adversary Review: bs-uml-master

**Date**: 2026-09-01
**Reviewer Role**: Adversary
**Skill**: bs-uml-master
**HUMAN_VERIFIED**: false
**Scope Contract Version**: 1
**Reviewed Revision**: ae6eb2414f8bb92fdca00b635d14d60e7c56ab2b
**Reviewed Skill SHA-256**: 2dbe3df32e0968aff89a296f586a2e867e21a7f447d76b1a75d7384a5cb9f45d
**Reviewed Manifest SHA-256**: a4b8d8be703c8572619f5e0a296a2e78e89516fd09ac102b84d5b331f6268279

## Summary

Second-round review of R5 closing at ae6eb24. My three blocking-track findings are verified fixed by re-running the original exploit artifacts: non-scrollable media (a4/slide) now collapse the linear allowance to one screen with an explicit "cannot scroll" FAIL, all three C7 bypass families (themeVariables, stroke/color-only, PlantUML inline hex/name) now draw the WARN, the "no legend needed" silencer is stripped before the legend test, and the `--medium` flag plus its last-wins rule are documented in both canonical procedure texts with per-profile fixtures. Two LOW findings remain OPEN: the pre-existing, ledgered IP-20 receipt-coupling gap, and one new WARN-tier false positive the C7 fix introduced (mermaid `#quot;` entities on keyword-led lines such as `state "..."` trip the PlantUML inline-color detector). Neither blocks release; worst case is a spurious advisory WARN on an uncolored diagram.

## Evidence Reviewed

Full manifest receipt `a4b8d8be703c8572619f5e0a296a2e78e89516fd09ac102b84d5b331f6268279` was received and independently verified.

Files examined: `scripts/check-render-fit.js` (full diff `a1f466c..ae6eb24`: MEDIA entries gain `scrollable`, `maxScreens = scrollable ? 3 : 1`, non-scrollable INFO tag and FAIL message), `scripts/check-delivery.js` (C7 detection broadened + anti-silencing strip), both self-test diffs (fit fixtures 15-block: slide/a4/pc-contrast/readme/phone-landscape; delivery: themeVariables/PlantUML-inline/silencing/entity fixtures), `SKILL.md` Phase 4 (now `--medium <profile>` with the non-scrollable note), `references/rendering-validation.md` (profiles, non-scrollable rule, last-wins rule, all flags). All manifest SHAs re-hashed and matched (layout-craft and color-semantics unchanged from a1f466c, as the manifest states); `git rev-parse HEAD` = the reviewed revision.

Probes rerun against ae6eb24:

- Self-tests: fit 24/24 ALL PASS, delivery 24/24 ALL PASS (the fix notes said 25; actual count is 24 — cosmetic).
- F1 artifacts: 700x1500 sequence on `--medium slide` → `FAIL reading axis spans 2.1 screens but medium "slide" cannot scroll — everything must fit one page/slide`, exit 1 (was exit 0); 700x2200 on `--medium a4` → exit 1 (was exit 0); the same 700x1500 on default pc → exit 0 with the reworded "legal for linear reading on a scrollable medium" WARN. INFO now prints `medium=slide (non-scrollable)`.
- F2 artifacts: all five round-1 delivery drafts rerun — themeVariables-only, stroke/color-only, PlantUML `component X #E69F00`, classDef-fill positive control, and the "no legend needed" silencer now ALL draw the C7 WARN (silencer included); the declared-dimension fixture stays clean.
- F2 regression probe (new): an uncolored mermaid `stateDiagram-v2` with `state "uses #quot;fast#quot; mode" as s1` draws a spurious C7 color WARN — the entity guard fixture covers flowchart node lines (`a["#quot;..."]`, verified clean) but keyword-led lines (`state`, `participant`, `class`) enter the PlantUML inline-color branch, where `quot` matches the `#[A-Za-z]{3,20}` name form.
- F3: `--medium` verified in SKILL.md Phase 4 and rendering-validation checklist point 4 (profile list, a4/slide non-scrollable note, last-wins rule); per-profile fixtures present for slide, a4, readme, phone-landscape. The script's lines 2–4 header comment still reads "landscape PC screens" (stale, cosmetic) and `--medium` + `--viewport` together still resolve silently by documented last-wins (INFO discloses the effective medium).

## Findings

### F1: Scroll allowance applied to non-scrollable media [MEDIUM] [RESOLVED]

**Location**: `scripts/check-render-fit.js` MEDIA table (`scrollable` per profile) and the linear reading-axis rule (`maxScreens = opts.scrollable ? 3 : 1`); layout-craft/SKILL.md Phase 4 wording.
**Exploit scenario**: (Round 1) A 700x1500 sequence render on `--medium slide` exited 0 with "2.1 screens — legal for linear reading" — a mechanically certified receipt for a diagram that cannot be delivered on a projected slide; same class of wrong conclusion at `--medium a4` (print cuts at page boundaries).
**Root cause**: Profiles were reduced to viewport geometry; the 3-screen allowance encoded a scrollable-screen assumption that predated the fixed-media profiles.
**Suggested fix**: Per-profile `scrollable` flag collapsing the linear allowance to 1 screen on a4/slide, with a "cannot scroll" FAIL and doc mirror. **Verified fixed exactly as specified**: both round-1 probes now exit 1 with the explicit split-across-pages/slides message, the pc contrast case still scrolls legally, INFO labels non-scrollable media, and fixtures pin slide, a4, and the pc contrast.

### F2: C7 color gate bypassed by three styling families and silenced by disclaiming the legend [MEDIUM] [RESOLVED]

**Location**: `scripts/check-delivery.js` C7 (broadened detection regex + PlantUML inline-color line matcher + anti-silencing strip); `test-check-delivery.js` bypass fixtures.
**Exploit scenario**: (Round 1) themeVariables color overrides, stroke/color-only classDef/linkStyle styling, and PlantUML inline `#hex`/`#name` element colors all escaped detection, and appending "no legend needed" silenced the WARN via the bare `/legend/i` match.
**Root cause**: Detection enumerated one syntax form per idea instead of the color channels; the exemption matched the word "legend" anywhere.
**Suggested fix**: Broaden detection to fill/stroke/color/themeVariables/inline-#, narrow the exemption to declaration-shaped evidence. **Verified fixed**: all five round-1 probe drafts rerun — every bypass now WARNs, the silencer now WARNs (negated-legend phrasing is stripped before the test), the declared-dimension case stays clean, and each family has a regression fixture. One narrow false positive introduced by the inline-color branch is recorded as F5 (LOW) — it does not reopen this finding, whose subject was missed detections.

### F3: R5 flag and doc drift — `--medium` undocumented, silent flag override, stale comments, profile fixture gaps [LOW] [RESOLVED]

**Location**: `SKILL.md` Phase 4; `references/rendering-validation.md` checklist point 4; `test-check-render-fit.js` profile fixtures.
**Exploit scenario**: (Round 1) Agents working from the two canonical procedure texts never learned `--medium` existed; `--medium a4 --viewport 1470x850` silently checked the PC viewport; four of six profiles had no self-test coverage.
**Root cause**: The R5 feature landed in the script and layout-craft without revisiting the R4.1 invocation text.
**Suggested fix**: Document `--medium` as the primary form with the interaction rule; add profile fixtures. **Verified fixed for everything substantive**: Phase 4 now instructs `--medium <profile>` with the non-scrollable caveat, rendering-validation lists all profiles, flags, and the explicit "later flag wins" rule, and readme/phone-landscape/slide/a4 fixtures exist. Two cosmetic residuals stay on record without reopening a LOW: the script's header comment still says "landscape PC screens", and the flag interaction remains silent-but-documented (a usage error or precedence WARN would be sturdier); INFO's `medium=custom` disclosure mitigates.

### F4: IP-20 carryover — fit receipt still self-attested by check-delivery [LOW] [OPEN]

**Location**: `scripts/check-delivery.js` C2 (untouched by the R5.1 fix); `docs/reviews/bs-uml-master/improvement-points.md` IP-20.
**Exploit scenario**: Unchanged: a delivery claiming `RENDER_VERIFIED` with a tool+version receipt but no pasted check-render-fit output passes check-delivery, so per-medium fit conclusions — now including the non-scrollable FAILs — bind only agents that already comply; a wrong-medium or ignored-FAIL receipt is not mechanically caught.
**Root cause**: Receipt coupling deliberately deferred (fixtures first) per the open IP-20 ledger entry.
**Suggested fix**: Close IP-20: C2 WARNs (FAIL at deliverable+ for screen/page media) when a `RENDER_VERIFIED` state line for an SVG/Mermaid delivery carries no check-render-fit output line, and require the medium named in that line to match the contract's Medium field.

### F5: C7 inline-color detector false-positives on mermaid entities in keyword-led lines [LOW] [OPEN]

**Location**: `scripts/check-delivery.js` C7 PlantUML inline-color branch (`^\s*(?:class|state|participant|...)[^\n#]*#(?:hex|[A-Za-z]{3,20})\b`); `test-check-delivery.js` "entities-not-color" fixture (covers flowchart node lines only).
**Exploit scenario**: Probed: an uncolored mermaid `stateDiagram-v2` containing `state "uses #quot;fast#quot; mode" as s1` draws the C7 "color styling present" WARN — `state` matches the keyword alternation (shared between PlantUML and mermaid), and `quot` matches the color-name form. Same shape reachable via `participant A as x #quot; y` or classDiagram `class Foo["... #quot; ..."]`. Impact is advisory-only noise (a WARN the author must talk down in an uncolored delivery), but WARN fatigue erodes the gate's credibility.
**Root cause**: The inline-color branch applies PlantUML line grammar to all fence bodies, and the entity guard fixture only encodes the flowchart form where the line starts with a node id.
**Suggested fix**: Skip the inline-color branch for fences whose header is a known mermaid type (the fence's `lang`/header is already computed for C5), or exclude the entity vocabulary (`quot|amp|lt|gt|nbsp|semi` and `#\d+;` numeric forms) from the color-name match; add the `state "...#quot;..."` fixture.

## Verdict

**Verdict**: APPROVED

Approved on re-execution evidence: every blocking finding from the first R5 round was re-tested at ae6eb24 with the original exploit artifacts and each fix held — the physically undeliverable slide/a4 receipts now FAIL with an actionable message while the pc contrast case still passes, all three C7 bypass families and the silencer now draw the WARN, and the documentation and fixture gaps are closed with the last-wins rule stated where operators will read it. The two remaining OPEN findings are LOW and within the release rules: IP-20 is a pre-existing, honestly ledgered coupling gap with a concrete closing path, and the new entity false positive is advisory-tier noise with a one-line fix and no false-negative consequence. The R5 feature claims as shipped now survive their adversarial edges: conclusions invert between media on volume, direction, and — after this fix — scrollability.
