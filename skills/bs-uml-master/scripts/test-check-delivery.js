#!/usr/bin/env node
// Regression self-test for check-delivery.js. Every fixture here encodes a
// real failure vector found by review probes or acceptance runs (IP-10,
// R3 adversary F1-F6). Run from anywhere:
//   node skills/bs-uml-master/scripts/test-check-delivery.js
// Exit 0 = all assertions hold.
"use strict";

const { execFileSync } = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");

const CHECKER = path.join(__dirname, "check-delivery.js");
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "chkdel-"));
let failures = 0;

function run(name, content, expectExit, mustMatch = [], mustNotMatch = []) {
  const file = path.join(tmp, name.replace(/\W+/g, "_") + ".md");
  fs.writeFileSync(file, content);
  let out = "", code = 0;
  try { out = execFileSync("node", [CHECKER, file], { encoding: "utf-8" }); }
  catch (e) { code = e.status ?? 1; out = (e.stdout || "") + (e.stderr || ""); }
  const problems = [];
  if (code !== expectExit) problems.push(`exit ${code}, expected ${expectExit}`);
  for (const re of mustMatch) if (!re.test(out)) problems.push(`missing ${re}`);
  for (const re of mustNotMatch) if (re.test(out)) problems.push(`unexpected ${re}`);
  if (problems.length) { failures++; console.log(`FAIL ${name}: ${problems.join("; ")}\n--- output ---\n${out}`); }
  else console.log(`PASS ${name}`);
}

const HDR = (over = {}) => {
  const d = {
    Question: "q", Mode: "MODEL-FROM-CODE", Significance: "deliverable",
    Backend: "Mermaid",
    State: "RENDER_VERIFIED — mmdc 11.4.0, SVG inspected",
    Type: "module dependency flowchart @ file level", ...over,
  };
  return `## Diagram Delivery — t

**Question:** ${d.Question} · **Mode:** ${d.Mode} · **Significance:** ${d.Significance}
**Type/altitude:** ${d.Type} · **Backend:** ${d.Backend} · **State:** ${d.State}
`;
};
const FIT = "**Fit:** check-render-fit.js — canvas 1200x760, 16px at fit, PASS (pc 1470x850)\n";
const TAIL = `
**Excluded:** x · **Assumptions:** none
**Evidence:** lib/cli.js:4
${FIT}`;
const FLOW4 = "```mermaid\nflowchart TB\n    a[\"A\"]\n    b[\"B\"]\n    a --> b\n```\n";

// 1. Fully compliant delivery
run("good", HDR() + FLOW4 + TAIL, 0, [/0 FAIL/]);

// 2. Haiku profile: bare state, no evidence/excluded, fake class notation
run("haiku-profile", `## Diagram Delivery — t

**Question:** q · **Mode:** MODEL-FROM-CODE · **Significance:** deliverable
**Type/altitude:** Class Diagram · **Notation:** Mermaid · **State:** RENDER_VERIFIED

\`\`\`mermaid
graph TB
    A["A<br/>---<br/>x: string"]
\`\`\`
`, 1, [/no tool\+version receipt/, /fake or mismatched notation/, /Evidence missing/, /Excluded missing/]);

// 3. IP-10: YAML frontmatter must not hide C5/C6 (10 nodes -> budget WARN)
const TEN = "```mermaid\n---\nconfig:\n    layout: dagre\n--- \ngraph TB\n" +
  "abcdefghij".split("").map(c => `    ${c}["${c}"]`).join("\n") + "\n    a --> b\n```\n";
run("frontmatter-budget", HDR() + TEN + TAIL, 0, [/WARN.*> 9/]);

// 4. F5: plantuml-tagged fence around Mermaid source = tag laundering
run("tag-laundering", HDR({ Type: "Class Diagram" }) +
  "```plantuml\ngraph TB\n    A[\"A\"]\n```\n" + TAIL, 1, [/tag laundering/]);

// 5. F6: receipts-block-first delivery must not false-FAIL
run("receipts-first", HDR() +
  "```text\n$ mmdc -i d.mmd -o d.svg\nexit 0\n```\n" + FLOW4 + TAIL, 0, [/0 FAIL/]);

// 6. F1: edges-only classDiagram counts relation identifiers (17 ids -> ceiling FAIL)
const EDGES = "```mermaid\nclassDiagram\n" +
  Array.from({ length: 16 }, (_, i) => `    C${i} <|-- C${i + 1}`).join("\n") + "\n```\n";
run("edges-only-ceiling", HDR({ Type: "Class Diagram" }) + EDGES + TAIL, 1, [/> hard ceiling 15/]);

// 7. F4: prose that mimics receipts must not count
run("fake-receipt", HDR({ State: "RENDER_VERIFIED — checked 3.2 boxes carefully" }) + FLOW4 + TAIL,
  1, [/no tool\+version receipt/]);
run("fake-fileline", HDR() + FLOW4 + "\n**Excluded:** x\n**Evidence:** confirmed at 14:32 today\n",
  1, [/no path\.ext:line/]);

// 8. F2: compressed sketch delivery is legal — only the state line is enforced
run("sketch-compressed", `## Diagram Delivery — t (sketch level)

**Significance:** sketch · **State:** SYNTAX_VERIFIED — check-mermaid.js 11.4.0 parse ok
` + FLOW4, 0, [/0 FAIL/, /WARN.*Evidence missing/]);
run("sketch-still-needs-state", `## Diagram Delivery — t (sketch level)
` + FLOW4, 1, [/State line missing/]);

// 9. F3: PlantUML sources are counted and type-checked
const PUML17 = "```plantuml\n@startuml\n" +
  Array.from({ length: 17 }, (_, i) => `component C${i}`).join("\n") + "\n@enduml\n```\n";
run("plantuml-ceiling", HDR({ Type: "component diagram", Backend: "PlantUML", State: "RENDER_VERIFIED — plantuml 1.2025.4, SVG inspected" }) + PUML17 + TAIL,
  1, [/> hard ceiling 15/]);
run("plantuml-type-mismatch", HDR({ Type: "sequence diagram", Backend: "PlantUML", State: "RENDER_VERIFIED — plantuml 1.2025.4, SVG inspected" }) +
  "```plantuml\n@startuml\nclass A\nclass B\nA <|-- B\n@enduml\n```\n" + TAIL,
  1, [/no matching construct/]);

// 10. Contract not used at all
run("no-contract", "here is your diagram:\n" + FLOW4, 1, [/contract was not used/]);

// 11. F8: multiplicity-styled edges-only classDiagram still hits the ceiling
const MULT = "```mermaid\nclassDiagram\n" +
  Array.from({ length: 16 }, (_, i) => `    C${i} "1" <|-- "0..*" C${i + 1}`).join("\n") + "\n```\n";
run("multiplicity-edges-ceiling", HDR({ Type: "Class Diagram" }) + MULT + TAIL, 1, [/> hard ceiling 15/]);

// 12. F9: prose "version" no longer counts as a tool receipt
run("prose-version-receipt", HDR({ State: "RENDER_VERIFIED — version 3.2 of my careful process" }) + FLOW4 + TAIL,
  1, [/no tool\+version receipt/]);

// 13. F10: a tiny decoy fence cannot launder a mismatched real fence
run("decoy-fence", HDR({ Type: "Class Diagram" }) +
  "```mermaid\nclassDiagram\n    class A\n```\n" +
  "```mermaid\ngraph TB\n    X[\"X<br/>---<br/>f: string\"]\n```\n" + TAIL,
  1, [/fake or mismatched notation/]);

// 13b. C7: color styling without a legend/declared dimension draws a WARN;
//      with a declared dimension it stays clean
const COLORED = "```mermaid\nflowchart TB\n    a[\"A\"]\n    b[\"B\"]\n    a --> b\n    classDef app fill:#56B4E9\n    class a app\n```\n";
run("color-without-legend", HDR() + COLORED + TAIL, 0, [/WARN.*no legend\/declared color dimension/]);
run("color-with-dimension", HDR() + COLORED + "\n**Excluded:** x · color = architectural layer (legend below)\n**Evidence:** lib/cli.js:4\n" + FIT,
  0, [/0 FAIL/], [/WARN.*color/]);
// C7 bypass probes (R5 adversary F2): themeVariables, PlantUML inline #hex,
// and the "no legend needed" silencing must all still draw the WARN
run("color-themevariables-bypass", HDR() +
  "```mermaid\n%%{init: {\"themeVariables\": {\"primaryColor\": \"#ff0000\"}}}%%\nflowchart TB\n    a[\"A\"]\n```\n" + TAIL,
  0, [/WARN.*no legend\/declared color dimension/]);
run("color-plantuml-inline-bypass", HDR({ Type: "component diagram", Backend: "PlantUML", State: "RENDER_VERIFIED — plantuml 1.2025.4, SVG inspected" }) +
  "```plantuml\n@startuml\ncomponent Api #lightblue\ncomponent Db #FFAA00\nApi --> Db\n@enduml\n```\n" + TAIL,
  0, [/WARN.*no legend\/declared color dimension/]);
run("color-no-legend-silencing", HDR() + COLORED + "\n**Excluded:** x (no legend needed here)\n**Evidence:** lib/cli.js:4\n" + FIT,
  0, [/WARN.*no legend\/declared color dimension/]);
// Mermaid escape entities must NOT false-positive as color
run("entities-not-color", HDR() +
  "```mermaid\nflowchart TB\n    a[\"uses #quot;x#quot;\"]\n    b[\"B\"]\n    a --> b\n```\n" + TAIL,
  0, [/0 FAIL/], [/WARN.*color/]);

// 15. R6/C8: RENDER_VERIFIED with no check-render-fit receipt = the usage
//     sample #3 exploit (self-certified "medium fit ✅", four towers shipped)
run("fit-receipt-missing", HDR() + FLOW4 + `
**Excluded:** x · **Assumptions:** none
**Evidence:** lib/cli.js:4
Rubric self-check: flow ✅, crossings 0 ✅, medium fit ✅ (zoomable, no compression needed)
`, 1, [/RENDER_VERIFIED without a check-render-fit receipt/]);
// A receipt reporting failures cannot ship silently…
run("fit-receipt-fail-silent", HDR() + FLOW4 + `
**Excluded:** x · **Assumptions:** none
**Evidence:** lib/cli.js:4
**Fit:** check-render-fit.js — canvas 698x1648, FAIL 8.3px < 11px; 1 FAIL
`, 1, [/fit receipt contains a FAIL verdict with no recorded trade-off/]);
// …but is honest with a recorded USER-OVERRIDE trade-off
run("fit-receipt-fail-override", HDR() + FLOW4 + `
**Excluded:** x · **Assumptions:** none
**Evidence:** lib/cli.js:4
**Fit:** check-render-fit.js — canvas 698x1648, FAIL 8.3px < 11px; 1 FAIL
USER-OVERRIDE: user requested the full mural; companion overview delivered alongside.
`, 0, [/check-render-fit receipt present/]);
// SYNTAX_VERIFIED and text-backend deliveries are exempt from C8
run("fit-not-required-syntax-verified", HDR({ State: "SYNTAX_VERIFIED — check-mermaid.js 11.17.2 parse ok" }) + FLOW4 + `
**Excluded:** x · **Assumptions:** none
**Evidence:** lib/cli.js:4
`, 0, [/0 FAIL/]);
run("fit-not-required-text-backend", HDR({ Type: "ASCII structure @ file level", Backend: "plain text", State: "RENDER_VERIFIED — text backend alignment verified via awk col check" }) +
  "```text\n+---+\n| A |\n+---+\n```\n" + `
**Excluded:** x · **Assumptions:** none
**Evidence:** lib/cli.js:4
`, 0, [/0 FAIL/]);
// Sketch significance relaxes C8 to a WARN
run("fit-receipt-sketch-warns", `## Diagram Delivery — t (sketch level)

**Significance:** sketch · **State:** RENDER_VERIFIED — mmdc 11.4.0, SVG inspected
` + FLOW4, 0, [/WARN.*check-render-fit receipt/]);

// A State line merely claiming a text-backend receipt on a visual backend
// must NOT dodge C8 (exemption keys on the Backend field, not the State)
run("fit-bypass-fake-text-receipt", HDR({ State: "RENDER_VERIFIED — text backend alignment verified via col check" }) + FLOW4 + `
**Excluded:** x · **Assumptions:** none
**Evidence:** lib/cli.js:4
`, 1, [/RENDER_VERIFIED without a check-render-fit receipt/]);

// 17. R6.1 (adversary F1): the text-backend exemption must match the WHOLE
//     Backend field — "Mermaid (text annotations)" and the unreplaced
//     template placeholder are visual deliveries and need the receipt
run("fit-bypass-backend-substring", HDR({ Backend: "Mermaid (text annotations)" }) + FLOW4 + `
**Excluded:** x · **Assumptions:** none
**Evidence:** lib/cli.js:4
`, 1, [/RENDER_VERIFIED without a check-render-fit receipt/]);
run("fit-bypass-backend-placeholder", HDR({ Backend: "[Mermaid|PlantUML|text|SVG]" }) + FLOW4 + `
**Excluded:** x · **Assumptions:** none
**Evidence:** lib/cli.js:4
`, 1, [/RENDER_VERIFIED without a check-render-fit receipt/]);

// R6.1 (adversary F2): verbatim per-line FAIL output pasted WITHOUT the
// trailing "1 FAIL" summary still counts as a failing receipt
run("fit-receipt-perline-fail-smuggle", HDR() + FLOW4 + `
**Excluded:** x · **Assumptions:** none
**Evidence:** lib/cli.js:4
**Fit:** check-render-fit.js output:
INFO canvas 698x1648 (aspect 0.42:1), medium=pc viewport 1470x850, label font 16px
FAIL gestalt diagram does not fit one screen legibly: effective label font 8.3px
`, 1, [/fit receipt contains a FAIL verdict with no recorded trade-off/]);

// R6.1 (adversary F3): the four receipt tokens scattered across the
// delivery's prose do not form a receipt — they must co-occur in a window
run("fit-receipt-scattered-tokens", HDR() + FLOW4 + `
**Excluded:** x · **Assumptions:** none — I always run check-render-fit on real deliveries.
**Evidence:** lib/cli.js:4

(reading notes filler line one)
(reading notes filler line two)
(reading notes filler line three)
(reading notes filler line four)
(reading notes filler line five)
The canvas is 1200x760 and labels sit at 16px, which I consider a PASS.
`, 1, [/RENDER_VERIFIED without a check-render-fit receipt/]);
// …and hedge language inside the window is a prediction, not a receipt
run("fit-receipt-hedged", HDR() + FLOW4 + `
**Excluded:** x · **Assumptions:** none
**Evidence:** lib/cli.js:4
**Fit:** check-render-fit was not run here, but canvas is roughly 1200x760 at 16px so it should PASS
`, 1, [/hedge\/negation language/]);

// R6.1 (adversary F4): a declared non-sketch Significance field wins over a
// stray "sketch level" phrase — nothing relaxes
run("sketch-phrase-cannot-downgrade", `## Diagram Delivery — t (sketch level)

**Question:** q · **Mode:** MODEL-FROM-CODE · **Significance:** deliverable
**Type/altitude:** module dependency flowchart @ file level · **Backend:** Mermaid · **State:** RENDER_VERIFIED — mmdc 11.4.0, SVG inspected
` + FLOW4 + `
**Excluded:** x · **Assumptions:** none
**Evidence:** lib/cli.js:4
`, 1, [/RENDER_VERIFIED without a check-render-fit receipt/], [/WARN.*check-render-fit receipt/]);

// R6.1 (adversary F5): a stray quote on one line must not pair across
// newlines and hide a real inline color from C7
run("plantuml-stray-quote-color-hides", HDR({ Type: "state machine", Backend: "PlantUML", State: "RENDER_VERIFIED — plantuml 1.2025.4, SVG inspected" }) +
  "```plantuml\n@startuml\n' note: legacy \" naming kept\nstate \"Fast Mode\" as s1 #lightblue\n[*] --> s1\n@enduml\n```\n" + TAIL,
  0, [/WARN.*no legend\/declared color dimension/]);

// 18. R6.2 (adversary F7): declaring "Backend: text" over a mermaid-shaped
//     fence is a lie the fence exposes — the exemption must not apply
run("fit-bypass-text-over-mermaid-fence", HDR({ Backend: "text" }) + FLOW4 + `
**Excluded:** x · **Assumptions:** none
**Evidence:** lib/cli.js:4
`, 1, [/RENDER_VERIFIED without a check-render-fit receipt/]);

// R6.2 (adversary F8): a clean PASS window must not launder a second FAIL
// receipt further down (dual-profile smuggling) — FAIL scan is block-wide
run("fit-receipt-dual-profile-smuggle", HDR() + FLOW4 + `
**Excluded:** x · **Assumptions:** none
**Evidence:** lib/cli.js:4
**Fit:** check-render-fit.js — canvas 1200x760, 16px at fit, PASS (pc 1470x850)

(reading notes filler line one)
(reading notes filler line two)
(reading notes filler line three)
(reading notes filler line four)
(reading notes filler line five)
(reading notes filler line six)
a4 run: canvas 1200x760, 8.9px at fit; 1 FAIL
`, 1, [/fit receipt contains a FAIL verdict with no recorded trade-off/]);
// …and a per-line FAIL padded outside the tool window is still caught
run("fit-receipt-padded-fail", HDR() + FLOW4 + `
**Excluded:** x · **Assumptions:** none
**Evidence:** lib/cli.js:4
**Fit:** check-render-fit.js output (pc):
INFO canvas 1200x760, label font 16px
PASS no edge exceeds one screen along the reading axis
(filler one)
(filler two)
(filler three)
(filler four)
(filler five)
(filler six)
FAIL gestalt diagram does not fit one screen legibly: effective label font 8.9px
`, 1, [/fit receipt contains a FAIL verdict with no recorded trade-off/]);

// R6.2 (adversary F9): an honest receipt below contract fields containing
// incidental hedge words ("roughly 20 files") must NOT be false-FAILed —
// the window is forward-only from the tool token
run("fit-receipt-neighbor-hedge-ok", HDR() + FLOW4 + `
**Excluded:** helper modules (roughly 20 files off-question) · **Assumptions:** none
**Evidence:** lib/cli.js:4
**Fit:** check-render-fit.js — canvas 1200x760, 16px at fit, PASS (pc 1470x850)
`, 0, [/check-render-fit receipt present/]);

// 16. IP-24: escape entities inside quoted PlantUML display names must not
//     trip the inline-color WARN; real inline colors still must
run("plantuml-quoted-entity-not-color", HDR({ Type: "state machine", Backend: "PlantUML", State: "RENDER_VERIFIED — plantuml 1.2025.4, SVG inspected" }) +
  "```plantuml\n@startuml\nstate \"uses #quot;fast#quot; mode\" as s1\n[*] --> s1\n@enduml\n```\n" + TAIL,
  0, [/0 FAIL/], [/WARN.*color/]);
run("plantuml-quoted-name-real-color", HDR({ Type: "state machine", Backend: "PlantUML", State: "RENDER_VERIFIED — plantuml 1.2025.4, SVG inspected" }) +
  "```plantuml\n@startuml\nstate \"Fast Mode\" as s1 #lightblue\n[*] --> s1\n@enduml\n```\n" + TAIL,
  0, [/WARN.*no legend\/declared color dimension/]);

// 14. F11: fenceless deliveries — WARN with an external file ref, FAIL without
run("fenceless-with-file", HDR() + "\nSource delivered at scratch/arch.mmd, rendered to arch.svg.\n" + TAIL,
  0, [/external-file delivery/]);
run("fenceless-no-source", HDR() + "\nTrust me, the diagram is great.\n" + TAIL,
  1, [/no diagram source found/]);

console.log(`\n${failures === 0 ? "ALL PASS" : failures + " FIXTURE FAILURES"}`);
fs.rmSync(tmp, { recursive: true, force: true });
process.exit(failures === 0 ? 0 : 1);
