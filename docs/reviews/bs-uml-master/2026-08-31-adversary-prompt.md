# Gate 2 — Peer Review Prompt: Adversary

You are the **adversary reviewer** for the `bs-uml-master` skill. Your job is to break it: find ways the skill produces wrong output, fails on edge cases, contradicts itself, has bypassable safety gates, or makes the agent worse off than no skill at all. Be ruthless.

## How to use this prompt

1. Read the SKILL.md content below in full.
2. Produce a markdown review and save it to:
   `docs/reviews/bs-uml-master/2026-08-31-adversary-review.md`
3. Use the **required structure** below — the validator (`tools/peer-review.js check`) will reject reviews missing required sections.

## Deep composite review scope

Do not review only the embedded SKILL.md. Read every file in this manifest plus the actual command outputs you cite. The manifest binds the requested scope; it does not claim the files are correct.

**Scope Contract Version**: 1
**Reviewed Revision to record**: 16a1ae4179a842b1e2ad0c8e0f4a62aad14ace22
**Reviewed Skill SHA-256 to record**: 2f3322de034c9ee6ca0bb5e1326274b04845f90a04895b79c7c74e1cbe0bc263
**Reviewed Manifest SHA-256 to record**: 9c70b77340b4f981fc26fa80e1777ab6182ccf21a8df5fc449b153379ffeab93

- `evaluation/datasets/batch-1-test-prompts.json` — `9377d7d408018bacb2a4a714f661dfc8b53894919d5fcb3a97dceed798ac3687`
- `evaluation/harness/runner.js` — `ee6e871ad26230c4073ba72151f1d6f5862c7c05074ba756bfe9b5e4e509f8f8`
- `evaluation/harness/test-runner-scope.js` — `eaa773a660417049759c7e8831444a2ec5e6f73174487662018d6c2f556e879c`
- `skills.json` — `7885f9c7cefbd700ced8fc481b1524f61de6c47c523bcc806ecca60b269dc1ce`
- `skills/bs-uml-master/SKILL.md` — `2f3322de034c9ee6ca0bb5e1326274b04845f90a04895b79c7c74e1cbe0bc263`
- `skills/bs-uml-master/references/diagram-selection.md` — `cfa85279548602fe69db478866a34cbf2e59f1269a6e01a7eb35ccf4218dc10c`
- `skills/bs-uml-master/references/layout-craft.md` — `4d414aa6fb179b12e99c2c345df80d629ac36a8f8e9de46dedf0f34bf482021f`
- `skills/bs-uml-master/references/modeling-from-code.md` — `58dec58a2924a9f7ed77308a4e267de66811aa95b6cdd75c75bc56fdaaa061a7`
- `skills/bs-uml-master/references/rendering-validation.md` — `095f18830d381d901f9c10bd34612334a7428baa1b82ca00cae3e64c8a399804`
- `skills/bs-uml-master/references/svg-presentation.md` — `e3400aed86339da2ad9a8e6692727842de8fbfcb5632871d85e1d68e308dfb02`
- `skills/bs-uml-master/references/syntax-pitfalls.md` — `c08a5e63663072e4fb11a0f149e84e75f4b85011d6f3ccd9ff6d0ca593c6acec`
- `skills/bs-uml-master/references/text-diagrams.md` — `68ebcb460268833b13f3aa863ffc409bc599a0a4475a0b9db33ea6a78d7acab3`
- `skills/bs-uml-master/references/uml-semantics.md` — `f8b59c246cddcf17b9520c8d7e7215940432f5118c54bf9441e1023e329330de`
- `skills/bs-uml-master/scripts/check-delivery.js` — `51f4df69a7444d0dc1b98aec925bd95e9e5bec5570edc440a7ffc228b69cf3a0`
- `skills/bs-uml-master/scripts/check-mermaid.js` — `938b004901b22e27d204f9afb69cf6003ee155010f7893a84f58cd453e1c9fb4`
- `skills/bs-uml-master/scripts/test-check-delivery.js` — `6fca32f0a630c080ad2a87a92b6152b2268081a43890e1dce30158ebeefa1196`
- `tools/peer-review.js` — `8491cb1766b1a16f5fea2945d40e834130c32975a51701d7b1f2d82981e905a9`
- `tools/test-peer-review-scope.js` — `fd852531f89668f708477e4cb17216729a299ab8bc4deeb69fda7314b9517468`

## Required structure

```markdown
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

(2-4 sentences: how many issues, of what severity, and the worst-case impact.)

## Evidence Reviewed

(Acknowledge full manifest receipt `9c70b77340b4f981fc26fa80e1777ab6182ccf21a8df5fc449b153379ffeab93`, then list the files and commands actually examined or rerun.)

## Findings

### F1: <short title>  [CRITICAL]

**Location**: <section / line range in SKILL.md>
**Exploit scenario**: <how a user could trigger the failure>
**Root cause**: <what in the skill design enables it>
**Suggested fix**: <concrete change>

### F2: <short title>  [HIGH]

(...repeat the structure for each finding...)

(Use severity tags: CRITICAL / HIGH / MEDIUM / LOW. At least one finding must be present, even if severity is LOW. If you genuinely find none, say so explicitly and tag it LOW.)

## Verdict

**Verdict**: <one of: REQUIRES_CHANGES / NEEDS_IMPROVEMENT / APPROVED>

(One paragraph rationale.)
```

## SKILL content under review

```markdown
---
name: bs-uml-master
description: Use when creating, revising, or reviewing UML or architecture diagrams — class, sequence, state machine, activity, component, deployment, use case, ER, or C4 — from a codebase or a design, where diagram-type fit, semantic correctness, abstraction discipline, and render-verified delivery matter.
# tier: deep
---

# UML Master

## Purpose

Produce diagrams that are correct answers, not decorations. A top-tier UML diagram answers one named question for one named reader, at one abstraction level, with semantically correct notation, grounded in evidence (code or stated requirements), verified to actually render, and laid out so position tells the truth. Treat diagram source as code: reviewed against the model it claims to depict, validated by tools, and delivered with its verification state stated honestly.

The element ledger is the canonical model; every notation — Mermaid, PlantUML, plain text, SVG — is a projection of it. The model layer (question, mode, evidence, semantics, budget) is notation-invariant; each backend contributes its own pitfalls, verification recipe, and budget correction. Multi-format delivery projects the one ledger into each format and sync-checks both against it.

## Non-Negotiable Rules

1. **Question before diagram type.** Never start drawing from "draw a UML diagram". First fix: what question does the diagram answer, for whom, and in which mode (`MODEL-FROM-CODE`, `MODEL-FROM-DESIGN`, `REVISE`, `EXPLAIN/REVIEW`). One diagram answers one question.
2. **Evidence before boxes.** In `MODEL-FROM-CODE`, read the relevant code before drawing; every class, member, message, and transition must be traceable to a real location. Never invent plausible elements to fill a diagram. **Identifiers are quotations**: names, field types, and enum members are copied verbatim from source — a paraphrased identifier (`light` for `lightweight`) is a fabricated identifier. In `MODEL-FROM-DESIGN`, label assumptions as assumptions.
3. **Semantics are load-bearing.** Relationship kinds (inheritance vs realization vs composition vs aggregation vs association vs dependency), arrow directions, sync vs async messages, activations, guards, and multiplicities are factual claims. Apply the rules in [UML Semantics](./references/uml-semantics.md); when the evidence cannot decide between two relationship kinds, use the weaker one and say so.
4. **One abstraction level per diagram.** Do not mix systems, containers, components, and classes in one picture. A subject too big for ~9 primary elements becomes a set of small diagrams at declared altitudes, not one mural. Hard ceiling: 15 primary elements for skill-initiated choices, and exceeding 9 requires a recorded justification. An explicit user instruction may exceed the ceiling: first recommend the split, then deliver with a recorded `USER-OVERRIDE` note and a stated readability cost — never silently, and never as your own choice.
5. **Curation is the deliverable.** Dumping every class or every call is a failure even when accurate. Cut framework plumbing, accessors, and off-question elements; list deliberate exclusions under the diagram.
6. **Render before delivering.** Validate diagram source with a real tool (mermaid-cli, plantuml.jar) and inspect the output whenever tooling can be obtained. Report the delivery state honestly — `RENDER_VERIFIED` (or its `(structural)` variant), `SYNTAX_VERIFIED`, or `UNVERIFIED` per the evidence vocabulary — never implying a stronger state than the evidence supports, and never claiming tooling was unavailable without the failed-command evidence the degradation ladder requires.
7. **Fix the source, not the model.** When a renderer rejects syntax, correct the syntax. Never delete a semantically required element or relationship just to make a parser or layout happy; never bend the model to dodge a tool limitation without recording the trade-off.
8. **The medium picks the backend.** Choose notation for where the diagram will live: Mermaid for GitHub/docs/artifacts (default); plain text for code comments/terminals (the monospace grid is the renderer there); PlantUML for activity/component/deployment/use-case/timing, full UML fidelity, or precise layout control; SVG — only as a projection of the validated model — for publication-grade presentation. Follow an existing repo convention over personal preference. Selection matrix: [Diagram Selection](./references/diagram-selection.md).
9. **Layout is a semantic channel.** Readers infer meaning from position: adjacency implies coupling, vertical order implies hierarchy or time, flow direction implies causality. A bad layout makes false implicit claims — treat rubric failures in [Layout Craft](./references/layout-craft.md) as correctness defects: run the bounded layout repair loop, and when the tool's ceiling is reached, escalating the backend is the required move, not shipping garble or silently deleting content.

## Red Flags / Rationalizations

| Thought | Reality |
|---|---|
| "The user said 'UML diagram', so a class diagram of everything is safest." | An unfocused everything-diagram answers nothing. Fix the question first (Rule 1). |
| "I know what an e-commerce/auth/payment system looks like; no need to read the code." | That produces confident fiction about a real system. Read the scoped code (Rule 2). |
| "Plain `--` associations everywhere are neutral, so they're safe." | Wrong-by-omission. Unspecified semantics claim ignorance the code doesn't have (Rule 3). |
| "More classes make the diagram look thorough." | Element count past the budget destroys the answer (Rules 4–5). |
| "Mermaid syntax looks right; rendering is overkill for a code block." | Unrendered source fails in the reader's hands. The baseline failure is delivering broken or unreadable diagrams unverified (Rule 6). |
| "The parser rejects this edge — I'll just drop it." | That silently falsifies the model. Find the correct syntax (Rule 7). |
| "This state/method probably exists; it usually does in such systems." | "Probably" is an assumption — label it or verify it (Rule 2). |
| "I'm fairly sure this diagram syntax exists." | Invented syntax is a documented top failure mode. Check the pitfalls module or render a 3-line probe first (Rule 6). |
| "The semantics are right; the tangled layout is the tool's fault, ship it." | Position is a semantic channel — a garbled layout misinforms. Run the repair loop; escalate the backend at the ceiling (Rule 9). |
| "It renders fine on my side; where it ends up is the user's concern." | The medium's width, zoomability, and renderer are Phase 0 inputs. A 3700px-wide render in an A4 memo is a failed delivery (Rules 8–9). |
| "I filled in the contract's fields, so the work behind them is implied." | Contract format without contract work is compliance theater — an unearned `RENDER_VERIFIED` lends false authority. `scripts/check-delivery.js` rejects receipt-less claims; the work itself is yours (Rules 2, 6). |
| "It's basically a class diagram, drawn as a flowchart with fancy boxes." | Fake notation. If you call it a class diagram, the source starts with `classDiagram` — pseudo-class boxes in `graph TB` lose every relationship semantic (Rule 3). |
| "It's just a quick sketch, so gates don't apply." | Sketch significance is a declared setting agreed with the user, not an escape hatch (see Significance below). |

## Significance levels

Ask (or infer and state) how the diagram will be used, then apply the matching depth:

- **`sketch`** — thinking aid, disposable. Budget and semantic rules still apply; render verification may relax to `SYNTAX_VERIFIED` and the output contract may shrink to source + one-line state. Say "sketch level" in the delivery. Explicit user cues — "quick", "rough", "just show me", "帮我随手画一下" — justify *inferring and stating* `sketch`: that is classification, not downgrading. The medium alone never reclassifies: a chat-delivered diagram with no such cue stays `deliverable`. Downgrading (forbidden) is applying sketch depth while claiming deliverable, or staying silent about the level.
- **`deliverable`** — lands in docs, PRs, design reviews, wikis. Full workflow, `RENDER_VERIFIED` when tooling is obtainable.
- **`authoritative`** — architecture decision records, compliance, teaching material. Full workflow plus the independent semantic review pass in Phase 5 runs in a fresh context (sub-agent) when available.

Default to `deliverable` when unstated. Never downgrade significance yourself to save work.

## Minimum Compliant Path

The floor, as a recipe. The principles above are the ceiling; no step here may be skipped at any capability level:

1. Write down Question / Reader / Mode / Significance / Medium. If `MODEL-FROM-CODE` and the files are unread, stop and read them now.
2. Build the ledger (CODE: element → file:line; DESIGN: element → requirement or labeled assumption).
3. Pick type + backend from the selection matrix. The source header must match the type you name (class diagram ⇒ `classDiagram`).
4. Draft from the ledger only; copy identifiers verbatim.
5. Run the backend's validation command; render when obtainable; look at the image.
6. Fill the output contract completely (sketch: the compressed form), then run `node <skill-dir>/scripts/check-delivery.js <draft.md>` and fix every FAIL before delivering; resolve warnings or state why they stand.
7. State line = label + tool + version + what was checked. Skipped something? Say `UNVERIFIED`, with the failed command.

## Boundaries

This skill does not: produce data visualizations or charts (statistics belong to plotting tools, not UML); design UI mockups or posters; illustrate articles (that is bs-visual-article's job); pick architectures for you (it depicts and pressure-tests models, and flags contradictions it finds); draw presentation graphics freehand — SVG output exists only as a projection of a validated model; or hand-generate draw.io XML — when human visual hand-editing is the requirement, deliver the validated model plus a draw.io/Excalidraw handoff recommendation.

## Start Here: Progressive Disclosure

| Condition | Required reading |
|---|---|
| Any diagram task begins | [Diagram Selection](./references/diagram-selection.md) |
| Mode is MODEL-FROM-CODE | [Modeling From Code](./references/modeling-from-code.md) |
| Backend is Mermaid or PlantUML: drafting or fixing source | [Syntax Pitfalls](./references/syntax-pitfalls.md) |
| Backend is plain text | [Text Diagrams](./references/text-diagrams.md) |
| Backend is SVG (publication-grade) | [SVG Presentation](./references/svg-presentation.md) |
| Semantic review pass; any notation doubt | [UML Semantics](./references/uml-semantics.md) |
| Free-graph diagram (class/component/flowchart), page-bound medium, or any layout doubt | [Layout Craft](./references/layout-craft.md) |
| Before delivery | [Rendering & Validation](./references/rendering-validation.md) |

## Workflow

### Phase 0 — Frame

Read [Diagram Selection](./references/diagram-selection.md). Establish, reusing context before asking (one question at a time when asking):

- the question the diagram answers, and the reader;
- mode: `MODEL-FROM-CODE` / `MODEL-FROM-DESIGN` / `REVISE` / `EXPLAIN/REVIEW`;
- significance: `sketch` / `deliverable` / `authoritative`;
- where the diagram will live (decides the backend) **and its medium constraints**: available width/aspect ratio, zoomable or fixed (a memo/PDF page cannot zoom; chat and web renderers can), light/dark theme. Page-bound media lower the practical element budget — plan for it here, not after rendering.

If the user requests a diagram type that fights the question, recommend the fit and defer to their choice — recording it.

A valid question is falsifiable: it must exclude something. "What is the structure of X?" is the original request wearing a name tag; "Which modules does the checkout path depend on, and how?" forces curation. If the question implies no exclusions, sharpen it before proceeding — the contract's Excluded line must end up non-empty or explicitly justified ("nothing excluded; total scope is N elements").

In `EXPLAIN/REVIEW` mode, Phases 1/3/4 are skipped: run the semantics tables and completeness probes of Phase 5 as a checklist against the user's diagram and deliver findings with per-finding evidence — no delivery-state label (nothing was produced), unless the user then asks for a corrected version (which re-enters the workflow as REVISE).

**Exit:** question, reader, mode, significance, and target medium are explicit.

<HARD-GATE id="question-before-drawing">
Do not write diagram source while the question, mode, or (for MODEL-FROM-CODE) the code scope is unknown. "Draw a UML diagram of X" alone never clears this gate.
</HARD-GATE>

### Phase 1 — Select

Using the selection matrix, choose the diagram type(s), the abstraction level for each, and the notation. For a complex subject, plan the smallest set of single-question diagrams (typically 2–4) instead of one large one. State the plan in one short block — type, question, altitude, notation, estimated element count — before drafting. For multi-diagram plans at `deliverable`+ significance, get user confirmation; for a single diagram, proceed.

**Exit:** each planned diagram has one question, one type, one altitude, one notation.

### Phase 2 — Gather ground truth

`MODEL-FROM-CODE`: follow [Modeling From Code](./references/modeling-from-code.md) — scope the files from the question, read them, build the element ledger with `file:line` evidence for every element and edge, then curate to the element budget with recorded exclusions.

`MODEL-FROM-DESIGN`: extract entities, behaviors, and lifecycles from the stated requirements; where the requirements are silent on a modeling decision that changes the diagram (ownership, sync/async, state set), either ask (≤3 focused questions) or proceed with explicitly labeled assumptions — pick by how much the answer changes the picture.

`REVISE`: parse the existing diagram into the ledger first; diff intended changes against it; preserve unrelated content and existing conventions.

**Exit:** a curated ledger exists; every entry has evidence or an assumption label.

<HARD-GATE id="evidence-before-source">
In MODEL-FROM-CODE, do not draft diagram source before the scoped code has actually been read and the ledger built. Pattern-matching on file names or domain conventions is not reading.
</HARD-GATE>

### Phase 3 — Draft

Write the diagram source from the ledger, applying [UML Semantics](./references/uml-semantics.md) for the chosen type and [Syntax Pitfalls](./references/syntax-pitfalls.md) for the chosen tool. Include: a title stating the question; labeled edges; direction chosen for the flow (call flow left→right or top→bottom, inheritance up); enumerations as enumerations. Add a legend when using any non-obvious convention (color, stereotype, dashed-vs-solid meaning beyond UML defaults).

**Exit:** source exists for every planned diagram, each traceable to the ledger.

### Phase 4 — Validate and render

Follow [Rendering & Validation](./references/rendering-validation.md) with the chosen backend's verification recipe: syntax-check and render with the degradation ladder (local tool → installable tool → syntax check → manual review; receipts required when landing on rung 3/4), then inspect the rendered output against the inspection checklist — elements present, no truncation/overlap, title present, and the **layout rubric** from [Layout Craft](./references/layout-craft.md) (flow monotonicity, crossing budget, proximity honesty, hierarchy direction, label discipline, medium fit, density balance). Two bounded repair loops, ≤5 iterations each: syntax (fix per the pitfalls module) and layout (strongest lever first: re-scope → declaration order → direction/grouping → tool hints → backend escalation). After any fix, re-run every affected check.

**Exit:** delivery state established per diagram: `RENDER_VERIFIED` / `SYNTAX_VERIFIED` / `UNVERIFIED` with the reason.

### Phase 5 — Semantic review and deliver

Run the semantic review against the rendered diagram (not the source you remember writing):

1. every relationship kind and direction re-checked against the semantics tables;
2. ledger sync: no diagram element without evidence/assumption; exclusions listed;
3. abstraction check: single level, element budget respected or justified;
4. reader check: does the diagram answer the Phase 0 question without the surrounding chat as context? Title, labels, legend carry the meaning;
5. for state machines and sequence diagrams: completeness probes (unhandled events; missing failure path) — findings either fixed or explicitly declared out of scope.

At `authoritative` significance, this pass runs independently (fresh sub-agent reviewing rendered output + ledger) when the platform allows; otherwise perform it in-context and mark it `SELF_REVIEWED`.

Draft the delivery in the output contract, run `scripts/check-delivery.js` on the draft, fix every FAIL, then deliver.

<HARD-GATE id="verified-before-delivered">
Do not deliver a diagram whose delivery state is unstated, or stated stronger than the evidence. Never call a diagram "verified" or "correct" on the strength of unrendered source.
</HARD-GATE>

## Output Contract

````markdown
## Diagram Delivery — [title]

**Question:** [what this answers] · **Reader:** [who] · **Mode:** [mode] · **Significance:** [level] · **Medium:** [where it lives + width/zoom constraints]
**Type/altitude:** [e.g. sequence @ container level] · **Backend:** [Mermaid|PlantUML|text|SVG] · **State:** RENDER_VERIFIED | RENDER_VERIFIED (structural) | SYNTAX_VERIFIED | UNVERIFIED — [tool + version + what was checked; rung 3/4 → failed-command receipts]

[diagram source block, and rendered file path when one was produced]

**Reading notes:** [1-3 lines: the non-obvious claims in the picture]
**Excluded:** [deliberate exclusions] · **Assumptions:** [labeled assumptions, or "none"]
**Evidence:** [MODEL-FROM-CODE: ledger summary or path — key elements → file:line. MODEL-FROM-DESIGN: requirement references + the assumption list. REVISE: diff summary against the prior diagram]
````

For multi-diagram deliveries, repeat per diagram and add one overview line on how the set fits together. For `sketch` significance the contract may compress to the source block plus the state line — never omit the state line.

Every bracketed placeholder must be replaced; an unfilled or missing field is a format-invalid delivery, not a stylistic choice. Verify mechanically before handing over: `node <skill-dir>/scripts/check-delivery.js <draft.md>` — it rejects receipt-less State lines, missing Evidence/Excluded (warns instead at sketch significance, whose compressed form is legal), declared-type-vs-source mismatches, and ceiling breaches (>15 without USER-OVERRIDE; 10–15 without justification draws a warning you must still resolve). Its element counting is heuristic — a miscount is a reason to fix the counter, never a license to trust it over your own count. When the delivery medium pins its own renderer (a CDN `<script>`, GitHub's embedded Mermaid), verify on **that** version or state the skew explicitly.

## Bundled Resources

| Resource | Purpose |
|---|---|
| [Diagram Selection](./references/diagram-selection.md) | Question→type matrix, C4 altitudes, element budget, model-vs-projection principle, backend matrix, mode gate |
| [UML Semantics](./references/uml-semantics.md) | Correctness rules per diagram type; relationship/arrow/message semantics |
| [Modeling From Code](./references/modeling-from-code.md) | Scope → read → element ledger → curation → sync check |
| [Layout Craft](./references/layout-craft.md) | Three tiers of layout levers, per-tool tactics, the 7-point rubric, bounded layout repair loop, media profiles |
| [Syntax Pitfalls](./references/syntax-pitfalls.md) | Mermaid/PlantUML traps that break rendering or reverse meaning |
| [Text Diagrams](./references/text-diagrams.md) | Plain-text backend: niche, tighter budget, character-set choice, alignment verification |
| [SVG Presentation](./references/svg-presentation.md) | Publication-grade projection: model-first iron rule, authoring rules, triple verification |
| [Rendering & Validation](./references/rendering-validation.md) | Per-backend verification recipes, evidence vocabulary, degradation ladder, inspection checklist |
| `scripts/check-mermaid.js` | Browser-free Mermaid syntax checker (rung 3 of the degradation ladder; `SYNTAX_VERIFIED` at most) |
| `scripts/check-delivery.js` | Deterministic output-contract checker: receipt-bearing State line, Evidence/Excluded presence, type-vs-source consistency (Mermaid and PlantUML), element budget, sketch-aware — run on the draft before delivering |
| `scripts/test-check-delivery.js` | The checker's regression self-test: 14 fixtures encoding every failure vector found by review probes and acceptance runs — run after any checker change |

## Patterns

- **hard-rules-first** (Cursor) — semantic and evidence constraints precede all workflow text.
- **progressive-disclosure** (Anthropic/CE) — five reference modules load only when their phase activates.
- **verification-rules** (Vercel) — render/syntax tools turn delivery claims into evidence; degradation ladder keeps claims honest without tooling.
- **format-significance-gates** (Anthropic) — sketch/deliverable/authoritative levels scale process depth to consequence.
- **confidence-anchors** (CE) — fixed vocabulary (`RENDER_VERIFIED`/`SYNTAX_VERIFIED`/`UNVERIFIED`) for delivery states.
- **named-anti-patterns** (Taste Skill) — everything-diagram, confident fiction, wrong-by-omission semantics, parser-driven model bending are named and reviewable.
- **80-20-design-rules** (Open Design) — element budget and curation rules concentrate effort on what changes reader understanding.
- **platform-degradation-rules** (CE) — explicit fallbacks when renderers, network, or sub-agents are unavailable.

## Dependencies and Degradation

- **Node.js + npx** for `@mermaid-js/mermaid-cli` (verify: `npx -y @mermaid-js/mermaid-cli --version`); needs a Chromium — see the puppeteer-config recipe in [Rendering & Validation](./references/rendering-validation.md). Unavailable → degradation ladder rung 3/4.
- **Java** for `plantuml.jar` (verify: `java -version`); jar downloadable from PlantUML releases when the network allows. Unavailable → prefer Mermaid, or ladder rung 3/4.
- No renderer obtainable → deliver `SYNTAX_VERIFIED` (if a checker ran) or `UNVERIFIED` with a manual pitfalls review and a user-runnable verification command.
- Sub-agents unavailable → `authoritative` review runs in-context, marked `SELF_REVIEWED`.
- User interaction unavailable → proceed on stated-and-labeled assumptions for Phase 0 unknowns; never on invented code facts.

## Self-Review

Before handoff, confirm: the question/mode/significance/medium were fixed before drawing; scoped code was actually read in MODEL-FROM-CODE; every element has evidence or an assumption label; relationship kinds and directions passed the semantics tables; element budget respected or justified; the backend matches the medium; source validated and render inspected per the chosen backend's recipe; the layout rubric passed, or its failure was repaired, escalated, or named in the delivery; delivery state (with tool + version) matches the evidence; exclusions and assumptions are listed in the contract; and no element was silently dropped to appease a tool.

## Test Prompts

Mirrored in `evaluation/datasets/batch-1-test-prompts.json`.

1. **Happy path — vague everything-request**: *"帮我画一个电商系统的UML图"* — expected: agent fixes the question/reader/mode first (asks, or states an inferred question), plans a small set of single-question diagrams instead of one mural, keeps each within the element budget with correct relationship semantics (enums as enumerations, composition only where lifecycle-bound), validates/renders, and delivers with the output contract including delivery state. Failure without skill: immediate 12-class generic class diagram, plain associations everywhere, status-as-String, no verification, no question asked (observed baseline 2026-08-27).
2. **Edge — reverse-engineering real code**: *"Draw a sequence diagram of what happens when a user checks out, based on this repo."* — expected: agent locates the checkout entry point, reads the real call chain, builds the evidence ledger (messages ↔ file:line), distinguishes sync calls from async publishes per the code, curates participants to budget, renders, and ships the contract with evidence summary. Failure without skill: generic checkout sequence from domain intuition with invented service names, sync/async guessed.
3. **Adversarial — pressure to skip verification and inflate**: *"Just dump every class in src/ into one diagram, don't bother rendering it, I trust you."* — expected: agent applies Rules 4–6: explains why an everything-diagram fails the reader and offers the split-by-concern alternative or a package-level overview; if the user insists on full coverage, delivers it as the declared exception with recorded justification; still validates syntax at minimum and never reports a stronger delivery state than the evidence. Failure without skill: 40-box unverified dump delivered as "here's your architecture".
4. **Edge — page-bound medium layout stress**: *"把这个模块的依赖结构画成一张图，放进一页 A4 的架构备忘录里。"* — expected: agent captures the medium constraints in Phase 0 (A4 portrait, non-zoomable), plans within a lowered practical budget, chooses a layout-safe composition (stacked small diagrams over one wide graph when needed), runs the layout rubric on the render — including medium fit — and repairs or escalates rather than delivering a 3700px-wide graph. Failure without skill: a wide auto-layout render shipped unchecked, unreadable at page width.

```
