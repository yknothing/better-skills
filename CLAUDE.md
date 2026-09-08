# Better-Skills

A curated toolkit of Agent Skills built by systematically studying top skill repositories across the industry.

## Core Workflow

This repo's central logic: **STUDY → EXTRACT → DEVELOP → REVIEW → DEPLOY**

1. **STUDY**: Pick a top skill from the researched sources (docs/research/). Deconstruct its anatomy — what patterns does it use? What makes it work?
2. **EXTRACT**: Identify reusable patterns. Document them in docs/patterns/ with source attribution.
3. **DEVELOP**: Build a custom skill in skills/<name>/SKILL.md using extracted patterns. Follow the TDD-for-skills methodology defined by bs-skill-forge.
4. **REVIEW**: Run the review pipeline. No skill enters without passing all 4 gates.
5. **DEPLOY**: Register in skills.json. Tag a version. Sync external references.

## Skill Strategy: Reference vs Build

- **REFERENCE** (declared in `external/sources.yaml`, fetched via `bash tools/sync.sh`): The skill is already excellent, widely used, actively maintained upstream. We curate and sync, not reimplement.
- **BUILD** (lives in `skills/<name>/SKILL.md`): Domain-specific customization needed, or we're combining patterns from multiple sources into something new that doesn't exist yet.

Reference skills are not permanent. The intent is to upgrade Reference → Build when a skill accumulates enough project-specific friction to justify owning it. Concrete upgrade triggers:

1. ≥20 concrete improvement points accumulated from usage *(tracking schema TBD — no skill has data yet)*
2. ≥5 applicable extracted patterns in docs/patterns/ that the upstream version doesn't honor *(per-pattern files now exist; the improvement-point tracking schema remains TBD)*
3. A/B comparison against ≥2 independent implementations passes *(behavioral execution and A/B comparison remain deferred)*

These triggers are documented as design intent, not as data we currently collect. They are not yet enforceable because improvement-point tracking and behavioral A/B evaluation are still deferred.

## Depth Tiers

| Tier | When to Use | Example Candidates |
|------|-------------|-------------------|
| **Deep** | High frequency + high failure cost | bs-prdefine, bs-ui-master |
| **Standard** | Normal frequency + moderate cost | bs-sw-master, bs-prose-master, bs-visual-article, bs-skill-auditor, bs-skill-forge |
| **Lightweight** | High frequency + low failure cost | bs-social-card |

Tier is authoritative in `skills.json` and mirrored as a `# tier:` frontmatter comment; a structured YAML tier field remains deferred.

## Review Pipeline (4 Gates)

Every self-developed skill must pass the full 4-gate pipeline:

1. **Self-Review**: Run `bash tools/validate.sh <skill-path>`. The current validator runs 16 checks covering frontmatter shape, name/description, body size, safety, pattern references, gates, and bundled resources.
2. **Peer Review**: Launch 2 sub-agents — one advocates for the skill, one tries to break it. Both return structured findings into `docs/reviews/<skill>/<date>-{advocate,adversary}-review.md`.
3. **Pattern Alignment**: Does the skill correctly use patterns declared in `skills.json`? Does each declared pattern resolve to a documented entry under `docs/patterns/`? Run `node tools/pattern-alignment.js --strict` and `bash tools/check-patterns.sh`.
4. **Baseline Test**: Run the deterministic contract checks with `node evaluation/harness/runner.js`. The current result is `EVAL_SCHEMA_ONLY`; it does not execute an agent or establish behavioral superiority over a no-skill baseline.

Record all reviews in `docs/reviews/<skill-name>/YYYY-MM-DD-<role>-review.md`. The current review records are AI-generated initial drafts dated 2026-06-17; later iterations should add `HUMAN_VERIFIED` markers and re-run dates.

External references use a separate registry contract: `tools/test-cli.sh` verifies source, path, identity, and batch membership. Their upstream behavior is not locally claimed as verified by this repository's Gate 4 harness.

## Key Directories

| Directory | Purpose |
|-----------|---------|
| `skills/` | Self-developed skills (13 today) |
| `external/sources.yaml` | Declared external skill sources |
| `skills.json` | Canonical registry (the single source of truth) |
| `docs/research/` | Analysis of 10 top skill repos. External URL citations are TBD until Phase 3 |
| `docs/insights/` | Domain-proposition verdicts. Expert-roundtable format: parallel independent viewpoints + a red team + moderator adjudication. Subject is a claim about a domain, not a repo |
| `docs/patterns/` | Machine-readable pattern library (59 patterns, each with a per-pattern file and `README.md` index) |
| `docs/reviews/` | Skill review records |
| `evaluation/` | Test datasets + deterministic schema-only evaluation-contract harness |
| `tools/` | `validate.sh` (Gate 1) and `sync.sh` (external sync) |

## Quality Process

Default workflow before shipping any skill:

1. **Run Gate 1**: `bash tools/validate.sh skills/<name>/` — must pass with 0 failures
2. **Run at least 3 test prompts in fresh contexts**: from `evaluation/datasets/batch-1-test-prompts.json`, document actual outputs, artifacts, evidence scope, and reviewer verdict; the schema-only runner is not a substitute
3. **Get reviewer sign-off**: at minimum 1 human + 1 adversary sub-agent

**Default grading is deterministic.** Structural checks, keyword presence, numeric assertions — cheap, reproducible, suitable for CI.

**LLM-as-judge is deferred.** It is intended only for qualitative dimensions (voice, clarity, "soul" tests, anything where deterministic rules cannot substitute). The documented `--with-llm-judge` flag currently returns a deferred error; it does not execute a judge. The future prompt template lives in `evaluation/rubrics/judge-prompt-template.md`.

**A/B baseline tests are deferred.** They remain required before any skill claims to outperform a baseline. The documented `--ab-test` flag currently returns a deferred error and produces no comparison evidence.

This stratification lets the cheap default cover 90% of CI runs while preserving real qualitative grading for the cases that need it.

## Batches

Skills are organized in batches for incremental delivery. **Batch 2/3 are intentionally frozen until every Batch 1 skill passes all 4 review gates** — this prevents quality debt from compounding across 30+ skills.

| Batch | Theme | Status |
|-------|-------|--------|
| Batch 1 | Foundation — Core capabilities + meta-skills | active (22 skills) |
| Batch 2 | Deepen & Expand — Audio, product design, debugging | frozen until Batch 1 closes Gate 4 |
| Batch 3 | Creative Suite — Video, data viz, brand, landing pages | frozen until Batch 2 starts |

See `skills.json` for the authoritative batch and skill registry.

## Honesty notes

This file documents intent. Where intent exceeds current implementation, sections are explicitly marked TBD or list the phase that delivers the capability. The roadmap in [`README.md`](README.md) tracks delivery against this design.
