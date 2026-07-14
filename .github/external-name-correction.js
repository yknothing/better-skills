#!/usr/bin/env node
"use strict";

const fs = require("fs");

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

function read(file) {
  return fs.readFileSync(file, "utf8");
}

function write(file, content) {
  fs.writeFileSync(file, content.endsWith("\n") ? content : content + "\n", "utf8");
}

function restoreExternalNames(content) {
  let output = content;
  for (const name of externalNames) {
    output = output.split("bs-" + name).join(name);
  }
  return output;
}

const registry = JSON.parse(read("skills.json"));
for (const name of externalNames) {
  delete registry.aliases[name];
}
registry.namespace.policy = "All self-developed Better-Skills IDs use the bs- prefix. External references preserve upstream names.";
registry.namespace.legacy_aliases = "Deprecated for self-developed skills; remove after one migration release and a clean compatibility review.";
registry.batches["batch-1"].skills = registry.batches["batch-1"].skills.map((name) => {
  const upstream = name.startsWith("bs-") ? name.slice(3) : name;
  return externalNames.includes(upstream) ? upstream : name;
});

const restoredExternal = {};
for (const [name, meta] of Object.entries(registry.skills.external)) {
  const upstream = meta.upstream_skill || (name.startsWith("bs-") ? name.slice(3) : name);
  const next = { ...meta };
  delete next.upstream_skill;
  if (next.notes) next.notes = restoreExternalNames(next.notes);
  restoredExternal[upstream] = next;
}
registry.skills.external = restoredExternal;
write("skills.json", JSON.stringify(registry, null, 2));

const files = [
  "README.md",
  "lib/commands/help.js",
  "tools/test-cli.sh",
  "skills/bs-skill-bootstrap/SKILL.md",
  "skills/bs-visual-design/SKILL.md",
  "skills/bs-visual-design/references/motion.md",
];
for (const file of files) {
  write(file, restoreExternalNames(read(file)));
}

let readme = read("README.md");
readme = readme.replace(
  "All public Better-Skills IDs use the `bs-` prefix, including curated external skills. For example: `bs-visual-design`, `bs-first-customer-finder`, and `brainstorming`. Upstream repositories keep their original source names; the CLI maps and rewrites them during installation. Legacy unprefixed CLI names remain deprecated aliases for one migration release and are never shown as canonical registry entries.",
  "All self-developed Better-Skills IDs use the `bs-` prefix, such as `bs-visual-design` and `bs-first-customer-finder`. Curated external skills preserve their upstream names, such as `brainstorming`, `pptx`, and `grill-me`; the registry records their source repository separately. Legacy unprefixed names for self-developed skills remain deprecated CLI aliases for one migration release."
);
write("README.md", readme);

let sync = read("tools/sync.sh");
sync = sync.replace('  canonical="bs-$skill"\n  SKILL_DST="$SKILLS_DIR/$canonical"', '  SKILL_DST="$SKILLS_DIR/$skill"');
sync = sync.replace('  echo "--- $canonical (upstream: $skill, source: $source) ---"', '  echo "--- $skill (from $source) ---"');
sync = sync.replace('    echo "Linking $canonical..."', '    echo "Linking $skill..."');
sync = sync.replace('      node "$(dirname "$0")/rewrite-skill-namespace.js" "$SKILL_SRC" "$canonical"\n', '');
sync = sync.replace('      echo "  $canonical -> $SKILL_SRC"', '      echo "  $skill -> $SKILL_SRC"');
write("tools/sync.sh", sync);

if (fs.existsSync("tools/rewrite-skill-namespace.js")) {
  fs.unlinkSync("tools/rewrite-skill-namespace.js");
}

console.log("External reference skills restored to upstream names.");
