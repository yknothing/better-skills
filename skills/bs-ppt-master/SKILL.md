---
name: bs-ppt-master
description: Use when creating, revising, filling, or enhancing a PPT or slide deck whose argument, visual system, editability, details, and final artifact must be designed and verified together.
# tier: deep
---

# PPT Master

## Purpose

Turn source material into a presentation worth believing, remembering, and acting on. Treat argument, art direction, production, editability, and detail as one system. A generated `.pptx` is not success until its claims are honest, its pages form a coherent whole, its important details survive rendering, and every delivery claim is backed by evidence.

Use this Skill as the single orchestration entry for PPT work. The bundled Architecture and Exhibits modules remain authoritative for belief delta, sharp claims, title-chain progression, comparison baselines, evidence permission, and claim-ledger checks. An installed `pptx` Skill or another presentation runtime may execute part of the work, but it does not replace this control layer.

## Non-Negotiable Rules

1. **Route lifecycle before editing.** Classify the task as `CREATE`, `REVISE`, `FILL`, or `ENHANCE`; record what may change and what must survive. Inspect real input files before claiming a preservation path.
2. **Brief and evidence before pages.** Establish audience, occasion, pacing, belief/action delta, authoritative sources, brand constraints, target environment, deadline, and final format. Never invent facts, citations, customer evidence, financial results, or asset rights.
3. **Content and form co-evolve.** Do not freeze a generic outline and decorate it later. Claims, sequence, exhibits, hierarchy, visual emphasis, and page rhythm must inform one another.
4. **One canonical content model.** Maintain one source of truth for slide roles, titles, claims, evidence, assets, notes intent, and detail rules. HTML, PptxGenJS, OOXML, SVG, or other executor inputs are projections, not competing narratives.
5. **Explore directions only within authority.** For `CREATE` or an explicitly authorized visual-system change, present three materially different, comparable prototype/layout artifacts using the same real slide. Do not force three directions when `FILL`, tightly scoped `REVISE`, or fixed brand rules leave no design freedom.
6. **Calibrate before scaling.** Prove the method on representative sparse, argument, and dense/high-risk pages before producing the full deck. A direction that only works on a cover is not a system.
7. **Executor claims require evidence.** `DETECTED` means only that a candidate exists. `SUPPORTED` needs a version-bound, claim-specific capability contract. `VERIFIED` needs evidence from the current artifact. Never infer native charts, animation, media, master preservation, or target-software compatibility from a tool name or unversioned README.
8. **Detail Master intervenes four times.** Run specification, calibration, whole-deck, and delivery reviews. Check accuracy, callbacks, terminology, grid, type, color, imagery, exhibits, rhythm, editability, and intentional exceptions—not cosmetic pixel movement without consequence. Independent final review is required for V3 `PASS`.
9. **Render, repair, re-render.** Generation and structural checks do not establish visual quality. Inspect every rendered page and the deck-level contact sheet; after a fix, repeat every affected check.
10. **Unopened target software means `UNVERIFIED`.** Package integrity or LibreOffice rendering cannot prove PowerPoint, Keynote, WPS, Google Slides, or browser behavior. State the exact target tested, or state that it was not tested.

`QUICK` is allowed only when the user explicitly chooses it. Before using it, name the steps being compressed and the added risk. It never waives factual accuracy, preservation, capability truth, asset rights, file integrity, explicit rasterization consent, or required delivery checks.

### Quick Decision Record

| Surface | Quick disposition |
|---|---|
| Lifecycle, recovery, preservation smoke/report | `REQUIRED` |
| Minimum brief, canonical model, evidence and meaning boundaries | `REQUIRED` |
| Rights & Data Ledger, capability manifest, downgrade consent | `REQUIRED` |
| V1–V5 required by the frozen delivery contract | `REQUIRED` |
| Independent final Detail review for V3 `PASS` | `REQUIRED` |
| Three-direction exploration | `COMPRESSIBLE` only with explicit reduced-choice risk and a comparable artifact for each retained direction |
| Calibration set | `COMPRESSIBLE` only to the smallest set that still proves sparse/dense and highest executor risk |
| D1–D3 Detail interventions | `COMPRESSIBLE` by combining passes, never by deleting their checks |
| A method not applicable to the deck purpose | `SKIPPABLE_WITH_RECEIPT` naming why and what evidence replaces it |

For every compressed or skipped step record `step / disposition / reason / authority / added risk / compensating check / recovery consequence`. Quick without this record is not Quick mode; it is an undocumented process failure.

## Boundaries

This Skill does not embed a presentation engine, promise universal cross-software fidelity, or describe screenshots as native editable slides. It does not silently rewrite an approved business position, expose a local editor beyond loopback, send restricted material to an unapproved network service, or reuse third-party templates, fonts, icons, code, or assets without rights.

For archival, compliance, ritual, coverage-proof, education, or reader-paced material, apply the purpose-specific exceptions in [Architecture](./references/architecture.md). Completeness or retrievability may outrank persuasion; do not trim required content merely to make the deck sharper.

## Start Here: Progressive Disclosure

Read only what the task needs, but load required references before the relevant decision:

| Condition | Required reference |
|---|---|
| Any PPT task begins | [Lifecycle](./references/lifecycle.md) |
| Decision, persuasion, strategy, or claim-heavy deck | [Architecture](./references/architecture.md) |
| Data, comparison, chart, diagram, or table appears | [Exhibits](./references/exhibits.md) |
| `CREATE` or authority to change the visual system | [Art Direction](./references/art-direction.md) |
| Execution lock exists or final review begins | [Detail Master](./references/detail-master.md) |
| A file must be generated, modified, rendered, or exported | [Executor Contract](./references/executor-contract.md) |
| Any artifact will be delivered | [Verification](./references/verification.md) |

## Workflow

### Phase 0 — Route and preserve

Read [Lifecycle](./references/lifecycle.md). Classify `CREATE`, `REVISE`, `FILL`, or `ENHANCE`. Inspect all available inputs. Preserve the original or create a recoverable working copy before mutation. Record authorized changes, protected surfaces, target software, and hard delivery requirements.

Run the discovery-only probe when useful:

```bash
node scripts/capability-probe.js --json
```

Use its output only to find candidates. Complete the capability manifest in [Executor Contract](./references/executor-contract.md) before selecting an executor. If no path can satisfy the hard contract and the user has not accepted a precise downgrade, stop before production.

**Exit:** mode, preservation boundary, candidate tools, capability gaps, and unresolved decisions are explicit.

<HARD-GATE id="lifecycle-preservation-capability">
Do not mutate an existing deck or begin full production until lifecycle authority, protected surfaces, a recovery path, and executor capability gaps are explicit. Discovery-only evidence cannot clear this gate.
</HARD-GATE>

### Phase 1 — Confirm the delivery brief

Reuse known context; ask only questions whose answers change the deck, one at a time. Record:

- audience, decision or use occasion, and who controls pacing;
- what the audience believes now and should believe, remember, or do afterward;
- authoritative source files, evidence limits, and research permission;
- brand, voice, language, confidentiality, and asset-rights constraints;
- target software, screen/room, aspect ratio, deadline, and final formats;
- success criteria for both the presentation and the file.

Create the first Detail Ledger entries for canonical names, terms, figures, dates, units, sources, brand invariants, callbacks, and target constraints. Freeze the Delivery Contract in [Verification](./references/verification.md), and begin the Rights & Data Ledger in [Executor Contract](./references/executor-contract.md).

**Exit:** the brief is sufficient to make architecture and execution choices without guessing.

### Phase 2 — Discover the presentation insight

For decision, persuasion, strategy, and other claim-heavy work, read [Architecture](./references/architecture.md) and use the bundled claim ledger. Define the belief/action delta, evidence permissions, sharp main claim, credible counter-position, load-bearing pillars, declarative title chain, page roles, and exhibit jobs. For other document purposes, apply the module's Phase 0 exceptions instead of forcing a persuasion architecture.

When quantitative or comparative material appears, read [Exhibits](./references/exhibits.md). Choose comparison baselines before chart types, encode the difference rather than forcing mental arithmetic, prefer distributions and honest uncertainty, and require each visual to reveal more than a sentence can carry.

Run the ledger checker before drafting claim-led pages:

```bash
node scripts/check-claim-ledger.js claims.md
```

If pages already exist in `REVISE` or `FILL`, do not destroy protected content to satisfy this ordering. Instead, diagnose the existing architecture, keep preserved surfaces intact, and apply improvements only inside the authorized scope.

**Exit:** every planned page has a cognitive job, evidence boundary, and place in the whole.

<HARD-GATE id="brief-insight-before-new-pages">
Do not draft new claim-led pages until the brief, belief/action delta, evidence permission, and page roles exist. In `REVISE` or `FILL`, diagnose existing pages without violating the preservation contract; never rebuild protected surfaces merely to satisfy phase order.
</HARD-GATE>

### Phase 3 — Choose and lock art direction

Read [Art Direction](./references/art-direction.md) when design freedom exists. Derive three complete directions from the same canonical content model and apply them to the same real, high-information slide as comparable rendered prototypes or auditable layout artifacts. A direction changes narrative mode, composition, type-color logic, imagery/exhibit grammar, and rhythm—not merely a palette or font.

Present fit, advantage, risk, representative-slide treatment, and executor implications for each. After the user chooses or authorizes a hybrid, resolve conflicts into one governing principle and write an execution lock covering hierarchy, visual grammar, page rhythm, capability boundary, and intentional exceptions.

When design freedom is constrained, document the inherited system and treat it as the execution lock. Do not stage a false choice.

**Exit:** one implementable direction is approved or inherited, with risks and executor implications visible.

### Phase 4 — Calibrate representative slides

Build a small calibration set before the whole deck: usually a cover/opening, a representative argument page, and the densest or technically riskiest exhibit page. The set must prove both sparse and dense states.

Run the calibration intervention from [Detail Master](./references/detail-master.md). Check hierarchy, grid, typography, color semantics, image treatment, exhibit grammar, callbacks, editability, and target-distance readability. Render the pages through the intended path. If implementation requires an unacceptable raster or preservation downgrade, return to Direction or Executor Selection.

**Exit:** the method, not just one attractive page, is viable and approved.

### Phase 5 — Produce from one canonical model

For every slide record at least: stable ID, role, declarative title, audience-state change, claim/evidence anchors, content hierarchy, exhibit/visual intent, source and asset references, notes intent when relevant, detail rules, and intentional exceptions.

Project that model into the chosen executor. Keep `REVISE` and `FILL` preservation lists beside production work. Check changes incrementally; never rebuild protected master/layout/placeholder relationships merely because generation is easier. If multiple formats need different physical implementations, keep their semantic intent synchronized through the canonical model.

Run the whole-deck Detail Master intervention before declaring production complete.

**Exit:** every page is produced, traceable to the canonical model, and within the preservation and capability contracts.

### Phase 6 — Verify, repair, and deliver

Read [Verification](./references/verification.md). Run V1–V5 as separate evidence layers:

- **V1 Content and evidence**
- **V2 Narrative and decision**
- **V3 Detail and visual rendering**
- **V4 Native file and package integrity**
- **V5 Target-environment delivery**

Each layer is `PASS`, `BLOCKED`, or `UNVERIFIED`. A failed check routes back to its owning phase. Use a limited sequence of materially different fixes; do not hide failure by weakening the claim. Re-render and recheck every affected surface. Final Detail Master review must be performed by an independent reviewer or a fresh isolated context and bound to the final artifact through a review receipt.

Allowed terminal states:

- `DELIVERED` — every required V-layer passed.
- `DELIVERED_WITH_ACCEPTED_LIMITATIONS` — the user explicitly accepted named limitations and all remaining required layers passed.
- `BLOCKED` — a required fact, right, preservation guarantee, capability, file, or target validation cannot be obtained.
- `DESIGN_ONLY` — the user requested or accepted design/specification without a final PPTX.

<HARD-GATE id="evidence-before-delivered">
Do not report `DELIVERED` unless every required V-layer passed on the final artifact after the last relevant change. Never relabel `UNVERIFIED` as `PASS`, omit a missing target check, or treat repository Gate 1–4 as deck verification.
</HARD-GATE>

## Output Contract

```markdown
## PPT Master Delivery

**Terminal:** DELIVERED | DELIVERED_WITH_ACCEPTED_LIMITATIONS | BLOCKED | DESIGN_ONLY
**Mode:** CREATE | REVISE | FILL | ENHANCE
**Direction:** [name or inherited system]
**Primary artifact:** [path or none]
**Target:** [software/version/environment]

### Delivered
- [PPTX, previews/contact sheet, source or other agreed artifacts]

### Frozen delivery contract
- Required V-layers and target: [set]
- Authorized changes, if any: [approver/authority/time/exact loss]

### V1–V5
- V1 Content and evidence: PASS | BLOCKED | UNVERIFIED — [evidence]
- V2 Narrative and decision: PASS | BLOCKED | UNVERIFIED — [evidence]
- V3 Detail and visual rendering: PASS | BLOCKED | UNVERIFIED — [evidence]
- V4 Native file and package integrity: PASS | BLOCKED | UNVERIFIED — [evidence]
- V5 Target environment: PASS | BLOCKED | UNVERIFIED — [evidence]

### Capability truth
- Promised-object closure: [promised / native / hybrid_or_raster / unsupported / unclassified=0]
- Native editable: [verified objects]
- Hybrid or rasterized: [elements and accepted trade-offs]
- Unsupported or unverified: [claims not made]

### Detail Report
- Verified details: [accuracy, callbacks, system, rhythm, editability]
- Repaired issues: [issue -> evidence after repair]
- Intentional exceptions: [exception -> narrative purpose]

### Rights, privacy, and remaining risks
- Rights & Data Ledger: [closed items and USER_ATTESTED items]
- Preservation Report: [original/final identities and surface states]
- [sources, licenses, data boundary, recovery path, residual limitations]
```

Never omit `UNVERIFIED` layers from the report. Absence of evidence is not a pass.

## Bundled Resources

| Resource | Purpose |
|---|---|
| [Lifecycle](./references/lifecycle.md) | Mode authority, preservation, recovery, and one-question routing |
| [Architecture](./references/architecture.md) | Belief delta, claim sharpness, load-bearing argument, title chain, and evidence permission |
| [Exhibits](./references/exhibits.md) | Baselines, incompressibility, tables/charts, self-sufficiency, and manipulation red lines |
| [Art Direction](./references/art-direction.md) | Direction schema, execution lock, calibration, and anti-template standards |
| [Detail Master](./references/detail-master.md) | Detail Ledger, four interventions, slide/contact-sheet review, and Detail Report |
| [Executor Contract](./references/executor-contract.md) | Capability evidence, executor selection, native/hybrid/raster truth, rights, and downgrade consent |
| [Verification](./references/verification.md) | V1–V5 evidence, repair routing, target validation, and terminal states |
| `scripts/check-claim-ledger.js` | Deterministic structural subset of the Architecture contract |
| `scripts/test-checker.sh` | Claim-ledger regression suite |
| `scripts/capability-probe.js` | Discovery-only candidate inventory; never capability verification |
| `assets/claims.example.md` | Worked L2 claim ledger |
| `assets/claims.l0-example.md` | Minimum legitimate L0 claim ledger |

## Patterns

- **hard-rules-first** — Truth, preservation, and verification constraints precede production.
- **progressive-disclosure** — Specialized methods load only when their decision becomes active.
- **verification-rules** — V1–V5 and the claim checker distinguish evidence from assertion.
- **confidence-anchors** — Claims and capability states use fixed evidence vocabularies.
- **named-anti-patterns** — False directions, silent downgrade, preservation loss, and detail theatre are named and reviewable.
- **format-significance-gates** — Lifecycle and delivery significance determine process depth.
- **multi-perspective-review** — Architecture, design, Detail Master, and independent delivery review challenge different failure modes.
- **80-20-design-rules** — Review prioritizes details that materially affect truth, comprehension, trust, and finish.

## Dependencies and Degradation

- Node.js 18+ runs the bundled checker and discovery probe. Without it, perform their documented checks manually and mark the automated evidence `UNVERIFIED`.
- No presentation runtime, font library, renderer, or network service is bundled.
- If file writes are unavailable, deliver a `DESIGN_ONLY` canonical model and reports; do not claim PPTX completion.
- If target software or an independent reviewer is unavailable, mark the affected V-layer `UNVERIFIED`.
- If user interaction is temporarily unavailable, stop at the first choice that would alter lifecycle authority, art direction, rights, or downgrade acceptance.

## Self-Review

Before handoff, verify:

- mode and preservation boundaries were recorded before mutation;
- claim and evidence strength match the source material;
- visual direction is traceable to the brief and execution lock;
- the canonical model, produced deck, and reports agree;
- all four Detail Master interventions were completed or explicitly blocked;
- independent-review receipt matches the final artifact and render/contact sheet before V3 `PASS`;
- every promised native capability has current-artifact evidence;
- promised-object closure has `unclassified=0` and output-class roll-up is honest;
- every modified page and the contact sheet were rechecked after the last fix;
- V1–V5 evidence names the real target, tool, file, and check performed;
- Rights & Data Ledger, Preservation Report, restricted-data handling, and recovery path are closed;
- the terminal state follows from the evidence rather than from schedule pressure.
