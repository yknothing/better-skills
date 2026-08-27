# Rendering & Validation — the evidence layer

A diagram that has not been rendered is a claim, not a deliverable. This module defines how to turn diagram source into render evidence, and what to report when rendering is impossible.

Verification is per-backend — what "verified" means depends on the projection: Mermaid and PlantUML recipes are below; the **plain-text backend** verifies by the alignment check in [Text Diagrams](./text-diagrams.md) (the block is its own render); the **SVG backend** requires the triple check (visual + ledger-sync + layout rubric) in [SVG Presentation](./svg-presentation.md) and has no meaningful `SYNTAX_VERIFIED` tier. Layout quality is checked by the rubric in [Layout Craft](./layout-craft.md) as part of inspection.

## Evidence vocabulary

Use these labels — never stronger ones — when reporting delivery state:

| Label | Meaning | Minimum evidence |
|---|---|---|
| `RENDER_VERIFIED` | Source compiled AND the rendered image was visually inspected | Renderer exit code 0 + the PNG/SVG viewed as an image and checked against the inspection checklist |
| `RENDER_VERIFIED (structural)` | Source compiled; only text-level SVG checks were possible (no image viewing) | Exit code 0 + concrete structural assertions: element count matches the ledger, expected labels each present, sane `viewBox` |
| `SYNTAX_VERIFIED` | Source passed a syntax/compile check but no output was inspected | Parser/renderer exit code 0 only |
| `UNVERIFIED` | No tool confirmed anything | State this explicitly; never imply more |

Name the tool **and version** in the state line (`mmdc 11.x`, `plantuml 1.2025.x`): verification is against a specific renderer, and features drift between the local tool and the reader's embedded renderer (GitHub, wikis).

A renderer that exits 0 can still produce an unreadable diagram (label collisions, 40-box sprawl, truncated text). **The delivery gate is on the label matching the evidence, never on withholding the diagram.** For `deliverable` significance, `RENDER_VERIFIED` is required whenever any ladder rung ≤2 succeeds; when only rung 3/4 is reachable, deliver at the honest weaker label — with the failed-attempt evidence the ladder requires.

## Mermaid validation

Preferred: `@mermaid-js/mermaid-cli` (`mmdc`). It both syntax-checks and renders.

```bash
# 1. Write the diagram source to a file, e.g. diagram.mmd

# 2. If a Chromium/Chrome binary exists but Puppeteer can't find it,
#    write a puppeteer config (sandboxed CI/containers usually need --no-sandbox):
printf '{"executablePath":"%s","args":["--no-sandbox","--disable-gpu"]}' \
  "$CHROME_PATH" > puppeteer.json

# 3. Render (drop -p puppeteer.json when Chrome resolves on its own):
npx -y @mermaid-js/mermaid-cli -p puppeteer.json -i diagram.mmd -o diagram.svg
```

- Exit code 0 + an output file ⇒ `SYNTAX_VERIFIED`. Open the SVG and inspect ⇒ `RENDER_VERIFIED`.
- A parse error prints the offending line — fix the source, never bend the model to dodge the parser (e.g. do not delete a needed relationship because its syntax failed; find the correct syntax in the pitfalls module). Bounded repair loop: max 5 iterations, then change strategy (see pitfalls module).
- Finding Chrome: check `PUPPETEER_EXECUTABLE_PATH`, `PLAYWRIGHT_BROWSERS_PATH` (Playwright installs live under `<path>/chromium-*/chrome-linux/chrome`), then `which chromium chromium-browser google-chrome`.
- Parse-only fallback without any browser: the bundled `scripts/check-mermaid.js` calls `mermaid.parse()` through a jsdom shim and prints parse errors with line info (`npm install --no-save mermaid jsdom` in the working directory, then `node <skill-dir>/scripts/check-mermaid.js diagram.mmd`). This yields `SYNTAX_VERIFIED` only.

## PlantUML validation

Requires Java plus `plantuml.jar` (download from the PlantUML GitHub releases if the network allows; ~20 MB).

```bash
# Syntax-only checks (fast, no image):
java -jar plantuml.jar -syntax < diagram.puml    # prints diagram type + entity count, or ERROR + line
java -jar plantuml.jar -checkonly diagram.puml   # exit code only
java -jar plantuml.jar -failfast2 -tsvg *.puml   # CI-style: pre-check everything before rendering anything

# Full render:
java -jar plantuml.jar -tsvg diagram.puml   # writes diagram.svg
```

- Syntax-check success ⇒ `SYNTAX_VERIFIED`; render + inspection ⇒ `RENDER_VERIFIED`.
- **PlantUML exit 0 does not mean a diagram was rendered.** Without Graphviz, `-tsvg` still exits 0 and writes an error-placard SVG ("Cannot find Graphviz") for the dot-dependent diagram types — class, component, use case, object (sequence and colon-syntax activity render without dot). Never claim any verified state from PlantUML's exit code alone; open the output and confirm it is the diagram, not a placard. No Graphviz available → add `!pragma layout smetana` (PlantUML's pure-Java layout engine) and re-render, noting the engine in the state line.
- No Java? Try `npx plantuml-cli` or a `plantuml/plantuml` container before giving up on local validation.
- Kroki is a one-endpoint remote validator/renderer for both tools (`POST https://kroki.io/{mermaid|plantuml|c4plantuml}/svg` with the plain-text source as body; HTTP 400 returns the parse error) — usable only when local tooling is impossible, network policy allows, AND the user has explicitly consented to sending this diagram's content to an external service. Diagram source can encode confidential architecture; obtain the consent, don't assume it.

## Inspection checklist (turning SYNTAX_VERIFIED into RENDER_VERIFIED)

View the rendered image (PNG, or SVG opened as an image) and confirm the points below. If only text-level SVG inspection is possible, the strongest claimable label is `RENDER_VERIFIED (structural)` — raw-SVG text cannot reliably detect overlap or truncation.

1. Every element declared in the source appears in the render (count boxes/lifelines).
2. No text truncation or overlapping labels (in SVG, look for suspiciously identical coordinates and clipped `<text>` widths).
3. The title/caption is present.
4. **Layout rubric** from [Layout Craft](./layout-craft.md): flow monotonicity, crossing budget, proximity honesty, hierarchy direction, label discipline, medium fit (aspect ratio vs the Phase 0 medium), density balance. Rubric failures enter the bounded layout repair loop; still failing after it → escalate the backend per Layout Craft Tier 3, never ship garble silently.

## Degradation ladder

Work down this ladder; report the rung you landed on:

1. Local renderer available (mmdc / plantuml.jar) → render, inspect, deliver `RENDER_VERIFIED`.
2. Renderer installable (npm/network available) → install and go to 1. Prefer `npx -y` over global installs.
3. Syntax checker only → deliver `SYNTAX_VERIFIED`, plus a manual line-by-line review against the pitfalls module, and say which renderer the user should run.
4. No tooling at all → deliver `UNVERIFIED`, run the manual review, state exactly what was not checked, and give the user a one-line command to verify locally. For Mermaid, also point at any markdown preview that renders Mermaid natively (GitHub, VS Code, Claude artifacts) as a zero-install check.

**Landing on rung 3 or 4 requires receipts.** Record in the delivery the exact command(s) attempted for rungs 1–2 and their failure output (verbatim last error). "Tooling probably unavailable" without a failed-command transcript does not clear the honesty gate — assumed unavailability is the lazy path to `UNVERIFIED`.

Never present rung 3 or 4 output with rung 1 language. "The diagram renders correctly" is a lie unless you rendered it.
