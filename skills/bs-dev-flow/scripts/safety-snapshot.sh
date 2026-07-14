#!/bin/bash
# Parent skill: skills/bs-dev-flow/SKILL.md
# Purpose: Create a recoverable checkpoint before any branch creation or worktree setup.
# Called from: Phase 2 (SETUP) of SKILL.md
# Prerequisites: cwd is inside a git working tree
#
# Strategy: lightweight tag first (sub-second precision); fall back to a branch-based
# snapshot if tag creation fails (detached HEAD, hook rejection, name collision).
# If both fail, emit a warning to stderr and exit 0 — pre-existing repo state issues
# are surfaced but not blocking.
#
# Output (stdout): on success, a single line containing the snapshot ref name.
#                  Callers should capture this for use with recover-from-snapshot.sh.
#         (stderr): warning text on total failure.
# Exit:   0 in all cases.

# IMPORTANT: deliberately NOT using `set -e` here. The whole point of the fallback
# chain is to keep going when `git tag` fails.
set -uo pipefail

ts="$(date +%s)"
SNAPSHOT_TAG="pre-dev-flow-${ts}"
SNAPSHOT_BRANCH="snapshot/pre-dev-flow-${ts}"

# Primary: lightweight tag
if git tag "$SNAPSHOT_TAG" 2>/dev/null; then
  echo "$SNAPSHOT_TAG"
  exit 0
fi

# Fallback 1: branch-based snapshot
if git branch "$SNAPSHOT_BRANCH" HEAD 2>/dev/null; then
  echo "$SNAPSHOT_BRANCH"
  exit 0
fi

# Fallback 2: total failure — warn but do not block
echo "WARNING: could not create a safety snapshot (both tag and branch creation failed). Proceeding without recovery point." >&2
exit 0
