---
name: article-illustrate
# tier: standard
description: Use when the user asks to illustrate an article, blog post, or long-form document with diagrams, charts, conceptual illustrations, or comparison visuals. Also use when an article feels text-heavy and the user wants to improve readability with visual elements.
---

# Article Illustrate

> Identify illustration opportunities in articles and generate consistent, accessible visuals that clarify rather than decorate.

<HARD-GATE label="ENTRY">
BEFORE executing any step in this skill, read and internalize all 7 Hard Rules below.
If you skip this gate, you will produce a failed deliverable.
</HARD-GATE>

## Hard Rules

Violating any of these is a failure of the skill. No exceptions.

1. **READ_FIRST — Never illustrate without reading the full article first.** Skimming the title or first paragraph is not enough. Read the entire article before identifying any illustration opportunity. For articles over 5,000 words: read the introduction, all section headings, and the conclusion in full; skim section bodies for signal phrases; state "I've read the article structure in full and skimmed bodies for illustration signals." If the article is behind a paywall or in an unparseable format (scanned PDF, image-based content), state the limitation and ask the user to provide accessible text. If the article is in a language you are not fluent in, state this and ask whether to proceed with reduced confidence or switch to a translation-assisted workflow.

2. **EARN_PLACE — Every illustration must earn its place.** Ask: "Does this visual help the reader understand something faster or deeper than text alone?" If the answer is no, skip it. Decorative-only illustrations waste the reader's attention.

3. **ONE_CONCEPT — One concept per illustration.** Do not pack multiple unrelated ideas into a single diagram. If two concepts both deserve visuals, make two illustrations.

4. **ALT_TEXT — Alt text is mandatory, not optional.** Every illustration must have descriptive alt text that conveys the same information the visual conveys. For complex diagrams, include both a short alt text (1-2 sentences) and a longer description for the surrounding prose.

5. **STYLE_CONSISTENCY — Style consistency across all illustrations in one article.** Same color palette, same line weights, same typography, same spacing conventions. If you switch styles mid-article, you break the reader's visual model.

6. **NO_INVENTED_DATA — Never invent data.** If the article does not provide numbers for a chart, do not fabricate them. Use a conceptual diagram instead.

7. **SVG_FIRST — SVG first.** Prefer SVG for diagrams and conceptual illustrations. Use Mermaid for flowcharts and sequence diagrams. Use HTML-to-screenshot only as a fallback when the target platform does not support SVG or Mermaid natively.

## Confidence Anchors

Every judgment in this skill carries a confidence score. Use ONLY these discrete anchors:

| Anchor | Meaning | Behavior |
|--------|---------|----------|
| **0** | Pure guess, no basis | MUST ask the user before committing |
| **25** | Weak signal, one data point | Present as an option, not a decision |
| **50** | Reasonable inference from context | State the decision, note it is revisable |
| **75** | Strong pattern match to context | Commit, flag for review |
| **100** | User explicitly stated this, or mechanically verifiable fact | Locked. Do not revisit. |

Never use continuous numbers (e.g., "70% confident"). Discrete anchors prevent false precision.

## Pre-Flight

Before reading the article, resolve these unknowns. Do not proceed until all are answered:

1. **Article source**: Is the article text provided in the prompt, or is it a URL? If a URL, fetch and read the full content. If neither text nor URL is provided, ask: "Which article would you like me to illustrate? Please share the text or a URL."
2. **Target platform**: What platform will the article be published on? (Markdown/GitHub, HTML/CMS, Notion, email, WordPress, etc.) If not obvious from context, ask the user. This determines which illustration formats are viable. If the user cannot specify, default to Markdown with inline Mermaid/SVG.
3. **Scope check**: Estimate the article's word count. If over 5,000 words, remind the user that the session cap is 8 illustrations and ask if they want to prioritize a specific section or proceed with the most impactful illustrations across the full article.

## When to Illustrate

Not every paragraph needs a visual. Scan the article for these signals:

**Code-heavy articles**: If the article is more than 50% code blocks, code is already visual structure. Only illustrate architectural concepts that the code does not convey (e.g., system topology, data flow between components, state transitions). Do not illustrate what the reader can already see in the code.

| Signal | Illustration Type | Example |
|--------|-------------------|---------|
| Process or sequence described in prose | Flowchart / Sequence diagram | "First the user authenticates, then the system checks permissions..." |
| Comparison between two or more things | Comparison table or side-by-side diagram | "Unlike monolithic architectures, microservices..." |
| Hierarchical or structural relationship | Tree diagram / Architecture diagram | "The system has three layers: presentation, logic, and data..." |
| Numeric trends or proportions | Bar chart / Line chart / Pie chart | "Revenue grew 40% year-over-year across three segments..." |
| Abstract concept that benefits from spatial metaphor | Conceptual illustration | "Technical debt accumulates like interest on a loan..." |
| Before/after or cause/effect | Paired illustrations with annotations | "Refactoring the query reduced latency from 800ms to 50ms..." |
| Taxonomy or classification | Nested boxes / Mind map | "Testing falls into four categories: unit, integration, E2E, and manual..." |
| No clear signal matches | No illustration needed | Procedural steps without conceptual density, or straightforward narration that prose handles well. |

<HARD-GATE label="DECISION">
If none of the signals above are present, the article may not need illustrations. Say so explicitly rather than forcing visuals where they do not belong. A confident "this article does not need illustrations" is a valid and professional deliverable.
</HARD-GATE>

## Process

**Session cap**: Maximum 8 illustrations per session. If the article warrants more, illustrate the 8 most impactful concepts first and note the remainder for a follow-up session.

### Step 1: Read and Map

Read the full article. As you read, mark every section where a reader might pause and think "I wish there was a picture here." Produce an illustration plan: a list of (section, concept, illustration type, rationale). Share this plan with the user before generating anything.

**Reading receipt (proves READ_FIRST was honored):** the illustration plan must open with the article's approximate word count, its section list, and one line per section stating what it covers. Every planned illustration must cite the specific section and the sentence or passage it anchors to. A plan without a reading receipt, or with illustrations that cite nothing, is evidence the article was not actually read — restart at Hard Rule 1.

<HARD-GATE label="CONFIRMATION">
This is the only user confirmation gate — everything after this runs without interruption. If the user modifies or rejects the illustration plan, revise it based on their feedback and share the updated plan. Do not proceed to generation until the user confirms the plan. If the user approves with confidence below 50, ask what concerns they have before proceeding.
</HARD-GATE>

### Step 2: Choose the Format

For each illustration in the plan, select the most appropriate format:

- **Mermaid** -- Use for flowcharts, sequence diagrams, class diagrams, ER diagrams, Gantt charts, and state machines. Mermaid renders natively on GitHub, Notion, and many static site generators. It is text-based so it stays diffable and editable.
- **SVG** -- Use for conceptual illustrations, architecture diagrams, comparison visuals, and anything that requires custom layout not expressible in Mermaid. Inline SVG works in all modern browsers and most CMS platforms.
- **HTML -> Screenshot** -- Use only as a fallback when the target platform does not support SVG or Mermaid. Generate a self-contained HTML file, capture a screenshot using a headless browser (Playwright/Puppeteer) if available, then delete the temporary HTML file. **Ask for user confirmation before opening a visible browser window.** Never open a visible browser without the user's explicit consent.

### Step 3: Define the Visual Style

Before generating any illustration, lock in a style spec:

- **Color palette**: 3-5 colors maximum. One primary, one accent, one neutral for backgrounds/borders, and optionally one for highlights and one for warnings. Use the article's brand colors if available. If not, choose a palette that matches the article's tone (warm for storytelling, cool for technical, neutral for business).
- **Typography**: One sans-serif font for labels and annotations. Consistent font sizes: title (18-20px), body labels (13-14px), small annotations (11-12px). For CJK text, increase minimum font sizes by 2px to maintain legibility. For RTL languages (Arabic, Hebrew), mirror diagram layouts.
- **Line weight**: Consistent stroke width (1.5-2px for primary lines, 1px for secondary, 0.5px for gridlines).
- **Corner radius**: Consistent rounding (4px for boxes, 2px for smaller elements, 0 for sharp technical diagrams).
- **Spacing**: Consistent padding (16px inside boxes, 24px between elements, 48px margins).

Apply this style spec to every illustration in the article. If you deviate, the reader will notice the inconsistency before they notice the content.

### Step 4: Generate Each Illustration

Write the style spec to a scratch file (e.g., `_illustration-style-spec.md` in the working directory). Before generating each illustration, re-read the scratch file to re-establish the style constraints. This prevents style drift mechanically rather than relying on catching it in the final consistency pass. Delete the scratch file after delivering the illustrated article.

Generate one illustration at a time. For each one:

1. **Draft** the visual using the chosen format (Mermaid code block or SVG markup).
2. **Self-check** against the style spec (re-read the scratch file). Fix any deviations.
3. **Write alt text** immediately after the illustration. Do not defer this.
4. **Move to the next illustration.** Do not batch-generate and then review -- the context window will overflow and quality will degrade.

#### Mermaid Quick Reference

- Max 15 nodes per diagram. Split larger ones.
- Use subgraphs for 8+ nodes.
- Test: no orphaned arrows, no overlapping labels.
- Escape HTML entities in node labels: `&lt;` `&gt;` `&amp;`.
- Platform note: GitHub, GitLab, and Notion render Mermaid natively. Most static site generators need a plugin.

**Failure handling**: the target platform is the final renderer, but you can close most of the gap locally. To minimize failures:

1. **Pre-flight validation checklist** (run before delivering each Mermaid diagram):
   - All node IDs referenced in arrows exist as declared nodes.
   - No arrow connects a node to itself without an explicit self-loop label.
   - Subgraph names do not conflict with node names.
   - HTML entities in labels are escaped: `&lt;` `&gt;` `&amp;`.
   - No more than 15 nodes. If more, split.
   - No unclosed brackets, quotes, or parentheses.

2. **Local render verification (when shell access + Node.js are available):** write the diagram to a temp `.mmd` file and run `npx -y @mermaid-js/mermaid-cli -i <file>.mmd -o <file>.svg`. A successful exit verifies the syntax actually renders; a failure gives you the parser error to fix before the user ever sees it. Caveats: the first run downloads a headless browser (~150MB) — if the environment is offline or the download fails, note "local render unverified" and rely on the checklist. Delete the temp files afterward.

3. **If a Mermaid diagram fails to render after delivery** (user reports it): (a) simplify by removing the least essential node, re-run the pre-flight checklist, (b) if it still fails, fall back to SVG with the same visual concept, (c) if SVG is also impractical, describe the diagram in prose with a note that a visual was intended here.

4. **Score syntax and platform-render separately.** Syntax validity: confidence 100 if locally render-verified (step 2), 75 if only the pre-flight checklist passed. Platform render success: 75 at most, always — the target platform's Mermaid version and configuration are outside your control. Never let a local render success inflate the platform claim to 100.

#### SVG Quick Reference

- Use `viewBox`, not fixed pixels: `viewBox="0 0 800 600"`.
- Inline styles in a `<style>` block inside SVG.
- Use `<g>` groups with descriptive `id` attributes.
- Keep under 200 lines. If larger, split into multiple illustrations.
- Rounded rectangles for services, sharp rectangles for data stores, dashed lines for async communication.
- **SECURITY**: NEVER include `<script>` tags, event handlers (`onclick`, `onload`), or `<foreignObject>` in generated SVGs. This is a stored XSS vector.
- **ACCESSIBILITY**: Every SVG must have `role="img"` and `aria-labelledby` pointing to an internal `<title>` element.
- **DARK MODE**: Use `currentColor` for text or add a solid white background `<rect>`. Test that colors remain visible on both light (#FFF) and dark (#1A1A1A) backgrounds.

### Step 5: Place Illustrations in the Article

For each illustration, determine the optimal placement:

- **Inline**: Immediately after the paragraph that introduces the concept. This is the default.
- **Figure block**: Centered with a caption, for illustrations that deserve visual prominence.
- **Aside / Callout**: For supplementary illustrations that support but do not drive the main argument.

> **Required reading**: [references/output-format.md](./references/output-format.md) — open when placing illustrations to verify that your output matches the exact format conventions for Mermaid and SVG illustrations, including figure captions and alt text placement.

### Step 6: Final Consistency Pass

After all illustrations are placed, review them as a set:

- Do the colors feel like one family across all illustrations?
- Are font sizes and line weights consistent?
- Do illustration labels use the same terminology as the article text?
- Are there any visual contradictions? (e.g., the same concept drawn differently in two places)

Fix any inconsistencies before delivering.

## Self-Review Checklist

Before delivering, verify every item. Use the discrete confidence anchors (0/25/50/75/100) — never continuous numbers.

- [ ] Full article was read before any illustration was planned. (confidence: 100)
- [ ] Illustration plan was shared with and confirmed by the user. (confidence: 100)
- [ ] Every illustration passes the "earn its place" test -- no decoration-only visuals. (confidence: 0/25/50/75/100)
- [ ] Each illustration conveys exactly one concept. (confidence: 0/25/50/75/100)
- [ ] Style spec is documented and applied consistently across all illustrations. (confidence: 0/25/50/75/100)
- [ ] No invented data -- all chart numbers come directly from the article. (confidence: 100)
- [ ] Every illustration has descriptive alt text. (confidence: 100)
- [ ] Mermaid diagrams pass syntax validation. (confidence: 100 if locally render-verified via mermaid-cli, 75 if checklist-only; platform render success is always ≤75)
- [ ] SVG illustrations are under 200 lines each and use viewBox. (confidence: 100)
- [ ] Illustrations are placed at the correct insertion points with appropriate formatting. (confidence: 0/25/50/75/100)
- [ ] Terminology in illustration labels matches article text exactly. (confidence: 0/25/50/75/100)
- [ ] Final consistency pass completed with no style deviations. (confidence: 0/25/50/75/100)
- [ ] Session cap of 8 illustrations was respected. (confidence: 100)
- [ ] Temporary HTML files (if any) were deleted after screenshot capture. (confidence: 100)

## Multi-Perspective Review

After completing the self-review, examine the illustrated article from three distinct perspectives. If you find issues from any perspective, fix them and re-run the self-review checklist before delivering.

### Editor's Perspective

Read the article as an editor deciding whether to publish:

- Does each illustration add information the text does not already convey?
- Do the visuals interrupt the reading flow or support it?
- Are any illustrations redundant with each other?
- Would removing any illustration weaken the article? If not, remove it.
- Is the illustration-to-text ratio appropriate for the article's length? (Rule of thumb: 1 illustration per 400-600 words for technical content, 1 per 800-1000 words for narrative content.)

### Designer's Perspective

Examine the visuals as a designer reviewing a colleague's work:

- Does the color palette feel intentional and cohesive?
- Are alignment and spacing consistent across all illustrations?
- Do line weights and corner radii match the style spec?
- Is there sufficient contrast between text labels and backgrounds?
- Would these illustrations look at home in a professionally designed publication?

### Reader's Perspective

Read the article as a first-time reader encountering it:

- Can you understand each illustration without reading the surrounding text? (You should be able to -- the alt text serves this purpose.)
- Does each illustration reduce cognitive load rather than add to it?
- Are labels and annotations clear, or do they assume prior knowledge?
- If you skimmed only the illustrations and their captions, would you get the article's main argument?

<HARD-GATE label="EXIT">

Before delivering, the overall illustrated article must meet or exceed confidence 75 on each dimension:

| Dimension | Minimum Confidence |
|-----------|-------------------|
| Every illustration earns its place (no decoration) | 75 |
| Style consistency across all illustrations | 75 |
| Alt text quality (conveys same information as visual) | 100 |
| Terminology matches article text exactly | 100 |
| No invented data | 100 |

If any dimension scores below its threshold, return to the relevant step and fix before delivering.
</HARD-GATE>

## Output Format

Deliver the complete illustrated article with illustrations inserted at their placement points. Follow the exact format conventions in [references/output-format.md](./references/output-format.md). Key rules:

- Inline SVG: viewBox, HTML-comment alt text (`<!-- alt: ... -->`), italic figure caption (`*Figure N: ...*`), leading prose before the SVG.
- Mermaid: fenced code block with `mermaid` language tag, same alt text and caption conventions as SVG.
- Placement: inline (default), figure block (prominence), or aside/callout (supplementary).

## Anti-Patterns

These are the most common failure modes. Watch for them and correct them immediately:

### Content Anti-Patterns

1. **Decoration over clarification.** Adding a stock illustration of a server rack to an article about API design. If the visual does not convey specific information from the article, it is decoration.
2. **Over-diagramming.** Illustrating every minor point until the article looks like a textbook. Fewer, higher-quality illustrations beat many mediocre ones.

### Execution Anti-Patterns

3. **Style drift.** Starting with a clean blue-gray palette and ending with neon green boxes. Lock the style spec before generating and check every illustration against it.
4. **Mermaid sprawl.** A single flowchart with 30+ nodes and crossing arrows that is harder to read than the prose it replaces. Split complex diagrams.
5. **Caption as afterthought.** Writing captions that say "Diagram of the system" instead of what the reader should learn from it. Captions should add context, not label.
6. **Inaccessible visuals.** Generating illustrations without alt text, or with alt text so vague ("a chart") that it provides zero value to screen reader users.

## Test prompts

Three prompts that exercise this skill end-to-end, mirrored in `evaluation/datasets/batch-1-test-prompts.json`.

1. **Happy path — technical blog post with clear signals**: *"Illustrate this article: 'How We Migrated from a Monolith to Microservices at Acme Corp.' The article describes our 3-phase migration: (1) strangler fig pattern to extract the billing service, (2) event-driven communication with Kafka, (3) gradual decommissioning of the monolith. Include before/after architecture diagrams."* — expected: full article read, 3-4 illustrations planned (before/after architecture + sequence diagram for event flow), consistent style spec, Mermaid for sequence diagrams and SVG for architecture diagrams, alt text for every illustration, confidence anchors used correctly.

2. **Edge — code-heavy article that needs only architecture illustrations**: *"Illustrate this article: a 3,000-word tutorial on implementing a JWT auth middleware in Express.js. The article is ~60% code blocks showing the implementation step by step."* — expected: recognizes code-heavy signal, skips illustrating code sections, produces only 1-2 architectural illustrations (auth flow diagram, token lifecycle), explicitly states why no more illustrations are needed.

3. **Adversarial — article that does not need illustrations**: *"Illustrate this article: 'Why I Prefer Working Remotely.' It's a 1,200-word personal essay about the author's experience with remote work — no data, no processes, no comparisons, just personal anecdotes and reflections."* — expected: reads full article, evaluates against the signal table, finds no clear illustration signals, delivers "this article does not need illustrations" as a valid professional deliverable (per the DECISION gate).

## Handoff

After delivering the final illustrated article, **stop**. Do not chain into another skill or continue processing unless the user gives an explicit new instruction. The illustrated article is the complete deliverable.
