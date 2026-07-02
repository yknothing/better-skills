// Resolve a skill name to its source location.
// Reads skills.json (and external/sources.yaml for external repo metadata).
"use strict";

const fs = require("fs");
const path = require("path");
const { repoRoot } = require("./paths");
const yaml = require("./yaml");

const NAME_RE = /^[a-z][a-z0-9-]*$/;

function isValidName(name) {
  return typeof name === "string" && NAME_RE.test(name) && name.length <= 64;
}

function loadRegistry() {
  const root = repoRoot();
  const skillsJsonPath = path.join(root, "skills.json");
  if (!fs.existsSync(skillsJsonPath)) {
    const e = new Error(`registry not found: ${skillsJsonPath}`);
    e.code = "EINTEGRITY";
    throw e;
  }
  let skillsJson;
  try {
    skillsJson = JSON.parse(fs.readFileSync(skillsJsonPath, "utf8"));
  } catch (e) {
    const err = new Error(
      `registry is not valid JSON at ${skillsJsonPath}: ${e.message}`
    );
    err.code = "EINTEGRITY";
    throw err;
  }

  const sourcesYamlPath = path.join(root, "external", "sources.yaml");
  let sources = { sources: {} };
  if (fs.existsSync(sourcesYamlPath)) {
    try {
      sources = yaml.parseFile(sourcesYamlPath);
    } catch (e) {
      const err = new Error(
        `external/sources.yaml is malformed: ${e.message}`
      );
      err.code = "EINTEGRITY";
      throw err;
    }
  }

  return { root, skillsJson, sources };
}

// Returns { name, kind: "self-developed" | "external", absSourceDir, meta }
// Throws ENOTFOUND if name not registered.
function resolveSource(name) {
  if (!isValidName(name)) {
    const e = new Error(
      `invalid skill name: ${JSON.stringify(name)} (must match /^[a-z][a-z0-9-]*$/)`
    );
    e.code = "EUSAGE";
    throw e;
  }

  const { root, skillsJson, sources } = loadRegistry();

  const self = skillsJson.skills?.["self-developed"]?.[name];
  if (self) {
    const skillRel = self.path
      ? path.dirname(self.path)
      : path.join("skills", name);
    const absSourceDir = path.resolve(root, skillRel);
    return {
      name,
      kind: "self-developed",
      absSourceDir,
      meta: self,
    };
  }

  const ext = skillsJson.skills?.external?.[name];
  if (ext) {
    const skillRel = ext.path || path.join("external", ext.source, name);
    const absSourceDir = path.resolve(root, skillRel);
    const sourceMeta = sources.sources?.[ext.source];
    return {
      name,
      kind: "external",
      absSourceDir,
      meta: ext,
      sourceMeta: sourceMeta || null,
    };
  }

  const all = listAll(skillsJson);
  const e = new Error(
    `skill not found in registry: ${name}\nknown skills: ${all.join(", ")}`
  );
  e.code = "ENOTFOUND";
  throw e;
}

function listAll(skillsJson) {
  const j = skillsJson || loadRegistry().skillsJson;
  return [
    ...Object.keys(j.skills?.["self-developed"] || {}),
    ...Object.keys(j.skills?.external || {}),
  ].sort();
}

function listDetailed() {
  const { skillsJson } = loadRegistry();
  const out = [];
  for (const [name, meta] of Object.entries(
    skillsJson.skills?.["self-developed"] || {}
  )) {
    out.push({
      name,
      kind: "self-developed",
      tier: meta.tier,
      batch: meta.batch,
      status: meta.status,
    });
  }
  for (const [name, meta] of Object.entries(skillsJson.skills?.external || {})) {
    out.push({
      name,
      kind: "external",
      source: meta.source,
      batch: meta.batch,
      status: meta.status,
    });
  }
  return out.sort((a, b) => a.name.localeCompare(b.name));
}

module.exports = { resolveSource, listAll, listDetailed, isValidName };
