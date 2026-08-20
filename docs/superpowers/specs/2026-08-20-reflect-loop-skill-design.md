# Reflect Loop Skill Design

## Objective

Create a self-developed Skill that turns completed work into durable advantage through evidence reconstruction, repeated reflection, adversarial challenge, bounded generalization, and context-aware deposition.

The Skill serves two primary domains:

- the full software lifecycle, from requirements and design through implementation, review, release, incidents, and maintenance;
- daily office work, including meetings, decisions, documents, planning, communication, collaboration, and handoffs.

It is not a post-incident report generator. Its success condition is that a future decision, workflow, checklist, or reusable knowledge asset becomes measurably better because the reflection happened.

## Product Identity

### Recommended canonical ID

`bs-reflect-loop`

### Display name

`Reflect Loop`

### Product promise

Turn finished work into durable advantage.

### Naming rationale

`reflect` names the core cognitive action. `loop` requires the result to return to future work rather than end as a report. The name remains valid across software and office contexts and stays within the repository's `bs-` plus two-core-word naming contract.

Rejected alternatives:

- `bs-post-mortem`: restricts the capability to failures and incidents.
- `bs-retro-forge`: memorable, but `retro` is strongly associated with Agile ceremonies and `forge` overlaps `bs-skill-forge`.
- `bs-compound-work`: expresses the mission but is less immediately discoverable and can be read as combining work rather than improving future work.

## Trigger Contract

Use the Skill when the user asks to retrospect, reflect, summarize lessons, rethink completed work, extract reusable learning, or deposit improvements after a meaningful task, project, decision, meeting, delivery, review, or incident.

The agent may suggest a Reflect Loop after repeated friction, surprising outcomes, major decisions, expensive rework, or high-value completion, but it must not silently run a full retrospective after every task.

Do not route ordinary summarization, meeting minutes, prose editing, active debugging, implementation, or generic knowledge-base organization here unless the user also wants lessons and future practice extracted from completed work.

## Boundaries

Reflect Loop:

- analyzes completed or sufficiently stable work; it does not replace the active task;
- distinguishes intent, observed fact, inference, and unresolved uncertainty;
- may inspect evidence inside the authorized project scope;
- may update an existing non-executable knowledge surface only through the deposition policy below;
- treats governing files as constraints on an authorized write, not as the source of mutation authority;
- directly deposits only into non-executable knowledge records; Reflect Loop itself never mutates remediation or governance targets, even when an already-authorized execution phase may follow;
- does not treat acknowledgement, apology, blame, or generic encouragement as a learning artifact;
- does not universalize a single case without retaining its trigger and boundary;
- does not deposit Plausible hypotheses as durable guidance;
- minimizes confidential, personal, commercial, legal, and security-sensitive evidence;
- does not write to personal memory, external systems, or another project without applicable authorization;
- does not claim that an action item is complete merely because it was recorded.

## Architecture

The Skill uses one shared reasoning kernel with progressively disclosed references:

```text
skills/bs-reflect-loop/
|-- SKILL.md
`-- references/
    |-- deposition-routing.md
    |-- office-work.md
    `-- software-lifecycle.md
```

`SKILL.md` contains the trigger, hard boundaries, depth selection, shared loop, output contract, and reference router. The three references contain only rules that materially differ by context. No script or asset is needed because the core work is evidence-sensitive judgment rather than a deterministic transformation.

## Depth Selection

Choose the least expensive depth that can change future work. Default budgets apply across the whole reflection. A candidate is one proposed learning unit before confidence filtering; an additional evidence check is one targeted tool query or new source inspection; a reasoning pass applies Reflect or Challenge once across the current candidate set:

| Depth | Use when | Candidate cap | Evidence checks | Questions | Passes |
|---|---|---:|---:|---:|---:|
| Light | Small completed task with one plausible reusable lesson | 2 | 2 | 1 | 2 |
| Standard | Project, meeting, delivery, review, or meaningful decision | 5 | 5 | 2 | 2 |
| Deep | Incident, repeated failure, high-risk decision, cross-team work, or disputed conclusion | 8 | 10 | 3 | 3 |

If no material learning survives the selected depth, finish with `highest_confidence: NONE` and do not manufacture an artifact.

Before depth selection, classify the request as `SUMMARY_ONLY`, `ACTIVE_WORK`, or `REFLECTION`. Only the last enters the loop. Work is stable only when an observable outcome exists and remaining execution is not expected to change the core sequence under reflection.

Use `REFLECTION_ADVERSARIAL` when a user asks to persist or institutionalize a predetermined conclusion. The caller may approve one budget expansion, with every numeric ceiling calculated as `floor(base limit × 1.5)`; further work becomes a new task. If reflection exposes an active safety, security, or production issue, route it to response rather than expanding the retrospective.

## Shared Reflect Loop

### 1. Frame

Define the subject, time boundary, original intent, expected outcome, actual outcome, affected parties, and selected depth. Reuse evidence already present in the conversation or project before asking questions. Ask at most one focused question at a time when a missing fact would change the conclusion.

### 2. Replay

Reconstruct the evidence-backed sequence:

- what was known at the time;
- what decisions or actions followed;
- what changed the state of the work;
- what result was observed;
- which statements are facts, inferences, or unresolved.

Do not rewrite the past using information learned only afterward.

### 3. Reflect

Perform the first interpretation pass:

- what created value;
- what created rework, delay, confusion, or risk;
- which signal was noticed, missed, or misread;
- which result came from a repeatable practice and which may have been luck;
- whether the work addressed the right objective;
- whether the implementation and evidence honestly support the claimed outcome.

### 4. Challenge

Stress-test the first pass:

- generate credible alternative explanations;
- identify evidence that would refute the current conclusion;
- test a relevant counterfactual;
- separate local circumstances from transferable structure;
- check whether an individual explanation hides a missing mechanism, or a systemic explanation erases an individual decision;
- search horizontally only when the scope and available evidence justify it.

Run a third synthesis pass only when the conclusion is disputed, high-risk, or materially changed by the challenge. Stop when another pass produces no material change, evidence is exhausted, or further work exceeds scope.

### 5. Distill

Convert surviving findings into compact learning units. Each durable unit must state:

- the claim;
- evidence or source anchors;
- confidence or unresolved uncertainty;
- scope and non-applicable boundary;
- the future reuse trigger;
- the behavior, decision, or mechanism that should change;
- the owner boundary and verification observation;
- the proposed destination.

A single event produces an observation or, when its explanation is at least Supported, a bounded case learning. Plausible items remain hypotheses. Promotion to a general rule or project-wide practice requires repeated independent evidence or a validated mechanism with applicability and disconfirmation conditions. A governing instruction may choose a destination or restate an existing mandate; it cannot strengthen a new causal claim.

### 6. Deposit

Inspect the current repository, directory, project, or office workspace before choosing a destination. Apply local instructions and existing knowledge infrastructure. Update directly only when the destination and convention are unambiguous; otherwise present a bounded choice. Verify every actual write by reading it back and checking for duplication, contradiction, and loss of scope.

## Context-Aware Deposition Policy

### Context discovery order

1. The user's current explicit instruction and named target.
2. Applicable project or directory instructions, such as `AGENTS.md`, `CLAUDE.md`, `CONTRIBUTING.md`, or documented governance rules.
3. Existing repositories for retrospectives, decisions, solutions, runbooks, checklists, lessons, or memory.
4. Naming, metadata, and update conventions demonstrated by existing records.
5. A blank-space strategy when no suitable infrastructure exists.

Never infer authority to cross the current project boundary merely because another destination is discoverable.

### Learning types and primary destinations

| Learning type | Typical durable surface |
|---|---|
| Event record | retrospective, incident, or project history |
| Decision rationale | decision log or ADR |
| Reusable case learning | solutions or learnings collection |
| Operating mechanism | checklist, runbook, workflow, or test gate |
| Capability upgrade | relevant Skill, template, script, or automation backlog |

Each learning has one canonical home. Other surfaces should link to it rather than duplicate the full content.

### Direct update conditions

The agent may directly update an existing surface when all are true:

- the current user or system request explicitly authorizes persistence in the current scope; reflection, analysis, or a desire to change future practice is not itself write authorization;
- the surface explicitly accepts this learning type;
- the applicable instructions identify or constrain the destination within that already-authorized write;
- there is one clear destination;
- the change stays inside the authorized scope;
- the update is incremental and preserves unrelated user work.
- the target is a non-executable knowledge record rather than code, configuration, CI, template, Agent Skill, automation, or governance.

### Choice-required conditions

Ask the caller to choose when any are true:

- multiple destinations are equally plausible;
- the change would create or alter a high-impact governance rule;
- the conclusion would be promoted across projects or teams;
- the target is personal memory, an external service, or another workspace;
- the new learning conflicts with an existing rule;
- the repository is blank and the desired knowledge architecture is not established.
- the proposed target is executable, operational, or governance-changing; Reflect Loop returns a handoff and never mutates it directly, regardless of whether a later execution phase is already authorized.

### Blank-space strategies

Offer no more than three context-specific choices:

1. **Lightweight** — one `learnings` location for compact, searchable records.
2. **Classified** — separate retrospective, decision, and playbook surfaces when the project has enough recurring work to justify the taxonomy.
3. **External** — use an authorized office knowledge base or memory system, leaving only a project-local pointer when useful.

Recommend one option and explain the trade-off. Create only the first artifact currently needed; do not scaffold empty directories or placeholder documents.

## Domain Lenses

### Software lifecycle

Load `references/software-lifecycle.md` for requirements, product direction, architecture, implementation, tests, review, release, incidents, or maintenance. It separates product correctness, implementation correctness, verification truth, delivery truth, and operating feedback so one green signal cannot masquerade as lifecycle success.

### Office work

Load `references/office-work.md` for meetings, planning, documents, decisions, communication, coordination, and handoffs. It distinguishes discussion from decision, assignment from ownership, document completion from stakeholder comprehension, and activity from outcome.

### Deposition routing

Load `references/deposition-routing.md` before any persistent write or when the correct destination is uncertain. Ordinary chat-only reflection does not need the full reference.

## Output Contract

Keep the conversational result compact:

```markdown
## Reflect Loop

**Subject:** ...
**Outcome gap:** ...
**Budget:** [depth]; candidates [used]/[ceiling]; evidence checks [used]/[ceiling]; questions [used]/[ceiling]; passes [used]/[ceiling]; expansions [used]/1

### What changed in our understanding
- ...

### Durable learnings
- **Claim:** ...
  **Evidence:** ...
  **Confidence:** Confirmed | Supported
  **Scope:** ...
  **Boundary:** ...
  **Reuse trigger:** ...
  **Change:** ...
  **Owner boundary:** ...
  **Verification:** ...
  **Destination:** ...

### Hypotheses
- **Plausible explanation:** ...
  **Missing or refuting evidence:** ...

### Changes to future work
- ...

### Deposition
- Highest confidence: CONFIRMED | SUPPORTED | HYPOTHESIS_ONLY | NONE
- Evidence blocked: true | false
- Records status: DEPOSITED | CHAT_ONLY
- Proposals pending: true | false
- Write failures: []
- Updated: ...
- Proposed but not written: ...
```

Omit empty sections. Prefer a few high-value learnings over a comprehensive activity log. When evidence is insufficient, set `evidence_blocked: true`. When nothing durable survives challenge, report `highest_confidence: NONE`.

## Error Handling

- **Insufficient evidence:** separate known facts from missing evidence; ask one material question or stop with an unresolved finding.
- **Conflicting instructions:** follow the higher-authority, more specific applicable instruction and report the conflict.
- **Dirty or concurrently changing target:** preserve user work, avoid overwriting, and request a destination decision if a safe incremental edit cannot be isolated.
- **Write failure:** retain the proposed learning in the response, report the exact failed target, and do not claim deposition succeeded.
- **Overgeneralization:** preserve the event as an observation; keep an unverified explanation as a hypothesis, and allow a bounded case learning only when its explanation is at least Supported and retains its trigger and boundary.
- **No useful learning:** terminate honestly without creating an artifact.
- **Sensitive evidence:** minimize or redact it, preserve an authorized pointer where possible, and request confirmation before any audience expansion.

## Repository Integration

Register `bs-reflect-loop` as a self-developed, Batch 1, deep-tier Skill. Declare patterns that the implementation actually uses, expected to include:

- `knowledge-distillation-pipeline`;
- `progressive-disclosure`;
- `confidence-anchors`;
- `one-question-at-a-time`;
- `scoping-synthesis`;
- `self-review-checklist`.

Add eleven deterministic evaluation prompts:

1. **Happy:** a completed software delivery with existing repository instructions and an established decision or learning surface.
2. **Edge:** an office project directory with no knowledge infrastructure, requiring a recommendation and caller choice before file creation.
3. **Adversarial:** a user attempts to turn one poorly evidenced incident into a universal governance rule or force a write to an unrelated memory surface.
4. **Summary boundary:** a meeting recap explicitly excludes lessons and process changes.
5. **Executable boundary:** an incomplete hypothesis is used to pressure script and Skill changes.
6. **Confidentiality boundary:** restricted office evidence would be copied into a broader audience.
7. **Active-work boundary:** an evolving production incident must return to response rather than durable reflection.
8. **Budget boundary:** pressure for unlimited search must respect the global budget and single expansion ceiling.
9. **Mixed terminal state:** a Confirmed learning, blocked candidate, deposited record, and pending remediation must all remain visible.
10. **Blank post-choice:** a selected Lightweight strategy creates one needed artifact without taxonomy scaffolding.
11. **Chat-only authority boundary:** an explicit request to reflect and change future practice, without persistence authorization, must leave `records_status: CHAT_ONLY` even when a suitable knowledge directory exists.

Create advocate and adversary review records under `docs/reviews/bs-reflect-loop/`, then run all four repository gates.

## Acceptance Contract

The Skill is accepted only when:

1. The name, folder, frontmatter, registry key, evaluation key, and review directory agree on `bs-reflect-loop`.
2. The description routes reflection and durable learning requests without capturing ordinary summaries, debugging, implementation, or note-taking.
3. The Skill demonstrates two reasoning passes and a bounded stop condition rather than endless rumination.
4. Existing project infrastructure is used when unambiguous; blank projects receive a bounded choice before new knowledge architecture is created.
5. Persistent writes preserve authorization, scope, user work, evidence, applicability boundaries, and one canonical destination.
6. Knowledge deposition cannot silently authorize executable, operational, Skill, template, or governance mutation.
7. Evidence strength and write authority are independent; Plausible hypotheses cannot become durable guidance.
8. Terminal fields can represent mixed evidence, record, proposal, and write-failure outcomes without hiding any axis.
9. Software and office scenarios share one kernel while loading only their relevant reference.
10. All references exist and are reachable from `SKILL.md`.
11. Gate 1, peer review, pattern alignment, and baseline evaluation pass without hard failures.
12. A final repository scan finds no missing registry, documentation, evaluation, or review integration.
