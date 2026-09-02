#!/usr/bin/env node
// Regression self-test for verify-delivery.js (R7): the HTML→mirror
// conversion, CDN pin detection, source extraction, and the receipt's
// C8-compatible shape. Rendering and parsing are exercised only when the
// tools exist (--no-render integration run asserts structure + exit code).
"use strict";
const fs = require("fs"), os = require("os"), path = require("path");
const { execFileSync } = require("child_process");
const V = require("./verify-delivery.js");
const SCRIPT = path.join(__dirname, "verify-delivery.js");
let failures = 0;
const check = (name, ok, detail = "") => { if (ok) console.log(`PASS ${name}`); else { failures++; console.log(`FAIL ${name} ${detail}`); } };

// 1. pin detection: cdnjs path form and npm @ form; none → null
check("pin-cdnjs", V.detectPin('<script src="https://cdnjs.cloudflare.com/ajax/libs/mermaid/10.6.1/mermaid.min.js">') === "10.6.1");
check("pin-at", V.detectPin('<script src="https://cdn.jsdelivr.net/npm/mermaid@11.4.1/dist/mermaid.min.js">') === "11.4.1");
check("pin-none", V.detectPin("<html><body>no mermaid</body></html>") === null);

// 2. mirror: labels become **Label:**, Q→Question, h2 with diagram → Diagram Delivery,
//    fence contents keep <br/> intact, sections without diagrams stay plain
const html = '<html><script src="https://cdnjs.cloudflare.com/ajax/libs/mermaid/10.6.1/mermaid.min.js"></script><h2>① Comp <em>x</em></h2><div><strong>Q:</strong> what?<br/><strong>Mode:</strong> MODEL-FROM-CODE<br/><strong>State:</strong> RENDER_VERIFIED (Mermaid 10.6.1)</div>' +
  '<div class="mermaid-wrapper"><div class="mermaid">\ngraph TB\n  A["x<br/>y"] --> B\n</div></div><h2>Notes</h2><p>hi</p></html>';
const m = V.buildMirror(html, "10.6.1");
check("mirror-header", /^## Diagram Delivery — ① Comp x$/m.test(m), m);
check("mirror-pin-line", /\*\*Renderer pin:\*\* mermaid@10\.6\.1 \(CDN\)/.test(m));
check("mirror-labels", /\*\*Question:\*\* what\?/.test(m) && /\*\*State:\*\* RENDER_VERIFIED/.test(m));
check("mirror-fence-br-intact", /```mermaid\ngraph TB\n  A\["x<br\/>y"\] --> B\n```/.test(m), m);
check("mirror-plain-section", /### Notes\nhi/.test(m));

// 3. extraction: mermaid fences and header-shaped unlabeled fences; text fences ignored
const md = "```mermaid\ngraph TB\n a-->b\n```\n```\nclassDiagram\n class A\n```\n```text\n+--+\n```\n";
const src = V.extractSources(md);
check("extract-count", src.length === 2, String(src.length));
check("extract-frontmatter-stripped", V.extractSources("```mermaid\n---\nconfig:\n  x: 1\n---\nflowchart TB\n a\n```\n")[0].startsWith("flowchart"));

// 4. svg size from viewBox or width/height
check("svg-viewbox", V.svgSize('<svg viewBox="0 0 698.5 1648"') === "699x1648" || V.svgSize('<svg viewBox="0 0 698.5 1648"') === "698x1648");
check("svg-wh", V.svgSize('<svg width="120" height="80">') === "120x80");

// 5. integration (--no-render): a markdown delivery whose sources cannot be
//    parsed here still yields a receipt with the C8-compatible shape only when
//    something verified; with nothing verified the verdict is FAIL, never PASS
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "vd-"));
const md2 = "## Diagram Delivery — t\n\n**Question:** q · **Mode:** MODEL-FROM-DESIGN · **Significance:** deliverable\n**Type/altitude:** flowchart @ file · **Backend:** Mermaid · **State:** RENDER_VERIFIED — mmdc 11.4.0\n\n```mermaid\nflowchart TB\n  a[\"A\"] --> b[\"B\"]\n```\n\n**Excluded:** x · **Assumptions:** none\n**Evidence:** design doc §2\n";
const f = path.join(tmp, "d.md"); fs.writeFileSync(f, md2);
let out = "", code = 0;
try { out = execFileSync("node", [SCRIPT, f, "--no-render", "--no-pin-install", "--out", path.join(tmp, "o")], { encoding: "utf-8", cwd: tmp }); } catch (e) { code = e.status ?? 1; out = (e.stdout || "") + (e.stderr || ""); }
check("receipt-header", /^## verify-delivery receipt [0-9a-f]{12} \(bs-uml-master verify-delivery\.js v\d+/m.test(out), out.slice(0, 300));
check("receipt-diagram-line", /^  d1: parse mermaid@/m.test(out), out);
check("receipt-verdict-line", /^VERDICT: (PASS|FAIL) — /m.test(out));
const parsedOk = /d1: parse mermaid@[\d.]+ OK/.test(out);
check("no-verification-never-passes", parsedOk ? true : (code === 1 && /NO VERIFICATION SUCCEEDED/.test(out)), out);
// HTML input path: mirror is written and used
const h = path.join(tmp, "p.html"); fs.writeFileSync(h, html);
try { out = execFileSync("node", [SCRIPT, h, "--no-render", "--no-pin-install", "--out", path.join(tmp, "o2")], { encoding: "utf-8", cwd: tmp }); } catch (e) { out = (e.stdout || "") + (e.stderr || ""); }
check("html-mirror-used", /HTML → mirror/.test(out) && fs.existsSync(path.join(tmp, "o2", "mirror.md")), out.slice(0, 300));
check("html-pin-reported", /renderer pin: mermaid@10\.6\.1/.test(out));
console.log(`\n${failures === 0 ? "ALL PASS" : failures + " FIXTURE FAILURES"}`);
fs.rmSync(tmp, { recursive: true, force: true });
process.exit(failures === 0 ? 0 : 1);
