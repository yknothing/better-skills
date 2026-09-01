# Adversary Review: bs-uml-master

**Date**: 2026-09-01
**Reviewer Role**: Adversary
**Skill**: bs-uml-master
**HUMAN_VERIFIED**: false
**Scope Contract Version**: 1
**Reviewed Revision**: a1f466c32c5bfb96c40fe15b030ca7e8aa4a8c0a
**Reviewed Skill SHA-256**: d2be2d55a53d87eef9064a6c98cadfb15b4304570a75f6d1a66a51b99af3410b
**Reviewed Manifest SHA-256**: dd0789cd92283241929afc13d0bf29ae01b87b9b761ab15aac46b13923e88b35

## Summary

Adversarial review of the two R5 additions at a1f466c: media-profile adaptivity in check-render-fit and the color-semantics module with check-delivery C7. Four findings: 2 MEDIUM, 2 LOW, all OPEN. The headline media-inversion claims verified true on real renders (tower fails phone on volume without the aspect warn; ELK layout draws the aspect warn on phone), and the color module's factual claims (Okabe-Ito hexes, backend syntax forms) all check out — but the "viewport-parametric, conclusions invert correctly" claim breaks on the scrollability dimension (a 2-screen sequence diagram is blessed as "legal for linear reading" on `--medium slide`, where scrolling does not exist), and C7 is bypassed by three entire styling families (themeVariables, stroke/color-only, PlantUML inline hex) and silenced by the phrase "no legend needed". Worst case: mechanical exit-0 receipts for a physically undeliverable slide diagram, and the advertised color gate staying silent on the most common PlantUML coloring form.

## Evidence Reviewed

Full manifest receipt `dd0789cd92283241929afc13d0bf29ae01b87b9b761ab15aac46b13923e88b35` was received and independently verified.

Files examined: `scripts/check-render-fit.js` R5 (full diff `9986df3..a1f466c` + full file), `scripts/check-delivery.js` C7 diff, both self-tests (diffs + runs), `references/color-semantics.md` (full read), `references/layout-craft.md` R5 diff (media-profile table + parametric paragraph), `SKILL.md` R5 diff (Rule 9, red flag, Phase 3/4, resource table), `references/rendering-validation.md`, `references/svg-presentation.md` and `references/uml-semantics.md` (contradiction sweep), `improvement-points.md` (IP-20 still open). All manifest SHAs re-hashed and matched; `git rev-parse HEAD` = the reviewed revision.

Probes executed:

- Self-tests: fit 19/19 ALL PASS, delivery 20/20 ALL PASS.
- Media inversion on real renders (not just the synthetic fixtures): d1.svg tower (833x2094) on `--medium phone` → FAIL on volume at 5.7px with NO aspect warn (0.40 inside phone band 0.16–0.79); d1-elk.svg (1494x940) on phone → FAIL 4.2px WITH the aspect warn; d1-elk on default pc → exit 0. The pinned claims hold.
- Band formula: pc band computes to 0.52–2.59, preserving R4's 0.5–2.5 within rounding; extreme custom viewports produce sensible bands; `--medium watch` → usage error (fixture-covered).
- Flag interaction: `--medium phone --viewport 1470x850` and the reverse order both silently apply last-wins (INFO shows `medium=custom`/`medium=pc` respectively) — no conflict error.
- Scrollability probe: synthetic sequence SVGs (`aria-roledescription="sequence"`, 16px) at 700x1500 on `--medium slide` → exit 0, `WARN reading axis spans 2.1 screens — legal for linear reading`; 700x2200 on `--medium a4` → exit 0 at 2.0 screens. Slides cannot scroll at all and A4 print cuts at page boundaries.
- C7 probes (five delivery drafts, all with valid receipts/evidence): mermaid `classDef ... fill:` without legend → WARN fires (positive control); `themeVariables` color init → no WARN; `classDef` stroke/color-only + `linkStyle stroke:` → no WARN; PlantUML `component Gateway #E69F00` → no WARN; classDef fill plus the sentence "colors are decorative, no legend needed" → WARN silenced.
- Verified color-semantics content: all 8 hex values match the published Okabe-Ito palette (grey #999999 is the standard 9th "gray" slot); mermaid `classDef`/`class A,B name` and `%%{init:{"theme":"neutral"}}%%`, PlantUML stereotype-scoped `skinparam class { BackgroundColor<<app>> #hex }` and `legend/endlegend` forms are all correct syntax; no contradiction with svg-presentation ("legend mandatory the moment any styling carries meaning") or uml-semantics.

## Findings

### F1: Scroll allowance applied to non-scrollable media — the parametric claim breaks on scrollability [MEDIUM] [OPEN]

**Location**: `scripts/check-render-fit.js` MEDIA table (lines 33–41: profiles carry only WxH) and the linear reading-axis rule (`screens <= MAX_READING_SCREENS` → WARN "legal for linear reading"); `references/layout-craft.md` fit-to-screen discipline ("scrolling along the reading axis is the native reading gesture", stated unconditionally) vs its own media-profiles table marking a4 "Print/PDF page, non-zoomable".
**Exploit scenario**: Probed: a 700x1500 sequence render checked with `--medium slide` exits 0 with `WARN reading axis spans 2.1 screens — legal for linear reading; each screenful must stand alone` — but a 16:9 slide is projected; there is no scrolling gesture, so a 2.1-screen diagram is physically undeliverable as one slide. Same at `--medium a4` (700x2200 → 2.0 screens, exit 0): print cuts the lifelines at a page boundary. An agent following Phase 4 ("medium fit is mechanical") records this exit-0 output as its `RENDER_VERIFIED` fit receipt for a deck or memo — a mechanically certified wrong conclusion on exactly the media R5 added profiles for. The R5 claim that "conclusions legitimately invert between media" fails here: scrollability is the one dimension along which the conclusion must invert (pc/phone/readme scroll; slide/a4 do not), and it is not modeled.
**Root cause**: Profiles were reduced to viewport geometry; the 3-screen linear allowance encodes a scrollable-screen assumption that predates the fixed-media profiles, and neither the checker nor the layout-craft discipline text conditions it on the medium.
**Suggested fix**: Add a `scrollable` flag per profile (pc/phone/phone-landscape/readme: true; slide: false; a4: false-or-paged). For non-scrollable media, cap linear diagrams at 1 screen (FAIL beyond, message: "this medium cannot scroll — split into N slides/pages, one screenful each"); optionally allow a4 a paged variant that WARNs about page-boundary cuts. Mirror the condition in layout-craft's fit-discipline bullet ("scrolling is legal only on scrolling media") and add slide/a4 linear fixtures pinning the inverted conclusion.

### F2: C7 color gate bypassed by three styling families and silenced by disclaiming the legend [MEDIUM] [OPEN]

**Location**: `scripts/check-delivery.js` C7 (the `colored` regex `classDef\s+\w+[^\n]*fill|style\s+\w+\s+fill|skinparam[^\n]*Color|fill\s*[:=]\s*["']?#` and the silencer `/legend|图例|color\s*(?:=|dimension|encodes)/i`); `test-check-delivery.js` fixture 13b (covers only mermaid classDef-fill).
**Exploit scenario**: Probed with four delivery drafts. (a) A mermaid diagram colored entirely via `%%{init:{"themeVariables":{"primaryColor":"#E69F00",...}}}%%` → no WARN. (b) `classDef hot stroke:#D55E00,color:#D55E00` + `linkStyle 0 stroke:#0072B2` — color-vision-relevant styling with no fill → no WARN. (c) PlantUML inline element colors (`component Gateway #E69F00`) — the single most common PlantUML coloring form, and the one color-semantics.md exists to discipline → no WARN, so the advertised "PlantUML color without legend draws a WARN" behavior is absent for the whole backend's dominant syntax. (d) The silencer: appending "colors are decorative, no legend needed" suppresses the WARN via the bare `/legend/i` match — the named anti-pattern (decorative color) disables the check that exists to catch it.
**Root cause**: The detection regex enumerates one syntax form per idea (fill-keyword or skinparam) rather than the color channels (fill, stroke, text color, theme variables, inline hex/named colors), and the exemption matches the word "legend" anywhere instead of a declaration-shaped pattern.
**Suggested fix**: Broaden detection: `classDef|style|linkStyle` lines containing `(?:fill|stroke|color)\s*:`; `themeVariables` with any `#hex`; PlantUML `#(?:[0-9A-Fa-f]{3,8}|[A-Za-z]+)\b` following an element declaration or arrow. Narrow the exemption to declaration-shaped evidence only (`color\s*(?:=|encodes|dimension)` or a legend block/subgraph reference), so prose mentioning "no legend needed" still WARNs. Add bypass fixtures for the three families to test-check-delivery.js.

### F3: R5 flag and doc drift — `--medium` undocumented in the workflow, silent flag override, stale comments, profile fixture gaps [LOW] [OPEN]

**Location**: `SKILL.md` Phase 4 (line 138: invocation still `--viewport WxH` only); `references/rendering-validation.md` checklist point 4 (flags list reads "`--viewport WxH`, `--kind ...`, `--font N`" — no `--medium`); `scripts/check-render-fit.js` header comment (lines 2–4 still say "landscape PC screens") and `parseArgs` (`--medium`/`--viewport` silently last-wins in either order, probed); `test-check-render-fit.js` (no fixtures for phone-landscape, a4, readme, or slide profiles).
**Exploit scenario**: An agent working from SKILL.md Phase 4 or the rendering-validation checklist — the two canonical procedure texts — never learns `--medium` exists and hand-translates media to WxH (error-prone, e.g. guessing phone at 375x667); the named-profile UX lives only in layout-craft's table. A command assembled from templates as `--medium a4 --viewport 1470x850` silently checks the PC viewport while the operator believes a4 was checked (INFO does say `medium=custom`, but nothing flags the conflict). Four of the six shipped profiles have zero self-test coverage.
**Root cause**: The R5 feature landed in the script and layout-craft but the Phase 4 / checklist invocation text from R4.1 was not revisited; parseArgs treats the two viewport sources as interchangeable assignments.
**Suggested fix**: Update Phase 4 and rendering-validation to name `--medium <profile>` as the primary form with `--viewport WxH` as the custom fallback; make `--medium` + `--viewport` together a usage error (or an explicit precedence WARN); refresh the script's header comment; add one fixture per remaining profile (a slide/a4 fixture arrives naturally with F1's fix).

### F4: IP-20 carryover — fit receipt still self-attested by check-delivery [LOW] [OPEN]

**Location**: `scripts/check-delivery.js` C2 (unchanged by R5 except C7's insertion); `docs/reviews/bs-uml-master/improvement-points.md` IP-20 (status open, count "2 open").
**Exploit scenario**: Unchanged from my R4 F6: a delivery claiming `RENDER_VERIFIED` with a tool+version receipt but no pasted check-render-fit output passes check-delivery, so the fit gate — now carrying more weight with per-medium conclusions — remains binding only on agents already complying; F1's wrong-medium receipts would likewise pass unexamined.
**Root cause**: Receipt coupling deliberately deferred (fixtures first) per IP-20; R5 extended the checker's scope (C7) without touching C2.
**Suggested fix**: Close IP-20 in the next checker revision: C2 WARNs (FAIL at deliverable+ for screen/page media) when a `RENDER_VERIFIED` state line for an SVG/Mermaid delivery carries no `check-render-fit` output line; require the medium/profile named in the fit line to match the contract's Medium field — which would also mechanically catch F1/F3-style wrong-medium receipts.

## Verdict

**Verdict**: NEEDS_IMPROVEMENT

The R5 work is real: the media-inversion behavior is exactly as claimed on real renders, the aspect band is genuinely viewport-relative and backward-compatible with R4's PC band, the color module's factual content (palette hexes, backend syntax, legend mechanics) survived verification, and both self-tests pass with fixtures pinning the headline claims. But both additions fail at their adversarial edges: the "viewport-parametric" fit gate mechanically blesses multi-screen scrolling on media that cannot scroll — an exit-0 receipt for an undeliverable slide diagram, the same wrong-medium-receipt class R4.1 was built to eliminate — and the C7 color gate misses three of the four styling families it claims to police (including PlantUML's dominant inline form) while the documented anti-pattern itself ("decorative, no legend needed") silences it. Two OPEN MEDIUM findings block approval under the release rules; all four findings carry reproduction recipes and localized fixes (a scrollable flag per profile, a broadened detection regex, doc/flag hygiene, and the already-ledgered IP-20 coupling), so the path to a clean re-review is short.
