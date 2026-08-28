# bs-uml-master — RED Baseline Record

- **Date:** 2026-08-27
- **Phase:** TDD RED (bs-skill-forge Step 5) — naive prompt against a fresh, skill-less agent
- **Evidence scope:** EXECUTED (fresh sub-agent, no skill content in context)
- **Status:** AI-generated record; add `HUMAN_VERIFIED` on human re-run

## Setup

Prompt: `帮我画一个电商系统的UML图` (the uml-happy eval prompt) sent verbatim to a fresh general-purpose sub-agent (Sonnet) with instructions to respond naturally and not self-critique.

## Observed baseline behavior

The agent immediately produced a single 12-class Mermaid class diagram ("typical e-commerce": User, Address, Product, Category, ShoppingCart, CartItem, Order, OrderItem, Payment, Review) with a per-class glossary, then offered extensions. Format choice: Mermaid, justified by GitHub/VS Code/Notion portability.

## Failure taxonomy (what the skill must fix)

| # | Observed failure | Skill mechanism that addresses it |
|---|---|---|
| 1 | No question asked; no reader, mode, or significance established — jumped straight to output | Rule 1 + Phase 0 + `question-before-drawing` HARD-GATE |
| 2 | Invented a "typical" system rather than distinguishing MODEL-FROM-DESIGN vs MODEL-FROM-CODE (nothing labeled as assumption) | Mode gate; Rule 2; assumption labeling |
| 3 | 12 primary elements in one diagram, all concerns (identity, catalog, cart, order, payment, review) in one mural | Rule 4 element budget; one-diagram-one-question; split-by-concern |
| 4 | Relationship semantics wrong-by-omission: plain `--` associations nearly everywhere (e.g. `User "1" -- "1" ShoppingCart`, `Order "1" -- "1" Payment`); no dependency edges; no navigability | Rule 3 + uml-semantics tables ("choose the weakest true relationship" — but explicitly, not by default) |
| 5 | `status: String` on Order and Payment instead of `<<enumeration>>` types | Semantics rule U5 |
| 6 | No title on the diagram; edge labels present but no legend where conventions were non-obvious | Semantics rules U3/U4 |
| 7 | Zero validation: Mermaid source delivered with no syntax check, no render, and no statement of verification state | Rule 6 + Phase 4 + `verified-before-delivered` HARD-GATE; confidence-anchor vocabulary |

Positives worth keeping (the baseline is not all bad): sensible format-portability reasoning; `*--` used correctly for Cart/Order item containment; labels on edges.

## Consistency with external evidence

The observed failures match the published record: ACM study measuring 25% relationship accuracy for LLM class diagrams, and MermaidSeqBench/OmniDiagram findings that syntax quality is stagnant with scale (see docs/research/uml-diagramming-analysis.md).

## RED verdict

Baseline fails on question-framing, semantics discipline, curation, and verification — all four pillars the skill targets. GREEN criterion: the same prompt, with the skill, must produce the behaviors recorded in `evaluation/datasets/batch-1-test-prompts.json` (`uml-happy`).
