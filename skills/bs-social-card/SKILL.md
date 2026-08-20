---
name: bs-social-card
# tier: lightweight
description: Use when the user asks to produce and validate a single 1200x630 social media card, Open Graph image, Twitter card, link preview, or social share graphic. Do not use for full-page screenshots, multi-slide carousels, animated GIFs, video thumbnails, print-ready graphics, or a general-purpose visual identity system.
---

# Social Card

You are generating a social media card image. Follow the rules below in order. Do not skip steps.

## HARD RULES

1. **OUTPUT**: 1200×630 PNG. No exceptions.
2. **NO PLACEHOLDER TEXT**: If the user did not provide content, ask. Never use lorem ipsum or filler.
3. **CONTRAST**: Text must meet WCAG AA minimum (4.5:1 normal, 3:1 large). Default to black `#1A1A1A` on white `#FFFFFF`, or white on near-black `#0F172A`. Brand colors may be used for text **only** if they pass WCAG AA against the chosen background. If the user's brand color fails contrast, use it for decorative elements (accent bar, border, background pattern) and keep text in a compliant color.
4. **LAYOUT**: Pick the variant that best fits the content (Step 2). All three variants live as templates under `assets/` — never inline them into prompts or other files.

## Step 1: Extract content

From the user's request, identify:

- **Title / headline** (required): the primary text on the card.
- **Subtitle** (optional): secondary text, tagline, URL, or author attribution.
- **Brand color** (optional): a hex color for the accent bar and Avatar+Quote glyph. If not provided, default to `#1A1A1A`.
- **Logo / avatar** (optional): a URL or local path to a logo (Logo+Title) or author avatar (Avatar+Quote).

If the title is missing, ask: *"What should the card say as its main headline?"*

## Step 2: Choose a layout variant

Pick the variant whose template to render in Step 5:

| Variant | Use when | Structure | Template |
|---------|----------|-----------|----------|
| **Centered** (default) | Title only, or title + short subtitle. Clean, minimal. | Centered title, subtitle bottom-left, accent bar at top. | [`assets/centered.html`](./assets/centered.html) |
| **Logo + Title** | Brand card with company/product logo. | Logo top-left, title centered, subtitle bottom-left, accent bar at top. | [`assets/logo-title.html`](./assets/logo-title.html) |
| **Avatar + Quote** | Author quote, testimonial, personal brand. | Circular avatar above center, title rendered as a pull-quote, attribution (name + handle) below. | [`assets/avatar-quote.html`](./assets/avatar-quote.html) |

## Step 3: Escape user text

Before substituting user-provided text into the template, escape: `&` → `&amp;`, `<` → `&lt;`, `>` → `&gt;`, `"` → `&quot;`. Do this once, on the title and subtitle separately.

## Step 4: Choose font size

Font size depends on title length **and** character type. CJK, Arabic, and Devanagari characters render at roughly 2× the visual width of Latin characters — adjust accordingly.

| Title length (Latin) | Title length (CJK / Arabic / Devanagari) | `font-size` |
|----------------------|------------------------------------------|-------------|
| ≤ 60 chars | ≤ 30 chars | 72px |
| 61–100 chars | 31–50 chars | 56px |
| > 100 chars | > 50 chars | 44px |

For mixed-script titles, count each CJK / Arabic / Devanagari character as 2 Latin characters when computing length. RTL scripts (Arabic, Hebrew) require no template change at this size — the browser handles direction; verify by visual inspection in Step 7.

## Step 5: Build the HTML

1. **Read the template** that matches the variant chosen in Step 2 from `assets/`. Do **not** copy template HTML into your prompt — read the file directly.
2. **Substitute placeholders** with the values from Steps 1, 3, and 4:
   - `{{ESCAPED_TITLE}}` → escaped title from Step 3
   - `{{ESCAPED_SUBTITLE}}` → escaped subtitle from Step 3 (if any)
   - `{{ACCENT_COLOR}}` → brand color from Step 1 (or `#1A1A1A` default)
   - `{{FONT_SIZE}}` → numeric value from Step 4
   - `{{LOGO_SRC}}` (Logo+Title only) → logo URL or path
   - `{{AVATAR_SRC}}` (Avatar+Quote only) → avatar URL or path
3. **Strip optional blocks** that have no value. The templates use Mustache-style `{{#BLOCK}}…{{/BLOCK}}` markers — if `SUBTITLE`, `LOGO`, or `AVATAR` is absent, **delete the entire block** including the markers. Leaving placeholders in the rendered HTML is a verification failure.
4. **Write the substituted HTML** to `/tmp/bs-social-card.html` (macOS / Linux), `%TEMP%/bs-social-card.html` (Windows), or `<project-root>/.claude/tmp/bs-social-card.html` (fallback).

## Step 6: Screenshot

Use Playwright MCP if available:

```
1. mcp__playwright__browser_navigate({ url: "file:///tmp/bs-social-card.html" })
2. mcp__playwright__browser_resize({ width: 1200, height: 630 })
3. mcp__playwright__browser_wait_for({ time: 1 })
4. mcp__playwright__browser_take_screenshot({ type: "png", fullPage: true, filename: "<path>" })
```

If Playwright MCP is unavailable, fall back in this order:

1. **Playwright CLI**: `npx playwright screenshot --viewport-size=1200,630 "file:///tmp/bs-social-card.html" bs-social-card.png` (if no browser is installed yet, run `npx playwright install chromium` first — note this downloads ~100MB).
2. **Puppeteer script** (only if the project already has `puppeteer` installed): write a 10-line Node script that launches puppeteer, sets viewport 1200×630, navigates to the file URL, and calls `page.screenshot()`. Delete the script after use.
3. **Manual**: tell the user — *"Open `/tmp/bs-social-card.html` in a browser, take a screenshot at 1200×630, and save as PNG."*

## Step 7: Verify

Run these checks; fix and re-screenshot on any failure. Retry up to 3 times.

<HARD-GATE id="verified-before-delivery">
Never return a card that fails verification. If a check still fails after 3 attempts, report the failing check to the user and ask for guidance instead of delivering a broken card.
</HARD-GATE>

1. **Dimensions** (programmatic where possible): use Playwright `page.evaluate(() => ({w: document.body.offsetWidth, h: document.body.offsetHeight}))` to confirm 1200×630. Without Playwright, inspect the screenshot file's metadata.
2. **Text overflow** (programmatic): use Playwright
   ```
   page.evaluate(() => {
     const h1 = document.querySelector('h1, .quote');
     const rect = h1.getBoundingClientRect();
     return {
       fits: h1.scrollHeight <= h1.clientHeight * 1.05   // content taller than its box = clipped
          && h1.scrollWidth  <= h1.clientWidth * 1.05    // content wider than its box = clipped
          && rect.right <= 1200 && rect.bottom <= 630    // box itself stays inside the card
     };
   })
   ```
   If `fits` is false, drop one tier of font-size (Step 4 table) and regenerate.
3. **No placeholder leakage** (manual): scan the final HTML for any unsubstituted `{{TOKEN}}` or unstripped `{{#BLOCK}}…{{/BLOCK}}` markers. Every visible string must be the user's content.
4. **Layout-specific** (manual):
   - **Centered**: subtitle does not collide with the accent bar at the bottom.
   - **Logo+Title**: logo respects `max-height: 48px` and does not overlap the title.
   - **Avatar+Quote**: avatar is circular (border-radius applied), the curly-quote glyph is visible before the title, attribution sits clearly below the quote.

## Test prompts

Three prompts that exercise this skill end-to-end, mirrored in `evaluation/datasets/batch-1-test-prompts.json`.

1. **Happy path**: *"Generate an OG image for a blog post titled 'Why Postgres beats MongoDB for OLTP', author Marc Garrison, brand color `#1F6FEB`."* — expected: Centered or Logo+Title variant, blue accent bar, title fits at 72px or 56px.
2. **Edge — long CJK title**: *"我需要一张社交媒体卡片，主标题是'从零搭建一套面向 AI 智能体的可复用技能工具链：架构、模式与评估方法论'，副标题写作者名字 '李未然'。"* — expected: 56px or 44px font-size; CJK length × 2 rule applied; no clipping.
3. **Adversarial — testimonial with brand color failing contrast**: *"Make an avatar+quote card. Quote: 'This refactor cut latency in half.' Author: Priya Subramaniam, @prsubr. Brand color: `#FFD700` (yellow)."* — expected: brand yellow rejected for text (fails WCAG AA against white), used only for the accent bar and the curly-quote glyph; quote rendered in `#1A1A1A` for compliance.

## Handoff

After verification passes:
- Return the screenshot file path and a 1-line summary (variant chosen + font-size used).
- If the user wants variants (e.g., dark mode of the same content), iterate by re-running from Step 2.
- If the user wants animation or multi-frame output, hand off to `bs-ui-master` — this skill ends at a single 1200×630 PNG.
