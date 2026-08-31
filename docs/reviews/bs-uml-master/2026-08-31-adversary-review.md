# Adversary Review: bs-uml-master

**Date**: 2026-08-31
**Reviewer Role**: Adversary
**Skill**: bs-uml-master
**HUMAN_VERIFIED**: false
**Scope Contract Version**: 1
**Reviewed Revision**: 16a1ae4179a842b1e2ad0c8e0f4a62aad14ace22
**Reviewed Skill SHA-256**: 2f3322de034c9ee6ca0bb5e1326274b04845f90a04895b79c7c74e1cbe0bc263
**Reviewed Manifest SHA-256**: 9c70b77340b4f981fc26fa80e1777ab6182ccf21a8df5fc449b153379ffeab93

## Summary

Final confirmation pass over checker v3 (R3.2, revision `16a1ae4`), following my R3/R3.1 review that found 6 MEDIUM + 1 LOW. All six MEDIUM findings are verified fixed — each re-attacked with my own original fixtures against the v3 checker (every prior exploit now fails or counts correctly), the in-repo self-test (`test-check-delivery.js`, 14 fixtures) passes, and the SKILL.md overclaims are corrected to match actual checker behavior. Fresh attack probes on the v3 logic found four residuals — 1 MEDIUM (multiplicity-styled edges-only class diagrams still count ~0, re-opening the ceiling bypass in exactly the notation style uml-semantics.md mandates for domain models) and 3 LOW — none of which contradicts a claim the skill now makes, since element counting is explicitly declared heuristic and the self-attestation ceiling is honestly documented as open (IP-9). Nothing gating remains.

## Evidence Reviewed

Full manifest receipt acknowledged: `9c70b77340b4f981fc26fa80e1777ab6182ccf21a8df5fc449b153379ffeab93`. All 18 manifest entries recomputed with `sha256sum` and confirmed against the prompt manifest and working tree; `git rev-parse HEAD` = `16a1ae4179a842b1e2ad0c8e0f4a62aad14ace22`, matching the recorded revision. Unchanged files (all references, `check-mermaid.js`, `skills.json`, evaluation and tools files) hash-identical to prior passes and carried.

Examined:

- `git diff fe42ad1..16a1ae4 -- skills/bs-uml-master/ docs/reviews/bs-uml-master/improvement-points.md` — the R3.2 diff read line-by-line: `check-delivery.js` v3 (rewritten, read in full: tool-shaped `TOOL_VERSION`, `FILE_LINE` path.ext adjacency, sketch relaxation of C1/C3/C4 to WARN, fence selection by language/header, trailing-space frontmatter tolerance, tag-laundering FAIL, PlantUML declarations/relations counting + per-type content markers, relation-line counting for classDiagram, noise stripping for flowcharts, heuristic `~N` marking); new `test-check-delivery.js` (112 lines); SKILL.md wording fixes (MCP step 6 sketch clause + resolve-warnings clause; Output Contract paragraph now states WARN tiers and declares counting heuristic — "never a license to trust it over your own count"); ledger entries IP-11/IP-12.

Commands actually run (Node 22.22.2; fixtures under the session scratchpad, `cd/fx*.md`):

- `sha256sum` over all 18 manifest entries + `git rev-parse HEAD` — all match.
- `node scripts/test-check-delivery.js` → 14/14 fixtures, ALL PASS, exit 0 (the deliberate no-contract fixture correctly exercises the exit-1 path).
- Re-ran my full prior attack suite against v3 — every exploit closed: (fx4) "checked 3.2 boxes" → C2 FAIL; (fx8) "at 14:32" under MODEL-FROM-CODE → C3 FAIL; (fx5) 12-relation edges-only classDiagram → counted ~21 → ceiling FAIL; (fx6) paren-label flowchart → ~4 (correct, no inflation); (fx9) receipts-block-first honest delivery → 0 FAIL (fence found by language); (fx11) 17-component PlantUML → counted ~17 → ceiling FAIL; (fxD) `graph TB` in a ```plantuml fence → FAIL "tag laundering"; (fxA/fxB2) frontmatter, including trailing-space close → correct C5 FAIL for the right reason; (fx2/fx3) Haiku replica and bare label → still FAIL; (fx1) honest delivery → still 0 FAIL.
- New v3 probes: (fxS) compressed sketch — heading + fence + receipt-bearing State line saying "sketch level" → exit 0 with C1/C3/C4 as WARNs (F2 resolution confirmed; a heading-less compressed sketch still exits 1, acceptable since the heading is the block anchor); (fxM) 18-class edges-only classDiagram with multiplicities (`A "1" --> "0..*" B` × 9) → counted **~0**, exit 0 (see F8); (fxV) `RENDER_VERIFIED — version 3.2 of my careful process` → C2 **PASS** (see F9); (fxDecoy) small legend fence before a 17-class real fence → C5/C6 run on the decoy, exit 0 (see F10); (fx7) fenceless "external file" delivery → still passes C5/C6 with a PASS-note (see F11).

## Findings

Fix verification of the six prior MEDIUMs, then the residuals found attacking v3.

**F1 (counter blind spots + SKILL.md overclaim) — FIXED.** Edges-only classDiagrams are now counted via relation-line ids (my fx5 fixture: 0 → ~21, ceiling FAIL); flowchart noise-stripping kills the label-word inflation (fx6: 7 → ~4); SKILL.md now states the real tiers (">15 without USER-OVERRIDE" fails, "10–15 without justification draws a warning you must still resolve") and declares the counter heuristic. Residual precision gap in F8 below.

**F2 (sketch form jointly unsatisfiable with the recipe) — FIXED.** v3 detects sketch via the Significance field or "sketch level" in the block and relaxes C1/C3/C4 to WARN; the State line stays mandatory (self-test fixture "sketch-still-needs-state" covers it). MCP step 6 now reads "(sketch: the compressed form)" and adds "resolve warnings or state why they stand". My compressed-sketch fixture passes with warnings only.

**F3 (PlantUML escaped C5/C6) — FIXED.** PlantUML sources are now counted (declarations + bracket components + relation ids: my 17-component fixture FAILs the ceiling) and type-checked via per-type content markers (self-test "plantuml-type-mismatch" covers the negative case). The markers are deliberately coarse (`->` satisfies the sequence marker, any `[x]` the component marker) — acceptable for a floor and documented as such in the code.

**F4 (prose satisfied receipt/citation regexes) — FIXED.** `TOOL_VERSION` now requires a tool-shaped token adjacent to the version; `FILE_LINE` requires path.ext adjacency. Both of my original bypass fixtures ("checked 3.2 boxes carefully", "inspected at 14:32") now FAIL. Residual token-list edge in F9 below.

**F5 (R3.1 guard enabled fence-tag laundering) — FIXED.** A `plantuml`-tagged fence whose body lacks `@start…` now FAILs explicitly as tag laundering; my exact fxD exploit is closed and encoded in the self-test.

**F6 (first-fence targeting; frontmatter trailing-space; fenceless skip) — FIXED in two of three parts.** Fence selection now prefers language-tagged then diagram-headed fences: my receipts-first honest delivery passes, and the trailing-space frontmatter close (which mermaid 11.17.2 accepts — probed last round) is tolerated by the relaxed strip regex. The third part — fenceless deliveries silently skipping C5/C6 with PASS semantics — was not adopted and remains open (F11).

### F8: Multiplicity-styled edges-only class diagrams still count ~0 — the ceiling bypass survives in the skill's own recommended notation  [MEDIUM]

**Location**: `scripts/check-delivery.js` — `stripNoise()` (quoted strings blanked to `""`) + the classDiagram relation regex `^\s*([\w~]+)\s*(?:<\|--|…)\s*([\w~]+)`, which cannot cross a blanked multiplicity token.
**Exploit scenario**: Probed: an 18-class classDiagram written entirely as `A "1" --> "0..*" B` relation lines — no `class` declarations — counts **~0** and passes with 0 FAILs. This is not an exotic style: `uml-semantics.md` mandates "multiplicities on both ends of structural relationships in domain models", so the checker's counting hole is widest precisely for by-the-book domain models. The F1 fix (relation-id counting) is thereby bypassed for any diagram whose relations carry multiplicities — a mural-shipping agent needs no intent, just compliance with the semantics module. Mitigations that keep this non-gating: SKILL.md now declares counting heuristic and forbids trusting the counter over your own count, and Rule 4/Phase 5 still bind in prose.
**Root cause**: `stripNoise` was added to stop label-word inflation (my fx6) but the relation matcher was not taught to step over the blanked `""` tokens it now produces.
**Suggested fix**: Allow optional quoted multiplicities in the relation regex — `^\s*([\w~]+)\s*(?:""\s*)?(?:<\|--|<\|\.\.|\*--|o--|-->|\.\.>|--|\.\.)\s*(?:""\s*)?([\w~]+)` (post-stripNoise form) — and add a multiplicity fixture to the self-test.

### F9: The `version` token in TOOL_VERSION re-admits prose-shaped receipts  [LOW]

**Location**: `scripts/check-delivery.js` `TOOL_VERSION` — the bare `|version` alternative in the tool-token list.
**Exploit scenario**: Probed: `**State:** RENDER_VERIFIED — version 3.2 of my careful process` passes C2. The fix's own goal ("'checked 3.2 boxes' must not pass") is dodged by another everyday phrase, since "version" is itself prose. Below fabrication-floor severity (a fabricator can just type "mmdc 11.2.0"), but it weakens the format gate against the *accidental* vagueness the gate targets.
**Root cause**: "version" was whitelisted to accept honest forms like "mermaid version 10.6.1", but it matches without any tool name present.
**Suggested fix**: Require a word before "version" that is not a label/filler (or simply drop `version` — honest receipts virtually always name the tool, which the list already matches).

### F10: Fence selection can be decoyed — first matching fence wins  [LOW]

**Location**: `scripts/check-delivery.js` `fence()` — `all.find(...)` returns the first language-tagged fence.
**Exploit scenario**: Probed: a block with a 1-class "legend" mermaid fence before a 17-class real mermaid fence gets C5/C6 run on the legend — exit 0. This requires deliberate structuring (a lazy agent doesn't produce decoys), so it is a gaming vector above the format floor rather than an accidental pass-through; the honest multi-diagram form (one fence per `## Diagram Delivery` block) is unaffected.
**Root cause**: One-fence-per-block assumption; no aggregation over multiple diagram fences.
**Suggested fix**: When a block contains multiple mermaid/plantuml fences, check C5 against each and count C6 on the max (or emit a WARN naming the extra fences).

### F11: Fenceless deliveries still skip C5/C6 with PASS semantics (carried from F6c)  [LOW]

**Location**: `scripts/check-delivery.js` `typeMatchesHeader()` no-fence branch (PASS + "external file delivery?" note); `countPrimary` skip when `fence()` returns null (no WARN emitted, unlike the uncountable-header case which does warn).
**Exploit scenario**: Probed on v3: a delivery whose only "source" is "rendered file path: docs/diagram.svg (source in docs/diagram.mmd, 40 classes)" passes everything. The Output Contract requires the source block, so this delivery already violates prose — but the checker blesses it, and it remains a one-line dodge of both structural checks. My R3-round suggestion (WARN, not PASS-with-note) was not adopted this round.
**Root cause**: Skip-on-absence with PASS semantics.
**Suggested fix**: Emit WARN when no fence is found in a non-sketch block ("no fenced source — C5/C6 unchecked; contract requires the source block"), keeping PASS only when the Backend is SVG/file-based by declaration.

### F12: Receipts remain self-attested — floor, not ceiling (carried; IP-9 open)  [LOW]

**Location**: Design-level; now also stated in the checker's own header comment ("This checker binds format, not truth: receipts can still be fabricated") and ledger IP-9.
**Exploit scenario**: Unchanged from my prior rounds: `RENDER_VERIFIED — mmdc 11.12.0, rendered and inspected` can be typed without running anything. R3.2 improves honesty (the limitation is now documented inside the tool itself), and the forward-test shows the floor holding on the weak-model class; Phase 2.A generate/verify separation remains the designed ceiling.
**Root cause**: A text checker cannot verify events it did not observe.
**Suggested fix**: None this round; keep IP-9 open until Phase 2.A.

## Verdict

**Verdict**: APPROVED

All six MEDIUM findings from my R3-round review are verified fixed at revision `16a1ae4` — not by reading the diff but by re-running my own original exploit fixtures against the v3 checker (every one now fails or counts correctly) and by the new in-repo self-test, which encodes the full failure-vector history (14/14 passing) so the fixes cannot silently regress the way IP-10 did. The SKILL.md prose now matches the checker's actual behavior (WARN vs reject tiers, heuristic counting, sketch-aware), closing the overclaim pattern that recurred across rounds. The four residuals are real but non-gating: F8 is a precision gap in a layer the skill now explicitly declares heuristic and subordinate to the agent's own count, F9–F11 are narrow format-floor edges requiring either deliberate gaming or already-contract-violating shapes, and F12 is the honestly-documented, ledger-tracked ceiling that Phase 2.A owns. For the first time across my three review rounds, no claim the skill makes about its own tooling failed an empirical probe. Fix F8 (one regex + one fixture) in the next touch; none of the residuals warrants blocking Gate 2.
