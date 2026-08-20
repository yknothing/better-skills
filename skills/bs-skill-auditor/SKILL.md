---
name: bs-skill-auditor
# tier: standard
description: Use when you need a read-only, evidence-anchored audit of installed agent skills across structure, safety, freshness, and pattern alignment, including confidence scoring, failure routing, and a health report. This skill diagnoses and recommends; it does not directly repair the audited skills or execute them dynamically.
---

# Skill Auditor

Audit and evaluate installed agent skills for quality, freshness, and structural integrity. This is a meta-skill: it treats other skills as its subject matter.

## Boundary Rules

These constraints apply to the entire skill. Read them before any execution steps.

- Do not modify any skill file during audit. This skill is read-only.
- Do not execute any skill during audit. This is static analysis, not dynamic testing.
- If a skill directory contains no SKILL.md and only a `.gitkeep`, report it as V-S4 (orphaned stub) with anchor 0 for all perspectives.
- If a directory under the skills root contains files but no SKILL.md (and is not just a `.gitkeep`), flag it as V-S5 (unrecognized layout) with anchor 25 and route to manual review.
- If the skills directory is empty or inaccessible, report anchor 0 overall and stop.
- If auto-routing would create a cycle (e.g., bs-skill-auditor -> bs-skill-forge -> bs-skill-auditor), break the cycle by routing to manual review instead.
- **Self-audit bias guard**: when the audited set includes `bs-skill-auditor` itself, tag every finding on it `SELF-AUDIT`, cap its overall anchor at 75, and add to the report preamble: "bs-skill-auditor cannot fully audit itself — an auditor shares its own blind spots. Independent review recommended." Never report a clean 100 for yourself.
- Save the report to `docs/reviews/bs-skill-auditor/<YYYY-MM-DD>-health-report.md`. If the directory does not exist, create it.

## Red Flags — Audit Rationalizations

These are the auditor's own shortcuts, named before they occur. (Pattern: `anti-pattern-pre-naming`.)

| Thought | Reality |
|---------|---------|
| "This skill looks fine at a glance, the full checklist is overkill" | Glance-auditing is not auditing. Run all four perspectives or report the skill as unassessed. |
| "It's a trusted repo, no need to scan for secrets" | V-Y1 exists because trusted repos leak secrets too. Safety scan is unconditional. |
| "The anchors feel harsh, I'll round this 50 up to 75" | Anchors are discrete for a reason. Rounding up is grade inflation — the report becomes decorative. |
| "The skill is long and well-organized, it must be healthy" | Length and formatting are not health. A beautiful skill can carry a hardcoded key. |
| "I ran the name grep, so Pattern Alignment passes" | Name matching proves naming, not correct application. Cap P at 75 unless substance was checked. |

## Progressive Disclosure

This skill is organized in three loading tiers:

- **Tier 1 -- Metadata only**: The orchestrator reads `name` and `description` from frontmatter to decide whether to invoke this skill. The full body is not loaded at decision time.
- **Tier 2 -- Full body**: On invocation, read from Boundary Rules through Execution Steps. This is the complete audit logic.
- **Tier 3 -- Reference files**: Files under `docs/patterns/` are loaded on demand, only when a specific pattern needs deeper inspection during evaluation (e.g., to verify correct pattern application in Perspective 4).

### Patterns Applied

This skill itself uses the following patterns from `docs/patterns/README.md`. When auditing other skills for Pattern Alignment (Perspective 4), these serve as the reference for correct application:

| Pattern | Why It Is Used Here |
|---------|---------------------|
| **Multi-Perspective Review Panel** | Four independent angles (S/Y/F/P) prevent any single dimension from dominating the audit |
| **Confidence Anchors** | Discrete anchors (0/25/50/75/100) prevent false precision -- there is no meaningful difference between "7.3" and "7.4" in a static audit |
| **Self-Review Checklist** | Placeholder scan + anchor consistency + completeness checks catch report-level defects before the report is emitted |
| **Verification Rules + Auto-Routing** | Every failure signal maps to a specific remediation path -- no orphaned findings that leave the user wondering what to do |
| **Pipeline Architecture** | Six sequential steps (Scan -> Evaluate -> Score -> Route -> Report -> Self-Review) with explicit input/output contracts per step |
| **Progressive Disclosure** | Three-tier loading keeps the context budget controlled -- the agent only loads what it needs when it needs it |
| **Boundary Rules** | Read-only and no-execution constraints are stated first so the agent is constrained before reading any audit logic |

## Multi-Perspective Review Panel

Evaluate each skill from four independent perspectives. Assign a discrete confidence anchor to each finding. Do not combine perspectives into a single score -- keep them separate.

### Perspective 1: Structural Integrity (S)

Check frontmatter completeness, required sections, file organization.

> **Why structure matters:** Frontmatter parsing failures are among the most common and most silently-degrading issues in agent skill systems. If `name` or `description` is malformed, the orchestrator may fail to route to the skill at all -- the skill effectively does not exist. Body size bounds prevent both trivial stubs (< 500 bytes) and context-overwhelming monoliths (> 5000 words).

- [ ] YAML frontmatter present with opening `---` delimiter
- [ ] Frontmatter has closing `---` delimiter (second occurrence after line 1). Verify with: `awk 'NR>1 && /^---$/{found=1; exit} END{exit !found}' SKILL.md`
- [ ] Required fields: `name` (kebab-case), `description` (starts with "Use when")
- [ ] Body length between 500 bytes and 5000 words
- [ ] No orphaned `.gitkeep` files in skill directory
- [ ] SKILL.md is the only markdown file in the skill root (references go in subdirectories)

### Perspective 2: Safety (Y)

Check for dangerous patterns, secrets, destructive commands.

- [ ] No hardcoded API keys, tokens, or passwords in skill body
- [ ] No destructive filesystem commands (`rm -rf /`, `chmod 777 /`, etc.) without explicit user confirmation gates
- [ ] No instructions to bypass permission prompts or security hooks
- [ ] No commands that download and execute remote scripts without user review

### Perspective 3: Freshness (F)

Check staleness signals.

- [ ] Skill has been exercised within the last 90 days. Check with: (1) `git log --since='90 days ago' -- <skill-dir>/ 2>/dev/null` first; (2) if git returns zero results or fails (e.g., repo has no commits), fall back to `find <skill-dir> -name 'SKILL.md' -mtime -90 2>/dev/null`; (3) if both fail, mark as "unverified" rather than "stale". A skill is "exercised" if it has been modified, reviewed, or had its test prompts run within the window.
>
> **Why 90 days?** Skills rot in two ways: (1) their referenced APIs/tools change, and (2) the agent runtime's behavior evolves. A skill untouched for 90+ days may silently degrade even if the file itself is unchanged. The 3-tier check (git -> find -> unverified) prevents false positives: if we cannot measure freshness, we report "unverified" rather than "stale," because assuming staleness when you cannot verify it erodes trust in the health report.
- [ ] Referenced external sources are still accessible. Check with: `curl -sI <url> | head -1` (should return HTTP 200). For GitHub repos, use: `gh api repos/<owner>/<repo> --jq '.updated_at'`. If curl or gh is unavailable, note the check as "unverified" in the report.
- [ ] No references to deprecated APIs, removed CLI flags, or retired tools
- [ ] Source attributions in docs/patterns/ are still valid (upstream repos exist and are active)

### Perspective 4: Pattern Alignment (P)

Check correct usage of documented patterns.

- [ ] **Tool-first**: if auditing this repository (i.e., `tools/pattern-alignment.js` exists at the repo root), run `node tools/pattern-alignment.js` — it resolves each declared pattern to its file under `docs/patterns/` and reports drift. Use its output as the P findings.
- [ ] **Fallback (foreign skill directories)**: each pattern name used in the skill appears in `docs/patterns/README.md`. Verify with: `grep -o '<pattern-name>' SKILL.md` for each claimed pattern. Name matching verifies naming only, not correct application — when this is the only check performed, cap the P anchor at 75 and note "name-match only" in the finding.
- [ ] The skill cites at least one source for each pattern used (source must appear in the patterns README source column)
- [ ] Patterns are used at the correct depth tier (Lightweight/Standard/Deep) for the skill's declared tier

> **Why pattern alignment matters:** Patterns are this project's core methodology (STUDY -> EXTRACT -> DEVELOP). A skill that claims to use patterns but misattributes or misapplies them undermines the entire pattern-library investment. This perspective ties each skill back to the evidence base in `docs/research/`.

## Confidence Anchors

Use discrete anchors only. Never emit continuous scores like "7.3/10".

| Anchor | Meaning |
|--------|---------|
| **0** | Cannot assess -- insufficient data or access |
| **25** | Low confidence -- significant gaps found, multiple unknowns |
| **50** | Moderate confidence -- some gaps, but core structure is sound |
| **75** | High confidence -- minor issues only, well-formed |
| **100** | Full confidence -- exemplary, no issues detected |

Assign a confidence anchor to each perspective independently. Then assign an overall anchor: the **minimum** of the four perspective anchors. A skill is only as healthy as its weakest dimension.

> **Why min()?** Health is a conjunctive property -- all dimensions must be adequate. A skill with perfect structure (S=100) but a hardcoded secret (Y=0) is not healthy. The min() function ensures no dimension can be "averaged away" by strong scores elsewhere. Safety failures tend to produce anchor 0 (V-Y1 blocks processing), so the min() naturally gives safety the highest effective weight without needing explicit weighting math.

Example: S=75, Y=50, F=25, P=50 -> Overall=25 (dragged down by staleness).

## Verification Rules + Auto-Routing

When a check fails, route to the appropriate remediation path automatically.

| Rule ID | Failure Signal | Auto-Route |
|---------|---------------|------------|
| V-S1 | Missing `name` field | Route to `bs-skill-forge`: regenerate frontmatter. If `bs-skill-forge` is not yet implemented, mark as `[PENDING: bs-skill-forge unavailable]` and provide inline manual instructions instead. |
| V-S2 | Body < 500 bytes | Route to `bs-skill-forge`: expand with required sections. If `bs-skill-forge` is not yet implemented, mark as `[PENDING: bs-skill-forge unavailable]` and provide inline manual instructions instead. |
| V-S3 | Body > 5000 words | Route to manual review: split into sub-skills or use Load Stub pattern |
| V-S4 | Orphaned `.gitkeep` | Recommend deletion (requires user confirmation). A `.gitkeep` with no SKILL.md means no skill was ever written. |
| V-S5 | Unrecognized layout (files present but no SKILL.md) | Route to manual review: determine if this is a broken skill or a non-skill directory |
| V-Y1 | Hardcoded secret detected | **BLOCK**: refuse to process further. Alert user immediately |
| V-Y2 | Destructive command without guard | Route to manual review: add confirmation gate or remove command |
| V-Y3 | Remote script execution | Route to manual review: add user-visible review step |
| V-F1 | Stale (> 90 days unused) | Route to `bs-skill-forge`: schedule refresh or deprecation review. Deprecation and deletion require explicit user approval. If `bs-skill-forge` is not yet implemented, mark as `[PENDING: bs-skill-forge unavailable]` and provide inline manual instructions instead. |
| V-F2 | Broken external reference | Route to manual review: update URL or remove dead reference |
| V-F3 | Deprecated API usage | Flag for update; note the deprecation in the health report |
| V-P1 | Missing pattern attribution | Route to `docs/patterns/README.md`: add entry if pattern is novel, or cite existing |
| V-P2 | Pattern-depth mismatch | Flag: recommend depth tier reassessment |

> **Why these specific rules?**
> - **V-Y1 (hardcoded secrets)** is BLOCK because once a secret reaches a skill file, it likely also reached version control, agent context windows, and shipping logs — recovery requires revoking and rotating, not editing. Continuing the audit on a leaking skill spreads the problem.
> - **V-S3 (>5000 words)** is manual review (not auto-fix) because oversized skills usually need conceptual splitting, not mechanical truncation. Auto-truncating would amputate logic.
> - **V-F1 (>90 days unused)** routes to refresh-or-deprecate because skills rot from API drift, tool changes, and pattern evolution at roughly that timescale; older skills silently start producing wrong output.

<HARD-GATE id="safety-override">
V-Y (Safety) violations take absolute precedence over all other rules. No V-S, V-F, or V-P finding may be processed before every V-Y finding is resolved. Priority order: V-Y > V-S > V-F > V-P.
</HARD-GATE>
>
> **Why this ordering?** A hardcoded secret (V-Y1) in a skill file means the secret may already be in version control, agent context windows, and logs. No amount of structural elegance or pattern alignment matters until the secret is revoked and removed. Structural issues (V-S) come second because a malformed skill may not function at all. Freshness (V-F) and Pattern (V-P) are quality concerns -- they matter only after safety and structure are addressed.

## Self-Review Checklist

Before emitting the final health report, run this checklist on the report itself.

1. **Placeholder scan**: Search the report for "TODO", "TKTK", "???", "placeholder". Remove or resolve all.
2. **Anchor consistency**: Every finding has exactly one confidence anchor. No anchors are missing. No finding has multiple anchors.
3. **Completeness**: Every skill in the scanned directory appears in the report. No skill was silently skipped.
4. **Actionability**: Every FAIL finding has a corresponding auto-route or manual recommendation. No orphaned failures.
5. **Tone**: The report describes issues factually, without judgmental language. It does not praise or blame -- it states what is and what to do.
6. **Self-application**: Run this skill against its own SKILL.md, applying the self-audit bias guard from Boundary Rules (tag findings `SELF-AUDIT`, cap overall at 75). Note any self-flagged issues in the report preamble. Fix root-cause issues before the next audit cycle.

## Execution Steps

### Step 1: Scan

The skills root defaults to the `skills/` directory relative to the repository root. If scanning from a different location, accept it as an explicit parameter.

List all directories under the skills root. A skill directory is one that contains (or should contain) a `SKILL.md` file. Exclude directories named `.git`, `node_modules`, `docs`, `evaluation`, `external`, `tools`.

For each skill directory, record:
- Skill name (from directory name)
- Whether SKILL.md exists
- Last modification date (via `git log --since='90 days ago' -- <skill-dir>/ 2>/dev/null`, falling back to `find <skill-dir> -name 'SKILL.md' -mtime -90 2>/dev/null`; mark "unverified" if both fail)

### Step 2: Evaluate

For each skill, run the four-perspective review. Use the checklists above. Record every finding with its perspective tag (S/Y/F/P), pass/fail status, confidence anchor, and the verification rule ID if applicable.

Assign per-perspective confidence anchors during evaluation. These feed directly into the overall score computation in Step 3.

### Step 3: Score

Compute the overall anchor as `min(S, Y, F, P)` using the anchors already assigned during evaluation in Step 2.

### Step 4: Route

For each FAIL finding, apply the auto-routing table. Generate the remediation path. Check for circular routing before emitting recommendations (see Boundary Rules).

### Step 5: Report

Produce the health report in this format:

```
SKILL HEALTH REPORT
===================
Scan date: [date]
Skills scanned: [count]
Skills passing (overall >= 50): [count]
Skills failing (overall < 50): [count]
Skills unassessable (anchor 0): [count]

PER-SKILL DETAILS
-----------------
[skill-name]
  Structural: [anchor] [pass/fail findings, comma-separated rule IDs]
  Safety:     [anchor] [pass/fail findings, comma-separated rule IDs]
  Freshness:  [anchor] [pass/fail findings, comma-separated rule IDs]
  Pattern:    [anchor] [pass/fail findings, comma-separated rule IDs]
  Overall:    [anchor]
  Remediation: [list of auto-routes and manual recommendations]

SUMMARY
-------
Top remediation priorities (by severity):
1. [V-Y findings first]
2. [V-S findings second]
3. [V-F findings third]
4. [V-P findings fourth]
```

If more than 20 skills are scanned, include full per-skill details only for skills with overall anchor < 75. List all other skills in a compact summary line: `[skill-name]: Overall [anchor], all perspectives >= [min-perspective]`.

### Step 6: Self-Review

Run the self-review checklist on the report. Fix any issues. Then emit the final report.

If all skills pass with overall anchor >= 50 and no V-Y findings, conclude the report with: "No remediation required. All skills are healthy."

## Depth Tier

This skill is **Standard** tier. It is a meta-skill used periodically (not daily), with moderate failure cost (a bad health report wastes review time but does not break production).

## Test prompts

Three prompts that exercise this skill end-to-end, mirrored in `evaluation/datasets/batch-1-test-prompts.json`.

1. **Happy path -- audit a real skill**: *"Audit the bs-social-card skill for health. Run the full four-perspective review and produce a health report."* -- expected: scans `skills/bs-social-card/SKILL.md`, produces a report with S/Y/F/P anchors, identifies bs-social-card as a valid skill with frontmatter, assigns overall anchor, lists any findings with rule IDs, saves report to `docs/reviews/bs-skill-auditor/<date>-health-report.md`.

2. **Edge -- scan all skills in a batch**: *"Run bs-skill-auditor on the entire skills/ directory. There should be ~8 skills -- give me the compact summary for any that score >= 75."* -- expected: scans all skill directories, excludes `.gitkeep`-only stubs (reports them as V-S4 with anchor 0), applies compact mode threshold (>= 75 gets summary line, < 75 gets full detail), safety override ordering visible in the SUMMARY section.

3. **Adversarial -- audit a deliberately broken text fixture**: *"Audit this provided Skill text without writing it to disk: it has no frontmatter closing delimiter, contains `API_KEY=sk-abc123def456ghi789jkl012mno345pqr678stu901` inline in the body, and has a body under 100 bytes. Do NOT skip the safety check. Do not create, modify, or delete any Skill file while auditing this fixture."* -- expected: V-Y1 triggers BLOCK before any other perspective is processed; the hardcoded secret is detected from the provided text; the fixture is reported with Y=0 and overall=0; the other perspectives may be unprocessed because the safety override blocks them; the report clearly flags the security finding in the preamble; no Skill file or directory is created, modified, or deleted at any point.
