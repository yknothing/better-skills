#!/bin/bash
# Parent skill: skills/dev-flow/SKILL.md
# Purpose: Restore the working tree to a previously created dev-flow safety snapshot,
#          then optionally clean it up.
# Called from: references/error-recovery.md
# Prerequisites:
#   - cwd is inside the same git repo where the snapshot was created
#   - work to preserve has been stashed/committed elsewhere — this script performs
#     `git reset --hard`, which DISCARDS uncommitted changes in tracked files
#
# Usage:
#   bash scripts/recover-from-snapshot.sh             # interactive: list, prompt, restore
#   bash scripts/recover-from-snapshot.sh <ref>       # non-interactive: restore that exact ref
#   bash scripts/recover-from-snapshot.sh --list      # just print available snapshots and exit
#
# Exit:
#   0 on successful restore (or no-op when --list / aborted interactive),
#   1 if the supplied ref is not a valid git ref.
set -euo pipefail

cmd="${1:-interactive}"

list_snapshots() {
  # Tags first (preferred path from safety-snapshot.sh), then fallback branches
  git tag -l "pre-dev-flow-*" --sort=-creatordate
  git for-each-ref --format='%(refname:short)' --sort=-committerdate \
      "refs/heads/snapshot/pre-dev-flow-*"
}

if [ "$cmd" = "--list" ]; then
  list_snapshots
  exit 0
fi

if [ "$cmd" = "interactive" ]; then
  echo "Available snapshots (most recent first):"
  list_snapshots | nl
  echo ""
  echo "WARNING: 'git reset --hard' discards uncommitted changes in tracked files."
  echo "If you have work to preserve, stash or commit it elsewhere FIRST."
  echo ""
  read -r -p "Enter snapshot ref to restore (empty = abort): " target
  [ -z "$target" ] && { echo "Aborted."; exit 0; }
else
  target="$cmd"
fi

# Verify the ref exists before touching anything
if ! git rev-parse --verify --quiet "$target" >/dev/null; then
  echo "ERROR: '$target' is not a valid git ref." >&2
  exit 1
fi

echo "Restoring to: $target"
git reset --hard "$target"

echo ""
echo "Restored. Verify with:"
echo "  git status"
echo "  git diff <expected-base>..HEAD"
echo ""
echo "If recovery succeeded and you no longer need this snapshot, delete it with:"
case "$target" in
  pre-dev-flow-*)          echo "  git tag -d $target" ;;
  snapshot/pre-dev-flow-*) echo "  git branch -D $target" ;;
  *)                       echo "  # Ref '$target' is not a dev-flow snapshot; delete manually if appropriate." ;;
esac
