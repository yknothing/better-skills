#!/usr/bin/env node
"use strict";

const assert = require("assert");
const crypto = require("crypto");
const {
  buildAdvocatePrompt,
  parseScopePrompt,
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

assert.deepStrictEqual(failures(review()), [], "valid receipt should pass");

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
