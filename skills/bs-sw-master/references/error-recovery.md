<!-- Parent skill: skills/bs-sw-master/SKILL.md -->
<!-- Open this file when: any phase fails in a way that requires rollback or abort -->

# Error Recovery & Abort Procedures

> **Parent skill**: [../SKILL.md](../SKILL.md) — referenced from the `## Error Recovery & Abort` section of the main pipeline (the recovery table also points here)
>
> **Prerequisites**: Phase 2 (SETUP) was reached — at minimum a safety snapshot was attempted via [`scripts/safety-snapshot.sh`](../scripts/safety-snapshot.sh)
>
> **Depends on**: [`scripts/recover-from-snapshot.sh`](../scripts/recover-from-snapshot.sh) for the actual reset operation

## Overview

This file collects the recovery and abort procedures referenced from the main pipeline. Each entry maps a failure mode to a concrete response. Open it the moment something is wrong — do not improvise recovery in the main flow.

---

## Error Recovery Table

| Situation | Response |
|-----------|----------|
| Test framework not found | Ask the user which test runner and framework the project uses. Do not guess. |
| Monorepo with multiple test suites | Ask which package's test suite to run. |
| Worktree creation fails (dirty tree) | Tell the user to commit or stash changes first. Do not stash for them. |
| Full test suite fails after implementation | Revert the change, diagnose the failure, fix the root cause. |
| Slice scope creeps (more than ~50 lines) | Stop. Break it into smaller criteria and restart from RED. |
| User interrupts mid-flow | State which phase you are in and what remains. Save a fresh safety snapshot. |
| Implementation goes badly wrong | Run [`scripts/recover-from-snapshot.sh`](../scripts/recover-from-snapshot.sh) — see "Recovery from safety snapshot" below. |
| Push fails due to remote changes | Follow the rebase procedure in Phase 9 of [SKILL.md](../SKILL.md). |
| `git rebase` produces conflicts | Resolve manually, re-run the full test suite, push again. Never `--force` without explicit user approval. |
| Characterization test fails on first run | The code has a pre-existing bug. Stop and discuss with the user — do not enshrine the bug. See [characterization-tests.md](./characterization-tests.md). |

---

## Recovery from safety snapshot

If the implementation has gone off the rails — corrupted files, wrong branch, accidental destructive changes — restore from the snapshot created by `scripts/safety-snapshot.sh` in Phase 2.

### Quick path (interactive)

```bash
bash scripts/recover-from-snapshot.sh
```

The script lists available snapshots, prompts for the one to restore, performs `git reset --hard`, and prints follow-up verification commands.

### Non-interactive path

```bash
bash scripts/recover-from-snapshot.sh pre-dev-flow-1718578800
```

Pass the snapshot ref name directly. Useful when scripting recovery or when you already know which snapshot to restore.

### Manual path (when the script is unavailable)

```bash
# 1. List available snapshots
git tag -l "pre-dev-flow-*" --sort=-creatordate
git for-each-ref --format='%(refname:short)' --sort=-committerdate \
    'refs/heads/snapshot/pre-dev-flow-*'

# 2. Restore (replace <ref> with the snapshot you chose)
git reset --hard <ref>

# 3. Verify
git status
git diff <base-branch>..HEAD

# 4. If recovery succeeded and the snapshot is no longer needed, delete it:
git tag -d pre-dev-flow-<timestamp>          # if it was a tag
git branch -D snapshot/pre-dev-flow-<timestamp>  # if it was a branch
```

### After recovery

Recovery is a clean slate. **Do not salvage partial work.** Return to Phase 1 of the pipeline. The information that was in the half-finished change still lives in your head — re-derive the acceptance criteria, then run the pipeline again from RED. Salvage attempts after a hard reset are how subtle bugs crawl back in.

---

## Abort Procedure

If the user wants to cancel the entire task:

1. **Revert uncommitted changes** (only with explicit user approval):

   ```bash
   git checkout -- .
   git clean -fd
   ```

2. **If a worktree was created**, remove it:

   ```bash
   git worktree remove .claude/worktrees/<task-slug>
   ```

3. **Switch back to the original branch**:

   ```bash
   git checkout <original-branch>
   ```

4. **Clean up the safety snapshot** (optional — useful when the user knows they will not need it again):

   ```bash
   git tag -d pre-dev-flow-<timestamp>
   # or:
   git branch -D snapshot/pre-dev-flow-<timestamp>
   ```

5. **Summarize** what was done and what is uncommitted. Confirm the working tree is clean (`git status`).

The abort procedure is destructive — `git checkout -- .` and `git clean -fd` discard uncommitted work permanently. Always get explicit user approval before running them. If in doubt, stash first (`git stash push -u -m "pre-abort-$(date +%s)"`) and tell the user where the stash is.

---

## Related

- [SKILL.md Phase 2 — SETUP](../SKILL.md) — where the snapshot is created
- [SKILL.md Phase 9 — FINALIZE](../SKILL.md) — push & rebase procedures
- [scripts/safety-snapshot.sh](../scripts/safety-snapshot.sh) — snapshot creator
- [scripts/recover-from-snapshot.sh](../scripts/recover-from-snapshot.sh) — interactive recovery
- [characterization-tests.md](./characterization-tests.md) — what to do when the code is too broken to safely modify
