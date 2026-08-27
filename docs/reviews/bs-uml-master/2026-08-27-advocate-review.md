# Advocate Review: bs-uml-master

**Date**: 2026-08-27
**Reviewer Role**: Advocate
**Skill**: bs-uml-master
**HUMAN_VERIFIED**: false
**Scope Contract Version**: 1
**Reviewed Revision**: e7bfa0859e94f0e207a420e305817e06e3007519
**Reviewed Skill SHA-256**: 9150fcfb0bc1a8fc64cc2ba35d74266dc80756fc4f3ce17a8e38b79ee5223d8b
**Reviewed Manifest SHA-256**: 6664cf68076666b3829fccda11ce5622c1b7b806bc7dc741153cda0e53b30791

## Executive Summary

Revision 2 turns a strong verification-and-semantics skill into a genuinely layered architecture: the element ledger becomes the canonical model and Mermaid/PlantUML/plain-text/SVG become four projections of it, each carrying only its own pitfalls table, verification recipe, and budget correction — a design that makes multi-format delivery and backend escalation principled instead of ad hoc. The new Rule 9 (layout as a semantic channel) is backed by a checkable 7-point rubric, three ranked tiers of levers with concrete per-tool tactics, and a bounded 5-iteration repair loop that ends in mandatory escalation rather than grinding or garble — this is a quality raise, not process weight, because the checks fold into the existing Phase 4 inspection and load only via progressive disclosure. I re-executed the bundled checker (3-way input discrimination confirmed), re-ran Gate 1 (16/16), and probed two syntax-pitfalls claims against mermaid 11.17.2 — everything I tested matched the skill's claims. I would ship this at PASS, with human verification and one execution gap (below) as the remaining debt.

## Evidence Reviewed

I acknowledge full manifest receipt `6664cf68076666b3829fccda11ce5622c1b7b806bc7dc741153cda0e53b30791` (Scope Contract Version 1). All 14 manifest file hashes, the skill SHA (`9150fcfb…`), and the revision (`e7bfa085…` = `git rev-parse HEAD`) were recomputed locally with `sha256sum` and match the prompt verbatim.

Files examined in full at current content:

- `skills/bs-uml-master/SKILL.md` (embedded copy diffed against the live file via hash)
- All 8 reference modules: `diagram-selection.md`, `uml-semantics.md`, `modeling-from-code.md`, `layout-craft.md`, `syntax-pitfalls.md`, `text-diagrams.md`, `svg-presentation.md`, `rendering-validation.md`
- `skills/bs-uml-master/scripts/check-mermaid.js`
- `skills.json` (bs-uml-master entry: tier deep, 8 patterns, status active), `evaluation/datasets/batch-1-test-prompts.json` (all 4 uml evals), `evaluation/harness/runner.js` scope constants, `tools/peer-review.js` (check logic + manifest binding), `tools/test-peer-review-scope.js` and `evaluation/harness/test-runner-scope.js` (present, hash-verified)
- Context: `docs/research/uml-diagramming-analysis.md` including the new §五 R2 section; `docs/patterns/README.md` (all 8 declared patterns present and `active`); prior records `2026-08-27-red-baseline.md`, `2026-08-27-forward-test.md`, `2026-08-27-gate2-response.md`

Commands actually executed and cited:

1. `bash tools/validate.sh skills/bs-uml-master` → **16 passed, 0 failed**, including pattern references 8/8, gate syntax 3 tags well-formed, bundled resources 8/8.
2. `node skills/bs-uml-master/scripts/check-mermaid.js` against three inputs (scratchpad, mermaid 11.17.2 + jsdom installed): valid `classDiagram A <|-- B` → exit 0 with the honest "SYNTAX_VERIFIED only; render with mmdc for RENDER_VERIFIED" caveat; invalid `A <|--<< B` → exit 1 with parse error and line/column pointer; junk `not a diagram at all` → exit 1 with "No diagram type detected". The exit-2 checker-fault path is separated in code from the exit-1 parse verdict, so environment failures cannot masquerade as diagram verdicts.
3. Syntax-pitfalls probes on mermaid 11.17.2: `usecaseDiagram` source → rejected ("No diagram type detected"), confirming the F3-fixed claim that Mermaid has no use case diagram and it must route to PlantUML; lowercase `end` as a flowchart node → parse error while `End` parses, confirming the reserved-word trap; balanced `+`/`-` sequence activations parse clean.
4. `sha256sum` over all 14 manifest files + `git rev-parse HEAD` (hash receipts above).

## Dimension Scores

| Dimension | Score | Key Strength | Key Concern |
|-----------|------:|--------------|-------------|
| Clarity of trigger description | 9/10 | Names the verbs (creating/revising/reviewing), nine diagram types, both sources (codebase or design), and the quality stakes; Boundaries section cleanly fences off dataviz, mockups, bs-visual-article, and draw.io XML | Single long sentence; negative triggers live only in the body's Boundaries section, not the frontmatter description |
| Hard rules / safety gates | 9/10 | 9 rules with a deliberate escape-valve design: hard ceiling + recorded `USER-OVERRIDE`, receipts-required degradation ladder (rung 3/4 needs verbatim failed-command evidence), 3 well-formed HARD-GATE tags (validated), and Rule 9 making layout failures correctness defects with escalation as the required move | Layout-rubric compliance is self-reported; no mechanical check (e.g. crossing count from the SVG) backs it the way check-mermaid.js backs syntax |
| Workflow correctness | 9/10 | Phase 0–5 each with exit criteria; falsifiable-question test closes the boilerplate loophole (F7); EXPLAIN/REVIEW skip path defined (F9); medium constraints captured in Phase 0 *before* rendering, so page-bound budgets are planned rather than discovered; both repair loops bounded at 5 with a named next move | The `authoritative` independent review degrades to `SELF_REVIEWED` "when the platform allows" — correct honesty, but the strongest tier is environment-dependent |
| Pattern application | 9/10 | All 8 declared patterns resolve to `active` entries in docs/patterns/README.md (validator-confirmed 8/8) and each is visibly instantiated: confidence-anchors = the evidence vocabulary table, named-anti-patterns = the Red Flags table, platform-degradation-rules = the ladder + Dependencies section | The R2 layout/projection material arguably constitutes a new extractable pattern (layout-as-semantics) not yet fed back into docs/patterns/ |
| Test prompt coverage | 8/10 | 4 prompts spanning vague-request, code-forensics, triple-pressure adversarial, and the new page-bound layout stress; mirrored in the eval dataset (verified); RED baseline recorded with a 7-row failure taxonomy and forward tests 3/3 EXECUTED with renderer evidence | `uml-layout-edge` — the eval that exercises exactly what R2 added — has no EXECUTED forward-test record yet; all execution evidence is AI-run, awaiting HUMAN_VERIFIED |
| Bundled resources | 9/10 | 8 reference modules + a working script, all existence-validated (8/8); check-mermaid.js empirically re-verified here including its checker-fault/parse-error separation; per-backend verification recipes are concrete (exact commands, exit-code meanings, Chrome-discovery paths, Kroki consent gate) | plantuml.jar recipes not re-executed in this review; the ELK `%%{init}%%` escalation claim taken on the module's own "verify the target renderer supports it" caveat |
| Maintainability | 8/10 | Version-scoped claims ("11.17+ accepts, older embedded renderers may not — probe first") replace brittle absolutes; projection architecture means a new backend is one new module, not a rewrite; gate2-response records every finding→fix mapping for future auditors | Version-dependent syntax claims will rot as Mermaid moves; 9 cross-linked files must stay consistent with SKILL.md's tables by hand |
| Production readiness | 8/10 | Gate 1 16/16 (re-run), all 15 first-round adversary findings verifiably landed in the reviewed content (I spot-checked F2/F3/F5/F12/F13 against the current text), registry entry complete with tier/patterns/status, research basis updated same-day with the R2 rationale | HUMAN_VERIFIED still false across all records; the one untested eval (layout-edge) is the only pillar of R2 without execution evidence |

**Total: 69/80**

## Strongest Aspect

The single best design move of this revision is the **model/projection split**: declaring the evidence ledger the canonical model and demoting every notation — including hand-authored SVG — to a projection of it. This one decision does disproportionate work. It makes the SVG backend safe to offer at all (the iron rule "never draw SVG freehand; no validated model → not ready for SVG" plus triple verification with *no* SYNTAX_VERIFIED tier directly kills the beautiful-fiction failure mode); it gives plain text a legitimate niche with its own tighter budget and a real verification recipe (the alignment check, where the monospace grid *is* the renderer) instead of treating text as a degraded Mermaid; it makes backend escalation under layout pressure (Rule 9, Tier 3) a semantics-preserving operation rather than a rewrite risk; and it makes multi-format delivery sync-checkable in both directions against one source of truth. The architecture is also honest about where each guarantee comes from: parser-guarded backends get parser recipes, unguarded backends get ledger-sync obligations that scale up exactly where parser protection disappears.

## One Improvement

Run and record an EXECUTED forward test for `uml-layout-edge` (the A4-memo prompt), the way the other three prompts have records in `2026-08-27-forward-test.md`. Everything R2 added — Rule 9, the 7-point rubric, the media profiles, the layout repair loop, backend escalation — funnels into that one eval, and it is currently the only test prompt with zero execution evidence. A single recorded run demonstrating a lowered practical budget chosen in Phase 0, a rubric check on the actual render (medium-fit point included), and either a repair iteration or a justified escalation would close the loop between the revision's design claims and observed behavior, and would surface early whether the rubric's 7 points are actually checkable by an agent on a real rendered image or need sharpening.

## Verdict

**Verdict**: PASS (69/80)

This is the most evidence-disciplined skill in the repo, and revision 2 improves it where the prior revision was weakest: what happens after "it renders" — layout that lies, formats beyond Mermaid, and page-bound media. Every claim I tested empirically held: Gate 1 passes 16/16, the bundled checker discriminates valid/invalid/junk exactly as documented with correct exit codes and an honest capability caveat in its own output, and two independently probed syntax-pitfalls claims reproduced on mermaid 11.17.2. The prior adversary round's fixes are demonstrably present in the reviewed content, and the R2 additions are grounded in a same-day research update rather than bolted on. The remaining debt is verification breadth, not design: no human-verified run, and no execution record for the layout eval that R2 exists to serve. Neither blocks a PASS for an AI-drafted skill at this stage of the pipeline; both are cheap to close and named above.
