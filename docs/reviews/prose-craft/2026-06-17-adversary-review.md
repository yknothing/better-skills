# Adversary Review: prose-craft

**Reviewer Role**: Adversary (Gate 2)
**Date**: 2026-06-17
**Skill**: prose-craft
**Review Type**: Peer Review — Attack Surface Analysis

---

## Summary

The prose-craft skill is the most ambitious in Batch 1 — it attempts bilingual editing, voice preservation via fingerprint metrics, domain-adaptive editing rules, and a self-review loop with retry caps. This ambition is also its greatest vulnerability. The skill introduces multiple structural contradictions that will surface under real-world usage, not just in edge cases.

Overall, 2 CRITICAL, 4 HIGH, 3 MEDIUM, 0 LOW findings.

---

## CRITICAL Findings

### CRITICAL-1: Voice Preservation Paradox (Hard Constraint 1 + Pass 1-3)

**Severity**: CRITICAL
**Section**: Hard Constraint 1 ("Preserve the author's voice"), Pass 1 fingerprinting, Pass 2 sentence craft, Soft Guidelines

**The Vulnerability**:

Hard Constraint 1 commands the agent to "preserve the author's voice." Pass 1 extracts a "stylistic fingerprint" — average sentence length, concrete-to-abstract ratio, first-person frequency, signature transitions. Pass 2 then tells the agent to "tighten individual sentences. Fix rhythm, cut filler, strengthen verbs, resolve ambiguity." The Soft Guidelines tell the agent to cut "it is worth noting that," "in order to," "there is/are," "very," "really," "quite."

These two directives are directly contradictory when the author's voice IS those things. Consider an author whose natural voice includes:
- Frequent "there is/are" constructions as a rhetorical pattern
- "It is worth noting that" as a discourse marker signaling importance
- "Very" and "really" as conversational emphasis markers
- Long, winding sentences with complex subordination

The agent has no mechanism to distinguish "voice" from "bad writing habits." The skill provides no decision framework. It just says "keep personality — just make it work better" and then lists a bunch of things the author might be doing that must be removed.

**Specific Exploit**:

Feed the agent a draft by a writer whose voice is conversational, uses discourse markers heavily, and has long sentences:

> "So there are a few things that are really worth noting about this approach. It is, in order to be completely honest, quite different from what we've been doing up until now. The thing is, it works better — very much better — than any of the alternatives we've tested."

This text has filler words, "there are," "it is worth noting," "in order to," "very," "quite," "thing." Removing all of them would strip the conversational voice entirely. The agent will either:

1. **Follow Hard Constraint 1**: Keep the voice, fail the Soft Guidelines and the self-review checklist ("Have filler words been cut?"). Loop-and-retry hell.
2. **Follow Soft Guidelines + Pass 2**: Cut all filler, flatten the voice to generic prose. Pass the checklist but violate Hard Constraint 1.
3. **Attempt a compromise**: Cut some filler, keep some. But without guidance on which is voice and which is habit, this is random — not skill-guided editing.

**Worst Case**: The retry loop (Step 4) produces 2 iterations of oscillation — first edit cuts too much, second edit restores too much, then the agent delivers broken output with a note. The user gets worse prose than they started with, plus a confusing explanation about metric boundaries.

**Suggested Fix**:

Add a pre-editing classification step. Before Pass 1, ask the agent to tag each "problem" it finds as either `[VOICE]` or `[HABIT]`:

```yaml
Voice vs. Habit Classification:
  VOICE indicators (keep):
    - Serves a rhetorical function (emphasis, pacing, intimacy)
    - Consistent across the author's writing (not one-off)
    - Removing it changes the felt personality of the text
    - Example: "It is worth noting that" when used to build anticipation
  HABIT indicators (remove):
    - Adds no semantic or rhetorical weight
    - Inconsistent — the author doesn't always use it
    - Removing it makes the sentence strictly clearer
    - Example: "It is worth noting that" when the sentence already implies importance
```

If the agent cannot determine whether something is voice or habit, it should flag and ask the user — not guess.

---

### CRITICAL-2: Checklist Retry Cap Produces Worse Output Than No Skill

**Severity**: CRITICAL
**Section**: Step 4 — Self-Review Checklist, retry cap paragraph

**The Vulnerability**:

> "If any item fails, return to the relevant pass and fix it. **Retry at most 2 times.** If any checklist item still fails after 2 retries, stop and deliver the output as-is with a note explaining which items did not pass, why they could not be resolved within the retry limit, and what tradeoffs the user may want to consider."

This creates a perverse incentive structure. The agent knows it can deliver KNOWN-BROKEN output. The retry cap is a safety valve, but it also functions as a license to give up.

**Specific Exploit**:

Consider a text that genuinely cannot satisfy all constraints simultaneously — e.g., a 500-word draft that is naturally verbose but the user asked to tighten to 250 words while preserving voice and fingerprint metrics. The fingerprint metrics (within 20%) will inevitably fail after a 50% length reduction. The agent tries twice, fails, and delivers.

The user now has:
1. A text that the agent itself has declared "not passing."
2. An explanation of why it couldn't be fixed.
3. A worse experience than if the agent had just said "this is impossible, here's what I can do" BEFORE spending 3 passes and 2 retries editing.

**Why This Is Critical**:

The skill's value proposition is "better prose." If it can deliver output it knows is broken, it undermines the entire premise. A user who receives broken output with an apology note will stop trusting the skill. The failure mode is worse than no skill at all because:
- No skill: user does nothing, keeps original text.
- Broken skill output: user now has modified text that the modifier itself says is wrong.

**Suggested Fix**:

Replace the retry cap with a pre-flight constraint check:

```
Before Step 1, run a Constraint Feasibility Check:

1. If the user asks to tighten by >30%, warn that voice metrics may shift beyond 20%.
   Ask: "A 50% reduction will likely change the stylistic fingerprint. Should I
   prioritize length reduction or voice preservation?"

2. If the user asks for mutually exclusive goals, flag before editing:
   "Tightening to 250 words while keeping the conversational voice with all its
   discourse markers is difficult. Which should I prioritize?"

3. If any checklist item fails after 1 retry, STOP. Do not retry again. Return to
   the user with: the original text, the one attempted edit, and a specific question
   about which constraint to relax. Never deliver output the agent knows is broken.
```

The principle: **detect impossible constraints before editing, not after**.

---

## HIGH Findings

### HIGH-1: Fingerprint Metrics Are Gameable (20% Margin)

**Severity**: HIGH
**Section**: Pass 1 — fingerprint metrics, 20% boundary

**The Vulnerability**:

The fingerprint metrics are the only verifiable mechanism for voice preservation. But 20% is a wide margin that permits significant voice alteration while staying "within bounds."

Consider:
- **Average sentence length**: Original 25 words. 20% range: 20-30 words. A shift from 25 to 21 is a 16% change — within bounds — but produces noticeably shorter, punchier prose. This is a meaningful voice change.
- **Concrete-to-abstract ratio**: This metric is not even well-defined in the skill. How does the agent compute "concrete-to-abstract noun ratio"? Does it have a list of abstract noun suffixes? Does it classify each noun individually? Without a clear operational definition, the metric is an illusion of objectivity.
- **First-person frequency**: Original 8%. 20% of 8% is ±1.6 percentage points. Range: 6.4%-9.6%. An agent could double or halve first-person usage within this range if the original frequency is low.

**Specific Exploit**:

An agent could systematically shift all three metrics to the edge of the 20% boundary in the same direction — shorter sentences, more concrete nouns, less first-person — and produce prose that is stylistically very different from the original while passing all three checks. The 20% threshold for each individual metric does not prevent coordinated drift across all metrics.

**Suggestion**:

1. Add a composite drift score: if all three metrics shift in the same direction and the combined Euclidean distance exceeds some threshold, flag it even if each individual metric is within 20%.
2. Provide an operational definition for the concrete-to-abstract ratio. Without one, this metric is unverifiable and should not be in the checklist.
3. Consider tightening the margin to 10-15% for sentence length (the most salient voice indicator).

---

### HIGH-2: Domain Detection Is Forced Single-Classification

**Severity**: HIGH
**Section**: Step 0 — Domain Detection

**The Vulnerability**:

The domain detection forces exactly one classification: general prose, technical documentation, marketing copy, creative/narrative, or legal/policy. But real-world text is frequently hybrid:

- A technical tutorial with marketing framing ("Learn Rust in 10 minutes — it's easier than you think!")
- A legal document with creative storytelling (amicus briefs, narrative legal writing)
- A product announcement email that is part marketing, part technical documentation, part personal essay

When classification is ambiguous, the skill says: *"If NOT general prose, state it and ask: 'This appears to be [type]. Standard prose rules may not apply. Should I proceed with domain-appropriate editing, or switch approach?'"*

But asking the user to classify their own text is abdicating the skill's responsibility. The user hired the skill because they don't know what kind of editing their text needs. If the user says "just tighten it," and the skill says "but first, is this marketing or technical?", the user is rightfully annoyed.

**Specific Exploit**:

Feed a hybrid text: a technical blog post that opens with a personal story, contains code blocks, has a marketing CTA at the end, and uses informal conversational tone throughout.

The agent must pick ONE domain. Depending on which it picks:
- **Technical documentation**: Code blocks preserved, but the personal story and CTA get flattened.
- **Marketing copy**: Fragments and emotional language preserved, but the technical explanations get weakened.
- **Creative/narrative**: Voice preserved, but the technical precision gets lost.
- **General prose**: Standard rules applied, but code blocks might get damaged and the CTA might get over-edited.

In all cases, the wrong part of the text gets the wrong treatment.

**Suggestion**:

Allow per-section domain tagging. Before editing, the agent should annotate sections of the text with their domain:

```
[Section 1: creative/narrative] — personal story opening
[Section 2: technical] — code walkthrough
[Section 3: marketing] — CTA and value proposition
```

Then apply domain-appropriate rules per section. This is more complex but necessary for real-world text.

---

### HIGH-3: Chinese Rules Are Linguistically Questionable

**Severity**: HIGH
**Section**: Reference: Common Fixes (Chinese), Bilingual Content scenario

**The Vulnerability**:

The Chinese rules are presented as universally correct, but several have significant false-positive risk:

1. **"进行/加以/予以 + noun → Replace with a direct verb. 进行研究 → 研究."**

   This is NOT always correct. "进行研究" and "研究" are not always interchangeable:
   - "对这个问题进行研究" (conduct research on this problem) — "进行" serves as a light verb that allows the object to be fronted with "对". Removing it forces a different syntactic structure.
   - In formal/academic Chinese, "进行" constructions are standard register markers. Removing them makes academic Chinese sound informal — which is exactly the "casual English + formal Chinese friction" the skill warns about elsewhere.

2. **"的-串 (three or more 的 in one clause) → Break into shorter clauses."**

   This rule uses a character count, not a linguistic analysis. A sentence like "我买的书的内容的第三章的结尾" is genuinely bad. But "他说的那个问题的解决方案的可行性" is standard formal Chinese — the 的s attach to different noun phrases and are not a "chain" in the linguistic sense. The rule can't distinguish these cases.

3. **"四字格 overuse (>2 in a paragraph) → Replace some with plain expressions."**

   The threshold of 2 per paragraph is arbitrary and low. In formal Chinese writing (academic, official, journalistic), 3-5 四字格 per paragraph is normal. This rule would flag well-written formal Chinese as "pompous."

**Specific Exploit**:

Feed the agent a paragraph from a Chinese academic paper:

> "本研究对该问题进行深入研究，并加以分析，以期为后续的相关研究提供参考。"

The agent would:
- Flag "进行研究" → change to "研究" (removes the formal register marker)
- Flag "加以分析" → change to "分析" (same)
- Result: "本研究对该问题深入研究，并分析，以期为后续的相关研究提供参考。" — grammatically broken because "对该问题...分析" needs the light verb to bridge the 对-construction.

The output is worse Chinese than the input.

**Suggestion**:

1. Add context sensitivity to the Chinese rules. "进行/加以/予以" should only be flagged when they serve no syntactic function (e.g., when the object directly follows without a preposition).
2. Replace the character-count-based 的-串 rule with a structural rule: flag 的 when multiple 的s modify the same head noun, not when they appear in different clauses.
3. Raise the 四字格 threshold to 3-4 per paragraph, or make it domain-sensitive (academic: higher threshold; casual: lower threshold).
4. Add a warning: "These Chinese rules are for general prose. For academic, legal, or official Chinese, consult domain-specific guidelines."

---

### HIGH-4: Bilingual Register Matching Is Conceptually Flawed

**Severity**: HIGH
**Section**: Soft Guidelines (bilingual text), Bilingual Content scenario

**The Vulnerability**:

> "For bilingual text: match the register across languages. A casual English passage paired with formal Chinese creates cognitive dissonance."

This assumes that register maps 1:1 between English and Chinese. It doesn't.

- **"Casual" in English** maps to contractions, phrasal verbs, sentence fragments, colloquialisms.
- **"Casual" in Chinese** maps to 口语化 expressions, sentence-final particles (啊, 吧, 呢), colloquial vocabulary choices.

But these are different linguistic features. An agent cannot meaningfully compare register across languages by looking at the same features. What reads as "casual" in English (e.g., using "stuff" instead of "material") has no direct Chinese equivalent — the agent would need to judge whether the Chinese is "equivalently casual," which requires deep bilingual competence that LLMs do not reliably possess.

**Specific Exploit**:

Feed the agent a bilingual passage where:
- English: Casual, uses "gonna," "stuff," "kind of," contractions
- Chinese: Standard written Chinese (not formal, not colloquial — just normal written register)

The agent flags "register mismatch" and asks whether to align. But:
- If it makes the Chinese more casual (adds 啊/吧/呢, uses 口语 vocabulary), it sounds juvenile.
- If it makes the English more formal (removes contractions, replaces "stuff" with "material"), it loses the author's voice.

The register "mismatch" may be intentional — the author is comfortable in casual English but writes Chinese at a standard register. That's not a bug; it's a feature of bilingual writing.

**Suggestion**:

Replace "match the register across languages" with:

> "Check whether the register shift between languages serves a purpose. If the English is casual and the Chinese is formal, ask: is this intentional (e.g., the author is more comfortable in one language) or accidental? Flag only accidental register clashes — where the shift undermines the text's purpose. Do not enforce register uniformity across languages unless the user explicitly requests it."

---

## MEDIUM Findings

### MEDIUM-1: "utilize" → "use" Is Not Always Correct

**Severity**: MEDIUM
**Section**: Reference: Common Fixes (English)

**The Vulnerability**:

The table lists "utilize" → "use" as an always-correct substitution. But "utilize" has a specific meaning in technical and scientific contexts: "to use something for a purpose other than its intended one" or "to make practical use of something."

- "We used a hammer to drive the nail." (correct — standard use)
- "We utilized a wrench as a hammer." (correct — non-standard use of the tool)
- "We utilized the algorithm to process the data." (could be either — depends on whether the algorithm was designed for this specific data)

Replacing "utilize" with "use" in the second case loses semantic precision. In technical documentation, this distinction matters.

**Suggested Fix**:

Change the table entry to:
```
"utilize" → "use" (unless the context implies using something
for an unintended purpose; flag and ask if unsure)
```

---

### MEDIUM-2: Legal Text Handling Contradiction

**Severity**: MEDIUM
**Section**: Step 0 — Domain Detection (Legal/policy), "Tighten Wordy Text" scenario

**The Vulnerability**:

Step 0 says for legal text: "NEVER alter meaning. Flag ambiguities with `[?]` but do NOT resolve them. Do not restructure sentences or paragraphs."

But the "Tighten Wordy Text" scenario says: "Pass 1: cut redundant paragraphs and sentences. Pass 2: cut filler, compress phrases."

If the user says "tighten this contract," the agent must reconcile:
1. The legal domain rule (don't restructure, don't resolve ambiguity, flag with `[?]`)
2. The tightening scenario (cut redundant sentences, compress phrases, cut filler)

Cutting a "redundant" sentence in a contract is inherently a judgment about what is essential. Contracts often have apparently redundant clauses that serve legal functions (belt-and-suspenders drafting). The agent cannot reliably distinguish functional redundancy from true redundancy.

**Suggested Fix**:

Add to the Legal/policy domain rule:

> "If the user asks to tighten legal text, warn them: 'Legal text often includes intentional redundancy for enforceability. I can flag apparent redundancies with `[?]` but should not remove them. Shall I proceed with flagging only?'"

---

### MEDIUM-3: "One Question at a Time" Can Be Painfully Slow

**Severity**: MEDIUM
**Section**: One Question at a Time

**The Vulnerability**:

The skill mandates asking exactly one question at a time for five possible clarification dimensions (audience, goal, tone, length, constraints). In the worst case, this requires 5 back-and-forth exchanges before any editing begins.

If the user provides a 200-word draft and says "polish this," the flow is:

1. Agent: "Who is the audience?"
2. User: "My team."
3. Agent: "What should they think/feel/do after reading?"
4. User: "Understand the new process."
5. Agent: "What tone?"
6. User: "Professional but friendly."
7. Agent: "Shorter, longer, or same?"
8. User: "Same length."
9. Agent: "Any constraints?"
10. User: "No."

That's 10 messages before a single edit. For a 200-word draft, the overhead-to-value ratio is terrible.

The skill does say "If the request is clear on all five dimensions, proceed directly to the workflow." But the instruction is ambiguous about what counts as "clear." A user saying "polish this" provides zero dimensions — should the agent ask all five, one at a time? Or infer reasonable defaults for low-stakes dimensions?

**Suggestion**:

Add a shortcut rule:

> "If the user provides fewer than 3 of the 5 dimensions, ask about the highest-priority missing dimension AND infer reasonable defaults for the rest: audience = 'general professional reader,' goal = 'clearer communication,' tone = 'match existing tone.' State your defaults and allow the user to override any of them in a single response. Only enforce one-at-a-time for truly ambiguous dimensions."

---

## Cross-Cutting Observations

### The Self-Review Checklist Is Its Own Adversary

The checklist creates a closed loop: the agent edits, then checks its own work against criteria it itself applied. This is structurally vulnerable to confirmation bias — the agent is more likely to pass its own edits than an independent reviewer would.

The checklist items are also a mix of verifiable (length within 10%, fingerprint within 20%, no invented content) and subjective (clarity, rhythm, precision, audience fit). The agent will reliably check the verifiable ones and rubber-stamp the subjective ones, because admitting failure on a subjective item triggers a retry loop.

### Missing: What Prose-Craft Should NOT Do

The skill defines its scope positively (what it does) but never defines its negative scope (what it refuses to do). This is a gap that the adversarial review exploits repeatedly — the skill tries to handle everything (legal text, marketing, creative, technical, bilingual) and the rules for one domain conflict with the rules for another.

A "Scope Limitations" section would strengthen the skill significantly:

```
## When NOT to Use Prose-Craft

- **Heavily constrained text** (poetry with meter/rhyme, advertising copy with character limits,
  legal contracts where every word has been negotiated). These require specialist editing.
- **Text where the author's identity is the point** (personal memoir, experimental fiction,
  dialect-heavy writing). Voice preservation rules are too coarse for these.
- **Code or configuration files**. This skill is for prose, not code.
- **Translation**. This skill edits within a language, not across languages.
```

---

## Attack Surface Summary

| # | Finding | Severity | Section | Exploitable Without Edge Cases? |
|---|---------|----------|---------|--------------------------------|
| CRITICAL-1 | Voice preservation paradox | CRITICAL | HC1 + Pass 1-3 | Yes — any conversational author |
| CRITICAL-2 | Retry cap delivers known-broken output | CRITICAL | Step 4 | Yes — any conflicting constraints |
| HIGH-1 | Fingerprint metrics gameable at 20% | HIGH | Pass 1 | Yes — coordinated metric drift |
| HIGH-2 | Single-classification domain detection | HIGH | Step 0 | Yes — any hybrid text |
| HIGH-3 | Chinese rules linguistically questionable | HIGH | Chinese ref + scenario | Yes — formal/academic Chinese |
| HIGH-4 | Bilingual register matching is flawed | HIGH | Soft Guidelines | Yes — any bilingual content |
| MEDIUM-1 | "utilize" → "use" not always correct | MEDIUM | Common Fixes | Only in technical contexts |
| MEDIUM-2 | Legal text + tightening contradiction | MEDIUM | Step 0 + Scenarios | Only when user asks to tighten legal text |
| MEDIUM-3 | One-question-at-a-time too slow | MEDIUM | Clarification section | Only when user is terse |

---

## Verdict

**REQUIRES CHANGES.** The two CRITICAL findings (voice preservation paradox, retry-cap-as-license-to-fail) are structural — they arise from the design of the skill, not from implementation details. They will surface in routine usage, not just edge cases. The four HIGH findings compound the problem: even when the skill "works," it may produce prose that is stylistically altered beyond recognition (HIGH-1), mishandles hybrid content (HIGH-2), produces linguistically questionable Chinese (HIGH-3), or enforces register uniformity that the author never wanted (HIGH-4).

The skill has strong bones — the three-pass editing model is sound, the domain detection intent is correct, and the fingerprinting idea is innovative. But it needs constraint feasibility checking before editing begins, a voice-vs-habit classification framework, per-section domain tagging, and more nuanced Chinese rules before it is production-ready.

---

*Review conducted by: Adversary Agent (Gate 2 Peer Review)*
*Methodology: Threat modeling, constraint analysis, linguistic edge-case testing*
