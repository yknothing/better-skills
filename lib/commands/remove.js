"use strict";

const path = require("path");
const log = require("../log");
const resolver = require("../resolver");
const paths = require("../paths");
const manifest = require("../manifest");
const installer = require("../installer");

function run({ _, flags }) {
  const name = _[0];
  if (!name) {
    const e = new Error("remove requires a skill name");
    e.code = "EUSAGE";
    throw e;
  }
  if (!resolver.isValidName(name)) {
    const e = new Error(`invalid skill name: ${JSON.stringify(name)}`);
    e.code = "EUSAGE";
    throw e;
  }

  const target = paths.resolveTarget(flags.target);
  const m = manifest.readManifest(target.dir);
  const entry = m.installed[name];
  if (!entry) {
    const e = new Error(`'${name}' is not installed at ${target.dir}`);
    e.code = "ENOTFOUND";
    throw e;
  }

  const destDir = path.join(target.dir, name);
  const { removed, missing } = installer.removeFiles(destDir, entry.files || []);
  log.info(`removed ${removed.length} files from ${destDir}`);
  if (missing.length) {
    log.warn(`${missing.length} tracked files were missing on disk:`);
    for (const m of missing) log.warn(`  ${m.rel} (${m.err})`);
  }

  delete m.installed[name];
  manifest.writeManifest(target.dir, m);
  log.ok(`removed '${name}' from manifest`);
  return 0;
}

module.exports = { run };
