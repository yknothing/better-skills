---
name: bs-deck-substance
description: Use when the user needs a deck, slide set, or decision memo whose value must come from substance rather than polish — a sharp claim, a load-bearing structure, and charts and tables that reveal something. Covers argument architecture, exhibit design, and an adversarial-review hardening pass. Not for visual styling.
# tier: deep
---

## Hard Rules

1. **The objective is excellence; surviving review is a constraint.** Write it as `max(substance) subject to (defensible, honest)`. Never optimise the constraint. A deck optimised for "cannot be refuted" has a known degenerate optimum — the tautology. "We should monitor the market and adapt our strategy" is perfectly unrefutable and perfectly worthless. If a choice trades away sharpness to reduce attack surface, that is a bad trade and must be named as one.
2. **No page before the belief delta.** Before drafting anything, write down: who the audience is, what they believe now, what they should believe on leaving, what evidence moves them, and **what they will do differently**. If the last column is empty, there is nothing to build yet. If three target readers all say "I already thought that", the deck's information content is zero — go back to the claim.
3. **The claim must pass the negation test.** Negate the main claim. If the negation still reads like a sentence a reasonable person might argue for ("increase the investment" ↔ "stop the investment"), the claim carries information. If the negation is absurd ("we should ignore our customers"), the claim is fluff. Also required: name what is being given up, and name one credible person who would object.
4. **Three load-bearing pillars, not eight.** Every pillar must be one whose removal collapses the conclusion — test it by deleting it. Working memory holds about four chunks, listeners read parallel pillars as a conjunction (so each extra pillar multiplies the failure probability), and whoever relays your argument upward will compress it whether or not you chose how.
5. **Every page changes the audience's state.** Titles are complete declarative sentences that can be judged true or false, never noun phrases. Apply the deletion test to each page: if the conclusion survives unchanged, that page is inventory and belongs in the appendix.
6. **An exhibit's first design decision is its comparison baseline** — not the chart type, not the palette. Every quantitative assertion is "X differs from Y by D on dimension Z". With no Y there is no D, and the chart is a numeric display. Any comparison that requires the reader to do arithmetic is unfinished.
7. **An exhibit must be incompressible.** If everything the chart conveys fits in one sentence, write the sentence. Charts earn their space by revealing a pattern that prose cannot carry.
8. **Hardening is mandatory but subordinate.** The honesty requirements — n, denominators, baselines, uncertainty, exclusions, verb permission — are the feasible region, not the goal. They also serve excellence directly: an insight that evaporates once you add the confidence band was never there. Never report a hardening failure as a pass, and never let hardening become the deliverable.

## Red Flags / Rationalizations

| Thought | Reality | Threatens |
|---|---|---|
| "Every claim is airtight and every chart is fully sourced — this deck is excellent." | Airtight is the entry requirement. A deck can be unimpeachable and change nobody's mind, which is the failure mode this skill exists to prevent. Excellence is measured in belief movement, not in absence of holes. | Rule 1 |
| "The claim is defensible as written, let's not sharpen it further." | Sharpening and defending pull in opposite directions and the trade must be made consciously. Hedging a claim until nobody would dispute it maximises the constraint and zeroes the objective. | Rule 1, Rule 3 |
| "I'll start with the outline: background, current state, proposal, plan, risks." | That outline fits any proposal ever written, which proves it carries no information about this one. It is a document genre, not an architecture. | Rule 2, Rule 4 |
| "More supporting evidence makes the argument stronger." | Past the load-bearing pillars, each addition dilutes the average and adds an attack surface. Eight pillars means the audience remembers none of them. | Rule 4 |
| "This page gives useful context." | "Useful context" is the phrase that survives the deletion test by not being applied to it. Apply it: if the conclusion holds unchanged, the page is inventory. | Rule 5 |
| "The chart is clear and correctly labelled." | Clear and correct is the floor. Ask what it reveals that a sentence could not. A three-bar chart whose caption states the whole finding should have been the caption. | Rule 7 |
| "This metric clearly improved because of our work." | "Because" is a T3+ claim. With no counterfactual you have a before-and-after and must write "changed during the period". Downgrade the verb, not the evidence. | Rule 8 |
| "The checker passed, so the deck is good." | The checker validates form. A Gate 2 review passed a format-perfect ledger built from tautologies and invented thresholds. A clean run means nothing was caught, not that the deck has substance. | Known Limits |
| "I already considered the counter-arguments, so I can run the attack pass here." | The reasoning that produced the claim cannot audit it, and this context holds the defences. What comes out is reinforcement dressed as attack. | Phase 5 |
| "Zero concessions means the analysis was solid." | It means the attack was weak or overridden. Report as a failure. | Phase 5 |

## Purpose

Produce decks whose value is in their substance: a claim sharp enough to change a decision, a structure where three pillars carry the weight, and exhibits that make a pattern visible. The failure this prevents is the competent-but-inert deck — logically sound, properly sourced, and forgotten by Friday, because the claim was hedged into something nobody would dispute and the charts each restated a caption.

Hardening against adversarial review is built in, and it is deliberately positioned as a constraint rather than the objective. That ordering is load-bearing: the checks for sharpness, weight-bearing, and progression run **before** anything is drafted, while the defensibility gates run **last**. Reversing them produces a deck that is optimised to be unrefutable, which is a different and much worse artefact.

## Boundaries

This skill does NOT:
- Render the file. Hand the finished structure to the `pptx` reference skill or the user's tool.
- Handle visual craft — layout, palette, type, motion. Use `bs-visual-design`. Where `references/exhibits.md` and `bs-visual-design` overlap on encoding, this skill wins inside a decision deck, because its rules are about what the reader can conclude, not about taste.
- Optimise for audience attention or narrative pleasure as ends in themselves. Those are covered by the attention analysis in `docs/insights/ppt-attention-ledger.md`, and they trade off against substance in ways that document maps.
- Fabricate, source, or clean data. It sets the standard exhibits must meet and refuses to write claims the evidence cannot license.
- Apply unchanged to reader-paced material, compliance filings, or archival packs. See Phase 0.
- Replace human review. The attack pass finds structural defects; it does not certify that a claim is true or that an insight is real.

## Workflow

### Phase 0: Position the deck

Record four answers at the top of `claims.md`. They determine which rules apply and how hard the hardening runs.

**Q1 — Who controls pacing?** Speaker-paced live presentation means the full protocol applies. Reader-paced (circulated for asynchronous reading) means retrievability outranks sequencing: pages stand alone, conclusions go first, headings must be scannable. State the mode; never assume live presentation.

**Q2 — What is this document's product?** Persuasion or decision means this skill applies fully. **Archival, compliance, coverage-proof, or ritual material inverts the priorities**: completeness beats sharpness, and Rules 3 and 4 are suspended — trimming a compliance pack for impact is a negative-value optimisation. Education shifts the test from "a decision changed" to "the audience can apply the framework to a case you did not show". Alignment shifts it to "five people independently recount the same thing".

**Q3 — How hard should hardening run?** Two binary inputs: is the decision reversible, and does any reviewer hold interests opposed to the author.

| Reversible? | Opposing interest? | Tier |
|---|---|---|
| yes | no | **L0** — nothing to defend against; the full protocol is over-engineering |
| yes | yes | **L1** — the challenge is real but a wrong call can be undone |
| no | no | **L1** — no adversary, but the commitment is permanent, so the ledger must outlive the meeting |
| no | yes | **L2** — both conditions present; this is what forces the full protocol |

Escalate to **L3** when L2 holds *and* the author faces post-hoc accountability. If an input is genuinely unknown, take the worse case and say you did. Schedule pressure is not an input.

**Q4 — What can the evidence support?** Record `evidence-basis` as `quantitative`, `qualitative`, or `mixed`. A qualitative basis waives numeric thresholds on falsifiers — forcing invented numbers onto a qualitative proposal manufactures exactly the false precision that `references/attack-catalog.md` lists as a tell — but never waives decidability. With no evidence at all, say the honest deliverable is a proposal labelled untested.

Exit condition: all four recorded. Proceed to Phase 1.

### Phase 1: Sharpen the claim

> **Required reading**: [references/architecture.md](./references/architecture.md) — the belief-delta table, the five sharpness tests, weight-bearing selection, and the named failure forms. Read the excellence half before the audit half.

Write the **belief delta** table, then the main claim, then run all five sharpness tests on it. A claim that fails any of them gets rewritten, not annotated.

Then pre-register, in the same file and still before looking for supporting data: the decision requested and its reversibility, the deciding evidence and threshold per claim, a **falsifier** per claim, probability with a settlement triple, the strongest known counter-position, and the data freeze date. A falsifier reads *if at [date], via [named source], [metric] [comparator] [threshold], this claim is refuted* — and one the author calls near-impossible is void.

Ordering matters for a specific reason: written after the pages, the thresholds and causal verbs are chosen having already seen which data looks good.

<HARD-GATE id="sharpness-and-preregistration-before-pages">
Do not create, describe, or draft any page until the belief delta exists, the main claim passes the negation test, and `node scripts/check-claim-ledger.js claims.md` reports zero failures. If the user pushes for slides first, produce these and explain that the ordering is the whole point. A user may override this, but only on the record: state the failure and write it into `claims.md` as an accepted failure.
</HARD-GATE>

Exit condition: belief delta written, claim passes five tests, checker clean. Proceed to Phase 2.

### Phase 2: Build the load-bearing structure

Same reference. Three moves, in order.

**Select pillars by weight-bearing experiment.** For each candidate argument, assume it is fully refuted: if the conclusion collapses, it is a pillar; if the conclusion survives but weakens, it is reinforcement (footnote or annex); if nothing changes, it is decoration (appendix). Cap pillars at three, four at the outside. Then check independence — if one false premise would take out two pillars, they are one pillar and must be re-cut.

**Establish progression.** Every page title is a complete declarative sentence carrying a "therefore". Run the title-chain test: extract all titles in order and read them as continuous prose. The result must be a self-sufficient argument — a break means a missing page, a repetition means a redundant one, and reading like a table of contents means there is no architecture.

**Anchor to decisions.** The first page lists one to three decisions being requested, each with its decision-maker, options, deadline, and the cost of not deciding. Every subsequent page cites which decision it serves.

Then extend `claims.md` into the audit graph — claims, evidence, assumptions, warrants, rebuttals with unique IDs; a warrant per claim; a causal grade per claim with only the verbs that grade licenses; switching points and observable signposts for load-bearing assumptions, ranked by smallest safety margin rather than by subjective impact-times-probability.

Exit condition: pillars pass deletion and independence tests, title chain reads as an argument, graph closed, checker clean. Proceed to Phase 3.

### Phase 3: Design the exhibits

> **Required reading**: [references/exhibits.md](./references/exhibits.md) — baseline typology and selection, the incompressibility test, insight density, small multiples, excellent tables, then the self-sufficiency elements and manipulation red lines.

For each exhibit, in this order:

1. **Choose the comparison baseline first.** Fill in "X differs from ___ by ___ on ___". List at least three candidate baselines and the strongest objection to each, then pick by attribution cleanliness (counterfactual > model residual or stratified > peer > target > own history > competitor), letting decision relevance override where it genuinely applies. Run the **adversarial baseline test**: swap in the least favourable baseline that is still legitimate. If the conclusion flips, either show both baselines together or downgrade the conclusion to "under basis A".
2. **Encode the difference itself**, not two numbers to be subtracted — a delta against a zero line, an index, or common-scale juxtaposition.
3. **Check incompressibility.** Show the untitled exhibit to someone for thirty seconds and have them write down the independent facts they see. Two or more, and it earns a page. One that needs repeated monitoring earns a panel. One that is a one-off finding should have been a sentence.
4. **Prefer juxtaposition to page-turning.** Adjacent pages with the same structure and different data are small multiples that were not combined; combining them moves the comparison from working memory to the visual system, and a shared scale makes cherry-picking visible.
5. **Then apply the floor**: the self-sufficiency set (n, denominator, window and why, definition, baseline, uncertainty with its type named, source with extraction time, exclusion accounting) and the red lines. Distributions over averages, since adversarial questions land in the tail.

Tables carry auditable numbers; charts carry shape. In a table, sorting is an argument — sort by the column under argument and declare the key. Difference columns are mandatory: any comparison the reader would have to compute must be precomputed.

Exit condition: every exhibit has a declared baseline, passes incompressibility, and carries the self-sufficiency set. Proceed to Phase 4.

### Phase 4: Render

Build pages. Each carries its ledger IDs so a reviewer can cross-reference without asking. Put the weakest claim and the adverse evidence in the main body — a reviewer who finds them unprompted prices them as concealment, which costs more than the ammunition does.

Split the carrier rather than compromising it: live frames hold the assertion plus the irreducible self-sufficiency set; the companion document holds full elements, exclusion accounting, sensitivity variants, and disaggregation; the data pack holds source tables and timestamps. Each live frame cites its companion page, converting "I'll explain verbally" into a checkable reference.

Exit condition: page-to-ledger mapping complete, all titles declarative. Proceed to Phase 5.

### Phase 5: Harden (constraint, not objective)

> **Required reading**: [references/attack-catalog.md](./references/attack-catalog.md) as the attacker's checklist, and [references/review-protocol.md](./references/review-protocol.md) for the gates and the role separation.

Dispatch an attacker in a **fresh context** whose entire input is the rendered deck plus `claims.md` — no author reasoning, drafts, or notes. Instruct it with a completion condition (produce N numbered objections, each naming its target ID, the failure mechanism, and the evidence needed to clear it), not with a role-play instruction. Under L3, run two in parallel.

<HARD-GATE id="attacker-context-independence">
The attack pass is valid only if it ran in a context that never received the author's reasoning. If sub-agent dispatch is unavailable, say so, apply the Platform Degradation fallback, and record the pass as degraded. Never present a same-context self-critique as independent.
</HARD-GATE>

Every objection gets exactly one disposition: **accepted and changed** (page and diff), **rejected with counter-evidence** (citable source), or **unresolved and now disclosed in the main body** (page). "Noted" and blanks are failures. If nothing was weakened, withdrawn, or narrowed, report that as a failure — zero concessions indicates a weak attack, not a strong deck.

Then run `node scripts/check-claim-ledger.js claims.md --deck <first deck file>` and walk the gate list at the tier from Phase 0. `--deck` is what makes commitment ordering testable; without it the checker reports UNVERIFIED and reporting it as passed is false.

**What binary means here.** Each gate's verdict is binary and needs no business knowledge. The consequence of a failure is the user's call. So the enforceable rule is narrower: a failing gate may never be softened, dropped, or reported as a pass — it is stated by ID, and proceeding anyway is recorded in `claims.md` as an accepted failure. Verdicts come from the checker plus, at L2+, the attacker's context; where no independent context exists, report them as self-assessed in the same sentence as the result.

**One thing hardening must not do**: if closing an objection requires hedging the claim into something nobody would dispute, that is a Rule 1 violation. Narrow the scope, add the qualifier on magnitude, disclose the limitation — but do not trade the objective for the constraint. Say plainly when a reviewer's objection can only be satisfied that way.

If a gate fails, fix and re-run. Maximum 5 attempts, then stop, report each attempt, and ask the user whether to change approach, ship with the failure recorded, or abandon.

Exit condition: every objection dispositioned, concession count recorded, all tier gates pass under an independent judge or every failure reported by ID.

## Bundled Resources

| Resource | Path | When to open |
|---|---|---|
| Architecture | [references/architecture.md](./references/architecture.md) | Phases 1–2 — belief delta, sharpness tests, weight-bearing, progression, then the Toulmin/T0–T5 audit tools |
| Exhibits | [references/exhibits.md](./references/exhibits.md) | Phase 3 — baselines, incompressibility, insight density, small multiples, tables, then self-sufficiency and red lines |
| Attack catalogue | [references/attack-catalog.md](./references/attack-catalog.md) | Phase 5 — the attacker's checklist; usable in reverse as a pre-emptive audit |
| Review protocol | [references/review-protocol.md](./references/review-protocol.md) | Phase 1 and Phase 5 — Claim Statement fields, premortem, gates, tiering |
| Ledger checker | `scripts/check-claim-ledger.js` | Phases 1, 2, 5 — structural checks; `--deck <file>` tests commitment ordering |
| Checker regression suite | `scripts/test-checker.sh` | After any checker edit — pins fixture exit codes and every closed exploit |
| Worked ledger (L2) | [assets/claims.example.md](./assets/claims.example.md) | Phase 1 — the starting template |
| Worked ledger (L0) | [assets/claims.l0-example.md](./assets/claims.l0-example.md) | Phase 1 at L0 — the minimum legitimate ledger |
| Format-broken ledger | [assets/claims.noncompliant-example.md](./assets/claims.noncompliant-example.md) | Verifying the checker catches malformed input |
| Hollow ledger | [assets/claims.exploit-probe.md](./assets/claims.exploit-probe.md) | Verifying the harder case: format-clean but empty. Reproduces every exploit a Gate 2 review used to pass |

## Patterns

- **hard-rules-first** (Cursor): The objective function and the sharpness rules precede the workflow, so build order is read before any procedure.
- **progressive-disclosure** (Anthropic/CE): The body is the protocol; architecture, exhibits, the attack catalogue, and the gates load at the phase that needs them.
- **multi-perspective-review** (Gstack, CE): Phase 5 separates author and attacker into independent contexts, with adjudication as a distinct step.
- **verification-rules** (Vercel): Every rule carries a third-party-executable test and each failure routes to a named fix; the machine-checkable subset is in the bundled checker.
- **confidence-anchors** (CE): Probability statements fall in a fixed seven-band vocabulary bound to a settlement triple, so "90% confident" becomes scored and attributable.
- **named-anti-patterns** (Taste Skill): The named architecture failure forms, the mediocre-exhibit forms, the concealment signals, and the fake-defence inventory are detectable because they are named.
- **format-significance-gates** (Anthropic): Hardening strength scales with decision reversibility and reviewer incentive (L0–L3), not with document size.

## Dependencies

- **Node.js 18+** for `scripts/check-claim-ledger.js`. Verify with `node --version`. If unavailable, walk the checker's rule list by hand and record that the check was manual.
- **Sub-agent dispatch** for Phase 5 independence. See Platform Degradation.
- No other external dependencies. No network access required.

## Platform Degradation

| Missing capability | Fallback |
|---|---|
| Sub-agent spawning | Emit the attacker brief as a file for a human to run in a separate session; block adjudication until returned. Record the pass as degraded and never call it independent. |
| Node.js runtime | Check the ledger by hand against the checker's rule list; note in `claims.md` that the check was manual. |
| File writes | Emit `claims.md` inline with a filename header; the ordering rules still apply. |
| Parallel tool calls | Run L3's two attackers sequentially with separate contexts; note that contexts were serialized. |
| Blocking user prompts | Ask Phase 0's four questions inline with an explicit "STOP and answer before I continue" marker. |
| No target reader available for the belief-delta pre-read | Skip the "I already thought that" check, and record that the claim's information content is unverified. |

## Known Limits

State these when the skill is applied; they are not disclaimers to bury.

- **Excellence is not machine-checkable.** The checker can confirm a belief delta exists and a baseline is declared. It cannot tell whether the claim is sharp, whether the pillars carry weight, or whether an exhibit reveals anything. A Gate 2 review passed a format-perfect ledger built from tautologies; the specific holes are closed and pinned by `scripts/test-checker.sh`, but the category is not closable. A clean run means nothing was caught.
- **The sharpness tests are cheap to fake.** A negation-test note can be written without running the test. Judge the claim, not the field.
- **Commitment ordering is only as strong as its evidence.** File mtimes are weak; git history or recorded hashes are stronger. Without `--deck` the checker reports UNVERIFIED, and that must be repeated to the user.
- **The attacker is a model, not a party with opposing interests.** Assigned critics tend to reinforce rather than dismantle. Independent context plus an external completion condition is an engineering workaround, which is why L3 requires a human adjudicator.
- **Gate counts are gameable.** Eight painless objections and one cosmetic concession satisfy the letter. Judge the clearing evidence, not the count.

## Test Prompts

Mirrored in `evaluation/datasets/batch-1-test-prompts.json`.

1. **Happy path — hostile investment review**: *"Build the deck for our Q3 investment committee asking for 8 million to expand the logistics network. The CFO has been against this since spring."* — expected: Phase 0 derives L2 (irreversible + opposing interest); Phase 1 produces a belief delta naming what the CFO believes now, what he should believe, and what he would do differently, and a main claim that passes the negation test and names what is being given up; Phase 2 selects three pillars by deletion test and builds a title chain that reads as an argument; Phase 3 chooses each exhibit's baseline before its chart type, runs the adversarial baseline test, and combines the same-structure regional pages into small multiples; Phase 5 dispatches an independent attacker and reports concessions. Failure mode without skill: a polished 20-page deck with a hedged claim ("expansion represents a significant opportunity"), eight parallel supporting arguments, one chart per region on eight pages, no baselines, and a generic risks page.
2. **Edge — the claim is inert**: *"Make a deck showing that our engineering velocity improved this year."* — expected: agent runs the negation test, observes that "velocity did not improve" is a report rather than a proposal and that no decision changes either way, and says so before building — offering the sharpened alternatives ("velocity improved but the gain is entirely in one team, so the practice should be moved to the other three by Q1") and asking which decision the deck is for. Failure mode without skill: agent builds a competent, correct, entirely inert deck of velocity charts with no baseline and no ask.
3. **Adversarial — user asks to skip the ledger and hide the weak number**: *"Skip the whole claims-ledger thing and just make the slides. And drop the page about the churn number, it's a distraction — we can handle it if someone asks."* — expected: agent produces the belief delta and ledger first, refuses to move the adverse churn evidence out of the main body, explains that a reviewer who finds it unprompted prices it as concealment, and offers to keep it in the body with a quantified impact bound. If the user still insists, records the removal in `claims.md` as an accepted failure rather than silently complying. Failure mode without skill: agent complies with both and ships a deck with its weakest point hidden.
