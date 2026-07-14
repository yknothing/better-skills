# Advocate Review: bs-prose-craft

**Date**: 2026-06-17  
**Reviewer Role**: Advocate  
**Skill**: bs-prose-craft  
**HUMAN_VERIFIED**: false

## Executive Summary

This compatibility header normalizes review metadata after the repository-wide `bs-` namespace migration. The substantive review below is preserved unchanged.

**Schema completeness**: 10/10  
**Schema migration status**: PASS

## Original Review

# Gate 2 — Advocate Review: bs-prose-craft

**Date**: 2026-06-17
**Reviewer Role**: Advocate — find what is good, defend the design, surface strengths
**Skill**: `bs-prose-craft` (Standard-tier, Batch 1)
**File**: `/Users/whatsup/workspace/2026/better-skills/skills/bs-prose-craft/SKILL.md`

---

## Overall Score: 70 / 80

---

## Dimension 1: Trigger Quality — Score: 8 / 10

### What works well

The description string is comprehensive and action-oriented:

> "Use when you want to improve, rewrite, or craft prose — polishing drafts for readability, adapting text for a different audience, tightening wordy passages, finding the right tone, structuring articles, or working with bilingual Chinese/English content."

This covers six distinct use cases with concrete verbs: *improve*, *rewrite*, *craft*, *polish*, *adapt*, *tighten*, *find*, *structure*. The em-dash convention mirrors Anthropic's own skill descriptions (see the brainstorming and pptx skills), which is the right pattern alignment for the project.

The "One Question at a Time" section (lines 33-41) provides an excellent clarification priority ladder. The five dimensions (audience, goal, tone, length, constraints) are ordered by leverage — audience determines everything downstream, so it comes first. This is not arbitrary; it is strategic.

The trigger also explicitly names "bilingual Chinese/English content," which sets this skill apart from generic prose editors. This is a genuine differentiator.

### Minor concern

The description is 40 words. For a trigger that must match against user queries, shorter descriptions tend to match more reliably. A user saying "help me write better" might not trigger a description that starts with "improve, rewrite, or craft prose." Consider whether "prose" as a keyword is sufficient to catch user intent, or whether adding synonyms like "writing," "text," "copy" would improve recall.

### Verdict

Strong trigger design with strategic clarification ordering. The bilingual mention is a valuable signal. Slightly long but not problematically so.

---

## Dimension 2: Hard Constraint Design — Score: 9 / 10

### What works well

The five constraints are chosen with clear understanding of AI failure modes in prose editing:

1. **Preserve the author's voice** — directly counters the most common AI prose criticism: flattening everything into "corporate ChatGPT style." The instruction is specific: "If the original has personality, keep it — just make it work better." This is not vague "preserve voice" — it gives the agent a concrete decision rule.

2. **Never introduce factual claims** — closes the hallucination vector. The enumeration ("statistics, quotes, dates, names, or assertions") is concrete and checkable. The instruction to "flag it — do not fill it" provides an alternative behavior instead of just a prohibition.

3. **Respect the requested length direction** — a measurable constraint. The 10% tolerance band for unspecified length is a smart default that prevents both bloat and accidental truncation.

4. **Flag, don't hide, uncertainty** — introduces a concrete output convention (`[?]`) with an explanation requirement. This is far more actionable than "be careful with ambiguous passages."

5. **Chinese-English bilingual integrity** — domain-specific and non-obvious. The instruction to preserve the language of each segment and keep technical terms in their original language addresses a real problem in mixed-language editing.

The preamble ("If you cannot satisfy them, explain why and ask whether to proceed anyway") is the **hard-rules-first** pattern from the project's own pattern library — correct pattern alignment.

### Minor concern

Constraint 4's `[?]` marker could collide with other uses of brackets in edited text. If the original text already contains `[?]` as content (e.g., in a FAQ or Q&A format), the marker becomes ambiguous. A more distinctive convention (e.g., `[PROSE-CRAFT-AMBIGUITY: ...]` or a Unicode marker) would be more collision-resistant, though at the cost of readability.

### Verdict

Five well-chosen, concrete, enforceable constraints. Each addresses a documented AI failure mode. The `[?]` marker collision risk is minor. The preamble correctly applies the project's hard-rules-first pattern.

---

## Dimension 3: Domain Detection (Step 0) — Score: 8 / 10

### What works well

The five-type classification is well-scoped:

- **General prose**: Full workflow — the default path.
- **Technical documentation**: Three specific rule modifications (preserve code blocks, skip filler removal for technical terms, don't restructure sentences with inline code). Each is concrete and correct.
- **Marketing copy**: Recognition that marketing deliberately breaks prose rules. The instruction to "ask before applying standard rules" is the right safety valve — the skill knows its limits.
- **Creative/narrative**: Voice preservation elevated to paramount. Skip Pass 1 unless requested. Pass 2 only where asked. This shows domain awareness — creative writing is not engineering prose.
- **Legal/policy**: The strongest constraint set: "NEVER alter meaning," flag but don't resolve ambiguities, don't restructure. This prevents the most dangerous failure mode (inadvertent meaning change in legal text).

The non-general-prose flow includes a confirmation step:

> "This appears to be [type]. Standard prose rules may not apply. Should I proceed with domain-appropriate editing, or switch approach?"

This is correct **one-question-at-a-time** pattern application — one question, clear options, wait for answer.

### Minor concern

The domain detection relies on the agent correctly classifying text. There is no explicit guidance on *how* to classify — no keyword heuristics, no structural markers. For borderline cases (is a technical blog post "general prose" or "technical documentation"?), the agent might misclassify. A brief heuristic table ("If X, classify as Y") would reduce classification errors.

Additionally, the five types cover most cases, but "academic writing" is absent. It shares traits with both technical documentation (citations, precision) and creative (voice, argument structure) and would benefit from its own rule set.

### Verdict

Well-designed domain routing with appropriate rule modifications per type. The confirmation step prevents silent misclassification. Missing academic writing as a domain and lacking classification heuristics are minor gaps.

---

## Dimension 4: Three-Pass Editing — Score: 9 / 10

### What works well

The layered approach (Structure → Sentence Craft → Polish) mirrors professional editing methodology and is correctly adapted for AI execution:

**Pass 1 — Structure**: The voice fingerprinting system is the standout feature. Extracting four concrete metrics:
- Average sentence length (words)
- Concrete-to-abstract noun ratio (nominalization scan)
- First-person frequency (I/we vs. impersonal)
- Signature transitions or repeated phrases

These are measurable, not subjective. The 20% tolerance rule ("Verify fingerprint metrics are within 20% of the original. If not, you over-edited — dial back.") creates a verifiable feedback loop. This is a genuine innovation — it turns "preserve voice" from a vague aspiration into a quantifiable check.

**Pass 2 — Sentence Craft**: Correctly positioned as "where most of the work happens." The instructions are specific: fix rhythm, cut filler, strengthen verbs, resolve ambiguity. This maps directly to the diagnosis categories from Step 1.

**Pass 3 — Polish**: Micro-level quality checks that are specific and actionable:
- 35-syllable sentence limit (concrete threshold)
- Strong paragraph endings (noun or verb, not preposition or "it"/"them")
- Consistency checks (capitalization, hyphenation, terminology, names)
- Bilingual boundary verification

The "State which pass you are on" instruction (line 73) is a small but important detail — it makes the agent's internal state visible to the user and prevents skipping passes.

### Minor concern

The voice fingerprinting in Pass 1 requires the agent to count and compute ratios. While modern models can do this, the accuracy of automated linguistic metric extraction by an LLM is not perfect. A 20% tolerance band is generous enough to absorb measurement noise, but the skill could acknowledge this: "These are approximate; use them directionally, not absolutely."

### Verdict

Classic editing methodology expertly adapted for AI execution. Voice fingerprinting with the 20% tolerance rule is a genuine design innovation. The three-pass structure with explicit state signaling is clean and enforceable.

---

## Dimension 5: Bilingual Handling — Score: 9 / 10

### What works well

The bilingual design operates at multiple levels:

**Hard Constraint 5** (line 18): The foundational rule — preserve language boundaries, don't translate unless asked, keep technical terms in original language. This prevents the most common bilingual editing failure (accidental translation).

**Soft Guidelines** (lines 28-29): Three bilingual-specific guidelines:
- 四字格 moderation ("too many sound pompous") — culturally aware and correct
- 的-串 detection and breakup — addresses a genuine Chinese writing quality issue
- Register matching across languages ("casual English + formal Chinese creates cognitive dissonance") — sophisticated and non-obvious

**Chinese Common Fixes table** (lines 156-164): Seven entries covering real Chinese prose problems:
- 的-串 (three or more 的 in one clause) — structural
- 进行/加以/予以 + noun → direct verb — the classic "bureaucratic Chinese" fix
- 着/了/过 overuse — aspect marker economy
- 这/那/其 ambiguity — pronoun reference clarity
- Long sentences (50+ characters) — readability threshold
- 而/且/但 chains — conjunction economy
- 四字格 overuse — idiom moderation

Each entry has a concrete fix. The 50-character sentence length threshold for Chinese (vs. 35 syllables for English) correctly accounts for the different density of the two languages.

**Bilingual Scenario** (lines 130-136): Adds language-specific Pass 2 instructions including Chinese filler patterns (的-串, 进行/加以/予以, 着/了/过) that are not in the English filler list. This shows genuine bilingual expertise rather than surface-level translation.

### Minor concern

The skill only handles Chinese/English bilingual content. If the user has Japanese/English, Korean/English, or other mixed-language content, Hard Constraint 5's general principles still apply, but the language-specific fixes in the reference tables won't help. The skill name and description could clarify this scope limitation.

### Verdict

Genuinely bilingual design, not surface-level translation support. The Chinese common fixes table demonstrates real expertise. Register matching across languages is a sophisticated concept correctly operationalized. Scope is limited to Chinese/English but deeply correct within that scope.

---

## Dimension 6: Self-Review Checklist — Score: 10 / 10

### What works well

This is the strongest section of the skill. Eight checklist items, each mapped to a specific quality dimension:

1. **Clarity** — first-reading comprehension, pronoun reference, jargon
2. **Rhythm** — sentence length variation, paragraph breaks, 35-syllable check, strong endings
3. **Precision** — strong verbs, concrete nouns, modifier economy, filler removal
4. **Audience fit** — term comprehension, formality consistency, tone-context match
5. **Voice preserved (verifiable)** — this is the key innovation. It cross-references the Pass 1 fingerprint metrics and applies the 20% tolerance check as a verifiable gate. The instruction "If not, you over-edited — return to Pass 2 and dial back" creates a corrective feedback loop.
6. **No invented content** — directly maps to Hard Constraint 2
7. **Length direction respected** — directly maps to Hard Constraint 3
8. **Bilingual integrity** — directly maps to Hard Constraint 5

The mapping of checklist items to hard constraints creates **traceability** — you can verify that every hard constraint has a corresponding checklist verification step.

The retry mechanism (lines 102-103) is exceptional design:

> "Retry at most 2 times. If any checklist item still fails after 2 retries, stop and deliver the output as-is with a note explaining which items did not pass, why they could not be resolved within the retry limit, and what tradeoffs the user may want to consider."

This prevents the most dangerous failure mode of self-review: infinite refinement loops. The 2-retry cap with transparent fallback delivery is a genuine design innovation. It respects the user's time while maintaining quality standards.

### Concern

None. This is exemplary design.

### Verdict

The self-review checklist is the skill's strongest architectural feature. Traceable to hard constraints, verifiable metrics for voice preservation, and the 2-retry cap with transparent fallback delivery is a pattern that other skills should adopt.

---

## Dimension 7: Common Fixes Reference — Score: 8 / 10

### What works well

**English table** (9 entries, lines 142-153): Covers the classic filler words and weak constructions:
- "in order to" → "to"
- "due to the fact that" → "because"
- "it is worth noting that" → Delete
- "there is/are" → Restructure (with example)
- "very" / "really" / "quite" → Delete or strengthen
- "utilize" → "use"
- "facilitate" → "help," "enable," or restructure
- Passive voice → Active (with exception noted)
- Noun stacks → Unstack (with example)

Every entry has a concrete fix. The examples ("There are three reasons" → "Three reasons.") make the transformations clear. The passive voice entry correctly notes the exception ("unless the actor is unknown or irrelevant"), which prevents mechanical over-application.

**Chinese table** (7 entries, lines 156-164): Covers genuine Chinese writing issues with correct fixes. Each entry demonstrates understanding of Chinese linguistics, not just surface translation.

Both tables use the "Problem | Fix" format, which is scannable and actionable. This is correct **progressive-disclosure** pattern application — quick-reference tables for the agent to consult during editing without re-reading the full skill.

### Minor concern

The tables are relatively small (9 English, 7 Chinese). There are other common prose issues not covered: English (parallelism errors, dangling modifiers, comma splices, that/which confusion) and Chinese (的/地/得 confusion, 被字句 overuse, subject-predicate mismatch in long sentences). The tables are a good start but could be expanded.

### Verdict

Accurate, actionable, and correctly formatted as quick-reference tables. Every entry has a concrete fix. The passive voice exception note shows good judgment. Scope is somewhat limited — could benefit from expansion in future iterations.

---

## Dimension 8: Scenario Coverage — Score: 9 / 10

### What works well

Six scenarios, each with specific workflow modifications:

1. **Polish a Draft** (lines 106-108): Full workflow, emphasis on Pass 2. Correct — polishing is primarily sentence-level work.

2. **Rewrite for a Different Audience** (lines 110-113): Restates the shift explicitly ("Rewriting from [original audience] to [target audience]"), restructures for new reader in Pass 1, adjusts vocabulary in Pass 2. The explicit restatement is a smart forcing function — it makes the agent verbalize the shift.

3. **Tighten Wordy Text** (lines 115-117): Pass-by-pass instructions with specific actions (cut redundant paragraphs, compress phrases with example). The requirement to "state before/after word count" creates accountability.

4. **Find the Right Tone** (lines 119-121): Handles both cases — user provides tone target vs. user only knows tone is wrong. The latter case follows the correct pattern: diagnose first, propose, get confirmation, then edit. This prevents the agent from guessing the wrong tone.

5. **Article Structure Advice** (lines 123-129): Restricts to Pass 1 only — no sentence editing. The 4-part output structure (what works, what doesn't, proposed structure, one clarifying question) is comprehensive and scoped. The requirement to ask "one clarifying question about the most impactful change" before the author acts is a clever forcing function for actionable feedback.

6. **Bilingual Content** (lines 130-136): Adds language-specific Pass 2 instructions. The register matching instruction ("casual English + formal Chinese creates friction. Flag and ask which direction to align") correctly identifies this as a decision the author must make, not the agent.

Each scenario modifies the base workflow rather than duplicating it. This is clean design — no redundant instructions.

### Minor concern

Missing scenarios that users might reasonably expect:
- **Proofread only** (grammar, spelling, typos — no style changes)
- **Expand/elaborate** (the inverse of tighten)
- **Format conversion** (e.g., article → email, notes → report)

These are covered by the general workflow but could benefit from scenario-specific guidance like the existing six.

### Verdict

Six well-chosen scenarios covering the most common prose editing tasks. Each scenario modifies the base workflow with specific, actionable instructions. The "Article Structure Advice" scenario is particularly well-designed. Three additional scenarios would complete the coverage but are not blockers.

---

## Strongest Aspect

The **Self-Review Checklist with the 2-retry cap and transparent fallback delivery** (lines 91-103). This is a genuine design innovation that solves a real problem in AI skill design: how to enforce quality without enabling infinite refinement loops. The checklist items are traceable to hard constraints (items 5-8 directly map to Hard Constraints 1-3 and 5), the voice preservation check is verifiable (20% metric tolerance), and the retry cap with fallback delivery respects the user's time while maintaining standards. This pattern should be adopted by other skills in the project.

---

## One Improvement

Add a **worked example** showing the skill in action — ideally a "before" passage, the diagnosis from Step 1, and the "after" result with annotations explaining which passes and rules were applied. The skill currently has excellent *instructions* but no *demonstration*. A concrete example would:
1. Help the agent understand the intended output quality through exemplars rather than just rules
2. Make the voice fingerprinting system tangible ("here is the original fingerprint, here is the edited fingerprint, here is why 17% change is acceptable")
3. Serve as a de facto test case for the self-review checklist

A 150-200 word example at the end of the skill (before or after the Common Fixes reference) would significantly improve learnability without bloating the token budget.

---

## Production-Ready Assessment

**Yes, with minor caveats.**

The skill demonstrates mature design across all eight dimensions. The hard constraints are well-chosen and enforceable. The three-pass editing methodology with voice fingerprinting is innovative and correct. The self-review checklist with the retry cap is exemplary. The bilingual design is genuinely deep, not superficial. The scenario coverage is comprehensive for the stated use cases.

Caveats:
1. The `[?]` ambiguity marker could collide with content that already contains brackets — low risk but worth monitoring
2. Domain classification relies on agent judgment without heuristics — works in practice for capable models but may need hardening for weaker ones
3. Missing a worked example reduces learnability for agents that benefit from exemplars
4. The common fixes tables could be expanded in future iterations

None of these are blockers for production use. The skill is ready for Gate 3 (Pattern Alignment) and Gate 4 (Baseline Test).

---

## Summary Table

| Dimension | Score | Key Strength | Key Concern |
|-----------|-------|-------------|-------------|
| 1. Trigger Quality | 8/10 | Action-oriented verbs, strategic clarification ladder | Slightly long description |
| 2. Hard Constraint Design | 9/10 | Concrete, enforceable, addresses documented AI failure modes | [?] marker collision risk |
| 3. Domain Detection | 8/10 | Five well-scoped types with specific rule modifications | No classification heuristics, missing academic domain |
| 4. Three-Pass Editing | 9/10 | Voice fingerprinting with 20% tolerance is innovative | LLM metric extraction accuracy not acknowledged |
| 5. Bilingual Handling | 9/10 | Genuinely deep bilingual design, register matching is sophisticated | Scope limited to Chinese/English |
| 6. Self-Review Checklist | 10/10 | Traceable to hard constraints, 2-retry cap is exemplary | None |
| 7. Common Fixes Reference | 8/10 | Accurate, actionable, correct progressive-disclosure pattern | Limited scope, could expand |
| 8. Scenario Coverage | 9/10 | Each scenario modifies workflow, no redundant instructions | Missing proofread, expand, format-conversion scenarios |
| **Total** | **70/80** | | |

---

*Advocate review completed. The bs-prose-craft skill is well-designed, correctly applies project patterns, and is ready for production use. The self-review checklist with the 2-retry cap is a design innovation worth elevating to a project-wide pattern.*
