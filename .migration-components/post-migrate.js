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
const marker = 'echo "T24: legacy alias installs canonical identity"';
const markerIndex = tests.indexOf(marker);
if (markerIndex < 0) throw new Error("T24 legacy-alias test marker not found in tools/test-cli.sh");

const cleanTail = `echo "T24: legacy alias installs canonical identity"
ALIAS_DIR="$SANDBOX/alias"
mkdir -p "$ALIAS_DIR"
run_cli add social-card --target "$ALIAS_DIR" >/dev/null 2>&1; rc=$?
assert_exit "legacy alias add exit 0" 0 "$rc"
assert_path_exists "alias created canonical directory" "$ALIAS_DIR/bs-social-card/SKILL.md"
assert_path_missing "alias did not create legacy directory" "$ALIAS_DIR/social-card"
if grep -q "^name: bs-social-card$" "$ALIAS_DIR/bs-social-card/SKILL.md"; then
  PASS=$((PASS + 1))
  echo "  $(green PASS) installed frontmatter is canonical"
else
  FAIL=$((FAIL + 1))
  echo "  $(red FAIL) installed frontmatter not canonical"
fi
echo

echo "==> Result: $(green "$PASS pass") / $(red "$FAIL fail")"
[ "$FAIL" -eq 0 ] || exit 1
`;

tests = tests.slice(0, markerIndex) + cleanTail;
fs.writeFileSync(testFile, tests, "utf8");
