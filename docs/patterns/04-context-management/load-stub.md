---
name: load-stub
chinese_name: Load Stub
category: context-management
sources:
  - CE
description: When content moves to a referenced file, leave a precise loading instruction (not just a link) so the agent knows when to fetch it.
also_named_as: []
status: proposed
---

# Load Stub · Load Stub

> **Category**: 04. 上下文管理模式
> **Sources**: CE
> **Status**: proposed

## What this pattern is

When a section of a SKILL.md is moved out to a `references/` file, replace it not with a bare markdown link but with a **load stub**: a short block that names the trigger condition, the path, and what the agent will get. This converts "the agent might click this link" into an explicit gate: *load X when condition Y holds*. The format used in this repo:

```markdown
> **Required reading**: [`references/X.md`](./references/X.md) — open when <condition>.
```

## Why it works

Bare links are ambiguous to an LLM — required, supplementary, or historical? A stub disambiguates *when* to load (so it doesn't load eagerly) and *why* (so it doesn't skip when the condition fires), preserving the token-economy benefit of progressive disclosure.

## When to use it

- Any SKILL.md that references `references/`, `scripts/`, or `assets/` files.
- Especially when content is required under specific conditions (e.g. characterization-tests when posture = characterization-first).

## Used by

No active references yet — extracted from CE. The pattern is implicit in every skill that uses `references/` (e.g. `bs-sw-master` Phase 3b references `characterization-tests.md` with an explicit trigger condition), but no skill cites it in `skills.json` yet.

## Related patterns

- [`progressive-disclosure`](../04-context-management/progressive-disclosure.md) — load stubs are the joinery that makes progressive disclosure work
- [`context-as-commons`](../04-context-management/context-as-commons.md) — stubs honor the commons by keeping content out of context until needed
