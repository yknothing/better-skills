---
name: platform-degradation-rules
chinese_name: 平台降级规则
category: skill-creation
sources:
  - CE
description: Define explicit fallback behavior for each platform capability the skill depends on, so the skill degrades gracefully rather than failing silently when a feature is unavailable.
also_named_as: []
status: active
---

# 平台降级规则 · Platform Degradation Rules

> **Category**: 08. 技能创建模式
> **Sources**: CE
> **Status**: active

## What this pattern is

A skill declares which platform capabilities it depends on (sub-agent spawning, blocking user prompts, worktree isolation, parallel tool calls, file watching) and, for each, an explicit fallback strategy. The degradation table maps "missing capability → what to do instead." This ensures the skill works across platforms with different feature sets — it never silently fails or produces degraded output because a capability was assumed to be available.

## Why it works

Skills written for a specific platform (e.g., Claude Code with sub-agents and worktree isolation) break when run on platforms that lack those features. Without degradation rules, the agent either errors out or silently produces lower-quality output. A degradation table makes the fallback explicit: the agent knows exactly what to do when a feature is unavailable, and the user knows exactly what quality tradeoff is being made.

## When to use it

- Any skill that uses platform-specific features (sub-agents, parallel execution, blocking prompts, worktree isolation, file monitors).
- Skills intended to be portable across multiple agent platforms.
- When the skill's quality depends on features that are not universally available.

Skip it for skills that use only universally available capabilities (file I/O, shell commands, basic tool calls).

## Used by

- `skill-bootstrap` — includes a `## Platform Degradation Rules` section with a 5-row table mapping missing capabilities (sub-agent spawning, blocking user prompts, worktree isolation, parallel tool calls, file watching) to explicit fallbacks (sequential execution, inline STOP markers, timestamped subdirectories, serialized calls with notes, 5-second polling).

## Examples

From `skills/skill-bootstrap/SKILL.md`:

```markdown
## Platform Degradation Rules

If the agent platform lacks any of these capabilities, apply the stated fallback:

| Missing Capability | Fallback |
|-------------------|----------|
| Sub-agent spawning | Run steps sequentially in the main agent context |
| Blocking user prompts (AskUserQuestion) | Use inline questions with explicit
  "STOP and answer" markers |
| Worktree isolation | Create a timestamped subdirectory under `.claude/tmp/` |
| Parallel tool calls | Serialize calls and add a `## Parallel Execution Note`
  explaining what should run concurrently |
| File watching / monitors | Poll on a 5-second interval with a maximum of
  20 iterations |
```

Each row is a concrete capability and a concrete fallback — no "try to find an alternative" vagueness.

## Related patterns

- [`headless-mode`](../05-task-routing/headless-mode.md) — both handle "feature unavailable" scenarios; headless-mode is the non-interactive specialization, platform-degradation is the general mechanism
- [`hard-rules-first`](../01-behavior-constraint/hard-rules-first.md) — degradation rules often live near Hard Rules because they are non-negotiable constraints on execution
- [`minimal-precision`](../08-skill-creation/minimal-precision.md) — a skill that uses minimal-precision may have fewer platform dependencies and thus a shorter degradation table
- [`beta-skill-pattern`](../08-skill-creation/beta-skill-pattern.md) — beta skills may experiment with platform features that need their own degradation rules
