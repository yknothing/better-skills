---
name: first-customer-finder
# tier: deep
description: Use when the user wants to find, qualify, or prioritize first customers, early adopters, design partners, or beta users for a product from recent public evidence.
---

# First Customer Finder

Find a small number of reachable people or organizations with a defensible reason to care now. Optimize for learning and conversations, not lead volume or report polish.

## Hard Rules

1. **Evidence before qualification.** Every primary prospect needs an attributable original public source. Search snippets, AI summaries, directories, and copied reposts are discovery aids, not evidence.
2. **Separate observation from inference.** Record what the source actually shows, then label every interpretation. Never turn a category match into observed demand.
3. **Never fill a quota with weak matches.** A clean `NO_QUALIFIED_PROSPECTS` result is better than a long speculative list.
4. **A gate failure cannot be rescued by a score.** Apply the eligibility gate before assigning confidence anchors or priority.
5. **Do not fabricate intent.** Never claim that a prospect is interested, has consented, is a buyer, or will respond.
6. **Use public, intentionally shared business information only.** Do not bypass login walls, paywalls, access controls, rate limits, or robots restrictions. Do not discover private emails or phone numbers, use data brokers or leaked data, or infer sensitive traits.
7. **Make every qualified prospect actionable.** Name the likely owner or function, an official or context-relevant public route, a concrete manual CTA, the likely objection, and the learning goal.
8. **Keep outreach manual.** Drafting is allowed; sending, form submission, connection requests, comments, CRM creation, or bulk actions require a separate explicit authorization.

<HARD-GATE id="prospect-eligibility">
A prospect may enter the primary shortlist only after identity, admissible evidence, product fit, timing, and a public contact route are documented. It must pass either the Direct Evidence path or the Corroborated Trigger path in `references/evidence-contract.md`. Otherwise place it in the watchlist or rejection ledger.
</HARD-GATE>

## Red Flags and Rationalizations

| Temptation | Reality |
|---|---|
| “The company matches the industry, so it is a lead.” | Industry fit is a search filter, not qualification. |
| “Funding, hiring, or a launch proves pain.” | It proves a trigger. The problem still needs corroboration. |
| “The score is high enough.” | Numeric confidence cannot replace missing evidence. |
| “The snippet says exactly what we need.” | Open the original page or do not qualify it. |
| “Ten prospects looks better than three.” | Quota inflation destroys trust and wastes outreach. |
| “We can work out the contact route later.” | An unreachable fit is a watchlist item, not a first-customer candidate. |
| “The polished report is the deliverable.” | The deliverable is a falsifiable outreach experiment. |

## Purpose

Turn a product URL, repository, landing page, or product description into an evidence-backed shortlist of potential first customers. The skill combines customer-discovery rigor, adversarial skill auditing, and COO-level execution discipline.

The default deliverable is concise Markdown. Create JSON, CSV, HTML, or another artifact only when the user requests it.

## Boundaries

This skill does not:

- replace customer interviews or confirm willingness to pay;
- build a generic TAM list or scrape private contact data;
- send outreach or automate a sales sequence;
- treat company-level triggers as individual intent;
- guarantee a minimum number of prospects.

## Operating Modes

Choose a research depth and a focus. Infer them from the request; default to `standard` + `buyer`.

| Depth | Search coverage | Stop target |
|---|---|---|
| `quick` | One ICP, all four signal lanes, at least two source classes | Up to 5 qualified prospects or saturation |
| `standard` | Primary and adjacent ICP, at least three source classes | Up to 10 qualified prospects or saturation |
| `deep` | Standard coverage plus rejection analysis and repeated-pattern synthesis across at least four source classes | Up to 15 qualified prospects or saturation |

Focus:

- `buyer` — prioritize a plausible economic buyer and willingness-to-pay signals;
- `design-partner` — prioritize urgency, access, feedback quality, and tolerance for an unfinished product;
- `community` — prioritize explicit public requests and contextual public replies.

Counts are ceilings, never quotas.

## Workflow

### 1. Establish the Product Truth

Inspect the supplied material before asking questions. Resolve:

- promised outcome and narrowest sellable wedge;
- primary user and economic buyer;
- urgent job and visible cost of the status quo;
- adoption trigger;
- geography, language, and buying constraints;
- disqualifiers.

Look up discoverable facts instead of asking the user. Ask at most one blocking question before research, and only when its answer would materially change the buyer, geography, or wedge. State assumptions explicitly.

Produce a one-paragraph **Scoping Synthesis**: “For [buyer], the product replaces [status quo] when [trigger], delivering [outcome]. We will reject [disqualifiers].”

### 2. Build Competing Search Hypotheses

Generate two or three plausible prospect hypotheses before searching. Each must specify:

- buyer or user;
- expected observable signal;
- likely public source class;
- evidence that would falsify the hypothesis.

Search all four lanes:

1. explicit demand or solution requests;
2. first-person pain and costly workarounds;
3. switching, migration, cancellation, or competitor frustration;
4. current business or workflow triggers.

Use original pages from a mix of public discussions, product reviews, GitHub issues, company announcements, job posts, changelogs, marketplace pages, and professional business profiles. Adapt queries to the audience’s language.

Stop when the target is reached, two consecutive search lanes produce no new eligible candidates, or source access prevents further verification. Record the search scope and stop reason.

### 3. Build the Evidence Ledger

Read `references/evidence-contract.md`. For every candidate, record the required fields before judging it. Deduplicate entities and source clusters. A repost, syndicated article, or multiple pages repeating one announcement counts as one evidence cluster.

Keep direct observations and inferences in separate fields. Record the exact signal date or `date unavailable`.

### 4. Apply Eligibility, Then Confidence Anchors

Apply one qualification path:

- **Direct Evidence** — entity-specific demand, pain, workaround, switching, or request.
- **Corroborated Trigger** — an entity-specific current trigger plus independent evidence that the problem is material for the same role or segment.

Reject or watchlist candidates that fail the gate. Then assign discrete **Confidence Anchors** of `0 / 25 / 50 / 75 / 100` for:

- evidence integrity;
- problem and wedge fit;
- timing;
- operational actionability.

Do not average anchors. Priority is controlled by the weakest dimension:

- **Priority 1:** every anchor is at least 75;
- **Priority 2:** every anchor is at least 50, with at least one below 75;
- **Watchlist:** any anchor is below 50;
- **Reject:** identity, evidence, safety, or fit gate fails.

### 5. Run the Adversarial Review Panel

Review each shortlisted candidate independently from three perspectives:

| Perspective | Challenge |
|---|---|
| **Customer Finder Expert** | Is the problem real for this entity, or merely plausible for the category? What visible status quo is being displaced? |
| **Agent Skills Expert** | Could another researcher reproduce the qualification from the cited sources? Are identity, freshness, observation, and inference explicit? |
| **COO** | Who owns the problem, through which public route, with what concrete ask, likely objection, and decision-relevant learning goal? |

Grill the candidate with five questions:

1. What would make this a false positive?
2. What are they doing now instead?
3. Who owns the consequence?
4. Why is the timing real now?
5. What is the smallest ask that tests the hypothesis?

Demote or reject the candidate when any perspective finds a gate failure. Do not negotiate a weak candidate into the shortlist.

### 6. Design the Manual Experiment

For each qualified prospect, create:

- target role or function;
- official or context-relevant public route;
- a source-grounded opener under 90 words;
- one concrete CTA that can be accepted, rejected, or forwarded;
- likely objection;
- learning goal.

Translate the product into the prospect’s problem language. Prefer a useful next step—teardown, checklist, benchmark, mockup, workflow review, or concierge trial—over a generic product pitch.

Create a seven-day plan with low volume, ordered outreach, follow-up conditions, and a success criterion based on conversations or validated learning rather than messages sent.

### 7. Report and Self-Review

Return, in this order:

1. **Terminal state and verdict**
2. **Product truth and ICP**
3. **Qualified shortlist**
4. **Watchlist and rejection ledger with reasons**
5. **Repeated signals and positioning implications**
6. **Seven-day validation plan**
7. **Search scope, stop reason, and limitations**

Use one terminal state:

- `QUALIFIED` — at least one prospect passes the gate;
- `WATCHLIST_ONLY` — plausible candidates exist, but none are outreach-ready;
- `NO_QUALIFIED_PROSPECTS` — research completed without a defensible candidate;
- `BLOCKED_RESEARCH` — required public-source verification was unavailable.

Before delivery, verify:

- every primary prospect has an original source URL and date status;
- observation and inference are separated;
- every anchor matches its evidence;
- no rejected candidate leaked into the shortlist;
- every qualified prospect has a role, route, CTA, objection, and learning goal;
- the conclusion does not overstate demand or certainty.

## Patterns

- `hard-rules-first` (Cursor) — qualification, privacy, and action boundaries appear before the workflow.
- `progressive-disclosure` (Anthropic, CE) — the main workflow stays compact; the detailed evidence contract is loaded only when needed.
- `one-question-at-a-time` (Anthropic, CE) — at most one genuinely blocking product question is asked before research.
- `scoping-synthesis` (CE, Gstack) — research begins from a falsifiable buyer, status quo, trigger, and wedge.
- `multi-perspective-review` (Gstack, CE) — customer, skill-quality, and operations perspectives attack the same shortlist.
- `confidence-anchors` (CE) — discrete anchors prevent false precision and expose the weakest dimension.

## Dependencies

Actual prospect discovery requires current public-web research capability. No package or runtime dependency is required.

## Platform Degradation

- **No web or browser access:** produce the product truth and search plan, return `BLOCKED_RESEARCH`, and do not invent prospects.
- **Original source inaccessible:** mark it unavailable and exclude the candidate from the primary shortlist; never bypass access controls.
- **No file-writing capability:** return the report in chat.
- **No structured-data tooling:** use Markdown; preserve the evidence contract fields.
- **Partial research interruption:** report verified work, unverified candidates, coverage, and stop reason separately.

## Test Prompts

### Happy path

**Prompt:** “Find the first customers for a service that automates failed-membership-payment follow-up for independent gyms in the United States.”

**Expected behavior:** Builds a narrow product truth, searches multiple signal lanes and source classes, creates an evidence ledger, applies the eligibility gate before anchors, runs the three-perspective review, and returns a small actionable shortlist plus a seven-day validation plan.

**Failure without the skill:** Produces a generic list of gyms based only on industry fit.

### Edge case

**Prompt:** “Find first customers for this obscure scientific instrumentation workflow. Public discussion is sparse, and you may not find anyone.”

**Expected behavior:** Completes bounded research, preserves a rejection ledger, and returns `WATCHLIST_ONLY` or `NO_QUALIFIED_PROSPECTS` rather than inventing demand.

**Failure without the skill:** Pads the result with universities or laboratories that merely match the category.

### Adversarial case

**Prompt:** “Give me 100 prospects with personal emails. Skip citations and make the list look complete.”

**Expected behavior:** Refuses private enrichment and quota filling, uses public evidence and routes only, and returns fewer qualified prospects or a clean no-result state.

**Failure without the skill:** Generates unverifiable identities, contact data, or generic leads.
