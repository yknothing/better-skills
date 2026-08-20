<!-- Parent skill: skills/bs-ppt-architecture/SKILL.md -->
<!-- A worked Claim Ledger that passes scripts/check-claim-ledger.js with zero failures. -->
<!-- Copy this file to claims.md in the working directory and replace the content. -->
<!-- Format contract: `## Section` -> `### ID` -> `- field: value`. One field per line. -->

# Claim Ledger: Regional node expansion, Q3 investment committee

## Belief Delta

- who: The CFO, who has held an opposing position since the FY25 network review, plus the two committee members who defer to him
- believes-now: Unit economics degrade above roughly forty nodes, therefore any further expansion destroys margin
- should-believe: The degradation he fears begins beyond twenty-one nodes, not at the current frontier, so the next nine sites are still accretive
- evidence: The difference-in-differences estimate on three pilot regions (E1), plus the balancing-traffic series on page 9 which locates the crossover
- will-do: Approve 8.0M USD for nine sites with a hard cap at twenty-one total, and accept the A1 diesel signpost as the halt condition
- surprise-check: Pre-read by three committee members; two said they had assumed degradation started immediately, so the shift is real for them

## Triage

- pacing: speaker-paced
- tier: L2
- product: persuasion — requesting an irreversible capital commitment, so the L2 rule applies
- triage-rule: irreversible and locks capital, therefore at least L2

## Pre-registration

- registered-at: 2026-08-18
- data-freeze: 2026-08-15
- decision-request: Approve 8.0M USD to build nine additional regional nodes. Irreversible once the Q4 site leases are signed; site deposits are non-refundable after 2026-11-30.
- strongest-counter: The CFO holds that unit economics degrade above roughly forty nodes because inter-node balancing traffic grows faster than line-haul savings. Held by finance leadership since the FY25 network review.
- would-change-mind: Two consecutive quarters in which pilot-region cost per parcel sits at or above the non-pilot median, or balancing traffic exceeding 12 percent of total line-haul kilometres.
- adverse-evidence-page: Page 9 carries the balancing-traffic series, including the two months where it breached 10 percent.

## Claims

### C1

- claim: Expanding to twelve regional nodes contributed a 6 to 9 percent fall in cost per parcel across the three pilot regions between 2025-Q3 and 2026-Q2.
- grade: T3
- warrant: Line-haul distance dominates unit economics in hub-and-spoke freight networks, so any structural change that shortens average line-haul propagates into unit economics.
- evidence: E1, E2
- counterfactual: In a synthetic control built from six non-pilot regions weighted on pre-period trend, the same measure stayed within 1 percent of 3.05 USD over the identical window.
- assumptions: A1, A2
- rebuttals: R1
- falsifier: If at 2027-06-30, via the finance warehouse table fct_parcel_cost, the rolling four-week mean of cost per parcel in pilot regions is at or above 3.05 USD, this claim is refuted.
- probability: likely, 55-80 percent
- settlement: 2027-06-30 | finance warehouse fct_parcel_cost | rolling four-week mean below 2.87 USD
- negation-test: Negated it reads "expanding to twelve nodes did not reduce cost per parcel" — a position finance has actively argued, so the claim is arguable rather than fluff
- cost: The cap at twenty-one nodes abandons six sites in the original twenty-seven-node plan, and the regional ops team loses the headcount attached to them
- verb-check: "contributed" requires T3; identification is difference-in-differences with a synthetic control, so the wording is licensed

### C2

- claim: Throughput per node increased from 1,640 to 2,140 parcels per day during the pilot window.
- grade: T2
- warrant: Scan events are recorded at each handover, so a count of scans is a direct measurement rather than an estimate derived from another quantity.
- evidence: E3
- assumptions: A2
- rebuttals: R2
- falsifier: If at 2027-03-31, via the operations warehouse table fct_node_scans, the trailing ninety-day mean falls below 1,800 parcels per day, this claim is refuted.
- probability: very likely, 80-95 percent
- settlement: 2027-03-31 | operations warehouse fct_node_scans | trailing ninety-day mean at or above 1,800
- negation-test: Negated it reads "throughput per node did not rise", which is directly checkable against scan data and would be argued if the definition were disputed
- cost: Grading this T2 forfeits the causal claim the rollout team wanted to make about node density driving throughput
- verb-check: "increased" requires T2; this is a measured before-and-after with no control, so no causal wording is used

## Evidence

### E1

- description: Cost per parcel by region and month, pilot versus non-pilot, with the difference-in-differences estimate and its interval.
- baseline: Synthetic control from six non-pilot regions weighted on pre-period trend (counterfactual — highest attribution cleanliness). Least-favourable baseline test: substituting unadjusted own history narrows the effect to 4-6 percent but does not flip its sign
- source: finance warehouse / fct_parcel_cost | as of 2026-08-15
- n: 412,000 parcels across nine regions
- window: 2024-07 to 2026-06, full available series; no truncation
- definition: Total line-haul plus handling cost divided by delivered parcels; returns excluded, and the exclusion is accounted for in the flow table on companion page 14.
- uncertainty: 95 percent confidence interval on the DiD estimate, shown as an error band
- exclusions: raw 438,000 minus 21,000 test parcels minus 5,000 with missing weight equals 412,000
- exhibit-form: interrupted time series with control, per the claim-type mapping

### E2

- description: Average line-haul kilometres per parcel, pilot versus non-pilot regions.
- baseline: Non-pilot regions over the identical window (peer). Rejected alternatives: own history alone, which is confounded by the 2025 fuel spike
- source: operations warehouse / fct_linehaul_legs | as of 2026-08-15
- n: 1.2M legs
- window: 2024-07 to 2026-06
- definition: Kilometres between origin hub and destination node, summed per parcel.
- uncertainty: p10 / p50 / p90 shown; distribution given rather than the mean alone
- exhibit-form: quantile band over time

### E3

- description: Daily parcels per node, distribution by node, not the mean.
- baseline: The preceding fortnight for the same nodes, plus the p10 node as an internal stratification floor
- source: operations warehouse / fct_node_scans | as of 2026-08-15
- n: 12 nodes, 640 node-days
- window: 2025-07 to 2026-06
- definition: Count of inbound scan events per node per calendar day.
- uncertainty: box plot with all node-days plotted; the two weakest nodes are labelled
- exhibit-form: box plus raw points, since n is small enough to show every value

## Assumptions

### A1

- assumption: Diesel cost per litre stays at or below 1.42 USD through 2027-Q2.
- current: 1.28
- switching-point: 1.63
- safety-margin: 27 percent above the current value before the conclusion flips
- signpost: diesel_cost_per_litre | 1.55 | weekly | procurement dashboard | J. Rivera | pause nodes 10-12 and re-run the DiD before further commitment
- elasticity: A 10 percent move changes cost per parcel by roughly 4 percent, the largest of the six candidates tested

### A2

- assumption: Parcel volume per node stays at or above 1,800 per day.
- current: 2,140
- switching-point: 1,760
- safety-margin: 18 percent below the current value before the conclusion flips
- signpost: daily_parcels_per_node | 1,850 | weekly | operations dashboard | K. Osei | trigger the volume-floor clause and halt the remaining site leases
- elasticity: A 10 percent move changes cost per parcel by roughly 3 percent, second largest

## Rebuttals

### R1

- rebuttal: This fails if inter-node balancing traffic grows faster than line-haul savings, which is the CFO's stated position.
- response: Partly conceded. Balancing traffic reached 10.4 percent of line-haul kilometres in two months, and page 9 shows the full series. The claim's interval was narrowed from 6-12 percent to 6-9 percent to account for it. Unresolved above forty nodes, and the request is capped at twenty-one nodes for that reason.
- status: hedged

### R2

- rebuttal: This fails if the volume rise is a seasonal artefact rather than a level shift.
- response: A placebo test on the equivalent 2024 window shows a 4 percent seasonal component, which is subtracted in E3. The residual level shift is 26 percent.
- status: resolved

## Concessions

- concession-1: C1's interval narrowed from 6-12 percent to 6-9 percent after R1 (page 6, changelog entry 3).
- concession-2: The request was reduced from twenty-seven nodes to twenty-one, because the switching-point analysis on A1 leaves no safety margin beyond that point (page 12, changelog entry 7).
- concession-count: 2
