# Adversary Review: bs-uml-master

**Date**: 2026-09-02
**Reviewer Role**: Adversary
**Skill**: bs-uml-master
**HUMAN_VERIFIED**: false
**Scope Contract Version**: 1
**Reviewed Revision**: d578e78cc2b64a2829a50bd3b05cd90257756c84
**Reviewed Skill SHA-256**: 454a862bdf526571f1e5f4fafcb6bbcffdb59d5f18f69c8e55d047368843386c
**Reviewed Manifest SHA-256**: f9a4c79202155ecfa724e8fe3a87a991df7d4645e2cd3b09f806043e26d532c7

## Summary

R7 (commits 4471033 + d578e78) adds `verify-delivery.js` and `check-evidence.js` to close the three sample-#4 failures: the HTML medium bypass, the pinned-renderer blind spot, and citation laundering. Twelve findings: three HIGH, four MEDIUM, five LOW, all open. The worst case is empirical and end-to-end: an HTML page that carries one extractable diagram plus two diagrams the pinned mermaid 10.6.1 rejects (one of them the exact second-colon transition that blanked sample #4's page) runs through the full pipeline (render, on-demand 10.6.1 install, receipt pasted back) and exits 0 with `VERDICT: PASS`; separately, a `check-render-fit` FAIL receipt pasted verbatim satisfies check-delivery C8 because the verifier's own verdict wording contains the exemption keyword "trade-off", and a typo in `--medium` yields `VERDICT: PASS` around a `FAIL` cell. The prose is mostly sound, but one newly added "probed" pitfall is false on both renderer versions.

## Evidence Reviewed

Full manifest receipt `f9a4c79202155ecfa724e8fe3a87a991df7d4645e2cd3b09f806043e26d532c7` was received and independently verified.

Manifest entries re-hashed with `sha256sum` at HEAD d578e78cc2b64a2829a50bd3b05cd90257756c84: `SKILL.md` 454a862b…, `verify-delivery.js` 54b9a88b…, `check-evidence.js` 554563a1…, `syntax-pitfalls.md` af16fd8a…, `rendering-validation.md` d0490c6b…, `batch-1-test-prompts.json` 22625636… — all match the prompt.

Files read in full: `docs/reviews/bs-uml-master/2026-09-02-adversary-prompt.md`, `docs/reviews/bs-uml-master/2026-09-02-haiku-usage-review-4.md`, `docs/reviews/bs-uml-master/improvement-points.md` (IP-9, IP-30..35), `skills/bs-uml-master/scripts/verify-delivery.js`, `skills/bs-uml-master/scripts/check-evidence.js`, `skills/bs-uml-master/scripts/test-verify-delivery.js`, `skills/bs-uml-master/scripts/test-check-evidence.js`, `skills/bs-uml-master/scripts/check-delivery.js`, `skills/bs-uml-master/scripts/check-mermaid.js`, `skills/bs-uml-master/scripts/check-render-fit.js` (output format and exit codes), `git show d578e78` for `SKILL.md`, `references/rendering-validation.md`, `references/syntax-pitfalls.md`, `references/layout-craft.md`, `references/modeling-from-code.md`, and the two new dataset evals; `tools/peer-review.js` (format checks).

Commands run (cwd `/home/user/better-skills` unless noted; probe fixtures under the session scratchpad `adv-r7/`):

- `git log --oneline -3`; `git show 4471033 --stat`; `git show d578e78 --stat`.
- `node skills/bs-uml-master/scripts/test-check-delivery.js` → ALL PASS; `test-check-render-fit.js` → ALL PASS; `test-check-evidence.js` → ALL PASS (9 fixtures); `test-verify-delivery.js` → ALL PASS (18 assertions).
- `bash tools/validate.sh skills/bs-uml-master/` → 16 passed, 0 failed (SKILL.md 4694 words).
- `node evaluation/harness/runner.js --skill bs-uml-master` → gate1 100, test-prompt-structure 100 (6 evals), completeness 100; behavior NOT_RUN.
- `check-mermaid.js` on six stateDiagram probes (`colon2`, `pipe`, `pipe2`, `pipeq`, `noteline`, `br`, `glyph`, `glyph2`, `notegood`) with cwd at the scratchpad root (mermaid 11.17.2) and at `haiku-review/` (mermaid 10.6.1); `mmdc` render of `pipe.mmd` and inspection of the SVG state ids.
- `detectPin`/`buildMirror`/`extractSources` unit probes via `require("verify-delivery.js")` on 9 CDN forms and 12 HTML block forms.
- `verify-delivery.js` integration probes p1 (bogus medium, RENDER_VERIFIED contract), p4 (bogus medium / bogus kind / missing `--medium` value, SYNTAX_VERIFIED contract), p2/p5 (composite HTML with dodged blocks; `--no-render`, pin-install, full render, receipt pasted back), p6 (receipt→check-delivery C8 round trip; stale receipt after diagram edit), p7 (4616x94 fit-FAIL receipt pasted verbatim), p8 (fenceless external-file delivery; two-block delivery with one receipt; HTML table mirror), p9 (empty file, directory, HTML without a closing h2, `--out` pointing at an existing file, binary input).
- `check-evidence.js` probes p3 (six citation forms incl. `line N`, `file:N`, `:LN`, backslash path, reversed range, line 0), false-positive line set, backtick substring set, identifier-on-previous-line set, `--repo /nonexistent`, 20-digit line number, `../../../../etc/passwd:1`.
- `node tools/peer-review.js check bs-uml-master` on this file after writing.

## Findings

### F1: A pasted FAIL receipt passes check-delivery C8 because the verifier's own wording carries the trade-off exemption keyword [HIGH] [OPEN]

**Location**: `skills/bs-uml-master/scripts/verify-delivery.js` line 207 (`VERDICT: FAIL — … a FAIL that stays needs a recorded trade-off`); `skills/bs-uml-master/scripts/check-delivery.js` line 329 (`failing && !/USER-OVERRIDE|trade-?off|取舍|ladder/i.test(block)`); SKILL.md Minimum Compliant Path step 6 ("paste the receipt into the delivery verbatim") and Phase 5 line 159 / Output Contract line 183, which still direct the agent to `check-delivery.js` as the pre-delivery check.
**Exploit scenario**: Probe p7: a 15-node `flowchart LR` renders at 4616x94, effective font 5.1px. `verify-delivery.js --medium pc` correctly emits `check-render-fit(pc) canvas 4616x94 5.1px FAIL` and `VERDICT: FAIL — … needs a recorded trade-off`. The agent does what step 6 says (paste the receipt verbatim), then runs `check-delivery.js` as Phase 5 / the Output Contract still instruct: `PASS D1 check-render-fit receipt present alongside RENDER_VERIFIED`, `0 FAIL`, exit 0. No trade-off was ever written; the tool's verdict sentence supplied the keyword. The unreadable diagram ships `RENDER_VERIFIED` with a passing contract check — the exact IP-20/IP-25 theater the C8 gate exists to stop.
**Root cause**: C8's trade-off exemption is a keyword scan over the whole block, and R7 introduced a tool whose canonical output contains that keyword on every FAIL. Two entry points (`check-delivery.js` in Phase 5 and the Output Contract; `verify-delivery.js` in the Minimum Compliant Path) with different strictness let the weaker one certify.
**Suggested fix**: Change the verifier's verdict text to avoid the exemption vocabulary (e.g. "a FAIL that stays must be justified in the delivery"), and make C8 require the trade-off outside receipt windows (strip lines from `## verify-delivery receipt` through `VERDICT:` before the keyword scan, as fences are already masked). Add a fixture: pasted verbatim FAIL receipt with no author-written trade-off → exit 1. Make SKILL.md Phase 5 and the Output Contract name `verify-delivery.js` (or state that `check-delivery.js` alone is not a delivery gate).

### F2: HTML blocks that mermaid renders but the verifier does not extract yield VERDICT: PASS around unparseable diagrams [HIGH] [OPEN]

**Location**: `skills/bs-uml-master/scripts/verify-delivery.js` line 61 (`<(?:div|pre)[^>]*class="(?:[^"]*\s)?mermaid…"`), line 138 (`isHtml` also keyed on `class="`); `references/rendering-validation.md` "One command first" ("an HTML artifact is a first-class input, never a bypass"); SKILL.md "HTML/artifact deliveries are not a bypass".
**Exploit scenario**: Probe p5/page3: a page pinning cdnjs mermaid 10.6.1 with three diagram blocks — one `div class="mermaid"` flowchart, one single-quoted `div class='mermaid'` stateDiagram with a second colon (rejected by 10.6.1), one `pre class="language-mermaid"` with note text on the opener line (rejected everywhere). Full pipeline, no flags withheld: `diagrams: 1 · … · parse mermaid@10.6.1 (pinned) OK · render mmdc OK · … PASS`, `VERDICT: PASS`, exit 0, with the receipt pasted back. The two dodged sources are dumped into the mirror as prose. The browser's `querySelectorAll('.mermaid')` does not care about attribute quoting or the tag name, so the single-quoted block renders (and fails) for the reader exactly as in sample #4, while the tool that exists to catch that reports PASS. Unit probe: single-quoted, unquoted (`class=mermaid`), `section class="mermaid"`, `textarea class="mermaid"`, `code class="language-mermaid"`, and `script type="text/plain" class="mermaid"` all extract 0 sources; capitalised `Mermaid`, `pre`, nested inner div, extra attributes and multi-class extract correctly.
**Root cause**: One hand-written regex over a fixed tag pair and double-quoted attribute; no reconciliation between "blocks the page will hand to mermaid" and "blocks I extracted"; no warning when diagram-shaped text (`stateDiagram-v2`, `graph`, `classDiagram` at line start) survives into the mirror outside a fence.
**Suggested fix**: Match any tag whose class attribute (either quote style or unquoted) contains the token `mermaid`, plus `code class="language-mermaid"`; after mirroring, scan the non-fenced mirror text for `DIAGRAM_HEADER` lines and FAIL with "diagram-shaped text outside an extracted block — unrecognised container". Add fixtures for each dodge form.

### F3: A check-render-fit usage error yields VERDICT: PASS with a FAIL cell in the receipt [HIGH] [OPEN]

**Location**: `skills/bs-uml-master/scripts/verify-delivery.js` lines 178–182 (`verdict = fit.code === 0 ? "PASS" : "FAIL"; if (fit.code === 1) anyFail = true`).
**Exploit scenario**: Probe p4: a valid SYNTAX_VERIFIED delivery run with `--medium bogus` (or `--medium a4-portrait`, or `--kind bogus`; also any SVG check-render-fit rejects with exit 2, such as one without a viewBox). Receipt: `render mmdc OK · check-render-fit(bogus) canvas 87x174 ?px FAIL`, then `VERDICT: PASS — paste this receipt into the delivery`, exit 0. The fit gate never ran, the receipt says FAIL, the verdict says PASS. The pasted line does not form a C8 window (no `NNpx`), so check-delivery would later flag an unreceipted RENDER_VERIFIED — but only if the agent runs it, and only for RENDER_VERIFIED; the verifier's own verdict is the lie.
**Root cause**: Exit code 2 from a sub-tool is treated as "not a FAIL" while the cell is labelled FAIL; `--medium` is never validated against the profile list, and a missing `--medium` value silently defaults to `pc`.
**Suggested fix**: Treat any non-zero fit exit as blocking (`if (fit.code !== 0) anyFail = true`), label exit-2 cells `UNCHECKED (usage: …)` rather than FAIL, validate `--medium`/`--kind` up front and return 2 on an unknown profile, and error on a flag with a missing value. Fixture: `--medium bogus` → exit 2, no VERDICT: PASS.

### F4: Pin detection misses floating CDN loads and can be spoofed by prose or a comment [MEDIUM] [OPEN]

**Location**: `skills/bs-uml-master/scripts/verify-delivery.js` lines 47–50 (`detectPin`), lines 146–153 (`pinNote` only set on install failure or pin==local); `references/rendering-validation.md` "Pinned-renderer parity" ("State the skew explicitly whenever the pinned version could not be checked").
**Exploit scenario**: Unit probes: `mermaid@latest`, `mermaid@11` (major only), and an unversioned `unpkg.com/mermaid/dist/mermaid.min.js` all return null — the receipt then shows no pin and no warning, so a page whose renderer floats is reported as if it had none. `<!-- mermaid/11.17.2 -->` or the sentence "verified with mermaid@11.17.2" placed before a real `mermaid/10.6.1` script tag wins (`html.match` returns the first occurrence anywhere in the document, not in a script `src`), so the parity check silently runs on the wrong version. With `--no-pin-install` (the test suite's own mode) the receipt prints `renderer pin: mermaid@10.6.1 (CDN)` with no note that the pin was never parsed against (probe p5, first run).
**Root cause**: The regex scans the whole document instead of `script src`/`import` URLs; unversioned or partially versioned URLs are treated as "no pin"; the skew note is only emitted on install failure.
**Suggested fix**: Extract candidate URLs from `script[src]` and `import … from "…"` only; classify as pinned (x.y.z), floating (`latest`, major-only, no version → WARN "unpinned CDN load: pin to the verified version"), or self-hosted; whenever a pin exists but was not parsed against (`--no-pin-install`, install failure), append `(NOT CHECKED — skew unstated)` to the pin cell and count it as a FAIL for deliverable significance.

### F5: check-evidence sees a narrower citation grammar than check-delivery C3 accepts, and the identifier cross-check is dodged by a line break or satisfied by a substring [MEDIUM] [OPEN]

**Location**: `skills/bs-uml-master/scripts/check-evidence.js` line 23 (`CITE`), line 53 (identifiers taken from the citing line only), lines 64–65 (`near.includes` / `whole.includes`); `check-delivery.js` line 53 (`FILE_LINE` accepts `path file:N`, `path line N`, `path:LN`); `references/modeling-from-code.md` "Citation integrity (mechanical)" ("resolves every citation").
**Exploit scenario**: Probe p3: six citations on one Evidence line — `src/batch.js line 2`, `src/batch.js file:3`, `src/registrar.js:L12` (ghost file), `src\batch.js:2`, `src/batch.js:65-50`, `src/batch.js:0`. check-delivery C3: `PASS Evidence present with file:line`. check-evidence: only three citations seen; the ghost `registrar.js:L12` vanishes silently (no "unparsed citation" notice), the backslash path false-FAILs as `batch.js`. Split probe: a bullet `- \`UNFROZEN\`, \`gate_id\`, \`Registrar\`` with the citation on the next line → `PASS … (no identifier tokens to cross-check)`; the fabrication signature is defeated by a newline. Substring probe: backticked `at` is "found" inside `status`/`batches`. False-positive set: `iPhone`, `macOS`, `iOS`, `eBay`, `SELF_REVIEWED` (skill vocabulary absent from STOP), `ASCII`, `HTTPS` all WARN as fabrication signatures.
**Root cause**: Two independently written citation regexes; per-line scope with no look-back to the element the citation belongs to; `String.includes` instead of token-boundary matching; STOP list built from a subset of the skill's vocabulary.
**Suggested fix**: Share one citation grammar (export `FILE_LINE` from check-delivery or vice versa) and emit WARN for any C3-shaped citation the resolver cannot parse; when the citing line has no identifiers, take them from the previous non-blank line / same list item / same table row; match identifiers with `\b` boundaries; add `SELF_REVIEWED`, `RENDER_VERIFIED_STRUCTURAL`, common brand camelCase to STOP; normalise `\` to `/`. Fixtures for each.

### F6: The new stateDiagram pitfall "flowchart edge syntax is a parse error (probed)" is false on both renderer versions and hides a worse failure [MEDIUM] [OPEN]

**Location**: `skills/bs-uml-master/references/syntax-pitfalls.md` line 45 ("`A -->|label| B` … in `stateDiagram-v2` it is a parse error (probed)") and line 46 ("Box-drawing/check-mark glyphs (`━`, `✓`) inside transition labels are lexical hazards on 10.x"); `docs/reviews/bs-uml-master/2026-09-02-haiku-usage-review-4.md` trajectory row v7 ("d3 FAIL (`|label|`)").
**Exploit scenario**: `check-mermaid.js` on `A -->|go| B`, `A --> |go| B`, and the sample's own quoted form `Skill -->|"belongs to"| Batch`: `OK` on mermaid 11.17.2 and `OK: parsed` on 10.6.1. `mmdc` render shows why: the SVG contains `id="my-svg-state-|go|-1"` — the label becomes a phantom state between A and B. So the verifier PASSes it, the pitfalls module tells the agent the tool would have caught it, and the reader gets a state machine with an invented state. `━` and `✓` in a transition label also parse OK on 10.6.1 and 11.17.2. The other two new claims hold: the second colon FAILs on 10.6.1 (`Parse error on line 3`) and passes on 11.17.2; note text on the opener line is a `Lexical error` on both. `<br/>` in a transition label parses on 10.6.1, so "first thing to remove" is at best untested advice.
**Root cause**: Pitfalls were written from the retrospective's diagnosis rather than re-probed per claim before being labelled "(probed)"; the era-preamble added in the same commit asks the agent to distrust remembered claims while the module ships one.
**Suggested fix**: Rewrite the bullet: "`-->|label|` is accepted by both 10.x and 11.x and silently creates a state named `|label|` — the parser will not save you; grep your state diagrams for `|`". Drop or re-probe the glyph and `<br/>` sentences. Re-check v7 d3's actual failing line and correct the trajectory table. Consider a `check-mermaid` post-parse lint that FAILs on state ids containing `|`.

### F7: A delivery with zero extractable sources still prints a VERDICT: PASS receipt [LOW] [OPEN]

**Location**: `skills/bs-uml-master/scripts/verify-delivery.js` lines 207–210 (verdict printed before the `sources.length === 0` FAIL line).
**Exploit scenario**: Probe p8/ext.md: a fenceless delivery referencing `diagrams/model.mmd` (legal for check-delivery, which WARNs). Output: `diagrams: 0`, `check-delivery: … 0 FAIL`, `VERDICT: PASS — paste this receipt into the delivery`, blank line, then `FAIL no diagram sources found`; exit 1. An agent following "paste the receipt" copies a PASS block for a delivery in which nothing was verified. Exit code and trailing FAIL line keep this LOW.
**Root cause**: The zero-source check runs after the verdict is composed.
**Suggested fix**: Set `anyFail = true` and push the "no diagram sources" line into `lines` before composing the verdict; for external-file deliveries, resolve the referenced `.mmd`/`.puml` relative to the delivery and verify it.

### F8: One receipt for a multi-diagram delivery satisfies C8 for the last block only [LOW] [OPEN]

**Location**: SKILL.md Minimum Compliant Path step 6 ("paste the receipt into the delivery verbatim"); Output Contract "For multi-diagram deliveries, repeat per diagram"; `check-delivery.js` per-block C8 windows.
**Exploit scenario**: Probe p8/multi.md: two `## Diagram Delivery` blocks, the verifier's single receipt appended at the end. check-delivery: `FAIL D1 RENDER_VERIFIED without a check-render-fit receipt`, `PASS D2 …`. The instruction and the checker disagree on where the receipt lives, so an honest agent gets a false FAIL (or, splitting the receipt by hand, an edited receipt).
**Root cause**: The receipt is emitted as one block keyed `d1..dN` while C8 is scoped per contract block.
**Suggested fix**: Either emit one receipt stanza per diagram with the block title, and say "paste each `dN` stanza under its block", or teach C8 to accept a delivery-level receipt section that names every block.

### F9: HTML table cells are concatenated in the mirror, false-FAILing table-formatted ledgers [LOW] [OPEN]

**Location**: `skills/bs-uml-master/scripts/verify-delivery.js` line 79 (newline list `p|div|li|tr|h[1-6]` lacks `td`/`th`).
**Exploit scenario**: Probe p8/tbl: `td Batch.batch_id /td td src/batch.js:2 /td` mirrors to `Batch.batch_idsrc/batch.js:2`; check-evidence: `FAIL … Batch.batch_idsrc/batch.js:2 — cited path does not exist`. A table is the natural ledger form on an HTML page (sample #4's v12 was tables); an unfixable false FAIL is exactly the friction that made sample #4 skip the tools.
**Root cause**: Tag stripping without cell separators.
**Suggested fix**: Convert `</td>`/`</th>` to ` | ` and `</tr>` to newline; fixture with a two-column evidence table.

### F10: Unhandled exception and silent defaults on malformed flags [LOW] [OPEN]

**Location**: `skills/bs-uml-master/scripts/verify-delivery.js` line 127 (`flag`), line 134 (`fs.mkdirSync(out)` unguarded).
**Exploit scenario**: `--out` pointing at an existing file → uncaught `Error: EEXIST … mkdirSync`, Node stack trace, exit 1 with no receipt. `--medium` as the last argument → silently `pc`. `--out ../../anything` writes `mirror.md`, `dN.mmd`, `dN.svg` and an npm install tree wherever it points. Other odd inputs (empty file, binary, directory, HTML without a closing h2) fail cleanly.
**Root cause**: No try/catch around output-dir creation; positional flag parser accepts absence as default.
**Suggested fix**: Wrap `mkdirSync` and return 2 with a message; treat a flag with no value as a usage error; document that `--out` is a work directory the tool will populate.

### F11: The hash stamp is described as anti-forgery but nothing checks it, and stale receipts go unnoticed [LOW] [OPEN]

**Location**: `skills/bs-uml-master/scripts/verify-delivery.js` lines 26–27 ("stamped with a content hash so a typed imitation is one more lie to tell"), line 204; `references/rendering-validation.md` "hash-stamped receipt"; SKILL.md step 6 "Re-run after every revision".
**Exploit scenario**: Probe p6/d3: after pasting a PASS receipt (`6cf7929e4e1e`), the diagram was edited (two nodes added); re-running the verifier produced a new id and PASS with no mention that the pasted receipt no longer matches its content. No tool, including check-delivery, recomputes or even parses the 12-hex id, so a typed `## verify-delivery receipt 0123456789ab` is indistinguishable from a real one. The claim is soft ("one more lie"), so this is LOW, but the doc phrase "hash-stamped" invites readers to assume verifiability.
**Root cause**: Hash is emitted, never consumed; the timestamp is outside the hash so a re-verification could in principle match, but no code path does it.
**Suggested fix**: On each run, find existing `## verify-delivery receipt <id>` lines in the input, recompute the id over the current sources, and print `stale receipt <id> present (content changed) — remove it` as a FAIL; optionally add `--check-receipt`.

### F12: Two pre-delivery entry points remain in SKILL.md after R7 declared one [LOW] [OPEN]

**Location**: SKILL.md line 159 (Phase 5: "run `scripts/check-delivery.js` on the draft, fix every FAIL, then deliver"), line 183 (Output Contract: "Verify mechanically before handing over: `node <skill-dir>/scripts/check-delivery.js <draft.md>`"), red-flag row line 41 (`check-delivery.js rejects receipt-less claims`), versus step 6 and the Bundled Resources row calling `verify-delivery.js` "the single entry point of the Minimum Compliant Path".
**Exploit scenario**: An agent reading Phase 5 (the workflow it is executing) runs `check-delivery.js` only — no parse on the pin, no render, no fit check, no citation check — and satisfies the letter of Phase 5 and the Output Contract. F1 shows this path certifying a fit-FAIL delivery. The R7 retrospective's own lesson ("a validator reached through prose is prose") argues the weaker command should not remain the named command in the workflow section.
**Root cause**: R7 updated the Minimum Compliant Path and the HTML paragraph but not Phase 5 or the Output Contract paragraph.
**Suggested fix**: Replace both mentions with `verify-delivery.js` and describe `check-delivery.js` as a component it runs; keep the red-flag row but name the verifier.

## Verdict

**Verdict**: REQUIRES_CHANGES

R7's design is the right one — one command, any input, tool-emitted receipt — and the pipeline works on the happy path (probe p6: render, fit, C8 round trip all correct; the second-colon and note-line pitfalls reproduce exactly as documented on both renderer versions; all four self-test suites and Gate 1 pass). But three of the four HTML-first probes produced a false PASS: unquoted or single-quoted mermaid containers vanish from the verifier while still rendering for the reader (F2, end-to-end exit 0 with the sample-#4 blank-page diagram on board), a fit FAIL receipt certifies itself through C8 (F1), and a medium typo prints PASS around a FAIL cell (F3). Those are the same class of failure R7 was written to close, so the round cannot pass; the fixes are each a few lines plus fixtures, and F6's false "probed" claim needs a doc correction before the pitfalls module is trusted again.
