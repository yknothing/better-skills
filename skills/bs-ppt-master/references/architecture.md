<!-- Parent skill: skills/bs-ppt-master/SKILL.md -->
<!-- Open this file when: Phase 1 (Sharpen the claim) is reached; return to it for Phase 2 -->

# Architecture

> **Parent skill**: [../SKILL.md](../SKILL.md) — Phase 1 (sharpen) and Phase 2 (structure)
> **Read in order**: Part 1 is the objective — what makes an architecture excellent. Part 2 is the floor — the honesty tools that keep claims licensed by the evidence. **Part 1 runs before anything is drafted; Part 2 finishes the job.** Reversing that order is how a deck ends up unobjectionable and inert.

---

# Part 1 — Excellence

## The first-principles criterion: a decision-relevant belief shift

**An excellent deck moves a specific person, on a specific question, from believing A to believing B, and that shift causes a different allocation of resources.**

Everything below is a way to make that operational. Excellence factorises into four multipliers — **sharpness × weight-bearing efficiency × progression × decision anchoring** — and if any is zero the product is zero. Honesty of numbers is the floor, not a fifth multiplier: necessary, and worth nothing on its own.

The reason this framing matters is a failure mode you can derive before ever testing it. If "nobody can disagree" is the objective, the optimiser has a cheap global optimum: **the tautology**. "We should monitor market conditions and adapt accordingly" cannot be acted on. Any methodology that scores decks on absence-of-holes converges on that sentence.

Ron Howard's decision analysis gives the sharp version: information that does not change the ranking of any option has a value of exactly zero.

## The belief delta

Page zero of every deck, for the author's use only. Five columns:

| Who | What they believe now | What they should believe on leaving | What evidence moves them | What they will do differently |

Three tests, all executable by someone outside the project:

- **Non-identity**: columns 2 and 3 must differ in substance. If column 3 is column 2 in a firmer tone ("costs are high" → "costs really are high"), there is no shift.
- **Surprise**: give column 3 alone to three target readers and ask whether they already believed it. If all three say yes, the deck's information content is zero — it is proving something the audience already holds, which is the most common way effort gets wasted.
- **Non-empty action**: column 5 must contain a verb and an object — approve, cancel, move X's budget from A to B. "Pay more attention to" does not count.

## Sharpness: five tests

Mediocre claims share a structure: **true, and nobody would oppose them.** Sharp claims are **true, and have a named loser.**

- Blunt: "AI is a strategic opportunity and we should invest more."
- Sharp: "We should stop all in-house frontier-model work this quarter and move those 40 people to inference-cost work on line A, because our models will always trail the frontier by about twelve months and customers pay nothing for that twelve months. The cost is losing the technical narrative in the X negotiation."

| Test | How to run it | Fails when |
|---|---|---|
| **Decision difference** | List what happens differently if the claim is true versus false | Fewer than two items |
| **Negation** | Negate the whole claim | The negation is absurd rather than arguable. "Invest more" ↔ "stop investing" is informative; "ignore our customers" is not. Rumelt calls the failing kind fluff |
| **Name swap** | Replace your organisation's name with a competitor's | It still reads as true — then it is not a judgement about you |
| **Named cost** | The claim must state what is given up, whose budget shrinks, which option dies | No cost stated. A free recommendation needs no meeting |
| **Opposability** | Name one credible person who would object out loud | Nobody — you are reporting consensus, not making a judgement |

**Sharpness is not overclaiming.** It means saying as much as the evidence permits, at the top of that range. Saying more than the evidence permits is the separate failure Part 2 exists to catch, and the two must never be conflated: hedging until nobody would disagree and overclaiming to seem decisive are both failures, in opposite directions.

## Weight-bearing efficiency: three pillars, not eight

Not an aesthetic preference. Three independent mechanisms:

1. **Capacity.** Cowan (*Behavioral and Brain Sciences*, 2001) revised short-term capacity to about **4±1 chunks** (Miller's 7±2 conflated chunking with long-term memory). That is the hard ceiling on what the audience can recount unaided afterwards. Pillars beyond it are not extra persuasion — they are discarded at random.
2. **Conjunctive fragility.** Audiences read parallel pillars as an AND. With k pillars, credibility behaves like p^k, and an opponent only has to break one. Eight pillars hands over eight handles while cutting each one's average load to nothing.
3. **Relay bandwidth.** Your listener must recount this to their own boss. Above four, compression happens — and it happens **without you**. Three pillars means you did the compressing.

**Selection: the weight-bearing experiment.** For each candidate argument, assume it is completely refuted.

| Result | Classification | Where it goes |
|---|---|---|
| The conclusion collapses | **Pillar** | Main body |
| The conclusion survives but is visibly weaker | **Reinforcement** | Annex page or footnote |
| Nothing changes | **Decoration** | Appendix |

If deleting any one pillar leaves the conclusion standing, this is not a pillar structure — it is an evidence pile, which is the most common fake architecture.

**Independence check**: if one false premise would take out two pillars, they are one pillar wearing two hats. Re-cut them. This is what MECE is actually for at the architecture level.

## Progression: every page changes the state

Three detections, all outsourceable:

1. **Title part-of-speech count.** Count page titles. Noun phrases ("Market Overview", "Competitive Analysis") above 20% is a failure. Only a complete, judgeable sentence can carry a judgement; a noun-phrase title almost always heads a page of inventory.
2. **Title-chain test.** Extract every title in order and read them as continuous prose. The result must be a self-sufficient argument. A break means a missing page; a repetition means a redundant one; reading like a table of contents means there is no architecture.
3. **Deletion test.** Delete each page. If the conclusion survives unchanged and equally persuasive, that page belongs in the appendix.

**The repair** for an inventory page is minimal: give the data a "therefore" and put it in the title. "Q3 churn was 12%" becomes "Churn is concentrated in month one, so the problem is onboarding rather than the product."

Three consecutive pages pushing the same direction is a plateau. Insert a counter-evidence or cost page to restore tension.

## Decision anchoring

The first page lists the one to three decisions being requested. Each carries: decision-maker, options, what information is needed to choose, deadline, and **the cost of not deciding**. Every later page footnotes which decision it serves.

**Test**: pick five pages at random and ask two questions — which decision does this serve, and if it were deleted would that decision change? Either failure moves the page to the appendix.

**When the product is not a decision, the criterion migrates** — state this explicitly, because otherwise these standards get misapplied:

| Product | Criterion replaces "a decision changed" with | Effect on these rules |
|---|---|---|
| Education | Transfer: give the audience an unseen case; can they classify it with your framework | Sharpness still applies — a blunt framework does not transfer |
| Alignment | Convergence: ask five people the same question separately; do the answers match | Three-pillar limit binds *harder*; consensus bandwidth is narrower than persuasion bandwidth |
| Archival | Reconstruction cost: can a newcomer in six months rebuild the reasoning **and the rejected alternatives with their reasons**, with nobody to explain it | Completeness beats sharpness; "one shift per page" does not apply |

## Named failure forms

| Form | Diagnostic signal |
|---|---|
| **Genre outline** (classification masquerading as argument) | All titles are noun phrases; swapping any two chapters changes nothing |
| **Chronicle** (a timeline standing in for logic) | "Phase 1 / Phase 2" headings; the only connective between pages is "then" |
| **Effort narrative** (what we did as the structure) | "We interviewed 47 people" is a page's main assertion; page count tracks hours spent rather than decision weight |
| **Buried conclusion** | The first imperative sentence appears in the last 20%; if the meeting is cut short at minute 15, nobody knows what you want |
| **Overlapping pillars** (three that are really one) | A single rebuttal takes out two; two pillars share a data source or an implicit premise |
| **Data rain** (volume concealing the absence of judgement) | Three or more exhibits per page with no "therefore"; adjectival conclusions ("solid", "room to improve") outnumber numeric assertions |
| **Recommendation with no loser** | Nowhere does the deck say what is being given up (Rumelt: mistaking goals for strategy) |

## Excellence and honesty

**Honesty is a necessary condition, not sufficient, and not a substitute for sharpness.**

*Why necessary*: a belief shift that rests on a hole reverses the moment the hole is found, and a trust discount attaches afterwards. A deck that moves the room by overclaiming is not excellent — it borrows against future credibility.

*Why not sufficient*: an honest set of assertions can still be empty of content. Excellence is the size of Δ(decision). Saying nothing with content is cheap honesty.

*If a deck is honest and mediocre, where is the fault?* Not in the evidence layer. It is in the **claim** and the **decision anchoring**: the claim is blunt, the pillars are categories rather than load-bearing, and there is no target belief shift. That dictates the repair order — **rewrite the claim, re-cut the pillars, then backfill evidence.** Working the other way, starting with more evidence, only compacts the mediocrity. This is the single most common source of wasted rework.

## Constructible rules — Part 1

| # | Mechanism | Do | Third-party test |
|---|---|---|---|
| X1 | With no target shift there is no basis for any page-level decision | Fill in the five-column belief delta before drafting | Table exists; col 2 ≠ col 3; col 5 has a verb and object; three target readers do not all say "I already thought that" |
| X2 | A true claim nobody opposes changes no decision | Main claim in one sentence, with magnitude, deadline, and the abandoned alternative | Negation test, name-swap test, and one nameable objector |
| X3 | Capacity, conjunctive fragility, relay bandwidth | Run the weight-bearing experiment; only pillars enter the body | ≤4 pillars; deleting each collapses the conclusion; no single premise takes out two |
| X4 | The title is the only part guaranteed to be read | Titles are judgeable sentences containing a "therefore" | Noun-phrase titles ≤20%; the title chain reads as a self-sufficient argument |
| X5 | Information that changes no option ranking is worth zero (Howard) | First page lists 1–3 decisions with owner, options, deadline, cost of delay; every page cites one | Sample 5 pages, ask which decision and whether deleting changes it |
| X6 | A named cost raises both sharpness and credibility | A dedicated page: what we give up, what risk we accept, what would void this recommendation | Page exists; at least one item names a specific team, budget, or customer. "Some risk exists" scores zero |
| X7 | Contrast is the engine of progression (Duarte) | At least one counter-evidence or cost page every three pages | Label each page's direction; no same-direction run longer than three |

---

# Part 2 — Audit tools

Everything below is the floor. It keeps claims licensed by the evidence; it does not make an architecture excellent. Run it after Part 1, not instead of it.

## Toulmin's six elements on a slide

Based on Toulmin, *The Uses of Argument* (1958).

| Element | Physical location | Constraint |
|---|---|---|
| Claim | Title — a complete declarative sentence | One per page, numbered C-n |
| Grounds | Body exhibit | Referenced by the title claim, numbered E-n |
| Warrant | One line under the title: "This holds because…" | Must be a **general rule**; restating the data is not a warrant |
| Backing | Footer source plus an appendix method page | Why the warrant is legitimate — benchmark, literature, historical calibration |
| Qualifier | Inside the title sentence: scope and interval | Governed by the verb permission table below |
| Rebuttal | "This fails if…" | Observable and decidable |

### Forcing the warrant into the open

The warrant is the highest-yield gap precisely because authors consider it obvious. Four mechanisms, increasing in strength:

1. **Sentence template.** `Because E-n, therefore C-n, on the grounds that W-n.` A page with an empty W slot is not ready.
2. **Scheme labelling.** Use Walton's argumentation schemes — expert opinion, sample-to-population, analogy, causal, consequences, best explanation. Each carries its own critical questions. Label the scheme and answer its weakest critical question on the page.
3. **Negation test.** Negate the warrant. If the claim's support is unchanged, the warrant is a tautology. Mechanical, and delegable to someone with no domain knowledge.
4. **Enthymeme audit.** Show only E and C to someone outside the project and have them write the warrant they infer. **The gap between their version and the author's is the missing architecture** — that is the inference the page is actually making, whether or not it was written down.

### The qualifier tension

Qualifiers lower a claim's apparent strength, and confidence is often read as competence. Do not resolve this by deciding whether to qualify. Resolve it on **how**.

O'Keefe's meta-analytic work on one-sided versus two-sided messages (*Communication Yearbook* 22, 1999) distinguishes two-sided messages **with** refutation from those **without**: refutational two-sided messages outperform one-sided, while non-refutational two-sided messages do worse. Effect magnitudes are not reproduced here — treat the direction as actionable and the size as unverified.

The operational consequence: **a bare "we also considered the risk of X" is worse than not raising X.** Every rebuttal pairs with a response, or is explicitly labelled unresolved with a stated hedge.

Writing rule: **put qualifiers on scope and magnitude, never on self-doubt.** "In channel X, over window Y, the effect is +8% (interval 5–12%)" is a precision statement. "We are not very sure" is a competence signal.

## The argument map page

One page, six blocks, so a reader can bypass the narrative and see the argument as a graph.

1. **Decision request** — what decision, what resources, when it expires.
2. **C0, the root claim** — with its qualifier.
3. **Pillars C1–C3** — each row: claim | warrant | evidence IDs | evidence grade | load-bearing assumption IDs.
4. **Load-bearing assumptions A1–A3** — assumption | current value | **switching point** | safety margin | signpost | review date.
5. **Rebuttals R1–R3** — failure condition | response | status (resolved / unresolved / hedged).
6. **Numbering rules** — C/E/A/W/R globally unique; **E defined once in the appendix, referenced in the body**; every body title traces to a C on this page; **no new C anywhere else**.

Not invented here: safety-critical assurance cases — Goal Structuring Notation and Claims-Arguments-Evidence, both descended from Toulmin — are exactly this. Wigmore charts do the same job in law.

## The causal ladder and verb permissions

Grounded in Pearl's ladder of causation, the Campbell–Stanley and Shadish–Cook–Campbell internal-validity tradition, the identification-strategy literature (Angrist and Pischke), and Bradford Hill (1965).

| Grade | Evidence form | Permitted verbs | Forbidden | Mandatory field |
|---|---|---|---|---|
| T0 | Single anecdote, testimonial | observed, occurred | all causal verbs | sample size n |
| T1 | Cross-sectional correlation, post-hoc survey | correlates with, co-occurred | improved, drove | correlation measure plus confounder list |
| T2 | Before/after with no control | changed during the period | produced, contributed, helped | contemporaneous external trend |
| T3 | Quasi-experiment: DiD, synthetic control, regression discontinuity, instrumental variables | **contributed X (interval …)** | caused, proves | identification assumption plus its test |
| T4 | Sound randomised experiment | **caused, causal effect is** | proves inevitable | power calculation plus assignment validation |
| T5 | Triangulated: experiment + mechanism + dose response + independent replication | established, the mechanism is | — | replication sources |

**Counterfactual requirement.** Any T3+ claim states the counterfactual on the same page: "without X, the control or synthetic control result would have been …". If it cannot be written, the grade drops to T2 automatically.

**Quasi-causal verb blacklist.** These smuggle causation without accepting the burden of proof: *drove, delivered, unlocked, enabled, powered, generated, led to, thanks to, as a result of, accounts for*. The bundled checker flags them.

**The blacklist is deliberately incomplete, and a clean run proves nothing.** English asserts causation in more ways than any word list holds — "following the rollout, retention recovered" makes the claim with no causal verb, and juxtaposing two charts makes it with no words. The checker's verdict means *no known offender was found*, not *the wording is licensed*.

## Load-bearing assumptions

**Generate** from two directions. The **reverse income statement** (McGrath and MacMillan, *Discovery-Driven Planning*, HBR 1995): write the outcome metric as an identity and decompose it; each multiplier is an assumption, exhaustive and mutually exclusive by construction. The **premortem** (Klein): assume failure has happened and reconstruct the path, catching mechanism assumptions the identity cannot reach.

**Filter** on two dimensions, keeping the intersection: **elasticity** (how far the outcome moves when the assumption moves — keep the largest three to five) and **epistemic uncertainty** (genuinely unknown versus merely unchecked). **A low-elasticity assumption never reaches the argument map however uncertain it is** — this is the filter that prevents twenty irrelevant caveats.

**Rank** by **distance to the switching point**, not by subjective impact-times-probability: find the value at which the conclusion flips, then safety margin = |current − switching| / current. Smallest margin first. This needs no subjective probability and any third party can recompute it.

**Verify** with RAND's assumption-based planning (Dewar): load-bearing assumption, vulnerability, **signpost**, hedging action. Each assumption states metric, threshold, observation date, source, owner, and the action triggered on breach. **An assumption with no observable metric is rewritten into observable form or marked unverifiable — and marking it unverifiable forces the claim's qualifier down.**

## Constructible rules — Part 2

| # | Mechanism | Do | Third-party test |
|---|---|---|---|
| A1 | Noun-phrase titles cannot be falsified (Alley's assertion–evidence structure) | Titles are complete declarative sentences | Scriptable: title contains a predicate; noun-phrase count is 0 |
| A2 | Dangling claims and orphan evidence are structural defects | Number everything C/E/A/W/R with explicit cross-references | Parse the graph: every claim has out-degree ≥1; no undefined references; no cycles; every E cited at least once |
| A3 | The omitted warrant is the largest scoring opportunity | One explicit W per C | `W_count == C_count`, then the negation test on each |
| A4 | Wording routinely outruns evidence | Apply the verb permission table | Scan causal verbs against the cited evidence's grade; T3+ without a counterfactual is an error |
| A5 | Hidden load-bearing assumptions are the dominant cause of failure | Switching point and signpost per decision-critical number | Switching point is a number traceable to a cell; all six signpost fields non-empty |
| A6 | Bare acknowledgement reduces persuasion (O'Keefe, 1999) | Rebuttals pair with responses | Unpaired rebuttal count is 0; unresolved ones carry an explicit hedge |

## Where explicit architecture hurts

1. **The real conflict is attention budget, not rigour versus persuasion.** A dependency graph consumes working memory. Layering is the way out: the map page carries the graph, the body carries the narrative, the appendix carries the backing. Mixing all three into the body means rigour destroys comprehension.
2. **The weakest claim stays in the body.** Only the *long tail* of the exhaustive rebuttal list may move to an indexed appendix. The weakest claim, the adverse evidence, and the strongest rebuttal stay in the body. Raising something verbally never discharges the obligation — the spoken version must point at a numbered appendix entry.
3. **Low-involvement audiences read qualifiers as weakness.** For readers who will not engage with detail, compress to the root claim plus the strongest exhibit and keep the architecture in backup.
4. **Every rule here is automatable and therefore gameable.** A warrant can be a tautology; a switching point can be a number nobody derived; the assumption table can be filled with soft assumptions. **Automated checks falsify form; they never certify quality.** Their value is freeing attention from format policing so it can judge warrants. Without that judgement, this degrades into a compliance ritual.
5. **Cost recovery.** A one-off, five-minute, low-consequence internal sync does not need a graph. Build one when the decision is irreversible or the material will outlive the month.
