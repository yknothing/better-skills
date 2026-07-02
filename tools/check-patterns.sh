#!/bin/bash
# tools/check-patterns.sh
#
# Pattern library integrity checker.
# Phase 1.C deliverable; foundation for Phase 2.C automated Pattern Alignment.
#
# What it checks:
#   1. Every pattern file under docs/patterns/<NN>-<category>/ has well-formed frontmatter
#      (required fields: name, chinese_name, category, sources, description, status).
#   2. Every file's `name` frontmatter equals its filename (without .md).
#   3. Every file's `category` frontmatter matches its parent directory's slug.
#   4. Every kebab-case string in any skill's `patterns:` array in skills.json
#      resolves to exactly one pattern file (matched by `name` or any `also_named_as` entry).
#      Unresolvable references are GHOSTS — exit 1.
#   5. Every active-status pattern file is referenced by at least one skill.
#      Unreferenced active patterns are ORPHANS — warning only, exit 0.
#
# Usage:
#   bash tools/check-patterns.sh           # human-readable report
#   bash tools/check-patterns.sh --json    # machine-readable JSON output
#
# Exit codes:
#   0 — all checks passed (orphan warnings are non-blocking)
#   1 — at least one ghost reference, missing required field, or filename/category mismatch
#   2 — usage error or filesystem precondition failed

set -uo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PATTERNS_DIR="$ROOT/docs/patterns"
SKILLS_JSON="$ROOT/skills.json"
JSON_OUT=0

if [ "${1:-}" = "--json" ]; then JSON_OUT=1; fi

[ -d "$PATTERNS_DIR" ] || { echo "ERROR: $PATTERNS_DIR not found" >&2; exit 2; }
[ -f "$SKILLS_JSON" ]  || { echo "ERROR: $SKILLS_JSON not found" >&2; exit 2; }
command -v node >/dev/null 2>&1 || { echo "ERROR: node is required" >&2; exit 2; }

# All heavy lifting in a single Node script — bash + sed/awk frontmatter parsing
# is too brittle for YAML-ish input.
node - "$PATTERNS_DIR" "$SKILLS_JSON" "$JSON_OUT" <<'NODE_SCRIPT'
const fs = require("fs");
const path = require("path");

const [PATTERNS_DIR, SKILLS_JSON, JSON_OUT_FLAG] = process.argv.slice(2);
const JSON_OUT = JSON_OUT_FLAG === "1";

const REQUIRED_FIELDS = ["name", "chinese_name", "category", "sources", "description", "status"];
const VALID_STATUS = new Set(["active", "proposed", "deprecated"]);
const VALID_SOURCES = new Set([
  "Anthropic", "Cursor", "CE", "Gstack", "Vercel",
  "Superpowers", "Karpathy", "Taste Skill", "Open Design", "Addy Osmani",
]);
const DESCRIPTION_MAX_CHARS = 200;

const VALID_CATEGORIES = {
  "01-behavior-constraint":  "behavior-constraint",
  "02-interaction-design":   "interaction-design",
  "03-quality-assurance":    "quality-assurance",
  "04-context-management":   "context-management",
  "05-task-routing":         "task-routing",
  "06-execution-control":    "execution-control",
  "07-knowledge-management": "knowledge-management",
  "08-skill-creation":       "skill-creation",
};

// --- Tiny YAML-frontmatter parser (only what we need: name/scalar, lists of scalars) ---
function parseFrontmatter(src) {
  if (!src.startsWith("---\n")) return null;
  const end = src.indexOf("\n---", 4);
  if (end < 0) return null;
  const block = src.slice(4, end);
  const out = {};
  let currentList = null;
  for (const rawLine of block.split("\n")) {
    if (!rawLine.trim() || rawLine.trimStart().startsWith("#")) continue;
    if (rawLine.startsWith("  - ") || rawLine.startsWith("- ")) {
      const value = rawLine.replace(/^\s*-\s*/, "").trim().replace(/^["']|["']$/g, "");
      if (currentList) {
        // Lazy-promote scalar placeholder to array on first list item
        if (!Array.isArray(out[currentList])) out[currentList] = [];
        out[currentList].push(value);
      }
      continue;
    }
    const m = rawLine.match(/^([a-zA-Z_][a-zA-Z0-9_]*):\s*(.*)$/);
    if (!m) { currentList = null; continue; }
    const [, key, raw] = m;
    const v = raw.trim();
    if (v === "" || v === ">") {
      // Empty scalar OR block scalar — could be followed by list items or by a folded multi-line.
      // Defer: leave as empty string; if list items follow, they'll lazy-promote (above).
      out[key] = v === ">" ? "__BLOCK_SCALAR__" : "";
      currentList = key;
    } else if (v === "[]") {
      out[key] = [];
      currentList = null;
    } else if (v.startsWith("[") && v.endsWith("]")) {
      out[key] = v.slice(1, -1).split(",").map(s => s.trim().replace(/^["']|["']$/g, "")).filter(Boolean);
      currentList = null;
    } else {
      out[key] = v.replace(/^["']|["']$/g, "");
      currentList = null;  // Scalar value committed; do not interpret subsequent lines as list of THIS key
    }
  }
  // Resolve folded block scalars (`description: >\n  long text`)
  const lines = block.split("\n");
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
  return out;
}

function listPatternFiles(dir) {
  const out = [];
  for (const sub of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!sub.isDirectory()) continue;
    if (!(sub.name in VALID_CATEGORIES)) continue;
    const subDir = path.join(dir, sub.name);
    for (const f of fs.readdirSync(subDir)) {
      if (!f.endsWith(".md")) continue;
      out.push({
        path: path.join(subDir, f),
        relPath: path.relative(PATTERNS_DIR, path.join(subDir, f)),
        category: VALID_CATEGORIES[sub.name],
        slug: f.replace(/\.md$/, ""),
      });
    }
  }
  return out;
}

const errors = [];   // hard failures — exit 1
const warnings = []; // soft signals — exit 0
const patterns = []; // [{ slug, category, fm, also_named_as }]

// --- 1, 2, 3: scan every pattern file ---
for (const f of listPatternFiles(PATTERNS_DIR)) {
  const src = fs.readFileSync(f.path, "utf-8");
  const fm = parseFrontmatter(src);
  if (!fm) {
    errors.push({ kind: "no_frontmatter", file: f.relPath });
    continue;
  }
  for (const k of REQUIRED_FIELDS) {
    if (fm[k] === undefined || fm[k] === "" || (Array.isArray(fm[k]) && fm[k].length === 0 && k === "sources")) {
      errors.push({ kind: "missing_field", file: f.relPath, field: k });
    }
  }
  // C1: description length cap (schema says ≤200 chars)
  if (typeof fm.description === "string" && fm.description.length > DESCRIPTION_MAX_CHARS) {
    errors.push({ kind: "description_too_long", file: f.relPath, length: fm.description.length, max: DESCRIPTION_MAX_CHARS });
  }
  // C2: sources must be a list (not a bare scalar)
  if (fm.sources !== undefined && fm.sources !== "" && !Array.isArray(fm.sources)) {
    errors.push({ kind: "sources_not_a_list", file: f.relPath, value_type: typeof fm.sources });
  }
  // C4: each source code must be a known abbreviation
  if (Array.isArray(fm.sources)) {
    for (const src of fm.sources) {
      if (!VALID_SOURCES.has(src)) {
        errors.push({ kind: "invalid_source", file: f.relPath, value: src, hint: "must be one of: " + [...VALID_SOURCES].join(", ") });
      }
    }
  }
  if (fm.status && !VALID_STATUS.has(fm.status)) {
    errors.push({ kind: "invalid_status", file: f.relPath, value: fm.status });
  }
  if (fm.name !== f.slug) {
    errors.push({ kind: "name_filename_mismatch", file: f.relPath, frontmatter_name: fm.name, filename: f.slug });
  }
  if (fm.category !== f.category) {
    errors.push({ kind: "category_dir_mismatch", file: f.relPath, frontmatter_category: fm.category, dir_category: f.category });
  }
  patterns.push({
    slug: f.slug,
    category: f.category,
    file: f.relPath,
    status: fm.status,
    name: fm.name,
    also_named_as: fm.also_named_as || [],
    chinese_name: fm.chinese_name,
  });
}

// --- 4: ghost-reference check (skills.json -> patterns/) ---
const skillsJson = JSON.parse(fs.readFileSync(SKILLS_JSON, "utf-8"));
const referencedBy = new Map(); // slug-or-alias -> [skill-name]
for (const [skillName, sk] of Object.entries(skillsJson.skills?.["self-developed"] || {})) {
  for (const p of sk.patterns || []) {
    if (!referencedBy.has(p)) referencedBy.set(p, []);
    referencedBy.get(p).push(skillName);
  }
}

const slugIndex = new Map();
for (const p of patterns) {
  slugIndex.set(p.slug, p);
  for (const alias of p.also_named_as || []) {
    if (!slugIndex.has(alias)) slugIndex.set(alias, p);
  }
}

const ghosts = [];
for (const [ref, users] of referencedBy.entries()) {
  if (!slugIndex.has(ref)) {
    ghosts.push({ ref, used_by: users });
  }
}
for (const g of ghosts) {
  errors.push({ kind: "ghost_reference", reference: g.ref, used_by: g.used_by });
}

// --- 5: orphan check (active pattern with no skill reference) ---
const orphans = [];
for (const p of patterns) {
  if (p.status !== "active") continue;
  const hits = referencedBy.get(p.slug) || [];
  const aliasHits = (p.also_named_as || []).flatMap(a => referencedBy.get(a) || []);
  if (hits.length === 0 && aliasHits.length === 0) {
    orphans.push(p.slug);
    warnings.push({ kind: "active_without_reference", file: p.file, slug: p.slug });
  }
}

// --- chinese_name uniqueness ---
const cnSeen = new Map();
for (const p of patterns) {
  if (!p.chinese_name) continue;
  if (cnSeen.has(p.chinese_name)) {
    errors.push({
      kind: "duplicate_chinese_name",
      chinese_name: p.chinese_name,
      files: [cnSeen.get(p.chinese_name), p.file],
    });
  } else {
    cnSeen.set(p.chinese_name, p.file);
  }
}

// --- summary ---
const summary = {
  total_patterns: patterns.length,
  by_status: {
    active:     patterns.filter(p => p.status === "active").length,
    proposed:   patterns.filter(p => p.status === "proposed").length,
    deprecated: patterns.filter(p => p.status === "deprecated").length,
  },
  by_category: Object.fromEntries(
    Object.values(VALID_CATEGORIES).map(c => [c, patterns.filter(p => p.category === c).length])
  ),
  references_in_skills_json: referencedBy.size,
  ghosts: ghosts.length,
  orphans: orphans.length,
  errors: errors.length,
  warnings: warnings.length,
};

if (JSON_OUT) {
  console.log(JSON.stringify({ summary, errors, warnings, ghosts, orphans }, null, 2));
} else {
  console.log("=== Pattern Library Check ===\n");
  console.log("Total pattern files:        " + summary.total_patterns);
  console.log("  active:                   " + summary.by_status.active);
  console.log("  proposed:                 " + summary.by_status.proposed);
  console.log("  deprecated:               " + summary.by_status.deprecated);
  console.log("By category:");
  for (const [c, n] of Object.entries(summary.by_category)) {
    console.log("  " + c.padEnd(24) + n);
  }
  console.log("");
  console.log("Unique skills.json refs:    " + summary.references_in_skills_json);
  console.log("Ghost references:           " + summary.ghosts + (summary.ghosts ? "  ❌" : "  ✓"));
  console.log("Orphan active patterns:     " + summary.orphans + (summary.orphans ? "  ⚠️" : "  ✓"));
  console.log("");
  if (errors.length) {
    console.log("--- ERRORS (" + errors.length + ") ---");
    for (const e of errors) console.log("  ❌ " + JSON.stringify(e));
    console.log("");
  }
  if (warnings.length) {
    console.log("--- WARNINGS (" + warnings.length + ") ---");
    for (const w of warnings) console.log("  ⚠️  " + JSON.stringify(w));
    console.log("");
  }
  if (errors.length === 0 && warnings.length === 0) {
    console.log("✓ All checks passed.");
  } else if (errors.length === 0) {
    console.log("✓ No errors. Warnings are non-blocking.");
  } else {
    console.log("❌ " + errors.length + " error(s). Pattern library check FAILED.");
  }
}

process.exit(errors.length > 0 ? 1 : 0);
NODE_SCRIPT
