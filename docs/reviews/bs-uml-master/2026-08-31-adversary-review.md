# Adversary Review: bs-uml-master

**Date**: 2026-08-31
**Reviewer Role**: Adversary
**Skill**: bs-uml-master
**HUMAN_VERIFIED**: false
**Scope Contract Version**: 1
**Reviewed Revision**: 2b947008372bd45adf0ee46f7b43a0692828b9ef
**Reviewed Skill SHA-256**: bf50e9e81270da6cd27140debf9ad4baefdc779e8d79a79fc87acc581b7bf822
**Reviewed Manifest SHA-256**: 67a2fa56dd469f04de2e0b459b0e5eb0b8f377075b5c1755c330e4f977537db1

## Summary

Five findings: 2 HIGH, 2 MEDIUM, 1 LOW, all OPEN, all empirically demonstrated against R4's new surface (`check-render-fit.js` and its wiring). Worst case: the new "mechanical" screen-fit gate emits affirmative false PASS evidence on every real mermaid 11 render (its long-range-edge detector matches zero real edges), certifies a 14-participant 2850px-wide sequence diagram as fitting (axis heuristic inverts on wide-short linear diagrams), and can be silently laundered with `--kind linear` or a `classDef actor` style — so a skill whose creed is "never imply a stronger state than the evidence supports" ships a checker that does exactly that. The R4 prose (layout-craft fit discipline, trade-off ladder, ELK recipe) survived verification: the tower/strip/ELK numbers and the direction-LR-ignored claim all reproduced exactly.

## Evidence Reviewed

Full manifest receipt `67a2fa56dd469f04de2e0b459b0e5eb0b8f377075b5c1755c330e4f977537db1` was received and independently verified.

Files examined: `skills/bs-uml-master/SKILL.md`, `references/layout-craft.md` (full), `references/rendering-validation.md`, `scripts/check-render-fit.js` (full), `scripts/test-check-render-fit.js` (full), `scripts/check-delivery.js` (full), `scripts/test-check-delivery.js` output, `tools/peer-review.js`. All manifest SHAs for these files re-hashed and matched; `git rev-parse HEAD` = the reviewed revision.

Commands rerun / probes executed (mermaid-cli 11.16.0, Chromium via the scratchpad puppeteer config):

- `node scripts/test-check-render-fit.js` — ALL PASS (8 fixtures); `node scripts/test-check-delivery.js` — ALL PASS (18 fixtures; the SKILL.md "18 fixtures" claim is accurate).
- `check-render-fit.js` on the real probe corpus: `d1.svg` tower (833x2094) FAIL exit 1; `d1-lr.svg` strip (3860x446) FAIL exit 1; `d1-elk.svg` (1494x940) PASS exit 0 — the layout-craft recipe numbers (833x2094 / 3860x446 / 1494x940, 6.5px and 14.5px at fit) reproduce exactly.
- Verified the "`direction LR` silently ignored with external edges" claim: `d1-fixed.mmd` (5 `direction LR` lines added) renders to an identical 832.6x2094 viewBox as `d1.mmd`.
- Regex probe of `edgeSpans()` against 6 real rendered SVGs (flowchart, ELK flowchart, class diagram, 2 others): 38 edge paths present, 0 matched (mermaid 11 emits `d=` before `class=`); sequence messages confirmed to be `<line>` elements, which the `<path>`-only scanner never sees.
- Adversarial renders: `graph TB` 11-node tower with `classDef actor` → `class="node default actor"` → kind=linear → exit 0; 14-participant sequence (viewBox `-50 -10 2850 309`) → exit 0 with the participant axis blessed as "1.9 screens legal for linear reading".
- Laundering probe: `--kind linear` on the d1 tower and the d1-lr strip → both exit 0.
- Medium probe: `check-render-fit.js d1-elk.svg --viewport 794x1123` (A4 portrait content area) → FAIL 8.5px, while the undocumented default 1470x850 passes the same file at 14.5px.
- Consistency sweep: the 3-screen cap, the 11px floor, and the trade-off ladder are stated identically in SKILL.md Phase 4, layout-craft, and the checker — no contradiction found there. viewBox min-x/min-y offsets (`-50 -10 ...`) are parsed correctly (no zero-origin assumption bug).

## Findings

### F1: Long-range-edge detection is inert on real mermaid output yet prints affirmative PASS evidence [HIGH] [OPEN]

**Location**: `scripts/check-render-fit.js` lines 69–82 (`edgeSpans`), 145–155 (scale + verdict lines); SKILL.md line 194 (resource table advertises "long-range-edge detection"); `references/layout-craft.md` line 69 (co-visibility rule).
**Exploit scenario**: Any real delivery. Mermaid 11.16.0 emits edge paths with `d="..."` before `class="..."`, but the `edgeSpans` regex requires `class` before `\bd=`; probed against 6 real rendered SVGs (flowchart, ELK, classDiagram): 38 edge paths, 0 matches. Sequence messages are `<line>` elements, which the `<path>`-only scanner never sees. So on every real render the checker prints `PASS no edge exceeds one screen along the reading axis (both endpoints co-visible)` — a fabricated positive claim an agent will paste into the delivery as evidence. Additionally, the advertised gestalt rule (">=2 such edges: FAIL", header lines 16–18) is mathematically unreachable: spans are measured at `fitBoth` scale, which bounds every in-canvas span to <= one viewport — test fixture 7's own comment admits this ("at fit, gestalt edges can't exceed the screen").
**Root cause**: The regex was written against the hand-crafted fixture markup in `test-check-render-fit.js` (which emits `class` before `d`), not against real renderer output, and the self-test therefore green-lights a detector that never fires in production; the gestalt branch measures at the wrong scale (fit scale instead of legible/display scale) making its FAIL arm dead code.
**Suggested fix**: Parse `<path>` tags attribute-order-independently (match the tag, then extract `class` and `d` separately), add `<line>` elements (x1/y1/x2/y2) for sequence messages, measure spans at display scale = max(fit scale, LEGIBLE_PX/font) so the gestalt rule can actually fire, and add a self-test fixture built from a captured real mermaid 11 SVG fragment (d-before-class) so the regression suite covers reality. When zero edge-like elements are found in an SVG that has edges, print WARN "no edges detected" instead of an affirmative PASS.

### F2: Reading-axis heuristic inverts on wide sequence diagrams — cross-axis overflow certified as legal scrolling [HIGH] [OPEN]

**Location**: `scripts/check-render-fit.js` line 106 (`readingAxisVertical = H >= W`) and lines 129–141; contradicts `references/layout-craft.md` line 68 ("the cross axis must fit at >= 11px ... participants <= 6").
**Exploit scenario**: Rendered a real 14-participant, 3-message sequence diagram (viewBox `-50 -10 2850 309`). Because W > H, the checker declares the horizontal axis the reading axis: it reports "cross axis fits: 16.0px at fit-height" (certifying the trivially-fitting vertical axis) and blesses the 2850px participant overflow as "reading axis spans 1.9 screens — legal for linear reading", exit 0. But a sequence diagram's reading axis is time (vertical) regardless of shape; horizontal scrolling with lifeline headers off-screen is exactly the failure layout-craft forbids. Participant-heavy sequence diagrams — the single most common sequence-diagram failure — sail through the R4 gate.
**Root cause**: "Reading axis = the longer axis" (comment, lines 104–105) is a shape heuristic standing in for a semantic fact. It holds only when the diagram already fits its cross axis; the diagrams the gate exists to catch are precisely the ones that break the assumption.
**Suggested fix**: Derive the reading axis from the diagram kind, not the shape: sequence (actor marker / `aria-roledescription="sequence"`) reads vertically, always — cross axis is horizontal; `--kind linear` should take an optional axis (`--kind linear-x|linear-y`, defaulting from the detected type). Add a regression fixture for a wide-short sequence SVG expecting FAIL.

### F3: Kind determination is trivially poisoned or laundered — the tower disease passes its own gate [MEDIUM] [OPEN]

**Location**: `scripts/check-render-fit.js` lines 65–67 (`detectKind`), 41–44 (`--kind` accepted unconditionally); SKILL.md line 136 wires the check without requiring the kind choice to be recorded.
**Exploit scenario**: (a) Mechanical false negative: a `graph TB` 11-node tower flowchart styled with `classDef actor` renders with `class="node default actor"`; `detectKind`'s `\bactor\b` class match returns "linear" and the 169x1214, 0.14:1 tower — the exact disease R4 targets — exits 0. Styling human/user nodes with a classDef named `actor` is an ordinary flowchart idiom, so this needs no malice. (b) Deliberate laundering: `--kind linear` on the probed d1 tower (833x2094) and d1-lr strip (3860x446) both convert FAIL to exit 0 ("2.5/2.6 screens — legal"), even though both SVGs self-identify as `aria-roledescription="flowchart-v2"` and the checker never cross-checks or records the override.
**Root cause**: Kind detection trusts a user-controllable CSS class token over the renderer's authoritative `aria-roledescription`, and the `--kind` override is accepted for any SVG with no consistency check and no trace in the output that auto-detection was overridden.
**Suggested fix**: Detect kind primarily from `aria-roledescription` (`sequence` => linear; `classDiagram`/`flowchart-v2`/`stateDiagram` etc. => gestalt unless overridden); when `--kind` contradicts the detected roledescription, print a prominent WARN naming both (so the override is on the record a `check-delivery.js` receipt reviewer can see); match `actor` classes only within sequence-diagram markup.

### F4: The "mechanical" fit gate is never parameterized by the Phase 0 medium — page-bound deliveries verify against the wrong screen [MEDIUM] [OPEN]

**Location**: SKILL.md lines 136 ("Medium fit is mechanical: run `node <skill-dir>/scripts/check-render-fit.js <diagram.svg>`") and 177 (HTML closure); `references/layout-craft.md` line 64; the `--viewport` flag exists (checker line 37) but is mentioned nowhere in SKILL.md or any reference.
**Exploit scenario**: Test prompt 4's own scenario (A4 architecture memo). The agent follows Phase 4 literally, runs the checker with no flags, and gets PASS 14.5px on `d1-elk.svg` against the default 1470x850 landscape viewport — while the declared medium, A4 portrait (~794x1123 content area, non-zoomable), yields FAIL 8.5px on the same file (both runs reproduced). The delivery then honestly cites a mechanical PASS receipt that certifies fit for a medium the reader does not have; the gate's receipt actively launders the exact page-bound failure R4 was built to stop.
**Root cause**: Phase 0 captures medium constraints and Phase 4 invokes the checker, but no text connects them: the invocation is specified flag-less, the default viewport is baked in, and `--viewport`/`--kind`/`--font` are undocumented outside the script header.
**Suggested fix**: In SKILL.md Phase 4 and layout-craft's fit section, specify the invocation as `check-render-fit.js <svg> --viewport <medium WxH from Phase 0>` with a short medium-to-viewport table (landscape screen 1470x850, A4 portrait ~794x1123, README column ~900x850, slide 16:9 ~1280x720), and have the checker echo the viewport source (default vs explicit) so a default-viewport receipt on a page-bound delivery is visibly wrong.

### F5: R4 gate not integrated into the canonical verification reference or the delivery receipt [LOW] [OPEN]

**Location**: `references/rendering-validation.md` lines 62–69 (inspection checklist — no mention of `check-render-fit.js` anywhere in the file); `scripts/check-delivery.js` C2 (lines 197–209) accepts `RENDER_VERIFIED` with a tool+version receipt but no fit-check evidence.
**Exploit scenario**: Phase 4 says "Follow Rendering & Validation with the chosen backend's verification recipe"; an agent that opens the reference and works its checklist (the designed progressive-disclosure path, "Before delivery" required reading) performs medium fit as prose ("aspect ratio vs the Phase 0 medium") and never runs the mechanical gate — the only wiring lives in SKILL.md's Phase 4 sentence and layout-craft. Downstream, `check-delivery.js` passes a `RENDER_VERIFIED` state line that carries no fit receipt, so nothing mechanical catches the omission.
**Root cause**: R4 added the gate to SKILL.md and layout-craft but did not update rendering-validation.md's inspection checklist (point 4 predates R4) or extend check-delivery's receipt grammar to expect fit evidence for screen/page media.
**Suggested fix**: Add "run `check-render-fit.js` (with the Phase 0 viewport) — paste its PASS/FAIL lines" as an inspection-checklist item in rendering-validation.md; optionally teach check-delivery C2 to WARN when a `RENDER_VERIFIED` state line lacks a fit-check mention for SVG/Mermaid deliveries.

## Verdict

**Verdict**: REQUIRES_CHANGES

R4's prose is empirically sound — every probed claim in layout-craft (tower 833x2094, strip 3860x446, ELK 1494x940 at 14.5px, direction-LR silently ignored under external edges) reproduced exactly, and both self-tests pass. But the centerpiece script the prose leans on fails adversarial contact with real renderer output: its edge detector matches nothing mermaid 11 actually emits while printing affirmative co-visibility PASSes (F1), its axis heuristic certifies the most common sequence-diagram failure (F2), its kind detection is poisoned by an ordinary styling idiom and silently overridable (F3), and its viewport is never connected to the Phase 0 medium it exists to enforce (F4) — so the gate can stamp mechanical PASS receipts on precisely the deliveries it was built to block, which in a skill built on evidence honesty is worse than no gate. Two OPEN HIGH and two OPEN MEDIUM findings block approval; fixes are localized to one script plus wiring text, and all five findings ship with reproduction recipes.
