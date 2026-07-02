// Tiny YAML parser for external/sources.yaml.
// Supports the strict subset we use: top-level keys, nested 2-space indents,
// scalar values (strings only — no quoting required), and list items "- foo".
// Throws on anything outside that subset rather than silently producing wrong data.
"use strict";

const fs = require("fs");

// Strip a trailing " # comment" from a value, but only if the # is preceded by
// whitespace — preserves "#" inside values that are clearly part of the data.
function stripInlineComment(s) {
  const trimmed = s.trim();
  const m = trimmed.match(/^(.*?)\s+#.*$/);
  return (m ? m[1] : trimmed).trim();
}

function parse(text) {
  const root = {};
  const stack = [{ indent: -1, container: root, keyForList: null }];

  const lines = text.split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    if (!raw.trim() || raw.trim().startsWith("#")) continue;

    if (/^\t/.test(raw)) {
      const e = new Error(
        `YAML parse: tab indentation is not supported (line ${i + 1}); use spaces`
      );
      e.code = "EINTEGRITY";
      throw e;
    }
    const indent = raw.match(/^( *)/)[1].length;
    const line = raw.slice(indent);

    while (stack.length > 1 && stack[stack.length - 1].indent >= indent) {
      stack.pop();
    }

    const top = stack[stack.length - 1];

    // List item
    if (line.startsWith("- ")) {
      const value = stripInlineComment(line.slice(2));
      if (top.keyForList === null) {
        const e = new Error(
          `YAML parse: list item without key context at line ${i + 1}: ${raw}`
        );
        e.code = "EINTEGRITY";
        throw e;
      }
      const arr = top.container[top.keyForList];
      if (!Array.isArray(arr)) {
        const e = new Error(
          `YAML parse: list item under non-array key '${top.keyForList}' at line ${i + 1}`
        );
        e.code = "EINTEGRITY";
        throw e;
      }
      arr.push(value);
      continue;
    }

    // key: value or key:
    const colonIdx = line.indexOf(":");
    if (colonIdx < 0) {
      const e = new Error(`YAML parse: expected ':' at line ${i + 1}: ${raw}`);
      e.code = "EINTEGRITY";
      throw e;
    }
    const key = line.slice(0, colonIdx).trim();
    const rest = stripInlineComment(line.slice(colonIdx + 1));

    if (rest === "") {
      // Container key — could be an object or a list. We don't know yet,
      // so place an object and remember the key as a candidate list parent.
      const child = {};
      top.container[key] = child;
      // Peek next non-blank line to decide list vs object
      let j = i + 1;
      while (j < lines.length && (!lines[j].trim() || lines[j].trim().startsWith("#"))) j++;
      if (j < lines.length) {
        const nextRaw = lines[j];
        const nextIndent = nextRaw.match(/^( *)/)[1].length;
        const nextLine = nextRaw.slice(nextIndent);
        if (nextIndent > indent && nextLine.startsWith("- ")) {
          // It's a list
          top.container[key] = [];
          stack.push({ indent, container: top.container, keyForList: key });
          continue;
        }
      }
      // Object
      stack.push({ indent, container: child, keyForList: null });
      continue;
    }

    top.container[key] = rest;
  }

  return root;
}

function parseFile(filePath) {
  const text = fs.readFileSync(filePath, "utf8");
  return parse(text);
}

module.exports = { parse, parseFile };
