---
name: one-question-at-a-time
chinese_name: 一次一个问题
category: interaction-design
sources:
  - Anthropic
  - CE
description: Ask exactly one question per message and wait for the user's response before asking the next, so each answer informs the next question.
also_named_as: []
status: active
---

# 一次一个问题 · One Question at a Time

> **Category**: 02. 交互设计模式
> **Sources**: Anthropic, CE
> **Status**: active

## What this pattern is

The agent asks exactly one question per message and waits for the user's response before asking the next. "One question" means exactly one interrogative sentence targeting exactly one unknown. Compound questions ("Who are the users and what problem do they have?"), questions with embedded sub-questions ("What should the system do, and how fast should it be?"), and questions that front-load context requiring multiple decisions are all violations. The discipline is strict because each answer from the user changes what the next question should be — batching questions wastes the signal.

This pattern is the interaction-side counterpart to [`blocking-question-tools`](../02-interaction-design/blocking-question-tools.md). One-question-at-a-time is the **policy** (what questions to ask and when); blocking-question-tools is the **mechanism** (how to ask them without continuing execution).

## Why it works

Question batching is an efficiency illusion. When an agent asks three questions at once, the user will answer the easiest one fully, partially answer the second, and skim the third. The agent then either re-asks the under-answered questions (wasting turns) or proceeds with incomplete information (wasting downstream work). One question at a time produces higher-quality answers per question because the user's attention is undivided, and each answer reshapes the next question — the agent adapts rather than guessing.

## When to use it

- Discovery and requirements-gathering skills where the user's answers define the work.
- Any skill that must gather structured information from the user across multiple dimensions.
- Skills where question quality (precision, relevance) matters more than speed.

Skip it for skills where the information need is a single, simple question (e.g., "which file should I edit?") or where speed of answer is the primary constraint.

## Used by

- `requirements-engineering` — Hard Rule #1: "ONE QUESTION AT A TIME. Never ask multiple questions in a single message." The Clarify stage (Stage 3) enforces this with a Question Quality Checklist per question.
- `prose-craft` — "One Question at a Time" section defines priority order for clarification (audience → goal → tone → length → constraints), and Step 2 of the Workflow enforces asking only one before proceeding.

## Examples

From `skills/requirements-engineering/SKILL.md`:

```markdown
1. **ONE QUESTION AT A TIME.** Never ask multiple questions in a single message.
   Each question dilutes the quality of every answer. Wait for the user's response
   before asking the next. A "single question" means exactly one interrogative
   sentence targeting exactly one unknown. Compound questions ("Who are the users
   and what problem do they have?"), questions with embedded sub-questions
   ("What should the system do, and how fast should it be?"), and questions that
   front-load context requiring multiple decisions are all violations. If you find
   yourself writing "and" or a comma between two things you need to know, you are
   asking two questions.
```

The rule is self-referential: it defines what a "single question" IS (one interrogative sentence, one unknown) and what it IS NOT (compound, embedded sub-questions, front-loaded decision bundles). The detection heuristic ("if you find yourself writing 'and' or a comma between two things you need to know, you are asking two questions") gives the agent a self-check mechanism.

From `skills/prose-craft/SKILL.md`:

```markdown
## One Question at a Time

When the request is ambiguous — audience unclear, tone unspecified, length target
missing — ask **exactly one question** at a time. Pick the highest-leverage unknown,
ask it, and wait for the answer before asking the next.

Priority order for clarification:
1. **Audience.** Who is reading this?
2. **Goal.** What should the reader think, feel, or do after reading?
3. **Tone.** Casual? Authoritative? Warm? Clinical? Playful?
4. **Length.** Shorter? Longer? Same length but tighter?
5. **Constraints.** Any words, phrases, or ideas that must stay?
```

The priority order converts "ask one question" from a rule into a strategy: the agent knows which question to ask *first*.

## Related patterns

- [`blocking-question-tools`](../02-interaction-design/blocking-question-tools.md) — the mechanism that enforces one-question-at-a-time (AskUserQuestion or equivalent blocking tools)
- [`scoping-synthesis`](../02-interaction-design/scoping-synthesis.md) — the synthesis that comes *after* all the one-at-a-time questions have been answered
- [`rigor-gap`](../02-interaction-design/rigor-gap.md) — the gap detectors tell you *what* to ask about; one-question-at-a-time tells you *how* to ask
- [`standalone-message-rule`](../02-interaction-design/standalone-message-rule.md) — each single question should occupy its own message, not be embedded in other content
