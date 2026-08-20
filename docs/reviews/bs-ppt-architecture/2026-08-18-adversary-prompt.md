# Gate 2 — Peer Review Prompt: Adversary

You are the **adversary reviewer** for the `bs-ppt-architecture` skill. Your job is to break it: find ways the skill produces wrong output, fails on edge cases, contradicts itself, has bypassable safety gates, or makes the agent worse off than no skill at all. Be ruthless.

## How to use this prompt

1. Read the SKILL.md content below in full.
2. Produce a markdown review and save it to:
   `docs/reviews/bs-ppt-architecture/2026-08-18-adversary-review.md`
3. Use the **required structure** below — the validator (`tools/peer-review.js check`) will reject reviews missing required sections.

## Required structure

```markdown
# Adversary Review: bs-ppt-architecture

**Date**: 2026-08-18
**Reviewer Role**: Adversary
**Skill**: bs-ppt-architecture
**HUMAN_VERIFIED**: false

## Summary

(2-4 sentences: how many issues, of what severity, and the worst-case impact.)

## Findings

### F1: <short title>  [CRITICAL]

**Location**: <section / line range in SKILL.md>
**Exploit scenario**: <how a user could trigger the failure>
**Root cause**: <what in the skill design enables it>
**Suggested fix**: <concrete change>

### F2: <short title>  [HIGH]

(...repeat the structure for each finding...)

(Use severity tags: CRITICAL / HIGH / MEDIUM / LOW. At least one finding must be present, even if severity is LOW. If you genuinely find none, say so explicitly and tag it LOW.)

## Verdict

**Verdict**: <one of: REQUIRES_CHANGES / NEEDS_IMPROVEMENT / APPROVED>

(One paragraph rationale.)
```

## SKILL content under review

```markdown
---
name: bs-ppt-architecture
description: Use when the user must build a deck, slide set, or decision memo that will face hostile scrutiny — investment committees, boards, due diligence, audits, peer review, or any reviewer with an incentive to reject it. Covers argument architecture, exhibit (chart and table) evidence quality, and a pre-review self-attack protocol. Not for making slides look good.
# tier: deep
---

## Hard Rules

1. **Ledger before slides.** Write `claims.md` (the Claim Ledger) and get it past the structural check BEFORE creating any page. A deck built first and documented later is rationalization, not argument. If the user asks for slides immediately, produce the ledger first and say why.
2. **Self-exposure beats defense.** A deck's strength equals the degree to which it surfaces its own weakest point unprompted. Anything a reviewer has to dig for is priced as concealment. The weakest claim must be named, quantified, and placed in the main body — never only in an appendix.
3. **Verb permission.** Causal language is licensed by evidence grade (T0–T5 in `references/architecture.md`). Never write "drove", "led to", "caused", or "delivered" for evidence below its threshold. Downgrade the verb, not the evidence.
4. **Every claim carries its warrant.** For each claim, state the general rule that licenses the jump from evidence to conclusion. An unstated warrant is the single highest-yield target for a hostile reviewer.
5. **Exhibits are self-sufficient.** A chart or table whose validity depends on the presenter's spoken words is not evidence. n, denominator, window, definition, baseline, uncertainty, and source must be on the exhibit.
6. **The attacker must be independent.** The self-attack pass runs in a separate context that receives only the rendered deliverables — never the author's reasoning, drafts, or scratch files. Self-questioning inside the authoring context does not satisfy this rule and must not be reported as if it did.
7. **Non-zero concession.** If the final deck weakens, withdraws, or narrows nothing relative to the pre-registered claims, the review was theater. Report this as a gate failure, not as a clean pass.
8. **No naked rebuttal.** Every acknowledged counter-argument is paired with a response or explicitly labelled unresolved with a hedge. A bare "we also considered the risk of X" is worse than silence.

## Red Flags / Rationalizations

| Thought | Reality | Threatens |
|---|---|---|
| "The user just wants slides, the ledger is overhead." | The ledger is the deliverable that survives the meeting. Skipping it means the causal verbs and thresholds get chosen after seeing which data looks good — textbook HARKing. | Rule 1 |
| "I'll write the ledger after the deck, same content either way." | Not the same content. Order is the entire mechanism: pre-commitment is what makes the falsifier honest. | Rule 1 |
| "I already thought about the counter-arguments while writing." | Reasoning that produced the claim cannot audit the claim. Motivated reasoning is not defeated by intending to be fair. | Rule 6 |
| "I'll run the attack pass myself in this context, it's equivalent." | The author's chain of thought leaks the defenses. This produces cognitive bolstering, not attack. Same-context self-attack is a detectable violation. | Rule 6 |
| "This metric clearly improved because of our work." | "Because" is a T3+ claim. Without a counterfactual you have a T2 before/after and must write "changed during the period". | Rule 3 |
| "Adding a risks page covers the weaknesses." | A risks page listing macro/competitive/regulatory items concedes nothing the author is accountable for. Reviewers read it as a liability disclaimer. | Rule 2 |
| "Sensitivity analysis at plus/minus 10 percent shows robustness." | Uniform bands test the parameters the author chose. The reviewer wants the switching point and the current distance from it. | Rule 2 |
| "The full data is in the appendix, so it's disclosed." | Disclosure without navigation is a bet that nobody looks. Unreferenced appendices raise suspicion rather than lowering it. | Rule 2 |
| "The reviewer will ask and I'll explain the chart then." | An exhibit that needs narration has already lost the exchange; the reviewer now controls framing. | Rule 5 |
| "Zero concessions means the analysis was solid." | It means the attack pass was weak or the author overrode it. Report as gate failure. | Rule 7 |
| "The user is in a hurry, I'll use the light tier." | Tier is set by decision reversibility and reviewer incentive, never by schedule pressure. | Phase 0 |

## Purpose

Produce decks whose argument structure and exhibits hold up under adversarial review. The failure this skill prevents: an agent writes a persuasive, well-designed deck that collapses on the third question because the causal claim has no counterfactual, the key chart has no denominator, and the load-bearing assumption was never identified. This skill inverts the build order — claims and their falsifiers are committed first, exhibits are held to an evidence standard, and an independent attacker runs before the deck is delivered.

Distinct from making slides *effective* (audience attention, narrative flow) and from making slides *look good* (typography, layout, colour). Those optimise for reception. This optimises for **surviving a reviewer who wants to say no**.

## Boundaries

This skill does NOT:
- Generate the `.pptx` / `.key` / PDF file. Hand the finished structure to the `pptx` reference skill or the user's tool of choice for rendering.
- Handle visual craft — layout, palette, type, motion. Use `bs-visual-design` for that.
- Optimise for attention, narrative arc, or persuasion of a friendly audience. Those trade off against this skill's goals; see `references/review-protocol.md` for where the conflict is real.
- Fabricate, source, or clean data. It sets the standard exhibits must meet and refuses to write claims the supplied evidence cannot license.
- Apply to reader-paced material without adjustment. See Phase 0.
- Replace human review. The attacker pass finds structural defects; it does not certify that the argument is correct.

## Workflow

### Phase 0: Triage (never skip)

Answer three questions and record the answers at the top of `claims.md`.

**Q1 — Who controls pacing?** Speaker-paced and non-reversible (live presentation) means the full protocol applies. Reader-paced (a document circulated for asynchronous reading, or a deck read before a silent-reading meeting) means retrievability outranks sequencing: every page must stand alone, conclusions go first, and headings must be scannable. State which mode applies; do not silently assume live presentation.

**Q2 — What is the review intensity?** Set by decision reversibility and reviewer incentive, not by page count or deadline.

| Tier | Condition | Required |
|---|---|---|
| L0 | Reversible, no resource commitment, no opposing interest | Falsifiers (G2) and probability discipline (G3) only |
| L1 | Team-level, rollback possible, good-faith questioning | G1–G3, G5 with 4+ objections, G8 |
| L2 | Cross-org resource commitment, partly irreversible, a reviewer with opposing interest | All gates, 8+ objections, independent attacker |
| L3 | High-stakes hostile review, major irreversible commitment, post-hoc accountability | L2 plus two parallel attackers, external adjudicator, calibration log |

Decision rule: **irreversible AND a reviewer with interests opposed to the author ⇒ at least L2.** Reversible with no opposing interest ⇒ L0/L1 is correct and the full protocol is over-engineering. State the tier and the rule that produced it.

**Q3 — What is this document's product?** Persuasion/decision means this skill applies fully. Archival, coverage proof (due diligence packs), compliance, or ritual/accountability material means the primary constraint is completeness or traceability, not defensibility of a thesis — say so and adapt rather than trimming for elegance.

Exit condition: pacing mode, tier, and product recorded. Proceed to Phase 1.

### Phase 1: Pre-register the claims

> **Required reading**: [references/review-protocol.md](./references/review-protocol.md) — the Claim Statement fields, premortem procedure, probability vocabulary, and full gate list.

Copy [assets/claims.example.md](./assets/claims.example.md) to `claims.md` in the working directory — it is a worked ledger that passes the checker, and it defines the format contract the checker parses (`## Section` → `### ID` → `- field: value`, one field per line). Fill the pre-registration block BEFORE looking for supporting data and before any page exists. Minimum fields: 1–3 core claims (each one sentence with subject, magnitude, and time window); the decision being requested and its reversibility; for each claim the deciding evidence and threshold; a **falsifier** per claim; probability with a settlement triple; the strongest known counter-position; what evidence would change the author's mind; and the data freeze date.

A falsifier must read: *if at [date], via [named source], [metric] [comparator] [numeric threshold], this claim is refuted.* Three elements are mandatory — numeric threshold, date, named source. A falsifier the author simultaneously calls near-impossible is void; rewrite it.

<HARD-GATE id="preregistration-before-pages">
Do not create, describe, or draft any slide until the pre-registration block is complete and `node scripts/check-claim-ledger.js claims.md` reports zero errors. If the user pushes for slides first, produce the ledger and explain that reordering these two steps is what the skill exists to prevent.
</HARD-GATE>

Exit condition: pre-registration block complete, checker clean. Proceed to Phase 2.

### Phase 2: Build the argument graph

> **Required reading**: [references/architecture.md](./references/architecture.md) — dependency-graph construction, Toulmin mapping, the C/E/A/W/R numbering scheme, the T0–T5 causal ladder with its verb permissions, and switching-point analysis.

Extend `claims.md` into a dependency graph: claims (C), evidence (E), assumptions (A), warrants (W), rebuttals (R), each with a unique ID and explicit references. Every claim needs a warrant and at least one evidence reference. Every claim carries a causal grade and only the verbs that grade licenses.

For assumptions, compute the **switching point** — the value at which the conclusion flips — and the current safety margin. Rank by smallest margin, not by subjective impact-times-probability; margin is third-party recomputable. Each load-bearing assumption gets an observable signpost: metric, threshold, observation date, source, owner, and the action triggered on breach.

Apply the **portability test** to the resulting structure: if the top-level claim skeleton could be dropped onto an unrelated proposal unchanged, it describes a document genre rather than this argument. Rebuild it.

Exit condition: graph closed (no dangling claims, no orphan evidence, no undefined references), checker clean. Proceed to Phase 3.

### Phase 3: Build the exhibits

> **Required reading**: [references/exhibits.md](./references/exhibits.md) — the self-sufficiency element list, the claim-type-to-chart-form mapping, table construction rules, the manipulation red lines with their tests, and the distribution-first principle.

For each evidence item that becomes a chart or table: pick the form the claim type requires (form is a logical choice, not an aesthetic one), attach every self-sufficiency element, and prefer distributions to averages. Where an exhibit's parameters are free — axis start, window, base period, smoothing, grouping — declare them; an undeclared free parameter that would flip the conclusion is treated as manipulation.

Tables carry the auditable numbers; charts carry direction and shape. Any aggregate figure that will be quoted needs n, a dispersion measure, and one forced disaggregation along the dimension most likely to confound it.

Exit condition: every exhibit passes the self-sufficiency check; every quoted metric traces to one source table. Proceed to Phase 4.

### Phase 4: Render

Now build pages. Each page title is a complete declarative sentence that can be judged true or false — never a noun phrase. Each page maps to ledger IDs, and the page carries those IDs so a reviewer can cross-reference without asking. Place the weakest claim and the adverse evidence in the main body per Rule 2.

Split the carrier rather than compromising it: live frames hold the assertion plus the irreducible self-sufficiency set; the companion document holds full elements, exclusion accounting, sensitivity variants, and disaggregation; the data pack holds source tables and extraction timestamps. Each live frame cites the companion page that backs it — this converts "I'll explain verbally" into a checkable reference.

Exit condition: page-to-ledger mapping complete, all titles declarative. Proceed to Phase 5.

### Phase 5: Independent attack

Dispatch an attacker in a **fresh context** whose entire input is the rendered deck plus `claims.md` — no author reasoning, no drafts, no working notes. Instruct it with a completion condition (produce N numbered objections, each naming its target ID, the failure mechanism, and the evidence required to clear it), not with a role-play instruction. Attackers told to "act like a critic" while holding the author's reasoning perform bolstering, not attack.

Use `references/attack-catalog.md` as the attacker's checklist: it holds the catalogued attack families, the three-question priority order used when a reviewer has limited budget, the observable signals that a deck is concealing something, and the fake-defense inventory. Under L3, run two attackers in parallel with independent contexts.

<HARD-GATE id="attacker-context-independence">
The attack pass is valid only if it ran in a context that never received the author's reasoning. If sub-agent dispatch is unavailable, say so explicitly, apply the fallback in Platform Degradation, and record the pass as degraded. Never present a same-context self-critique as an independent attack.
</HARD-GATE>

Exit condition: numbered objection list produced by an independent context. Proceed to Phase 6.

### Phase 6: Adjudicate

Every objection gets exactly one disposition: **accepted and changed** (with the page and diff), **rejected with counter-evidence** (with a citable source), or **unresolved and now disclosed in the main body** (with the page). "Noted", "will follow up", and blank dispositions are gate failures.

Record concessions. If the final claims are not weakened, withdrawn, or narrowed anywhere relative to Phase 1, report a G6 failure rather than a clean result — and say plainly that zero concessions indicates a weak attack pass, not a strong deck.

Exit condition: every objection dispositioned; concession count recorded. Proceed to Phase 7.

### Phase 7: Gate

Run `node scripts/check-claim-ledger.js claims.md` and walk the gate list in `references/review-protocol.md` at the tier set in Phase 0. Gates are binary and judged without business knowledge: existence, format, and ordering only. Report each gate as pass or fail with the reason. Never soften a failure into a caveat.

If a gate fails, fix and re-run. Maximum 5 attempts; then stop, report each attempt and why it failed, and ask the user whether to change approach, ship with the failure documented, or abandon.

Exit condition: all gates for the tier pass, or failures are explicitly reported to the user with the tier and the specific gate IDs.

## Bundled Resources

| Resource | Path | When to open |
|---|---|---|
| Attack catalogue | [references/attack-catalog.md](./references/attack-catalog.md) | Phase 5 — the attacker's checklist; also usable in reverse as a pre-emptive audit |
| Argument architecture | [references/architecture.md](./references/architecture.md) | Phase 2 — dependency graph, Toulmin mapping, T0–T5 verb permissions, switching points |
| Exhibit standards | [references/exhibits.md](./references/exhibits.md) | Phase 3 — self-sufficiency elements, chart-form mapping, table rules, red lines |
| Review protocol | [references/review-protocol.md](./references/review-protocol.md) | Phase 1, and again at 5–7 — Claim Statement fields, premortem, gates G1–G9, tiering |
| Ledger checker | `scripts/check-claim-ledger.js` | Phase 1 and Phase 7 — 16 structural checks, exit 1 on any failure |
| Worked ledger | [assets/claims.example.md](./assets/claims.example.md) | Phase 1 — copy as the starting template; passes the checker with zero failures |
| Non-compliant ledger | [assets/claims.noncompliant-example.md](./assets/claims.noncompliant-example.md) | When verifying the checker actually fails; catalogues 15 violation types |

## Patterns

- **hard-rules-first** (Cursor): Eight non-negotiable rules precede the workflow, so build order and verb permission are read before any procedure.
- **progressive-disclosure** (Anthropic/CE): The body is the protocol; the attack catalogue, argument architecture, exhibit standards, and gate list load on demand at the phase that needs them.
- **multi-perspective-review** (CE): Phase 5 separates author and attacker into independent contexts, with adjudication as a distinct step — the structural answer to motivated reasoning.
- **verification-rules** (Superpowers): Every rule in the references carries a third-party-executable test; the machine-checkable subset is enforced by the bundled checker.
- **confidence-anchors** (CE): Probability statements must fall in a fixed seven-band vocabulary and bind to a settlement triple, so "90% confident" becomes a scored, attributable claim.
- **named-anti-patterns** (Superpowers): The fake-defense inventory and the concealment-signal list name failure modes explicitly, which is what makes them detectable.
- **format-significance-gates** (CE): Gate strength scales with decision reversibility and reviewer incentive (L0–L3) rather than with document size.

## Dependencies

- **Node.js 18+** — required by `scripts/check-claim-ledger.js`. Verify with `node --version`. If unavailable, walk the checker's rule list in `references/review-protocol.md` manually and record that the structural check was performed by hand.
- **Sub-agent dispatch** — required for Phase 5 independence. See Platform Degradation for the fallback.
- No other external dependencies. No network access required.

## Platform Degradation

| Missing capability | Fallback |
|---|---|
| Sub-agent spawning | Emit the attacker brief as a file for a human to run in a separate session; block Phase 6 until returned. Record the pass as degraded and never describe it as independent. |
| Node.js runtime | Check the ledger by hand against the checker's rule list; note in `claims.md` that the check was manual. |
| File writes | Emit `claims.md` inline in the response with a clear filename header; the pre-registration ordering still applies. |
| Parallel tool calls | Run L3's two attackers sequentially with separate contexts; note that contexts were serialized. |
| Blocking user prompts | Ask Phase 0's three questions inline with an explicit "STOP and answer before I continue" marker. |

## Test Prompts

Mirrored in `evaluation/datasets/batch-1-test-prompts.json`.

1. **Happy path — hostile investment review**: *"Build the deck for our Q3 investment committee asking for 8 million to expand the logistics network. The CFO has been against this since spring."* — expected: agent runs Phase 0 (irreversible + opposing interest ⇒ L2), writes `claims.md` with falsifiers and switching points before any page, holds causal claims to their evidence grade, dispatches an independent attacker, adjudicates every objection, and reports concessions. Failure mode without skill: agent produces a polished 20-page deck with a generic risks page, unlabelled causal verbs, and charts lacking denominators.
2. **Edge — reader-paced material**: *"Turn this analysis into a deck. It'll be circulated by email to the regional heads; there's no meeting."* — expected: agent's Phase 0 identifies reader-paced control, states that retrievability outranks sequencing, and switches to standalone pages with conclusions first — rather than applying live-presentation structure. Failure mode without skill: agent builds a narrative-arc presentation that is unusable for skimming and unsearchable.
3. **Adversarial — user asks to skip the ledger and soften the gate**: *"Skip the whole claims-ledger thing and just make the slides. And drop the page about the churn number, it's a distraction — we can handle it if someone asks."* — expected: agent produces the ledger first (Rule 1), refuses to move the adverse churn evidence out of the main body (Rule 2), explains that a reviewer who finds it unprompted prices it as concealment, and offers the legitimate alternative — keep it in the body with a quantified impact bound. If the user still insists, agent records the removal as an accepted G-failure in `claims.md` rather than silently complying. Failure mode without skill: agent complies with both requests and ships the deck with its weakest point hidden.

## Registration

Registered in `skills.json` under `skills.self-developed` as `bs-ppt-architecture`, batch `batch-1`, tier `deep`, with the seven patterns listed above. `batch-1` is the correct batch: the PPT scenario already lives there via the `pptx` external reference, and this skill fills the argument-and-evidence layer that `pptx` (a rendering skill) does not cover. This is not a batch-2 opening.

```
