# PPT Master Skill Design

## Objective

Promote the existing `bs-ppt-architecture` into `bs-ppt-master`: the repository's single, full-lifecycle PPT control plane for turning source material into a rigorous, visually exceptional, editable, and verified presentation.

The Skill must combine three qualities that are usually separated:

- **insight** — find the non-obvious point, belief change, decision, or story worth presenting;
- **design mastery** — turn that insight into a coherent visual language rather than decorate a generic outline;
- **detail mastery** — protect the meaningful details that reveal accuracy, intention, consistency, and care.

Its success condition is not that a `.pptx` file exists. A successful run produces a presentation whose content is supportable, whose architecture changes the audience's state, whose visual system serves the argument, whose important details survive deck-wide inspection, and whose actual editability and playback capabilities match the claims made at delivery.

## Product Identity

### Canonical ID

`bs-ppt-master`

### Display name

`PPT Master`

### Product promise

Turn material into a presentation worth believing, remembering, and acting on.

### Naming and migration

`master` is warranted because the Skill owns the whole PPT outcome: architecture, art direction, production orchestration, detail control, and verification. It does not imply that one embedded renderer can perform every PowerPoint feature.

The current `bs-ppt-architecture` becomes the internal Architecture module and a direct historical alias:

```text
bs-ppt-architecture -> bs-ppt-master
```

The alias must be flat. `bs-ppt-architecture` must not remain a canonical registry entry or point through another alias. Existing review records and historical design documents remain historical records; current registry, evaluation, documentation, CLI contracts, and active Skill paths move to `bs-ppt-master`.

The external `pptx` reference remains a separate executor capability, not a second user-facing PPT workflow. `bs-ppt-master` is the public orchestration entry and may delegate production work to that executor when its probed capabilities satisfy the current delivery contract.

## Design Doctrine

1. **Substance and form are one system.** Content architecture cannot be completed first and handed to visual design as decoration. Claim, sequence, exhibit, layout, and emphasis must co-evolve.
2. **Design begins with insight, not a template.** The visual language must grow from the audience, occasion, thesis, evidence, and desired belief or action change.
3. **Native-first is the default truth.** The terminal artifact should be a verified, as-native-as-practical editable `.pptx`. HTML is an authoring and review surface, not the default terminal deliverable.
4. **Every capability claim is evidence-bound.** Native charts, animations, media, master preservation, or cross-application compatibility may be claimed only after the selected executor and resulting artifact are checked.
5. **Meaningful detail is never an afterthought.** Accuracy, callbacks, terminology, alignment, rhythm, asset treatment, and style coherence are first-class quality dimensions.
6. **Consistency is not uniformity.** A controlled exception can create emphasis, transition, or climax. An unexplained exception is drift.
7. **One canonical content source.** Narrative intent, claims, slide roles, evidence, and asset relationships must not fork across multiple design variants or export formats.
8. **No silent downgrade.** Rasterized pages, lost animations, substituted fonts, unsupported media, or unpreserved masters must be disclosed before acceptance, not buried after export.
9. **Generation is not completion.** A deck must be rendered, inspected, repaired, and re-verified.

## Source Synthesis and Clean-Room Boundary

The Skill synthesizes methods from three primary references without copying their runtimes, prompts, templates, fonts, or assets.

| Reference | Methods to absorb | Boundary and limitation to retain |
|---|---|---|
| [`hugohe3/ppt-master`](https://github.com/hugohe3/ppt-master) | Distinct Generate/Create Template/Fill/Enhance routes; audience-first briefing; three complete directions; separation between design specification and execution lock; first-page calibration; failure ownership and resume discipline; native-object ambition. | Treat the large runtime as an optional external executor, not bundled implementation. Probe each native feature. Do not infer complete SmartArt, chart, animation, or video support from broad marketing claims. Preserve required notices if an adapter ever invokes a separately installed copy. |
| [`chuspeeism/dashi-ppt-skill`](https://github.com/chuspeeism/dashi-ppt-skill) | One semantic content source projected into variants; layout matching by content shape and capacity; full-deck diversity allocation; constrained custom layouts; layered schema/content/asset/render QA; browser editor as an iteration surface. | Clean-room the ideas only. The root project is AGPL-3.0 and its `html-deck-to-pptx` package declares proprietary restrictions. Never copy or extract code, templates, assets, or fonts. Raster fallback and published fidelity scores are not evidence for this Skill's output. |
| [`jimliu/baoyu-design`](https://github.com/jimliu/baoyu-design) | Title spine before page production; fixed-canvas HTML iteration; design tokens; localhost point-and-edit workflow; semantic animation annotations; editable-versus-screenshot export truth; structural and visual verification. | Absorb only the PPT-specific loop, not the broad design operating system or giant prompt. HTML-to-PPTX remains a hybrid mapping: unsupported SVG, canvas, gradients, or arbitrary HTML may rasterize. Retain dependency notices when independently installed tools are used. |

The existing `bs-ppt-architecture` remains the authoritative local source for belief delta, sharp claims, load-bearing pillars, title-chain progression, comparison baselines, exhibit incompressibility, evidence honesty, and its tested claim-ledger checker.

## Scope and Boundaries

### In scope

- creating a new deck from a brief, source files, notes, or data;
- revising an existing deck while preserving all unapproved surfaces;
- filling a provided template while respecting masters, layouts, placeholders, and brand rules;
- enhancing an existing deck's argument, design, detail, and delivery readiness;
- research and evidence handling when authorized and necessary for deck accuracy;
- narrative architecture, exhibit design, art direction, production orchestration, speaker-support surfaces, and final QA;
- truthful delivery of editable PPTX, preview artifacts, and capability limitations.

### Out of scope unless separately requested and supported

- inventing facts, data, citations, customer evidence, or financial results;
- silently rewriting approved business positions or brand rules;
- claiming universal compatibility across PowerPoint, Keynote, WPS, Google Slides, or web renderers;
- treating an entire screenshot page as natively editable;
- copying third-party templates, brand assets, icons, fonts, or code without applicable rights;
- embedding a complete presentation runtime into Better-Skills;
- deploying a local editor to a public interface or binding it beyond loopback without explicit authorization;
- presentation coaching, live rehearsal, narration recording, or distribution unless requested as an additional deliverable.

## Lifecycle Router and Preservation Contracts

The first decision is the lifecycle mode. Each mode has a different mutation contract.

| Mode | Use when | Freedom | Preservation contract |
|---|---|---|---|
| `CREATE` | No authoritative deck exists, or the user explicitly wants a replacement | Highest | Preserve source truth, brand constraints, delivery environment, and user-approved direction. |
| `REVISE` | An existing deck should change in named ways | Bounded | Change only authorized slides, claims, or systems. Preserve untouched content, notes, masters, links, media, and behaviors unless a verified technical constraint requires a disclosed migration. |
| `FILL` | Content must be placed into an existing template | Low | Preserve masters, layouts, placeholders, brand tokens, slide dimensions, and template behaviors. Do not rebuild merely because the executor finds replacement easier. |
| `ENHANCE` | The deck is substantively usable but needs stronger insight, design, consistency, or finish | Medium | Improve without silently changing factual meaning, approved intent, brand identity, or audience commitment. Every material meaning change requires confirmation. |

When the mode is ambiguous, inspect the artifact and ask one focused question. Do not collapse `REVISE`, `FILL`, and `ENHANCE` into a generic "edit" route.

## Core Architecture

```text
bs-ppt-master
|-- Architecture
|   |-- audience, occasion, belief/action change
|   |-- claim ledger and evidence permission
|   |-- narrative spine and title chain
|   `-- exhibit logic and page roles
|-- Art Direction
|   |-- three complete creative directions
|   |-- typography, color, composition, imagery
|   `-- chart, table, diagram, and motion grammar
|-- Production
|   |-- lifecycle preservation contract
|   |-- capability probe and executor selection
|   `-- canonical content projection and generation
|-- Detail Master
|   |-- content accuracy and cross-slide callbacks
|   |-- visual-system consistency and intentional exceptions
|   `-- deck rhythm, editability, and delivery finish
`-- Verification
    |-- content and evidence
    |-- narrative and detail
    |-- visual rendering
    |-- native artifact
    `-- target-environment delivery
```

`SKILL.md` owns routing, hard boundaries, the shared workflow, stop conditions, and the output contract. Specialized reasoning is progressively disclosed through focused references:

```text
skills/bs-ppt-master/
|-- SKILL.md
|-- references/
|   |-- architecture.md
|   |-- art-direction.md
|   |-- detail-master.md
|   |-- lifecycle.md
|   |-- executor-contract.md
|   `-- verification.md
|-- scripts/
|   |-- check-claim-ledger.js
|   |-- test-checker.sh
|   `-- capability-probe.*
`-- assets/
    `-- existing claim-ledger fixtures
```

The exact probe implementation is selected during planning after inventorying existing repository and installed PPT tooling. Add a script only when it provides deterministic evidence that prose cannot provide as reliably. Do not create a rendering engine or asset collection under this Skill.

## Standard Workflow

### Phase 0: Route and probe

1. Classify the work as `CREATE`, `REVISE`, `FILL`, or `ENHANCE`.
2. Inspect named inputs and preserve the original artifact or a recoverable copy before mutation.
3. Probe available executors, renderers, and validation utilities.
4. Compare actual capabilities with the user's hard delivery requirements.
5. Stop before production if no route can meet the contract and the user has not approved a named downgrade.

Exit condition: lifecycle, preservation boundary, available capabilities, and unresolved limitations are explicit.

### Phase 1: Confirm the delivery brief

Before pages are created, confirm:

- audience and decision context;
- speaker-paced, reader-paced, or hybrid use;
- what the audience believes now;
- what they should believe, remember, or do afterward;
- source-of-truth files and evidence constraints;
- brand and tone constraints;
- target application, screen, room, aspect ratio, deadline, and terminal formats.

Reuse known context and ask one question at a time only when the answer changes the deck. This is the first interaction gate.

### Phase 2: Discover the presentation insight

Apply the current Architecture module before visual production:

- establish the belief delta and requested action;
- distinguish fact, inference, forecast, recommendation, and unsupported gap;
- sharpen the main claim and record credible opposition;
- build the claim ledger and evidence permission;
- select no more than three load-bearing pillars unless the document class requires completeness;
- write the title chain as a continuous argument;
- give each slide a cognitive job and each exhibit a comparison or explanatory job.

For archival, compliance, educational, or reader-paced material, retain the existing Phase 0 exceptions from `bs-ppt-architecture`; do not force a persuasion structure onto the wrong document class.

### Phase 3: Present three complete creative directions

Present three genuinely different directions. Each direction includes:

- narrative mode;
- visual thesis and references expressed as principles, not copied templates;
- type, color, composition, image, and whitespace logic;
- chart, table, diagram, and annotation grammar;
- visual carrier choices;
- one representative page or sufficiently concrete sample treatment;
- fit, advantage, risk, and executor implications.

Changing only palette or typography does not create a new direction. The user may select one direction or explicitly request a reconciled hybrid. If a hybrid introduces conflict, resolve the governing principle before proceeding.

This is the second interaction gate. The selected direction becomes an execution lock so the deck does not drift page by page.

### Phase 4: Calibrate the method

Produce a small calibration set before the full deck:

- the cover or opening frame;
- a representative argument page;
- the densest or most technically risky exhibit page.

The calibration must prove that the visual system works for both sparse and rich pages, that the selected executor can realize it without unacceptable downgrade, and that the Detail Ledger is actionable. Fix the method before scaling the deck.

### Phase 5: Produce from one canonical content model

Maintain one canonical presentation model containing, per slide:

- slide ID and role;
- declarative title and audience-state change;
- claim and evidence anchors;
- content hierarchy;
- exhibit or visual intent;
- source and asset references;
- speaker-note intent when applicable;
- detail rules and intentional exceptions.

Executor-specific HTML, PptxGenJS, SVG, OOXML, or other source is derived production material. It must not become a competing truth surface for narrative content. If the executor requires an incompatible model, stop and reconcile rather than allow two silently diverging decks.

### Phase 6: Verify, repair, and deliver

Run all applicable delivery checks below. A generated artifact that fails a check returns to the responsible phase. Re-render and re-check every repair. Stop after a bounded number of materially distinct attempts and report the blocking constraint instead of cycling cosmetically.

## Art Direction Contract

High design quality is not tied to visual richness. A minimal deck and a dense editorial deck both require deliberate control of:

- visual hierarchy and the first three seconds of perception;
- grid, alignment, spacing, scale, and whitespace;
- typography hierarchy, measure, line breaks, and language-specific composition;
- semantic color and sufficient contrast;
- image selection, crop, focal point, provenance, and resolution;
- chart baseline, annotation, scale, uncertainty, and visual emphasis;
- diagram topology, connector clarity, and reading order;
- page-to-page rhythm, density, repetition, surprise, and climax;
- projector-distance readability and the target display environment.

Named anti-patterns include generic gradient backgrounds, ornamental card grids, equal-weight columns, unexplained icon sets, default office charts, decorative diagrams, full-page prose, and visual novelty that fights the argument.

The Skill does not impose one house style. Commercial restraint, editorial sophistication, cinematic drama, technical precision, cultural expression, or another coherent language may be correct when it serves the task.

## Detail Master

Detail Master is an always-on internal role, not a cosmetic final pass. It protects the details that change accuracy, understanding, credibility, style, or completion.

### Detail Ledger

After the delivery brief and selected direction, create a compact ledger containing:

- canonical names, terminology, capitalization, acronyms, and language rules;
- critical numbers, dates, units, denominators, decimal precision, and source anchors;
- concepts introduced early that require a later answer or callback;
- brand tokens and visual invariants;
- grid, typography, spacing, color, icon, image, chart, and diagram rules;
- intentional exceptions and the narrative reason for each;
- target-environment and accessibility constraints.

### Four intervention points

1. **Specification** — validate people, facts, figures, thesis, terminology, sources, and promises before direction lock.
2. **Calibration** — inspect hierarchy, grid, spacing, type, color semantics, crop, and sparse-versus-dense consistency on the representative pages.
3. **Full-deck coherence** — inspect title chain, callbacks, section transitions, terminology, legends, symbols, citation form, density, pacing, and climax distribution.
4. **Delivery** — inspect per-slide renders and a whole-deck contact sheet; test overflow, collisions, line breaks, contrast, font substitution, master relationships, editable objects, media, notes, and package integrity.

### Detail rules

- Uniformity is not the goal. A deliberate variation with a documented purpose is valid.
- Pixel movement without cognitive or delivery impact is not mastery. Prioritize consequential details.
- A correction is unverified until the artifact is rendered and inspected again.
- When sub-agents are available, the final Detail Master pass should be independent from the producer. Otherwise use a fresh, separated review context rather than the production context self-certifying its own work.

The delivery includes a compact Detail Report listing verified high-impact details, repaired defects, intentional exceptions, and remaining limitations.

## Executor Contract

`bs-ppt-master` is a control plane with pluggable executors. It does not assume one executor is best for every lifecycle or environment.

### Capability manifest

An executor is eligible only when its capabilities can be discovered or demonstrated. The adapter manifest must cover:

- supported lifecycle modes;
- ability to read and preserve an existing PPTX;
- text, shape, image, table, chart, diagram, animation, audio, and video behavior;
- master, layout, placeholder, notes, link, and font behavior;
- object-level native, hybrid, or raster output classification;
- preview rendering and structural validation path;
- required dependencies, network access, local services, and target applications;
- licensing, attribution, and asset constraints;
- known failure modes and degradation behavior.

### Selection order

1. An executor explicitly selected by the user, if it satisfies the contract.
2. Actual environment capability probe.
3. Lifecycle and preservation fit.
4. Native editability and round-trip fidelity.
5. Required visual, data, media, and interaction features.
6. Target-application verification support.
7. Cost and speed.

The existing external `pptx` Skill is the baseline editable-PPTX executor when installed and capable. Separately installed `ppt-master`, Dashi, Baoyu-style HTML, or other systems may be integrated through adapters; none becomes a hidden hard dependency.

### Downgrade contract

If no executor satisfies a hard native-first requirement, the Skill must present the concrete gap and bounded choices, such as:

- change the design to use supported native objects;
- install or select a capable executor;
- accept a hybrid artifact with named rasterized elements;
- explicitly accept a screenshot-only deck;
- deliver a reviewed authoring artifact without claiming final PPTX readiness.

Screenshot-only export is never described as editable PPTX. User consent must name the lost capabilities.

## Verification Contract

These five delivery checks are the PPT artifact's internal verification layers. They are distinct from Better-Skills' four repository release gates.

### V1: Content and evidence

- claims match source material and permitted evidence;
- names, numbers, dates, units, denominators, qualifiers, and citations are accurate;
- uncertainty and unsupported gaps are visible;
- slide titles and body content do not contradict one another;
- no asset or statistic is presented with invented provenance.

### V2: Narrative and decision

- the deck matches its speaker-paced, reader-paced, educational, archival, compliance, or decision purpose;
- the belief or action delta is explicit where applicable;
- the title chain forms a coherent progression;
- load-bearing pages survive deletion tests and redundant inventory is removed or annexed;
- opening promises, transitions, and ending conclusions answer and reinforce one another.

### V3: Detail and visual render

- every slide is rendered and inspected at readable size;
- the whole deck is inspected as a contact sheet for rhythm, repetition, drift, and climax;
- layout, type, color, images, charts, tables, diagrams, and annotations follow the locked visual grammar;
- overflow, collision, clipping, unsafe margins, weak contrast, accidental inconsistency, and broken assets are absent;
- intentional exceptions are documented and defensible.

### V4: Native artifact

- the PPTX package opens and has valid internal relationships;
- masters, layouts, slide size, notes, links, media, and fonts behave as claimed;
- each promised editable element is inspected at object level;
- rasterized or flattened elements are enumerated;
- no missing or external temporary path is required for playback;
- save-and-reopen does not silently corrupt the artifact.

### V5: Target-environment delivery

Microsoft PowerPoint is the default truth baseline. Keynote, WPS, Google Slides, LibreOffice, or browser compatibility is best-effort unless actually opened and verified in that environment. The Capability Report records the applications and behaviors that were tested.

If the target application is unavailable, report the gate as unverified rather than passed. Package validation or LibreOffice rendering is useful evidence but does not prove PowerPoint-perfect playback.

## Output Contract

A standard successful delivery contains:

- the verified `.pptx`;
- a whole-deck preview or contact sheet;
- a concise Detail Report;
- a Capability Report stating native, hybrid, rasterized, unsupported, and unverified features;
- source and asset-rights notes when external evidence or assets were used;
- HTML, PDF, or other derived artifacts only when requested or operationally useful.

Conversational completion must state:

```markdown
## PPT Master Delivery

**Mode:** CREATE | REVISE | FILL | ENHANCE
**Direction:** ...
**Primary artifact:** ...
**Target verified:** ...

### What was delivered
- ...

### Verification
- Content and evidence: PASS | BLOCKED | UNVERIFIED
- Narrative and decision: PASS | BLOCKED | UNVERIFIED
- Detail and visual: PASS | BLOCKED | UNVERIFIED
- Native artifact: PASS | BLOCKED | UNVERIFIED
- Target environment: PASS | BLOCKED | UNVERIFIED

### Capability truth
- Native editable: ...
- Hybrid or rasterized: ...
- Unsupported or unverified: ...

### Meaningful detail
- Verified or intentionally exceptional: ...

### Remaining risks
- ...
```

Allowed terminal states are:

- `DELIVERED` — all required delivery checks passed;
- `DELIVERED_WITH_ACCEPTED_LIMITATIONS` — the user explicitly accepted named limitations and all remaining required delivery checks passed;
- `BLOCKED` — a required capability, fact, asset right, preservation guarantee, or target-environment verification could not be obtained;
- `DESIGN_ONLY` — the user requested or accepted a direction/specification without a final PPTX.

## Quick Mode

`QUICK` is explicit and never the silent default. It may compress direction exploration and calibration only after the Skill states:

- which standard steps will be skipped;
- which quality or preservation risks increase;
- which final delivery checks remain mandatory;
- whether the shortened process reduces resumability or increases rework.

Quick mode never waives factual accuracy, capability truth, asset rights, artifact integrity, or explicit screenshot-downgrade consent.

## Failure Handling and Resume

Failures belong to named phases:

- missing or contradictory evidence returns to Insight;
- an incoherent direction returns to Art Direction;
- a design the executor cannot realize returns to Direction or Executor Selection;
- local layout defects return to Production;
- deck-wide drift returns to Detail Master;
- broken object relationships or unsupported features return to Executor Selection or Production;
- target-application failure returns to Production or becomes an explicit limitation choice.

Record the selected direction, execution lock, capability manifest, canonical deck model, Detail Ledger, and latest gate results so the work can resume without repeating approved decisions. Never solve a renderer failure by silently weakening the delivery claim.

## Security, Privacy, and Rights

- Treat unpublished business, customer, financial, personnel, legal, and product material according to applicable project instructions and user authority.
- Minimize transmission to network-backed executors. Disclose when an executor requires external services.
- Bind local review servers to loopback by default and shut them down after use.
- Do not place secrets, credentials, hidden comments, or temporary local paths into the deck package.
- Record the provenance and usage right for third-party images, icons, fonts, data, and templates.
- Do not vendor or copy code or assets from the three research references. Integrations invoke separately installed tools through adapters and retain applicable notices.
- Keep source artifacts recoverable during `REVISE`, `FILL`, and `ENHANCE`.

## Repository Integration

Implementation must update every current truth surface without rewriting historical evidence:

- rename `skills/bs-ppt-architecture/` to `skills/bs-ppt-master/` and update frontmatter, H1, bundled links, script help, and fixtures;
- expand the Skill with the approved modules while preserving the current architecture logic and checker coverage;
- replace the canonical registry key and batch member in `skills.json`;
- add the direct `bs-ppt-architecture -> bs-ppt-master` alias and enforce canonical/alias invariants;
- update CLI expected IDs and display names;
- migrate the current evaluation key and add full-lifecycle evaluation cases;
- create current Gate 2 reviews under `docs/reviews/bs-ppt-master/` while preserving the old review directory as historical evidence or linking it according to the repository's review convention;
- update README, project documentation, active insight links, and any current path references;
- preserve the external `pptx` source declaration unchanged;
- exclude unrelated user-owned dirty files from every commit.

Historical specs and review documents may retain the old name where they describe the old state. Any moved historical path must keep links resolvable. The implementation inventory must distinguish historical references from stale current truth.

## Evaluation Strategy

The evaluation dataset should cover at least these independent behaviors:

1. **Create a strategic decision deck** — requires belief delta, claim ledger, three distinct directions, calibration, native-first production, and all five delivery checks.
2. **Transform dense quantitative material** — produces exhibits with explicit baselines, honest uncertainty, accurate data, and readable high-density composition.
3. **Revise a fragile corporate deck** — changes only named surfaces and preserves untouched masters, notes, links, and media.
4. **Fill a supplied template** — retains layouts and placeholders rather than rebuilding a lookalike.
5. **Enhance a correct but visually weak deck** — improves hierarchy and finish without changing factual meaning.
6. **Catch cross-slide contradiction** — Detail Master identifies inconsistent dates, terminology, totals, or conclusions before delivery.
7. **Protect callback and style coherence** — finds an unclosed opening promise and unexplained visual drift.
8. **Reject a false native claim** — executor cannot provide native charts or animation, so the Skill blocks or obtains explicit downgrade consent.
9. **Accept a named hybrid downgrade** — user knowingly accepts specific rasterized elements and receives an accurate Capability Report.
10. **Fail honestly on target compatibility** — artifact can be structurally validated but PowerPoint is unavailable, so the delivery gate remains `UNVERIFIED`.
11. **Respect asset rights and privacy** — disallows copied proprietary templates and prevents sensitive source material from being sent to an unapproved network executor.
12. **Quick-mode pressure** — compresses exploration without waiving truth, rights, or verification.

Deterministic checks cover schema, registry, aliases, links, package structure, capability manifests, and required output fields. Qualitative dimensions such as insight, coherence, visual distinction, detail judgment, and aesthetic quality require an opt-in LLM or human visual judge with rendered artifacts. A claim that the Skill outperforms the external `pptx` baseline requires a real A/B run, not architectural inference.

## Review and Acceptance

The implementation is accepted only when:

1. `bs-ppt-master` is the sole current self-developed PPT orchestration entry, `bs-ppt-architecture` resolves directly to it, and the external `pptx` executor remains separately declared.
2. Frontmatter, path, H1, registry, evaluation, docs, reviews, and CLI contracts agree.
3. Existing claim-ledger behavior and tests remain intact.
4. The Skill does not vendor or copy code, templates, fonts, or assets from researched repositories.
5. Lifecycle preservation, capability probing, screenshot downgrade consent, Detail Master, and five-layer delivery verification are explicit and tested.
6. Gate 1 passes with valid portable YAML, valid references, and runtime loadability.
7. Two independent sub-agents complete Gate 2: one advocate and one adversary. The adversary must specifically attack capability inflation, raster masquerading, preservation loss, aesthetic genericness, and self-certified detail QA.
8. Gate 3 reports no hard alignment failure.
9. Gate 4 passes all new deterministic cases; qualitative and A/B claims remain scoped to evidence actually collected.
10. A separate read-only final reviewer inventories the whole repository and reports no blocking stale current reference, missing path, alias chain, rights violation, or unrelated staged file.
11. Changes are committed in clean logical batches with human- and agent-readable messages before an authorized push.

## Explicitly Rejected Architectures

### Keep `bs-ppt-architecture` and add a separate visual/render Skill

Rejected because users would have to understand and coordinate overlapping entry points. Architecture and visual design would drift into a handoff rather than co-evolve.

### Bind the Skill only to the external `pptx` executor

Rejected because it makes the Skill simpler at the cost of a lower and environment-dependent ceiling. The baseline executor remains useful, but it cannot define the product architecture.

### Vendor a complete proprietary or copyleft presentation runtime

Rejected because the repository would inherit unnecessary size, maintenance, license, asset, and security obligations. The control plane should remain executor-neutral and evidence-bound.

### Make HTML or screenshot export the default

Rejected because pixel fidelity would masquerade as editability and weaken the user's native-first delivery requirement.

## Planning Handoff

After the user reviews and accepts this specification, implementation planning should use the repository's `writing-plans` workflow. The plan must begin with a full current-reference inventory, identify reusable files from `bs-ppt-architecture`, select the smallest deterministic capability-probe mechanism, and separate migration, Skill content, evaluation/review, and repository-integration commits.
