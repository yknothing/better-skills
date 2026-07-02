# Adversarial Review: dev-flow Skill
# Gate 2: Peer Review — Adversary Findings
# Date: 2026-06-17
# Reviewer: Adversary Agent
# Verdict: NEEDS_IMPROVEMENT (10 issues found, 3 CRITICAL, 5 HIGH, 2 MEDIUM)

---

## Executive Summary

The dev-flow skill is a well-structured TDD-oriented development pipeline with clear phase gating and reasonable error recovery. However, it has several exploitable gaps that emerge when applied to real-world scenarios beyond the happy path. Three issues are CRITICAL — they could cause data loss or silently corrupt test baselines. Five are HIGH — they would cause workflow failures or user confusion under common conditions. Two are MEDIUM — they degrade the skill's effectiveness but are not blockers.

---

## CRITICAL Issues

### 1. Safety Snapshot Tag Collision and Pre-Push Hook Rejection

**Section/Line:** Phase 2, lines 90-100 (Safety Snapshot)

**Exploit:**
The safety snapshot mechanism uses `git tag "pre-dev-flow-$(date +%s)"`. This has three failure modes:

a) **Pre-push hook rejection.** Many organizations configure pre-push hooks (via husky, lefthook, or custom git hooks) that run linting, testing, or signing. A tag push is a push operation. If the user's pre-push hook blocks tag pushes, the entire safety snapshot step fails silently or with a confusing error. The skill assumes tag creation is free — but in enterprise repos, it is not.

b) **Tag namespace collision.** If two agents are running concurrently (e.g., the user starts a dev-flow in one terminal and another in a different project), two snapshots created in the same second will collide. `date +%s` has second-level granularity, and `git tag` on an existing tag fails with `fatal: tag 'pre-dev-flow-1700000000' already exists`. This is a race condition, not theoretical.

c) **Detached HEAD.** In a detached HEAD state, `git tag` works but the tag floats — it is not on any branch. If the user later does garbage collection (`git gc`), the tagged commit may be collected. The skill never checks for detached HEAD before tagging.

**Severity:** CRITICAL — Safety snapshot is the recovery mechanism for the entire pipeline. If it fails, there is no recovery path.

**Suggested Fix:**
```markdown
**Safety snapshot (always — before any mutation):**

Before making any changes:

1. **Check for detached HEAD:**
   ```bash
   git symbolic-ref -q HEAD || {
     echo "ERROR: Detached HEAD. Cannot create safety snapshot."
     echo "Checkout a branch first: git checkout -b <branch-name>"
     exit 1
   }
   ```

2. **Create snapshot with collision resistance:**
   ```bash
   SNAPSHOT_TAG="pre-dev-flow-$(date +%s)-$(git rev-parse --short HEAD)"
   if ! git tag "$SNAPSHOT_TAG" 2>/dev/null; then
     # Collision — append random suffix
     SNAPSHOT_TAG="${SNAPSHOT_TAG}-$(echo $RANDOM)"
     git tag "$SNAPSHOT_TAG"
   fi
   ```

3. **Verify tag was created:**
   ```bash
   git tag -l "$SNAPSHOT_TAG" || {
     echo "ERROR: Safety snapshot creation failed."
     echo "This may be due to pre-push hooks blocking tag creation."
     echo "Fallback: record the commit hash manually."
     echo "git rev-parse HEAD > .claude/dev-flow-snapshot.txt"
   }
   ```

4. **If pre-push hooks block tags**, fall back to recording the commit hash:
   ```bash
   git rev-parse HEAD > .claude/worktrees/.dev-flow-snapshot-ref
   ```
```

---

### 2. Characterization Test Bug Enshrinement

**Section/Line:** Phase 3b, lines 177-199 (Characterization tests)

**Exploit:**
Phase 3b states: "characterization tests must PASS before you make changes. A failing characterization test means either the test does not correctly capture current behavior (fix the test), or the code already has a bug you were not aware of (stop and discuss with the user)."

This creates a paradox. Consider this scenario:

1. Legacy function `calculateTax(amount)` returns `amount * 0.08`. The business rule is 8%.
2. The spec says: "Change tax rate to 10%."
3. The agent writes a characterization test: `expect(calculateTax(100)).toBe(8)`.
4. The test passes. Good — current behavior is pinned.
5. BUT: Unbeknownst to anyone, `calculateTax` has a hidden bug: it returns `amount * 0.08` but ALSO mutates a global state variable `lastCalculationDate` to `null` instead of the current date.
6. The characterization test captures `lastCalculationDate === null` as "current behavior."
7. The agent changes the tax rate to 10% and accidentally fixes the date bug too (because they refactored the internal implementation).
8. The characterization test now FAILS because `lastCalculationDate` is no longer `null`.
9. The skill says: "If a characterization test fails after your change, you know exactly which behavior you accidentally altered."
10. The agent now has a dilemma: either (a) revert the date fix to make the test pass (enshrining the bug), or (b) update the characterization test (losing the "pinned behavior" guarantee).

The skill provides no guidance on how to distinguish "intentional behavior change" from "accidental behavior change" in characterization tests. The "stop and discuss with the user" instruction only applies BEFORE changes, not AFTER.

**Severity:** CRITICAL — This can lead to bugs being permanently enshrined as expected behavior, defeating the purpose of characterization tests.

**Suggested Fix:**
Add to Phase 3b or create a new Phase 5b (REFACTOR for characterization):

```markdown
### Handling Characterization Test Failures After Changes

When a characterization test fails after your change, classify the failure:

| Failure Type | Indicators | Action |
|-------------|------------|--------|
| **Intentional change** | The test asserts behavior the spec says to change. Example: tax rate changed from 8% to 10%. | Update the characterization test to reflect the new expected behavior. Add a comment: `// Changed per SPEC-123: tax rate 8% → 10%` |
| **Side-effect fix** | The test asserts a side effect that was not part of the spec but was corrected as a side effect of refactoring. Example: `lastCalculationDate` was `null`, now correctly set. | Update the characterization test AND add a NEW regression test for the fix. Document both changes in the commit message. |
| **Accidental regression** | The test asserts behavior unrelated to the spec that you did not intend to change. | This is a real regression. Revert the change that caused it and re-run tests. |

**Rule:** Never revert an intentional improvement to make a characterization test pass. Characterization tests describe reality, not correctness. When reality improves, the tests must improve with it.
```

---

### 3. Orphaned Worktree Leakage on Crash/Interruption

**Section/Line:** Phase 2, lines 104-124 (Worktree setup); Abort Procedure, lines 380-388

**Exploit:**
The skill mandates: "No silent worktree abandonment. If you create a worktree, exit it cleanly or tell the user it persists and where."

However, this rule is unenforceable under these scenarios:

a) **Agent crash.** If the agent process crashes mid-task (OOM, timeout, network disconnect), the worktree directory under `.claude/worktrees/` persists with no record of who created it or why. The `git worktree list` will show it, but nothing in the skill's workflow detects orphaned worktrees.

b) **User interruption.** If the user presses Ctrl+C or the conversation ends, the Abort Procedure may or may not run. The abort procedure at lines 380-388 is a manual checklist — there's no automated trigger.

c) **Accumulation.** Over weeks of usage, `.claude/worktrees/` can accumulate dozens of orphaned worktrees. Each one holds a git checkout (disk space) and a branch reference (clutters `git branch -a`). The skill never checks for this on startup.

**Severity:** CRITICAL — Silent resource leakage that degrades the user's repo over time, with no detection or recovery mechanism.

**Suggested Fix:**
Add a startup check at the beginning of Phase 2:

```markdown
### Orphaned Worktree Detection (run before creating new worktrees)

Before creating a new worktree, check for abandoned ones:

```bash
# List all dev-flow worktrees
git worktree list | grep ".claude/worktrees/"

# Check if any worktree's branch has been merged
for wt in .claude/worktrees/*/; do
  branch=$(git -C "$wt" rev-parse --abbrev-ref HEAD 2>/dev/null)
  if [ -n "$branch" ]; then
    # Check if branch exists on remote (was pushed)
    if git branch -r | grep -q "origin/$branch"; then
      echo "Worktree $wt (branch: $branch) appears pushed. Safe to remove."
    else
      echo "Worktree $wt (branch: $branch) has NOT been pushed. Do not remove."
    fi
  fi
done
```

If orphaned worktrees are found:
1. List them for the user.
2. For worktrees whose branches were pushed: offer to clean up.
3. For worktrees whose branches were NOT pushed: warn the user. These may contain uncommitted work.
4. Never delete a worktree without explicit user confirmation.

### Worktree Registry (optional enhancement)

Create `.claude/worktrees/.registry` to track active worktrees:

```bash
echo "$(date -Iseconds) | $(whoami) | $(git rev-parse --abbrev-ref HEAD) | $(pwd)" >> .claude/worktrees/.registry
```

On startup, check the registry for stale entries (worktree directories that no longer exist) and clean them up.
```

---

## HIGH Issues

### 4. TDD Absolutism Blocks Legitimate Non-Test-First Workflows

**Section/Line:** Phase 3 (RED), lines 136-153; Visual/Manual-Only Fast Path, lines 33-41

**Exploit:**
The skill mandates "Tests first, always" with a carve-out for the Visual/Manual-Only Fast Path. But there are legitimate development activities that fall into a gray zone:

a) **Exploratory coding / spike solutions.** When the developer doesn't know the API shape yet, writing a test first is impossible — the test would be guessing at an API that doesn't exist. The skill has no "spike" mode where you prototype first, then throw away the prototype and TDD the real implementation.

b) **CSS/layout changes.** The Visual/Manual-Only Fast Path says "For changes that cannot be meaningfully auto-tested (config, docs, CSS tweaks, copy changes)." But what about a major CSS refactor (e.g., migrating from Tailwind v3 to v4)? That's not a "CSS tweak" — it's a significant change that could benefit from visual regression testing, but the skill provides no guidance.

c) **Documentation generation.** If a change is purely documentation, the skill says use the fast path. But what about adding JSDoc/typedoc comments alongside code changes? The fast path says "If the change touches any logic or data path, the full TDD pipeline applies" — but adding a doc comment doesn't touch logic. Does each doc comment need its own commit? The fast path guidance is ambiguous here.

d) **Configuration-as-code.** Infrastructure-as-code changes (Terraform, Pulumi, Kubernetes manifests) are "config" but they ARE logic — they define system behavior. The skill's classification is too coarse.

**Severity:** HIGH — Agents will either (a) skip TDD for things that need it, or (b) waste time trying to TDD things that can't be TDD'd, or (c) get stuck in analysis paralysis deciding which path to take.

**Suggested Fix:**
Replace the binary "TDD or Fast Path" decision with a decision matrix:

```markdown
### Test Strategy Decision Matrix

| Change Type | Strategy | Rationale |
|------------|----------|-----------|
| New feature with known API | Full TDD (RED → GREEN → REFACTOR) | You can write a meaningful failing test |
| Bug fix with reproducible steps | RED (repro test) → GREEN → REFACTOR | Write a test that reproduces the bug |
| Legacy code modification | Characterization → RED → GREEN → REFACTOR | Pin behavior first, then change |
| Exploratory spike / unknown API | **Spike mode**: Prototype without tests, then throw away and TDD the real implementation | The spike informs the design; the TDD ensures correctness |
| Pure docs (README, comments) | Fast Path: MAKE-CHANGE → SELF-REVIEW → COMMIT | No logic affected |
| CSS/layout change (minor) | Fast Path: MAKE-CHANGE → SELF-REVIEW → COMMIT | Visual verification |
| CSS/layout change (major refactor) | Fast Path + visual regression snapshot | Capture before/after screenshots |
| Config-as-code (Terraform, K8s) | TDD with plan/output assertions | Config IS logic; test it |
| Package upgrade (patch version) | Fast Path + full test suite run | Verify nothing broke |
| Package upgrade (major version) | Full TDD for API changes | Breaking changes need tests |
```

### Spike Mode Procedure

When the API or design is unknown:

1. **Declare spike mode explicitly.** "Entering spike mode — I will prototype without tests to understand the API."
2. **Prototype.** Explore the API, try approaches, learn the shape.
3. **Document findings.** What worked, what didn't, what the API shape is.
4. **Discard the prototype.** `git checkout -- .` or `git stash`.
5. **Switch to TDD.** Now that you know the API, write a failing test and implement properly.
```

---

### 5. Slice Definition Ambiguity Enables Scope Creep or Micro-Management

**Section/Line:** Phase 1, line 65 (acceptance criteria); HARD RULES line 22 ("One slice at a time"); Error Recovery, line 365 ("Slice scope creeps (more than ~50 lines)")

**Exploit:**
The skill says "One slice at a time. Implement the smallest meaningful unit." But "smallest meaningful unit" is never defined. The only concrete boundary is the error recovery table's "more than ~50 lines" — which is a code output metric, not a semantic unit.

Consider these interpretations, all of which an agent could justify:

- **Micro-slice:** "Add the import statement for lodash" → 1 line. Run RED-GREEN-REFACTOR-REVIEW-COMMIT. 10 lines of ceremony for 1 line of code.
- **Mega-slice:** "Implement the entire authentication module" → 500 lines across 15 files. One "slice" that breaks the 50-line guideline.
- **Ambiguous middle:** "Add input validation" — is this one slice (all validation) or N slices (email validation, phone validation, etc.)?

The error recovery table says "more than ~50 lines" is a scope creep trigger, but:
- 50 lines of boilerplate config is not scope creep.
- 20 lines of dense algorithmic code could be multiple slices.
- The 50-line threshold is mentioned only in error recovery, not in the main workflow, making it easy to miss.

**Severity:** HIGH — Without clear slice boundaries, the agent will either (a) create dozens of trivial commits (noise), or (b) create a single giant commit (defeating the purpose of slicing).

**Suggested Fix:**
Define slices in terms of acceptance criteria:

```markdown
### Slice Definition Rules

A slice is exactly one acceptance criterion implemented and verified. To define a slice:

1. **Map each acceptance criterion to a slice.** If a criterion is too large to implement in one pass, it is actually multiple criteria — split it further in Phase 1.

2. **A valid slice:**
   - Implements ONE acceptance criterion from Phase 1
   - Touches the minimum number of files to satisfy that criterion
   - Can be independently tested (the test for this slice does not depend on future slices)
   - Results in a meaningful, reviewable commit

3. **Slice size heuristics (not rules, but strong signals):**
   - **1-30 lines of implementation code**: Typical, healthy slice.
   - **30-80 lines**: Acceptable if it is a single coherent change (e.g., adding a new endpoint with its handler).
   - **80+ lines**: Warning sign. Ask: "Can I split this criterion into two independent criteria?" If yes, return to Phase 1 and split. If no, justify in the commit message why this must be one slice.

4. **Slices that are too small:**
   - A single import statement or type annotation change
   - A single-line config value change (unless it is the entire acceptance criterion)
   - These should be folded into the next meaningful slice, not committed alone.

5. **Commit granularity:** One commit = one slice = one acceptance criterion. If you find yourself writing "and also..." in a commit message, you have violated this rule.
```

---

### 6. Pre-existing Test Failure Detection Is Unreliable

**Section/Line:** Phase 4, lines 203-221 ("Pre-existing test failures")

**Exploit:**
Phase 4 step 4 states: "If the full suite has failures that existed before your changes, note them as a baseline. Your changes must not introduce any NEW failures."

This is correct in principle but impossible to execute reliably in practice because:

a) **Flaky tests.** A test that passes on run 1 and fails on run 2 could be counted as "pre-existing" or "new" depending on when it happens to fail. The skill has no instruction for detecting or handling flaky tests.

b) **Non-deterministic test ordering.** Some test frameworks randomize test order. A test that passes in isolation might fail when run after another test (shared state contamination). The agent has no way to know whether a failure that appears in the full suite but not in isolation is pre-existing or new.

c) **Environment-dependent tests.** Tests that depend on environment variables, file system state, network access, or system time can pass or fail based on factors unrelated to the code change. The skill doesn't mention running the full suite BEFORE making changes to establish the baseline — it only says to run it AFTER.

d) **No baseline recording.** The skill says "note them as a baseline" but doesn't specify where or how. An agent might note them in conversation context (lost on next turn), in a comment (not standard practice), or skip the note entirely.

**Severity:** HIGH — The agent will either (a) incorrectly attribute new failures as pre-existing (allowing regressions), or (b) incorrectly attribute pre-existing failures as new (blocking progress unnecessarily).

**Suggested Fix:**
```markdown
### Pre-existing Test Failure Baseline (run BEFORE any changes)

Before implementing any changes in Phase 4, establish the baseline:

```bash
# Run the full suite and capture results
FULL_SUITE_OUTPUT=$(npx jest --no-coverage 2>&1) || true
echo "$FULL_SUITE_OUTPUT" > .claude/dev-flow-baseline-tests.txt

# Count failures
BASELINE_FAILURES=$(echo "$FULL_SUITE_OUTPUT" | grep -c "FAIL " || true)
echo "Baseline failures: $BASELINE_FAILURES"
```

After your changes:

```bash
# Run the full suite again
NEW_SUITE_OUTPUT=$(npx jest --no-coverage 2>&1) || true
echo "$NEW_SUITE_OUTPUT" > .claude/dev-flow-current-tests.txt

# Diff the failure lists
diff <(grep "FAIL " .claude/dev-flow-baseline-tests.txt | sort) \
     <(grep "FAIL " .claude/dev-flow-current-tests.txt | sort)

# Any NEW "FAIL " lines are regressions.
```

### Flaky Test Handling

If a test appears in the baseline failures but NOT in the current failures (or vice versa) without you changing related code:

1. Mark it as potentially flaky.
2. Re-run it 3 times:
   ```bash
   for i in 1 2 3; do npx jest -t "flaky test name" --no-coverage; done
   ```
3. If results are inconsistent: report to user as a flaky test. Do NOT block your change on flaky tests.
4. If results are consistent: it's a real regression or fix. Investigate accordingly.
```

---

### 7. Push Failure Recovery Undersells Merge Conflict Complexity

**Section/Line:** Phase 9, lines 316-324 (Push and rebase)

**Exploit:**
The skill says on push failure: "fetch and rebase... Resolve conflicts, re-run the full test suite, then push again."

This is three words ("Resolve conflicts") covering what can be a deeply complex operation:

a) **Multiple conflicting commits.** If the remote has advanced by 10+ commits, the rebase may produce conflicts on every commit in the chain. The skill says "One commit per slice" — so for a 5-slice task, there are 5 commits. The rebase replays each one. Conflicts in commit 3 may be caused by something in commit 1. The agent needs to understand this causality.

b) **Conflict resolution strategy.** The skill provides no guidance on WHEN to use `git rebase --continue`, `--skip`, or `--abort`. An agent that doesn't understand rebase internals could corrupt the commit history.

c) **Test re-running after rebase.** "Re-run the full test suite" after resolving conflicts — but when? After each commit during the rebase? Only after the entire rebase completes? The skill doesn't specify. If tests fail mid-rebase, the agent is stuck in a rebase-in-progress state.

d) **Rebase of characterization test commits.** If a characterization test commit (Phase 3b step 4) conflicts during rebase, the agent is modifying a test that was supposed to "pin" behavior. This undermines the characterization safety net.

**Severity:** HIGH — An agent following these instructions literally could end up in a broken rebase state with no guidance on how to recover.

**Suggested Fix:**
```markdown
### Rebase Procedure (when push fails due to remote changes)

```bash
# 1. Fetch remote changes
git fetch origin

# 2. Check how far behind you are
BEHIND=$(git rev-list --count HEAD..origin/<base-branch>)
echo "Your branch is $BEHIND commits behind origin/<base-branch>"

# 3. Choose strategy based on distance:
if [ "$BEHIND" -le 3 ]; then
  # Few commits behind: interactive rebase
  git rebase -i origin/<base-branch>
elif [ "$BEHIND" -le 20 ]; then
  # Moderate: regular rebase
  git rebase origin/<base-branch>
else
  # Far behind: merge instead (avoids replaying many commits)
  echo "Branch is far behind. Using merge instead of rebase."
  git merge origin/<base-branch>
fi
```

### Handling Conflicts During Rebase

For each conflict:

1. **Identify what changed on remote.** Use `git log origin/<base-branch>..HEAD` to see the conflicting commits.
2. **Read the conflict markers.** Understand BOTH sides before resolving.
3. **Resolve conflicts in the editor.** Do not blindly accept "theirs" or "ours."
4. **Stage resolved files:** `git add <resolved-files>`
5. **Continue the rebase:** `git rebase --continue`
6. **If a conflict is too complex:**
   - `git rebase --abort` (returns to pre-rebase state)
   - Discuss with the user. Complex conflicts may need human judgment.

### Testing After Rebase

Run the full test suite ONLY after the rebase completes successfully (all commits replayed, no conflicts remaining). Running tests mid-rebase is unreliable because the working tree is in an intermediate state.

```bash
# After rebase completes:
git status  # Should be clean, on your branch
npx jest --no-coverage  # Full suite
```

If tests fail after a clean rebase:
1. The remote changes broke your code. This is NOT a conflict resolution error.
2. Fix the failures in a NEW commit on top of the rebased branch.
3. Push again.
```

---

## MEDIUM Issues

### 8. Scope Creep Detection Is Post-Hoc (After Work Is Done)

**Section/Line:** Anti-Patterns, line 29; Phase 6 (REVIEW-DIFF), lines 238-257

**Exploit:**
The anti-pattern "While I'm here, let me also fix..." is correctly named, but the only mechanism to catch it is Phase 6 REVIEW-DIFF: "Does this line directly serve an acceptance criterion?"

By Phase 6, the agent has already:
- Written the extra code (Phase 4)
- Written tests for it (Phase 3) or not
- Refactored it (Phase 5)
- Potentially spent significant time on it

The review catches scope creep, but after the cost has been incurred. The skill should catch it BEFORE implementation, not after.

**Severity:** MEDIUM — Wasteful but not dangerous. The extra work exists and can be extracted into a separate commit or branch. However, over many tasks, this adds up.

**Suggested Fix:**
Add a pre-RED gate in Phase 3:

```markdown
### Pre-RED Scope Gate (before writing any test)

Before writing a test for a criterion, verify it maps to a Phase 1 acceptance criterion:

1. State the criterion: "Implementing acceptance criterion #N: [description]"
2. If you cannot map it to a specific criterion from Phase 1: STOP. This is scope creep.
3. If you discover a legitimate missing criterion: return to Phase 1, add it to the list, get user confirmation, THEN proceed to Phase 3.

This gate costs 5 seconds and prevents hours of wasted work.
```

---

### 9. No Integration / E2E / Contract Test Guidance

**Section/Line:** Entire skill — the test strategy is unit-test-centric

**Exploit:**
The skill's test guidance focuses exclusively on unit-level testing (Phase 3: "Write a test that currently fails", Phase 4: "Run the full test suite"). But the "full test suite" often includes integration tests, E2E tests, contract tests, and visual regression tests. These have different characteristics:

a) **Integration tests** may require database fixtures, service mocks, or container orchestration. Running them on every slice is expensive and slow.

b) **E2E tests** may require a running application, browser automation, and network access. They cannot run in a worktree in the same way unit tests can.

c) **Contract tests** (Pact, etc.) require a running provider and consumer. The skill has no concept of provider/consumer testing.

d) **The "full test suite" command** in Phase 4 (`npx jest --no-coverage`) may run only unit tests, skipping integration tests that run via a separate command. The agent has no way to know this.

**Severity:** MEDIUM — The agent might think "full suite passes" means everything is fine when integration/E2E tests haven't been run. This creates a false sense of safety.

**Suggested Fix:**
```markdown
### Test Suite Layering

Not all tests should run on every slice. Use a layered approach:

| Layer | When to Run | Command (example) |
|-------|------------|-------------------|
| **Unit tests** | Every RED-GREEN-REFACTOR cycle | `npx jest --no-coverage` |
| **Integration tests** | Before committing (Phase 7), after final slice (Phase 9) | `npx jest --config jest.integration.config.js` |
| **E2E tests** | After all slices committed, before push (Phase 9) | `npm run test:e2e` |
| **Contract tests** | When API contracts change (Phase 1 cross-cutting concern) | `npm run test:contract` |

**Phase 1 addition: Identify test layers.** When identifying affected code (Phase 1 step 3), also identify which test layers exist:
```bash
# Check for test configurations
ls jest*.config.* cypress.config.* playwright.config.* vitest.config.* 2>/dev/null
cat package.json | grep -E '"(test|e2e|integration|contract)":'
```

**Phase 4 modification:** "Run the full test suite" means "run the unit test suite." Integration and E2E tests are deferred to Phase 7 (before commit) and Phase 9 (final verification).
```

---

### 10. Monorepo Error Recovery Is Insufficient

**Section/Line:** Error Recovery table, line 362 ("Monorepo with multiple test suites"); Phase 6 automated checks (lines 252-255)

**Exploit:**
The error recovery table says for monorepos: "Ask which package's test suite to run." But monorepos introduce complexity beyond just "which test suite":

a) **Per-package lint configs.** `npm run lint` at the root may not lint all packages. Each package might have its own lint script. The automated checks in Phase 6 assume a single lint command.

b) **Per-package build steps.** In a monorepo with TypeScript project references, you may need to build dependencies before testing. The skill's `npx tsc --noEmit` at the root may fail because of missing build artifacts.

c) **Workspace-aware testing.** Tools like Turborepo, Nx, or Lerna have their own test orchestration. Running `npx jest` directly may bypass caching and dependency tracking.

d) **Changed-package detection.** In a monorepo, a change in a shared library affects all consumers. The skill has no guidance on determining which packages' tests to run based on the dependency graph.

**Severity:** MEDIUM — The skill acknowledges monorepos exist but provides only a one-line escape hatch ("ask the user") rather than systematic guidance.

**Suggested Fix:**
```markdown
### Monorepo Detection and Handling

In Phase 1, detect whether the project is a monorepo:

```bash
# Check for monorepo indicators
test -f "lerna.json" && echo "Lerna monorepo detected"
test -f "nx.json" && echo "Nx monorepo detected"
test -f "turbo.json" && echo "Turborepo detected"
grep -q '"workspaces"' package.json && echo "npm/yarn/pnpm workspaces detected"
```

If a monorepo is detected:

1. **Identify affected packages.** Use the dependency graph:
   ```bash
   # Nx example
   npx nx affected:apps --base=origin/main --head=HEAD
   # Turborepo example
   npx turbo run test --filter=[HEAD^..HEAD] --dry-run
   ```

2. **Test only affected packages per slice.** Do not run the entire monorepo's test suite on every slice. Use the monorepo tool's filtering:
   ```bash
   npx nx test <package-name> --base=origin/main
   ```

3. **Run full affected-graph tests before commit (Phase 7).** This catches cross-package regressions:
   ```bash
   npx nx affected:test --base=origin/main
   ```

4. **Lint per-package.** Each package may have its own lint configuration. Run lint in each affected package:
   ```bash
   npx nx affected:lint --base=origin/main
   ```

5. **If no monorepo tool is configured**, ask the user which packages are affected and which test commands to use. Do not guess.
```

---

## Summary of Findings

| # | Issue | Severity | Section | Fix Complexity |
|---|-------|----------|---------|----------------|
| 1 | Safety Snapshot Gaming | CRITICAL | Phase 2 | Medium |
| 2 | Characterization Test Bug Enshrinement | CRITICAL | Phase 3b | Medium |
| 3 | Orphaned Worktree Leakage | CRITICAL | Phase 2 / Abort | Medium |
| 4 | TDD Absolutism | HIGH | Phase 3 / Fast Path | High |
| 5 | Slice Definition Ambiguity | HIGH | Phase 1 / Error Recovery | Medium |
| 6 | Pre-existing Test Failure Detection | HIGH | Phase 4 | Medium |
| 7 | Push Failure Recovery | HIGH | Phase 9 | Medium |
| 8 | Post-Hoc Scope Creep Detection | MEDIUM | Anti-Patterns / Phase 6 | Low |
| 9 | No Integration/E2E Test Guidance | MEDIUM | All phases | High |
| 10 | Monorepo Complexity | MEDIUM | Error Recovery / Phase 6 | Medium |

## Overall Assessment

The dev-flow skill demonstrates strong structural design with clear phase gating and a well-considered pipeline. The anti-patterns section is excellent — naming specific failure modes helps agents recognize them.

However, the skill's TDD absolutism and "happy path" assumptions create real gaps when applied to the messy reality of legacy code, monorepos, flaky tests, and interrupted workflows. The three CRITICAL issues (safety snapshot fragility, characterization test paradox, worktree leakage) are blockers — they can cause data loss or permanently corrupt test baselines.

**Recommendation:** Fix the three CRITICAL issues before deploying this skill. The five HIGH issues should be addressed in the next iteration. The two MEDIUM issues can be deferred but should not be forgotten.
