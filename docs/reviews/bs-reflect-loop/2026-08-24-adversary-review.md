# Adversary Review: bs-reflect-loop

**Date**: 2026-08-24
**Reviewer Role**: Adversary
**Skill**: bs-reflect-loop
**HUMAN_VERIFIED**: false
**Scope Contract Version**: 1
**Reviewed Revision**: b5d0005aebb2bd8fcfb7389ab85d1f03f75b915d
**Reviewed Skill SHA-256**: a9a251f40de31ddc2dc56825c3fa6e369b6990f8be27a4bdd69938b5c22bc40d
**Reviewed Manifest SHA-256**: 93c5a36c556f91678fa7da9c1b78389925e03f0806dd384e01d4f796f68d8956

## Summary

The final implementation closes all previously reported Skill, authority-receipt, design-synchronization, disposition-parser, Markdown code masking, setext-heading, tag-smuggling, heading-level, and required-field blockers. No OPEN CRITICAL, HIGH, or MEDIUM finding survived the final canonical retest: two legitimate allow cases passed and eighteen rejecting variants failed closed. Gate 2 is approved for this bound scope; Gate 4 remains schema-only and supplies no behavioral verdict.

## Evidence Reviewed

Full manifest receipt acknowledged: `93c5a36c556f91678fa7da9c1b78389925e03f0806dd384e01d4f796f68d8956`.

All twelve manifest files were reviewed in full. The two refreshed validator files were reread line by line; the other ten files were revalidated byte-for-byte against their prior complete reads in this review cycle:

- `docs/superpowers/plans/2026-08-20-reflect-loop-skill.md` — `e4557051951d91788118a3176274f629f4d08f320e084052b450273b2f198d49`
- `docs/superpowers/specs/2026-08-20-reflect-loop-skill-design.md` — `15ed8ec76d2689fe3d7ade89bedd7c1d2f5d901c96964b78f02bd0ea78a52098`
- `evaluation/datasets/batch-1-test-prompts.json` — `2b6e8b9b2e9bf2d9eea612345b1422e1ed2c7e70239f0c5584d57afd38efd5d7`
- `evaluation/harness/runner.js` — `ee6e871ad26230c4073ba72151f1d6f5862c7c05074ba756bfe9b5e4e509f8f8`
- `evaluation/harness/test-runner-scope.js` — `eaa773a660417049759c7e8831444a2ec5e6f73174487662018d6c2f556e879c`
- `skills.json` — `42980748e27224d0db6f71f34c8b392eca83cc403284f53f6f176289cc044dcf`
- `skills/bs-reflect-loop/SKILL.md` — `a9a251f40de31ddc2dc56825c3fa6e369b6990f8be27a4bdd69938b5c22bc40d`
- `skills/bs-reflect-loop/references/deposition-routing.md` — `69aa751124d84926eb8c5414d412dc1562b51667b9067ec306d64afdd0fe9c3c`
- `skills/bs-reflect-loop/references/office-work.md` — `2ebb05fa5c0c39042122895f30a25fcb6d7c9c8f962ebe59ba5cee2b17e947dd`
- `skills/bs-reflect-loop/references/software-lifecycle.md` — `c4faa6121437f1856994c94c0718411a33c22fc1c62866a4f982090ff04f64d9`
- `tools/peer-review.js` — `d61524f84e64089b330edbbd94f9594a8c69e3330967ada90c3eae96844c140d`
- `tools/test-peer-review-scope.js` — `4199c19c580fa507b45fbe7ae3cf5abae2ebaf70916e1d3dbc98837c7d9b1423`

Commands and outputs examined or rerun:

- `shasum -a 256 <all 12 manifest files>` matched every hash in the refreshed prompt; `git rev-parse HEAD` returned `b5d0005aebb2bd8fcfb7389ab85d1f03f75b915d`.
- `node tools/validate.js --json skills/bs-reflect-loop` passed 16 checks with 0 failures and 0 warnings.
- `node tools/pattern-alignment.js bs-reflect-loop --json` passed with 6/6 declared patterns resolved and no drift.
- `node evaluation/harness/test-runner-scope.js` passed its assertion that schema-only checks are never upgraded to behavioral verification.
- `node evaluation/harness/runner.js --skill bs-reflect-loop --json` returned structural score 100 for 15 records while explicitly reporting `evidence_scope: EVAL_SCHEMA_ONLY`, `behavioral_verdict: NOT_RUN`, and `behaviorally_verified: false`.
- `node tools/test-peer-review-scope.js` passed the Scope Contract v1 suite and every fixed disposition regression.
- A direct `validateReviewDisposition` matrix passed two legitimate allow cases: one canonical adversary approval and one review containing a rejecting example inside a valid fence followed by one real approval.
- The same matrix failed closed on eighteen adversarial cases: an open HIGH, duplicate controlled tag pairs, controlled body tags, H4 hiding, a missing required field, tilde-fenced fake sections, bare TAB and space-plus-TAB indented fake sections, one- and two-character setext H1/H2 plus three-character setext H2 after Verdict, a contradictory global Verdict field, a post-Verdict ATX H2, duplicate Verdict sections, H1 hiding, and an invalid backtick-fence opener.
- [CommonMark 0.30 section 4.3](https://spec.commonmark.org/0.30/#setext-headings) was checked to confirm that setext underlines are not restricted to three or more characters; the final one- and two-character probes now fail closed.
- A repository-native resolver probe confirmed frontmatter name `bs-reflect-loop`, description length 464 characters, all three bundled Markdown references present, and successful runtime resolution.

No agent was run against the fifteen evaluation prompts. Gate 4 is `EVAL_SCHEMA_ONLY`, with behavior `NOT_RUN`; it is not behavioral validation.

## Findings

### F0: Reflect Loop safety and epistemic boundaries [HIGH] [RESOLVED]

**Location**: `skills/bs-reflect-loop/SKILL.md` Hard Boundaries, Entry Gate, CHALLENGE, DEPOSIT, and Handoff sections; all three bundled references
**Exploit scenario**: Earlier variants could inherit reflection state across turns, treat generic Chinese rule-tightening language as persistence authority, declare work stable during active rollback, generalize one incident, or replay a side-effecting crash or payment to fill an evidence gap.
**Root cause**: Routing, stability, mechanism validation, side-effect replay, and mutation authority had not yet been expressed as independent fail-closed contracts.
**Suggested fix**: No further fix is required for these paths. Preserve per-turn reclassification, the Stability and Validated mechanism receipts, unconditional no-replay rule, active-trigger exclusion, and independent records/remediation receipts.

### F1: Records and remediation authority remain independent [HIGH] [RESOLVED]

**Location**: `skills/bs-reflect-loop/SKILL.md` DEPOSIT, Terminal Status, and Handoff sections; `references/deposition-routing.md`
**Exploit scenario**: A prior mixed-state path could use executable-remediation authority to inflate `records_status`, or use an authorized record write to imply permission for code, governance, or automation mutation.
**Root cause**: Earlier wording coupled record deposition and remediation instead of requiring separate receipts, target scopes, execution phases, and success conditions.
**Suggested fix**: No further fix is required. Keep `records_authorized` and `remediation_authorized` independent, derive `records_status` only from record authority plus read-back, and keep executable remediation outside Reflect Loop.

### F2: Rejecting and malformed canonical dispositions fail closed [HIGH] [RESOLVED]

**Location**: `tools/peer-review.js` lines 628-796; `tools/test-peer-review-scope.js` lines 60-167
**Exploit scenario**: Previous versions could accept negated approval, duplicate or role-inappropriate Verdict values, ordinary open blocking findings, duplicate severity/status pairs, tags moved into body text, malformed H4 findings, H2-hidden findings, or findings missing required evidence fields.
**Root cause**: The earlier validator used loose substring and suffix matching without one canonical finding grammar or per-finding evidence validation.
**Suggested fix**: No further fix is required for the tested canonical forms. Preserve the exact role-specific Verdict values, single controlled tag pair, canonical H3 requirement, per-finding non-empty fields, and open-blocker regressions.

### F3: Exact remediation choice contract is synchronized [MEDIUM] [RESOLVED]

**Location**: `docs/superpowers/specs/2026-08-20-reflect-loop-skill-design.md` remediation-handoff contract; `skills/bs-reflect-loop/SKILL.md` Handoff; `references/deposition-routing.md`
**Exploit scenario**: The earlier design required another choice even when the current instruction already supplied a true remediation receipt and exact target, contradicting the Skill and routing reference.
**Root cause**: The exact-target carve-out had not been synchronized into the design source of truth.
**Suggested fix**: No further fix is required. The three surfaces now agree that exact authorized remediation may continue only in a separately declared execution phase, while ambiguity, alternatives, missing authority, and high-impact policy choices still require a bounded choice.

### F4: Markdown code masking and setext census fail closed [HIGH] [RESOLVED]

**Location**: `tools/peer-review.js` Markdown masking and disposition validation; `tools/test-peer-review-scope.js` Markdown regression matrix
**Exploit scenario**: Prior probes placed fake Findings and Verdict headings inside fences or CommonMark-indented code, or appended a setext H1/H2 after Verdict. Earlier implementations could certify code as real sections or miss a real post-Verdict heading; the final implementation rejects bare TAB, space-plus-TAB tab-stop variants, one- and two-character setext underlines, and invalid backtick-fence masking while ignoring valid fenced examples.
**Root cause**: The earlier raw-line census lacked block masking, CommonMark tab-stop column handling, complete setext lengths, and backtick-info validation. The final parser masks valid fenced and indented code, rejects all setext headings in scoped reviews, and leaves invalid fence openers visible to the global Verdict census.
**Suggested fix**: No further fix is required for the tested Markdown contract. Preserve the fenced-code, tab-stop, one/two-character setext, invalid-fence, global-field, and H1-H6 regressions.

### F5: Final canonical attack surface has no surviving blocker [LOW] [RESOLVED]

**Location**: Final direct disposition matrix and all twelve files bound by manifest receipt `93c5a36c556f91678fa7da9c1b78389925e03f0806dd384e01d4f796f68d8956`
**Exploit scenario**: The final pass retried canonical approval plus rejecting dispositions, role mismatch, duplicate and negated Verdicts, open blocker severities, alternate ATX forms, extra controlled tags, body tags, H1-H6 hiding, absent evidence fields, fenced and indented code, setext headings, and invalid fence syntax. None produced an unauthorized approval; the two intended allow cases remained accepted.
**Root cause**: The scoped review grammar now derives release eligibility from one controlled global Verdict, role-specific values, one normalized section order, canonical structured findings, exact controlled tag counts, required non-empty fields, blocker disposition, and block-aware Markdown preprocessing.
**Suggested fix**: Keep the fixed regression matrix mandatory whenever review grammar or Markdown preprocessing changes; no implementation change is requested by this resolved finding.

## Verdict

**Verdict**: APPROVED

All historical blocking findings are explicitly RESOLVED, the final prompt receipt matches all twelve current files, and the canonical Markdown/disposition matrix has no surviving direct bypass. The adversary review therefore approves Gate 2 for this bound revision and manifest. Gate 4 remains `EVAL_SCHEMA_ONLY` with `behavioral_verdict: NOT_RUN`; this approval makes no behavioral claim.
