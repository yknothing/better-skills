#!/usr/bin/env node
// Regression self-test for check-render-fit.js on synthetic SVG fixtures.
// Each fixture encodes an empirically-observed case (Haiku tower, ELK fix,
// legal sequence scroll, oversized scroll, torn-edge). Run from anywhere:
//   node skills/bs-uml-master/scripts/test-check-render-fit.js
"use strict";

const { execFileSync } = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");

const CHECKER = path.join(__dirname, "check-render-fit.js");
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "chkfit-"));
let failures = 0;

function svg(w, h, extra = "") {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}">` +
    `<style>.label{font-size:16px}</style>${extra}<text class="label">x</text></svg>`;
}
const ACTOR = `<rect class="actor" x="0" y="0" width="10" height="10"/>`;
const edge = (x1, y1, x2, y2) =>
  `<path class="edgePath flowchart-link" d="M ${x1},${y1} L ${x2},${y2}"/>`;

function run(name, content, args, expectExit, mustMatch = []) {
  const file = path.join(tmp, name.replace(/\W+/g, "_") + ".svg");
  fs.writeFileSync(file, content);
  let out = "", code = 0;
  try { out = execFileSync("node", [CHECKER, file, ...args], { encoding: "utf-8" }); }
  catch (e) { code = e.status ?? 1; out = (e.stdout || "") + (e.stderr || ""); }
  const problems = [];
  if (code !== expectExit) problems.push(`exit ${code}, expected ${expectExit}`);
  for (const re of mustMatch) if (!re.test(out)) problems.push(`missing ${re}`);
  if (problems.length) { failures++; console.log(`FAIL ${name}: ${problems.join("; ")}\n--- output ---\n${out}`); }
  else console.log(`PASS ${name}`);
}

// 1. The Haiku tower (833x2094 gestalt): must FAIL with the fit message
run("gestalt-tower", svg(833, 2094), [], 1, [/does not fit one screen legibly/, /aspect 0\.40:1/]);

// 2. The ELK fix (1494x940 gestalt): must PASS
run("gestalt-elk-fixed", svg(1494, 940), [], 0, [/fits one screen/, /14\.5px|16\.0px/]);

// 3. Legal sequence scroll: 700x1900, actor marker => linear, cross fits, ~2.2 screens => WARN, exit 0
run("sequence-two-screens", svg(700, 1900, ACTOR), [], 0, [/cross axis fits/, /WARN.*screens.*legal for linear/]);

// 4. Oversized sequence: 700x4000 => >3 screens => FAIL
run("sequence-four-screens", svg(700, 4000, ACTOR), [], 1, [/> 3/]);

// 5. Wide linear pipeline via --kind linear: 4000x500, cross (height) fits, ~2.7 screens wide => exit 0 with WARN
run("pipeline-wide-linear", svg(4000, 500), ["--kind", "linear"], 0, [/cross axis fits/, /WARN.*screens/]);

// 6. Torn edges on a fitting linear diagram: two edges spanning > 1 screen along reading axis
run("torn-edges-linear", svg(700, 2400, ACTOR + edge(10, 10, 20, 2300) + edge(30, 50, 40, 2350)),
  [], 0, [/WARN.*2 edge\(s\) span more than one screen/]);

// 7. Gestalt with >=2 long edges must FAIL the edge rule — build one that FITS
//    (small canvas, scale 1) but has long edges impossible... at fit, gestalt
//    edges can't exceed the screen; verify the co-visibility PASS instead.
run("gestalt-edges-covisible", svg(1400, 800, edge(10, 10, 1300, 700)), [], 0,
  [/no edge exceeds one screen/]);

// 8. Usage errors
run("no-viewbox", `<svg xmlns="http://www.w3.org/2000/svg"><text>x</text></svg>`, [], 2, [/no viewBox/]);

// 9. F1: real mermaid 11 attribute order — d= BEFORE class= — must still be parsed
const edgeDFirst = (x1, y1, x2, y2) =>
  `<path d="M ${x1},${y1} L ${x2},${y2}" class="edgePath flowchart-link"/>`;
run("edge-d-before-class", svg(700, 2400, ACTOR + edgeDFirst(10, 10, 20, 2300) + edgeDFirst(30, 50, 40, 2350)),
  [], 0, [/WARN.*2 edge\(s\) span more than one screen/]);

// 10. F1: sequence messages are <line> elements, not <path>
const lineEdge = (x1, y1, x2, y2) =>
  `<line class="messageLine0" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`;
run("sequence-line-edges", svg(700, 2400, ACTOR + lineEdge(10, 10, 20, 2300) + lineEdge(30, 50, 40, 2350)),
  [], 0, [/WARN.*2 edge\(s\) span more than one screen/]);

// 11. F2: a WIDE sequence (participant overflow) must FAIL the cross axis —
//     the reading axis of a sequence is always vertical
run("wide-sequence-overflow", svg(2850, 309, ACTOR), [], 1, [/cross axis does not fit/]);

// 12. F3: classDef-actor text must NOT flip a gestalt tower to linear
run("classdef-actor-spoof", svg(833, 2094, `<style>.classDef-actor{fill:red}</style>` +
  `<text>classDef actor fill:#f9f</text>`), [], 1, [/kind=gestalt/, /does not fit one screen legibly/]);

// 13. F3: manual --kind linear without sequence markers leaves an audit WARN
run("manual-linear-laundering-warn", svg(833, 2094), ["--kind", "linear"], 0,
  [/WARN.*declared manually.*no sequence markers/]);

console.log(`\n${failures === 0 ? "ALL PASS" : failures + " FIXTURE FAILURES"}`);
fs.rmSync(tmp, { recursive: true, force: true });
process.exit(failures === 0 ? 0 : 1);
