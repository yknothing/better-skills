#!/usr/bin/env node
// Deterministic delivery-contract checker for bs-uml-master deliveries.
// Prose rules bind strong models; this binds all of them. Run it on the
// drafted delivery markdown BEFORE handing it to the user (Phase 5).
//
//   node check-delivery.js <delivery.md>
//
// Checks each "## Diagram Delivery" block:
//   C1 header fields present: Question, Mode, Significance, Backend/Notation
//   C2 State line carries a real receipt: known label + tool name + version
//      (or the text-backend alignment form); bare labels are format-invalid
//   C3 Evidence present; in MODEL-FROM-CODE it must cite file:line
//   C4 Excluded present (explicit "nothing excluded" is fine)
//   C5 declared type matches the fenced source header (class diagram claimed
//      + `graph TB` source = fake notation — the Haiku failure)
//   C6 element budget: counts primary elements from the source; >15 fails
//      without USER-OVERRIDE, >9 warns without a justification mention
//
// Exit: 0 = all pass (warnings allowed), 1 = any FAIL, 2 = usage error.
"use strict";

const fs = require("fs");

const LABELS = /RENDER_VERIFIED(?:\s*\(structural\))?|SYNTAX_VERIFIED|UNVERIFIED/;
// tool + version, e.g. "mmdc 11.6.0", "mermaid-cli v10.6.1", "plantuml 1.2025.4"
const TOOL_VERSION = /\b[a-zA-Z][\w./-]*(?:-cli|\.jar|\.js)?\s+v?\d+(?:\.\d+)+/;
const TEXT_BACKEND_RECEIPT = /text backend.*(?:alignment|monospace|awk|col)/i;

function splitDeliveries(md) {
  const parts = md.split(/^##\s+Diagram Delivery\b.*$/m);
  if (parts.length < 2) return [];
  return parts.slice(1);
}

function field(block, name) {
  // Matches "**Name:** value" up to the next "·"-separated field or line end.
  const re = new RegExp(`\\*\\*${name}:\\*\\*\\s*([^·\\n]+)`, "i");
  const m = block.match(re);
  return m ? m[1].trim() : null;
}

function fence(block) {
  const m = block.match(/```(\w*)\n([\s\S]*?)```/);
  if (!m) return null;
  let body = m[2];
  // Strip a leading YAML frontmatter block (--- ... ---) used for titles or
  // config — otherwise its keys (e.g. "config:") masquerade as the header
  // and C5/C6 silently skip.
  body = body.replace(/^\s*---\r?\n[\s\S]*?\r?\n---\r?\n/, "");
  const header = (body.split(/\r?\n/).find(l => l.trim() &&
    !l.trim().startsWith("%%") && !l.trim().startsWith("title")) || "").trim();
  return { lang: m[1], body, header };
}

function countPrimary(f) {
  if (!f) return null;
  const b = f.body;
  const h = f.header.toLowerCase();
  const uniq = (arr) => new Set(arr).size;
  if (h.startsWith("classdiagram"))
    return uniq([...b.matchAll(/^\s*class\s+([\w"~[\]]+)/gm)].map(m => m[1]));
  if (h.startsWith("sequencediagram"))
    return uniq([...b.matchAll(/^\s*(?:participant|actor)\s+(\w+)/gm)].map(m => m[1]));
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
    // node ids introduced with a bracket/paren label anywhere in the body
    return uniq([...b.matchAll(/\b([A-Za-z_][\w]*)\s*(?:\[|\(\(|\(|\{)/g)]
      .map(m => m[1])
      .filter(id => !/^(subgraph|end|style|classDef|class|linkStyle|click|direction|graph|flowchart)$/.test(id)));
  }
  return null; // unknown language — skip C6
}

function typeMatchesHeader(declaredType, f) {
  if (!f || !f.header) return { ok: true, note: "no fenced source found (external file delivery?)" };
  const t = (declaredType || "").toLowerCase();
  const h = f.header.toLowerCase();
  if (h.startsWith("@startuml") || f.lang === "plantuml")
    return { ok: true, note: "PlantUML source — Mermaid header mapping not applicable" };
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

  // C1
  for (const name of ["Question", "Mode", "Significance"]) {
    field(block, name) ? P(`${name} declared`) : F(`${name} missing from header fields`);
  }
  const backend = field(block, "Backend") || field(block, "Notation");
  backend ? P("Backend/Notation declared") : F("Backend/Notation missing");

  // C2
  const stateLine = (block.match(/\*\*State:\*\*[^\n]*/) || [null])[0];
  if (!stateLine) F("State line missing");
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
  if (!ev) F("Evidence missing");
  else if (mode.includes("CODE") && !/[\w/.-]+\.(?:js|ts|py|sh|json|yaml|md|go|java|rb|rs|c|cpp|cs):\d+|:\d+\b/.test(block))
    F("MODEL-FROM-CODE but no file:line citation anywhere in the delivery");
  else P("Evidence present" + (mode.includes("CODE") ? " with file:line" : ""));

  // C4
  (field(block, "Excluded") || /\*\*Excluded:\*\*/.test(block))
    ? P("Excluded declared")
    : F('Excluded missing (write "nothing excluded; total scope is N elements" if true)');

  // C5
  const f = fence(block);
  const tm = typeMatchesHeader(field(block, "Type/altitude") || field(block, "Type"), f);
  tm.ok ? P("Declared type matches source header" + (tm.note ? ` (${tm.note})` : "")) : F(tm.note);

  // C6
  const n = countPrimary(f);
  if (n !== null) {
    if (n > 15 && !/USER-OVERRIDE/i.test(block)) F(`${n} primary elements > hard ceiling 15 with no USER-OVERRIDE note`);
    else if (n > 9 && !/justif|预算|budget|USER-OVERRIDE/i.test(block)) W(`${n} primary elements > 9 with no visible budget justification`);
    else P(`element count ${n} within budget discipline`);
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
