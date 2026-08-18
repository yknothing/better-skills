<!-- Parent skill: skills/bs-defensible-deck/SKILL.md -->
<!-- Open this file when: Phase 3 (Build the exhibits) is reached -->

# Exhibit Standards

> **Parent skill**: [../SKILL.md](../SKILL.md) — this is Phase 3 (Build the exhibits)
> **Prerequisites**: Phase 2 complete — the C/E/A/W/R graph exists, so each exhibit has a claim to serve
> **Scope**: charts and tables as evidence. Not visual craft — see `bs-visual-design` for that.
> **Precedence where the two overlap**: both this file and `bs-visual-design` carry rules on palette semantics and chart encoding. In an adversarial context **this file wins**, because its rules exist to close attack surface rather than to look considered — a categorical palette on ordered data is an attackable encoding error here, not a style preference. Outside adversarial contexts, defer to `bs-visual-design`.

## The thesis

Under adversarial review, an exhibit's job is **not to be understood — it is to leave no room for a different conclusion.** Being understood is the entry requirement; an exhibit nobody can read does not even qualify to be ruled out. The objective is eliminating rival hypotheses (Campbell and Stanley; Platt's strong inference).

Four consequences follow, and the first one contradicts a rule most designers hold:

- **Data-ink ratio does not apply to evidence elements.** n, denominators, exclusion notes, and uncertainty are *evidence ink*, not decoration, and cannot be minimised away. Tufte's own analysis of the Challenger O-ring charts in *Visual Explanations* makes the point in the other direction: the fatal flaw was showing only the flights that had problems and omitting those that did not, so the missing denominator prevented the temperature relationship from being established at all.
- **Draw the data that hurts you.** Hidden outliers, hidden control groups, and hidden failed cases are ammunition left for the other side.
- **Show distributions rather than summaries** by default (see below).
- **Windows and definitions require stated reasons**, and the reason is part of the exhibit.

An adversarial reviewer's questions always reduce to three: *is that how the data was produced*, *could there be another explanation*, *does it hold under a different definition or window*. These attack measurement, causality, and robustness. Defend against those three in advance.

## Self-sufficiency elements

Each missing element is an open attack surface.

| Element | Form on the exhibit | Attack if absent |
|---|---|---|
| n and denominator | `n=` on every group; every proportion paired with its absolute value | "That percentage came from three samples" / denominator swap |
| Window plus reason | Full window on the axis; a subtitle stating why it starts and ends there | Cherry-picking; a start point that happens to be the trough |
| Definition | An executable definition of the metric, including what is counted in and out | "Your active users are not the same thing as on the previous page" |
| Baseline or control | Control group, prior-year period, industry benchmark, or random baseline — at least one, on the same exhibit | "No counterfactual, so how do you know it was not going to happen anyway" |
| Uncertainty | Error bars, confidence or credible interval, quantile band, or raw points — **with its type named** (SD, SE, and 95% CI are not interchangeable) | "That difference is inside the noise" |
| Source and extraction time | Source system, table or report identifier, `as of YYYY-MM-DD` | "The definition was restated" / "your number is a week old" |
| Exclusion accounting | A CONSORT-style flow: raw N → each exclusion with its count → final N, and the arithmetic closes | "You dropped the inconvenient samples" |
| Unit and axis origin | Unit on the axis; bars and areas require a zero baseline; a non-zero line chart says so explicitly | Huff's "gee-whiz graph"; exaggerated effect |
| Assertion title | A sentence containing a predicate and a direction (Doumont's message-first) | "The chart and your sentence do not match" |

**Shortcut test**: remove the presenter. Hand the exhibit to someone with no business context. Can they state the conclusion, the sample size, the time range, and the comparison group? Any one missing means it fails.

## Claim type to chart form

Based on the Cleveland and McGill perceptual accuracy ordering (position on a common scale > position on non-aligned scales > length > angle and slope > area > volume and colour saturation) and Wilkinson's grammar of graphics. Mackinlay's expressiveness criterion states the stake plainly: a graphic that expresses facts not present in the data is not ugly, it is false.

| Claim to support | Correct form | Typical misuse | Attack invited |
|---|---|---|---|
| Ranking (A > B) | Sorted dot plot, or zero-based bars on a common scale | Pie, radar, 3D columns | "The ordering is an artefact of angle and area" |
| Time trend | Evenly spaced time axis, line, full window | Per-period bars, broken axis, two points joined | "Window trimmed" / "two points are not a trend" |
| Composition | Percentage stacked bar or treemap, **with the absolute total alongside** | Multi-slice pie, share without total | "The share rose because the denominator shrank" |
| Distribution | Histogram, box plus raw points, violin, ECDF | Mean ± SD bars (the dynamite plot) | "You are using a summary to hide the distribution" (Weissgerber et al., *PLOS Biology*, 2015) |
| Correlation | Scatter of all points, fit line with interval | Dual-axis twin lines | "Scaling is arbitrary; the crossing point was drawn, not found" |
| Causal before/after | Difference-in-differences with control, or interrupted time series with a counterfactual extrapolation | Two bars | Regression to the mean, seasonality, concurrent events, selection |
| Uncertainty | Quantile fan, interval, or multiple scenario paths | A single point-estimate curve | "You presented a forecast as a fact" |
| Target attainment | Bullet chart (Few), or actual-versus-plan trajectory | Gauge dial, a lone percentage | "Angle encoding, no history, no progress baseline" |

## Tables

Routinely neglected, and the primary weapon in adversarial settings: charts give direction, tables give checkable numbers.

### When a table is mandatory

Whenever the reader needs to *take a specific value*. Four forcing conditions: (a) numbers will be quoted, recomputed, or written into a decision document; (b) units or metrics are heterogeneous and cannot share one scale; (c) few categories (under about ten rows) and precision matters more than shape; (d) point estimate, interval, n, and definition must all be carried at once.

The correct form for an adversarial deck is **chart for the judgement, table for the evidence, adjacent or on the same page**.

### Construction rules

Most of these come from Ehrenberg, *Rudiments of Numeracy* (1977).

- **Semantic direction**: put numbers that must be compared in the **same column** — vertical comparison is far easier than horizontal. Entities as rows, metrics as columns is therefore the default.
- **Sorting is an argument**: never sort alphabetically or by ID. Sort descending by the metric under argument, and declare the sort key in the header. A table whose conclusion changes when the sort key changes has exposed its own fragility.
- **Significant figures**: two significant figures for comparison; a separate exact column where totals must reconcile. Same metric, same precision, throughout.
- **Alignment**: numbers right-aligned or decimal-aligned in tabular figures; text left-aligned.
- **Totals row at the top**: readers need the anchor first, and bottom totals get cut off on long tables. Totals must reconcile with the detail; rounding residuals get their own note.
- **Row and column averages** act as visual anchors for spotting deviation.
- **Change columns are required but need all three parts**: absolute change, relative change, and either the base or the uncertainty. "Up 300%" without the base is directly indictable as manipulation.
- **Layered footnotes**: (1) definitions, (2) source and extraction time, (3) cell-level exceptions such as restatements, estimates, or one-off items. Anchor with symbols to specific cells; never "see below".

### Breaking "aggregate hides distribution"

The most lethal table attack, whose extreme form is Simpson's paradox (1951): every subgroup favours A, the pooled data favours B.

1. **Every summary figure carries three companions**: n, a dispersion measure (SD or IQR), and key quantiles or extremes.
2. **One forced disaggregation** along the dimension most likely to confound — size, channel, region, or period — with each layer's weight shown.
3. **Weight change broken out**: when a total moves, state how much came from within-layer change and how much from shifting layer mix.
4. **Contribution ranking**: show the top-k contributors and their share, answering "is this one or two large accounts" before it is asked.

### Number discipline

- Each metric gets a unique metric ID; one ID has exactly one value across the whole deck; **every exhibit derives from the same source table** — no per-page extraction.
- Round only at the final step; never compute on already-rounded numbers.
- Unit and magnitude (thousands, millions, currency) live in the column header, not in cells.
- Maintain a cross-check list of every number appearing more than once, with page references, and reconcile them.

## Manipulation red lines

Practices that professional reviewers treat as evidence tampering, whether or not they are technically permitted.

| Red line | Third-party test |
|---|---|
| Truncated axis | Read the axis origin. Bars or areas with y₀ ≠ 0 fail. Non-zero lines must be labelled and carry a full-range inset |
| Distorted proportion | Compute Tufte's lie factor = graphic effect ÷ data effect; outside roughly 0.95–1.05 fails |
| Dual axes | Count y-axes. Two is high risk: rescale one side and see whether the crossing point moves — if it moves, the chart carries no information |
| Area or volume encoding | Check whether the value maps to radius or side length (data 2× → visual 4×). Compare the mark area ratio against the data ratio |
| Cherry-picked window | Extend the window 50% in both directions and redraw. Does the conclusion flip? Is the start point an extreme of the series? |
| Sort or legend order implying meaning | Is the sort key declared? Does sorting by value change the conclusion? |
| Colour implying value | Is a neutral variable rendered in red/green? Is ordered data using a categorical palette? Compare against Bertin's visual-variable hierarchy and the ColorBrewer palette types |
| Smoothing hiding volatility | Are raw points still visible? Is the window length declared? Does changing the window change the conclusion? |
| Undeclared rebasing (index = 100) | Is the base period an extreme? Redraw with two adjacent base periods |
| Silent exclusion | Does the exclusion account close? raw N − each exclusion = final N |

**General test**: *which freely settable parameter of this exhibit — axis, window, base period, smoothing, grouping — would flip the conclusion if changed?* Any such parameter that is not declared counts as manipulation.

## Distribution first

Anscombe's quartet (1973) and the Datasaurus (Matejka and Fitzmaurice, 2017) both demonstrate that identical means, variances, and correlations are compatible with radically different shapes; a mean-plus-SD bar corresponds to infinitely many real distributions.

The decisive argument is narrower than that, though: **adversarial questions almost always land in the tail** — who is losing money, who is missing SLA, p99 latency, the worst cohort. The mean is precisely the statistic that erases the tail, so leading with it hides the most attackable part. When the reviewer finds it themselves, the loss is whole-deck credibility, not one exhibit. Means also presuppose symmetry and systematically mislead on right-skewed quantities such as revenue, duration, and deal size.

**Exceptions**, where the aggregate is itself the object of decision:

- The quantity's meaning *is* the total — revenue, total cost, budget constraint, inventory.
- Census data answering only "what is the total", so sampling uncertainty does not exist (definition and timestamp are still required).
- Very small n (under about five): skip the distribution and **list every raw value**.
- Individual-level data that is private or re-identifiable: give quantiles and a histogram, not raw points.

## Constructible rules

| # | Mechanism | Do | Third-party test |
|---|---|---|---|
| E1 | Assertion–evidence alignment | Title is a sentence with a predicate and a direction | Does the title contain a verb and a comparison direction? Can the graphic be inferred from the title alone? Count failures |
| E2 | Denominator defence | Every exhibit and row carries `n=` and a definition | Search for `n=`, compare against the number of data groups; missing count must be 0 |
| E3 | Uncertainty is mandatory | Every point estimate carries a dispersion measure with its type named | Count error bars against point estimates; the caption must name the interval type |
| E4 | Exclusion account closes | CONSORT-style flow: raw N, each exclusion, final N | Do the arithmetic; residual must be 0 |
| E5 | Sensitivity inset | Beside the main exhibit, at least one small alternative-specification variant (different window, definition, or outliers included) | Count alternative-specification insets; must be ≥ 1 |
| E6 | Single source of truth | All exhibits derive from one source table; metrics carry unique IDs | Extract every occurrence of a same-named metric; differences must be 0 |
| E7 | Reproducible provenance | Footnote carries source system, query or report ID, extraction timestamp, owner | A third party follows the footnote and independently retrieves the same number |
| E8 | Encoding compliance | Zero baseline for bars; never encode value by area, angle, volume, or saturation | Read the axis origin; check the encoding channel against the Cleveland–McGill ordering; count violations |

E2, E3, E4, E6, and E8 are directly automatable or checkable by someone with no domain knowledge.

## The cost, and how to pay it

The cost is real and worth stating plainly: production time rises several-fold; more elements on the exhibit genuinely reduces instant readability; this is over-armouring for exploratory analysis; and **over-justification reads as defensive** — an exhibit crowded with footnotes can itself suggest the author is nervous. Use this only where real adversarial pressure exists: investment committees, audit, regulators, boards, peer review. Not for daily updates.

**The resolution is carrier separation, not compromise on a single carrier.** Tufte argues in *The Cognitive Style of PowerPoint* for technical reports in place of slides; Doumont states in *Trees, Maps, and Theorems* that slides are not documents. Three layers follow:

- **Live frame**: one exhibit, one assertion, plus the **irreducible self-sufficiency set** — assertion title, n, window, a one-line definition, zero baseline, uncertainty. These six stay on the exhibit under any compression, because they map to the highest-frequency attacks.
- **Companion document** (circulated with the deck): full self-sufficiency elements, exclusion accounting, sensitivity insets, disaggregation tables, layered footnotes. **Every live frame carries the companion page number that backs it** — the move that converts "I will explain verbally" into a checkable citation.
- **Data pack**: source tables, queries, extraction timestamps, for third-party recomputation.

This resolves the real tension. Adversarial information density and live readability do not actually conflict — what conflicts is forcing both into one carrier. The live frame runs the first line of exclusion, the companion document carries full proof, the data pack carries reproducibility. Whichever layer the attack lands on is the layer you answer from.
