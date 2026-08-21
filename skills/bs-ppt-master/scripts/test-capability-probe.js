#!/usr/bin/env node
"use strict";

const assert = require("assert");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawnSync } = require("child_process");

const SCRIPT = path.join(__dirname, "capability-probe.js");
let passed = 0;

function test(name, fn) {
  try {
    fn();
    passed += 1;
    console.log(`PASS ${name}`);
  } catch (error) {
    console.error(`FAIL ${name}`);
    throw error;
  }
}

function run(args) {
  return spawnSync(process.execPath, [SCRIPT, ...args], {
    encoding: "utf8",
    env: { ...process.env, PATH: "" },
  });
}

function parseJson(result) {
  assert.strictEqual(result.status, 0, result.stderr || result.stdout);
  return JSON.parse(result.stdout);
}

const fixture = fs.mkdtempSync(path.join(os.tmpdir(), "ppt-master-probe-"));

try {
  const skillRoot = path.join(fixture, "skills");
  const binRoot = path.join(fixture, "bin");
  const appRoot = path.join(fixture, "apps");
  const sentinel = path.join(fixture, "executor-ran");

  fs.mkdirSync(path.join(skillRoot, "pptx"), { recursive: true });
  fs.writeFileSync(path.join(skillRoot, "pptx", "SKILL.md"), "---\nname: pptx\ndescription: Use when testing.\n---\n");
  fs.mkdirSync(binRoot, { recursive: true });
  fs.writeFileSync(
    path.join(binRoot, "soffice"),
    `#!/bin/sh\nprintf ran > ${JSON.stringify(sentinel)}\n`,
  );
  fs.chmodSync(path.join(binRoot, "soffice"), 0o755);
  fs.mkdirSync(path.join(appRoot, "Microsoft PowerPoint.app"), { recursive: true });

  test("isolated discovery detects all three candidate classes without execution", () => {
    const result = run([
      "--json",
      "--isolated",
      "--skill-root", skillRoot,
      "--bin-root", binRoot,
      "--app-root", appRoot,
    ]);
    const report = parseJson(result);
    assert.strictEqual(report.schema_version, 1);
    assert.strictEqual(report.probe_scope, "discovery-only");
    assert.strictEqual(report.candidates.skills[0].state, "DETECTED");
    assert.strictEqual(report.candidates.skills[0].identity_state, "UNVERIFIED");
    assert.strictEqual(report.candidates.skills[0].label, "pptx-named Skill candidate");
    assert.strictEqual(report.candidates.binaries[0].state, "DETECTED");
    assert.strictEqual(report.candidates.binaries[0].identity_state, "UNVERIFIED");
    assert.strictEqual(report.candidates.applications[0].state, "DETECTED");
    assert.strictEqual(report.candidates.applications[0].identity_state, "UNVERIFIED");
    assert.ok(Object.values(report.feature_support).every((state) => state === "UNVERIFIED"));
    assert.strictEqual(report.v5, "UNVERIFIED");
    assert.strictEqual(fs.existsSync(sentinel), false, "probe executed a discovered binary");
  });

  test("empty isolated roots remain NOT_FOUND and exit successfully", () => {
    const emptyRoot = path.join(fixture, "empty");
    fs.mkdirSync(emptyRoot);
    const report = parseJson(run([
      "--json",
      "--isolated",
      "--skill-root", emptyRoot,
      "--bin-root", emptyRoot,
      "--app-root", emptyRoot,
    ]));
    for (const group of Object.values(report.candidates)) {
      assert.ok(group.every((candidate) => candidate.state === "NOT_FOUND"));
    }
    assert.strictEqual(report.v5, "UNVERIFIED");
  });

  test("repeatable roots merge evidence without changing evidence states", () => {
    const emptyRoot = path.join(fixture, "empty-repeat");
    fs.mkdirSync(emptyRoot);
    const report = parseJson(run([
      "--json",
      "--isolated",
      "--skill-root", emptyRoot,
      "--skill-root", skillRoot,
      "--bin-root", emptyRoot,
      "--bin-root", binRoot,
      "--app-root", emptyRoot,
      "--app-root", appRoot,
    ]));
    assert.ok(report.candidates.skills[0].evidence.some((item) => item.includes("pptx/SKILL.md")));
    assert.strictEqual(report.feature_support.native_editable_objects, "UNVERIFIED");
  });

  test("same-name, malformed, mismatched, and symlink Skills never qualify identity", () => {
    const malformedRoot = path.join(fixture, "malformed-skills");
    const mismatchRoot = path.join(fixture, "mismatched-skills");
    const symlinkRoot = path.join(fixture, "symlink-skills");
    fs.mkdirSync(path.join(malformedRoot, "pptx"), { recursive: true });
    fs.mkdirSync(path.join(mismatchRoot, "pptx"), { recursive: true });
    fs.mkdirSync(path.join(symlinkRoot, "pptx"), { recursive: true });
    fs.writeFileSync(path.join(malformedRoot, "pptx", "SKILL.md"), "not frontmatter\n");
    fs.writeFileSync(path.join(mismatchRoot, "pptx", "SKILL.md"), "---\nname: not-pptx\ndescription: Use when testing.\n---\n");
    fs.symlinkSync(path.join(skillRoot, "pptx", "SKILL.md"), path.join(symlinkRoot, "pptx", "SKILL.md"));

    const report = parseJson(run([
      "--json", "--isolated",
      "--skill-root", malformedRoot,
      "--skill-root", mismatchRoot,
      "--skill-root", symlinkRoot,
    ]));
    const item = report.candidates.skills[0];
    assert.strictEqual(item.state, "DETECTED");
    assert.strictEqual(item.identity_state, "UNVERIFIED");
    assert.ok(item.identity_evidence.some((entry) => entry.declared_name === null));
    assert.ok(item.identity_evidence.some((entry) => entry.declared_name === "not-pptx" && !entry.name_matches));
    assert.ok(item.identity_evidence.some((entry) => entry.path_type === "symlink"));
    assert.ok(item.identity_evidence.every((entry) => entry.qualified_source === "UNVERIFIED"));
  });

  test("unknown arguments exit 2", () => {
    const result = run(["--not-a-real-option"]);
    assert.strictEqual(result.status, 2);
    assert.match(result.stderr, /Unknown argument/);
  });

  test("root arguments require values", () => {
    const result = run(["--isolated", "--skill-root"]);
    assert.strictEqual(result.status, 2);
    assert.match(result.stderr, /requires a value/);
  });

  test("human output states the discovery boundary", () => {
    const result = run(["--isolated", "--skill-root", skillRoot]);
    assert.strictEqual(result.status, 0, result.stderr || result.stdout);
    assert.match(result.stdout, /Discovery-only capability probe/);
    assert.match(result.stdout, /Discovery is not capability verification/);
    assert.match(result.stdout, /UNVERIFIED/);
  });

  console.log(`\n${passed} capability-probe tests passed`);
} finally {
  fs.rmSync(fixture, { recursive: true, force: true });
}
