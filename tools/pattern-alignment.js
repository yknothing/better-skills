#!/usr/bin/env node
// Gate 3: Pattern Alignment — verify that patterns declared for each
// self-developed skill in skills.json are actually present in the SKILL.md
// body (by name or by any documented alias from the pattern's frontmatter).
//
// Strict checks:
//   - Each declared pattern resolves to a documented pattern file.
//     (This is also enforced by tools/check-patterns.sh; we re-check here so
//      this script is self-contained.)
//
// Soft checks (warn-only by default):
//   - Each declared pattern's name or any of its also_named_as aliases
//     appears at least once in the skill body. Missing → drift warning.
//     Pass --strict to upgrade these warnings to failures.
//
// Usage:
//   node tools/pattern-alignment.js                  # all self-developed skills
//   node tools/pattern-alignment.js <skill>          # one skill
//   node tools/pattern-alignment.js --json
//   node tools/pattern-alignment.js --strict         # drift → fail (not warn)
//
// Exit codes: 0=pass, 1=fail, 2=usage, 5=integrity
"use strict";

const fs = require("fs");
const path = require("path");
const { COLORS, color } = require("../lib/term");

const REPO_ROOT = path.resolve(__dirname, "..");
const SKILLS_DIR = path.join(REPO_ROOT, "skills");
const SKILLS_JSON = path.join(REPO_ROOT, "skills.json");
const PATTERNS_DIR = path.join(REPO_ROOT, "docs", "patterns");
// UTF-8 BOM (U+FEFF) — stripped on read so frontmatter detection isn't broken.
const UTF8_BOM = 0xFEFF;

// ---------------------------------------------------------------------------
// Pattern index — same shape as validate.js but standalone
// ---------------------------------------------------------------------------

function parsePatternFrontmatter(src) {
  if (!src.startsWith("---\n")) return null;
  const end = src.indexOf("\n---", 4);
  if (end < 0) return null;
  const block = src.slice(4, end);
  const out = {};
  const lines = block.split("\n");
  let listKey = null;

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    if (!rawLine.trim() || rawLine.trimStart().startsWith("#")) {
      listKey = null;
      continue;
    }
    if (rawLine.match(/^\s*-\s+/)) {
      const value = rawLine.replace(/^\s*-\s*/, "").trim().replace(/^["']|["']$/g, "");
      if (listKey) {
        if (!Array.isArray(out[listKey])) out[listKey] = [];
        out[listKey].push(value);
      }
      continue;
    }
    listKey = null;
    const m = rawLine.match(/^([a-zA-Z_][a-zA-Z0-9_]*):\s*(.*)$/);
    if (!m) continue;
    const [, key, raw] = m;
    const v = raw.trim();
    if (v === "" || v === ">") {
      // Empty scalar OR a YAML folded block scalar (`description: >` followed
      // by indented continuation lines). For the `>` case, join the following
      // indented lines into one string so a multi-line description still parses.
      if (v === ">") {
        let acc = "";
        for (let j = i + 1; j < lines.length; j++) {
          if (/^[a-zA-Z_]/.test(lines[j]) || /^---/.test(lines[j])) break;
          if (lines[j].trim()) acc += " " + lines[j].trim();
        }
        out[key] = acc.trim();
        listKey = key;
      } else {
        out[key] = "";
        listKey = key;
      }
    } else if (v.startsWith("[") && v.endsWith("]")) {
      out[key] = v.slice(1, -1).split(",").map(s => s.trim().replace(/^["']|["']$/g, "")).filter(Boolean);
    } else {
      out[key] = v.replace(/^["']|["']$/g, "");
    }
  }
  return out;
}

function buildPatternIndex() {
  // slug → { name, also_named_as: string[], chinese_name, file }
  const index = new Map();
  if (!fs.existsSync(PATTERNS_DIR)) return index;

  for (const catDir of fs.readdirSync(PATTERNS_DIR, { withFileTypes: true })) {
    if (!catDir.isDirectory()) continue;
    const catPath = path.join(PATTERNS_DIR, catDir.name);
    for (const f of fs.readdirSync(catPath)) {
      if (!f.endsWith(".md")) continue;
      const filePath = path.join(catPath, f);
      const src = fs.readFileSync(filePath, "utf-8");
      const fm = parsePatternFrontmatter(src);
      if (!fm || !fm.name) continue;
      const entry = {
        name: fm.name,
        also_named_as: fm.also_named_as || [],
        chinese_name: fm.chinese_name || "",
        file: path.relative(REPO_ROOT, filePath),
      };
      index.set(fm.name, entry);
      for (const alias of entry.also_named_as) {
        if (!index.has(alias)) index.set(alias, entry);
      }
    }
  }
  return index;
}

// ---------------------------------------------------------------------------
// Detection: is this pattern alluded to in this skill body?
// ---------------------------------------------------------------------------

function patternAlludedTo(skillBody, patternEntry) {
  // Check the canonical name, the slug-as-words form, every alias, and the
  // chinese_name. Also generate "stem" forms by trimming trailing filler
  // words (first / rules / pattern / checklist / protocol / loop) — many
  // skills write "Hard Rules" for the hard-rules-first pattern, "Self-Review"
  // for self-review-checklist, etc. Case-insensitive substring match.
  const fmEnd = skillBody.indexOf("\n---", 4);
  const body = fmEnd > 0 ? skillBody.slice(fmEnd + 4) : skillBody;
  // Normalize so "self-review" and "self review" and "Self-Review" all match:
  // lowercase, then collapse hyphen/em-dash/slash to space. chinese_name is
  // checked separately below against the raw body — this normalization would
  // mangle CJK text.
  const haystack = body.toLowerCase().replace(/[-—/]/g, " ");

  const stemWords = new Set(["first", "rules", "rule", "pattern", "checklist", "protocol", "loop", "gate", "gates"]);

  function stemsOf(name) {
    const words = name.replace(/-/g, " ").split(/\s+/);
    // Generate progressively shorter forms by stripping trailing stem words.
    // e.g. "self-review-checklist-pattern" → all four forms down to "self review".
    // longest-first so we prefer the most specific match.
    const forms = [words.join(" ")];
    let trimmed = [...words];
    while (trimmed.length >= 2 && stemWords.has(trimmed[trimmed.length - 1])) {
      trimmed = trimmed.slice(0, -1);
      forms.push(trimmed.join(" "));
    }
    return forms;
  }

  const candidates = [];
  candidates.push(...stemsOf(patternEntry.name));
  for (const alias of patternEntry.also_named_as) candidates.push(...stemsOf(alias));
  const uniq = [...new Set(candidates.filter(Boolean))];

  for (const c of uniq) {
    const needle = c.toLowerCase().replace(/[-—/]/g, " ");
    if (haystack.includes(needle)) return { found: true, matched: c };
  }
  // chinese_name is checked against the raw body (the haystack normalization
  // above would mangle CJK text) — many skills reference patterns by their
  // chinese_name, so this is a real signal.
  if (patternEntry.chinese_name) {
    if (body.includes(patternEntry.chinese_name)) {
      return { found: true, matched: patternEntry.chinese_name };
    }
    uniq.push(patternEntry.chinese_name);
  }
  return { found: false, candidates: uniq };
}

// ---------------------------------------------------------------------------
// Per-skill check
// ---------------------------------------------------------------------------

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

function readSkillBody(skillName) {
  const p = path.join(SKILLS_DIR, skillName, "SKILL.md");
  if (!fs.existsSync(p)) {
    const e = new Error(`SKILL.md not found for '${skillName}' at ${p}`);
    e.code = "EINTEGRITY";
    throw e;
  }
  let content = fs.readFileSync(p, "utf-8");
  if (content.charCodeAt(0) === UTF8_BOM) content = content.slice(1);
  return content;
}

function checkSkillAlignment(skillName, skillEntry, patternIndex, body) {
  const declared = Array.isArray(skillEntry.patterns) ? skillEntry.patterns : [];

  const result = {
    skill: skillName,
    declared_count: declared.length,
    resolved: [],          // patterns that exist as documented files
    unresolved: [],        // patterns missing from docs/patterns (HARD FAIL)
    present_in_body: [],   // patterns alluded to in the skill body
    drift: [],             // patterns declared but NOT alluded to (SOFT WARN)
  };

  for (const p of declared) {
    const entry = patternIndex.get(p);
    if (!entry) {
      result.unresolved.push(p);
      continue;
    }
    result.resolved.push(p);

    const allusion = patternAlludedTo(body, entry);
    if (allusion.found) {
      result.present_in_body.push({ pattern: p, matched: allusion.matched });
    } else {
      result.drift.push({
        pattern: p,
        searched: [
          entry.name,
          entry.name.replace(/-/g, " "),
          ...entry.also_named_as,
          entry.chinese_name,
        ].filter(Boolean),
      });
    }
  }

  // Hard fail: any unresolved pattern reference (registry → docs/patterns)
  // Soft warn: any drift (registry → body)
  result.hard_fail = result.unresolved.length > 0;
  result.soft_warn = result.drift.length > 0;

  return result;
}

// ---------------------------------------------------------------------------
// Output
// ---------------------------------------------------------------------------

function formatHuman(reports, opts) {
  const out = [];
  out.push(color(COLORS.bold, "=== Gate 3: Pattern Alignment ==="));
  out.push("");

  for (const r of reports) {
    const icon = r.hard_fail
      ? color(COLORS.red, "FAIL")
      : (r.soft_warn && opts.strict)
        ? color(COLORS.red, "FAIL")
        : r.soft_warn
          ? color(COLORS.yellow, "WARN")
          : color(COLORS.green, "PASS");
    out.push(`${icon}  ${color(COLORS.bold, r.skill)}  (${r.declared_count} pattern(s) declared)`);
    out.push(`  ${color(COLORS.dim, "resolved:")}     ${r.resolved.length}/${r.declared_count}`);
    if (r.unresolved.length > 0) {
      out.push(`  ${color(COLORS.red, "unresolved:")}   ${r.unresolved.join(", ")}`);
    }
    out.push(`  ${color(COLORS.dim, "in body:")}      ${r.present_in_body.length}/${r.resolved.length}`);
    if (r.drift.length > 0) {
      const tag = opts.strict ? color(COLORS.red, "drift:") : color(COLORS.yellow, "drift:");
      out.push(`  ${tag}        ${r.drift.map(d => d.pattern).join(", ")}`);
    }
    out.push("");
  }

  const failCount = reports.filter(r => r.hard_fail || (opts.strict && r.soft_warn)).length;
  const warnCount = reports.filter(r => !r.hard_fail && r.soft_warn).length;
  const passCount = reports.length - failCount - (opts.strict ? 0 : warnCount);

  const summary = [
    `pass=${passCount}`,
    `warn=${opts.strict ? 0 : warnCount}`,
    `fail=${failCount}`,
  ].join(", ");
  const colorFn = failCount > 0 ? COLORS.red : (warnCount > 0 ? COLORS.yellow : COLORS.green);
  out.push(color(colorFn, `=== Result: ${summary} ===`));
  return out.join("\n");
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function parseArgs(argv) {
  const out = { _: [], json: false, strict: false, help: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--json") out.json = true;
    else if (a === "--strict") out.strict = true;
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
  console.log("Usage: node tools/pattern-alignment.js [<skill>] [--strict] [--json]");
  console.log("");
  console.log("Gate 3: verify each skill's declared patterns resolve to documented");
  console.log("pattern files AND are alluded to in the skill body.");
  console.log("");
  console.log("Options:");
  console.log("  <skill>     Check one skill (default: all self-developed skills).");
  console.log("  --strict    Treat 'declared but missing from body' as FAIL (default: WARN).");
  console.log("  --json      Machine-readable output.");
  console.log("");
  console.log("Exit codes: 0=ok, 1=hard fail (or strict warn), 2=usage, 5=integrity");
}

function main(argv) {
  let args;
  try {
    args = parseArgs(argv);
  } catch (e) {
    console.error(`pattern-alignment: ${e.message}`);
    return 2;
  }
  if (args.help) {
    printHelp();
    return 0;
  }

  let data;
  try {
    data = loadSkillsJson();
  } catch (e) {
    console.error(`pattern-alignment: ${e.message}`);
    return 5;
  }

  const allSkills = Object.keys(data.skills?.["self-developed"] || {}).sort();
  let targets = allSkills;
  if (args._.length > 0) {
    const name = args._[0];
    if (!allSkills.includes(name)) {
      console.error(`pattern-alignment: skill '${name}' is not self-developed`);
      console.error(`available: ${allSkills.join(", ")}`);
      return 5;
    }
    targets = [name];
  }

  const patternIndex = buildPatternIndex();
  const reports = targets.map(skillName => {
    const skillEntry = data.skills["self-developed"][skillName];
    let body;
    try {
      body = readSkillBody(skillName);
    } catch (e) {
      return {
        skill: skillName,
        error: e.message,
        hard_fail: true,
        soft_warn: false,
        declared_count: 0,
        resolved: [],
        unresolved: [],
        present_in_body: [],
        drift: [],
      };
    }
    return checkSkillAlignment(skillName, skillEntry, patternIndex, body);
  });

  if (args.json) {
    console.log(JSON.stringify({
      summary: {
        total: reports.length,
        hard_fail: reports.filter(r => r.hard_fail).length,
        soft_warn: reports.filter(r => !r.hard_fail && r.soft_warn).length,
        pass: reports.filter(r => !r.hard_fail && !r.soft_warn).length,
        strict: args.strict,
      },
      skills: reports,
    }, null, 2));
  } else {
    console.log(formatHuman(reports, { strict: args.strict }));
  }

  const failed = reports.some(r => r.hard_fail || (args.strict && r.soft_warn));
  return failed ? 1 : 0;
}

if (require.main === module) {
  process.exit(main(process.argv.slice(2)));
}

module.exports = {
  buildPatternIndex,
  patternAlludedTo,
  checkSkillAlignment,
};
