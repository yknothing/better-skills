#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const namespace = require("../lib/namespace");
const registry = require("../skills.json");

const dir = process.argv[2];
const canonicalName = process.argv[3];
if (!dir || !canonicalName) {
  console.error("Usage: node tools/rewrite-skill-namespace.js <skill-dir> <canonical-name>");
  process.exit(2);
}
const skillFile = path.join(dir, "SKILL.md");
if (!fs.existsSync(skillFile)) {
  console.error(`SKILL.md not found: ${skillFile}`);
  process.exit(5);
}
const raw = fs.readFileSync(skillFile, "utf8");
fs.writeFileSync(skillFile, namespace.rewriteSkillText(raw, canonicalName, registry.aliases || {}), "utf8");
