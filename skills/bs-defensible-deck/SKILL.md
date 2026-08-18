---
name: bs-defensible-deck
description: Use when the user must build a deck, slide set, or decision memo that will face hostile scrutiny — investment committees, boards, due diligence, audits, peer review, or any reviewer with an incentive to reject it. Covers argument architecture, exhibit (chart and table) evidence quality, and a pre-review self-attack protocol. Not for making slides look good.
# tier: deep
---

## Hard Rules

1. **Ledger before slides.** Write `claims.md` (the Claim Ledger) and get it past the structural check BEFORE creating any page. A deck built first and documented later is rationalization, not argument. If the user asks for slides immediately, produce the ledger first and say why.
2. **Self-exposure beats defense.** A deck's strength equals the degree to which it surfaces its own weakest point unprompted. Anything a reviewer has to dig for is priced as concealment. The weakest claim must be named, quantified, and placed in the main body — never only in an appendix.
3. **Verb permission.** Causal language is licensed by evidence grade (T0–T5 in `references/argument-architecture.md`). Never write "drove", "led to", "caused", or "delivered" for evidence below its threshold. Downgrade the verb, not the evidence.
4. **Every claim carries its warrant.** For each claim, state the general rule that licenses the jump from evidence to conclusion. An unstated warrant is the single highest-yield target for a hostile reviewer.
5. **Exhibits are self-sufficient.** A chart or table whose validity depends on the presenter's spoken words is not evidence. n, denominator, window, definition, baseline, uncertainty, and source must be on the exhibit.
6. **The attacker must be independent.** The self-attack pass runs in a separate context that receives only the rendered deliverables — never the author's reasoning, drafts, or scratch files. Self-questioning inside the authoring context does not satisfy this rule and must not be reported as if it did.
7. **Non-zero concession.** If the final deck weakens, withdraws, or narrows nothing relative to the pre-registered claims, the review was theater. Report this as a gate failure, not as a clean pass.
8. **No naked rebuttal.** Every acknowledged counter-argument is paired with a response or explicitly labelled unresolved with a hedge. A bare "we also considered the risk of X" is worse than silence.

## Red Flags / Rationalizations

| Thought | Reality | Threatens |
|---|---|---|
| "I'll write the ledger after the deck — same content either way, and it saves a step." | Not the same content. Order is the entire mechanism: written afterwards, the causal verbs and thresholds are chosen having already seen which data looks good. That is HARKing with slides. | Rule 1 |
| "The checker passed, so the deck is sound." | The checker validates form. A Gate 2 review passed a format-perfect ledger built entirely of tautologies and invented thresholds. A clean run means nothing has been *caught*, not that nothing is wrong. | Known Limits |
| "I already thought about the counter-arguments, and I can run the attack pass myself here." | The reasoning that produced the claim cannot audit it, and this context already holds the defences. What comes out is reinforcement dressed as attack — and same-context self-attack is detectable, so reporting it as independent is a false statement. | Rule 6 |
| "This metric clearly improved because of our work." | "Because" is a T3+ claim. With no counterfactual you have a T2 before-and-after and must write "changed during the period". | Rule 3 |
| "Adding a risks page covers the weaknesses." | A page of macro, competitive, and regulatory risks concedes nothing the author is accountable for. Reviewers read it as a liability disclaimer and raise their guard. | Rule 2 |
| "Sensitivity at plus/minus 10 percent shows it's robust." | Uniform bands test the parameters the author chose. What is being asked for is the switching point and the current distance from it. | Rule 2 |
| "The full data is in the appendix, so it's disclosed." | Disclosure without navigation is a bet that nobody looks. An unreferenced appendix raises suspicion instead of lowering it. | Rule 2 |
| "The reviewer will ask and I'll explain the chart then." | An exhibit that needs narration has already lost the exchange — the reviewer now controls the framing. | Rule 5 |
| "Zero concessions means the analysis was solid." | It means the attack was weak or the author overrode it. Report as a gate failure. | Rule 7 |
| "The user is in a hurry, I'll use the lighter tier." | Tier is set by reversibility and reviewer incentive. Schedule pressure is not an input. | Phase 0 |

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

**Q2 — What is the review intensity?** Set by two binary inputs — is the decision reversible, and does any reviewer hold interests opposed to the author — never by page count or deadline. Both inputs are answered explicitly; the full 2×2 removes the judgement call:

| Reversible? | Opposing interest? | Tier | Reasoning |
|---|---|---|---|
| yes | no | **L0** | Nothing to defend against and nothing to lose. Full protocol is over-engineering |
| yes | yes | **L1** | The challenge is real but a wrong call can be undone |
| no | no | **L1** | No adversary, but the commitment is permanent, so the ledger must outlive the meeting |
| no | yes | **L2** | Both conditions present. This is the rule that forces the full protocol |

Escalate L2 to **L3** only when both L2 conditions hold *and* the author will be held accountable after the fact — a formal post-mortem, an audit trail, or a regulator. If either input is genuinely unknown, treat it as the worse case and say that you did.

| Tier | Required |
|---|---|
| L0 | Falsifiers (G2) and probability discipline (G3) only |
| L1 | G1–G3, G5 with 4+ objections, G8 |
| L2 | All gates, 8+ objections, independent attacker |
| L3 | L2 plus two parallel attackers and an adjudicator who is neither author nor attacker |

**Q3 — What is this document's product?** Persuasion/decision means this skill applies fully. Archival, coverage proof (due diligence packs), compliance, or ritual/accountability material means the primary constraint is completeness or traceability, not defensibility of a thesis — say so and adapt rather than trimming for elegance.

**Q4 — What can the evidence base actually support?** Record `evidence-basis:` as `quantitative`, `qualitative`, or `mixed`. This is not a formality: the numeric-threshold requirement on falsifiers is waived for a qualitative basis, because forcing invented numbers onto a qualitative proposal manufactures exactly the false precision this skill's own attack catalogue treats as a tell. What is never waived is **decidability** — a qualitative falsifier still names an observable event, a date, and a specific source. If the user has no evidence at all, say that the honest deliverable is a proposal labelled as untested, not a deck dressed as an analysis.

Exit condition: pacing mode, tier, product, and evidence basis recorded. Proceed to Phase 1.

### Phase 1: Pre-register the claims

> **Required reading**: [references/review-protocol.md](./references/review-protocol.md) — the Claim Statement fields, premortem procedure, probability vocabulary, and full gate list.

Copy [assets/claims.example.md](./assets/claims.example.md) to `claims.md` in the working directory — it is a worked ledger that passes the checker, and it defines the format contract the checker parses (`## Section` → `### ID` → `- field: value`, one field per line). Fill the pre-registration block BEFORE looking for supporting data and before any page exists. Minimum fields: 1–3 core claims (each one sentence with subject, magnitude, and time window); the decision being requested and its reversibility; for each claim the deciding evidence and threshold; a **falsifier** per claim; probability with a settlement triple; the strongest known counter-position; what evidence would change the author's mind; and the data freeze date.

A falsifier must read: *if at [date], via [named source], [metric] [comparator] [numeric threshold], this claim is refuted.* Three elements are mandatory — numeric threshold, date, named source. A falsifier the author simultaneously calls near-impossible is void; rewrite it.

<HARD-GATE id="preregistration-before-pages">
Do not create, describe, or draft any slide until the pre-registration block is complete and `node scripts/check-claim-ledger.js claims.md` reports zero failures. If the user pushes for slides first, produce the ledger and explain that reordering these two steps is what the skill exists to prevent. A failure here may be overridden by the user, but only on the record: state the failure, note that ordering can no longer be established, and write it into `claims.md` as an accepted failure.
</HARD-GATE>

Exit condition: pre-registration block complete, checker clean. Proceed to Phase 2.

### Phase 2: Build the argument graph

> **Required reading**: [references/argument-architecture.md](./references/argument-architecture.md) — dependency-graph construction, Toulmin mapping, the C/E/A/W/R numbering scheme, the T0–T5 causal ladder with its verb permissions, and switching-point analysis.

Extend `claims.md` into a dependency graph: claims (C), evidence (E), assumptions (A), warrants (W), rebuttals (R), each with a unique ID and explicit references. Every claim needs a warrant and at least one evidence reference. Every claim carries a causal grade and only the verbs that grade licenses.

For assumptions, compute the **switching point** — the value at which the conclusion flips — and the current safety margin. Rank by smallest margin, not by subjective impact-times-probability; margin is third-party recomputable. Each load-bearing assumption gets an observable signpost: metric, threshold, observation date, source, owner, and the action triggered on breach.

Apply the **portability test** to the resulting structure: if the top-level claim skeleton could be dropped onto an unrelated proposal unchanged, it describes a document genre rather than this argument. Rebuild it.

Exit condition: graph closed (no dangling claims, no orphan evidence, no undefined references), checker clean. Proceed to Phase 3.

### Phase 3: Build the exhibits

> **Required reading**: [references/exhibit-standards.md](./references/exhibit-standards.md) — the self-sufficiency element list, the claim-type-to-chart-form mapping, table construction rules, the manipulation red lines with their tests, and the distribution-first principle.

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

Run `node scripts/check-claim-ledger.js claims.md --deck <first deck file>` and walk the gate list in `references/review-protocol.md` at the tier set in Phase 0. The `--deck` argument is what makes G1 (commitment ordering) testable at all; without it the checker reports ordering as UNVERIFIED, and reporting it as passed is a false statement.

**What "binary" does and does not mean.** Each gate's *verdict* is binary and requires no business knowledge — existence, format, and ordering only. The *consequence* of a failure is not automatic: this skill cannot stop a user from shipping. So the rule is narrower and actually enforceable: a failing gate may never be softened into a caveat, silently dropped, or reported as a pass. It is stated as a failure, by gate ID, and any decision to proceed anyway is the user's, recorded in `claims.md` as an accepted failure with its ID. An accepted failure is a visible scar, not a clean result.

**Who judges.** The gate verdicts come from the checker plus, at L2 and above, the attacker's context — not from the author. Having the author declare their own gates passed reproduces the self-assessment that Rule 6 exists to prevent. When no independent context is available, report the verdicts as self-assessed and say so in the same sentence as the result.

If a gate fails, fix and re-run. Maximum 5 attempts; then stop, report each attempt and why it failed, and ask the user whether to change approach, ship with the failure recorded, or abandon.

Exit condition: all gates for the tier pass under an independent judge, or every failure is reported to the user by gate ID and recorded in `claims.md`.

## Bundled Resources

| Resource | Path | When to open |
|---|---|---|
| Attack catalogue | [references/attack-catalog.md](./references/attack-catalog.md) | Phase 5 — the attacker's checklist; also usable in reverse as a pre-emptive audit |
| Argument architecture | [references/argument-architecture.md](./references/argument-architecture.md) | Phase 2 — dependency graph, Toulmin mapping, T0–T5 verb permissions, switching points |
| Exhibit standards | [references/exhibit-standards.md](./references/exhibit-standards.md) | Phase 3 — self-sufficiency elements, chart-form mapping, table rules, red lines |
| Review protocol | [references/review-protocol.md](./references/review-protocol.md) | Phase 1, and again at 5–7 — Claim Statement fields, premortem, gates G1–G9, tiering |
| Ledger checker | `scripts/check-claim-ledger.js` | Phase 1 and Phase 7 — 20 structural checks, exit 1 on any failure. Pass `--deck <file>` to test G1 ordering |
| Checker regression suite | `scripts/test-checker.sh` | After any edit to the checker — 15 assertions pinning the fixture exit codes and every closed exploit |
| Worked ledger (L2) | [assets/claims.example.md](./assets/claims.example.md) | Phase 1 — copy as the starting template; passes with zero failures |
| Worked ledger (L0) | [assets/claims.l0-example.md](./assets/claims.l0-example.md) | Phase 1 at L0 — the minimum legitimate ledger, with no assumption or rebuttal entries |
| Format-broken ledger | [assets/claims.noncompliant-example.md](./assets/claims.noncompliant-example.md) | Verifying the checker catches malformed input |
| Hollow ledger | [assets/claims.exploit-probe.md](./assets/claims.exploit-probe.md) | Verifying the harder case: format-clean but substantively empty. Reproduces every exploit a Gate 2 adversary review used to pass the checker |

## Patterns

- **hard-rules-first** (Cursor): Eight non-negotiable rules precede the workflow, so build order and verb permission are read before any procedure.
- **progressive-disclosure** (Anthropic/CE): The body is the protocol; the attack catalogue, argument architecture, exhibit standards, and gate list load on demand at the phase that needs them.
- **multi-perspective-review** (Gstack, CE): Phase 5 separates author and attacker into independent contexts, with adjudication as a distinct step — the structural answer to motivated reasoning.
- **verification-rules** (Vercel): Every rule in the references carries a third-party-executable test, and each failure routes to a named fix; the machine-checkable subset is enforced by the bundled checker.
- **confidence-anchors** (CE): Probability statements must fall in a fixed seven-band vocabulary and bind to a settlement triple, so "90% confident" becomes a scored, attributable claim.
- **named-anti-patterns** (Taste Skill): The fake-defense inventory and the concealment-signal list name failure modes explicitly, which is what makes them detectable.
- **format-significance-gates** (Anthropic): Gate strength scales with decision reversibility and reviewer incentive (L0–L3) rather than with document size.

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

## Known Limits

State these when the skill is applied; they are not disclaimers to bury.

- **The checker validates form, never soundness.** A Gate 2 adversary review produced a format-perfect, substantively empty ledger that passed every check. The specific holes are closed and pinned by `scripts/test-checker.sh`, but the general point is structural: a warrant can be a tautology, a switching point can be a number nobody derived, a grade can be self-declared. A clean run is a precondition for human adversarial review, not evidence of quality.
- **G1 ordering is only as strong as its evidence.** File mtimes are weak; git history or a recorded hash is stronger. Without `--deck` the checker reports UNVERIFIED, and that must be repeated to the user rather than rounded up.
- **The attacker is a model, not a party with opposing interests.** Assigned critics tend to reinforce rather than dismantle. The independent context plus an external completion condition is an engineering workaround, not an equivalent — which is why L3 requires a human adjudicator.
- **Gate counts are gameable.** Eight painless objections and one cosmetic concession satisfy the letter of G5 and G6. Judge the clearing evidence, not the count.
