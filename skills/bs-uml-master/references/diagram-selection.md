# Diagram Selection — question first, notation second

A diagram is a visual answer. Selecting the diagram type before naming the question produces the baseline failure: a generic "everything diagram" that answers nothing. Work through the three decisions in order.

One principle governs all three: **the element ledger is the canonical model; every notation is a projection of it.** Mermaid, PlantUML, plain text, and SVG render the same semantic content under different trade-offs. The model layer (question, mode, evidence, semantics, budget) is notation-invariant; each backend contributes only its own pitfalls table, verification recipe, and budget correction. This also makes multi-format delivery safe: project the one ledger into each format and sync-check both against it.

## Decision 1 — What question does the reader need answered?

| Reader's question | Diagram | Notes |
|---|---|---|
| What are the domain concepts and how do they relate? | Class diagram (domain level) | Types + relationships, few/no methods |
| How is this code structured (for a change/review)? | Class diagram (implementation level) | Only the classes touched by the concern |
| Who/what calls whom, in what order, for scenario X? | Sequence diagram | One scenario per diagram |
| What states can this entity be in, and what moves it? | State machine | Entities with lifecycle (Order, Job, Session, Connection) |
| What is the step flow of this process, incl. parallelism? | Activity diagram | Cross-actor workflows, business processes |
| What are the deployable parts and their contracts? | Component diagram | Interfaces are the content |
| What runs where in production? | Deployment diagram | Nodes, artifacts, protocols |
| What can each kind of user do with the system? | Use case diagram | Scope summary only |
| What does the data look like at rest? | ER diagram | Storage question, not behavior |
| How does this system sit among people and other systems? | C4 Context (L1) | Highest altitude |
| What are the major runtime containers? | C4 Container (L2) | Apps, services, stores + protocols |

Rules:

- **One diagram = one question.** If describing the diagram needs "and", split it. A structure question and a behavior question are never the same diagram.
- If the user names a diagram type that fights their actual question ("class diagram of the checkout flow" — flow is behavior), say so, recommend the fit, and follow their decision.
- If the user says just "draw a UML diagram", the question is not yet known — ask for it (one question), or, when context makes it obvious, state the question you inferred and proceed.
- Complex subjects get a **set** of small diagrams at distinct altitudes (e.g. C4 container + one domain class diagram + 1-2 sequences), never one mural.
- **Layout risk is part of type choice.** Sequence diagrams and state machines have geometry pinned by semantics and are nearly impossible to lay out badly; class/component/flowchart are free graphs with high layout risk. When two types answer the question equally, prefer the pinned-geometry type (see [Layout Craft](./layout-craft.md)).

## Decision 2 — What altitude?

The C4 model's discipline applies even outside C4 notation: **every diagram commits to one abstraction level.**

- **L1 Context** — the system as one box among users and neighboring systems.
- **L2 Container** — separately runnable/deployable units (apps, services, databases, queues) and the protocols between them.
- **L3 Component** — major building blocks inside one container.
- **L4 Code** — classes; C4 explicitly says to generate these on demand rather than maintain them; keep them scoped to one concern.

Mixing altitudes is the "everything diagram" generator: a microservice next to a utility class next to an AWS region is three diagrams forced into one. When elements at another level matter, reference them as a single collapsed box or draw the second diagram.

**Element budget:** target ≤9 primary elements (boxes/lifelines/states) per diagram; hard ceiling 15 for skill-initiated choices, and reaching it demands a recorded justification (e.g. a deliberately exhaustive state table); an explicit user instruction may exceed it as a recorded `USER-OVERRIDE` (see Rule 4). Members and edges carry load too: prefer ≤7 displayed members per class and treat ~25+ edges as a sign the diagram answers more than one question, even when the box count fits. Curation is the deliverable — a reverse-engineered diagram of every class is a failure even when accurate. Cut by: collapsing subtrees into one box, dropping getters/setters/constructors/DTO fields, excluding framework plumbing, splitting by concern.

## Decision 3 — Which backend? The medium picks it

Four first-class backends, each with its own reference module (pitfalls + verification recipe + budget correction):

| The diagram will live in… | Backend | Why / module |
|---|---|---|
| GitHub/GitLab docs, READMEs, PRs, chat, artifacts — type is class/sequence/state/ER/flowchart | **Mermaid** (default) | Renders natively where the reader already is; AI-native text source. Weakness is layout — mitigate via [Layout Craft](./layout-craft.md). Pitfalls: [Syntax Pitfalls](./syntax-pitfalls.md) |
| Source-code comments, commit messages, terminals, render-stripped text media | **Plain text** | The monospace grid *is* the reader's renderer there — text is the correct choice, not a fallback. Tighter budget (≤5). [Text Diagrams](./text-diagrams.md) |
| Activity (real partitions/forks), component, deployment, use case, timing; composite states with history; precise layout control; house style | **PlantUML** | Only text tool with essentially full UML 2.5 coverage and real layout levers (rank distance, hidden edges, direction hints). Mermaid has **no real activity/component/deployment diagram** — do not fake UML notation in a tool that lacks it |
| Publication-grade presentation: article illustrations, teaching material, posters — visual quality carries information weight | **SVG projected from the validated model** | Full control, zero parser protection — governed by the iron rule and triple verification in [SVG Presentation](./svg-presentation.md). Never freehand |

Cross-cutting rules:

- **C4 diagrams** → C4-PlantUML (`!include <C4/C4_Container>`) is the mature standard; Mermaid's C4 types are experimental with poor layout. A plain Mermaid `flowchart` following C4 conventions (name + technology + one-line responsibility per box, labeled arrows, legend) is an honest markdown-native fallback.
- **D2** (single Go binary, strongest auto-layout) is a legitimate escalation when auto-layout quality dominates and markdown-nativeness doesn't; say why when choosing it.
- **Repo convention wins** over any default above. Consistency beats preference.
- **Human hand-editing required afterwards** → deliver the validated model + draw.io/Excalidraw handoff note. Do not hand-generate draw.io XML — structural validity failure rates are high.
- **Layout pressure is a legitimate backend-switch trigger**: when the layout rubric fails after the bounded repair loop, escalate along Mermaid → PlantUML → D2/SVG rather than grinding or shipping garble (see Layout Craft, Tier 3).

Declare the choice and the reason in one line before drafting. Text-source backends diff and review like code — keep sources in the repo next to the code they describe; for SVG keep the model/notation source beside the artifact as the editable truth.

## Mode gate (set before any drafting)

- **MODEL-FROM-CODE** — the diagram claims to describe an existing codebase. Requires the evidence workflow: read the code first; every element cites a source location.
- **MODEL-FROM-DESIGN** — the diagram proposes a design from requirements. Invention is the job, but assumptions are labeled and key modeling decisions (e.g. "made OrderItem a composition — items don't outlive orders") are surfaced for confirmation.
- **REVISE** — an existing diagram is edited. Preserve its notation, layout conventions, and scope unless the change order says otherwise; diff the semantics, not just the text.
- **EXPLAIN/REVIEW** — the user wants a diagram read or critiqued, not drawn. Apply the semantic rules as a checklist against it; produce findings, not a replacement, unless asked.

Misclassifying mode is the root failure: treating MODEL-FROM-CODE as MODEL-FROM-DESIGN produces confident fiction about a real system.
