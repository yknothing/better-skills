// Manifest read/write — single .better-skills.json per target dir.
// All writes are atomic via temp + rename.
"use strict";

const fs = require("fs");
const path = require("path");

const MANIFEST_NAME = ".better-skills.json";
const SCHEMA_VERSION = "0.2.0-dev";

function manifestPath(targetDir) {
  return path.join(targetDir, MANIFEST_NAME);
}

function readManifest(targetDir) {
  const p = manifestPath(targetDir);
  if (!fs.existsSync(p)) {
    return {
      version: SCHEMA_VERSION,
      updated_at: null,
      installed: {},
    };
  }
  let raw;
  try {
    raw = fs.readFileSync(p, "utf8");
  } catch (e) {
    const err = new Error(`cannot read manifest at ${p}: ${e.message}`);
    err.code = "EINTEGRITY";
    throw err;
  }
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (e) {
    const err = new Error(`manifest is not valid JSON at ${p}: ${e.message}`);
    err.code = "EINTEGRITY";
    throw err;
  }
  if (!parsed || typeof parsed !== "object" || !parsed.installed) {
    const err = new Error(`manifest missing 'installed' field at ${p}`);
    err.code = "EINTEGRITY";
    throw err;
  }
  return parsed;
}

function writeManifest(targetDir, manifest) {
  fs.mkdirSync(targetDir, { recursive: true });
  const p = manifestPath(targetDir);
  const tmp = p + ".tmp";
  const out = {
    version: manifest.version || SCHEMA_VERSION,
    updated_at: new Date().toISOString(),
    installed: manifest.installed || {},
  };
  fs.writeFileSync(tmp, JSON.stringify(out, null, 2) + "\n", "utf8");
  fs.renameSync(tmp, p);
  return out;
}

module.exports = { readManifest, writeManifest, manifestPath, MANIFEST_NAME };
