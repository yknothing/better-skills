"use strict";

const log = require("../log");
const resolver = require("../resolver");
const paths = require("../paths");
const manifest = require("../manifest");

function run({ _, flags }) {
  if (flags.installed) {
    const target = paths.resolveTarget(flags.target);
    const m = manifest.readManifest(target.dir);
    const entries = Object.entries(m.installed);
    if (entries.length === 0) {
      log.info(`no skills installed in ${target.dir}`);
      return 0;
    }
    process.stdout.write(`installed in ${target.dir}\n`);
    for (const [name, meta] of entries.sort((a, b) =>
      a[0].localeCompare(b[0])
    )) {
      const flag = meta.source === "external" ? "[external]" : "[self]";
      process.stdout.write(
        `  ${flag.padEnd(11)} ${name}  (from ${meta.from}, installed ${meta.installed_at || "unknown"})\n`
      );
    }
    return 0;
  }

  const skills = resolver.listDetailed();
  if (skills.length === 0) {
    log.warn("registry empty");
    return 0;
  }
  process.stdout.write(`${skills.length} skills in registry:\n\n`);
  for (const s of skills) {
    if (s.kind === "self-developed") {
      process.stdout.write(
        `  ${s.name.padEnd(28)} self-developed  tier=${s.tier || "-"}  batch=${s.batch || "-"}\n`
      );
    } else {
      process.stdout.write(
        `  ${s.name.padEnd(28)} external        source=${s.source || "-"}  batch=${s.batch || "-"}\n`
      );
    }
  }
  return 0;
}

module.exports = { run };
