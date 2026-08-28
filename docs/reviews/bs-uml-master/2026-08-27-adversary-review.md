# Adversary Review: bs-uml-master

**Date**: 2026-08-27
**Reviewer Role**: Adversary
**Skill**: bs-uml-master
**HUMAN_VERIFIED**: false
**Scope Contract Version**: 1
**Reviewed Revision**: 30ae1d835c8a527ae7291f2e5bc6fabd4591fcc3
**Reviewed Skill SHA-256**: 3fed930b64ea9cce2b91c86ace58f79489cb6b4cbb2280ef1e9004bb5a9bdd2b
**Reviewed Manifest SHA-256**: 17e4261ead25daa025fda1a2084c0766e05f1ccb1b794bd52bb82373821d5116

## Summary

Fix-verification pass over revision `30ae1d8`, following my adversary review of revision `e7bfa08` (1 HIGH, 4 MEDIUM, 3 LOW). All eight findings were fixed; each fix was re-read in the diff and re-probed where a probe was cheap, including fresh PlantUML no-Graphviz renders and a smetana use-case render. One new residual issue was found in the F1 fix itself (its dot-dependent type list omits state and deployment diagrams, both empirically placard-producing — LOW, because the fix's operative type-independent rule still catches them). Nothing gating remains; worst-case residual impact is an agent momentarily trusting a state/deployment render's exit code before the mandatory open-and-confirm step catches the placard.

## Evidence Reviewed

Full manifest receipt acknowledged: `17e4261ead25daa025fda1a2084c0766e05f1ccb1b794bd52bb82373821d5116`. All 16 manifest entries recomputed with `sha256sum` and confirmed to match the prompt manifest and the working tree; `git rev-parse HEAD` = `30ae1d835c8a527ae7291f2e5bc6fabd4591fcc3`, matching the recorded revision. `modeling-from-code.md`, `uml-semantics.md`, `check-mermaid.js`, `skills.json`, and the evaluation/tools files are hash-identical to the previously reviewed revision; the changed files are `SKILL.md`, `diagram-selection.md`, `layout-craft.md`, `rendering-validation.md`, `svg-presentation.md`, `syntax-pitfalls.md`, `text-diagrams.md`.

Examined:

- `git diff e7bfa0859e94..30ae1d835c8a -- skills/bs-uml-master/` — full fix diff read line-by-line and mapped to findings F1–F8.
- All seven changed files re-read in their fixed form; unchanged manifest files carried from the prior pass (each previously read in full).

Commands actually run this pass (plantuml.jar under Java 21, **no Graphviz `dot`**; prior pass's mermaid 11.17.2 / mmdc / unicodedata probe results carried where the fixed text now matches them):

- `sha256sum` over all 16 manifest entries + `git rev-parse HEAD` — all match.
- PlantUML no-dot probes on the F1 fix's type list: state machine → **exit 0 + "Cannot find Graphviz" placard SVG**; deployment (node/artifact/database) → **exit 0 + placard**; component → exit 0 + placard (matches list); use case with `!pragma layout smetana` → exit 0 + real render (the smetana recommendation holds beyond class diagrams, where I had already verified it).
- Fixed-text claims cross-checked against the prior pass's probe outputs: `;`-in-message-text breaks on 11.17.2 (both `mermaid.parse` and mmdc) while `end`-in-text parses — matches the corrected pitfalls line; `A---oB` (spaceless) loses the `o` and renders node `B` while spaced `A --- oB` renders node `oB` — matches the corrected o/x line verbatim; ELK works in mmdc (distinct geometry vs dagre) — matches the corrected layout-craft cell; box-drawing chars + `▶` are East-Asian-Ambiguous per `unicodedata.east_asian_width` — matches the corrected character-set section.

## Findings

Fix verification of the eight prior findings, then the one new residual.

**F1 (was HIGH — PlantUML no-Graphviz success-shaped failure) — FIXED, with one residual (see F9).** `rendering-validation.md` now states that PlantUML `-tsvg` without Graphviz exits 0 and writes an error-placard SVG, forbids claiming any verified state from PlantUML's exit code alone, requires opening the output and confirming it is the diagram, scopes the dot dependency correctly in direction (sequence and colon-syntax activity dot-free — both re-confirmed), and documents `!pragma layout smetana` as the no-dot fallback with the engine noted in the state line. `layout-craft.md` mirrors the smetana pragma in the engine row. Smetana re-probed on a use-case diagram: real render, exit 0. Residual: the enumerated dot-dependent list is incomplete (F9below); the type-independent open-and-confirm rule still covers the omitted types.

**F2 (was MEDIUM — false "`;` tolerated on 11.17+" claim) — FIXED.** The pitfalls line now reads: "`;` inside message text **still breaks the parser** (probed on 11.17) — escape as `#59;`. `end` inside message text is tolerated on 11.17+…". This matches my probe results exactly (mid-text `;` parse-errors on both `mermaid.parse` and mmdc; `end` parses; the `end`-as-ID reservation is retained). The correction is conservative in the right direction — the one case it over-escapes (a trailing `;` with nothing after it happens to parse) is harmless.

**F3 (was MEDIUM — "chat-only consumption" sketch-cue loophole) — FIXED.** The sketch bullet now lists only genuine user cues ("quick", "rough", "just show me", "帮我随手画一下") and adds the explicit counter-sentence: "The medium alone never reclassifies: a chat-delivered diagram with no such cue stays `deliverable`." The rationalization I wrote against revision 2 ("chat and no doc mentioned → sketch") now directly contradicts the rule text instead of quoting it.

**F4 (was MEDIUM — SVG escalation lowers evidence ceiling; no inspection recipe) — FIXED.** `svg-presentation.md` adds a rasterize-to-inspect recipe (headless Chromium screenshot, `rsvg-convert`/`resvg`) with the explicit closure "Check 1 done only via text-level assertions is not check 1," and a new hard rule: do not escalate to SVG in an environment that cannot perform its verification, because that trades `RENDER_VERIFIED` for `UNVERIFIED` — stay on the strongest verifiable backend and name the presentation limitation. This resolves the fork with rendering-validation's structural tier in the strict direction.

**F5 (was MEDIUM — ambiguous-width charset breaks text-backend alignment math; unfalsifiable viewing step) — FIXED.** Pure ASCII is now the default character set; Unicode box-drawing is explicitly flagged as East-Asian-Ambiguous width (double-width in CJK-locale terminals, "for exactly the readers most likely to hit them") and gated on confirming a single-width destination. Verification step 4 now requires a *named* concrete display act ("cat in terminal", "screenshot inspected") and the label mapping is explicit: checks 1–3 alone ⇒ `RENDER_VERIFIED (structural)`, plus the named display act ⇒ full `RENDER_VERIFIED`. The EAW claim matches my `unicodedata` probe.

**F6 (was LOW — 9-vs-15 justification threshold drift) — FIXED.** `diagram-selection.md` now reads "**exceeding 9 demands a recorded justification**; hard ceiling 15 for skill-initiated choices," aligned with SKILL.md Rule 4. The lazy-agent quote no longer exists in the high-traffic file.

**F7 (was LOW — o/x pitfall example form did not reproduce) — FIXED.** The pitfall now gives the reproducing spaceless form (`A---oB` renders an edge to a node named `B`, marked "(probed)"), states that the spaced form parses as node `oB` on current Mermaid, and advises keeping the space or renaming — matching my mmdc probe results exactly.

**F8 (was LOW — ELK local verification vs embedded-renderer silent fallback) — FIXED.** The layout-craft engine cell now states ELK works in mermaid-cli, that embedded renderers (GitHub included) silently ignore the directive and lay out with dagre, and gives the operative instruction: for a diagram whose home is such a renderer, run the rubric on the dagre render (drop the directive locally) — "or your local `RENDER_VERIFIED` certifies a layout the reader never sees."

### F9: The new dot-dependent type list omits state and deployment diagrams  [LOW]

**Location**: `references/rendering-validation.md`, PlantUML section, the F1-fix bullet: "…writes an error-placard SVG ('Cannot find Graphviz') for the dot-dependent diagram types — class, component, use case, object (sequence and colon-syntax activity render without dot)."
**Exploit scenario**: Probed this pass on the reviewed jar with no `dot` present: a minimal **state machine** (`[*] --> Idle --> Running --> [*]`) and a minimal **deployment** diagram (node/artifact/database) both exit 0 and write the Graphviz error placard — but neither type appears in the bullet's dot-dependent list. An agent rendering a state machine could read the enumeration as exhaustive ("state isn't listed, so my exit 0 is a real render") and skim the open-and-confirm step. The blast radius is small because the same bullet's operative rule is type-independent ("Never claim any verified state from PlantUML's exit code alone; open the output and confirm it is the diagram, not a placard"), and the skill's default backend for state machines is Mermaid — but an enumerated list in a probe-branded module should not be wrong by omission, and state machines are a first-class type in this skill.
**Root cause**: The fix enumerated the types I happened to probe (class, use case) plus two inferred ones (component, object), rather than the underlying rule: everything svek-rendered needs dot — which includes state and deployment.
**Suggested fix**: Either extend the list ("class, component, deployment, state, use case, object") or replace it with the rule: "every type except sequence, colon-syntax activity, and timing needs dot." One-line edit. (Optional hardening, carried from my original F1 note: a one-line placard warning where syntax-pitfalls' coverage-gaps section routes to PlantUML would put the trap next to the routing decision; rendering-validation is however already mandatory pre-delivery reading, so this is advisory.)

## Verdict

**Verdict**: APPROVED

All eight findings from my review of revision `e7bfa08` are fixed in revision `30ae1d8`, and every fix was verified against the actual diff — with the factual corrections (F1, F2, F7, F8, F5's EAW claim) checked against real probe output rather than taken on faith; the F1 placard behavior, the smetana fallback, and the corrected pitfall claims all reproduce exactly as the fixed text now states. The loophole closures (F3, F4, F5's falsifiable viewing step, F6) remove the rule-text the exploits quoted, not just add counter-text. The single residual (F9) is a wrong-by-omission enumeration inside an otherwise correct fix, is not gating — the type-independent open-and-confirm rule and the Mermaid-default routing for state machines contain it — and has a one-line remedy. Nothing in this revision lets a lazy agent claim a stronger delivery state than the evidence, strands a mandated escalation path, or contradicts a probed fact; the skill's evidence layer now matches what the tools actually do on this box.
