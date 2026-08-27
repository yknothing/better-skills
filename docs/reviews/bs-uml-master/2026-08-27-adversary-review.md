# Adversary Review: bs-uml-master

**Date**: 2026-08-27
**Reviewer Role**: Adversary
**Skill**: bs-uml-master
**HUMAN_VERIFIED**: false
**Scope Contract Version**: 1
**Reviewed Revision**: 1294e7134885bb0525710b1036d241ee5a917eff
**Reviewed Skill SHA-256**: 73a0c0969e6f88c08ee0b990ea8c45113a520fda09a73460c01e65364be89569
**Reviewed Manifest SHA-256**: 10262aef64768581df929f3b64e8dcf422ea96d88e2ce79949314fa31d5f2782

## Summary

This is the manifest-bound second-round adversary review, run against the content produced after all seven gating fixes (and eight recommended fixes) from the first, free-form adversary round were applied; every one of the 15 prior findings (F1–F15) was re-verified as actually landed, with the bundled `scripts/check-mermaid.js` verified by execution rather than by reading. Five residual issues remain: one MEDIUM (the bundled checker conflates environment/runtime exceptions with parse errors, which can send an agent into the repair loop against valid syntax) and four LOW (two more version-stale pitfall claims that failed to reproduce on mermaid 11.17.2, a contract enumeration that omits the new `RENDER_VERIFIED (structural)` variant, self-attested gate receipts pending Phase 2.A automation, and the carried Kroki consent-default wording). Worst-case impact of the residuals is wasted repair iterations and mildly over-cautious syntax workarounds — not incorrect diagrams or dishonest delivery states.

## Evidence Reviewed

Full manifest receipt acknowledged: `10262aef64768581df929f3b64e8dcf422ea96d88e2ce79949314fa31d5f2782` (13 files; every entry's SHA-256 recomputed with `sha256sum` and confirmed to match both the prompt manifest and the working tree at revision `1294e7134885bb0525710b1036d241ee5a917eff`, which matches `git rev-parse HEAD`).

Files examined in full:

- `skills/bs-uml-master/SKILL.md` (fixed revision — verified F1, F5-echo, F7, F8, F9, F12-reference, F15 landed)
- `skills/bs-uml-master/references/diagram-selection.md` (F1 mirror, F15 member/edge load guidance)
- `skills/bs-uml-master/references/modeling-from-code.md`
- `skills/bs-uml-master/references/rendering-validation.md` (F2, F5 receipts, F6 label-evidence gate, F12 structural variant, F13 tool+version)
- `skills/bs-uml-master/references/syntax-pitfalls.md` (F3 use-case removal, F4 version-scoping, F10 flowchart annotations)
- `skills/bs-uml-master/references/uml-semantics.md` (F11 "at most one initial pseudostate per region"; triggerless-transition wording)
- `skills/bs-uml-master/scripts/check-mermaid.js` (read line-by-line and executed)
- `skills.json`, `evaluation/datasets/batch-1-test-prompts.json`, `evaluation/harness/runner.js`, `evaluation/harness/test-runner-scope.js`, `tools/peer-review.js`, `tools/test-peer-review-scope.js`
- Context: `docs/reviews/bs-uml-master/2026-08-27-gate2-response.md` (fix disposition), `docs/patterns/README.md` (all 8 declared patterns resolve; list matches `skills.json` exactly)

Commands actually run (mermaid 11.17.2 + jsdom, Node 22.22.2, no browser):

- `sha256sum` over all 13 manifest entries + `git rev-parse HEAD` — all match.
- `node skills/bs-uml-master/scripts/check-mermaid.js <f>` against: valid classDiagram (exit 0, type reported), invalid classDiagram (exit 1, parse error with line/caret), sequenceDiagram with quoted participant alias and balanced activations (exit 0), stateDiagram-v2 (exit 0), erDiagram (exit 0), flowchart (exit 0), and from a cwd without the npm packages (exit 2 with a clear install hint — env failure correctly distinguished from parse failure).
- Pitfall-claim probes via the bundled checker: `end` as flowchart node ID → parse error reproduced (exit 1); bare `%` inside a flowchart label → parses OK; `end` inside sequence message text, including inside a `loop` fragment → parses OK (see F2 below).

## Findings

### F1: check-mermaid.js reports any runtime exception as "PARSE ERROR"  [MEDIUM]

**Location**: `skills/bs-uml-master/scripts/check-mermaid.js`, lines 56–63 (the `try { await mermaid.parse(source) } catch` block)
**Exploit scenario**: The final catch-all wraps `mermaid.parse()` and prints `PARSE ERROR in <file>` with exit 1 for *any* throw — not only parser rejections. If a diagram type's parse path touches a browser global the shim does not provide (the script sets only `global.window` and `global.document`; it relies on Node ≥21 supplying a global `navigator`, and never shims `DOMParser`), the environment error surfaces as a parse error. An agent following the bounded repair loop then burns up to 5 iterations "fixing" syntax that is valid, and may conclude the construct is unsupported — exactly the parser-driven model bending Rule 7 forbids. Observed behavior on this box (Node 22, six diagram types) is correct, so this is a latent robustness defect, not a reproduced failure.
**Root cause**: A single undiscriminated catch block in the evidence layer; missing shims narrow the environments in which the error classification stays truthful.
**Suggested fix**: Distinguish mermaid parse rejections (e.g. `error.hash`, jison "Parse error on line" message shape, or `UnknownDiagramError`) from other exceptions; report the latter as `check-mermaid: environment error` with exit 2, matching the script's existing env-failure convention. Optionally shim `DOMParser` from jsdom and document the Node ≥21 assumption (or define `navigator` via `Object.defineProperty` for older LTS).

### F2: Two more pitfall claims are version-stale — same class as fixed F4  [LOW]

**Location**: `skills/bs-uml-master/references/syntax-pitfalls.md`, "All diagram types" line "Comments are `%%`. A single `%` breaks the parser." and sequenceDiagram line "`end` or `;` inside message text: wrap or escape (`#59;`)."
**Exploit scenario**: Probed on mermaid 11.17.2: a bare `%` inside a flowchart label parses, and `end` inside sequence message text parses even inside a `loop` fragment (the `end`-as-node-ID trap does still reproduce and stays valid). An agent trusting these lines will pre-emptively escape/rewrite label text that needs no change — harmless in output, but it is the same "workaround for a trap that may not exist" pattern the F4 fix explicitly named as parser-driven model bending for comma generics.
**Root cause**: Claims inherited from older Mermaid behavior, stated unconditionally while the comma-generics line next to them was version-scoped.
**Suggested fix**: Apply the F4 treatment: mark both as historical/version-dependent ("older embedded renderers may reject; probe on the target toolchain"), keeping the still-reproducing node-ID case unconditional.

### F3: `RENDER_VERIFIED (structural)` missing from the Output Contract and Phase 4 exit enumerations  [LOW]

**Location**: `skills/bs-uml-master/SKILL.md` — Output Contract State line (`**State:** RENDER_VERIFIED | SYNTAX_VERIFIED | UNVERIFIED`) and Phase 4 exit (`RENDER_VERIFIED` / `SYNTAX_VERIFIED` / `UNVERIFIED`)
**Exploit scenario**: Rule 6 and rendering-validation.md define the `(structural)` variant, but the contract template and Phase 4 exit list only the three unqualified labels. A literal-minded agent that performed text-level SVG checks must choose between an enumerated-but-too-strong label and a correct-but-unenumerated one; a lazy agent resolves that tension upward to unqualified `RENDER_VERIFIED`, quietly reopening the hole the F12 fix closed.
**Root cause**: The variant was added to the vocabulary and Rule 6 but not propagated to the two enumerations agents copy from.
**Suggested fix**: Add `RENDER_VERIFIED (structural)` to both enumerations (one-line edit each).

### F4: Gate receipts remain self-attested pending automation  [LOW]

**Location**: SKILL.md Phase 0 (question falsifiability), rendering-validation.md degradation ladder ("Landing on rung 3 or 4 requires receipts")
**Exploit scenario**: The fixed text now demands a non-empty Excluded line and verbatim failed-command transcripts, which is a real improvement — but no tool in the manifest (`tools/validate.sh` Gate 1, `evaluation/harness/runner.js` at `EVAL_SCHEMA_ONLY`, `tools/peer-review.js`) parses a delivery for these receipts. An agent that fabricates a plausible one-line "command failed" note passes every automated check that exists today. This is an accepted-risk carry-forward, consistent with CLAUDE.md's Phase 2.A plan, recorded here so it is not mistaken for a closed item.
**Root cause**: Enforcement layer (Phase 2.A extended validation) not yet shipped; the skill text is ahead of the tooling.
**Suggested fix**: When Phase 2.A lands, add a check that a delivery claiming rung 3/4 contains a fenced command + error block; until then, no change to the skill text is required.

### F5: Kroki external-send consent default (carried, dispositioned)  [LOW]

**Location**: `skills/bs-uml-master/references/rendering-validation.md`, Kroki bullet ("never send confidential source or proprietary model content to an external service without the user's consent")
**Exploit scenario**: A rationalizing agent classifies repo-derived diagram source as "just class names, not confidential" and posts it to kroki.io without asking. The gate2-response dispositioned this as kept-as-worded; recorded here as a residual because MODEL-FROM-CODE source is essentially always proprietary, so the "confidential" qualifier does the exploit's work for it.
**Root cause**: Consent is conditioned on the agent's own confidentiality judgment.
**Suggested fix**: Invert the default for MODEL-FROM-CODE outputs: "for diagram source derived from the user's code, ask before sending to any external endpoint; for MODEL-FROM-DESIGN sketches of non-sensitive content, judgment applies."

## Verdict

**Verdict**: APPROVED

All seven gating fixes from the first-round adversary review are verified as landed in the manifest-bound content — by re-reading for the textual fixes and by execution for the executable ones: the manifest hashes match the working tree at the recorded revision, the previously false `mermaid.parse()` recipe is replaced by a bundled script that was run against seven inputs (valid, invalid, missing-deps, and five diagram types) and behaved exactly as documented, the nonexistent Mermaid use-case claim is gone, the comma-generics trap is version-scoped with an anti-model-bending warning, the ceiling/override contradiction is resolved consistently in Rule 4 and diagram-selection.md, the delivery gate is restated as label-evidence match with mandatory rung-3/4 receipts, and the sketch-inference ambiguity is closed. The five residual findings are one latent robustness defect in a fallback script (MEDIUM — it cannot corrupt a delivered diagram; worst case is wasted repair iterations under a misleading error label) and four LOWs that are either one-line wording propagations, the same version-staleness class already fixed elsewhere, or accepted risks explicitly tracked against the repo's phased roadmap. None of these enables a dishonest delivery state or a semantically wrong diagram under the fixed rules, so they do not gate approval; F1–F3 should be picked up in the next editing pass.
