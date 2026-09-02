#!/usr/bin/env node
// Citation-integrity checker for MODEL-FROM-CODE deliveries (R7).
//
//   node check-evidence.js <delivery.md> [--repo <root>]
//
// Usage sample #4 showed fabricated entities (batch_id, created_at,
// UNFROZEN, Registrar, C1-C6) laundered through plausible `file:line`
// citations — C3's "a citation exists" test is satisfied by fiction. This
// resolves every citation against the repository:
//   E1 cited path exists (FAIL otherwise)
//   E2 cited line/range lies inside the file (FAIL otherwise)
//   E3 identifier-shaped tokens on the citing line (snake_case, camelCase,
//      `backticked`, ALL_CAPS) appear near the cited lines, or at least
//      somewhere in the file (WARN otherwise — "claimed identifier absent
//      from its own citation" is the fabrication signature)
// Format-bound like the other checkers: it proves a citation is *possible*,
// not that the diagram's claim is true. Exit 0 = no FAIL, 1 = FAIL, 2 = usage.
"use strict";

const fs = require("fs");
const path = require("path");

const CITE = /([\w*][\w*./-]*\.[a-z]{1,6}):(\d+)(?:\s*[-–]\s*(\d+))?/g;
const IDENT = /`([^`\n]{2,60})`|\b([A-Za-z][A-Za-z0-9]*(?:_[A-Za-z0-9]+)+)\b|\b([a-z]+[A-Z][A-Za-z0-9]+)\b|\b([A-Z][A-Z0-9]{3,}(?:_[A-Z0-9]+)*)\b/g;
const STOP = new Set(["MODEL_FROM_CODE", "MODEL_FROM_DESIGN", "RENDER_VERIFIED", "SYNTAX_VERIFIED", "UNVERIFIED", "USER_OVERRIDE", "HARD_GATE", "README", "SKILL", "CLAUDE", "HTML", "JSON", "YAML", "UML", "PASS", "FAIL", "WARN", "INFO", "TODO", "TBD"]);

function identifiers(line) {
  const out = new Set();
  for (const m of line.matchAll(IDENT)) {
    const tok = (m[1] || m[2] || m[3] || m[4] || "").trim();
    if (!tok || STOP.has(tok.replace(/-/g, "_"))) continue;
    if (/^[\w./-]+\.[a-z]{1,6}(?::\d+)?/.test(tok)) continue; // paths are not identifiers
    if (/^(?:https?|file):/.test(tok)) continue;
    out.add(tok);
  }
  return [...out];
}

function checkDelivery(md, repo) {
  const lines = md.split(/\r?\n/);
  const results = [];
  const cache = new Map();
  const load = (p) => {
    if (cache.has(p)) return cache.get(p);
    let v = null;
    try { v = fs.readFileSync(path.join(repo, p), "utf-8").split(/\r?\n/); } catch { v = null; }
    cache.set(p, v);
    return v;
  };
  lines.forEach((line, idx) => {
    const cites = [...line.matchAll(CITE)];
    if (cites.length === 0) return;
    const idents = identifiers(line.replace(CITE, " "));
    for (const c of cites) {
      const p = c[1], from = +c[2], to = c[3] ? +c[3] : from;
      if (p.includes("*")) { results.push({ level: "WARN", msg: `L${idx + 1} ${p}:${c[2]} — glob path is not a citation; cite one concrete file` }); continue; }
      const file = load(p);
      const where = `L${idx + 1} ${p}:${c[2]}${c[3] ? "-" + c[3] : ""}`;
      if (!file) { results.push({ level: "FAIL", msg: `${where} — cited path does not exist in the repository` }); continue; }
      if (from < 1 || to > file.length) { results.push({ level: "FAIL", msg: `${where} — cited line(s) beyond end of file (${file.length} lines)` }); continue; }
      if (idents.length === 0) { results.push({ level: "PASS", msg: `${where} resolves (no identifier tokens to cross-check)` }); continue; }
      const near = file.slice(Math.max(0, from - 4), Math.min(file.length, to + 3)).join("\n");
      const whole = file.join("\n");
      const missingNear = idents.filter(t => !near.includes(t));
      const missingAll = missingNear.filter(t => !whole.includes(t));
      if (missingAll.length) results.push({ level: "WARN", msg: `${where} — identifier(s) ${missingAll.map(t => `"${t}"`).join(", ")} appear nowhere in the cited file: claimed element absent from its own citation (fabrication signature — Rule 2: identifiers are quotations)` });
      else if (missingNear.length) results.push({ level: "WARN", msg: `${where} — ${missingNear.map(t => `"${t}"`).join(", ")} not within ±3 lines of the citation (elsewhere in file): tighten the line reference` });
      else results.push({ level: "PASS", msg: `${where} resolves; ${idents.length} identifier(s) found at the citation` });
    }
  });
  return results;
}

function main(argv) {
  const file = argv[0];
  if (!file || file.startsWith("--")) { console.error("Usage: node check-evidence.js <delivery.md> [--repo <root>]"); return 2; }
  let repo = process.cwd();
  const ri = argv.indexOf("--repo");
  if (ri >= 0 && argv[ri + 1]) repo = path.resolve(argv[ri + 1]);
  let md;
  try { md = fs.readFileSync(file, "utf-8"); } catch (e) { console.error(`cannot read ${file}: ${e.message}`); return 2; }
  const res = checkDelivery(md, repo);
  if (res.length === 0) { console.log("  WARN  no file:line citations found — MODEL-FROM-CODE deliveries must cite evidence (check-delivery C3)"); return 0; }
  for (const r of res) console.log(`  ${r.level.padEnd(4)}  ${r.msg}`);
  const fails = res.filter(r => r.level === "FAIL").length, warns = res.filter(r => r.level === "WARN").length;
  console.log(`\n${res.length} citation(s) checked against ${repo}; ${fails} FAIL, ${warns} WARN`);
  return fails > 0 ? 1 : 0;
}

if (require.main === module) process.exit(main(process.argv.slice(2)));
module.exports = { checkDelivery, identifiers };
