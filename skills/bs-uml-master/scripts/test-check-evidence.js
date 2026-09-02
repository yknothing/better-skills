#!/usr/bin/env node
// Regression self-test for check-evidence.js (R7). Fixtures replay usage
// sample #4's citation laundering: real-looking file:line references
// pointing at files/lines that do not contain the claimed identifiers.
"use strict";
const fs = require("fs"), os = require("os"), path = require("path");
const { execFileSync } = require("child_process");
const CHECKER = path.join(__dirname, "check-evidence.js");
const repo = fs.mkdtempSync(path.join(os.tmpdir(), "chkev-"));
fs.mkdirSync(path.join(repo, "src"));
fs.writeFileSync(path.join(repo, "src", "batch.js"), [
  "// batch registry", "const batches = {", "  status: 'active',", "  frozen_until: 'batch-1-all-skills-pass-gate-4',",
  "  skills: []", "};", "function freezeBatch(b) { return b; }", "module.exports = { batches, freezeBatch };"].join("\n"));
let failures = 0;
function run(name, md, expectExit, mustMatch = [], mustNot = []) {
  const f = path.join(repo, name.replace(/\W+/g, "_") + ".md"); fs.writeFileSync(f, md);
  let out = "", code = 0;
  try { out = execFileSync("node", [CHECKER, f, "--repo", repo], { encoding: "utf-8" }); } catch (e) { code = e.status ?? 1; out = (e.stdout || "") + (e.stderr || ""); }
  const p = [];
  if (code !== expectExit) p.push(`exit ${code}, expected ${expectExit}`);
  for (const re of mustMatch) if (!re.test(out)) p.push(`missing ${re}`);
  for (const re of mustNot) if (re.test(out)) p.push(`unexpected ${re}`);
  if (p.length) { failures++; console.log(`FAIL ${name}: ${p.join("; ")}\n--- output ---\n${out}`); } else console.log(`PASS ${name}`);
}
// 1. honest citation: identifier sits at the cited line
run("honest", "Batch.frozen_until → src/batch.js:4", 0, [/PASS.*1 identifier/], [/^\s+(?:WARN|FAIL)/m]);
// 2. laundering: plausible path+line, identifier absent from the file (usage sample #4: batch_id, created_at)
run("laundered-identifier", "Batch.batch_id and created_at → src/batch.js:2-5", 0, [/WARN.*"batch_id".*"created_at".*appear nowhere/]);
// 3. identifier exists in file but not near the cited lines → tighten
run("loose-line", "freezeBatch() → src/batch.js:1", 0, [/WARN.*"freezeBatch".*not within/]);
// 4. cited path does not exist → FAIL
run("ghost-path", "Registrar role → src/registrar.js:12", 1, [/FAIL.*does not exist/]);
// 5. line beyond EOF → FAIL
run("beyond-eof", "status enum → src/batch.js:900", 1, [/FAIL.*beyond end of file/]);
// 6. backticked identifiers and ALL_CAPS states are checked; plain prose words are not
run("backtick-and-caps", "state `UNFROZEN` reached → src/batch.js:3", 0, [/WARN.*"UNFROZEN".*appear nowhere/]);
run("prose-words-ignored", "the batch registry object → src/batch.js:2", 0, [/^\s+PASS/m], [/^\s+(?:WARN|FAIL)/m]);
// 6b. glob paths cannot be citations
run("glob-path", "frontmatter → src/*/SKILL.md:1-20", 0, [/WARN.*glob path is not a citation/]);
// 7. no citations at all → WARN, exit 0 (C3 owns the "must cite" rule)
run("no-citations", "just prose here", 0, [/WARN.*no file:line citations/]);
console.log(`\n${failures === 0 ? "ALL PASS" : failures + " FIXTURE FAILURES"}`);
fs.rmSync(repo, { recursive: true, force: true });
process.exit(failures === 0 ? 0 : 1);
