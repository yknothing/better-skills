# Better-Skills

A curated toolkit of Agent Skills, built by studying top skill repositories across the industry.

- **Status: Phase 2 shipped.** This repo currently ships 12 self-developed `SKILL.md` files plus 9 declared external references, a 59-pattern machine-readable library under `docs/patterns/`, a zero-dependency CLI (`bin/better-skills.js`) for installing skills, and mechanized repository checks: Gate 1 (`tools/validate.js`), Gate 2 (`tools/peer-review.js`), Gate 3 (`tools/pattern-alignment.js` + `tools/check-patterns.sh`), and Gate 4 evaluation-contract checks (`evaluation/harness/runner.js`). Gate 4 is explicitly `EVAL_SCHEMA_ONLY`; it does not verify behavior or artifacts. See [Roadmap](#roadmap) for what's deferred (agent execution / LLM judge / A/B tests / npm publish). Content claims that lack execution evidence are explicitly marked **TBD**.

## Skill namespace

Better-Skills self-developed skills use the `bs-` prefix, such as `bs-ui-master` and `bs-prospect-customer`. Curated external skills retain their upstream names, such as `brainstorming`, `pptx`, and `grill-me`. Historical self-developed names — both prior `bs-*` IDs and older unprefixed aliases — remain deprecated CLI aliases for one migration release.

## What's actually in here today

- **12 self-developed skills** under `skills/`: `bs-prdefine`, `bs-insight-product`, `bs-prospect-customer`, `bs-ui-master`, `bs-sw-master`, `bs-reflect-loop`, `bs-prose-master`, `bs-visual-article`, `bs-social-card`, `bs-skill-forge`, `bs-skill-auditor`, `bs-ppt-master`
- **9 external references** declared in `external/sources.yaml` (`brainstorming`, `pptx`, `grill-me`, `grilling`, `writing-great-skills`, `learn-skill`, `emil-design-eng`, `review-animations`, `animation-vocabulary`); `bash tools/sync.sh` clones the upstream repos and symlinks them under `external/`
- **Pattern index** at `docs/patterns/README.md` — currently a single-file index of ~60 named patterns; per-pattern files are coming in Phase 1.C
- **Research notes** at `docs/research/` — analysis of 12 top skill repositories, including [`mattpocock-analysis.md`](docs/research/mattpocock-analysis.md), [`learn-skill-analysis.md`](docs/research/learn-skill-analysis.md), and [`emilkowalski-analysis.md`](docs/research/emilkowalski-analysis.md). Other citations are missing today and will be added in Phase 3.
- **Domain insights** at `docs/insights/` — verdicts on domain propositions, produced by a parallel expert-roundtable format (independent viewpoints + a red team + a moderator's cross-adjudication). Unlike `docs/research/`, the subject is a claim about a domain, not a skill repository. Entries: [`ppt-attention-ledger.md`](docs/insights/ppt-attention-ledger.md) (attention as a bid, not a managed resource) and [`ppt-architecture.md`](docs/insights/ppt-architecture.md) (the argument-and-exhibits foundation now incorporated into `bs-ppt-master`).
- **Tooling**: `tools/validate.sh` (Gate 1), `tools/peer-review.js` (Gate 2), `tools/pattern-alignment.js` (Gate 3), `evaluation/harness/runner.js` (Gate 4 deterministic package/prompt checks), and `tools/sync.sh` (external sync). Gate 4 does not yet run an agent, open PPTX artifacts, use an LLM judge, or perform A/B tests.

## Core methodology

`STUDY → EXTRACT → DEVELOP → REVIEW → DEPLOY`. Full description and review-pipeline definitions live in [`CLAUDE.md`](CLAUDE.md).

## Batch 1: Foundation

| # | Skill | Strategy | Tier | Domain |
|---|-------|----------|------|--------|
| 1 | `brainstorming` | Reference | standard | General |
| 2 | `bs-prdefine` | Build | deep | General |
| 3 | `bs-insight-product` | Build | deep | General |
| 4 | `bs-prospect-customer` | Build | deep | General |
| 5 | `bs-prose-master` | Build | standard | Content |
| 6 | `bs-ui-master` | Build | deep | Design |
| 7 | `bs-social-card` | Build | lightweight | Design |
| 8 | `bs-visual-article` | Build | standard | Content |
| 9 | `pptx` | Reference | standard | Design |
| 10 | `bs-sw-master` | Build | standard | Engineering |
| 11 | `bs-reflect-loop` | Build | deep | General |
| 12 | `bs-skill-auditor` | Build | standard | Meta |
| 13 | `bs-skill-forge` | Build | standard | Meta |
| 14 | `bs-ppt-master` | Build | deep | Design |
| 15 | `grill-me` | Reference | standard | General |
| 16 | `grilling` | Reference | standard | General |
| 17 | `writing-great-skills` | Reference | standard | Meta |
| 18 | `learn-skill` | Reference | deep | General |
| 19 | `emil-design-eng` | Reference | deep | Design |
| 20 | `review-animations` | Reference | standard | Design |
| 21 | `animation-vocabulary` | Reference | lightweight | Design |

`Strategy: Build` means the skill is implemented in this repo (`skills/<name>/SKILL.md`). `Strategy: Reference` means we curate the upstream skill via `external/sources.yaml` and pull it on demand. `grill-me` is a user-invoked wrapper that delegates to the model-invoked `grilling`; both come from [mattpocock/skills](https://github.com/mattpocock/skills) and must be synced together. `writing-great-skills` is a reference skill (no steps, all in `GLOSSARY.md`) covering skill-writing vocabulary. `learn-skill` is a CE-style exhaustive sample from [koganei/learn-anything-skill](https://github.com/koganei/learn-anything-skill), kept as a deep-tier reference of the "exhaustive spec" school. Motion craft references (`emil-design-eng`, `review-animations`, `animation-vocabulary`) come from [emilkowalski/skills](https://github.com/emilkowalski/skills) and pair with Build skill `bs-ui-master` — see [`docs/research/emilkowalski-analysis.md`](docs/research/emilkowalski-analysis.md).

See [`skills.json`](skills.json) for the authoritative registry.

## Scenario coverage (deterministic prompt coverage; behavioral results TBD)

Gate 4 currently verifies Skill packaging plus prompt schema and happy/edge/adversarial coverage. It does not execute these scenarios or establish empirical pass rates. Behavioral, qualitative, artifact, and A/B results remain TBD until those paths are wired and run.

| Scenario | Primary Skill |
|----------|--------------|
| Software Development | `bs-sw-master` |
| Reflection, lessons, and durable practice | `bs-reflect-loop` |
| Requirements Analysis | `bs-prdefine` |
| Product discovery, positioning, frontier bets, and wedge decisions | `bs-insight-product` |
| First-customer discovery | `bs-prospect-customer` |
| Visual Design | `bs-ui-master` |
| UI motion craft | `emil-design-eng` (Reference) |
| Animation diff review | `review-animations` (Reference, user-invoked) |
| Motion effect naming | `animation-vocabulary` (Reference) |
| Social Media Cards | `bs-social-card` |
| Writing (general) | `bs-prose-master` |
| Brainstorming | `brainstorming` (Reference) |
| Article Illustration | `bs-visual-article` |
| PPT creation, revision, template filling, enhancement, detail, and delivery orchestration | `bs-ppt-master` |
| PPTX execution capability | `pptx` (Reference; executor candidate used through `bs-ppt-master`) |
| Plan Stress-Test (interview) | `grill-me` / `grilling` (Reference) |
| Skill Writing Vocabulary | `writing-great-skills` (Reference) |
| Structured Learning Path | `learn-skill` (Reference) |

## Quick start

The CLI is shipped as the npm package [`@yknothing/better-skills`](https://www.npmjs.com/package/@yknothing/better-skills). You can run it directly with `npx` — no global install needed.

> **Requires**: Node.js 18+, `git` (for cloning external skills), network access on first external-skill install.

```bash
# List all skills in the registry (12 self-developed + 9 external references)
npx @yknothing/better-skills list

# Install a skill into your Claude Code skills directory
npx @yknothing/better-skills add bs-prospect-customer
npx @yknothing/better-skills add bs-ui-master                  # → ~/.claude/skills/bs-ui-master
npx @yknothing/better-skills add bs-ppt-master                 # full-lifecycle PPT orchestration
npx @yknothing/better-skills add emil-design-eng                # motion craft (Reference)
npx @yknothing/better-skills add grill-me --target cursor      # → ~/.cursor/skills/grill-me
npx @yknothing/better-skills add learn-skill                   # CE-style deep learning skill

# Manage installed skills
npx @yknothing/better-skills list --installed                  # show what's installed
npx @yknothing/better-skills update grill-me                   # re-pull latest from source
npx @yknothing/better-skills remove bs-ui-master

# Targets: --target claude | codex | cursor | /abs/path
```

### Alternative: clone-and-symlink (offline / development)

If you want to hack on the skills themselves, clone the repo and run the CLI locally — it behaves identically.

```bash
git clone https://github.com/yknothing/better-skills
cd better-skills

# Validate any skill against Gate 1
bash tools/validate.sh skills/bs-ui-master/

# Run the CLI from source
node bin/better-skills.js list
node bin/better-skills.js add bs-ui-master

# Or pull all external references at once (brainstorming, pptx, grill-me, grilling, writing-great-skills, learn-skill, emil-design-eng, review-animations, animation-vocabulary)
bash tools/sync.sh
```

### For maintainers: publishing

```bash
# Bump version in package.json, then:
npm publish --access public

# prepublishOnly hook auto-runs: list smoke test + the full CLI regression suite
```

## Repository structure

```
better-skills/
├── skills/                # Self-developed skills (12 today)
├── external/sources.yaml  # Declared external skill sources
├── skills.json            # Canonical registry
├── docs/
│   ├── research/          # Analysis of 12 top skill repos (citations TBD)
│   ├── insights/          # Domain-proposition verdicts (expert-roundtable format)
│   ├── patterns/          # Pattern index (per-pattern files in Phase 1.C)
│   └── reviews/           # Skill review and acceptance records
├── evaluation/            # Deterministic Gate 4 harness + prompt datasets
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
| **1.D — `npx better-skills` CLI MVP** | ✅ complete | `add`, `list`, `remove`, `update`, `validate` subcommands; zero deps; copy semantics + manifest; `tools/test-cli.sh` covers adversarial and multi-generation migration cases |
| **2.A — `validate.sh` rewrite** | ✅ complete | Real Gate 1 as `tools/validate.js` (16 checks: frontmatter schema, name/dir match, pattern-reference integrity, gate-syntax conformance, bundled-resource existence); `validate.sh` is now a backward-compat wrapper |
| **2.B — Evaluation harness wiring** | ✅ complete | Gate 4 runner (`evaluation/harness/runner.js`) — deterministic graders (Gate 1 pass-rate, test-prompt structure, happy/edge/adversarial coverage); LLM-judge / A/B deferred to Round 3 |
| **2.C — Pattern alignment + peer review automation** | ✅ complete | Gate 2 (`tools/peer-review.js`: generates advocate/adversary prompts, validates review files against an 8-point schema) + Gate 3 (`tools/pattern-alignment.js`: registry↔body alignment, drift as warn, `--strict` to fail); `check-patterns.sh` retains ghost/orphan detection |
| **3 — Research citations + first npm publish** | CLI ready; publish pending | Package `@yknothing/better-skills` is publish-ready (`prepublishOnly` hook runs `tools/test-cli.sh`); `npx` verified via local `npm pack`. First actual publish awaits npm credentials. URL citations across `docs/research/` still TBD. |

## Design principles

- **Reference over rebuild** — If a skill is already excellent upstream, curate and sync; don't reimplement.
- **Depth tiers** — `deep` (high-stakes, exhaustive precision), `standard` (principles + hard gates), `lightweight` (do one thing well).
- **Batch iteration** — Batch 1 now contains 21 skills. Batch 2 / 3 remain frozen until every Batch 1 skill passes all 4 review gates.
- **Evidence over claims** — Quality numbers in this README must be backed by the evaluation pipeline. Anything not yet measured is marked TBD.

## License

MIT — see [LICENSE](LICENSE).
