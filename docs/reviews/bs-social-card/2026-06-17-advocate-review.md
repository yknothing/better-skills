# Advocate Review: bs-social-card

**Date**: 2026-06-17
**Reviewer Role**: Advocate
**Skill**: bs-social-card
**HUMAN_VERIFIED**: false

## Executive Summary

This compatibility header normalizes review metadata after the repository-wide `bs-` namespace migration. The substantive review below is preserved unchanged.

**Schema completeness**: 10/10
**Schema migration status**: PASS

## Original Review

# Social-Card Advocate Review

**Date**: 2026-06-17
**Reviewer**: Advocate (Gate 2 — Peer Review)
**Skill**: bs-social-card
**Tier**: Lightweight (~430 words)
**Registered Patterns**: minimal-precision, hard-rules-first, precise-commands, progressive-disclosure

---

## Scoring Summary

| # | Dimension | Score | Weight |
|---|-----------|-------|--------|
| 1 | Minimal Precision | 9/10 | 10 |
| 2 | Content Extraction | 7/10 | 10 |
| 3 | Text Escaping | 9/10 | 10 |
| 4 | Font Size Selection | 8/10 | 10 |
| 5 | HTML Template | 8/10 | 10 |
| 6 | Screenshot Pipeline | 9/10 | 10 |
| 7 | Verification (Step 6) | 8/10 | 10 |
| 8 | Hard Rules | 9/10 | 10 |
| **Total** | | **67/80** | |

---

## Detailed Evaluation

### 1. Minimal Precision — 9/10

**Assessment**: The skill achieves a complete end-to-end workflow (extract → escape → size → build → screenshot → verify) in approximately 430 words. This is a textbook execution of the Cursor-style "极简精确" (Minimal Precision) pattern.

**What works**:
- Every section directly contributes to the output. No explanatory prose, no philosophy, no "why" digressions — just executable instructions.
- The HTML template is aggressively minified (single-line CSS rules), which is appropriate for a template that an agent copies and fills in.
- The 6-step numbered structure creates an unambiguous execution sequence. An agent cannot skip a step without visibly violating the numbering.
- The description frontmatter uses the Anthropic-style trigger-condition-only pattern — it lists when to use and when NOT to use, with no workflow summary.

**What could be better**:
- A single sentence about what to do if the user wants a dark-themed card ("Invert the color values in the template") would cover a frequent variant without material bloat.
- The skill could benefit from one escape-hatch sentence: "For cards requiring logos, background images, or multi-column layouts, redirect to bs-ui-master."

**Verdict**: Exceptional density. Among the lightest skills in the registry while maintaining a complete workflow. The 1-point deduction is for missing the dark-theme hint, which is the single most common variant request.

---

### 2. Content Extraction — 7/10

**Assessment**: Step 1 extracts title (required) and subtitle (optional, covering tagline, URL, author attribution). This is the canonical social card content model — Twitter/X cards, LinkedIn link previews, Facebook OG tags, and Slack unfurls all follow title+subtitle.

**What works**:
- The title/subtitle model captures the semantic structure of virtually every social card platform.
- The required/optional distinction is explicit. Missing title triggers a specific question: "What should the card say as its main headline?" — this is precise and actionable.
- The subtitle field is deliberately flexible (tagline, URL, author attribution), which avoids over-specifying while still providing guidance.

**What could be better**:
- No handling for logo/avatar. Many real-world social cards include a brand logo or author avatar. This is not a niche request — it is common.
- No handling for background images. Cards with a background image + overlaid text are frequent.
- The skill currently assumes text-only cards. While this covers a large percentage of cases, the missing logo/avatar slot is a gap.

**Recommendation**: Add an optional logo slot without expanding the core workflow. Something like: "Logo URL (optional): If the user provides a logo or wants a brand mark, note the URL. Place it at bottom-right in the template." This would cover a significant percentage of real-world use cases without adding more than 2-3 lines.

**Verdict**: Sufficient for the 80% case (text-only social cards), but the logo/avatar gap is real. Redirecting to bs-ui-master for image-heavy cards is reasonable, but a simple logo slot is common enough to warrant inclusion.

---

### 3. Text Escaping — 9/10

**Assessment**: Step 2 correctly escapes the four characters that matter for HTML context: `&` → `&amp;`, `<` → `&lt;`, `>` → `&gt;`, `"` → `&quot;`. This is the standard set for preventing HTML injection through user-supplied text inserted into HTML body content and double-quoted attributes.

**What works**:
- The escaping set is correct and sufficient for the template's usage context. User text only appears as element text content and in double-quoted attribute values.
- The ordering is correct: `&` is escaped first (preventing double-escaping of the other entities).
- The skill explicitly states "Before inserting user text into HTML" — this establishes the correct temporal ordering.

**What could be better**:
- Single quote (`'`) is not escaped. This is not exploitable in the current template (no single-quoted attributes), but it is a completeness gap. If someone later modifies the template to use single-quoted attributes, the escaping would be insufficient.
- No mention of newline handling. If a user provides a multi-line title, the raw newlines would not render as line breaks in HTML. This is a minor edge case but worth noting.

**Verdict**: Correct and sufficient for the current template. The single-quote gap is theoretical (not exploitable today) but worth addressing for future-proofing.

---

### 4. Font Size Selection — 8/10

**Assessment**: A 3-tier system: ≤80 chars → 72px, 81-120 chars → 56px, >120 chars → 44px. Each tier drops approximately 16px, which is a meaningful visual step.

**What works**:
- The tiers are based on a measurable, unambiguous input (character count). An agent can compute this mechanically without judgment calls.
- The 16px step between tiers creates clearly distinguishable visual sizes. This is better than a continuous formula, which would invite false precision.
- The system is simple enough to remember and apply without consulting the table each time.

**What could be better**:
- No guidance on expected line count. At 72px with 80 characters in a 900px max-width container, the title will wrap to 3-4 lines. An agent unfamiliar with typography might not anticipate this. A note like "Expect 2-4 wrapped lines depending on character width" would help.
- The tiers don't account for character width variance. 80 "W" characters consume far more horizontal space than 80 "i" characters. A word-count or approximate-pixel-width heuristic could be more accurate, but would add complexity that conflicts with the lightweight tier.

**Verdict**: A pragmatic heuristic that works well for mixed-case English text. The simplicity is appropriate for the tier. The 2-point deduction is for the missing line-count guidance, which could lead to surprises for agents that don't understand typography.

---

### 5. HTML Template — 8/10

**Assessment**: The template is self-contained (no external fonts, no CDN dependencies), uses system-ui font, and employs flexbox centering with an absolutely-positioned subtitle. The CSS is minified, consistent with the lightweight tier's "minimal precision" pattern.

**What works**:
- Self-contained: no network requests, no font loading delays, no CDN dependencies. This makes the screenshot pipeline reliable and fast.
- System-ui font: renders instantly, looks native on every platform, and avoids the "Inter font everywhere" anti-pattern.
- Flexbox centering: the title is vertically and horizontally centered. This is the canonical social card layout.
- The 100px side padding creates comfortable margins. The 900px max-width on the title prevents text from running edge-to-edge.
- `word-wrap: break-word` prevents overflow for extremely long unbroken strings.

**What could be better**:
- Subtitle-title collision risk. The subtitle is absolutely positioned at `bottom: 60px; left: 100px`. If the title is long and wraps to 5+ lines, the centered title text could visually overlap with the bottom-left subtitle. There is no `z-index` or margin-based collision prevention.
- No dark mode variant. The template hardcodes `background:#FFFFFF; color:#1A1A1A`. For dark-themed cards (which are increasingly common on platforms like Twitter/X dark mode), the agent must manually invert these values. A commented-out dark variant would be helpful.
- The subtitle color (`#6B7280`, a gray-500) passes contrast requirements against white background (approximately 5.5:1), which meets WCAG AA for large text but not AAA. Given that the Hard Rules demand AAA for body text, this is a tension worth noting — though the subtitle at 28px qualifies as "large text" under WCAG, where AA is acceptable.

**Verdict**: Clean, functional, and appropriately minimal. The subtitle collision risk and dark mode gap are the main concerns.

---

### 6. Screenshot Pipeline — 9/10

**Assessment**: A 4-step Playwright MCP pipeline: navigate to local file, resize viewport, wait 1 second, take screenshot as PNG. The pipeline is correct, complete, and follows the `precise-commands` pattern — each step is an exact MCP tool call with explicit parameters.

**What works**:
- The pipeline uses `file:///` URLs (triple-slash for Unix absolute paths), which is correct for local HTML rendering.
- Viewport resize to 1200x630 ensures the screenshot matches the intended card dimensions exactly. No cropping or scaling needed.
- The 1-second wait is a pragmatic buffer for font rendering. System-ui should render instantly, but a brief wait is defensive.
- `fullPage: true` ensures the entire 1200x630 canvas is captured even if content shifts.
- The fallback is appropriate: "Install Playwright MCP" with the exact npm command. The skill does not attempt to implement a fallback screenshot method (which would add complexity and likely be unreliable). This is the right call for a lightweight skill.
- The `file:///` URL prefix with triple slash correctly handles macOS/Linux absolute paths (e.g., `file:///tmp/bs-social-card.html`).

**What could be better**:
- The 1-second wait is conservative but might be insufficient on very slow systems. A more robust approach would be to wait for the document's `load` event or use `waitFor` with a specific element selector. However, for local HTML with no external resources, 1 second is generous.
- The Windows path (`%TEMP%`) is mentioned in Step 4 but the screenshot pipeline only shows the Unix path. Adding a Windows variant would improve cross-platform coverage.

**Verdict**: Reliable, minimal, and correct. The precise MCP tool calls leave no room for interpretation.

---

### 7. Verification (Step 6) — 8/10

**Assessment**: Three verification checks with a retry loop (up to 3 attempts, then escalate to user). This is a well-structured quality gate.

**What works**:
- **Dimensions check**: Unambiguous. 1200x630 is measurable from screenshot metadata.
- **Text visibility check**: Uses the 1000px usable width heuristic (1200px minus 100px padding each side). This is a practical proxy for overflow detection. The remedy (reduce font-size one tier) is specific and actionable.
- **No placeholder check**: Scans for lorem ipsum and template tokens ({{VARIABLE}}). This prevents the most common AI failure mode — fabricating content or leaving template artifacts.
- **Retry loop**: 3 attempts is well-calibrated. It is persistent enough to fix transient issues (font rendering, minor overflow) but bounded to prevent infinite loops.
- **Hard refusal**: "Do not return a card that fails verification." This is a strong quality gate that forces the agent to either fix the issue or escalate.

**What could be better**:
- No subtitle-title overlap check. As noted in the HTML Template analysis, the absolutely-positioned subtitle can overlap with wrapped title text. The verification step does not check for this.
- The text visibility check only considers horizontal overflow. Vertical overflow (text extending below the 630px height) is not explicitly checked, though the 1.1 line-height and centered flexbox layout make this unlikely for typical title lengths.
- No contrast verification. The Hard Rules mandate WCAG AAA (>17:1), but Step 6 does not verify that the rendered card actually meets this. A simple check like "Confirm the card uses #1A1A1A on #FFFFFF or the inverse" would close this loop.

**Verdict**: Solid quality gate for the most common failure modes. The missing overlap check and missing contrast verification are the main gaps.

---

### 8. Hard Rules — 9/10

**Assessment**: Three rules that capture the essential constraints for social card generation. Each rule is unambiguous, enforceable, and addresses a distinct failure mode.

**What works**:
- **OUTPUT: 1200x630 PNG**: The OG image standard. Unambiguous. No exceptions. This prevents the agent from generating wrong-sized cards that platforms would reject or crop.
- **NO PLACEHOLDER TEXT**: Critical for correctness. AI agents have a strong tendency to fabricate content when input is missing. This rule forces interaction rather than fabrication. The instruction "ask" is specific.
- **CONTRAST: WCAG AAA (>17:1)**: An accessibility constraint that also produces visually crisp cards. The explicit color codes (#1A1A1A, #FFFFFF) leave no room for interpretation. The sub-rule "brand accent colors are for decoration only, never body text" is sophisticated — it allows visual branding while protecting readability.
- The rules are placed before the workflow steps (hard-rules-first pattern), ensuring the agent reads constraints before execution instructions.

**What could be better**:
- The contrast rule could acknowledge that dark-themed cards are a valid variant (white on black instead of black on white). While "or white on black" is mentioned, the template only provides the light variant. A one-line note in the template section would bridge this gap.
- The NO PLACEHOLDER rule could be strengthened with a specific anti-pattern name, e.g., "Anti-Pattern: 'I'll use placeholder text for now and the user can change it later.'" This would make the rule harder for the agent to rationalize around.

**Verdict**: The strongest section of the skill. These three rules capture exactly what matters — dimensions, authenticity, and accessibility — in a way that is impossible to misinterpret.

---

## Pattern Alignment Check

The skill is registered with four patterns in skills.json. Here is how well it executes each:

| Pattern | Execution Quality | Notes |
|---------|-------------------|-------|
| **minimal-precision** | Excellent | ~430 words for a complete workflow. Every line earns its place. |
| **hard-rules-first** | Excellent | Three hard rules precede the workflow. Clear, enforceable, placed correctly. |
| **precise-commands** | Excellent | The screenshot pipeline uses exact MCP tool calls with explicit parameters. No "take a screenshot" vagueness. |
| **progressive-disclosure** | Good | The description frontmatter is trigger-only (no workflow summary). The skill body is linear. However, there is no secondary loading (no referenced files), which is appropriate for the lightweight tier. |

All four registered patterns are correctly applied. No pattern misalignment detected.

---

## Source Attribution Accuracy

The skill draws primarily from Cursor-style minimalism (minimal-precision, precise-commands) and Anthropic-style constraints (hard-rules-first, progressive-disclosure). The attributions in skills.json are accurate.

---

## Strongest Aspect

The **Hard Rules** section. Three constraints — dimensions, authenticity, and contrast — capture the entire quality surface of social card generation. Each rule addresses a distinct failure mode:
1. Wrong dimensions → platform rejects or crops the card
2. Placeholder text → fabricated, unprofessional output
3. Poor contrast → inaccessible, illegible card

The rules are specific enough to be enforceable (exact color codes, exact dimensions) and general enough to cover all variants. The "brand accent colors are for decoration only" sub-rule shows sophisticated understanding of the tension between branding and accessibility.

---

## One Improvement

**Add an optional logo/avatar slot to the template.** Many real-world social cards include a brand logo or author avatar — this is not an edge case. A simple addition like:

```html
{{#LOGO_URL}}<img src="{{ESCAPED_LOGO_URL}}" style="position:absolute;bottom:60px;right:100px;width:80px;height:80px;border-radius:50%">{{/LOGO_URL}}
```

...would cover a significant percentage of use cases without adding material complexity. The content extraction step would need one additional line: "Logo URL (optional): Brand mark or author avatar."

---

## Production-Ready Assessment

**Yes, with one caveat.** The skill is production-ready for text-only social cards — which is its stated scope. The workflow is complete, the error handling is bounded, the quality gates are enforceable, and the Hard Rules prevent the most common failure modes.

The caveat: users requesting logo/avatar/image-inclusive cards should be redirected to bs-ui-master. The skill's description already hints at this ("Do NOT use for: ... use bs-ui-master for those"), but the skill body could benefit from an explicit escape-hatch sentence.

For a lightweight-tier skill, the depth-to-weight ratio is excellent. It does one thing (text-only social card generation) and does it well, with no feature creep.

---

## Comparison to No-Skill Baseline

Without this skill, an agent asked to "generate a social card" would likely:
- Produce wrong dimensions (not knowing the 1200x630 OG standard)
- Use placeholder text instead of asking for missing content
- Choose arbitrary colors without contrast consideration
- Use an ad-hoc screenshot method (or skip verification entirely)

The skill prevents all four of these failure modes through explicit constraints. The value-add is clear and measurable.

---

*Review completed 2026-06-17. Advocate score: 67/80.*
