#!/usr/bin/env node
// One-shot delivery verifier for bs-uml-master (R7). The single entry point
// that runs every check the skill demands, on markdown OR HTML, and emits
// the receipt block to paste into the delivery.
//
//   node verify-delivery.js <delivery.md|page.html> [--medium pc|phone|...]
//        [--kind gestalt|linear|auto] [--out <dir>] [--repo <root>]
//        [--puppeteer <cfg.json>] [--no-render] [--no-pin-install]
//
// Why one command: usage sample #4 (11 artifact versions) never ran a
// single checker — the HTML medium had no markdown to hand to
// check-delivery, the pinned CDN renderer (mermaid 10.6.1) was never
// parsed against, and "blank page" was blamed on the CDN while one
// diagram per version failed to parse. Every one of those was a
// prose-bound step a model could skip. This binds them all to one call:
//
//   1. extract diagram sources (```mermaid fences, or HTML .mermaid blocks —
//      an HTML page is turned into a markdown mirror automatically, so the
//      HTML medium is no longer a contract bypass)
//   2. syntax-check each source on the LOCAL mermaid (check-mermaid.js) and,
//      when the page pins a CDN version, on THAT version too (installed
//      into --out on demand) — the reader's renderer is the one that counts
//   3. render with mermaid-cli and run check-render-fit for --medium
//   4. run check-delivery on the (mirror) markdown
//   5. run check-evidence against --repo for MODEL-FROM-CODE citations
//   6. print a receipt whose lines satisfy check-delivery C8, stamped with a
//      content hash so a typed imitation is one more lie to tell
//
// Format-bound like every checker here: it cannot prove the model is true.
// Exit 0 = no FAIL anywhere, 1 = any FAIL, 2 = usage error.
"use strict";

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { spawnSync } = require("child_process");
const { createRequire } = require("module");

const HERE = __dirname;
const VERSION = "1";
const DIAGRAM_HEADER = /^(classdiagram|sequencediagram|statediagram|erdiagram|graph\b|flowchart\b|@start)/i;

function unescapeHtml(s) {
  return s.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&");
}

// Renderer pin: read ONLY from <script src=…> attributes and ES import
// specifiers (a prose mention of "mermaid 10.6.1" must not spoof it — R7
// adversary F4). Returns { version, floating } — floating = mermaid is loaded
// without an exact version (@latest, major-only, unversioned path).
// Any element the browser hands to mermaid: div/pre/code/section/textarea/p
// with a class token "mermaid" or "language-mermaid", in double, single or
// no quotes (R7 adversary F2). Nesting-aware: the matching close tag is
// found by depth counting, so a wrapper <div> around the block, or a block
// inside a <pre>, cannot truncate or hide it.
// Any element at all can be the container (figure, span, li, td, article…):
// the scanner accepts every non-void tag (R7.2, adversary F2).
const OPEN_TAG = /<([a-zA-Z][\w-]*)\b([^>]*?)\/?>/g;
const VOID = new Set(["br", "img", "hr", "input", "meta", "link", "area", "base", "col", "embed", "source", "track", "wbr", "script", "style"]);
function hasMermaidClass(attrs) {
  const m = attrs.match(/\bclass\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i);
  if (!m) return false;
  return (m[1] ?? m[2] ?? m[3]).split(/\s+/).some(t => /^(?:mermaid|language-mermaid)$/i.test(t));
}
// Returns { text, blocks } — text with each mermaid element replaced by
// @@MERMAID<n>@@, blocks = the raw inner sources in order.
function parkMermaidBlocks(html) {
  const blocks = [];
  let out = "", pos = 0;
  const re = new RegExp(OPEN_TAG.source, "gi");
  let m;
  while ((m = re.exec(html)) !== null) {
    const tag = m[1].toLowerCase();
    if (VOID.has(tag) || m[0].endsWith("/>") || !hasMermaidClass(m[2])) continue;
    const bodyStart = m.index + m[0].length;
    // depth-count to the matching close tag
    const pair = new RegExp(`<(/?)${tag}\\b[^>]*>`, "gi");
    pair.lastIndex = bodyStart;
    let depth = 1, end = -1, closeLen = 0, t;
    while ((t = pair.exec(html)) !== null) {
      depth += t[1] ? -1 : 1;
      if (depth === 0) { end = t.index; closeLen = t[0].length; break; }
    }
    if (end < 0) continue;
    blocks.push(html.slice(bodyStart, end));
    out += html.slice(pos, m.index) + `\n\n@@MERMAID${blocks.length - 1}@@\n\n`;
    pos = end + closeLen;
    re.lastIndex = pos;
  }
  return { text: out + html.slice(pos), blocks };
}

function detectPin(htmlRaw) {
  // Commented-out tags are not loaded by the browser (R7.2, adversary F13).
  const html = htmlRaw.replace(/<!--[\s\S]*?-->/g, "");
  const urls = [];
  for (const im of html.matchAll(/<script\b[^>]*type\s*=\s*["']importmap["'][^>]*>([\s\S]*?)<\/script>/gi))
    for (const u of im[1].matchAll(/["'](https?:\/\/[^"'\s]*mermaid[^"'\s]*)["']/gi)) urls.push(u[1]);
  for (const m of html.matchAll(/<script\b[^>]*\bsrc\s*=\s*["']?([^"'\s>]+)/gi)) urls.push(m[1]);
  for (const m of html.matchAll(/\bimport\b[^;\n]*?["']([^"']*mermaid[^"']*)["']/gi)) urls.push(m[1]);
  let floating = false;
  for (const u of urls) {
    if (!/mermaid/i.test(u)) continue;
    const v = u.match(/mermaid(?:\.min)?(?:\.js)?[@/]v?(\d+\.\d+\.\d+)(?![\d.])/i) || u.match(/\/mermaid\/(\d+\.\d+\.\d+)\//i);
    if (v) return { version: v[1], floating: false };
    floating = true;
  }
  return { version: null, floating };
}

// HTML → markdown mirror. Every <h2> whose section holds a mermaid block
// becomes a "## Diagram Delivery" header; <strong>Label:</strong> becomes
// **Label:**; mermaid blocks become fences. Good enough for check-delivery to
// judge the contract the page actually carries.
function buildMirror(html, pin) {
  let s = html.replace(/<script[\s\S]*?<\/script>/gi, "").replace(/<style[\s\S]*?<\/style>/gi, "");
  // Fence the mermaid blocks first and park them behind placeholders so the
  // tag stripping below cannot touch <br/> and friends inside diagram labels.
  const pk = parkMermaidBlocks(s);
  // Only WRAPPING tags are removed (a <code> inside <pre class="mermaid">);
  // <br/>, <b> etc. inside labels are diagram source and stay.
  const parked = pk.blocks.map(src => "```mermaid\n" + unescapeHtml(src.replace(/^\s*<(?:code|span)\b[^>]*>/i, "").replace(/<\/(?:code|span)>\s*$/i, "")).trim() + "\n```");
  s = pk.text;
  // section by h2: a section holding a diagram becomes a Diagram Delivery block
  const parts = s.split(/<h2[^>]*>/i);
  const out = [parts[0]];
  for (let i = 1; i < parts.length; i++) {
    const end = parts[i].indexOf("</h2>");
    const title = end >= 0 ? parts[i].slice(0, end) : "";
    const body = end >= 0 ? parts[i].slice(end + 5) : parts[i];
    const t = unescapeHtml(title.replace(/<[^>]+>/g, "")).replace(/\s+/g, " ").trim();
    if (/@@MERMAID\d+@@/.test(body)) {
      out.push(`\n\n## Diagram Delivery — ${t}\n` + (pin ? `**Renderer pin:** mermaid@${pin} (CDN)\n` : "") + body);
    } else out.push(`\n\n### ${t}\n` + body);
  }
  s = out.join("");
  s = s.replace(/<(?:strong|b)>\s*([^<:]{1,40}?)\s*[:：]\s*<\/(?:strong|b)>/gi, (m, l) => `**${l.trim() === "Q" ? "Question" : l.trim()}:**`);
  s = s.replace(/<br\s*\/?>/gi, "\n").replace(/<\/t[dh]>/gi, " | ").replace(/<\/(?:p|div|li|tr|h[1-6])>/gi, "\n").replace(/<[^>]+>/g, "");
  s = unescapeHtml(s).replace(/@@MERMAID(\d+)@@/g, (m, i) => parked[+i]);
  s = s.split("\n").map(l => l.replace(/[ \t]+$/g, "")).join("\n").replace(/\n{3,}/g, "\n\n");
  return s.trim() + "\n";
}

function extractSources(md) {
  const out = [];
  for (const m of md.matchAll(/```([\w-]*)\r?\n([\s\S]*?)```/g)) {
    const body = m[2].replace(/^\s*---[^\S\r\n]*\r?\n[\s\S]*?\r?\n---[^\S\r\n]*\r?\n/, "");
    const header = (body.split(/\r?\n/).find(l => l.trim() && !l.trim().startsWith("%%")) || "").trim();
    if (/^(mermaid)$/.test((m[1] || "").toLowerCase()) || DIAGRAM_HEADER.test(header)) out.push(body.trim() + "\n");
  }
  return out;
}

function run(cmd, args, opts = {}) {
  const r = spawnSync(cmd, args, { encoding: "utf-8", timeout: opts.timeout || 240000, cwd: opts.cwd || process.cwd(), env: process.env });
  return { code: r.status === null ? 2 : r.status, out: (r.stdout || "") + (r.stderr || "") };
}

function mermaidVersionAt(cwd) {
  try {
    const req = createRequire(path.join(cwd, "noop.js"));
    return JSON.parse(fs.readFileSync(req.resolve("mermaid/package.json"), "utf-8")).version;
  } catch { return null; }
}

function parseWith(cwd, mmd) {
  const r = run("node", [path.join(HERE, "check-mermaid.js"), mmd], { cwd });
  if (r.code === 0) return { status: "OK", detail: "" };
  if (r.code === 1) {
    const line = (r.out.match(/line (\d+)/i) || [])[1];
    return { status: "FAIL", detail: line ? `line ${line}` : (r.out.split("\n").find(l => /error/i.test(l)) || "parse error").trim().slice(0, 80) };
  }
  return { status: "UNCHECKED", detail: (r.out.split("\n").find(l => l.trim()) || "checker unavailable").trim().slice(0, 100) };
}

function svgSize(svg) {
  const vb = svg.match(/viewBox="[\d.\-]+\s+[\d.\-]+\s+([\d.]+)\s+([\d.]+)"/);
  if (vb) return `${Math.round(+vb[1])}x${Math.round(+vb[2])}`;
  const w = svg.match(/\swidth="([\d.]+)/), h = svg.match(/\sheight="([\d.]+)/);
  return w && h ? `${Math.round(+w[1])}x${Math.round(+h[1])}` : "?x?";
}

function main(argv) {
  const file = argv[0];
  if (!file || file.startsWith("--")) { console.error("Usage: node verify-delivery.js <delivery.md|page.html> [--medium pc] [--kind auto] [--out dir] [--repo root] [--puppeteer cfg] [--no-render] [--no-pin-install]"); return 2; }
  const has = (n) => argv.includes(n);
  const flag = (n, d) => {
    const i = argv.indexOf(n);
    if (i < 0) return d;
    if (!argv[i + 1] || argv[i + 1].startsWith("--")) throw new Error(`${n} needs a value`);
    return argv[i + 1];
  };
  let medium, kind, out;
  try {
    medium = flag("--medium", "pc"); kind = flag("--kind", null); out = path.resolve(flag("--out", ".uml-verify"));
  } catch (e) { console.error(`usage error: ${e.message}`); return 2; }
  const MEDIA = ["pc", "phone", "phone-landscape", "a4", "readme", "slide"];
  if (!MEDIA.includes(medium)) { console.error(`usage error: --medium must be one of ${MEDIA.join("|")} (got "${medium}")`); return 2; }
  if (kind && !["gestalt", "linear", "auto"].includes(kind)) { console.error(`usage error: --kind must be gestalt|linear|auto (got "${kind}")`); return 2; }
  const repo = flag("--repo", fs.existsSync(path.join(process.cwd(), ".git")) ? process.cwd() : null);
  let pup = flag("--puppeteer", process.env.PUPPETEER_CONFIG || null);
  if (!pup && fs.existsSync(path.join(process.cwd(), "puppeteer.json"))) pup = path.join(process.cwd(), "puppeteer.json");
  try { fs.mkdirSync(out, { recursive: true }); } catch (e) { console.error(`usage error: cannot create --out ${out}: ${e.code || e.message}`); return 2; }
  if (!fs.statSync(out).isDirectory()) { console.error(`usage error: --out ${out} is not a directory`); return 2; }

  let text;
  try { text = fs.readFileSync(file, "utf-8"); } catch (e) { console.error(`cannot read ${file}: ${e.message}`); return 2; }
  const isHtml = /\.html?$/i.test(file) || (/<(?:html|div|pre|section)[\s>]/i.test(text.slice(0, 4000)) && parkMermaidBlocks(text).blocks.length > 0);
  const pinInfo = isHtml ? detectPin(text) : { version: (text.match(/\*\*Renderer pin:\*\*\s*mermaid@(\d+\.\d+\.\d+)/) || [])[1] || null, floating: false };
  const pin = pinInfo.version;
  let md = text, mirror = null;
  if (isHtml) { md = buildMirror(text, pin); mirror = path.join(out, "mirror.md"); fs.writeFileSync(mirror, md); }
  const sources = extractSources(md);

  const localVer = mermaidVersionAt(process.cwd()) || mermaidVersionAt(HERE);
  let pinDir = null, pinNote = "";
  if (pin && pin !== localVer && !has("--no-pin-install")) {
    pinDir = path.join(out, `mermaid-${pin}`);
    if (!fs.existsSync(path.join(pinDir, "node_modules", "mermaid"))) {
      fs.mkdirSync(pinDir, { recursive: true });
      const r = run("npm", ["install", "--no-save", "--silent", "--prefix", pinDir, `mermaid@${pin}`, "jsdom"], { cwd: pinDir, timeout: 300000 });
      if (r.code !== 0) { pinNote = `pinned mermaid@${pin} UNCHECKED (install failed: ${r.out.trim().split("\n").pop().slice(0, 80)})`; pinDir = null; }
    }
  } else if (pin && pin === localVer) pinNote = `pinned mermaid@${pin} = local`;
  else if (pin && has("--no-pin-install")) pinNote = `pinned mermaid@${pin} NOT CHECKED (--no-pin-install) — state the skew in the delivery`;
  if (pinInfo.floating && !pin) pinNote = "mermaid loaded WITHOUT an exact version (floating/latest) — every reader gets a different renderer; pin the CDN to the version you verified";

  const lines = [];
  let anyFail = false, fitLines = [];
  sources.forEach((src, i) => {
    const n = i + 1, mmd = path.join(out, `d${n}.mmd`);
    fs.writeFileSync(mmd, src);
    const cells = [];
    let verified = false;
    const local = parseWith(process.cwd(), mmd);
    if (local.status === "OK") verified = true;
    cells.push(`parse mermaid@${localVer || "?"} ${local.status}${local.detail ? " " + local.detail : ""}`);
    if (local.status === "FAIL") anyFail = true;
    if (pinDir) {
      const p = parseWith(pinDir, mmd);
      cells.push(`parse mermaid@${pin} (pinned) ${p.status}${p.detail ? " " + p.detail : ""}`);
      if (p.status === "FAIL") anyFail = true;
    }
    if (!has("--no-render")) {
      const svg = path.join(out, `d${n}.svg`);
      const args = ["-y", "@mermaid-js/mermaid-cli", ...(pup ? ["-p", pup] : []), "-i", mmd, "-o", svg];
      const r = run("npx", args, { timeout: 300000 });
      if (r.code === 0 && fs.existsSync(svg)) {
        verified = true;
        const size = svgSize(fs.readFileSync(svg, "utf-8"));
        const fit = run("node", [path.join(HERE, "check-render-fit.js"), svg, "--medium", medium, ...(kind ? ["--kind", kind] : [])]);
        const px = (fit.out.match(/effective label font (\d+(?:\.\d+)?)px/) || fit.out.match(/label font (\d+(?:\.\d+)?)px/) || [])[1];
        const verdict = fit.code === 0 ? "PASS" : fit.code === 1 ? "FAIL" : "ERROR";
        if (fit.code !== 0) anyFail = true;
        cells.push(`render mmdc OK · check-render-fit(${medium}) canvas ${size} ${px ? px + "px" : "?px"} ${verdict}`);
        fitLines.push(`d${n}:\n` + fit.out.trim().split("\n").map(l => "    " + l).join("\n"));
      } else {
        anyFail = true;
        const err = (r.out.split("\n").find(l => /error|expect|parse/i.test(l)) || "render failed").trim().slice(0, 90);
        cells.push(`render mmdc FAIL (${err})`);
      }
    }
    if (!verified) { anyFail = true; cells.push("NO VERIFICATION SUCCEEDED (install mermaid+jsdom for parsing, or allow rendering)"); }
    lines.push(`  d${n}: ${cells.join(" · ")}`);
  });

  // Hash covers the sources and the per-diagram verdict lines only, so the
  // id is stable across the paste-and-rerun loop and a stale receipt
  // (diagram edited after verification) is detectable (R7 adversary F11).
  const id = crypto.createHash("sha256").update(sources.join("\n---\n") + lines.join("\n")).digest("hex").slice(0, 12);
  const stale = [...md.matchAll(/verify-delivery receipt ([0-9a-f]{12})/g)].map(m => m[1]).filter(h => h !== id);
  if (stale.length) { anyFail = true; lines.push(`  STALE RECEIPT ${stale.join(", ")} found in the delivery — sources or verdicts changed since; replace it with this one (${id})`); }
  if (sources.length === 0) { anyFail = true; lines.push("  FAIL  no diagram sources found (no ```mermaid fences / HTML mermaid blocks)"); }
  const blocks = (md.match(/^##\s+Diagram Delivery\b/gm) || []).length;
  const head = `## verify-delivery receipt ${id} (bs-uml-master verify-delivery.js v${VERSION}, ${new Date().toISOString().slice(0, 16)}Z)`;
  const meta = `input: ${path.basename(file)}${mirror ? ` (HTML → mirror ${path.relative(process.cwd(), mirror)})` : ""} · diagrams: ${sources.length} · medium=${medium}${pin ? ` · renderer pin: mermaid@${pin} (CDN)` : ""}${pinNote ? " — " + pinNote : ""}`;
  if (blocks > 1) lines.push(`  note: ${blocks} Diagram Delivery blocks — check-delivery C8 is per block; paste this receipt into every block (checked that way below)`);

  // check-delivery runs on the delivery AS IT WILL BE after the receipt is
  // pasted into every Diagram Delivery block (C8 is per block — R7 adversary
  // F8), so the first run already reports the post-paste state instead of a
  // chicken-and-egg C8 failure. Summaries are worded without the FAIL token
  // so a pasted receipt can never read as a failing fit receipt.
  const receiptBody = [head, meta, ...lines].join("\n");
  const withReceipt = md.replace(/^## verify-delivery receipt [0-9a-f]{12}[\s\S]*?^VERDICT:[^\n]*\n?/gm, "")
    .split(/^(?=##\s+Diagram Delivery\b)/m)
    .map((part, i) => (i === 0 && !/^##\s+Diagram Delivery\b/.test(part)) ? part : part.replace(/\s*$/, "") + "\n\n" + receiptBody + "\nVERDICT: (pending)\n\n")
    .join("");
  const pasted = path.join(out, "with-receipt.md");
  fs.writeFileSync(pasted, withReceipt);
  const del = run("node", [path.join(HERE, "check-delivery.js"), pasted]);
  const dm = del.out.match(/(\d+) delivery block\(s\); (\d+) FAIL/) || [];
  const delSummary = dm.length ? `${dm[2]} failing check(s) across ${dm[1]} block(s)` : (del.out.trim().split("\n").pop() || "no output").replace(/FAIL/g, "failing");
  if (del.code === 1) anyFail = true;
  let evSummary = "skipped (no --repo and cwd is not a git root)";
  if (repo) {
    const ev = run("node", [path.join(HERE, "check-evidence.js"), pasted, "--repo", repo]);
    const em = ev.out.match(/(\d+) citation\(s\) checked[^;]*; (\d+) FAIL, (\d+) WARN/) || [];
    evSummary = em.length ? `${em[1]} citation(s), ${em[2]} failing, ${em[3]} warning(s)` : (ev.out.trim().split("\n").pop() || "no output").replace(/FAIL/g, "failing");
    if (ev.code === 1) anyFail = true;
  }
  // Verdict wording deliberately avoids C8's exemption vocabulary — a pasted
  // receipt must never supply its own override (R7 adversary F1).
  const tail = [`  check-delivery: ${delSummary || "no output"}`, `  check-evidence: ${evSummary}`, `VERDICT: ${anyFail ? "FAIL" : "PASS"} — ${anyFail ? "repair every failing line above before delivering; keeping one requires an explicit exception note written in the delivery itself" : "paste this receipt into the delivery"}`];
  console.log([head, meta, ...lines, ...tail].join("\n"));
  if (fitLines.length) console.log("\nfit details:\n" + fitLines.join("\n"));
  return anyFail ? 1 : 0;
}

if (require.main === module) process.exit(main(process.argv.slice(2)));
module.exports = { detectPin, buildMirror, extractSources, svgSize, hasMermaidClass, parkMermaidBlocks };
