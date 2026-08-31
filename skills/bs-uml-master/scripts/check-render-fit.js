#!/usr/bin/env node
// Screen-fit legibility checker for rendered diagram SVGs.
// Operationalizes the viewing reality: diagrams are read on landscape PC
// screens by human eyes with a hard legibility floor. Mechanical, from the
// SVG alone — no judgment calls.
//
//   node check-render-fit.js <diagram.svg> [--viewport WxH] [--kind gestalt|linear|auto] [--font N]
//
// Rules (per-axis, by narrative kind):
//   gestalt  (class/component/ER/architecture — no linear reading order):
//     BOTH axes must fit one viewport with effective label font >= 11px.
//   linear   (sequence/process flows — reading order follows one axis):
//     cross axis must fit at >= 11px; reading axis may extend to <= 3
//     viewport-screens (scrolling along the reading axis is the native
//     reading gesture); beyond 3 screens is a split signal.
//   Long-range edges: an edge whose reading-axis span exceeds one viewport
//   at display scale cannot show both endpoints together — flagged as a
//   split-and-cross-reference signal (WARN; >=2 such edges on gestalt: FAIL).
//
// kind auto-detection: sequence diagrams (actor/lifeline markers) => linear;
// everything else => gestalt. Pass --kind linear explicitly for top-down
// process flowcharts that genuinely read line-by-line.
//
// Exit: 0 pass (warnings allowed), 1 fail, 2 usage error.
"use strict";

const fs = require("fs");

const DEFAULT_VIEWPORT = [1470, 850]; // typical laptop browser content area
const LEGIBLE_PX = 11;
const MAX_READING_SCREENS = 3;

function parseArgs(argv) {
  const opts = { viewport: DEFAULT_VIEWPORT, kind: "auto", font: null, file: null };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--viewport") {
      const m = String(argv[++i]).match(/^(\d+)x(\d+)$/);
      if (!m) return null;
      opts.viewport = [Number(m[1]), Number(m[2])];
    } else if (a === "--kind") {
      const v = argv[++i];
      if (!["gestalt", "linear", "auto"].includes(v)) return null;
      opts.kind = v;
    } else if (a === "--font") {
      opts.font = Number(argv[++i]) || null;
    } else if (!a.startsWith("-")) {
      opts.file = a;
    } else return null;
  }
  return opts.file ? opts : null;
}

function detectFont(svg) {
  // Most frequent explicit font-size wins; mermaid default is 16px.
  const sizes = {};
  for (const m of svg.matchAll(/font-size\s*[:=]\s*"?(\d+(?:\.\d+)?)(?:px)?/g)) {
    const v = Math.round(Number(m[1]));
    if (v >= 8 && v <= 40) sizes[v] = (sizes[v] || 0) + 1;
  }
  const best = Object.entries(sizes).sort((a, b) => b[1] - a[1])[0];
  return best ? Number(best[0]) : 16;
}

function isSequence(svg) {
  // Mermaid embeds the true diagram type as aria-roledescription
  // ("sequence", "flowchart-v2", "class", ...). When present it is
  // authoritative — a flowchart node styled `classDef actor` renders as
  // <g class="node default actor"> and must NOT flip detection (probed).
  const role = (svg.match(/aria-roledescription="([^"]+)"/) || [])[1];
  if (role) return /^sequence/i.test(role);
  // No roledescription (older renderers): fall back to actor/messageLine
  // class markers on real elements.
  return /<(?:rect|g|line|text)\b[^>]*class="[^"]*\b(?:actor|messageLine\d*)\b/i.test(svg);
}

function edgeSpans(svg) {
  // Edge endpoints. Mermaid 11 emits attributes in varying order (d= often
  // BEFORE class=), and sequence messages are <line> elements, not <path>.
  // Match tags first, then read attributes order-independently.
  const spans = [];
  const EDGE_CLASS = /\b(?:edge|edgePath|flowchart-link|relation|transition|messageLine\d*|edgePaths?)\b/;
  for (const tag of svg.matchAll(/<(path|line)\b[^>]*>/g)) {
    const t = tag[0];
    const cls = (t.match(/class="([^"]*)"/) || [])[1] || "";
    if (!EDGE_CLASS.test(cls)) continue;
    if (tag[1] === "line") {
      const g = (n) => Number((t.match(new RegExp(`\\b${n}="(-?\\d+(?:\\.\\d+)?)"`)) || [])[1]);
      const x1 = g("x1"), y1 = g("y1"), x2 = g("x2"), y2 = g("y2");
      if ([x1, y1, x2, y2].every(Number.isFinite))
        spans.push({ dx: Math.abs(x2 - x1), dy: Math.abs(y2 - y1) });
    } else {
      const d = (t.match(/\bd="([^"]+)"/) || [])[1];
      if (!d) continue;
      const nums = [...d.matchAll(/(-?\d+(?:\.\d+)?)[,\s]+(-?\d+(?:\.\d+)?)/g)]
        .map(p => [Number(p[1]), Number(p[2])]);
      if (nums.length >= 2) {
        const [x1, y1] = nums[0];
        const [x2, y2] = nums[nums.length - 1];
        spans.push({ dx: Math.abs(x2 - x1), dy: Math.abs(y2 - y1) });
      }
    }
  }
  return spans;
}

function main(argv) {
  const opts = parseArgs(argv);
  if (!opts) {
    console.error("Usage: node check-render-fit.js <diagram.svg> [--viewport WxH] [--kind gestalt|linear|auto] [--font N]");
    return 2;
  }
  let svg;
  try { svg = fs.readFileSync(opts.file, "utf-8"); } catch (e) {
    console.error(`cannot read ${opts.file}: ${e.message}`);
    return 2;
  }
  const vb = svg.match(/viewBox="([\d.\s-]+)"/);
  if (!vb) { console.error("no viewBox found — is this a rendered SVG?"); return 2; }
  const [, , wS, hS] = vb[1].trim().split(/\s+/);
  const W = Number(wS), H = Number(hS);
  if (!(W > 0 && H > 0)) { console.error("unusable viewBox"); return 2; }

  const [VW, VH] = opts.viewport;
  const font = opts.font || detectFont(svg);
  const seq = isSequence(svg);
  const kind = opts.kind === "auto" ? (seq ? "linear" : "gestalt") : opts.kind;
  // Reading axis: a sequence diagram ALWAYS reads vertically (time axis) —
  // a wide one means participant overflow, never "horizontal reading".
  // Only a manually declared linear pipeline uses the longer-axis heuristic.
  const readingAxisVertical = seq ? true : H >= W;

  const out = [];
  let failed = 0;
  const P = (l) => out.push(`  PASS  ${l}`);
  const F = (l) => { out.push(`  FAIL  ${l}`); failed++; };
  const Wn = (l) => out.push(`  WARN  ${l}`);

  out.push(`  INFO  canvas ${W.toFixed(0)}x${H.toFixed(0)} (aspect ${(W / H).toFixed(2)}:1), viewport ${VW}x${VH}, label font ${font}px, kind=${kind}`);
  if (opts.kind === "linear" && !seq) {
    Wn("kind=linear was declared manually and the SVG carries no sequence markers — this claim must be defensible (a genuinely line-by-line process flow); declaring linear to launder a gestalt fit failure violates Rule 6");
  }

  const fitBoth = Math.min(VW / W, VH / H, 1); // never upscale for the check
  const effBoth = font * fitBoth;

  if (kind === "gestalt") {
    if (effBoth >= LEGIBLE_PX) {
      P(`fits one screen: effective label font ${effBoth.toFixed(1)}px >= ${LEGIBLE_PX}px`);
    } else {
      F(`gestalt diagram does not fit one screen legibly: effective label font ${effBoth.toFixed(1)}px < ${LEGIBLE_PX}px — split by question/altitude, compress presentation, or (layered subgraph structures on a controlled renderer) switch to the ELK layout engine; see layout-craft.md fit-to-screen ladder`);
    }
    const aspect = W / H;
    if (aspect < 0.5 || aspect > 2.5) {
      Wn(`aspect ${aspect.toFixed(2)}:1 is far from the landscape-screen band (0.5–2.5) — likely a layout-direction problem, not a content problem`);
    }
  } else {
    // linear: cross axis must fit; reading axis capped in screens
    const crossFit = readingAxisVertical ? Math.min(VW / W, 1) : Math.min(VH / H, 1);
    const effCross = font * crossFit;
    if (effCross >= LEGIBLE_PX) {
      P(`cross axis fits: effective label font ${effCross.toFixed(1)}px at fit-${readingAxisVertical ? "width" : "height"}`);
    } else {
      F(`cross axis does not fit legibly (${effCross.toFixed(1)}px < ${LEGIBLE_PX}px) — too many ${readingAxisVertical ? "participants/columns" : "rows"}; curate or split`);
    }
    const screens = readingAxisVertical ? (H * crossFit) / VH : (W * crossFit) / VW;
    if (screens <= 1) P(`reading axis fits one screen (${screens.toFixed(2)})`);
    else if (screens <= MAX_READING_SCREENS) Wn(`reading axis spans ${screens.toFixed(1)} screens — legal for linear reading; each screenful must stand alone`);
    else F(`reading axis spans ${screens.toFixed(1)} screens > ${MAX_READING_SCREENS} — split into scenario phases with cross-references`);
  }

  // Long-range edges (measured at display scale)
  const scale = kind === "gestalt" ? fitBoth
    : (readingAxisVertical ? Math.min(VW / W, 1) : Math.min(VH / H, 1));
  // Note: a gestalt diagram that fits one screen cannot have an over-screen
  // edge by construction — this check bites on linear/scrolling diagrams,
  // where a torn edge is a split-and-cross-reference signal.
  const longEdges = edgeSpans(svg).filter(s =>
    (readingAxisVertical ? s.dy : s.dx) * scale > (readingAxisVertical ? VH : VW));
  if (longEdges.length === 0) {
    P("no edge exceeds one screen along the reading axis (both endpoints co-visible)");
  } else {
    Wn(`${longEdges.length} edge(s) span more than one screen — endpoints not co-visible; consider splitting or converting to a cross-reference`);
  }

  console.log(out.join("\n"));
  console.log(`\n${failed} FAIL`);
  return failed > 0 ? 1 : 0;
}

process.exit(main(process.argv.slice(2)));
