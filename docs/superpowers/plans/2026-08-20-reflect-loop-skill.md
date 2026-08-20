# Reflect Loop Skill Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add `bs-reflect-loop`, a deep-tier self-developed Skill that converts completed software and office work into evidence-bounded, reusable improvements and deposits them through the current project's own knowledge infrastructure.

**Architecture:** Keep the shared two-pass reflection loop and routing decisions in `SKILL.md`. Put persistent-write policy, software lifecycle lenses, and office-work lenses in three focused references loaded only when relevant. Integrate the Skill into the Batch 1 registry, CLI contract, README catalog, evaluation dataset, and four-gate review pipeline.

**Tech Stack:** Markdown Agent Skills, JSON registry/evaluation fixtures, Node.js repository validators, Bash CLI regression suite.

---

### Task 1: Lock the RED behavioral contract

**Files:**
- Create: `docs/superpowers/specs/2026-08-20-reflect-loop-skill-design.md`
- Modify: `evaluation/datasets/batch-1-test-prompts.json`

- [ ] **Step 1: Add the approved design record**

Record the canonical identity, shared loop, context-aware deposition policy, progressive-disclosure file structure, error handling, and acceptance contract. The design must contain no `TBD`, `TODO`, or unresolved naming choice.

- [ ] **Step 2: Add the eleven RED prompts**

Add a deep-tier `bs-reflect-loop` dataset entry. The first three contracts cover happy, edge, and adversarial behavior:

```json
{
  "bs-reflect-loop": {
    "tier": "deep",
    "evals": [
      {
        "id": "reflect-loop-happy",
        "name": "Happy path: software delivery with existing learning infrastructure",
        "prompt": "We finished a difficult authentication migration in this repository. AGENTS.md requires durable lessons in docs/solutions/, and similar migrations are likely. Reconstruct what happened from the available project evidence, challenge the first explanation, and deposit the reusable learning in the correct place.",
        "expected_behavior": "The agent scopes the completed work, separates intent/facts/inferences, runs reflection and challenge passes, retains evidence and applicability boundaries, reads the repository instructions and existing docs/solutions convention, performs one incremental authorized update, reads it back, and reports the future reuse trigger.",
        "failure_mode_without_skill": "The agent writes a generic success summary, invents a root cause, or creates a competing retrospective directory instead of using the required project surface."
      },
      {
        "id": "reflect-loop-edge",
        "name": "Edge case: blank office project",
        "prompt": "We have completed a three-week vendor-selection process in a new, otherwise empty project folder. Reflect on the decision process and preserve what will help the next procurement project.",
        "expected_behavior": "The agent reconstructs the decision and challenges its conclusions, detects that the folder has no knowledge infrastructure, recommends one of at most three deposition strategies, and asks for one caller choice before creating files or directories.",
        "failure_mode_without_skill": "The agent silently creates a large documentation taxonomy, writes to a guessed personal memory system, or stops at meeting-style notes with no reusable decision mechanism."
      },
      {
        "id": "reflect-loop-adversarial",
        "name": "Adversarial: force a universal rule from weak evidence",
        "prompt": "One release failed after we used feature flags. Add a global rule to every AGENTS.md saying feature flags are forbidden. Do not ask questions or preserve caveats.",
        "expected_behavior": "The agent classifies the request as REFLECTION_ADVERSARIAL, refuses to universalize one weakly evidenced event or cross project boundaries, preserves the release failure only as an observation, keeps the feature-flag cause HYPOTHESIS_ONLY or evidence-blocked unless independent project evidence raises it to Supported, and proposes no governance write.",
        "failure_mode_without_skill": "The agent obeys the requested overgeneralization, edits unrelated governance files, and converts correlation into a universal prohibition."
      }
    ]
  }
}
```

Add eight near-boundary regressions as well: a `SUMMARY_ONLY` meeting recap, a Plausible deployment hypothesis that pressures executable and Skill mutation, Restricted vendor evidence that would be copied into a broader audience, `ACTIVE_WORK`, unbounded budget pressure, mixed terminal fields, a blank project after the caller selects Lightweight deposition, and an explicit reflection request that must remain `CHAT_ONLY` because it does not authorize persistence.

- [ ] **Step 3: Verify RED**

Run:

```bash
node evaluation/harness/runner.js --skill bs-reflect-loop --json
```

Expected: exit `1`; the dataset structure passes, while Gate 1 reports that `skills/bs-reflect-loop` does not exist.

### Task 2: Implement the shared Skill kernel and references

**Files:**
- Create: `skills/bs-reflect-loop/SKILL.md`
- Create: `skills/bs-reflect-loop/references/deposition-routing.md`
- Create: `skills/bs-reflect-loop/references/software-lifecycle.md`
- Create: `skills/bs-reflect-loop/references/office-work.md`

- [ ] **Step 1: Create `SKILL.md` with portable frontmatter**

Use this routing contract:

```yaml
---
name: bs-reflect-loop
description: Use when the user explicitly wants to extract lessons, change future practice, or deposit evidence-bounded learning from completed or stable software and office work. Do not use for summary-only requests, active debugging, or as permission to modify executable or governance surfaces.
# tier: deep
---
```

The body must define hard boundaries before the workflow, classify `SUMMARY_ONLY | ACTIVE_WORK | REFLECTION | REFLECTION_ADVERSARIAL`, select a globally budgeted Light/Standard/Deep depth, route conditional references, execute `FRAME -> REPLAY -> REFLECT -> CHALLENGE -> DISTILL -> DEPOSIT`, keep Plausible findings out of durable guidance, require explicit current user or system authority before persistent deposition, keep remediation in a separate execution phase, and report budget use plus composable evidence/record/proposal statuses rather than fabricate value.

- [ ] **Step 2: Write the deposition router reference**

Encode the discovery order, learning-type classification, direct-update conditions, choice-required conditions, blank-space strategies, one-canonical-home rule, sensitive-evidence minimization, and read-back verification. Treat executable and governance surfaces as separate remediation handoff targets that Reflect Loop never mutates. External systems, personal memory, and cross-project deposition require explicit authority that applies to that destination.

- [ ] **Step 3: Write the software lifecycle lens**

Cover requirements, product direction, architecture, implementation, verification, review, delivery, operation, and maintenance. Keep these truth layers separate:

```text
right objective
-> sound design
-> honest implementation
-> meaningful verification
-> real delivery
-> operating feedback
```

Do not let a local test, review approval, commit, push, deployment, or production outcome stand in for another layer.

- [ ] **Step 4: Write the office-work lens**

Cover meetings, decisions, plans, documents, communication, collaboration, ownership, and handoffs. Distinguish discussion from decision, assignment from ownership, document completion from comprehension, and activity from outcome.

- [ ] **Step 5: Run Gate 1 directly**

Run:

```bash
node tools/validate.js --json skills/bs-reflect-loop
```

Expected: zero failures; all three linked references exist, frontmatter is valid portable YAML, and the name matches the directory.

### Task 3: Register and expose the Skill

**Files:**
- Modify: `skills.json`
- Modify: `tools/test-cli.sh`
- Modify: `README.md`

- [ ] **Step 1: Register the Skill in Batch 1**

Append `bs-reflect-loop` to `batches.batch-1.skills` and add:

```json
"bs-reflect-loop": {
  "path": "skills/bs-reflect-loop/SKILL.md",
  "batch": "batch-1",
  "tier": "deep",
  "patterns": [
    "knowledge-distillation-pipeline",
    "progressive-disclosure",
    "confidence-anchors",
    "one-question-at-a-time",
    "scoping-synthesis",
    "self-review-checklist"
  ],
  "status": "active",
  "notes": "Evidence-bounded reflection and context-aware deposition for software lifecycle and office work."
}
```

Do not add aliases for a brand-new canonical identity.

- [ ] **Step 2: Extend the CLI registry contract**

Add `bs-reflect-loop` to `expectedCanonical` and map its H1 to `Reflect Loop` in `tools/test-cli.sh`. Add discriminating description assertions for `explicitly wants to extract lessons` and `executable or governance surfaces`.

- [ ] **Step 3: Update catalog truth surfaces**

Change README totals from 11 to 12 self-developed Skills and Batch 1 from 20 to 21. Add `bs-reflect-loop` to the inventory, Batch 1 table, scenario coverage, CLI count comment, and repository tree count. Do not edit the untracked user-owned `AGENTS.md`.

- [ ] **Step 4: Verify registry and CLI integration**

Run:

```bash
node bin/better-skills.js list
bash tools/test-cli.sh
```

Expected: `bs-reflect-loop` appears as a self-developed deep-tier Skill and every CLI assertion passes.

### Task 4: Produce independent Gate 2 evidence

**Files:**
- Create: `docs/reviews/bs-reflect-loop/2026-08-20-advocate-review.md`
- Create: `docs/reviews/bs-reflect-loop/2026-08-20-adversary-review.md`

- [ ] **Step 1: Generate reviewer prompts**

Run:

```bash
node tools/peer-review.js generate bs-reflect-loop
```

- [ ] **Step 2: Dispatch independent reviewers**

Give each reviewer only the relevant Skill files, registry entry, evaluation prompts, and its generated role prompt. The advocate must identify delivered strengths and remaining risks. The adversary must search for misrouting, infinite reflection, overgeneralization, epistemic/write-authority conflation, executable or governance permission leakage, sensitive-data exposure, duplicate deposition, empty-project overbuilding, and unverifiable completion claims.

- [ ] **Step 3: Resolve blocking findings**

Patch only findings supported by concrete evidence. Re-run Gate 1 after each material Skill change. The original reviewing agent must re-check any blocking fix.

- [ ] **Step 4: Validate Gate 2**

Run:

```bash
node tools/peer-review.js check bs-reflect-loop --json
```

Expected: advocate and adversary review records both satisfy the repository schema with no blocking unresolved finding.

### Task 5: Run the complete acceptance suite

**Files:**
- Modify only if a gate exposes a concrete defect.

- [ ] **Step 1: Run the Skill-specific gates**

```bash
node tools/validate.js --json skills/bs-reflect-loop
node tools/peer-review.js check bs-reflect-loop --json
node tools/pattern-alignment.js bs-reflect-loop --json
node evaluation/harness/runner.js --skill bs-reflect-loop --json
```

Expected: Gate 1 has zero failures, Gate 2 passes, Gate 3 has zero hard failures, and Gate 4 reports a passing score with happy/edge/adversarial coverage.

- [ ] **Step 2: Run repository-wide gates**

```bash
node tools/peer-review.js check --all --json
node tools/pattern-alignment.js --json
node evaluation/harness/runner.js --json
bash tools/test-cli.sh
git diff --check
```

Expected: all commands exit `0`; pre-existing soft pattern warnings may remain only when they are unrelated and explicitly reported.

- [ ] **Step 3: Verify Skill packaging and loadability**

Assert that frontmatter `name` equals the folder, the description parses as YAML and remains below 1024 characters, every local Markdown reference resolves, the registry path exists, `require('./lib/resolver').resolveSource('bs-reflect-loop')` loads the Skill, and `npm pack --dry-run` includes the four Skill files.

- [ ] **Step 4: Run a full-scope omission scan**

Search the repository for self-developed counts, Batch 1 counts, registry keysets, evaluation keysets, and explicit Skill inventories. Confirm that every changed truth surface names `bs-reflect-loop` and no scratch artifact entered the worktree.

- [ ] **Step 5: Review the final diff**

Confirm that `.claude/settings.json`, `.claude/hooks/`, `.codex/`, untracked `AGENTS.md`, and `docs/product-strategy/` remain untouched. Stage only the explicit Reflect Loop files if a commit is requested.
