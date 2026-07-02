"use strict";

const path = require("path");
const { spawnSync } = require("child_process");
const log = require("../log");
const resolver = require("../resolver");
const paths = require("../paths");

function run({ _, flags }) {
  const name = _[0];
  if (!name) {
    const e = new Error("validate requires a skill name");
    e.code = "EUSAGE";
    throw e;
  }
  const src = resolver.resolveSource(name);
  if (src.kind === "external") {
    log.warn(`'${name}' is an external skill — Gate 1 validation only applies to self-developed skills`);
    return 0;
  }

  const validateScript = path.join(paths.repoRoot(), "tools", "validate.js");
  if (!require("fs").existsSync(validateScript)) {
    const e = new Error(`validate.js not found at ${validateScript}`);
    e.code = "EINTEGRITY";
    throw e;
  }

  const result = spawnSync("node", [validateScript, "--json", src.absSourceDir], {
    encoding: "utf-8",
  });

  if (result.error) throw result.error;

  let report;
  try {
    report = JSON.parse(result.stdout || "{}");
  } catch (e) {
    log.err(`validate.js produced invalid JSON: ${e.message}`);
    return 1;
  }

  // Forward the human-readable output
  const hr = spawnSync("node", [validateScript, src.absSourceDir], { encoding: "utf-8" });
  if (hr.stdout) process.stdout.write(hr.stdout);

  return report.exit_code !== undefined ? report.exit_code : (result.status || 1);
}

module.exports = { run };
