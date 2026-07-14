<!-- Parent skill: skills/bs-dev-flow/SKILL.md -->
<!-- Open this file when: Phase 1 declared the characterization-first posture (modifying legacy code without existing tests) -->

# Characterization Tests for Legacy Code

> **Parent skill**: [../SKILL.md](../SKILL.md) — this is Phase 3b, the alternate path to Phase 3 (RED)
> **Prerequisites**:
> - Phase 1 (UNDERSTAND) declared posture = `characterization-first`
> - Acceptance criteria + file manifest exist
> - Phase 2 (SETUP) is complete (safety snapshot taken, branch/worktree ready)
>
> **Depends on**: existing test framework conventions in the repo (Jest / pytest / Go test / etc.)

## Overview

When you must modify legacy code that has no existing tests, you cannot write a failing test first — there is no baseline to fail against. **Characterization tests pin current behavior** as a regression guard before you change anything. They describe reality, not desired outcomes. Once current behavior is locked, you switch back to test-first for the actual change.

This is the reverse polarity of standard TDD:

- **Test-first** (Phase 3): write a test that **fails**, then make it pass.
- **Characterization-first** (this file): write a test that **passes** (capturing current behavior), then change behavior intentionally — the test now fails for the *right* reason, and you update it.

---

## Workflow

### Step 1 — Identify key behaviors

Read the code you are about to modify. List every observable behavior:

- **Return values**: what does each public function/method return for representative inputs (including edge cases)?
- **Side effects**: writes to disk, network calls, database mutations, calls to other services, log output.
- **Exceptions / errors**: what conditions raise, with what message or code?
- **State mutations**: object fields, module-level state, singletons, caches.
- **API calls made**: outbound HTTP/RPC/queue calls — what URL, what payload, in what order?

If a behavior is non-deterministic (timestamps, random IDs, async ordering), note it — characterization tests for non-deterministic outputs require either approval/snapshot tools with serializers or seeded randomness in the production code.

### Step 2 — Write characterization tests

Choose the lightest tool that captures the behavior:

- **Approval / snapshot tests** (Jest `toMatchSnapshot`, pytest `syrupy`, etc.) — capture full output into a snapshot file. Best for large/structured returns.
- **Golden-master tests** — explicit `assertEquals` per observable behavior. Best when you want each behavior named and individually replaceable.
- **Hand-rolled assertions** — when neither pattern is supported natively, manually capture and assert each observable behavior. Slower to write but explicit.

Match the project's existing test conventions (file naming, describe/it blocks, assertion style) — Phase 3 rules apply here too.

### Step 3 — Run; confirm tests PASS

This is the critical inversion vs. standard TDD: **characterization tests must PASS before you change code**. A failing characterization test means one of:

- The test does not correctly capture current behavior — fix the test.
- The code already has a bug you weren't aware of — **stop**, surface it to the user, decide whether to fix it as part of this task or split into a separate one. See [error-recovery.md](./error-recovery.md) for the abort path.

### Step 4 — Commit the characterization tests

```bash
git add <test-files>
git commit -m "test: add characterization tests for <component>"
```

A standalone commit. This makes the safety net visible in history before any behavior change.

### Step 5 — Switch back to test-first

With current behavior pinned, return to [Phase 3 (RED)](../SKILL.md) of the main pipeline. Write a failing test for the *desired* behavior change, then proceed normally through GREEN and REFACTOR.

---

## Handling failures of characterization tests after your change

When your intended behavior change causes a characterization test to fail, this is **expected** — you are changing behavior. The characterization test captured the *old* behavior; your change introduces *new* behavior. Follow this protocol:

1. **Verify the failure is intentional.** The failing characterization test should correspond to the behavior you intended to change. If a characterization test for an *unrelated* behavior fails, you introduced a regression — fix it before proceeding.

2. **Update the characterization test.** Replace the old expected value with the new expected value. The characterization test now pins the *corrected* behavior.

3. **Annotate the change.** Above the updated assertion, add a comment in the project's idiom:

   ```js
   // UPDATED 2026-06-17: changed from <old behavior> to <new behavior> because <reason>.
   ```

4. **Re-run.** The updated characterization test must now pass *along with* every other test.

This protocol prevents two failure modes:
- **Bug enshrinement** — keeping broken behavior because a test was checking it.
- **Silent regression** — accidentally changing unrelated behavior under the cover of an intentional change.

---

## Anti-patterns

- **Testing internals.** Characterization tests should pin observable behavior. Don't assert internal field names that are about to be refactored — those tests fail for non-behavior reasons during REFACTOR and you'll be tempted to delete them.
- **Over-broad snapshots.** A single `toMatchSnapshot()` of an entire app state hides which assertion failed. Prefer named, scoped snapshots per behavior.
- **Skipping Step 4.** If you batch the characterization tests into the same commit as the behavior change, you lose the safety-net checkpoint and the diff becomes unreviewable — reviewers can no longer separate "this test pins old behavior" from "this test asserts the new behavior."

---

## Related

- [SKILL.md Phase 1 — Posture declaration](../SKILL.md) — where characterization-first is chosen
- [SKILL.md Phase 3 — RED (test-first)](../SKILL.md) — the standard path you return to after this
- [error-recovery.md](./error-recovery.md) — what to do if characterization reveals the code is too broken to safely modify
