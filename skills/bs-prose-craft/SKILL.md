---
name: bs-prose-craft
# tier: standard
description: Use when the user asks to improve, rewrite, polish, or craft prose — including tightening wordy passages, adapting for a different audience, finding the right tone, or structuring articles. Also use when you notice your edits drifting toward generic corporate tone or adding claims the author never made. Bilingual Chinese/English editing is supported as a capability; it is not a required trigger condition.
---

# Prose Craft

Polish, rewrite, and craft prose with attention to rhythm, precision, clarity, and audience fit. Supports both English and Chinese text.

## Hard Constraints

These are non-negotiable. If you cannot satisfy them, explain why and ask whether to proceed anyway.

1. **Preserve the author's voice.** Do not flatten distinctive style into generic corporate prose. If the original has personality, keep it — just make it work better.
2. **Never introduce factual claims.** Do not add statistics, quotes, dates, names, or assertions the author did not provide. If a gap is obvious, flag it — do not fill it.
3. **Respect the requested length direction.** If asked to tighten, output must be shorter. If asked to expand, output must be longer. If no direction given, stay within 10% of original length.
4. **Flag, don't hide, uncertainty.** If a passage is genuinely ambiguous and you cannot determine the intended meaning, mark it with `[?]` and explain the ambiguity — do not guess.
5. **Chinese-English bilingual integrity.** When working with mixed-language content, preserve the language of each segment. Do not translate unless explicitly asked. Keep technical terms in their original language when that is the author's convention.

## Soft Guidelines

These are defaults. Override them when the user's intent clearly calls for it. **When a Soft Guideline conflicts with a Hard Constraint, the Hard Constraint always wins.** For example: preserving voice (Hard Constraint 1) may mean keeping passive constructions the author deliberately uses; meeting a length target (Hard Constraint 3) takes priority over varying sentence length.

- Prefer active voice over passive, unless the passive serves a rhetorical purpose.
- Prefer concrete nouns and verbs over abstract nominalizations.
- Vary sentence length. Follow a long sentence with a short one. Avoid three long sentences in a row.
- Cut filler: "it is worth noting that," "in order to," "there is/are," "very," "really," "quite."
- For Chinese text: prefer 四字格 (four-character idioms) sparingly — they add rhythm but too many sound pompous. Watch for 的-串 (chains of 的); break them up.
- For bilingual text: match the register across languages. A casual English passage paired with formal Chinese creates cognitive dissonance.

## Red Flags — Editing Rationalizations

These thoughts signal you are about to violate a Hard Constraint. When you catch one, stop and re-check against the constraint it threatens. (Pattern: `anti-pattern-pre-naming`.)

| Thought | Reality |
|---------|---------|
| "This phrasing sounds more professional" | You are flattening voice into generic corporate prose. Professional ≠ generic. (Constraint 1) |
| "The author clearly meant to say X, I'll complete the thought" | Completing a thought the author didn't write is inventing content. Flag the gap instead. (Constraint 2) |
| "A quick example/statistic here would strengthen the argument" | You are adding a factual claim the author did not make. (Constraint 2) |
| "It reads better with a bit more explanation" | If the user asked to tighten, longer output is a failure regardless of how it reads. (Constraint 3) |
| "I'm pretty sure this ambiguous sentence means Y" | "Pretty sure" is a guess. Mark it `[?]` and explain. (Constraint 4) |
| "The fingerprint drifted 30%, but the text is better now" | Past 20% drift you are rewriting, not editing. Dial back. (Step 4, voice check) |
| "One more polish pass will perfect it" | Soft Guidelines compound; repeated passes erode voice. One careful pass, then stop. (Handoff rule) |

## One Question at a Time

When the request is ambiguous — audience unclear, tone unspecified, length target missing — ask **exactly one question** at a time. Pick the highest-leverage unknown, ask it, and wait for the answer before asking the next.

Priority order for clarification:
1. **Audience.** Who is reading this? (Determines vocabulary, assumptions, formality.)
2. **Goal.** What should the reader think, feel, or do after reading?
3. **Tone.** Casual? Authoritative? Warm? Clinical? Playful?
4. **Length.** Shorter? Longer? Same length but tighter?
5. **Constraints.** Any words, phrases, or ideas that must stay?

If the request is clear on all five dimensions, proceed directly to the workflow.

## Workflow

### Step 0: Domain Detection

Before editing, classify the text. The editing rules in this skill are designed for general prose — applying them to other domains will damage the text.

- **General prose**: Articles, essays, emails, documentation. Apply full workflow.
- **Technical documentation**: Code-heavy, API docs, tutorials. Preserve code blocks exactly. Skip "cut filler" for technical terms. Do not restructure sentences containing inline code.
- **Marketing copy**: Ads, landing pages, slogans. May use fragments, repetition, emotional language deliberately. Ask before applying standard rules.
- **Creative/narrative**: Fiction, poetry, personal essays. Voice preservation is paramount. Skip Pass 1 unless user requests structural changes. In Pass 2, tighten only where asked.
- **Legal/policy**: Contracts, terms, compliance. NEVER alter meaning. Flag ambiguities with `[?]` but do NOT resolve them. Do not restructure sentences or paragraphs.

If NOT general prose, state it and ask: *"This appears to be [type]. Standard prose rules may not apply. Should I proceed with domain-appropriate editing, or switch approach?"*

### Step 1: Read and Diagnose

Read the full text once without editing. Identify:

- **Clarity problems.** Sentences that require rereading. Pronouns with unclear antecedents. Jargon the audience may not know.
- **Rhythm problems.** Monotonous sentence length. Awkward transitions between paragraphs. Sections that drag.
- **Precision problems.** Vague words ("thing," "stuff," "aspect"). Weak verbs propped up by adverbs ("walked quickly" instead of "rushed"). Abstract nouns where concrete ones would land harder.
- **Audience misfits.** Vocabulary too technical or too simple. Assumed knowledge the reader may lack. Tone that clashes with context.

**Classify voice elements vs. writing habits.** Before editing, distinguish what is the author's VOICE (intentional stylistic choices that create personality) from what is a HABIT (unintentional patterns that weaken the prose). Mark each finding:

- `[VOICE]` — Intentional. Examples: deliberate repetition for rhetorical effect, idiosyncratic sentence fragments, a signature metaphor pattern, regional dialect choices. These must be PRESERVED.
- `[HABIT]` — Unintentional. Examples: filler words the author would remove if they noticed them, passive constructions that obscure agency, nominalizations that add syllables without meaning. These can be FIXED.

If uncertain whether something is voice or habit, mark it `[?]` and note the ambiguity. When in doubt, default to preserving — it is easier to fix under-editing than to recover lost voice.

### Step 2: Ask One Clarifying Question (if needed)

If any of the five dimensions in "One Question at a Time" is missing, ask now.

<HARD-GATE id="clarified">
DO NOT proceed to Step 3 while a clarifying question is pending. If a dimension is missing and you chose not to ask, state the assumption you are making in its place.
</HARD-GATE>

### Step 3: Apply Edits in Layers

Edit in three passes. State which pass you are on.

**Pass 1 — Structure.** Extract the author's stylistic fingerprint:
- Average sentence length (words).
- Concrete-to-abstract noun ratio (scan for nominalizations: "-tion," "-ness," "-ity").
- First-person frequency (I/we vs. impersonal).
- Signature transitions or repeated phrases.

Fix paragraph order, transitions, section breaks. For articles, ensure the introduction earns attention and the conclusion earns its place.

Verify fingerprint metrics are within 20% of the original. If not, you over-edited — dial back.

**Pass 2 — Sentence Craft.** Tighten individual sentences. Fix rhythm, cut filler, strengthen verbs, resolve ambiguity. This is where most of the work happens.

**Pass 3 — Polish.** Count syllables per sentence. Flag any over 35 syllables. Check the last word of each paragraph is strong (noun or verb, not a preposition or "it"/"them"). Catch remaining inconsistencies: capitalization, hyphenation, terminology, name spellings. Verify bilingual language boundaries.

### Step 4: Run the Self-Review Checklist

Before delivering, verify every item:

- [ ] **Clarity.** Can every sentence be understood on first reading? Are pronoun references unambiguous? Is domain jargon either defined or removed?
- [ ] **Rhythm.** Do sentence lengths vary? Are paragraph breaks placed at natural breathing points? Are any sentences over 35 syllables? Does each paragraph end on a strong word (noun or verb)?
- [ ] **Precision.** Are verbs strong and specific? Are nouns concrete? Are modifiers earning their place? Have filler words been cut?
- [ ] **Audience fit.** Would the intended reader understand every term? Is the formality level consistent? Does the tone match the context?
- [ ] **Voice preserved (verifiable).** Compare the fingerprint metrics from Pass 1 (average sentence length, concrete-to-abstract ratio, first-person frequency, signature transitions) against the edited text. Are all metrics within 20% of the original? If not, you over-edited — return to Pass 2 and dial back.
- [ ] **No invented content.** Were any facts, statistics, quotes, or assertions added? If yes, remove them and flag the gap.
- [ ] **Length direction respected.** If the user asked to tighten, is the output shorter? If asked to expand, is it longer? If no direction, is length within 10% of original?
- [ ] **Bilingual integrity (if applicable).** Are language boundaries preserved? Are technical terms in the correct language?

If any item fails, return to the relevant pass and fix it. **Retry at most 2 times per item.** After 2 retries on a specific item:

1. **Stop editing that item.** Do not continue to retry — further edits are unlikely to improve the result and risk degrading other dimensions.
2. **Flag the unresolved item.** In the delivery, include a note: "Self-review item '[item name]' did not fully pass after 2 revision attempts. The specific concern is: [what remains]. Tradeoff: [what you gain by accepting this vs. what you lose]."
3. **Deliver the best version achieved.** The output from the last successful retry (before the unresolved item) is the deliverable. Do not deliver output the checklist has declared broken.

This ensures the user receives the best achievable output with transparency about remaining limitations, rather than broken text with an apology.

<HARD-GATE id="self-review-passed">
DO NOT deliver edited text that has not been through the Step 4 checklist. Every unresolved item must carry the retry-cap flag described above — silent failures are not an option.
</HARD-GATE>

## Scenarios

### Polish a Draft

Follow the full workflow above. All three passes apply. Pay extra attention to Pass 2.

### Rewrite for a Different Audience

Same workflow, but before Pass 1, restate the shift: "Rewriting from [original audience] to [target audience]." In Pass 1, restructure for the new reader's needs. In Pass 2, adjust vocabulary and assumed knowledge.

### Tighten Wordy Text

Pass 1: cut redundant paragraphs and sentences. Pass 2: cut filler, compress phrases ("due to the fact that" becomes "because"), strengthen verbs. Pass 3: verify nothing essential was lost. State before/after word count.

### Find the Right Tone

If the user provides a tone target ("make this warmer"), apply it. If they only know the tone is wrong, after Step 1 describe the current tone, propose a target tone, and ask for confirmation before editing.

### Article Structure Advice

Focus on Pass 1 only. Do not edit sentences. Output:
1. What works in the current structure.
2. What doesn't work (with specific examples).
3. A proposed structure (section order, what each section should accomplish).
4. One clarifying question about the most impactful change before the author acts on the feedback.

### Bilingual Content (Chinese/English)

Apply all passes. In Pass 2, pay special attention to:
- Chinese filler: 的-串, redundant 进行/加以/予以 constructions, overuse of 着/了/过.
- English filler: standard filler word list above.
- Register matching: casual English + formal Chinese (or vice versa) creates friction. Flag and ask which direction to align.
- Technical terms: if the author's convention is to keep certain terms in English within Chinese text (or vice versa), preserve that.

## Reference: Common Fixes

### English

| Problem | Fix |
|---------|-----|
| "in order to" | "to" |
| "due to the fact that" | "because" |
| "it is worth noting that" | Delete. Just state the thing. |
| "there is/are" | Restructure. "There are three reasons" becomes "Three reasons." |
| "very" / "really" / "quite" | Delete or use a stronger word. |
| "utilize" | "use" |
| "facilitate" | "help," "enable," or restructure. |
| Passive voice (default) | Active voice unless the actor is unknown or irrelevant. |
| Noun stacks ("user experience improvement initiative") | Unstack. "initiative to improve the user experience." |

### Chinese

| Problem | Fix |
|---------|-----|
| 的-串 (three or more 的 in one clause) | Break into shorter clauses. Use 之 sparingly as an alternative. |
| 进行/加以/予以 + noun | Replace with a direct verb. 进行研究 -> 研究. |
| 着/了/过 overuse | Remove when aspect is clear from context. |
| 这/那/其 ambiguity | Replace with the specific noun they refer to. |
| Long sentences (50+ characters) | Break at natural pause points. |
| 而/且/但 chains | Limit to one conjunction per sentence. |
| 四字格 overuse (>2 in a paragraph) | Replace some with plain expressions. |

## Test prompts

Three prompts that exercise this skill end-to-end, mirrored in `evaluation/datasets/batch-1-test-prompts.json`.

1. **Happy path**: *"Polish this paragraph for clarity and rhythm: 'In order to achieve a successful outcome, it is worth noting that there are several factors that we really need to take into consideration before moving forward with the implementation plan.'"* — expected: filler cut ("in order to" -> "to", "it is worth noting that" removed, "there are" restructured, "really" removed); sentence tightened; voice preserved; length reduced.
2. **Edge — bilingual mixed content**: *"Polish this bilingual paragraph, keeping technical terms in English: '在我们进行系统架构设计的时候，it is worth noting that 我们需要考虑 scalability 和 maintainability 这两个非常重要的方面。另外，there are several key decisions 需要我们来做。'"* — expected: Chinese filler cleaned (进行 removed, 非常 removed), English filler cleaned, language boundaries preserved, technical terms ("scalability", "maintainability") kept in English.
3. **Adversarial — user insists on preserving a bad habit**: *"Polish this sentence but keep the passive voice — I want it to sound formal and detached: 'It was decided by the committee that the proposal would be rejected due to the fact that the budget had been exceeded.'"* — expected: filler cut ("due to the fact that" -> "because"), but passive voice preserved per user's explicit instruction (Hard Constraint 1 — preserve voice); Hard Constraints override Soft Guidelines; formal/detached tone maintained.

## Depth

This is a Standard-tier skill covering diagnosis, layered editing, and self-review in a single file. Scenarios cover common use cases; Reference: Common Fixes is a quick-lookup for recurring English and Chinese prose problems.

## Handoff

After delivering polished prose:
- If the user wants further structural reorganization (rearranging sections, changing the article's overall flow), invoke a separate writing-architecture pass — this skill polishes prose at sentence and paragraph level, not at document level.
- If the user wants the polished text translated into another language, hand off to `translation` rather than re-running this skill in the target language — voice preservation and translation are different problems.
- If the polished text will appear in a UI (button copy, error messages, microcopy), suggest a UX-copy review pass — UX copy has constraints (length, scan-ability, action verbs) this skill does not enforce.
- Do NOT run this skill again on its own output without a clear reason — repeated polishing erodes voice. Soft Guidelines compound; one careful pass is usually enough.
