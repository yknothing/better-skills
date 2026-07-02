# Adversarial Review: visual-design Skill

**Role**: Adversary (Gate 2 — Peer Review)
**Date**: 2026-06-17
**Reviewer**: code-reviewer agent acting as adversary
**Skill Version**: Current main branch

---

## Summary

The visual-design skill is the most architecturally ambitious skill in this repo — a 614-line, 10-phase, Deep-tier design pipeline with multiple HARD-GATEs, confidence anchors, an 80/20 rule, and a multi-perspective review panel. It is genuinely impressive in its scope. However, that very ambition creates a large attack surface. This review identifies 10 exploitable vulnerabilities, 3 of which are CRITICAL because they can be triggered without adversarial intent — they are failure modes the skill will encounter naturally in real usage.

---

## Vulnerability 1: Phase Skip via Brownfield Self-Classification

**Severity**: CRITICAL
**Exploits**: Phase 0.2, lines 52-59

### Exploit Scenario

A user says: "I have an existing design system — we use Tailwind with a custom config for colors and fonts. I just need a new settings page designed."

The agent enters brownfield mode (Phase 0.2). The rule states: "Skip phases that are already defined (if colors exist, skip 2.1-2.2; if type scale exists, skip 2.3)."

But what does "if colors exist" mean? The user might have 3 brand colors but no neutral scale, no semantic colors, no surface/background tokens. Skipping 2.1-2.2 entirely because "they have colors" means the design ships without a neutral gray scale, semantic colors, or surface tokens — all of which Phase 2.2 explicitly requires.

Similarly, "if type scale exists" — the user might have heading and body fonts but no defined scale ratio, no explicit px/rem values, no font loading strategy.

### Root Cause

The skip logic in brownfield mode operates at the phase level ("skip 2.1-2.2") but the phases define multiple sub-responsibilities. There is no sub-deliverable check — it is all-or-nothing per phase.

### Suggested Fix

Replace coarse phase-level skipping with deliverable-level checking:

```
Brownfield Mode — for each Phase 2 deliverable, check:
- Color: If ALL of (primary, secondary, neutral scale 5+ stops, semantic colors, surface) exist → skip. Otherwise → define only missing items.
- Typography: If ALL of (heading font, body font, monospace, scale with explicit px/rem, loading strategy) exist → skip. Otherwise → define only missing items.
- Spacing: If ALL of (base unit, spacing scale tokens, max-width, container padding) exist → skip. Otherwise → define only missing items.
```

---

## Vulnerability 2: Anti-Pattern Coverage Gaps — The "AI Startup Default" and Other Missing Named Patterns

**Severity**: HIGH
**Exploits**: HARD-GATE "ANTI-PATTERN DETECTION", lines 27-39

### Exploit Scenario

The skill bans 6 specific anti-patterns (7 if you count the dual-tone gradient hero separately). But a competent AI design agent following this skill exactly could still produce:

1. **The Startup Default**: White background + generic sans-serif (e.g., Plus Jakarta Sans or DM Sans) + blue CTA button (#2563EB or similar) + hero illustration of abstract geometric shapes. This is the most common AI design failure and it is NOT covered by any named ban.

2. **Dashboard Stat Cards**: Four stat cards at the top of a dashboard (Users, Revenue, Engagement, Growth) with icon + number + label. The "NO 3-COLUMN CARD LAYOUTS" ban only catches 3-column feature cards with icons on top — a 4-column stats grid at the top of a dashboard is a different (equally generic) pattern.

3. **Glassmorphism Overuse**: Frosted glass cards, blurred backgrounds, translucent overlays. None of the named bans cover this.

4. **SVG Blob Backgrounds**: Amoeba-shaped colorful blobs as hero section backgrounds. Not covered.

5. **Gradient Text**: Linear-gradient applied to heading text via background-clip. Not covered.

6. **The "Modern Minimal" Trap**: Black text on white, lots of whitespace, thin borders, small type. This looks like every SaaS landing page from 2023 and the skill has no defense against it.

### Root Cause

The anti-pattern list is biased toward the specific failures observed in the source material (Taste Skill, Open Design) but does not systematically cover common AI visual design failure modes. There are no bans for layout-level clichés beyond the 3-column card, no bans for color application clichés beyond purple/blue, no bans for visual effect clichés.

### Suggested Fix

Add the following named anti-patterns:

```
- THE STARTUP DEFAULT: White background + generic sans-serif + #2563EB or similar blue CTA + abstract geometric hero illustration. If all four are present simultaneously, restart the phase.
- DASHBOARD STAT QUARTET: Four identical stat cards (icon + big number + label) as the first content row of any dashboard. Use a different data presentation pattern.
- GLASSMORPHISM FATIGUE: Frosted-glass cards, backdrop-blur overlays, translucent containers. Use solid surfaces with intentional color instead.
- SVG BLOB BACKGROUNDS: Amorphous colorful blobs as decorative hero backgrounds. Replace with intentional imagery or typography-as-visual.
- GRADIENT TEXT: CSS background-clip gradient on heading text. This is a recognizable AI-generated design fingerprint. Use solid type color.
```

---

## Vulnerability 3: The 80/20 Rule Has No Falsifiability

**Severity**: HIGH
**Exploits**: Core Principle, lines 10-18; Phase 9.5, lines 489-490

### Exploit Scenario

The agent must produce "80% validated patterns + 20% distinctive." But what constitutes "distinctive"? The skill gives three examples:

- "One unexpected color application for the 20%"
- "One distinctive typographic moment (oversized number, all-caps label, monospace accent)"
- "One unique structural element"

An agent could:
- Change the border-radius on cards from 8px to 7px and claim that is "one unique structural element"
- Use a slightly different shade of the same hue and claim "one unexpected color application"
- Make one heading bold-italic and claim "one distinctive typographic moment"

The Soul Test at Phase 9.5 is supposed to catch this — "can someone identify the brand from a screenshot?" — but:

1. The agent judges itself. There is no external validator.
2. The agent is incentivized to say "yes" to complete the pipeline.
3. "Identify which brand or product" — if the user said "design a SaaS landing page for TaskFlow," the agent could argue "well, the screenshot shows a SaaS landing page, so yes, it's identifiable as TaskFlow's landing page." This is circular reasoning.

### Root Cause

The 80/20 rule is a conceptual framework with no operational definition. "Distinctive" is subjective and the agent is both the designer and the judge.

### Suggested Fix

Replace the subjective Soul Test with an objective checklist:

```
Phase 9.5 — Distinctiveness Audit (replaces Soul Test):
- [ ] The design uses at least one color NOT in the default palette of any major CSS framework (Tailwind, Bootstrap, Material). List the hex value.
- [ ] At least one layout element breaks symmetry intentionally (asymmetric placement, overlapping, unexpected scale contrast). Describe it.
- [ ] At least one typographic decision would be impossible to achieve by copying a Tailwind UI or shadcn/ui example. Describe it.
- [ ] The design would look WRONG if you swapped the primary color for #3B82F6 (Tailwind blue-500). If it would still look coherent, the color choice is not distinctive enough.
```

---

## Vulnerability 4: Token Budget Is Acknowledged but Not Solved

**Severity**: CRITICAL
**Exploits**: Execution Notes, lines 614-615; all phases

### Exploit Scenario

The skill's own Execution Notes admit: "A full invocation of this skill (design tokens + review synthesis + state tables + code/spec) can consume 10K-20K+ output tokens."

Consider the actual minimum token consumption:

| Phase | Minimum Tokens |
|-------|---------------|
| Phase 0: Audit question + brownfield/greenfield | ~200 |
| Phase 1: 7 sequential questions + scope synthesis | ~1500 |
| Phase 2: Colors (hex codes for 10+ colors), typography (font names + scale table), spacing (8+ tokens), dark mode (7+ rules), direction confirmation | ~3000 |
| Phase 3: Border radius scale (6), shadow scale (5), border widths (4), z-index (6), shape language, icon set | ~800 |
| Phase 4: Hierarchy, layout pattern, responsive strategy for each section | ~1200 |
| Phase 5: Imagery style, treatment tokens, data viz palette, icon refinement | ~1500 |
| Phase 6: 6 button states + 7 input states + 3 card states + 4 link states + 4 nav states + 4 screen-level states — described in CSS or prose | ~3000 |
| Phase 7: 5 easing tokens, 5 duration tokens, stagger rules, reduced motion rules, animation property restrictions | ~1500 |
| Phase 8: Contrast, focus, screen reader, motion safety, touch targets | ~1000 |
| Phase 9: 30+ checklist items with PASS/FAIL | ~1500 |
| Phase 10: 3 perspectives + review synthesis | ~1500 |
| **TOTAL (design spec only)** | **~17,700 tokens** |
| Plus actual code generation (HTML/CSS/React) | **+5000-15000 tokens** |
| **GRAND TOTAL** | **~22,700-32,700 tokens** |

The skill says: "If the user's context window is constrained, offer to split delivery across multiple messages: (1) direction + tokens, (2) layout + states, (3) code/spec."

Problems:
1. This is buried in Execution Notes at line 614 — after 613 lines of mandatory instructions. An agent mid-flow is unlikely to remember or act on this.
2. "If the user's context window is constrained" — the agent has no reliable way to detect this until it is too late (context overflow or truncation).
3. Multi-message delivery introduces state management across messages. There are no instructions for how to resume, what tokens to carry forward, or how to maintain coherence across splits.
4. Even if split into 3 messages, message 1 alone (direction + tokens, phases 0-3) is ~5,500 tokens. That is a massive first message.

### Root Cause

The skill was designed for completeness, not for token efficiency. Every phase adds legitimate value, but the cumulative cost exceeds what most LLM contexts can handle while also producing actual design output.

### Suggested Fix

Add a mandatory Phase 0.5: "Token Budget Planning"

```
Phase 0.5: Token Budget Assessment
Before Phase 1, estimate the token budget:
1. Ask: "Do you want a design SPEC (tokens + states + review) or CODE (full implementation)?"
2. If SPEC: budget ~15K output tokens across 2 messages.
3. If CODE: budget ~25K output tokens across 3 messages.
4. If the user's context window is unknown or <100K tokens: automatically use multi-message delivery with explicit checkpoint markers.
5. After each message, include a CHECKPOINT token block:
   ```
   <!-- CHECKPOINT: Phase N complete. Resume at Phase N+1.
        Locked decisions: [list with confidence scores]
        Next: [Phase N+1 description] -->
   ```
```

Also add a "Compact Mode" flag: "Reply 'compact' to skip prose explanations and receive only tokens, states, and code."

---

## Vulnerability 5: Confidence Anchor Gaming

**Severity**: MEDIUM
**Exploits**: Phase 2.1, lines 109-121

### Exploit Scenario

The confidence anchor system requires agents to assign 0, 25, 50, 75, or 100 to each design decision. The rule is: "If your confidence is below 50 on any Phase 2 decision, stop and ask the user."

An agent that wants to minimize user interruptions (which all agents do — it is faster) can simply assign 50 to every decision. The definition of 50 is: "Reasonable inference from context. State the decision, note it is revisable." This is permissive enough to justify almost any choice.

Specific exploit:
- Color primary: "Based on the 'professional' tone the user mentioned, I'll use a deep teal. Confidence: 50 — reasonable inference from context."
- Heading font: "For a professional SaaS product, Source Serif 4 adds editorial weight. Confidence: 50."
- Spacing base unit: "8px grid is industry standard for web. Confidence: 50."

Every decision gets 50. No user is asked anything. The pipeline proceeds unchecked.

### Root Cause

The confidence anchor system has no anti-gaming mechanism. It trusts the agent to be honest about uncertainty, but agents are optimized to complete tasks efficiently, and asking users questions is inefficient.

### Suggested Fix

Add a confidence distribution rule:

```
Confidence Distribution Check (Phase 2.6, before Direction Confirmation):
- If ALL Phase 2 decisions are at confidence 50: HARD STOP. At least one decision must be at 75+ (strong pattern match) or one must be at 25 (explicit uncertainty requiring user input). Uniform 50s indicate the agent is gaming the system.
- If any decision is at confidence 0 or 25: MUST ask the user before proceeding. These cannot be resolved by inference.
- If the user has not explicitly stated the primary color, heading font, or tone: these defaults cannot exceed confidence 50. Only user-stated preferences can be 75 or 100.
```

---

## Vulnerability 6: Composite Component and Gesture Blindness

**Severity**: HIGH
**Exploits**: Phase 6, lines 301-353

### Exploit Scenario

Phase 6 requires specific state counts: 6 for buttons, 7 for inputs, 3 for cards, 4 for links, 4 for navigation. But real UIs contain composite components that combine these primitives:

1. **Date Picker**: Combines input field (7 states) + calendar grid (each day is a button with 6 states) + month/year navigation (4 states each) + clear button (6 states). The skill provides no guidance on how state requirements compose.

2. **Dropdown Select**: Combines a button trigger (6 states) + an overlay/portal (open/closed) + option items (hover, selected, disabled). The "selected" state does not map to any primitive state list.

3. **Autocomplete/Search**: Combines input (7 states) + dropdown results (loading, empty, error, results) + each result item (hover, active). The interaction between input focus and dropdown visibility creates cross-component state.

4. **Drag and Drop**: No state definitions at all. Drag handle (default, hover, active), draggable item (idle, dragging, drag-over-valid, drag-over-invalid), drop zone (idle, drag-over, drop-accepted). Touch gestures (swipe, pinch, long-press) are completely absent.

5. **Toggle/Switch**: Not the same as a button. Has on/off states, not just hover/active/focus. The skill does not define toggle states.

6. **Tooltip**: Appears on hover, disappears on mouse-out. Has show/hide timing, positioning logic. Not covered.

### Root Cause

The state taxonomy is limited to 5 primitive element types. It does not account for composition, and it completely ignores mobile/touch interaction patterns.

### Suggested Fix

Add composite component state rules and gesture state definitions:

```
### 6.3 Composite Component States

When a component combines multiple primitives:
- Each primitive within the composite must satisfy its own state requirements independently.
- Cross-component states (e.g., input focused AND dropdown open) must be defined.
- The composite itself has states: collapsed/expanded, valid/invalid, idle/processing.

### 6.4 Gesture and Touch States

For touch interfaces, define:
- Swipe: idle, swipe-start, swiping (with threshold), swipe-complete, swipe-cancelled
- Long-press: idle, pressing (visual feedback after 300ms), activated
- Pinch-to-zoom: idle, pinching, bounds-reached
- Pull-to-refresh: idle, pulling, threshold-reached, refreshing, complete

### 6.5 Missing Primitives

- Toggle/Switch: off, off-hover, off-focus, on, on-hover, on-focus, disabled
- Tooltip: hidden, showing (after delay), visible, hiding
- Dropdown/Menu: closed, opening, open, closing, item-highlighted
```

---

## Vulnerability 7: Dark Mode Is Defined but Never Enforced After Phase 2.5

**Severity**: HIGH
**Exploits**: Phase 2.5, lines 151-163; all subsequent phases

### Exploit Scenario

Phase 2.5 defines dark mode rules in detail. But after Phase 2.5, the skill never references dark mode again. Specifically:

- **Phase 3 (Design Tokens)**: Shadow scale is defined in Phase 3.1, but Phase 2.5 line 159 says "Box shadows are near-invisible on dark backgrounds. Replace with border..." Phase 3.1 has no dark-mode shadow alternative. An agent could define `box-shadow` tokens that work on light mode but fail on dark mode.

- **Phase 4 (Layout)**: No dark mode layout considerations. Some layouts that work in light mode (thin borders, subtle separators) disappear in dark mode.

- **Phase 5 (Imagery)**: Image overlay tokens defined in Phase 5.2 are light-mode-only. An overlay that works on a light image may be invisible or too harsh on a dark-mode-rendered image. Data visualization chart palettes (Phase 5.3) are defined once — "6-8 distinguishable hues that work on both light and dark backgrounds" — but this is a single line with no enforcement mechanism.

- **Phase 6 (Interaction States)**: States like "disabled: reduced opacity (0.4-0.5)" behave differently on dark backgrounds. 0.4 opacity on a dark surface may be illegible while the same opacity on a light surface passes contrast checks.

- **Phase 7 (Motion)**: No dark mode motion considerations.

- **Phase 8 (Accessibility)**: Contrast requirements are stated once. If dark mode tokens change the colors, all contrast checks must be re-run. The skill does not require this.

- **Phase 9 (QA)**: The checklist items for consistency (9.1), typography (9.4), and imagery (9.6) do not mention dark mode validation. The Soul Test (9.5) does not ask whether the brand is recognizable in dark mode.

### Root Cause

Dark mode is treated as a Phase 2.5 concern rather than a cross-cutting concern. Once Phase 2.5 is "complete," subsequent phases do not reference it.

### Suggested Fix

Add a cross-cutting dark mode check to every phase after 2.5:

```
Each phase after 2.5 must include a dark mode subsection:

Phase 3.1 addition:
- Shadow scale for dark mode: Replace box-shadow tokens with border tokens for dark mode. Define both sets.

Phase 5.2 addition:
- Image overlay for dark mode: Reduce overlay opacity by 15-25% for dark mode (dark surfaces absorb less overlay).

Phase 6 addition:
- State opacity for dark mode: Disabled state opacity must be validated against dark surfaces. Minimum effective contrast: 3:1.

Phase 9 addition:
- [ ] Dark mode: All QA checks pass on dark mode independently.
- [ ] Dark mode: Brand colors remain recognizable (not washed out or oversaturated).
```

---

## Vulnerability 8: Phase Ordering Contradiction for Independent Phases

**Severity**: MEDIUM
**Exploits**: Phase 5 header, line 246; Phase 7 header, line 358

### Exploit Scenario

The skill states:
- Phase 5 header: "Phases 5-7 can be executed in any order; they are independent design dimensions."
- Phase 7 header: "Motion comes AFTER interaction states. You cannot animate what you have not defined."

These two statements conflict. If Phases 5-7 can be executed in any order, then Motion (Phase 7) could come before Interaction States (Phase 6). But Phase 7 explicitly says it must come after Phase 6.

An agent reading linearly sees the Phase 5 header first ("any order") and might reorder Phase 7 before Phase 6. Then it hits the Phase 7 header that says Motion must come after Interaction States. Does it restart? Does it skip the Motion phase? The behavior is undefined.

### Root Cause

The "independent phases" declaration at Phase 5 is too broad. Phase 6 and Phase 7 have a sequential dependency that the declaration contradicts.

### Suggested Fix

```
Phase 5 header: "Phases 5 and 6 can be executed in any order. Phase 7 (Motion) depends on Phase 6 (Interaction States) — you cannot animate what you have not defined. Phase 7 must follow Phase 6."
```

Or more precisely:

```
Phase dependency graph:
Phase 0 -> 1 -> 2 -> 3 -> 4 -> [5, 6] (parallel) -> 7 -> 8 -> 9 -> 10
Phases 5 and 6 are independent of each other and can be executed in any order.
Phase 7 depends on Phase 6. Phase 7 depends on Phase 5 (motion tokens may reference visual elements).
```

---

## Vulnerability 9: Brand Color vs. Accessibility Conflict Has No Resolution Protocol

**Severity**: CRITICAL
**Exploits**: Phase 8.1, lines 429-432; Phase 2.2, lines 123-134

### Exploit Scenario

A user says: "Our brand colors are bright yellow (#FFD700) and white. Design a landing page."

The agent enters Phase 2.2 and locks the primary color as #FFD700 (confidence 100 — user explicitly stated). But in Phase 8.1, WCAG AA requires 4.5:1 contrast for normal text. #FFD700 on white has a contrast ratio of approximately 1.8:1 — it fails catastrophically.

The skill has no protocol for this conflict. Possible agent behaviors:

1. **Silent violation**: The agent uses #FFD700 on white, ships a design that fails WCAG AA, and marks Phase 8.1 as PASS anyway.

2. **Silent override**: The agent darkens the yellow to meet contrast, violating the user's explicit brand color. The user receives a design that does not match their brand.

3. **Paralysis**: The agent detects the conflict, cannot resolve it, and loops or fails.

None of these outcomes are acceptable. The skill provides no guidance on:
- When to warn the user about a brand/accessibility conflict
- How to propose alternatives (e.g., "Use #FFD700 for decorative elements only, and a darker gold #B8860B for text")
- Whether accessibility requirements can override user-stated brand constraints
- How to adjust the 80/20 rule when brand colors are accessibility-hostile

### Root Cause

The skill treats brand colors (Phase 2) and accessibility (Phase 8) as independent concerns, resolved in sequence. But they are inherently coupled — color choices in Phase 2 determine whether Phase 8 can pass.

### Suggested Fix

Add a forward-check in Phase 2.2:

```
### 2.2 Color System — Accessibility Pre-check

Before locking any color:
1. Compute the contrast ratio of the primary color against white (#FFFFFF) and the lightest neutral background.
2. If contrast < 4.5:1 for normal text usage:
   - Warn the user: "Your brand color [hex] does not meet WCAG AA contrast against white backgrounds. It can still be used for: decorative elements, large headlines (24px+), dark backgrounds, and CTAs on dark surfaces. For body text and UI elements, I recommend a darker variant: [suggested hex]."
   - Define a "text-safe variant" of the brand color that meets contrast requirements.
   - The original brand color remains the PRIMARY token. The text-safe variant is a separate token: `--color-primary-text-safe`.
3. If the user rejects the text-safe variant: document that the design ships with known accessibility violations. Mark Phase 8.1 as FAIL with explanation.
```

---

## Vulnerability 10: Multi-Screen Degradation — Token Inheritance Without Pipeline

**Severity**: MEDIUM
**Exploits**: Phase 1.2, lines 102-103

### Exploit Scenario

Phase 1.2 says: "If scope spans more than 3 distinct screens or views, propose scoping to one representative screen first, then applying the established direction to the rest."

The "established direction" means the Phase 2 tokens (colors, typography, spacing). But the remaining screens skip:
- Phase 4 (Layout Architecture): Each screen needs its own layout pattern selection, hierarchy definition, and responsive strategy.
- Phase 5 (Imagery Direction): Different screens may need different imagery styles (a dashboard uses data-driven imagery, a landing page uses editorial photography).
- Phase 6 (Interaction States): Different screens have different interactive elements (a form has inputs, a dashboard has cards, a settings page has toggles).
- Phase 9 (Visual QA): Each screen needs independent QA.

If the agent applies only "the established direction" (Phase 2 tokens), screens 2-N receive only color/type/spacing and skip layout, imagery, states, and QA. This produces inconsistent results — screen 1 is fully designed, screens 2-N are under-designed.

### Root Cause

"Applying the established direction" is underspecified. It is unclear whether this means "apply Phase 2 tokens only" or "run the full pipeline with Phase 2 tokens pre-locked."

### Suggested Fix

Clarify the multi-screen workflow:

```
Multi-Screen Workflow:
1. Screen 1: Run FULL pipeline (Phase 0-10). Lock all Phase 2-3 decisions as design tokens.
2. Screens 2-N: For each subsequent screen:
   a. Skip Phase 0 (brownfield: existing tokens are now the system).
   b. Skip Phase 2-3 (tokens are locked from Screen 1).
   c. Run Phase 1 (context for this specific screen).
   d. Run Phase 4-9 (layout, imagery, states, motion, accessibility, QA) with locked tokens.
   e. Run Phase 10 (review panel) for each screen independently.
3. After all screens: Run a cross-screen consistency check:
   - [ ] Do all screens use the same token values?
   - [ ] Is the 20% distinctive element consistent across screens?
   - [ ] Does navigation between screens feel coherent?
```

---

## Additional Observations

### A. No Versioning or Change Protocol

The skill has no mechanism for iterative refinement. If the user says "I like it, but make the CTAs more prominent," what happens? Does the agent restart from Phase 2? Jump to Phase 6? There is no "change request" protocol. This is especially problematic for a Deep-tier skill where re-running the full pipeline for a minor change is token-prohibitive.

**Suggested Fix**: Add a "Design Iteration" section:

```
### Iteration Protocol

When the user requests changes to a delivered design:
1. Identify which phase(s) the change affects.
2. Re-run ONLY the affected phases and all downstream phases.
3. If the change affects Phase 2 decisions (color, type, spacing): re-run Phase 2 through Phase 10.
4. If the change affects Phase 4 decisions (layout only): re-run Phase 4 through Phase 10.
5. If the change is cosmetic (e.g., "make this button bigger"): re-run Phase 6 (states) and Phase 9 (QA) only.
6. After any iteration: re-run the Soul Test (Phase 9.5). Changes can erode distinctiveness.
```

### B. No "Quick Mode" Escape Hatch

Not every design request needs a 10-phase pipeline. If a user says "add a subtle hover effect to this existing button," the full pipeline is massive overkill. The skill provides no lightweight path.

**Suggested Fix**: Add a scope-based mode selector in Phase 1:

```
Phase 1.0: Scope Assessment
Based on the request, select a mode:
- FULL: New screen, new brand, or complete redesign. Run all 10 phases.
- EXTENSION: Adding to an existing design. Run Phase 0 (brownfield), skip to the relevant phase(s), run Phase 9-10.
- MICRO: Single component, single state, or single visual property change. Run Phase 9 (QA) only against existing tokens.
```

### C. The "Inter Font" Ban Has Loopholes

The NO INTER FONT ban says: "Inter is the default LLM font. Use literally any other well-designed typeface." But LLMs have learned this ban and now default to:
- Plus Jakarta Sans (the new Inter)
- DM Sans (the new new Inter)
- Space Grotesk (the "edgy" default)
- Satoshi (the "modern" default)

All of these are becoming equally recognizable as AI-generated type choices. The ban needs to evolve.

**Suggested Fix**: Instead of banning one font, require justification:

```
Font Selection Rule (replaces NO INTER FONT):
- You may NOT select a font unless you can articulate a specific reason it fits this brand. "It's clean and modern" is not a reason — that describes every sans-serif font.
- Required justification format: "[Font Name] was chosen because [specific brand attribute] — [concrete visual property of the font that expresses this attribute]."
- Example: "Newsreader was chosen because the brand emphasizes editorial authority — its high stroke contrast and distinctive serifs recall traditional print journalism."
```

---

## Severity Summary

| # | Vulnerability | Severity | Phase/Lines |
|---|-------------|----------|-------------|
| 1 | Phase Skip via Brownfield Self-Classification | CRITICAL | 0.2, 52-59 |
| 2 | Anti-Pattern Coverage Gaps | HIGH | Anti-pattern gate, 27-39 |
| 3 | 80/20 Rule Has No Falsifiability | HIGH | Core Principle, 10-18; 9.5, 489-490 |
| 4 | Token Budget Is Acknowledged but Not Solved | CRITICAL | Execution Notes, 614-615 |
| 5 | Confidence Anchor Gaming | MEDIUM | 2.1, 109-121 |
| 6 | Composite Component and Gesture Blindness | HIGH | 6, 301-353 |
| 7 | Dark Mode Is Defined but Never Enforced After Phase 2.5 | HIGH | 2.5, 151-163 |
| 8 | Phase Ordering Contradiction for Independent Phases | MEDIUM | 5 header, 246; 7 header, 358 |
| 9 | Brand Color vs. Accessibility Conflict | CRITICAL | 8.1, 429-432; 2.2, 123-134 |
| 10 | Multi-Screen Degradation | MEDIUM | 1.2, 102-103 |

---

## Final Assessment

**Overall Rating**: REQUIRES_CHANGES

The visual-design skill is architecturally sound and impressively thorough. Its pattern library integration is excellent — it correctly applies Confidence Anchors, HARD-GATEs, Multi-Perspective Review, Scoping Synthesis, Anti-Pattern Naming, 80/20 Design, and the Soul Test from the pattern library.

However, the three CRITICAL vulnerabilities (Brownfield Skip Logic, Token Budget Reality, Brand/Contrast Conflict) are not edge cases — they are failure modes that will be encountered in normal, non-adversarial usage. Any one of them can cause the skill to produce incorrect, incomplete, or inaccessible output.

The four HIGH vulnerabilities (Anti-Pattern Coverage, 80/20 Falsifiability, Composite Components, Dark Mode Enforcement) represent systematic gaps that will produce AI-generic or inconsistent results even when the skill is followed correctly.

The three MEDIUM vulnerabilities (Confidence Gaming, Phase Ordering, Multi-Screen Degradation) are quality-of-life issues that reduce the skill's reliability but do not cause catastrophic failures.

**Recommended action**: Fix the three CRITICAL vulnerabilities before using this skill in production. Fix the HIGH vulnerabilities before the Batch 1 release. Address the MEDIUM vulnerabilities in Batch 2.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
