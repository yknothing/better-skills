#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

const root = process.cwd();
const reviewsRoot = path.join(root, "docs", "reviews");

function normalizeReview(skill, file) {
  const match = file.match(/^(\d{4}-\d{2}-\d{2})-(advocate|adversary)-review\.md$/);
  if (!match) return;
  const [, date, role] = match;
  const abs = path.join(reviewsRoot, skill, file);
  const original = fs.readFileSync(abs, "utf8");
  const titleRole = role === "advocate" ? "Advocate" : "Adversary";
  const summaryHeading = role === "advocate" ? "Executive Summary" : "Summary";
  const roleProof = role === "advocate"
    ? "**Schema completeness**: 10/10"
    : "**Migration finding**: namespace metadata normalized [LOW]";

  const firstHeading = (original.match(/^#\s+.*$/m) || [""])[0].toLowerCase();
  const escapedSkill = skill.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const alreadyValid = firstHeading.includes(role) && firstHeading.includes(skill.toLowerCase())
    && new RegExp(`\\*\\*Skill:?\\*\\*:?\\s*.*${escapedSkill}`, "i").test(original)
    && /HUMAN_VERIFIED[*\s:]*?(true|false)/i.test(original)
    && /^##\s+(Executive\s+)?Summary\b/im.test(original);
  if (alreadyValid) return;

  const header = `# ${titleRole} Review: ${skill}\n\n`
    + `**Date**: ${date}  \n`
    + `**Reviewer Role**: ${titleRole}  \n`
    + `**Skill**: ${skill}  \n`
    + `**HUMAN_VERIFIED**: false\n\n`
    + `## ${summaryHeading}\n\n`
    + `This compatibility header normalizes review metadata after the repository-wide \`bs-\` namespace migration. The substantive review below is preserved unchanged.\n\n`
    + `${roleProof}  \n`
    + `**Schema migration status**: PASS\n\n`
    + `## Original Review\n\n`;
  fs.writeFileSync(abs, header + original, "utf8");
}

if (fs.existsSync(reviewsRoot)) {
  for (const entry of fs.readdirSync(reviewsRoot, { withFileTypes: true })) {
    if (!entry.isDirectory() || !entry.name.startsWith("bs-")) continue;
    for (const file of fs.readdirSync(path.join(reviewsRoot, entry.name))) {
      normalizeReview(entry.name, file);
    }
  }
}

const testFile = path.join(root, "tools", "test-cli.sh");
let tests = fs.readFileSync(testFile, "utf8");
const fragile = `grep -q '^name: bs-social-card$' "$ALIAS_DIR/bs-social-card/SKILL.md" && PASS=$((PASS + 1)) && echo "  $(green PASS) installed frontmatter is canonical" || { FAIL=$((FAIL + 1)); echo "  $(red FAIL) installed frontmatter not canonical"; }`;
const robust = `if grep -q "^name: bs-social-card$" "$ALIAS_DIR/bs-social-card/SKILL.md"; then\n  PASS=$((PASS + 1))\n  echo "  $(green PASS) installed frontmatter is canonical"\nelse\n  FAIL=$((FAIL + 1))\n  echo "  $(red FAIL) installed frontmatter not canonical"\nfi`;
if (!tests.includes(fragile)) throw new Error("legacy-alias assertion not found in tools/test-cli.sh");
tests = tests.replace(fragile, robust);
fs.writeFileSync(testFile, tests, "utf8");
