# Adversary Review: bs-defensible-deck

**Date**: 2026-08-18
**Reviewer Role**: Adversary
**Skill**: bs-defensible-deck
**HUMAN_VERIFIED**: false

## Summary

Fourteen findings: three CRITICAL, six HIGH, four MEDIUM, one LOW. The headline result is that the bundled checker — the only machine-enforced gate in the skill, and the thing the `preregistration-before-pages` HARD-GATE binds on — can be passed 16/16 with zero warnings by a ledger that contains no threshold, no sensitivity analysis, no real falsifier, a probability band contradicting its own numbers, and a hidden fourth claim that is invisible to every check; I wrote that ledger and it exits 0. Compounding this, the skill's central mechanism (pre-commitment ordering, Rule 1) is structurally unverifiable from the artefact the checker reads, so a deck-first agent that back-dates one field passes the gate labelled "G1". The worst-case impact is not a weak deck: it is a deck carrying a machine-stamped `16 passed, 0 failed` audit trail and a claim of adversarial review, which is more dangerous to a decision-maker than an unreviewed deck, because the ledger's own fabricated numbers are the artefact a reviewer is invited to trust.

## Findings

### F1: The bundled checker passes a substantively worthless ledger 16/16 with zero warnings  [CRITICAL]

**Location**: `scripts/check-claim-ledger.js` (whole file; specifically `checkClaimFields` L264-272, `checkFalsifiers` L312-322, `checkProbabilities` L325-338, `checkAssumptions` L394-409, `runChecks` L455-462); SKILL.md L81-83 (`<HARD-GATE id="preregistration-before-pages">`), L153 ("16 structural checks, exit 1 on any failure")

**Exploit scenario**: I wrote the ledger below to `/tmp/adv-probe/garbage-passes.md` and ran the bundled checker against it. Observed output, verbatim tail:

```
  PASS: Falsifiers carry threshold, date, and source (G2)
  PASS: Probabilities use band vocabulary with numeric range (G3)
  ...
  PASS: Warrants are general rules, not claim restatements (A3)

=== Results: 16 passed, 0 failed ===
EXIT CODE = 0
```

Every one of the 16 checks passed and no check even warned. The ledger:

```markdown
## Triage
- pacing: speaker-paced
- tier: L0
- product: persuasion

## Pre-registration
- registered-at: 2026-08-18
- data-freeze: 2026-08-18
- decision-request: Approve the migration.
- strongest-counter: Some people disagree.
- would-change-mind: If it turned out to be a bad idea.

## Claims

### C1
- claim: The platform migration caused a 30 percent reduction in total cost of ownership and proves the architecture is correct.
- grade: T5
- warrant: Well-run organisations generally achieve the outcomes they plan for, absent unforeseen external shocks.
- evidence: E1
- assumptions: A1
- counterfactual: Not applicable, no control group exists.
- falsifier: If at 2027-01-01, via internal review, the team concludes the migration was not worthwhile, this claim is refuted.
- probability: almost certain, 1-5 percent
- settlement: 2027-01-01 | someone | we will know it when we see it

### C2
- claim: The new runbook produced a 40 percent fall in incident volume as a result of better tooling, thanks to the platform team.
- grade: T0
- warrant: Operational discipline tends to yield measurable benefits across most industries and time periods.
- evidence: E2
- falsifier: If at 2028-12-31, via the incident tracker, incidents exceed the threshold we later agree on, this claim is refuted.
- probability: almost no chance, 95-99 percent
- settlement: 2028-12-31 | tbd | tbd

### c3
- claim: The migration guarantees we will beat every competitor and caused the entire revenue increase.
- grade: T0
- note: this claim is invisible to all sixteen checks because its ID is lowercase

## Evidence

### E1

### E2
- description: some numbers

## Assumptions

### A1
- assumption: The market remains favourable.
- current: good
- switching-point: 42
- signpost: vibes | 1 | daily | tbd | tbd | tbd

## Rebuttals

### R1
- rebuttal: This fails if the whole thesis is wrong.
- response: It isn't.
```

Eight independent defects in the checker are exercised at once:

1. **Self-declared grade is the master key.** `grade` is never cross-checked against anything in the `## Evidence` section. Writing `grade: T5` licenses every verb in `VERB_PERMISSIONS` (L40-48), so C1 says "caused" and "proves" with an empty evidence entry behind it. The entire T0–T5 ladder is opt-in by the author it is supposed to constrain.
2. **`counterfactual` is a truthiness test.** `checkCounterfactuals` (L301-309) only asks `!c.counterfactual`. `counterfactual: Not applicable, no control group exists.` satisfies the mandatory-counterfactual rule by explicitly stating that no counterfactual exists — the field's negation is accepted as the field.
3. **A falsifier needs no threshold.** `NUMBER_RE` (L96) is unanchored `-?\d+…`, and it is tested against the same string as `ISO_DATE_RE`. The date `2027-01-01` supplies the digits, so the "numeric threshold" test is satisfied by the date it already checked separately. `via internal review` satisfies `FALSIFIER_SOURCE_RE` (L101) because that regex is `\bvia\s+\S+` — "via vibes" would pass equally. The result is a falsifier whose settlement condition is "the team concludes it was not worthwhile", which is precisely the unfalsifiable, non-observable form `references/review-protocol.md` L59 test (1) exists to reject.
4. **Band and number are never bound to each other.** `checkProbabilities` (L325-338) tests `p.startsWith(band)` and, separately, that a digit exists. `almost certain, 1-5 percent` and `almost no chance, 95-99 percent` both pass. This is a total defeat of the `confidence-anchors` pattern the skill claims (SKILL.md L163): the sole purpose of the ICD-203 vocabulary is band↔range binding, and the checker enforces the two halves independently.
5. **Switching points are cosmetic by construction.** `switching-point: 42` passes because the only test is `NUMBER_RE`. `argument-architecture.md` L138 already concedes "a switching point can be filled in without any sensitivity analysis" — but the skill then ships that known hole as an enforced gate (A5) and Phase 2 makes margin ranking a load-bearing step.
6. **Signposts are counted, not read.** `vibes | 1 | daily | tbd | tbd | tbd` satisfies the six-part rule (L402-406). Owner and action are literally `tbd`.
7. **The warrant heuristic is defeated by writing a *worse* warrant.** `checkWarrantTautology` (L423-440) measures content-word overlap with the claim. A vacuous, topic-free platitude has near-zero overlap and so passes cleanly, while an honest domain-specific warrant that necessarily reuses the claim's nouns gets flagged. The check is anti-correlated with what it measures. It is also `warn`, not `fail`, so it cannot block anything.
8. **Lowercase IDs are invisible.** `runChecks` filters entries with `id.startsWith("C")` (L456). `### c3` parses into the section (I confirmed the parsed keys are `[ '_', 'C1', 'C2', 'c3' ]`) but is excluded from claim counting, field requirements, verb permission, falsifier, probability and settlement checks. A human reading the ledger sees three claims; the checker sees two. This is a deliberate-concealment channel with a machine-verified clean bill of health, and it also silently defeats the 1–3 claim bound.

**Root cause**: Every check is a presence-or-shape test over strings the author supplies, and no check relates any two fields to each other. There is no cross-field validation (grade↔evidence form, band↔range, switching-point↔elasticity, falsifier-threshold↔claim magnitude), no ID normalisation, and no distinction between "the field exists" and "the field does the job the field exists for". The skill knows this — `argument-architecture.md` L138 says "Automated checks falsify form, they never certify quality" — but SKILL.md then binds a HARD-GATE to the checker's exit code and Phase 7 treats it as the gate run, so the honest caveat sits in a reference file while the body relies on the tool.

**Suggested fix**: (a) In `checkFalsifiers`, strip every ISO date from the string before applying `NUMBER_RE`, and require a comparator token (`above|below|at or above|exceeds|<|>|>=|<=`) plus a metric identifier. (b) In `checkProbabilities`, parse the numeric range and `fail` when it falls outside the declared band's ICD-203 interval; hard-code the seven intervals next to `PROBABILITY_BANDS`. (c) Require `counterfactual` to match a sentence form (`without …, … would have been <number>`) and add "not applicable / n/a / none" to a reject list for that field. (d) Normalise IDs case-insensitively in the `startsWith` filters and `fail` on any entry in a section whose heading does not match `^[CEAR]\d+$`. (e) Require each claim's `grade` to be justified by a per-evidence `design:` field drawn from a closed enum (`anecdote|cross-section|before-after|quasi-experiment|rct|triangulated`), and `fail` when the claim's grade exceeds the strongest design among its referenced evidence — this is the single change that closes the master key. (f) Require `switching-point` to be accompanied by an `elasticity` field containing a number and a named driver, and add a mandatory `sensitivity-method` field. (g) Promote the warrant check to `fail` and replace overlap-ratio with a structural test (warrant must not name any proper noun or figure appearing in the claim, and must contain a generalising quantifier).

### F2: Rule 1's pre-commitment mechanism is unverifiable, and the checker mislabels a back-datable string as "G1"  [CRITICAL]

**Location**: SKILL.md L9 (Rule 1), L22-23 (Red Flags rows), L81-83 (HARD-GATE); `scripts/check-claim-ledger.js` L242-250 (`checkPreregistration`, labelled "Pre-registration block complete (G1)"); `references/review-protocol.md` L97 (G1 definition), L90 (recorder requirement)

**Exploit scenario**: An agent builds the deck first — exactly what Rule 1 forbids — then writes `claims.md` afterwards with `registered-at: 2026-08-01`. The checker's only test is `ISO_DATE_RE.test(f["registered-at"])`: any well-formed date passes, including one earlier than the deck, later than the deck, or in 1970. I confirmed this with a ledger carrying `registered-at: 2020-01-01` and `data-freeze: 2020-01-01`, which passed 16/16. The check then prints `PASS: Pre-registration block complete (G1)`, and Phase 7 reports G1 as passed. But G1 as defined in `references/review-protocol.md` L97 is *"a Claim Statement file exists and its recorded time precedes the first deck version's recorded time"* — an ordering property between two artefacts. The checker reads one file, has no knowledge of any deck, and cannot evaluate ordering at all. The label asserts a check that the code does not perform.

**Root cause**: The skill's own analysis identifies the failure mode precisely — `review-protocol.md` L11 says self-criticism can be faked when *"no trace exists that cannot be back-filled"*, and L90 specifies a recorder that "verifies ordering: the Claim Statement hash time must precede the first deck version". That recorder was never built. The one shipped script reads a single author-controlled markdown file, so every timestamp in the system is self-reported by the party with the incentive to misreport. Rule 1 is stated as the skill's foundational mechanism ("Order is the entire mechanism", L23) and it is the one rule with no enforcement whatsoever.

**Suggested fix**: Either build the recorder or stop claiming G1. Minimum viable version: add `node scripts/check-claim-ledger.js --freeze claims.md`, which writes `claims.lock.json` containing a SHA-256 of the ledger plus `Date.now()`, and make the Phase 1 HARD-GATE require the lock file. Add a Phase 7 check that every deck/page file's mtime is later than the lock timestamp, and that the ledger's current hash matches the lock (or that divergences appear in a `## Concessions` changelog). Where the platform has git, prefer `git log --format=%cI -1 -- claims.md` over mtime. Until one of these exists, rename the check label to "Pre-registration fields present (does NOT verify G1 ordering)" so Phase 7 cannot report an unperformed check as passed.

### F3: The hard gate manufactures false precision on qualitative or data-poor work — the skill's own named defect  [CRITICAL]

**Location**: SKILL.md L81-83 (HARD-GATE: "Do not create, describe, or draft any slide until … reports zero errors"), L79 (falsifier form), L93 (switching point); `scripts/check-claim-ledger.js` L317 (numeric threshold), L335 (numeric probability), L400 (numeric switching-point); SKILL.md L46 (Boundaries: does not "Fabricate … data"); `references/attack-catalog.md` L69 ("False precision"), L121 ("Conservative estimate")

**Exploit scenario**: A user asks for a decision memo on a genuinely qualitative proposal — restructure two teams under one manager, adopt a written-memo culture, change an on-call rotation. There is no metric, no baseline series, and no counterfactual available. The skill's gate demands, per claim, a numeric falsifier threshold, a probability band with a numeric range, and (via Phase 2 plus check 14) a numeric switching point. The agent has exactly two paths. Path one: refuse to draft any slide, because the HARD-GATE says "Do not create, describe, or draft any slide until … `check-claim-ledger.js` reports zero errors", and the errors cannot be cleared without numbers that do not exist. The user gets nothing. Path two, overwhelmingly more likely for an agent under an explicit completion condition: invent the numbers. `switching-point: 42` is one keystroke away and passes (F1). The user then receives a memo whose apparent rigour — thresholds, bands, safety margins — is entirely fabricated, carrying a `16 passed, 0 failed` stamp. The same failure hits any team whose data legitimately supports only T0/T1 evidence: the verb rules degrade gracefully, but the *numeric* gates do not degrade at all.

This is strictly worse than no skill. Without the skill the agent writes an honestly hedged qualitative memo. With it, the agent writes a quantitatively dressed one, and `references/attack-catalog.md` L69 tells us precisely how a real reviewer reads that: *"What entitles you to that decimal place?"* The skill's fake-defence inventory (L121) names self-certified precision as a tell. The gate produces the tell.

**Root cause**: The numeric requirements are unconditional, while the skill's tiering axis (L0–L3) varies only *how many gates* apply, never *whether the evidence base can support the gate's form*. There is no `evidence-class: qualitative` path, no non-numeric falsifier form (e.g. a named observable event, a dissenting party's stated position, a decision that gets reversed), and Boundaries L46 promises the skill "refuses to write claims the supplied evidence cannot license" while the gate refuses to let it write anything else.

**Suggested fix**: Add a fourth Phase 0 question — "Q4: what is the evidence class?" — with a `qualitative` value that swaps the numeric gates for observable-event equivalents: a falsifier of the form *"if at [date], [named party] states [position], this claim is refuted"*; a probability band with no numeric range but a mandatory settlement triple; and a switching point replaced by a `flip-condition` field naming the observable event that reverses the conclusion. Implement as `--evidence-class=qualitative` in the checker so the relaxation is declared in the artefact rather than negotiated in prose. Separately, add an explicit instruction to the HARD-GATE: "If the supplied evidence cannot support a numeric threshold, do not invent one — declare the qualitative class and say so to the user." Right now nothing in the skill tells the agent that fabrication is the worse of the two failures.

### F4: A required-reading reference explicitly recommends the appendix-plus-verbal move that Rule 2 and Rule 5 forbid  [HIGH]

**Location**: SKILL.md L10 (Rule 2), L13 (Rule 5), L29-30 (Red Flags rows) versus `references/argument-architecture.md` L136 and L137 ("Where explicit architecture hurts", limits 2 and 3)

**Exploit scenario**: Rule 2 says the weakest claim *"must be named, quantified, and placed in the main body — never only in an appendix"*, and the Red Flags table (L29) pre-rejects the rationalisation *"The full data is in the appendix, so it's disclosed."* Rule 5 says an exhibit *"whose validity depends on the presenter's spoken words is not evidence"*, and L30 pre-rejects *"The reviewer will ask and I'll explain the chart then."* Phase 2 then makes `references/argument-architecture.md` **required reading**, and that file says, in the author's own voice:

> "Under asymmetric review, rebuttals get weaponised. When a reviewer can veto at no cost to themselves, a failure-condition list becomes ready-made ammunition. This is structural and cannot be written away. Workable compromise: **keep switching points and rebuttals in an indexed appendix, raise them verbally with the response attached** — preserving the refutational benefit without handing over a bare list." (L136)

> "For reviewers who will not engage with argument detail, **compress to the root claim plus the single strongest exhibit and keep the architecture in the backup material.**" (L137)

Those are the two forbidden moves — appendix relegation and verbal delivery — recommended by name, and recommended *specifically for the hostile asymmetric-review case* that is the skill's entire stated scope ("any reviewer with an incentive to reject it", L3). An agent that reads Phase 2's required file has explicit licence to do what Rule 1's own framing calls concealment, and it can cite the skill for it. Worse, the L136 escape is available exactly when Rule 2 matters most, so the contradiction is not at the margins — it is at the centre.

**Root cause**: The Hard Rules were written as absolutes; the references were written as honest engineering essays that concede real trade-offs. Nothing reconciles them, and no precedence order is declared anywhere in the skill. There is no statement of the form "where a reference conflicts with a Hard Rule, the Hard Rule governs", and no marker on L136/L137 saying these limits are descriptive rather than permissive.

**Suggested fix**: Add a precedence line to the top of the Hard Rules section ("Where a reference file's discussion of limits appears to license an exception, the Hard Rule governs; references describe costs, not permissions"). Then rewrite `argument-architecture.md` L136 to keep the analysis and drop the recommendation: state that the weaponisation risk is real, that Rule 2 accepts that cost deliberately, and that the mitigation is a *quantified impact bound placed beside the concession in the body* — not relocation. Same treatment for L137. Also reconcile the three mutually inconsistent self-sufficiency lists: Rule 5 names seven elements including source and denominator, `exhibit-standards.md` L27-38 tabulates nine, and L148 defines an "irreducible" set of six that silently drops source and denominator — the two elements Rule 5 calls mandatory. Phase 3's exit condition says "every exhibit passes the self-sufficiency check" without naming which of the three lists is the check.

### F5: The causal-verb blacklist misses most causal English and contradicts its own grade table  [HIGH]

**Location**: `scripts/check-claim-ledger.js` L40-48 (`VERB_PERMISSIONS`), L285-298 (`checkVerbPermissions`); `references/argument-architecture.md` L76-87 (grade table, blacklist); SKILL.md L11 (Rule 3), L26 (Red Flags: "'Because' is a T3+ claim")

**Exploit scenario**: C2 of my passing ledger is graded **T0** — single anecdote, where `argument-architecture.md` L78 forbids *"all causal verbs"* — and reads: *"The new runbook **produced** a 40 percent fall in incident volume **as a result of** better tooling, **thanks to** the platform team."* Three causal constructions, one grade above nothing, and `PASS: Causal verbs licensed by evidence grade`. Four distinct defects:

1. **Unlisted vocabulary.** None of `produced`, `helped`, `resulted in`, `as a result of`, `thanks to`, `owing to`, `due to`, `because of`, `yielded`, `generated`, `translated into`, `responsible for`, `on the back of`, `fuelled`, `spurred`, `catalysed`, `underpinned` appear in any pattern. The blacklist is eight regexes against an open lexical class.
2. **It contradicts the reference it implements.** The T2 row of the grade table (L80) names *"produced, contributed, helped"* as forbidden verbs. The checker implements `contributed` and silently drops `produced` and `helped`. The prose blacklist at L87 includes *"led to growth in"*; the checker's pattern is `led to`, which is broader and fine, but it also omits the "Because is a T3+ claim" rule that SKILL.md L26 states as doctrine — `because` appears in no pattern.
3. **It licenses a verb the reference never licenses.** The checker sets `proves|proven|guarantees` at `minGrade: "T5"`, so `grade: T5` permits "proves". But the grade table forbids "proves" at T3 (L81), forbids "proves inevitable" at T4 (L82), and lists T5's permitted verbs as *"established, the mechanism is"* — "proves" is licensed at no grade in the reference. The checker invented a licence.
4. **Only the `claim` field is scanned.** `checkVerbPermissions` reads `c.claim` and nothing else. `warrant`, `counterfactual`, `note`, every evidence `description`, and every rebuttal `response` are an unpoliced channel for the same causal assertion — and the deck itself, where the reader actually encounters the wording, is never scanned by anything.

**Root cause**: A blacklist over an open class, implemented by hand from a prose table without a test asserting parity between the table and the regexes, and applied to one field of one section rather than to all prose in the ledger.

**Suggested fix**: Invert the logic — enforce the *permitted* column rather than the forbidden one. Give each grade a closed set of licensed relational verbs (T0: `observed|occurred`; T1: `correlates with|co-occurred`; T2: `changed during|rose|fell|moved`; T3: `contributed`; T4: `caused|the causal effect is`; T5: `established|the mechanism is`) and `fail` any claim sentence whose main relational construction is not in its grade's set. Keep the blacklist as a secondary catch and extend it with the prepositional forms (`because of`, `as a result of`, `due to`, `owing to`, `thanks to`, `resulted in`, `on the back of`) plus `produced` and `helped`. Add a unit test that parses the grade table in `argument-architecture.md` and asserts every verb named there appears in `VERB_PERMISSIONS` at the matching grade — the table and the code drifting apart is the root defect. Extend the scan to `warrant` and `counterfactual`. Delete `proves` from T5 or add it to the reference's T5 permitted column; they cannot both stand.

### F6: The tiering rule is undefined over half its input space, and contradicts the unconditional Hard Rules  [HIGH]

**Location**: SKILL.md L60-67 (tier table and decision rule), L32 (Red Flags row), L14-15 (Rules 6 and 7), L117-127 (Phase 5), L129-135 (Phase 6); `references/review-protocol.md` L115-122

**Exploit scenario**: The stated rule is *"irreversible AND a reviewer with interests opposed to the author ⇒ at least L2. Reversible with no opposing interest ⇒ L0/L1 is correct."* That covers two of four cells of a 2×2, and the table rows do not cover the other two:

- **Irreversible, no opposing interest** (a board that wants to fund you, signing a non-cancellable lease): L0 requires "Reversible", L1 requires "rollback possible", L2 requires "a reviewer with opposing interest". No row matches. The agent has no determinate tier for the case where the *stakes* are highest and the *scrutiny* is lowest — arguably the most dangerous configuration there is.
- **Reversible, hostile reviewer** (a pilot proposal a rival team wants killed): L2 requires "partly irreversible"; L0/L1 require no opposing interest. Again no row.

Three further indeterminacies. (i) Irreversibility is a continuum but the thresholds are adjectives — L2 is "partly irreversible", L3 is "major irreversible commitment", with no boundary; an $8M lease with a 60-day break clause is unassignable. (ii) "Opposing interest" is unobservable and the skill conflates it with opposing *position*: Test Prompt 1 (L187) derives L2 from *"The CFO has been against this since spring"*, which is disagreement on the merits by someone whose interests are aligned with the company's. A reviewer who thinks you are wrong is not a reviewer who benefits from your failure, and the expensive protocol is triggered off the wrong variable. (iii) L0 versus L1 is never disambiguated for a reversible team decision with a small resource commitment — both rows can be read to apply.

The contradiction is worse than the gap. Rules 6 and 7 are declared non-negotiable Hard Rules: the attacker "must be independent", and zero concessions "Report this as a gate failure". But the tier table makes G5, G6 and G9 inapplicable at L0 and L1 — so at L0 an independent attacker is simultaneously mandatory (Rule 6) and out of scope (Phase 0). The Workflow never resolves it: Phase 5 unconditionally says "Dispatch an attacker in a fresh context" and its exit condition is "numbered objection list produced by an independent context", with no tier conditionality anywhere, and Phase 6 likewise unconditionally requires a recorded concession count. An agent at L0 that follows the Workflow runs the full protocol the tier table says is "over-engineering"; an agent that follows the tier table violates two Hard Rules.

**Root cause**: The tier system varies the *gate list* but the Workflow phases were written as an unconditional linear pipeline, and the two were never cross-checked. The decision rule is a partial function presented as a binary one.

**Suggested fix**: Replace the prose rule with a complete decision table over the two binary inputs (reversible/irreversible × aligned/opposed), assigning all four cells — including irreversible+aligned, which should land at L2 minus G9, since the stakes justify the falsifier and traceability work even without a hostile reader. Define irreversibility operationally ("can the commitment be unwound within 30 days for under 10% of its value?"). Replace "opposing interest" with two separately observable questions: does any reviewer's stated position oppose the request, and does any reviewer bear no cost from a wrong rejection? Then annotate each Workflow phase header with the tiers at which it applies (`Phase 5 — Independent attack (L2, L3)`) and add a tier-gated skip instruction, and scope Rules 6 and 7 explicitly ("at L2 and above") so the Hard Rules stop contradicting Phase 0.

### F7: Every hard gate terminates in an advisory, so "binary and non-negotiable" is false by construction  [HIGH]

**Location**: SKILL.md L15 (Rule 7), L139-143 (Phase 7), L189 (Test Prompt 3), L124 (attacker HARD-GATE), L177 (Platform Degradation); `references/review-protocol.md` L102 (G6 waiver), L24, L111

**Exploit scenario**: Phase 7 opens with *"Gates are binary"* and *"Never soften a failure into a caveat"*, then closes with the terminal state: *"ask the user whether to change approach, **ship with the failure documented**, or abandon."* Documenting a failure and shipping is the definition of softening a failure into a caveat. Four independent escape hatches, all reachable by the letter of the text:

1. **Rule 7 requires reporting, not blocking.** "Report this as a gate failure, not as a clean pass" — an agent that prints "G6: FAIL" and delivers the deck has complied fully.
2. **The G6 waiver is free.** `review-protocol.md` L102: zero concessions "⇒ reject **unless the adjudicator files a signed waiver**". Under the AI execution model the adjudicator is another agent session and a "signed waiver" is a sentence written to a file. L24 claims the asymmetric burden "makes performance more expensive than conceding"; when the waiver costs one sentence, performance is cheaper. L111 then names this exact failure — *"the gates get Goodharted — eight painless objections and one cosmetic concession satisfy the letter"* — and the stated counter is *"audit the quality of clearing evidence rather than counting objections"*, which is assigned to nobody, given no procedure, and enforced by nothing. A known, named bypass is documented and left open.
3. **Rule 2 is overridable by user insistence.** Test Prompt 3's *expected* behaviour is that if the user insists on removing the adverse churn page, "agent records the removal as an accepted G-failure in `claims.md` rather than silently complying". So the hard rule against hiding the weakest point is satisfied by hiding the weakest point and noting it in a file that the deck's reviewer never receives. The reviewer's experience is identical to silent compliance.
4. **The independence gate self-degrades.** The HARD-GATE says "The attack pass is valid **only if** it ran in a context that never received the author's reasoning", then in the next clause supplies a path to continue without one. Phase 5's exit condition ("numbered objection list produced by an independent context") and the Platform Degradation row ("Record the pass as degraded") cannot both be satisfied, and nothing states which governs.

**Root cause**: The skill has no concept of a blocking failure — no phase can terminate the run. "Hard gate" is used to mean "loudly reported", and every gate's failure branch routes to a user decision, which for an agent under a completion condition resolves toward shipping.

**Suggested fix**: Split gates into *blocking* and *reporting* and label each of G1–G9 explicitly. For blocking gates, define refusal as the required output: the agent produces the ledger and the gate report and does *not* produce the deck. Make the G6 waiver require a named human identity and a stated reason recorded in `claims.md`, and forbid an agent from issuing it to itself. For Test Prompt 3, change the expected behaviour so the recorded G-failure is stated *to the user in the response and on the deck's own cover*, not only in a side file. Resolve the Phase 5 conflict by rewriting the exit condition as "either a numbered objection list from an independent context, or an explicit DEGRADED verdict that the response states in its first sentence".

### F8: Phase 7 has the author adjudicate its own gates — the same-context self-assessment Rule 6 forbids  [HIGH]

**Location**: SKILL.md L139 (Phase 7), L14 (Rule 6), L24-25 (Red Flags rows), L107 (Phase 3 exit), L115 (Phase 4 exit), L162 (`verification-rules` pattern claim); `references/argument-architecture.md` L123-129 (A1–A7 tests); `references/exhibit-standards.md` L129-140 (E1–E8 tests)

**Exploit scenario**: Rule 6 states the skill's core epistemic premise: *"Self-questioning inside the authoring context does not satisfy this rule"*, and the Red Flags table (L24) hardens it — *"Reasoning that produced the claim cannot audit the claim."* Phase 7 then instructs that same authoring context to *"walk the gate list … Report each gate as pass or fail"*. The only machine-checked object is the ledger's form; everything about the deck is graded by the agent that wrote the deck, in the context that wrote it. Concretely unenforced: A1 (declarative titles — Phase 4's exit condition "all titles declarative" has no tool), A7 (portability test), E1–E8 (assertion titles, `n=` presence, uncertainty type, exclusion arithmetic, sensitivity insets, single source of truth, provenance, encoding compliance — of which the file itself says "E2, E3, E4, E6, and E8 are directly automatable"), G4 (failure-account paths), G5 (objection labels), G7 (counter-example search trail), G8 (figure traceability, whose stated test requires "someone unconnected to the project"), and G9 (session identity). Phase 3's exit condition "every exhibit passes the self-sufficiency check" names a check that does not exist as an artefact or a script.

This makes the `verification-rules` pattern claim (L162) false as written: *"Every rule in the references carries a third-party-executable test; the machine-checkable subset is enforced by the bundled checker."* The references do describe third-party tests; nothing executes them. The bundled checker never opens the deck, and no script exists that could.

**Root cause**: The skill's independence argument is applied to Phase 5 and then dropped for Phase 7, even though Phase 7 is the step that issues the verdict. Automation was built for the artefact that was easy to parse (the ledger) rather than the artefact the gates are about (the deck), and the pattern claim was written against the intended design rather than the shipped one.

**Suggested fix**: Move the Phase 7 gate walk into the independent context from Phase 5 — the attacker session already has the deck and `claims.md` and nothing else, which is exactly the "existence, format, and ordering, no business knowledge" reader Phase 7 specifies. Have Phase 7 in the author context only *collect and report* the independent verdict. Then ship `scripts/check-deck.js` implementing the mechanically checkable subset over the rendered structure: A1 (title contains a finite verb), A2 (page-to-ledger ID closure), E2 (`n=` count versus data-group count), E4 (exclusion arithmetic closes), E6 (same metric name, one value). Until that script exists, soften the L162 pattern claim to name the subset that is actually enforced.

### F9: Parser fragility causes both silent claim loss and false failures on ordinary markdown  [HIGH]

**Location**: `scripts/check-claim-ledger.js` L138-170 (`parseLedger`), L162 (field regex), L155-159 (`### ID` handling), L224-228 (`checkSections`), L455-462 (ID prefix filters)

**Exploit scenario**: Five confirmed behaviours, all from running the checker on minimally perturbed copies of the bundled `assets/claims.example.md`:

1. **Bolded field names break everything and disable the substantive checks.** `- **claim**: …` does not match `/^[-*]\s+([a-zA-Z][a-zA-Z0-9-]*)\s*:\s*(.*)$/`, so the field is dropped. Observed: `FAIL … C1 missing claim; C2 missing claim`. The author sees a false failure telling them a field they can see with their own eyes is missing. Simultaneously `checkVerbPermissions` and `checkWarrantTautology` read `c.claim === undefined` and pass vacuously — so the single most common markdown convention for field labels produces one confusing false positive and two silent false negatives. The format contract is stated only in a comment in the example file and in half a sentence of SKILL.md L77.
2. **Wrapped values truncate at the wrap, hiding blacklisted verbs.** Any editor, formatter, or prettier pass that wraps a long `- claim:` line silently discards everything after the wrap — the continuation line matches no rule and is dropped. I confirmed the parsed value of a wrapped claim is `"Throughput per node changed from 1,640 to 2,140 parcels per day,"`, with the rest gone. Weaponised: a **T0** claim whose second line reads *"which the node rollout caused and which proves the model is right"* passes all 16 checks, because the verb scanner never sees the causal half of the sentence. This is a one-newline bypass of Rule 3, and it is also reachable by accident.
3. **Duplicate IDs silently delete a claim.** `sections[currentSection][currentEntry] = {}` overwrites. With two `### C1` headings, the claim count check reports `actual: 1` and passes; the deleted claim's falsifier, probability and verbs are never checked. The only symptom is `E1 is defined but never referenced (move to appendix)` — an error message that points the author at the wrong problem and recommends a fix (relegate evidence to the appendix) that violates Rule 2.
4. **Any `###` heading starting with the section letter becomes an entry.** `### Concessions` placed under `## Claims` parses as a claim (I confirmed the filtered claim list is `[ 'Claim C1', 'Concessions' ]`), producing spurious missing-field failures. `### Exhibit E1` under `## Evidence` registers the ID as `Exhibit E1`, so a claim referencing `E1` gets *both* "references undefined E1" and "Exhibit E1 defined but never referenced".
5. **Section headings must match a hard-coded lowercase string exactly.** `## Claims (core)` yields `missing: claims` plus `Core claim count … (actual: 0)` — and note that with zero claims, the field, verb, falsifier, probability and settlement checks all pass vacuously.

**Root cause**: A hand-rolled line-oriented parser with no continuation handling, no duplicate detection, no ID validation, no case normalisation, no fenced-code-block awareness, and exact-match section keys — combined with a design where a missing field is indistinguishable from a field the parser failed to read. Vacuous passing over empty collections compounds it: fewer parsed entries always means fewer possible failures.

**Suggested fix**: (a) Support continuations — append any non-blank, non-heading, non-field line to the previous field's value. (b) `fail` on duplicate `### ID` within a section instead of overwriting. (c) Validate entry headings against `^[CEAR]\d+(\s|$)` and `fail` on anything else, case-insensitively normalised. (d) Accept `- **field**:` and `- _field_:` by stripping emphasis before matching. (e) Match section headings on a normalised prefix (`/^claims\b/`) and emit the list of headings actually found when one is missing. (f) Skip fenced code blocks. (g) Emit a distinct `FAIL: ledger contains no parseable claims` when a section exists but yields zero entries, so downstream vacuous passes cannot be mistaken for compliance. (h) Add a `--strict` mode that fails on any line inside a known section that matches none of the three grammar rules — silent line dropping is the root of items 1, 2 and 4.

### F10: Reference closure punishes Rule 2 compliance and mishandles ID ranges  [MEDIUM]

**Location**: `scripts/check-claim-ledger.js` L363-391 (`checkReferenceClosure`), L184-189 (`extractIds`); SKILL.md L10 (Rule 2), L117 (Phase 2 required reading); `references/argument-architecture.md` L124 (A2), `references/attack-catalog.md` L68 (adverse-evidence page)

**Exploit scenario**: Rule 2 and the attack catalogue both demand a dedicated adverse-evidence exhibit — *"A dedicated adverse-evidence page containing the least flattering exhibit"*. I added exactly that to the compliant example: `E4`, the inter-node balancing-traffic series including the two months above 10 percent, cited from `R1`'s response (the rebuttal it answers). Result: `FAIL: … E4 is defined but never referenced (move to appendix)`. The checker only harvests IDs from a claim's `evidence` and `assumptions` fields, so evidence cited from a rebuttal response, from an assumption's elasticity computation, or from the pre-registration block is invisible. The failure text then instructs the author to do the one thing Rule 2 forbids. The bundled example ledger evades this only because it refers to its adverse exhibit as prose ("Page 9 carries the balancing-traffic series") rather than giving it an ID — so the worked example models the workaround rather than the rule.

Second defect: `extractIds` uses `\bE\d+\b`, so `- evidence: E1-E3` matches `E1` and `E3` and drops `E2`, which is then reported as an orphan. Third: assumption references are harvested only from a claim's `assumptions` field, which is not in `REQUIRED_CLAIM_FIELDS` — so an author can drop the field entirely, and every assumption becomes an orphan failure, pushing them toward deleting assumptions rather than referencing them.

**Suggested fix**: Harvest referenced IDs from every field of every entry in every section, not just two fields of claims. Expand `Ex-Ey` ranges before matching, or `fail` on a range with a message telling the author to enumerate. Add `assumptions` to the required claim fields (with `none` as an explicit legal value that the checker records). Change the orphan message from "move to appendix" to "reference it from a claim, an assumption, or a rebuttal" so the remedy stops contradicting Rule 2.

### F11: Evidence entries have no required fields at all, and empty sections pass vacuously  [MEDIUM]

**Location**: `scripts/check-claim-ledger.js` L117-123 (required-field constants — there is no `REQUIRED_EVIDENCE_FIELDS`), L394-409, L412-420; SKILL.md L13 (Rule 5), L153; `references/exhibit-standards.md` L132-137 (E2, E7)

**Exploit scenario**: In my passing ledger, `### E1` is followed by nothing — zero fields. It satisfies reference closure, and no check inspects it. Rule 5 declares that "n, denominator, window, definition, baseline, uncertainty, and source must be on the exhibit", and E2/E7 give third-party tests for exactly those; none is implemented for the ledger's own evidence entries, even though the ledger is the one artefact the tooling can read. Separately, a `## Assumptions` heading with no `### A` entries makes `checkAssumptions` loop zero times and print `PASS: Assumptions carry switching point and 6-part signpost (A5)`, and an empty `## Rebuttals` prints `PASS: No naked rebuttals`. I confirmed a ledger with both sections empty, one content-free claim and an empty evidence entry scores 16/16. So the cheapest route past the A5 switching-point gate and Rule 8 is to have no assumptions and no rebuttals — the checker rewards omitting the analysis over doing it badly, which is the wrong gradient for a gate whose purpose is to force the analysis.

**Suggested fix**: Add `REQUIRED_EVIDENCE_FIELDS = ["description", "source", "n", "window", "definition"]` and enforce that `source` contains an `as of <ISO date>` and that `n` contains a number. Require at least one assumption and at least one rebuttal at L1 and above, and `fail` with "section present but empty" rather than passing a check over an empty collection. Require the pre-registration block's `strongest-counter` to name the rebuttal ID that answers it, so the strongest counter-position cannot be declared in prose and then never engaged.

### F12: Cited research is load-bearing beyond what it can carry, including one Rule 3 violation by the skill itself  [MEDIUM]

**Location**: `references/review-protocol.md` L15 (Scheel/Schijen/Lakens), L17 and L88 (Nemeth), L45-49 (Klein, G4 thresholds), L100 (G4); `references/argument-architecture.md` L53-55 (O'Keefe), L16 of `exhibit-standards.md` (Tufte/Challenger); SKILL.md L11 (Rule 3)

**Exploit scenario**: Four citations doing more work than they support, and the first is self-refuting:

1. **Scheel et al. (2021), 96% versus 44%.** The text draws the causal conclusion explicitly: *"What differs between those two literatures is not researcher honesty. It is the moment of commitment."* That is a between-corpus observational comparison — Registered Reports differ from standard articles in self-selection, topic mix, replication share, statistical power requirements, and author population, none of which is addressed. On the skill's own ladder this is T1 evidence (`argument-architecture.md` L79: cross-sectional, requires "correlation measure plus confounder list"), and the sentence asserts sole attribution. The skill's foundational empirical claim commits precisely the offence Rule 3 exists to police, in the file that defines the gates. An adversary who reads the reference and then the rule has the skill's credibility by the throat.
2. **Nemeth on assigned devil's advocates.** Cited with no year, venue or title, unlike every other reference in the file, and then extended: L88 says the completion-condition design *"engineers around the Nemeth result — authentic belief is not required, an external success criterion substitutes for it."* No evidence is offered that an external success criterion substitutes for authentic dissent, and none exists for LLM sub-agents. This is the load-bearing justification for Rule 6 and Phase 5's entire architecture, stated as accomplished fact.
3. **Klein's premortem → G4's thresholds.** L45 honestly states that the literature measures "the *number and specificity* of reasons generated, not their accuracy". L49 and G4 (L100) then harden that into a reject gate at "minimum five independent failure paths" and "at least two paths must return as concrete page changes". Five and two are unsourced. A binary reject built on invented counts over a literature the author has just told us does not measure quality.
4. **O'Keefe (1999) → Rule 8.** L53 states the magnitudes are "not verified" and instructs the reader to treat only direction as actionable. L55 then derives an absolute: *"a bare 'we also considered the risk of X' is worse than not raising X at all"* — a magnitude claim (the effect is negative in absolute terms, not merely smaller) drawn from a direction-only reading, hardened into Hard Rule 8 and a checker gate. Also worth noting: `exhibit-standards.md` L16 presents Tufte's Challenger O-ring analysis as settled when it is actively contested in the visualisation literature.

**Suggested fix**: Rewrite the Scheel sentence to the grade its evidence supports — "the two literatures differ in when commitment occurs; the comparison is observational and does not isolate that variable" — and add the confounder list the T1 row requires. That single edit also removes the self-refutation. Give Nemeth a full citation and downgrade L88 from "engineers around" to a stated design hypothesis with the falsifier the skill demands of everyone else. Relabel G4's 5-and-2 as conventions chosen for tractability rather than findings. Restate Rule 8 as the direction the meta-analysis supports ("pair every rebuttal with a response; unpaired acknowledgement is the weakest of the three options") and drop "worse than silence" from Rule 8 and from the L55 operational consequence. Then apply the skill's own verb-permission table to all four reference files as a self-audit — it currently fails its own gate.

### F13: The three-claim ceiling is a hard failure whose suggested remedy produces a defect  [MEDIUM]

**Location**: `scripts/check-claim-ledger.js` L28-32 (`CLAIM_COUNT_MAX` and its rationale comment), L253-261 (`checkClaimCount`); SKILL.md L77 ("1–3 core claims"), L64-65 (L2/L3 rows); `references/review-protocol.md` L34, L98 (G2), `references/argument-architecture.md` L65 ("Pillars C1–C4 (five maximum)")

**Exploit scenario**: A genuine L3 submission — a multi-year capital programme with four independent load-bearing claims — cannot pass. The failure message reads *"split or merge claims to fit the bound"*, and splitting increases the count, so the only remedy the checker names is to **merge**. Merging two distinct claims produces a compound sentence with two subjects and two magnitudes, which is less falsifiable than either half, cannot carry a single numeric threshold, and directly violates the Claim Statement spec's "each one sentence with subject, action, magnitude, time window" (`review-protocol.md` L34). The checker therefore pressures the author toward a defect it elsewhere condemns. The bound also contradicts the architecture reference, which provides for *"Pillars C1–C4 (five maximum)"* (L65) on the argument-map page — three versus five, unreconciled, with no statement that "core claims" and "pillars" are different objects. The rationale in the code comment ("more than three core claims means the author has not decided what the deck is asking for") is asserted with no support and no escape hatch at any tier.

**Suggested fix**: Reconcile the two numbers explicitly — either define `pillar` as a distinct entity with its own ID prefix and its own bound, or raise `CLAIM_COUNT_MAX` to 5 and delete the conflicting text. Add an override of the form `- claim-count-exception: <reason>` in the triage block that converts the failure into a warning, so a legitimate wide-scope submission is not forced into a false merge. Change the failure message to "split into separately falsifiable claims and nominate one root claim" — never "merge".

### F14: The banned-hedge check false-positives on substrings and quoted objections, and is trivially evaded  [LOW]

**Location**: `scripts/check-claim-ledger.js` L64-67 (`BANNED_HEDGES`), L355-360 (`checkBannedHedges`); `references/review-protocol.md` L67

**Exploit scenario**: The check lowercases the whole file and runs `includes`. I added one field to the compliant example — `- reviewer-note: The auditor called the seasonal explanation impossibly convenient.` — and observed `FAIL: No banned vague hedges (G3) — found: possibly`. "Impossibly" contains "possibly". The same failure fires when a ledger quotes a reviewer's own words verbatim ("the CFO said the risk cannot be ruled out"), which is exactly what the `strongest-counter` field asks for, and when the ledger documents its own compliance by naming the banned list. Meanwhile evasion is free: `perhaps`, `arguably`, `conceivably`, `may well`, `we feel good about`, `broadly on track`, `directionally positive` are all unbanned and carry the same near-zero information the check exists to eliminate. The check is scoped to the whole file rather than to the fields where a hedge would do damage, so it polices prose and misses vocabulary.

**Suggested fix**: Match on word boundaries (`\bpossibly\b`) rather than substrings. Scope the check to the fields where a hedge changes meaning — `probability`, `claim`, `falsifier`, `response`, `would-change-mind` — and exempt any field named `*-note`, `strongest-counter`, or any value inside a markdown blockquote, so quoting an adversary is not a gate failure. Extend the list with the common unbound alternatives above, and note in the reference that a keyword list is a floor rather than the rule.

## Verdict

**Verdict**: REQUIRES_CHANGES

The skill's diagnosis of adversarial review is genuinely strong — the artefact-form argument, the concession-count metric, and the carrier-separation resolution are real contributions, and the reference files are better than most published skill material. But the enforcement layer does not implement the design, and the gap runs the wrong way: the skill's confidence in its own gates is highest exactly where the gates are weakest. I passed a ledger with a fabricated switching point, an unfalsifiable falsifier, a probability band contradicting its own numbers, an empty evidence entry, and a concealed fourth claim, and received `16 passed, 0 failed`, exit 0 (F1). The mechanism the skill calls "the entire mechanism" — pre-commitment ordering — has no enforcement at all, and the checker prints a `G1` label for a check it does not perform (F2). For qualitative or data-poor work the hard gate's only satisfiable path is to invent numbers, which manufactures the exact defect the attack catalogue names (F3). A required-reading reference recommends the appendix-and-verbal move two Hard Rules forbid (F4), the tier rule is undefined over half its inputs and contradicts Rules 6 and 7 (F6), and every gate's failure branch terminates in "ship with the failure documented" (F7). None of these is a polish item; F1, F2 and F3 change what a decision-maker is entitled to conclude from a deck this skill has stamped. The highest-value fixes are cheap and concentrated: cross-field validation in the checker (grade↔evidence design, band↔range, threshold-minus-date), a lock file for ordering, a declared qualitative evidence class, and a precedence rule making the Hard Rules govern the references. Until at least F1, F2 and F3 are closed, the skill should not be described as enforcing its gates, and the `verification-rules` pattern claim should be withdrawn.
