#!/bin/bash
# Parent skill: skills/bs-sw-master/SKILL.md
# Purpose: Detect abandoned worktrees from crashed or interrupted sessions before creating a new one.
# Called from: Phase 2 (SETUP) of SKILL.md, run before `git worktree add`
# Prerequisites: cwd is the repo root that may contain .claude/worktrees/<task-slug>/
#
# Bug fix vs. the prior inline version: the inline bash in earlier SKILL.md drafts was
# missing one `fi`. The outer `if [ -d "$wt" ]; then ... ; done` block never closed,
# so the script silently failed in shells that don't tolerate the syntax error. This
# standalone version is shellcheck-clean.
#
# Output (stdout): one line per orphaned worktree found, including last activity time.
# Exit:   0 always — this is a discovery script, not a blocking gate. The caller decides
#         what to do based on whether stdout is empty or not.
#
# Argument: optional staleness threshold in seconds (default 3600 = 1 hour).
set -uo pipefail

THRESHOLD_SECONDS="${1:-3600}"
WORKTREE_ROOT=".claude/worktrees"

# No worktree directory at all -> nothing to check, success.
[ -d "$WORKTREE_ROOT" ] || exit 0

now="$(date +%s)"

for wt in "$WORKTREE_ROOT"/*/; do
  # Glob may not expand if no worktrees exist
  [ -d "$wt" ] || continue

  last_commit_ts="$(git -C "$wt" log -1 --format=%ct 2>/dev/null || echo "0")"
  age=$((now - last_commit_ts))

  if [ "$age" -gt "$THRESHOLD_SECONDS" ]; then
    age_human="$(git -C "$wt" log -1 --format='%ar' 2>/dev/null || echo 'unknown')"
    echo "Orphaned worktree: ${wt%/} (last activity: ${age_human})"
  fi
done

# Exit 0 regardless of whether anything was found. The caller inspects stdout.
exit 0
