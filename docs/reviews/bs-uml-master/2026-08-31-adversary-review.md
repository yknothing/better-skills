# Adversary Review: bs-uml-master

**Date**: 2026-08-31
**Reviewer Role**: Adversary
**Skill**: bs-uml-master
**HUMAN_VERIFIED**: false
**Scope Contract Version**: 1
**Reviewed Revision**: 9986df3a6fbeb54149a457586d5f035ee3cf4843
**Reviewed Skill SHA-256**: 4d7dd265a50f83de14ea84990932499f8b3c09e0ccbcde8a6f6736c10ff73a27
**Reviewed Manifest SHA-256**: a2dc6724fdcde28d6bdebff5b7c76b2f386ae4faad51045145bf0b3080136994

## Summary

Third-round review closing the R4 adversary cycle at check-render-fit v3 (9986df3). All five original findings are now verified fixed by re-running the live exploit artifacts, not by reading diffs alone: the edge parser matches 36/36 real mermaid 11 edges (was 0), the wide-sequence axis inversion FAILs, roledescription-first kind detection kills the `classDef actor` spoof on captured renderer markup and un-suppresses the laundering audit WARN, the viewport/medium wiring is documented in both canonical procedure docs, and the dead gestalt long-edge branch is removed with its reasoning recorded. One LOW residual remains open (IP-20: the fit receipt is still self-attested until check-delivery couples it), which does not block release. Worst-case impact of what remains: an agent that ignores the documented receipt requirement can still claim RENDER_VERIFIED without pasting fit output — a prose-bound, ledgered gap, not a mechanical false PASS.

## Evidence Reviewed

Full manifest receipt `a2dc6724fdcde28d6bdebff5b7c76b2f386ae4faad51045145bf0b3080136994` was received and independently verified.

Files examined: `scripts/check-render-fit.js` v3 (full read + `git diff 2c78b61..9986df3`), `scripts/test-check-render-fit.js` v3 (diff: fixtures 12/12b rebuilt on captured markup), `SKILL.md` Phase 4, `references/rendering-validation.md`, `references/layout-craft.md`, `docs/reviews/bs-uml-master/improvement-points.md` (IP-17..IP-20). SHAs re-hashed and matched the manifest for `SKILL.md`, `check-render-fit.js`, `test-check-render-fit.js`; `git rev-parse HEAD` = the reviewed revision; `check-delivery.js` SHA unchanged, consistent with IP-20 remaining open.

Probes rerun against v3 (same real-render corpus, mermaid-cli 11.16.0):

- `node scripts/test-check-render-fit.js` — ALL PASS, 14 fixtures; fixture 12 is now my captured exploit markup (`<g class="node default actor">` + `aria-roledescription="flowchart-v2"`, expecting gestalt + FAIL), fixture 12b the probed real `"sequence"` roledescription (expecting linear).
- F3 live artifact 1: the round-1 rendered spoof (169x1214 `graph TB` with `classDef actor`) → now `kind=gestalt`; exits 0 legitimately because it genuinely fits one screen at 11.2px, with the 0.14:1 aspect WARN firing — correct behavior, no laundering.
- F3 live artifact 2 (FAIL path): the same actor class injected into the real 833x2094 tower render → `kind=gestalt`, `FAIL ... 6.5px < 11px`, exit 1. The kind-poisoning vector is dead on renderer-emitted markup.
- F3 audit trail: `--kind linear` on the spoofed SVG now emits the laundering WARN (previously suppressed because the spoof forced `seq=true`).
- F1/F2 regressions re-run: 36 edges matched across the 7-file corpus; the 2850x309 14-participant sequence still `kind=linear` via roledescription and FAILs its cross axis at 8.3px; d1.svg FAIL / d1-elk.svg PASS unchanged.
- F6 partial: verified the unreachable gestalt long-edge FAIL branch is removed in v3 with the mathematical reason in a comment ("a gestalt diagram that fits one screen cannot have an over-screen edge by construction"); the remaining edge verdict is a WARN that can actually fire on linear diagrams (fixtures 9–10).

## Findings

### F1: Long-range-edge detection was inert on real mermaid output yet printed affirmative PASS evidence [HIGH] [RESOLVED]

**Location**: `scripts/check-render-fit.js` `edgeSpans` (v1 lines 69–82; v2+ tag-first parser).
**Exploit scenario**: (Round 1) Mermaid 11.16.0 emits `d=` before `class=` and renders sequence messages as `<line>` elements; the v1 class-first `<path>` regex matched 0/38 real edges, so every real render received a fabricated `PASS ... both endpoints co-visible` line while the self-test certified hand-crafted markup that never occurs.
**Root cause**: Regex written against fixture markup instead of captured renderer output.
**Suggested fix**: Order-independent attribute parsing, `<line>` support, real-markup fixtures. **Verified fixed** (round 2, re-confirmed at v3): 36 edges matched across the 7-file real corpus, 3/3 `<line class="messageLine0">` messages included; fixtures 9–10 lock d-before-class and line-element parsing.

### F2: Reading-axis heuristic inverted on wide sequence diagrams [HIGH] [RESOLVED]

**Location**: `scripts/check-render-fit.js` `isSequence` + `readingAxisVertical = seq ? true : H >= W`.
**Exploit scenario**: (Round 1) A real 14-participant sequence (2850x309) was certified exit 0: W > H made v1 call the participant axis the reading axis and bless the overflow as "1.9 screens legal for linear reading".
**Root cause**: "Reading axis = longer axis" shape heuristic standing in for the semantic fact that sequence time flows down.
**Suggested fix**: Pin the sequence reading axis vertical by detected kind. **Verified fixed** (round 2, re-confirmed at v3 where sequence detection now flows from `aria-roledescription="sequence"`): the same SVG FAILs its cross axis at 8.3px, exit 1; fixture 11 in regression.

### F3: Kind detection poisoned by real-element actor classes [MEDIUM] [RESOLVED]

**Location**: `scripts/check-render-fit.js` lines 65–75 (`isSequence` v3, roledescription-first).
**Exploit scenario**: (Rounds 1–2) `classDef actor` on a flowchart renders as `<g class="node default actor">`; v1/v2 class-token matching flipped kind to linear, letting tower flowcharts through and (v2) suppressing the manual-`--kind` audit WARN — v2's fixture had encoded the spoof as text content mermaid never emits.
**Root cause**: A user-controllable CSS class token was treated as a co-equal type signal even when the renderer's authoritative `aria-roledescription` was present.
**Suggested fix**: Roledescription-first detection with the class heuristic only as a roledescription-less fallback, plus a captured-markup fixture. **Verified fixed in v3, exactly as specified**: `aria-roledescription` is now authoritative (`sequence` prefix ⇒ linear; anything else ⇒ gestalt regardless of classes; element-class fallback only when absent). Live re-probes: the original spoofed render is `kind=gestalt` (exits 0 only because 169x1214 genuinely fits at 11.2px, aspect WARN firing); the actor class injected into the real 833x2094 tower yields `kind=gestalt`, FAIL, exit 1; the laundering WARN fires on the spoofed SVG under `--kind linear`. Fixture 12 now carries my captured exploit markup verbatim, fixture 12b the probed `"sequence"` value. The retained manual-`--kind linear` audit-WARN compromise is defensible now that it cannot be silenced by markup: banning the flag would misfire on legitimate LR pipelines (fixture 5), and the WARN lands in the fit output that rendering-validation requires recording in the `RENDER_VERIFIED` receipt.

### F4: Fit gate never parameterized by the Phase 0 medium [MEDIUM] [RESOLVED]

**Location**: `SKILL.md` Phase 4; `references/rendering-validation.md` checklist point 4.
**Exploit scenario**: (Round 1) The flag-less Phase 4 invocation certified fit against the baked-in 1470x850 default while the declared A4 medium (794x1123) FAILs the same SVG at 8.5px — a mechanical receipt for the wrong medium, in test prompt 4's own scenario.
**Root cause**: Phase 0 captured the medium and Phase 4 ran the checker, but nothing connected them; `--viewport` was undocumented.
**Suggested fix**: Mandate the Phase 0 viewport in the invocation and document the flags. **Verified fixed** (round 2 diffs, unchanged at v3): Phase 4 requires "passing the Phase 0 medium's viewport ... certifying fit against the wrong medium is a false receipt"; rendering-validation documents the default and all flags. Cosmetic residual: layout-craft.md line 64 still shows a flag-less invocation — noted for its next edit; both canonical procedure docs carry the requirement.

### F5: R4 gate not integrated into the canonical verification reference or the delivery receipt [LOW] [RESOLVED]

**Location**: `references/rendering-validation.md` checklist point 4; IP-20 in improvement-points.md.
**Exploit scenario**: (Round 1) An agent following the "Before delivery" reference's checklist performed medium fit as prose and never ran the mechanical gate; check-delivery accepted `RENDER_VERIFIED` with no fit evidence.
**Root cause**: R4 wired the gate into SKILL.md and layout-craft but not into the reference consulted at verification time.
**Suggested fix**: Integrate into the checklist; couple the receipt. **Verified fixed** for the checklist half (fit gate run mechanically, output recorded in the `RENDER_VERIFIED` receipt); the receipt-coupling half is honestly ledgered as IP-20 rather than claimed, tracked as F6.

### F6: Residual — fit receipt still self-attested until check-delivery couples it (IP-20) [LOW] [OPEN]

**Location**: `scripts/check-delivery.js` C2 (SHA unchanged through v2/v3, per manifest); `docs/reviews/bs-uml-master/improvement-points.md` IP-20; `scripts/check-render-fit.js` lines 177–181 (zero-match PASS wording).
**Exploit scenario**: check-delivery.js still passes a `RENDER_VERIFIED` state line that contains no fit-check output, so the recording requirement — including any laundering audit WARN — binds only agents already complying; a non-compliant delivery draft sails through the contract checker with fit self-attested. Secondary nit: an SVG in which `edgeSpans` recognizes zero edge elements (e.g. a hand-authored SVG with non-standard classes) still earns the affirmative `PASS ... both endpoints co-visible` line rather than a "no edges recognized" WARN — post-v3 this is a narrow honesty-of-wording issue, no longer a parser hole.
**Root cause**: Receipt coupling was deliberately deferred (fixtures first) per IP-20; the zero-match message predates the parser fix and was not revisited.
**Suggested fix**: Close IP-20: teach check-delivery C2 to WARN (or FAIL for screen media at deliverable+ significance) when a `RENDER_VERIFIED` claim on an SVG/Mermaid delivery carries no `check-render-fit` output line; switch the zero-match edge verdict from PASS to a neutral WARN naming how many edge elements were recognized. The v3 dead-branch removal I flagged in round 2 is verified done (unreachable gestalt FAIL arm deleted with the mathematical reason in a comment), so this finding is now exactly the ledgered IP-20 remainder plus one message-wording nit — LOW, non-blocking.

## Verdict

**Verdict**: APPROVED

Approved on empirical evidence, not on the fix notes: every one of the five findings from rounds 1–2 was re-tested at 9986df3 against the same live artifacts that originally broke the checker, and each fix held — including the F3 repair, which follows the specified roledescription-first design exactly and now carries my captured exploit markup in its regression suite, closing the fixture-vs-reality gap that caused two rounds of strawman-certified fixes. The adversary surface that mattered — mechanical false PASS receipts from the skill's own evidence tooling — is closed: real edges parse, sequence axes cannot invert, kind cannot be poisoned by renderer-emitted markup, laundering leaves an un-suppressible audit trail, and the wrong-medium receipt is named a false receipt in the workflow text. The single remaining OPEN item is LOW (IP-20's receipt self-attestation plus a message-wording nit), honestly ledgered with a concrete closing path, and within the release rules for approval.
