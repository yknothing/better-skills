<!-- Parent skill: skills/bs-ppt-architecture/SKILL.md -->
<!-- Open this file when: Phase 3 (Design the exhibits) is reached -->

# Exhibits

> **Parent skill**: [../SKILL.md](../SKILL.md) — Phase 3
> **Read in order**: Part 1 is the objective — what makes a chart or table excellent. Part 2 is the floor — the honesty requirements. Formally: `max(insight density) subject to (complete annotation, no manipulation)`. The floor is the `subject to`, never the `max`.
> **Scope**: charts and tables as evidence and as instruments of discovery. Not visual craft — see `bs-visual-design`. Where the two overlap on encoding and palette semantics, **this file wins inside a decision deck**, because its rules govern what a reader can conclude rather than how the page feels.

---

# Part 1 — Excellence

## The first-principles criterion: incompressibility

**An excellent exhibit's content cannot be losslessly compressed into one sentence.** The reader's action on it is *discovery*, not *confirmation*. Value equals the information gain between the reader's prior and their posterior, divided by the attention it costs. When the gain fits in a sentence, write the sentence.

Tufte's analytical design principles in *Beautiful Evidence* put **"show comparisons, contrasts, differences" first** and documentation of sources fifth. A defensive checklist covers only the fifth.

**The test (blind three-reader method, executable by anyone):** cover the title, give three readers thirty seconds each, have them write the independent facts they see. Take the **intersection**, call it I.

| I | Verdict |
|---|---|
| ≥ 2 | Earns a full page |
| 1, and needs repeated monitoring | Earns one panel of a multiple |
| 1, one-off finding | **Delete the chart, write the sentence** |
| 0 | The exhibit failed |

**Boundaries — this criterion is not universal.** Monitoring readouts (control charts, dashboards) derive value from constant position and repeat reading, so I=1 is legitimate. **Refutation exhibits** are the important exception: when the reader's prior is wrong, confirming a single sentence is an enormous gain — most of Rosling's income-versus-lifespan scatterplots refute one popular misconception each. Audit and commitment records prioritise completeness and may be mediocre. So the strict form of the criterion is *gain relative to prior*, and the one-sentence test is its cheap proxy.

## Compared to what?

Every managerial assertion can be written as *X differs from Y by D on dimension Z, and D exceeds noise.* **With Y missing there is no D, and the chart is a numeric display.** So the first design decision is choosing Y — before chart type, before palette. And Cleveland & McGill (1984) add the second half: even with Y present, leaving the comparison to the reader's arithmetic (two unaligned bars, two numbers on two pages) destroys precision. **Choose the baseline, then encode D as position.**

### Baseline typology

| Baseline | Question it answers | Attribution cleanliness | Typical failure |
|---|---|---|---|
| Own history (before/after, year-over-year) | Did it change | low | Confounded by seasonality, trend, external shocks |
| Peer / cohort / region | Does everyone look like this | medium | Peers not comparable in size or definition |
| Target / commitment | Did we hit it | medium | The target itself was invented |
| **Counterfactual** (control group, holdout, DiD, synthetic control) | **Was it us** | **highest** | Expensive, often unavailable |
| Model residual (forecast vs actual, deseasonalised) | Is this beyond normal | high | Wrong model, wrong residual |
| Noise band (historical variation, ±3σ, permutation) | Signal or wobble | high | Mistaken for a target line |
| Internal stratification (quantiles, funnel stages, subgroups) | Global or local | high | Over-stratified into noise |
| Competitor / market | Relative position | low | Asymmetric data sources |
| Theoretical ceiling (capacity, TAM) | How much room is left | medium | The ceiling estimate is contested |

### Five-step selection

1. **Write the assertion template**: `X differs from ___ by ___ on ___`. Cannot fill the second slot, do not start the chart.
2. **List at least three candidate baselines**, each with a line naming its most likely objection.
3. **Least-favourable baseline test.** Substitute the least favourable baseline that is still legitimate. If the conclusion flips, either **show both baselines together** or downgrade the conclusion to "under basis A". This is the move that converts a post-hoc defence into a design constraint.
4. **Prioritise by attribution cleanliness** (counterfactual > residual or stratified > peer > target > own history > competitor), letting **decision relevance override** where it genuinely applies — a decision-maker approving budget may need the target baseline more than the control group.
5. **Encode D itself**: a difference chart with the baseline at zero, an index with the base period at 100, or juxtaposition on a common scale. **Any chart requiring the reader to subtract is unfinished.**

**Third-party test**: have someone with no business context point at the baseline on the chart. Cannot find it in thirty seconds, it fails. The baseline must be on the same axis, same scale, same page as the conclusion.

## Insight density is not data density

Tufte's data density is data points per unit area — it counts the numbers. **Insight density counts independent actionable differences** (the I above).

- High data density, low insight density: a hundred-thousand-point scatter cloud; a full detail table; 200 raw rows drawn as a hairball.
- Low data density, high insight density: two treatment arms plus a control with confidence bands — six numbers, and the conclusion is incompressible.

**Increase density when** a second dimension appears (time × group), the distribution matters more than the mean, individual exceptions must be identifiable, or the reader will return to it repeatedly. Tools: small multiples, sparklines, overlaid baseline bands.

**Decrease density when** the page supports one decision, the spoken pace is under a minute per page, or the density comes from repeated frames, gridlines, legends, and decoration rather than data.

**Half-deletion test**: delete half the graphical elements at random. If I does not drop, what you deleted was noise.

## Small multiples

Three mechanisms make this the strongest single instrument:

1. **It converts sequential comparison into juxtaposed comparison.** Comparing across page-turns depends on working memory (~4 chunks); comparing side by side uses parallel visual search and is not bound by that limit.
2. **A constant frame isolates the signal.** The design does not change; only the data does. The one channel varying across panels is precisely the variable under comparison.
3. **It upgrades the perceptual task.** A shared scale moves the judgement from angle or area — the least accurate levels in the Cleveland–McGill ordering — to position along a common scale, the most accurate.

**It raises honesty at the same time**, which is why it belongs in Part 1 rather than Part 2: a shared scale makes "show only the panel that won" impossible, and exhaustive enumeration makes cherry-picking visible — a missing panel is a visible hole rather than a silence.

**Construction**: shared x and y with identical ticks; exactly one variable varying across panels; **sort by the data** (effect size, final value, slope), never alphabetically; direct labelling per panel instead of a global legend; ceiling of about 12 panels projected (3×4) or 25–30 in a read document, beyond which stratify and add an "all others" panel; keep each panel legible in height.

**Not applicable** when panel sample sizes differ wildly (label n or switch to a single chart with confidence bands), when magnitudes span more than two orders of magnitude (a shared scale flattens the small panels — index to 100 or use a declared log axis), or when there are fewer than three panels (overlay instead).

## Excellent tables

Bertin's reorderable matrix (*Sémiologie graphique*) carries the core insight: **sorting is an analytical act, not a formatting one.** The pattern in a table is *arranged into* visibility.

| Rule | Third-party test |
|---|---|
| **Sorting is the argument** — sort descending by the column under argument, and declare the key | Is the first row the protagonist of the conclusion? Alphabetical order is allowed only for lookup tables |
| **Difference columns are mandatory** and prominent — Δ, Δ%, versus baseline, contribution decomposition | Would the reader have to compute anything? Any comparison requiring subtraction or division is precomputed |
| **Fixed semantic direction** — rows are the compared entities (many, sortable), columns are dimensions or time (few), time runs left to right | Check orientation |
| **Make the pattern visible** — right-aligned tabular figures, significant figures unified and truncated to decision precision, in-row sparklines only in one column and with a scale, fixed subtotal position | Can someone with no business context name the largest, the smallest, and the anomalous row in 60 seconds? If not, the table is unfinished |
| **Table/chart boundary** — under about 20 numbers prefer a table; beyond that, when shape matters, switch to a chart | Count the cells |

## Mediocre-but-honest exhibit forms

| Form | Diagnostic signal | Repair |
|---|---|---|
| Three-bar single-point chart | The caption contains the whole finding (I=1) | Make it a sentence, or add baseline and stratification to lift I to ≥2 |
| Baseline-free time series | One line, your own, alone on the canvas | Overlay deseasonalised, peer, or target; or convert to a difference chart |
| Percentage pie or donut | More than three segments, or segments needing comparison | Sorted bars plus a difference column — angle is less accurate than position |
| Six consecutive same-structure pages | Adjacent pages share x and y semantics | Combine into small multiples |
| Legend dependence | The reader's eye travels between chart and legend more than once | Label at the line ends |
| Decorative icons, 3D, gradients | Deleting them changes no information | Delete; give the space to baseline and stratification |
| Table screenshot as a chart | A bitmap, small type, unsorted | Re-lay out with a difference column, or convert to a chart |
| Mean-only bar chart | A mean with no dispersion | Show quantiles, distribution, or strata |

## Excellence and honesty

**Honesty and completeness are necessary but not sufficient — and they are not orthogonal to excellence.**

Within the feasible region the two are coupled in a specific and useful way: annotating n, the denominator, and uncertainty **makes non-existent patterns disappear**. If an insight evaporates once the confidence band is drawn, it was never there. **Complete annotation is therefore a detector for false insight**, not merely a defensive obligation. This is the strongest argument for the Part 2 checklist and the reason it is not optional.

*An exhibit that is scrupulously honest and carries zero insight* costs three ways: it consumes scarce attention, it dilutes the real signals in the same deck, and it trains the audience to skip exhibits — so the next one that does carry insight gets skipped too.

*An exhibit with a strong insight that hides adverse data* — is the insight real? The correct answer is **undecidable**, not "real but unethical". The hidden data may be exactly the data that makes the pattern vanish. And it spends trust at a negative expected rate.

## Constructible rules — Part 1

| # | Mechanism | Do | Third-party test |
|---|---|---|---|
| X1 | Difference is the semantic unit | Fill the assertion template and list three candidate baselines before drawing | Can someone point at the baseline within 30 seconds |
| X2 | Eliminate mental arithmetic | Draw Δ against a zero line, or index to 100 | Does any comparison in the chart require subtraction |
| X3 | Juxtaposition beats page-turning | Combine same-structure pages into small multiples on a shared scale | Are there adjacent same-structure pages left uncombined |
| X4 | Cleveland–McGill accuracy ordering | Encode the main conclusion as position on a common scale; never angle, area, volume, or saturation | Is the conclusion's quantity on a common scale |
| X5 | Remove the decoding step | Direct labelling; the title states the conclusion, not "X trend" | Is the title a judgeable sentence; has the legend been removed |
| X6 | Order carries information | Sort by the column under argument; declare the key | Is the first row the conclusion's protagonist |
| X7 | Stratify until it would reverse | Cross-check along at least one key dimension (guards against Simpson's paradox) | Is the stratified result retained in the companion document |
| X8 | Attention budget plus incompressibility | One question per exhibit; run the blind three-reader test | I ≥ 2 and the three readers agree |

Plus one scale rule: for line charts, choose an aspect ratio that puts the critical slope near 45° (Cleveland's banking to 45°), otherwise the trend judgement is governed by the aspect ratio rather than the data.

---

# Part 2 — The floor

A reader trying to use the exhibit as evidence asks three questions: *is that how the data was produced*, *could there be another explanation*, *does it hold under a different definition or window*. These are measurement, causality, and robustness. Answer them on the exhibit.

One consequence contradicts a rule most designers hold: **the data-ink ratio does not apply to evidence elements.** n, denominators, exclusion notes, and uncertainty are *evidence ink*. Tufte's own analysis of the Challenger O-ring charts in *Visual Explanations* makes the point from the other side — the fatal flaw was showing only the flights that had problems and omitting those that did not, so a missing denominator prevented the temperature relationship from being established at all.

## Self-sufficiency elements

Each missing element leaves the exhibit unable to carry the claim.

| Element | Form on the exhibit | Fails if absent |
|---|---|---|
| n and denominator | `n=` per group; every proportion paired with its absolute value | "That percentage came from three samples" / denominator swap |
| Window plus reason | Full window on the axis; a subtitle stating why it starts and ends there | Cherry-picking; a start point that happens to be the trough |
| Definition | An executable definition, including what is counted in and out | "Your active users are not the same thing as on the previous page" |
| Baseline or control | On the same exhibit (see Part 1) | "No counterfactual, so how do you know it was not going to happen anyway" |
| Uncertainty | Error bars, interval, quantile band, or raw points — **with its type named** (SD, SE, 95% CI are not interchangeable) | "That difference is inside the noise" |
| Source and extraction time | Source system, table or report identifier, `as of YYYY-MM-DD` | "The definition was restated" / "your number is a week old" |
| Exclusion accounting | CONSORT-style flow: raw N → each exclusion with its count → final N, arithmetic closing | "You dropped the inconvenient samples" |
| Unit and axis origin | Unit on the axis; bars and areas require a zero baseline; a non-zero line chart says so | Huff's "gee-whiz graph" |
| Assertion title | A sentence with a predicate and a direction (Doumont's message-first) | "The chart and your sentence do not match" |

**Shortcut test**: remove the presenter. Hand the exhibit to someone with no business context. Can they state the conclusion, the sample size, the time range, and the comparison group? Any one missing means it fails.

## Claim type to chart form

Based on Cleveland and McGill's perceptual ordering and Wilkinson's grammar of graphics. Mackinlay's expressiveness criterion states the stake: a graphic expressing facts not present in the data is not ugly, it is false.

| Claim to support | Correct form | Typical misuse | Fails as |
|---|---|---|---|
| Ranking | Sorted dot plot, or zero-based bars on a common scale | Pie, radar, 3D columns | "The ordering is an artefact of angle and area" |
| Time trend | Evenly spaced time axis, line, full window | Per-period bars, broken axis, two points joined | "Window trimmed" / "two points are not a trend" |
| Composition | Percentage stacked bar or treemap, **with the absolute total alongside** | Multi-slice pie, share without total | "The share rose because the denominator shrank" |
| Distribution | Histogram, box plus raw points, violin, ECDF | Mean ± SD bars (the dynamite plot) | "You are using a summary to hide the distribution" (Weissgerber et al., *PLOS Biology*, 2015) |
| Correlation | Scatter of all points, fit line with interval | Dual-axis twin lines | "Scaling is arbitrary; the crossing point was drawn, not found" |
| Causal before/after | DiD with control, or interrupted time series with a counterfactual extrapolation | Two bars | Regression to the mean, seasonality, concurrent events, selection |
| Uncertainty | Quantile fan, interval, or scenario paths | A single point-estimate curve | "You presented a forecast as a fact" |
| Target attainment | Bullet chart (Few), or actual-versus-plan trajectory | Gauge dial, a lone percentage | "Angle encoding, no history, no progress baseline" |

## Table construction discipline

Most of these come from Ehrenberg, *Rudiments of Numeracy* (1977). They complement Part 1's insight rules — that section decides what the table argues, this one keeps it auditable.

- **Semantic direction**: numbers that must be compared go in the **same column**; vertical comparison is far easier than horizontal.
- **Significant figures**: two for comparison, with a separate exact column where totals must reconcile. Same metric, same precision throughout.
- **Alignment**: numbers right- or decimal-aligned in tabular figures; text left-aligned.
- **Totals row at the top**: readers need the anchor first, and bottom totals get cut off. Totals reconcile with detail; rounding residuals get their own note.
- **Change columns need all three parts**: absolute change, relative change, and either the base or the uncertainty. "Up 300%" without the base is directly indictable.
- **Layered footnotes**: definitions, then source and extraction time, then cell-level exceptions (restatements, estimates, one-offs). Anchor with symbols to specific cells; never "see below".

**Breaking "aggregate hides distribution"** — the most lethal table attack, whose extreme form is Simpson's paradox (1951): every subgroup favours A, the pooled data favours B.

1. Every summary figure carries n, a dispersion measure, and key quantiles or extremes.
2. **One forced disaggregation** along the dimension most likely to confound — size, channel, region, period — with each layer's weight shown.
3. **Weight change broken out**: how much of a total's movement came from within-layer change versus shifting layer mix.
4. **Contribution ranking**: top-k contributors and their share, answering "is this one or two large accounts" before it is asked.

**Number discipline**: each metric has a unique ID with exactly one value across the deck; **every exhibit derives from the same source table**; round only at the final step; unit and magnitude live in the column header; maintain a cross-check list of numbers appearing more than once.

## Manipulation red lines

| Red line | Third-party test |
|---|---|
| Truncated axis | Read the origin. Bars or areas with y₀ ≠ 0 fail. Non-zero lines must be labelled with a full-range inset |
| Distorted proportion | Tufte's lie factor = graphic effect ÷ data effect; outside roughly 0.95–1.05 fails |
| Dual axes | Count y-axes. Two is high risk: rescale one side and see whether the crossing point moves — if it moves, the chart carries no information |
| Area or volume encoding | Is the value mapped to radius or side length (data 2× → visual 4×) |
| Cherry-picked window | Extend the window 50% both ways and redraw. Does the conclusion flip? Is the start an extreme |
| Sort or legend order implying meaning | Is the sort key declared? Does sorting by value change the conclusion |
| Colour implying value | Is a neutral variable in red/green? Is ordered data on a categorical palette |
| Smoothing hiding volatility | Are raw points visible? Is the window length declared? Does changing it change the conclusion |
| Undeclared rebasing (index = 100) | Is the base period an extreme? Redraw with two adjacent base periods |
| Silent exclusion | Does the exclusion account close: raw N − exclusions = final N |

**General test**: *which freely settable parameter — axis, window, base period, smoothing, grouping — would flip the conclusion if changed?* Any such parameter left undeclared counts as manipulation.

## Distribution first

Anscombe's quartet (1973) and the Datasaurus (Matejka and Fitzmaurice, 2017) show identical means, variances, and correlations are compatible with radically different shapes. The decisive argument is narrower: **the decision-relevant questions almost always land in the tail** — who is losing money, who is missing SLA, p99 latency, the worst cohort. The mean is the statistic that erases the tail, so leading with it hides the part that changes the decision. Means also presuppose symmetry and mislead on right-skewed quantities.

**Exceptions**, where the aggregate is the object of decision: the quantity's meaning *is* the total (revenue, cost, budget, inventory); census data answering only "what is the total"; very small n (under about five — list every raw value instead); individual data that is private or re-identifiable (quantiles and a histogram, not raw points).

## Constructible rules — Part 2

| # | Mechanism | Do | Third-party test |
|---|---|---|---|
| E1 | Assertion–evidence alignment | Title is a sentence with predicate and direction | Does the title contain a verb and a comparison direction |
| E2 | Denominator defence | Every exhibit and row carries `n=` and a definition | Search for `n=`, compare against data group count; missing count must be 0 |
| E3 | Uncertainty is mandatory | Every point estimate carries a dispersion measure with its type named | Count error bars against point estimates; the caption names the interval type |
| E4 | Exclusion account closes | CONSORT-style flow | Do the arithmetic; residual must be 0 |
| E5 | Sensitivity inset | At least one alternative-specification variant beside the main exhibit | Count insets; must be ≥1 |
| E6 | Single source of truth | All exhibits from one source table; metrics carry unique IDs | Extract every occurrence of a same-named metric; differences must be 0 |
| E7 | Reproducible provenance | Footnote carries source system, query or report ID, timestamp, owner | A third party follows the footnote and retrieves the same number |
| E8 | Encoding compliance | Zero baseline for bars; no value encoded by area, angle, volume, or saturation | Read the origin; check the channel against the Cleveland–McGill ordering |

E2, E3, E4, E6, and E8 are directly automatable or checkable with no domain knowledge.

## The cost, and how to pay it

The cost is real: production time rises several-fold; more elements genuinely reduce instant readability; this is over-annotation for exploratory analysis; and **over-justification reads as nervous** — an exhibit crowded with footnotes can bury the finding. Use the full floor where the decision is irreversible or the material will outlive the meeting. Not for daily updates.

**The resolution is carrier separation, not compromise on one carrier.** Tufte argues in *The Cognitive Style of PowerPoint* for technical reports in place of slides; Doumont states in *Trees, Maps, and Theorems* that slides are not documents.

- **Live frame**: one exhibit, one assertion, plus the **irreducible self-sufficiency set** — assertion title, n, window, one-line definition, zero baseline, uncertainty. These six survive any compression because they are what a reader needs to use the exhibit as evidence.
- **Companion document**: full elements, exclusion accounting, sensitivity insets, disaggregation tables, layered footnotes. **Every live frame carries its companion page number** — the move that converts "I will explain verbally" into a checkable citation.
- **Data pack**: source tables, queries, extraction timestamps, for third-party recomputation.

Honesty density and live readability do not actually conflict. What conflicts is forcing both into one carrier.
