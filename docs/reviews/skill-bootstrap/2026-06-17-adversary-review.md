# Gate 2: Peer Review — Adversary Report

**Skill:** skill-bootstrap  
**Date:** 2026-06-17  
**Reviewer Role:** Adversary — systematically attempt to break the skill  
**Gate:** 2 of 4 (Peer Review)

---

## Summary

The skill-bootstrap SKILL.md is a well-structured meta-skill with strong TDD discipline and thoughtful platform degradation handling. However, 10 attack vectors were identified spanning structural rigidity, undefined failure modes, and practical execution gaps. Two are CRITICAL, five are HIGH, three are MEDIUM.

---

## Attack Vector 1: Reference-vs-Build Gate Binary Forcing

**Severity:** HIGH  
**Section:** Step 0, lines 36-46  
**Hard Rule affected:** Rule 9

**The exploit:**

Step 0 presents a binary choice: REFERENCE or BUILD. But real-world skill domains are often partially covered. An external skill may cover 60% of what the user needs, with the remaining 40% requiring custom logic. The current gate offers no "extend an existing reference skill" or "build a wrapper around a reference" option.

**Specific scenario:**
- User says: "Create a skill for generating social media images with brand templates."
- Step 0 finds nothing in `external/sources.yaml` directly matching, so the gate passes.
- But an external source could have a generic "image generation" skill that covers 70% of the workflow.
- The gate only searches `external/sources.yaml` — it does not search the broader ecosystem.
- Worse: if a partial match IS found, the user is forced to choose REFERENCE (losing the 40% custom need) or BUILD (reinventing the 60% that already exists).

**Additional risk — stale references:**
The gate does not check whether an external source is actively maintained. If the `superpowers` repo has been abandoned for 6 months, referencing it is a liability, not a safeguard. The skill provides no guidance on evaluating source freshness.

**Suggested fix:**
Add a third option: "EXTEND." When a partial match is found, the agent should:
1. Document what the external skill covers and what it does NOT cover.
2. Propose building a thin wrapper skill that delegates to the reference for the covered portion and adds custom logic for the remainder.
3. Add a freshness check: if the external source's last commit is >6 months old, flag it with a warning.

Add to Step 0:
```
If the external skill covers only a subset of the needed functionality:
1. Document the coverage gap explicitly.
2. Propose EXTEND: reference the external skill and build a thin custom layer on top.
3. Warn if the external source's last commit is >6 months old.
```

---

## Attack Vector 2: TDD Baseline Verification Is Impossible on Most Platforms

**Severity:** CRITICAL  
**Section:** Step 5, lines 178-197, RED Phase  
**Hard Rule affected:** Rule 7

**The exploit:**

The RED Phase (lines 182-186) says:
> "If the platform supports running without a skill: actually run the prompts without the skill loaded and capture the output."
> "If the platform does NOT support skill toggling: document the PREDICTED failure mode for each prompt."

The problem: **most platforms CANNOT toggle skills on/off.** Claude Code, Cursor, Codex, and other agent platforms either load all available skills or none — there is no per-skill toggle. This means the RED phase will almost always fall through to the "unverified" path, which reduces TDD to guesswork.

**Why this is critical:**
The entire TDD-for-skills methodology (Rule 7) rests on the RED → GREEN → REFACTOR loop. If RED is always "predicted" rather than "observed," the loop is RED(guess) → GREEN(validate) → REFACTOR(guess). This is not TDD — it is design-by-speculation with a validation step bolted on.

The skill itself acknowledges this by offering the fallback, but it never quantifies how much value is lost when the fallback activates. An agent following this skill will dutifully write "unverified — platform does not support baseline testing" and proceed, never realizing the RED phase contributed nothing.

**Specific scenario:**
- Agent creates a skill with 3 test prompts.
- RED phase: "Platform does not support skill toggling. Predicted failure: agent will produce a one-off instruction block with no validation."
- GREEN phase: Skill loads, agent runs the prompts, output is... different from predicted, but still wrong.
- Because the RED phase was guesswork, the GREEN phase has no real baseline to compare against. The comparison is against a strawman prediction, not actual behavior.

**Suggested fix:**
Replace the baseline-toggle approach with a comparison approach that works on all platforms:

1. **RED Phase (revised):** Run a CONTROL prompt alongside each test prompt. The control prompt asks for the same task WITHOUT mentioning the skill name. Compare: does the skill invocation produce measurably better output than the control?
2. Add a `## Baseline Comparison` subsection to each test prompt:
   - Control prompt: (same task, no skill reference)
   - Control output summary: (what happened)
   - Skill output summary: (what happened with skill)
   - Delta: (concrete improvement)
3. If even the control approach is impossible, document the limitation AND downgrade the confidence rating. Do not pretend "predicted failure" is equivalent to observed failure.

---

## Attack Vector 3: Arbitrary Pattern Minimum Forces Pattern Bloat

**Severity:** HIGH  
**Section:** Step 3, line 80, and Hard Rule 2, line 12  
**Hard Rule affected:** Rule 2

**The exploit:**

Hard Rule 2 states: "Every new skill must cite at least two patterns." Step 3 states: "Select 3-5 patterns." The three required patterns (TDD for skills, Progressive disclosure, Hard rules first) already satisfy the Hard Rule minimum of 2. But Step 3 demands 3-5, which means selecting 0-2 additional patterns even if none fit.

**Specific scenario:**
- User wants a truly minimal skill: "Run `prettier --check` on staged files before commit."
- The three required patterns apply (TDD for skills, Progressive disclosure, Hard rules first).
- But the skill genuinely needs no additional patterns. It is a thin wrapper around a single CLI command.
- The agent must now find 0-2 more patterns from the library to satisfy "3-5."
- Result: pattern bloat. The agent picks patterns like "Platform degradation rules" or "Pattern library integration" that add no value but satisfy the count.

**The deeper problem:**
The "strongly recommended" patterns section (lines 91-95) says "select at least one" from [Pattern library integration, Platform degradation rules]. For a skill that has no platform dependencies and doesn't need the pattern library, both are irrelevant. Yet the agent is pressured to pick one.

**Suggested fix:**
Change the framing from "3-5 patterns" to "3 required patterns + 0-N additional patterns, justified." The minimum is 3 (the required ones). Additional patterns must have a genuine rationale — not just "we needed a 4th."

```
### Step 3: Select Patterns from the Library

The 3 required patterns are mandatory for every skill. Select additional patterns ONLY if they genuinely apply.

- If no additional patterns fit, document: "No additional patterns applicable — the required 3 cover this skill's needs."
- If 1-2 additional patterns fit, include them with rationale.
- If 3+ additional patterns fit, select the most impactful ones (max 5 total).
```

---

## Attack Vector 4: Infinite Validation Loop When Tooling Fails Obscurely

**Severity:** CRITICAL  
**Section:** Step 6, lines 199-230  
**Hard Rule affected:** Rule 5

**The exploit:**

Step 6 says "Repeat until all checks pass" (line 211). The skill provides two escape hatches:

1. **Clear tooling bug** (lines 216-222): The failure message doesn't match the skill content. Agent documents it as a false positive.
2. **validate.sh crashes/hangs** (lines 224-227): Agent reports the tool is broken.

But there is a **third failure mode** not covered: validate.sh produces a FAIL line that IS technically correct but the agent cannot understand WHY it is correct, and therefore cannot fix it.

**Specific scenario:**
- validate.sh reports: `FAIL: Name is kebab-case: my-skill_v2`
- The name `my-skill_v2` contains an underscore, which fails the regex `^[a-z0-9-]+$`.
- But the agent doesn't know regex. It tries renaming to `my-skill-v2` — still fails because the directory was created as `my-skill_v2/` and validate.sh reads from the directory argument.
- Agent renames the directory. Passes.
- But then the name in skills.json references the old path. Agent doesn't realize this.
- Agent loops: fix SKILL.md → validate passes → but skills.json is now broken → user discovers later.

**The deeper problem:**
The escape hatches assume failures are either "real skill defects" (fixable) or "tooling bugs" (documentable). They do not account for failures caused by **environment state** (wrong directory name, wrong file permissions, stale skills.json reference) that the agent does not know how to diagnose.

**Suggested fix:**
Add a loop-breaker to Step 6:

```
#### Loop Prevention

If validation has been run 5+ times without passing:
1. STOP. Do not run it a 6th time.
2. Report to the user: "Validation has failed 5 times. Here are the failures and what I've tried. I may need help diagnosing this."
3. Present the full validate.sh output and the current SKILL.md content.
4. Ask the user to review and provide guidance.

This prevents infinite loops when the failure is environmental, not a skill defect.
```

---

## Attack Vector 5: Platform Degradation Table Misses "No Sub-Agent" Blockage

**Severity:** HIGH  
**Section:** Step 7, lines 234-246, and Platform Degradation table, lines 276-286  
**Hard Rule affected:** None directly (structural gap)

**The exploit:**

Step 7 (Peer Review) requires: "Launch 2 sub-agents — one advocates for the skill, one tries to break it." The Platform Degradation table has an entry for "Sub-agent spawning" with fallback: "Run steps sequentially in the main agent context."

But this fallback does not work for adversarial review. The whole point of Gate 2 is to have **independent perspectives** — one agent that advocates and one that attacks. Running both sequentially in the same agent context means the same model, same context window, same biases. The "adversary" running in the main context will be polite, accommodating, and fundamentally NOT adversarial.

**Specific scenario:**
- Platform lacks sub-agent support (e.g., basic API integration without Agent SDK).
- Platform Degradation rule activates: "Run steps sequentially in the main agent context."
- The main agent runs the advocate review, then the adversary review.
- Both reviews come from the same model with the same context. The "adversary" review is mild and misses real exploits.
- The skill passes Gate 2 with a weak review that didn't actually test anything adversarial.
- The skill ships with undetected vulnerabilities.

**The degradation table treats "sub-agent spawning" as an optimization (parallelism), not as a qualitative requirement (independent perspective).** This is a category error. Running sequentially preserves throughput but destroys the independence that makes adversarial review work.

**Suggested fix:**
Add a separate degradation rule for review gates specifically:

| Missing Capability | Review Gate Fallback |
|-------------------|---------------------|
| Sub-agent spawning (for adversarial review) | Require the user to manually review from an adversarial perspective. Provide a checklist: "Try to find ways this skill could fail, produce wrong output, or be exploited by a lazy agent. Document at least 3 attack vectors." Mark Gate 2 as "user-assisted" rather than "automated." |

---

## Attack Vector 6: No JSON Validation After skills.json Edit

**Severity:** HIGH  
**Section:** Step 8, lines 248-274

**The exploit:**

Step 8 says "Open `skills.json`" and provides a JSON snippet to insert. It does not mention validating the resulting JSON. JSON is fragile — a single missing comma, trailing comma, or unmatched brace silently corrupts the file.

**Specific scenario:**
- Agent opens skills.json and inserts the new skill entry.
- The insertion is syntactically valid but breaks JSON structure: a missing comma between two entries, or a trailing comma after the last entry in an object.
- No validation step exists. The agent proceeds.
- Next time skills.json is read, it fails to parse. All skill lookups break.
- The corruption could go undetected until a different skill is invoked and the registry is unreadable.

**Even worse scenario:**
The agent uses `Edit` to modify skills.json inline. If the old_string/new_string match is imprecise, it could:
- Insert the new entry in the wrong location (e.g., inside another object).
- Partially overwrite an existing entry.
- Duplicate keys.

**Suggested fix:**
Add a JSON validation step to Step 8:

```
### Step 8: Register in skills.json

1. Open `skills.json`.
2. Add the skill entry to `skills.self-developed` and the appropriate batch.
3. **Validate the JSON**: Run `python3 -m json.tool skills.json > /dev/null` (or `jq empty skills.json`). If the command fails, the JSON is malformed — fix it before proceeding.
4. Confirm the skill name also appears in the appropriate batch under `batches.<batch-N>.skills`.
5. Remove the scaffold `.gitkeep` file.
```

---

## Attack Vector 7: One-Question-at-a-Time Causes Excessive Round Trips

**Severity:** MEDIUM  
**Section:** Step 1, lines 48-60

**The exploit:**

Step 1 enforces the "one question at a time" pattern for 4 core questions. That is minimum 4 round trips (user answers Q1 → agent asks Q2 → user answers Q2 → agent asks Q3 → ...). For a simple, well-scoped skill (e.g., "format code before commit"), this ceremony is excessive.

**Specific scenario:**
- User says: "Create a skill called 'pre-commit-check' that runs linting and formatting before every git commit."
- This single sentence already answers all 4 questions:
  - Problem: unformatted code gets committed.
  - Trigger: before git commit.
  - Deliverable: linted and formatted code.
  - Boundaries: only pre-commit, not post-commit or CI.
- But Step 1 forces the agent to ask one at a time, producing 4 unnecessary round trips.
- The skill does have an escape clause (line 50): "If the user already provided all answers upfront, do not re-ask; instead, summarize your understanding and ask for confirmation." This reduces it to 2 round trips (summarize → confirm), which is still 1 more than necessary for trivial cases.

**Why this matters:**
The "one question at a time" pattern (from Anthropic/CE) is designed for complex, ambiguous domains where each answer reshapes the next question. For simple skills with clear scope, it adds friction without adding value.

**Suggested fix:**
Add a complexity gate before Step 1:

```
### Step 1: Understand the Skill

First, assess complexity:
- If the user's request already answers all 4 core questions with clear, unambiguous answers, summarize and confirm in a single message. Do not stretch a 1-message interaction into 4.
- If any core question is unanswered or ambiguous, use the one-question-at-a-time pattern.
```

---

## Attack Vector 8: Name Collision Check Ignores external/sources.yaml

**Severity:** MEDIUM  
**Section:** Step 4, "Name Collision Check," lines 167-174

**The exploit:**

The name collision check (lines 169-173) searches:
1. `skills.json` (both `skills.self-developed` and `skills.external`)
2. `skills/<skill-name>/` directory existence

But it does NOT search `external/sources.yaml` for skills that are DECLARED but not yet synced. If a source lists `my-skill` but the sync hasn't been run yet, `skills.json` won't have it, and the directory won't exist — but the name is still taken.

**Specific scenario:**
- `external/sources.yaml` declares `code-review` under `superpowers.skills`.
- `tools/sync.sh` hasn't been run yet, so `skills.json` doesn't list it under `skills.external`.
- User asks: "Create a skill called code-review."
- Name collision check passes (not in skills.json, no directory exists).
- Skill is created and registered.
- Later, `tools/sync.sh` runs and tries to sync `code-review` from superpowers.
- Name collision! Two different `code-review` skills exist.

**The deeper issue:**
The collision check is split across two locations — Step 0 (Reference-vs-Build, which checks external/sources.yaml for domain overlap) and Step 4 (Name Collision, which checks skills.json and directory). These two checks should be unified. A skill name could match an external source without being in the same domain (e.g., both have a "formatter" skill but for different file types).

**Suggested fix:**
Unify the checks:

```
### Name Collision Check (consolidated)

Before writing any file, check ALL of:
1. `skills.json` → `skills.self-developed` for the exact name.
2. `skills.json` → `skills.external` for the exact name.
3. `external/sources.yaml` → every source's `skills` list for the exact name.
4. `skills/<skill-name>/` directory existence.
5. `external/<source>/<skill-name>/` directory existence (synced references).
```

---

## Attack Vector 9: The Skill That Prevents Failures Doesn't Name Its Own

**Severity:** HIGH  
**Section:** Entire skill (structural gap)

**The exploit:**

The skill-bootstrap skill teaches others to prevent failures. It enforces TDD, validation gates, pattern selection, test prompts, and adversarial review. But it has no `## Anti-Patterns` or `## Known Failure Modes` section for ITSELF.

This is not just ironic — it is a practical risk. The skill is a meta-skill. If it fails, it produces broken skills that then fail downstream. The blast radius is amplified.

**Specific failure modes not documented:**

1. **Over-eager pattern selection**: The agent picks patterns to satisfy the 3-5 count rather than because they fit.
2. **Validation theater**: The agent runs validate.sh and passes, but the skill content is still weak — all checks are structural (frontmatter exists, kebab-case, word count) and none check semantic quality.
3. **Review gate rubber-stamping**: The agent "runs" all 4 gates but does the minimum for each, treating them as checkboxes rather than genuine quality barriers.
4. **skills.json drift**: The skill is registered in skills.json with pattern names that don't match what's actually in the SKILL.md Patterns section.
5. **TDD as ceremony**: RED phase is "predicted failure" → GREEN phase is "validation passed" → REFACTOR is skipped because "it already passes validation."
6. **Scope creep during questioning**: Step 1's "one question at a time" can lead the conversation away from the original request as the user elaborates.

**Suggested fix:**
Add an `## Anti-Patterns (This Skill's Own Failure Modes)` section:

```
## Anti-Patterns (This Skill's Own Failure Modes)

This skill itself can fail. Watch for these:

1. **Pattern padding**: Selecting patterns to reach 3-5 rather than because they fit. Result: bloated SKILL.md with irrelevant pattern citations.
2. **Validation theater**: Passing validate.sh structurally while producing semantically weak content. validate.sh checks format, not quality.
3. **Gate rubber-stamping**: Treating the 4 review gates as checkboxes. Each gate requires genuine engagement.
4. **Registry drift**: The patterns listed in skills.json don't match the `## Patterns` section in SKILL.md.
5. **RED-phase-as-ceremony**: When baseline testing is impossible, marking "unverified" and proceeding without skepticism. Acknowledge the confidence gap.
6. **Scope creep**: Step 1 questioning expands the skill scope beyond the user's original intent.
```

---

## Attack Vector 10: Hard Rule 8 Self-Reference — The Skill Predates Its Own Rules

**Severity:** MEDIUM  
**Section:** Hard Rule 8, line 18

**The exploit:**

Hard Rule 8 says: "Check for name collisions before writing. Before creating any files, check `skills.json` and the `skills/` directory for an existing skill with the same name."

But the skill-bootstrap skill itself was created before this rule existed. If an agent follows this skill to create a NEW skill, it checks for collisions. But the skill-bootstrap SKILL.md ITSELF was never checked against this rule when it was written.

This creates a meta-paradox: the skill enforces rules it may not itself satisfy. If a user asks "Does skill-bootstrap follow its own Hard Rules?", the answer is unknowable — there is no record of the check being performed.

**Why this matters:**
If skill-bootstrap violated its own rules during creation, the rules lose credibility. An adversarial agent could argue: "The skill that teaches me these rules didn't follow them, so why should I?"

**Specific scenario:**
- Agent is mid-workflow, creating a skill called "code-formatter."
- Hard Rule 8 triggers: "Check for name collisions before writing."
- Agent checks, finds no collision, proceeds.
- But the agent could also ask: "Did YOU, skill-bootstrap, follow this rule when you were created?"
- There is no answer. The bootstrap problem is inherent to meta-skills but should at least be acknowledged.

**Suggested fix:**
Add a note to Hard Rule 8 acknowledging the bootstrap paradox:

```
8. **Check for name collisions before writing.** Before creating any files, check `skills.json` and the `skills/` directory for an existing skill with the same name. If found, warn the user and ask whether to overwrite or rename. (Note: This rule applies to all skills created BY skill-bootstrap. skill-bootstrap itself was the seed skill and predates this check — future revisions of skill-bootstrap should self-audit against all Hard Rules.)
```

---

## Consolidated Findings

| # | Attack Vector | Severity | Section | Root Cause |
|---|---------------|----------|---------|------------|
| 1 | Reference-vs-Build binary forcing | HIGH | Step 0 | No partial-coverage or EXTEND option |
| 2 | TDD baseline impossible on most platforms | CRITICAL | Step 5 RED | Assumes skill toggling exists; fallback is guesswork |
| 3 | Arbitrary 3-5 pattern minimum | HIGH | Step 3, Rule 2 | Minimum count > minimum need for simple skills |
| 4 | Infinite validation loop (environmental) | CRITICAL | Step 6 | Escape hatches don't cover environmental failures |
| 5 | Platform degradation misses adversarial review | HIGH | Step 7, Degradation table | Treats independence as optimization, not requirement |
| 6 | No JSON validation after skills.json edit | HIGH | Step 8 | Missing post-edit validation step |
| 7 | Excessive round trips for simple skills | MEDIUM | Step 1 | One-question-at-a-time applied uniformly |
| 8 | Name collision misses external/sources.yaml | MEDIUM | Step 4 | Collision check split across two locations |
| 9 | No self anti-pattern documentation | HIGH | Entire skill | Meta-skill doesn't name its own failure modes |
| 10 | Bootstrap paradox (rules predate the skill) | MEDIUM | Rule 8 | Meta-skill may not satisfy rules it enforces |

---

## Verdict

**Gate 2 (Adversarial Review): CONDITIONAL PASS**

The skill-bootstrap SKILL.md is fundamentally sound in its structure and intent. The TDD-for-skills methodology, the Reference-vs-Build gate, the pattern library integration, and the platform degradation handling are all well-conceived. The Hard Rules are clear and enforceable.

However, two CRITICAL issues must be addressed before this skill can be considered production-ready:

1. **The TDD RED phase is non-functional on most platforms** (Attack Vector 2). The fallback to "predicted failure mode" reduces TDD to speculation. This undermines the entire RED → GREEN → REFACTOR loop that the skill is built on.

2. **The validation loop has no circuit breaker for environmental failures** (Attack Vector 4). An agent could loop indefinitely trying to fix a validation failure caused by directory naming, file permissions, or stale registry state — problems the agent cannot diagnose from validate.sh output alone.

The five HIGH-severity issues (1, 3, 5, 6, 9) should be addressed before the skill enters heavy use. The three MEDIUM issues (7, 8, 10) can be addressed in a follow-up revision.

The skill's greatest strength — its systematic, gated approach — is also its greatest weakness: the gates assume ideal platform conditions that rarely exist in practice. Making the gates more robust to real-world platform limitations would significantly increase the skill's practical value.
