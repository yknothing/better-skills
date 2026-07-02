# Better-Skills

A curated toolkit of elite Agent Skills, built by studying the best skill repositories across the industry.

## Core Workflow

This repo's central logic: **STUDY → EXTRACT → DEVELOP → REVIEW → DEPLOY**

1. **STUDY**: Pick a top skill from the researched sources (docs/research/). Deconstruct its anatomy — what patterns does it use? What makes it work?
2. **EXTRACT**: Identify reusable patterns. Document them in docs/patterns/ with source attribution.
3. **DEVELOP**: Build a custom skill in skills/<name>/SKILL.md using extracted patterns. Follow the TDD-for-skills methodology.
4. **REVIEW**: Run the review pipeline. No skill enters without passing all 4 gates.
5. **DEPLOY**: Register in skills.json. Tag a version. Sync external references.

## Skill Strategy: Reference vs Build

- **REFERENCE** (external/sources.yaml): The skill is already excellent, widely used, actively maintained upstream. We curate and sync, not reimplement.
- **BUILD** (skills/): Domain-specific customization needed, or we're combining patterns from multiple sources into something new that doesn't exist yet.

Reference skills are not permanent. Upgrade to Build when:
1. ≥20 concrete improvement points accumulated from usage
2. ≥5 applicable extracted patterns in docs/patterns/
3. A/B comparison against ≥2 independent implementations passes

## Depth Tiers

| Tier | When to Use | Example Candidates |
|------|-------------|-------------------|
| **Deep** | High frequency + high failure cost | requirements-engineering, visual-design |
| **Standard** | Normal frequency + moderate cost | dev-flow, article-illustrate, skill-health, skill-bootstrap |
| **Lightweight** | High frequency + low failure cost | social-card |

## Review Pipeline (4 Gates)

Every skill — self-developed or newly referenced — must pass:

1. **Self-Review**: Run `bash tools/validate.sh <skill-path>`. Checks frontmatter, required sections, safety.
2. **Peer Review**: Launch 2 sub-agents — one advocates for the skill, one tries to break it. Both return structured findings.
3. **Pattern Alignment**: Does the skill correctly use patterns from docs/patterns/? Are source attributions accurate?
4. **Baseline Test**: Run the skill on a real task. Does it outperform the no-skill baseline? Document the results.

Record all reviews in docs/reviews/<skill-name>/YYYY-MM-DD-review.md.

## Key Directories

| Directory | Purpose |
|-----------|---------|
| `skills/` | Self-developed skills |
| `external/sources.yaml` | Declared external skill sources |
| `skills.json` | Canonical registry (the single source of truth) |
| `docs/research/` | Completed analysis of 10+ top skill repos |
| `docs/patterns/` | Extracted reusable patterns (50+) |
| `docs/reviews/` | Skill review records |
| `evaluation/` | Quality evaluation harness and datasets |
| `tools/` | Validation and sync scripts |

## Quality Process (Keep It Simple)

Before shipping any skill:
1. Run it against 3 test prompts
2. Document the results in the PR
3. Get reviewer sign-off

No LLM-as-judge. No A/B testing. No dashboards. Those are Phase 4 concerns. Phase 1 needs a process so simple it cannot be skipped.

## Batches

Skills are organized in batches for incremental delivery:

| Batch | Theme | Status |
|-------|-------|--------|
| Batch 1 | Foundation — Core capabilities + meta-skills | current |
| Batch 2 | Deepen & Expand — Audio, product design, debugging | planned |
| Batch 3 | Creative Suite — Video, data viz, brand, landing pages | planned |

See skills.json for the authoritative batch and skill registry.
