<!-- Parent skill: skills/bs-defensible-deck/SKILL.md -->
<!-- Open this file when: Phase 5 (Independent attack) is reached, or when auditing a deck someone else built -->

# Attack Catalogue

> **Parent skill**: [../SKILL.md](../SKILL.md) — this is Phase 5 (Independent attack)
> **Prerequisites**: A rendered deck and a completed `claims.md`
> **Use as**: the attacker's checklist. Also usable in reverse during Phase 2–4 as a pre-emptive audit.

Every entry gives the question a real reviewer asks, the defect it targets, and what the material must already contain for the attack to miss. The defence column is the actionable part — it describes an artefact, never a talking point.

---

## 1. Argument structure

| Attack | The question | Defect targeted | Defence required |
|---|---|---|---|
| Broken link | "Which number on this page supports that conclusion? Point to it." | Conclusion has no corresponding evidence on the page | Every conclusion traceable to a specific figure on the same page; cross-page references carry page numbers |
| Premise disclosure | "Name three premises this conclusion needs that you did not write down." | Implicit premises never surfaced | A dedicated page listing the conditions the conclusion depends on, including the most fragile one |
| Scope swap | "The data is one business line, the conclusion says company-wide. Where is the bridging step?" | Extrapolation without a bridging argument | Conclusion scope matches data scope word for word; extrapolation is a separate argued claim |
| The missing "therefore" | "There's a step missing between page 7 and page 8. Supply it." | Omitted inference hidden by layout or arrows | Key chains written as explicit steps; never implied by graphical arrows |
| Circularity | "You say it matters because it is high priority. Who set the priority?" | Premise restates the conclusion | Importance derives from an externally verifiable quantity, not internal roadmap position |

## 2. Evidence

| Attack | The question | Defect targeted | Defence required |
|---|---|---|---|
| Move the window | "Why does the series start that month? Show me two more quarters back." | Cherry-picked time window | Longest available series shown by default; any truncation justified on grounds independent of the conclusion |
| No baseline | "If you did nothing, what does this curve look like?" | No counterfactual reference | A pre-built baseline: trend extrapolation, unaffected cohort, or seasonal component |
| Denominator interrogation | "What is the denominator of that percentage, and did it change over these months?" | Unstated or drifting denominator | Every ratio labelled with numerator, denominator, and n; denominator changes broken out separately |
| Definition reconciliation | "Is this the same definition as the one on the previous quarter's page?" | Metric definition drift | A change log: what changed, when, the magnitude of impact, and one period dual-reported |
| Survivorship | "Where are the churned, the exited, the excluded, on any of these charts?" | Survivorship bias | Explicit exclusion rules plus the size and profile of what was excluded |

## 3. Causality

| Attack | The question | Defect targeted | Defence required |
|---|---|---|---|
| Reverse causation | "Could the metric have risen first, and that is why you shipped?" | Unverified temporal order | Event timestamps marked on the curve, with several pre-launch periods visible |
| What else happened | "What other changes fell inside that window — promotions, seasonality, another team's experiment?" | Confounders | A change log overlaid on the metric series, with each candidate addressed |
| Self-selection | "Are the people who used the feature the ones who were already most active?" | Selection into treatment | Explicit control construction: randomised, matched, or discontinuity-based |
| Placebo test | "In a cohort that should be unaffected in theory, did this metric move?" | No falsification test | At least one placebo metric or cohort reported honestly |
| Dose response | "Double the input — does the effect double? Show me that curve." | Single-point effect estimate | Effect at several input levels, with the point of diminishing return identified |

## 4. Numbers and exhibits

| Attack | The question | Defect targeted | Defence required |
|---|---|---|---|
| Zero the axis | "Where does the y-axis start? Redraw it from zero." | Truncated axis exaggerating change | Zero baseline by default; where truncation is necessary, a full-range inset on the same page |
| Unstack the axes | "Put both lines on one axis." | Dual axes manufacturing correlation | Dual axes only where units differ and no correlation is implied |
| Give me the distribution | "Not the average. Median, p90, and a histogram." | Aggregate concealing distribution | Key metrics always accompanied by quantiles or a distribution view |
| Drop the head | "Remove the three largest accounts. Does this still hold?" | Concentration hidden by totals | Concentration disclosed and the recomputation offered unprompted |
| Unit swap | "One page uses absolute values, the next uses percentages. Convert both to absolute." | Unit switching to flatter effect | Consistent units within an argument chain; ratios and absolutes presented together |
| Noise comparison | "How does that lift compare with normal week-to-week variation?" | Effect not contrasted with noise | Variation band shown, with effect size and noise on the same exhibit |

## 5. Counterfactual and completeness

| Attack | The question | Defect targeted | Defence required |
|---|---|---|---|
| Alternatives | "The same money on two other things — what is the return on each? Did you compute it?" | Option space never evaluated | At least two genuine alternatives costed on the same basis |
| Failure condition | "What outcome would make you admit this was the wrong call?" | No falsifiable criterion | Pre-committed metric, threshold, date, and the action triggered |
| Switching point | "Which assumption, if wrong, flips the conclusion? How likely is that?" | Sensitivity analysis as theatre | The critical value at which the conclusion flips, and the current distance from it |
| Already happening | "Which of these risks is already materialising?" | Risk page disconnected from reality | Risk table with a current-status column and a named owner |

## 6. Honesty and meta

| Attack | The question | Defect targeted | Defence required |
|---|---|---|---|
| The drawer problem | "Is there a number you looked at and did not put in this deck?" | Adverse data removed | A dedicated adverse-evidence page containing the least flattering exhibit |
| False precision | "What entitles you to that decimal place?" | Precision beyond what the data supports | Significant figures matched to data quality; estimates labelled as estimates |
| Footnote confrontation | "This footnote and this sentence disagree. Which one counts?" | Body contradicted by footnote | Footnotes supplement; they never carry a qualifier that conflicts with the body |
| Who dissented | "Who has seen this and disagreed? What was their reason?" | Dissent filtered out | Recorded dissenters and the unresolved disagreements |
| Incentive disclosure | "If this conclusion holds, who benefits — including you?" | Undisclosed conflict of interest | Incentive structure and the author's own position stated proactively |
| Least confident page | "Which page are you personally least sure about?" | Uncertainty not self-declared | Confidence grading in the material, and the author can name the weakest page instantly |

---

## The three-question budget

Reviewers rarely have unlimited turns. Board members typically get three. These three maximise information gain because the answers cannot be pre-rehearsed and each one shifts the posterior regardless of how it is answered.

| Order | Question | Why it dominates |
|---|---|---|
| 1 | "If you did nothing, what does this curve look like?" | Tests baseline, causality, and value in one move. No answer means every subsequent number degrades to anecdote. |
| 2 | "What outcome would make you admit this was wrong?" | Separates *thought it through* from *wants to win*. No threshold means the claim is unfalsifiable and cannot be held to account later. |
| 3 | "Is there a number you looked at and did not include?" | The only one that cannot be rehearsed. It tests the person, not the material — and the answer sets how much the first two answers are worth. |

The order is load-bearing: (1) establishes quality, (2) establishes boundaries, (3) establishes credibility.

## Concealment signals

Observable properties that raise a reviewer's suspicion before a single question is asked. Treat each as a defect to remove, not an impression to manage.

| Signal | How a reviewer reads it |
|---|---|
| Series starts at an odd month, or "since [month]" | The window was selected; moving the start back would look worse |
| Growth rates without absolute values | The base is too small to show |
| Ratios without n | The sample cannot support the claim |
| Every arrow points up and right; no declining series anywhere | Filtering has already happened |
| Risk page is entirely macro, competitive, and regulatory | Nothing project-specific — no risk identification was performed |
| Conclusion on page 2, evidence after page 30 | Betting that nobody reads that far |
| Appendix thicker than the body, never referenced from it | Using technical disclosure to manufacture deniability |
| Type size drops or palette shifts on one page | That page was added under duress; the author does not want you to linger |
| "Significant", "substantial", "material" with no number attached | The numbers do not support the adjectives |
| Metric renamed between versions (active → engaged, cost → investment) | Linguistic trace of definition drift |
| Jargon density spikes in one section | Terminology wrapping a weak link |
| Data cut-off long before the presentation date | The most recent data is unfavourable |
| Cases presented as a customer logo wall | Single anecdotes standing in for a distribution |

## Fake defences

Actions that look rigorous and read as evasive. An attacker treats these as confirmation that something is being managed rather than disclosed.

| Fake defence | Why it backfires | The real version |
|---|---|---|
| Risk page full of uncontrollable external risks | Every item is something the author is not accountable for; it reads as "not my fault if this fails" | Each risk carries a trigger metric, threshold, current status, and owner |
| Uniform plus/minus 10 percent sensitivity | Parameter choice is itself defensive; only non-binding variables were moved | The switching point and the current safety margin |
| A "limitations" section saying the sample could be larger | A limitation chosen because it does not threaten the conclusion | The limitation that genuinely could overturn it, with an estimated magnitude |
| Volunteering one unrelated small error | Straw-man candour buying trust cheaply | Disclose the issue that most affects the conclusion |
| Three options where two are designed to lose | The comparison is decorative | Alternatives sourced from different stakeholders, costed identically |
| Confidence intervals shown, conclusions still stated as point estimates | The interval is ornamental; decision language ignores it | State the conclusion at the interval's lower bound |
| "Conservative estimate" instead of a range | "Conservative" is self-certification and cannot be checked | Give the range, the distribution assumption, and the worst case |
| Citing an external authority's conclusion in place of own evidence | Outsources the burden of proof and imports unexamined assumptions | Cite their data and method, and state where applicability differs |
| Complete data in the appendix with no navigation from the body | Formally compliant, practically a bet that nobody checks | Reference the appendix page beside the conclusion, naming the adverse figure |

---

## One-line summary

**A deck's strength equals the degree to which it surfaces its own weakest point unprompted.** Anything a reviewer has to extract is priced as deliberate concealment; only what the author puts on the table first, with a quantified impact, counts as defended.
