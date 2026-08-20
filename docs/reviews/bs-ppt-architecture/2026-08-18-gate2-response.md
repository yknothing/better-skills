# Gate 2 Response and Concession Record: bs-ppt-architecture

**Date**: 2026-08-18
**Skill**: bs-ppt-architecture
**Responding to**: [`2026-08-18-adversary-review.md`](./2026-08-18-adversary-review.md) (14 findings, verdict REQUIRES_CHANGES) and [`2026-08-18-advocate-review.md`](./2026-08-18-advocate-review.md) (PASS 65/80, one blocking-quality fix)
**HUMAN_VERIFIED**: false

## Summary

18 findings across both reviews. **17 accepted and changed, 1 partially accepted.** Zero rejected.

Per the reviewed draft's Phase 6 (now Phase 5), every finding carries exactly one disposition, and a zero-concession outcome would be reported as a gate failure. It is not zero: the adversary defeated the bundled checker with a format-perfect, substantively empty ledger that scored 16/16 with no warnings, and separately found the skill violating its own causal-verb rule inside the file that defines it. Both are recorded below rather than quietly fixed.

The single most consequential change: the checker went from 16 checks to 20, nine of them strengthened, and the fixes are now pinned by `scripts/test-checker.sh` (15 assertions). The adversary's exploit ledger ships as a permanent regression fixture — `assets/claims.exploit-probe.md` — so no future edit can silently reopen those holes.

## Dispositions

| ID | Finding | Disposition | Evidence |
|---|---|---|---|
| F1 | Checker passes a substantively worthless ledger 16/16 | **accepted and changed** | Nine checks strengthened: probability band cross-validated against its governing range; ISO dates stripped before the numeric-threshold test; vague falsifier sources (`via internal review`) rejected; placeholder detection across all fields; counterfactual-evasion detection; malformed entry IDs (lowercase `c3`) now fail instead of being skipped; evidence entries carry required fields; settlement/signpost parts checked for placeholders. Exploit ledger kept as `assets/claims.exploit-probe.md`; `scripts/test-checker.sh` asserts each closed hole |
| F2 | G1 ordering unverifiable; checker mislabels a back-datable string as "G1" | **accepted and changed** | The field check is renamed to say what it is ("Pre-registration fields present (field-level only, not G1 ordering)"). A separate `checkCommitmentOrdering` compares mtimes when `--deck <file>` is supplied and reports **UNVERIFIED** otherwise — never a pass. G1's definition in `review-protocol.md` was rewritten to state that a self-reported date cannot establish an ordering property and that git history or recorded hashes are the strong form |
| F3 | Gates manufacture false precision on qualitative or data-poor work | **accepted and changed** | Phase 0 gains Q4 (`evidence-basis: quantitative \| qualitative \| mixed`). A qualitative basis waives the numeric-threshold requirement on falsifiers while keeping decidability — observable event, date, named source. Where there is no evidence at all, the skill now says the honest deliverable is a proposal labelled untested |
| F4 | A required-reading reference recommends the appendix-plus-verbal move Rules 2 and 5 forbid | **accepted and changed** | `architecture.md` now states that Rules 2 and 5 override the compromise: only the exhaustive-list long tail may move to an appendix; the weakest claim, adverse evidence, and strongest rebuttal stay in the body; verbal delivery must point at a numbered appendix entry and never discharges the obligation |
| F5 | Causal-verb blacklist misses most causal English; contradicts its own grade table | **accepted and changed** | List expanded (`because of`, `due to`, `thanks to`, `as a result of`, `accounts for`, `generated`, `demonstrates that`, nominalised forms). More importantly the claim was downgraded: the check is now labelled "No known unlicensed causal verb (word list is not exhaustive)", and both the script header and the reference state that a clean run means no known offender was found, not that wording is verified |
| F6 | Tiering rule undefined over half its input space | **accepted and changed** | Phase 0 Q2 now carries the full 2×2 over (reversible?, opposing interest?), an explicit L3 escalation condition, and an instruction to treat a genuinely unknown input as the worse case and say so |
| F7 | Every hard gate terminates in an advisory, so "binary and non-negotiable" is false | **accepted and changed** | Phase 7 now separates the two things that were conflated: a gate's *verdict* is binary; the *consequence* is the user's. The enforceable rule is narrower and honest — a failure may never be softened, dropped, or reported as a pass, and proceeding anyway is recorded in `claims.md` as an accepted failure with its gate ID |
| F8 | Phase 7 has the author adjudicate its own gates | **accepted and changed** | Verdicts come from the checker plus, at L2+, the attacker's context. Where no independent context exists, the skill must report the verdicts as self-assessed in the same sentence as the result |
| F9 | Parser fragility causes silent claim loss and false failures | **accepted and changed** | Bold and italic field names parse correctly (previously a false "missing claim" that also silently disabled the verb and warrant checks). Indented continuation lines are joined, so a wrapped value no longer loses everything after the wrap — the regression suite asserts that a wrapped `proves`/`drove` continuation is now caught |
| F10 | Reference closure punishes Rule 2 compliance | **accepted and changed** | Evidence cited from an assumption or rebuttal now counts as referenced. Adding the adverse exhibit that Rule 2 demands no longer produces an "orphan evidence" failure |
| F11 | Evidence entries have no required fields; empty sections pass vacuously | **accepted and changed** | `REQUIRED_EVIDENCE_FIELDS` (description, source, definition) plus tier-aware cardinality — see the advocate's finding below |
| F12 | Cited research load-bearing beyond what it supports, including a Rule 3 violation by the skill itself | **accepted and changed** | The Scheel/Schijen/Lakens paragraph in `review-protocol.md` asserted sole causal attribution ("What differs is not researcher honesty. It is the moment of commitment") from a non-randomised between-corpora comparison — T2 evidence by this skill's own ladder. Rewritten to T2-permitted wording, and **the correction is documented in place rather than erased**, because it is the cleanest demonstration available that the check works on its author |
| F13 | Three-claim ceiling is a hard failure whose only named remedy produces a defect | **partially accepted** | The ceiling stays — it is G2's definition, and a deck asking for more than three things has not decided what it is asking for. But the adversary is right that *merging* claims produces a claim that cannot be falsified as a unit, which is a real defect. The checker's failure detail now prescribes the correct remedy: promote the three load-bearing claims, demote the rest to evidence or supporting detail, and explicitly do not merge |
| F14 | Banned-hedge check false-positives on substrings and quoted objections | **accepted and changed** | Word-boundary matching, and quoted spans are excluded so a ledger quoting a reviewer's objection verbatim is not penalised for it |
| A1 | Checker is tier-blind: a legitimate L0 ledger fails, and deleting all assumptions still passes 16/16 | **accepted and changed** | `TIER_REQUIREMENTS` maps each tier to minimum assumption and rebuttal counts; `checkTierCardinality` enforces it. `assets/claims.l0-example.md` ships as the L0 fixture. This closes both directions: L0 no longer fails, and an empty `## Assumptions` heading no longer satisfies the switching-point requirement vacuously |
| A2 | Three of seven pattern attributions are wrong | **accepted and changed** | Verified against `docs/patterns/README.md` and corrected: `verification-rules` is Vercel (not Superpowers), `named-anti-patterns` is Taste Skill (not Superpowers), `format-significance-gates` is Anthropic (not CE). Also completed `multi-perspective-review` to Gstack, CE |
| A3 | Ballast: `## Registration` duplicates skills.json; half the Red Flags table; Recorder role described as "may be a script" when none exists | **accepted and changed** | `## Registration` deleted and replaced with `## Known Limits`, which carries information the reader cannot get elsewhere. Red Flags de-duplicated from 11 rows to 10 with no two rows sharing a mechanism, and one row added for the rationalisation this review exposed: *"The checker passed, so the deck is sound."* Recorder row now states plainly that no tool in this skill fills the role |
| A4 | `exhibits.md` and `bs-ui-master` both carry palette rules with no stated precedence | **accepted and changed** | Precedence line added to the reference header: in adversarial contexts the exhibit standards win, because their rules close attack surface rather than express taste; outside those contexts defer to `bs-ui-master` |

## Concessions (G6)

Four places where the skill was weakened, narrowed, or had a claim withdrawn:

1. **"Hard gates are binary and non-negotiable" was withdrawn** and replaced with the narrower claim the skill can actually enforce: verdicts are binary, consequences are the user's, and failures may never be disguised.
2. **The verb-permission check's claim was downgraded** from enforcing wording to flagging known offenders, with the incompleteness stated in the script, the reference, and the check's own output label.
3. **The G1 pass was withdrawn.** The checker previously printed a G1 pass on the strength of a self-reported string. It now reports UNVERIFIED unless given external evidence.
4. **The scope of the checker was narrowed in writing.** The script header now records that a Gate 2 review passed a hollow ledger, and states that a clean run is a precondition for human review rather than evidence of quality. `## Known Limits` in the SKILL.md repeats it where a reader cannot miss it.

## Unresolved and disclosed

Per Phase 6, findings that were not fixed are disclosed in the main body rather than left in a review file:

- **Form checks cannot establish soundness.** A warrant can be a tautology, a switching point can be a number nobody derived, and a grade like `T5` can be self-declared with nothing behind it. The specific exploits are closed; the category is not closable. Disclosed in `## Known Limits` and in the checker's own output footer.
- **Gate counts are gameable.** Eight painless objections and one cosmetic concession satisfy G5 and G6 by the letter. Disclosed in `## Known Limits`.
- **The attacker is a model, not a party with opposing interests.** Disclosed in `## Known Limits`, and L3 requires a human adjudicator for this reason.
- **Gate 4 has not been run.** Test prompts exist in `evaluation/datasets/batch-1-test-prompts.json`; no baseline comparison has been executed, and no claim of outperforming the baseline appears in the README.

## What this review says about the skill

Two observations worth keeping.

The adversary defeated the checker, and that was the correct outcome to design for — which is why the exploit is now a fixture rather than a fixed bug. The claim being defended is not "the checker cannot be beaten" but "the ways it has been beaten are recorded and asserted against".

More pointedly: the review caught the skill violating its own Rule 3 in the file that defines Rule 3. An earlier draft asserted sole causal attribution from a between-corpora observational comparison. That is the same error the T0–T5 table exists to prevent, committed by the author of the table, and it went unnoticed through drafting and self-review. It was caught by an independent context reading only the deliverable — which is precisely the mechanism Rule 6 mandates and the reason same-context self-critique is not accepted as a substitute.

## Superseding note: the objective function was wrong

Recorded here because it is a larger correction than anything in the table above, and it arrived after this review closed.

Both reviews above were conducted on a skill named `bs-defensible-deck`, whose stated objective was surviving adversarial review. **That objective was wrong**, and neither reviewer caught it — the adversary attacked the implementation of the stated goal, and the advocate assessed value against the stated goal. Neither questioned the goal. The correction came from the user.

The right formulation is `max(substance) subject to (defensible, honest)`. Defensibility is the feasible region, not the quantity being maximised, and optimising a constraint has a known degenerate optimum: the tautology. "We should monitor market conditions and adapt accordingly" is perfectly unrefutable and worthless. Every finding in the table above remains valid — they were real defects — but they were all defects in the constraint machinery, while the objective-side capability (a claim sharp enough to change a decision, three pillars that carry weight, exhibits that reveal something) was largely absent.

What changed as a result:

- The skill is now `bs-ppt-architecture` (via an intermediate `bs-deck-substance`). `defensible` named a defensive property; `substance` named a quality property; both were attributes. The work product is PPT argument architecture.
- Two further experts were commissioned specifically on the objective side, and their standards became the front half of both architecture and exhibits references. Each reference file is now split **Part 1 (excellence) / Part 2 (the floor)**, and the workflow runs sharpness before drafting and gates before shipping.
- The checker gained three objective-serving checks — belief delta with an actionable outcome, a declared comparison baseline per exhibit, a sharpness trail per claim — bringing it to 22, and `test-checker.sh` to 18 assertions.
- One rule was added that this review could not have produced: **an objection may not be cleared by hedging the claim into something nobody would dispute.** That trade — buying constraint satisfaction with objective value — is now a named Rule 1 violation. It is exactly the move a hardening-focused methodology encourages.

The methodological lesson is narrower than "the reviewers failed". Both reviewers did their jobs. **Neither role, as specified, had standing to question the objective** — an adversary is scoped to attack the artefact and an advocate to weigh it against its stated purpose. Auditing the objective function is a third job, and this protocol did not have it. Interpret it as evidence for the limit already stated in `## Known Limits`: an attacker given a target will attack that target, not ask whether it is the right one.

## Verification after changes

| Check | Result |
|---|---|
| Gate 1 (`tools/validate.js`) | 16/16 pass, word count 3,869, bundled resources 10/10 |
| Gate 3 (`tools/pattern-alignment.js`) | 7/7 resolved, 7/7 in body, no drift |
| `scripts/test-checker.sh` | 15/15 assertions pass |
| `assets/claims.example.md` (L2, compliant) | 19 pass, 1 warn (G1 unverified), 0 fail — exit 0 |
| `assets/claims.l0-example.md` (L0, compliant) | 19 pass, 1 warn, 0 fail — exit 0 |
| `assets/claims.noncompliant-example.md` (format-broken) | 14 fail — exit 1 |
| `assets/claims.exploit-probe.md` (format-clean, hollow) | 10 fail — exit 1 |
| `tools/check-patterns.sh` | ghost 0, orphan 0 |
| `tools/test-cli.sh` | 49 pass / 0 fail |
