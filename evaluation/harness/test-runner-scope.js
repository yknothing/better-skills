#!/usr/bin/env node
"use strict";

const assert = require("assert");
const path = require("path");
const { spawnSync } = require("child_process");
const { gradeSkill, formatHuman } = require("./runner");

const fake = {
  tier: "deep",
  evals: [
    { id: "fake-happy", name: "happy", prompt: "x", expected_behavior: "nonsense" },
    { id: "fake-edge", name: "edge", prompt: "x", expected_behavior: "nonsense" },
    { id: "fake-adversarial", name: "adversarial", prompt: "x", expected_behavior: "nonsense" },
  ],
};

const graded = gradeSkill("bs-ppt-master", fake);
assert.strictEqual(graded.contract_passed, true, "fixture should demonstrate schema-only pass");
assert.strictEqual(graded.structural_score, 100);
assert.strictEqual(graded.evidence_scope, "EVAL_SCHEMA_ONLY");
assert.strictEqual(graded.behavioral_verdict, "NOT_RUN");
assert.strictEqual(graded.behaviorally_verified, false);

const human = formatHuman({ skills: [graded] });
assert.match(human, /evaluation contracts passed; behavior NOT_RUN/);
assert.doesNotMatch(human, /skills passed/);

const runner = path.join(__dirname, "runner.js");
const result = spawnSync(process.execPath, [runner, "--skill", "bs-ppt-master", "--json"], {
  encoding: "utf8",
});
assert.strictEqual(result.status, 0, result.stderr || result.stdout);
const report = JSON.parse(result.stdout);
assert.strictEqual(report.evidence_scope, "EVAL_SCHEMA_ONLY");
assert.strictEqual(report.behavioral_verdict, "NOT_RUN");
assert.strictEqual(report.behaviorally_verified, false);
assert.strictEqual(report.skills[0].behaviorally_verified, false);

console.log("PASS runner never upgrades schema-only checks to behavioral verification");
