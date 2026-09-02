# Gate 2 — Peer Review Prompt: Advocate

You are the **advocate reviewer** for the `bs-uml-master` skill. Your job is to argue for what's GOOD: identify the strongest aspects, score the design across multiple dimensions, and decide whether this skill is production-ready.

## How to use this prompt

1. Read the SKILL.md content below in full.
2. Produce a markdown review and save it to:
   `docs/reviews/bs-uml-master/2026-09-02-advocate-review.md`
3. Use the **required structure** below — the validator (`tools/peer-review.js check`) will reject reviews missing required sections.

## Deep composite review scope

Do not review only the embedded SKILL.md. Read every file in this manifest plus the actual command outputs you cite. The manifest binds the requested scope; it does not claim the files are correct.

**Scope Contract Version**: 1
**Reviewed Revision to record**: d578e78cc2b64a2829a50bd3b05cd90257756c84
**Reviewed Skill SHA-256 to record**: 454a862bdf526571f1e5f4fafcb6bbcffdb59d5f18f69c8e55d047368843386c
**Reviewed Manifest SHA-256 to record**: f9a4c79202155ecfa724e8fe3a87a991df7d4645e2cd3b09f806043e26d532c7

- `evaluation/datasets/batch-1-test-prompts.json` — `22625636259880ff41378a46b3401dd0274a48db0225e019e344ad59eaa62f43`
- `evaluation/harness/runner.js` — `ee6e871ad26230c4073ba72151f1d6f5862c7c05074ba756bfe9b5e4e509f8f8`
- `evaluation/harness/test-runner-scope.js` — `eaa773a660417049759c7e8831444a2ec5e6f73174487662018d6c2f556e879c`
- `skills.json` — `7885f9c7cefbd700ced8fc481b1524f61de6c47c523bcc806ecca60b269dc1ce`
- `skills/bs-uml-master/SKILL.md` — `454a862bdf526571f1e5f4fafcb6bbcffdb59d5f18f69c8e55d047368843386c`
- `skills/bs-uml-master/references/color-semantics.md` — `abaa0de652b94df1e0ef6a99abb76703ca9bc6ddec42e6a61940aa9018af8e23`
- `skills/bs-uml-master/references/diagram-selection.md` — `cfa85279548602fe69db478866a34cbf2e59f1269a6e01a7eb35ccf4218dc10c`
- `skills/bs-uml-master/references/layout-craft.md` — `c03bdcae428f7ef955f7ed3c68d65c27f0a7d1a85a51e1799e58e9b20b3c30dc`
- `skills/bs-uml-master/references/modeling-from-code.md` — `e10964ceaedb02fac16f77299d7edc36e2ac2037dab2faeb16a5ca46eb9fe16d`
- `skills/bs-uml-master/references/rendering-validation.md` — `d0490c6b7b446a56f4ee761647e588ede8d9453ffb9c638766bd26ac0076c1a1`
- `skills/bs-uml-master/references/svg-presentation.md` — `e3400aed86339da2ad9a8e6692727842de8fbfcb5632871d85e1d68e308dfb02`
- `skills/bs-uml-master/references/syntax-pitfalls.md` — `af16fd8a034262370976e62c28102a064a6ab4bbde4f505fc25bffd2449ad73d`
- `skills/bs-uml-master/references/text-diagrams.md` — `68ebcb460268833b13f3aa863ffc409bc599a0a4475a0b9db33ea6a78d7acab3`
- `skills/bs-uml-master/references/uml-semantics.md` — `f8b59c246cddcf17b9520c8d7e7215940432f5118c54bf9441e1023e329330de`
- `skills/bs-uml-master/scripts/check-delivery.js` — `b11a5a2bc4c188215d832d91ac4f79dae68e0170f276c625702909880cd52e5a`
- `skills/bs-uml-master/scripts/check-evidence.js` — `554563a1f4c5ec79210cc4e6236c8f373a89aa48a12cb250e5d773dcf799b2da`
- `skills/bs-uml-master/scripts/check-mermaid.js` — `938b004901b22e27d204f9afb69cf6003ee155010f7893a84f58cd453e1c9fb4`
- `skills/bs-uml-master/scripts/check-render-fit.js` — `ce446534903ec12a64f68f1a24cc31bf5796a46b44c066e13bd6e2bd837ec2b3`
- `skills/bs-uml-master/scripts/test-check-delivery.js` — `ddf300acdbf41c557eb910017826aa454b418e9e94eb4c059aedbe382f57c6e0`
- `skills/bs-uml-master/scripts/test-check-evidence.js` — `a574312ac5b0281ecfbe6a773602f53c764c1bd639826192d7921d85f0bf7aa8`
- `skills/bs-uml-master/scripts/test-check-render-fit.js` — `7be5631a90b5640f98dbdb38b89de47a3606b78dee15f0db971e82807892d749`
- `skills/bs-uml-master/scripts/test-verify-delivery.js` — `48989e956fa6d99c29c34d7f8c2c5412d2a1173b417cd3484d5de68128f3634c`
- `skills/bs-uml-master/scripts/verify-delivery.js` — `54b9a88bf7fc5123ed7ca4422643826c055e74708e4e5fc844ebad19e0c63a5e`
- `tools/peer-review.js` — `702587f408de2ff13cd994288e2b9a5da3ee2833ee9076c8ea1642670676307d`
- `tools/test-peer-review-scope.js` — `4dc00dffb1d46b4feafc43a9c3819dbfe8c134921afd3795bcfe5ba3709eb3d8`

## Required structure

```markdown
# Advocate Review: bs-uml-master

**Date**: 2026-09-02
**Reviewer Role**: Advocate
**Skill**: bs-uml-master
**HUMAN_VERIFIED**: false
**Scope Contract Version**: 1
**Reviewed Revision**: d578e78cc2b64a2829a50bd3b05cd90257756c84
**Reviewed Skill SHA-256**: 454a862bdf526571f1e5f4fafcb6bbcffdb59d5f18f69c8e55d047368843386c
**Reviewed Manifest SHA-256**: f9a4c79202155ecfa724e8fe3a87a991df7d4645e2cd3b09f806043e26d532c7

## Executive Summary

(2-4 sentences naming the strongest design choices and whether you'd ship this.)

## Evidence Reviewed

Full manifest receipt `f9a4c79202155ecfa724e8fe3a87a991df7d4645e2cd3b09f806043e26d532c7` was received and independently verified.

(Then list the files and commands actually examined or rerun.)

Do not use raw HTML blocks anywhere in the review.

## Dimension Scores

| Dimension | Score | Key Strength | Key Concern |
|-----------|------:|--------------|-------------|
| Clarity of trigger description | _/10 | | |
| Hard rules / safety gates | _/10 | | |
| Workflow correctness | _/10 | | |
| Pattern application | _/10 | | |
| Test prompt coverage | _/10 | | |
| Bundled resources | _/10 | | |
| Maintainability | _/10 | | |
| Production readiness | _/10 | | |

## Strongest Aspect

(One paragraph naming the single best design move and why it matters.)

## One Improvement

(One concrete suggestion that would meaningfully raise quality.)

## Verdict

**Verdict**: <one of: PASS / production-ready / NEEDS_POLISH>

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
9. **Position and color are semantic channels.** Readers infer meaning from position (adjacency = coupling, vertical order = hierarchy/time, flow = causality) and assume color means something — a bad layout makes false implicit claims, and decorative rainbow color makes readers hunt for meaning that isn't there. Treat rubric failures in [Layout Craft](./references/layout-craft.md) as correctness defects with the bounded repair loop and backend escalation; use color only per [Color Semantics](./references/color-semantics.md) — one declared dimension, a unified legend across the set, colorblind-safe palette, never color alone. Layout adapts to the medium's profile (the rules are viewport-parametric; conclusions legitimately invert between a PC screen and a phone); default is no color at all.

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
| "It fits — the reader just has to scroll and zoom a bit." | A gestalt diagram that needs two-axis scrolling or zooming has failed its reader. Fit one screen at ≥11px, or work the trade-off ladder (Rule 9, Layout Craft). "The medium is zoomable" waives nothing — never-assume-zoom applies to every screen medium, and the ≤3-screen scroll allowance belongs to *linear* diagrams only. |
| "I went through the rubric myself — every point passes, zero crossings." | A rubric verdict without the checker's pasted output is self-certification: the review itself becomes theater. Fit and legibility verdicts come from `check-render-fit.js` receipts; crossing counts come from looking at the render, never from a layout engine's reputation (Rules 6, 9). |
| "Different colors per box make it look richer." | Decorative rainbow is anti-information: readers hunt for a meaning that isn't there. Color encodes one declared dimension with a unified legend, or stays default (Rule 9, Color Semantics). |
| "It's basically a class diagram, drawn as a flowchart with fancy boxes." | Fake notation. If you call it a class diagram, the source starts with `classDiagram` — pseudo-class boxes in `graph TB` lose every relationship semantic (Rule 3). |
| "The page came back blank — the CDN must be flaky." | A blank or partial page is a parse error on the reader's pinned renderer until proven otherwise. Run `verify-delivery.js` on the page; it names the failing source and line. Never escape the symptom by shipping a text fallback (Rule 6, Rendering & Validation). |
| "They said the layout is bad, so this round I'll add a layer and more detail." | Critique is a subtraction signal. Measure the render, work the ladder, keep element counts non-increasing, one lever per round — and never drop the contract because the complaint was visual (Rule 9, Layout Craft). |
| "mermaid 10.6.1 is the version I know, I'll pin that." | The version you remember is training-data memory. Pin the CDN to the version your verification ran on, or verify on the pin (Rule 6, Rendering & Validation). |
| "Every element has a file:line, so the ledger is evidenced." | A citation is a claim, not a proof: `check-evidence.js` resolves each one, and an identifier absent from its own citation is the fabrication signature (Rule 2). |
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
5. Fill the output contract completely (sketch: the compressed form) in the draft — markdown, or the HTML page itself.
6. Run **one command**: `node <skill-dir>/scripts/verify-delivery.js <draft.md|page.html> --medium <profile> --repo <root>`. It parses every source on the local renderer and on the page's CDN pin, renders, fit-checks, runs `check-delivery` and `check-evidence`, and prints a receipt. Fix every FAIL; paste the receipt into the delivery verbatim. Re-run after **every** revision.
7. State line = label + tool + version + what was checked, backed by that receipt. Skipped something? Say `UNVERIFIED`, with the failed command. Look at the rendered image yourself — the tools bind format, your eyes bind truth.

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
| Any color/styling beyond the renderer's default theme | [Color Semantics](./references/color-semantics.md) |
| Before delivery | [Rendering & Validation](./references/rendering-validation.md) |

## Workflow

### Phase 0 — Frame

Read [Diagram Selection](./references/diagram-selection.md). Establish, reusing context before asking (one question at a time when asking):

- the question the diagram answers, and the reader;
- mode: `MODEL-FROM-CODE` / `MODEL-FROM-DESIGN` / `REVISE` / `EXPLAIN/REVIEW`;
- significance: `sketch` / `deliverable` / `authoritative`;
- where the diagram will live (decides the backend) **and its medium constraints**: available width/aspect ratio, zoomable or fixed (a memo/PDF page cannot zoom; chat and web renderers can), light/dark theme. **Unstated medium defaults to a landscape PC screen** (~1470×850) — never assume the reader will zoom. Page-bound media lower the practical element budget — plan for it here, not after rendering.

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

Write the diagram source from the ledger, applying [UML Semantics](./references/uml-semantics.md) for the chosen type and [Syntax Pitfalls](./references/syntax-pitfalls.md) for the chosen tool. Include: a title stating the question; labeled edges; direction chosen for the flow (call flow left→right or top→bottom, inheritance up) **and for the medium's short axis**; enumerations as enumerations. Color only per [Color Semantics](./references/color-semantics.md): one declared dimension, `classDef`/stereotype-driven (never per-node whims), unified legend, redundant encoding — or no color at all. Add a legend when using any non-obvious convention (color, stereotype, dashed-vs-solid meaning beyond UML defaults).

**Exit:** source exists for every planned diagram, each traceable to the ledger.

### Phase 4 — Validate and render

Follow [Rendering & Validation](./references/rendering-validation.md) with the chosen backend's verification recipe: syntax-check and render with the degradation ladder (local tool → installable tool → syntax check → manual review; receipts required when landing on rung 3/4), then inspect the rendered output against the inspection checklist — elements present, no truncation/overlap, title present, and the **layout rubric** from [Layout Craft](./references/layout-craft.md) (flow monotonicity, crossing budget, proximity honesty, hierarchy direction, label discipline, medium fit, density balance). Medium fit is mechanical: run `node <skill-dir>/scripts/check-render-fit.js <diagram.svg> --medium <profile>` **passing the Phase 0 medium** (named profiles in [Layout Craft](./references/layout-craft.md); `--viewport WxH` for anything unnamed; omit for the PC default — certifying fit against the wrong medium is a false receipt, and non-scrollable media like a4/slide grant no scrolling allowance even to linear diagrams). Gestalt diagrams must fit one screen at ≥11px effective label font; linear diagrams fit the cross axis and may scroll ≤3 screens along the reading axis (`--kind linear` is a claim you must be able to defend — the tool flags it when the SVG carries no sequence markers); a failure enters the trade-off ladder (split+wayfinding → compress → single-axis scroll → progressive disclosure → mural+companion), never ships silently. Two bounded repair loops, ≤5 iterations each: syntax (fix per the pitfalls module) and layout (strongest lever first: re-scope → declaration order → direction/grouping → tool hints → backend escalation). After any fix, re-run every affected check.

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
**Evidence:** [MODEL-FROM-CODE: ledger summary or path — key elements → file:line, **and every relationship edge's kind claim cited individually** (node-level evidence does not cover edges; observed failures concentrate on edges). MODEL-FROM-DESIGN: requirement references + the assumption list. REVISE: diff summary against the prior diagram]
**Fit:** [pasted `check-render-fit.js` receipt for the declared medium — canvas WxH, effective px, verdict; mandatory whenever State claims RENDER_VERIFIED on a visual backend; a FAIL verdict ships only with a recorded trade-off]
````

For multi-diagram deliveries, repeat per diagram and add one overview line on how the set fits together. For `sketch` significance the contract may compress to the source block plus the state line — never omit the state line.

Every bracketed placeholder must be replaced; an unfilled or missing field is a format-invalid delivery, not a stylistic choice. Verify mechanically before handing over: `node <skill-dir>/scripts/check-delivery.js <draft.md>` — it rejects receipt-less State lines, missing Evidence/Excluded (warns instead at sketch significance, whose compressed form is legal), declared-type-vs-source mismatches, ceiling breaches (>15 without USER-OVERRIDE; 10–15 without justification draws a warning you must still resolve), and `RENDER_VERIFIED` claims on visual backends that lack a `check-render-fit` receipt. Its element counting is heuristic — a miscount is a reason to fix the counter, never a license to trust it over your own count.

**Receipts or silence.** Any verification-flavored verdict in a delivery — medium fit, crossing count, a rubric checklist, "no truncation" — may appear only next to the pasted output of the tool that produced it (`check-render-fit.js` line for fit; the render you actually inspected for crossings/overlap). A self-graded rubric table with ✅ marks and no receipts is the delivery-layer lie moved up into the review layer; write the receipt or write nothing.

**HTML/artifact deliveries are not a bypass.** When the deliverable is an HTML page (an artifact, a report), the discipline applies in full and `verify-delivery.js` takes the page directly: it builds the markdown mirror, checks the contract the page carries, and parses every diagram on the renderer the page pins (a CDN `<script>` decides what the reader sees, not your local tool). Pin the CDN to the version you verified with; when an older pin must stay, verify on it or state the skew explicitly.

**Revising under critique.** A reader's "unreadable / too long / blank" is a measurement request, not a redraw request: run the verifier on the current delivery, work the trade-off ladder top-down, keep element counts non-increasing unless the question changed, change one lever per round with a stated diff, re-verify, and after two failing rounds ask one scoping question instead of drawing again. The contract and receipts never disappear between versions ([Layout Craft](./references/layout-craft.md), [Rendering & Validation](./references/rendering-validation.md)).

## Bundled Resources

| Resource | Purpose |
|---|---|
| [Diagram Selection](./references/diagram-selection.md) | Question→type matrix, C4 altitudes, element budget, model-vs-projection principle, backend matrix, mode gate |
| [UML Semantics](./references/uml-semantics.md) | Correctness rules per diagram type; relationship/arrow/message semantics |
| [Modeling From Code](./references/modeling-from-code.md) | Scope → read → element ledger → curation → sync check |
| [Layout Craft](./references/layout-craft.md) | Three tiers of layout levers, per-tool tactics, the 7-point rubric, bounded layout repair loop, named media profiles (viewport-parametric fit rules) |
| [Color Semantics](./references/color-semantics.md) | Color as the second semantic channel: three laws, colorblind-safe default palette, per-backend implementation, legend unification |
| [Syntax Pitfalls](./references/syntax-pitfalls.md) | Mermaid/PlantUML traps that break rendering or reverse meaning |
| [Text Diagrams](./references/text-diagrams.md) | Plain-text backend: niche, tighter budget, character-set choice, alignment verification |
| [SVG Presentation](./references/svg-presentation.md) | Publication-grade projection: model-first iron rule, authoring rules, triple verification |
| [Rendering & Validation](./references/rendering-validation.md) | Per-backend verification recipes, evidence vocabulary, degradation ladder, inspection checklist |
| `scripts/check-mermaid.js` | Browser-free Mermaid syntax checker (rung 3 of the degradation ladder; `SYNTAX_VERIFIED` at most) |
| `scripts/check-delivery.js` | Deterministic output-contract checker: receipt-bearing State line, Evidence/Excluded presence, type-vs-source consistency (Mermaid and PlantUML), element budget, color-legend discipline, fit-receipt coupling (RENDER_VERIFIED requires a check-render-fit receipt), sketch-aware — run on the draft before delivering |
| `scripts/test-check-delivery.js` | The delivery checker's regression self-test — every fixture encodes a failure vector found by review probes and acceptance runs; run after any checker change |
| `scripts/check-render-fit.js` | Screen-fit legibility gate: per-axis fit rules (gestalt vs linear), ≥11px effective font floor, reading-axis screen cap, long-range-edge detection — run on every rendered SVG |
| `scripts/test-check-render-fit.js` | The fit checker's regression self-test on synthetic SVG fixtures |
| `scripts/verify-delivery.js` | One-shot verifier: markdown or HTML in → sources extracted (HTML mirrored automatically), parsed on the local and CDN-pinned Mermaid, rendered, fit-checked for the medium, contract- and citation-checked, hash-stamped receipt out — the single entry point of the Minimum Compliant Path |
| `scripts/check-evidence.js` | Citation-integrity checker for MODEL-FROM-CODE: every `file:line` must resolve, and identifiers named on the citing line must exist in the cited file (fabrication signature otherwise) |
| `scripts/test-verify-delivery.js`, `scripts/test-check-evidence.js` | Regression self-tests for the two R7 tools (HTML mirroring, pin detection, receipt shape; citation laundering fixtures) — run after any change |

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
5. **Edge — critique-driven revision**: *"你画的这几张图布局太长了，很难看懂，重画。"* on an existing delivery — expected: agent measures first (verifier on the current render), names the failing metric, works the trade-off ladder (split/compress/direction), keeps element counts non-increasing, changes one lever, re-verifies, and states the diff; after two failing rounds asks one scoping question. Failure without skill: bigger redraw each round (more layers, more entities, decoration), contract dropped, no measurement (observed usage sample #4).
6. **Adversarial — blank page report on an HTML artifact**: *"The artifact you made shows nothing — the diagrams are blank."* — expected: agent runs the verifier against the page and its pinned CDN version, finds the source the pinned parser rejects, fixes it per the pitfalls module, re-verifies, and reports the receipt; never blames the CDN first, never silently swaps to a text/markdown fallback. Failure without skill: "CDN may be down", test/minimal pages, then a text version (observed usage sample #4).

```
