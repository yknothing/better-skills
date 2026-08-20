---
name: rigor-gap
chinese_name: Rigor Gap 探测
category: interaction-design
sources:
  - CE
description: Systematically scan requirements across 7 dimensions — Evidence, Specificity, Counterfactual, Attachment, Durability, Stakeholder, Compliance — to surface hidden ambiguity before questions are asked.
also_named_as: []
status: active
---

# Rigor Gap 探测 · Rigor Gap Detection

> **Category**: 02. 交互设计模式
> **Sources**: CE
> **Status**: active

## What this pattern is

Rigor Gap Detection is a structured scan of a user's stated requirements against seven explicit dimensions of ambiguity. Each dimension has a specific detection question and a set of red-flag phrases that trigger it. The scan happens *before* the agent asks clarifying questions — it first identifies what is missing, then asks targeted questions to close those specific gaps. This converts "ask the user what they want" (vague, endless) into "detect which of seven specific things is missing, then ask about that" (structured, finite).

The seven gap dimensions are: **Evidence** (is there data backing each claim?), **Specificity** (are terms concrete and measurable?), **Counterfactual** (has the user considered what happens if they are wrong?), **Attachment** (is the user anchored to a solution rather than the problem?), **Durability** (will these requirements survive contact with reality?), **Stakeholder** (are all affected parties represented?), and **Compliance** (are regulatory, legal, or accessibility obligations identified?).

## Why it works

Untargeted clarification ("tell me more about your project") produces undirected answers. The user volunteers what is top-of-mind, not what is missing. The seven gap detectors give the agent a finite checklist of things to look for, each with specific red-flag phrases that trigger it. This converts the agent's role from "asker of open-ended questions" to "pattern matcher for known ambiguity types." The user benefits because the gaps found are gaps they genuinely did not see, not gaps they assumed the agent would infer.

## When to use it

- Requirements-gathering and discovery skills where ambiguity is the primary risk.
- Any skill that takes unstructured user input and must produce structured output.
- Skills that operate at the start of a development pipeline — gaps missed here compound through every downstream stage.

Skip it for skills where the input is already structured (e.g., "implement this PRD") or where ambiguity is low-cost.

## Used by

- `bs-prdefine` — Stage 2 (DETECT GAPS) runs all seven gap detectors against the Raw Intent Summary. The Gap Inventory artifact records each gap with type, triggering phrase, and rationale. Gap Override Protocol handles false positives.

## Examples

From `skills/bs-prdefine/SKILL.md`:

```markdown
## Stage 2: DETECT GAPS — Rigor Gap Scan

Run the user's confirmed Raw Intent Summary through these seven gap detectors.

| Gap Type | Detection Question | Red Flags |
|----------|-------------------|-----------|
| **Evidence** | Is there data, research, or user feedback backing each claim? | "I think," "probably," "users want," no data cited |
| **Specificity** | Are terms concrete and measurable? | "fast," "easy," "good UX," "scalable," "modern" |
| **Counterfactual** | Has the user considered what happens if they're wrong? | No mention of risks, alternatives, or failure modes |
| **Attachment** | Is the user anchored to a solution rather than the problem? | Describes UI/tech before stating the problem or who it serves |
| **Durability** | Will these requirements survive contact with reality? | No edge cases, no constraints, no tradeoffs acknowledged |
| **Stakeholder** | Are all affected parties represented? | Only one user persona, no mention of admins/ops/support/legal |
| **Compliance** | Are there regulatory, legal, or accessibility obligations? | No mention of data handling, privacy (GDPR/CCPA), accessibility (WCAG/ADA), industry regulations (HIPAA/PCI/SOC2), or geographic restrictions |
```

The gap table structure gives the agent both a *detection question* (what to ask itself) and *red flags* (what to scan for in the user's text). This dual-mechanism design means the agent does not need to interpret "is this ambiguous?" — it just checks for known red-flag phrases. The Gap Override Protocol handles the case where a red flag is a false positive (e.g., the user has a specific definition of "scalable").

## Related patterns

- [`scoping-synthesis`](../02-interaction-design/scoping-synthesis.md) — gap detection produces the inventory; scoping synthesis organizes the findings into Stated/Inferred/Out-of-Scope buckets
- [`one-question-at-a-time`](../02-interaction-design/one-question-at-a-time.md) — each detected gap becomes exactly one question in the Clarify stage
- [`self-review-checklist`](../03-quality-assurance/self-review-checklist.md) — the self-review checklist re-runs gap detectors against the final document as a quality gate
