# Adversary Review: bs-social-card

**Date**: 2026-06-17
**Reviewer Role**: Adversary
**Skill**: bs-social-card
**HUMAN_VERIFIED**: false

## Summary

This compatibility header normalizes review metadata after the repository-wide `bs-` namespace migration. The substantive review below is preserved unchanged.

**Migration finding**: namespace metadata normalized [LOW]
**Schema migration status**: PASS

## Original Review

# Adversarial Review: bs-social-card SKILL.md

**Reviewer:** Adversary (Gate 2 — Peer Review)
**Date:** 2026-06-17
**Conclusion:** REQUIRES_CHANGES — 5 CRITICAL, 5 HIGH, 2 MEDIUM severity issues found.

---

## Attack Vector 1: HTML Template Limitations

### VULNERABILITY 1A: Single Layout Archetype — Cannot Express Common Social Card Designs

**Severity:** CRITICAL
**Exploited Section:** Step 4 (lines 39-51) — the HTML template

**Exploit Scenario:**
A user says "Generate an OG image for my SaaS blog post. I want my company logo top-left, the title centered, and the author avatar + name at the bottom-right." The template supports exactly one layout: centered title + bottom-left subtitle. Every element beyond that — logo placement, avatar, multi-element footers — requires the agent to improvise CSS outside the template. Since the skill provides no layout variants, no grid system, no slot system, the agent must either refuse or hand-write unguided CSS, which will produce inconsistent results across invocations.

**Specific missing layouts that real social cards need:**
- Logo + title (standard SaaS blog card)
- Title + author avatar + name + date (personal blog card)
- Title + category badge + subtitle (news site card)
- Background image + overlay + title (hero-style card)
- Title + 2-column metadata (conference talk card)

**Why it breaks:** The skill positions itself as a general-purpose social card generator but only supports one layout. Every deviation from that layout is unguided improvisation. For a "social card" skill, this is a fundamental scope mismatch — the skill claims to handle "social media card image, OG image, Twitter card, link preview, or social share graphic" but delivers only one specific visual archetype.

**Suggested Fix:** Replace the single hardcoded template with a layout catalog:
```yaml
Layouts:
  centered:        # Current template — title center + subtitle bottom-left
  centered-footer: # Title center + footer bar with logo/avatar/date
  split:           # Left: title + subtitle, Right: visual/brand element
  hero:            # Background image/gradient + overlay + title
  minimal:         # Large title only, no subtitle zone
```
Each layout gets a named template block in Step 4. The agent picks based on user-provided content elements (logo? avatar? date? background?). If the user doesn't specify, default to `centered`.

---

### VULNERABILITY 1B: No Gradient or Background Image Support

**Severity:** HIGH
**Exploited Section:** Hard Rule 3 (line 12) + Step 4 template (line 43)

**Exploit Scenario:**
A user says "Make a social card for our product launch — our brand uses a dark navy-to-purple gradient background." Hard Rule 3 says "Black (#1A1A1A) text on white (#FFFFFF) background, or white on black." Combined with the template's `background:#FFFFFF`, there is no mechanism for gradients, background images, or even subtle background patterns. The user's brand identity is erased.

**Why it breaks:** Hard Rule 3 conflates "ensure text is readable" (the real goal) with "use only these two backgrounds" (an over-constrained implementation). The rule should enforce contrast ratios, not ban backgrounds. A navy-to-purple gradient with white text can easily pass WCAG AA.

**Suggested Fix:** Rewrite Hard Rule 3:
```
3. CONTRAST: All body text must achieve ≥7:1 contrast ratio against its immediate background (WCAG AAA).
   If using a background image or gradient, add a semi-transparent overlay to ensure text contrast.
   Brand accent colors are for decoration only, never body text.
```
And in the template, replace `background:#FFFFFF` with `background: var(--card-bg, #FFFFFF)` to allow substitution.

---

### VULNERABILITY 1C: No Multi-Element Footer

**Severity:** HIGH
**Exploited Section:** Step 4 template (line 45)

**Exploit Scenario:**
A user says "Add my blog URL, publication date, and reading time to the card." The template has exactly one slot for secondary text: `.subtitle` positioned `bottom:60px; left:100px`. To add a date and reading time, the agent must:
1. Concatenate all three into the subtitle string (e.g., "example.com · June 2026 · 8 min read")
2. Or improvise additional CSS classes outside the template

Option 1 looks amateurish. Option 2 is unguided and inconsistent across invocations.

**Suggested Fix:** Add a footer bar component:
```html
<div class="footer">
  <span class="footer-item">{{URL}}</span>
  <span class="footer-sep">·</span>
  <span class="footer-item">{{DATE}}</span>
  <span class="footer-sep">·</span>
  <span class="footer-item">{{READING_TIME}}</span>
</div>
```
With CSS that positions it at the bottom and handles optional items (hide separators when adjacent item is missing).

---

## Attack Vector 2: Font Size Edge Cases

### VULNERABILITY 2A: CJK Character Width — 3-Tier System Assumes Latin Text

**Severity:** CRITICAL
**Exploited Section:** Step 3 (lines 29-33) — the font-size table

**Exploit Scenario:**
A user requests a card with a Chinese title: "深度解析2026年人工智能在医疗领域的突破性应用与未来发展趋势研究" — 31 characters. Step 3 says: `<= 80 chars → 72px`. But CJK characters are roughly 2x the width of Latin characters. 31 CJK chars at 72px = approximately 2,232 CSS pixels of text width. The template's `max-width: 900px` on the `<h1>` with `word-wrap: break-word` means the text wraps to 3 lines, filling the card with wall-to-wall text that looks terrible.

**Deeper exploit:** A title mixing CJK and Latin: "AI革命: How Transformers Changed NLP Forever in 2026" — 53 characters. The character-count heuristic gives 72px. But the CJK portion (4 characters) behaves like 8 Latin characters in width, making the actual rendered width unpredictable. The agent has no mechanism to compute rendered width, only character count.

**Why it breaks:** Character count is a proxy for rendered width, but it's only a valid proxy for monospace or proportional Latin text. For CJK, Arabic, Devanagari, or emoji-rich text, character count and rendered width diverge dramatically. The skill has no programmatic width measurement, so the agent will produce cards with text overflow or wasted space and only discover it in Step 6's visual inspection.

**Suggested Fix:** Replace the character-count table with a content-aware sizing algorithm:
```
Step 3: Choose Font Size

1. Estimate rendered width:
   - Latin chars (a-zA-Z0-9, spaces, common punctuation): 0.5 units each
   - CJK chars (CJK Unified Ideographs, Hangul, Kana): 1.0 units each
   - Emoji: 1.0 units each
   - Total width units = sum of all character widths

2. Select font size:
   | Total width units | font-size |
   |-------------------|-----------|
   | <= 40 units       | 72px      |
   | 41-60 units       | 56px      |
   | 61-80 units       | 44px      |
   | > 80 units        | 36px      |

3. For mixed-script titles, add a "check rendered width" substep:
   After screenshot, measure the actual h1 bounding box. If wider than 1000px,
   reduce font-size one tier and re-screenshot.
```

---

### VULNERABILITY 2B: Very Short Titles Produce Comic-Sized Text

**Severity:** MEDIUM
**Exploited Section:** Step 3 (lines 29-33) — the font-size table

**Exploit Scenario:**
A user says "The title is just 'Hello.'" — 5 characters. Step 3 says: `<= 80 chars → 72px`. Five characters at 72px renders as roughly 200px wide on a 1200px card. The result: a tiny word floating in a vast empty space. It looks like a design error, not a social card.

**Why it breaks:** The font-size table only has a ceiling (shrink when text is long). It has no floor (grow when text is short). Short titles need LARGER font sizes to fill the card, not the default.

**Suggested Fix:** Add a short-title rule:
```
Short title adjustment:
  | Title length | font-size |
  |-------------|-----------|
  | <= 20 chars  | 96px      |  # Large, bold, fills the card
  | 21-40 chars  | 84px      |
  | 41-80 chars  | 72px      |
  | 81-120 chars | 56px      |
  | > 120 chars  | 44px      |
```
And adjust `max-width` proportionally so short titles don't overflow.

---

### VULNERABILITY 2C: Emoji in Titles — Unpredictable Rendering Width

**Severity:** MEDIUM
**Exploited Section:** Step 2 (line 25) + Step 3 (lines 29-33)

**Exploit Scenario:**
A user says "Title: '🚀 We Launched! 🎉 Here's What's New in v2.0'" — 43 characters. Step 3: 72px. But emoji rendering width varies by OS (Apple renders emoji wider than Windows), font (system-ui picks different emoji fonts), and emoji version. On macOS, the rocket and party emoji at 72px are roughly 72px wide each — consuming 144px of the 1000px usable width for two characters. The character-count heuristic breaks completely.

**Why it breaks:** Emoji are not "characters" in the width sense. They're inline images with platform-dependent rendering. The skill doesn't even mention emoji handling.

**Suggested Fix:** Add an emoji width estimation rule:
```
Emoji in titles: Count each emoji as 1.0 width unit (equivalent to ~1 CJK char).
For titles with >3 emoji, consider reducing font-size by one tier preemptively.
```
And in Step 6, add: "If emoji are present, verify they render fully (no tofu/blank glyphs) on the screenshot."

---

## Attack Vector 3: Contrast Constraint Rigidity

### VULNERABILITY 3A: Brand Identity Erasure — Two-Color Dictatorship

**Severity:** CRITICAL
**Exploited Section:** Hard Rule 3 (line 12)

**Exploit Scenario:**
A company's brand is #FF6B35 (vibrant orange) on a dark charcoal background. Their social media presence, website, and all marketing materials use this color scheme. The skill forces them to choose black-on-white or white-on-black — abandoning their brand identity entirely. The generated card will look alien next to their other social media posts.

**Deeper scenario:** A company says "Our cards use a warm cream (#FFF8F0) background with dark brown (#2C1810) text — it's our signature look." WCAG AAA contrast between these two colors is approximately 14.5:1 — well above the 7:1 threshold. But the rule bans it because it's not pure white or pure black.

**Why it breaks:** Hard Rule 3 solves for maximum contrast (>17:1) when the actual requirement is sufficient contrast (>=7:1 for AAA, >=4.5:1 for AA). By over-constraining to exactly two color combinations, it prevents entirely valid, brand-consistent designs. The rule prioritizes theoretical contrast over real-world usability.

**Suggested Fix:** Replace the hardcoded color rule with a contrast calculation step:
```
3. CONTRAST: Compute the contrast ratio between the proposed text color and background color
   using the WCAG formula (https://www.w3.org/TR/WCAG21/#contrast-minimum).
   - Ratio >= 7:1 (WCAG AAA): Approved as-is.
   - Ratio >= 4.5:1 and < 7:1 (WCAG AA): Approved with a note that large text (>=24px) passes AAA.
   - Ratio < 4.5:1: Reject. Ask the user for lighter/darker alternatives.

   If the user specifies brand colors, use them. If no colors are specified, default to
   #1A1A1A on #FFFFFF (21:1 contrast).
```

---

### VULNERABILITY 3B: No Dark Mode / Light Mode Dual Output

**Severity:** HIGH
**Exploited Section:** Hard Rule 3 (line 12) — implicit single-theme assumption

**Exploit Scenario:**
A user says "I need both a light and dark version — our site auto-switches based on the user's system preference, and the OG image should match." The skill can only produce one card per invocation. The user must run it twice, manually inverting the colors, and the two cards may have slight layout differences due to independent agent runs.

**Why it breaks:** Modern websites use `prefers-color-scheme` media queries and serve different OG images. A social card skill should handle this natively.

**Suggested Fix:** Add a step after Step 1:
```
If the user's site supports dark mode, ask: "Generate both light and dark variants?"
If yes, produce two HTML files (social-card-light.html, social-card-dark.html)
and screenshot both.
```

---

## Attack Vector 4: Playwright Dependency — Single Point of Failure

### VULNERABILITY 4A: No Fallback Rendering Method

**Severity:** CRITICAL
**Exploited Section:** Step 5 (lines 57-66)

**Exploit Scenario:**
A user runs the skill in an environment without Playwright MCP installed. The skill says: "Install Playwright MCP: npx @anthropic-ai/mcp-server-playwright" — and stops. The user is now blocked. They must install a tool, configure it, restart their session, and re-run the skill. Many users will abandon at this point.

**Why this is critical:** The skill positions Playwright as the ONLY rendering path. But there are multiple ways to render HTML to PNG:
1. **html2canvas** — Inject a `<script>` tag into the HTML that loads html2canvas from CDN and auto-downloads the rendered PNG. Works entirely in the browser without any MCP server.
2. **Node.js + Puppeteer** — A one-liner shell command: `npx puppeteer screenshot bs-social-card.html bs-social-card.png`
3. **sharp + node-canvas** — Pure Node.js rendering without a browser.
4. **Python + Pillow + imgkit** — Alternative ecosystem entirely.
5. **ImageMagick** — `convert bs-social-card.html bs-social-card.png` (with a headless browser backend).

The skill should at least mention alternatives and attempt the simplest one (html2canvas via script injection) before failing.

**Suggested Fix:** Add a fallback ladder in Step 5:
```
Screenshot methods, attempted in order:

1. Playwright MCP (preferred — highest fidelity):
   mcp__playwright__browser_navigate({ url: "file:///tmp/bs-social-card.html" })
   ...

2. html2canvas (no MCP required — inject into HTML):
   Add this script before </body>:
   <script src="https://html2canvas.hertzen.com/dist/html2canvas.min.js"></script>
   <script>
   html2canvas(document.body, {width:1200,height:630,scale:2}).then(canvas => {
     canvas.toBlob(blob => {
       const a = document.createElement('a');
       a.href = URL.createObjectURL(blob);
       a.download = 'bs-social-card.png';
       a.click();
     });
   });
   </script>
   Then use mcp__playwright__browser_navigate to trigger the download, or instruct the user
   to open the HTML file in a browser.

3. Puppeteer CLI fallback:
   npx puppeteer screenshot /tmp/bs-social-card.html bs-social-card.png --viewport 1200x630

4. If none available: Tell the user how to open the HTML file manually and screenshot
   (Cmd+Shift+4 on macOS, Win+Shift+S on Windows, selecting the 1200x630 region).
```

---

### VULNERABILITY 4B: File Path Portability

**Severity:** HIGH
**Exploited Section:** Step 4 (line 37) — file path logic

**Exploit Scenario:**
The skill says to write to `/tmp/bs-social-card.html` on macOS/Linux or `%TEMP%/bs-social-card.html` on Windows. But when using Playwright MCP, the `browser_navigate` call uses `file:///tmp/bs-social-card.html`. On Windows, this would be `file:///C:/Users/.../AppData/Local/Temp/bs-social-card.html` — but the skill doesn't show the Windows file:// URL format. Additionally, if the agent is running in a sandbox or container, `/tmp` might not be accessible to the Playwright browser process.

**Suggested Fix:** After writing the HTML file, resolve the absolute path and construct the correct `file://` URL:
```
After writing the HTML, run: `realpath /tmp/bs-social-card.html` (or equivalent)
to get the absolute path. Construct the file URL as `file://<absolute-path>`.
On Windows, forward slashes work: file:///C:/Users/.../Temp/bs-social-card.html
```

---

## Attack Vector 5: Verification Gaps

### VULNERABILITY 5A: Visual Inspection Is Not Programmatic Verification

**Severity:** CRITICAL
**Exploited Section:** Step 6 (lines 70-73)

**Exploit Scenario:**
The skill says "If any text overflows... reduce font-size one tier." But the detection mechanism is "visually inspect the screenshot." The agent (an LLM) is asked to look at a 1200x630 PNG and determine if text is clipped. LLMs are TERRIBLE at this. Subtle clipping — the last 2 pixels of a descender on the last line, or a single character that wraps to an invisible overflow line — will be missed. The agent will declare "text is visible" and ship a broken card.

**Deeper exploit:** What about rendering artifacts? A 1px horizontal line from a subpixel rendering bug? Font anti-aliasing issues at certain sizes? The visual inspection step has zero precision.

**Why it breaks:** Visual inspection by an LLM is not verification. It's guesswork. The skill needs programmatic checks — measure the actual rendered element dimensions, compare to container dimensions, and fail mechanically.

**Suggested Fix:** Replace visual inspection with JavaScript-based measurements:
```
Step 6: Verify (Programmatic)

Add this verification script to the HTML before screenshot:

<script>
const results = {};
const h1 = document.querySelector('h1');
const subtitle = document.querySelector('.subtitle');

// Check 1: Dimensions (known from the viewport, but verify)
results.dimensions = { width: window.innerWidth, height: window.innerHeight };

// Check 2: Text overflow
const h1Rect = h1.getBoundingClientRect();
results.h1 = {
  width: h1Rect.width,
  height: h1Rect.height,
  visible: h1Rect.width <= 1000 && h1.scrollWidth <= h1.clientWidth,
  clipped: h1.scrollWidth > h1.clientWidth
};

if (subtitle) {
  const subRect = subtitle.getBoundingClientRect();
  results.subtitle = {
    visible: subRect.top + subRect.height <= 630 && subRect.left + subRect.width <= 1200
  };
}

// Check 3: No template tokens remain
results.noPlaceholders = !document.body.innerText.includes('{{');

// Output results as a visible overlay for the agent to read from the screenshot
const report = document.createElement('div');
report.id = 'verify-report';
report.style.cssText = 'position:fixed;top:0;left:0;background:#000;color:#0f0;padding:10px;font:12px monospace;z-index:9999;opacity:0.9';
report.textContent = JSON.stringify(results, null, 2);
document.body.appendChild(report);
</script>
```
The agent reads the green-on-black overlay text from the screenshot, not guesses from visual appearance.
```

---

### VULNERABILITY 5B: No Image File Size Check

**Severity:** HIGH
**Exploited Section:** Step 6 (lines 70-73)

**Exploit Scenario:**
The skill generates a 1200x630 PNG. A clean text-only card should be ~50-100KB. But if the PNG encoder produces a 2MB file (unlikely but possible with certain metadata), Twitter/Facebook will reject it or compress it aggressively. The skill never checks file size. The user discovers the problem when their link preview shows a blurry mess.

**Suggested Fix:** Add to Step 6 verification checklist:
```
- [ ] **File size**: The PNG should be under 300KB. If larger, re-export with compression
  or check for unnecessary metadata. Run: `ls -lh <output-path>` or `file <output-path>`.
```

---

### VULNERABILITY 5C: No og:image Integration Guidance

**Severity:** MEDIUM
**Exploited Section:** Step 5 (lines 57-66) — no mention of what happens after screenshot

**Exploit Scenario:**
The skill generates a beautiful card and saves it to disk. The user then asks "How do I actually use this?" The skill provides no guidance on:
- Where to host the image (CDN, static site, S3 bucket)
- How to add the `<meta property="og:image">` tag
- What `twitter:card` value to use (`summary_large_image`)
- Image path conventions (`/public/og-images/post-slug.png`)

The user is left with a PNG file and no integration path. This is a "last mile" failure — the skill solves the generation problem but not the usage problem.

**Suggested Fix:** Add Step 7: Integration:
```
## Step 7: Integration

Add these meta tags to the page <head>:

<meta property="og:image" content="https://YOUR_DOMAIN/PATH_TO_IMAGE.png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:image" content="https://YOUR_DOMAIN/PATH_TO_IMAGE.png" />

Recommended: Save the image to /public/og-images/<slug>.png and reference it absolutely.
Test with: https://www.opengraph.xyz/ or https://cards-dev.twitter.com/validator
```

---

## Attack Vector 6: No Design Customization

### VULNERABILITY 6A: Hardcoded Everything — Zero Customization Path

**Severity:** HIGH
**Exploited Section:** Step 4 template (lines 39-51) — the entire HTML block

**Exploit Scenario:**
A user says:
- "Can you center the subtitle?" → No mechanism.
- "I want a colored accent bar at the top." → No mechanism.
- "Use Inter font instead of system-ui." → No mechanism (Google Fonts not loaded).
- "Right-align the title." → No mechanism.
- "Add rounded corners to the screenshot." → No mechanism (screenshot captures rectangular viewport).

Every single design customization request requires the agent to rewrite the template. The skill provides no CSS custom properties, no design tokens, no variant system, no slot system — just one monolithic template block.

**Why it breaks:** The skill is not composable. It treats the template as sacred when it should treat it as a configurable starting point.

**Suggested Fix:** Convert the template to use CSS custom properties:
```html
<style>
:root {
  --bg: #FFFFFF;
  --text: #1A1A1A;
  --subtitle-color: #6B7280;
  --font-family: system-ui, sans-serif;
  --title-align: center;
  --subtitle-align: left;
  --accent-bar-color: transparent;
  --accent-bar-height: 0px;
  --padding-x: 100px;
  --padding-y: 80px;
  --title-max-width: 900px;
}
body {
  /* ... use var() references for all the above ... */
}
/* Optional accent bar */
body::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: var(--accent-bar-height);
  background: var(--accent-bar-color);
}
</style>
```
Then in Step 4, the agent sets custom properties based on user requests. If the user says "orange accent bar," set `--accent-bar-color: #FF6B35; --accent-bar-height: 8px;`. If they say "Inter font," add a Google Fonts `@import` and set `--font-family: 'Inter', sans-serif;`.

---

### VULNERABILITY 6B: No Rounded Corners in Output

**Severity:** LOW (cosmetic) but common user expectation
**Exploited Section:** Step 5 (line 63) — `browser_take_screenshot`

**Exploit Scenario:**
Modern social cards often have rounded corners (matching the platform's own card UI). The user says "Give it rounded corners like Twitter cards." The skill uses `browser_take_screenshot` which captures a rectangular viewport. Rounded corners applied via CSS `border-radius` on the body would be anti-aliased against the white page background, but the screenshot includes the full 1200x630 rectangle. The corners look soft-white, not transparent.

**Suggested Fix:** If rounded corners are requested, add a note:
```
Note: browser_take_screenshot captures rectangular viewports. For transparent rounded corners,
post-process with ImageMagick:
`convert bs-social-card.png -alpha set -virtual-pixel transparent \
  -channel A -blur 0x2 -level 50%,100% +channel \
  \( +clone -alpha extract -draw "roundrectangle 0,0 1199,629 24,24" \) \
  -compose copyopacity -composite social-card-rounded.png`
Or use a CSS `border-radius` on the body + capture with transparent background (requires
browser_navigate with a page that has transparent viewport — not always supported).
```

---

## Attack Vector 7: Single Card Only

### VULNERABILITY 7A: No Batch Generation

**Severity:** HIGH
**Exploited Section:** Entire skill — assumes one card per invocation

**Exploit Scenario:**
A user says "I just wrote 5 blog posts. Generate OG images for all of them." The skill is structured as a single linear pipeline: extract content for ONE card, build ONE HTML file, take ONE screenshot. The user must invoke the skill 5 separate times, repeating all the context-setting for each. Worse: if the user wants a consistent visual style across all 5 cards, the agent has no mechanism to reuse the template — each invocation starts fresh.

**Why it breaks:** Real social card workflows are batch-oriented. A blog with 100 posts needs 100 OG images, all with the same template but different titles. The skill's single-card architecture makes this impractical.

**Suggested Fix:** Add a batch mode:
```
## Batch Mode

If the user provides multiple titles (list, CSV, or "generate cards for all posts in X"):

1. Confirm the template (design once, apply to all).
2. For each title:
   a. Run Steps 1-4 to build the HTML.
   b. Screenshot.
   c. Save as <slug>.png.
3. Report: "Generated N cards. All saved to <directory>."

If >10 cards requested, ask the user to confirm before proceeding (rate limiting, cost awareness).
```

---

## Attack Vector 8: Text Overflow Detection Is Not Programmatic

### VULNERABILITY 8A: LLM Visual Inspection Is Unreliable

**Severity:** CRITICAL
**Exploited Section:** Step 6 (lines 71) — "visually inspect the screenshot"

**Exploit Scenario:**
A title is 118 characters of Latin text at 56px. It renders to exactly 1002px wide (2px overflow into the 100px right padding). The text is technically clipped — the last 2px of the last character is invisible. An LLM looking at a 1200x630 screenshot will never notice 2 missing pixels. It declares "text is visible" and the card ships with a barely-clipped title.

**More common scenario:** Text that wraps to a 3rd line but the line-height makes the 3rd line overflow the 630px height. The bottom half of the last line is visible, the top half is clipped. An LLM sees "three lines of text, all readable" and passes verification. The card has half-visible text.

**Why it breaks:** LLMs are not OCR engines and not layout engines. They cannot compute pixel-precise bounding boxes from a raster image. Asking an LLM to "visually inspect" layout correctness is asking it to perform a task it fundamentally cannot do reliably.

**Suggested Fix:** As detailed in VULNERABILITY 5A — inject a JavaScript measurement script into the HTML that computes exact bounding boxes and renders a machine-readable verification report. The agent reads the report text, not the visual appearance.

---

## Summary of All Findings

| # | Severity | Attack Vector | Section | Impact |
|---|----------|---------------|---------|--------|
| 1A | CRITICAL | Single layout archetype | Step 4 | Cannot produce common social card designs |
| 1B | HIGH | No gradient/background image support | Hard Rule 3 | Brand identity erasure |
| 1C | HIGH | No multi-element footer | Step 4 | Cannot show date/author/URL simultaneously |
| 2A | CRITICAL | CJK character width miscalculation | Step 3 | Broken rendering for non-Latin text |
| 2B | MEDIUM | Very short titles look comically small | Step 3 | Poor visual quality for short titles |
| 2C | MEDIUM | Emoji rendering width unpredictable | Step 2, 3 | Layout breaks with emoji-heavy titles |
| 3A | CRITICAL | Two-color dictatorship | Hard Rule 3 | Forces abandonment of brand identity |
| 3B | HIGH | No dark/light mode dual output | Hard Rule 3 | Doesn't support modern web patterns |
| 4A | CRITICAL | No fallback rendering method | Step 5 | Complete failure without Playwright MCP |
| 4B | HIGH | File path portability gaps | Step 4 | Windows/sandbox path resolution issues |
| 5A | CRITICAL | Visual inspection is not verification | Step 6 | Overflow undetected, broken cards shipped |
| 5B | HIGH | No file size check | Step 6 | Oversized PNGs rejected by platforms |
| 5C | MEDIUM | No og:image integration guidance | Post-Step 5 | User doesn't know how to use the output |
| 6A | HIGH | Zero design customization | Step 4 | Cannot fulfill basic design requests |
| 6B | LOW | No rounded corners support | Step 5 | Cosmetic limitation |
| 7A | HIGH | No batch generation | Entire skill | Impractical for multi-card workflows |
| 8A | CRITICAL | LLM visual inspection unreliable | Step 6 | Fundamentally flawed verification |

**Total: 5 CRITICAL, 5 HIGH, 2 MEDIUM**

---

## Recommended Priority Fixes

If only 3 things can be fixed before launch:

1. **VULNERABILITY 5A/8A (CRITICAL):** Replace visual inspection with JavaScript-based programmatic verification. This is the most fundamental flaw — the skill cannot reliably detect its own failures.

2. **VULNERABILITY 4A (CRITICAL):** Add html2canvas fallback. The single Playwright dependency means the skill is dead on arrival in many environments.

3. **VULNERABILITY 1A (CRITICAL):** Add at least 2 more layout variants (logo+title, author+date). The skill cannot be called a "social card generator" with one layout.
