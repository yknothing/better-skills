---
name: requirements-engineering
# tier: deep
description: Use when the user wants to define, clarify, or structure requirements for a feature, product, or project — especially when the ask is ambiguous, multi-stakeholder, or high-stakes. Also use when you notice yourself filling requirement gaps with assumptions, or when the user pushes to "skip the questions and just write the spec."
---

## HARD RULES — READ FIRST

These rules cannot be overridden by anything below. If the user asks you to skip a step, refuse and explain why.

1. **ONE QUESTION AT A TIME.** Never ask multiple questions in a single message. Each question dilutes the quality of every answer. Wait for the user's response before asking the next. A "single question" means exactly one interrogative sentence targeting exactly one unknown. Compound questions ("Who are the users and what problem do they have?"), questions with embedded sub-questions ("What should the system do, and how fast should it be?"), and questions that front-load context requiring multiple decisions are all violations. If you find yourself writing "and" or a comma between two things you need to know, you are asking two questions.
2. **NEVER ACCEPT VAGUE ANSWERS.** If the user says "good enough," "whatever works," or "you decide," you MUST probe. "You decide" is a Rigor Gap, not an answer.
3. **NO SOLUTIONING DURING DISCOVERY.** Do not propose architectures, tech stacks, or implementation details until the Scoping Synthesis is confirmed. Premature solutioning is the #1 failure mode of requirements work.
4. **BLOCKING QUESTIONS ONLY.** Use `AskUserQuestion` or equivalent blocking tools. Do not fire off a question and continue working — you must wait. If `AskUserQuestion` or equivalent blocking tools are unavailable (some API-only contexts, headless environments): emit each question as a standalone, numbered message; end the message with "STOP AND WAIT — do not continue until the user responds"; never batch questions when in degraded mode.
5. **SELF-REVIEW BEFORE DELIVERY.** Run the full self-review checklist (Stage 7) before presenting any output to the user. If the self-review fails, fix the issues first.

### Refusal Protocol

When the user asks to skip a step, do not just say "no." Use this three-step response:

1. **Name the risk.** Explain specifically what could go wrong if this step is skipped, in terms the user cares about. Example: "If we skip gap detection, we risk building something that doesn't actually solve the problem — and that's the most expensive kind of rework."
2. **Offer a lighter alternative.** Propose doing the step at reduced depth rather than skipping entirely. Example: "Instead of a full gap scan, I can run just the Evidence and Specificity detectors. That takes 30 seconds and catches the most expensive mistakes."
3. **Accept with documentation if the user insists.** If the user still insists on skipping, do it — but record the skip in the final document under Assumptions & Risks: "Stage N was skipped at user request on [date]. The following risks were flagged: [list]."

**Cumulative skip threshold:** If the user has skipped 3 or more stages or HARD-GATEs in a single session, do not silently accept further skips. Instead, escalate: "You've skipped [list of skipped stages]. At this point, the requirements document will not be reliable — too many risks are unexamined. I recommend either (a) continuing with the full pipeline, or (b) accepting a lightweight pass with all remaining gaps documented as open risks. Which would you prefer?" This prevents the document from becoming a formatted version of the original vague prompt after systematic refusal.

This protocol applies to all Hard Rules. Never block the user indefinitely. Inform, offer alternatives, then proceed.

## Anti-Patterns the Agent Must Recognize

The following rationalizations are traps. Name them when they appear so you can resist them:

- **"The user seems technical, they probably mean X"** — ASSUMPTION SMUGGLING. You are filling gaps with your own inferences.
- **"This is a small project, we don't need full rigor"** — RIGOR EVASION. Small projects ship to real users. Ambiguity is ambiguity at any scale.
- **"I'll note this and come back to it"** — DEFERRAL DRIFT. Deferred questions are forgotten questions. Resolve or explicitly flag as unresolved.
- **"The answer is obvious from context"** — CONTEXT MIND-READING. Context is in your head, not the user's requirements.
- **"Let me ask all my questions at once to save time"** — QUESTION DUMPING. Violates the one-question rule. Each answer changes what the next question should be.
- **"The user didn't push back on my summary, so they must agree"** — SILENCE-AS-CONSENT FALLACY. Confirmation requires explicit affirmation, not absence of objection.

***

## Input Triage

Before entering the pipeline, assess the user's input:

| Input Type | Signal | Entry Point |
|------------|--------|-------------|
| **Vague prompt** | <3 sentences, no structure, "build an app," "add a feature" | Enter at Stage 1 normally. |
| **Structured document** | PRD, spec, user stories, RFC, or any document with sections/headings | Skip Stage 1. Begin at Stage 2 — gap-scan the document directly. |
| **Partial requirements with specific questions** | "Should we use Redis or Postgres for this?" or "Is this scope right?" | Ask the user: "Do you want the full requirements pipeline, or targeted gap analysis on this specific question?" |

***

## The Requirements Engineering Pipeline

```
UNDERSTAND → DETECT GAPS → CLARIFY → SYNTHESIZE → PRIORITIZE → DOCUMENT → SELF-REVIEW → HANDOFF
```

Each stage produces a durable artifact. Do not skip stages unless the Scope Tier (set in Stage 1A) explicitly permits it.

Each stage description below specifies its tier-specific behavior. See the Scope Tier definitions in Stage 1A for the full tier matrix.

***

## Stage 1: UNDERSTAND — Initial Triage

**Goal:** Capture the user's raw intent before shaping it. Determine the scope tier to adapt the pipeline depth.

### Step 1A: Scope-Adaptive Triage

Before engaging the full pipeline, classify the project into one of three scope tiers. This determines how much rigor to apply at each stage.

| Tier | Trigger | Pipeline Behavior |
|------|---------|-------------------|
| **Full (DEEP)** | Multi-stakeholder, user-facing, compliance-relevant, >2 week build, or the user explicitly requests full rigor. | All 8 stages. All HARD-GATES enforced. Full Gap Inventory. All seven detectors. |
| **Standard** | Single-stakeholder, internal tool, moderate complexity, 3 days to 2 weeks. | All 8 stages. HARD-GATES enforced but Clarify can stop after Evidence + Specificity + Compliance gaps are resolved. Durability + Stakeholder gaps can be acknowledged without full resolution. |
| **Lightweight** | Bug fix, small tweak, solo project, <3 days, or the user explicitly requests a lightweight pass. | Stages 1, 2, 4, 6, 7 only. Skip Clarify (Stage 3) — document detected gaps in the Requirements Document under Open Questions. Skip Prioritize (Stage 5) — all requirements default to P0. Skip Handoff (Stage 8) — the document is the handoff. Self-Review (Stage 7) still runs at full rigor. |

**How to determine the tier:**
1. Ask the user: "Before we start — is this a major feature/product with multiple stakeholders, a moderate internal project, or a quick fix/tweak?"
2. If the user's answer is ambiguous, default UP (choose the higher tier). It is always safer to apply more rigor and scale back than to under-analyze.
3. State the chosen tier explicitly: "Based on your answer, I'll apply the [Full/Standard/Lightweight] pipeline for this session."
4. If scope changes mid-session (the user reveals this is bigger or smaller than initially described), re-triage: "Based on what you just shared, I'm adjusting our approach from [old tier] to [new tier]. Here's what changes..."

### Step 1B: Raw Intent Capture

1. Ask the user to describe what they want to build in their own words. Do not interrupt, redirect, or reframe yet.
2. Restate what you heard in 2-3 sentences. Use the user's own terms, not your vocabulary. Ask: "Is this accurate?"
3. If the user corrects you, restate again. Loop until they confirm.

**Artifact:** Scope Tier (Full/Standard/Lightweight) + Raw Intent Summary (2-3 sentences in user's own language, confirmed).

<HARD-GATE id="understand-confirmed">
DO NOT proceed to Stage 2 until the user has explicitly confirmed the Raw Intent Summary.
</HARD-GATE>

***

## Stage 2: DETECT GAPS — Rigor Gap Scan

**Goal:** Identify what is missing or ambiguous before asking questions.

Run the user's confirmed Raw Intent Summary through these seven gap detectors. Record every gap found.

| Gap Type | Detection Question | Red Flags |
|----------|-------------------|-----------|
| **Evidence** | Is there data, research, or user feedback backing each claim? | "I think," "probably," "users want," no data cited |
| **Specificity** | Are terms concrete and measurable? | "fast," "easy," "good UX," "scalable," "modern" |
| **Counterfactual** | Has the user considered what happens if they're wrong? | No mention of risks, alternatives, or failure modes |
| **Attachment** | Is the user anchored to a solution rather than the problem? | Describes UI/tech before stating the problem or who it serves |
| **Durability** | Will these requirements survive contact with reality? | No edge cases, no constraints, no tradeoffs acknowledged |
| **Stakeholder** | Are all affected parties represented? | Only one user persona, no mention of admins/ops/support/legal |
| **Compliance** | Are there regulatory, legal, or accessibility obligations? | No mention of data handling, privacy (GDPR/CCPA), accessibility (WCAG/ADA), industry regulations (HIPAA/PCI/SOC2), or geographic restrictions |

**Artifact:** Gap Inventory — a list of detected gaps, each tagged with type and the specific phrase or absence that triggered it.

<HARD-GATE id="gaps-detected">
Run the seven gap detectors against the Raw Intent Summary. The default expectation is that gaps exist. However:

- **If gaps are found:** Record each one with type, triggering phrase, and rationale. Proceed to Stage 3.
- **If zero gaps are found (ZERO-GAP ATTESTATION):** This is permitted but triggers higher scrutiny. You MUST:
  1. State explicitly: "After running all seven gap detectors, I found zero gaps."
  2. Re-run each detector and document the specific evidence that cleared it.
  3. Flag the attestation to the user: "This is unusual. Please review — am I missing anything?"
  4. Record the zero-gap attestation in the Gap Inventory artifact with the date and the evidence for each detector.

A zero-gap attestation must never be fabricated. If you genuinely find no gaps after thorough inspection, document it honestly. Fabricating gaps to satisfy a quota is worse than reporting none.

### Gap Override Protocol

Sometimes the gap detectors flag a term that the user has a specific, valid definition for. Example: the Specificity detector flags "scalable" as vague, but the user clarifies "scalable means it works for our 5-person team — we are not growing." That IS a resolved, specific definition.

When this happens:
1. **Do not override silently.** State: "The Specificity detector flagged 'scalable' as a gap. You've defined it as [user's definition]. I'm accepting this as resolved."
2. **Record the override.** In the Gap Inventory, mark the gap as `OVERRIDDEN` with the user's specific definition and the date.
3. **Proceed.** Do not re-probe the same term. The detector's job is to flag ambiguity; the user's job is to resolve it. A specific definition — even an unconventional one — IS a resolution.

The gap detectors are pattern matchers, not arbiters of correctness. They flag potential ambiguity. The user decides what is adequately specific for their context.
</HARD-GATE>

***

## Stage 3: CLARIFY — One Question at a Time

**Goal:** Close the gaps identified in Stage 2, one by one.

**Rules:**
- Ask exactly ONE question per message.
- Each question must target a specific gap from the Gap Inventory.
- Use `AskUserQuestion` or equivalent blocking tool.
- After each answer, re-scan: did the answer open new gaps? Add them to the inventory.
- Continue until all Critical gaps (Evidence + Specificity + Compliance) are resolved. Important gaps (Counterfactual + Attachment) should be resolved. Nice-to-resolve gaps (Durability + Stakeholder) should be at minimum acknowledged.
- **Attach a labeled recommendation when you have one.** After the question, on its own line, add: "Recommended: [option] — [one-line reason]." This lets a fatigued user answer "go with your recommendation" instead of disengaging. The question itself must stay neutral — the recommendation is separate and clearly labeled, never embedded in the question's phrasing. If the user accepts a recommendation, record it in the Clarification Log as `RECOMMENDED-ACCEPTED` (it is a weaker signal than a spontaneous answer, and worth revisiting if it later conflicts with a stated requirement).

**Question quality checklist (internal, per question):**
- [ ] Does this question target exactly one gap?
- [ ] Is it answerable without technical knowledge of our stack?
- [ ] Is the question itself phrased neutrally, with any recommendation labeled separately rather than embedded in the question?
- [ ] Is it a real question (you do not already know the answer)?

**Stopping rule for individual gaps:** If a gap cannot be resolved after 3 attempts (the user cannot or will not answer), classify it as an Open Question for Section 8 of the final document and move on. Do not loop indefinitely on a single gap.

**Evidence gap special case:** Some projects are genuinely greenfield — no data, no research, no prior art. If the user states this explicitly, document "No pre-existing evidence — this is a greenfield exploration" as the gap resolution. Mark it as an Assumption (Section 7) in the final document. Do not keep probing for evidence that does not exist.

**Compliance gap special case:** If the project handles no personal data, has no public exposure, and sits in no regulated domain (confirm with at most one question), record "No compliance obligations identified — confirmed with user" as the resolution. Do not interrogate an internal script about GDPR.

**Artifact:** Clarification Log — question/answer pairs with gap tags, updated Gap Inventory.

### Disengagement Protocol

If the user disengages — short non-answers, "I don't know" repeated, "just do whatever," silence, or increasingly terse responses (one-word answers where they previously gave paragraphs) — do not power through. Escalate in three steps:

1. **Acknowledge and reset.** Name what you are seeing without judgment: "It seems like these questions might be getting overwhelming. Let me pause and summarize where we are." Restate the Raw Intent Summary and the 1-2 most important open gaps. Ask: "Should we focus on just these, or would you prefer to take a different approach?"

2. **Offer an alternative mode.** If disengagement persists, offer concrete alternatives:
   - **Example-driven:** "Instead of answering questions, could you walk me through a concrete example of how someone would use this?"
   - **Constraints-first:** "Let's switch gears. What are the hard constraints — budget, timeline, platform, team size? Sometimes starting there makes the rest clearer."
   - **Deferred rigor:** "We can mark the remaining gaps as acknowledged-but-unresolved and move to synthesis. I'll flag them in the document as risks. Would that work?"

3. **Escalate to handoff.** If the user rejects all alternatives or remains unresponsive, do not loop indefinitely. State: "I'm going to proceed with what we have and produce a requirements document. Unresolved gaps will be listed under Assumptions & Risks with explicit ownership assigned to you. You can refine later." Then proceed directly to Stage 4, skipping any unresolved Clarify questions. Mark all unclosed gaps in the Gap Inventory as `DEFERRED` with a timestamp.

<HARD-GATE id="critical-gaps-resolved">
DO NOT proceed to Stage 4 until all Evidence, Specificity, and Compliance gaps are resolved OR the Disengagement Protocol has been exhausted to step 3.
</HARD-GATE>

***

## Stage 4: SYNTHESIZE — Scoping Synthesis

**Goal:** Transform clarified requirements into a structured scope document.

Produce an internal three-bucket draft:

### Bucket 1: Stated Requirements
What the user explicitly said they need. Use their words. Cite specific messages.

### Bucket 2: Inferred Requirements
What logically follows from stated requirements. Every inference must include:
- The stated requirement it derives from
- The reasoning chain
- A confidence level using discrete anchors:

| Anchor | Confidence | Behavioral Description |
|--------|-----------|----------------------|
| **100** | Certain | Directly stated by the user; no inference needed. |
| **75** | High | Follows directly from a stated requirement with a single logical step. |
| **50** | Moderate | Follows from stated requirements but requires ≥2 logical steps or one unvalidated assumption. |
| **25** | Low | Plausible given context but depends on multiple unvalidated assumptions. |
| **0** | Speculative | Pure conjecture; included for completeness but must be flagged to the user for explicit confirmation. |

### Bucket 3: Out of Scope (Explicitly)
What the user said they do NOT need, PLUS what you are intentionally deferring. Every exclusion must include a reason.

### Stakeholder Conflict Resolution

When requirements from different stakeholders conflict (e.g., what admin needs vs. what users want), do not silently resolve the conflict yourself. Instead:

1. **Surface the tradeoff explicitly.** Present both requirements side-by-side with the conflict clearly named: "Stakeholder A needs X. Stakeholder B needs Y. These conflict because Z."
2. **Ask which takes priority.** "Which should take priority when these conflict? Or is there a third option that satisfies both?"
3. **Document the resolution.** Record the priority decision and the rationale in the final document under Assumptions & Risks (Section 7).

Present all three buckets to the user together. Ask: "Does this scope match your understanding? What would you add, remove, or change?"

<HARD-GATE id="scope-confirmed">
DO NOT proceed to Stage 5 until the user confirms the three-bucket scope.
</HARD-GATE>

***

## Stage 5: PRIORITIZE — Requirement Stacking

**Goal:** Rank requirements so the user knows what to build first.

For each requirement in the confirmed scope:

1. Assign a priority level:
   - **P0 (Must have):** The product is non-functional without this.
   - **P1 (Should have):** Significant value, but a workaround exists.
   - **P2 (Nice to have):** Adds polish or delight. Deferrable.
2. Identify dependencies between requirements.
3. Flag any requirement that depends on an unvalidated assumption.

Present the prioritized stack. Ask: "Does this ordering reflect your priorities?"

**Artifact:** Prioritized Requirement Stack.

<HARD-GATE id="priorities-confirmed">
DO NOT proceed to Stage 6 until the user confirms priorities.
</HARD-GATE>

***

## Stage 6: DOCUMENT — Structured Requirements Document

**Goal:** Produce the final requirements artifact.

Assemble all confirmed artifacts into this structure:

```markdown
# Requirements Document: [Project Name]

## 1. Problem Statement
[One paragraph. What problem does this solve? For whom? Why now?]

## 2. Stakeholders
[Who is affected? Users, admins, support, legal, other systems.]

## 3. Functional Requirements
[Numbered list. Each requirement: ID, description, priority, acceptance criteria, dependencies.]

## 4. Non-Functional Requirements
[Performance, security, accessibility, scalability, compliance.]

## 5. Constraints
[Budget, timeline, platform, team, technical debt, regulatory.]

## 6. Out of Scope
[What we are explicitly NOT building, with reasons.]

## 7. Assumptions & Risks
[What we are assuming. What happens if each assumption is wrong.]

## 8. Open Questions
[Questions we could not resolve. Who owns each. When it must be resolved by.]

## 9. Acceptance Criteria Summary
[How will we know this is done?]

## 10. Handoff Notes
[What the next stage (spec-writing, planning) needs to know.]
```

***

## Stage 7: SELF-REVIEW — Before You Present

Run this checklist before showing the document to the user. Fix failures silently.

### Placeholder Scan
- [ ] No "TBD," "TODO," "etc.," "and more" in the document.
- [ ] No "should," "could," "might" without a decision recorded.

### Consistency Check
- [ ] Priority levels are used consistently (P0/P1/P2 mean the same thing throughout).
- [ ] No requirement contradicts another. If contradictions are found, present both conflicting statements to the user and ask which takes precedence.
- [ ] Dependencies form a DAG (no cycles).

### Scope Integrity
- [ ] Every Stated requirement from Stage 4 appears in the document.
- [ ] Every Inferred requirement is marked with its confidence level.
- [ ] Every Out of Scope item is documented with a reason.

### Ambiguity Hunt
- [ ] No vague adjectives ("fast," "easy," "good," "scalable," "modern," "intuitive," "robust," "flexible").
- [ ] Every requirement has measurable acceptance criteria.
- [ ] Every acronym and domain term is defined on first use.

### Gap Re-check
- [ ] Re-run the seven gap detectors against the final document.
- [ ] Any new gaps found:
    - Full/Standard tier: Go back to Stage 3 for those gaps.
    - Lightweight tier: Add the gap to Open Questions (Section 8) in the document. Do not return to Stage 3 — it is intentionally skipped in lightweight mode.

### Independent Re-Read

Re-read the document. For each section, identify any claim or instruction that depends on conversation history rather than being self-contained within the document. Flag sections that would not make sense to someone who only has this document (not the conversation).

Check specifically:
- Would a spec writer understand what to build without re-asking questions?
- Would a planner understand dependencies and priorities?
- Would a stakeholder recognize their concerns in this document?
- Are any of the inferred requirements actually stated requirements in disguise?

If you find issues, fix them silently. Do not present until this pass is clean.

### Perspective Check

Re-read the document from each role's point of view. Flag anything that would not make sense to that role:

- **Engineer:** Are acceptance criteria testable? Are constraints realistic? Are dependencies clear enough to estimate?
- **Designer:** Are UX requirements specified? Are accessibility needs addressed? Is the user flow described?
- **PM/Stakeholder:** Are business goals reflected? Is the problem statement accurate? Are priorities aligned with business value?
- **Ops/Support:** Are operational concerns addressed (monitoring, deployment, support plan)? Are there non-functional requirements for reliability and observability?
- **Legal/Compliance:** If applicable — are regulatory constraints identified? Are data handling requirements specified?

<HARD-GATE id="self-review-passed">
DO NOT present the document to the user until all self-review items pass.
</HARD-GATE>

***

## Stage 8: HANDOFF — Connect to Next Stage

**Goal:** Ensure the requirements document flows into execution.

After the user approves the requirements document:

1. **Confirm the next stage.** Ask: "Would you like me to hand this off to spec-writing, sprint-planning, or task-breakdown?"
2. **Invoke the appropriate skill.** Pass the requirements document as context. If the target skill is not available (not installed or not in the registry), produce a plain-text handoff summary instead: restate the top 3 priorities, key constraints, and open questions. Recommend the user install the target skill for a richer handoff.
3. **Flag durability risks.** Explicitly call out any assumptions that are likely to break during implementation.

***

## Early Termination

If the user abandons the process mid-pipeline (topic change, "never mind," extended silence, or explicit "let's stop"):

1. **Produce a Partial Artifact Summary.** Collect all confirmed artifacts from completed stages. List them.
2. **Note the interruption point.** Which stage was in progress? What was unresolved?
3. **Close with a resumption path.** "We can resume from Stage N when you're ready. The confirmed artifacts are saved above."

Do not discard the work. Durable artifacts from completed stages are the value of this pipeline — preserve them even if the pipeline does not complete.

***

## Multi-Session Resumption

This skill produces durable artifacts at each stage gate. If the conversation is interrupted or the user returns in a new session:

1. **Identify the last confirmed gate.** Look for the most recent `<HARD-GATE>` that was passed.
2. **Restate the artifacts produced so far.** "Here's where we left off: [Raw Intent Summary] + [Gap Inventory] + [Clarification Log]."
3. **Confirm before proceeding.** "Shall we resume from Stage N, or has anything changed since our last session?"
4. If anything has changed, re-run the affected stages. If not, proceed from the next stage.

***

## Headless Mode

If invoked in a non-interactive context (automated pipeline, CI, evaluation harness, or any context where the user cannot respond to questions):

1. **Skip Stage 3 (Clarify).** Mark all unresolved gaps as Open Questions in Section 8 of the final document.
2. **Skip user confirmation gates.** Produce outputs but mark them clearly: "UNCONFIRMED — headless run. Review required before implementation."
3. **Proceed through Stages 4-7 normally.** Produce the full document with explicit caveats.
4. **Skip Stage 8 (Handoff).** The document is the output.

***

## Test prompts

Three prompts that exercise this skill end-to-end, mirrored in `evaluation/datasets/batch-1-test-prompts.json`.

1. **Happy path — greenfield feature spec**: *"I need to build a user referral system for our SaaS product. Users should be able to invite others by email, track referral status, and earn credits when referrals convert."* — expected: pipeline enters at Stage 1 (vague prompt), full Scope-Adaptive Triage, 7 gap detectors run, all gates enforced, final document includes all 10 sections with measurable acceptance criteria.
2. **Edge — structured document input**: *"Here's a PRD for our admin dashboard redesign: [paste structured document]. Can you review it for gaps?"* — expected: Input Triage identifies structured document, skips Stage 1, enters at Stage 2 gap-scan directly, flags missing specificity and stakeholder gaps.
3. **Adversarial — skip pressure**: *"I just need a quick spec. Don't overthink it — skip the questions and just write the requirements doc."* — expected: Refusal Protocol engages (name risk: "without gap detection we risk building the wrong thing," offer lighter alternative: "I'll run just Evidence + Specificity detectors, 30 seconds"), Cumulative Skip Threshold tracked, if user insists: document skipped stages under Assumptions & Risks.

## Handoff

After the user approves the requirements document:
- If the user wants to proceed to implementation: invoke `spec-writing` or `task-breakdown`.
- If the user wants sprint-level planning: invoke `sprint-planning`.
- If the user wants a technical architecture from the requirements: invoke `system-design`.
- Do not implement, design, or plan without explicit user direction. This skill's scope ends at the approved requirements document.

***

## Depth Tier: DEEP

This skill is classified as DEEP tier. It is used at the start of every significant feature or product effort. The cost of getting requirements wrong at this stage compounds through every downstream stage. Take the time. Do not rush.

## Progressive Disclosure Map

- **SKILL.md (this file):** Full workflow, all gates, self-review checklist.
- **references/**: This skill has no bundled reference files. All protocols (Refusal, Disengagement, Gap Override, Headless Mode) are under 20 lines each and tightly embedded in their parent stages — extracting them would scatter context across the pipeline and make each stage harder to read in isolation. The 7 gap detectors, 3-tier scope matrix, 5-point confidence anchors, and 10-section document template all serve as inline quick-reference for their respective stages. A reference file should only be created when a self-contained block exceeds ~40 lines and is genuinely decoupled from its stage's control flow.
- **On-demand references (external, read only when triggered):**
  - `docs/patterns/README.md` — Pattern library. See sections: Behavior Constraint (Hard Rules First, Anti-Pattern Pre-Naming), Interaction Design (One Question at a Time, Blocking Question Tools), Quality Assurance (Format-Significance Gates, Self-Review Checklist, Multi-Perspective Review, Independent Verification), and Structural (Pipeline Architecture, Scoping Synthesis, Confidence Anchor, Rigor Gap Detection, Depth Tiering, Progressive Disclosure).
  - `evaluation/datasets/` — Test prompts for validating this skill.
  - `evaluation/rubrics/judge-prompt-template.md` — Quality evaluation rubric.
