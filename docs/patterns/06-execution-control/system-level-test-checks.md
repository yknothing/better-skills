---
name: system-level-test-checks
chinese_name: 系统级测试检查
category: execution-control
sources:
  - CE
description: Apply five cross-layer test quality questions (trigger chain, real chain, isolated state, other interfaces, error strategy consistency) beyond pass/fail — catching gaps that unit test coverage misses.
also_named_as: []
status: proposed
---

# 系统级测试检查 · System-Level Test Checks

> **Category**: 06. 执行控制模式
> **Sources**: CE
> **Status**: proposed

## What this pattern is

Beyond pass/fail, apply five system-level questions to every test suite:

1. **Trigger chain**: does the test exercise the full path from entry point, or call the function directly?
2. **Real chain**: are dependencies real instances or mocks? If mocked, are mock behaviors verified against the real contract?
3. **Isolated state**: does the test share state with other tests? Could ordering affect results?
4. **Other interfaces**: does the code under test have side effects on uncovered interfaces (logs, metrics, audit trails)?
5. **Error strategy consistency**: do tested error cases match the error cases the code actually handles?

## Why it works

Pass/fail is a coarse signal. A suite can have 100% pass rate and still miss critical failure modes — tests that don't exercise real trigger chains, mock away critical dependencies, or ignore side-effect interfaces. The five questions force examination of test *quality*, not just test *results*.

## When to use it

- Code review or pre-merge verification workflows.
- Skills that generate or modify tests (the check validates the generated tests).
- Legacy code characterization — the five questions reveal whether characterization tests actually pin behavior.

Skip for quick sanity checks where pass/fail is sufficient.

## Used by

No active references yet — extracted from CE.

## Related patterns

- [`self-review-checklist`](../03-quality-assurance/self-review-checklist.md) — system-level test checks are a specialized review checklist for test quality
- [`execution-posture-signals`](../06-execution-control/execution-posture-signals.md) — test quality checks are a natural signal point in the pipeline
