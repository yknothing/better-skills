#!/usr/bin/env node
// Deterministic delivery-contract checker for bs-uml-master deliveries.
// Prose rules bind strong models; this binds all of them. Run it on the
// drafted delivery markdown BEFORE handing it to the user (Phase 5).
//
//   node check-delivery.js <delivery.md>
//
// Checks each "## Diagram Delivery" block:
//   C1 header fields present: Question, Mode, Significance, Backend/Notation
//   C2 State line carries a real receipt: known label + a tool-shaped
//      token with a version (or the text-backend alignment form)
//   C3 Evidence present; MODEL-FROM-CODE must cite path.ext:line
//   C4 Excluded present (explicit "nothing excluded" is fine)
//   C5 declared type matches the fenced source (Mermaid header mapping;
//      PlantUML content markers; a plantuml-tagged fence must actually
//      contain PlantUML)
//   C6 element budget from the source: >15 fails without USER-OVERRIDE,
//      >9 warns without a justification mention (counting is heuristic —
//      it under/over-counting is a reason to improve it, never to trust it
//      over your own count)
//   C8 a RENDER_VERIFIED claim on a visual backend must carry a
//      check-render-fit receipt (tool name + canvas WxH + effective px +
//      verdict) — fit/rubric verdicts asserted in prose with no pasted
//      checker output are the review layer's compliance theater (IP-20,
//      IP-25); a receipt reporting FAIL needs a recorded trade-off
//
// Sketch significance: only C2 and C5 are enforced; C1/C3/C4/C8 become
// warns (the contract's compressed sketch form is legal).
//
// This checker binds format, not truth: receipts can still be fabricated.
// It raises the floor; independent verification (Phase 2.A) is the ceiling.
//
// Exit: 0 = all pass (warnings allowed), 1 = any FAIL, 2 = usage error.
"use strict";

const fs = require("fs");

const LABELS = /RENDER_VERIFIED(?:\s*\(structural\))?|SYNTAX_VERIFIED|UNVERIFIED/;
// A receipt needs a tool-shaped token (known tool, *.js/*.jar, *-cli, or the
// word "version") adjacent to a dotted version number — "checked 3.2 boxes"
// must not pass.
const TOOL_VERSION = /\b(?:mmdc|mermaid(?:-cli)?|plantuml|kroki|d2|graphviz|dot|chromium|[\w-]+\.(?:js|jar)|[\w-]+-cli)\b[^\n\d]{0,15}v?\d+(?:\.\d+)+/i;
const TEXT_BACKEND_RECEIPT = /text backend.*(?:alignment|monospace|awk|col)/i;
// path with extension, then :N or " file:N" / " line N" — a clock time
// ("at 14:32") has no path and must not pass.
const FILE_LINE = /[\w./-]+\.[a-z]{1,6}(?::|\s+file:|\s+lines?\s+|:L)\d+/i;
const DIAGRAM_HEADER = /^(classdiagram|sequencediagram|statediagram|erdiagram|graph\b|flowchart\b|@start)/i;

function splitDeliveries(md) {
  const parts = md.split(/^##\s+Diagram Delivery\b.*$/m);
  if (parts.length < 2) return [];
  return parts.slice(1);
}

function field(block, name) {
  const re = new RegExp(`\\*\\*${name}:\\*\\*\\s*([^·\\n]+)`, "i");
  const m = block.match(re);
  return m ? m[1].trim() : null;
}

function stripFrontmatter(body) {
  // Tolerate trailing spaces on the delimiters — Mermaid does.
  return body.replace(/^\s*---[^\S\r\n]*\r?\n[\s\S]*?\r?\n---[^\S\r\n]*\r?\n/, "");
}

function headerOf(body) {
  return (body.split(/\r?\n/).find(l => l.trim() &&
    !l.trim().startsWith("%%") && !l.trim().startsWith("title")) || "").trim();
}

function fences(block) {
  // ALL fences that look like diagram source. Every one is type-checked
  // (C5) so a tiny decoy fence cannot launder a mismatched real one, and
  // the largest element count is used for the budget (C6).
  const all = [...block.matchAll(/```([\w-]*)\r?\n([\s\S]*?)```/g)]
    .map(m => {
      const body = stripFrontmatter(m[2]);
      return { lang: (m[1] || "").toLowerCase(), body, header: headerOf(body) };
    });
  const diagrams = all.filter(f => /^(mermaid|plantuml|puml)$/.test(f.lang) || DIAGRAM_HEADER.test(f.header));
  if (diagrams.length > 0) return diagrams;
  return all.length > 0 ? [all[0]] : [];
}

function stripNoise(body) {
  // Remove quoted labels and |edge labels| so their words can't be counted
  // as node ids.
  return body.replace(/"[^"]*"/g, '""').replace(/\|[^|\n]*\|/g, "||");
}

function countPrimary(f) {
  if (!f) return null;
  const uniq = (arr) => new Set(arr).size;
  const h = f.header.toLowerCase();
  const isPuml = h.startsWith("@start") || /^(plantuml|puml)$/.test(f.lang);

  if (isPuml) {
    const b = f.body;
    const decls = [...b.matchAll(/^\s*(?:abstract\s+)?(?:class|interface|enum|component|participant|actor|entity|usecase|state|node|artifact|database|rectangle|queue|collections|boundary|control)\s+"?([\w.]+)/gim)]
      .map(m => m[1]);
    const brackets = [...b.matchAll(/\[([\w .-]+)\]/g)].map(m => m[1]);
    const rels = [...b.matchAll(/^\s*([\w.]+)\s*(?:<\|--|--\|>|\*--|o--|-->|\.\.>|--|->)\s*([\w.]+)/gm)]
      .flatMap(m => [m[1], m[2]]);
    return uniq(decls.concat(brackets, rels.filter(x => !/^(start|stop|end)$/i.test(x))));
  }

  const b = stripNoise(f.body);
  if (h.startsWith("classdiagram")) {
    // Remove quoted multiplicities entirely so `A "1" <|-- "0..*" B` still
    // reads as a relation between A and B (IP-13/F8).
    const c = b.replace(/"[^"]*"/g, " ");
    const decls = [...c.matchAll(/^\s*class\s+([\w~[\]]+)/gm)].map(m => m[1]);
    // Edges-only class diagrams declare members implicitly on relation lines.
    const rels = [...c.matchAll(/^\s*([\w~]+)\s*(?:<\|--|<\|\.\.|\*--|o--|-->|\.\.>|--|\.\.)\s*([\w~]+)/gm)]
      .flatMap(m => [m[1], m[2]]);
    return uniq(decls.concat(rels));
  }
  if (h.startsWith("sequencediagram")) {
    const decl = [...b.matchAll(/^\s*(?:participant|actor)\s+(\w+)/gm)].map(m => m[1]);
    const msgs = [...b.matchAll(/^\s*(\w+)\s*-[->)x]+/gm)].map(m => m[1]);
    return uniq(decl.concat(msgs));
  }
  if (h.startsWith("statediagram")) {
    const named = [...b.matchAll(/^\s*state\s+"?([^"{\s]+)/gm)].map(m => m[1]);
    const arrows = [...b.matchAll(/^\s*([\w.]+)\s*-->/gm)].map(m => m[1])
      .concat([...b.matchAll(/-->\s*([\w.]+)/gm)].map(m => m[1]))
      .filter(s => s !== "[*]");
    return uniq(named.concat(arrows));
  }
  if (h.startsWith("erdiagram"))
    return uniq([...b.matchAll(/^\s*(\w+)\s*(?:\{|\|)/gm)].map(m => m[1]));
  if (h.startsWith("graph") || h.startsWith("flowchart")) {
    const intro = [...b.matchAll(/(?:^|\s)([A-Za-z_][\w]*)\s*(?:\[|\(\(|\{)/g)].map(m => m[1]);
    const edges = [...b.matchAll(/^\s*([A-Za-z_][\w]*)\s*-[-.=]*>?/gm)].map(m => m[1])
      .concat([...b.matchAll(/-[-.=]*>\|?\|?\s*([A-Za-z_][\w]*)\s*$/gm)].map(m => m[1]));
    return uniq(intro.concat(edges)
      .filter(id => !/^(subgraph|end|style|classDef|class|linkStyle|click|direction|graph|flowchart)$/.test(id)));
  }
  return null;
}

function typeMatchesHeader(declaredType, f) {
  if (!f || !f.header) return { ok: true, note: "no fenced source found (external file delivery?)" };
  const t = (declaredType || "").toLowerCase();
  const h = f.header.toLowerCase();
  const pumlTagged = /^(plantuml|puml)$/.test(f.lang);
  const pumlHeader = h.startsWith("@start");

  if (pumlTagged && !pumlHeader)
    return { ok: false, note: `fence tagged "${f.lang}" but source header is "${f.header}" — not PlantUML (tag laundering)` };

  if (pumlHeader) {
    // PlantUML content markers per declared type — coarse but non-empty.
    const marks = [
      [/class/, /(?:^|\n)\s*(?:abstract\s+)?(?:class|interface|enum)\s|\<\|--|--\|\>/],
      [/sequence/, /(?:^|\n)\s*(?:participant|actor)\s|->/],
      [/state/, /(?:^|\n)\s*state\s|\[\*\]/],
      [/component/, /(?:^|\n)\s*component\s|\[[\w .-]+\]/],
      [/activity/, /(?:^|\n)\s*:.+;|\bstart\b/],
      [/deployment/, /(?:^|\n)\s*(?:node|artifact|database)\s/],
      [/use ?case/, /(?:^|\n)\s*(?:usecase|actor)\s|\([\w .-]+\)/],
    ];
    for (const [claim, marker] of marks) {
      if (claim.test(t)) return marker.test(f.body)
        ? { ok: true, note: "PlantUML content markers match declared type" }
        : { ok: false, note: `declared type "${declaredType}" but PlantUML source shows no matching construct` };
    }
    return { ok: true, note: `PlantUML source; type "${declaredType}" not mapped` };
  }

  const expect = [
    [/class/, /^classdiagram/],
    [/sequence/, /^sequencediagram/],
    [/state/, /^statediagram/],
    [/\ber\b|entity/, /^erdiagram/],
    [/flowchart|dependency|module|box-flow|component|c4/, /^(graph|flowchart)/],
  ];
  for (const [claim, header] of expect) {
    if (claim.test(t)) return header.test(h)
      ? { ok: true }
      : { ok: false, note: `declared type "${declaredType}" but source header is "${f.header}" — fake or mismatched notation` };
  }
  return { ok: true, note: `type "${declaredType}" not mapped; header "${f.header}" unchecked` };
}

function checkBlock(block, idx, out) {
  const P = (l) => out.push(`  PASS  D${idx} ${l}`);
  const F = (l) => { out.push(`  FAIL  D${idx} ${l}`); out.failed++; };
  const W = (l) => out.push(`  WARN  D${idx} ${l}`);

  const sig = (field(block, "Significance") || "").toLowerCase();
  const sketch = /sketch/.test(sig) || /sketch level/i.test(block);
  const SOFT = sketch ? W : F; // sketch relaxes C1/C3/C4 to warnings

  // C1
  for (const name of ["Question", "Mode", "Significance"]) {
    field(block, name) ? P(`${name} declared`) : SOFT(`${name} missing from header fields`);
  }
  const backend = field(block, "Backend") || field(block, "Notation");
  backend ? P("Backend/Notation declared") : SOFT("Backend/Notation missing");

  // C2 — never relaxed: the state line is mandatory even for sketches
  const stateLine = (block.match(/\*\*State:\*\*[^\n]*/) || [null])[0];
  if (!stateLine) F("State line missing (mandatory at every significance level)");
  else if (!LABELS.test(stateLine)) F("State line has no recognized evidence label");
  else if (/UNVERIFIED/.test(stateLine) && !/RENDER|SYNTAX/.test(stateLine.replace(/UNVERIFIED/g, ""))) {
    /receipt|attempt|fail|exit|error|because|无法|失败/.test(block)
      ? P("UNVERIFIED with stated reason")
      : W("UNVERIFIED without visible failed-attempt receipts in the block");
  } else if (TOOL_VERSION.test(stateLine) || TEXT_BACKEND_RECEIPT.test(stateLine)) {
    P("State carries tool+version (or text-backend alignment) receipt");
  } else {
    F(`State claims "${(stateLine.match(LABELS) || [""])[0]}" with no tool+version receipt — format-invalid claim`);
  }

  // C3
  const ev = field(block, "Evidence") || ((block.match(/\*\*Evidence[^:]*:\*\*\s*([\s\S]{0,400})/) || [])[1] || "").trim();
  const mode = (field(block, "Mode") || "").toUpperCase();
  if (!ev) SOFT("Evidence missing");
  else if (mode.includes("CODE") && !FILE_LINE.test(block))
    SOFT("MODEL-FROM-CODE but no path.ext:line citation anywhere in the delivery");
  else P("Evidence present" + (mode.includes("CODE") ? " with file:line" : ""));

  // C4
  (field(block, "Excluded") || /\*\*Excluded:\*\*/.test(block))
    ? P("Excluded declared")
    : SOFT('Excluded missing (write "nothing excluded; total scope is N elements" if true)');

  // C5 — every diagram-shaped fence must match the declared type (a decoy
  // fence cannot launder a mismatched real one)
  const fs_ = fences(block);
  const declared = field(block, "Type/altitude") || field(block, "Type");
  if (fs_.length === 0) {
    // Fenceless: legal only when the source is delivered as an external file
    /\.(mmd|puml|plantuml|svg|txt)\b/.test(block)
      ? W("no fenced source — external-file delivery; C5/C6 not verifiable here, check the file manually")
      : F("no diagram source found in the delivery (neither a fence nor an external source-file reference)");
  } else {
    for (const f of fs_) {
      const tm = typeMatchesHeader(declared, f);
      tm.ok ? P("Declared type matches source" + (tm.note ? ` (${tm.note})` : "")) : F(tm.note);
    }
    // C6 — budget judged on the largest candidate
    const counts = fs_.map(countPrimary).filter(n => n !== null);
    if (counts.length > 0) {
      const n = Math.max(...counts);
      if (n > 15 && !/USER-OVERRIDE/i.test(block)) F(`~${n} primary elements > hard ceiling 15 with no USER-OVERRIDE note`);
      else if (n > 9 && !/justif|预算|budget|USER-OVERRIDE/i.test(block)) W(`~${n} primary elements > 9 with no visible budget justification`);
      else P(`element count ~${n} within budget discipline`);
    } else {
      W(`element counting unavailable for source header "${fs_[0].header}" — count manually against the budget`);
    }
    // C7 — color discipline: styling beyond the default theme demands a
    // declared dimension + legend (see color-semantics.md); decorative
    // rainbow is anti-information. Detection covers classDef/style fills,
    // stroke-only styling, themeVariables color overrides, skinparam
    // colors, and PlantUML inline #hex/#name styling.
    const colored = fs_.some(f =>
      /\b(?:classDef\s+\w+[^\n]*(?:fill|stroke|color)|style\s+\w+\s+(?:fill|stroke|color)|themeVariables|skinparam[^\n]*Color|(?:fill|stroke|color)\s*[:=]\s*["']?#)/i.test(f.body) ||
      // PlantUML inline element colors: `class X #lightblue`, `[Comp] #FFAA00`.
      // Quoted display names are blanked first so entities inside labels
      // (`state "uses #quot;fast#quot; mode"`) can't trip it (IP-24).
      /^\s*(?:abstract\s+)?(?:class|state|component|participant|actor|node|rectangle|package|database|interface|\[[^\]]+\])[^\n#]*#(?:[0-9a-fA-F]{3,8}|[A-Za-z]{3,20})\b/m.test(f.body.replace(/"[^"]*"/g, '""')));
    if (colored) {
      // Anti-silencing: "no legend needed" must not satisfy the check.
      const cleaned = block.replace(/(?:no|without|not?\s+\w*)\s+(?:legend|图例)[^\n]*/gi, "");
      if (!/legend|图例|color\s*(?:=|dimension|encodes)/i.test(cleaned)) {
        W("color styling present but no legend/declared color dimension in the delivery — decorative color is anti-information (color-semantics.md)");
      }
    }
  }

  // C8 — receipts-or-silence for fit claims: RENDER_VERIFIED on a visual
  // backend requires a pasted check-render-fit receipt. A self-graded
  // "medium fit ✅" with no checker output is the exploit this closes
  // (usage sample #3: four towers, all self-certified as fitting).
  if (stateLine && /RENDER_VERIFIED/.test(stateLine)) {
    const textBackend = TEXT_BACKEND_RECEIPT.test(stateLine) ||
      /\b(?:plain\s*)?(?:text|ascii)\b/i.test(backend || "");
    if (!textBackend) {
      const hasTool = /check-render-fit/i.test(block);
      const hasShape = /\b\d+x\d+\b/.test(block) &&
        /\d+(?:\.\d+)?px/.test(block) && /\b(?:PASS|FAIL)\b/.test(block);
      if (!hasTool || !hasShape) {
        SOFT("RENDER_VERIFIED without a check-render-fit receipt (tool name + canvas WxH + effective px + verdict) — fit claims made in prose are self-certification, not verification (IP-20/IP-25)");
      } else if (/\b[1-9]\d*\s+FAIL\b/.test(block) && !/USER-OVERRIDE|trade-?off|取舍|ladder/i.test(block)) {
        F("fit receipt reports FAIL with no recorded trade-off/USER-OVERRIDE — a failing fit never ships silently (layout-craft.md trade-off ladder)");
      } else {
        P("check-render-fit receipt present alongside RENDER_VERIFIED");
      }
    }
  }
}

function main(argv) {
  const file = argv[0];
  if (!file) { console.error("Usage: node check-delivery.js <delivery.md>"); return 2; }
  let md;
  try { md = fs.readFileSync(file, "utf-8"); } catch (e) { console.error(`cannot read ${file}: ${e.message}`); return 2; }
  const blocks = splitDeliveries(md);
  const out = []; out.failed = 0;
  if (blocks.length === 0) {
    console.error('FAIL: no "## Diagram Delivery" block found — the output contract was not used at all');
    return 1;
  }
  blocks.forEach((b, i) => checkBlock(b, i + 1, out));
  console.log(out.join("\n"));
  console.log(`\n${blocks.length} delivery block(s); ${out.failed} FAIL`);
  return out.failed > 0 ? 1 : 0;
}

process.exit(main(process.argv.slice(2)));
