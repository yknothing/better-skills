# Better-Skills

A curated toolkit of Agent Skills built by systematically studying top skill repositories across the industry.

## Core Workflow

This repo's central logic: **STUDY → EXTRACT → DEVELOP → REVIEW → DEPLOY**

1. **STUDY**: Pick a top skill from the researched sources (docs/research/). Deconstruct its anatomy — what patterns does it use? What makes it work?
2. **EXTRACT**: Identify reusable patterns. Document them in docs/patterns/ with source attribution.
3. **DEVELOP**: Build a custom skill in skills/<name>/SKILL.md using extracted patterns. Follow the TDD-for-skills methodology defined by skill-bootstrap.
4. **REVIEW**: Run the review pipeline. No skill enters without passing all 4 gates.
5. **DEPLOY**: Register in skills.json. Tag a version. Sync external references.

## Skill Strategy: Reference vs Build

- **REFERENCE** (declared in `external/sources.yaml`, fetched via `bash tools/sync.sh`): The skill is already excellent, widely used, actively maintained upstream. We curate and sync, not reimplement.
- **BUILD** (lives in `skills/<name>/SKILL.md`): Domain-specific customization needed, or we're combining patterns from multiple sources into something new that doesn't exist yet.

Reference skills are not permanent. The intent is to upgrade Reference → Build when a skill accumulates enough project-specific friction to justify owning it. Concrete upgrade triggers:

1. ≥20 concrete improvement points accumulated from usage *(tracking schema TBD — no skill has data yet)*
2. ≥5 applicable extracted patterns in docs/patterns/ that the upstream version doesn't honor *(per-pattern files arrive in Phase 1.C; until then this is best-effort)*
3. A/B comparison against ≥2 independent implementations passes *(blocked on Gate 4 wiring in Phase 2.B)*

These triggers are documented as design intent, not as data we currently collect. They become enforceable once Phase 1.D + 2.B ship.

## Depth Tiers

| Tier | When to Use | Example Candidates |
|------|-------------|-------------------|
| **Deep** | High frequency + high failure cost | requirements-engineering, visual-design |
| **Standard** | Normal frequency + moderate cost | dev-flow, prose-craft, article-illustrate, skill-health, skill-bootstrap |
| **Lightweight** | High frequency + low failure cost | social-card |

Tier is currently declared only in `skills.json`; SKILL.md frontmatter does not yet carry a `tier` field. Phase 1.B normalizes this by adding a structured tier field to each skill's frontmatter.

## Review Pipeline (4 Gates)

Every skill — self-developed or newly referenced — must pass:

1. **Self-Review**: Run `bash tools/validate.sh <skill-path>`. Checks frontmatter shape, name/description, body size, basic safety scans. Phase 2.A extends this to pattern-reference integrity, gate-syntax conformance, and bundled-resource existence.
2. **Peer Review**: Launch 2 sub-agents — one advocates for the skill, one tries to break it. Both return structured findings into `docs/reviews/<skill>/<date>-{advocate,adversary}-review.md`.
3. **Pattern Alignment**: Does the skill correctly use patterns declared in `skills.json`? Does each declared pattern resolve to a documented entry under `docs/patterns/`? Phase 2.C automates this with a 100-line script once Phase 1.C lands.
4. **Baseline Test**: Run the skill on a real task from `evaluation/datasets/batch-1-test-prompts.json`. Does it outperform the no-skill baseline? Phase 2.B wires up `evaluation/harness/runner.js` to make this executable.

Record all reviews in `docs/reviews/<skill-name>/YYYY-MM-DD-<role>-review.md`. The current review records are AI-generated initial drafts dated 2026-06-17; later iterations should add `HUMAN_VERIFIED` markers and re-run dates.

## Key Directories

| Directory | Purpose |
|-----------|---------|
| `skills/` | Self-developed skills (8 today) |
| `external/sources.yaml` | Declared external skill sources |
| `skills.json` | Canonical registry (the single source of truth) |
| `docs/research/` | Analysis of 10 top skill repos. External URL citations are TBD until Phase 3 |
| `docs/patterns/` | Pattern index (~60 patterns, currently consolidated in `README.md`; per-pattern files in Phase 1.C) |
| `docs/reviews/` | Skill review records |
| `evaluation/` | Test datasets + evaluation harness (harness not wired until Phase 2.B) |
| `tools/` | `validate.sh` (Gate 1) and `sync.sh` (external sync) |

## Quality Process

Default workflow before shipping any skill:

1. **Run Gate 1**: `bash tools/validate.sh skills/<name>/` — must pass with 0 failures
2. **Run 3 test prompts**: from `evaluation/datasets/batch-1-test-prompts.json`, document outputs in the PR
3. **Get reviewer sign-off**: at minimum 1 human + 1 adversary sub-agent

**Default grading is deterministic.** Structural checks, keyword presence, numeric assertions — cheap, reproducible, suitable for CI.

**LLM-as-judge is opt-in for qualitative dimensions only** (voice, clarity, "soul" tests, anything where deterministic rules can't substitute). Triggered via the `--with-llm-judge` flag once Phase 2.B ships. Judge prompt template lives in `evaluation/rubrics/judge-prompt-template.md`.

**A/B baseline tests are opt-in for high-stakes skills.** Required for any skill claiming "outperforms baseline" in the README's Scenario Coverage matrix. Triggered via `--ab-test` once Phase 2.B ships.

This stratification lets the cheap default cover 90% of CI runs while preserving real qualitative grading for the cases that need it.

## Batches

Skills are organized in batches for incremental delivery. **Batch 2/3 are intentionally frozen until every Batch 1 skill passes all 4 review gates** — this prevents quality debt from compounding across 30+ skills.

| Batch | Theme | Status |
|-------|-------|--------|
| Batch 1 | Foundation — Core capabilities + meta-skills | active (14 skills) |
| Batch 2 | Deepen & Expand — Audio, product design, debugging | frozen until Batch 1 closes Gate 4 |
| Batch 3 | Creative Suite — Video, data viz, brand, landing pages | frozen until Batch 2 starts |

See `skills.json` for the authoritative batch and skill registry.

## Honesty notes

This file documents intent. Where intent exceeds current implementation, sections are explicitly marked TBD or list the phase that delivers the capability. The roadmap in [`README.md`](README.md) tracks delivery against this design.
