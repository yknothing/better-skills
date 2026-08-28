# Adversary Review: bs-reflect-loop

**Date**: 2026-08-28
**Reviewer Role**: Adversary
**Skill**: bs-reflect-loop
**HUMAN_VERIFIED**: false
**Scope Contract Version**: 1
**Reviewed Revision**: 4f3611455e55b6f41c5d7facd429a8df7f83dc45
**Reviewed Skill SHA-256**: 19e76aefec41dad0b92ca7d74057e872e29ff5b4d29a70e6cdfa6bda257fbb62
**Reviewed Manifest SHA-256**: c2bbc9254f5f2e0ddd0bdebdef4ab874151ced0961d9fffb008f2df828001b19

## Summary

F1 through F8 remain closed on the post-merge revision, with no surviving Critical-, High-, or Medium-severity issue. The merge adds the UML registry and evaluation entries without changing the `bs-reflect-loop` registry or 15-evaluation subtrees, and the parser still rejects stale receipts and every previously reproduced hidden-review bypass. The adversary verdict is approval, bounded by Gate 4 remaining schema-only rather than behavioral execution.

## Evidence Reviewed

Full manifest receipt `c2bbc9254f5f2e0ddd0bdebdef4ab874151ced0961d9fffb008f2df828001b19` was received and independently verified.

- Read the regenerated post-merge adversary prompt in full and reviewed the complete bound scope. Unchanged files were reused only after their SHA-256 values matched the prior full reads; the changed dataset and registry were inspected together with both merge-parent diffs.
- Verified `git rev-parse HEAD` as merge revision `4f3611455e55b6f41c5d7facd429a8df7f83dc45`; independently recomputed all twelve file hashes and manifest receipt `c2bbc9254f5f2e0ddd0bdebdef4ab874151ced0961d9fffb008f2df828001b19`.
- Compared the current `bs-reflect-loop` objects in `skills.json` and `evaluation/datasets/batch-1-test-prompts.json` with first parent `dc5329c`: both subtrees are byte-for-byte equivalent after JSON parsing. The mainline contribution adds `bs-uml-master` without rewriting the reflect contract.
- Parsed the merged registry and dataset and checked set equality: 13 self-developed skills match 13 dataset keys, every self-developed skill appears in Batch 1, the 22-entry batch list has no duplicate, and all 15 reflect evaluation IDs and required fields are unique and non-empty.
- Attacked the authority cases after merge. The executable-boundary case retains positive remediation authority; mixed status keeps record and remediation authority independent; the Chinese cross-turn case retains both negative receipts and `CHAT_ONLY`; side-effect replay remains evidence-blocked. Terminal Status still exposes 11 of 11 machine fields and Output Contract 11 of 11 visible fields.
- Ran the current, still-old review through `checkOneReview` before updating it: the parser rejected the stale revision, stale manifest receipt, and stale Evidence Reviewed receipt. This demonstrated that the automatic merge could not inherit the previous approval silently.
- Ran `node tools/test-peer-review-scope.js`: pass. Replayed the post-merge delimiter matrix: all fifteen equal-delimiter closer and backslash-parity combinations exposed the following raw script opener and failed closed; four opener-parity controls matched CommonMark semantics.
- Scanned all twelve manifest files for merge markers and found none. Ran `node --check tools/peer-review.js`, `node evaluation/harness/test-runner-scope.js`, `node tools/validate.js --json skills/bs-reflect-loop`, `node tools/pattern-alignment.js bs-reflect-loop --json`, and `bash tools/test-cli.sh`: syntax and runner scope passed, Gate 1 was 16/16, Gate 3 passed without warnings, and CLI was 86/86.
- Ran `node evaluation/harness/runner.js --skill bs-reflect-loop --json`: exactly 15 contracts, structural score 100, `EVAL_SCHEMA_ONLY`, behavior `NOT_RUN`; the merged UML entries did not leak into the targeted run.
- Reverified frontmatter name `bs-reflect-loop`, non-empty 464-character description, all three referenced Markdown files, and runtime resolution through `require('./lib/resolver').resolveSource('bs-reflect-loop')` to the existing self-developed skill directory.

## Findings

### F1: Fenced scaffold satisfies unmasked Gate 2 identity and evidence checks [HIGH] [RESOLVED]

**Location**: `tools/peer-review.js` canonical code masking and complete fenced-review regressions
**Exploit scenario**: Required declarations existed only inside a fenced block, allowing inert examples to impersonate the review. The complete current path rejects those declarations.
**Root cause**: Earlier checks interpreted raw Markdown inconsistently; shared block-code masking now removes the inert region before every controlled declaration check.
**Suggested fix**: No further change is required; retain the full-path fenced regression.

### F2: Authority receipts are missing from terminal and output contracts [MEDIUM] [RESOLVED]

**Location**: `skills/bs-reflect-loop/SKILL.md` Terminal Status, Output Contract, and remediation handoff
**Exploit scenario**: A reflection could previously report record deposition or remediation progress without exposing the independent authority source and exact target scope. Both record and remediation receipts are now mandatory and composable.
**Root cause**: The earlier output exposed derived status fields but omitted the two authority axes; the frozen skill now carries both through the terminal schema and conversational contract.
**Suggested fix**: No further schema change is required; retain the authority-focused evaluation contracts.

### F3: Inline-code declarations produce a complete Gate 2 false green [HIGH] [RESOLVED]

**Location**: `tools/peer-review.js` inline-span masking, anchored metadata, and visible manifest-receipt prefix
**Exploit scenario**: Metadata and the receipt were wrapped in inline code so visually inert literals satisfied the gate. Equal-length backtick masking and line anchors now reject the fixture.
**Root cause**: Earlier masking covered block code but not inline spans, and the receipt check did not require a visible controlled prefix.
**Suggested fix**: No further inline-span change is required; retain the complete inline fixture.

### F4: Unclosed HTML comment hides an entire review [HIGH] [RESOLVED]

**Location**: `tools/peer-review.js` HTML-comment masking and the unclosed-comment complete fixture
**Exploit scenario**: An unmatched comment opener hid the review through end-of-file while hidden declarations were counted. The masker now consumes from the opener to the first closer or end-of-file, so the declarations fail.
**Root cause**: The former expression recognized only closed comments.
**Suggested fix**: No further comment-specific change is required; retain both closed and unclosed comment regressions.

### F5: Raw script container hides an entire review [HIGH] [RESOLVED]

**Location**: `tools/peer-review.js` scoped raw-HTML rejection and complete script-container fixture
**Exploit scenario**: A whole review inside a same-line raw script container previously satisfied the textual gate while remaining non-visible. The current scoped check returns a dedicated failure before the review can release.
**Root cause**: Earlier logic masked selected hidden syntaxes but did not reject raw HTML blocks as a class.
**Suggested fix**: No further same-line-container change is required; retain the dedicated issue and code-region controls.

### F6: Split Type-1 opener bypasses raw-HTML rejection [HIGH] [RESOLVED]

**Location**: `tools/peer-review.js` `validateNoRawHtmlBlocks` and the four split/unterminated Type-1 fixtures
**Exploit scenario**: A raw-element name ended at line end, with attributes and the closing angle bracket on the next line and no closing element. The previous complete-tag expression missed the opener; the current line-start rule rejects it immediately for `script`, `pre`, `style`, and `textarea`.
**Root cause**: The earlier detector modeled a complete generic tag on one line instead of the broader CommonMark block-start boundary. Revision `643b003` replaces it with a conservative prefix gate after code masking.
**Suggested fix**: No further blocking change is required. Retain the four full-path fixtures and the adjacent code/literal controls so later precision work cannot reopen the bypass.

### F7: Escaped code-span opener masks a raw-HTML block [HIGH] [RESOLVED]

**Location**: `tools/peer-review.js` `maskInlineCodeSpans` opener classification and escaped-opener complete fixture
**Exploit scenario**: A backslash-escaped backtick was treated as a real code-span opener and paired with a later backtick, masking an intervening raw script opener from the scoped check. Odd consecutive backslashes now keep the opener literal, while even parity leaves it active as CommonMark requires.
**Root cause**: The first inline scanner treated every backtick run as a delimiter without checking whether its opener was escaped in normal Markdown text.
**Suggested fix**: No further opener change is required; retain odd and even parity controls plus the complete escaped-opener fixture.

### F8: Escaped-looking closer inside an active code span remains open [HIGH] [RESOLVED]

**Location**: `tools/peer-review.js` `maskInlineCodeSpans` closer search and escaped-closer complete fixture
**Exploit scenario**: After a real opener, an equal-length closer preceded by an odd backslash count was skipped. A later backtick after a raw script opener closed the scanner's span, producing a complete false green although CommonMark had already closed the real span before the raw block.
**Root cause**: Revision `43aecf9` applied normal-text backslash escape rules to both opener and closer, but CommonMark does not process backslash escapes inside code spans. Revision `5373570` limits escape classification to the opener and treats every equal-length run inside the span as a closer.
**Suggested fix**: No further closer change is required; retain the complete fixture and the delimiter-length/backslash-parity matrix.

## Verdict

**Verdict**: APPROVED

Merge revision `4f3611455e55b6f41c5d7facd429a8df7f83dc45` preserves the complete F1 through F8 fixes, the merged registry and dataset remain internally consistent, and the bound manifest is exact and current. This approval covers Gate 2 release eligibility for the post-merge tree; it does not upgrade the harness's explicit `EVAL_SCHEMA_ONLY` and `NOT_RUN` behavioral boundary.
