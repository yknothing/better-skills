# Advocate Review: requirements-engineering

**Reviewer Role:** Advocate (Gate 2 — Peer Review)
**Date:** 2026-06-17
**Skill:** requirements-engineering (DEEP tier)
**Validation Status:** 11/11 passed (validate.sh)

---

## Overall Summary

This is an exceptionally well-constructed skill. It demonstrates mastery of nearly every pattern in the pattern library, implements them with surgical precision, and handles edge cases that most skills ignore entirely. The skill earns its DEEP classification and is production-ready. The single strongest aspect is the **anti-pattern pre-naming** in the "Anti-Patterns the Agent Must Recognize" section — it is the best implementation of this pattern I have seen across all studied skills. If I could change one thing, I would add a concrete worked example (an annotated walkthrough of the pipeline on a real scenario) to help new users and agents calibrate their expectations.

---

## Dimension-by-Dimension Analysis

### 1. Trigger Quality: 9/10

**Evidence:**
The description is concise and precise:
> "Use when the user wants to define, clarify, or structure requirements for a feature, product, or project — especially when the ask is ambiguous, high-stakes, or multi-stakeholder."

**What works:**
- The trigger covers the three core actions (define, clarify, structure) rather than just one, so it activates across the full lifecycle.
- The qualifier "especially when" narrows the scope without being restrictive — it activates on simple asks but signals that it is most valuable on complex ones.
- The Input Triage table (lines 43-47) provides an elegant secondary trigger mechanism that routes the user to the right entry point based on input type. This prevents over-processing of already-structured documents and respects the user's time.
- The three-input-type routing (Vague prompt, Structured document, Partial requirements with specific questions) covers the common entry scenarios well.

**Concerns:**
- The description uses "high-stakes" which is subjective. An agent might misinterpret a moderate-stakes project as not warranting the skill. However, the Input Triage table compensates for this by catching structured inputs regardless of perceived stakes.
- The trigger does not explicitly cover the "user is about to build something and hasn't thought through requirements at all" case — though "define" arguably covers this, it could be more explicit about catching the zero-requirements state.

---

### 2. Workflow Coherence: 10/10

**Evidence:**
The 8-stage pipeline (line 53):
```
UNDERSTAND → DETECT GAPS → CLARIFY → SYNTHESIZE → PRIORITIZE → DOCUMENT → SELF-REVIEW → HANDOFF
```

**What works:**
- Each stage has a clear **Goal**, an **Artifact**, and a **HARD-GATE** — the structure is consistent and predictable throughout. An agent never wonders "am I done with this stage?"
- The pipeline follows a natural progression: capture raw intent → find what's missing → fill gaps → structure → rank → document → verify → hand off. This mirrors how expert requirements engineers actually think.
- The Scope-Adaptive Triage (Stage 1A, lines 67-81) is a masterstroke. It adapts the pipeline depth to the project without breaking the pipeline structure. The three-tier system (Full/Standard/Lightweight) is clearly defined with specific stage-level behavior differences per tier.
- Stage transitions are explicitly guarded by HARD-GATE tags with clear exit criteria. The gates are not just "don't skip" — they specify exactly what must be confirmed before proceeding.
- The re-triage mechanism (line 81) handles scope changes mid-session: "Based on what you just shared, I'm adjusting our approach..." — this prevents the agent from locking into the wrong rigor level.
- The Handoff stage (Stage 8, lines 339-343) connects the pipeline to downstream skills, closing the loop.

**Concerns:**
- None. The pipeline is coherent, well-structured, and covers the full requirements lifecycle without gaps.

---

### 3. Constraint Effectiveness: 10/10

**Evidence:**
The Hard Rules section (lines 8-14) with 5 immutable rules.

**What works:**
- **Rule 1 (One question at a time):** This is the most important interaction constraint in the skill and it is enforced with precision. The rationale is given: "Each question dilutes the quality of every answer." This is not just a rule — it is a rule with a reason, which helps the agent internalize it.
- **Rule 2 (Never accept vague answers):** Explicitly names the trigger phrases ("good enough," "whatever works," "you decide") so the agent has concrete pattern-matching criteria. The framing of "you decide" as a Rigor Gap, not an answer, is particularly sharp.
- **Rule 3 (No solutioning during discovery):** Prevents the #1 failure mode named in the rule itself. By blocking architecture/tech stack/implementation discussions until the Scoping Synthesis is confirmed, this rule enforces the separation between problem definition and solution design.
- **Rule 4 (Blocking questions only):** This is the most technically sophisticated rule. It not only mandates blocking tools but provides a **degraded mode** (lines 4, 370-377) for headless/API-only contexts where blocking tools are unavailable. The degraded mode instructions are specific: "emit each question as a standalone, numbered message; end the message with 'STOP AND WAIT — do not continue until the user responds'."
- **Rule 5 (Self-review before delivery):** Enforces the quality gate before user-facing output.
- The **Refusal Protocol** (lines 18-22) transforms "don't skip" from a hard block into a constructive three-step process: name the risk, offer a lighter alternative, accept with documentation. This prevents the agent from becoming adversarial while maintaining rigor.
- Every rule is specific enough that an agent can self-check compliance. No rule says "be careful" or "use good judgment" — each one names concrete behaviors to perform or avoid.

**Concerns:**
- Rule 2 ("never accept vague answers") paired with the Disengagement Protocol's three-attempt limit on individual gaps (line 146) creates a tension: how many rounds of "refuse vague answer" before the three-attempt limit triggers? In practice, this is handled by the Disengagement Protocol's escalation path, but a first-time user of the skill might find the interaction frustrating if the agent keeps rejecting their answers. The Disengagement Protocol compensates well here.

---

### 4. Edge Case Coverage: 10/10

**Evidence:**
The skill covers four major edge cases with dedicated sections.

**What works:**

- **Disengagement Protocol (lines 153-163):** A three-step escalation: acknowledge/reset → offer alternative modes → escalate to handoff. This is remarkable — most skills power through disengagement or simply stop. This protocol gracefully degrades while preserving partial artifacts. The concrete alternatives offered (example-driven, constraints-first, deferred rigor) give the agent genuine options rather than just repeating the same approach.

- **Early Termination (lines 347-355):** Explicitly handles the case where the user abandons mid-pipeline. The instruction to "produce a Partial Artifact Summary" and "note the interruption point" with a resumption path ensures no work is lost. The framing "Durable artifacts from completed stages are the value of this pipeline" is a key insight.

- **Multi-Session Resumption (lines 359-366):** Handles the reality that complex requirements work spans multiple sessions. The four-step protocol (identify last confirmed gate → restate artifacts → confirm before proceeding → re-run if changed) is precise and practical. The check "has anything changed since our last session?" prevents stale assumptions.

- **Headless Mode (lines 370-377):** Handles non-interactive contexts cleanly. The protocol skips Clarify, skips confirmation gates, marks outputs as "UNCONFIRMED," and skips Handoff. This is a pragmatic design that acknowledges the constraints of automated contexts without pretending interactivity is possible.

- **Evidence Gap Special Case (lines 148-149):** Explicitly handles greenfield projects where no evidence exists. Rather than looping indefinitely asking for data that doesn't exist, the protocol documents the absence and marks it as an Assumption.

- **Zero-Gap Attestation (lines 117-124):** Handles the edge case where the Gap Inventory finds no gaps. The four-step attestation protocol (state, re-run, flag, record) prevents both false positives (fabricating gaps) and false negatives (missing real gaps).

- **Stakeholder Conflict Resolution (lines 199-203):** Handles the multi-stakeholder edge case where requirements conflict. The three-step protocol (surface, ask, document) prevents the agent from silently resolving conflicts.

**Concerns:**
- None. The edge case coverage is comprehensive and each handler includes specific, actionable instructions rather than vague guidance.

---

### 5. Self-Review Quality: 9/10

**Evidence:**
Stage 7 (lines 279-328) with six sub-checks.

**What works:**
- **Placeholder Scan (line 282-284):** Checks for "TBD," "TODO," "etc.," "and more," and hedging language ("should," "could," "might" without decisions). These are the most common quality failures in requirements documents, and the scan catches them all.
- **Consistency Check (lines 286-289):** Verifies priority level consistency, contradiction detection, and DAG structure for dependencies. The contradiction handling is particularly good: rather than silently resolving, it surfaces both conflicting statements to the user.
- **Scope Integrity (lines 291-294):** Cross-references the document against the Stage 4 three-bucket synthesis. Every stated requirement must appear, every inferred requirement must carry its confidence level, every out-of-scope item must have a reason.
- **Ambiguity Hunt (lines 296-299):** Explicitly bans vague adjectives with a concrete list: "fast," "easy," "good," "scalable," "modern," "intuitive," "robust," "flexible." This is much stronger than a generic "avoid vague language" rule.
- **Gap Re-check (lines 301-305):** Re-runs the six gap detectors against the final document. Tier-appropriate follow-up is specified.
- **Independent Re-Read (lines 307-316):** Tests whether the document is self-contained — can someone with only the document (not the conversation history) understand it? The specific questions (Would a spec writer understand? Would a planner? Would a stakeholder?) are practical and targeted.
- **Perspective Check (lines 320-327):** Re-reads the document from five role perspectives (Engineer, Designer, PM/Stakeholder, Ops/Support, Legal/Compliance). Each role has specific criteria — not generic "does this make sense?" but targeted questions like "Are acceptance criteria testable?" (Engineer) and "Are operational concerns addressed?" (Ops).

**Concerns:**
- The Perspective Check does not include a **User/End-User** perspective. Given that the skill is about requirements engineering, the actual end user's point of view is conspicuously absent from the role list. The PM/Stakeholder role partly covers this, but stakeholders and end users are not the same.
- The self-review does not check for **section completeness** — i.e., whether all 10 sections of the document template are populated (even if some are intentionally empty/N/A). A section that is accidentally left blank could pass all other checks.

---

### 6. User Experience: 9/10

**Evidence:**
The one-question-at-a-time pattern (Hard Rule 1) and the Scope-Adaptive Triage.

**What works:**
- **One question at a time:** This is the foundational UX pattern of the skill. By preventing question dumping, it ensures the user is never overwhelmed. Each question gets full attention, and each answer can inform the next question.
- **Scope-Adaptive Triage:** The three-tier system respects the user's time. A bug fix doesn't get the same treatment as a multi-stakeholder product launch. The default-up rule ("default UP, choose the higher tier") is a good safety net.
- **Raw Intent Capture (Stage 1B):** The instruction to "use the user's own terms, not your vocabulary" and "restate what you heard in 2-3 sentences" is deeply respectful. It prevents the agent from imposing its framework before understanding the user's actual intent.
- **Input Triage (lines 43-47):** Prevents the skill from re-processing already-structured documents. If the user brings a PRD, the skill skips Stage 1 and goes straight to gap analysis — respecting prior work.
- **The Refusal Protocol's three-step response:** "Name the risk → Offer a lighter alternative → Accept with documentation" ensures the user never feels blocked or argued with. The agent informs, offers options, then proceeds — maintaining momentum.
- **Disengagement Protocol:** Handles the most delicate UX scenario — when the user is losing interest or getting frustrated — with empathy and concrete alternatives rather than persistence.

**Concerns:**
- The full pipeline, if applied at DEEP tier, could involve dozens of individual question/answer exchanges. For a user who expected a quick requirements discussion, this could feel slow. The Scope-Adaptive Triage mitigates this for projects that don't need full rigor, but the user might not realize at the outset how long the DEEP pipeline takes. A brief upfront time estimate ("This typically takes 15-30 minutes for a DEEP-tier session") would set expectations.
- The skill does not address the **asynchronous communication** scenario where the user responds hours or days later and may have lost context. The Multi-Session Resumption section covers this for session boundaries, but not for slow responses within a single session.

---

### 7. Depth Appropriateness: 9/10

**Evidence:**
The DEEP tier classification (lines 381-383) and the Scope-Adaptive Triage.

**What works:**
- The skill earns DEEP tier through sheer thoroughness: 8 stages, 6 HARD-GATES, 6 gap detectors, 6 anti-patterns, 4 edge case handlers, a 6-part self-review checklist with 5 role perspectives. This is not padding — each element addresses a specific failure mode in requirements work.
- The Scope-Adaptive Triage demonstrates that DEEP doesn't mean "always heavy." The same pipeline can run at three different depths, adapting to the project. This is the best possible answer to "is DEEP appropriate?" — yes, because it adapts.
- The rationale (line 383) is correct: "The cost of getting requirements wrong at this stage compounds through every downstream stage." Requirements errors are the most expensive class of software errors because they propagate through design, implementation, testing, and deployment.
- The Progressive Disclosure Map (lines 385-391) follows the pattern library's progressive disclosure pattern, keeping the skill file focused while pointing to deeper references on demand.

**Concerns:**
- The skill currently has no companion files referenced in the Progressive Disclosure Map that actually exist. The references to `docs/patterns/README.md` and `evaluation/` are valid, but the skill would benefit from a concrete worked example or case study file (e.g., `docs/examples/requirements-engineering-walkthrough.md`) that shows the full pipeline applied to a realistic scenario. This would help calibrate agent behavior and set user expectations.

---

### 8. Anti-Pattern Resistance: 10/10

**Evidence:**
The "Anti-Patterns the Agent Must Recognize" section (lines 28-35).

**What works:**
This is the strongest section of the skill and the best implementation of the anti-pattern pre-naming pattern I have seen. Each anti-pattern has four components:
1. A name that makes it memorable and discussable
2. A quoted rationalization that the agent will actually think
3. A concise explanation of why it's a trap
4. A correct alternative behavior

Let me walk through each:

- **"The user seems technical, they probably mean X" → ASSUMPTION SMUGGLING.** This is brilliant. It names the exact thought an agent has when faced with a technical user and reframes it as smuggling assumptions into the requirements. The agent is given a label to recognize the behavior in itself.

- **"This is a small project, we don't need full rigor" → RIGOR EVASION.** Catches the most common rationalization for skipping the pipeline. The counter-argument is embedded: "Small projects ship to real users. Ambiguity is ambiguity at any scale."

- **"I'll note this and come back to it" → DEFERRAL DRIFT.** Names the cognitive bias of believing you'll remember to follow up. "Deferred questions are forgotten questions" is a sharp, memorable principle.

- **"The answer is obvious from context" → CONTEXT MIND-READING.** Prevents the agent from assuming its internal model matches the user's intent. "Context is in your head, not the user's requirements" is the kind of sticky phrase that agents will recall.

- **"Let me ask all my questions at once to save time" → QUESTION DUMPING.** Directly reinforces Hard Rule 1. The explanation "Each answer changes what the next question should be" provides the why, not just the rule.

- **"The user didn't push back on my summary, so they must agree" → SILENCE-AS-CONSENT FALLACY.** This is the subtlest and most dangerous anti-pattern. By naming it and requiring "explicit affirmation, not absence of objection," the skill closes a major loophole in confirmation protocols.

All six anti-patterns are presented in the agent's own inner voice — the exact rationalizations an agent would think. This makes them self-diagnosable. When the agent thinks "The user seems technical, they probably mean X," it can immediately recognize "I'm doing ASSUMPTION SMUGGLING" and correct course.

**Concerns:**
- None. This section is exemplary.

---

## Scoring Summary

| Dimension | Score | Weight |
|-----------|-------|--------|
| 1. Trigger Quality | 9/10 | 10 |
| 2. Workflow Coherence | 10/10 | 10 |
| 3. Constraint Effectiveness | 10/10 | 10 |
| 4. Edge Case Coverage | 10/10 | 10 |
| 5. Self-Review Quality | 9/10 | 10 |
| 6. User Experience | 9/10 | 10 |
| 7. Depth Appropriateness | 9/10 | 10 |
| 8. Anti-Pattern Resistance | 10/10 | 10 |
| **TOTAL** | **76/80** | |

---

## Key Strengths

1. **Anti-Pattern Pre-Naming (Section: Anti-Patterns the Agent Must Recognize).** The six named anti-patterns with quoted rationalizations, trap names, and correct alternatives form the best implementation of this pattern across all studied skills. The names are memorable (ASSUMPTION SMUGGLING, RIGOR EVASION, DEFERRAL DRIFT, CONTEXT MIND-READING, QUESTION DUMPING, SILENCE-AS-CONSENT FALLACY) and each captures a genuine agent failure mode.

2. **Edge Case Exhaustiveness.** The skill handles Disengagement, Early Termination, Multi-Session Resumption, Headless Mode, Greenfield Evidence Gaps, Zero-Gap Attestation, and Stakeholder Conflicts — each with specific, actionable protocols rather than vague guidance. Most skills handle zero or one of these. This skill handles all seven.

3. **The Refusal Protocol.** The three-step "Name the risk → Offer a lighter alternative → Accept with documentation" transforms the hard rules from adversarial barriers into constructive guardrails. This is a pattern other skills should adopt.

4. **Scope-Adaptive Triage.** The three-tier system (Full/Standard/Lightweight) with specific stage-level behavior differences per tier is an elegant solution to the "one size doesn't fit all" problem. It respects user time while maintaining the pipeline structure.

5. **Pipeline Architecture with Durable Artifacts.** Every stage produces a named, durable artifact. The pipeline can be paused, resumed, or partially executed — the artifacts are the value, not the process.

---

## Suggested Improvement (One Thing)

**Add a concrete worked example.**

The skill describes every stage, gate, and protocol in precise detail, but an agent (or user) encountering it for the first time has to synthesize all of these into a mental model of how the pipeline actually plays out. A companion file like `docs/examples/requirements-engineering-walkthrough.md` showing the full pipeline applied to a realistic scenario (e.g., "Build a team onboarding dashboard") would:

1. Calibrate agent behavior — show what "good" looks like at each stage
2. Set user expectations — show how many questions to expect, what the outputs look like
3. Serve as a training reference — new agents can pattern-match against the example

The example should be annotated with callouts like "← This is where ASSUMPTION SMUGGLING would normally happen" and "← Notice the Gap Inventory drives the next question."

---

## Production Readiness

**Verdict: YES — production-ready.**

This skill passes all 11 validation checks, covers all major edge cases, implements 15+ patterns from the pattern library, and includes a thorough self-review mechanism. The one suggested improvement (worked example) is an enhancement, not a blocker. The skill is ready to ship.

Minor observations (not blockers):
- Perspective Check should include an End-User role alongside the five existing roles.
- A brief upfront time estimate for DEEP-tier sessions would improve UX.
- The worked example file would accelerate adoption.

---

*Gate 2 Advocate Review — completed 2026-06-17*
