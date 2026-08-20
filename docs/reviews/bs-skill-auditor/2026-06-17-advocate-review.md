# Advocate Review: bs-skill-auditor

**Date**: 2026-06-17
**Reviewer Role**: Advocate
**Skill**: bs-skill-auditor
**HUMAN_VERIFIED**: false

## Executive Summary

This compatibility header normalizes review metadata after the repository-wide `bs-` namespace migration. The substantive review below is preserved unchanged.

**Schema completeness**: 10/10
**Schema migration status**: PASS

## Original Review

# Advocate Review: bs-skill-auditor

**Reviewer role**: Advocate (Gate 2 — Peer Review)
**Date**: 2026-06-17
**Skill under review**: `skills/bs-skill-auditor/SKILL.md`
**Skill tier**: Standard (meta-skill)
**Review type**: Structured defense of design decisions

---

## Summary Scores

| Dimension | Score | Notes |
|-----------|-------|-------|
| 1. Multi-Perspective Design | 9/10 | Right dimensions, one intentional omission |
| 2. Confidence Anchor System | 9/10 | Correct aggregation, well-demonstrated |
| 3. Auto-Routing Table | 7/10 | Rules correct but incomplete mapping |
| 4. Safety Override | 9/10 | Clear precedence, minor scope ambiguity |
| 5. Freshness Detection | 8/10 | Robust 3-tier design, one blind spot |
| 6. Self-Application | 7/10 | Practical with caveats, cycle risk managed |
| 7. Report Format | 9/10 | Clear, actionable, good compact mode |
| 8. Boundary Rules | 8/10 | Good coverage, two minor gaps |
| **Total** | **66/80** | |

---

## Detailed Evaluation

### 1. Multi-Perspective Design (9/10)

**The four perspectives are Structural (S), Safety (Y), Freshness (F), and Pattern (P).**

These are the correct dimensions for a static-analysis skill health audit. Here is why each earns its place:

- **Structural (S)**: Frontmatter integrity, file organization, body size. This is the table stakes -- a skill cannot function if its metadata is broken or its file layout is malformed. Frontmatter parsing failures are among the most common and most silently-degrading issues in agent skill systems.

- **Safety (Y)**: Hardcoded secrets, destructive commands, permission bypass, remote script execution. This is the highest-stakes dimension. A skill with a hardcoded API key is a security incident waiting to happen. The separate Y prefix (not S for safety) is a deliberate design choice that enables the safety override mechanism -- it visually and structurally distinguishes safety from structural concerns.

- **Freshness (F)**: Staleness, broken references, deprecated APIs, source attribution validity. Skills rot. External references go dead. APIs are deprecated. Without a freshness dimension, a skill can pass structural and safety checks while being completely non-functional because its referenced tools no longer exist.

- **Pattern (P)**: Correct pattern usage, source attribution, depth-tier alignment. This ties the skill back to the project's core methodology (STUDY -> EXTRACT -> DEVELOP). A skill that claims to use patterns but misattributes or misapplies them undermines the entire pattern-library investment.

**What is missing**: There is no "effectiveness" dimension -- does the skill actually produce good results when invoked? However, the project's CLAUDE.md explicitly states for Phase 1: "No LLM-as-judge. No A/B testing. No dashboards." An effectiveness dimension would require dynamic testing (running the skill and evaluating output), which is a Phase 4 concern. This omission is intentional and architecturally correct for the current phase.

**Verdict**: The four dimensions are well-chosen, orthogonal (they measure different things), and collectively exhaustive for static analysis. The intentional omission of dynamic effectiveness testing is correct for Phase 1 constraints.

### 2. Confidence Anchor System (9/10)

**Discrete anchors (0/25/50/75/100) with overall = min(S, Y, F, P).**

The discrete anchor system is a strong design choice. It prevents false precision -- there is no meaningful difference between a "7.3" and a "7.4" in a static code audit. The 5-level scale (0/25/50/75/100) provides enough granularity to distinguish clear states without inviting quibbling over decimal points. Each level has a clear semantic meaning:

- 0 = cannot assess (data problem, not quality problem)
- 25 = significant gaps (needs substantial work)
- 50 = moderate (core structure sound, some issues)
- 75 = minor issues only (well-formed)
- 100 = exemplary (no issues detected)

The `min()` aggregation is the correct choice for a health audit. A skill with perfect structure (S=100) but a hardcoded secret (Y=0) should not score above 0. The "weakest link" model correctly reflects that health is a conjunctive property -- all dimensions must be adequate for the skill to be healthy. The worked example (S=75, Y=50, F=25, P=50 -> Overall=25) demonstrates this clearly.

One could argue for a weighted aggregation where Safety has higher weight, but the min() function already achieves this indirectly: safety failures tend to produce anchor 0 (V-Y1 blocks processing entirely), which automatically drags the overall to 0. No weighting math is needed.

**Verdict**: The anchor system is well-designed, the min() aggregation is correct, and the example makes the behavior unambiguous.

### 3. Auto-Routing Table (7/10)

**13 rules (V-S1 through V-P2) with specific remediation paths.**

The 13 rules that exist are correct and well-routed:

| Rule | Routing | Assessment |
|------|---------|------------|
| V-S1 (missing name) | bs-skill-forge | Correct |
| V-S2 (body < 500 bytes) | bs-skill-forge | Correct |
| V-S3 (body > 5000 words) | manual review | Correct -- needs human judgment |
| V-S4 (orphaned .gitkeep) | recommend deletion | Correct |
| V-S5 (unrecognized layout) | manual review | Correct |
| V-Y1 (hardcoded secret) | BLOCK | Correct -- safety override |
| V-Y2 (destructive cmd no guard) | manual review | Correct |
| V-Y3 (remote script exec) | manual review | Correct |
| V-F1 (stale > 90 days) | bs-skill-forge | Reasonable |
| V-F2 (broken external ref) | manual review | Correct |
| V-F3 (deprecated API) | flag for update | Correct |
| V-P1 (missing pattern attr) | docs/patterns/README.md | Correct |
| V-P2 (pattern-depth mismatch) | flag, reassess | Correct |

**However, there are gaps in the mapping from checklist items to auto-routing rules.** The Structural checklist (Perspective 1) has 6 check items, but only 5 V-S rules. Specifically:

- Checklist item: "Frontmatter has closing `---` delimiter (second occurrence after line 1)" -- this has an explicit `awk` verification command in the checklist but **no corresponding V-S rule**. A skill missing its closing `---` delimiter would be caught by the evaluator reading the checklist but would not trigger any auto-routing rule.

- Checklist item: "Required fields: `name` (kebab-case), `description` (starts with 'Use when')" -- V-S1 covers missing `name`, but there is **no rule for a description that exists but does not start with "Use when"**. This is a format violation, not a missing field.

- Checklist item: "SKILL.md is the only markdown file in the skill root" -- **no corresponding V-S rule**. Extra .md files in the skill root would be detected but not auto-routed.

Recommended additions:
- **V-S6**: Missing or malformed frontmatter closing delimiter -> Route to `bs-skill-forge`: fix YAML frontmatter syntax
- **V-S7**: Description does not start with "Use when" -> Route to `bs-skill-forge`: rewrite description to follow CSO convention
- **V-S8**: Extra .md files in skill root -> Route to manual review: move to subdirectory or remove

**Verdict**: The existing 13 rules are correct in their routing decisions. The gap is in completeness -- 3 checklist items lack corresponding auto-routing rules. This is a moderate issue because the evaluator would still flag these in the report; they just would not get automated remediation paths.

### 4. Safety Override (9/10)

**"V-Y (Safety) violations take absolute precedence over all other rules."**

The safety override is correctly implemented across three locations in the skill:

1. **Auto-routing table**: V-Y1 is the only rule with "BLOCK: refuse to process further" -- all other rules produce routes or flags. This is the strongest possible signal.

2. **Priority order declaration**: "V-Y > V-S > V-F > V-P" is stated explicitly after the auto-routing table. This ensures the agent processes safety findings before any other category.

3. **Report format**: The SUMMARY section orders remediation priorities as "V-Y findings first." This ensures safety issues appear at the top of any generated report, where they are least likely to be overlooked.

The override design correctly recognizes that safety failures are not quality issues -- they are stop-everything emergencies. A hardcoded secret in a skill file means that secret may already be in version control, in agent context windows, and potentially in logs. No amount of structural elegance or pattern alignment matters until the secret is revoked and removed.

**Minor ambiguity**: V-Y1 says "refuse to process further." Does this mean: (a) skip this specific skill and continue auditing others, or (b) abort the entire audit? The wording could be interpreted either way. In a multi-skill scan, aborting the entire audit because one skill has a secret is overly aggressive -- the other skills should still be audited. But processing other skills while a known secret exists in the scanned directory could expose the secret to more agent context. A clarification like "Refuse to process this skill further; continue auditing remaining skills but flag the blocked skill prominently in the report preamble" would resolve this.

**Verdict**: The override is well-designed and consistently applied. The one ambiguity around "refuse to process further" scope is minor and easily clarified.

### 5. Freshness Detection (8/10)

**Three-tier approach: git log -> find fallback -> "unverified" escape hatch.**

The 3-tier design is robust:

- **Tier 1 (git log)**: `git log --since='90 days ago' -- <skill-dir>/` -- this is the ideal method because it captures the semantic history (commits, reviews, modifications) rather than just filesystem timestamps. It works even if files were touched by a build tool without meaningful change.

- **Tier 2 (find fallback)**: `find <skill-dir> -name 'SKILL.md' -mtime -90` -- this catches modifications that may not have been committed yet. It is a reasonable fallback when git history is unavailable (shallow clone, no commits yet).

- **Tier 3 (unverified)**: If both fail, mark as "unverified" rather than "stale." This is the correct default -- assuming staleness when you cannot measure it would produce false positives that erode trust in the health report.

The definition of "exercised" is clear and practical: "modified, reviewed, or had its test prompts run within the window."

**Blind spot**: git log only captures committed changes. If a developer has been actively editing a skill in their working tree but has not committed, the skill will appear stale. The `find -mtime` fallback partially addresses this for the SKILL.md file itself, but it does not capture whether the skill was "reviewed" or "had test prompts run" -- those are semantic events that only git history (or an external log) can capture. For a Phase 1 implementation, this is acceptable. A future enhancement could check for uncommitted modifications via `git status --porcelain <skill-dir>/`.

The external reference freshness check (`curl -sI` for URLs, `gh api` for GitHub repos) is appropriate and includes an "unverified" fallback when the tools are unavailable.

**Verdict**: The 3-tier approach is well-designed. The git-only blind spot for uncommitted work is a known limitation, not a design flaw, and the `find` fallback provides partial mitigation.

### 6. Self-Application (7/10)

**Checklist item 6: "Run this skill against its own SKILL.md."**

This is a meta-circular check that asks the bs-skill-auditor auditor to audit the bs-skill-auditor SKILL.md itself. The question is whether this is practical insight or empty recursion.

**Arguments for practicality**:

1. The bs-skill-auditor SKILL.md is a SKILL.md file like any other. It has frontmatter, a body, claims pattern usage, and has a file modification date. All four perspectives can be meaningfully applied to it.

2. Self-application could catch real issues: Does bs-skill-auditor's own frontmatter pass the structural checks? Are its claimed patterns properly attributed in `docs/patterns/README.md`? Is its body within the 500-5000 word range? (At 1,746 words, it is.)

3. For a meta-skill, the ability to audit itself is a proof of correctness. If bs-skill-auditor cannot pass its own checks, something is wrong with either the skill or the checks.

**Arguments against practicality**:

1. The evaluator (an LLM) is simultaneously the subject and the auditor, which creates a potential for self-confirmation bias. The LLM might be lenient on its own output.

2. If self-application finds issues that require fixing the bs-skill-auditor SKILL.md, this creates a recursive loop: fix bs-skill-auditor, re-audit with the fixed version, potentially find new issues, repeat. The boundary rule about cycle detection addresses routing cycles but not self-modification cycles.

**Mitigation**: The skill instructs to "Note any self-flagged issues in the report preamble. Fix root-cause issues before the next audit cycle." This defers fixes to a separate cycle, which breaks the immediate recursion risk. The preamble note makes self-findings transparent rather than silently resolved.

**Verdict**: Self-application is more practical than circular. The deferral to "next audit cycle" is the key design choice that makes it work. The risk of bias exists but is inherent to any meta-skill and cannot be eliminated by design alone.

### 7. Report Format (9/10)

**The output template in Step 5.**

The report format is clear, scannable, and actionable:

- **Header block**: Scan date, counts, pass/fail/unassessable breakdown. This gives an immediate summary for someone who reads nothing else.

- **Per-skill details**: Each skill gets a 6-line block showing all four perspective anchors, pass/fail findings with rule IDs, overall anchor, and remediation paths. The format is dense but scannable -- someone can quickly identify which skills need attention and why.

- **Summary section**: Top remediation priorities ordered by severity (V-Y > V-S > V-F > V-P). This directly implements the safety override in the output format.

- **Compact mode**: For >20 skills, full details only for skills with overall < 75. Others get a one-line summary. This is a practical concession to token budgets -- a 50-skill scan with full details would be unreadable.

- **Clean scan message**: "No remediation required. All skills are healthy." This provides a clear terminal state so the reader knows the audit completed successfully with no issues, rather than wondering if the report was truncated.

The format correctly balances information density with readability. Each finding includes a rule ID, making it traceable back to the auto-routing table.

**Verdict**: The report format is well-designed. The compact mode and clean-scan message show attention to real-world usability.

### 8. Boundary Rules (8/10)

**Seven boundary rules at the top of the skill.**

The rules cover the critical edge cases:

1. **Read-only**: No modification during audit. This prevents the auditor from accidentally corrupting the skills it is auditing.

2. **No execution**: Static analysis only. This prevents the auditor from running potentially dangerous skills (which might have V-Y issues!).

3. **Orphaned .gitkeep handling**: Explicitly handled as V-S4 with anchor 0. Without this rule, an empty skill directory could confuse the scanner.

4. **Unrecognized layout handling**: Flagged as V-S5 with anchor 25. This catches directories that have content but no SKILL.md.

5. **Empty/inaccessible directory**: Anchor 0 overall and stop. This is a clean terminal state for a degenerate input.

6. **Cycle detection**: If auto-routing would create a cycle (bs-skill-auditor -> bs-skill-forge -> bs-skill-auditor), break by routing to manual review. This prevents infinite routing loops.

7. **Report save path**: `docs/reviews/bs-skill-auditor/<YYYY-MM-DD>-health-report.md` with directory creation if needed. This ensures the report has a predictable, versioned location.

**Gaps identified**:

1. **No rule for existing report file**: What happens if `docs/reviews/bs-skill-auditor/2026-06-17-health-report.md` already exists? Overwrite? Append? Create a suffixed version? This should be specified. Running the same audit twice on the same day is a realistic scenario (e.g., re-running after fixes).

2. **"Read-only" is declarative, not enforced**: The rule says "Do not modify any skill file during audit" but relies entirely on the agent following instructions. There is no technical enforcement mechanism. This is inherent to the skill-as-instructions paradigm and not a design flaw per se, but it is worth noting that a misbehaving agent could violate this constraint.

**Verdict**: The boundary rules cover the important edge cases. The two gaps (existing report file, enforcement mechanism) are minor and do not affect correctness.

---

## Strongest Aspect

**The Multi-Perspective Review Panel combined with the Confidence Anchor system.** These two patterns working together form the intellectual core of the skill. The four perspectives (S/Y/F/P) are orthogonal, collectively exhaustive for static analysis, and correctly prioritized via the safety override. The discrete anchor system with `min()` aggregation ensures that a skill cannot hide a critical failure behind strong scores in other dimensions. The worked example (S=75, Y=50, F=25, P=50 -> Overall=25) makes the aggregation behavior immediately clear.

This combination directly applies patterns documented in `docs/patterns/README.md` (Multi-Perspective Review Panel from Gstack/CE, Confidence Anchors from CE) and demonstrates them in a way that serves as a reference implementation for other skills in the toolkit.

---

## One Improvement

**Complete the checklist-to-auto-routing mapping.** Three items in the Structural Integrity checklist lack corresponding V-S rules in the auto-routing table:

| Checklist Item | Suggested Rule ID | Suggested Routing |
|---------------|-------------------|-------------------|
| Missing frontmatter closing `---` delimiter | V-S6 | Route to `bs-skill-forge`: fix YAML frontmatter syntax |
| Description does not start with "Use when" | V-S7 | Route to `bs-skill-forge`: rewrite description per CSO convention |
| Extra .md files in skill root | V-S8 | Route to manual review: move to subdirectory or remove |

Adding these three rules would bring the auto-routing table to full coverage of the Structural checklist (6 items, 8 rules -- the body size check needs two rules: V-S2 for too-small and V-S3 for too-large). This is a low-effort, high-value improvement that closes the only systematic gap in the design.

---

## Production-Ready Assessment

**Yes, with minor caveats.** The skill is production-ready for Phase 1 of the better-skills project. The design is sound, the report format is actionable, and the boundary rules prevent the most dangerous failure modes (modifying audited skills, executing untrusted code, infinite routing loops).

The issues identified in this review are all in the "improvement" category, not the "blocker" category:

| Issue | Severity | Blocker? |
|-------|----------|----------|
| Missing V-S6/V-S7/V-S8 auto-routing rules | Moderate | No -- findings are still reported, just not auto-routed |
| V-Y1 "refuse to process further" scope ambiguity | Minor | No -- either interpretation is safe |
| Freshness git-only blind spot for uncommitted work | Minor | No -- find fallback provides partial mitigation |
| No rule for existing report file on re-run | Minor | No -- manual resolution is acceptable for Phase 1 |

The skill correctly applies 7 documented patterns (Multi-Perspective Review Panel, Confidence Anchors, Self-Review Checklist, Verification Rules + Auto-Routing, Pipeline Architecture, Progressive Disclosure, Boundary Rules), and all source attributions in the skill body trace back to entries in `docs/patterns/README.md`.

The skill passes the structural checks it would apply to others: valid YAML frontmatter with `name` (kebab-case) and `description` (starts with "Use when"), body length of 1,746 words (within 500-5,000 range), and no hardcoded secrets or destructive commands.

---

*Review conducted 2026-06-17 by the Advocate agent in Gate 2 (Peer Review) of the 4-gate review pipeline.*
