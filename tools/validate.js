#!/usr/bin/env node
// Gate 1: Self-Review — structural validation for Agent Skills.
//
// Replaces the bash validate.sh with a deterministic, machine-readable checker.
// Zero runtime dependencies; Node built-ins only.
//
// Usage:
//   node tools/validate.js <skill-dir>
//   node tools/validate.js <skill-dir> --json
//   bash tools/validate.sh <skill-dir>          # 2-line backward-compat wrapper
//
// Exit codes: 0=all pass, 1=at least one fail, 2=usage error, 5=integrity error
"use strict";

const fs = require("fs");
const path = require("path");

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const REPO_ROOT = path.resolve(__dirname, "..");
const SKILLS_JSON_PATH = path.join(REPO_ROOT, "skills.json");
const PATTERNS_DIR = path.join(REPO_ROOT, "docs", "patterns");

const VALID_TIERS = new Set(["deep", "standard", "lightweight"]);
const NAME_RE = /^[a-z][a-z0-9-]*$/;
const MAX_NAME_LEN = 64;
const BODY_MIN_BYTES = 500;
const WORD_MAX = 5000;
const SECRET_RE = /(api_key|api_secret|password|token)\s*[:=]\s*["'][a-zA-Z0-9_\-]{20,}/i;
const DESTRUCTIVE_RE = /rm\s+-rf\s+\/(\s|$)/;

// ---------------------------------------------------------------------------
// I/O helpers
// ---------------------------------------------------------------------------

function readSkillFile(p) {
  let content = fs.readFileSync(p, "utf-8");
  // Strip UTF-8 BOM (some Windows editors prepend it). Without this,
  // lines[0] starts with U+FEFF and every frontmatter check fails on a
  // legitimate file.
  if (content.charCodeAt(0) === 0xFEFF) content = content.slice(1);
  return content;
}

// ---------------------------------------------------------------------------
// Frontmatter parser
// ---------------------------------------------------------------------------

function parseFrontmatter(content) {
  const lines = content.split(/\r?\n/);
  if (lines[0] !== "---") return { error: "missing opening delimiter" };

  let endLine = -1;
  for (let i = 1; i < lines.length; i++) {
    if (lines[i] === "---") { endLine = i; break; }
  }
  if (endLine < 0) return { error: "missing closing delimiter" };

  const fields = {};
  let tierComment = null;
  const unexpectedFields = [];

  for (let i = 1; i < endLine; i++) {
    const raw = lines[i];
    const trimmed = raw.trim();

    // Skip blanks and pure comments
    if (!trimmed || (trimmed.startsWith("#") && !trimmed.startsWith("# tier:"))) continue;

    // Detect tier comment
    const tierMatch = trimmed.match(/^#\s*tier:\s*(.+)$/);
    if (tierMatch) {
      tierComment = tierMatch[1].trim();
      continue;
    }

    // Skip other comments
    if (trimmed.startsWith("#")) continue;

    const colonIdx = raw.indexOf(":");
    if (colonIdx < 0) continue; // malformed line, skip

    const key = raw.slice(0, colonIdx).trim();
    const value = raw.slice(colonIdx + 1).trim();

    if (key === "name" || key === "description") {
      fields[key] = value;
    } else {
      unexpectedFields.push(key);
    }
  }

  return { fields, tierComment, unexpectedFields, bodyStartLine: endLine + 1 };
}

// ---------------------------------------------------------------------------
// Pattern index
// ---------------------------------------------------------------------------

let _patternIndex = null;

function buildPatternIndex(patternsDir) {
  if (_patternIndex) return _patternIndex;

  const index = new Map(); // slug → { file, also_named_as: string[] }

  if (!fs.existsSync(patternsDir)) return index;

  for (const catDir of fs.readdirSync(patternsDir, { withFileTypes: true })) {
    if (!catDir.isDirectory()) continue;
    const catPath = path.join(patternsDir, catDir.name);
    for (const f of fs.readdirSync(catPath)) {
      if (!f.endsWith(".md")) continue;
      const filePath = path.join(catPath, f);
      const src = fs.readFileSync(filePath, "utf-8");
      const fm = parsePatternFrontmatter(src);
      if (!fm || !fm.name) continue;

      const entry = {
        file: path.relative(REPO_ROOT, filePath),
        also_named_as: fm.also_named_as || [],
      };
      index.set(fm.name, entry);
      for (const alias of fm.also_named_as || []) {
        if (!index.has(alias)) index.set(alias, entry);
      }
    }
  }

  _patternIndex = index;
  return index;
}

function parsePatternFrontmatter(src) {
  if (!src.startsWith("---\n")) return null;
  const end = src.indexOf("\n---", 4);
  if (end < 0) return null;
  const block = src.slice(4, end);
  const out = {};

  const lines = block.split("\n");
  let inList = false;
  for (const rawLine of lines) {
    if (!rawLine.trim() || rawLine.trimStart().startsWith("#")) {
      inList = false;
      continue;
    }

    // List item
    if (rawLine.match(/^\s*-\s+/)) {
      const value = rawLine.replace(/^\s*-\s*/, "").trim().replace(/^["']|["']$/g, "");
      if (inList && out._listKey) {
        if (!Array.isArray(out[out._listKey])) out[out._listKey] = [];
        out[out._listKey].push(value);
      }
      continue;
    }

    inList = false;
    const m = rawLine.match(/^([a-zA-Z_][a-zA-Z0-9_]*):\s*(.*)$/);
    if (!m) continue;

    const [, key, raw] = m;
    const v = raw.trim();

    if (v === "" || v === ">") {
      out[key] = "";
      out._listKey = key;
      inList = true;
    } else if (v.startsWith("[") && v.endsWith("]")) {
      out[key] = v.slice(1, -1).split(",").map(s => s.trim().replace(/^["']|["']$/g, "")).filter(Boolean);
      inList = false;
    } else {
      out[key] = v.replace(/^["']|["']$/g, "");
      inList = false;
    }
  }

  // Resolve folded block scalars
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(/^([a-zA-Z_][a-zA-Z0-9_]*):\s*>\s*$/);
    if (!m) continue;
    const key = m[1];
    let acc = "";
    for (let j = i + 1; j < lines.length; j++) {
      if (/^[a-zA-Z_]/.test(lines[j]) || /^---/.test(lines[j])) break;
      acc += " " + lines[j].trim();
    }
    out[key] = acc.trim();
  }

  delete out._listKey;
  return out;
}

// ---------------------------------------------------------------------------
// Check helpers
// ---------------------------------------------------------------------------

function pass(label, detail) {
  return { status: "pass", label, detail: detail || "" };
}

function fail(label, detail) {
  return { status: "fail", label, detail: detail || "" };
}

function warn(label, detail) {
  return { status: "warn", label, detail: detail || "" };
}

// ---------------------------------------------------------------------------
// Check 1: SKILL.md exists (inline in runChecks for fail-fast semantics)
// ---------------------------------------------------------------------------
// Check 2-3: Frontmatter delimiters
// ---------------------------------------------------------------------------

function checkFrontmatterDelimiters(content) {
  const results = [];
  const lines = content.split(/\r?\n/);

  if (lines[0] === "---") {
    results.push(pass("Frontmatter opening delimiter (---)"));
  } else {
    results.push(fail("Frontmatter opening delimiter (---)", "first line must be ---"));
  }

  let foundClose = false;
  for (let i = 1; i < lines.length; i++) {
    if (lines[i] === "---") { foundClose = true; break; }
  }
  if (foundClose) {
    results.push(pass("Frontmatter closing delimiter (---)"));
  } else {
    results.push(fail("Frontmatter closing delimiter (---)", "no closing --- found after line 1"));
  }

  return results;
}

// ---------------------------------------------------------------------------
// Check 4-5: Required fields (name, description)
// ---------------------------------------------------------------------------

function checkRequiredFields(fm) {
  const results = [];
  if (fm.fields.name) {
    results.push(pass("Required field: name"));
  } else {
    results.push(fail("Required field: name", "frontmatter missing 'name' field"));
  }
  if (fm.fields.description) {
    results.push(pass("Required field: description"));
  } else {
    results.push(fail("Required field: description", "frontmatter missing 'description' field"));
  }
  return results;
}

// ---------------------------------------------------------------------------
// Check 6: Name format (kebab-case)
// ---------------------------------------------------------------------------

function checkNameFormat(fm) {
  const name = fm.fields.name;
  if (!name) {
    return fail("Name is kebab-case: <missing>", "name field is absent; cannot check format");
  }
  if (name.length > MAX_NAME_LEN) {
    return fail(
      `Name is kebab-case: ${name}`,
      `name is ${name.length} chars; max is ${MAX_NAME_LEN}`
    );
  }
  if (NAME_RE.test(name)) {
    return pass(`Name is kebab-case: ${name}`);
  }
  return fail(
    `Name is kebab-case: ${name}`,
    `name must match /^[a-z][a-z0-9-]*$/ (lowercase kebab-case)`
  );
}

// ---------------------------------------------------------------------------
// Check 7: Description starts with "Use when"
// ---------------------------------------------------------------------------

function checkDescriptionUseWhen(fm) {
  const desc = fm.fields.description;
  if (!desc) {
    return fail("Description starts with 'Use when'", "description field is absent");
  }
  if (/use when/i.test(desc)) {
    return pass("Description starts with 'Use when'");
  }
  return fail(
    "Description starts with 'Use when'",
    `description starts with: "${desc.slice(0, 60)}..."`
  );
}

// ---------------------------------------------------------------------------
// Check 8: Body size >= 500 bytes
// ---------------------------------------------------------------------------

function checkBodySize(content, fm) {
  const bodyStart = typeof fm.bodyStartLine === "number" ? fm.bodyStartLine : 0;
  const bodyLines = content.split(/\r?\n/).slice(bodyStart);
  const bodyText = bodyLines.join("\n");
  const size = Buffer.byteLength(bodyText, "utf-8");
  if (size >= BODY_MIN_BYTES) {
    return pass(`Body size >= ${BODY_MIN_BYTES} bytes (actual: ${size})`);
  }
  return fail(
    `Body size >= ${BODY_MIN_BYTES} bytes (actual: ${size})`,
    `body content is only ${size} bytes; minimum is ${BODY_MIN_BYTES}`
  );
}

// ---------------------------------------------------------------------------
// Check 9: Word count <= 5000
// ---------------------------------------------------------------------------

function checkWordCount(content) {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  if (words <= WORD_MAX) {
    return pass(`Word count <= ${WORD_MAX} (actual: ${words})`);
  }
  return fail(
    `Word count <= ${WORD_MAX} (actual: ${words})`,
    `skill has ${words} words; max is ${WORD_MAX}`
  );
}

// ---------------------------------------------------------------------------
// Check 10: No hardcoded secrets
// ---------------------------------------------------------------------------

function checkNoSecrets(content) {
  if (SECRET_RE.test(content)) {
    return fail("No hardcoded secrets", "file contains what looks like an API key or token");
  }
  return pass("No hardcoded secrets");
}

// ---------------------------------------------------------------------------
// Check 11: No destructive filesystem commands
// ---------------------------------------------------------------------------

function checkNoDestructive(content) {
  if (DESTRUCTIVE_RE.test(content)) {
    return fail(
      "No destructive filesystem commands",
      "file contains 'rm -rf /' or similar destructive command"
    );
  }
  return pass("No destructive filesystem commands");
}

// ---------------------------------------------------------------------------
// Check 12: Name matches directory
// ---------------------------------------------------------------------------

function checkNameMatchesDir(fm, skillDir) {
  const dirName = path.basename(skillDir);
  const fmName = fm.fields.name;
  if (!fmName) {
    return fail(
      `Name matches directory: ${dirName}`,
      "name field is absent; cannot check directory match"
    );
  }
  if (fmName === dirName) {
    return pass(`Name matches directory: ${fmName} === ${dirName}`);
  }
  return fail(
    `Name matches directory: ${fmName} !== ${dirName}`,
    `frontmatter name "${fmName}" does not match directory name "${dirName}"`
  );
}

// ---------------------------------------------------------------------------
// Check 13: Pattern-reference integrity
// ---------------------------------------------------------------------------

function checkPatternReferences(skillName, skillsJson, patternsDir) {
  let skillsData;
  try {
    skillsData = JSON.parse(fs.readFileSync(skillsJson, "utf-8"));
  } catch (e) {
    return fail(
      "Pattern references resolve to documented patterns",
      `cannot read skills.json: ${e.message}`
    );
  }

  const skillEntry = (skillsData.skills?.["self-developed"] || {})[skillName];
  if (!skillEntry) {
    // Not a self-developed skill — nothing to check
    return pass("Pattern references resolve to documented patterns (N/A — external skill)");
  }

  const declared = Array.isArray(skillEntry.patterns) ? skillEntry.patterns : [];
  if (declared.length === 0) {
    return pass("Pattern references resolve to documented patterns (none declared)");
  }

  const index = buildPatternIndex(patternsDir);
  const unresolved = [];
  for (const p of declared) {
    if (!index.has(p)) {
      unresolved.push(p);
    }
  }

  if (unresolved.length === 0) {
    return pass(
      `Pattern references resolve to documented patterns (${declared.length}/${declared.length})`
    );
  }

  return fail(
    `Pattern references resolve to documented patterns (${declared.length - unresolved.length}/${declared.length})`,
    `unresolved pattern references: ${unresolved.join(", ")}`
  );
}

// ---------------------------------------------------------------------------
// Check 14: Gate-syntax conformance
// ---------------------------------------------------------------------------

function checkGateSyntax(content, skillDir) {
  // Collect all HARD-GATE tags from SKILL.md and bundled reference files
  const allTags = [];

  // Scan SKILL.md
  collectGateTags(content, "SKILL.md", allTags);

  // Scan bundled reference files
  const refFiles = findBundledResourceFiles(content, skillDir);
  for (const ref of refFiles) {
    try {
      const refContent = readSkillFile(ref.absPath);
      collectGateTags(refContent, ref.relPath, allTags);
    } catch (_) {
      // can't read — not a gate issue, resource check will catch this
    }
  }

  if (allTags.length === 0) {
    return warn(
      "Gate syntax conformance",
      "no <HARD-GATE> tags found (not required, but recommended for tier ≥ standard)"
    );
  }

  const issues = [];

  for (const tag of allTags) {
    if (!tag.closed) {
      issues.push(`${tag.file}: unclosed <HARD-GATE> at line ${tag.openLine} (no matching </HARD-GATE>)`);
    }
    if (!tag.hasAttr) {
      issues.push(
        `${tag.file}: <HARD-GATE> at line ${tag.openLine} missing label= or id= attribute`
      );
    }
  }

  if (issues.length === 0) {
    return pass(
      `Gate syntax conformance (${allTags.length} tag(s) well-formed)`
    );
  }

  return fail(
    `Gate syntax conformance (${issues.length} issue(s) in ${allTags.length} tag(s))`,
    issues.join("; ")
  );
}

function collectGateTags(content, filePath, out) {
  // Strip backtick code spans to avoid matching <HARD-GATE> in prose examples
  const cleaned = content.replace(/`[^`]*`/g, (m) => " ".repeat(m.length));
  // Also strip markdown code blocks
  const cleaned2 = cleaned.replace(/```[\s\S]*?```/g, (m) => " ".repeat(m.length));

  const openRe = /<HARD-GATE(?=[\s>])/g;
  const closeRe = /<\/HARD-GATE>/g;

  // Find all opens in cleaned content
  const opens = [];
  let m;
  while ((m = openRe.exec(cleaned2)) !== null) {
    const lineNum = cleaned2.slice(0, m.index).split(/\r?\n/).length;
    const tagText = cleaned2.slice(m.index, cleaned2.indexOf(">", m.index) + 1);
    const hasAttr = /\b(label|id)\s*=/.test(tagText);

    // Check for preceding heading pattern: ## HARD-GATE: <label>
    // Look up to 3 lines back (heading may be separated by blank lines)
    let hasHeadingLabel = false;
    const lineIdx = lineNum - 1;
    const lines = content.split(/\r?\n/);
    for (let back = 1; back <= 3 && lineIdx - back >= 0; back++) {
      const prevLine = lines[lineIdx - back].trim();
      if (/^#{1,3}\s+HARD-GATE:/.test(prevLine)) {
        hasHeadingLabel = true;
        break;
      }
      // Stop at non-blank lines that aren't headings
      if (prevLine && !prevLine.startsWith("#")) break;
    }

    opens.push({ line: lineNum, hasAttr: hasAttr || hasHeadingLabel });
  }

  // Find all closes in cleaned content
  const closes = [];
  while ((m = closeRe.exec(cleaned2)) !== null) {
    const lineNum = cleaned2.slice(0, m.index).split(/\r?\n/).length;
    closes.push(lineNum);
  }

  // Match opens to closes (simple stack-based)
  // Since HARD-GATEs don't nest, we just pair them in order
  for (let i = 0; i < opens.length; i++) {
    out.push({
      file: filePath,
      openLine: opens[i].line,
      closed: i < closes.length,
      hasAttr: opens[i].hasAttr,
    });
  }

  // Extra close tags
  if (closes.length > opens.length) {
    for (let i = opens.length; i < closes.length; i++) {
      out.push({
        file: filePath,
        openLine: closes[i],
        closed: true,
        hasAttr: false,
        extraClose: true,
      });
    }
  }
}

// ---------------------------------------------------------------------------
// Check 15: Bundled resource existence
// ---------------------------------------------------------------------------

function checkBundledResources(content, skillDir) {
  const refs = findBundledResourceFiles(content, skillDir);

  if (refs.length === 0) {
    return pass("Bundled resources exist (none referenced)");
  }

  const missing = [];
  for (const ref of refs) {
    if (!fs.existsSync(ref.absPath)) {
      missing.push(ref.relPath);
    }
  }

  if (missing.length === 0) {
    return pass(`Bundled resources exist (${refs.length}/${refs.length})`);
  }

  return fail(
    `Bundled resources exist (${refs.length - missing.length}/${refs.length})`,
    `missing: ${missing.join(", ")}`
  );
}

function findBundledResourceFiles(content, skillDir) {
  // Strip fenced code blocks and inline code spans first — references that
  // appear inside `examples` or ```code blocks``` are documentation, not
  // actual claims that the file exists. Without this, a skill that says
  // "see `references/guide.md`" inside a fence would falsely fail check 15.
  const cleaned = content
    .replace(/```[\s\S]*?```/g, (m) => " ".repeat(m.length))
    .replace(/~~~[\s\S]*?~~~/g, (m) => " ".repeat(m.length));

  const found = new Map(); // relPath → absPath

  // Markdown links: [text](references/foo.md), [text](./references/foo.md)
  const mdLinkRe = /\[([^\]]*)\]\(([^)]+)\)/g;
  let m;
  while ((m = mdLinkRe.exec(cleaned)) !== null) {
    // Strip optional title from `(target "title")` syntax
    const target = m[2].replace(/\s+["'].*?["']$/, "");
    // Only match relative paths referencing bundled resource dirs
    if (/^(\.\/)?(references|scripts|assets)\//.test(target)) {
      const rel = target.replace(/^\.\//, "");
      const abs = path.join(skillDir, rel);
      if (!found.has(rel)) found.set(rel, abs);
    }
  }

  // Inline code: `scripts/foo.sh`, `references/bar.md`. Only meaningful for
  // backticks that survived the fenced-block strip above — those are real
  // inline code spans referencing bundled resources, not example snippets.
  const codeRe = /`([^`]+)`/g;
  while ((m = codeRe.exec(cleaned)) !== null) {
    const target = m[1];
    if (/^(\.\/)?(references|scripts|assets)\/[^\s`]+/.test(target)) {
      const rel = target.replace(/^\.\//, "");
      const abs = path.join(skillDir, rel);
      if (!found.has(rel)) found.set(rel, abs);
    }
  }

  // Bare mentions: references/foo.md, scripts/bar.sh (not inside code/link)
  // Only catch unambiguous paths with file extensions
  const bareRe = /(?<![(`\[\w])(\.\/)?(references|scripts|assets)\/[\w./-]+\.\w{2,6}/g;
  while ((m = bareRe.exec(cleaned)) !== null) {
    // Check that this match is NOT inside a markdown link or code span
    const before = cleaned.slice(Math.max(0, m.index - 2), m.index);
    if (before === "](" || before === "`") continue;
    const rel = m[0].replace(/^\.\//, "");
    const abs = path.join(skillDir, rel);
    if (!found.has(rel)) found.set(rel, abs);
  }

  return Array.from(found.entries()).map(([relPath, absPath]) => ({ relPath, absPath }));
}

// ---------------------------------------------------------------------------
// Check 16: Frontmatter schema conformance
// ---------------------------------------------------------------------------

function checkFrontmatterSchema(fm) {
  const issues = [];

  // Check tier comment
  if (!fm.tierComment) {
    issues.push("missing '# tier: <deep|standard|lightweight>' comment in frontmatter");
  } else if (!VALID_TIERS.has(fm.tierComment)) {
    issues.push(
      `tier value "${fm.tierComment}" is not one of: ${[...VALID_TIERS].join(", ")}`
    );
  }

  // Check for unexpected fields
  if (fm.unexpectedFields && fm.unexpectedFields.length > 0) {
    // Warn only — future versions may add fields
    issues.push(`unexpected frontmatter fields: ${fm.unexpectedFields.join(", ")}`);
  }

  if (issues.length === 0) {
    return pass("Frontmatter schema conformance");
  }

  // If only unexpected fields, it's a warn
  const onlyUnexpected = issues.every(i => i.startsWith("unexpected"));
  if (onlyUnexpected) {
    return warn("Frontmatter schema conformance", issues.join("; "));
  }

  return fail("Frontmatter schema conformance", issues.join("; "));
}

// ---------------------------------------------------------------------------
// Orchestration
// ---------------------------------------------------------------------------

function runChecks(skillDir, options = {}) {
  const checks = [];
  let skillName = path.basename(skillDir);

  // Load SKILL.md
  const skillPath = path.join(skillDir, "SKILL.md");

  // Check 1
  if (!fs.existsSync(skillPath) || !fs.statSync(skillPath).isFile()) {
    checks.push(fail("SKILL.md exists", `no SKILL.md found in ${skillDir}`));
    // Can't continue without the file
    return { skill: skillName, path: skillPath, checks, passed: 0, failed: checks.length, warned: 0 };
  }
  checks.push(pass("SKILL.md exists"));

  const content = readSkillFile(skillPath);

  // Check 2-3: Frontmatter delimiters
  const delimResults = checkFrontmatterDelimiters(content);
  checks.push(...delimResults);

  // Parse frontmatter
  const fm = parseFrontmatter(content);

  if (fm.error) {
    // Can't continue with broken frontmatter
    checks.push(fail("Frontmatter parse", fm.error));
    const passed = checks.filter(c => c.status === "pass").length;
    const warned = checks.filter(c => c.status === "warn").length;
    const failed = checks.filter(c => c.status === "fail").length;
    return { skill: skillName, path: skillPath, checks, passed, failed, warned };
  }

  // Check 4-5: Required fields (name, description)
  checks.push(...checkRequiredFields(fm));

  // Check 6: Name format
  checks.push(checkNameFormat(fm));

  // Check 7: Description starts with "Use when"
  checks.push(checkDescriptionUseWhen(fm));

  // Check 8: Body size
  checks.push(checkBodySize(content, fm));

  // Check 9: Word count
  checks.push(checkWordCount(content));

  // Check 10: No secrets
  checks.push(checkNoSecrets(content));

  // Check 11: No destructive commands
  checks.push(checkNoDestructive(content));

  // Check 12: Name matches directory
  checks.push(checkNameMatchesDir(fm, skillDir));

  // Check 13: Pattern-reference integrity
  checks.push(checkPatternReferences(skillName, SKILLS_JSON_PATH, PATTERNS_DIR));

  // Check 14: Gate syntax conformance
  checks.push(checkGateSyntax(content, skillDir));

  // Check 15: Bundled resource existence
  checks.push(checkBundledResources(content, skillDir));

  // Check 16: Frontmatter schema
  checks.push(checkFrontmatterSchema(fm));

  const passed = checks.filter(c => c.status === "pass").length;
  const warned = checks.filter(c => c.status === "warn").length;
  const failed = checks.filter(c => c.status === "fail").length;

  return { skill: skillName, path: skillPath, checks, passed, failed, warned };
}

// ---------------------------------------------------------------------------
// Output formatting
// ---------------------------------------------------------------------------

const { COLORS, color } = require("../lib/term");

function formatHuman(results) {
  const lines = [];
  lines.push(`=== Validating: ${results.path} ===`);
  lines.push("");

  for (const c of results.checks) {
    const prefix = c.status === "pass"
      ? color(COLORS.green, "  PASS")
      : c.status === "warn"
        ? color(COLORS.yellow, "  WARN")
        : color(COLORS.red, "  FAIL");
    lines.push(`${prefix}: ${c.label}`);
    if (c.detail) {
      lines.push(color(COLORS.dim, `        ${c.detail}`));
    }
  }

  lines.push("");
  const summaryParts = [`${results.passed} passed`];
  if (results.warned > 0) summaryParts.push(`${results.warned} warned`);
  summaryParts.push(`${results.failed} failed`);
  lines.push(`=== Results: ${summaryParts.join(", ")} ===`);

  return lines.join("\n");
}

function formatJson(results) {
  // Don't mutate the caller's object — return a fresh object that includes
  // the derived exit_code. Read-only formatters are easier to compose.
  return JSON.stringify({ ...results, exit_code: results.failed > 0 ? 1 : 0 }, null, 2);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main(args) {
  let jsonOut = false;
  const positional = [];

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--json") {
      jsonOut = true;
    } else if (args[i] === "--help" || args[i] === "-h") {
      console.log("Usage: node tools/validate.js <skill-dir> [--json]");
      console.log("");
      console.log("Gate 1 structural validation for Agent Skills.");
      console.log("16 checks: frontmatter, body size, safety, patterns, gates, resources.");
      console.log("");
      console.log("Options:");
      console.log("  --json    Machine-readable JSON output");
      console.log("  --help    Show this help");
      console.log("");
      console.log("Exit codes: 0=all pass, 1=at least one fail, 2=usage error, 5=integrity");
      return 0;
    } else if (!args[i].startsWith("-")) {
      positional.push(args[i]);
    } else {
      console.error(`validate: unknown flag: ${args[i]}`);
      return 2;
    }
  }

  if (positional.length < 1) {
    console.error("Usage: node tools/validate.js <skill-dir> [--json]");
    return 2;
  }

  const skillDir = positional[0].replace(/\/$/, "");
  const absSkillDir = path.resolve(skillDir);

  // Integrity checks
  if (!fs.existsSync(absSkillDir) || !fs.statSync(absSkillDir).isDirectory()) {
    const msg = `skill directory not found: ${absSkillDir}`;
    if (jsonOut) {
      console.log(JSON.stringify({ error: msg, exit_code: 5 }));
    } else {
      console.error(`validate: ${msg}`);
    }
    return 5;
  }

  if (!fs.existsSync(SKILLS_JSON_PATH)) {
    const msg = `skills.json not found at ${SKILLS_JSON_PATH}`;
    if (jsonOut) {
      console.log(JSON.stringify({ error: msg, exit_code: 5 }));
    } else {
      console.error(`validate: ${msg}`);
    }
    return 5;
  }

  try {
    const results = runChecks(absSkillDir);
    if (jsonOut) {
      console.log(formatJson(results));
    } else {
      console.log(formatHuman(results));
    }
    return results.failed > 0 ? 1 : 0;
  } catch (e) {
    if (jsonOut) {
      console.log(JSON.stringify({ error: e.message, exit_code: 1 }));
    } else {
      console.error(`validate: ${e.message}`);
    }
    return 1;
  }
}

// ---------------------------------------------------------------------------
// Entry point
// ---------------------------------------------------------------------------

if (require.main === module) {
  const exitCode = main(process.argv.slice(2));
  process.exit(typeof exitCode === "number" ? exitCode : 1);
}

module.exports = { runChecks, parseFrontmatter };
