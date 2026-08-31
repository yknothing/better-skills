# Gate 2 Response — bs-uml-master fix disposition

- **Date:** 2026-08-27
- **Input:** first-round adversary findings (preliminary free-form round, run before the manifest-bound reviews; the adversary executed probes against mermaid 11.17.2 rather than reviewing text only) and advocate residual concerns.
- **Output:** every finding dispositioned below; fixes applied before the manifest-bound final reviews were generated, so the recorded reviews bind to the fixed content.

## Must-fix findings — all FIXED

| # | Finding | Disposition |
|---|---|---|
| F1 | Rule 4 "hard ceiling" contradicted Test Prompt 3's user-insistence path | FIXED — Rule 4 now states the override policy: ceiling binds skill-initiated choices; explicit user instruction may exceed it as a recorded `USER-OVERRIDE` with stated readability cost. diagram-selection.md budget section mirrors it |
| F2 | "5-line `mermaid.parse()` script" claim false in plain Node (`DOMPurify.addHook` crash — reproduced) | FIXED — claim replaced by a shipped, tested `scripts/check-mermaid.js` (jsdom shim, cwd-aware module resolution; verified: valid source → exit 0, invalid → exit 1 with line info) |
| F3 | "use case only as a late beta" in Mermaid — nonexistent type (probe: rejected on 11.17) | FIXED — pitfalls now state Mermaid has no use case diagram in current releases; route to PlantUML |
| F4 | "Comma generics break" — did not reproduce on 11.17.2; instruction induced parser-driven model bending | FIXED — claim version-scoped with a probe-first instruction; pre-emptive model mangling named as the anti-pattern it is |
| F5 | Degradation rung 3/4 self-certifiable ("tooling probably unavailable") | FIXED — landing on rung 3/4 now requires verbatim failed-command receipts; Rule 6 echoes it |
| F6 | "Only RENDER_VERIFIED clears the delivery gate" contradicted the ladder's deliver-weaker-label instruction | FIXED — gate restated as label-evidence match, never withholding; RENDER_VERIFIED required only when rung ≤2 succeeds |
| F8 | "Never downgrade yourself" read as forbidding legitimate sketch inference | FIXED — sketch bullet now distinguishes classification (allowed, stated) from downgrading (depth/label mismatch) |

## Recommended findings — dispositions

| # | Finding | Disposition |
|---|---|---|
| F7 | Question gate satisfiable by boilerplate | FIXED — Phase 0 adds the falsifiability test (a valid question excludes something; Excluded line must be non-empty or justified) |
| F9 | EXPLAIN/REVIEW mode had no workflow | FIXED — Phase 0 note: skips Phases 1/3/4, semantics+probes as checklist, findings output, no delivery-state label |
| F10 | Flowchart-specific traps filed under "all types" | FIXED — annotated as flowchart-specific |
| F11 | State-machine overclaims (initial pseudostate "exactly one"; triggerless transitions "usually a bug") | FIXED — "at most one per region"; triggerless normal from pseudostates/do-activity states |
| F12 | `RENDER_VERIFIED` claimable from raw-SVG grep | FIXED — `RENDER_VERIFIED (structural)` variant introduced with concrete structural assertions; unqualified label requires visual inspection |
| F13 | Renderer version skew unaddressed | FIXED — state line must name tool + version; drift warning added |
| F14 | Empty `scripts/` directory | FIXED — now holds the working `check-mermaid.js` (also closes advocate residual concern 1) |
| F15 | Evidence field only defined for MODEL-FROM-CODE; budget counts only boxes | FIXED — contract evidence shapes for DESIGN/REVISE added; member/edge load guidance added to the budget |

## Advocate residual concerns

1. Empty scripts/ — closed (F14). 2. No forward-test evidence — closed: 3/3 EXECUTED runs recorded in `2026-08-27-forward-test.md` (this exceeds the schema-only Gate 4 scope; still AI-executed, awaiting `HUMAN_VERIFIED`). 3. Tier comment normalization — deferred to Phase 1.B by design. 4. Sketch relief valve ambiguity — closed (F8). 5. Citation one-hop gap — accepted; citations live in `docs/research/uml-diagramming-analysis.md` per repo convention (URL backfill is Phase 3). 6. Kroki consent wording — the reference already requires user consent before sending source externally; wording kept ("never send… without the user's consent").

## Verdict carried forward (round 1)

First-round adversary verdict: PASS_WITH_FIXES → all seven gating fixes applied and re-validated (Gate 1 16/16; pattern alignment 8/8 declared+in-body).

## Round 2 (revision R2: projection backends + layout-as-semantics)

A fresh, independent adversary (no prior involvement) reviewed the R2 content at revision e7bfa08 with an empirical-probe mandate (37 tool calls; probes against mermaid 11.17.2, plantuml.jar with and without Graphviz, unicodedata width classes). Verdict: REQUIRES_CHANGES with 8 findings — all fixed in revision 30ae1d8:

| # | Finding (probed) | Disposition |
|---|---|---|
| F1 HIGH | PlantUML exits 0 without Graphviz and writes an error-placard SVG for dot-dependent types; reference scoped the dot dependency backwards; smetana unmentioned | FIXED — never trust exit code alone; correct type scoping; `!pragma layout smetana` documented |
| F2 MED | "`;` in message text tolerated on 11.17+" refuted by probe | FIXED — `;` still breaks, escape `#59;`; only `end`-in-text is tolerated |
| F3 MED | "chat-only consumption" sketch cue swallowed default-to-deliverable | FIXED — medium alone never reclassifies; explicit user cue required |
| F4 MED | SVG escalation could lower the evidence ceiling; no rasterize recipe | FIXED — escalation forbidden where verification cannot run; rasterize-to-inspect recipe added |
| F5 MED | Recommended box-drawing chars are East-Asian-Ambiguous width (breaks CJK terminals); monospace-viewing upgrade unfalsifiable | FIXED — pure ASCII default with EAW warning; viewing step requires a named display act |
| F6 LOW | Budget-justification threshold drift (9 vs 15) | FIXED — aligned to justify-above-9 everywhere |
| F7 LOW | `A --- oB` (spaced) does not reproduce; spaceless does | FIXED — accurate reproduction documented |
| F8 LOW | GitHub silently ignores the ELK directive; local RENDER_VERIFIED could certify unseen geometry | FIXED — rubric must run on the geometry the reader's renderer produces |

Final manifest-bound reviews (advocate + adversary) were then produced against revision 30ae1d8; see the review files and `2026-08-27-final-audit.md` for the closing verdicts.

## Round 3 (revision R3/R3.1/R3.2: cross-model robustness, 2026-08-31)

Driven by the first external usage sample (Haiku 4.5 compliance theater — `2026-08-31-haiku-usage-review.md`). The enforcement tool itself became the review target, and the loop ran three tightening turns:

1. **R3** (ccd86f0): check-delivery.js v1 + Minimum Compliant Path + identifiers-are-quotations; fixture-tested against the observed failure profile (4/4 caught).
2. **R3.1** (fe42ad1): the weak-model acceptance rerun (Haiku 4.5, same task) **passed** — compliance theater not reproduced — and exposed IP-10 (YAML frontmatter blinded C5/C6); fixed same-day.
3. **R3.2** (16a1ae4): the adversary attacked the checker with 14 delivery fixtures → 6 MEDIUM precision holes (IP-11: edges-only counting, PlantUML escape, prose-mimic receipts, tag laundering introduced by R3.1's own guard, fence targeting, sketch/recipe joint unsatisfiability) → all fixed, and the fixtures became the in-repo self-test `scripts/test-check-delivery.js` (IP-12, closing the advocate's One Improvement).

Closing verdicts at 16a1ae4: adversary **APPROVED** (its own exploit fixtures re-run against v3 — every one now caught; 4 honest residuals recorded, 1 MEDIUM non-gating: IP-13); advocate rebind in the review file. The checker's header now states its own limits: it binds format, not truth — floor, not ceiling (IP-9 open for Phase 2.A).
