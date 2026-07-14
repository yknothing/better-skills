#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const root = process.cwd();
const externalNames = [
  "brainstorming",
  "pptx",
  "grill-me",
  "grilling",
  "writing-great-skills",
  "learn-skill",
  "emil-design-eng",
  "review-animations",
  "animation-vocabulary",
];
const textExts = new Set([".md", ".txt", ".json", ".yaml", ".yml", ".js", ".sh", ".html", ".css", ".ts", ".tsx", ".jsx"]);

function isText(file) {
  return textExts.has(path.extname(file).toLowerCase()) || path.basename(file) === "SKILL.md";
}

function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if ([".git", "node_modules"].includes(entry.name)) continue;
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(abs));
    else if (entry.isFile() && isText(abs)) out.push(abs);
  }
  return out;
}

function stripExternalPrefixes(text) {
  let out = text;
  for (const name of externalNames) out = out.split(`bs-${name}`).join(name);
  return out;
}

for (const file of walk(root)) {
  const before = fs.readFileSync(file, "utf8");
  const after = stripExternalPrefixes(before);
  if (after !== before) fs.writeFileSync(file, after, "utf8");
}

const registryPath = path.join(root, "skills.json");
const registry = JSON.parse(fs.readFileSync(registryPath, "utf8"));
for (const name of externalNames) {
  delete registry.aliases?.[name];
  if (registry.skills?.external?.[name]) delete registry.skills.external[name].upstream_skill;
}
registry.namespace = {
  prefix: "bs-",
  policy: "Self-developed Better-Skills IDs use the bs- prefix; curated external skills retain upstream IDs.",
  legacy_aliases: "Deprecated aliases apply only to renamed self-developed skills and should be removed after one migration release.",
};
fs.writeFileSync(registryPath, JSON.stringify(registry, null, 2) + "\n", "utf8");

const readmePath = path.join(root, "README.md");
let readme = fs.readFileSync(readmePath, "utf8");
readme = readme.replace(
  /## Skill namespace[\s\S]*?## What's actually in here today/,
  "## Skill namespace\n\nBetter-Skills self-developed skills use the `bs-` prefix, such as `bs-visual-design` and `bs-first-customer-finder`. Curated external skills retain their upstream names, such as `brainstorming`, `pptx`, and `grill-me`. Legacy unprefixed names for self-developed skills remain deprecated CLI aliases for one migration release.\n\n## What's actually in here today"
);
fs.writeFileSync(readmePath, readme, "utf8");

const bootstrapPath = path.join(root, "skills", "bs-skill-bootstrap", "SKILL.md");
let bootstrap = fs.readFileSync(bootstrapPath, "utf8");
bootstrap = bootstrap.replace(
  /10\. \*\*Enforce the Better-Skills namespace\.\*\*[^\n]*/,
  "10. **Enforce the Better-Skills namespace.** Every self-developed canonical skill ID and directory MUST start with `bs-`. Curated external references MUST retain their upstream names."
);
fs.writeFileSync(bootstrapPath, bootstrap, "utf8");

function restoreFromMain(rel) {
  const content = execFileSync("git", ["show", `origin/main:${rel}`], { encoding: "utf8" });
  fs.writeFileSync(path.join(root, rel), content, "utf8");
}
restoreFromMain("lib/installer.js");
restoreFromMain("tools/sync.sh");
fs.chmodSync(path.join(root, "tools/sync.sh"), 0o755);

const addPath = path.join(root, "lib", "commands", "add.js");
let add = fs.readFileSync(addPath, "utf8");
add = add.replace(
  "installer.copyTree(absSourceDir, destDir, { dryRun: true, canonicalName: name, aliases: src.aliases })",
  "installer.copyTree(absSourceDir, destDir, { dryRun: true })"
);
add = add.replace(
  "installer.copyTree(absSourceDir, destDir, { canonicalName: name, aliases: src.aliases })",
  "installer.copyTree(absSourceDir, destDir)"
);
fs.writeFileSync(addPath, add, "utf8");

for (const rel of ["lib/namespace.js", "tools/rewrite-skill-namespace.js"]) {
  const abs = path.join(root, rel);
  if (fs.existsSync(abs)) fs.unlinkSync(abs);
}

console.log("External skill identities restored to upstream names; self-developed bs-* namespace preserved.");
