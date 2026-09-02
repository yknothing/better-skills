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
check("pin-cdnjs", V.detectPin('<script src="https://cdnjs.cloudflare.com/ajax/libs/mermaid/10.6.1/mermaid.min.js">').version === "10.6.1");
check("pin-at", V.detectPin('<script src="https://cdn.jsdelivr.net/npm/mermaid@11.4.1/dist/mermaid.min.js">').version === "11.4.1");
check("pin-none", (() => { const p = V.detectPin("<html><body>no mermaid</body></html>"); return p.version === null && p.floating === false; })());

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
// 6. R7.1 (adversary F2): every container the browser renders is extracted —
//    single/no quotes, section/textarea/code.language-mermaid, nested wrappers
const variants = "<h2>v</h2><section class='mermaid'>\ngraph TB\n a-->b\n</section><div class=mermaid>\nerDiagram\n A ||--o{ B : has\n</div>" +
  "<pre><code class=\"language-mermaid\">flowchart LR\n c-->d</code></pre><textarea class=\"Mermaid\">stateDiagram-v2\n [*] --> S</textarea><div class=\"mermaid-wrapper\"><div class=\"mermaid\">\ngraph LR\n e-->f\n</div></div>";
const mv = V.buildMirror(variants, null);
check("extract-variants-all-five", V.extractSources(mv).length === 5, String(V.extractSources(mv).length) + "\n" + mv);
check("class-token-not-substring", !V.hasMermaidClass(' class="mermaid-wrapper"') && V.hasMermaidClass(" class='x mermaid y'") && V.hasMermaidClass(" class=language-mermaid"));

// 7. R7.1 (adversary F4): pin comes from script/import only; prose cannot spoof; floating is reported
check("pin-prose-spoof-ignored", V.detectPin('<p>tested on mermaid 9.9.9</p><script src="https://cdnjs.cloudflare.com/ajax/libs/mermaid/11.4.1/mermaid.min.js"></script>').version === "11.4.1");
check("pin-floating-latest", (() => { const p = V.detectPin('<script src="https://cdn.jsdelivr.net/npm/mermaid@latest/dist/mermaid.min.js"></script>'); return p.version === null && p.floating === true; })());
check("pin-esm-import", V.detectPin('<script type="module">import mermaid from "https://cdn.jsdelivr.net/npm/mermaid@11.2.0/dist/mermaid.esm.min.mjs";</script>').version === "11.2.0");

// 8. R7.1 (adversary F9): table cells stay separated in the mirror
check("mirror-table-cells", /Batch\.batch_id \| src\/batch\.js:2 \|/.test(V.buildMirror("<h2>t</h2><div class=\"mermaid\">graph TB\n a</div><table><tr><td>Batch.batch_id</td><td>src/batch.js:2</td></tr></table>", null)));

// 9. R7.1 (adversary F3/F10): usage errors exit 2, never PASS
const runV = (args, cwd) => { try { return { code: 0, out: execFileSync("node", [SCRIPT, ...args], { encoding: "utf-8", cwd }) }; } catch (e) { return { code: e.status ?? 1, out: (e.stdout || "") + (e.stderr || "") }; } };
const tmp2 = fs.mkdtempSync(path.join(os.tmpdir(), "vd2-"));
const f2 = path.join(tmp2, "d.md"); fs.writeFileSync(f2, md2);
let r = runV([f2, "--medium", "bogus", "--no-render", "--no-pin-install", "--out", path.join(tmp2, "o")], tmp2);
check("bogus-medium-usage-error", r.code === 2 && /--medium must be one of/.test(r.out), r.out);
r = runV([f2, "--medium", "--no-render", "--no-pin-install", "--out", path.join(tmp2, "o")], tmp2);
check("missing-flag-value-usage-error", r.code === 2 && /needs a value/.test(r.out), r.out);
fs.writeFileSync(path.join(tmp2, "afile"), "x");
r = runV([f2, "--no-render", "--no-pin-install", "--out", path.join(tmp2, "afile")], tmp2);
check("out-is-file-usage-error", r.code === 2 && /--out/.test(r.out), r.out);

// 10. R7.1 (adversary F7): a delivery with no diagram source is a FAIL verdict, exit 1
const f3 = path.join(tmp2, "none.md"); fs.writeFileSync(f3, "## Diagram Delivery — t\n\n**State:** UNVERIFIED\nSource at scratch/x.mmd\n");
r = runV([f3, "--no-render", "--no-pin-install", "--out", path.join(tmp2, "o3")], tmp2);
check("zero-sources-fail-verdict", r.code === 1 && /VERDICT: FAIL/.test(r.out) && /no diagram sources found/.test(r.out), r.out);

// 11. R7.1 (adversary F11): a stale receipt id embedded in the delivery is flagged
const f4 = path.join(tmp2, "stale.md"); fs.writeFileSync(f4, md2 + "\n## verify-delivery receipt 000000000000 (bs-uml-master verify-delivery.js v1, 2026-09-02T00:00Z)\n");
r = runV([f4, "--no-render", "--no-pin-install", "--out", path.join(tmp2, "o4")], tmp2);
check("stale-receipt-flagged", r.code === 1 && /STALE RECEIPT 000000000000/.test(r.out), r.out);

// 12. R7.1 (adversary F1): the verifier's own verdict sentence never contains C8 exemption words
check("verdict-wording-no-exemption-words", !/trade-?off|USER-OVERRIDE|取舍|ladder/i.test(r.out.split("\n").find(l => l.startsWith("VERDICT:")) || ""), r.out);
fs.rmSync(tmp2, { recursive: true, force: true });

console.log(`\n${failures === 0 ? "ALL PASS" : failures + " FIXTURE FAILURES"}`);
fs.rmSync(tmp, { recursive: true, force: true });
process.exit(failures === 0 ? 0 : 1);
