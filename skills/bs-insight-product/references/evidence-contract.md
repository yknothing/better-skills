# Evidence and Decision Contract

Open this reference in Step 2 to establish the ledgers and again in Step 8 to run
the adversarial product gate. Do not load it before Step 2.

## Evidence Ledger

Assign a stable ID and one class to every material claim:

| Class | Meaning | Required fields |
|---|---|---|
| `F` Fact or reported evidence | Direct observation, artifact, behavior, transaction, analytics, or a precisely attributed user report | claim, source, subject, date/freshness, scope, verification status |
| `I` Inference | Conclusion derived from one or more facts | claim, supporting IDs, reasoning, confidence |
| `A` Assumption | Falsifiable belief not yet supported strongly enough | claim, why it matters, falsification test, owner |
| `D` Decision | Chosen product or strategy boundary | choice, owner, rationale, evidence IDs, reversibility, revisit trigger |
| `U` Unknown | Missing information that may change a decision | question, blocked decisions, cheapest resolution, owner |

A user's statement may be an `F` that the user reported the claim. It is not
automatically an externally verified market fact. Example: “The founder reports
20 paying customers” is factual as a report; renewal quality and repeatable demand
remain unverified until supported by contracts, analytics, or customer evidence.

Every source must carry one provenance label: `OBSERVED`, `ARTIFACT`, `REPORTED`,
`EXTERNAL`, or `GENERATED`. Generated analysis can support an inference; it cannot
be the sole source for a market fact.

## Minimum Demand Evidence for `PURSUE`

At least one demand signal must come from the scoped target user or economic buyer
and show behavior rather than internal conviction. A qualifying signal is:

- observed use, repeated workaround, switching attempt, paid transaction, deposit,
  signed commitment, renewal, or access to real workflow data; or
- an artifact that directly records one of those behaviors; or
- a precisely attributed first-party report from the target user or buyer that
  names the behavior, cost, context, and timing.

Founder or team paraphrases, executive approval, roadmap votes, waitlists, survey
interest, market-size reports, deadlines, and sunk implementation do not qualify
alone. They may remain supporting evidence. If internal reports are backed by
scoped contracts, invoices, analytics, or customer artifacts, cite those artifacts
rather than the internal conclusion.

When no qualifying signal exists and a falsifiable test can obtain one, the state
must be `TEST_FIRST` unless a separately documented Conviction Thesis passes
the Frontier Gate. `OWNER_ACCEPTED_RISK` cannot close, lower, or bypass missing
minimum demand evidence for `PURSUE`; it can sign only the explicitly bounded
exposure of `CONVICTION_BET`.

## Conviction Thesis Contract

Use this contract only for an insight-backed frontier path. Give it a stable
`CB-##` ID. It references the normal evidence ledger but never changes the class
or confidence of an evidence item.

| Field | Required content |
|---|---|
| Non-consensus observation | What the founder sees that current consensus, categories, or metrics miss |
| Causal mechanism | Why the structural, technical, behavioral, or distribution change could create a product opportunity |
| Evidence-lag thesis | Why conventional demand evidence is unavailable, premature, or systematically misleading now |
| Founder edge | Grounded experience, artifacts, access, identity, capability, speed, or sustained observation that improves the odds |
| Initial actor | The person, team, or founder-as-lead-user whose real workflow receives the first product slice |
| Reality Wedge | A working product or service slice that can generate evidence unavailable before building |
| Unique learning | What building and real use can reveal that interviews, waitlists, or a disposable demo cannot |
| Upside | The meaningful option created if the mechanism is right |
| Exposure limits | Time, cash, reputation, legal, ethical, security, and opportunity-cost maximums |
| Reality contact | How the bet reaches actual workflows, users, transactions, distribution, or operational constraints during the cycle |
| Review horizon | Date or event at which evidence and the causal model are re-read |
| Stop or redesign triggers | Observable results that end this bet or force a different mechanism |
| Owner signature | Named human owner and explicit acceptance of the bounded exposure |

### Qualifying founder edge

Conviction alone is not an edge. Accept an edge only when supported by an artifact
or attributable history such as shipped work, relevant technical capability,
privileged workflow access, a trusted audience, repeated firsthand observation,
unusual speed, or the founder being a credible lead user.

Match corroboration strength to exposure. For a reversible solo bet with a hard
time and cash cap, a precise first-person history may qualify when labeled
`REPORTED` and unverified. Require artifact-backed capability or access before a
bet commits employees, customer data, regulated activity, public reputation,
irreversible dependencies, or material capital.

### Openness protection

Do not treat these as disproof by themselves:

- no established category or search term;
- users cannot yet articulate the future workflow;
- no current buyer budget for a behavior that is still forming;
- short-term conversion is weak when the signed causal thesis predicts a longer
  adoption horizon;
- incumbents dismiss the behavior while enabling constraints are changing.

These conditions justify openness, not approval. The Frontier Gate still requires
a causal model, founder edge, bounded exposure, Reality Wedge, reality contact,
and human ownership.

### Bet authority boundary

`CONVICTION_BET` authorizes only the named Reality Wedge within the exposure
limits. It does not establish demand, permit an unbounded roadmap, waive legal or
safety constraints, or allow repeated renewal without new learning and a new
owner decision.

## Confidence Anchors

Use only these anchors:

- `100`: directly observed and scoped; no inference needed.
- `75`: one short inference from strong evidence; suitable for a reversible bet.
- `50`: plausible but depends on one unvalidated assumption; test before a major bet.
- `25`: multiple unsupported links; keep as an option, not a recommendation.
- `0`: contradicted or entirely speculative; exclude from the winning thesis.

Confidence does not average away a fatal objection. A thesis with high average
confidence and one unresolved fatal objection remains blocked.

## Decision Ledger

Record each decision using:

| Field | Requirement |
|---|---|
| `ID` | Stable `D-##` identifier |
| `Choice` | The selected option, stated narrowly |
| `Alternatives` | Serious options rejected or deferred |
| `Evidence` | Supporting and contradicting evidence IDs |
| `Rationale` | Why this choice wins now |
| `Owner` | Human decision owner; never invent one |
| `Reversibility` | One-way, costly-to-reverse, or reversible |
| `Revisit trigger` | Concrete new evidence that reopens the decision |

Do not delete rejected options. Preserve why they lost and what evidence would
reverse the decision.

## Independence Levels

| Level | Meaning | Permitted claim |
|---|---|---|
| `L0` | One context rotates through multiple roles | Role-separated self-review |
| `L1` | Blind isolated contexts, same model and shared evidence | Independent first passes with shared-model limitation |
| `L2` | Blind isolated contexts with different models or evidence slices | Stronger independent review, still synthetic |
| `L3` | External domain expert, customer evidence, or empirical test | External or empirical validation within the stated scope |

Never call `L0` independent. Never call `L1` or `L2` market validation. Record the
level and downgrade reason in the final artifact. L0 agreement is not new evidence
and cannot by itself resolve or lower a fatal objection.

## Objection Contract

Every material objection must include:

- objection ID and severity: `FATAL`, `MAJOR`, or `MINOR`;
- attacked claim or decision ID;
- evidence and reasoning;
- remaining risk;
- required next proof;
- veto or no-veto status;
- resolution type.

Allowed resolution types:

1. `NEW_EVIDENCE`: cited evidence defeats or materially narrows the objection.
2. `SCOPE_REMOVED`: the attacked claim or feature leaves the selected product.
3. `EXPERIMENT_ASSIGNED`: the objection remains open and blocks the relevant claim
   until a named experiment passes.
4. `OWNER_ACCEPTED_RISK`: the decision owner explicitly accepts the residual risk;
   this cannot override legal, safety, factual truth, or missing minimum demand
   evidence for `PURSUE`. It may sign a `CONVICTION_BET` only when every Frontier
   Gate field is explicit and the exposure is bounded.
5. `UPHELD`: the objection stands and the thesis or decision changes.

Forbidden resolutions include “wording clarified,” “handled in synthesis,”
“future roadmap,” “the team agrees,” or lowering severity without new evidence.

## Product Gate Checklist

The gate passes only when all items are present and no fatal objection is open:

- specific best-fit user and economic buyer;
- observable trigger event;
- costly current workflow and named alternative;
- paid wedge with one completed outcome;
- executable first acquisition channel;
- at least one target-user or buyer demand signal meeting the minimum evidence
  rule above;
- trust and feasibility boundary;
- falsification experiment with thresholds;
- scope posture and rejected alternatives;
- explicit independence level and unresolved risks.

Passing authorizes requirements discovery only. It does not authorize build,
launch, or a claim of PMF.

## Frontier Gate Checklist

The Frontier Gate passes only when all items are present and no fatal legal,
safety, ethical, or unbounded irreversible objection is open:

- complete `CB-##` Conviction Thesis;
- a causal mechanism that can be contradicted;
- a grounded founder edge, not confidence alone;
- explicit explanation of why evidence is expected to lag;
- a Reality Wedge that requires real building to learn;
- real-world contact during the cycle;
- survivable, explicit exposure limits;
- review horizon and stop or redesign triggers;
- named human owner accepting the exposure.

Passing authorizes one bounded build-and-exposure cycle only. It does not satisfy
the Product Gate or create a claim of demand, PMF, product readiness, or general
launch authority.
