#!/usr/bin/env node
// Citation-integrity checker for MODEL-FROM-CODE deliveries (R7, hardened R7.1).
//
//   node check-evidence.js <delivery.md> [--repo <root>]
//
// Usage sample #4 showed fabricated entities (batch_id, created_at,
// UNFROZEN, Registrar, C1-C6) laundered through plausible `file:line`
// citations — check-delivery C3's "a citation exists" test is satisfied by
// fiction. This resolves every citation against the repository:
//   E1 cited path exists (FAIL otherwise; glob paths are not citations)
//   E2 cited line/range lies inside the file (FAIL otherwise)
//   E3 identifier-shaped tokens in the citation's own segment of the line
//      (snake_case, camelCase, `backticked`, ALL_CAPS) must appear in the
//      cited file — absent everywhere = the fabrication signature (FAIL);
//      present in the file but not within ±3 lines of the citation = WARN
// Citation grammar matches C3: `path:N`, `path:N-M`, `path file:N`,
// `path line N`, `path:LN`. Each identifier is scoped to the citation it
// precedes (one Evidence line may carry many citations — R7 advocate).
// Format-bound like the other checkers: it proves a citation is *possible*,
// not that the diagram's claim is true. Exit 0 = no FAIL, 1 = FAIL, 2 = usage.
"use strict";

const fs = require("fs");
const path = require("path");

const CITE = /([\w*.][\w*.\\/-]*\.[a-z]{1,6})(?::L?|\s+file:|\s+lines?\s+)(\d+)(?:\s*[-–]\s*L?(\d+))?/g;
const IDENT = /`([^`\n]{2,60})`|\b([A-Za-z][A-Za-z0-9]*(?:_[A-Za-z0-9]+)+)\b|\b([a-z]+[A-Z][A-Za-z0-9]+)\b|\b([A-Z][A-Z0-9]{3,}(?:_[A-Z0-9]+)*)\b/g;
const STOP = new Set(["MODEL_FROM_CODE", "MODEL_FROM_DESIGN", "RENDER_VERIFIED", "SYNTAX_VERIFIED", "UNVERIFIED", "SELF_REVIEWED", "USER_OVERRIDE", "HARD_GATE", "README", "SKILL", "CLAUDE", "HTML", "JSON", "YAML", "ASCII", "UML", "SVG", "PNG", "PASS", "FAIL", "WARN", "INFO", "TODO", "TBD", "iPhone", "iPad", "iOS", "macOS", "JavaScript", "TypeScript", "GitHub", "GitLab", "PlantUML", "OpenAPI", "GraphQL", "PostgreSQL", "MongoDB", "MySQL", "LaTeX", "eBay", "YouTube", "LinkedIn", "PowerPoint", "WordPress", "jQuery"]);

function identifiers(text) {
  const out = new Set();
  for (const m of text.matchAll(IDENT)) {
    const tok = (m[1] || m[2] || m[3] || m[4] || "").trim();
    if (!tok || STOP.has(tok) || STOP.has(tok.replace(/-/g, "_"))) continue;
    if (/^[\w*.\\/-]+\.[a-z]{1,6}(?::\d+)?$/.test(tok)) continue; // paths are not identifiers
    if (/^(?:https?|file):/.test(tok)) continue;
    out.add(tok);
  }
  return [...out];
}

// Whole-token presence: "id" must not match inside "batch_id", nor
// "batch_id" inside "batch_identity".
function present(hay, tok) {
  const esc = tok.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(^|[^A-Za-z0-9_])${esc}(?![A-Za-z0-9_])`).test(hay);
}

// Split a line into citations, each owning the text since the previous one
// (trailing text after the last citation belongs to the last citation).
function segments(line) {
  const cites = [...line.matchAll(CITE)];
  if (cites.length === 0) return [];
  const segs = cites.map((c, i) => ({
    path: c[1].replace(/\\/g, "/").replace(/^\.\//, ""), from: +c[2], to: c[3] ? +c[3] : +c[2], raw: c[0],
    text: line.slice(i === 0 ? 0 : cites[i - 1].index + cites[i - 1][0].length, c.index),
  }));
  segs[segs.length - 1].text += line.slice(cites[cites.length - 1].index + cites[cites.length - 1][0].length);
  return segs;
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
    for (const seg of segments(line)) {
      const where = `L${idx + 1} ${seg.path}:${seg.from}${seg.to !== seg.from ? "-" + seg.to : ""}`;
      if (seg.path.includes("*")) { results.push({ level: "WARN", msg: `${where} — glob path is not a citation; cite one concrete file` }); continue; }
      if (seg.path.includes("..")) { results.push({ level: "FAIL", msg: `${where} — citation escapes the repository root` }); continue; }
      const file = load(seg.path);
      if (!file) { results.push({ level: "FAIL", msg: `${where} — cited path does not exist in the repository` }); continue; }
      const from = Math.min(seg.from, seg.to), to = Math.max(seg.from, seg.to);
      if (from < 1 || to > file.length) { results.push({ level: "FAIL", msg: `${where} — cited line(s) outside the file (1–${file.length})` }); continue; }
      const idents = identifiers(seg.text);
      if (idents.length === 0) { results.push({ level: "PASS", msg: `${where} resolves (no identifier tokens to cross-check)` }); continue; }
      const near = file.slice(Math.max(0, from - 4), Math.min(file.length, to + 3)).join("\n");
      const whole = file.join("\n");
      const missingNear = idents.filter(t => !present(near, t));
      const missingAll = missingNear.filter(t => !present(whole, t));
      if (missingAll.length) results.push({ level: "FAIL", msg: `${where} — identifier(s) ${missingAll.map(t => `"${t}"`).join(", ")} appear nowhere in the cited file: claimed element absent from its own citation (fabrication signature — Rule 2: identifiers are quotations)` });
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
  if (ri >= 0) {
    if (!argv[ri + 1] || argv[ri + 1].startsWith("--")) { console.error("--repo needs a directory"); return 2; }
    repo = path.resolve(argv[ri + 1]);
    if (!fs.existsSync(repo)) { console.error(`--repo ${repo} does not exist`); return 2; }
  }
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
module.exports = { checkDelivery, identifiers, segments };
