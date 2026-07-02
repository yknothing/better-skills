---
name: progressive-disclosure
chinese_name: 渐进式披露
category: context-management
sources:
  - Anthropic
  - CE
description: Three-tier loading: metadata → SKILL.md body → referenced files loaded on-demand by phase trigger, keeping context windows lean until depth is needed.
also_named_as: []
status: active
---

# 渐进式披露 · Progressive Disclosure

> **Category**: 04. 上下文管理模式
> **Sources**: Anthropic, CE
> **Status**: active

## What this pattern is

A skill's content is organized into three tiers of increasing depth. **Tier 1**: frontmatter metadata (name, description) — always loaded, used for skill matching. **Tier 2**: the SKILL.md body — loaded when the skill activates, contains the pipeline overview, hard rules, and phase summaries. **Tier 3**: `references/` files — loaded on-demand only when a specific phase trigger fires. The agent is explicitly instructed: "Load `references/` files only when their phase trigger fires. Never load ahead."

This keeps the context window lean during early phases and only expands it when the agent reaches a phase that requires detailed instructions.

## Why it works

Context windows are a shared, finite resource. Loading all reference material eagerly would consume tokens that could be used for the user's actual task. By deferring deep material to the moment it is needed, progressive disclosure maximizes the tokens available for the task itself while still providing full depth when the agent reaches the relevant phase.

## When to use it

- Any skill with a multi-phase pipeline where each phase has substantial reference material.
- Skills where the SKILL.md body alone would exceed ~100 lines without progressive disclosure.
- Skills used in contexts where token budget is tight (long conversations, multi-skill pipelines).

Skip it for single-shot skills under 60 lines where the overhead of `references/` file management exceeds the token savings.

## Used by

- `visual-design` — 7-phase pipeline, each phase in its own `references/` file. SKILL.md explicitly states: "Progressive disclosure is mandatory. Load `references/` files only when their phase trigger fires. Never load ahead."
- `dev-flow` — 8-phase pipeline with each phase in `references/`. Phase 3b (Characterization) demonstrates conditional loading based on execution posture.
- `requirements-engineering` — 8-stage pipeline, stages 1–6 each in `references/`. Stage 7 checklist is inline (blocking, must always be visible).
- `prose-craft` — 5-step editing workflow with inline instructions. The skill is compact enough that `references/` overhead exceeds savings, but the pattern is declared for consistency.
- `skill-health` — 6-phase pipeline with each phase in `references/`. Phase 3 verification rules are inline (frequently referenced).
- `skill-bootstrap` — 5-step pipeline with inline instructions (skill is short enough that `references/` overhead exceeds savings).
- `social-card` — Workflow steps are inline; only the layout library is in `references/layouts.md`.
- `article-illustrate` — 5-stage pipeline with each stage in `references/`. SKILL.md states: "Progressive disclosure is mandatory. Load `references/` files only when their stage trigger fires."

## Examples

From `skills/visual-design/SKILL.md`:

```markdown
## Pipeline

PHASE 1: DISCOVER      → Design brief
PHASE 2: CONCEPT       → Design concept with visual direction
PHASE 3: EXPLORE       → At least 3 distinct directions
PHASE 4: DESIGN        → Polished final design
PHASE 5: REVIEW        → Multi-perspective review panel
PHASE 6: ITERATE       → Interaction states + polish
PHASE 7: DELIVER       → Production-ready output

Each phase is documented in `references/`. Phase N must complete before
Phase N+1 begins.

- **PHASE 1 — DISCOVER**: [`references/phase-1-discover.md`](references/phase-1-discover.md)
- **PHASE 2 — CONCEPT**: [`references/phase-2-concept.md`](references/phase-2-concept.md)
...
```

The Hard Rules reinforce: "Progressive disclosure is mandatory. Load `references/` files only when their phase trigger fires. Never load ahead."

From `skills/dev-flow/SKILL.md`, demonstrating conditional progressive disclosure:

```markdown
## Phase 3b: RED (Characterization) — legacy code without tests

When Phase 1 declared the `characterization-first` posture, follow
[references/characterization-tests.md](./references/characterization-tests.md)
instead of this phase.
```

## Related patterns

- [`load-stub`](../04-context-management/load-stub.md) — load stubs are the joinery that makes progressive disclosure actually work; every `references/` link needs a stub
- [`context-as-commons`](../04-context-management/context-as-commons.md) — progressive disclosure is the primary mechanism for honoring the commons
- [`evidence-dossier`](../04-context-management/evidence-dossier.md) — evidence dossiers apply the same "defer until needed" principle to runtime-collected data
