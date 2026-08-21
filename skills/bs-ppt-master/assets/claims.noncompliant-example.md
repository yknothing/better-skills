<!-- Parent skill: skills/bs-ppt-master/SKILL.md -->
<!-- A deliberately non-compliant ledger. Regression fixture for scripts/check-claim-ledger.js -->
<!-- and a catalogue of the violations the checker must catch. Expected: exit code 1. -->

# Claim Ledger: deliberately non-compliant fixture

## Triage

- pacing: whatever
- tier: L9

## Pre-registration

- registered-at: sometime in August
- decision-request: Approve the thing.

## Claims

### C1

- claim: The redesign caused a large improvement in retention.
- grade: T1
- warrant: The redesign caused a large improvement in retention because retention improved after the redesign.
- evidence: E1, E9
- falsifier: If retention drops we were wrong.
- probability: quite likely
- settlement: someday | the dashboard

### C2

- claim: Onboarding drove a 20 percent lift in activation.
- grade: T2
- warrant: It is obvious.
- evidence: E1
- probability: 70 percent
- settlement: 2027-01-01 | product warehouse | activation above 40 percent
- falsifier: If at 2027-01-01, via the product warehouse, activation is below 30 percent, this claim is refuted.

### C3

- claim: Pricing changed during the period.
- grade: T2
- warrant: Prices are recorded in the billing ledger at the moment of charge, so a change there is a measured fact.
- evidence: E1
- falsifier: If at 2027-02-01, via the billing ledger, the mean price is above 12.00, this claim is refuted.
- probability: likely, 55-80 percent
- settlement: 2027-02-01 | billing ledger | mean price below 12.00

### C4

- claim: The migration proves the architecture is correct.
- grade: T3
- warrant: Systems that pass a migration without incident are structurally sound in the general case.
- evidence: E1
- falsifier: If at 2027-03-01, via the incident tracker, more than 2 sev-1 incidents occur, this claim is refuted.
- probability: almost certain, 95-99 percent
- settlement: 2027-03-01 | incident tracker | fewer than 3 sev-1 incidents
- note: possibly this needs more work

## Evidence

### E1

- description: Retention curve.
- source: somewhere

### E5

- description: An orphan exhibit nobody references.
- source: somewhere else

## Assumptions

### A1

- assumption: Traffic keeps growing.
- current: lots
- switching-point: not sure
- signpost: traffic | weekly

## Rebuttals

### R1

- rebuttal: This fails if the cohort was self-selected.
