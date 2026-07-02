// Resolve a target spec ("claude" | "codex" | "cursor" | absolute path) → directory.
"use strict";

const os = require("os");
const path = require("path");

const PRESETS = {
  claude: () => path.join(os.homedir(), ".claude", "skills"),
  codex: () => path.join(os.homedir(), ".agents", "skills"),
  cursor: () => path.join(os.homedir(), ".cursor", "skills"),
};

function resolveTarget(targetArg) {
  // Treat empty/null/undefined as "use default", but a non-string value is a usage error.
  let raw = targetArg;
  if (raw === undefined || raw === null || raw === "") raw = "claude";
  if (typeof raw !== "string") {
    const e = new Error(`--target must be a string; got ${typeof raw}`);
    e.code = "EUSAGE";
    throw e;
  }
  const t = raw.trim();
  if (PRESETS[t]) {
    return { kind: t, dir: PRESETS[t]() };
  }
  // Treat as path — must be absolute, no ".." segments after normalization.
  if (!path.isAbsolute(t)) {
    const e = new Error(
      `--target must be one of [claude|codex|cursor] or an ABSOLUTE path; got: ${t}`
    );
    e.code = "EUSAGE";
    throw e;
  }
  // Reject if the *input* contains '..' segments — even if normalize would
  // collapse them, the intent is suspect and the explicit form is safer.
  if (t.split(/[\\/]/).includes("..")) {
    const e = new Error(`--target contains '..' segment: ${t}`);
    e.code = "EUSAGE";
    throw e;
  }
  const normalized = path.normalize(t);
  return { kind: "custom", dir: normalized };
}

// Where the better-skills repo lives — i.e. the package install root.
function repoRoot() {
  return path.resolve(__dirname, "..");
}

module.exports = { resolveTarget, repoRoot, PRESETS };
