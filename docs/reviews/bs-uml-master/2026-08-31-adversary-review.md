# Adversary Review: bs-uml-master

**Date**: 2026-08-31
**Reviewer Role**: Adversary
**Skill**: bs-uml-master
**HUMAN_VERIFIED**: false
**Scope Contract Version**: 1
**Reviewed Revision**: fe42ad1da77b6e6a0fe1772ca224340dcbd07022
**Reviewed Skill SHA-256**: 6a23545e4f1752636f935fdb6be1e92a4b2e6f11fc15d24e4b93f38ba9981084
**Reviewed Manifest SHA-256**: 8060c5dee0d1c7fc53c78e3270c4511d204d2af2b74483c33dc4df5e4759138c

## Summary

Adversary pass over the R3/R3.1 anti-compliance-theater hardening, attacked empirically with 14 crafted delivery fixtures run through `scripts/check-delivery.js` at its fixed (fe42ad1) version. The checker genuinely catches the headline Haiku failures (bare `RENDER_VERIFIED` labels; "class diagram" delivered as `graph TB`, including behind Mermaid YAML frontmatter after the R3.1 fix), my R2 finding F9 is verified fixed, and the R3.1 frontmatter fix is verified effective on its motivating case. Seven findings: 6 MEDIUM, 1 LOW — one of them (the fence language-tag bypass of the fake-notation check) newly introduced by the R3.1 guard itself. Worst-case impact: the checker's coverage is materially narrower than SKILL.md advertises (PlantUML sources escape the type and budget checks; edges-only class diagrams count 0 elements; incidental prose satisfies the receipt and citation regexes), a skill-legal compressed sketch delivery hard-fails the mandatory checker, and honest deliveries leading with a receipts code block are falsely failed.

## Evidence Reviewed

Full manifest receipt acknowledged: `8060c5dee0d1c7fc53c78e3270c4511d204d2af2b74483c33dc4df5e4759138c`. All 17 manifest entries recomputed with `sha256sum` and confirmed against the prompt manifest and working tree (`check-delivery.js` = `4b40250e…3d4aedb`, the fe42ad1 fixed version); recorded revision `fe42ad1da77b6e6a0fe1772ca224340dcbd07022` confirmed as the content revision (HEAD `349604c` only rebinds the regenerated prompt files; `git log fe42ad1..HEAD` shows no skill-content change). Unchanged-since-R2 files (all references except `rendering-validation.md`, plus `check-mermaid.js`, `skills.json`, evaluation and tools files) carried from my prior full-read passes; hash-verified identical.

Examined:

- `git diff 30ae1d8..ccd86f0 -- skills/bs-uml-master/` — the R3 diff read line-by-line: Rule 2 identifiers-are-quotations, 2 new red-flag rows, Minimum Compliant Path, Phase 5 checker wiring, Output Contract enforcement paragraph, renderer-pin skew rule, dot-list completion; `check-delivery.js` read in full.
- `git diff ccd86f0..fe42ad1 -- skills/bs-uml-master/scripts/check-delivery.js` — the R3.1 fix: frontmatter strip before header detection, PlantUML-source guard, `component|c4` claim mapping.
- Context: `docs/reviews/bs-uml-master/2026-08-31-haiku-usage-review.md`, `2026-08-31-forward-test-r3.md`, `improvement-points.md` (IP-1..IP-10), `docs/reviews/_improvement-points-schema.md`.

Commands actually run (Node 22.22.2; mermaid 11.17.2 for the parser cross-check; fixtures under the session scratchpad, `cd/fx*.md`, all re-run against the fe42ad1 checker):

- `sha256sum` over all 17 manifest entries + `git rev-parse` — all match as described above.
- `node scripts/check-delivery.js` against: (fx1) honest complete class delivery → 0 FAIL; (fx2) Haiku replica — declared "Class Diagram", `graph TB` → C5 FAIL; (fxA) same fake behind Mermaid YAML frontmatter (`---\nconfig:…---`) → C5 FAIL (**R3.1 fix verified effective** — I had not probed frontmatter before the fix; the hole was found by the Haiku acceptance run, not independently by me); (fx3) bare `RENDER_VERIFIED` → C2 FAIL; (fx4) `RENDER_VERIFIED — checked 3.2 boxes carefully` → C2 **PASS**; (fx5) 12-class classDiagram declared edges-only → "element count 0", 0 FAIL; (fx6) 4-node flowchart with parenthesized edge-label words → counted 7; (fx7) no fenced source, file-path delivery → C5/C6 skipped, 0 FAIL; (fx8) MODEL-FROM-CODE, zero citations, "inspected at 14:32" → C3 **PASS**; (fx9) honest delivery with a ```bash receipts block before the mermaid fence → C5 **false FAIL** against the bash line; (fx10) skill-legal compressed sketch delivery → hard FAIL "contract was not used at all"; (fx11) 17-component PlantUML delivery → 0 FAIL (C5 now explicitly notes "PlantUML source — Mermaid header mapping not applicable"; C6 still uncounted); (fxC) declared "component @ L3" with a mismatched Mermaid header → C5 FAIL (the new `component|c4` mapping works); (fxD) declared "Class Diagram", `graph TB` source, **fence tagged ```plantuml** → C5 skipped via the new guard, 0 FAIL (new bypass); (fxB2) frontmatter closed with `--- ` (trailing space) → checker false-FAILs with header `---`, while `mermaid.parse` (11.17.2) **accepts** that source.
- R2-finding F9 fix verified in the R3 diff: dot-dependent list now "class, component, use case, object, state, deployment" — matching my R2 placard probes exactly.

## Findings

### F1: The budget counter (C6) is blind to idiomatic sources and miscounts labels — and SKILL.md overclaims what it rejects  [MEDIUM]

**Location**: `scripts/check-delivery.js` `countPrimary()`; SKILL.md Output Contract paragraph ("it rejects … unjustified budget overruns") and Bundled Resources row.
**Exploit scenario**: Three probed failures, all re-verified on the fe42ad1 version. (a) A classDiagram that introduces classes only via edges — idiomatic Mermaid, no `class X` lines — counts **0** primary elements: my 12-class fixture passed as "element count 0 within budget discipline", so the everything-diagram the budget exists to stop walks through when written the most natural way (same hole for sequence diagrams with undeclared participants). (b) The flowchart regex counts any word followed by `(`/`[`/`{` anywhere in the body: a 4-node fixture with `-->|"routes (async) calls (HTTP)…"|` labels counted 7 — false inflation that will falsely WARN/FAIL honest dense-labeled diagrams. (c) Even where counting works, >9 without justification is a **WARN** (exit 0), yet SKILL.md tells agents the script "rejects … unjustified budget overruns" — a 14-element unjustified diagram (the Haiku D1 case, IP-5's motivating example) exits 0.
**Root cause**: Declaration-only counting for a language where elements are introduced by reference; an unanchored id-before-bracket regex; prose written from the checker's intent rather than its behavior.
**Suggested fix**: For classDiagram/sequenceDiagram, union declared names with names appearing on relationship/message lines. Restrict the flowchart regex to line-start/post-arrow positions and strip quoted label text first. Either make >9-unjustified a FAIL at `deliverable`+ or soften the SKILL.md sentence to "flags" for the warn tier.

### F2: A skill-legal compressed sketch delivery cannot pass the mandatory checker  [MEDIUM]

**Location**: SKILL.md — Significance (`sketch` "may shrink to source + one-line state") and Output Contract compression clause vs the adjacent enforcement paragraph ("an unfilled or missing field is a format-invalid delivery") and Minimum Compliant Path ("no step here may be skipped at any capability level" + step 6 "fix every FAIL before delivering"); `check-delivery.js` `splitDeliveries()`/C1–C4.
**Exploit scenario**: Probed: a compressed sketch delivery exactly as licensed (fenced source + receipt-bearing State line) exits 1 — "no '## Diagram Delivery' block found"; with the heading added it still FAILs C1/C3/C4. The MCP forbids skipping step 6 and step 6 forbids delivering with FAILs, so for sketches the skill's texts are jointly unsatisfiable. An agent resolves this by un-compressing every sketch (killing the lightweight path), skipping the checker for sketches (violating "no step may be skipped"), or — corrosively — learning that "the checker FAILs legitimate deliveries, so FAILs are advisory". Same absolutism mismatch, milder: MCP step 5 "look at the image" is unsatisfiable for the text backend, and the MCP has no carve-out for EXPLAIN/REVIEW mode, which produces no delivery.
**Root cause**: The checker validates only the full contract shape; the MCP was written without cross-checking the two contract shapes the skill itself defines.
**Suggested fix**: Teach the checker a sketch form (State line containing "sketch": require only fenced source + receipt-bearing State line), or scope MCP step 6 and the enforcement paragraph to `deliverable`+ and name the sketch exception; add "(producing modes; EXPLAIN/REVIEW exits at Phase 0)" and "or verify per the backend's recipe" to the MCP.

### F3: PlantUML sources — five diagram types the skill routes there — escape C5 and C6  [MEDIUM]

**Location**: `check-delivery.js` `typeMatchesHeader()` PlantUML guard and `countPrimary()` (no `@startuml` branch); SKILL.md Rule 8 and Bundled Resources row (unscoped "type-vs-header consistency, element budget").
**Exploit scenario**: Probed on fe42ad1: a 17-component PlantUML delivery — over the hard ceiling, no USER-OVERRIDE — passes with 0 FAILs. R3.1 improved honesty (the skip is now an explicit "PlantUML source — Mermaid header mapping not applicable" note, and `component|c4` claims are now checked for Mermaid sources — my mismatched-Mermaid-header fixture correctly FAILs), but there is still no PlantUML type discrimination or element counting, so the fake-notation and budget floors protect only Mermaid sources while Rule 8 mandates PlantUML for activity, component, deployment, use case, and timing. A budget-dodging agent can *choose* PlantUML to duck C6 while citing Rule 8's own routing.
**Root cause**: The checker was built from the Haiku sample (Mermaid-only) and generalized in prose but not in code.
**Suggested fix**: Add a PlantUML branch: peek past `@startuml`/pragmas for type-discriminating tokens (`component`, `usecase`/`actor`, `node`/`artifact`, `state`, `:action;`/`fork`, `participant`/`->`) for C5, and count `^\s*(?:class|component|actor|usecase|node|database|participant|state)\s+` declarations for C6. Until then, scope the SKILL.md description honestly ("type/budget checks cover Mermaid sources").

### F4: The C2 receipt and C3 citation regexes are satisfied by incidental prose  [MEDIUM]

**Location**: `check-delivery.js` `TOOL_VERSION` and the C3 citation regex (the `|:\d+\b` alternative).
**Exploit scenario**: Probed both, re-verified on fe42ad1. (a) `**State:** RENDER_VERIFIED — checked 3.2 boxes carefully` passes C2: any word followed by a dotted number is a "tool+version" (`section 2.3`, `Chrome 120`, `31.8.2026` all qualify) — no plausible tool name needed. (b) In MODEL-FROM-CODE, the file:line requirement is discharged by any colon-digits anywhere in the block: my fixture with zero code citations but "inspected at 14:32" passed "Evidence present with file:line" — timestamps, URL ports, and ratios all clear it, so C3's core purpose (forcing real citations under a CODE claim, IP-4's target) is near-vacuous against exactly the sloppy output it was built for. These are accidental pass-throughs of ordinary prose, not determined-forger scenarios.
**Root cause**: The `|:\d+\b` catch-all swallows the extension-anchored alternative; `TOOL_VERSION` anchors on "any word" rather than a tool-shaped token.
**Suggested fix**: Drop the bare `|:\d+\b` alternative and broaden the extension list (or accept `\S+:\d+` only inside the Evidence field). For C2, require the version to follow a known-tool token (`mmdc|mermaid(-cli)?|plantuml|check-mermaid|node|smetana|rsvg|resvg|chromium|dot`); keep documenting honestly that this remains a format floor.

### F5: The R3.1 PlantUML guard trusts the fence language tag — a one-word bypass of the fake-notation check  [MEDIUM]

**Location**: `check-delivery.js` `typeMatchesHeader()`, the fe42ad1 guard: `if (h.startsWith("@startuml") || f.lang === "plantuml") return { ok: true, … }`.
**Exploit scenario**: Probed: the exact Haiku fake — declared "Class Diagram @ code level", source `graph TB` with pseudo-class boxes — passes C5 with 0 FAILs when the fence is tagged ```plantuml instead of ```mermaid. The `f.lang === "plantuml"` disjunct short-circuits before any header comparison, so mislabeling the fence language (one word, plausibly deniable as a typo) re-opens the headline hole R3 exists to close. The tag is also simply wrong as PlantUML: a `plantuml`-tagged fence not starting with `@startuml` is invalid for every PlantUML renderer, so the guard is accepting a source that neither backend would render as claimed.
**Root cause**: The guard, added to stop false-FAILs on real PlantUML deliveries, keys on the author-controlled language tag instead of the source itself.
**Suggested fix**: Guard on the header only (`h.startsWith("@startuml")`); when `f.lang === "plantuml"` but the body lacks `@startuml`, FAIL ("plantuml-tagged fence without @startuml — mislabeled or invalid source"). One-line change plus a regression fixture.

### F6: `fence()` targets the first fence and fails closed on header oddities — honest deliveries get false FAILs; fenceless deliveries skip silently  [MEDIUM]

**Location**: `check-delivery.js` `fence()` (first-match selection; frontmatter strip regex) and `typeMatchesHeader()`'s no-fence branch.
**Exploit scenario**: Probed on fe42ad1, three shapes. (a) An honest, fully-compliant delivery that includes its verification receipt as a ```bash block before the mermaid fence — the receipts culture the skill demands — FAILs C5 against the bash command line; the shortest path to green is deleting the receipt block, a perverse incentive pointing opposite the revision's goal. (b) Mermaid frontmatter closed with `--- ` (trailing space) — which `mermaid.parse` 11.17.2 **accepts** — defeats the R3.1 strip regex and C5 false-FAILs with header `---` (fail-closed: noisy rather than the pre-fix silent skip, but still a false FAIL on valid Mermaid). (c) A delivery with no fence and only "rendered file path: docs/diagram.svg" passes everything — C5 and C6 skip with a friendly PASS note — so "external file delivery" remains a one-line bypass of both structural checks.
**Root cause**: First-match fence selection; an exact-`---` frontmatter regex against a parser that tolerates trailing whitespace; skip-on-absence with PASS semantics.
**Suggested fix**: Select the diagram fence by language tag (`mermaid`/`plantuml`) or header token, falling back to the last fence; relax the strip regex to `^\s*---[ \t]*\r?\n[\s\S]*?\r?\n---[ \t]*\r?\n`; when no source fence is found in a non-EXPLAIN delivery, emit WARN (not PASS-with-note).

### F7: Receipts remain self-attested — the checker raises the floor, not the ceiling (carried; IP-9 open)  [LOW]

**Location**: Design-level: `check-delivery.js` + SKILL.md red-flag row "check-delivery.js rejects receipt-less claims"; `improvement-points.md` IP-9 (open).
**Exploit scenario**: A determined or self-deceiving agent can still type `RENDER_VERIFIED — mmdc 11.12.0, rendered and inspected` without ever running mmdc; the checker validates the *format* of the claim, not the *event*. This is acknowledged in the ledger (IP-9; Phase 2.A generate/verify separation as the real ceiling) and the red-flag row is honest that "the work itself is yours" — a carried limitation recorded so no one reads "deterministic validator" as fabrication-proof. The R3 acceptance rerun (forward-test-r3) shows the floor working on the target model class; it does not show the ceiling.
**Root cause**: A text checker cannot verify tool executions it did not observe.
**Suggested fix**: None required this round beyond keeping IP-9 open; when Phase 2.A lands, have the verify context re-run the named command and diff the claimed receipt against observed output.

## Verdict

**Verdict**: NEEDS_IMPROVEMENT

The R3 direction is correct and empirically effective against the observed failure class: the Haiku-replica, bare-label, and frontmatter-masked fixtures all fail the checker as intended; the identifiers-are-quotations rule and new red-flag rows name the real fabrication classes; my R2 F9 is verified fixed; the R3.1 frontmatter fix works on its motivating case (found by the acceptance run — credit where due — not by me); and the weak-model rerun record shows the bindingness-ladder thesis holding on the model class that failed before. But the enforcement layer still promises more than it delivers: PlantUML sources escape the type and budget checks entirely, edges-only class diagrams count as zero elements, incidental prose satisfies the receipt and citation regexes, the R3.1 guard itself introduced a one-word fence-tag bypass of the headline fake-notation check, honest receipt-leading deliveries are falsely failed, and one delivery shape the skill licenses (compressed sketch) cannot pass the checker the Minimum Compliant Path makes unskippable. None of this is gating in the REQUIRES_CHANGES sense — the checker only adds a floor above the R2-approved state and prose rules still bind — but the fence-tag bypass (F5) and the sketch contradiction (F2) should land before Gate 4 or any forward test treats check-delivery.js verdicts as load-bearing evidence.
