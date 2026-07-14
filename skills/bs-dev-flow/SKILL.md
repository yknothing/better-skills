---
name: bs-dev-flow
# tier: standard
description: Use when the user wants to implement a feature, fix a bug, or make a code change from a spec, requirements doc, or issue. Covers the full path from worktree setup through TDD implementation to a reviewable commit.
---

# Dev Flow

You orchestrate the end-to-end development workflow: understand the task, set up an isolated environment, implement with TDD in small verifiable slices, self-review, and commit for review.

***

## Bundled resources

This skill ships with helper scripts and references under `skills/bs-dev-flow/`:

- `scripts/safety-snapshot.sh` — invoked at Phase 2.1
- `scripts/orphan-worktree-check.sh` — invoked at Phase 2.2
- `scripts/recover-from-snapshot.sh` — invoked from `references/error-recovery.md`
- `references/characterization-tests.md` — required reading when Phase 1 declares characterization-first posture
- `references/error-recovery.md` — required reading when any phase fails

**Path convention**: command examples below use paths relative to this skill's directory (e.g. `bash scripts/safety-snapshot.sh`). When invoking from a different cwd, prefix with the skill path — e.g. `bash skills/bs-dev-flow/scripts/safety-snapshot.sh` if cwd is the repo root, or `bash ~/.claude/skills/bs-dev-flow/scripts/safety-snapshot.sh` after installation.

***

## HARD RULES — read before any process step

Violating any of these is a failure of the skill. No exceptions.

- **Tests first, always.** No implementation code before a failing test exists. If you cannot write a test (visual-only change, config, docs, CSS), use the visual/manual-only fast path below — or get user confirmation to proceed without tests.
- **No `git add .` or `git add -A`.** Stage only named files. Know exactly what you are committing.
- **No destructive git commands** (`reset --hard`, `clean -fdx`, force-push, branch deletion) without explicit user approval. The only sanctioned `reset --hard` is the recovery procedure in [references/error-recovery.md](./references/error-recovery.md).
- **No silent worktree abandonment.** If you create a worktree, exit it cleanly or tell the user it persists and where.
- **One slice at a time.** Implement the smallest meaningful unit, verify it, then move to the next. Never batch unrelated changes.
- **Self-review every diff before committing.** Read the full diff. Ask: does every changed line serve the task? Any leftovers?

## Anti-Patterns — named so you recognize them

- **"I'll just quickly..."** — No. There is no "quickly" in a reliable workflow. Follow the phases.
- **"The test is obvious, I'll write it after"** — Not TDD. The test must exist and fail before implementation.
- **"While I'm here, let me also fix..."** — Scope creep. Note it for a separate task.
- **"This refactor is safe, no need to re-run tests"** — Always re-run tests after any code change.
- **"One big commit is cleaner"** — One commit per slice. Small, reviewable commits.
- **"That failure is probably pre-existing"** — Prove it. Only failures recorded in the Phase 4 baseline count as pre-existing; anything else is yours.
- **"The suite is slow, I'll run it once at the end"** — A batched test run cannot tell you which slice broke what. Run per slice.

## Visual/Manual-Only Fast Path

For changes that cannot be meaningfully auto-tested (config, docs, CSS tweaks, copy changes), use this 3-step fast path instead of the full RED-GREEN-REFACTOR loop:

1. **MAKE-CHANGE**: Make the change in the smallest coherent unit.
2. **SELF-REVIEW**: Run `git diff`. Verify every changed line is intentional, no side effects. For config changes, verify the syntax is valid. For docs, re-read for clarity.
3. **COMMIT**: Follow Phase 7 commit rules — specific files only, meaningful message, one commit per logical change.

Skip Phases 3-5. Still follow SETUP, REVIEW-DIFF, and FINALIZE. If the change touches any logic or data path, the full TDD pipeline applies — do not use this fast path.

## Pipeline Overview

Each phase produces a durable artifact that the next phase consumes.

```
UNDERSTAND → SETUP → ┌──────────────────────────────────────────┐
                      │  RED → GREEN → REFACTOR → REVIEW-DIFF → COMMIT
                      └──────────────────────────────────────────┘
                                         ↓ (all criteria done)
                                      FINALIZE
```

The loop (RED → GREEN → REFACTOR → REVIEW-DIFF → COMMIT) repeats for each slice until the task is complete, then FINALIZE prepares the work for review.

***

## Phase 1: UNDERSTAND

Before touching any code, establish what "done" means.

1. **Locate the spec.** Find the requirements document, issue, or spec that defines this task. If none exists, ask the user for one. Do not proceed without a written definition of success.
2. **Extract acceptance criteria.** List every condition that must be true for this task to be complete. If the spec is ambiguous, ask one clarifying question at a time until criteria are unambiguous.
3. **Identify affected code.** Map which files, modules, or components are in scope. Use `grep`, LSP `findReferences`, and direct file reads — not guesses.
4. **Declare the characterization posture:**
   - **Test-first**: You have a spec and can write tests before implementation. This is the default.
   - **Characterization-first**: You are modifying legacy code without existing tests. Write characterization tests that pin current behavior before changing anything. Full procedure: [references/characterization-tests.md](./references/characterization-tests.md).
   - **Visual/manual-only**: The change is purely visual or cannot be meaningfully auto-tested. State this explicitly, explain why, and get user confirmation before proceeding.
5. **Check for no-op tasks.** If no code changes are needed (feature already exists, bug already fixed), state this and exit. Do not manufacture work.
6. **Identify cross-cutting concerns.** Check whether the change touches:
   - **Database migrations**: Schema migration needed? Identify the framework and plan the rollback path.
   - **API contract changes**: Breaking change? Does it need versioning or backwards compatibility?
   - **Configuration, secrets, environment variables**: New keys, feature flags, or secrets needed?
   - **Breaking changes**: Will existing consumers be affected? Flag in the review summary.
   - **External dependencies**: Adding, removing, or upgrading a dependency? Note impact on build times or license compatibility.

   Document any cross-cutting concern in the acceptance criteria list.

<HARD-GATE id="criteria-and-manifest">
Do not proceed to Phase 2 until you have written acceptance criteria AND a file manifest. If either is missing, stay in Phase 1.
</HARD-GATE>

***

## Phase 2: SETUP

Isolate the work so it cannot interfere with other tasks or the main branch.

### 2.1 Safety snapshot (always — before any mutation)

Before making any changes, create a recoverable checkpoint:

```bash
SNAPSHOT_REF="$(bash scripts/safety-snapshot.sh)"
echo "Safety snapshot: $SNAPSHOT_REF"
```

`scripts/safety-snapshot.sh` tries a lightweight tag first, falls back to a branch-based snapshot, and warns (without blocking) if both fail. Capture the ref it prints — you need it for recovery in [references/error-recovery.md](./references/error-recovery.md).

<HARD-GATE id="snapshot-or-consent">
If `SNAPSHOT_REF` is empty (the script warned that both tag and branch creation failed), STOP. Tell the user: "I could not create a recovery snapshot — if something goes wrong there is no safe rollback point." Ask whether to proceed anyway, fix the repo state first, or abort. Do not silently continue without a recovery point.
</HARD-GATE>

This costs nothing and guarantees recovery if something goes wrong. The snapshot is created before any branch creation or worktree setup, so it is always reachable.

### 2.2 Orphaned worktree detection (before creating a new worktree)

Check for abandoned worktrees from crashed or interrupted sessions:

```bash
bash scripts/orphan-worktree-check.sh
```

`scripts/orphan-worktree-check.sh` prints one line per worktree under `.claude/worktrees/` with no commit in the last hour (override the threshold: `bash scripts/orphan-worktree-check.sh 7200` for 2 hours). If orphans are found, report them to the user and ask: *"Found N worktrees from previous sessions that appear abandoned. Should I clean them up?"* **Do not remove worktrees without user confirmation.**

### 2.3 Decision: worktree or direct branch?

- Use a **git worktree** when: the task is large (multiple slices), you need parallel work, or the user explicitly requests it.
- Use a **direct branch** when: the task is small (1-2 slices), no other work is in flight.

**If using a worktree**, first detect the default branch so the worktree targets the correct base:

```bash
DEFAULT_BRANCH=$(git rev-parse --abbrev-ref origin/HEAD 2>/dev/null)
DEFAULT_BRANCH=${DEFAULT_BRANCH:-main}
git worktree add -b <descriptive-branch-name> .claude/worktrees/<task-slug> "$DEFAULT_BRANCH"
```

The branch name must be descriptive: `feat/add-auth-middleware`, not `fix-stuff`. The worktree lives under `.claude/worktrees/`. Enter it with the EnterWorktree tool (if available) or by `cd`-ing into `.claude/worktrees/<task-slug>`.

**If using a direct branch:**

```bash
git checkout -b <descriptive-branch-name>
```

**If the working tree is dirty**, tell the user to commit or stash changes first. Do not stash for them.

***

## Phase 3: RED — Write Failing Tests

For each acceptance criterion, write a test that currently fails.

1. **Pick the smallest criterion first.** Start with the one with the fewest dependencies.
2. **Write the test.** Use the project's existing test framework. Match existing conventions exactly — same file naming, same describe/it blocks, same assertion style.
3. **Run the test. Confirm it fails.** A test that passes before implementation is either testing the wrong thing or the feature already exists.

```bash
# Adapt to the project's test runner
npx jest path/to/test.test.ts --no-coverage
# or: pytest tests/test_module.py -k "test_name"
# or: go test ./pkg/module/ -run TestName
```

4. **If the test passes when it should fail:** Stop. The test is testing existing behavior, not the new behavior. Fix the test before continuing.

**Gate:** Do not enter Phase 4 until at least one test exists and fails for the expected reason.

### When tests already exist

You may arrive with tests already in place. Handle each scenario distinctly:

**Bug fix with existing tests:**
1. Write a new test that reproduces the bug. It must FAIL, proving the bug exists.
2. Proceed to Phase 4 (GREEN) to fix the bug. The new test should now pass.
3. All existing tests must continue to pass.

**Feature extension (adding to existing functionality):**
1. Write new tests for the extension only. They must FAIL.
2. Proceed normally through GREEN and REFACTOR.
3. Existing tests for the original feature must continue to pass — they are your regression guard.

**Refactoring (no behavior change):**
1. Do NOT write new tests. The existing tests are your safety net.
2. Skip Phase 4 (GREEN). Go directly to Phase 5 (REFACTOR).
3. Run the full test suite before starting. All tests must pass. If any test fails before you begin, the code has a pre-existing bug — stop and discuss with the user.
4. After each refactor step, re-run tests. They must continue to pass.

### Phase 3b: RED (Characterization) — legacy code without tests

When Phase 1 declared the `characterization-first` posture, follow [references/characterization-tests.md](./references/characterization-tests.md) instead of this phase. The short version: pin current behavior with tests that PASS, commit them, then return here to write a failing test for the desired change.

<HARD-GATE id="red-confirmed">
Do not proceed to Phase 4 until tests exist and their expected result (fail for test-first, pass for characterization) is confirmed.
</HARD-GATE>

***

## Phase 4: GREEN — Minimal Implementation

Write the smallest amount of code that makes the failing test pass.

1. **Implement only what the test demands.** Resist "while I'm here" improvements — those go in the REFACTOR phase or a separate task.
2. **Run the test. Confirm it passes.**
3. **Run the full test suite.** Ensure no regressions.

```bash
npx jest path/to/test.test.ts --no-coverage   # the specific test
npx jest --no-coverage                          # then the full suite
```

4. **Pre-existing test failures.** If the full suite has failures that existed before your changes, note them as a baseline. Your changes must not introduce any NEW failures.
5. **If the full suite has new failures:** Fix regressions before continuing. You broke something.

**Gate:** Do not enter Phase 5 until the specific test AND the full suite both pass (allowing only pre-existing failures).

***

## Phase 5: REFACTOR

Now that tests pass, clean up.

1. **Remove duplication.** Did you repeat yourself within the new code or between new and existing code?
2. **Improve names.** Are variables, functions, and types named for what they do, not how they do it?
3. **Simplify.** Can the same behavior be expressed more clearly with fewer lines?
4. **Run tests after every refactor step.** Refactoring without re-running tests is guessing.

**Constraint:** Refactoring must not change behavior. If a test fails during refactoring, you changed behavior. Revert and try again.

***

## Phase 6: REVIEW-DIFF — Self-Review

Before committing, read your own diff as if you were reviewing a colleague's PR.

Run: `git diff`

For every changed line, answer:
1. **Necessity**: Does this line directly serve an acceptance criterion?
2. **Correctness**: Is the logic correct? Are edge cases handled?
3. **Clarity**: Would a colleague understand this in 6 months without asking you?
4. **Hygiene**: Are there leftover debug logs, commented-out code, TODO markers without issue references?

**Automated checks (non-negotiable):**

Discover the project's own checks before running anything — do not assume a stack:

1. Look for check commands in this order: `package.json` scripts (`lint`, `typecheck`, `check`), `Makefile` targets, `pyproject.toml` / `setup.cfg` tool sections, `.pre-commit-config.yaml`, CI workflow files (`.github/workflows/`). Use what the project has defined.
2. If nothing is defined, fall back to the toolchain the codebase visibly uses (e.g., `npx tsc --noEmit` where a `tsconfig.json` exists, `ruff check .` in a Python repo) and say which fallback you chose.
3. If no check tooling exists at all, state that explicitly in the review summary rather than inventing a command that will fail.

Fix any lint or type errors. Do not commit code that fails automated checks. If self-review or automated checks find issues, fix them now and re-run tests.

**Independent review (when subagent dispatch is available):** for slices that touch >3 files or any security/data path, dispatch a fresh-context reviewer subagent. Give it only the diff, the acceptance criteria, and the file manifest — not your conversation history (a reviewer that shares your context shares your blind spots). Require its findings in `file:line — problem — suggested fix` form, ending with a verdict: `Ready to commit: Yes | No | With fixes`. Address every `No`/`With fixes` finding or record why you disagree before committing.

***

## Phase 7: COMMIT

Stage and commit with a meaningful message.

```bash
git add <specific-file-1> <specific-file-2>
git commit -m "<type>: <imperative summary>

<Body explaining what and why, not how.>"
```

**Commit message format:**
- **Type**: `feat`, `fix`, `refactor`, `test`, `docs`, `chore`
- **Summary**: Imperative mood, under 72 characters. "Add rate limiting to auth middleware", not "Added rate limiting".
- **Body**: What changed and why. The diff shows how. Reference issues: `Closes #123`.

**One commit per slice.** Do not batch multiple slices into one commit.

***

## Phase 8: REPEAT

The RED → GREEN → REFACTOR → REVIEW-DIFF → COMMIT loop continues until all acceptance criteria from Phase 1 are met.

**Before each iteration:**
1. Verify the previous slice is committed (one commit, named files only).
2. Select the next unimplemented criterion — smallest remaining scope first.
3. Confirm the safety snapshot is still reachable: `git tag -l "pre-dev-flow-*" --sort=-creatordate | head -1`

Return to Phase 3 with that criterion.

**If you discover a new criterion during implementation:**
- Add it to the acceptance criteria list.
- Get explicit user confirmation before implementing it.
- Do not silently expand scope.

**Loop exit condition:** Every criterion from Phase 1 is implemented, tested, and committed. Proceed to Phase 9.

***

## Phase 9: FINALIZE — Prepare for Review

When all slices are committed:

1. **Run the full test suite one final time.**
2. **Check for uncommitted changes:** `git status`. If anything remains, commit it or explain why it should not be committed.
3. **Push the branch:**

```bash
git push -u origin <branch-name>
```

Never use `--force` or `--force-with-lease` without explicit user approval. If push fails due to remote changes, fetch and rebase:

```bash
git fetch origin
git rebase origin/<base-branch>
```

Resolve conflicts, re-run the full test suite, then push again.

4. **Create a pull request (if applicable).** If the project uses GitHub or GitLab, offer to create a PR. Use the project's PR template if one exists.
5. **Summarize the work:** what was implemented (acceptance criteria met), what files changed and why, any decisions a reviewer should know, any known limitations or follow-up work.
6. **If a worktree was used, clean up.** Use ExitWorktree if available, or tell the user: `git worktree remove .claude/worktrees/<task-slug>`.

***

## Execution Posture Signals

Throughout this workflow, maintain these signals so the user can track your position in the pipeline:

| Signal | Meaning |
|--------|---------|
| "Writing failing test for [criterion]" | Phase 3: RED |
| "Test fails as expected: [error]" | RED confirmed |
| "Implementing minimal change to pass test" | Phase 4: GREEN |
| "Tests pass. Running full suite." | GREEN confirmed |
| "Refactoring: [specific change]" | Phase 5 |
| "Self-reviewing diff" | Phase 6 |
| "Committing: [type]: [summary]" | Phase 7 |

***

## Error Recovery & Abort

If any phase fails in a way that requires rollback or abort, stop the main flow and consult [references/error-recovery.md](./references/error-recovery.md). It contains the full error table, the recovery-from-snapshot procedure (driven by `scripts/recover-from-snapshot.sh`), and the abort procedure.

The one-line summary: if implementation has gone off the rails, run `bash scripts/recover-from-snapshot.sh` to restore the Phase 2 safety snapshot, then return to Phase 1. Do not salvage partial work after a hard reset.

***

## Test prompts

Three prompts that exercise this skill end-to-end, mirrored in `evaluation/datasets/batch-1-test-prompts.json`.

1. **Happy path — test-first**: *"Implement a `slugify(str)` utility in `src/utils/slugify.ts` that lowercases, strips diacritics, replaces non-alphanumeric runs with single hyphens, and trims leading/trailing hyphens. Empty string returns empty string. Add it to the existing Jest setup."* — expected: RED-GREEN-REFACTOR cycle, characterization posture = test-first, one commit, full suite green.
2. **Edge — legacy refactor without tests**: *"Refactor `legacy/parseInvoice.js` — it's a 400-line function with no tests. We need to extract the date-parsing logic into its own module without changing behavior. The codebase uses Jest."* — expected: characterization-first posture declared, characterization tests written and committed first (Step 4 of characterization-tests.md), then test-first for any behavior change.
3. **Adversarial — scope creep + dirty tree**: *"Add a `rateLimit` middleware to the auth router. By the way, I also noticed the login form has a typo and the README is outdated — fix those too while you're in there. (Working tree currently has uncommitted changes from another task.)"* — expected: refuse to batch unrelated changes (anti-pattern "While I'm here"), demand the dirty tree be committed/stashed first (do not stash for them), separate the typo/README items into their own tasks.

## Handoff

After Phase 9:
- If the user wants the PR reviewed: invoke `code-review`.
- If the user wants the change deployed: hand off to the project's deploy/CI skill.
- Do not implement follow-up work without a new task declaration. This skill's scope ends at a reviewable, pushed branch.
