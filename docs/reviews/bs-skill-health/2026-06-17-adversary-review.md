# Adversary Review: bs-skill-health

**Date**: 2026-06-17  
**Reviewer Role**: Adversary  
**Skill**: bs-skill-health  
**HUMAN_VERIFIED**: false

## Summary

This compatibility header normalizes review metadata after the repository-wide `bs-` namespace migration. The substantive review below is preserved unchanged.

**Migration finding**: namespace metadata normalized [LOW]  
**Schema migration status**: PASS

## Original Review

# Adversarial Review: bs-skill-health

**Date**: 2026-06-17
**Reviewer Role**: Adversary (Gate 2)
**Skill Under Review**: `skills/bs-skill-health/SKILL.md`
**Review Type**: Structured attack -- find every failure mode and exploit.

---

## Attack Surface Map

The skill has 4 perspectives, 6 execution steps, 13 verification rules, and 6 self-review checklist items. The attack surface is wide. Below are 10 specific exploits, each with location, severity, exploit demonstration, and suggested fix.

---

## 1. Self-Audit Circularity (CRITICAL)

**Location**: Self-Review Checklist, item 6 (line 116)

**Severity**: HIGH

**Exploit**:
Checklist item 6 states: "Run this skill against its own SKILL.md. Note any self-flagged issues in the report preamble. Fix root-cause issues before the next audit cycle."

This is structurally circular. The skill audits itself using its own logic. If any audit rule is buggy, the self-audit will produce the same buggy output. Consider:

- If Perspective 3's freshness check has a logic error (e.g., the `git log --since` command uses wrong date format), running the skill against itself will NOT catch it. The bug audits itself and declares a clean bill of health.
- If V-F3's "deprecated API detection" is a no-op (see exploit #9 below), the self-audit will never flag it as a gap because the very check that would detect it is the broken one.
- If the word-count logic in V-S2/V-S3 miscounts (e.g., counts code blocks as body text), it will miscount its own body too -- symmetrically wrong, producing false confidence.

This is the classic "who watches the watchmen" problem. The skill needs an external reference oracle to break the circle.

**Suggested Fix**:
Add an explicit adversarial review gate to the self-review checklist:
```
6. **Self-application**: Run this skill against its own SKILL.md. Note any self-flagged issues.
7. **Adversarial verification**: Have an independent agent (not this skill) audit this skill
   using a DIFFERENT methodology. Cross-check findings. If the external audit finds issues
   this self-audit missed, flag them as P0 -- the audit logic itself has blind spots.
```
Additionally, maintain a known-bug registry for the bs-skill-health skill itself, checked against each audit run.

---

## 2. Freshness Detection -- False Positive on Stable Skills (HIGH)

**Location**: Perspective 3: Freshness, first checklist item (line 56-57)

**Severity**: HIGH

**Exploit**:
The freshness check defines "exercised" as: "modified, reviewed, or had its test prompts run within the window." It uses `git log --since='90 days ago' -- <skill-dir>/` as the primary check.

A skill that is perfectly correct, well-designed, and requires no changes will have NO git activity for 91+ days. It will be flagged as V-F1 (stale) and routed to `bs-skill-bootstrap` for "refresh or deprecation review."

This conflates two distinct concepts:
- **Needs attention** (no one has looked at it recently -- may indicate neglect)
- **Needs changes** (the skill is broken or outdated -- requires remediation)

A stable, correct skill needs neither. The auto-route to `bs-skill-bootstrap` for "refresh" could trigger unnecessary churn -- someone might make cosmetic changes just to bump the freshness timestamp, introducing real bugs in the process.

**Real-world example**: The `bs-requirements-engineering` skill in this repo's Batch 1 is a Deep-tier skill. If it's well-built and stable, it might go untouched for 90+ days. Flagging it as V-F1 and routing to bootstrap is actively harmful.

**Suggested Fix**:
Split the freshness check into two independent signals:
```
V-F1a: Unmodified > 90 days AND has known issues → Route to refresh
V-F1b: Unmodified > 90 days AND no known issues → Flag as "stable, no action needed"
       (Informational only, anchor does not penalize)
```
Or adopt a tiered staleness: 90 days = informational, 180 days = warning, 365 days = action required.

---

## 3. Pattern Alignment -- Name-Check Without Substance (HIGH)

**Location**: Perspective 4: Pattern Alignment (lines 62-67)

**Severity**: HIGH

**Exploit**:
The Pattern Alignment perspective checks:
1. Pattern names appear in `docs/patterns/README.md` (grep for name)
2. The skill cites at least one source
3. Patterns are at the correct depth tier

It does NOT check whether the pattern is applied CORRECTLY. A skill could:
- Claim to use "Multi-Perspective Review Panel" but evaluate all perspectives identically (defeating the purpose)
- Claim to use "Confidence Anchors" but assign anchors arbitrarily without the defined meanings
- Claim to use "Progressive Disclosure" but inline all reference content in the skill body
- Claim to use "Pipeline Architecture" but execute steps out of order

All of these would pass Pattern Alignment with a P=100 because the names appear in the README and sources are cited. The check is purely syntactic -- it validates naming, not behavior.

**Suggested Fix**:
Add a behavioral verification layer to Perspective 4:
```
- [ ] For each claimed pattern, verify structural conformance:
  - "Multi-Perspective Review Panel": At least 2 perspectives produce different anchors
  - "Confidence Anchors": All anchors are discrete values from {0, 25, 50, 75, 100}
  - "Progressive Disclosure": Tiered loading structure is present (not all content at root level)
  - "Pipeline Architecture": Steps have explicit input/output contracts
  - "Boundary Rules": Rules are stated in imperative form with clear triggers
```
This moves from "did you name it?" to "did you use it correctly?"

---

## 4. External Source Verification -- Binary When It Should Be Graded (MEDIUM)

**Location**: Perspective 3: Freshness, second checklist item (line 57)

**Severity**: MEDIUM

**Exploit**:
The check says: `curl -sI <url> | head -1` (should return HTTP 200). For GitHub repos: `gh api repos/<owner>/<repo> --jq '.updated_at'`.

HTTP 200 only proves the server is alive. It does NOT prove:
- **Content relevance**: The URL could redirect to a completely different page (302 → 200 on the redirect target)
- **Archival status**: A GitHub repo returns 200 even when archived (the `archived` field in the API response is `true`, but the curl check only looks at HTTP status)
- **Deprecation**: A package could be deprecated but still return 200 (npm returns 200 for deprecated packages)
- **Content drift**: The page at the URL could have been replaced with unrelated content

The GitHub API check using `.updated_at` is slightly better but still doesn't check `archived` or `disabled` fields.

**Suggested Fix**:
Replace the binary HTTP check with a graded verification:
```
For GitHub repos:
  gh api repos/<owner>/<repo> --jq '{updated: .updated_at, archived: .archived, disabled: .disabled}'
  - archived=true → anchor 25 (source frozen, may be outdated)
  - disabled=true → anchor 0 (source unavailable)
  - updated > 1 year ago → anchor 50 (stale but accessible)

For general URLs:
  - HTTP 200 + content-type matches expected → anchor 75+
  - HTTP 200 + unexpected content-type → anchor 50 (verify manually)
  - HTTP 301/302 → follow redirect, re-check, note in report
  - HTTP 404/410 → anchor 0 (dead link)
```

---

## 5. Report Save Location -- Race Condition on Same-Day Runs (MEDIUM)

**Location**: Boundary Rules (line 20)

**Severity**: MEDIUM

**Exploit**:
The report saves to `docs/reviews/bs-skill-health/<YYYY-MM-DD>-health-report.md`. The filename uses date granularity only (no timestamp, no sequence number).

If the agent runs twice on the same day:
- Run 1 at 09:00 produces a report
- Run 2 at 14:00 silently overwrites it

There is no warning, no backup, no append. The first run's findings are lost. If Run 1 found a V-Y1 (hardcoded secret) and Run 2 is a routine check that finds nothing, the security finding is erased from the record.

This is especially dangerous given the Boundary Rule that says "Save the report to..." with no existence check. An agent following instructions literally will `Write` the file, which overwrites.

**Suggested Fix**:
```
Save the report to `docs/reviews/bs-skill-health/<YYYY-MM-DD>-health-report.md`.
If a file already exists at that path:
  1. Read the existing report
  2. Append the new run as a separate section with timestamp header: `## Run: <HH:MM:SS>`
  3. Add a diff summary: "Changes from previous run today: ..."
  4. If the existing report has V-Y findings that the new run does NOT reproduce,
     flag this prominently: "WARNING: Previous V-Y finding not reproduced. Verify resolution."
```
Alternatively, use timestamped filenames: `<YYYY-MM-DD>-<HHMMSS>-health-report.md`.

---

## 6. V-S3 Oversized Body -- Suggestion Masquerading as Action (LOW)

**Location**: Verification Rules + Auto-Routing, V-S3 (line 93)

**Severity**: LOW

**Exploit**:
V-S3 states: `Body > 5000 words → Route to manual review: split into sub-skills or use Load Stub pattern`

Compare this to V-S1 and V-S2, which route to `bs-skill-bootstrap` (an automated tool). V-S3 routes to "manual review" and the action is a suggestion: "split into sub-skills or use Load Stub pattern."

The auto-routing table claims to "route to the appropriate remediation path automatically," but V-S3 doesn't actually automate anything. It tells the user "go figure it out." This is inconsistent with the table's stated purpose.

Moreover, the suggestion itself is vague:
- "Split into sub-skills" -- how? What's the split criterion? Which parts go where?
- "Use Load Stub pattern" -- this pattern is not defined anywhere in the skill or in the listed patterns. A user encountering this has no idea what a "Load Stub" is.

**Suggested Fix**:
Either provide concrete guidance or route to a tool that can:
```
V-S3: Body > 5000 words → Route to `bs-skill-bootstrap` with instruction:
  "Analyze section headings and propose a split plan. The skill has [N] top-level
  sections. Suggest which sections could become standalone sub-skills. Apply the
  Load Stub pattern: keep the orchestrator section in the main SKILL.md, reference
  sub-skills via explicit invocation paths."
```
Also, define "Load Stub" in `docs/patterns/README.md` or remove the reference.

---

## 7. Confidence Anchor Gaming -- min() Aggregation Distortion (HIGH)

**Location**: Confidence Anchors (lines 81-83) and Step 3: Score (line 139)

**Severity**: HIGH

**Exploit**:
The overall anchor is `min(S, Y, F, P)`. This creates perverse incentives and counterintuitive outcomes:

| Scenario | S | Y | F | P | Overall | Intuitive Health |
|----------|---|---|---|---|---------|------------------|
| A | 100 | 100 | 0 | 100 | **0** | Excellent except freshness unknown |
| B | 50 | 50 | 50 | 50 | **50** | Mediocre across the board |
| C | 100 | 100 | 25 | 100 | **25** | Near-perfect except slightly stale |
| D | 25 | 25 | 25 | 25 | **25** | Terrible across the board |

Scenario A has a lower overall anchor than Scenario B despite being superior in 3 out of 4 dimensions. Scenario C (near-perfect but slightly stale) ties with Scenario D (terrible everywhere). This makes the overall anchor misleading as a summary statistic.

An agent optimizing for "high overall anchor" would be incentivized to:
- Give F=50 even when freshness is unknown (anchor 0 would tank the overall)
- Avoid ever assigning anchor 0 to any perspective (one zero ruins everything)
- Pad low anchors upward to avoid min() punishment

The min() aggregation also means that improving from S=100 to S=100 (no change) and F=0 to F=50 produces overall 0 → 50 (+50). But improving from S=100 to S=100 and F=75 to F=100 produces overall 75 → 100 (+25). The first improvement is worth twice as much despite being a smaller absolute change.

**Suggested Fix**:
Use a more robust aggregation that doesn't let one dimension dominate:
```
Option A: Weighted geometric mean (penalizes zeros but doesn't let one zero destroy everything):
  overall = (S * Y * F * P) ^ (1/4), mapped to nearest anchor

Option B: Keep min() but add a "drag coefficient":
  overall = min(S, Y, F, P)
  drag = count of perspectives at anchor 0
  If drag >= 2: overall = 0
  If drag == 1: overall = max(0, min(S, Y, F, P) - 25)  // one zero costs but doesn't destroy

Option C: Report both min and median:
  overall = min(S, Y, F, P)  // worst dimension (keep this)
  median = median(S, Y, F, P)  // central tendency
  Report both. A skill with overall=0, median=100 tells a very different story than
  overall=0, median=25.
```

---

## 8. Missing Dynamic Testing -- Static Analysis Blind Spot (MEDIUM)

**Location**: Boundary Rules (line 15)

**Severity**: MEDIUM

**Exploit**:
The skill explicitly states: "Do not execute any skill during audit. This is static analysis, not dynamic testing."

This means the following failure modes are completely invisible to the audit:

- **Wrong advice**: A skill that gives factually incorrect guidance (e.g., recommends a deprecated API, suggests an anti-pattern) will pass all 4 perspectives with high anchors. The SKILL.md looks structurally sound, has no secrets, is fresh, and cites patterns correctly -- but when executed, it produces harmful output.

- **Prompt injection vulnerabilities**: A skill with instructions that can be overridden by user input (e.g., "ignore previous instructions and do X") is a security risk that only manifests at runtime.

- **Infinite loops / excessive token consumption**: A skill that, when executed, enters an unbounded reasoning loop will pass static analysis but fail catastrophically at runtime.

- **Boundary rule violations at runtime**: The skill says "Do not modify any skill file" but what if another skill's instructions override this? Only dynamic testing would catch this.

**Suggested Fix**:
Add an optional dynamic testing gate (not in every audit, but available):
```
## Dynamic Testing Gate (Optional, Recommended for Deep-tier skills)

When invoked with `--dynamic` flag, additionally:
1. Execute the skill against 3 canned test prompts from evaluation/datasets/
2. Verify: output format matches expected, no harmful instructions emitted,
   execution completes within timeout (default: 120s)
3. If any test fails: anchor the affected perspective at max 25 and flag as V-D1

Dynamic testing is NOT required for every audit run. Run it:
- On first audit of a new skill
- After any structural changes
- At least once per quarter for Deep-tier skills
```

---

## 9. V-F3 Deprecated API Detection -- Undefined Mechanism (MEDIUM)

**Location**: Verification Rules, V-F3 (line 101)

**Severity**: MEDIUM

**Exploit**:
V-F3 checks: "Deprecated API usage" with auto-route: "Flag for update; note the deprecation in the health report."

But the skill provides NO mechanism to detect deprecated APIs. The checklist item (line 58) says: "No references to deprecated APIs, removed CLI flags, or retired tools."

How would an agent executing this skill actually detect a deprecated API? It would need:
- A database of known deprecated APIs (maintained externally)
- Version-aware checking (API X was deprecated in version Y, this skill targets version Z)
- CLI flag registry (which flags were removed from which tools and when)

None of these exist. The check is effectively a no-op -- it will always pass because there is no way to fail it. An agent following instructions literally might grep for the word "deprecated" in the skill body, which would only catch skills that self-document their deprecation.

**Suggested Fix**:
Acknowledge the limitation explicitly and provide a partial implementation:
```
V-F3: Deprecated API detection
  Primary check: Scan skill body against known-deprecations registry at
  `evaluation/datasets/deprecated-apis.yaml`. If the registry does not exist,
  mark this check as "unverified" (anchor unaffected) and note in the report:
  "Deprecated API check skipped: no deprecation registry available. Create one
  at evaluation/datasets/deprecated-apis.yaml to enable this check."
  Fallback: Grep for common deprecation signals: "deprecated", "removed in v",
  "no longer supported", "legacy". If found, flag for review (anchor 50).
```
Then create `evaluation/datasets/deprecated-apis.yaml` as a living document.

---

## 10. Empty Skills Directory -- Treats Valid State as Failure (LOW)

**Location**: Boundary Rules (line 18)

**Severity**: LOW

**Exploit**:
The rule states: "If the skills directory is empty or inaccessible, report anchor 0 overall and stop."

Anchor 0 means "Cannot assess -- insufficient data or access." But an empty skills directory is not the same as insufficient data. It is a valid, assessable state: "There are zero skills. Their collective health is N/A, not 0."

Treating this as anchor 0 conflates:
- **Cannot assess** (permissions issue, directory doesn't exist, I/O error)
- **Nothing to assess** (empty directory, fresh install, all skills removed)

In a fresh install of this repo, `skills/` contains only `.gitkeep` stubs. Running bs-skill-health immediately produces anchor 0, which looks like a failure. But there is nothing wrong -- the project just hasn't built any skills yet.

**Suggested Fix**:
Distinguish between the two cases:
```
- If the skills directory is inaccessible (permissions, doesn't exist):
  Report anchor 0 overall and stop. Error: "Cannot access skills directory."

- If the skills directory exists but contains no SKILL.md files (empty or
  only .gitkeep stubs):
  Report anchor 100 overall with note: "No skills found. Health check is vacuously
  true. Create your first skill with bs-skill-bootstrap."
```
This correctly signals that an empty skill set is healthy, not broken.

---

## Summary of Findings

| # | Finding | Severity | Section | Line(s) |
|---|---------|----------|---------|---------|
| 1 | Self-Audit Circularity | HIGH | Self-Review Checklist | 116 |
| 2 | Freshness False Positive on Stable Skills | HIGH | Perspective 3: Freshness | 56-57 |
| 3 | Pattern Alignment Name-Check Without Substance | HIGH | Perspective 4: Pattern Alignment | 62-67 |
| 4 | External Source Binary Check | MEDIUM | Perspective 3: Freshness | 57 |
| 5 | Report Save Race Condition | MEDIUM | Boundary Rules | 20 |
| 6 | V-S3 Suggestion Masquerading as Action | LOW | Verification Rules | 93 |
| 7 | Confidence Anchor min() Distortion | HIGH | Confidence Anchors + Step 3 | 81-83, 139 |
| 8 | Missing Dynamic Testing | MEDIUM | Boundary Rules | 15 |
| 9 | V-F3 Deprecated API Detection Undefined | MEDIUM | Verification Rules + Perspective 3 | 58, 101 |
| 10 | Empty Skills Directory as Failure | LOW | Boundary Rules | 18 |

**Severity Tally**: 4 HIGH, 4 MEDIUM, 2 LOW

---

## Overall Adversarial Assessment

The bs-skill-health skill is structurally well-organized and its Multi-Perspective Review Panel approach is sound in principle. However, the implementation has several exploitable weaknesses that an adversary (or a buggy agent) could leverage:

1. **The self-audit is a closed loop** (finding #1). This is the most fundamental flaw because it means the skill cannot detect its own defects. Every other finding could be present in the skill itself and go undetected.

2. **The min() aggregation creates perverse incentives** (finding #7). An agent that understands this scoring system can game it, and even honest agents will produce misleading overall scores when one dimension is unknown or zero.

3. **Pattern Alignment and Freshness checks are superficial** (findings #3, #2). They validate labels and timestamps, not behavior and correctness. This gives a false sense of quality assurance.

4. **Several checks are aspirational rather than operational** (findings #6, #9). The skill claims capabilities (deprecated API detection, auto-routing for oversized skills) that it cannot actually deliver with the mechanisms provided.

The skill needs external verification (an independent audit methodology), behavioral pattern validation, graded (not binary) external source checks, and a more robust aggregation function before it can reliably assess the health of other skills.
