"use strict";

const log = require("../log");
const paths = require("../paths");
const manifest = require("../manifest");
const resolver = require("../resolver");
const addCmd = require("./add");
const removeCmd = require("./remove");

function updateOne(requestedName, target, flags) {
  const before = manifest.readManifest(target.dir);
  const canonical = resolver.canonicalizeName(requestedName);
  const candidates = [requestedName, canonical, ...resolver.legacyNamesFor(canonical)];
  const installedNames = [...new Set(candidates)].filter(
    (candidate) => before.installed[candidate]
  );
  if (installedNames.length === 0) {
    const e = new Error(`'${requestedName}' is not installed at ${target.dir}`);
    e.code = "ENOTFOUND";
    throw e;
  }

  const legacyInstalled = installedNames.filter((installedName) => installedName !== canonical);
  if (legacyInstalled.length === 0) {
    log.info(`updating '${canonical}'…`);
    return addCmd.run({ _: [canonical], flags: { ...flags, force: true } });
  }

  log.info(
    `migrating legacy install${legacyInstalled.length === 1 ? "" : "s"} ` +
      `${legacyInstalled.map((installedName) => `'${installedName}'`).join(", ")} -> '${canonical}'…`
  );
  const canonicalAlreadyInstalled = Boolean(before.installed[canonical]);
  const addCode = addCmd.run({
    _: [canonical],
    flags: {
      ...flags,
      force: canonicalAlreadyInstalled,
      _allowLegacyMigration: true,
    },
  });
  if (addCode !== 0 || flags["dry-run"]) return addCode;

  let lastCode = 0;
  for (const installedName of legacyInstalled) {
    const code = removeCmd.run({ _: [installedName], flags });
    if (code !== 0) lastCode = code;
  }
  return lastCode;
}

function run({ _, flags }) {
  const requestedName = _[0];
  const target = paths.resolveTarget(flags.target);
  const m = manifest.readManifest(target.dir);
  const names = requestedName ? [requestedName] : Object.keys(m.installed);
  if (names.length === 0) {
    log.info(`no skills installed in ${target.dir}; nothing to update`);
    return 0;
  }

  let lastCode = 0;
  const seen = new Set();
  for (const name of names) {
    const canonical = resolver.canonicalizeName(name);
    if (seen.has(canonical)) continue;
    seen.add(canonical);
    const code = updateOne(name, target, flags);
    if (code !== 0) lastCode = code;
  }
  return lastCode;
}

module.exports = { run };
