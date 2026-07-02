#!/usr/bin/env node
// Gate 4: Baseline Test runner — minimum-viable, deterministic, zero deps.
//
// What this does (Round 1 scope):
//   1. Loads evaluation/datasets/batch-1-test-prompts.json
//   2. For each skill, runs `node tools/validate.js --json` (Gate 1)
//   3. Validates that test prompts have id/name/prompt/expected_behavior
//   4. Outputs a pass/fail summary, optionally as JSON
//
// What this DOES NOT do (deferred to Round 2/3 if requested):
//   - Spawn agents (no codex / no claude programmatic invocation here)
//   - Compute SHS scores or 5-dimension breakdowns
//   - Generate LLM-judge prompts (--with-llm-judge is documented as deferred)
//   - A/B test comparison (--ab-test is documented as deferred)
//
// Usage:
//   node evaluation/harness/runner.js                  # all skills in dataset
//   node evaluation/harness/runner.js --skill <name>   # one skill
//   node evaluation/harness/runner.js --json           # machine-readable output
//
// Exit codes: 0=all skills pass, 1=at least one skill fails, 2=usage error,
//             3=skill named via --skill not found in dataset,
//             5=integrity (dataset / skill dir / validate.js missing)
"use strict";

const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const REPO_ROOT = path.resolve(__dirname, "../..");
const DATASET_PATH = path.join(REPO_ROOT, "evaluation/datasets/batch-1-test-prompts.json");
const VALIDATE_JS = path.join(REPO_ROOT, "tools/validate.js");
const SKILLS_DIR = path.join(REPO_ROOT, "skills");

const REQUIRED_EVAL_FIELDS = ["id", "name", "prompt", "expected_behavior"];
const EXPECTED_EVAL_TYPES = ["happy", "edge", "adversarial"];

// ---------------------------------------------------------------------------
// Loaders
// ---------------------------------------------------------------------------

function loadDataset() {
  if (!fs.existsSync(DATASET_PATH)) {
    const e = new Error(`dataset not found: ${DATASET_PATH}`);
    e.code = "EINTEGRITY";
    throw e;
  }
  let data;
  try {
    data = JSON.parse(fs.readFileSync(DATASET_PATH, "utf-8"));
  } catch (parseErr) {
    const e = new Error(`dataset is not valid JSON: ${parseErr.message}`);
    e.code = "EINTEGRITY";
    throw e;
  }
  if (!data || typeof data !== "object" || !data.skills) {
    const e = new Error(`dataset missing top-level 'skills' object`);
    e.code = "EINTEGRITY";
    throw e;
  }
  return data;
}

// ---------------------------------------------------------------------------
// Graders
// ---------------------------------------------------------------------------

function gradeGate1(skillName) {
  const skillDir = path.join(SKILLS_DIR, skillName);
  if (!fs.existsSync(skillDir)) {
    return {
      grader: "gate1",
      passed: false,
      score: 0,
      detail: `skill directory not found: ${skillDir}`,
    };
  }

  const result = spawnSync("node", [VALIDATE_JS, "--json", skillDir], {
    encoding: "utf-8",
    maxBuffer: 8 * 1024 * 1024,
  });

  // A child killed by signal returns { error: null, status: null, signal: "SIGTERM" }
  // or similar. Treat this as a hard failure — without the explicit check, the
  // empty stdout parses as `{}`, total=0, and `passed===0` evaluates true. That
  // would let a crashed validator masquerade as a clean Gate 1 pass.
  if (result.error || result.signal !== null || result.status === null) {
    return {
      grader: "gate1",
      passed: false,
      score: 0,
      detail: result.error
        ? `validate.js failed to execute: ${result.error.message}`
        : `validate.js terminated abnormally (signal=${result.signal}, status=${result.status})`,
    };
  }

  let report;
  try {
    report = JSON.parse(result.stdout || "{}");
  } catch (e) {
    return {
      grader: "gate1",
      passed: false,
      score: 0,
      detail: `validate.js produced invalid JSON: ${e.message}`,
    };
  }

  if (report.error) {
    return {
      grader: "gate1",
      passed: false,
      score: 0,
      detail: report.error,
    };
  }

  const total = (report.passed || 0) + (report.failed || 0) + (report.warned || 0);
  const score = total > 0 ? Math.round(((report.passed || 0) / total) * 100) : 0;

  return {
    grader: "gate1",
    passed: (report.failed || 0) === 0,
    score,
    detail: `${report.passed || 0} passed, ${report.failed || 0} failed, ${report.warned || 0} warned`,
    raw: { passed: report.passed, failed: report.failed, warned: report.warned },
  };
}

function gradeTestPromptStructure(evals) {
  if (!Array.isArray(evals) || evals.length === 0) {
    return {
      grader: "test-prompt-structure",
      passed: false,
      score: 0,
      detail: "no evals defined",
    };
  }

  const issues = [];
  for (const e of evals) {
    for (const f of REQUIRED_EVAL_FIELDS) {
      if (!e[f] || typeof e[f] !== "string" || e[f].trim() === "") {
        issues.push(`${e.id || "<unnamed>"}: missing field '${f}'`);
      }
    }
  }

  const total = evals.length * REQUIRED_EVAL_FIELDS.length;
  const score = total > 0 ? Math.round(((total - issues.length) / total) * 100) : 0;

  return {
    grader: "test-prompt-structure",
    passed: issues.length === 0,
    score,
    detail: issues.length === 0
      ? `${evals.length} eval(s), all fields present`
      : `${issues.length} structural issue(s): ${issues.slice(0, 3).join("; ")}${issues.length > 3 ? " ..." : ""}`,
  };
}

function gradeTestPromptCompleteness(evals) {
  if (!Array.isArray(evals) || evals.length === 0) {
    return {
      grader: "test-prompt-completeness",
      passed: false,
      score: 0,
      detail: "no evals defined",
    };
  }

  // Detect each eval type by id suffix or name keywords. Use word-boundary
  // matching to avoid "unhappy" → "happy" / "hedge" → "edge" false positives.
  const present = new Set();
  for (const e of evals) {
    const id = (e.id || "").toLowerCase();
    const name = (e.name || "").toLowerCase();
    for (const t of EXPECTED_EVAL_TYPES) {
      const re = new RegExp(`(^|[^a-z])${t}([^a-z]|$)`);
      if (re.test(id) || re.test(name)) present.add(t);
    }
  }

  const missing = EXPECTED_EVAL_TYPES.filter(t => !present.has(t));
  const score = Math.round((present.size / EXPECTED_EVAL_TYPES.length) * 100);

  return {
    grader: "test-prompt-completeness",
    passed: missing.length === 0,
    score,
    detail: missing.length === 0
      ? `covers all 3 types (happy/edge/adversarial)`
      : `missing types: ${missing.join(", ")}`,
  };
}

// ---------------------------------------------------------------------------
// Per-skill orchestration
// ---------------------------------------------------------------------------

function gradeSkill(skillName, skillData) {
  const evals = skillData.evals || [];
  const grades = [
    gradeGate1(skillName),
    gradeTestPromptStructure(evals),
    gradeTestPromptCompleteness(evals),
  ];
  const passed = grades.every(g => g.passed);
  const avgScore = Math.round(grades.reduce((sum, g) => sum + g.score, 0) / grades.length);
  return {
    skill: skillName,
    tier: skillData.tier || "unknown",
    eval_count: evals.length,
    passed,
    avg_score: avgScore,
    grades,
  };
}

// ---------------------------------------------------------------------------
// Output
// ---------------------------------------------------------------------------

const { COLORS, color } = require("../../lib/term");

function formatHuman(report) {
  // Guard exported function — main() always passes a well-formed report,
  // but downstream consumers importing this module deserve a clear error
  // rather than a TypeError on `.length` of undefined.
  if (!report || !Array.isArray(report.skills)) {
    return "Error: invalid report — missing 'skills' array";
  }

  const lines = [];
  lines.push(color(COLORS.bold, "=== Gate 4: Baseline Test ==="));
  lines.push(`Dataset:        ${path.relative(REPO_ROOT, DATASET_PATH)}`);
  lines.push(`Skills tested:  ${report.skills.length}`);
  lines.push("");

  for (const s of report.skills) {
    const status = s.passed
      ? color(COLORS.green, "PASS")
      : color(COLORS.red, "FAIL");
    lines.push(`${status}  ${color(COLORS.bold, s.skill)}  (tier=${s.tier}, evals=${s.eval_count}, score=${s.avg_score})`);
    for (const g of s.grades) {
      const gstatus = g.passed ? color(COLORS.green, "  ✓") : color(COLORS.red, "  ✗");
      lines.push(`${gstatus} ${g.grader.padEnd(28)} score=${String(g.score).padStart(3)}  ${color(COLORS.dim, g.detail)}`);
    }
    lines.push("");
  }

  const passCount = report.skills.filter(s => s.passed).length;
  const failCount = report.skills.length - passCount;
  const summary = failCount === 0
    ? color(COLORS.green, `=== Result: ${passCount}/${report.skills.length} skills passed ===`)
    : color(COLORS.red, `=== Result: ${passCount}/${report.skills.length} skills passed, ${failCount} failed ===`);
  lines.push(summary);

  return lines.join("\n");
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

function parseArgs(argv) {
  const out = { skill: null, json: false, help: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--skill") {
      out.skill = argv[++i];
      if (!out.skill || out.skill.startsWith("--")) {
        const e = new Error("--skill requires a value");
        e.code = "EUSAGE";
        throw e;
      }
    } else if (a === "--json") {
      out.json = true;
    } else if (a === "--help" || a === "-h") {
      out.help = true;
    } else if (a === "--with-llm-judge") {
      // Documented but deferred. Print clear stderr message and exit 0.
      out.deferred = "--with-llm-judge is deferred to Round 3 (no LLM execution in Round 1)";
    } else if (a === "--ab-test") {
      out.deferred = "--ab-test is deferred to Round 3 (no A/B comparison in Round 1)";
    } else if (a.startsWith("--")) {
      const e = new Error(`unknown flag: ${a}`);
      e.code = "EUSAGE";
      throw e;
    }
  }
  return out;
}

function printHelp() {
  console.log("Usage: node evaluation/harness/runner.js [--skill <name>] [--json]");
  console.log("");
  console.log("Gate 4: Baseline Test for Agent Skills (Round 1 scope).");
  console.log("Runs Gate 1 validation + test-prompt structure checks for each skill.");
  console.log("");
  console.log("Options:");
  console.log("  --skill <name>     Run on one skill only (default: all skills in dataset)");
  console.log("  --json             Machine-readable JSON output");
  console.log("  --with-llm-judge   (deferred — no LLM execution in Round 1)");
  console.log("  --ab-test          (deferred — no A/B comparison in Round 1)");
  console.log("  --help             Show this help");
  console.log("");
  console.log("Exit codes: 0=all pass, 1=at least one fail, 2=usage error,");
  console.log("            3=skill not found in dataset, 5=integrity error");
}

function main(argv) {
  let args;
  try {
    args = parseArgs(argv);
  } catch (e) {
    if (e.code === "EUSAGE") {
      console.error(`runner: ${e.message}`);
      printHelp();
      return 2;
    }
    throw e;
  }

  if (args.help) {
    printHelp();
    return 0;
  }

  if (args.deferred) {
    console.error(`runner: ${args.deferred}`);
    return 2;
  }

  // Integrity checks
  if (!fs.existsSync(VALIDATE_JS)) {
    console.error(`runner: validate.js not found at ${VALIDATE_JS}`);
    return 5;
  }

  let dataset;
  try {
    dataset = loadDataset();
  } catch (e) {
    if (e.code === "EINTEGRITY") {
      console.error(`runner: ${e.message}`);
      return 5;
    }
    throw e;
  }

  // Determine which skills to run
  let skillNames = Object.keys(dataset.skills);
  if (args.skill) {
    if (!dataset.skills[args.skill]) {
      console.error(`runner: skill '${args.skill}' not found in dataset`);
      console.error(`available: ${skillNames.join(", ")}`);
      return 3;
    }
    skillNames = [args.skill];
  }

  // Grade each skill
  const skillReports = skillNames.map(name => gradeSkill(name, dataset.skills[name]));

  const report = {
    dataset: path.relative(REPO_ROOT, DATASET_PATH),
    timestamp: "deterministic-run", // placeholder; no runtime timestamps for reproducibility
    skills: skillReports,
    summary: {
      total: skillReports.length,
      passed: skillReports.filter(s => s.passed).length,
      failed: skillReports.filter(s => !s.passed).length,
    },
  };

  if (args.json) {
    console.log(JSON.stringify(report, null, 2));
  } else {
    console.log(formatHuman(report));
  }

  return report.summary.failed > 0 ? 1 : 0;
}

if (require.main === module) {
  const code = main(process.argv.slice(2));
  process.exit(typeof code === "number" ? code : 1);
}

module.exports = {
  loadDataset,
  gradeSkill,
  gradeGate1,
  gradeTestPromptStructure,
  gradeTestPromptCompleteness,
  formatHuman,
};
