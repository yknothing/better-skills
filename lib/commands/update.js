"use strict";

const log = require("../log");
const paths = require("../paths");
const manifest = require("../manifest");
const addCmd = require("./add");

function run({ _, flags }) {
  const name = _[0];
  const target = paths.resolveTarget(flags.target);
  const m = manifest.readManifest(target.dir);

  const names = name ? [name] : Object.keys(m.installed);
  if (names.length === 0) {
    log.info(`no skills installed in ${target.dir}; nothing to update`);
    return 0;
  }
  if (name && !m.installed[name]) {
    const e = new Error(`'${name}' is not installed at ${target.dir}`);
    e.code = "ENOTFOUND";
    throw e;
  }

  let lastCode = 0;
  for (const n of names) {
    log.info(`updating '${n}'…`);
    // Re-invoke add with --force, preserving --dry-run + --target
    const code = addCmd.run({
      _: [n],
      flags: { ...flags, force: true },
    });
    if (code !== 0) lastCode = code;
  }
  return lastCode;
}

module.exports = { run };
