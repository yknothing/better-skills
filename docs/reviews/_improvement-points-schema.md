# Improvement-Points Ledger — schema v1

CLAUDE.md's upgrade trigger 1 ("≥20 concrete improvement points accumulated from usage") previously had no tracking schema. This defines it. One ledger per skill at `docs/reviews/<skill>/improvement-points.md`. This is the intake format a future refiner skill (or a human maintenance pass) consumes; it exists to make usage lessons **cumulative and auditable** instead of vanishing into chat history.

## Entry format

One table row per point:

| Field | Meaning |
|---|---|
| `id` | `IP-<n>`, stable, never reused |
| `date` | When observed |
| `source` | Where the evidence lives: a usage-review file, forward-test record, adversary finding id, or issue link. **No entry without a recorded source** — an improvement point is an observation, not an opinion |
| `model/agent` | What produced the observed behavior (e.g. `haiku-4.5 + skill`, `fable-5 forward-test`), because failure modes are model-dependent |
| `class` | One of: `fabrication` (invented content), `omission` (skipped required work), `compliance-theater` (format without substance), `stale-claim` (skill text wrong/outdated), `over-process` (skill cost exceeds value), `gap` (situation the skill doesn't cover), `regression` (previously-working behavior lost) |
| `severity` | HIGH / MED / LOW — impact on the skill's core promise |
| `proposal` | The concrete skill change it suggests (one line) |
| `status` | `open` / `fixed:<revision>` / `declined:<reason>` |

## Counting rules

- Points count toward the ≥20 upgrade trigger only with `source` recorded; `declined` entries still count (a considered decision is accumulated knowledge).
- Multiple findings from one incident may be separate points if they suggest **different skill changes**; otherwise merge.
- When a point is fixed, keep the row (history is the asset) and update `status`.

## Review-loop integration

- External usage reviews (`YYYY-MM-DD-*-usage-review.md`) end by depositing their findings here.
- Adversary reviews may deposit non-gating findings here instead of blocking.
- A refinement pass (future `bs-skill-refiner` candidate) reads: `open` points grouped by `class` → proposes one coherent revision → runs the standard 4-gate pipeline → marks rows `fixed:<revision>`.
