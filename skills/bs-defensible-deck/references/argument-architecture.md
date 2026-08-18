<!-- Parent skill: skills/bs-defensible-deck/SKILL.md -->
<!-- Open this file when: Phase 2 (Build the argument graph) is reached -->

# Argument Architecture

> **Parent skill**: [../SKILL.md](../SKILL.md) — this is Phase 2 (Build the argument graph)
> **Prerequisites**: Phase 1 complete — `claims.md` has a pre-registration block and passes the checker
> **Produces**: the C/E/A/W/R dependency graph in `claims.md`, plus the argument-map page

## The thesis

A deck's architecture is a **directed acyclic dependency graph** of claims, warrants, evidence, assumptions, and rebuttals. Page order, narrative, and visuals are renderings of that graph, not the architecture itself. Three properties make a graph defensible, and all three are measurable:

1. **Closure** — no dangling claims, no orphan evidence, no undefined references.
2. **Load visibility** — which assumption, if it fails, flips the conclusion, stated in the open.
3. **Grade match** — causal wording licensed by evidence strength.

## Why "Background / Current state / Proposal / Plan / Risks" is a fake architecture

Apply the **portability test**: drop that outline onto a completely unrelated proposal. Does it still work? It does — which proves it carries zero information about *this* argument. It describes a document genre. Four things it structurally hides:

1. **Direction of inference.** The outline implies background drove the proposal. Often the proposal came first and the background was assembled to fit. A dependency graph exposes this: evidence with exactly one out-edge, pointing at a conclusion that was already fixed.
2. **Load-bearing points.** Chapters look equally weighted. A graph lets you count downstream dependents — an assumption supporting seven claims is an architectural element; a chapter heading is not.
3. **Omitted warrants.** The outline has no slot for "why does this evidence support this conclusion", so the warrant is always dropped. Aristotle's *enthymeme*: the unstated premise the audience is left to supply.
4. **Real rebuttal conditions.** A "Risks" chapter lists *project* risks (might we execute badly). A Toulmin rebuttal is an *argument* failure condition (might the conclusion be wrong in the first place). Conflating them is one of the widest cracks a reviewer can enter.

## Toulmin's six elements on a slide

Based on Toulmin, *The Uses of Argument* (1958).

| Element | Physical location | Constraint |
|---|---|---|
| Claim | Title — a complete declarative sentence | One claim per page, numbered C-n |
| Grounds | Body exhibit | Every exhibit referenced by the title claim, numbered E-n |
| Warrant | One line directly under the title: "This holds because…" | Must be a **general rule**; restating the data is not a warrant |
| Backing | Footer source plus an appendix method page | Points at why the warrant is legitimate — benchmark, literature, historical calibration |
| Qualifier | Inside the title sentence: scope and interval | Governed by the verb permission table below |
| Rebuttal | "This fails if…" | Must be observable and decidable |

### Forcing the warrant into the open

The warrant is the highest-yield target for a hostile reviewer precisely because authors consider it obvious. Four mechanisms, increasing in strength:

1. **Sentence template.** `Because E-n (observation), therefore C-n (conclusion), on the grounds that W-n (general rule).` A page with an empty W slot is not ready for review.
2. **Scheme labelling.** Use Walton's argumentation schemes — expert opinion, sample-to-population, analogy, causal, consequences, best explanation. Each scheme carries its own critical questions. Label the scheme in use and answer its weakest critical question on the page. Sample-to-population, for instance, must address sampling bias.
3. **Negation test.** Negate the warrant. If the claim's support is unchanged, the warrant is a tautology. This is a mechanical check that can be delegated to someone with no domain knowledge.
4. **Enthymeme audit.** Show only E and C to someone who did not build the deck; have them write the warrant they infer. **The gap between their version and the author's is the exposure** — the reviewer will supply their own version, and theirs is the one that gets attacked.

### The qualifier tension, handled honestly

The tension is real: qualifiers lower a claim's apparent strength, and confidence is often read as competence. Do not resolve it by hedging on whether to qualify. Resolve it on **how**.

The relevant evidence is O'Keefe's meta-analytic work on one-sided versus two-sided messages (*Communication Yearbook* 22, 1999), which distinguishes two-sided messages **with** refutation from two-sided messages **without**. The direction of the finding is that refutational two-sided messages outperform one-sided ones, while non-refutational two-sided messages perform worse than one-sided. Effect magnitudes are not reproduced here — treat the direction as actionable and the size as unverified.

The operational consequence is sharp: **a bare "we also considered the risk of X" is worse than not raising X at all.** Every rebuttal pairs with a response, or is explicitly labelled unresolved with a stated hedge.

Convergent writing rule: **put qualifiers on scope and magnitude, never on self-doubt.** Write "in channel X, over window Y, the effect is +8% (interval 5–12%)". Do not write "we are not very sure". The first is a precision statement; the second is a competence signal.

## The argument map page

One page, six blocks, so a reviewer can bypass the narrative and audit directly.

1. **Decision request** — one sentence: what decision, what resources, when it expires.
2. **C0, the root claim** — including its qualifier.
3. **Pillars C1–C4** (five maximum) — each row: claim sentence | warrant in one line | evidence IDs | evidence grade | load-bearing assumption IDs.
4. **Load-bearing assumptions A1–A3** — assumption | current value | **switching point** | safety margin | signpost metric | review date.
5. **Rebuttals R1–R3** — failure condition | our response | status (resolved / unresolved / hedged).
6. **Numbering rules** — C/E/A/W/R globally unique; **E is defined once in the appendix and only referenced in the body**; every body page title traces up to some C on this page; **no new C may be introduced anywhere except this page**.

This representation is not invented here. Safety-critical assurance cases — Goal Structuring Notation, and Claims-Arguments-Evidence, both descended from Toulmin — are exactly this: goals, strategies, evidence, plus context and assumption nodes. Wigmore charts do the same job in law.

## The causal ladder and verb permissions

Grounded in Pearl's ladder of causation (association / intervention / counterfactual), the Campbell–Stanley and Shadish–Cook–Campbell internal-validity tradition, the identification-strategy literature (Angrist and Pischke), and Bradford Hill's viewpoints (1965).

| Grade | Evidence form | Permitted verbs | Forbidden verbs | Mandatory field |
|---|---|---|---|---|
| T0 | Single anecdote, testimonial | observed, occurred | all causal verbs | sample size n |
| T1 | Cross-sectional correlation, post-hoc survey | correlates with, co-occurred | improved, drove | correlation measure plus confounder list |
| T2 | Before/after with no control | changed during the period | produced, contributed, helped | contemporaneous external trend |
| T3 | Quasi-experiment: difference-in-differences, synthetic control, regression discontinuity, instrumental variables | **contributed X (interval …)** | caused, proves | identification assumption plus its test, e.g. a parallel-trends chart |
| T4 | Sound randomised experiment: pre-registered, adequately powered, no spillover | **caused, causal effect is** | proves inevitable | power calculation plus assignment validation |
| T5 | Triangulated: experiment plus mechanism plus dose response plus independent replication | established, the mechanism is | — | replication sources |

**Counterfactual requirement.** Any claim at T3 or above states the counterfactual on the same page: "without X, the control or synthetic control result would have been …". If the counterfactual cannot be written, the grade drops to T2 automatically.

**Quasi-causal verb blacklist.** These smuggle causation without accepting the burden of proof: *drove, delivered, unlocked, enabled, powered, generated, led to, thanks to, as a result of, accounts for*. The bundled checker flags them.

**The blacklist is deliberately incomplete, and a clean run proves nothing.** English asserts causation in more ways than any word list holds — "following the rollout, retention recovered" makes the claim with no causal verb at all, and bare juxtaposition of two charts makes it with no words. So the checker's verdict means *no known offender was found*, not *the wording is licensed*. Matching wording to evidence is a judgement the human reviewer makes; the list only removes the easy cases from their queue.

## Load-bearing assumptions

### Generate

Two directions, converging.

- **Reverse income statement** (McGrath and MacMillan, *Discovery-Driven Planning*, HBR 1995): write the outcome metric as an identity and decompose it. Each multiplier is an assumption. This is exhaustive and mutually exclusive by construction.
- **Premortem** (Klein): assume the proposal has already failed and reconstruct the failure path. This catches mechanism assumptions the identity cannot reach.

### Filter to the lethal ones

Two-dimensional; keep only the intersection.

- **Elasticity** — how far the outcome metric moves when the assumption moves. Keep the three to five largest.
- **Epistemic uncertainty** — genuinely unknown, or merely unchecked.

**A low-elasticity assumption never reaches the argument map, however uncertain it is.** This is the filter that prevents twenty irrelevant caveats.

### Rank

Not by subjective impact-times-probability. By **distance to the switching point**: find the value at which the conclusion flips, then safety margin = |current − switching| / current. Smallest margin ranks first. This requires no subjective probability and any third party can recompute it.

### Design verification

Following RAND's assumption-based planning (Dewar): load-bearing assumption, vulnerability, **signpost**, hedging action. Each assumption must state: metric, threshold, observation date, data source, owner, and the action triggered on breach.

**An assumption with no observable metric is either rewritten into observable form or marked unverifiable — and marking it unverifiable forces the claim's qualifier down.**

Sequence verification by smallest safety margin first, cheapest test first among ties.

## Constructible rules

| # | Why | Do | Third-party test |
|---|---|---|---|
| A1 | Noun-phrase titles cannot be falsified and are the main device for hiding claims (Alley's assertion–evidence structure) | Every page title is a complete declarative sentence | Scriptable: title must contain a predicate; count of noun-phrase titles must be 0 |
| A2 | Dangling claims and orphan evidence are structural defects | Number everything C/E/A/W/R with explicit cross-references | Parse the graph: every claim has out-degree ≥ 1; no undefined references; no cycles; every E referenced at least once, unreferenced E moves to the appendix |
| A3 | The omitted warrant is the largest scoring opportunity for a reviewer | One explicit W per C | Count: `W_count == C_count`; then run the negation test on each |
| A4 | Wording routinely outruns evidence | Apply the verb permission table | Scriptable: scan causal verbs, look up the grade of the evidence cited by that sentence, error if below threshold; error if a T3+ claim lacks a counterfactual |
| A5 | Hidden load-bearing assumptions are the dominant cause of failure | Every decision-critical number gets a switching point and a signpost | Check the assumption table: switching point must be a number traceable to a cell; all six signpost fields non-empty |
| A6 | Bare acknowledgement of counter-arguments reduces persuasion (O'Keefe, 1999) | Pair every rebuttal with a response | Count of unpaired rebuttals must be 0; unresolved ones must carry an explicit hedge |
| A7 | Genre outlines masquerade as architecture | Require the argument map page | Portability test: move C1–C4 to an unrelated proposal; if they still read as sensible, fail |

## Where explicit architecture hurts

Four honest limits.

1. **The real conflict is attention budget, not rigour versus persuasion.** A dependency graph consumes working memory. Layering is the only way out: the map page carries the graph, the body carries the narrative, the appendix carries the backing. Mixing all three into the body means rigour destroys comprehension.
2. **Under asymmetric review, rebuttals get weaponised.** When a reviewer can veto at no cost to themselves, a failure-condition list becomes ready-made ammunition. This is structural and cannot be written away.

   The available compromise is narrow, and **Hard Rules 2 and 5 override it wherever they conflict**. What may move to an indexed appendix is the *long tail* of the exhaustive rebuttal list — the completeness material. What may not move, under any circumstances, is the weakest claim, the adverse evidence, or the single strongest rebuttal: Rule 2 puts those in the main body, because a reviewer who finds them unprompted prices them as concealment, which costs more than the ammunition did. And raising something verbally never discharges the obligation — Rule 5 means the spoken version must point at a numbered appendix entry the reviewer can turn to. Verbal delivery is a routing device, never the evidence itself.
3. **Low-involvement audiences read qualifiers as weakness.** For reviewers who will not engage with argument detail, compress to the root claim plus the single strongest exhibit and keep the architecture in the backup material. Its purpose shifts from persuading to surviving spot checks.
4. **Every rule above is automatable and therefore gameable.** A warrant can be written as a tautology; a switching point can be filled in without any sensitivity analysis; the assumption table can be populated with soft assumptions. **Automated checks falsify form, they never certify quality.** Their real value is freeing human adversarial attention from format policing so it can go after warrants. Without that human pass, this degrades into a compliance ritual.
