# Better-Skills

A curated toolkit of elite Agent Skills — built by systematically studying the top 10 skill repositories across the industry and extracting what makes them work.

## What Makes This Different

Most skill collections are flat lists. Better-Skills is a **curated toolkit with a methodology**:

1. **STUDY** — Deeply analyze elite skills from the best repositories
2. **EXTRACT** — Identify reusable patterns and techniques
3. **DEVELOP** — Build custom skills combining the best patterns
4. **REVIEW** — Every skill passes a 4-gate review pipeline
5. **DEPLOY** — Register, version, and sync

## Batch 1: Foundation (10 Skills)

| # | Skill | Strategy | Depth | Domain |
|---|-------|----------|-------|--------|
| 1 | `brainstorming` | Reference | — | General |
| 2 | `requirements-engineering` | Build | Deep | General |
| 3 | `prose-craft` | Reference | — | Content |
| 4 | `visual-design` | Build | Deep | Design |
| 5 | `social-card` | Build | Lightweight | Design |
| 6 | `article-illustrate` | Build | Standard | Content |
| 7 | `pptx` | Reference | — | Design |
| 8 | `dev-flow` | Build | Standard | Engineering |
| 9 | `skill-health` | Meta | Standard | Meta |
| 10 | `skill-bootstrap` | Meta | Standard | Meta |

See [skills.json](skills.json) for the authoritative registry.

## Scenario Coverage

| Scenario | Primary Skill | Coverage |
|----------|--------------|----------|
| Software Development | `dev-flow` | 95% |
| Requirements Analysis | `requirements-engineering` | 95% |
| Product Design | `requirements-engineering` | 85% |
| Visual Design | `visual-design` | 100% |
| PPT Design | `pptx` (Reference) | 90% |
| Social Media Cards | `social-card` | 90% |
| Writing (all types) | `prose-craft` (Reference) | 100% |
| Brainstorming | `brainstorming` (Reference) | 100% |
| Article Illustration | `article-illustrate` | 90% |
| Podcast Production | `prose-craft` (script) | 60% → Batch 2 |

## Quick Start

```bash
# Install via npm
npm install better-skills

# Sync external referenced skills
npm run sync

# Validate a skill
npm run validate skills/<skill-name>
```

## Repository Structure

```
better-skills/
├── skills/                # Self-developed skills
├── external/sources.yaml  # Declared external skill sources
├── skills.json            # Canonical registry
├── docs/
│   ├── research/          # Deep analysis of 10+ top repos
│   ├── patterns/          # 50+ extracted reusable patterns
│   └── reviews/           # Skill review records
├── evaluation/            # Quality evaluation harness
└── tools/                 # Validation and sync scripts
```

## Key Documents

- [CLAUDE.md](CLAUDE.md) — Project instructions and methodology
- [skills.json](skills.json) — Authoritative skill registry
- [docs/patterns/](docs/patterns/) — Extracted pattern library (50+ patterns, 8 categories)
- [docs/research/](docs/research/) — Deep analysis of 10+ top skill repositories

## Design Principles

- **Reference over Rebuild** — If a skill is already excellent, curate it, don't reimplement
- **Depth Tiers** — Deep (CE-style), Standard (Anthropic-style), Lightweight (Cursor-style)
- **Batch Iteration** — Batch 1 is 10 skills. Batch 2/3/N expand to new domains.
- **Rigorous Review** — 4-gate pipeline (Self-Review → Peer Review → Pattern Alignment → Baseline Test)

## License

MIT
