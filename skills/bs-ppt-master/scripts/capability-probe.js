#!/usr/bin/env node
"use strict";

// Discovery-only inventory for PPT Master. This script never starts an
// application, executes a binary, imports a Skill, or verifies a feature.

const fs = require("fs");
const os = require("os");
const path = require("path");

const REPO_ROOT = path.resolve(__dirname, "../../..");
const WARNING = "Discovery is not capability verification. Validate the current artifact through V4 and V5.";

function usageError(message) {
  process.stderr.write(`${message}\n`);
  process.exit(2);
}

function parseArgs(argv) {
  const options = {
    json: false,
    isolated: false,
    skillRoots: [],
    binRoots: [],
    appRoots: [],
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--json") {
      options.json = true;
      continue;
    }
    if (arg === "--isolated") {
      options.isolated = true;
      continue;
    }

    const target = {
      "--skill-root": "skillRoots",
      "--bin-root": "binRoots",
      "--app-root": "appRoots",
    }[arg];

    if (target) {
      const value = argv[index + 1];
      if (!value || value.startsWith("--")) usageError(`${arg} requires a value`);
      options[target].push(path.resolve(value));
      index += 1;
      continue;
    }

    usageError(`Unknown argument: ${arg}`);
  }

  return options;
}

function unique(values) {
  return [...new Set(values.map((value) => path.resolve(value)))];
}

function executableFile(candidatePath) {
  try {
    const stat = fs.statSync(candidatePath);
    return stat.isFile() && (stat.mode & 0o111) !== 0;
  } catch {
    return false;
  }
}

function existingPath(candidatePath, expectedType) {
  try {
    const stat = fs.statSync(candidatePath);
    if (expectedType === "file") return stat.isFile();
    if (expectedType === "directory") return stat.isDirectory();
    return false;
  } catch {
    return false;
  }
}

function candidate(id, label, evidence) {
  return {
    id,
    label,
    state: evidence.length > 0 ? "DETECTED" : "NOT_FOUND",
    evidence,
  };
}

function buildReport(options) {
  const skillRoots = [...options.skillRoots];
  const binRoots = [...options.binRoots];
  const appRoots = [...options.appRoots];

  if (!options.isolated) {
    skillRoots.push(
      path.join(REPO_ROOT, "external", "anthropic-agent-skills"),
      path.join(os.homedir(), ".agents", "skills"),
      path.join(os.homedir(), ".codex", "skills"),
    );
    for (const entry of (process.env.PATH || "").split(path.delimiter)) {
      if (entry) binRoots.push(entry);
    }
    appRoots.push("/Applications", path.join(os.homedir(), "Applications"));
  }

  const normalizedSkillRoots = unique(skillRoots);
  const normalizedBinRoots = unique(binRoots);
  const normalizedAppRoots = unique(appRoots);

  const pptxEvidence = normalizedSkillRoots
    .map((root) => path.join(root, "pptx", "SKILL.md"))
    .filter((item) => existingPath(item, "file"));

  const sofficeEvidence = normalizedBinRoots
    .map((root) => path.join(root, "soffice"))
    .filter(executableFile);

  const powerpointEvidence = normalizedAppRoots
    .map((root) => path.join(root, "Microsoft PowerPoint.app"))
    .filter((item) => existingPath(item, "directory"));

  const featureSupport = {
    existing_pptx_preservation: "UNVERIFIED",
    native_editable_objects: "UNVERIFIED",
    master_layout_placeholder_preservation: "UNVERIFIED",
    notes_links_animation_media: "UNVERIFIED",
    render_and_package_validation: "UNVERIFIED",
  };

  return {
    schema_version: 1,
    probe_scope: "discovery-only",
    candidates: {
      skills: [candidate("pptx", "External pptx Skill", pptxEvidence)],
      binaries: [candidate("soffice", "LibreOffice command-line candidate", sofficeEvidence)],
      applications: [candidate("microsoft-powerpoint", "Microsoft PowerPoint application", powerpointEvidence)],
    },
    feature_support: featureSupport,
    v5: "UNVERIFIED",
    warning: WARNING,
  };
}

function printHuman(report) {
  process.stdout.write("Discovery-only capability probe\n");
  for (const [groupName, candidates] of Object.entries(report.candidates)) {
    process.stdout.write(`\n${groupName}:\n`);
    for (const item of candidates) {
      process.stdout.write(`- ${item.label}: ${item.state}\n`);
      for (const evidence of item.evidence) process.stdout.write(`  ${evidence}\n`);
    }
  }
  process.stdout.write("\nFeature support: UNVERIFIED\n");
  process.stdout.write("V5 target environment: UNVERIFIED\n");
  process.stdout.write(`${report.warning}\n`);
}

const options = parseArgs(process.argv.slice(2));
const report = buildReport(options);

if (options.json) {
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
} else {
  printHuman(report);
}
