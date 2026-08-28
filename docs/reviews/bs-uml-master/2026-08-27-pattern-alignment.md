# Pattern Alignment Review (Gate 3) — bs-uml-master

**Date**: 2026-08-27
**Scope**: bs-uml-master (deep tier), 8 declared patterns
**Method**: Cross-reference skills.json declarations against `docs/patterns/` files, verify actual usage in SKILL.md and references, validate source attribution. Tooling: `bash tools/check-patterns.sh` — 0 ghost references, 0 orphan actives; `node tools/validate.js` check 13 — 8/8 resolve.
**Status**: AI-generated initial record; add `HUMAN_VERIFIED` on human re-run.

## Verdict: PASS

| Pattern | In library? | Correctly applied? | Source accurate? |
|---|---|---|---|
| `hard-rules-first` | YES (01, active) | PASS — "Non-Negotiable Rules" (8 rules) precede all workflow text; Red Flags table maps rationalizations back to rule numbers | PASS — Cursor |
| `progressive-disclosure` | YES (04, active) | PASS — "Start Here: Progressive Disclosure" maps 5 reference modules to load conditions; frontmatter=trigger, body=workflow, references=detail | PASS — Anthropic/CE |
| `verification-rules` | YES (03, active) | PASS — Phase 4 + rendering-validation.md define tool-backed verification commands (mmdc, plantuml -checkonly/-syntax), a degradation ladder, and the `verified-before-delivered` HARD-GATE | PASS — Vercel |
| `format-significance-gates` | YES (01, active) | PASS — sketch/deliverable/authoritative significance levels scale process depth; "Never downgrade significance yourself"; 3 HARD-GATE blocks | PASS — Anthropic |
| `confidence-anchors` | YES (03, active) | PASS — fixed evidence vocabulary `RENDER_VERIFIED`/`SYNTAX_VERIFIED`/`UNVERIFIED` (+`SELF_REVIEWED` for the review pass), each bound to minimum evidence in rendering-validation.md | PASS — CE |
| `named-anti-patterns` | YES (08, active) | PASS — everything-diagram, confident fiction, wrong-by-omission semantics, parser-driven model bending named in rules/Red Flags and reviewable in Phase 5 | PASS — Taste Skill |
| `80-20-design-rules` | YES (08, active) | PASS — element budget (≤9 target, 15 ceiling with justification) and curation rules concentrate effort where reader understanding changes | PASS — Open Design |
| `platform-degradation-rules` | YES (08, active) | PASS — "Dependencies and Degradation" maps missing renderer/Java/sub-agents/user-interaction to explicit fallbacks; degradation ladder in rendering-validation.md | PASS — CE |

Tier check: `deep` is appropriate — diagram output is frequent in engineering work and the failure mode (semantically wrong diagrams that render fine) is silent and high-cost; published measurements (25% LLM relationship accuracy) support high failure cost. Tier declared in frontmatter comment and skills.json consistently.

Notes: patterns used but not declared — none found beyond the declared set that rise to declaration level (one-question-at-a-time appears as a Phase 0 behavior but is borrowed lightly, not load-bearing; left undeclared deliberately to keep declarations honest).
