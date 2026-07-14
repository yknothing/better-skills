"use strict";

const path = require("path");
const log = require("../log");
const resolver = require("../resolver");
const paths = require("../paths");
const manifest = require("../manifest");
const installer = require("../installer");

function run({ _, flags }) {
  const requestedName = _[0];
  if (!requestedName) {
    const e = new Error("remove requires a skill name");
    e.code = "EUSAGE";
    throw e;
  }
  if (!resolver.isValidName(requestedName)) {
    const e = new Error(`invalid skill name: ${JSON.stringify(requestedName)}`);
    e.code = "EUSAGE";
    throw e;
  }

  const target = paths.resolveTarget(flags.target);
  const m = manifest.readManifest(target.dir);
  const canonical = resolver.canonicalizeName(requestedName);
  const candidates = [requestedName, canonical, ...resolver.legacyNamesFor(canonical)];
  const installedName = candidates.find((candidate) => m.installed[candidate]);
  const entry = installedName ? m.installed[installedName] : null;
  if (!entry) {
    const e = new Error(`'${requestedName}' is not installed at ${target.dir}`);
    e.code = "ENOTFOUND";
    throw e;
  }

  const destDir = path.join(target.dir, installedName);
  const { removed, missing } = installer.removeFiles(destDir, entry.files || []);
  log.info(`removed ${removed.length} files from ${destDir}`);
  if (missing.length) {
    log.warn(`${missing.length} tracked files were missing on disk:`);
    for (const m of missing) log.warn(`  ${m.rel} (${m.err})`);
  }

  delete m.installed[installedName];
  manifest.writeManifest(target.dir, m);
  log.ok(`removed '${installedName}' from manifest`);
  return 0;
}

module.exports = { run };
