# Advocate Review: bs-skill-forge

**Date**: 2026-06-17
**Reviewer Role**: Advocate
**Skill**: bs-skill-forge
**HUMAN_VERIFIED**: false

## Executive Summary

This compatibility header normalizes review metadata after the repository-wide `bs-` namespace migration. The substantive review below is preserved unchanged.

**Schema completeness**: 10/10
**Schema migration status**: PASS

## Original Review

# Peer Review: bs-skill-forge — Advocate Review

**Reviewer Role**: ADVOCATE (arguing for the skill's quality)
**Date**: 2026-06-17
**Gate**: 2 — Peer Review
**Skill**: bs-skill-forge

---

## Overall Assessment

**Total Score: 92 / 100**

The bs-skill-forge SKILL.md is a strong, production-ready meta-skill. It enforces the complete TDD-for-skills lifecycle with rigorous gating, handles platform degradation gracefully, and integrates correctly into the 4-gate review pipeline. The standout feature is the tooling-bug detection logic in Step 6, which prevents the common failure mode of agents looping on false validation failures.

---

## Detailed Evaluation (10 criteria, 0-10 each)

### 1. TDD-for-Skills Methodology — 9/10

**Hard Rule 7** establishes the RED → GREEN → REFACTOR loop explicitly. Step 5 then operationalizes it:

- **RED Phase**: Write test prompts before validation. Run baseline (or document predicted failure if platform cannot toggle skills). This is well-specified — it covers both the ideal case (actual baseline runs) and the constrained case (platform without skill toggling).
- **GREEN Phase**: Document verification plan for each test prompt. Compare output against expected behavior. Return to drafting if output does not match.
- **REFACTOR Phase**: Adversarial reading. "If I were a lazy agent, how would I exploit this skill?" Close the loopholes. This is well-phrased — it frames the task in a way agents can execute.

The one point deducted: The REFACTOR phase could benefit from a structured checklist (e.g., "Check for: missing exit conditions, ambiguous language, unstated assumptions") rather than only the open-ended adversarial prompt. The adversarial prompt is good but could produce inconsistent results depending on the agent's creativity.

### 2. Reference-vs-Build Gate (Step 0) — 9/10

Step 0 correctly prevents duplicate skills by checking `external/sources.yaml` before any user questions. The workflow is clear:

1. Open `external/sources.yaml` and search for upstream skills in the same domain.
2. If found: present name, source, description to the user.
3. Explain REFERENCE vs BUILD.
4. Ask user to choose.
5. If REFERENCE: follow CLAUDE.md reference workflow. If BUILD: proceed to Step 1.

This gate is correctly positioned BEFORE Step 1 (Understand the Skill), which means the agent never invests time understanding a skill that should be referenced instead.

The one point deducted: The gate only checks `external/sources.yaml`. It does not check whether a comparable self-developed skill already exists in `skills/`. However, this is arguably intentional — self-developed skill overlap is a different concern (functional overlap vs. name collision), and the name collision check in Step 4 handles exact name conflicts. Still, a note about checking `skills.json` self-developed entries for functional overlap would strengthen this gate.

### 3. Pattern Selection (Step 3) — 8/10

The pattern selection process is structured and has good fallback handling:

- **Required patterns** (3): TDD for skills, Progressive disclosure, Hard rules first.
- **Strongly recommended** (at least 1 of 2): Pattern library integration, Platform degradation rules.
- **Optional**: up to 1-2 more from the full library.

The fallback for an inaccessible pattern library is well-designed: proceed with required patterns only, document the limitation, report to the user.

The routing cycle check ("If the skill includes auto-routing rules, verify that routing targets do not create cycles") is a thoughtful addition that prevents a subtle class of bugs.

Two points deducted:

1. The range "3-5 patterns" is misleading. With 3 required + at least 1 strongly recommended, the agent has at most 1 truly free choice. A skill could end up with only 4 patterns (the 3 required + 1 recommended), which is within the 3-5 range but leaves no room for creative pattern discovery.

2. There is no mechanism for proposing NEW patterns not yet in the library. A skill might need a pattern that doesn't exist yet in `docs/patterns/README.md`, and the current instructions don't cover this case.

### 4. Draft Structure — 9/10

The 11-section template is comprehensive:

1. Frontmatter (name, description, tier)
2. Hard Rules
3. Purpose
4. Boundaries
5. Workflow (with step-by-step structure)
6. Patterns
7. Dependencies
8. Platform Degradation
9. Test Prompts
10. Registration
11. (Implicit: the skill body itself)

The writing guidelines are specific and actionable:
- Imperative mood
- Precise exit conditions
- CSO description format
- No vague language (with concrete replacements)
- No inline code blocks in workflow unless exact commands

The one point deducted: The template lists `## Dependencies` and `## Platform Degradation` as separate sections, but there is overlap between them. For example, a dependency on `jq` could be listed under both. A clarifying note about what goes where (Dependencies = external tools/packages; Platform Degradation = agent platform capabilities) would help, though the distinction is implied by the section descriptions.

### 5. Validation Integration (Step 6) — 10/10

This is the strongest section of the skill. It handles three scenarios with precise protocols:

**Normal case**: Run validate.sh, fix failures, re-run, repeat until zero failures.

**Tooling false positive**: The "Distinguishing Skill Defects from Tooling Bugs" subsection provides a 4-step protocol:
1. Confirm it's a tooling bug by checking validate.sh source.
2. Document with `<!-- validate.sh false positive: <reason> -->` comment.
3. Report to the user.
4. Proceed (gate waived for confirmed tooling bugs only).

**Tooling crash/hang**: A separate protocol for when validate.sh exits with non-zero but produces no FAIL lines. Report to user, ask whether to proceed or fix tool first. Critically, it says "Do NOT modify the skill" in this case.

This prevents the infinite-loop failure mode where an agent keeps "fixing" a valid skill because the validation tool is broken. The distinction between false positives (skill is fine, tool is wrong) and crashes (tool is broken, can't confirm either way) is precise and well-reasoned.

### 6. Review Pipeline Integration (Step 7) — 9/10

Step 7 correctly feeds into the 4-gate pipeline from CLAUDE.md:

1. **Self-Review**: Already completed via validate.sh in Step 6.
2. **Peer Review**: Launch 2 sub-agents (advocate + adversary).
3. **Pattern Alignment**: Verify pattern usage and source attributions.
4. **Baseline Test**: Run test prompts from Step 5 against no-skill baseline.

The review recording instruction (`docs/reviews/<skill-name>/YYYY-MM-DD-review.md`) matches CLAUDE.md conventions.

The user waiver clause is well-designed: "Skipping review gates means this skill may contain undetected issues. Proceed anyway?" — it warns but defers to the user, which is appropriate for a tool (not a dictator).

The one point deducted: Step 7 says "Do not proceed to Step 8 until all 4 gates pass" but does not specify how the agent should verify that gates 2-4 have passed. The agent itself is supposed to launch the sub-agents for gate 2 and perform gates 3-4, but there is no explicit instruction to wait for sub-agent completion or to document the results before proceeding. A minor clarity issue.

### 7. Registration (Step 8) — 9/10

The registration instructions are correct and complete:

- The JSON structure matches the existing entries in skills.json exactly (path, batch, tier, patterns, status).
- Batch selection guidance checks for `"status": "active"` in skills.json batches, which is correct — batch-1 is currently active.
- The `.gitkeep` removal step is included.
- The skill must be added to BOTH `skills.self-developed` AND the batch's `skills` array.

The one point deducted: The instructions say "Confirm the skill name also appears in the appropriate batch under `batches.<batch-N>.skills`" but don't provide the exact JSON path for this update. For an agent that hasn't seen skills.json before, the distinction between `batches.batch-1.skills` (an array) and `skills.self-developed.<name>` (an object) might be unclear. A small example would help.

### 8. Platform Degradation Rules — 9/10

Five fallback scenarios, all practical:

| Missing Capability | Fallback |
|---|---|
| Sub-agent spawning | Run steps sequentially in main agent context |
| Blocking user prompts (AskUserQuestion) | Inline questions with "STOP and answer" markers |
| Worktree isolation | Timestamped subdirectory under `.claude/tmp/` |
| Parallel tool calls | Serialize + document with `## Parallel Execution Note` |
| File watching / monitors | Poll on 5-second interval, max 20 iterations |

Each fallback is concrete and implementable. The polling fallback is well-bounded (100 seconds max), preventing infinite polling loops.

The one point deducted: The table is present but there is no explicit instruction telling the agent WHEN to apply these fallbacks. The agent must infer that it should check platform capabilities before relying on any of these features. A sentence like "Before using any of these capabilities, verify the platform supports them. If not, apply the stated fallback." would make this more robust.

### 9. Test Prompts Quality — 10/10

Three test prompts that comprehensively cover the skill's behavior:

**Prompt 1 (Happy Path)**: "Create a skill called 'code-formatter'..." — Tests the full 8-step workflow end-to-end. Expected behavior describes all steps. Failure mode (one-off instruction block with no validation) is realistic and specific.

**Prompt 2 (Edge Case — Ambiguous Scope)**: "Make a skill for code reviews." — Tests the clarification workflow (Step 1). The prompt is genuinely ambiguous (what type? what depth? what trigger?), and the expected behavior correctly describes one-question-at-a-time resolution. Also tests the "user already provided answers" optimization path.

**Prompt 3 (Adversarial — Skip Validation)**: "Create a quick skill... Don't bother with tests or validation..." — Tests Hard Rules 5 and 6 enforcement. The expected behavior (agent refuses, cites specific rules) is precise. The failure mode (agent complies, producing untested skill) is exactly what the skill is designed to prevent.

All three prompts include both expected behavior WITH the skill and failure mode WITHOUT the skill, which is exactly what the TDD-for-skills methodology requires.

### 10. Name Collision Detection — 10/10

Step 4's "Name Collision Check" subsection is thorough:

1. Search `skills.json` for the name in BOTH `skills.self-developed` AND `skills.external`.
2. Check if `skills/<skill-name>/` directory already exists.
3. If collision found: warn user with exact path. "A skill named '<name>' already exists at <path>. Overwrite or choose a different name?"
4. Block until user resolves: "Do not proceed until the user resolves the collision."

This covers all collision types: self-developed name conflict, external reference name conflict, and filesystem directory conflict. The blocking behavior (step 4 of the protocol) correctly prevents the agent from proceeding with an ambiguous write.

Additionally, Hard Rule 8 reinforces this: "Check for name collisions before writing. Before creating any files, check skills.json and the skills/ directory..." — so the check is doubly enforced (both in the Hard Rules and in the workflow step).

---

## Strongest Aspect

**Validation Integration with Tooling Bug Detection (Step 6)**. This is the most innovative and robust part of the skill. Most skills would simply say "run validate.sh and fix failures." Skill-bootstrap goes much further by:

1. Distinguishing between skill defects and tooling bugs.
2. Providing separate protocols for false positives vs. tool crashes.
3. Including a documentation mechanism (`<!-- validate.sh false positive -->` comments).
4. Preventing the infinite-loop failure mode where agents keep "fixing" valid skills.

This attention to meta-level failure modes (the tool that validates skills can itself be broken) demonstrates the kind of thoroughness that makes a meta-skill valuable. It is exactly the sort of thing a naive agent would miss, and exactly the sort of thing this skill is designed to catch.

---

## One Improvement

**Add a mechanism for proposing new patterns.** Step 3 currently requires selecting patterns from the existing library. If a skill needs a pattern that does not yet exist in `docs/patterns/README.md`, the agent has no path forward. Consider adding a clause like:

> If you identify a pattern need that does not exist in the library, document it in the `## Patterns` section as a "Candidate Pattern" with: (1) proposed name, (2) description of what it does, (3) why existing patterns don't cover this need. Proceed with existing patterns for the required/recommended slots, but flag the gap for the Pattern Alignment review gate.

This would make the pattern selection process generative (adding to the library) rather than purely consumptive (reading from it).

---

## Production-Readiness: YES

The bs-skill-forge SKILL.md is production-ready. It:

- Has a clear, well-scoped purpose (creating new skills from scratch).
- Enforces quality gates at every step (Reference-vs-Build, validation, review pipeline).
- Handles edge cases (name collisions, inaccessible pattern library, broken tooling).
- Degrades gracefully on constrained platforms (5 fallback scenarios).
- Integrates correctly with the surrounding ecosystem (skills.json, validate.sh, CLAUDE.md review pipeline).
- Includes self-referential quality: the skill itself follows the patterns it mandates (Hard Rules First, Progressive Disclosure, TDD-for-skills with test prompts).

The one improvement noted above (new pattern proposal mechanism) is a feature enhancement, not a blocking issue.

---

## Summary

| Criterion | Score |
|---|---|
| 1. TDD-for-Skills Methodology | 9/10 |
| 2. Reference-vs-Build Gate (Step 0) | 9/10 |
| 3. Pattern Selection (Step 3) | 8/10 |
| 4. Draft Structure | 9/10 |
| 5. Validation Integration (Step 6) | 10/10 |
| 6. Review Pipeline Integration (Step 7) | 9/10 |
| 7. Registration (Step 8) | 9/10 |
| 8. Platform Degradation Rules | 9/10 |
| 9. Test Prompts Quality | 10/10 |
| 10. Name Collision Detection | 10/10 |
| **Total** | **92/100** |

**Verdict**: PASS. This skill is well-constructed, handles edge cases thoroughly, and is ready for deployment. The Step 6 tooling-bug detection logic is a standout feature that elevates the skill beyond a simple workflow script into a robust meta-tool.
