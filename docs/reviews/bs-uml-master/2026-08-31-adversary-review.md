# Adversary Review: bs-uml-master

**Date**: 2026-08-31
**Reviewer Role**: Adversary
**Skill**: bs-uml-master
**HUMAN_VERIFIED**: false
**Scope Contract Version**: 1
**Reviewed Revision**: a226e119365b7797ad9a24697f053a1337d198de
**Reviewed Skill SHA-256**: 2f3322de034c9ee6ca0bb5e1326274b04845f90a04895b79c7c74e1cbe0bc263
**Reviewed Manifest SHA-256**: 30e875cb2b76a829d059c533bb8638ab97c5595c258ee615815bc5ab3f3d4394

## Summary

Final confirmation pass over checker v4 (revision a226e11), closing four rounds of empirical adversary review. All ten previously reported blocking findings — six from the R3 round and four residuals from my R3.2 probes — are verified fixed by re-running my own original exploit fixtures against the v4 checker (every exploit now fails or counts correctly, with zero regressions across 17 fixtures) and by the expanded in-repo self-test (18/18 passing, now encoding fixtures 11 to 14 for my residuals). One LOW finding remains open by design: delivery receipts are self-attested until Phase 2.A generate/verify separation lands (ledger IP-9). Worst-case remaining impact is a determined agent fabricating a receipt the format checker cannot falsify — documented inside the checker itself and tracked in the ledger.

## Evidence Reviewed

Full manifest receipt `30e875cb2b76a829d059c533bb8638ab97c5595c258ee615815bc5ab3f3d4394` was received and independently verified.

All 18 manifest entries recomputed with sha256sum and confirmed against the prompt manifest and working tree; git rev-parse HEAD equals the recorded revision a226e119365b7797ad9a24697f053a1337d198de. Skill content files are hash-identical to the 16a1ae4 round except `scripts/check-delivery.js` and `scripts/test-check-delivery.js` (the v4 fix), and the upstream-synced `tools/peer-review.js`, `tools/test-peer-review-scope.js`, and `evaluation/datasets/batch-1-test-prompts.json` (diff inspected: the dataset change touches only bs-reflect-loop entries; the four bs-uml-master eval prompts are unchanged). All reference modules, SKILL.md, and check-mermaid.js carried from my prior full-read passes.

Files and commands examined or rerun this round:

- `git diff 16a1ae4..a226e11 -- skills/bs-uml-master/scripts/` read line-by-line: quoted multiplicities removed before the classDiagram relation parse; the bare "version" token dropped from TOOL_VERSION; `fences()` now returns every diagram-shaped fence, all type-checked, budget on the max count; fenceless blocks FAIL unless an external source-file reference (.mmd/.puml/.svg/.txt) is present, which downgrades to WARN; self-test fixtures 11 to 14 added covering exactly my F8 to F11 fixtures.
- `node skills/bs-uml-master/scripts/test-check-delivery.js` — 18/18 fixtures, ALL PASS, exit 0.
- Re-ran my complete attack-fixture suite (13 files) against v4: multiplicity-styled edges-only classDiagram now counts ~18 and FAILs the ceiling; "version 3.2 of my careful process" now FAILs C2; the decoy-fence delivery now FAILs on the 17-class real fence via max-count; the fenceless external-file delivery WARNs (and the self-test's no-source variant FAILs); all prior-round outcomes preserved — honest deliveries pass (fx1, fx9 receipts-first, fxS compressed sketch), the Haiku fake, bare label, fake receipt, clock-time citation, 21-element edges-only, 17-component PlantUML, tag laundering, and frontmatter variants all still FAIL for the right reasons.
- `sed`/`grep` read of the new `tools/peer-review.js` disposition contract (release-eligibility logic) to confirm this review's own structural obligations.

## Findings

### F1: Budget counter blind to edges-only class diagrams; flowchart label inflation; SKILL.md overclaimed WARN as reject [MEDIUM] [RESOLVED]

**Location**: `skills/bs-uml-master/scripts/check-delivery.js` countPrimary; SKILL.md Output Contract paragraph.
**Exploit scenario**: In R3 a 12-relation classDiagram with no class declarations counted 0 elements; parenthesized edge-label words inflated flowchart counts; SKILL.md claimed the checker "rejects unjustified budget overruns" when 10 to 15 only warned.
**Root cause**: Declaration-only counting, unanchored id regex, prose written from intent rather than behavior.
**Suggested fix**: Applied in R3.2 and verified again on v4: relation-line counting (my fixture now counts ~21 and FAILs the ceiling), noise stripping (label fixture counts ~4), SKILL.md states the real WARN/FAIL tiers and declares counting heuristic. Retested this round: no regression.

### F2: Compressed sketch delivery was jointly unsatisfiable with the Minimum Compliant Path [MEDIUM] [RESOLVED]

**Location**: SKILL.md Significance and Minimum Compliant Path step 6; checker C1/C3/C4.
**Exploit scenario**: In R3 the skill-legal sketch form (source plus state line) hard-failed the checker the recipe forbids skipping, teaching agents that FAILs are advisory.
**Root cause**: The checker validated only the full contract shape.
**Suggested fix**: Applied in R3.2 and verified again on v4: sketch significance relaxes C1/C3/C4 to WARN while the state line stays mandatory; my compressed-sketch fixture passes with warnings only; MCP step 6 names the compressed form. Retested this round: no regression.

### F3: PlantUML sources escaped the type and budget checks entirely [MEDIUM] [RESOLVED]

**Location**: `check-delivery.js` typeMatchesHeader and countPrimary.
**Exploit scenario**: In R3 a 17-component PlantUML delivery over the hard ceiling passed with zero FAILs, letting an agent duck the budget by choosing the backend Rule 8 mandates for five diagram types.
**Root cause**: The checker was built from the Mermaid-only Haiku sample.
**Suggested fix**: Applied in R3.2 and verified again on v4: PlantUML declaration/relation counting (fixture FAILs at ~17) plus per-type content markers with a negative self-test fixture. Retested this round: no regression.

### F4: Receipt and citation regexes were satisfied by incidental prose [MEDIUM] [RESOLVED]

**Location**: `check-delivery.js` TOOL_VERSION and FILE_LINE.
**Exploit scenario**: In R3, "checked 3.2 boxes carefully" passed as a tool receipt and "inspected at 14:32" satisfied the MODEL-FROM-CODE citation requirement.
**Root cause**: An any-word version anchor and a bare colon-digits catch-all.
**Suggested fix**: Applied in R3.2 and verified again on v4: tool-shaped token required; path.ext adjacency required; both original fixtures FAIL. The residual "version" token hole is F9 below. Retested this round: no regression.

### F5: The R3.1 PlantUML guard enabled fence-tag laundering [MEDIUM] [RESOLVED]

**Location**: `check-delivery.js` typeMatchesHeader PlantUML guard.
**Exploit scenario**: Tagging a graph TB fake as a plantuml fence bypassed the fake-notation check that is the checker's headline purpose.
**Root cause**: The guard keyed on the author-controlled language tag instead of the source.
**Suggested fix**: Applied in R3.2 and verified again on v4: a plantuml-tagged fence without a PlantUML header FAILs explicitly as tag laundering; my exact exploit fixture still FAILs. Retested this round: no regression.

### F6: First-fence targeting false-failed receipts-first deliveries; frontmatter trailing space defeated the strip [MEDIUM] [RESOLVED]

**Location**: `check-delivery.js` fence selection and stripFrontmatter.
**Exploit scenario**: An honest delivery leading with a bash receipts block FAILed C5 against the bash command line (perverse incentive to delete receipts); a trailing-space frontmatter close, which mermaid 11.17.2 accepts (probed), broke header detection.
**Root cause**: Positional fence selection; exact-delimiter frontmatter regex.
**Suggested fix**: Applied in R3.2 and verified again on v4: fences selected by language/header (receipts-first fixture passes) and trailing-space delimiters tolerated. The fenceless sub-case is F11 below. Retested this round: no regression.

### F8: Multiplicity-styled edges-only class diagrams counted ~0, reopening the ceiling bypass in the notation uml-semantics.md mandates [MEDIUM] [RESOLVED]

**Location**: `check-delivery.js` countPrimary classDiagram branch (v3 stripNoise interplay).
**Exploit scenario**: An 18-class diagram written entirely as relation lines with quoted multiplicities counted ~0 on v3 and passed clean, precisely for by-the-book domain models.
**Root cause**: stripNoise blanked multiplicity strings into tokens the relation regex could not cross.
**Suggested fix**: Applied in v4 (quoted multiplicities removed before the relation parse) and verified: my fxM fixture now counts ~18 and FAILs the hard ceiling; self-test fixture 11 encodes it. Retested this round on the committed checker: fixed.

### F9: The bare "version" token readmitted prose-shaped receipts [LOW] [RESOLVED]

**Location**: `check-delivery.js` TOOL_VERSION token list.
**Exploit scenario**: "RENDER_VERIFIED — version 3.2 of my careful process" passed C2 on v3, dodging the fix's own goal by another everyday phrase.
**Root cause**: "version" whitelisted without requiring a tool name.
**Suggested fix**: Applied in v4 (token dropped) and verified: my fxV fixture now FAILs C2; honest forms still pass because real receipts name the tool; self-test fixture 12 encodes it. Retested this round: fixed.

### F10: Fence selection could be decoyed — checks ran on the first matching fence [LOW] [RESOLVED]

**Location**: `check-delivery.js` fences selection and C5/C6 application.
**Exploit scenario**: A one-class legend fence placed before a 17-class real fence got C5/C6 run on the decoy on v3, passing clean.
**Root cause**: One-fence-per-block assumption.
**Suggested fix**: Applied in v4: every diagram-shaped fence is type-checked and the budget uses the max count; my fxDecoy fixture now FAILs the ceiling at ~17; self-test fixture 13 encodes it. Note the flip side: a legend fence of a genuinely different diagram type now FAILs C5 — acceptable strictness since the contract sanctions one source block per delivery. Retested this round: fixed.

### F11: Fenceless deliveries skipped C5/C6 with PASS semantics [LOW] [RESOLVED]

**Location**: `check-delivery.js` no-fence branch.
**Exploit scenario**: A delivery whose only source was a prose mention of an external file passed everything on v3 with a friendly note, a one-line dodge of both structural checks.
**Root cause**: Skip-on-absence with PASS semantics.
**Suggested fix**: Applied in v4: no fence and no external source-file reference is a FAIL; with a file reference it is a WARN naming what could not be verified; self-test fixture 14 covers both arms, and my fx7 fixture now draws the WARN. A receipt line mentioning the rendered .svg also satisfies the file-reference test, so the WARN arm is reachable via ordinary receipts — acceptable, since the arm is a warning that names the unverified surface, not a pass. Retested this round: fixed.

### F12: Delivery receipts remain self-attested pending Phase 2.A — the checker binds format, not truth [LOW] [OPEN]

**Location**: Design level: `check-delivery.js` header comment; SKILL.md compliance-theater red-flag row; improvement-points ledger IP-9.
**Exploit scenario**: A determined or self-deceiving agent can still type a well-formed receipt (tool, version, claim) without having run anything; no text checker can falsify an event it did not observe. The forward test shows the floor holding on the weak-model class that motivated it; it cannot show the ceiling.
**Root cause**: Generate and verify live in the same context until Phase 2.A separation lands.
**Suggested fix**: Keep IP-9 open (it is, correctly); when Phase 2.A lands, have the verify context re-run the named command and diff the claimed receipt against observed output. No action required this round; recorded so the deterministic checker is not mistaken for fabrication-proof.

## Verdict

**Verdict**: APPROVED

Across four empirical rounds every blocking finding I raised has been fixed, and each fix was verified by re-running my own original exploit fixtures against the committed tool rather than by reading diffs: the v4 checker closes all four R3.2 residuals (multiplicity counting, prose "version" receipts, decoy fences, fenceless skips), the expanded self-test encodes the complete failure-vector history at 18/18 so none of it can silently regress, and the full 13-fixture regression sweep shows honest deliveries passing while every fake, laundering, inflation, and omission fixture fails for the stated reason. The upstream-synced dataset change leaves the bs-uml-master eval entries untouched, and the skill content is hash-identical to the previously approved 16a1ae4 revision apart from the checker fix itself. The single open finding is a LOW, honestly documented design ceiling (self-attested receipts, ledger IP-9) owned by Phase 2.A rather than this skill's current scope. No claim the skill makes about its own tooling failed an empirical probe this round; the skill is release-eligible from the adversary side.
