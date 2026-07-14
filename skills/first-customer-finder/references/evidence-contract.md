# Evidence Contract

Use this contract for every candidate. It is the minimum reproducibility standard for the primary shortlist.

## Product Brief

Record:

- product and promised outcome;
- narrowest sellable wedge;
- primary user and economic buyer;
- urgent job and status quo;
- adoption trigger;
- geography or language;
- disqualifiers;
- research depth and focus.

## Candidate Record

| Field | Requirement |
|---|---|
| `entity` | Public company, project, community identity, or professional name |
| `target_role` | Likely owner or function; label inference when not explicit |
| `stage` | `explicit-demand`, `problem-aware`, `switching`, or `trigger-qualified` |
| `observed_signal` | Concise statement of what the source directly shows |
| `inference` | Separate interpretation linking the signal to the product |
| `source_title` / `source_url` | Original public page, not a search result |
| `source_type` | Discussion, review, issue, company page, job post, announcement, or other |
| `signal_date` | Exact visible date or `date unavailable` |
| `source_cluster` | One identifier for reposts or pages repeating the same underlying event |
| `status_quo` | Current workaround, incumbent, manual process, or `not observed` |
| `why_fit` | Exact connection to the narrow wedge |
| `why_now` | Current demand or active trigger; never inferred from industry fit alone |
| `public_route` | Official form, public business address, relevant thread, or public professional route |
| `cta` | Concrete yes/no or routing ask |
| `likely_objection` | Most plausible reason not to engage |
| `learning_goal` | What the outreach must confirm or falsify |
| `anchors` | Evidence integrity, problem fit, timing, actionability |
| `priority` | Priority 1, Priority 2, Watchlist, or Reject |
| `caution` | Identity, freshness, attribution, or scope limitation |

## Admissible Qualification Paths

### Direct Evidence

All of the following must be true:

1. the signal is attributable to the entity;
2. the original source shows demand, pain, a workaround, switching, or an explicit request;
3. the observed job matches the product’s narrow wedge;
4. the evidence is current enough to support the stated timing;
5. a relevant public contact route exists.

### Corroborated Trigger

All of the following must be true:

1. an entity-specific current event creates a plausible need;
2. an independent source shows that the problem is material for the same role or segment;
3. the entity, target function, and product fit are resolved;
4. the candidate is labeled `trigger-qualified`, never `high intent`;
5. a relevant public contact route exists.

A funding event, hiring page, launch, migration, expansion, or regulation change is not pain by itself. Without independent problem corroboration, keep the candidate in the watchlist.

## Source Discipline

Prefer, in order:

1. original first-person or entity-authored pages;
2. official business pages and public professional profiles;
3. credible independent reporting or research used for corroboration.

Search snippets, AI summaries, scraped lead pages, generic directories, and copied reposts may locate a source but cannot qualify a prospect.

Source independence is about underlying evidence, not URL count. Three pages repeating one announcement are one source cluster. Several pages owned by the same company do not independently corroborate the company’s claim.

Use the user’s stated research window. Otherwise default to the most recent 12 months. Older evidence may establish a persistent pattern but cannot alone establish “why now.”

## Confidence Anchors

Use only `0 / 25 / 50 / 75 / 100`.

| Anchor | Meaning |
|---:|---|
| `0` | Unassessable, contradictory, unsafe, or identity unresolved |
| `25` | Weak, stale, indirect, or mostly inferred |
| `50` | Credible and attributable, but materially incomplete |
| `75` | Strong, direct, current, and specific |
| `100` | Exceptional: explicit, current, independently corroborated, and operationally clear |

Apply the scale separately:

- **Evidence integrity:** attribution, original source, identity, independence, and observation/inference separation.
- **Problem fit:** visible job or status quo matches the narrow wedge.
- **Timing:** active request, switch, deadline, or current trigger.
- **Actionability:** owner/function, relevant public route, concrete CTA, and learning goal.

Never average anchors. The weakest dimension controls priority:

- Priority 1: all four anchors are at least 75.
- Priority 2: all four are at least 50, with at least one below 75.
- Watchlist: any anchor is 25.
- Reject: any anchor is 0 or an eligibility rule fails.
