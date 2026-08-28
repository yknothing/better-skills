# Advocate Review: bs-reflect-loop

**Date**: 2026-08-24
**Reviewer Role**: Advocate
**Skill**: bs-reflect-loop
**HUMAN_VERIFIED**: false
**Scope Contract Version**: 1
**Reviewed Revision**: b5d0005aebb2bd8fcfb7389ab85d1f03f75b915d
**Reviewed Skill SHA-256**: a9a251f40de31ddc2dc56825c3fa6e369b6990f8be27a4bdd69938b5c22bc40d
**Reviewed Manifest SHA-256**: 93c5a36c556f91678fa7da9c1b78389925e03f0806dd384e01d4f796f68d8956

## Executive Summary

The Skill and its 15 evaluation contracts are coherent and release-ready at Gate 2: cross-turn routing, Chinese reflection signals, Stability and Validated mechanism receipts, unconditional no-replay, and independent record/remediation authority preserve the evidence, persistence, and executable boundaries. The final disposition parser now fails closed across the directly reproduced Markdown variants, including normalized ATX headings, global contradictory Verdict fields, H1-H6 or setext finding escapes, extra tags, fenced and indented code, and incomplete evidence fields. I would ship this scoped candidate, while keeping Gate 4 explicitly schema-only rather than treating it as forward-behavior certification.

## Evidence Reviewed

Full manifest receipt acknowledged: `93c5a36c556f91678fa7da9c1b78389925e03f0806dd384e01d4f796f68d8956`.

Files read in full and hash-checked against the bound 12-file manifest:

- `docs/superpowers/plans/2026-08-20-reflect-loop-skill.md`
- `docs/superpowers/specs/2026-08-20-reflect-loop-skill-design.md`
- `evaluation/datasets/batch-1-test-prompts.json`
- `evaluation/harness/runner.js`
- `evaluation/harness/test-runner-scope.js`
- `skills.json`
- `skills/bs-reflect-loop/SKILL.md`
- `skills/bs-reflect-loop/references/deposition-routing.md`
- `skills/bs-reflect-loop/references/office-work.md`
- `skills/bs-reflect-loop/references/software-lifecycle.md`
- `tools/peer-review.js`
- `tools/test-peer-review-scope.js`

Commands and checks rerun:

- `git rev-parse HEAD` returned `b5d0005aebb2bd8fcfb7389ab85d1f03f75b915d`; `shasum -a 256` matched all 12 manifest entries and the prompt receipt.
- `node tools/validate.js --json skills/bs-reflect-loop` and `node bin/better-skills.js validate bs-reflect-loop` each exited `0` with 16 passed, 0 failed, and 0 warned.
- A direct frontmatter/reference/resolver probe confirmed `name: bs-reflect-loop`, a 464-character `Use when` description below 1024 characters, all three local Markdown references present, and runtime resolution to the self-developed `skills/bs-reflect-loop/SKILL.md`.
- `npm pack --dry-run --json --cache /private/tmp/better-skills-reflect-review-npm-cache` exited `0` and included `SKILL.md` plus all three reference files; the temporary cache was removed afterward.
- `node tools/pattern-alignment.js bs-reflect-loop --json` exited `0`; all 6 declared patterns resolved and appeared in the body, with no drift or warning.
- `node evaluation/harness/runner.js --skill bs-reflect-loop --json` exited `0` with 15 structurally complete eval contracts and a structural score of 100. It explicitly reported `evidence_scope: EVAL_SCHEMA_ONLY`, `behavioral_verdict: NOT_RUN`, and `behaviorally_verified: false`.
- `node evaluation/harness/test-runner-scope.js` exited `0` and confirmed that schema-only checks cannot be upgraded to behavioral verification.
- `tools/peer-review.js` was inspected through its full disposition, Markdown masking, and structured-finding paths. It requires one normalized H2 Verdict as the final H2, exactly one controlled Verdict field across the whole review and inside that section, role-appropriate approval, one immediately adjacent adversary Findings section, an H3-only finding contract with exactly one severity/status pair and all four evidence fields, and no OPEN CRITICAL/HIGH/MEDIUM finding. It masks valid fenced and indentation-based code, rejects all setext headings, and treats invalid backtick fence openers as ordinary content.
- `node tools/test-peer-review-scope.js` exited `0`. Its negative regressions cover `NOT APPROVED`, score-only and wrong-role approval, duplicate or globally contradictory Verdict fields, duplicate/hidden sections, OPEN HIGH/MEDIUM, malformed or non-H3 findings, extra tag shadowing, missing evidence fields, 0-3-space/trailing-hash normalization, fenced examples, TAB and space-plus-TAB indented code, one-character-or-longer setext H1/H2, and invalid backtick fence openers.
- A direct disposition probe reran the previously successful escapes against the final implementation. The prior global contradictory Verdict, ATX H1, setext H1, invalid backtick opener, and space-plus-TAB cases all returned `passed: false`; a canonical LOW/RESOLVED adversary record returned `passed: true`.
- A targeted contract comparison confirmed that the design's Choice-required conditions now agree with the Skill, deposition reference, and executable-boundary eval: an exact true remediation receipt proceeds only through a separate execution phase without a redundant question, while ambiguity or high-impact policy choice still blocks. The mixed-status and Chinese cross-turn contracts also retain independent authority axes.

## Dimension Scores

| Dimension | Score | Key Strength | Key Concern |
|-----------|------:|--------------|-------------|
| Clarity of trigger description | 10/10 | The pre-load description names completed/stable work, cross-turn re-evaluation, and the active diagnosis, incident-response, and implementation exclusions. | Actual multilingual routing behavior is not executed by the current harness. |
| Hard rules / safety gates | 10/10 | Stability, unconditional no-replay, validated-mechanism, records-authority, and remediation-authority receipts keep evidence and mutation boundaries independent. | Forward compliance with the receipts remains untested. |
| Workflow correctness | 10/10 | The mixed-status path is now composable, and exact authorized remediation moves to a separate execution phase without permission-loop friction. | Runtime behavior is outside the present schema evidence. |
| Pattern application | 10/10 | The six declared patterns are resolved and operationalized in routing, budgets, confidence control, scoping, deposition, and self-review. | No material concern in the reviewed scope. |
| Test prompt coverage | 10/10 | Fifteen contracts cover happy, edge, and adversarial cases, including Chinese cross-turn routing, mixed authority, no-replay, gray stability, and single-case promotion. | They are contracts, not executed output comparisons. |
| Bundled resources | 10/10 | The three references are present, load selectively, and now agree with the main Skill on independent authority and exact-target behavior. | No material concern in the reviewed scope. |
| Maintainability | 10/10 | Plan, design, Skill, references, dataset counts, registry, exact scope receipts, and the strict disposition grammar are synchronized and backed by focused regressions. | Further Markdown grammar growth should continue to arrive with a negative fixture. |
| Production readiness | 8/10 | Gate 1, resolver loadability, packaging, pattern alignment, exact scope integrity, and all directly reproduced Gate 2 bypass regressions are green. | Gate 4 behavior remains `NOT_RUN`; this score does not claim forward behavioral proof. |

## Strongest Aspect

The strongest design move is the separation of three questions that weaker retrospectives commonly collapse: whether work is stable enough to reflect on, whether evidence is strong enough to promote a lesson, and whether any resulting write is authorized. The Stability receipt and unconditional no-replay rule prevent a Chinese cross-turn request from reopening active side effects; the Validated mechanism receipt prevents rich evidence from one case becoming a universal rule; and independent records/remediation receipts allow an authorized knowledge deposit to coexist honestly with pending, unauthorized executable work. The result is both safer and more useful than a generic retrospective checklist.

## One Improvement

Add separately receipted forward behavioral runs for the highest-risk contracts: the Chinese `ACTIVE_WORK` to `REFLECTION` transition, mixed record/remediation authority, exact authorized remediation handoff, and unconditional no-replay. Those runs should preserve artifacts and expected-versus-actual judgments outside Gate 4, because the current runner intentionally proves only dataset and Skill structure.

## Verdict

**Verdict**: PASS (78/80)

The reviewed scope has no remaining blocking finding. The Skill keeps evidence strength, stability, knowledge-record authority, and executable remediation authority independent; its 15 contracts cover the material routing and safety boundaries; and the final Gate 2 parser rejects every directly reproduced disposition or finding-hiding bypass. This PASS is for the bound revision and manifest only. Gate 4 remains `EVAL_SCHEMA_ONLY`, with `behavioral_verdict: NOT_RUN` and `behaviorally_verified: false`; none of the 15 scenarios is represented as executed forward behavior.
