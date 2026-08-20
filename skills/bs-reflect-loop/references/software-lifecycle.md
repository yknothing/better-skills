# Software Lifecycle Reflection Lens

Use this lens when the reflected work touches requirements, product direction, architecture, implementation, verification, review, delivery, operations, incidents, or maintenance.

## Keep the Truth Layers Separate

```text
right objective
-> sound design
-> honest implementation
-> meaningful verification
-> real delivery
-> operating feedback
```

A green signal at one layer does not prove another:

- approved requirements do not prove the product direction is correct;
- a sound design does not prove the implementation matches it;
- unit or integration tests do not prove the user journey works;
- a review approval does not prove the evidence was complete;
- a commit or push does not prove deployment;
- deployment does not prove production health or user value.

Reflect on the layer actually evidenced and name any unverified downstream layer.

## Lifecycle Questions

### Requirements and direction

- Was the problem or desired outcome explicit before the solution shape hardened?
- Which requirement was stated, inferred, deferred, or silently assumed?
- Did later evidence challenge the original objective or only the chosen implementation?
- Which acceptance criterion would have prevented the largest ambiguity?

### Design and architecture

- Which trade-off was chosen, and which alternative was rejected?
- Did the design match the actual constraints and failure modes?
- Which decision deserves a durable rationale rather than a retrospective narrative?
- Was reversibility understood correctly at the time?

### Implementation

- Did the change match the approved scope and contract?
- Which local convention, dependency behavior, or hidden coupling mattered?
- Did mocks isolate dependencies, or replace the behavior that needed proof?
- Did the implementation produce unrelated changes or leave an incomplete state?

### Verification and review

- What did each test or review actually demonstrate?
- Which meaningful path, boundary, or integration remained untested?
- Did a validator check the claimed property or only a proxy for it?
- What evidence could a skeptical reviewer independently reproduce?

### Delivery and operation

- What was built, packaged, committed, pushed, deployed, or observed in production?
- Which of those states was assumed rather than verified?
- Were rollback, migration, monitoring, and ownership boundaries explicit?
- What operating feedback changes the next lifecycle decision?

## Failure and Incident Addendum

For failures, analyze more than the direct cause:

- **Occurrence:** What condition allowed the failure?
- **Escape:** Why did review or verification not expose it?
- **Detection:** How was it found, and could it have been found earlier?
- **Recovery:** What reduced or increased repair time and risk?
- **Recurrence:** What proportionate mechanism would catch the same class next time?

Do not force every incident through all five questions when evidence or severity does not justify it. Do not reduce systemic gaps to blame, and do not erase avoidable individual decisions by labeling everything systemic.

## Horizontal Checks

Search for related code, configuration, tests, documentation, or workflows only when a surviving learning predicts a concrete repeated pattern. Record the search scope and outcome. Absence in a bounded search is not proof of global absence.

## Useful Destinations

- A specific failure and fix may belong in an incident or solutions record.
- A design choice may belong in an ADR or decision log.
- A repeated verification gap may justify a test, checklist, or CI gate.
- A cross-task operating failure may justify proposing a workflow or Skill improvement.

Keep the retrospective record separate from the implementation phase that applies a proposed fix. Reflect Loop never mutates code, scripts, configuration, CI, templates, Agent Skills, or governance. When the same request already authorizes remediation, hand the work to a separately declared execution phase; otherwise leave it pending. Do not silently turn reflection authority into authorization to implement, deploy, or push.
