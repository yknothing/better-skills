/**
 * Skill Evaluation Harness
 *
 * Automated evaluation pipeline for Agent Skills.
 * Runs skill prompts, captures traces, applies deterministic and LLM-as-judge graders,
 * and produces dimension scores and comparison reports.
 *
 * Usage:
 *   node evaluation/harness/runner.js --skill setup-demo-app --dataset datasets/setup-demo-app/prompts.csv
 *   node evaluation/harness/runner.js --skill setup-demo-app --ab-test experiments/setup-demo-app/experiment.yaml
 */

const fs = require("fs");
const path = require("path");
const { spawnSync, execSync } = require("child_process");
const { parseArgs } = require("util");

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const ROOT = path.resolve(__dirname, "../..");
const EVAL_DIR = path.resolve(__dirname, "..");
const DATASETS_DIR = path.join(EVAL_DIR, "datasets");
const RESULTS_DIR = path.join(EVAL_DIR, "results");
const EXPERIMENTS_DIR = path.join(EVAL_DIR, "experiments");

// ---------------------------------------------------------------------------
// Dataset Loading
// ---------------------------------------------------------------------------

/**
 * Load eval prompts from a CSV file.
 * Expected columns: id, should_trigger, prompt, expected_artifacts, constraints
 */
function loadDataset(csvPath) {
  const content = fs.readFileSync(csvPath, "utf-8");
  const lines = content.trim().split("\n");
  const headers = lines[0].split(",").map((h) => h.trim());

  return lines.slice(1).map((line) => {
    // Handle quoted fields that may contain commas
    const values = [];
    let current = "";
    let inQuotes = false;
    for (const ch of line) {
      if (ch === '"') {
        inQuotes = !inQuotes;
      } else if (ch === "," && !inQuotes) {
        values.push(current.trim());
        current = "";
      } else {
        current += ch;
      }
    }
    values.push(current.trim());

    const row = {};
    headers.forEach((h, i) => {
      row[h] = values[i] || "";
    });
    return row;
  });
}

// ---------------------------------------------------------------------------
// Agent Runner
// ---------------------------------------------------------------------------

/**
 * Run an agent with a given prompt using codex exec --json.
 * Returns the parsed JSONL trace events and execution metadata.
 */
function runAgent(prompt, options = {}) {
  const {
    skillPath = null,
    outputDir = null,
    timeoutMs = 300000,
    runId = `run-${Date.now()}`,
  } = options;

  const workDir = outputDir || path.join(RESULTS_DIR, "runs", runId);
  fs.mkdirSync(workDir, { recursive: true });

  // Build the prompt -- if skillPath is provided, prepend explicit invocation
  let fullPrompt = prompt;
  if (skillPath) {
    const skillName = path.basename(skillPath);
    fullPrompt = `Use the ${skillName} skill to: ${prompt}`;
  }

  const startTime = Date.now();
  let stdout = "";
  let stderr = "";
  let exitCode = -1;

  try {
    // Try codex exec first; fall back to simulated runs for development
    const result = spawnSync(
      "codex",
      [
        "exec",
        "--json",
        "--full-auto",
        "--output-dir",
        workDir,
        fullPrompt,
      ],
      {
        encoding: "utf-8",
        timeout: timeoutMs,
        maxBuffer: 50 * 1024 * 1024, // 50MB
        env: { ...process.env },
      }
    );

    stdout = result.stdout || "";
    stderr = result.stderr || "";
    exitCode = result.status ?? (result.error ? -1 : 0);
  } catch (err) {
    stderr = err.message;
    exitCode = -1;
  }

  const endTime = Date.now();
  const tracePath = path.join(workDir, "trace.jsonl");
  fs.writeFileSync(tracePath, stdout, "utf-8");

  // Parse JSONL events
  const events = stdout
    .split("\n")
    .filter(Boolean)
    .map((line) => {
      try {
        return JSON.parse(line);
      } catch {
        return { raw: line, parse_error: true };
      }
    });

  return {
    runId,
    prompt: fullPrompt,
    workDir,
    tracePath,
    events,
    exitCode,
    stderr,
    durationMs: endTime - startTime,
  };
}

// ---------------------------------------------------------------------------
// Deterministic Graders
// ---------------------------------------------------------------------------

/**
 * Check if the skill was invoked by looking for skill-load events in the trace.
 */
function checkSkillInvoked(run, skillName) {
  return run.events.some(
    (e) =>
      e.type === "skill.loaded" ||
      (e.type === "item.completed" &&
        e.item?.type === "skill_load" &&
        e.item?.skill_name === skillName) ||
      // Heuristic: check if SKILL.md content appears in any system message
      run.events.some(
        (ev) =>
          ev.type === "system_message" &&
          typeof ev.content === "string" &&
          ev.content.includes(skillName)
      )
  );
}

/**
 * Check if specific commands were executed.
 */
function checkCommandsExecuted(run, expectedCommands) {
  if (!expectedCommands || expectedCommands.length === 0) return { pass: true, found: [], missing: [] };

  const executedCommands = run.events
    .filter(
      (e) =>
        e.type === "item.completed" &&
        (e.item?.type === "command_execution" || e.item?.type === "tool_use") &&
        typeof e.item?.command === "string"
    )
    .map((e) => e.item.command);

  const found = [];
  const missing = [];

  for (const expected of expectedCommands) {
    const match = executedCommands.some((cmd) => cmd.includes(expected));
    if (match) {
      found.push(expected);
    } else {
      missing.push(expected);
    }
  }

  return { pass: missing.length === 0, found, missing };
}

/**
 * Check if expected files exist in the output directory.
 */
function checkFilesExist(run, expectedFiles) {
  if (!expectedFiles || expectedFiles.length === 0) return { pass: true, found: [], missing: [] };

  const found = [];
  const missing = [];

  for (const file of expectedFiles) {
    const fullPath = path.join(run.workDir, file);
    if (fs.existsSync(fullPath)) {
      found.push(file);
    } else {
      missing.push(file);
    }
  }

  return { pass: missing.length === 0, found, missing };
}

/**
 * Count tool calls in the trace.
 */
function countToolCalls(run) {
  return run.events.filter(
    (e) =>
      e.type === "item.completed" &&
      (e.item?.type === "tool_use" || e.item?.type === "command_execution")
  ).length;
}

/**
 * Count token usage from trace events.
 */
function countTokens(run) {
  let inputTokens = 0;
  let outputTokens = 0;

  for (const e of run.events) {
    if (e.type === "turn.completed" || e.type === "item.completed") {
      if (e.usage) {
        inputTokens += e.usage.input_tokens || 0;
        outputTokens += e.usage.output_tokens || 0;
      }
      if (e.item?.usage) {
        inputTokens += e.item.usage.input_tokens || 0;
        outputTokens += e.item.usage.output_tokens || 0;
      }
    }
  }

  return { inputTokens, outputTokens, totalTokens: inputTokens + outputTokens };
}

/**
 * Detect thrashing: repeated identical tool calls.
 */
function detectThrashing(run) {
  const commands = run.events
    .filter(
      (e) =>
        e.type === "item.completed" &&
        (e.item?.type === "command_execution" || e.item?.type === "tool_use") &&
        typeof e.item?.command === "string"
    )
    .map((e) => e.item.command);

  const counts = {};
  for (const cmd of commands) {
    counts[cmd] = (counts[cmd] || 0) + 1;
  }

  const thrashingCommands = Object.entries(counts)
    .filter(([, count]) => count > 2)
    .map(([cmd, count]) => ({ command: cmd, count }));

  const thrashingScore = thrashingCommands.reduce((sum, t) => sum + t.count, 0);

  return { thrashingCommands, thrashingScore };
}

/**
 * Run all deterministic checks and return scores.
 */
function runDeterministicGraders(run, expected) {
  const { skillName, shouldTrigger, expectedCommands, expectedFiles } = expected;

  const results = {};

  // 1. Skill invocation check
  results.skillInvoked = checkSkillInvoked(run, skillName);

  // 2. Command execution check
  results.commandsExecuted = checkCommandsExecuted(run, expectedCommands);

  // 3. File existence check
  results.filesExist = checkFilesExist(run, expectedFiles);

  // 4. Tool call count
  results.toolCallCount = countToolCalls(run);

  // 5. Token usage
  results.tokenUsage = countTokens(run);

  // 6. Thrashing detection
  results.thrashing = detectThrashing(run);

  // 7. Exit code
  results.exitCode = run.exitCode;

  // 8. Duration
  results.durationMs = run.durationMs;

  // Compute deterministic effectiveness score
  let checksPassed = 0;
  let totalChecks = 0;

  if (shouldTrigger !== undefined) {
    totalChecks++;
    if (results.skillInvoked === (shouldTrigger === "true")) checksPassed++;
  }

  if (expectedCommands && expectedCommands.length > 0) {
    totalChecks++;
    if (results.commandsExecuted.pass) checksPassed++;
  }

  if (expectedFiles && expectedFiles.length > 0) {
    totalChecks++;
    if (results.filesExist.pass) checksPassed++;
  }

  results.deterministicScore =
    totalChecks > 0 ? (checksPassed / totalChecks) * 100 : null;

  return results;
}

// ---------------------------------------------------------------------------
// LLM-as-Judge Grader
// ---------------------------------------------------------------------------

/**
 * Run LLM-as-judge evaluation using a rubric and output schema.
 * Uses codex exec with --output-schema for structured grading.
 */
function runLLMJudge(run, rubric, schemaPath) {
  const rubricPath = path.join(EVAL_DIR, "rubrics", `${rubric}.md`);
  const fullSchemaPath = schemaPath || path.join(EVAL_DIR, "rubrics", "style-rubric.schema.json");

  // Build the judge prompt
  const judgePrompt = `
You are evaluating the output of an AI agent skill.

## Task
The agent was asked to: ${run.prompt}

## Agent Trace Summary
The agent ran in ${run.workDir}. Exit code: ${run.exitCode}.
Duration: ${run.durationMs}ms.
Tool calls: ${countToolCalls(run)}.
Files created in working directory.

## Evaluation Rubric
${fs.existsSync(rubricPath) ? fs.readFileSync(rubricPath, "utf-8") : "Review the working directory and evaluate based on general quality criteria."}

## Instructions
1. Inspect the working directory at ${run.workDir}
2. Evaluate the output against each rubric criterion
3. Return a JSON result matching the output schema
`;

  let result = null;
  try {
    const proc = spawnSync(
      "codex",
      [
        "exec",
        "--output-schema",
        fullSchemaPath,
        "--full-auto",
        "-o",
        path.join(run.workDir, "judge-result.json"),
        judgePrompt,
      ],
      {
        encoding: "utf-8",
        timeout: 120000,
      }
    );

    const output = proc.stdout || "";
    try {
      result = JSON.parse(output);
    } catch {
      // Try reading the output file
      const outPath = path.join(run.workDir, "judge-result.json");
      if (fs.existsSync(outPath)) {
        result = JSON.parse(fs.readFileSync(outPath, "utf-8"));
      }
    }
  } catch (err) {
    result = { error: err.message, overall_pass: false, score: 0, checks: [] };
  }

  return result;
}

// ---------------------------------------------------------------------------
// Dimension Score Computation
// ---------------------------------------------------------------------------

/**
 * Compute all five dimension scores from grader results.
 */
function computeDimensionScores(deterministicResults, judgeResults, baseline) {
  // Effectiveness (40% weight in SHS)
  const effectiveness = computeEffectiveness(deterministicResults, judgeResults);

  // Efficiency (20% weight in SHS)
  const efficiency = computeEfficiency(deterministicResults, baseline);

  // Robustness (20% weight in SHS)
  const robustness = computeRobustness(deterministicResults);

  // Composability (10% weight in SHS)
  const composability = computeComposability(deterministicResults);

  // Maintainability (10% weight in SHS)
  const maintainability = computeMaintainability(deterministicResults);

  return { effectiveness, efficiency, robustness, composability, maintainability };
}

function computeEffectiveness(det, judge) {
  let score = 0;
  let weight = 0;

  // TCR from deterministic checks (30%)
  if (det.deterministicScore !== null) {
    score += (det.deterministicScore / 100) * 30;
    weight += 30;
  }

  // Output accuracy from judge (25%)
  if (judge && judge.score !== undefined) {
    score += (judge.score / 100) * 25;
    weight += 25;
  }

  // Edge case handling from judge checks (20%)
  if (judge && judge.checks) {
    const edgeChecks = judge.checks.filter((c) =>
      c.id?.includes("edge") || c.id?.includes("boundary")
    );
    if (edgeChecks.length > 0) {
      const passRate = edgeChecks.filter((c) => c.pass).length / edgeChecks.length;
      score += passRate * 20;
      weight += 20;
    }
  }

  // Instruction adherence from judge (15%)
  if (judge && judge.checks) {
    const constraintChecks = judge.checks.filter((c) =>
      c.id?.includes("constraint") || c.id?.includes("requirement")
    );
    if (constraintChecks.length > 0) {
      const passRate = constraintChecks.filter((c) => c.pass).length / constraintChecks.length;
      score += passRate * 15;
      weight += 15;
    }
  }

  // Factual grounding (10%) -- default to passing if no factual claims
  if (judge && judge.checks) {
    const factChecks = judge.checks.filter((c) =>
      c.id?.includes("fact") || c.id?.includes("citation")
    );
    if (factChecks.length > 0) {
      const passRate = factChecks.filter((c) => c.pass).length / factChecks.length;
      score += passRate * 10;
    } else {
      score += 10; // No factual claims to check = pass
    }
  } else {
    score += 10;
  }
  weight += 10;

  return weight > 0 ? Math.round((score / weight) * 100) : 50;
}

function computeEfficiency(det, baseline) {
  let score = 0;
  let weight = 0;

  // Token consumption (35%)
  if (baseline && baseline.avgTokens) {
    const ratio = det.tokenUsage.totalTokens / baseline.avgTokens;
    // Score: 100 if <= baseline, decreasing to 0 at 3x baseline
    const tokenScore = Math.max(0, Math.min(100, 100 - ((ratio - 1) / 2) * 100));
    score += tokenScore * 0.35;
    weight += 35;
  } else if (det.tokenUsage.totalTokens > 0) {
    // Without baseline, score based on absolute tokens (rough heuristic)
    const absScore = Math.max(0, Math.min(100, 100 - (det.tokenUsage.totalTokens / 100000) * 100));
    score += absScore * 0.35;
    weight += 35;
  }

  // Tool call count (25%)
  if (baseline && baseline.avgToolCalls) {
    const ratio = det.toolCallCount / baseline.avgToolCalls;
    const toolScore = Math.max(0, Math.min(100, 100 - ((ratio - 1) / 2) * 100));
    score += toolScore * 0.25;
    weight += 25;
  } else {
    const absScore = Math.max(0, Math.min(100, 100 - (det.toolCallCount / 50) * 100));
    score += absScore * 0.25;
    weight += 25;
  }

  // Time to completion (20%)
  const durationSec = det.durationMs / 1000;
  const timeScore = Math.max(0, Math.min(100, 100 - (durationSec / 120) * 100));
  score += timeScore * 0.20;
  weight += 20;

  // Context window utilization (10%)
  // Heuristic: assume 200K context, score utilization ratio
  const contextRatio = det.tokenUsage.totalTokens / 200000;
  const contextScore = Math.max(0, Math.min(100, 100 - contextRatio * 50));
  score += contextScore * 0.10;
  weight += 10;

  // Thrashing (10%)
  const thrashScore = Math.max(0, Math.min(100, 100 - det.thrashing.thrashingScore * 20));
  score += thrashScore * 0.10;
  weight += 10;

  return weight > 0 ? Math.round(score) : 50;
}

function computeRobustness(det) {
  // Robustness is primarily assessed through error patterns in the trace
  let score = 70; // Start at adequate, adjust based on signals

  // Error recovery: check if errors were followed by successful retries
  const errorEvents = det.events
    ? det.events.filter(
        (e) => e.type === "item.completed" && e.item?.status === "error"
      ).length
    : 0;

  if (errorEvents === 0) score += 20;
  else if (errorEvents <= 2) score += 10;
  else if (errorEvents <= 5) score -= 10;
  else score -= 20;

  // Thrashing is a robustness signal
  if (det.thrashing && det.thrashing.thrashingScore > 3) score -= 15;

  // Exit code is a robustness signal
  if (det.exitCode !== 0) score -= 20;

  return Math.max(0, Math.min(100, score));
}

function computeComposability(det) {
  let score = 70;

  // Clean exit with no errors = good composability signal
  if (det.exitCode === 0) score += 15;
  if (det.thrashing && det.thrashing.thrashingScore === 0) score += 10;
  if (det.commandsExecuted && det.commandsExecuted.pass) score += 5;

  return Math.max(0, Math.min(100, score));
}

function computeMaintainability(det) {
  // This is primarily assessed through static analysis of the skill files,
  // but we can extract signals from the run
  let score = 70;

  // A skill that runs deterministically (consistent across runs) is more maintainable
  if (det.deterministicScore !== null && det.deterministicScore === 100) score += 15;
  else if (det.deterministicScore !== null && det.deterministicScore >= 80) score += 10;

  // Clean exit is a maintainability signal
  if (det.exitCode === 0) score += 10;

  return Math.max(0, Math.min(100, score));
}

// ---------------------------------------------------------------------------
// A/B Testing
// ---------------------------------------------------------------------------

/**
 * Run an A/B test between two skill versions.
 */
function runABTest(experimentConfig) {
  const { hypothesis, control, treatment, dataset: datasetPath, runsPerPrompt } = experimentConfig;

  console.log(`\n=== A/B Test: ${hypothesis} ===\n`);
  console.log(`Control: ${control.skill_path} (v${control.version})`);
  console.log(`Treatment: ${treatment.skill_path} (v${treatment.version})`);
  console.log(`Dataset: ${datasetPath}`);
  console.log(`Runs per prompt: ${runsPerPrompt}\n`);

  const dataset = loadDataset(path.resolve(ROOT, datasetPath));

  const controlResults = [];
  const treatmentResults = [];

  for (const row of dataset) {
    console.log(`\n--- Prompt: ${row.id} ---`);

    // Run control
    console.log(`  Running control (${control.skill_path})...`);
    for (let i = 0; i < runsPerPrompt; i++) {
      const run = runAgent(row.prompt, {
        skillPath: path.resolve(ROOT, control.skill_path),
        outputDir: path.join(RESULTS_DIR, "ab", "control", row.id, `run-${i}`),
      });
      const det = runDeterministicGraders(run, {
        skillName: path.basename(control.skill_path),
        shouldTrigger: row.should_trigger,
        expectedCommands: row.expected_commands ? row.expected_commands.split("|") : [],
        expectedFiles: row.expected_artifacts ? row.expected_artifacts.split("|") : [],
      });
      controlResults.push({ run, det, rowId: row.id, version: "control" });
    }

    // Run treatment
    console.log(`  Running treatment (${treatment.skill_path})...`);
    for (let i = 0; i < runsPerPrompt; i++) {
      const run = runAgent(row.prompt, {
        skillPath: path.resolve(ROOT, treatment.skill_path),
        outputDir: path.join(RESULTS_DIR, "ab", "treatment", row.id, `run-${i}`),
      });
      const det = runDeterministicGraders(run, {
        skillName: path.basename(treatment.skill_path),
        shouldTrigger: row.should_trigger,
        expectedCommands: row.expected_commands ? row.expected_commands.split("|") : [],
        expectedFiles: row.expected_artifacts ? row.expected_artifacts.split("|") : [],
      });
      treatmentResults.push({ run, det, rowId: row.id, version: "treatment" });
    }
  }

  // Compute aggregate metrics
  const controlAgg = aggregate(controlResults);
  const treatmentAgg = aggregate(treatmentResults);

  // Generate comparison
  const comparison = generateComparison(controlAgg, treatmentAgg, hypothesis);

  // Write results
  const resultPath = path.join(
    EXPERIMENTS_DIR,
    path.basename(path.dirname(experimentConfig._path || "")),
    "results",
    `comparison-${Date.now()}.json`
  );
  fs.mkdirSync(path.dirname(resultPath), { recursive: true });
  fs.writeFileSync(resultPath, JSON.stringify(comparison, null, 2));

  return comparison;
}

function aggregate(results) {
  const tokenCounts = results.map((r) => r.det.tokenUsage.totalTokens);
  const toolCounts = results.map((r) => r.det.toolCallCount);
  const durations = results.map((r) => r.det.durationMs);
  const scores = results
    .map((r) => r.det.deterministicScore)
    .filter((s) => s !== null);

  return {
    runs: results.length,
    avgTokens: tokenCounts.reduce((a, b) => a + b, 0) / tokenCounts.length,
    avgToolCalls: toolCounts.reduce((a, b) => a + b, 0) / toolCounts.length,
    avgDurationMs: durations.reduce((a, b) => a + b, 0) / durations.length,
    avgDeterministicScore:
      scores.length > 0
        ? scores.reduce((a, b) => a + b, 0) / scores.length
        : null,
    exitCodeZeroRate:
      results.filter((r) => r.det.exitCode === 0).length / results.length,
  };
}

function generateComparison(control, treatment, hypothesis) {
  const tokenDelta =
    ((treatment.avgTokens - control.avgTokens) / control.avgTokens) * 100;
  const toolDelta =
    ((treatment.avgToolCalls - control.avgToolCalls) / control.avgToolCalls) * 100;
  const timeDelta =
    ((treatment.avgDurationMs - control.avgDurationMs) / control.avgDurationMs) * 100;

  let verdict = "INCONCLUSIVE";
  const improvements = [];
  const regressions = [];

  if (tokenDelta < -10) improvements.push(`Token usage reduced by ${Math.abs(tokenDelta).toFixed(1)}%`);
  if (tokenDelta > 10) regressions.push(`Token usage increased by ${tokenDelta.toFixed(1)}%`);

  if (toolDelta < -10) improvements.push(`Tool calls reduced by ${Math.abs(toolDelta).toFixed(1)}%`);
  if (toolDelta > 10) regressions.push(`Tool calls increased by ${toolDelta.toFixed(1)}%`);

  if (timeDelta < -10) improvements.push(`Duration reduced by ${Math.abs(timeDelta).toFixed(1)}%`);
  if (timeDelta > 10) regressions.push(`Duration increased by ${timeDelta.toFixed(1)}%`);

  if (improvements.length > 0 && regressions.length === 0) verdict = "ACCEPT";
  else if (improvements.length > 0 && regressions.length > 0) verdict = "INVESTIGATE";
  else if (improvements.length === 0 && regressions.length === 0) verdict = "REJECT (no significant difference)";
  else verdict = "BLOCK (regression detected)";

  return {
    hypothesis,
    verdict,
    control,
    treatment,
    deltas: {
      tokens_percent: tokenDelta,
      tool_calls_percent: toolDelta,
      duration_percent: timeDelta,
    },
    improvements,
    regressions,
    timestamp: new Date().toISOString(),
  };
}

// ---------------------------------------------------------------------------
// Main CLI
// ---------------------------------------------------------------------------

function main() {
  const args = process.argv.slice(2);

  if (args.includes("--ab-test")) {
    const configIdx = args.indexOf("--ab-test") + 1;
    const configPath = args[configIdx];
    const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
    config._path = configPath;
    const result = runABTest(config);
    console.log("\n=== A/B Test Result ===");
    console.log(JSON.stringify(result, null, 2));
    return;
  }

  // Default: single skill evaluation
  const skillIdx = args.indexOf("--skill");
  const datasetIdx = args.indexOf("--dataset");

  if (skillIdx === -1 || datasetIdx === -1) {
    console.log("Usage:");
    console.log("  node runner.js --skill <skill-name> --dataset <dataset.csv>");
    console.log("  node runner.js --ab-test <experiment.yaml>");
    process.exit(1);
  }

  const skillName = args[skillIdx + 1];
  const datasetPath = args[datasetIdx + 1];

  console.log(`\n=== Skill Evaluation: ${skillName} ===\n`);

  const dataset = loadDataset(path.resolve(ROOT, datasetPath));
  console.log(`Loaded ${dataset.length} prompts from dataset\n`);

  const allResults = [];

  for (const row of dataset) {
    console.log(`Running: ${row.id} -- "${row.prompt.substring(0, 60)}..."`);

    const run = runAgent(row.prompt, {
      skillPath: path.join(ROOT, "skills", skillName),
      outputDir: path.join(RESULTS_DIR, skillName, row.id),
      runId: row.id,
    });

    const det = runDeterministicGraders(run, {
      skillName,
      shouldTrigger: row.should_trigger,
      expectedCommands: row.expected_commands ? row.expected_commands.split("|") : [],
      expectedFiles: row.expected_artifacts ? row.expected_artifacts.split("|") : [],
    });

    const judge = runLLMJudge(run, `${skillName}-rubric`);

    const dimensions = computeDimensionScores(det, judge, null);
    const shs = computeSHS(dimensions);

    const result = {
      rowId: row.id,
      prompt: row.prompt,
      shouldTrigger: row.should_trigger,
      deterministic: det,
      judge,
      dimensions,
      shs,
    };

    allResults.push(result);

    console.log(`  SHS: ${shs} | Det Score: ${det.deterministicScore}% | Tokens: ${det.tokenUsage.totalTokens} | Tool Calls: ${det.toolCallCount}`);
  }

  // Aggregate report
  const shsValues = allResults.map((r) => r.shs);
  const avgSHS = shsValues.reduce((a, b) => a + b, 0) / shsValues.length;
  const minSHS = Math.min(...shsValues);
  const maxSHS = Math.max(...shsValues);

  const report = {
    skill: skillName,
    timestamp: new Date().toISOString(),
    prompts_evaluated: allResults.length,
    aggregate: {
      avg_shs: Math.round(avgSHS),
      min_shs: minSHS,
      max_shs: maxSHS,
      avg_effectiveness: Math.round(mean(allResults.map((r) => r.dimensions.effectiveness))),
      avg_efficiency: Math.round(mean(allResults.map((r) => r.dimensions.efficiency))),
      avg_robustness: Math.round(mean(allResults.map((r) => r.dimensions.robustness))),
      avg_composability: Math.round(mean(allResults.map((r) => r.dimensions.composability))),
      avg_maintainability: Math.round(mean(allResults.map((r) => r.dimensions.maintainability))),
      avg_tokens: Math.round(mean(allResults.map((r) => r.deterministic.tokenUsage.totalTokens))),
      avg_tool_calls: mean(allResults.map((r) => r.deterministic.toolCallCount)).toFixed(1),
      avg_duration_ms: Math.round(mean(allResults.map((r) => r.deterministic.durationMs))),
    },
    tier: getTier(avgSHS),
    results: allResults,
  };

  // Write report
  const reportPath = path.join(RESULTS_DIR, skillName, `report-${Date.now()}.json`);
  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

  console.log(`\n=== Report ===`);
  console.log(`Skill: ${skillName}`);
  console.log(`Avg SHS: ${Math.round(avgSHS)} (Tier: ${getTier(avgSHS)})`);
  console.log(`Effectiveness: ${Math.round(mean(allResults.map((r) => r.dimensions.effectiveness)))}`);
  console.log(`Efficiency: ${Math.round(mean(allResults.map((r) => r.dimensions.efficiency)))}`);
  console.log(`Robustness: ${Math.round(mean(allResults.map((r) => r.dimensions.robustness)))}`);
  console.log(`Composability: ${Math.round(mean(allResults.map((r) => r.dimensions.composability)))}`);
  console.log(`Maintainability: ${Math.round(mean(allResults.map((r) => r.dimensions.maintainability)))}`);
  console.log(`\nFull report: ${reportPath}`);
}

function computeSHS(dimensions) {
  return Math.round(
    dimensions.effectiveness * 0.40 +
    dimensions.efficiency * 0.20 +
    dimensions.robustness * 0.20 +
    dimensions.composability * 0.10 +
    dimensions.maintainability * 0.10
  );
}

function getTier(shs) {
  if (shs >= 85) return "Production-Ready";
  if (shs >= 70) return "Beta";
  if (shs >= 50) return "Alpha";
  if (shs >= 25) return "Prototype";
  return "Deprecated";
}

function mean(arr) {
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

// ---------------------------------------------------------------------------
// Entry Point
// ---------------------------------------------------------------------------

if (require.main === module) {
  main();
}

module.exports = {
  loadDataset,
  runAgent,
  runDeterministicGraders,
  runLLMJudge,
  computeDimensionScores,
  computeSHS,
  runABTest,
  getTier,
};
