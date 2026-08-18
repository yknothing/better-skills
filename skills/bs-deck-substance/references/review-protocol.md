<!-- Parent skill: skills/bs-deck-substance/SKILL.md -->
<!-- Open this file when: Phase 1 (Pre-register) is reached; return to it at Phase 5, 6, and 7 -->

# Review Protocol

> **Parent skill**: [../SKILL.md](../SKILL.md) — covers Phase 1 (pre-registration), Phase 5 (attack), Phase 6 (adjudication), Phase 7 (gates)
> **Produces**: the pre-registration block of `claims.md`, the premortem file, the attack log, and the gate verdict

## Why self-criticism fails, and what actually fixes it

Self-criticism does not fail because people lack integrity. It fails because of **artefact form**: as long as the evidence of "I criticised myself" is a passage of prose, it degrades into performance. It can be faked for exactly three reasons — nothing was committed before the results were known, no independent party carried the burden of attack, and no trace exists that cannot be back-filled.

Three mechanisms sustain the failure:

- **Incentive.** The author is measured on the deck being approved, not on it being correct. Any real concession directly reduces their payoff, so the rational move is to produce low-cost symbols that resemble criticism — a "risks and challenges" page, a sentence about sample size. The most striking observation here is Scheel, Schijen and Lakens (*AMPPS*, 2021): **96% of a random sample of standard psychology articles reported support for their first hypothesis, versus 44% of Registered Reports**, where peer review and the publication decision happen before results are known.

  Note what that observation does and does not license, because this file defines the verb-permission gate and must obey it. Two corpora differ; the corpora were not randomly assigned, and they differ in other ways too (topic mix, how many are close replications, who chooses the format). By this skill's own ladder that is **T2 evidence — a comparison across groups with no identification strategy** — so the permitted wording is that changing the moment of commitment is *the most plausible explanation the authors advance* for the gap, not that it *caused* it. A Gate 2 adversary review caught an earlier draft of this paragraph asserting sole causal attribution, which was a Rule 3 violation inside the file that defines Rule 3. It is left documented here rather than quietly fixed, because it is the cleanest available demonstration that the check works on its author.
- **Cognition.** Motivated reasoning and the argumentative theory of reasoning both point the same way: reasoning defaults to justification rather than testing. When an author searches for counter-evidence, the search target is already contaminated by the conclusion.
- **Social.** Nemeth and colleagues compared *assigned* devil's advocates against *authentic* dissent and found that assignment mainly produces cognitive bolstering of the original position, underperforming genuine minority views. This directly bounds what "the author plays critic" can achieve.

Four structural counters, each closing one path to faking:

1. **Pre-commitment** — claims land, timestamped, before the evidence is assembled. Blocks HARKing (Kerr, 1998): hypothesising after results are known.
2. **Role separation** — the attacker reads the deliverables, never the reasoning. Blocks "I already thought about that".
3. **Verifiable artefacts** — every stage outputs a file an unrelated third party can locate and check, not a meeting consensus. Compare the auditing standard for workpaper documentation (PCAOB AS 1215): an experienced auditor with no prior connection to the engagement should be able to understand the work performed.
4. **Asymmetric burden of proof** — the default state is *not cleared to send*. The attacker need only raise a checkable doubt; the author must produce evidence to clear it. **A zero-concession outcome requires a signed waiver.** This makes performance more expensive than conceding.

The headline metric is not how many risks were listed. It is **concession count** — the number of times the material was weakened, withdrawn, or narrowed relative to the initial statement. Zero is a defect signal, not a quality signal.

## The Claim Statement (pre-registration)

Submitted **before any page is built**. Append-only; never overwritten.

| Field | Content | How it gets checked later |
|---|---|---|
| Core claims | 1–3, each one sentence with subject, action, magnitude, time window | Compare against the final deck claim by claim; differences must appear in the changelog |
| Decision request | The specific action sought and how irreversible it is | Consistency with the claims |
| Deciding evidence | For each claim: which dataset, which definition, what threshold counts as support | If the final definition differs, that is a definition switch and must be declared |
| Falsifier | "If [X] is observed, this claim is refuted" | Is X observable — see below |
| Stated probability | A numeric value plus a settlement triple | Must fall inside the band vocabulary |
| Strongest counter-position | The most powerful opposing argument and who typically holds it | Compare against the attack log: **the count of objections the author failed to anticipate is a calibration measure** |
| What would change my mind | The evidence that would cause withdrawal or narrowing | The evidence must discriminate between the hypotheses. In I. J. Good's weight-of-evidence sense, evidence with a likelihood ratio near 1 carries zero weight and is an invalid entry |
| Data freeze date | The cut-off for the analysis | Favourable data arriving after this date must be reported separately |

## Premortem, used correctly

Klein's procedure (*Performing a Project Premortem*, HBR, 2007) is: **declare that the plan has already failed completely**, then have each participant independently write how it happened. The underlying finding is prospective hindsight — treating an outcome as having already occurred generates more reasons than treating it as merely possible. State the limit honestly: that literature measures the *number and specificity* of reasons generated, not their accuracy.

Why "think about what could go wrong" fails: it is an **open generative task**, so abstract nouns ("poor execution", "market shifts") pass, and the author is never required to concede that failure occurred — they can dismiss each item internally as they write it. "Write how it failed" is a **closed explanatory task**: the output must be a causal chain, abstractions cannot form a narrative, and specificity becomes forced.

Artefact — *Failure Account (future tense)*: written in the completed past tense, minimum five independent failure paths, each carrying (a) the triggering event and its timing, (b) the earliest observable warning indicator, (c) the magnitude of loss, (d) what could have been done at the time. Procedure rules: **write independently before any discussion**; at least two paths must return as concrete page changes in the deck, referenced by page number in the changelog.

## Falsifiability acceptance

Popper's criterion in *Conjectures and Refutations*: a good theory is a **prohibition** — it forbids certain things from happening. A theory no conceivable event could refute is exhibiting a defect, not a virtue.

Each core claim carries one prohibition sentence in fixed form:

> If at **[date]**, via **[data source / definition]**, **[metric]** **[comparator]** **[threshold]**, this claim is refuted.

The checker needs **no business knowledge** — only five existence tests: (1) is the metric an observable quantity, not "synergy" or "strategic value"; (2) is the threshold a number; (3) is the time point a date; (4) does the data source already exist, or is it stated who produces it and when; (5) **does the author actually expect this condition might not hold** — if they simultaneously call it near-impossible, the prohibition is vacuous and goes back for rewriting.

Reverse test: negate the claim. Is it still compatible with the same body of evidence? If yes, the evidence has no discriminating power and the claim is empty.

## Calibration and confidence

Sherman Kent's classic finding at CIA was that a phrase like "serious possibility" was read as anywhere from roughly 20% to 80% by different officers — vague wording transmits almost no information. Tetlock's work on expert political judgement and the Good Judgment Project showed that only scoreable probability statements (Brier-scored) allow judgement to improve.

1. **Mandatory vocabulary.** Every uncertainty statement falls in one of seven bands with its numeric range attached, following the US intelligence-community analytic standard (ICD 203): almost no chance 1–5%, very unlikely 5–20%, unlikely 20–45%, roughly even chance 45–55%, likely 55–80%, very likely 80–95%, almost certain 95–99%. Banned unbound words: "possibly", "hopefully", "cannot be ruled out", "expected to be good" — all keyword-detectable.
2. **Settlement binding.** Every probability carries a triple: settlement date, judging data source, judging rule. **A probability with no settlement condition is not a probability, it is a tone of voice** and is treated as non-compliant.
3. **Separate likelihood from confidence.** ICD 203 requires these not be blended in one sentence. Low confidence is stated with its cause — stale data, unclear definition, small sample — and never expressed by shading the probability downward.
4. **Score and retain.** Settled probabilities enter a calibration log with hit rate and Brier score, attributed by name. This is the only mechanism that makes "90% confident" expensive: it will later be settled and attributed.

## Role separation

| Role | Sole artefact | Success criterion (deliberately different per role) |
|---|---|---|
| Author | The deck, the Claim Statement, the changelog | Every objection carries a disposition |
| Attacker | Numbered objection list: target page or ID, failure mechanism, the evidence required to clear it | Number of objections adjudicated **valid** ≥ k |
| Adjudicator | Line-by-line ruling: upheld / rejected / pending, plus must-fix versus optional | Rulings complete, with no "let us discuss later" |
| Recorder | Timestamp ledger: artefact hashes, submission times, diffs | Ordering verifiable, no back-filling. **No tool in this skill fills this role** — it is satisfied by git history, a CI job, or a person, and if none of those is in place, say the ordering is unverified rather than assuming the role was covered |

**Anti-collusion.** The attacker's evaluation is fully decoupled from whether the material gets approved — the operating logic behind military red teaming and behind dedicated devil's-advocate units in intelligence organisations, which are separately staffed and report upward independently. The adjudicator does not know which submission came from whom. The same person must never be both author and attacker; the minimum acceptable configuration is author plus attacker plus a ruling sheet co-signed by both.

### AI agent implementation

This is where the protocol is most often quietly gutted.

- The attacker is a **sub-agent with an independent context**: a fresh session whose input is **only** the rendered deliverable and the Claim Statement, with **no** author chain-of-thought, drafts, prompt history, or intermediate workspace files. The moment the author's reasoning leaks in, attack degrades into bolstering.
- The attacker's instruction does not say "play a critic". It states an **independent completion condition**: produce at least k numbered objections, each with the evidence required to clear it, or the task is unfinished. This engineers around the Nemeth result — authentic belief is not required, an external success criterion substitutes for it.
- The adjudicator is a third independent session reading only the two documents, with the two inputs **presented in randomised order** to cancel position bias.
- All three artefacts are **written to disk with hashes and times**, and the recorder (which may be a script) verifies ordering: the Claim Statement hash time must precede the first deck version, and the attack report must precede the corresponding changelog entries.
- **Self-questioning inside one session never counts as the attack phase.** This is machine-detectable: identical session ID means non-compliant.

## Hard gates

Preconditions for sending. Any "no" blocks the material. The judge performs existence, format, and ordering checks only, and never evaluates whether the content is correct.

- **G1 Commitment ordering** — the Claim Statement's recorded time precedes the first deck version's recorded time. **This is an ordering property between two artefacts, and a self-reported `registered-at:` field cannot establish it** — that string can be typed at any time. The gate is only satisfied by external evidence: `check-claim-ledger.js --deck <file>` comparing modification times (weak), or git history or recorded hashes (strong). Without such evidence the correct report is UNVERIFIED, never a pass. Missing statement, later statement, or no ordering evidence ⇒ reject.
- **G2 Falsifier completeness** — 1 to 3 core claims; each has a prohibition sentence containing a **numeric threshold**, a **date**, and a **named data source**. Any element missing ⇒ reject.
- **G3 Probability compliance** — every uncertainty statement falls in the seven-band vocabulary with a numeric range; every probability carries its settlement triple. Any banned vague word, or any probability without a settlement condition ⇒ reject.
- **G4 Failure narrative** — a Failure Account file exists with ≥ 5 paths, each carrying trigger, warning indicator, and loss magnitude; ≥ 2 map to page-level changes in the changelog. Insufficient paths or no page mapping ⇒ reject.
- **G5 Objection closure** — an attacker report exists with ≥ 8 numbered objections (see tier table for reductions); each is labelled exactly one of *accepted and changed (page diff attached)*, *rejected with counter-evidence (citable source attached)*, or *unresolved and disclosed in the main body (page attached)*. Any empty label, or values like "noted" or "will follow up" ⇒ reject.
- **G6 Non-zero concession** — the final deck weakens, withdraws, or narrows at least one claim relative to the Claim Statement, recorded in the changelog. Zero concessions ⇒ reject unless the adjudicator files a signed waiver.
- **G7 Counter-evidence search trail** — each core claim carries a counter-example search record: query, source searched, date, and hit/no-hit result. Any claim without one ⇒ reject.
- **G8 Number traceability** — every figure in the deck has a unique ID indexed to a workpaper row (source, definition, calculation, extraction date). Sample three figures at random and hand them to someone unconnected to the project; if any cannot be located within five minutes ⇒ reject. This is the binary form of the experienced-auditor standard.
- **G9 Role independence** — the attacker artefact's author identity differs from the deck author's; under AI execution the attacker session ID differs from the author's, and the attacker's input manifest contains no author reasoning files. Same identity or same session ⇒ reject.

## Cost and tiering

**Real costs**: pre-registration and workpaper indexing add substantial production time; attack-adjudicate-revise is a full rework cycle; the organisational cost is higher still, since it needs an attacker whose evaluation is not tied to approval — which in a small team frequently does not exist.

Two failure modes to watch. First, **the gates get Goodharted** — eight painless objections and one cosmetic concession satisfy the letter; the counter is to audit the quality of clearing evidence rather than counting objections. Second, **decision delay has an opportunity cost**; for small reversible decisions the delay loss can exceed the error loss.

Tiering is by **decision reversibility and exposure**, never by page count.

| Tier | Applies to | Required |
|---|---|---|
| L0 | Internal sync, fully reversible, no resource commitment | G2 and G3 only |
| L1 | Team-level decision, rollback possible, good-faith questioning | G1–G3, G5 with ≥ 4 objections, G8; premortem verbal and unfiled |
| L2 | Cross-team resource commitment, partly irreversible, a reviewer with opposing interest | All of G1–G9, ≥ 8 objections, attacker is an independent sub-agent or another person |
| L3 | High-intensity adversarial review, major irreversible commitment, post-hoc accountability | L2 plus two attackers in parallel independent contexts, external adjudicator, published calibration log, settlement-date retrospective filed |

Selection rule, also binary: **irreversible AND a reviewer whose interests oppose the author ⇒ at least L2.** Reversible with no opposing interest ⇒ L0 or L1 is correct, and running the full protocol is over-engineering.
