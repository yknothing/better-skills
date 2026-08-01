# Better-Skills

A curated toolkit of Agent Skills, built by studying top skill repositories across the industry.

- **Status: Phase 2 shipped.** This repo currently ships 9 self-developed `SKILL.md` files plus 9 declared external references, a 59-pattern machine-readable library under `docs/patterns/`, a zero-dependency CLI (`bin/better-skills.js`) for installing skills, and a 4-gate review pipeline that is mechanized end-to-end: Gate 1 (`tools/validate.js`), Gate 2 (`tools/peer-review.js`), Gate 3 (`tools/pattern-alignment.js` + `tools/check-patterns.sh`), Gate 4 (`evaluation/harness/runner.js`). See [Roadmap](#roadmap) for what's deferred (LLM-judge / A/B tests / npm publish). Content claims that haven't been verified by the evaluation pipeline yet are explicitly marked **TBD**.

## Skill namespace

Better-Skills self-developed skills use the `bs-` prefix, such as `bs-visual-design` and `bs-first-customer-finder`. Curated external skills retain their upstream names, such as `brainstorming`, `pptx`, and `grill-me`. Legacy unprefixed names for self-developed skills remain deprecated CLI aliases for one migration release.

## What's actually in here today

- **9 self-developed skills** under `skills/` (~2,800 lines total): `bs-requirements-engineering`, `bs-first-customer-finder`, `bs-visual-design`, `bs-dev-flow`, `bs-prose-craft`, `bs-article-illustrate`, `bs-social-card`, `bs-skill-bootstrap`, `bs-skill-health`
- **9 external references** declared in `external/sources.yaml` (`brainstorming`, `pptx`, `grill-me`, `grilling`, `writing-great-skills`, `learn-skill`, `emil-design-eng`, `review-animations`, `animation-vocabulary`); `bash tools/sync.sh` clones the upstream repos and symlinks them under `external/`
- **Pattern index** at `docs/patterns/README.md` — currently a single-file index of ~60 named patterns; per-pattern files are coming in Phase 1.C
- **Research notes** at `docs/research/` — analysis of 12 top skill repositories, including [`mattpocock-analysis.md`](docs/research/mattpocock-analysis.md), [`learn-skill-analysis.md`](docs/research/learn-skill-analysis.md), and [`emilkowalski-analysis.md`](docs/research/emilkowalski-analysis.md). Other citations are missing today and will be added in Phase 3.
- **Domain insights** at `docs/insights/` — verdicts on domain propositions, produced by a parallel expert-roundtable format (independent viewpoints + a red team + a moderator's cross-adjudication). Unlike `docs/research/`, the subject is a claim about a domain, not a skill repository. First entry: [`ppt-attention-ledger.md`](docs/insights/ppt-attention-ledger.md).
- **Tooling**: `tools/validate.sh` (Gate 1) and `tools/sync.sh` (external sync). `evaluation/harness/runner.js` exists but is not wired up yet — see Roadmap.

## Core methodology

`STUDY → EXTRACT → DEVELOP → REVIEW → DEPLOY`. Full description and review-pipeline definitions live in [`CLAUDE.md`](CLAUDE.md).

## Batch 1: Foundation

| # | Skill | Strategy | Tier | Domain |
|---|-------|----------|------|--------|
| 1 | `brainstorming` | Reference | standard | General |
| 2 | `bs-requirements-engineering` | Build | deep | General |
| 3 | `bs-first-customer-finder` | Build | deep | General |
| 4 | `bs-prose-craft` | Build | standard | Content |
| 5 | `bs-visual-design` | Build | deep | Design |
| 6 | `bs-social-card` | Build | lightweight | Design |
| 7 | `bs-article-illustrate` | Build | standard | Content |
| 8 | `pptx` | Reference | standard | Design |
| 9 | `bs-dev-flow` | Build | standard | Engineering |
| 10 | `bs-skill-health` | Build | standard | Meta |
| 11 | `bs-skill-bootstrap` | Build | standard | Meta |
| 12 | `grill-me` | Reference | standard | General |
| 13 | `grilling` | Reference | standard | General |
| 14 | `writing-great-skills` | Reference | standard | Meta |
| 15 | `learn-skill` | Reference | deep | General |
| 16 | `emil-design-eng` | Reference | deep | Design |
| 17 | `review-animations` | Reference | standard | Design |
| 18 | `animation-vocabulary` | Reference | lightweight | Design |

`Strategy: Build` means the skill is implemented in this repo (`skills/<name>/SKILL.md`). `Strategy: Reference` means we curate the upstream skill via `external/sources.yaml` and pull it on demand. `grill-me` is a user-invoked wrapper that delegates to the model-invoked `grilling`; both come from [mattpocock/skills](https://github.com/mattpocock/skills) and must be synced together. `writing-great-skills` is a reference skill (no steps, all in `GLOSSARY.md`) covering skill-writing vocabulary. `learn-skill` is a CE-style exhaustive sample from [koganei/learn-anything-skill](https://github.com/koganei/learn-anything-skill), kept as a deep-tier reference of the "exhaustive spec" school. Motion craft references (`emil-design-eng`, `review-animations`, `animation-vocabulary`) come from [emilkowalski/skills](https://github.com/emilkowalski/skills) and pair with Build skill `bs-visual-design` — see [`docs/research/emilkowalski-analysis.md`](docs/research/emilkowalski-analysis.md).

See [`skills.json`](skills.json) for the authoritative registry.

## Scenario coverage (TBD — pending baseline tests)

A coverage matrix with empirical pass-rates against `evaluation/datasets/batch-1-test-prompts.json` will land once Gate 4 (Baseline Test) is wired up in Phase 2.B. Earlier drafts of this README claimed specific coverage percentages without an evaluation pipeline behind them; those numbers have been removed.

| Scenario | Primary Skill |
|----------|--------------|
| Software Development | `bs-dev-flow` |
| Requirements Analysis | `bs-requirements-engineering` |
| First-customer discovery | `bs-first-customer-finder` |
| Visual Design | `bs-visual-design` |
| UI motion craft | `emil-design-eng` (Reference) |
| Animation diff review | `review-animations` (Reference, user-invoked) |
| Motion effect naming | `animation-vocabulary` (Reference) |
| Social Media Cards | `bs-social-card` |
| Writing (general) | `bs-prose-craft` |
| Brainstorming | `brainstorming` (Reference) |
| Article Illustration | `bs-article-illustrate` |
| PPT Design | `pptx` (Reference) |
| Plan Stress-Test (interview) | `grill-me` / `grilling` (Reference) |
| Skill Writing Vocabulary | `writing-great-skills` (Reference) |
| Structured Learning Path | `learn-skill` (Reference) |

## Quick start

The CLI is shipped as the npm package [`@yknothing/better-skills`](https://www.npmjs.com/package/@yknothing/better-skills). You can run it directly with `npx` — no global install needed.

> **Requires**: Node.js 18+, `git` (for cloning external skills), network access on first external-skill install.

```bash
# List all skills in the registry (9 self-developed + 9 external references)
npx @yknothing/better-skills list

# Install a skill into your Claude Code skills directory
npx @yknothing/better-skills add bs-first-customer-finder
npx @yknothing/better-skills add bs-visual-design                  # → ~/.claude/skills/bs-visual-design
npx @yknothing/better-skills add emil-design-eng                # motion craft (Reference)
npx @yknothing/better-skills add grill-me --target cursor      # → ~/.cursor/skills/grill-me
npx @yknothing/better-skills add learn-skill                   # CE-style deep learning skill

# Manage installed skills
npx @yknothing/better-skills list --installed                  # show what's installed
npx @yknothing/better-skills update grill-me                   # re-pull latest from source
npx @yknothing/better-skills remove bs-visual-design

# Targets: --target claude | codex | cursor | /abs/path
```

### Alternative: clone-and-symlink (offline / development)

If you want to hack on the skills themselves, clone the repo and run the CLI locally — it behaves identically.

```bash
git clone https://github.com/yknothing/better-skills
cd better-skills

# Validate any skill against Gate 1
bash tools/validate.sh skills/bs-visual-design/

# Run the CLI from source
node bin/better-skills.js list
node bin/better-skills.js add bs-visual-design

# Or pull all external references at once (brainstorming, pptx, grill-me, grilling, writing-great-skills, learn-skill, emil-design-eng, review-animations, animation-vocabulary)
bash tools/sync.sh
```

### For maintainers: publishing

```bash
# Bump version in package.json, then:
npm publish --access public

# prepublishOnly hook auto-runs: list smoke test + tools/test-cli.sh (45 assertions)
```

## Repository structure

```
better-skills/
├── skills/                # Self-developed skills (9 today)
├── external/sources.yaml  # Declared external skill sources
├── skills.json            # Canonical registry
├── docs/
│   ├── research/          # Analysis of 12 top skill repos (citations TBD)
│   ├── insights/          # Domain-proposition verdicts (expert-roundtable format)
│   ├── patterns/          # Pattern index (per-pattern files in Phase 1.C)
│   └── reviews/           # Skill review records (Gates 1–3 today; Gate 4 TBD)
├── evaluation/            # Evaluation harness + datasets (runner not yet wired)
├── tools/                 # validate.sh (Gate 1) + sync.sh (external sync)
└── LICENSE                # MIT
```

## Roadmap

This repo is honest about its phase. Progress against the published plan:

| Phase | Status | What it delivers |
|-------|--------|------------------|
| **0 — Integrity fixes** | ✅ complete | LICENSE; `validate.sh` `set -e` bug fixed; Potemkin dirs removed; unverified claims stripped; LLM-judge contradiction resolved |
| **1.A — Bundled resources for 8 skills** | ✅ complete | Each skill grew a `references/`, `scripts/`, or `assets/` directory; main SKILL.md trimmed; tier + Test prompts unified |
| **1.B — Unified gate / frontmatter conventions** | ✅ complete (in 1.A) | Single `<HARD-GATE>` syntax; consistent tier declaration; ≥3 test prompts per skill |
| **1.C — Patterns library upgrade** | ✅ complete | 59 pattern files (22 active / 37 proposed) under `docs/patterns/`; `tools/check-patterns.sh` enforces 8 schema rules + ghost / orphan detection |
| **1.D — `npx better-skills` CLI MVP** | ✅ complete | `add`, `list`, `remove`, `update`, `validate` subcommands; zero deps; copy semantics + manifest; `tools/test-cli.sh` runs 45 assertions including adversarial cases |
| **2.A — `validate.sh` rewrite** | ✅ complete | Real Gate 1 as `tools/validate.js` (16 checks: frontmatter schema, name/dir match, pattern-reference integrity, gate-syntax conformance, bundled-resource existence); `validate.sh` is now a backward-compat wrapper |
| **2.B — Evaluation harness wiring** | ✅ complete | Gate 4 runner (`evaluation/harness/runner.js`) — deterministic graders (Gate 1 pass-rate, test-prompt structure, happy/edge/adversarial coverage); LLM-judge / A/B deferred to Round 3 |
| **2.C — Pattern alignment + peer review automation** | ✅ complete | Gate 2 (`tools/peer-review.js`: generates advocate/adversary prompts, validates review files against an 8-point schema) + Gate 3 (`tools/pattern-alignment.js`: registry↔body alignment, drift as warn, `--strict` to fail); `check-patterns.sh` retains ghost/orphan detection |
| **3 — Research citations + first npm publish** | CLI ready; publish pending | Package `@yknothing/better-skills` is publish-ready (`prepublishOnly` hook runs `tools/test-cli.sh`); `npx` verified via local `npm pack`. First actual publish awaits npm credentials. URL citations across `docs/research/` still TBD. |

## Design principles

- **Reference over rebuild** — If a skill is already excellent upstream, curate and sync; don't reimplement.
- **Depth tiers** — `deep` (high-stakes, exhaustive precision), `standard` (principles + hard gates), `lightweight` (do one thing well).
- **Batch iteration** — Batch 1 now contains 18 skills. Batch 2 / 3 remain frozen until every Batch 1 skill passes all 4 review gates.
- **Evidence over claims** — Quality numbers in this README must be backed by the evaluation pipeline. Anything not yet measured is marked TBD.

## License

MIT — see [LICENSE](LICENSE).
