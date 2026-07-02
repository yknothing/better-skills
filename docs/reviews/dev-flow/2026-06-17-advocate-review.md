# Dev-Flow Peer Review -- Advocate (Gate 2)

**Date**: 2026-06-17
**Reviewer**: Advocate (what's GOOD about this skill)
**Skill**: dev-flow
**Skill Path**: skills/dev-flow/SKILL.md

---

## Scoring Summary

| # | Dimension | Score | Notes |
|---|-----------|-------|-------|
| 1 | Pipeline Design | 9/10 | Well-structured TDD loop with critical bookend phases |
| 2 | Safety Mechanisms | 9/10 | Safety snapshots, staging discipline, recovery procedures |
| 3 | Characterization Testing (Phase 3b) | 9/10 | Properly distinguishes from test-first; explains the "why" |
| 4 | Visual/Manual Fast Path | 8/10 | Pragmatic escape hatch with clear boundary constraints |
| 5 | Anti-Pattern Naming | 8/10 | Covers the top 5 rationalizations; memorable |
| 6 | Error Recovery | 9/10 | 8 situations + safety snapshot recovery + abort procedure |
| 7 | Commit Discipline | 9/10 | Conventional commits, per-slice, specific staging enforced |
| 8 | Cross-Cutting Concerns | 8/10 | All 5 major categories covered in Phase 1 discovery |
| **Total** | | **69/80** | |

---

## 1. Pipeline Design -- 9/10

**The sequence is correct.** UNDERSTAND → SETUP → (RED → GREEN → REFACTOR → REVIEW-DIFF → COMMIT) × N → FINALIZE mirrors the classic TDD cycle but adds critical bookends:

- **UNDERSTAND**: Prevents the most common failure mode -- building the wrong thing. The "check for no-op tasks" sub-step (step 5) is an unusual and valuable inclusion that prevents busywork.
- **SETUP**: Safety snapshot before any mutation. This ordering is deliberate and correct -- the snapshot must exist before any branch or worktree is created.
- **REVIEW-DIFF before COMMIT**: Inserting self-review between green tests and commit is the right placement. Many workflows commit first and review later. This forces the review while the context is still hot.
- **FINALIZE**: Full test suite run, push with rebase-on-conflict, PR creation, worktree cleanup. Complete.

**What makes this a 9, not a 10**: The REPEAT phase (Phase 8) is somewhat redundant with the pipeline diagram. The loop is already shown in the diagram; Phase 8 adds the exit condition and scope-creep handling but could be a sub-section of Phase 9 rather than its own phase. This is a minor structural nitpick.

**Pattern alignment**: This is a textbook application of the **管道架构 (Pipeline Architecture)** pattern from the pattern library. Each phase produces a durable artifact (acceptance criteria, failing test, passing test, commit) that the next phase consumes.

---

## 2. Safety Mechanisms -- 9/10

**The safety snapshot is the standout mechanism.** Creating a timestamped git tag before any mutation is a zero-cost insurance policy. Key design decisions that make it robust:

1. **Created before branch/worktree setup**, so it is always reachable regardless of what happens next.
2. **Timestamped** (`pre-dev-flow-$(date +%s)`), so multiple snapshots don't collide.
3. **Documented recovery procedure**: List snapshots, reset, verify, restart. No ambiguity.
4. **Abort procedure**: Includes worktree cleanup, safety snapshot cleanup, and confirmation that the working tree is clean.

**The hard rules block is well-constructed:**
- "No `git add .` or `git add -A`" -- prevents accidental inclusion of unrelated changes, secrets, or debug artifacts.
- "No destructive git commands without explicit user approval" -- covers `reset --hard`, `clean -fdx`, force-push, branch deletion.
- "No silent worktree abandonment" -- prevents orphaned worktrees consuming disk space.
- "Self-review every diff before committing" -- the REVIEW-DIFF phase is backed by a hard rule.

**What could strengthen this further**: There is no explicit mention of pre-commit hooks or how to handle projects that have them (e.g., husky, lint-staged). If a project has a pre-commit hook that runs linting, the REVIEW-DIFF phase's automated checks become partially redundant. A brief note about this would close the gap.

**Pattern alignment**: The hard rules block uses **格式显著性门禁 (Format Salience Gate)** with the `>>> HARD RULES` all-caps delimiter, and **硬规则前置 (Hard Rules First)** by placing constraints before any process description.

---

## 3. Characterization Testing (Phase 3b) -- 9/10

**This is one of the strongest sections in the skill.** Characterization testing is a nuanced concept that many developers get wrong, and this skill handles it correctly:

1. **It correctly distinguishes characterization from test-first**: Characterization tests describe *current* behavior (reality), not desired behavior. The distinction is made explicit in the posture declaration in Phase 1.

2. **It enforces the critical invariant**: Characterization tests must PASS before changes are made. A failing characterization test means either the test doesn't capture behavior correctly, or the code has a pre-existing bug. This is explained clearly in the "Why characterization tests must pass first" section.

3. **It covers both major patterns**: Approval/snapshot tests (capture full output) and golden-master tests (explicit assertions per behavior). The manual fallback is also covered.

4. **It commits characterization tests separately**: `test: add characterization tests for <component>` as its own commit. This creates a clean audit trail.

5. **It transitions back to test-first**: After pinning current behavior, the skill switches to the normal RED-GREEN-REFACTOR cycle for the actual change. This is the correct approach.

**What makes this a 9, not a 10**: The section doesn't explicitly address what to do when the characterization tests reveal unexpected behavior that may or may not be bugs. For example, a legacy function that returns `null` in a case where it "should" return an empty list. The guidance says "stop and discuss with the user," which is correct but could be more nuanced about distinguishing bugs from surprising-but-intentional behavior.

**Pattern alignment**: This section exemplifies the **TDD 技能创建 (TDD for Skills)** pattern applied to code itself, and the **精确终端状态 (Precise Terminal States)** pattern with its clear HARD-GATE.

---

## 4. Visual/Manual Fast Path -- 8/10

**This is a pragmatic and necessary escape hatch.** Not all changes can be meaningfully auto-tested (CSS tweaks, config changes, documentation). The 3-step fast path (MAKE-CHANGE → SELF-REVIEW → COMMIT) is minimal but sufficient.

**What's done well:**

1. **Clear boundary**: "If the change touches any logic or data path, the full TDD pipeline applies." This prevents abuse.
2. **Still requires self-review**: The SELF-REVIEW step includes `git diff` verification, syntax validation for config, and re-reading for docs.
3. **Still requires commit discipline**: Phase 7 commit rules apply -- specific files, meaningful message, one commit per logical change.
4. **Explicit phase mapping**: "Skip Phases 3-5. Still follow SETUP, REVIEW-DIFF, and FINALIZE." No ambiguity about what's skipped and what's not.

**What could be improved**: The fast path doesn't mention what to do about the safety snapshot from Phase 2. Since Phase 2 (SETUP) is still followed, the snapshot is created, but the fast path section doesn't reference it. A brief note like "The safety snapshot is still created in SETUP and available for recovery" would close this gap.

**Pattern alignment**: This is a form of **平台降级规则 (Platform Degradation Rules)** applied to testing capability -- when auto-testing is impossible, degrade to a simpler but still-rigorous workflow.

---

## 5. Anti-Pattern Naming -- 8/10

**The five named anti-patterns are well-chosen:**

| Anti-Pattern | What It Prevents | Severity |
|---|---|---|
| "I'll just quickly..." | Skipping phases, rushing | High |
| "The test is obvious, I'll write it after" | Violating TDD order | Critical |
| "While I'm here, let me also fix..." | Scope creep | High |
| "This refactor is safe, no need to re-run tests" | Skipping verification | Critical |
| "One big commit is cleaner" | Poor commit hygiene | Medium |

**Why this works**: Each anti-pattern gives the agent a name for a rationalization it might generate internally. When the agent thinks "I'll just quickly fix this formatting issue while I'm in this file," the named anti-pattern triggers recognition: "That's the 'While I'm here' anti-pattern. Stop." This is a direct application of the **反模式预命名 (Anti-Pattern Pre-Naming)** pattern from the pattern library.

**What could be added**: One notable gap: there's no anti-pattern for "I already tested this manually" -- a common rationalization for skipping automated tests in the RED phase. However, "The test is obvious" partially covers this ground. Adding a sixth ("I tested it manually, it works") would strengthen the list, but five is a good number for memorability.

**Pattern alignment**: This directly implements **反模式预命名** and **反合理化预命名 (Anti-Rationalization Pre-Naming)** from the pattern library.

---

## 6. Error Recovery -- 9/10

**Eight specific situations with concrete responses:**

| Situation | Response Quality |
|---|---|
| Test framework not found | Good -- asks, doesn't guess |
| Monorepo with multiple test suites | Good -- asks, doesn't assume |
| Worktree creation fails (dirty tree) | Good -- tells user, doesn't stash for them |
| Full test suite fails after implementation | Good -- revert, diagnose, fix |
| Slice scope creeps (>~50 lines) | Excellent -- concrete threshold, clear action |
| User interrupts mid-flow | Excellent -- state phase, save fresh snapshot |
| Implementation goes badly wrong | Excellent -- documented recovery procedure |
| Push fails due to remote changes | Good -- references Phase 9 procedure |

**The recovery from safety snapshot procedure is particularly strong:**
1. List available snapshots (discoverability)
2. Reset to snapshot (recovery)
3. Verify state (confirmation)
4. Restart pipeline (don't salvage partial work)
5. Optional cleanup (housekeeping)

**The abort procedure is complete**: Revert uncommitted changes, remove worktree, switch back, clean up snapshot, confirm clean state.

**What makes this a 9, not a 10**: The "slice scope creeps" threshold of ~50 lines is somewhat arbitrary and may not fit all languages/projects. A Rust change might naturally be larger than a Python change. A note that this is a heuristic, not a hard rule, would be helpful.

**Pattern alignment**: The recovery procedure uses **精确命令替代模糊指令 (Precise Commands over Vague Instructions)** -- specific git commands rather than "recover your changes."

---

## 7. Commit Discipline -- 9/10

**The commit rules are clear, enforceable, and well-structured:**

1. **Specific file staging**: `git add <file1> <file2>`, never `git add .` or `git add -A`. This is enforced by a hard rule.
2. **Conventional commits format**: `type: imperative summary` with types (`feat`, `fix`, `refactor`, `test`, `docs`, `chore`).
3. **Imperative mood**: "Add rate limiting" not "Added rate limiting."
4. **Body explains what and why, not how**: The diff shows how.
5. **One commit per slice**: Enforced by the loop structure and Phase 8 verification.

**Enforceability**: The hard rule against `git add .` and `git add -A` is enforceable because the agent must explicitly name files. The "one commit per slice" rule is enforced by the pipeline structure -- each iteration of the loop produces exactly one commit before returning to Phase 3.

**What could be improved**: The commit message format doesn't mention scope (e.g., `feat(auth): add rate limiting`). Conventional commits support optional scope in parentheses. Adding this as an option (not a requirement) would align with common practice.

**Pattern alignment**: The commit discipline section uses **精确命令替代模糊指令** -- showing the exact `git add` and `git commit` commands with placeholders.

---

## 8. Cross-Cutting Concerns -- 8/10

**All five major categories are covered in Phase 1, step 6:**

| Concern | Coverage |
|---|---|
| Database migrations | Yes -- schema migration, framework identification, rollback path |
| API contract changes | Yes -- breaking change detection, versioning, backwards compatibility |
| Configuration, secrets, environment variables | Yes -- new keys, feature flags, secrets |
| Breaking changes | Yes -- consumer impact, review summary flagging |
| External dependencies | Yes -- add/remove/upgrade, build time impact, license compatibility |

**What's done well**: Each concern has a specific question to answer, not just a checkbox. For example, database migrations ask "Identify the framework and plan the rollback path" -- this forces thinking about undo, not just do.

**What could be improved**: The instruction to "Document any cross-cutting concern in the acceptance criteria list" is good, but the skill doesn't specify a format for this documentation. A brief example (e.g., "[CC-DB] Add migration for users.email unique constraint") would help.

**Additionally**: There's no mention of observability concerns -- logging, metrics, alerts. If a change adds a new code path that should be monitored, this isn't caught by the current checklist. This is a minor gap.

---

## Strongest Aspect

**The safety snapshot mechanism combined with the characterization testing phase.** Together, they make this skill unusually robust:

- The safety snapshot ensures you can always recover to a known-good state, regardless of what goes wrong.
- The characterization testing phase ensures you understand what the code currently does before you change it, preventing the most insidious class of bugs: accidentally altering existing behavior.

These two features address the two biggest fears in software development: "What if I break something?" (safety snapshot) and "What if I don't understand the code well enough?" (characterization testing).

---

## One Improvement

**Add a sixth anti-pattern**: "I tested it manually, it works." This is a common rationalization for skipping the RED phase, especially for changes that "feel" simple. The current "The test is obvious" anti-pattern partially covers this, but manual testing is a distinct rationalization that deserves its own name. The distinction matters: "The test is obvious" is about overconfidence in test design; "I tested it manually" is about substituting manual verification for automated testing.

---

## Pattern Alignment Verification

The skill correctly applies the following patterns from docs/patterns/:

| Pattern | Where Applied | Correctness |
|---|---|---|
| 格式显著性门禁 (Format Salience Gate) | `>>> HARD RULES` block | Correct |
| 反模式预命名 (Anti-Pattern Pre-Naming) | 5 named anti-patterns | Correct |
| 硬规则前置 (Hard Rules First) | Hard rules before any process step | Correct |
| 管道架构 (Pipeline Architecture) | UNDERSTAND → SETUP → loop → FINALIZE | Correct |
| Worktree 隔离 (Worktree Isolation) | Phase 2 worktree setup with `.claude/worktrees/` | Correct |
| 执行姿态信号 (Execution Posture Signals) | Phase-by-phase signal table | Correct |
| 精确命令替代模糊指令 (Precise Commands) | Specific bash commands throughout | Correct |
| 精确终端状态 (Precise Terminal States) | HARD-GATE after each phase | Correct |
| 渐进式披露 (Progressive Disclosure) | Pipeline overview → detailed phases | Correct |

**Source attributions are accurate.** The patterns used align with documented sources (Anthropic, CE, Cursor, Superpowers).

---

## Production-Readiness Assessment

**Yes, this skill is production-ready.** The assessment criteria:

| Criterion | Status | Evidence |
|---|---|---|
| Clear entry conditions | Yes | Phase 1: UNDERSTAND requires a spec |
| Hard gates prevent skipping | Yes | HARD-GATE after Phase 1, 3, 3b, 4 |
| Error recovery for all known failures | Yes | 8 situations + safety snapshot + abort |
| Exit conditions are explicit | Yes | Phase 9: FINALIZE with full test suite |
| Safety mechanisms are in place | Yes | Snapshot tags, staging discipline, worktree isolation |
| Edge cases are handled | Yes | Monorepo, legacy code, visual-only, dirty tree |
| User communication signals | Yes | Execution posture signal table |

---

## Conclusion

The dev-flow skill is a well-constructed, safety-conscious development workflow that correctly applies TDD principles while remaining pragmatic about real-world constraints (legacy code, visual-only changes, monorepos). Its strongest contributions are the safety snapshot mechanism and the characterization testing phase, both of which address real failure modes in agent-assisted development. The skill is production-ready with a score of **69/80**.

**Recommendation**: Proceed to Gate 3 (Pattern Alignment) and Gate 4 (Baseline Test).
