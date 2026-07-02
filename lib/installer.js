// Copy a skill source tree into a target dir, with sandbox enforcement.
"use strict";

const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");
const os = require("os");

// Skip these patterns when copying — node_modules, VCS dirs, OS clutter.
const SKIP_NAMES = new Set([
  "node_modules",
  ".git",
  ".DS_Store",
  ".idea",
  ".vscode",
  ".cache",
]);
// Files that always get filtered.
const SKIP_FILES = new Set([".DS_Store", "Thumbs.db"]);

function listRecursive(rootDir) {
  const realRoot = fs.realpathSync(rootDir);
  const out = [];
  const stack = [""];
  while (stack.length) {
    const rel = stack.pop();
    const abs = path.join(rootDir, rel);
    const stat = fs.lstatSync(abs);
    if (stat.isSymbolicLink()) {
      // For file symlinks, the link's REAL target must stay inside the
      // source root — otherwise a malicious skill could exfiltrate
      // arbitrary files (e.g. a symlink to /etc/passwd) into the install dir.
      let realTarget;
      try {
        realTarget = fs.realpathSync(abs);
      } catch (e) {
        // Broken symlink — skip silently
        continue;
      }
      if (
        realTarget !== realRoot &&
        !realTarget.startsWith(realRoot + path.sep)
      ) {
        const err = new Error(
          `unsafe symlink in source: ${rel} resolves to ${realTarget} (outside ${realRoot})`
        );
        err.code = "EINTEGRITY";
        throw err;
      }
      const realStat = fs.statSync(abs);
      if (realStat.isFile()) out.push({ rel, kind: "file" });
      // Symlinks to directories: skip — never recurse outside the tree
      continue;
    }
    if (stat.isDirectory()) {
      const entries = fs.readdirSync(abs);
      for (const e of entries) {
        if (SKIP_NAMES.has(e)) continue;
        if (SKIP_FILES.has(e)) continue;
        stack.push(path.join(rel, e));
      }
    } else if (stat.isFile()) {
      if (SKIP_FILES.has(path.basename(rel))) continue;
      out.push({ rel, kind: "file" });
    }
  }
  return out;
}

// Sandbox check: every write must be within destDir.
function safeJoin(destDir, rel) {
  if (typeof rel !== "string" || rel === "" || rel === "." || rel === "..") {
    const e = new Error(`refusing to operate on rel path: ${JSON.stringify(rel)}`);
    e.code = "EUSAGE";
    throw e;
  }
  const resolved = path.resolve(destDir, rel);
  const base = path.resolve(destDir) + path.sep;
  if (resolved !== path.resolve(destDir) && !resolved.startsWith(base)) {
    const e = new Error(
      `path-traversal blocked: '${rel}' resolves outside ${destDir}`
    );
    e.code = "EUSAGE";
    throw e;
  }
  return resolved;
}

function ensureSourceExists(absSourceDir) {
  if (!fs.existsSync(absSourceDir) || !fs.statSync(absSourceDir).isDirectory()) {
    const e = new Error(`source path not found or not a directory: ${absSourceDir}`);
    e.code = "EINTEGRITY";
    throw e;
  }
  // Sanity: SKILL.md must exist
  if (!fs.existsSync(path.join(absSourceDir, "SKILL.md"))) {
    const e = new Error(`source missing SKILL.md: ${absSourceDir}`);
    e.code = "EINTEGRITY";
    throw e;
  }
}

// Returns the list of relative file paths copied.
function copyTree(absSourceDir, destDir, { dryRun = false } = {}) {
  ensureSourceExists(absSourceDir);
  const files = listRecursive(absSourceDir);
  if (!dryRun) {
    try {
      fs.mkdirSync(destDir, { recursive: true });
    } catch (e) {
      if (e.code === "EACCES" || e.code === "EPERM" || e.code === "ENOENT" || e.code === "EROFS") {
        const err = new Error(
          `cannot create target directory ${destDir}: ${e.message}. ` +
            `check that the path is writable and on a mounted filesystem.`
        );
        err.code = "EINTEGRITY";
        throw err;
      }
      throw e;
    }
  }

  for (const f of files) {
    const src = path.join(absSourceDir, f.rel);
    const dst = safeJoin(destDir, f.rel);
    if (!dryRun) {
      fs.mkdirSync(path.dirname(dst), { recursive: true });
      fs.copyFileSync(src, dst);
      // Preserve mode for executable scripts
      try {
        const m = fs.statSync(src).mode;
        fs.chmodSync(dst, m & 0o777);
      } catch (_) {
        // best-effort
      }
    }
  }
  return files.map((f) => f.rel.split(path.sep).join("/")).sort();
}

// Remove a list of relative files from a dir, then prune empty dirs bottom-up.
function removeFiles(destDir, relFiles) {
  const removed = [];
  const missing = [];
  for (const rel of relFiles) {
    const abs = safeJoin(destDir, rel);
    if (fs.existsSync(abs)) {
      try {
        fs.unlinkSync(abs);
        removed.push(rel);
      } catch (e) {
        missing.push({ rel, err: e.message });
      }
    } else {
      missing.push({ rel, err: "not found" });
    }
  }
  // Prune empty dirs bottom-up — collect all parent dirs, sort by depth desc.
  const dirs = new Set();
  for (const rel of relFiles) {
    let d = path.dirname(rel);
    while (d && d !== "." && d !== path.sep) {
      dirs.add(d);
      d = path.dirname(d);
    }
  }
  const sortedDirs = [...dirs].sort(
    (a, b) => b.split(path.sep).length - a.split(path.sep).length
  );
  for (const d of sortedDirs) {
    const abs = safeJoin(destDir, d);
    try {
      if (fs.existsSync(abs)) {
        const remaining = fs.readdirSync(abs);
        if (remaining.length === 0) fs.rmdirSync(abs);
      }
    } catch (_) {
      // best-effort
    }
  }
  // Remove the skill's own dir if empty
  try {
    if (fs.existsSync(destDir) && fs.readdirSync(destDir).length === 0) {
      fs.rmdirSync(destDir);
    }
  } catch (_) {
    // best-effort
  }
  return { removed, missing };
}

// Ensure an external skill's source repo is cached locally.
// On miss, runs `git clone --depth 1 --branch <ref> <repo>` into ~/.cache/better-skills/<sourceName>/.
// Returns the absolute path to the cached source repo's <skill> dir, or throws if anything fails.
//
// Path resolution:
//   - skills_path: "skills" + skill: "foo"  ->  cacheDir/skills/foo   (standard layout)
//   - skills_path: "."          + skill: any   ->  cacheDir              (repo IS the skill, root-level SKILL.md)
function ensureExternalCached(sourceName, sourceMeta, skillName) {
  if (!sourceMeta || !sourceMeta.repo) {
    const e = new Error(
      `external source '${sourceName}' missing repo metadata in external/sources.yaml`
    );
    e.code = "EINTEGRITY";
    throw e;
  }
  const cacheRoot = path.join(os.homedir(), ".cache", "better-skills");
  const cacheDir = path.join(cacheRoot, sourceName);
  fs.mkdirSync(cacheRoot, { recursive: true });

  const ref = sourceMeta.ref || "main";
  const skillsPath = sourceMeta.skills_path || "skills";
  // skills_path: "." means the repo root IS the skill directory (single-skill repos
  // like koganei/learn-anything-skill where SKILL.md lives at the repo root).
  const isRootLevelSkill = skillsPath === ".";
  const targetSkillDir = isRootLevelSkill
    ? cacheDir
    : path.join(cacheDir, skillsPath, skillName);

  if (!fs.existsSync(cacheDir)) {
    try {
      execFileSync(
        "git",
        ["clone", "--depth", "1", "--branch", ref, sourceMeta.repo, cacheDir],
        { stdio: "pipe" }
      );
    } catch (e) {
      const err = new Error(
        `git clone failed for ${sourceMeta.repo}: ${e.stderr ? e.stderr.toString() : e.message}`
      );
      err.code = "EINTEGRITY";
      throw err;
    }
  }

  if (!fs.existsSync(targetSkillDir)) {
    const e = new Error(
      `skill '${skillName}' not found in cached source at ${targetSkillDir} (after clone of ${sourceMeta.repo})`
    );
    e.code = "EINTEGRITY";
    throw e;
  }
  return targetSkillDir;
}

module.exports = {
  copyTree,
  removeFiles,
  ensureSourceExists,
  ensureExternalCached,
  safeJoin,
};
