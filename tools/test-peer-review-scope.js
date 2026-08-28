#!/usr/bin/env node
"use strict";

const assert = require("assert");
const crypto = require("crypto");
const fs = require("fs");
const os = require("os");
const path = require("path");
const {
  buildAdvocatePrompt,
  checkOneReview,
  parseScopePrompt,
  validateReviewDisposition,
  validateScopeContractContent,
} = require("./peer-review");

const skillName = "bs-ppt-master";
const skillContent = require("fs").readFileSync(`skills/${skillName}/SKILL.md`, "utf8");
const prompt = buildAdvocatePrompt(skillName, skillContent);
const expected = parseScopePrompt(prompt);

function review(overrides = {}) {
  const revision = overrides.revision || expected.revision;
  const skillHash = overrides.skillHash || expected.skillHash;
  const manifestHash = overrides.manifestHash || expected.manifestHash;
  const evidence = Object.prototype.hasOwnProperty.call(overrides, "evidence")
    ? overrides.evidence
    : `Full manifest receipt: ${manifestHash}`;
  return `# Advocate Review: ${skillName}

**Date**: 2026-08-21
**Reviewer Role**: Advocate
**Skill**: ${skillName}
**HUMAN_VERIFIED**: false
**Scope Contract Version**: 1
**Reviewed Revision**: ${revision}
**Reviewed Skill SHA-256**: ${skillHash}
**Reviewed Manifest SHA-256**: ${manifestHash}

## Executive Summary

Synthetic scope-contract regression fixture.

## Evidence Reviewed

${evidence}

## Dimension Scores

8/10

## Verdict

**Verdict**: PASS
`;
}

function failures(reviewContent, promptContent = prompt) {
  return validateScopeContractContent(reviewContent, promptContent, skillName)
    .filter((issue) => !issue.passed)
    .map((issue) => issue.label);
}

function structuredAdversaryReview(headingLine, verdict = "APPROVED", beforeVerdict = "", afterVerdict = "") {
  return `## Findings

${headingLine}

**Location**: synthetic location
**Exploit scenario**: synthetic exploit
**Root cause**: synthetic cause
**Suggested fix**: synthetic fix

${beforeVerdict}## Verdict

**Verdict**: ${verdict}
${afterVerdict}`;
}

assert.deepStrictEqual(failures(review()), [], "valid receipt should pass");

const fencedMetadataDir = fs.mkdtempSync(path.join(os.tmpdir(), "peer-review-fenced-"));
const fencedMetadataPath = path.join(fencedMetadataDir, "review.md");
fs.writeFileSync(fencedMetadataPath, `\`\`\`markdown
# Advocate Review: synthetic-skill

**Date**: 2099-01-01
**Reviewer Role**: Advocate
**Skill**: synthetic-skill
**HUMAN_VERIFIED**: false

## Executive Summary

8/10

## Verdict

**Verdict**: PASS
\`\`\`
`);
const fencedMetadataFailures = checkOneReview("synthetic-skill", {
  absPath: fencedMetadataPath,
  date: "2099-01-01",
  role: "advocate",
}).filter((issue) => !issue.passed).map((issue) => issue.label);
for (const label of [
  "H1 title contains role and skill name",
  "Date metadata matches filename",
  "Reviewer role declared and matches filename",
  "Skill metadata present and matches",
  "Summary section present",
  "Verdict / score marker present",
  "At least one dimension score (advocate, e.g. 8/10 or 85/100)",
  "HUMAN_VERIFIED marker present",
]) {
  assert(
    fencedMetadataFailures.includes(label),
    `fenced Markdown must not satisfy review metadata: ${label}`,
  );
}
fs.rmSync(fencedMetadataDir, { recursive: true, force: true });

const fencedScopeReceipt = `\`\`\`markdown
**Scope Contract Version**: 1
**Reviewed Revision**: ${expected.revision}
**Reviewed Skill SHA-256**: ${expected.skillHash}
**Reviewed Manifest SHA-256**: ${expected.manifestHash}

## Evidence Reviewed

Full manifest receipt: ${expected.manifestHash}
\`\`\`
`;
const fencedScopeFailures = failures(fencedScopeReceipt);
for (const label of [
  "Scope Contract Version matches prompt",
  "Reviewed Revision matches prompt",
  "Reviewed Skill SHA-256 matches prompt",
  "Reviewed Manifest SHA-256 matches prompt",
  "Evidence Reviewed acknowledges full manifest receipt",
]) {
  assert(
    fencedScopeFailures.includes(label),
    `fenced Markdown must not satisfy scope receipt: ${label}`,
  );
}

const commentedScopeReceipt = `<!--
**Scope Contract Version**: 1
**Reviewed Revision**: ${expected.revision}
**Reviewed Skill SHA-256**: ${expected.skillHash}
**Reviewed Manifest SHA-256**: ${expected.manifestHash}

## Evidence Reviewed

Full manifest receipt: ${expected.manifestHash}
-->
`;
const commentedScopeFailures = failures(commentedScopeReceipt);
for (const label of [
  "Scope Contract Version matches prompt",
  "Reviewed Revision matches prompt",
  "Reviewed Skill SHA-256 matches prompt",
  "Reviewed Manifest SHA-256 matches prompt",
  "Evidence Reviewed acknowledges full manifest receipt",
]) {
  assert(
    commentedScopeFailures.includes(label),
    `HTML comments must not satisfy scope receipt: ${label}`,
  );
}

const inlineReviewDir = fs.mkdtempSync(path.join(os.tmpdir(), "peer-review-inline-"));
const inlineReviewPath = path.join(inlineReviewDir, "review.md");
const inlinePromptPath = path.join(inlineReviewDir, "prompt.md");
fs.writeFileSync(inlinePromptPath, prompt);
fs.writeFileSync(inlineReviewPath, `# Advocate Review: ${skillName}

\`**Date**: 2099-01-01\`
\`**Reviewer Role**: Advocate\`
\`**Skill**: ${skillName}\`
\`**HUMAN_VERIFIED**: false\`
\`**Scope Contract Version**: 1\`
\`**Reviewed Revision**: ${expected.revision}\`
\`**Reviewed Skill SHA-256**: ${expected.skillHash}\`
\`**Reviewed Manifest SHA-256**: ${expected.manifestHash}\`

## Executive Summary

Real visible summary.

## Evidence Reviewed

\`Full manifest receipt: ${expected.manifestHash}\`

## Dimension Scores

8/10

## Verdict

**Verdict**: PASS
`);
const inlineReviewIssues = checkOneReview(skillName, {
  absPath: inlineReviewPath,
  date: "2099-01-01",
  role: "advocate",
  promptPath: inlinePromptPath,
});
for (const label of [
  "Date metadata matches filename",
  "Reviewer role declared and matches filename",
  "Skill metadata present and matches",
  "HUMAN_VERIFIED marker present",
  "Scope Contract Version matches prompt",
  "Reviewed Revision matches prompt",
  "Reviewed Skill SHA-256 matches prompt",
  "Reviewed Manifest SHA-256 matches prompt",
  "Evidence Reviewed acknowledges full manifest receipt",
]) {
  assert(
    inlineReviewIssues.some((issue) => issue.label === label && !issue.passed),
    `inline code must not satisfy full review check: ${label}`,
  );
}

const unclosedCommentReviewPath = path.join(inlineReviewDir, "unclosed-comment-review.md");
fs.writeFileSync(unclosedCommentReviewPath, `<!--
# Advocate Review: ${skillName}

**Date**: 2099-01-01
**Reviewer Role**: Advocate
**Skill**: ${skillName}
**HUMAN_VERIFIED**: false
**Scope Contract Version**: 1
**Reviewed Revision**: ${expected.revision}
**Reviewed Skill SHA-256**: ${expected.skillHash}
**Reviewed Manifest SHA-256**: ${expected.manifestHash}

## Executive Summary

Hidden summary.

## Evidence Reviewed

Full manifest receipt \`${expected.manifestHash}\` was received and independently verified.

## Dimension Scores

8/10

## Verdict

**Verdict**: PASS
`);
const unclosedCommentIssues = checkOneReview(skillName, {
  absPath: unclosedCommentReviewPath,
  date: "2099-01-01",
  role: "advocate",
  promptPath: inlinePromptPath,
});
for (const label of [
  "H1 title contains role and skill name",
  "Date metadata matches filename",
  "Reviewer role declared and matches filename",
  "Skill metadata present and matches",
  "Summary section present",
  "HUMAN_VERIFIED marker present",
  "Scope Contract Version matches prompt",
  "Reviewed Revision matches prompt",
  "Reviewed Skill SHA-256 matches prompt",
  "Reviewed Manifest SHA-256 matches prompt",
  "Evidence Reviewed acknowledges full manifest receipt",
]) {
  assert(
    unclosedCommentIssues.some((issue) => issue.label === label && !issue.passed),
    `unclosed HTML comment must not satisfy full review check: ${label}`,
  );
}

const rawHtmlReviewPath = path.join(inlineReviewDir, "raw-html-review.md");
fs.writeFileSync(rawHtmlReviewPath, `<script type="text/plain">
# Advocate Review: ${skillName}

**Date**: 2099-01-01
**Reviewer Role**: Advocate
**Skill**: ${skillName}
**HUMAN_VERIFIED**: false
**Scope Contract Version**: 1
**Reviewed Revision**: ${expected.revision}
**Reviewed Skill SHA-256**: ${expected.skillHash}
**Reviewed Manifest SHA-256**: ${expected.manifestHash}

## Executive Summary

Hidden summary.

## Evidence Reviewed

Full manifest receipt \`${expected.manifestHash}\` was received and independently verified.

## Dimension Scores

8/10

## Verdict

**Verdict**: PASS
</script>
`);
const rawHtmlIssues = checkOneReview(skillName, {
  absPath: rawHtmlReviewPath,
  date: "2099-01-01",
  role: "advocate",
  promptPath: inlinePromptPath,
});
assert(
  rawHtmlIssues.some((issue) => issue.label === "Scoped review contains no raw HTML blocks" && !issue.passed),
  "raw HTML blocks must make a scoped review fail closed",
);

for (const tag of ["script", "pre", "style", "textarea"]) {
  const splitRawHtmlPath = path.join(inlineReviewDir, `split-${tag}-review.md`);
  fs.writeFileSync(splitRawHtmlPath, `<${tag}
 type="text/plain">
# Advocate Review: ${skillName}

**Date**: 2099-01-01
**Reviewer Role**: Advocate
**Skill**: ${skillName}
**HUMAN_VERIFIED**: false
**Scope Contract Version**: 1
**Reviewed Revision**: ${expected.revision}
**Reviewed Skill SHA-256**: ${expected.skillHash}
**Reviewed Manifest SHA-256**: ${expected.manifestHash}

## Executive Summary

Hidden summary.

## Evidence Reviewed

Full manifest receipt \`${expected.manifestHash}\` was received and independently verified.

## Dimension Scores

8/10

## Verdict

**Verdict**: PASS
`);
  const splitRawHtmlIssues = checkOneReview(skillName, {
    absPath: splitRawHtmlPath,
    date: "2099-01-01",
    role: "advocate",
    promptPath: inlinePromptPath,
  });
  assert(
    splitRawHtmlIssues.some((issue) => issue.label === "Scoped review contains no raw HTML blocks" && !issue.passed),
    `split unclosed <${tag} raw HTML block must make a scoped review fail closed`,
  );
}

const escapedBacktickHtmlPath = path.join(inlineReviewDir, "escaped-backtick-html-review.md");
fs.writeFileSync(escapedBacktickHtmlPath, `\\\`
<script
\`
# Advocate Review: ${skillName}

**Date**: 2099-01-01
**Reviewer Role**: Advocate
**Skill**: ${skillName}
**HUMAN_VERIFIED**: false
**Scope Contract Version**: 1
**Reviewed Revision**: ${expected.revision}
**Reviewed Skill SHA-256**: ${expected.skillHash}
**Reviewed Manifest SHA-256**: ${expected.manifestHash}

## Executive Summary

Hidden summary.

## Evidence Reviewed

Full manifest receipt \`${expected.manifestHash}\` was received and independently verified.

## Dimension Scores

8/10

## Verdict

**Verdict**: PASS
`);
const escapedBacktickHtmlIssues = checkOneReview(skillName, {
  absPath: escapedBacktickHtmlPath,
  date: "2099-01-01",
  role: "advocate",
  promptPath: inlinePromptPath,
});
assert(
  escapedBacktickHtmlIssues.some((issue) => issue.label === "Scoped review contains no raw HTML blocks" && !issue.passed),
  "a backslash-escaped backtick must not hide a raw HTML opener from the scoped review check",
);
fs.rmSync(inlineReviewDir, { recursive: true, force: true });

assert.strictEqual(
  validateReviewDisposition("## Verdict\n\n**Verdict**: PASS").passed,
  true,
  "explicit PASS disposition should be release-eligible",
);
assert.strictEqual(
  validateReviewDisposition("## Verdict\n\n**Verdict**: REQUIRES_CHANGES").passed,
  false,
  "REQUIRES_CHANGES disposition must fail Gate 2",
);
assert.strictEqual(
  validateReviewDisposition("## Verdict\n\n**Verdict**: NEEDS_POLISH (73/80)").passed,
  false,
  "NEEDS_POLISH disposition must fail Gate 2 even with a numeric score",
);
assert.strictEqual(
  validateReviewDisposition("## Verdict\n\n73/80").passed,
  false,
  "a score without an explicit approval disposition must not release",
);
assert.strictEqual(
  validateReviewDisposition("## Verdict\n\n**Verdict**: NOT APPROVED").passed,
  false,
  "a negated approval must not release",
);
assert.strictEqual(
  validateReviewDisposition("## Verdict\n\n**Verdict**: PASS\n**Verdict**: NEEDS_POLISH").passed,
  false,
  "duplicate or contradictory verdict fields must not release",
);
assert.strictEqual(
  validateReviewDisposition("## Findings\n\n### F1: unresolved bypass [HIGH] [OPEN]\n\nStill open.\n\n## Verdict\n\n**Verdict**: APPROVED", "adversary").passed,
  false,
  "an unresolved HIGH finding must block adversary approval",
);
assert.strictEqual(
  validateReviewDisposition(structuredAdversaryReview("### F1: prior bypass [HIGH] [RESOLVED]"), "adversary").passed,
  true,
  "an explicitly RESOLVED prior HIGH finding may coexist with approval",
);
assert.strictEqual(
  validateReviewDisposition("## Verdict\n\n**Verdict**: PASS\n\n## Verdict\n\n**Verdict**: NEEDS_POLISH").passed,
  false,
  "multiple Verdict sections must not release",
);
assert.strictEqual(
  validateReviewDisposition("## Findings\n\n### F1: ambiguous status [HIGH] NOT RESOLVED\n\nStill open.\n\n## Verdict\n\n**Verdict**: APPROVED", "adversary").passed,
  false,
  "free-form NOT RESOLVED text must not count as structured closure",
);
assert.strictEqual(
  validateReviewDisposition("## Findings\n\n### F1: severity moved to body\n\nSeverity: HIGH. Still open.\n\n## Verdict\n\n**Verdict**: APPROVED", "adversary").passed,
  false,
  "adversary finding headings without severity and status must fail closed",
);
assert.strictEqual(
  validateReviewDisposition("## Findings\n\n### F1: unresolved design gap [MEDIUM] [OPEN]\n\nStill open.\n\n## Verdict\n\n**Verdict**: APPROVED", "adversary").passed,
  false,
  "an unresolved MEDIUM finding must block adversary approval",
);
assert.strictEqual(
  validateReviewDisposition("## Findings\n\n### F1: checked surface [LOW] [RESOLVED]\n\n#### F2: hidden bypass [HIGH] [OPEN]\n\n## Verdict\n\n**Verdict**: APPROVED", "adversary").passed,
  false,
  "a blocking finding hidden under a different heading level must fail closed",
);
assert.strictEqual(
  validateReviewDisposition(structuredAdversaryReview("### F1: tag smuggling [HIGH] [OPEN] [LOW] [RESOLVED]"), "adversary").passed,
  false,
  "multiple severity or status tags must not let the final pair hide a blocker",
);
assert.strictEqual(
  validateReviewDisposition(structuredAdversaryReview("   ### F1: indented blocker [HIGH] [OPEN]"), "adversary").passed,
  false,
  "an indented Markdown finding heading must not bypass the census",
);
assert.strictEqual(
  validateReviewDisposition(structuredAdversaryReview("### F1: checked surface [LOW] [RESOLVED]", "APPROVED", "## F2: hidden blocker [HIGH] [OPEN]\n\n"), "adversary").passed,
  false,
  "a blocking H2 inserted between Findings and Verdict must fail closed",
);
assert.strictEqual(
  validateReviewDisposition(`${structuredAdversaryReview("### F1: checked surface [LOW] [RESOLVED]")}\n\n## Verdict ##\n\n**Verdict**: REQUIRES_CHANGES`, "adversary").passed,
  false,
  "a second Markdown-equivalent Verdict section must fail closed",
);
assert.strictEqual(
  validateReviewDisposition("## Findings\n\n### F1: missing evidence fields [LOW] [RESOLVED]\n\n## Verdict\n\n**Verdict**: APPROVED", "adversary").passed,
  false,
  "an adversary finding without required evidence fields must not release",
);
assert.strictEqual(
  validateReviewDisposition("~~~markdown\n## Verdict\n\n**Verdict**: PASS\n~~~").passed,
  false,
  "a fake Verdict inside a fenced code block must not release",
);
assert.strictEqual(
  validateReviewDisposition("\t## Verdict\n\n\t**Verdict**: PASS").passed,
  false,
  "a fake Verdict inside tab-indented code must not release",
);
assert.strictEqual(
  validateReviewDisposition(" \t## Verdict\n\n**Verdict**: PASS").passed,
  false,
  "a space-plus-tab indented code block must not release",
);
assert.strictEqual(
  validateReviewDisposition("  \t## Verdict\n\n**Verdict**: PASS").passed,
  false,
  "a two-spaces-plus-tab indented code block must not release",
);
assert.strictEqual(
  validateReviewDisposition("## Verdict\n\n**Verdict**: PASS\n\nHidden section\n---").passed,
  false,
  "a setext H2 after Verdict must not bypass the final-section check",
);
assert.strictEqual(
  validateReviewDisposition("## Verdict\n\n**Verdict**: PASS\n\nHidden section\n=").passed,
  false,
  "a one-character setext H1 underline must fail closed",
);
assert.strictEqual(
  validateReviewDisposition("## Verdict\n\n**Verdict**: PASS\n\nHidden section\n--").passed,
  false,
  "a two-character setext H2 underline must fail closed",
);
assert.strictEqual(
  validateReviewDisposition("```markdown\n## Verdict\n**Verdict**: NEEDS_POLISH\n```\n\n## Verdict\n\n**Verdict**: PASS").passed,
  true,
  "a fenced example must be ignored when one real controlled Verdict follows",
);
assert.strictEqual(
  validateReviewDisposition("**Verdict**: REQUIRES_CHANGES\n\n## Verdict\n\n**Verdict**: PASS").passed,
  false,
  "a contradictory Verdict field outside the Verdict section must fail closed",
);
assert.strictEqual(
  validateReviewDisposition(structuredAdversaryReview("### F1: checked surface [LOW] [RESOLVED]", "APPROVED", "# F2: hidden blocker\n\n"), "adversary").passed,
  false,
  "an H1 hidden inside Findings must be included in the heading census",
);
assert.strictEqual(
  validateReviewDisposition(structuredAdversaryReview("### F1: checked surface [LOW] [RESOLVED]", "APPROVED", "F2: hidden blocker\n===\n\n"), "adversary").passed,
  false,
  "a setext H1 hidden inside Findings must fail closed",
);
assert.strictEqual(
  validateReviewDisposition("```bad`\n**Verdict**: REQUIRES_CHANGES\n```\n\n## Verdict\n\n**Verdict**: PASS").passed,
  false,
  "an invalid backtick fence opener must not hide a rejecting Verdict field",
);

assert(
  failures(review({ revision: "0000000" })).includes("Reviewed Revision matches prompt"),
  "wrong revision must fail",
);

assert(
  failures(review({ evidence: "skills/bs-ppt-master/ skills.json evaluation/datasets/batch-1-test-prompts.json" }))
    .includes("Evidence Reviewed acknowledges full manifest receipt"),
  "broad roots without the manifest receipt must fail",
);

assert(
  failures(review({ manifestHash: "0".repeat(64) })).includes("Reviewed Manifest SHA-256 matches prompt"),
  "wrong manifest receipt must fail",
);

const firstEntry = prompt.match(/^- `([^`]+)` — `([0-9a-f]{64})`$/m);
assert(firstEntry, "generated prompt must contain a manifest entry");
const stalePromptBody = prompt.replace(firstEntry[0], `- \`${firstEntry[1]}\` — \`${"0".repeat(64)}\``);
const staleManifest = [...stalePromptBody.matchAll(/^- `([^`]+)` — `([0-9a-f]{64})`$/gim)]
  .map((match) => `- \`${match[1]}\` — \`${match[2]}\``)
  .join("\n");
const staleManifestHash = crypto.createHash("sha256").update(staleManifest).digest("hex");
const stalePrompt = stalePromptBody.replace(
  /\*\*Reviewed Manifest SHA-256 to record\*\*:\s*[0-9a-f]{64}/i,
  `**Reviewed Manifest SHA-256 to record**: ${staleManifestHash}`,
);
assert(
  failures(review({ manifestHash: staleManifestHash }), stalePrompt)
    .includes("Prompt manifest matches required scope and current files"),
  "a self-consistent but stale file hash must fail",
);

const completeEntryLines = [...prompt.matchAll(/^- `([^`]+)` — `([0-9a-f]{64})`$/gim)];
assert(completeEntryLines.length > 1, "generated prompt must contain multiple manifest entries");
const omittedPromptBody = prompt.replace(`${completeEntryLines[0][0]}\n`, "");
const omittedManifest = [...omittedPromptBody.matchAll(/^- `([^`]+)` — `([0-9a-f]{64})`$/gim)]
  .map((match) => `- \`${match[1]}\` — \`${match[2]}\``)
  .join("\n");
const omittedManifestHash = crypto.createHash("sha256").update(omittedManifest).digest("hex");
const omittedPrompt = omittedPromptBody.replace(
  /\*\*Reviewed Manifest SHA-256 to record\*\*:\s*[0-9a-f]{64}/i,
  `**Reviewed Manifest SHA-256 to record**: ${omittedManifestHash}`,
);
assert(
  failures(review({ manifestHash: omittedManifestHash }), omittedPrompt)
    .includes("Prompt manifest matches required scope and current files"),
  "a missing required entry with a recomputed receipt must fail",
);

console.log("PASS: Scope Contract v1 validates exact revision, required manifest set, receipt, and current file hashes");
