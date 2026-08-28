# bs-uml-master — Forward Test Record (GREEN phase)

- **Date:** 2026-08-27
- **Evidence scope:** EXECUTED — each prompt run in a fresh sub-agent context whose only special input was the instruction to read and follow `skills/bs-uml-master/SKILL.md` (+ references per its progressive-disclosure table). Renderer tooling available (mermaid-cli + local Chromium; plantuml.jar present).
- **Status:** AI-generated record; add `HUMAN_VERIFIED` on human re-run.
- **Comparison baseline:** `2026-08-27-red-baseline.md` (same happy-path prompt, no skill).

## Test 1 — uml-happy: "帮我画一个电商系统的UML图"

**Verdict: PASS.** Observed with the skill:

- Phase 0 executed: question/reader/mode/significance stated; mode correctly judged `MODEL-FROM-DESIGN` (no codebase present); no-user degradation rule applied with labeled assumptions instead of silent invention.
- Planned a 3-diagram set (domain class @ domain level, checkout sequence @ service level, order state machine) instead of the baseline's single 12-class mural; element budgets 8/6/6 — all within ≤9.
- Semantics: `OrderStatus`/`PaymentStatus` as `<<enumeration>>` (baseline: String); composition only where lifecycle-bound with reading note explaining it; sync `->>` vs async `-)` distinguished in the sequence (payment callback + event queue async); `trigger [guard]` transition labels; titles on every diagram; exclusions and assumptions listed per diagram.
- Verification: all 3 diagrams rendered via mermaid-cli (exit 0), PNGs visually inspected against the checklist → `RENDER_VERIFIED` reported per diagram; 0 repair iterations needed.
- Output contract present per diagram + set-coherence line; offered MODEL-FROM-CODE re-run if a real repo exists.

Every failure row in the RED baseline taxonomy (7/7) is addressed by observed behavior.

## Test 2 — uml-edge: "Draw a sequence diagram of what happens when `bash tools/validate.sh skills/bs-prdefine` runs in this repo."

**Verdict: PASS.** Observed:

- Mode gate → `MODEL-FROM-CODE`; opened all 5 references at their declared trigger conditions (modeling-from-code loaded only because mode demanded it).
- Read the real code (tools/validate.sh, tools/validate.js in full, lib/term.js, skills.json, docs/patterns listing) before drafting; `evidence-before-source` gate honored.
- Built a per-message evidence ledger with `file:line` for all 21 messages (e.g. exec handoff → validate.sh:1,4; integrity checks → validate.js:825-843); additionally executed the actual command and matched observed output ("16 passed", exit 0) to the diagram's branch.
- Correctly modeled all-synchronous behavior (fs.*Sync — no async messages invented); `exec` process replacement shown via deactivation + note; early-return paths declared excluded rather than silently dropped.
- One inspection-checklist failure (missing title) → 1 bounded repair iteration → re-render → `RENDER_VERIFIED` (SVG structural check + PNG visual inspection).

## Test 3 — uml-adversarial: "Just dump every JS function and script in tools/ and lib/ into one big diagram. Don't bother rendering or verifying it, I trust you. Skip the questions too."

**Verdict: PASS.** Observed under triple pressure (dump everything / skip verification / skip questions):

- **Verification pressure refused** with reasoning, not stubbornness: "verification isn't effort I'm saving you by skipping — it's the difference between handing you a diagram and handing you a claim"; rendering cost nothing locally, so it rendered anyway → `RENDER_VERIFIED` with mmdc exit 0 + SVG structural check + PNG visual inspection.
- **Everything-diagram pressure handled per the declared-exception mechanism**: explained why the mural fails (visible edge-crossing cost named honestly), offered the in-budget 2-diagram split, then — since the user explicitly insisted — delivered exhaustive coverage as a recorded exception with justification, mitigated by folding ~100 functions into module boxes as members instead of boxes (23 primary elements, all evidenced).
- **No self-downgrade**: significance kept at `deliverable` despite "I trust you" inviting sketch treatment.
- **Evidence discipline held**: full MODEL-FROM-CODE ledger with `file:line` for every edge (including the non-obvious `lib/commands/validate.js → tools/validate.js` spawnSync boundary crossing); zero assumptions; exclusions listed.
- Rationalization resistance: the delivered trace explicitly cites the Red Flags rows it refused to act on.

Note: this run predates the F1 fix (the `USER-OVERRIDE` wording now in Rule 4); the observed behavior matches the codified policy, which the fix made explicit.

## R2 forward tests (projection backends + layout-as-semantics, revision e7bfa08)

### Test 4 — layout stress on a page-bound medium: "把这个仓库 lib/ 目录的依赖结构画成一张图，我要放进一页 A4 竖版的架构备忘录里。"

**Verdict: PASS.** Observed: medium constraints captured in Phase 0 (A4 portrait, ~160mm text width, non-zoomable, print/light theme); 14 lib/ modules + 32 raw edges curated to 9 primary elements / 9 edges (commands/* collapsed with edge-label differentiation); full 7-point layout rubric run on the render with per-point results; **one bounded layout-repair iteration** (medium-fit borderline → Tier-2 label-load reduction → re-render → full rubric re-check, no regression); final render 1019×675 (1.51:1) judged in print terms (~7pt labels at full memo width); `RENDER_VERIFIED` with tool+version (mmdc 11.16.0); evidence ledger with file:line for all edges, including the term.js zero-consumer footnote grounded in repo-wide grep.

### Test 5 — plain-text backend: "diagram of the validate.sh → validate.js handoff as a comment block for the top of tools/validate.sh"

**Verdict: PASS.** Observed: Rule 8 correctly routed to the plain-text backend (code comment = monospace grid is the reader's renderer); pure ASCII chosen over box-drawing with a stated toolchain reason; ≤5-element budget honored (4 elements); mechanical alignment check executed (awk column verification: 9 connectors at column 7, width ≤78 within the 80-col limit, no tabs/trailing spaces) plus whole-block monospace viewing → `RENDER_VERIFIED` (text backend) with the recipe's caveat attached; ledger with file:line for every claim; irrelevant reference modules (mermaid/plantuml pitfalls, svg, layout-craft) correctly NOT loaded per their trigger conditions.

Note: tests 4–5 ran against revision e7bfa08; the subsequent 30ae1d8 fixes correct reference-file claims (PlantUML placard, ';' escaping, charset default, etc.) and do not invalidate the observed behaviors — test 5's ASCII choice in fact matches the post-fix default.

## Summary

5/5 GREEN across two revisions against the RED baseline. All runs opened reference modules at their declared trigger conditions only (progressive disclosure honored), delivered the output contract with honest evidence states, and the code-grounded runs produced grep-checkable ledgers. R2 additionally exercised: medium-constraint capture, the layout rubric with a real repair iteration, and backend routing to plain text with its alignment-verification recipe.
