<!-- Parent skill: skills/article-illustrate/SKILL.md -->
<!-- Open this file when: you reach Step 5 (Place Illustrations) or need the exact output format for Mermaid/SVG illustrations -->

# Output Format Reference

> **Parent skill**: [../SKILL.md](../SKILL.md) — referenced from Step 5: Place Illustrations and the Output Format section
>
> **Prerequisites**: Illustration plan confirmed (Step 1 gate), format chosen (Step 2), style spec locked (Step 3), illustrations generated (Step 4)
>
> **Depends on**: None — this is a formatting reference, not a procedure

## Overview

This file defines the exact output format for illustrated articles. Open it when placing illustrations in the article (Step 5) or when you need to verify that your output matches the expected format conventions. Follow these patterns exactly — inconsistent formatting undermines the professional quality of the illustrated article.

---

## Inline SVG (Preferred)

For conceptual illustrations, architecture diagrams, and comparison visuals:

```markdown
The authentication flow involves three parties: the user, the
application, and the identity provider.

<svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg">
  <style>
    /* Inline styles here */
  </style>
  <!-- SVG content -->
</svg>
*Figure 1: The OAuth 2.0 authorization code flow with PKCE.*
<!-- alt: A sequence diagram showing the user's browser redirecting to
     the identity provider, receiving an authorization code, and the
     application server exchanging that code for access and refresh
     tokens. The entire flow spans four steps and completes in under
     two seconds in the happy path. -->
```

### SVG Formatting Rules

1. **Alt text in HTML comment**: Use `<!-- alt: ... -->` directly after the figure caption. This keeps alt text machine-readable and invisible in rendered output while remaining accessible to screen-reader markup extraction.
2. **Figure caption**: One line, italic, prefixed with `*Figure N: ...*`. Describe what the reader should take from the visual, not what it depicts ("Authentication flow with PKCE" not "A diagram with three boxes").
3. **Leading prose**: The sentence or paragraph before the SVG introduces the concept. The SVG replaces what would otherwise be a lengthy prose description.
4. **viewBox required**: Always use `viewBox`, never fixed pixel dimensions. This ensures the SVG scales correctly on all screen sizes.

---

## Mermaid

For flowcharts, sequence diagrams, class diagrams, ER diagrams, Gantt charts, and state machines:

```markdown
The authentication flow involves three parties: the user, the
application, and the identity provider.

```mermaid
sequenceDiagram
    participant User
    participant App
    participant IdP
    User->>App: Login request
    App->>IdP: Redirect with PKCE challenge
    ...
```

*Figure 1: The OAuth 2.0 authorization code flow with PKCE.*
<!-- alt: A sequence diagram showing the user's browser redirecting to
     the identity provider, receiving an authorization code, and the
     application server exchanging that code for access and refresh
     tokens. -->
```

The identity provider validates the user's credentials...
```

### Mermaid Formatting Rules

1. **Mermaid block must be fenced**: Use ` ```mermaid ` with the language tag. This enables syntax highlighting and native rendering on GitHub, GitLab, and Notion.
2. **Alt text in HTML comment**: Same convention as SVG — `<!-- alt: ... -->` after the figure caption.
3. **Figure caption**: Same convention as SVG — `*Figure N: ...*`.
4. **Surrounding prose**: The Mermaid block is sandwiched between the introducing sentence and the continuation of the article. Do not leave orphaned Mermaid blocks without context.

---

## Placement Types

For each illustration, choose one of three placement strategies:

- **Inline**: Immediately after the paragraph that introduces the concept. This is the default.
- **Figure block**: Centered with a caption, for illustrations that deserve visual prominence.
- **Aside / Callout**: For supplementary illustrations that support but do not drive the main argument.

If the target platform requires a specific syntax for figures (e.g., Markdown image references, HTML `<figure>` tags, or shortcodes), use that syntax instead of the Markdown patterns above. The principles (alt text, descriptive captions, leading prose) remain the same regardless of syntax.

---

## Delivery

Deliver the complete illustrated article with illustrations inserted at their placement points. For each illustration, include:

1. The illustration itself (Mermaid code block, inline SVG, or screenshot reference)
2. A short caption (1 line) describing what the reader should take from the visual
3. Alt text (full description for accessibility)

After delivering the final illustrated article, **stop**. Do not chain into another skill or continue processing unless the user gives an explicit new instruction. The illustrated article is the complete deliverable.

---

## Related

- [SKILL.md Step 4: Generate Each Illustration](../SKILL.md) — generation procedure and per-illustration quality checks
- [SKILL.md Step 5: Place Illustrations](../SKILL.md) — placement strategy
- [SKILL.md Step 6: Final Consistency Pass](../SKILL.md) — post-placement review
- [SKILL.md Self-Review Checklist](../SKILL.md) — delivery-time verification
