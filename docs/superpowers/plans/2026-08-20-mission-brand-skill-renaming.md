# Mission-Brand Skill Renaming Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use executing-plans to implement this plan task-by-task.

**Goal:** Rename all ten self-developed Skills to the approved short mission-brand identities without breaking historical installs, repository references, or review gates.

**Architecture:** `skills.json` remains the canonical registry. Final IDs own the physical directories and frontmatter names; every historical identity is a flat alias to one final ID. Human-facing H1s express the product identity, while frontmatter descriptions retain exact trigger and boundary semantics. CLI migration logic converges any legacy manifest state to one canonical entry.

**Tech Stack:** Node.js CommonJS CLI and test harness, Bash validation scripts, JSON/YAML/Markdown repository content, Git.

---

## Task 1: Lock the Final Naming and Alias Contracts in Tests

**Files:**

- Modify: `tools/test-cli.sh`
- Reference: `skills.json`

- [ ] Replace the current canonical expectations with this exact set:

```text
bs-prdefine
bs-insight-product
bs-prospect-customer
bs-prose-master
bs-ui-master
bs-social-card
bs-visual-article
bs-sw-master
bs-skill-auditor
bs-skill-forge
```

- [ ] Encode the direct historical alias families from the design document.
- [ ] Assert registry invariants: every target is canonical, no alias targets an alias, and no alias key is canonical.
- [ ] Extend the representative migration fixture to exercise three historical generations, alias-initiated update, canonical-plus-legacy coexistence, and update-all convergence.
- [ ] Run `bash tools/test-cli.sh` and confirm it fails because the final canonical directories and registry entries do not exist yet.

## Task 2: Rename the Physical Skill and Review Surfaces

**Files:**

- Rename: `skills/bs-define-requirements/` -> `skills/bs-prdefine/`
- Rename: `skills/bs-shape-product-direction/` -> `skills/bs-insight-product/`
- Rename: `skills/bs-find-early-customer-prospects/` -> `skills/bs-prospect-customer/`
- Rename: `skills/bs-improve-writing/` -> `skills/bs-prose-master/`
- Rename: `skills/bs-design-product-interface/` -> `skills/bs-ui-master/`
- Rename: `skills/bs-create-social-share-card/` -> `skills/bs-social-card/`
- Rename: `skills/bs-illustrate-article/` -> `skills/bs-visual-article/`
- Rename: `skills/bs-implement-code-change/` -> `skills/bs-sw-master/`
- Rename: `skills/bs-audit-agent-skills/` -> `skills/bs-skill-auditor/`
- Rename: `skills/bs-create-agent-skill/` -> `skills/bs-skill-forge/`
- Rename the matching ten directories under `docs/reviews/`.

- [ ] Move each directory explicitly and verify every source and destination before the move.
- [ ] Change each `SKILL.md` frontmatter `name` and H1 to its approved canonical/display pair.
- [ ] Rewrite descriptions so `PR`, `SW`, and the UI-versus-UX boundary are explicit.
- [ ] Update internal cross-Skill paths and names while retaining `pre-dev-flow-*` recovery artifacts.
- [ ] Run `bash tools/validate.sh skills/<final-name>/` for all ten Skills.

## Task 3: Migrate the Registry and Every Repository Reference

**Files:**

- Modify: `skills.json`
- Modify: `README.md`, `CLAUDE.md`, `AGENTS.md`
- Modify: `.github/external-name-correction.js`
- Modify: `lib/README.md`, `lib/commands/help.js`
- Modify: `evaluation/datasets/batch-1-test-prompts.json`
- Modify: matching files under `docs/patterns/`, `docs/research/`, `docs/reviews/`, and `docs/product-strategy/`
- Modify: all affected Skill references, scripts, and assets under `skills/`

- [ ] Replace current canonical IDs with final IDs on all active truth surfaces.
- [ ] Set the registry alias map to twenty-nine flat historical aliases with no `bs-social-card` alias key.
- [ ] Preserve all external Skill IDs and their `source` and `path` values byte-for-byte.
- [ ] Rename evaluation case IDs and expected paths to the final product identities.
- [ ] Use `rg` and path scans to classify every remaining historical identifier as an intentional migration reference.

## Task 4: Complete CLI Compatibility and Regression Coverage

**Files:**

- Verify/Modify: `lib/resolver.js`
- Verify/Modify: `lib/commands/add.js`
- Verify/Modify: `lib/commands/update.js`
- Modify: `tools/test-cli.sh`

- [ ] Verify one-hop resolution is safe because all aliases are flat.
- [ ] Verify `add <final>` detects any installed historical identity and exits with a migration instruction instead of duplicating it.
- [ ] Verify `update <final-or-alias>` removes all identities in that family and writes exactly one final entry.
- [ ] Verify no-argument update converges canonical-plus-legacy coexistence.
- [ ] Run `npm run test:cli` and require zero failures.

## Task 5: Run the Repository Gates and Portability Checks

**Files:**

- Verify: all implementation files

- [ ] Run `npm run prepublishOnly`.
- [ ] Run `node tools/peer-review.js check --all --json` and require all eleven self-developed Skills to pass after integrating the concurrent `bs-ppt-architecture` addition.
- [ ] Run `node tools/pattern-alignment.js --json` and require zero hard failures.
- [ ] Run `node evaluation/harness/runner.js --json` and require all eleven Skill suites to pass.
- [ ] Parse all eleven `SKILL.md` frontmatters with a standard YAML parser; require matching names and descriptions no longer than 1024 characters.
- [ ] Load every canonical and alias identity through the runtime resolver; require 40 of 40 successful loads after the concurrent addition.
- [ ] Compare external IDs, sources, and paths against `HEAD`; require 9 of 9 unchanged.

## Task 6: Obtain Dedicated Independent Review

**Files:**

- Review: full working tree and all acceptance evidence

- [ ] Launch a dedicated read-only Agent after implementation.
- [ ] Ask it to audit semantic accuracy, path/frontmatter/registry consistency, portable YAML, direct-alias invariants, migration behavior, external invariants, residual identifiers, test coverage, and staging risk.
- [ ] Fix every blocking finding and request a focused re-review.
- [ ] Proceed only after the reviewer reports no blocking findings.

## Task 7: Stage, Commit, and Push in Clean Batches

**Files:**

- Stage only files belonging to this delivery; exclude unrelated `.claude/`, `.codex/`, and other pre-existing user work unless required by the rename.

- [ ] Run `git diff --check`, syntax checks, and the complete acceptance suite once more.
- [ ] Audit `git status --short`, `git diff --stat`, and `git diff --cached` before each commit.
- [ ] Commit the approved design and plan with `docs: define mission-brand skill naming contract`.
- [ ] Commit the verified implementation with `refactor: rename self-developed skills by mission`.
- [ ] Push the resulting branch to `origin` only after both batches are verified.
- [ ] Confirm the pushed commit IDs and report any intentionally uncommitted user-owned changes.
