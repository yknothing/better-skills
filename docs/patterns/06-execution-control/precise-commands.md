---
name: precise-commands
chinese_name: 精确命令替代模糊指令
category: execution-control
sources:
  - Cursor
description: Replace vague instructions ("stage the changes") with exact bash commands ("git add src/auth.ts tests/auth.test.ts"), eliminating the agent's opportunity to misinterpret or over-generalize.
also_named_as: []
status: active
---

# 精确命令替代模糊指令 · Precise Commands

> **Category**: 06. 执行控制模式
> **Sources**: Cursor
> **Status**: active

## What this pattern is

Every instruction that maps to a system command is written as the exact command string, not as a natural-language description of what to do. "Stage the changed files" becomes `git add src/auth.ts tests/auth.test.ts`. "Run the tests" becomes `npx jest --no-coverage`. "Commit with a meaningful message" becomes `git commit -m "feat: add rate limiting to auth middleware"`.

The pattern applies to git commands, test runners, linters, build tools — any tool invocation where ambiguity in the instruction could lead to the agent choosing the wrong flags, the wrong scope, or the wrong command entirely.

## Why it works

Natural-language instructions are lossy compression: "stage the changes" could mean `git add .`, `git add -A`, `git add -u`, or `git add <specific files>`. The agent must interpret, and under pressure, it will interpret loosely. An exact command removes the interpretation step — the agent executes the string, not its understanding of the string.

## When to use it

- Git operations where scope ambiguity is dangerous (`git add .` vs. `git add <file>`).
- Test runner invocations where flags change behavior (`--no-coverage` vs. default).
- Any command where the wrong flag or argument could cause damage or misleading results.
- Skills used by less-experienced agents that need explicit command modeling.

Skip it for commands where the exact invocation varies by project and the agent must discover the right syntax.

## Used by

- `bs-sw-master` — Exact commands throughout: `git add <specific-file-1> <specific-file-2>`, `git commit -m "<type>: <imperative summary>"`, `npx jest path/to/test.test.ts --no-coverage`, `npx tsc --noEmit`.
- `bs-social-card` — Exact Playwright MCP commands for screenshot: `mcp__playwright__browser_navigate({ url: "file:///tmp/bs-social-card.html" })`, `mcp__playwright__browser_resize({ width: 1200, height: 630 })`.

## Examples

From `skills/bs-sw-master/SKILL.md`:

```markdown
**Automated checks (non-negotiable):**

```bash
npm run lint        # or: eslint ., ruff check ., golangci-lint run
npx tsc --noEmit    # or: mypy ., etc. (if typed)
```

Fix any lint or type errors. Do not commit code that fails automated checks.
```

From `skills/bs-social-card/SKILL.md`:

```
1. mcp__playwright__browser_navigate({ url: "file:///tmp/bs-social-card.html" })
2. mcp__playwright__browser_resize({ width: 1200, height: 630 })
3. mcp__playwright__browser_wait_for({ time: 1 })
4. mcp__playwright__browser_take_screenshot({ type: "png", fullPage: true, filename: "<path>" })
```

The pattern is visible in the numbered, exact tool-call syntax — no "take a screenshot" without the precise function name and parameters.

## Related patterns

- [`minimal-precision`](../08-skill-creation/minimal-precision.md) — same pursuit of precision and brevity; minimal-precision is the skill-level pattern, precise-commands is the instruction-level pattern
- [`freedom-spectrum`](../06-execution-control/freedom-spectrum.md) — precise commands are the low-freedom end of the spectrum
- [`hard-rules-first`](../01-behavior-constraint/hard-rules-first.md) — precise commands often appear inside hard rules blocks as the enforceable version of a constraint
