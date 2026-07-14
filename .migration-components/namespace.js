"use strict";

const path = require("path");

const PREFIX = "bs-";
const TEXT_EXTENSIONS = new Set([
  ".md", ".txt", ".json", ".yaml", ".yml", ".html", ".css", ".js", ".ts", ".tsx", ".jsx",
]);

function isTextFile(relPath) {
  return path.basename(relPath) === "SKILL.md" || TEXT_EXTENSIONS.has(path.extname(relPath).toLowerCase());
}

function canonicalize(name, aliases) {
  return aliases && aliases[name] ? aliases[name] : name;
}

function legacyNamesFor(canonicalName, aliases) {
  return Object.entries(aliases || {})
    .filter(([, canonical]) => canonical === canonicalName)
    .map(([legacy]) => legacy);
}

function escapeRe(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function rewriteSkillText(input, canonicalName, aliases) {
  let text = input;
  const end = text.indexOf("\n---", 4);
  if (text.startsWith("---\n") && end > 0) {
    const frontmatter = text.slice(0, end).replace(/^name:\s*[^\n]+/m, "name: " + canonicalName);
    text = frontmatter + text.slice(end);
  }

  for (const [legacy, canonical] of Object.entries(aliases || {})) {
    const old = escapeRe(legacy);
    text = text
      .replace(new RegExp("/" + old + "(?![A-Za-z0-9-])", "g"), "/" + canonical)
      .replace(new RegExp("\\$" + old + "(?![A-Za-z0-9-])", "g"), "$" + canonical)
      .replace(new RegExp("`" + old + "`", "g"), "`" + canonical + "`");
  }
  return text;
}

module.exports = { PREFIX, isTextFile, canonicalize, legacyNamesFor, rewriteSkillText };
