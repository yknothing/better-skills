"use strict";

const fs = require("fs");
const path = require("path");
const log = require("../log");
const resolver = require("../resolver");
const paths = require("../paths");
const manifest = require("../manifest");
const installer = require("../installer");

function run({ _, flags }) {
  const requestedName = _[0];
  if (!requestedName) {
    const e = new Error("add requires a skill name (e.g. `better-skills add bs-social-card`)");
    e.code = "EUSAGE";
    throw e;
  }

  const dryRun = flags["dry-run"] === true;
  const force = flags.force === true;
  const target = paths.resolveTarget(flags.target);

  const src = resolver.resolveSource(requestedName); // throws on bad name / not found
  const name = src.name;
  if (src.aliasUsed) log.warn(`'${requestedName}' is deprecated; using canonical skill ID '${name}'`);
  let absSourceDir = src.absSourceDir;

  // External skills: ensure upstream repo is cached
  if (src.kind === "external") {
    if (!fs.existsSync(absSourceDir) || !fs.existsSync(path.join(absSourceDir, "SKILL.md"))) {
      log.info(`external skill — ensuring source repo is cached…`);
      absSourceDir = installer.ensureExternalCached(
        src.meta.source,
        src.sourceMeta,
        src.meta.upstream_skill || path.basename(src.meta.path || name)
      );
    }
  }

  const destDir = path.join(target.dir, name);
  const m = manifest.readManifest(target.dir);
  const already = Boolean(m.installed[name]);
  const legacyInstalled = resolver
    .legacyNamesFor(name)
    .filter((legacyName) => Boolean(m.installed[legacyName]));
  const dirExistsOnDisk = fs.existsSync(destDir);

  if (legacyInstalled.length > 0 && flags._allowLegacyMigration !== true) {
    const e = new Error(
      `'${name}' has legacy install${legacyInstalled.length === 1 ? "" : "s"} tracked as ` +
        `${legacyInstalled.map((legacyName) => `'${legacyName}'`).join(", ")}; ` +
        `run 'better-skills update ${name}' to migrate without creating duplicate installs`
    );
    e.code = "ECONFLICT";
    throw e;
  }

  if (already && !force) {
    const e = new Error(
      `'${name}' already installed at ${destDir}; use --force to overwrite or 'better-skills update ${name}'`
    );
    e.code = "ECONFLICT";
    throw e;
  }
  if (!already && dirExistsOnDisk && !force) {
    const e = new Error(
      `${destDir} already exists but isn't tracked by better-skills; rerun with --force to overwrite, or remove the directory manually`
    );
    e.code = "ECONFLICT";
    throw e;
  }

  if (dryRun) {
    log.info(`[dry-run] would copy ${absSourceDir} -> ${destDir}`);
    const files = installer.copyTree(absSourceDir, destDir, { dryRun: true });
    for (const f of files) process.stdout.write(`  + ${f}\n`);
    log.info(`[dry-run] would update manifest at ${manifest.manifestPath(target.dir)}`);
    return 0;
  }

  // VALIDATE SOURCE BEFORE TOUCHING ANYTHING — never delete tracked files
  // until we know the source is reachable and copyable. Otherwise an `update`
  // against a missing source would leave the install half-erased with no
  // way for the user to recover via the CLI.
  installer.ensureSourceExists(absSourceDir);

  // If overwriting via --force and we have a manifest entry, remove tracked files first
  if (force && already) {
    const entry = m.installed[name];
    log.info(`--force: removing previous install of '${name}'`);
    installer.removeFiles(destDir, entry.files || []);
  } else if (force && dirExistsOnDisk) {
    // Untracked dir + --force: refuse to recursively delete; ask user to remove manually.
    // This is a deliberate safety net — `--force` does NOT mean "rm -rf arbitrary directories".
    const e = new Error(
      `--force can only overwrite tracked installs. ${destDir} exists but isn't in the manifest. ` +
        `Remove it manually first.`
    );
    e.code = "ECONFLICT";
    throw e;
  }

  log.info(`copying ${absSourceDir} -> ${destDir}`);
  // Track whether destDir existed before this call — if not, we own cleanup on failure.
  const ownedDestDir = !fs.existsSync(destDir);
  let files;
  try {
    files = installer.copyTree(absSourceDir, destDir);
  } catch (e) {
    // Rollback: remove the partial install we own so the user can retry cleanly.
    if (ownedDestDir && fs.existsSync(destDir)) {
      try {
        fs.rmSync(destDir, { recursive: true, force: true });
      } catch (_) {
        // best-effort rollback
      }
    }
    throw e;
  }
  log.ok(`copied ${files.length} files`);

  // Compute repo-relative `from` for self-developed skills, or "<source>/<name>" for external
  let fromDescriptor;
  if (src.kind === "self-developed") {
    fromDescriptor = path.relative(paths.repoRoot(), src.absSourceDir).split(path.sep).join("/");
  } else {
    fromDescriptor = `external:${src.meta.source}/${src.meta.upstream_skill || name}`;
  }

  m.installed[name] = {
    source: src.kind,
    from: fromDescriptor,
    installed_at: new Date().toISOString(),
    method: "copy",
    files,
  };
  manifest.writeManifest(target.dir, m);
  log.ok(`updated manifest at ${manifest.manifestPath(target.dir)}`);
  log.ok(`installed '${name}' to ${destDir}`);
  return 0;
}

module.exports = { run };
