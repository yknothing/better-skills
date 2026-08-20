# Discovery Lenses

Open this reference in Step 3. Select the fewest lenses that cover the current
risk. Freeze every first pass before cross-examination.

## Shared Output Contract

Each lens returns:

1. Thesis in two sentences or fewer.
2. Supporting evidence IDs.
3. Critical assumptions.
4. Disconfirming evidence already present.
5. Unknowns that can change the thesis.
6. Recommended next move.
7. Confidence anchor.
8. What would change this lens's mind.

A lens that cites no evidence must mark its thesis as hypothesis, not insight.

## Demand Investigator

**Objective:** determine whether a specific person or organization is already
paying a meaningful cost for the problem.

Ask: Who experiences the pain? Who buys? What triggers action? What happens today?
What behavior, payment, workaround, or risk proves the problem matters? What would
show that the problem is merely interesting?

Fail the thesis when it relies only on stated interest, generic market size,
complaints without action, or an undefined user.

## Product Visionary

**Objective:** reveal the workflow-level product that a narrow initial idea may
hide.

Ask: What does a 10-star completed outcome feel like? Which steps disappear? What
new behavior becomes possible? What product boundary is inherited from current
tools rather than user needs? Which expansion changes the buying reason rather
than adding surface area?

Fail the thesis when “10-star” means more features, more AI, or a bigger platform
without a changed user outcome.

## Frontier Visionary

Use this lens for `FRONTIER` mode or whenever present-day evidence may lag a new
technology, behavior, cost curve, regulation, or distribution shift.

**Objective:** protect a plausible non-consensus opportunity from being erased by
categories and metrics created for the previous world, while keeping the thesis
falsifiable and the exposure bounded.

Ask:

- What has changed that makes this newly possible, desirable, or distributable?
- What firsthand anomaly has the founder observed repeatedly?
- What future behavior could users enact before they have stable language or a
  budget category for it?
- Which incumbent assumption becomes false if the causal mechanism is right?
- Why is this founder unusually able to discover or build the answer?
- What must be built and placed in a real workflow before the thesis can be known?
- What result would falsify the mechanism without demanding mature-market metrics
  too early?

Do not fail a thesis solely because no category, search volume, incumbent budget,
or current paid market exists. Fail it when the supposed insight has no causal
mechanism, the founder edge is only confidence, the build cannot touch reality,
the downside is unbounded, or no observation could change the thesis.

Return a draft `CB-##` Conviction Thesis when the Frontier Gate may be relevant.
Label it `UNVALIDATED_CONVICTION`; never present it as customer evidence.

## Positioning and Distribution Strategist

**Objective:** find the smallest market the product can credibly own and an
executable path to the first users.

Ask: What event creates urgency? What category and alternative live in the buyer's
mind? Why this product? Why now? Where are the first 10 and first 100 reachable
users? Which message maps to a behavior already happening?

Fail the thesis when distribution is only a channel label such as SEO, Product
Hunt, communities, partnerships, or outbound without a target list, search intent,
partner type, or access mechanism.

## Skeptical Operator

**Objective:** expose economic, operational, platform, trust, and maintenance
failure modes.

Ask: What must stay true for gross margin, support, reliability, permissions,
compliance, and platform access? Which cost was moved rather than removed? What
breaks at the worst moment? What is the cheapest way to disprove this business?

Fail the thesis when it treats local inference as zero operating cost, assumes
platform access remains stable, or postpones a trust requirement that shapes the
core workflow.

## Technical Feasibility

Use only when feasibility is a top-two product risk or when the product gate is
otherwise ready.

**Objective:** test whether the promised outcome is possible within the required
quality, latency, data, privacy, and maintenance constraints.

Ask: What deterministic and model-based components are required? What ground truth
exists? How are failures detected and escalated? Which dependencies or permissions
can invalidate the product?

Do not turn this lens into architecture design. Return feasibility evidence,
unknowns, and a spike or benchmark when needed.

## Conflict Map

After first passes, create one row per material disagreement:

| Conflict ID | Claim A | Claim B | Evidence or CB IDs | Downstream impact | Resolution mechanism | Status |
|---|---|---|---|---|---|---|

Use only `FACT_NEEDED`, `OWNER_DECISION`, or `EXPERIMENT_NEEDED` as the resolution
mechanism. Status is `OPEN`, `RESOLVED`, or `DEFERRED_WITH_BLOCK`.

Do not synthesize an “enterprise-ready single-purpose product” or similar hybrid
merely because two lenses disagree. A hybrid must independently win on evidence,
not serve as diplomatic compromise.
