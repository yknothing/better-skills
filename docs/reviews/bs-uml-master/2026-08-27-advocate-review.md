# Advocate Review: bs-uml-master

**Date**: 2026-08-27
**Reviewer Role**: Advocate
**Skill**: bs-uml-master
**HUMAN_VERIFIED**: false
**Scope Contract Version**: 1
**Reviewed Revision**: 1294e7134885bb0525710b1036d241ee5a917eff
**Reviewed Skill SHA-256**: 73a0c0969e6f88c08ee0b990ea8c45113a520fda09a73460c01e65364be89569
**Reviewed Manifest SHA-256**: 10262aef64768581df929f3b64e8dcf422ea96d88e2ce79949314fa31d5f2782

## Executive Summary

bs-uml-master converts the field's measured LLM diagramming failures — 25% relationship-semantics correctness (ACM), syntax error rates flat across model scale (MermaidSeqBench), and this repo's own RED baseline mural — into named, mechanically checkable rules: an evidence ledger with `file:line` per edge, a fixed delivery-state vocabulary, an element budget with an explicit `USER-OVERRIDE` policy, and a receipts-required degradation ladder. The adversary-round fixes landed verifiably in the reviewed revision, including a working `scripts/check-mermaid.js` that I re-executed and confirmed. I would ship this: it is the best-grounded skill in the repo, pending only forward-test human verification.

## Evidence Reviewed

I acknowledge full manifest receipt `10262aef64768581df929f3b64e8dcf422ea96d88e2ce79949314fa31d5f2782` (Scope Contract Version 1). All 13 manifest file hashes and the revision (`1294e713…`) were recomputed locally with `sha256sum` / `git rev-parse HEAD` and match the prompt verbatim.

Files examined in full against current content:

- `skills/bs-uml-master/SKILL.md` — re-read post-revision; confirmed F1 (Rule 4 `USER-OVERRIDE` policy), F5/F6 echo in Rule 6 (`(structural)` variant, failed-command evidence), F7 (Phase 0 falsifiable-question test), F8 (sketch classification-vs-downgrading), F9 (EXPLAIN/REVIEW phase-skip note), F15 (contract Evidence shapes for DESIGN/REVISE), and the `check-mermaid.js` row in Bundled Resources.
- `skills/bs-uml-master/references/rendering-validation.md` — confirmed `RENDER_VERIFIED (structural)` row with concrete minimum evidence (F12), tool+version naming in the state line (F13), label-evidence gate restatement (F6), and rung-3/4 receipts requirement (F5).
- `skills/bs-uml-master/references/syntax-pitfalls.md` — confirmed comma-generics claim now version-scoped with probe-first instruction and "pre-emptive aliasing… is parser-driven model bending" (F4), "no use case diagram in current releases (probed: rejected on 11.17)" (F3), flowchart-specific annotations on the `end`/`o`/`x` traps (F10).
- `skills/bs-uml-master/references/uml-semantics.md` — confirmed "at most one initial pseudostate per region" and triggerless-transition correction (F11).
- `skills/bs-uml-master/references/diagram-selection.md` — confirmed budget section mirrors the `USER-OVERRIDE` policy (F1) and adds member/edge load guidance (≤7 members, ~25+ edges signal) (F15).
- `skills/bs-uml-master/references/modeling-from-code.md` — re-read; unchanged in substance, hash matches manifest.
- `skills/bs-uml-master/scripts/check-mermaid.js` — read in full and **re-executed** (F2/F14): `npm install --no-save mermaid jsdom` then run against a valid `classDiagram` → exit 0, `OK: classDiagram — SYNTAX_VERIFIED only…`; against an invalid edge (`Animal <|--<< Dog`) → exit 1, `PARSE ERROR … Parse error on line 2`. The script self-declares its ceiling (`SYNTAX_VERIFIED at most`), matching the ladder.
- `skills.json` — bs-uml-master entry (batch-1, tier deep, 8 patterns identical to SKILL.md declarations).
- `evaluation/datasets/batch-1-test-prompts.json` — bs-uml-master entry present, mirroring the three SKILL.md test prompts.
- `evaluation/harness/runner.js`, `evaluation/harness/test-runner-scope.js`, `tools/peer-review.js`, `tools/test-peer-review-scope.js` — examined for scope/gate behavior; not re-run beyond the checks below.

Commands rerun: `git rev-parse HEAD`; `sha256sum` over all 13 manifest paths; `bash tools/validate.sh skills/bs-uml-master/` → **16 passed, 0 failed** (including "Pattern references resolve to documented patterns (8/8)" and "Bundled resources exist"); the two `check-mermaid.js` executions above. Context also read: `docs/research/uml-diagramming-analysis.md`, `docs/patterns/README.md`, `docs/reviews/bs-uml-master/2026-08-27-gate2-response.md`.

## Dimension Scores

| Dimension | Score | Key Strength | Key Concern |
|-----------|------:|--------------|-------------|
| Clarity of trigger description | 9/10 | Description enumerates all nine diagram types plus the four quality dimensions that distinguish this skill from a syntax helper; "Use when" form passes Gate 1 | Long single sentence; no negative triggers (charts/dataviz exclusions live only in Boundaries) |
| Hard rules / safety gates | 10/10 | Eight rules each traceable to a measured failure; three well-formed HARD-GATEs at the exact temptation points; Rule 4's `USER-OVERRIDE` and Rule 6's receipts requirement close the two loopholes the adversary found | Rule count is at the top of what agents reliably hold; mitigated by the Red Flags table restating them as first-person rationalizations |
| Workflow correctness | 9/10 | Phase 0–5 exits are checkable states; EXPLAIN/REVIEW now has a defined phase-skip path; falsifiable-question test makes Phase 0 non-boilerplate; bounded repair loop with strategy-switch exit | REVISE mode gets one paragraph while the other modes get modules; multi-diagram confirmation flow assumes an interactive user (degradation section covers it, but tersely) |
| Pattern application | 9/10 | All 8 declared patterns have identifiable load-bearing mechanisms (verified per-pattern in the first-round review; unchanged or strengthened by the fixes — e.g. confidence-anchors gained the `(structural)` variant, platform-degradation-rules gained receipts) | `confidence-anchors` bullet in SKILL.md still lists only the three base labels, omitting the `(structural)` variant and `SELF_REVIEWED` |
| Test prompt coverage | 8/10 | Happy/edge/adversarial each target a distinct documented failure mode; Prompt 3's expected behavior now consistent with Rule 4's override policy (was the F1 contradiction); prompts mirrored in the dataset with recorded baseline | Three prompts cover class/sequence + inflation pressure; no prompt exercises REVISE or EXPLAIN/REVIEW modes, state machines, or the degradation ladder |
| Bundled resources | 9/10 | Five modules load on stated conditions; semantics tables spot-checked accurate post-F11; pitfalls now honest about version-dependence instead of overclaiming; `check-mermaid.js` works as documented (re-executed, both exit paths) | `check-mermaid.js` depends on runtime `npm install` of mermaid/jsdom — fine for rung 3, but worth a pinned-version note as mermaid's API drifts |
| Maintainability | 8/10 | Claims now version-scoped ("11.17+", "current releases") so drift is detectable rather than silent; tool+version in every state line; research doc holds citations per repo convention | Version-scoped claims need periodic re-probing with no scheduled trigger; tier still comment-only in frontmatter pending Phase 1.B |
| Production readiness | 9/10 | Gate 1 16/16 at reviewed revision; all 7 gating adversary findings verifiably fixed in content, not just dispositioned; pattern alignment 8/8; forward-test runs recorded (3/3 EXECUTED per gate2-response) | Forward-test evidence is AI-executed, awaiting `HUMAN_VERIFIED`; renderer availability in real environments is the practical variance source |

**Total: 71/80**

## Strongest Aspect

The single best design move is the **evidence ledger** (`modeling-from-code.md` Steps 2–4) and the way everything else anchors to it. The ledger turns the field's worst-measured weakness — relationship semantics, 25% correct in the cited ACM study — into a mechanical discipline: every edge kind is decided by a *code observation* ("part constructed by the whole, never handed out → composition"; "stored field → association, parameter → dependency"), every element carries a `file:line`, and the Step 4 sync check defines fabrication operationally ("diagram elements without ledger rows are fabrications and must be removed or evidenced"). The output contract then makes the ledger auditable by the reader, Phase 5 reviews against it, and the budget curates from it with recorded exclusions. No surveyed competitor skill (per `docs/research/uml-diagramming-analysis.md` §一) has anything in this layer — they stop at syntax. This is the mechanism that makes the skill's diagrams *checkable claims* rather than plausible pictures, and it is why the skill's BUILD justification holds.

## One Improvement

Add one forward-test prompt (and dataset mirror) that exercises the **degradation ladder under real tooling absence**: a MODEL-FROM-DESIGN state-machine request in an environment where `mmdc` cannot obtain Chromium, with expected behavior of running `scripts/check-mermaid.js`, delivering `SYNTAX_VERIFIED` with verbatim failed-command receipts for rungs 1–2, and a user-runnable verification command. The receipts requirement (F5) and the `(structural)` variant (F12) are the newest and least-exercised honesty mechanisms — currently no test prompt touches them, yet degraded environments are precisely where the pre-fix skill would have quietly self-certified `UNVERIFIED`. This one prompt would also close the REVISE/state-machine coverage gap noted in Dimension Scores.

## Verdict

**Verdict**: PASS

The skill passes the advocate gate at the reviewed revision. Its rules are each traceable to documented empirical failures rather than taste; its eight declared patterns are load-bearing, not decorative; and the adversary round demonstrably improved it — every gating finding was verified as fixed in the current bytes, including replacing a false tooling claim with a shipped script that I re-executed successfully on both exit paths. The honesty architecture (fixed evidence vocabulary, receipts-required degradation, label-matches-evidence delivery gate, `USER-OVERRIDE` recording) is the strongest in the repo and is internally consistent end-to-end after the F1/F6/F8 reconciliations. Remaining work — human verification of the forward-test runs and a degraded-environment test prompt — is real but sits properly in Gate 4 and iteration, not as a Gate 2 blocker.
