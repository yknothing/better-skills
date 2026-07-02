# Gate 2 -- Adversary Review: article-illustrate

**Date**: 2026-06-17
**Reviewer Role**: Adversary (attempt to break the skill)
**Skill Under Review**: `skills/article-illustrate/SKILL.md`

---

## Attack Vector Summary

| # | Attack Vector | Severity | Status |
|---|--------------|----------|--------|
| 1 | READ_FIRST Bypass -- Context Exhaustion on Long Articles | CRITICAL | Open |
| 2 | EARN_PLACE Subjectivity -- Self-Judgment Bias | HIGH | Open |
| 3 | Style Drift Despite Scratch File -- Ambiguous Text Descriptors | HIGH | Open |
| 4 | Mermaid Render Failure Loop -- No Render Feedback | CRITICAL | Open |
| 5 | SVG Security vs. Practicality -- foreignObject Ban | MEDIUM | Open |
| 6 | Dark Mode SVG Testing -- No Dark Rendering Capability | MEDIUM | Open |
| 7 | Session Cap Gaming -- Quantity Over Quality Incentive | HIGH | Open |
| 8 | Code-Heavy Article Paradox -- Suppressing Most Valuable Illustrations | HIGH | Open |
| 9 | No Illustration Reuse -- Redundant/Inconsistent Visual Metaphors | MEDIUM | Open |
| 10 | Caption Quality Not Enforced -- EXIT_GATE Gap | HIGH | Open |

---

## Detailed Findings

### 1. READ_FIRST Bypass -- Context Exhaustion on Long Articles

**Section**: `<rule id="READ_FIRST">` (line 17), Pre-Flight scope check (line 39)

**Severity**: CRITICAL

**Exploit**:
The hard rule states: "Never illustrate without reading the full article first." The Pre-Flight scope check warns the user if the article exceeds 5,000 words, but only to remind them of the 8-illustration cap. It does NOT address the context-window cost of reading the article itself.

Attack scenarios:
- **10,000+ word article**: Reading the full article consumes a large fraction of the agent's context window before any illustration work begins. The agent may hit context limits during generation, causing truncated output or degraded quality on later illustrations.
- **Paywalled article**: If the article is behind a paywall (Medium member-only, WSJ, academic journal), the agent cannot read the full content. The rule provides no fallback for partial-read scenarios.
- **PDF article**: If the article is a PDF, the agent's PDF reading capability is limited to 20 pages per request and may not parse complex layouts (multi-column, embedded figures, tables). The rule does not account for format-specific reading failures.
- **Non-English article**: If the article is in a language the agent reads poorly, "reading the full article" may result in misunderstanding key concepts, leading to illustrations that misrepresent the content. The rule provides no language-proficiency check.
- **Image-heavy article**: If critical information is conveyed in images/charts within the article, the agent's text-based reading may miss essential content, producing illustrations that duplicate or contradict existing visuals.

**Suggested Fix**:
```markdown
<rule id="READ_FIRST">**Never illustrate without reading the full article first.**
Skimming the title or first paragraph is not enough. Read the entire article
before identifying any illustration opportunity.

**Exceptions and mitigations:**
- If the article exceeds 8,000 words, read the introduction and all section
  headers in full, then read the body of each section immediately before
  illustrating it (staged reading). State this strategy explicitly.
- If the article is behind a paywall, ask the user to paste the full text.
  Do not proceed with a partial view.
- If the article is a PDF that cannot be fully parsed, ask the user to provide
  the text in a parseable format.
- If the article is in a language you are not proficient in, state this and
  ask whether the user wants a best-effort illustration or a referral to a
  native-language workflow.
- If the article contains critical information in images, ask the user to
  describe those images or provide alt text.
</rule>
```

---

### 2. EARN_PLACE Subjectivity -- Self-Judgment Bias

**Section**: `<rule id="EARN_PLACE">` (line 19), Self-Review Checklist item 3 (line 153)

**Severity**: HIGH

**Exploit**:
The rule asks the agent: "Does this visual help the reader understand something faster or deeper than text alone?" This is a judgment call the agent makes about its own work. Cognitive bias is inevitable:

- **Effort justification**: An agent that just spent effort creating an illustration will be biased to answer "yes." The more effort invested, the stronger the bias.
- **No external validator**: The confirmation gate (Step 1, line 70-72) asks the user to approve the *illustration plan* -- a list of section/concept/type/rationale. But the user sees only the plan, not the finished illustrations. By the time the illustrations are generated, the user has already approved the plan, and the agent self-judges the EARN_PLACE test during self-review (line 153) with no user re-validation.
- **The self-review checklist uses a confidence slider (0/25/50/75/100) for EARN_PLACE, but the EXIT_GATE only requires confidence 75. An agent can mark "75" without genuine justification.**

**Suggested Fix**:
```markdown
<rule id="EARN_PLACE">**Every illustration must earn its place.** Ask: "Does this
visual help the reader understand something faster or deeper than text alone?"
If the answer is no, skip it.

**Enforcement**: For each illustration, write one sentence explaining
*what specific information* the visual conveys that the surrounding prose
does not. If you cannot articulate this in a single clear sentence, the
illustration has not earned its place. Include this sentence in the
illustration plan for the user to review before generation.
</rule>
```

Additionally, update the EXIT_GATE to require the user to validate the EARN_PLACE judgment after seeing the final output, or add a second confirmation gate after generation.

---

### 3. Style Drift Despite Scratch File -- Ambiguous Text Descriptors

**Section**: Step 4: "Generate Each Illustration" (lines 94-104), Style spec (lines 84-91)

**Severity**: HIGH

**Exploit**:
Step 4 mandates writing the style spec to a scratch file and re-reading it before each illustration. This is a well-intentioned mechanical guard against style drift. However:

- **Text descriptors are inherently ambiguous**: "Warm color palette" means different things on illustration 1 vs. illustration 8. The agent's context shifts with each generation; its interpretation of "warm" will drift toward the colors it most recently generated.
- **No concrete color values required**: The style spec (lines 86-91) asks for "3-5 colors maximum" with roles (primary, accent, neutral, etc.), but does NOT require explicit hex codes or named colors. An agent could write `primary: blue, accent: orange, neutral: gray` and generate `#1A5276` blue on illustration 1 and `#3498DB` blue on illustration 7 -- both "blue," but visually inconsistent.
- **The scratch file only helps if the agent faithfully re-reads it**: If the agent is rushing or context is tight, it may skip the re-read (line 96: "Before generating each illustration, re-read the scratch file"). There is no enforcement mechanism -- no checkpoint that verifies the re-read occurred.
- **No quantitative style checks**: The final consistency pass (Step 6, lines 138-144) asks subjective questions ("Do the colors feel like one family?"). An agent reviewing its own work after context has shifted is poorly positioned to detect drift.

**Suggested Fix**:
```markdown
### Step 3: Define the Visual Style

Before generating any illustration, lock in a style spec with **explicit,
machine-checkable values**:

- **Color palette**: Define exact hex codes. Example:
  - Primary: `#2563EB` (blue-600)
  - Accent: `#F59E0B` (amber-500)
  - Neutral bg: `#F8FAFC` (slate-50)
  - Neutral border: `#CBD5E1` (slate-300)
  - Highlight: `#10B981` (emerald-500)
  - Warning: `#EF4444` (red-500)
- **Typography**: Specify exact font families and sizes. Example:
  - Title: `font-family="Inter, sans-serif" font-size="18px"`
  - Body: `font-family="Inter, sans-serif" font-size="13px"`
  - Annotation: `font-family="Inter, sans-serif" font-size="11px"`
- **Line weight**: `stroke-width="2"` (primary), `stroke-width="1"` (secondary),
  `stroke-width="0.5"` (grid)
- **Corner radius**: `rx="4"` (boxes), `rx="2"` (small elements), `rx="0"` (sharp)
- **Spacing**: `padding: 16px` (inside), `gap: 24px` (between), `margin: 48px` (outer)

Write these exact values to the scratch file. Before generating each illustration,
read the scratch file and **copy-paste the hex codes and numeric values** directly
into the SVG or Mermaid code. Do not reinterpret "warm" or "blue" -- use the
exact values.
```

---

### 4. Mermaid Render Failure Loop -- No Render Feedback

**Section**: "Failure handling" (lines 113-114), Self-Review Checklist item 8 (line 158)

**Severity**: CRITICAL

**Exploit**:
The failure handling chain is: "If a Mermaid diagram fails to render: (1) simplify by removing the least essential node, (2) if it still fails, fall back to SVG, (3) if SVG is also impractical, describe the diagram in prose."

The critical flaw: **The agent cannot render Mermaid to test whether it works.** Mermaid rendering happens at the destination platform (GitHub, Notion, static site generator). The agent writes Mermaid code and hopes it renders correctly.

- **Self-review checklist item 8** (line 158) asks: "Mermaid diagrams render without errors (no orphaned nodes, no broken arrows). (confidence: 100)" -- but the agent CANNOT know this with confidence 100. It is guessing.
- **The failure loop never triggers**: Since the agent never detects a render failure, it never simplifies, never falls back to SVG, and never falls back to prose. The first time a failure is known is when the user reports "this diagram doesn't render."
- **Mermaid syntax errors are subtle**: Missing a colon in `A-->B: label` vs `A-->>B: label`, using unsupported characters in node labels, or exceeding platform-specific node limits -- none of these are detectable by the agent.
- **Platform-specific rendering differences**: GitHub's Mermaid renderer, Notion's, and Mermaid Live all have slightly different behavior. A diagram that works in one may fail in another.

**Suggested Fix**:
```markdown
**Failure handling**: Before finalizing any Mermaid diagram:
1. Validate syntax: Check for balanced brackets, correct arrow syntax
   (`-->` for solid, `-.->` for dashed), no orphaned participants, no
   duplicate node IDs.
2. Count nodes: Max 15. If exceeded, split before generating.
3. Check for known failure patterns:
   - HTML entities in labels MUST be escaped (`&lt;`, `&gt;`, `&amp;`)
   - No special characters in unquoted node labels
   - Subgraph titles must be quoted if they contain spaces
4. If you cannot validate a diagram with confidence, prefer SVG as the
   initial format rather than generating Mermaid and hoping it renders.
5. Include a note in the deliverable: "Mermaid diagrams were validated
   for syntax but not live-rendered. If any diagram fails to render on
   your platform, the SVG fallback is: [provide inline SVG alternative]."
```

Also, change self-review checklist item 8 from `confidence: 100` to `confidence: 0/25/50/75/100` since the agent cannot achieve 100 confidence on render success.

---

### 5. SVG Security vs. Practicality -- foreignObject Ban

**Section**: SVG Quick Reference, "SECURITY" bullet (line 122)

**Severity**: MEDIUM

**Exploit**:
The security rule states: "NEVER include `<script>` tags, event handlers (`onclick`, `onload`), or `<foreignObject>` in generated SVGs. This is a stored XSS vector."

The ban on `<script>` and event handlers is correct and necessary. However:

- **`<foreignObject>` is NOT a security risk in itself**: It is a standard SVG feature for embedding HTML within SVG. It is the most practical way to achieve text wrapping in SVG, which `<text>` elements cannot do natively. Without `foreignObject`, multi-line text in SVG diagrams requires manual `<tspan>` positioning -- fragile, error-prone, and often visually broken.
- **The ban prevents a legitimate SVG technique**: Many professionally designed SVGs use `<foreignObject>` for text blocks that need to wrap. Banning it forces the agent into inferior text layout.
- **The real XSS risk is in the HTML content inside `<foreignObject>`, not the element itself**: A `<foreignObject>` containing plain `<div>Hello World</div>` is harmless. The same `<foreignObject>` containing `<script>alert(1)</script>` is dangerous. The ban conflates the container with the content.

**Suggested Fix**:
```markdown
- **SECURITY**: NEVER include `<script>` tags, event handlers (`onclick`,
  `onload`, `onerror`, `onfocus`, etc.), or `javascript:` URLs in generated
  SVGs. If `<foreignObject>` is used for text wrapping, it MUST contain
  only plain text or safe HTML elements (`<div>`, `<p>`, `<span>`, `<br>`)
  with no attributes other than `style`. Never include `<script>`, event
  handlers, or external resource references (`<iframe>`, `<img src="...">`,
  `<link>`) inside `<foreignObject>`. Prefer native SVG `<text>` with manual
  `<tspan>` line breaks over `<foreignObject>` unless text wrapping is
  essential and cannot be achieved otherwise.
```

---

### 6. Dark Mode SVG Testing -- No Dark Rendering Capability

**Section**: SVG Quick Reference, "DARK MODE" bullet (line 124)

**Severity**: MEDIUM

**Exploit**:
The rule states: "Use `currentColor` for text or add a solid white background `<rect>`. Test that colors remain visible on both light (#FFF) and dark (#1A1A1A) backgrounds."

- **The agent cannot render on dark backgrounds**: It has no mechanism to preview an SVG on a `#1A1A1A` canvas. The "test" is a mental simulation -- the agent imagines what the colors would look like, which is unreliable.
- **`currentColor` inherits from the parent HTML document**: If the parent page sets `color: #333` in light mode and `color: #EEE` in dark mode, `currentColor` works beautifully. But if the parent page sets `color: #000` in both modes, or the SVG is viewed standalone, `currentColor` may fail. The agent cannot know the parent page's color scheme.
- **Adding a solid white background `<rect>` defeats dark mode**: A white-background SVG on a dark-mode page creates a blinding white rectangle in an otherwise dark reading experience. This "fix" introduces a UX regression.
- **No guidance on contrast ratios**: The rule doesn't mention WCAG contrast requirements (4.5:1 for normal text, 3:1 for large text). The agent may choose colors that are "visible" but fail accessibility standards.

**Suggested Fix**:
```markdown
- **DARK MODE**: Prefer adding a solid background `<rect>` with a neutral
  color that works on both backgrounds (e.g., `#FAFAFA` for a near-white
  background that is less jarring on dark mode than pure `#FFFFFF`).
  Alternatively, use a two-background approach:
  `<rect width="100%" height="100%" fill="#FFFFFF" class="light-bg"/>`
  with a note that dark-mode CSS should hide this rect.
  - Ensure all text colors achieve at least WCAG AA contrast (4.5:1 for
    body labels, 3:1 for large titles) against their immediate background.
  - State in the deliverable: "SVG colors were checked against #FFFFFF and
    #1A1A1A backgrounds using hex-value contrast calculation. Please verify
    rendering on your actual dark-mode theme."
```

---

### 7. Session Cap Gaming -- Quantity Over Quality Incentive

**Section**: "Session cap" (line 64), Step 1 (line 68)

**Severity**: HIGH

**Exploit**:
The session cap states: "Maximum 8 illustrations per session. If the article warrants more, illustrate the 8 most impactful concepts first."

This creates a perverse incentive:

- **8 shallow illustrations beat 3 deep ones**: The cap is a number, not a quality threshold. An agent could produce 8 quick, superficial illustrations to "fill the quota" rather than 3 deeply considered ones. The number 8 becomes a target, not a ceiling.
- **No minimum quality bar per illustration**: There is no rule saying "if an illustration would be shallow, skip it even if under the cap." The EARN_PLACE rule exists but is self-judged and subject to bias (see Attack Vector 2).
- **The "most impactful" selection is unguided**: Step 1 says "illustrate the 8 most impactful concepts first" but provides no rubric for ranking impact. An agent might prioritize concepts that are easiest to illustrate (flowcharts for simple processes) over concepts that are hardest but most valuable (conceptual illustrations for abstract ideas).
- **Follow-up sessions are unlikely in practice**: The rule says "note the remainder for a follow-up session" but follow-up sessions are rare. The cap effectively means "you get 8, and everything else is silently dropped."

**Suggested Fix**:
```markdown
**Session cap**: Maximum 8 illustrations per session. However:
- **Quality over quantity**: 3 high-quality illustrations that deeply clarify
  complex concepts are better than 8 superficial ones. Do not generate an
  illustration just to use the cap.
- **Impact ranking**: Rank illustration candidates by:
  1. How many readers will struggle with this concept without a visual?
  2. How much does a visual reduce the cognitive load vs. text alone?
  3. Can this concept be illustrated well in the available formats?
  Generate the highest-ranked illustrations first. Stop when the next
  candidate ranks below "moderate impact" on these criteria, even if
  under the cap.
- If the article warrants more than 8 high-impact illustrations, note the
  remainder with specific section references for a follow-up session.
```

---

### 8. Code-Heavy Article Paradox -- Suppressing Most Valuable Illustrations

**Section**: "When to Illustrate" -- "Code-heavy articles" (lines 45-46)

**Severity**: HIGH

**Exploit**:
The rule states: "If the article is more than 50% code blocks, code is already visual structure. Only illustrate architectural concepts that the code does not convey (e.g., system topology, data flow between components, state transitions). Do not illustrate what the reader can already see in the code."

The paradox:

- **Code-heavy articles benefit MOST from architecture illustrations**: A tutorial that is 60% code blocks is exactly where a reader needs a system overview diagram, a data flow diagram, or a state machine to understand WHY the code does what it does. The rule correctly exempts architecture concepts, but the framing "code is already visual structure" may cause the agent to under-illustrate.
- **"Do not illustrate what the reader can already see in the code" is ambiguous**: A flowchart of a function's logic IS visible in the code, but a flowchart is still useful for readers who learn visually or need a quick reference. The rule may suppress useful flowchart illustrations of complex algorithms.
- **The 50% threshold is arbitrary**: An article with 49% code blocks gets full illustration treatment. An article with 51% code blocks gets restricted to architecture only. The reader experience doesn't change at that boundary.
- **The rule could be read as "code-heavy articles need fewer illustrations" when the opposite is often true**: Code-heavy articles are dense and cognitively demanding. They benefit from MORE structural visuals, not fewer.

**Suggested Fix**:
```markdown
**Code-heavy articles**: If the article is more than 50% code blocks, the
reader is already processing significant visual structure. In these articles:
- **Prioritize architecture and concept illustrations**: System topology,
  data flow, state machines, and component relationship diagrams provide
  context the code alone cannot. These are the highest-value illustrations
  for code-heavy articles.
- **Still consider flowcharts for complex algorithms**: If a function's
  logic spans more than 30 lines or involves multiple branching paths,
  a flowchart may help readers grasp the overall structure before diving
  into the code.
- **Skip code-listing illustrations**: Do not create visuals that merely
  restate what the code already shows (e.g., a diagram of a simple CRUD
  function). The code IS the illustration for straightforward logic.
- The 50% threshold is a guideline, not a hard cutoff. If the article has
  45% code and complex architecture, the same prioritization applies.
```

---

### 9. No Illustration Reuse -- Redundant/Inconsistent Visual Metaphors

**Section**: Step 4: "Generate Each Illustration" (lines 94-104), Step 6: "Final Consistency Pass" (lines 138-144)

**Severity**: MEDIUM

**Exploit**:
The process generates each illustration independently from scratch (line 100: "Generate one illustration at a time"). There is no mechanism for:

- **Visual metaphor reuse**: If two sections both describe "data flowing through a pipeline," the agent might draw a pipeline on illustration 2 and a different pipeline on illustration 7. They convey the same concept but look different -- violating STYLE_CONSISTENCY at the conceptual level.
- **Cross-illustration referencing**: If illustration 3 shows "Component A" in blue with rounded corners, and illustration 6 also shows "Component A," the agent might draw it differently (different shape, different color). The final consistency pass (Step 6) checks for "visual contradictions" (line 144) but only after all illustrations are generated -- requiring rework.
- **Redundant effort**: If the same visual element (a database icon, a user avatar, a server box) appears in multiple illustrations, the agent redraws it from scratch each time, wasting effort and risking inconsistency.
- **No component library concept**: The scratch file stores style values (colors, fonts) but not visual components (shapes, icons, recurring elements).

**Suggested Fix**:
Add to Step 4:
```markdown
**Visual component reuse**: Before generating illustrations, identify
recurring visual elements from the illustration plan:
- If the same entity (e.g., "API Gateway," "User Browser," "Database")
  appears in multiple illustrations, define its visual representation
  once in the scratch file (shape, color, label style) and reuse it.
- Example scratch file entry:
  ```
  Component: API Gateway
    Shape: rounded rectangle, rx=6, fill=#DBEAFE, stroke=#2563EB, stroke-width=2
    Label: "API Gateway", font-size=13px, fill=#1E3A5F
  ```
- Before generating each illustration, check the scratch file for any
  previously defined components that appear in the current illustration.
  Reuse their exact visual definitions.
```

---

### 10. Caption Quality Not Enforced -- EXIT_GATE Gap

**Section**: Anti-Patterns "Caption as afterthought" (line 280), EXIT_GATE (lines 199-212), Output Format (lines 216-221)

**Severity**: HIGH

**Exploit**:
The anti-patterns section explicitly warns: "Caption as afterthought. Writing captions that say 'Diagram of the system' instead of what the reader should learn from it." This is a recognized failure mode.

However:

- **The EXIT_GATE does not include captions as a dimension**: The gate checks: EARN_PLACE (75), style consistency (75), alt text quality (100), terminology match (100), no invented data (100). Captions are absent.
- **The output format** (line 219) says: "A short caption (1 line) describing what the reader should take from the visual." But this is a description, not an enforced requirement with a confidence threshold.
- **The self-review checklist** (lines 148-164) has no caption-specific item. Item 10 ("placed at the correct insertion points with appropriate formatting") could be stretched to include captions, but it's not explicit.
- **The Editor's Perspective review** (line 177) asks "Would removing any illustration weaken the article?" which indirectly touches on captions, but doesn't check caption quality directly.
- **Result**: An agent could pass all EXIT_GATE dimensions with confidence 75+ while writing captions like "Figure 1: System architecture" -- exactly the anti-pattern the skill warns against.

**Suggested Fix**:
Add to the EXIT_GATE table:
```markdown
| Caption quality (adds context, not just labels) | 75 |
```

Add to the self-review checklist:
```markdown
- [ ] Every caption describes what the reader should learn, not just what
  the illustration depicts. "System architecture" is a label. "The three-tier
  architecture separates presentation, business logic, and data persistence
  layers" is a caption. (confidence: 0/25/50/75/100)
```

Add to the Reader's Perspective review:
```markdown
- If you read only the captions (skipping body text and alt text), do they
  form a coherent summary of the article's visual argument?
```

---

## Overall Assessment

**Verdict**: The skill has a strong foundation but contains several exploitable weaknesses that an agent -- especially one optimizing for speed or facing context pressure -- will trigger.

**Critical issues** (2):
1. The READ_FIRST rule provides no mitigation for long, paywalled, or unparseable articles (Attack Vector 1).
2. The Mermaid failure handling loop is untestable by the agent and will never trigger (Attack Vector 4).

**High-severity issues** (5):
3. EARN_PLACE self-judgment has no external validation after generation (Attack Vector 2).
4. Style drift is mechanically possible despite the scratch file due to ambiguous text descriptors (Attack Vector 3).
5. The session cap incentivizes quantity over quality (Attack Vector 7).
6. The code-heavy article rule may suppress the most valuable illustrations (Attack Vector 8).
7. Caption quality is warned against but not enforced in the EXIT_GATE (Attack Vector 10).

**Medium-severity issues** (3):
8. The foreignObject ban prevents legitimate SVG text-wrapping (Attack Vector 5).
9. Dark mode testing is simulated, not real (Attack Vector 6).
10. No mechanism for visual component reuse across illustrations (Attack Vector 9).

**Recommended action**: Address the two CRITICAL issues and at least three of the HIGH-severity issues before this skill enters production use. The remaining issues can be addressed in a follow-up hardening pass.
