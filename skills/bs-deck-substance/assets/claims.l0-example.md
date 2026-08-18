<!-- Parent skill: skills/bs-deck-substance/SKILL.md -->
<!-- Regression fixture: a legitimate L0 ledger. Reversible decision, no opposing interest,
     so the tier table exempts it from assumption and rebuttal entries. -->
<!-- Expected: exit code 0. A tier-blind checker wrongly failed this. -->


## Belief Delta

- who: The three team leads who own the current rota
- believes-now: The existing rota works and changing it costs more churn than it saves
- should-believe: First-response time is the binding constraint on customer satisfaction this quarter, and the pilot rota moves it without adding load
- evidence: The first-response distribution across the pilot fortnight versus the preceding one (E1)
- will-do: Adopt the pilot rota for one sprint and review at the retro
- surprise-check: Not run; no target reader was available before drafting, so the information content of the shift is unverified

## Triage

- pacing: reader-paced
- tier: L0
- product: persuasion — a reversible team decision with no resource commitment, so L0 applies (falsifiers and probability discipline only)

## Pre-registration

- registered-at: 2026-08-18
- data-freeze: 2026-08-15
- decision-request: Adopt the new triage rota for one sprint. Fully reversible at the next retro.
- strongest-counter: The current rota is understood by everyone and churn has its own cost.
- would-change-mind: Median first-response time fails to fall below the current level within one sprint.

## Claims

### C1

- claim: Median first-response time on inbound tickets changed during the two-week pilot, from 4.1 hours to 2.6 hours.
- grade: T2
- warrant: First-response timestamps are written by the ticket system at the moment of reply, so the measure is a direct observation rather than an estimate.
- evidence: E1
- falsifier: If at 2026-10-01, via the support warehouse table fct_ticket_events, the trailing 30-day median first-response time is at or above 4.0 hours, this claim is refuted.
- probability: likely, 55-80 percent
- settlement: 2026-10-01 | support warehouse fct_ticket_events | trailing 30-day median below 3.0 hours
- negation-test: Negated it reads "first-response time did not change during the pilot", which is what the leads currently expect, so the claim is arguable
- cost: One sprint of rota churn, and the two leads who prefer the current arrangement absorb the scheduling work

## Evidence

### E1

- description: Distribution of first-response times per ticket, pilot fortnight versus the preceding fortnight.
- baseline: The preceding fortnight, same team, same intake mix (own history). Chosen over a peer baseline because no comparable team runs the same queue
- source: support warehouse / fct_ticket_events | as of 2026-08-15
- n: 1,204 tickets
- window: 2026-07-14 to 2026-08-11
- definition: Minutes between ticket creation and first human reply; auto-acknowledgements excluded.
- uncertainty: p10 / p50 / p90 shown per fortnight

## Assumptions

## Rebuttals
