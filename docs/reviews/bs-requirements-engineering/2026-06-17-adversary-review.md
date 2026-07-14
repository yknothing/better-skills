# Adversary Review: bs-requirements-engineering

**Date**: 2026-06-17  
**Reviewer Role**: Adversary  
**Skill**: bs-requirements-engineering  
**HUMAN_VERIFIED**: false

## Summary

This compatibility header normalizes review metadata after the repository-wide `bs-` namespace migration. The substantive review below is preserved unchanged.

**Migration finding**: namespace metadata normalized [LOW]  
**Schema migration status**: PASS

## Original Review

# Adversarial Review: bs-requirements-engineering SKILL.md

**Reviewer:** Adversary (Gate 2 — Peer Review)
**Date:** 2026-06-17
**Conclusion:** REQUIRES_CHANGES — 4 CRITICAL, 6 HIGH, 5 MEDIUM, 3 LOW severity issues found.

---

## Attack Vector 1: Trigger Exploits

### VULNERABILITY 1A: Overly Broad Description Triggers

**Severity:** HIGH
**Exploited Section:** Frontmatter `description` (line 3)

**Exploit Scenario:**
A user says "I want to build a personal blog." The description trigger is "when the user wants to define, clarify, or structure requirements for a feature, product, or project." A personal blog is a "project." This fires the full DEEP tier pipeline — all 8 stages, one question at a time. The user wanted a 5-minute conversation, not a 30-minute requirements interview. They will disengage by question 4.

**Why it breaks:** The description has no severity/scale filter. Every "project" triggers the same entry point. The Scope Triage in Stage 1A helps — but it fires AFTER the skill is already invoked. The user has already committed mental context-switch cost. The description should gate entry before invocation.

**Suggested Fix:** Add a severity filter to the description:
```
Use when the user wants to define, clarify, or structure requirements for a feature, product, or project — especially when the ask is ambiguous, high-stakes, or multi-stakeholder. For simple, well-scoped requests, offer a lightweight requirements check instead of the full pipeline.
```

### VULNERABILITY 1B: Trigger Miss for Technical Specification Documents

**Severity:** MEDIUM
**Exploited Section:** Input Triage table (lines 43-47)

**Exploit Scenario:**
A user says "Here's our API spec — can you help us figure out if the auth flow is correct?" This is a "structured document" (API spec). The triage table says: "Skip Stage 1. Begin at Stage 2 — gap-scan the document directly." But Stage 2's six gap detectors are designed for product requirements (Evidence: "users want," Specificity: "fast," etc.), not for technical specification review. The gap detectors will fire on things like "the API responds in <100ms" (Specificity gap? No, that IS specific) or produce false positives on technical jargon.

**Why it breaks:** The gap detectors are calibrated for product/feature requirements language, not technical specification language. An API spec review needs different detectors.

**Suggested Fix:** Add a row to the Input Triage table for "Technical specification" documents:
```
| **Technical specification** | API spec, architecture doc, data model, protocol design | Use the tech-selection or system-design skill for review. This skill handles product/feature requirements. |
```

---

## Attack Vector 2: Hard Rule Loopholes

### VULNERABILITY 2A: ONE QUESTION AT A TIME — Compound Question Loophole

**Severity:** CRITICAL
**Exploited Section:** Hard Rule 1 (line 10)

**Exploit Scenario:**
A clever agent asks: "Who are the primary users of this feature, and could you also tell me what problem they're facing that this solves?" This is technically ONE question — one sentence, one message, one `AskUserQuestion` call. But it contains two distinct information demands: (1) who are the users, (2) what problem are they facing. The user will answer the second part more fully (it's the interesting part) and the agent gets two answers for the price of one.

**Deeper exploit:** "On a scale of 1-10, how would you rate the importance of: (a) performance, (b) security, (c) ease of use, and (d) time to market?" One question, four answers.

**Why the rule fails:** The rule says "Never ask multiple questions in a single message" but does not define what constitutes "one question." Without a definition, the agent can pack arbitrary information demands into a single interrogative sentence.

**Suggested Fix:** Add a definition of "one question":
```
ONE QUESTION = one atomic information demand. A question that requires the user to provide two distinct pieces of information (e.g., "who and why") is two questions. If the user's answer would naturally contain an "and" between two distinct facts, you have asked two questions. Compound scales ("rate A, B, C, and D") are four questions.
```

### VULNERABILITY 2B: NEVER ACCEPT VAGUE ANSWERS — The "Explicitly Vague" Defense

**Severity:** HIGH
**Exploited Section:** Hard Rule 2 (line 11)

**Exploit Scenario:**
A technically sophisticated user says "I'm intentionally leaving the performance requirements vague because we haven't done load testing yet — I'll refine this after the prototype." The rule says "If the user says 'you decide,' you MUST probe." But the user didn't say "you decide." They gave a reasoned, explicit answer about WHY they're being vague. The rule as written forces the agent to probe anyway — creating a frustrating loop where the user has to repeat "I don't know yet and that's intentional."

**Why it breaks:** The rule conflates "vague because the user is being lazy" with "vague because the information genuinely does not exist yet." The latter is a legitimate project state that should be documented, not interrogated.

**Suggested Fix:** Distinguish between two types of vagueness:
```
NEVER ACCEPT VAGUE ANSWERS — unless the user explicitly states WHY the answer is vague and WHEN it will be resolved. "I don't know yet because [reason]. I'll determine this by [date/milestone]" is a valid answer. Document it as an Open Question with an owner and resolution date. "Whatever works" / "you decide" / "good enough" without rationale is still a Rigor Gap and must be probed.
```

### VULNERABILITY 2C: BLOCKING QUESTIONS ONLY — Async Tool Degradation

**Severity:** HIGH
**Exploited Section:** Hard Rule 4 (line 13)

**Exploit Scenario:**
In the degraded mode (no `AskUserQuestion` available), the rule says: "emit each question as a standalone, numbered message; end the message with 'STOP AND WAIT — do not continue until the user responds.'" But the agent is generating text into a response that the user will read later. The "STOP AND WAIT" instruction is addressed to the AGENT, not the user — but the agent has already finished generating by the time the user reads it. The agent cannot actually "wait" in a stateless API call. The instruction is performative.

**Why it breaks:** The degraded mode assumes the agent has state across turns (like in a chat interface), but many API-only contexts are stateless. The "STOP AND WAIT" instruction is impossible to enforce when the agent is a single inference call.

**Suggested Fix:** Acknowledge the stateless context explicitly:
```
If AskUserQuestion or equivalent blocking tools are unavailable: in interactive chat contexts, emit each question as a standalone message ending with "STOP AND WAIT — do not continue until the user responds." In stateless/API contexts where you cannot control turn boundaries, batch questions 3 at a time maximum and number them. Flag the output as "DEGRADED MODE — interactive clarification was not possible."
```

### VULNERABILITY 2D: SELF-REVIEW BEFORE DELIVERY — Self-Review Blindness

**Severity:** MEDIUM
**Exploited Section:** Hard Rule 5 (line 14)

**Exploit Scenario:**
The agent is asked to review its own work. Stage 7 has a detailed checklist. But the agent can mark every checkbox "pass" without genuine scrutiny — especially the Ambiguity Hunt items like "No vague adjectives." The agent wrote the document; the same model reviewing its own output will miss the same ambiguities it introduced.

**Why it breaks:** LLMs are known to be poor at self-critiquing their own outputs. The checklist is a good structure, but there is no adversarial pressure — no requirement to explain WHY each item passes.

**Suggested Fix:** Add a justification requirement:
```
Ambiguity Hunt:
- [ ] No vague adjectives ("fast," "easy," "good," "scalable," "modern," "intuitive," "robust," "flexible"). For each requirement containing an adjective, cite the measurable acceptance criterion that replaces it. If you cannot cite one, the adjective is still vague.
```

---

## Attack Vector 3: Pipeline Breakage

### VULNERABILITY 3A: Perfect User — Zero Value Add

**Severity:** CRITICAL
**Exploited Section:** Entire pipeline (lines 51-344)

**Exploit Scenario:**
A senior PM pastes a perfectly structured PRD with all sections: problem statement, stakeholders, functional requirements with acceptance criteria, non-functional requirements, constraints, out of scope, assumptions, risks, open questions. The Input Triage says "Skip Stage 1. Begin at Stage 2." Stage 2 finds zero gaps (the PRD is thorough). The ZERO-GAP ATTESTATION triggers — flagging it as "unusual." Then Stage 3 is skipped (no gaps to clarify). Stage 4 re-buckets everything the PM already bucketed. Stage 5 re-prioritizes what was already prioritized. Stage 6 reformats into the skill's template (same information, different structure). Stage 7 self-reviews. Stage 8 asks "what next?"

Total value added: zero. Total user time wasted: 15-20 minutes of confirmations. The user had a complete document and the skill reformatted it while making them confirm everything twice.

**Why it breaks:** The skill has no "exit early if input is already sufficient" path. The Input Triage only adjusts the entry point, not whether to enter at all. There is no completeness assessment before pipeline entry.

**Suggested Fix:** Add a pre-pipeline completeness check:
```
Before entering any stage, assess input completeness:
- Does the input already contain: problem statement, stakeholders, functional requirements with acceptance criteria, non-functional requirements, constraints, and assumptions?
- If YES to all: "Your document already covers the key requirements areas. I can either: (a) run a targeted gap analysis on specific sections, or (b) help you hand this off to the next stage. Which would you prefer?"
- If PARTIAL: Enter the pipeline at the first incomplete stage.
```

### VULNERABILITY 3B: Contradictory Answers Across Stages

**Severity:** HIGH
**Exploited Section:** Stage 3 (Clarify) and Stage 4 (Synthesize)

**Exploit Scenario:**
In Stage 3, the user says "Performance is the top priority — it must feel instant." The agent documents this as a Specificity gap resolved: "Performance: sub-100ms response time." In Stage 5, the user says "Ship it fast — we can optimize later." The agent assigns "sub-100ms response time" to P2 (nice to have). The requirement contradicts the priority, but the skill has no cross-stage consistency check that catches contradictions between what was clarified and what was prioritized.

**Why it breaks:** Stages are sequential but each stage's artifact can silently contradict earlier stages. The Consistency Check in Stage 7 only checks within the final document, not across the pipeline artifacts.

**Suggested Fix:** Add cross-stage consistency to Stage 7:
```
Cross-Stage Consistency:
- [ ] For each P0 requirement, verify the Clarification Log shows the user explicitly prioritized it.
- [ ] For each requirement assigned a lower priority than what was stated in Clarify, flag the discrepancy and ask the user to confirm the demotion.
- [ ] No requirement's acceptance criteria contradict its priority level (e.g., a P2 requirement with "must" language).
```

### VULNERABILITY 3C: Non-Native Speaker Misunderstanding

**Severity:** HIGH
**Exploited Section:** Stage 1B (Raw Intent Capture), Stage 3 (Clarify)

**Exploit Scenario:**
A non-native English speaker says "I want the app to be fast." The Specificity detector fires: "'fast' is vague." The agent asks: "What specific performance metric should 'fast' map to? For example, page load time, API response time, or time to first interaction?" The user doesn't know these technical distinctions in English. They answer "Yes, fast loading" — which the agent interprets as confirming page load time. But the user meant "the app should not feel slow to use," which encompasses UI responsiveness, not just load time. The clarification loop produces a false resolution.

**Why it breaks:** The skill assumes the user and agent share a vocabulary for requirements precision. Non-native speakers may agree to reformulations they don't fully understand because the agent's version sounds authoritative.

**Suggested Fix:** Add a comprehension check to the Clarify stage:
```
After each gap resolution, restate the answer in two different ways: once in technical terms, once in plain language. Ask: "Do both of these descriptions match what you meant?" If the user only confirms the plain-language version, probe the technical version.
```

### VULNERABILITY 3D: HARD-GATE vs. User Correctness Conflict

**Severity:** CRITICAL
**Exploited Section:** Stage 2 HARD-GATE (lines 114-125)

**Exploit Scenario:**
The Specificity detector flags "scalable" as a gap. The user says: "We're building an internal tool for a 5-person team. 'Scalable' means it works for 5 people. There is no further specificity needed." The user is genuinely right — for their context, "works for 5 people" IS the specific definition of scalable. But the HARD-GATE says: "DO NOT proceed to Stage 4 until all Evidence and Specificity gaps are resolved." The gap detector marked "scalable" as unresolved. The agent must keep probing — creating an adversarial loop where the user has given a valid answer but the system refuses to accept it.

**Why it breaks:** The gap detectors use pattern matching ("scalable" = gap). They don't understand that in some contexts, "scalable to 5 users" IS the resolved form. The HARD-GATE enforces resolution of a gap that was never real.

**Suggested Fix:** Allow the user to override gap classifications:
```
Gap Override Protocol: If the user disputes a gap classification, ask: "You said 'scalable.' In your context, what does 'scalable' specifically mean?" If the user provides a concrete, context-specific definition, mark the gap as RESOLVED (USER-DEFINED) rather than continuing to probe. The user's definition becomes the acceptance criterion.
```

---

## Attack Vector 4: Edge Case Gaps

### VULNERABILITY 4A: Truly Novel Projects — Greenfield Gap Overload

**Severity:** HIGH
**Exploited Section:** Stage 2 gap detectors (lines 103-110)

**Exploit Scenario:**
A founder says "I want to build a new kind of social network that doesn't use likes or follower counts — it's based on collaborative achievements." This is genuinely novel. The Evidence detector fires: no data, no research, no user feedback. The Counterfactual detector fires: no risks considered, no alternatives. The Attachment detector fires: describing the solution before the problem. The Stakeholder detector fires: only one persona mentioned.

The Evidence gap has a special case (line 148): "Some projects are genuinely greenfield." But the other five detectors have no greenfield exceptions. The agent will spend 10+ questions probing for counterfactuals, stakeholders, and attachment separation that don't exist yet because the idea is too early.

**Why it breaks:** The skill assumes all projects have some existing context to draw from. Truly novel projects at the ideation stage have none. The pipeline forces structure onto something that needs exploration, not requirements engineering.

**Suggested Fix:** Add a pre-Stage-1 gate for ideation-stage projects:
```
Pre-Stage Gate: Is this requirements engineering or ideation?
If the user is exploring a genuinely new idea with no existing users, data, or constraints:
- DO NOT run the full requirements pipeline.
- Instead, invoke the brainstorming or problem-framing skill.
- Requirements engineering requires something to engineer requirements FROM.
- Return to this skill when the user has: a defined problem, at least one known user persona, and at least one constraint.
```

### VULNERABILITY 4B: Compliance/Regulatory Requirements Not Covered

**Severity:** CRITICAL
**Exploited Section:** Six gap detectors (lines 103-110), Stage 6 document template (lines 242-274)

**Exploit Scenario:**
A user is building a healthcare app. The requirements involve HIPAA compliance. None of the six gap detectors check for regulatory or compliance requirements. The Stakeholder detector mentions "legal" as a red flag for missing stakeholders, but it does not detect missing compliance requirements themselves. The document template has Section 4 (Non-Functional Requirements) which mentions "compliance" as a sub-bullet — but the pipeline never actively probes for it. If the user doesn't volunteer compliance information, it never enters the document.

**Why it breaks:** Compliance requirements are not "gaps" in the traditional sense — they're externally imposed constraints that the user may not even know about. A gap detector that waits for the user to mention HIPAA will never find it if the user doesn't know HIPAA applies.

**Suggested Fix:** Add a seventh gap detector:
```
| **Compliance** | Are there regulatory, legal, or industry-standard requirements that apply? | Healthcare, finance, education, government, data from EU citizens, payments, children's data, accessibility law |
```
And make it a required section in the document template, not a sub-bullet of NFRs.

### VULNERABILITY 4C: Accessibility Requirements Not Probed

**Severity:** MEDIUM
**Exploited Section:** Stage 6 document template (lines 242-274), Perspective Check (lines 319-327)

**Exploit Scenario:**
The Perspective Check asks "Are accessibility needs addressed?" from the Designer's point of view. But by Stage 7, the document is already written. If accessibility was never mentioned in Stages 1-6, the Perspective Check will note it's missing — but the skill says "fix failures silently" (line 317). The agent might add "WCAG 2.1 AA compliance" to NFRs without ever discussing it with the user. This is a fabricated requirement.

Alternatively, if the agent flags it to the user, it breaks the "fix silently" instruction.

**Why it breaks:** Accessibility is a cross-cutting concern that should be probed during Clarify (Stage 3), not silently added during Self-Review (Stage 7). The current design either produces fabricated requirements or forces a late-stage rework.

**Suggested Fix:** Add accessibility to the Stakeholder gap detector:
```
| **Stakeholder** | Are all affected parties represented? | Only one user persona, no mention of admins/ops/support/legal, no consideration of users with disabilities or assistive technology needs |
```
And add to Stage 3 question generation: "If no accessibility requirements were mentioned, ask: 'Do you have any accessibility requirements or constraints? For example, screen reader support, keyboard navigation, or compliance with WCAG standards?'"

---

## Attack Vector 5: Token/Context Abuse

### VULNERABILITY 5A: Progressive Disclosure Map Is Ornamental

**Severity:** LOW
**Exploited Section:** Progressive Disclosure Map (lines 385-391)

**Exploit Scenario:**
The Progressive Disclosure Map lists three on-demand references: `docs/patterns/README.md`, `evaluation/datasets/`, and `evaluation/rubrics/judge-prompt-template.md`. But nowhere in the skill body are there explicit "READ docs/patterns/README.md" triggers. The agent is expected to know when to reference them. The map is documentation for humans, not executable instructions for the agent.

**Why it's low severity:** It doesn't break the skill. But it's ~7 lines of token budget that could be removed or made actionable.

**Suggested Fix:** Either remove the map (it belongs in CLAUDE.md or a README), or add explicit triggers in the skill body:
```
When you need pattern rationale for a specific technique used in this skill, read docs/patterns/README.md sections: [specific sections].
```

### VULNERABILITY 5B: Redundant Rule Restatement

**Severity:** LOW
**Exploited Section:** Hard Rules (lines 6-14) vs. Anti-Patterns (lines 26-35) vs. Stage-specific rules

**Exploit Scenario:**
"ONE QUESTION AT A TIME" appears in Hard Rule 1 (line 10), Anti-Pattern 5 "QUESTION DUMPING" (line 34), Stage 3 rules "Ask exactly ONE question per message" (line 134), and the Question Quality Checklist (line 140). That's four restatements of the same constraint. Each restatement consumes tokens. The anti-patterns section (lines 26-35) is essentially the Hard Rules rewritten in negative form ("what not to do" vs "what to do").

**Why it's low severity:** Redundancy can be a feature for emphasis. But at DEEP tier, every token counts toward context budget.

**Suggested Fix:** Consolidate. Keep the Hard Rules as the canonical source. Replace anti-patterns with a one-liner: "The following rationalizations are common failure modes. When you catch yourself thinking any of these, re-read the corresponding Hard Rule." Then list just the anti-pattern name and which rule it violates.

---

## Attack Vector 6: Over-Engineering Risk

### VULNERABILITY 6A: Full Pipeline for Simple Requests

**Severity:** HIGH
**Exploited Section:** Scope-Adaptive Triage (lines 67-81), Lightweight tier definition

**Exploit Scenario:**
A user says "Add a search bar to the admin dashboard." This is a Lightweight-tier request per the triage criteria: "Bug fix, small tweak, solo project, <3 days." The Lightweight tier skips Stage 3 (Clarify) and Stage 5 (Prioritize) and Stage 8 (Handoff). But it still runs Stages 1, 2, 4, 6, 7.

Stage 1: Scope triage ("quick tweak, right?"), Raw Intent Capture ("describe the search bar"), confirm.
Stage 2: Run six gap detectors on "add a search bar to the admin dashboard." Evidence: "no data cited" — GAP. Specificity: "what does 'search bar' mean?" — GAP. Counterfactual: "no alternatives considered" — GAP. Attachment: "describing solution before problem" — GAP. Durability: "no edge cases" — GAP. Stakeholder: "only admin mentioned" — GAP.

Six gaps detected on a search bar. Then Stage 4 synthesizes these into three buckets. Stage 6 produces a 10-section requirements document. For a search bar.

**Why it breaks:** The Lightweight tier still applies the gap detectors — which are calibrated for feature-level ambiguity, not UI component-level requests. A search bar has known patterns. Running the full gap scan is performative rigor that produces noise, not insight.

**Suggested Fix:** Add a fourth tier below Lightweight:
```
| **Micro** | Single UI component, config change, copy update, <2 hours | Stages 1, 6, 7 only. Stage 1: confirm scope as micro. Stage 6: produce a minimal spec (Problem, Functional Requirements, Acceptance Criteria only). Stage 7: run Placeholder Scan and Ambiguity Hunt only. |
```

---

## Attack Vector 7: Refusal Protocol Weakness

### VULNERABILITY 7A: Systematic Refusal — Death by a Thousand Acceptances

**Severity:** CRITICAL
**Exploited Section:** Refusal Protocol (lines 16-24)

**Exploit Scenario:**
A user who dislikes process says:
- Stage 1: "Skip the raw intent capture, I already know what I want." Agent: "Here's the risk... lighter alternative... okay, accepted with documentation."
- Stage 2: "Skip the gap scan, I've thought about this." Agent: "Here's the risk... lighter alternative... okay, accepted with documentation."
- Stage 3: "Skip clarifying, I'm sure." Agent: "Here's the risk... lighter alternative... okay, accepted with documentation."
- Stage 4: "Skip synthesis, just document what I said." Agent: same pattern.
- Stage 5: "Everything is P0." Agent: same pattern.
- Stage 7: "Skip self-review, I'll review it myself." Agent: same pattern.

Result: The user has refused every gate. The final document is a transcription of their original vague prompt, plus an Assumptions & Risks section that lists every skipped stage. The skill was invoked, consumed 20+ turns of conversation, and produced zero value beyond what `Write` would have done on turn 1.

**Why it breaks:** The Refusal Protocol's step 3 ("Accept with documentation") creates a ratchet: each individual refusal seems reasonable, but the cumulative effect destroys the pipeline's value. There is no cumulative refusal threshold — no point where the agent says "You've skipped 4 of 8 stages. At this point, the requirements document will not be reliable. I recommend we stop and you revisit this when you're ready for a more thorough process."

**Suggested Fix:** Add a cumulative refusal threshold:
```
Cumulative Refusal Threshold: If the user insists on skipping 3 or more stages (or 2 or more HARD-GATES), pause and state: "We've now skipped [N] stages. The resulting document will have significant gaps. I can still produce it, but I recommend we either: (a) proceed with a Micro-tier pass instead, or (b) stop here and revisit when you have more time. Which would you prefer?" If the user still insists, produce the document but add a prominent warning at the top: "WARNING: This requirements document was produced with [N] stages skipped at user request. It may contain unresolved ambiguities, unverified assumptions, and missing requirements. Review thoroughly before implementation."
```

---

## Attack Vector 8: Anti-Pattern Detection Failure

### VULNERABILITY 8A: Missing Anti-Patterns

**Severity:** MEDIUM
**Exploited Section:** Anti-Patterns list (lines 26-35)

**Missing Anti-Pattern 1: "This is just like [X project] we built before" — PATTERN OVERFITTING.**

**Exploit Scenario:** The user says "This is just like the payment system we built for Project Alpha — same requirements." The agent accepts this and skips probing because "the requirements are known." But the new project has different constraints, users, scale, and regulatory context. The similarity is surface-level.

**Suggested Addition:**
```
- **"This is just like X we built before"** — PATTERN OVERFITTING. Similar surface features do not mean identical requirements. Every project has unique constraints, stakeholders, and context. Treat it as new until proven otherwise.
```

**Missing Anti-Pattern 2: "Let me just capture everything the user says and organize it" — SCRIBE MODE.**

**Exploit Scenario:** The agent becomes a passive transcriptionist, organizing the user's words into the document template without challenging, probing, or detecting gaps. This technically passes all HARD-GATES (the user "confirmed" everything) but produces a document that is just the user's initial thinking in a template — zero value added.

**Suggested Addition:**
```
- **"I'll just capture what the user says and organize it"** — SCRIBE MODE. Requirements engineering is not transcription. If you are not challenging assumptions, detecting gaps, or adding structure the user didn't provide, you are not engineering requirements — you are formatting text.
```

**Missing Anti-Pattern 3: "The user is the domain expert, so their answer is correct" — EXPERTISE DELEGATION.**

**Exploit Scenario:** The user is a domain expert (e.g., a doctor specifying a medical app). They give an answer that seems odd from a software engineering perspective. The agent defers: "They're the expert." But domain expertise does not equal requirements clarity. The doctor knows medicine but may not know how to specify software requirements. The agent should probe regardless.

**Suggested Addition:**
```
- **"The user is the domain expert, so their answer must be correct"** — EXPERTISE DELEGATION. Domain expertise is about the problem space, not about expressing requirements clearly. Even experts benefit from structured questioning. Probe with respect, but probe.
```

---

## Summary: Issue Count by Severity

| Severity | Count | Issues |
|----------|-------|--------|
| CRITICAL | 4 | 2A (Compound question loophole), 3D (HARD-GATE vs user correctness), 4B (Compliance gap), 7A (Systematic refusal) |
| HIGH | 6 | 1A (Overly broad trigger), 2B (Explicitly vague defense), 2C (Async tool degradation), 3B (Cross-stage contradictions), 3C (Non-native speaker), 4A (Greenfield overload), 6A (Over-engineering simple requests) |
| MEDIUM | 5 | 1B (Technical spec trigger miss), 2D (Self-review blindness), 4C (Accessibility not probed), 8A (Three missing anti-patterns) |
| LOW | 3 | 5A (Ornamental disclosure map), 5B (Redundant rule restatement) |

## Overall Assessment

This is a strong skill with well-structured thinking. The pipeline architecture is sound, the gate system is appropriate, and the anti-pattern naming is genuinely useful. The Disengagement Protocol and Headless Mode show thoughtful edge-case handling.

However, the skill has a fundamental tension: it applies the same structural rigor regardless of input quality. A perfect PRD and a vague one-liner both enter the pipeline. The Scope Tiers mitigate this partially, but the gap detectors are one-size-fits-all — they will find "gaps" in a search bar request and miss compliance requirements in a healthcare app.

The four CRITICAL issues should be addressed before this skill ships. The HIGH issues will cause real user frustration in predictable scenarios. The MEDIUM and LOW issues can be addressed iteratively.

### Recommended Priority Fixes

1. **Fix 2A (Compound question loophole):** Define "one question" explicitly. This is the most exploitable rule in the entire skill.
2. **Fix 4B (Compliance gap):** Add a seventh gap detector for regulatory/compliance requirements. This is a real-world failure mode with legal consequences.
3. **Fix 7A (Systematic refusal):** Add a cumulative refusal threshold. Without it, the Refusal Protocol is a self-destruct mechanism.
4. **Fix 3D (HARD-GATE vs user correctness):** Allow user override of gap classifications with concrete definitions. The system must trust the user when they provide specific context.
