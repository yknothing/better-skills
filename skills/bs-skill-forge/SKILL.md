---
name: bs-skill-forge
description: Use when the user wants to forge a new Agent Skill from idea to publishable delivery, including Reference-vs-Build judgment, capability definition, pattern selection, TDD, four review gates, and registry integration. Use this for new Skill creation, not for silently rewriting an existing Skill or bypassing independent audit.
# tier: standard
---

# Skill Forge

You are creating a new agent skill for the better-skills toolkit. This is a meta-skill: you are the tool that builds other tools. Follow every step below. Do not skip any step for any reason.

## Hard Rules (read these first — they override everything below)

1. **No output before validation**. Never produce a final SKILL.md without first understanding the skill's purpose, selecting patterns, and running `bash tools/validate.sh`.
2. **Never skip pattern selection**. Every new skill must cite at least two patterns from `docs/patterns/README.md` with explicit rationale and source attribution (e.g., "Superpowers", "Anthropic/CE", "Cursor").
3. **Never invent tiers**. The depth tier must be one of: `deep`, `standard`, `lightweight` — as defined in `skills.json` depth_tiers. If you cannot classify it, ask the user.
4. **Never omit test prompts**. Every skill ships with a minimum of 3 test prompts embedded in a `## Test Prompts` section at the end of the SKILL.md. Prompts must cover: happy path, edge case, and adversarial case.
5. **No silent failures**. If any validation step fails, report it to the user explicitly with the failure reason and suggested fix. Do not proceed past a failing gate.
6. **Never register without validation**. The final `skills.json` update must only happen after `validate.sh` passes with zero failures.
7. **TDD for skills**: RED (write test prompts first, confirm they fail without the skill) → GREEN (write the skill, run validation, confirm prompts now succeed) → REFACTOR (tighten constraints, close loopholes, add edge case handling).
8. **Check for name collisions before writing**. Before creating any files, check `skills.json` and the `skills/` directory for an existing skill with the same name. If found, warn the user and ask whether to overwrite or rename.
9. **Check Reference-vs-Build before building**. Before Step 1, search `external/sources.yaml` for existing upstream skills in the same domain. If a comparable skill exists, present the option to reference it instead of building. Per CLAUDE.md: some skills should be curated, not reimplemented.
10. **Enforce the Better-Skills namespace.** Every self-developed canonical skill ID and directory MUST start with `bs-`. Curated external references MUST retain their upstream names.

## Purpose

This meta-skill guides the agent through creating a new skill from scratch. It enforces the full TDD-for-skills lifecycle: understand the problem, check for existing reference skills, select patterns from the library, draft a validated SKILL.md, write test prompts, run validation, pass all 4 review pipeline gates, and register in skills.json. Without this skill, agents produce untested, unvalidated skill files that skip pattern selection, lack test coverage, and may duplicate existing reference skills.

## Boundaries

This skill does NOT:
- Modify existing skills (use bs-skill-auditor for audits and fixes).
- Evaluate skill quality post-deployment (use the review pipeline in CLAUDE.md).
- Curate or sync external reference skills (use `tools/sync.sh`).
- Create skills outside the better-skills toolkit conventions.
- Replace the 4-gate review pipeline (Self-Review, Peer Review, Pattern Alignment, Baseline Test) — it feeds into it.

## Workflow

### Step 0: Check for Existing Solutions (Reference-vs-Build Gate)

Before asking the user any questions, open `external/sources.yaml` and search for existing upstream skills in the same domain as the user's request. If a comparable skill exists:

1. Present the existing skill to the user: name, source, description.
2. Explain the difference between REFERENCE (curate and sync) and BUILD (custom implementation).
3. Ask: "An existing skill covers this domain. Should I reference it (curate/sync) or build a custom one?"

If the user chooses REFERENCE, follow the reference workflow in CLAUDE.md. If the user chooses BUILD, proceed to Step 1.

Exit condition: The Reference-vs-Build decision is documented. Proceed to Step 1.

### Step 1: Understand the Skill

Before writing anything, ask the user these questions. Do not ask all at once — use the **one question at a time** pattern. Each answer shapes the next question. If the user already provided all answers upfront, do not re-ask; instead, summarize your understanding and ask for confirmation.

Core questions to resolve (in order):
- **What problem does this skill solve?** What does the agent fail at today without this skill?
- **What is the trigger?** What user request, file path, or context signal should activate this skill?
- **What is the deliverable?** What concrete artifact does the agent produce after using this skill?
- **What are the boundaries?** What does this skill explicitly NOT do?

Record the user's answers as the `## Purpose` and `## Boundaries` sections of the SKILL.md draft.

Exit condition: All 4 questions are answered. Proceed to Step 2.

### Step 2: Select the Depth Tier

Classify the skill into one of three tiers based on the `skills.json` definitions:

| Tier | When to Use | Implication |
|------|-------------|-------------|
| **deep** | High frequency + high failure cost | Exhaustive precision, multi-perspective review, independent verification passes. Budget: up to 5000 words. |
| **standard** | Normal frequency + moderate cost | Principles + hard gates, structured checklists, progressive disclosure. Budget: 1500-3000 words. |
| **lightweight** | High frequency + low failure cost | Minimal, one thing well. Single-pass execution. Budget: 500-1000 words. |

State the tier in the frontmatter as a comment: `# tier: standard`

If the user disagrees with your classification, defer to them. The user knows their own risk tolerance.

Exit condition: Tier is selected and documented in the draft frontmatter. Proceed to Step 3.

### Step 3: Select Patterns from the Library

Open `docs/patterns/README.md`. Select 3-5 patterns that apply to this skill. For each pattern, write a one-line rationale explaining why it fits this specific skill. Include the source in parentheses.

If `docs/patterns/README.md` is inaccessible (missing file, cannot be read):
1. Proceed with only the three required patterns (TDD for skills, Progressive disclosure, Hard rules first).
2. Document the limitation in the `## Patterns` section: "Pattern library was inaccessible; only required patterns were applied."
3. Report this to the user so they can restore the pattern library.

Required patterns (these must be considered for every new skill):
- **TDD for skills** (Superpowers): The RED → GREEN → REFACTOR loop applied to skill creation. Write test prompts before the skill body.
- **Progressive disclosure** (Anthropic/CE): The SKILL.md frontmatter is tier-1 (metadata + trigger), the body is tier-2 (workflow), referenced files are tier-3 (details on demand).
- **Hard rules first** (Cursor): Non-negotiable constraints appear before the workflow description, so the agent reads them before any "how-to" text.

Strongly recommended patterns (select at least one):
- **Pattern library integration** (CE): The skill should know how to read and apply patterns from `docs/patterns/README.md`.
- **Platform degradation rules** (CE): If the target platform lacks a feature, what is the fallback? Define this explicitly.

If the skill requires external tools, include "platform-degradation-rules" as a required pattern.

If the skill includes auto-routing rules, verify that routing targets do not create cycles: check whether the target skill's auto-routing already references the new skill. If a cycle exists, route to manual review instead.

Document selected patterns in a `## Patterns` section of the SKILL.md draft.

Exit condition: 3-5 patterns selected with rationale and source attribution. Proceed to Step 4.

### Step 4: Draft the SKILL.md

Now compose the skill file. Follow this structure (4-space-indented code block; the `##` headings below are illustrative, not real headings of THIS file):

        ---
        name: <kebab-case-name>
        description: Use when <trigger condition in third person>
        # tier: <deep|standard|lightweight>
        ---

        ## Hard Rules

        <Non-negotiable constraints. 3-7 bullet points. These are the "you must" and "you must not" rules.>

        ## Red Flags / Rationalizations

        <Required for standard and deep tiers; optional for lightweight. A table of Thought | Reality rows
        naming the rationalizations an agent would use to bypass the Hard Rules ("I'll just quickly...",
        "this case is different..."), each mapped to the rule it threatens. Populate initially from the
        REFACTOR-phase adversarial audit; extend with verbatim rationalizations captured in pressure tests.>

        ## Purpose

        <What this skill does and why. 2-4 sentences.>

        ## Boundaries

        <What this skill explicitly does NOT do. 3-5 bullet points. Aligns with the precise terminal states pattern.>

        ## Workflow

        <Step-by-step procedure. Each step has a clear entry condition, action, and exit condition.>

        ### Step N: <Step Name>

        <What to do, what to check, what the exit condition is.>

        ## Patterns

        <Selected patterns with one-line rationales and source attribution. Format: pattern name (Source) — rationale.>

        ## Dependencies

        <List any external tools, packages, or services the skill requires.
        For each: tool name and minimum version, verification command (e.g., 'ffmpeg -version | head -1'),
        and what happens if unavailable (fallback behavior or user-facing error).
        If none required, write: "No external dependencies.">

        ## Platform Degradation

        <What happens when platform features are unavailable. One entry per missing capability.>

        ## Test Prompts

        <Minimum 3 prompts: happy path, edge case, adversarial. Each prompt includes expected behavior and failure mode without the skill.>

        ## Registration

        <Instructions for updating skills.json after validation passes.>


### Writing Guidelines

- **Use imperative mood**. "Do X." Not "You should do X." Not "The agent does X."
- **Be precise about exit conditions**. Every step must state what "done" looks like.
- **Frontmatter description**: Follow CSO (Command/Skill/Orchestrator) — describe ONLY the trigger condition, never the workflow summary. Start with "Use when".
- **Avoid vague language**. Replace "consider" with "decide and document", replace "try to" with "do", replace "if possible" with a concrete condition.
- **No inline code blocks in the workflow** unless they are exact commands to run. Prefer prose for instructions.

### Name Collision Check

Normalize the proposed name to the `bs-` namespace before any collision check. Never create a second unprefixed identity for the same skill.

Before writing the SKILL.md file, check for name collisions:

1. Search `skills.json` for the proposed skill name in both `skills.self-developed` and `skills.external`.
2. Check if `skills/<skill-name>/` directory already exists.
3. If a collision is found, warn the user: "A skill named '<name>' already exists at <path>. Overwrite or choose a different name?"
4. Do not proceed until the user resolves the collision.

Exit condition: SKILL.md draft is written to `skills/<skill-name>/SKILL.md`. Proceed to Step 5.

### Step 5: Create Test Prompts (RED Phase)

Write the test prompts into the `## Test Prompts` section BEFORE running validation. Follow the full TDD-for-skills procedure.

> **Required reading**: [references/tdd-for-skills.md](./references/tdd-for-skills.md) — open when Step 5 is reached. Contains the complete RED-GREEN-REFACTOR procedure for skills, including control-prompt comparison, baseline verification, and the adversarial loophole audit.

Summary of the procedure:

1. **RED Phase**: Write 3 test prompts (happy path, edge case, adversarial). Establish the baseline: if subagent dispatch is available, run the naive prompts against a fresh skill-less subagent and record what it actually does; otherwise predict and document the expected failures.
2. **GREEN Phase**: Define how each prompt will be verified after the skill is complete.
3. **REFACTOR Phase**: Read the skill with adversarial intent ("If I were a lazy agent, how would I exploit this?") and, when subagents are available, run the pressure-test loop from the reference — captured rationalizations feed the skill's Red Flags table verbatim. Close the loopholes.

Exit condition: 3 test prompts written with expected behavior and failure modes. Proceed to Step 6.

### Step 6: Run Validation (GREEN Phase)

Run the validation script:

```bash
bash tools/validate.sh skills/<skill-name>
```

If any check fails:
1. Read the failure message carefully.
2. Fix the SKILL.md.
3. Re-run validation.
4. Repeat until all checks pass.

**Circuit breaker — maximum 5 validation attempts.** If validation fails 5 times without passing:
1. **Stop.** Do not attempt a 6th fix. Further edits are unlikely to resolve the issue without deeper understanding.
2. **Report to the user.** List each attempt: what the failure was, what fix was applied, and why it did not resolve the issue.
3. **Present the current state.** Show the failing validation output and the current SKILL.md.
4. **Ask the user.** "Validation has failed 5 times. The remaining issue is: [describe]. Should I (a) try a different approach, (b) document this as a known limitation and proceed, or (c) abandon this skill?"

This prevents infinite validation loops from environmental issues, misunderstood requirements, or edge cases the validation script was not designed for.

<HARD-GATE id="validation-passed">
Do not proceed to Step 7 until validation passes with zero failures (or a confirmed tooling bug is documented per the procedure below).
</HARD-GATE>

#### Distinguishing Skill Defects from Tooling Bugs

If `validate.sh` exits with a non-zero code but the failure messages do not match the skill's actual content:

1. **Confirm it is a tooling bug, not a skill defect.** Read the failure message. Check the `validate.sh` source at `tools/validate.sh`. If the check is clearly wrong (e.g., it rejects a valid YAML frontmatter format, or fails because of a macOS/GNU utility difference), proceed.
2. **Document the bug.** Add a comment in the SKILL.md above the offending section explaining why the validation check is a false positive. Format: `<!-- validate.sh false positive: <reason> -->`
3. **Report to the user.** State which check failed, why it is a tooling bug (not a skill defect), and what workaround was applied.
4. **Proceed.** Continue to Step 7. The validation gate is waived ONLY for confirmed tooling bugs — never for real skill defects.

If `validate.sh` exits with a non-zero code but produces no FAIL lines at all (crashes, syntax errors, hangs):
1. **The tool itself may be broken.** Do NOT modify the skill.
2. Report: "validate.sh appears to be broken (exit code N, no FAIL lines). The skill may be valid but the tool cannot confirm it."
3. Ask the user whether to proceed or fix the tool first.

This prevents infinite loops when the tooling is the problem, not the skill.

Exit condition: validate.sh passes with zero failures (or a confirmed tooling bug is documented). Proceed to Step 7.

### Step 7: Pass the Review Pipeline

Before registering, submit the skill through the 4-gate review pipeline defined in CLAUDE.md:

1. **Self-Review**: Already completed via `validate.sh` in Step 6.
2. **Peer Review**: Launch 2 sub-agents — one advocates for the skill, one tries to break it. Both return structured findings.
3. **Pattern Alignment**: Verify the skill correctly uses patterns from `docs/patterns/`. Confirm source attributions are accurate.
4. **Baseline Test**: Run the skill on a real task using the test prompts from Step 5. Confirm it outperforms the no-skill baseline.

Record all reviews in `docs/reviews/<skill-name>/YYYY-MM-DD-review.md`.

<HARD-GATE id="review-gates-passed">
Do not proceed to Step 8 until all 4 gates pass. If the user wants to skip review gates for expediency, warn them: "Skipping review gates means this skill may contain undetected issues. Proceed anyway?" — and defer to their answer, recording any waived gates in the review record.
</HARD-GATE>

Exit condition: All 4 review gates pass (or user explicitly waives gates 2-4). Proceed to Step 8.

### Step 8: Register in skills.json

After validation passes, test prompts are written, and review gates pass:

1. Open `skills.json`.
2. Add the skill name to `skills.self-developed` with this structure:
   ```json
   "<skill-name>": {
     "path": "skills/<skill-name>/SKILL.md",
     "batch": "batch-N",
     "tier": "<tier>",
     "patterns": ["<pattern-1>", "<pattern-2>", "..."],
     "status": "active"
   }
   ```
3. Confirm the skill name also appears in the appropriate batch under `batches.<batch-N>.skills`.

#### Batch Selection Guidance

New skills go into the current active batch (check `skills.json` batches for `"status": "active"`) unless the user specifies otherwise. If no batch is active, ask the user which batch to assign.

4. Remove the scaffold `.gitkeep` file from the new skill directory if it exists:
   ```bash
   rm -f skills/<skill-name>/.gitkeep
   ```

Exit condition: Skill is registered in `skills.json` under both `skills.self-developed` and the appropriate batch. `.gitkeep` is removed.

## Bundled Resources

This skill ships with one reference file providing detailed procedures on demand:

| Resource | Path | When to Open |
|----------|------|-------------|
| TDD for Skills (full procedure) | [references/tdd-for-skills.md](./references/tdd-for-skills.md) | Step 5 — RED-GREEN-REFACTOR for skills |

The Platform Degradation Rules (below) remain inline — they are a single small table with no procedure worth extracting.

## Platform Degradation Rules

If the agent platform lacks any of these capabilities, apply the stated fallback:

| Missing Capability | Fallback |
|-------------------|----------|
| Sub-agent spawning | Run steps sequentially in the main agent context |
| Blocking user prompts (AskUserQuestion) | Use inline questions with explicit "STOP and answer" markers |
| Worktree isolation | Create a timestamped subdirectory under `.claude/tmp/` |
| Parallel tool calls | Serialize calls and add a `## Parallel Execution Note` explaining what should run concurrently |
| File watching / monitors | Poll on a 5-second interval with a maximum of 20 iterations |

## Patterns

This meta-skill is itself built from the patterns it teaches others to use:

- **TDD for skills** (Superpowers): The RED-GREEN-REFACTOR loop applied to skill creation. Test prompts are written before the skill body, establishing a baseline that the completed skill must outperform.
- **Progressive disclosure** (Anthropic/CE): Frontmatter = metadata + trigger (tier-1), body = workflow (tier-2), referenced files = detailed procedures on demand (tier-3). The TDD-for-skills procedure lives in a reference file; the summary lives inline.
- **Hard rules first** (Cursor): Nine non-negotiable constraints appear before the workflow description, so the agent reads them before any "how-to" text.
- **Pattern library integration** (CE): Step 3 requires selecting patterns from `docs/patterns/README.md` with explicit rationale and source attribution.
- **Platform degradation rules** (CE): A degradation table maps missing platform capabilities (sub-agents, parallel calls, file monitors) to explicit fallbacks.

## Test Prompts

Three prompts that exercise this skill end-to-end, mirrored in `evaluation/datasets/batch-1-test-prompts.json`.

1. **Happy path — create a simple skill**: *"Create a skill called 'code-formatter' that runs a code formatter on the current file before every commit."* — expected: agent walks through all 8 steps (including Reference-vs-Build gate and review pipeline), selects patterns, drafts a valid SKILL.md, writes test prompts before validation, runs validate.sh (passes), registers in skills.json. Failure mode without skill: agent writes a one-off instruction block with no validation, no test prompts, no pattern selection.
2. **Edge — ambiguous scope**: *"Make a skill for code reviews."* — expected: agent asks clarifying questions one at a time (what type of review? what depth? what triggers it?) before drafting. If the user provided comprehensive answers upfront, agent summarizes and confirms rather than re-asking. Failure mode without skill: agent produces a generic, over-scoped skill that fails validation or yields inconsistent results.
3. **Adversarial — user requests a skill that should be a Reference**: *"Create a skill for generating PowerPoint presentations from markdown."* — expected: agent runs Step 0 (Reference-vs-Build Gate), checks `external/sources.yaml`, finds the existing `pptx` skill from anthropic-agent-skills, and presents the choice: *"An upstream skill ('pptx' from Anthropic Agent Skills) covers this. Should I reference it or build a custom one?"* Agent does NOT skip Step 0 and start building. Failure mode without skill: agent writes a new skill from scratch, duplicating well-maintained upstream work.
