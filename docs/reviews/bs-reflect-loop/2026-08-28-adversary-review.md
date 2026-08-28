# Adversary Review: bs-reflect-loop

**Date**: 2026-08-28
**Reviewer Role**: Adversary
**Skill**: bs-reflect-loop
**HUMAN_VERIFIED**: false
**Scope Contract Version**: 1
**Reviewed Revision**: 5373570b138ee71ffe9cd6bb15bbd331368227bd
**Reviewed Skill SHA-256**: 19e76aefec41dad0b92ca7d74057e872e29ff5b4d29a70e6cdfa6bda257fbb62
**Reviewed Manifest SHA-256**: 0eaf028cb9b3624f1c9279c1bbf61dcfc564581005aad3f021e78bc93b17c2c6

## Summary

F1 through F8 are closed on the frozen revision, with no surviving Critical-, High-, or Medium-severity issue. Revision `5373570` preserves escaped-backtick handling for code-span openers while correctly allowing every equal-length run inside an active span to close it, preventing a real raw-HTML opener from being masked. The adversary verdict is approval, bounded by Gate 4 remaining schema-only rather than behavioral execution.

## Evidence Reviewed

Full manifest receipt `0eaf028cb9b3624f1c9279c1bbf61dcfc564581005aad3f021e78bc93b17c2c6` was received and independently verified.

- Read the regenerated adversary prompt in full. Reused the prior full reads of unchanged manifest files only after confirming identical SHA-256 values, then read the complete `43aecf9` and `5373570` patches for `tools/peer-review.js` and `tools/test-peer-review-scope.js`.
- Verified `git rev-parse HEAD` as `5373570b138ee71ffe9cd6bb15bbd331368227bd`; independently recomputed all twelve file hashes and the manifest receipt, with no mismatch.
- Ran `node tools/test-peer-review-scope.js`: pass. This replays the fenced scaffold, inline-code declaration, unclosed-comment, same-line raw-script, four split/unterminated Type-1 fixtures, escaped opener, and escaped-looking closer through complete `checkOneReview` calls.
- Ran an additional complete-fixture matrix. Eleven line-start forms were rejected: unclosed comment, processing instruction, declaration, CDATA, split `script`, split `pre`, split `style`, split `textarea`, ordinary opening tag, ordinary closing tag, and custom tag. Seven controls were accepted without any issue: backtick fence, tilde fence, four-space indentation, tab indentation, inline code, escaped literal, and a non-opener angle-bracket form.
- Confirmed the code-span rule against the official CommonMark 0.31.2 specification: backslash escapes apply before an opener but do not operate inside an active code span. Reproduced the former escaped-closer false green on `43aecf9`, then verified on `5373570` that all fifteen combinations of delimiter lengths one through three and zero through four preceding backslashes expose the following raw script opener and fail closed.
- Tested four escaped-opener parity cases and five adjacent combinations covering mismatched-then-matched delimiters, backslash content, single backticks inside double-delimited spans, fenced code, and indented code. Odd opener parity exposes raw HTML, even parity forms a real code span, and every control matched the CommonMark boundary.
- Inspected the conservative rule boundary: after fenced, indented, and inline code are masked, a code-region-external line beginning with up to three spaces and then an angle bracket followed by a letter, slash, exclamation mark, or question mark fails closed. This covers every CommonMark raw-HTML block opener class relevant to the review surface.
- Ran `node --check tools/peer-review.js`, `node evaluation/harness/test-runner-scope.js`, `node tools/validate.js --json skills/bs-reflect-loop`, `node tools/pattern-alignment.js bs-reflect-loop --json`, and `bash tools/test-cli.sh`: syntax passed, runner-scope passed, Gate 1 was 16/16, Gate 3 passed without warnings, and CLI was 86/86.
- Ran `node evaluation/harness/runner.js --skill bs-reflect-loop --json`: 15 contracts, structural score 100, `EVAL_SCHEMA_ONLY`, behavior `NOT_RUN`.
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

Revision `5373570` closes F8 without reopening F1 through F7, the bound manifest is exact and current, and all scoped structural gates pass. This approval covers Gate 2 release eligibility for the frozen implementation; it does not upgrade the harness's explicit `EVAL_SCHEMA_ONLY` and `NOT_RUN` behavioral boundary.
