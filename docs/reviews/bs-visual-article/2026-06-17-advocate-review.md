# Advocate Review: bs-visual-article

**Date**: 2026-06-17
**Reviewer Role**: Advocate
**Skill**: bs-visual-article
**HUMAN_VERIFIED**: false

## Executive Summary

This compatibility header normalizes review metadata after the repository-wide `bs-` namespace migration. The substantive review below is preserved unchanged.

**Schema completeness**: 10/10
**Schema migration status**: PASS

## Original Review

# Advocate Review: bs-visual-article

**Role**: Advocate (Gate 2 — Peer Review)
**Date**: 2026-06-17
**Reviewer**: code-reviewer agent
**Skill**: bs-visual-article
**Skill File**: /Users/whatsup/workspace/2026/better-skills/skills/bs-visual-article/SKILL.md

---

## Summary

The bs-visual-article skill is a well-structured, production-ready skill that demonstrates deep domain understanding of illustration-as-clarification (not decoration). Its strengths lie in its gate-based process architecture, concrete anti-patterns drawn from real failure modes, and the multi-perspective review that catches issues a simpler checklist would miss. The skill knows exactly what it wants the agent to do, when to stop, and — critically — when to say "this article doesn't need illustrations at all."

**Overall Score**: 89/100

---

## Detailed Scoring

### 1. Trigger Quality (9/10)

> "Use when the user asks to illustrate an article, blog post, or long-form document with diagrams, charts, conceptual illustrations, or comparison visuals. Also use when an article feels text-heavy and the user wants to improve readability with visual elements."

**Strengths**:
- The trigger is precise without being brittle. It covers explicit illustration requests ("illustrate an article") and implicit need-detection ("article feels text-heavy").
- The list of illustration types (diagrams, charts, conceptual illustrations, comparison visuals) gives the agent enough signal to match against without over-constraining.
- The trigger avoids the common trap of over-triggering — it does not fire on "add an image" or "find a stock photo," which are different tasks.

**Minor concern**: The "article feels text-heavy" clause is subjective and could cause false positives. An agent might interpret any long article as "text-heavy" and offer to illustrate when the user just wanted a summary. However, the Pre-Flight step mitigates this by asking for confirmation before generating anything, so the blast radius is contained.

**Score justification**: 9/10. Excellent specificity. The one-point deduction is for the subjective "feels text-heavy" trigger, which is mitigated by downstream gates but could still cause an unnecessary initial activation.

---

### 2. Hard Rules (10/10)

The 7 rules are:

1. **READ_FIRST** — Read the full article before identifying any illustration opportunity.
2. **EARN_PLACE** — Every illustration must earn its place; no decoration.
3. **ONE_CONCEPT** — One concept per illustration.
4. **ALT_TEXT** — Alt text is mandatory, not optional.
5. **STYLE_CONSISTENCY** — Consistent style across all illustrations in one article.
6. **NO_INVENTED_DATA** — Never fabricate chart data.
7. **SVG_FIRST** — Prefer SVG; Mermaid for flowcharts/sequence diagrams; HTML-to-screenshot as fallback.

**Strengths**:
- These are the right 7 rules. They cover the critical failure modes: decoration (EARN_PLACE), overloading (ONE_CONCEPT), inaccessibility (ALT_TEXT), inconsistency (STYLE_CONSISTENCY), hallucinated data (NO_INVENTED_DATA), and format mismatch (SVG_FIRST).
- READ_FIRST is placed first for a reason — it is the most frequently violated rule when agents skim instead of read. Making it rule #1 sets the tone.
- The rules are expressed as imperatives with clear reasoning embedded. "If you switch styles mid-article, you break the reader's visual model" is more persuasive than "Be consistent."
- No rule is redundant. Each guards a distinct failure mode.

**Score justification**: 10/10. This is the strongest part of the skill. The rules are well-chosen, well-ordered, and each is defensible. I cannot identify a missing rule that would materially improve the skill.

---

### 3. Signal Detection — When to Illustrate (9/10)

The skill identifies 8 signal types with specific illustration types:

| Signal | Illustration Type |
|--------|-------------------|
| Process or sequence in prose | Flowchart / Sequence diagram |
| Comparison between two or more things | Comparison table or side-by-side diagram |
| Hierarchical or structural relationship | Tree diagram / Architecture diagram |
| Numeric trends or proportions | Bar chart / Line chart / Pie chart |
| Abstract concept with spatial metaphor | Conceptual illustration |
| Before/after or cause/effect | Paired illustrations with annotations |
| Taxonomy or classification | Nested boxes / Mind map |
| No clear signal matches | No illustration needed |

**Strengths**:
- The signal-to-illustration-type mapping is concrete and actionable. An agent can literally pattern-match: "Does this paragraph describe a process? If yes, flowchart."
- The "No clear signal matches" row is essential. It explicitly gives the agent permission to say "this doesn't need an illustration," which prevents the common failure mode of forcing visuals where they don't belong.
- The special handling for code-heavy articles (>50% code blocks) is a sophisticated touch. It recognizes that code itself is visual structure and prevents redundant diagramming of what the reader can already see.
- The decision gate after the signal table ("If none of the signals above are present, the article may not need illustrations") reinforces the EARN_PLACE rule.

**Minor concern**: The mapping is slightly under-specified for edge cases. For example, a "process described in prose" could also be a comparison ("first we did X, then we switched to Y, here's why"). The agent needs to use judgment, but the signal table doesn't provide guidance on signal overlap. This is a nitpick — the agent should be smart enough to handle this.

**Score justification**: 9/10. Comprehensive coverage of illustration opportunities with clear mappings. The one-point deduction is for the edge-case ambiguity when signals overlap, which could cause indecision in borderline cases.

---

### 4. Format Selection — Step 2 (8/10)

The three-format decision tree: Mermaid -> SVG -> HTML-screenshot.

**Strengths**:
- Mermaid-first for structured diagrams is correct. Mermaid is diffable, natively rendered on major platforms (GitHub, Notion, GitLab), and produces consistent output without the agent needing to manage visual layout.
- SVG as the primary format for custom/conceptual illustrations is also correct. Inline SVG works everywhere, is accessible when done right, and gives full design control.
- HTML-to-screenshot as a last-resort fallback is properly gated: it requires user confirmation before opening a visible browser, and temporary files must be deleted.
- The platform-awareness (Step 2 mentions GitHub, Notion, CMS, static site generators) ties back to the Pre-Flight target platform question, creating a coherent end-to-end flow.

**Concerns**:
- The decision logic for "Mermaid vs SVG" is implicit rather than explicit. The skill says "Mermaid for flowcharts, sequence diagrams, class diagrams..." and "SVG for conceptual illustrations, architecture diagrams, comparison visuals..." but does not address the overlap zone: architecture diagrams can be expressed in Mermaid (graph TD) or SVG. The agent has to infer which is better. A decision heuristic would help: "If the architecture diagram fits cleanly in a Mermaid graph with <=15 nodes, use Mermaid. If it requires custom spatial arrangement or annotations that Mermaid cannot express, use SVG."
- The HTML-screenshot fallback mentions Playwright/Puppeteer but does not provide concrete instructions for the capture workflow. If the agent does not have Playwright available, it may not know what to do.

**Score justification**: 8/10. The three-tier format hierarchy is correct and the platform-awareness is strong. The two-point deduction is for the Mermaid-vs-SVG ambiguity in the architecture diagram overlap zone and the under-specified HTML-screenshot fallback.

---

### 5. Style Spec — Step 3 (8/10)

Defines: color palette (3-5 colors), typography (3 size tiers), line weight (3 tiers), corner radius (3 tiers), spacing (3 tiers).

**Strengths**:
- The 3-5 color limit is a strong constraint. It prevents the common failure mode of agents using every color in the rainbow. The tone-matching guidance (warm/cool/neutral) is practical.
- The typography spec is specific (18-20px titles, 13-14px body, 11-12px annotations) with CJK and RTL accommodations. These internationalization details are easy to overlook and their presence signals thoughtful design.
- Line weight, corner radius, and spacing are all specified with concrete numeric ranges, not vague adjectives. This makes the spec enforceable — an agent can check "is this stroke 1.5px?" but not "does this look balanced?"
- The consistency mandate ("If you deviate, the reader will notice the inconsistency before they notice the content") ties back to STYLE_CONSISTENCY in the hard rules.

**Concerns**:
- The color palette guidance says "use the article's brand colors if available" but does not explain how to extract brand colors from an article. An article on a personal blog has no brand colors. The agent may default to arbitrary choices. A fallback palette recommendation (e.g., "Tailwind's slate/blue/indigo for technical content") would reduce decision fatigue.
- The spacing spec uses pixel values (16px, 24px, 48px), which is fine for fixed-dimension SVGs but less meaningful for Mermaid diagrams where spacing is controlled by the renderer.
- The spec does not address dark mode for Mermaid diagrams (it does for SVG via `currentColor` and white background `<rect>`). Mermaid renders as images on some platforms and the theme may clash with the article's color scheme.

**Score justification**: 8/10. Concrete, enforceable numeric specs with strong internationalization awareness. The two-point deduction is for the missing brand-color fallback, Mermaid spacing irrelevance, and incomplete dark mode coverage.

---

### 6. Generation Process — Step 4 (10/10)

One-at-a-time generation with scratch file for style anchoring.

**Strengths**:
- The scratch file mechanism (`_illustration-style-spec.md`) is the standout architectural decision in this skill. It solves the style drift problem mechanically rather than relying on the agent to "remember" the style across multiple illustrations. Re-reading the scratch file before each illustration re-establishes the constraints in the context window.
- "Generate one illustration at a time. Do not batch-generate and then review" — this is correct. Batching floods the context window and makes style consistency impossible to maintain.
- The per-illustration workflow (Draft -> Self-check against style spec -> Write alt text -> Move on) enforces alt text as part of generation, not as an afterthought.
- The Mermaid quick reference (max 15 nodes, subgraphs for 8+, escape HTML entities) and SVG quick reference (viewBox, `<style>` block, `<g>` groups, under 200 lines, security rules) are concise and actionable.
- The failure handling for Mermaid (simplify -> fall back to SVG -> fall back to prose) provides a clear escalation path instead of leaving the agent stuck.
- The SVG security section (`<script>`, event handlers, `<foreignObject>` ban) is non-negotiable and correctly identifies the XSS vector.
- The SVG accessibility section (`role="img"`, `aria-labelledby`, internal `<title>`) shows deep knowledge of accessible SVG practices.
- Scratch file cleanup after delivery is specified.

**Score justification**: 10/10. The scratch-file style-anchoring pattern is genuinely innovative and solves a real problem. The one-at-a-time workflow, format-specific quick references, failure handling, security rules, and accessibility requirements are all well-specified and correct.

---

### 7. Self-Review Checklist (9/10)

14 items with confidence anchors (0/25/50/75/100 or binary 100).

**Strengths**:
- The checklist covers all 7 hard rules, all process steps, and both format-specific constraints (Mermaid rendering, SVG line count and viewBox).
- The confidence anchors are well-calibrated. Items that are objectively verifiable (was the article read? were temp files deleted?) use binary 100. Items that require judgment (does the illustration earn its place?) use the 0/25/50/75/100 scale.
- The checklist is in the right place — after generation, before delivery — which makes it a genuine gate rather than a box-ticking exercise.
- Item ordering follows the process flow (read -> plan -> generate -> place -> consistency pass), making it natural to work through.

**Minor concern**: The confidence anchors for judgment items (earn-its-place, style consistency, terminology match) rely on the agent's self-assessment, which is inherently unreliable. An agent that produced a decorative illustration is unlikely to self-rate its "earn its place" confidence at 25. However, the Multi-Perspective Review (next section) partially addresses this by forcing re-examination from different angles.

**Score justification**: 9/10. Comprehensive coverage with well-calibrated confidence anchors. The one-point deduction is for the inherent limitation of self-assessment on judgment items, which is partially (but not fully) mitigated by the multi-perspective review.

---

### 8. Multi-Perspective Review (10/10)

Three perspectives: Editor, Designer, Reader.

**Strengths**:
- Each perspective catches failure modes the others miss:
  - **Editor** catches redundancy (are two illustrations saying the same thing?), flow disruption, and ratio appropriateness. These are structural concerns.
  - **Designer** catches visual inconsistency (alignment, contrast, line weights), color cohesion, and professional polish. These are aesthetic concerns.
  - **Reader** catches comprehension issues (can you understand the illustration without reading the text?), cognitive load, and prior-knowledge assumptions. These are usability concerns.
- The perspectives are genuinely distinct. An agent might pass the Editor review (structurally sound) but fail the Designer review (visually inconsistent), or pass both but fail the Reader review (incomprehensible to a newcomer).
- The Editor's ratio rule of thumb (1 illustration per 400-600 words for technical, 1 per 800-1000 for narrative) provides a concrete check against over-illustration.
- The Reader's "skimming test" (if you skimmed only the illustrations and captions, would you get the main argument?) is an excellent end-to-end validation.
- The instruction to "fix and re-run the self-review checklist" after finding issues creates a proper feedback loop.

**Score justification**: 10/10. This is the most elegant part of the skill. The three perspectives are orthogonal and complementary, each catching distinct failure modes. The concrete checks within each perspective are actionable.

---

### 9. Anti-Patterns (9/10)

Six named failure modes, organized into Content Anti-Patterns (2) and Execution Anti-Patterns (3+1... actually 6 total, but the categorization is slightly off — see below).

**Strengths**:
- **Decoration over clarification** — This is the cardinal sin of article illustration and naming it first is correct. The example (stock server rack image for an API design article) makes the anti-pattern instantly recognizable.
- **Over-diagramming** — The opposite failure mode: too many illustrations. "Fewer, higher-quality illustrations beat many mediocre ones" is a good heuristic.
- **Style drift** — Directly maps to the STYLE_CONSISTENCY rule and the scratch-file mechanism. The example (clean blue-gray -> neon green) is vivid.
- **Mermaid sprawl** — 30+ nodes with crossing arrows. This is a specific, concrete failure mode that the 15-node limit in the quick reference addresses.
- **Caption as afterthought** — "Diagram of the system" captions. The guidance that captions should "add context, not label" is exactly right.
- **Inaccessible visuals** — Alt text that says "a chart." Ties back to the ALT_TEXT hard rule.

**Minor concern**: The categorization into "Content Anti-Patterns" (2 items) and "Execution Anti-Patterns" (4 items) is slightly lopsided. Decoration-over-clarification and over-diagramming are both about *what* to illustrate; style drift, Mermaid sprawl, caption-as-afterthought, and inaccessible-visuals are about *how* to illustrate. The categorization is defensible but the 2/4 split feels like the Content bucket could use a third item — perhaps "concept overload" (violating ONE_CONCEPT) or "context-free visuals" (illustrations that assume the reader has read every preceding paragraph).

**Score justification**: 9/10. All six anti-patterns are real and well-chosen. The one-point deduction is for the slightly lopsided categorization and the missing "concept overload" anti-pattern, which is a distinct failure mode from over-diagramming (packing too many ideas into one illustration vs. making too many illustrations).

---

### 10. Session Cap — 8 illustrations max (7/10)

**Strengths**:
- The cap is explicit and placed prominently (both in the Process header and the Pre-Flight scope check).
- The scoping mechanism for long articles (>5000 words) is proactive: it asks the user to prioritize a section or proceed with the most impactful illustrations. This prevents the agent from silently truncating.
- The cap is reinforced in the self-review checklist (item 13).
- The note that remaining illustrations can be addressed in a follow-up session is practical.

**Concerns**:
- **Why 8?** The number feels arbitrary. Is it based on context window limits? Attention fatigue? Generation cost? If the rationale were explained, the agent could make better decisions about when to push back (e.g., "this article has 12 clear illustration opportunities, all high-impact — should we do two sessions or prioritize the top 8?").
- **The cap may be too high for complex SVGs.** Eight illustrations is reasonable if half are simple Mermaid flowcharts (10-15 nodes) and half are moderate SVGs (~100 lines). But if an article needs 8 complex architecture diagrams (each ~180 lines of SVG with multiple groups and annotations), the context window may overflow before reaching the cap. The skill does not distinguish between "light" and "heavy" illustrations in the cap.
- **No mechanism for the agent to track remaining capacity.** The agent generates one at a time and checks the self-review at the end. If the agent hits the context window limit at illustration #6, the last two illustrations may be lower quality or the agent may not notice. A mid-process capacity check ("after 4 illustrations, assess remaining context window") would help.

**Score justification**: 7/10. The cap is explicit and the scoping mechanism is good, but the arbitrary number, lack of light-vs-heavy distinction, and absence of mid-process capacity tracking reduce its practical reliability.

---

## Score Summary

| # | Criterion | Score |
|---|-----------|-------|
| 1 | Trigger Quality | 9/10 |
| 2 | Hard Rules | 10/10 |
| 3 | Signal Detection | 9/10 |
| 4 | Format Selection | 8/10 |
| 5 | Style Spec | 8/10 |
| 6 | Generation Process | 10/10 |
| 7 | Self-Review Checklist | 9/10 |
| 8 | Multi-Perspective Review | 10/10 |
| 9 | Anti-Patterns | 9/10 |
| 10 | Session Cap | 7/10 |
| **TOTAL** | | **89/100** |

---

## Strongest Aspect

**The scratch-file style-anchoring mechanism (Step 4).** This is a genuinely innovative pattern. Style drift is one of the hardest problems in multi-illustration generation because LLMs have limited context windows and no persistent visual memory. The typical solution is "check for consistency at the end," which is too late — by then the agent has already generated 8 illustrations in 3 different styles and must either redo work or ship inconsistent output. The scratch-file approach solves this mechanically: write the style spec to a file, re-read it before each illustration, and the context window is refreshed with the exact constraints needed. It is simple, it is enforceable, and it does not rely on the agent "remembering." This pattern deserves to be extracted into docs/patterns/ and reused by other multi-output skills.

---

## One Improvement

**Add a Mermaid-vs-SVG decision heuristic for architecture diagrams.** Currently, Step 2 says Mermaid for flowcharts/sequence diagrams and SVG for architecture diagrams, but architecture diagrams can be expressed in either format. This creates ambiguity. A simple decision tree would resolve it:

```
If the diagram is:
  - Flowchart, sequence, class, ER, state machine, Gantt -> Mermaid
  - Conceptual illustration, comparison visual, before/after -> SVG
  - Architecture diagram:
    - Fits in Mermaid graph with <=15 nodes and no custom annotations -> Mermaid
    - Requires spatial arrangement, annotations, or icons Mermaid cannot express -> SVG
```

This adds ~4 lines and eliminates the most common format-selection ambiguity.

---

## Production-Ready Assessment

**Yes, with one caveat.** The skill is production-ready. Its architecture is sound: hard rules as invariant constraints, a gated process with a single user-confirmation point, format-specific quick references with security and accessibility rules, a self-review checklist with calibrated confidence anchors, multi-perspective review that catches orthogonal failure modes, and explicit anti-patterns drawn from real failure modes.

The caveat: the session cap mechanism (8 illustrations, no light-vs-heavy distinction, no mid-process capacity check) may cause quality degradation on illustration-heavy articles before the cap is reached. This is not a blocker for initial deployment — it will affect a minority of use cases — but it should be addressed in the first iteration.

**Recommendation**: Ship it. Track how often the cap is reached in practice and whether quality degrades on articles with 6+ illustrations. Use that data to refine the cap mechanism.
