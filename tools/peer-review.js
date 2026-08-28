#!/usr/bin/env node
// Gate 2: Peer Review — generate review prompts and validate review files.
//
// Two subcommands:
//   generate <skill>     — write advocate + adversary prompt files for the skill
//                          to docs/reviews/<skill>/YYYY-MM-DD-{role}-prompt.md
//                          You then run these prompts through a reviewer agent
//                          (Claude / Codex / human) and save outputs as
//                          YYYY-MM-DD-{role}-review.md in the same directory.
//   check <skill>        — validate that the most recent advocate + adversary
//                          review files exist and conform to the schema.
//   check --all          — check every self-developed skill in skills.json.
//
// Exit codes:
//   0 = ok (all checks passed / generate succeeded)
//   1 = at least one review check failed
//   2 = usage error
//   4 = generate conflict (prompt file exists, no --force) — generate only
//   5 = integrity error (skill not found, skills.json missing)
"use strict";

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { spawnSync } = require("child_process");
const { COLORS, color } = require("../lib/term");

const REPO_ROOT = path.resolve(__dirname, "..");
const SKILLS_DIR = path.join(REPO_ROOT, "skills");
const SKILLS_JSON = path.join(REPO_ROOT, "skills.json");
const REVIEWS_DIR = path.join(REPO_ROOT, "docs", "reviews");

const ROLES = ["advocate", "adversary"];
// UTF-8 BOM byte sequence (U+FEFF) — some Windows editors prepend it. Stripping
// it keeps frontmatter/heading detection from breaking on otherwise-valid files.
const UTF8_BOM = 0xFEFF;
// Max chars of a heading shown in validator error messages (keeps output tidy).
const HEADING_DISPLAY_MAX = 80;
const REVIEW_FILE_RE = /^(\d{4}-\d{2}-\d{2})-(advocate|adversary)-review\.md$/;
const SEVERITY_RE = /\b(CRITICAL|HIGH|MEDIUM|LOW)\b/;
// Loose verdict detection: many existing files use varied wording. Accept any
// of the documented controlled values OR a numeric score with an explicit
// denominator of /10, /80, or /100. The denominator restriction avoids
// false-matching M/D date strings like "6/17" or "12/25".
const VERDICT_RE = /(REQUIRES_CHANGES|NEEDS_IMPROVEMENT|NEEDS_POLISH|APPROVED|PASS|production-ready|\b\d{1,3}\s*\/\s*(?:10|80|100)\b)/i;
const SCOPE_CONTRACT_VERSION = 1;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function todayISO() {
  const d = new Date();
  return [
    d.getUTCFullYear(),
    String(d.getUTCMonth() + 1).padStart(2, "0"),
    String(d.getUTCDate()).padStart(2, "0"),
  ].join("-");
}

function loadSkillsJson() {
  if (!fs.existsSync(SKILLS_JSON)) {
    const e = new Error(`skills.json not found at ${SKILLS_JSON}`);
    e.code = "EINTEGRITY";
    throw e;
  }
  try {
    return JSON.parse(fs.readFileSync(SKILLS_JSON, "utf-8"));
  } catch (parseErr) {
    const e = new Error(`skills.json is not valid JSON: ${parseErr.message}`);
    e.code = "EINTEGRITY";
    throw e;
  }
}

function selfDevelopedSkills() {
  const data = loadSkillsJson();
  return Object.keys(data.skills?.["self-developed"] || {}).sort();
}

function readSkillBody(skillName) {
  const p = path.join(SKILLS_DIR, skillName, "SKILL.md");
  if (!fs.existsSync(p)) {
    const e = new Error(`SKILL.md not found for skill '${skillName}' at ${p}`);
    e.code = "EINTEGRITY";
    throw e;
  }
  let content = fs.readFileSync(p, "utf-8");
  if (content.charCodeAt(0) === UTF8_BOM) content = content.slice(1);
  return content;
}

function sha256(content) {
  return crypto.createHash("sha256").update(content).digest("hex");
}

function currentRevision() {
  const result = spawnSync("git", ["rev-parse", "HEAD"], {
    cwd: REPO_ROOT,
    encoding: "utf8",
  });
  return result.status === 0 ? result.stdout.trim() : "UNAVAILABLE";
}

function listFilesRecursive(root, out = []) {
  for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
    const absolute = path.join(root, entry.name);
    if (entry.isDirectory()) listFilesRecursive(absolute, out);
    else if (entry.isFile()) out.push(absolute);
  }
  return out;
}

function reviewScope(skillName, skillContent) {
  const token = skillName.replace(/^bs-/, "");
  const files = listFilesRecursive(path.join(SKILLS_DIR, skillName));
  files.push(
    SKILLS_JSON,
    path.join(REPO_ROOT, "evaluation", "datasets", "batch-1-test-prompts.json"),
    path.join(REPO_ROOT, "evaluation", "harness", "runner.js"),
    path.join(REPO_ROOT, "evaluation", "harness", "test-runner-scope.js"),
    path.join(REPO_ROOT, "tools", "peer-review.js"),
    path.join(REPO_ROOT, "tools", "test-peer-review-scope.js"),
  );

  const superpowersRoot = path.join(REPO_ROOT, "docs", "superpowers");
  if (fs.existsSync(superpowersRoot)) {
    for (const file of listFilesRecursive(superpowersRoot)) {
      if (path.basename(file).includes(token)) files.push(file);
    }
  }

  const entries = [...new Set(files)]
    .filter((file) => fs.existsSync(file))
    .sort()
    .map((file) => ({
      path: path.relative(REPO_ROOT, file),
      hash: sha256(fs.readFileSync(file)),
    }));
  const manifest = entries
    .map((entry) => `- \`${entry.path}\` — \`${entry.hash}\``)
    .join("\n");

  return {
    revision: currentRevision(),
    skillHash: sha256(skillContent),
    manifestHash: sha256(manifest),
    manifest,
    entries,
  };
}

function parseScopePrompt(promptContent) {
  const version = promptContent.match(/\*\*Scope Contract Version\*\*:\s*(\d+)/);
  const revision = promptContent.match(/\*\*Reviewed Revision to record\*\*:\s*([0-9a-f]{7,40}|UNAVAILABLE)/i);
  const skillHash = promptContent.match(/\*\*Reviewed Skill SHA-256 to record\*\*:\s*([0-9a-f]{64})/i);
  const manifestHash = promptContent.match(/\*\*Reviewed Manifest SHA-256 to record\*\*:\s*([0-9a-f]{64})/i);
  const entries = [];
  const entryRe = /^- `([^`]+)` — `([0-9a-f]{64})`$/gim;
  let match;
  while ((match = entryRe.exec(promptContent)) !== null) {
    entries.push({ path: match[1], hash: match[2].toLowerCase() });
  }
  return {
    version: version ? version[1] : null,
    revision: revision ? revision[1] : null,
    skillHash: skillHash ? skillHash[1].toLowerCase() : null,
    manifestHash: manifestHash ? manifestHash[1].toLowerCase() : null,
    entries,
  };
}

function validateScopeContractContent(reviewContent, promptContent, skillName = null) {
  const issues = [];
  const analysisContent = maskMarkdownCode(reviewContent);
  const blockVisibleContent = maskMarkdownBlockCode(reviewContent);
  const expected = parseScopePrompt(promptContent);
  const declaredVersion = analysisContent.match(/^[ \t]{0,3}\*\*Scope Contract Version\*\*:\s*(\d+)\s*$/m);
  issues.push({
    passed: expected.version === String(SCOPE_CONTRACT_VERSION)
      && !!declaredVersion
      && declaredVersion[1] === expected.version,
    label: "Scope Contract Version matches prompt",
    detail: declaredVersion
      ? `declared=${declaredVersion[1]}, expected=${expected.version || "missing"}`
      : "missing Scope Contract Version",
  });

  const declaredRevision = analysisContent.match(/^[ \t]{0,3}\*\*Reviewed Revision\*\*:\s*([0-9a-f]{7,40}|UNAVAILABLE)\s*$/im);
  issues.push({
    passed: !!declaredRevision
      && !!expected.revision
      && declaredRevision[1].toLowerCase() === expected.revision.toLowerCase(),
    label: "Reviewed Revision matches prompt",
    detail: declaredRevision
      ? `declared=${declaredRevision[1]}, expected=${expected.revision || "missing"}`
      : "missing Reviewed Revision",
  });

  const declaredSkillHash = analysisContent.match(/^[ \t]{0,3}\*\*Reviewed Skill SHA-256\*\*:\s*([0-9a-f]{64})\s*$/im);
  issues.push({
    passed: !!declaredSkillHash
      && !!expected.skillHash
      && declaredSkillHash[1].toLowerCase() === expected.skillHash,
    label: "Reviewed Skill SHA-256 matches prompt",
    detail: declaredSkillHash
      ? `declared=${declaredSkillHash[1]}, expected=${expected.skillHash || "missing"}`
      : "missing Reviewed Skill SHA-256",
  });

  const declaredManifestHash = analysisContent.match(/^[ \t]{0,3}\*\*Reviewed Manifest SHA-256\*\*:\s*([0-9a-f]{64})\s*$/im);
  issues.push({
    passed: !!declaredManifestHash
      && !!expected.manifestHash
      && declaredManifestHash[1].toLowerCase() === expected.manifestHash,
    label: "Reviewed Manifest SHA-256 matches prompt",
    detail: declaredManifestHash
      ? `declared=${declaredManifestHash[1]}, expected=${expected.manifestHash || "missing"}`
      : "missing Reviewed Manifest SHA-256",
  });

  const expectedManifest = expected.entries
    .map((entry) => `- \`${entry.path}\` — \`${entry.hash}\``)
    .join("\n");
  const promptManifestValid = expected.entries.length > 0
    && !!expected.manifestHash
    && sha256(expectedManifest) === expected.manifestHash;
  const staleEntries = expected.entries.filter((entry) => {
    const absolute = path.resolve(REPO_ROOT, entry.path);
    if (!absolute.startsWith(REPO_ROOT + path.sep) || !fs.existsSync(absolute)) return true;
    return sha256(fs.readFileSync(absolute)) !== entry.hash;
  });
  let requiredScopeMatches = true;
  let missingRequired = [];
  let unexpectedEntries = [];
  if (skillName) {
    const requiredEntries = reviewScope(skillName, readSkillBody(skillName)).entries;
    const expectedByPath = new Map(expected.entries.map((entry) => [entry.path, entry.hash]));
    const requiredByPath = new Map(requiredEntries.map((entry) => [entry.path, entry.hash]));
    missingRequired = requiredEntries
      .filter((entry) => expectedByPath.get(entry.path) !== entry.hash)
      .map((entry) => entry.path);
    unexpectedEntries = expected.entries
      .filter((entry) => requiredByPath.get(entry.path) !== entry.hash)
      .map((entry) => entry.path);
    requiredScopeMatches = missingRequired.length === 0 && unexpectedEntries.length === 0;
  }
  issues.push({
    passed: promptManifestValid && staleEntries.length === 0 && requiredScopeMatches,
    label: "Prompt manifest matches required scope and current files",
    detail: !promptManifestValid
      ? "manifest receipt does not match prompt entries"
      : (staleEntries.length > 0
        ? `stale or missing: ${staleEntries.map((entry) => entry.path).join(", ")}`
        : (!requiredScopeMatches
          ? `missing required: ${missingRequired.join(", ") || "none"}; unexpected: ${unexpectedEntries.join(", ") || "none"}`
          : `${expected.entries.length} required files verified`)),
  });

  const evidenceSection = blockVisibleContent.match(/^##\s+Evidence Reviewed\b([^\n]*)\r?\n([\s\S]*?)(?=^##\s+|(?![\s\S]))/im);
  const evidenceBody = evidenceSection ? evidenceSection[2] : "";
  const receiptPattern = expected.manifestHash
    ? new RegExp(`^[ \\t]{0,3}Full manifest receipt(?: acknowledged)?[ \\t]*(?::[ \\t]*)?\`?${expected.manifestHash}\`?(?:[ \\t]+was received\\b|[ \\t]*\\.?[ \\t]*$)`, "im")
    : null;
  const receiptAcknowledged = !!receiptPattern && receiptPattern.test(evidenceBody);
  issues.push({
    passed: !!evidenceSection && receiptAcknowledged,
    label: "Evidence Reviewed acknowledges full manifest receipt",
    detail: !evidenceSection
      ? "missing '## Evidence Reviewed' section"
      : (receiptAcknowledged ? "" : `missing manifest receipt ${expected.manifestHash || "from prompt"}`),
  });

  return issues;
}

// ---------------------------------------------------------------------------
// Prompt templates
// ---------------------------------------------------------------------------

function buildAdvocatePrompt(skillName, skillContent) {
  const scope = reviewScope(skillName, skillContent);
  return `# Gate 2 — Peer Review Prompt: Advocate

You are the **advocate reviewer** for the \`${skillName}\` skill. Your job is to argue for what's GOOD: identify the strongest aspects, score the design across multiple dimensions, and decide whether this skill is production-ready.

## How to use this prompt

1. Read the SKILL.md content below in full.
2. Produce a markdown review and save it to:
   \`docs/reviews/${skillName}/${todayISO()}-advocate-review.md\`
3. Use the **required structure** below — the validator (\`tools/peer-review.js check\`) will reject reviews missing required sections.

## Deep composite review scope

Do not review only the embedded SKILL.md. Read every file in this manifest plus the actual command outputs you cite. The manifest binds the requested scope; it does not claim the files are correct.

**Scope Contract Version**: 1
**Reviewed Revision to record**: ${scope.revision}
**Reviewed Skill SHA-256 to record**: ${scope.skillHash}
**Reviewed Manifest SHA-256 to record**: ${scope.manifestHash}

${scope.manifest}

## Required structure

\`\`\`markdown
# Advocate Review: ${skillName}

**Date**: ${todayISO()}
**Reviewer Role**: Advocate
**Skill**: ${skillName}
**HUMAN_VERIFIED**: false
**Scope Contract Version**: 1
**Reviewed Revision**: ${scope.revision}
**Reviewed Skill SHA-256**: ${scope.skillHash}
**Reviewed Manifest SHA-256**: ${scope.manifestHash}

## Executive Summary

(2-4 sentences naming the strongest design choices and whether you'd ship this.)

## Evidence Reviewed

Full manifest receipt \`${scope.manifestHash}\` was received and independently verified.

(Then list the files and commands actually examined or rerun.)

Do not use raw HTML blocks anywhere in the review.

## Dimension Scores

| Dimension | Score | Key Strength | Key Concern |
|-----------|------:|--------------|-------------|
| Clarity of trigger description | _/10 | | |
| Hard rules / safety gates | _/10 | | |
| Workflow correctness | _/10 | | |
| Pattern application | _/10 | | |
| Test prompt coverage | _/10 | | |
| Bundled resources | _/10 | | |
| Maintainability | _/10 | | |
| Production readiness | _/10 | | |

## Strongest Aspect

(One paragraph naming the single best design move and why it matters.)

## One Improvement

(One concrete suggestion that would meaningfully raise quality.)

## Verdict

**Verdict**: <one of: PASS / production-ready / NEEDS_POLISH>

(One paragraph rationale.)
\`\`\`

## SKILL content under review

\`\`\`markdown
${skillContent}
\`\`\`
`;
}

function buildAdversaryPrompt(skillName, skillContent) {
  const scope = reviewScope(skillName, skillContent);
  return `# Gate 2 — Peer Review Prompt: Adversary

You are the **adversary reviewer** for the \`${skillName}\` skill. Your job is to break it: find ways the skill produces wrong output, fails on edge cases, contradicts itself, has bypassable safety gates, or makes the agent worse off than no skill at all. Be ruthless.

## How to use this prompt

1. Read the SKILL.md content below in full.
2. Produce a markdown review and save it to:
   \`docs/reviews/${skillName}/${todayISO()}-adversary-review.md\`
3. Use the **required structure** below — the validator (\`tools/peer-review.js check\`) will reject reviews missing required sections.

## Deep composite review scope

Do not review only the embedded SKILL.md. Read every file in this manifest plus the actual command outputs you cite. The manifest binds the requested scope; it does not claim the files are correct.

**Scope Contract Version**: 1
**Reviewed Revision to record**: ${scope.revision}
**Reviewed Skill SHA-256 to record**: ${scope.skillHash}
**Reviewed Manifest SHA-256 to record**: ${scope.manifestHash}

${scope.manifest}

## Required structure

\`\`\`markdown
# Adversary Review: ${skillName}

**Date**: ${todayISO()}
**Reviewer Role**: Adversary
**Skill**: ${skillName}
**HUMAN_VERIFIED**: false
**Scope Contract Version**: 1
**Reviewed Revision**: ${scope.revision}
**Reviewed Skill SHA-256**: ${scope.skillHash}
**Reviewed Manifest SHA-256**: ${scope.manifestHash}

## Summary

(2-4 sentences: how many issues, of what severity, and the worst-case impact.)

## Evidence Reviewed

Full manifest receipt \`${scope.manifestHash}\` was received and independently verified.

(Then list the files and commands actually examined or rerun.)

Do not use raw HTML blocks anywhere in the review.

## Findings

### F1: <short title> [CRITICAL] [OPEN]

**Location**: <section / line range in SKILL.md>
**Exploit scenario**: <how a user could trigger the failure>
**Root cause**: <what in the skill design enables it>
**Suggested fix**: <concrete change>

### F2: <short title> [HIGH] [OPEN]

(...repeat the structure for each finding...)

(Every finding heading must end with exactly one severity tag [CRITICAL|HIGH|MEDIUM|LOW] and one status tag [OPEN|RESOLVED]. Use [OPEN] by default. Use [RESOLVED] only after retesting a previously reported issue. Any [OPEN] CRITICAL, HIGH, or MEDIUM finding forbids APPROVED. At least one finding must be present; if you genuinely find none, add one [LOW] [RESOLVED] finding that states the reviewed attack surface and why no issue survived.)

## Verdict

**Verdict**: <one of: REQUIRES_CHANGES / NEEDS_IMPROVEMENT / APPROVED>

(One paragraph rationale.)
\`\`\`

## SKILL content under review

\`\`\`markdown
${skillContent}
\`\`\`
`;
}

// ---------------------------------------------------------------------------
// generate subcommand
// ---------------------------------------------------------------------------

function cmdGenerate(args) {
  const skillName = args._[0];
  if (!skillName) {
    console.error("peer-review: 'generate' requires a skill name");
    return 2;
  }

  const skills = selfDevelopedSkills();
  if (!skills.includes(skillName)) {
    console.error(`peer-review: skill '${skillName}' is not self-developed (skills.json)`);
    console.error(`available: ${skills.join(", ")}`);
    return 5;
  }

  let skillContent;
  try {
    skillContent = readSkillBody(skillName);
  } catch (e) {
    if (e.code === "EINTEGRITY") {
      console.error(`peer-review: ${e.message}`);
      return 5;
    }
    throw e;
  }

  const dateStr = todayISO();
  const dir = path.join(REVIEWS_DIR, skillName);
  fs.mkdirSync(dir, { recursive: true });

  const prompts = [
    { role: "advocate", body: buildAdvocatePrompt(skillName, skillContent) },
    { role: "adversary", body: buildAdversaryPrompt(skillName, skillContent) },
  ];

  for (const p of prompts) {
    const out = path.join(dir, `${dateStr}-${p.role}-prompt.md`);
    if (fs.existsSync(out) && !args.force) {
      console.error(`peer-review: ${path.relative(REPO_ROOT, out)} already exists (use --force to overwrite)`);
      return 4;
    }
    fs.writeFileSync(out, p.body, "utf-8");
    console.log(color(COLORS.green, "  generated"), path.relative(REPO_ROOT, out));
  }

  console.log("");
  console.log("Next steps:");
  console.log(`  1. Run each prompt through a reviewer agent (Claude/Codex/human).`);
  console.log(`  2. Save outputs to:`);
  console.log(`     ${path.relative(REPO_ROOT, path.join(dir, dateStr + "-advocate-review.md"))}`);
  console.log(`     ${path.relative(REPO_ROOT, path.join(dir, dateStr + "-adversary-review.md"))}`);
  console.log(`  3. Validate with: node tools/peer-review.js check ${skillName}`);

  return 0;
}

// ---------------------------------------------------------------------------
// check subcommand — schema validation of existing review files
// ---------------------------------------------------------------------------

function listReviewFiles(skillName) {
  const dir = path.join(REVIEWS_DIR, skillName);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter(f => REVIEW_FILE_RE.test(f))
    .map(f => {
      const m = f.match(REVIEW_FILE_RE);
      return { file: f, date: m[1], role: m[2], absPath: path.join(dir, f) };
    })
    .sort((a, b) => b.date.localeCompare(a.date));
}

function checkOneReview(skillName, entry) {
  // Each finding: { passed: boolean, label: string, detail: string }
  const issues = [];
  let content;
  try {
    content = fs.readFileSync(entry.absPath, "utf-8");
  } catch (e) {
    return [{ passed: false, label: "readable", detail: e.message }];
  }
  if (content.charCodeAt(0) === UTF8_BOM) content = content.slice(1);
  const analysisContent = maskMarkdownCode(content);

  // 1. H1 title contains role + skill name. Tolerate "Adversarial" as a
  // synonym for "adversary" — that's the variant several existing reviews use.
  const firstHeading = analysisContent.split(/\r?\n/).find(l => /^#\s+/.test(l)) || "";
  const roleAlias = entry.role === "adversary" ? "adversar(y|ial)" : entry.role;
  const roleInTitle = new RegExp(`\\b${roleAlias}`, "i").test(firstHeading);
  const skillInTitle = firstHeading.toLowerCase().includes(skillName.toLowerCase());
  issues.push({
    passed: roleInTitle && skillInTitle,
    label: "H1 title contains role and skill name",
    detail: roleInTitle && skillInTitle
      ? ""
      : `first heading was: "${firstHeading.trim().slice(0, HEADING_DISPLAY_MAX)}"`,
  });

  // 2. Date metadata matches filename date. Tolerate colon inside OR outside
  // the bold markers: `**Date**: 2026-06-19` and `**Date:** 2026-06-19` both
  // match. The `:?` before and after `\*\*` absorbs the colon in either spot.
  const dateMatch = analysisContent.match(/^[ \t]{0,3}\*\*Date:?\*\*:?\s*(\d{4}-\d{2}-\d{2})\s*$/m);
  issues.push({
    passed: !!dateMatch && dateMatch[1] === entry.date,
    label: "Date metadata matches filename",
    detail: dateMatch ? `metadata=${dateMatch[1]}, filename=${entry.date}` : "no '**Date**: YYYY-MM-DD' line found",
  });

  // 3. Reviewer Role metadata matches role (accept "Adversarial" → adversary).
  const roleMatch = analysisContent.match(/^[ \t]{0,3}\*\*Reviewer\s*Role:?\*\*:?\s*(\w+)\s*$/im)
    || analysisContent.match(/^[ \t]{0,3}\*\*Reviewer:?\*\*:?\s*([^\n]+?)\s*$/im);
  const declaredRole = roleMatch ? roleMatch[1].toLowerCase() : "";
  const roleAccepted = entry.role === "adversary"
    ? /adversar(y|ial)/i.test(declaredRole)
    : declaredRole.includes(entry.role);
  issues.push({
    passed: roleAccepted,
    label: "Reviewer role declared and matches filename",
    detail: roleMatch ? `declared="${roleMatch[1].trim()}", expected="${entry.role}"` : "no reviewer-role metadata",
  });

  // 4. Skill metadata matches (colon inside or outside bold).
  const skillMatch = analysisContent.match(/^[ \t]{0,3}\*\*Skill:?\*\*:?\s*([^\n]+?)\s*$/m);
  issues.push({
    passed: !!skillMatch && skillMatch[1].toLowerCase().includes(skillName.toLowerCase()),
    label: "Skill metadata present and matches",
    detail: skillMatch ? `declared="${skillMatch[1].trim()}"` : "no '**Skill**:' metadata line",
  });

  // 5. Has a Summary or Executive Summary section
  const hasSummary = /^##\s+(Executive\s+)?Summary\b/im.test(analysisContent);
  issues.push({
    passed: hasSummary,
    label: "Summary section present",
    detail: hasSummary ? "" : "expected '## Summary' or '## Executive Summary'",
  });

  // 6. Verdict marker present
  const hasVerdict = VERDICT_RE.test(analysisContent);
  issues.push({
    passed: hasVerdict,
    label: "Verdict / score marker present",
    detail: hasVerdict ? "" : "expected one of: REQUIRES_CHANGES / NEEDS_IMPROVEMENT / APPROVED / PASS / production-ready / N/M score",
  });

  // 7. Role-specific structure
  if (entry.role === "adversary") {
    const hasSeverity = SEVERITY_RE.test(analysisContent);
    issues.push({
      passed: hasSeverity,
      label: "At least one severity-tagged finding (adversary)",
      detail: hasSeverity ? "" : "expected at least one CRITICAL/HIGH/MEDIUM/LOW tag",
    });
  } else {
    // advocate — must have at least one numeric score "/10" or "/100" pattern
    const hasScore = /\b\d{1,3}\s*\/\s*(?:10|100|80)\b/.test(analysisContent);
    issues.push({
      passed: hasScore,
      label: "At least one dimension score (advocate, e.g. 8/10 or 85/100)",
      detail: hasScore ? "" : "expected at least one '<n>/10' or '<n>/100' or '<n>/80' score",
    });
  }

  // 8. HUMAN_VERIFIED marker present (tolerate markdown bold around the key).
  const hasMarker = /^[ \t]{0,3}(?:\*\*)?HUMAN_VERIFIED(?:\*\*)?\s*:\s*(true|false)\s*$/im.test(analysisContent);
  issues.push({
    passed: hasMarker,
    label: "HUMAN_VERIFIED marker present",
    detail: hasMarker ? "" : "expected 'HUMAN_VERIFIED: true|false' (CLAUDE.md mandate)",
  });

  const promptPath = entry.promptPath || path.join(
    REVIEWS_DIR,
    skillName,
    `${entry.date}-${entry.role}-prompt.md`,
  );
  const scopedPrompt = fs.existsSync(promptPath)
    && /\*\*Scope Contract Version\*\*:\s*1/.test(fs.readFileSync(promptPath, "utf8"));

  // Scope Contract v1 is opt-in per generated prompt, so historical reviews
  // remain valid while new deep composite reviews cannot silently inspect only
  // the embedded SKILL.md.
  if (scopedPrompt) {
    const promptContent = fs.readFileSync(promptPath, "utf8");
    issues.push(validateNoRawHtmlBlocks(content));
    issues.push(...validateScopeContractContent(content, promptContent, skillName));
    issues.push(validateReviewDisposition(content, entry.role));
  }

  return issues;
}

function maskMarkdownBlockCodeOnly(content) {
  const parts = content.split(/(\r?\n)/);
  let fence = null;
  for (let index = 0; index < parts.length; index += 2) {
    const line = parts[index];
    let mask = false;
    if (fence) {
      mask = true;
      const close = new RegExp(`^[ ]{0,3}${fence.character}{${fence.length},}[ \\t]*$`);
      if (close.test(line)) fence = null;
    } else {
      const opening = line.match(/^[ ]{0,3}(`{3,}|~{3,})(.*)$/);
      const validOpening = opening
        && (opening[1][0] === "~" || !opening[2].includes("`"));
      if (validOpening) {
        mask = true;
        fence = { character: opening[1][0], length: opening[1].length };
      } else {
        let columns = 0;
        for (const character of line) {
          if (character === " ") columns += 1;
          else if (character === "\t") columns += 4 - (columns % 4);
          else break;
        }
        if (columns >= 4) mask = true;
      }
    }
    if (mask) parts[index] = " ".repeat(line.length);
  }
  return parts.join("");
}

function maskMarkdownBlockCode(content) {
  return maskMarkdownBlockCodeOnly(content).replace(/<!--[\s\S]*?(?:-->|$)/g, (comment) => (
    comment.replace(/[^\r\n]/g, " ")
  ));
}

function maskInlineCodeSpans(content) {
  function isBackslashEscaped(position) {
    let backslashes = 0;
    for (let cursor = position - 1; cursor >= 0 && content[cursor] === "\\"; cursor -= 1) {
      backslashes += 1;
    }
    return backslashes % 2 === 1;
  }

  const output = content.split("");
  let index = 0;
  while (index < content.length) {
    if (content[index] !== "`" || isBackslashEscaped(index)) {
      index += 1;
      continue;
    }

    let openerEnd = index;
    while (openerEnd < content.length && content[openerEnd] === "`") openerEnd += 1;
    const delimiterLength = openerEnd - index;
    let cursor = openerEnd;
    let closerEnd = -1;
    while (cursor < content.length) {
      const closerStart = content.indexOf("`", cursor);
      if (closerStart < 0) break;
      let runEnd = closerStart;
      while (runEnd < content.length && content[runEnd] === "`") runEnd += 1;
      if (runEnd - closerStart === delimiterLength) {
        closerEnd = runEnd;
        break;
      }
      cursor = runEnd;
    }

    if (closerEnd < 0) {
      index = openerEnd;
      continue;
    }
    for (let position = index; position < closerEnd; position += 1) {
      if (content[position] !== "\n" && content[position] !== "\r") output[position] = " ";
    }
    index = closerEnd;
  }
  return output.join("");
}

function maskMarkdownCode(content) {
  return maskInlineCodeSpans(maskMarkdownBlockCode(content));
}

function validateNoRawHtmlBlocks(content) {
  const syntaxVisibleContent = maskInlineCodeSpans(maskMarkdownBlockCodeOnly(content));
  const rawHtml = syntaxVisibleContent.match(/^[ \t]{0,3}<(?:[A-Za-z!\/]|\?)/m);
  return {
    passed: !rawHtml,
    label: "Scoped review contains no raw HTML blocks",
    detail: rawHtml ? `raw HTML opener=${rawHtml[0].trim().slice(0, HEADING_DISPLAY_MAX)}` : "",
  };
}

function validateReviewDisposition(content, role = null) {
  const analysisContent = maskMarkdownCode(content);
  const setextHeading = analysisContent.match(/^[ \t]{0,3}\S[^\r\n]*\r?\n[ \t]{0,3}(?:=+|-+)[ \t]*$/m);
  if (setextHeading) {
    return {
      passed: false,
      label: "Review disposition is release-eligible",
      detail: "setext headings are not allowed in a scoped review; use the controlled ATX sections",
    };
  }

  const h2Headings = [...analysisContent.matchAll(/^[ \t]{0,3}##(?!#)\s+(.+?)(?:\s+#+)?\s*$/gm)]
    .map((match) => ({
      title: match[1].trim(),
      index: match.index,
      end: match.index + match[0].length,
    }));
  const verdictHeadings = h2Headings.filter((heading) => heading.title.toLowerCase() === "verdict");
  if (verdictHeadings.length !== 1) {
    return {
      passed: false,
      label: "Review disposition is release-eligible",
      detail: `expected exactly one Markdown H2 Verdict section, found ${verdictHeadings.length}`,
    };
  }

  const verdictHeading = verdictHeadings[0];
  const h2AfterVerdict = h2Headings.find((heading) => heading.index > verdictHeading.index);
  if (h2AfterVerdict) {
    return {
      passed: false,
      label: "Review disposition is release-eligible",
      detail: `Verdict must be the final H2 section; found '${h2AfterVerdict.title}' after it`,
    };
  }

  const body = analysisContent.slice(verdictHeading.end);
  const globalFields = [...analysisContent.matchAll(/^\*\*Verdict\*\*:\s*([^\r\n]+?)\s*$/gim)];
  if (globalFields.length !== 1) {
    return {
      passed: false,
      label: "Review disposition is release-eligible",
      detail: `expected exactly one controlled Verdict field in the review, found ${globalFields.length}`,
    };
  }
  const fields = [...body.matchAll(/^\*\*Verdict\*\*:\s*([^\r\n]+?)\s*$/gim)];
  if (fields.length !== 1) {
    return {
      passed: false,
      label: "Review disposition is release-eligible",
      detail: `expected exactly one anchored '**Verdict**:' field, found ${fields.length}`,
    };
  }

  const raw = fields[0][1].trim();
  const parsed = raw.match(/^(PASS|production-ready|APPROVED|NEEDS_POLISH|REQUIRES_CHANGES|NEEDS_IMPROVEMENT)(?:\s*\(\s*\d{1,3}\s*\/\s*(?:10|80|100)\s*\))?$/i);
  if (!parsed) {
    return {
      passed: false,
      label: "Review disposition is release-eligible",
      detail: `uncontrolled or negated disposition=${raw}`,
    };
  }

  const disposition = parsed[1].toUpperCase();
  const blocking = new Set(["REQUIRES_CHANGES", "NEEDS_IMPROVEMENT", "NEEDS_POLISH"]);
  const allowedApprovals = role === "advocate"
    ? new Set(["PASS", "PRODUCTION-READY"])
    : (role === "adversary"
      ? new Set(["APPROVED"])
      : new Set(["PASS", "PRODUCTION-READY", "APPROVED"]));
  if (blocking.has(disposition)) {
    return {
      passed: false,
      label: "Review disposition is release-eligible",
      detail: `blocking disposition=${disposition}`,
    };
  }
  if (!allowedApprovals.has(disposition)) {
    return {
      passed: false,
      label: "Review disposition is release-eligible",
      detail: `disposition=${disposition} is not valid for role=${role || "unspecified"}`,
    };
  }

  if (role === "adversary") {
    const findingsHeadings = h2Headings.filter((heading) => heading.title.toLowerCase() === "findings");
    if (findingsHeadings.length !== 1) {
      return {
        passed: false,
        label: "Review disposition is release-eligible",
        detail: `expected exactly one Markdown H2 Findings section, found ${findingsHeadings.length}`,
      };
    }

    const findingsHeading = findingsHeadings[0];
    const nextH2 = h2Headings.find((heading) => heading.index > findingsHeading.index);
    if (!nextH2 || nextH2.index !== verdictHeading.index) {
      return {
        passed: false,
        label: "Review disposition is release-eligible",
        detail: `Findings must be followed directly by Verdict; found '${nextH2 ? nextH2.title : "no H2"}'`,
      };
    }

    const findingsBody = analysisContent.slice(findingsHeading.end, verdictHeading.index);
    const headingMatches = [...findingsBody.matchAll(/^[ \t]{0,3}(#{1,6})(?!#)\s+(.+?)(?:\s+#+)?\s*$/gm)];
    if (headingMatches.length === 0) {
      return {
        passed: false,
        label: "Review disposition is release-eligible",
        detail: "approved adversary review requires at least one structured finding heading",
      };
    }

    const parsedFindings = headingMatches.map((match, index) => {
      const level = match[1];
      const heading = match[2].trim();
      const severityTags = [...heading.matchAll(/\[(CRITICAL|HIGH|MEDIUM|LOW)\]/gi)];
      const statusTags = [...heading.matchAll(/\[(OPEN|RESOLVED)\]/gi)];
      const exactSuffix = level === "###"
        ? heading.match(/^.+\[(CRITICAL|HIGH|MEDIUM|LOW)\]\s+\[(OPEN|RESOLVED)\]\s*$/i)
        : null;
      const nextStart = index + 1 < headingMatches.length
        ? headingMatches[index + 1].index
        : findingsBody.length;
      const findingBody = findingsBody.slice(match.index + match[0].length, nextStart);
      const requiredFields = ["Location", "Exploit scenario", "Root cause", "Suggested fix"];
      const missingFields = requiredFields.filter((field) => {
        const escaped = field.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        return !new RegExp(`^\\*\\*${escaped}\\*\\*:\\s*\\S`, "im").test(findingBody);
      });
      const wellFormed = !!exactSuffix
        && severityTags.length === 1
        && statusTags.length === 1
        && missingFields.length === 0;
      return wellFormed
        ? {
          heading,
          severity: exactSuffix[1].toUpperCase(),
          status: exactSuffix[2].toUpperCase(),
          missingFields,
        }
        : {
          heading: `${level} ${heading}`,
          severity: null,
          status: null,
          missingFields,
        };
    });
    const malformed = parsedFindings.filter((finding) => !finding.severity);
    if (malformed.length > 0) {
      return {
        passed: false,
        label: "Review disposition is release-eligible",
        detail: `malformed finding(s): ${malformed.map((finding) => `${finding.heading}${finding.missingFields.length ? ` missing=${finding.missingFields.join(",")}` : ""}`).join("; ")}`,
      };
    }

    const taggedTokens = [...findingsBody.matchAll(/\[(CRITICAL|HIGH|MEDIUM|LOW|OPEN|RESOLVED)\]/gi)];
    if (taggedTokens.length !== parsedFindings.length * 2) {
      return {
        passed: false,
        label: "Review disposition is release-eligible",
        detail: "severity/status tags must appear exactly once in each structured finding heading and nowhere else in Findings",
      };
    }

    const blockingSeverities = new Set(["CRITICAL", "HIGH", "MEDIUM"]);
    const unresolvedBlocking = parsedFindings
      .filter((finding) => finding.status === "OPEN" && blockingSeverities.has(finding.severity))
      .map((finding) => finding.heading);
    if (unresolvedBlocking.length > 0) {
      return {
        passed: false,
        label: "Review disposition is release-eligible",
        detail: `approval conflicts with unresolved blocking finding(s): ${unresolvedBlocking.join("; ")}`,
      };
    }
  }

  return {
    passed: true,
    label: "Review disposition is release-eligible",
    detail: `approval disposition=${disposition}`,
  };
}

function checkSkillReviews(skillName) {
  const all = listReviewFiles(skillName);
  if (all.length === 0) {
    return {
      skill: skillName,
      passed: false,
      reason: "no review files found",
      files: [],
    };
  }

  // Pick the most-recent advocate and adversary
  const latest = {};
  for (const e of all) {
    if (!latest[e.role]) latest[e.role] = e;
  }

  const fileReports = [];
  for (const role of ROLES) {
    if (!latest[role]) {
      fileReports.push({
        role,
        present: false,
        passed: false,
        issues: [{ passed: false, label: `${role} review file present`, detail: "no file matching YYYY-MM-DD-" + role + "-review.md" }],
      });
      continue;
    }
    const entry = latest[role];
    const issues = checkOneReview(skillName, entry);
    fileReports.push({
      role,
      present: true,
      file: path.relative(REPO_ROOT, entry.absPath),
      date: entry.date,
      passed: issues.every(i => i.passed),
      issues,
    });
  }

  return {
    skill: skillName,
    passed: fileReports.every(r => r.passed),
    files: fileReports,
  };
}

function cmdCheck(args) {
  let skillNames;
  if (args.all) {
    skillNames = selfDevelopedSkills();
  } else {
    const name = args._[0];
    if (!name) {
      console.error("peer-review: 'check' requires a skill name or --all");
      return 2;
    }
    const skills = selfDevelopedSkills();
    if (!skills.includes(name)) {
      console.error(`peer-review: skill '${name}' is not self-developed`);
      return 5;
    }
    skillNames = [name];
  }

  const reports = skillNames.map(checkSkillReviews);

  if (args.json) {
    console.log(JSON.stringify({
      summary: {
        total: reports.length,
        passed: reports.filter(r => r.passed).length,
        failed: reports.filter(r => !r.passed).length,
      },
      skills: reports,
    }, null, 2));
  } else {
    for (const r of reports) {
      const head = r.passed
        ? color(COLORS.green, "PASS")
        : color(COLORS.red, "FAIL");
      console.log(`${head}  ${color(COLORS.bold, r.skill)}`);
      if (r.reason) {
        console.log(`  ${color(COLORS.red, r.reason)}`);
        continue;
      }
      for (const f of r.files) {
        const icon = f.passed
          ? color(COLORS.green, "  ✓")
          : color(COLORS.red, "  ✗");
        const file = f.present ? f.file : "(missing)";
        console.log(`${icon} ${f.role.padEnd(10)} ${color(COLORS.dim, file)}`);
        if (!f.passed) {
          for (const issue of f.issues) {
            if (!issue.passed) {
              console.log(`      ${color(COLORS.red, "✗")} ${issue.label}`);
              if (issue.detail) console.log(`        ${color(COLORS.dim, issue.detail)}`);
            }
          }
        }
      }
      console.log("");
    }
    const passCount = reports.filter(r => r.passed).length;
    const failCount = reports.length - passCount;
    const summary = failCount === 0
      ? color(COLORS.green, `=== Result: ${passCount}/${reports.length} skills have valid reviews ===`)
      : color(COLORS.red, `=== Result: ${passCount}/${reports.length} skills have valid reviews, ${failCount} failed ===`);
    console.log(summary);
  }

  return reports.some(r => !r.passed) ? 1 : 0;
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

function parseArgs(argv) {
  const out = { _: [], json: false, all: false, force: false, help: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--json") out.json = true;
    else if (a === "--all") out.all = true;
    else if (a === "--force") out.force = true;
    else if (a === "--help" || a === "-h") out.help = true;
    else if (a.startsWith("--")) {
      const e = new Error(`unknown flag: ${a}`);
      e.code = "EUSAGE";
      throw e;
    } else out._.push(a);
  }
  return out;
}

function printHelp() {
  console.log("Usage:");
  console.log("  node tools/peer-review.js generate <skill> [--force]");
  console.log("  node tools/peer-review.js check <skill> [--json]");
  console.log("  node tools/peer-review.js check --all [--json]");
  console.log("");
  console.log("Gate 2 — peer review prompt generation and review-file validation.");
  console.log("");
  console.log("Subcommands:");
  console.log("  generate     Write advocate + adversary prompt files for a skill.");
  console.log("  check        Validate existing review files against the schema.");
  console.log("");
  console.log("Exit codes: 0=ok, 1=check failed, 2=usage, 4=conflict, 5=integrity");
}

function main(argv) {
  if (argv.length === 0 || argv[0] === "--help" || argv[0] === "-h") {
    printHelp();
    return 0;
  }

  const sub = argv[0];
  let args;
  try {
    args = parseArgs(argv.slice(1));
  } catch (e) {
    console.error(`peer-review: ${e.message}`);
    return 2;
  }

  if (args.help) {
    printHelp();
    return 0;
  }

  try {
    if (sub === "generate") return cmdGenerate(args);
    if (sub === "check") return cmdCheck(args);
    console.error(`peer-review: unknown subcommand '${sub}'`);
    printHelp();
    return 2;
  } catch (e) {
    if (e.code === "EINTEGRITY") {
      console.error(`peer-review: ${e.message}`);
      return 5;
    }
    console.error(`peer-review: ${e.stack || e.message}`);
    return 1;
  }
}

if (require.main === module) {
  process.exit(main(process.argv.slice(2)));
}

module.exports = {
  selfDevelopedSkills,
  buildAdvocatePrompt,
  buildAdversaryPrompt,
  checkSkillReviews,
  checkOneReview,
  listReviewFiles,
  parseScopePrompt,
  validateReviewDisposition,
  validateScopeContractContent,
};
