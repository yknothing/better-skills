#!/usr/bin/env node
// Browser-free Mermaid syntax checker (degradation-ladder rung 3).
// Yields SYNTAX_VERIFIED at most — it never renders, so it cannot
// establish RENDER_VERIFIED. Use mermaid-cli (mmdc) for that.
//
// Requires the `mermaid` and `jsdom` npm packages, e.g.:
//   npm install --no-save mermaid jsdom && node check-mermaid.js diagram.mmd
//
// Exit codes: 0 = parses, 1 = parse error (printed with line info), 2 = usage/env.
"use strict";

const fs = require("fs");

async function main() {
  const file = process.argv[2];
  if (!file) {
    console.error("Usage: node check-mermaid.js <diagram.mmd>");
    return 2;
  }
  let source;
  try {
    source = fs.readFileSync(file, "utf-8");
  } catch (e) {
    console.error(`check-mermaid: cannot read ${file}: ${e.message}`);
    return 2;
  }

  // Resolve packages from the caller's cwd as well as this script's dir,
  // so `npm install --no-save mermaid jsdom` in the working directory works.
  const { createRequire } = require("module");
  const path = require("path");
  const cwdRequire = createRequire(path.join(process.cwd(), "noop.js"));
  const resolveFrom = (name) => {
    try { return cwdRequire.resolve(name); } catch { return require.resolve(name); }
  };

  let JSDOM;
  try {
    ({ JSDOM } = require(resolveFrom("jsdom")));
  } catch {
    console.error("check-mermaid: jsdom not installed (npm install --no-save jsdom mermaid)");
    return 2;
  }
  const dom = new JSDOM("<!DOCTYPE html><body></body>");
  global.window = dom.window;
  global.document = dom.window.document;

  let mermaid;
  try {
    mermaid = (await import(resolveFrom("mermaid"))).default;
  } catch (e) {
    console.error(`check-mermaid: mermaid package not importable: ${e.message}`);
    return 2;
  }

  try {
    const result = await mermaid.parse(source);
    console.log(`OK: ${result && result.diagramType ? result.diagramType : "parsed"} — SYNTAX_VERIFIED only; render with mmdc for RENDER_VERIFIED`);
    return 0;
  } catch (e) {
    console.error(`PARSE ERROR in ${file}:\n${e.message}`);
    return 1;
  }
}

main().then((code) => process.exit(code));
