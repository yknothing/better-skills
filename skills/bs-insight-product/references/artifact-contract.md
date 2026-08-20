# Artifact Contract

Open this reference in Step 9. Return the sections inline by default. Create
durable files only when the user requests them or the host workflow requires them.

## Discovery Package

### 1. Route

- Product stage, primary mode, depth, and question budget.
- `questions_used`, `questions_remaining`, and any `Q-##` IDs linked to the
  `U-##` or `D-##` they addressed.
- Decision at stake and why it matters now.
- Independence level, downgrade reason, and its limitation.

### 2. Product Truth

- Stated, Inferred, and Out of Scope buckets.
- Evidence ledger summary with the decisive `F`, `I`, `A`, and `U` items.
- Riskiest assumption and the decisions it controls.
- For a frontier route, the `CB-##` Conviction Thesis and the explicit statement
  that it is not demand evidence.

### 3. Conflict Map

- Material disagreements and their status.
- Unresolved objections, severity, veto status, and required next proof.
- Claims that lost and the evidence that could reverse them.

### 4. Product Propositions

Summarize Paid Wedge, 10-Star Product, and Contrarian Product. Keep each distinct.
For the selected proposition, include:

- best-fit user and buyer;
- trigger and current alternative;
- promised outcome and distinct mechanism;
- first acquisition channel;
- revenue shape;
- trust and feasibility boundary;
- primary kill risk.

For a frontier route, identify the Reality Wedge separately from a landing page,
interview, or disposable feasibility spike.

### 5. Scope and Positioning Decision

- Selected scope posture.
- Positioning system: category, outcome, reason to believe, not-for, and why now.
- Decision ledger entry with owner, reversibility, and revisit trigger.

### 6. Conviction Bet Contract

Include this section only when the Frontier Gate passes:

- `CB-##` Conviction Thesis and `UNVALIDATED_CONVICTION` label;
- Reality Wedge that will actually be planned and built;
- why build-and-use creates unique information;
- founder edge and its evidence IDs;
- time, cash, reputation, legal, ethical, security, and opportunity-cost limits;
- real-world contact plan during the cycle;
- review date or event;
- stop or redesign triggers;
- forbidden scope outside this bet;
- named human owner and explicit acceptance.

This contract is implementation authority only for the bounded Reality Wedge. It
must not contain an open-ended roadmap or imply that demand is proven.

### 7. Falsification Experiment

| Field | Required content |
|---|---|
| Assumption | One critical `A-##` claim |
| Subjects | Specific people, accounts, artifacts, or workflows |
| Method | Smallest test that observes behavior rather than praise |
| Cost | Time, money, tooling, and operational burden |
| Window | Fixed observation period |
| Success | Numeric or binary threshold that supports the next bet |
| Failure | Threshold that rejects or materially changes the thesis |
| Continue | Action authorized by success |
| Stop | Action required by failure |
| Owner | Person responsible for running and interpreting the test |

Prefer deposits, paid concierge work, migration attempts, repeated task completion,
or access to real workflow data over waitlists and positive interviews.

### 8. Decision

Return exactly one state:

- `PURSUE`: gate passes; enter requirements discovery.
- `CONVICTION_BET`: Frontier Gate passes; plan and build the signed Reality Wedge
  within its exposure limits, then return for evidence review.
- `TEST_FIRST`: run the named experiment before requirements or build.
- `PARK`: preserve the thesis and revisit trigger, but do not invest now.
- `KILL`: stop this thesis and record the disconfirming evidence.
- `INSUFFICIENT_EVIDENCE`: name missing access and why no responsible test exists.

Then state confidence, evidence limits, next owner, and the strongest reason the
decision may be wrong.

## Handoff Boundary

A `PURSUE` package may hand off to requirements engineering. The next workflow
must still define acceptance criteria, engineering constraints, and implementation
scope. Never label this discovery package implementation-ready, market-validated,
or canonical product truth without a separate authority and evidence process.

A `CONVICTION_BET` package may hand off to bounded requirements and implementation
planning. The downstream workflow must inherit the Reality Wedge, exposure limits,
review horizon, reality-contact plan, and forbidden scope exactly. It may not
silently expand the bet into an ordinary roadmap.

For `TEST_FIRST`, hand off only the experiment. For `PARK`, `KILL`, and
`INSUFFICIENT_EVIDENCE`, do not generate a PRD as consolation.

When `TEST_FIRST` is blocked specifically by reachable-buyer or channel evidence,
recommend `bs-prospect-customer` and pass the existing evidence and decision
IDs. Do not restart discovery or perform detailed prospect qualification here.
