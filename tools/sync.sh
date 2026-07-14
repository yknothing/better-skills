#!/bin/bash
# Sync external skills from declared sources to the local agent directory.
# Reads external/sources.yaml for source configuration.
# Usage: bash tools/sync.sh [--target claude|codex|cursor] [--dry-run]

set -euo pipefail

TARGET="claude"
DRY_RUN=false

# Parse args
while [[ $# -gt 0 ]]; do
  case "$1" in
    --target)
      TARGET="$2"
      shift 2
      ;;
    --dry-run)
      DRY_RUN=true
      shift
      ;;
    *)
      shift
      ;;
  esac
done

# Determine target directory
case "$TARGET" in
  claude) SKILLS_DIR="$HOME/.claude/skills" ;;
  codex) SKILLS_DIR="$HOME/.agents/skills" ;;
  cursor) SKILLS_DIR="$HOME/.cursor/skills" ;;
  *) echo "Unknown target: $TARGET (use claude, codex, or cursor)"; exit 1 ;;
esac

echo "=== Syncing external skills to $SKILLS_DIR ==="

SOURCES_FILE="$(dirname "$0")/../external/sources.yaml"
if [ ! -f "$SOURCES_FILE" ]; then
  echo "ERROR: external/sources.yaml not found at $SOURCES_FILE"
  exit 1
fi

CACHE_DIR="$HOME/.cache/better-skills"
mkdir -p "$CACHE_DIR" "$SKILLS_DIR"

# Simple YAML parser for sources (avoids yq dependency)
parse_sources() {
  local current_source=""
  local current_repo=""
  local current_ref=""
  local current_path=""

  while IFS= read -r line; do
    # Source name
    if echo "$line" | grep -qE '^  [a-z]'; then
      current_source=$(echo "$line" | sed 's/:$//' | xargs)
    fi
    # Repo
    if echo "$line" | grep -q 'repo:'; then
      current_repo=$(echo "$line" | sed 's/.*repo:\s*//' | xargs)
    fi
    # Ref
    if echo "$line" | grep -q 'ref:'; then
      current_ref=$(echo "$line" | sed 's/.*ref:\s*//' | xargs)
    fi
    # Skills path
    if echo "$line" | grep -q 'skills_path:'; then
      current_path=$(echo "$line" | sed 's/.*skills_path:\s*//' | xargs)
    fi
    # Skill name
    if echo "$line" | grep -qE '^\s+- [a-z]'; then
      local skill=$(echo "$line" | sed 's/.*- //' | xargs)
      echo "$current_source|$current_repo|$current_ref|$current_path|$skill"
    fi
  done < "$SOURCES_FILE"
}

COUNT=0
while IFS='|' read -r source repo ref skills_path skill; do
  SOURCE_DIR="$CACHE_DIR/$source"
  # skills_path: "." means the repo root IS the skill directory (single-skill repos
  # like koganei/learn-anything-skill where SKILL.md lives at the repo root).
  if [ "$skills_path" = "." ]; then
    SKILL_SRC="$SOURCE_DIR"
  else
    SKILL_SRC="$SOURCE_DIR/$skills_path/$skill"
  fi
  canonical="bs-$skill"
  SKILL_DST="$SKILLS_DIR/$canonical"

  echo ""
  echo "--- $canonical (upstream: $skill, source: $source) ---"

  # Clone or pull the source repo
  if [ ! -d "$SOURCE_DIR" ]; then
    echo "Cloning $repo..."
    if [ "$DRY_RUN" = false ]; then
      git clone --depth 1 --branch "$ref" "$repo" "$SOURCE_DIR" 2>&1 | tail -1
    else
      echo "  [DRY RUN] would clone $repo"
    fi
  else
    echo "Updating $repo..."
    if [ "$DRY_RUN" = false ]; then
      git -C "$SOURCE_DIR" fetch origin "$ref" 2>&1 | tail -1
      git -C "$SOURCE_DIR" checkout "$ref" 2>&1 | tail -1
      git -C "$SOURCE_DIR" pull origin "$ref" 2>&1 | tail -1
    else
      echo "  [DRY RUN] would fetch + checkout $ref"
    fi
  fi

  # Symlink the skill
  if [ -d "$SKILL_SRC" ]; then
    echo "Linking $canonical..."
    if [ "$DRY_RUN" = false ]; then
      node "$(dirname "$0")/rewrite-skill-namespace.js" "$SKILL_SRC" "$canonical"
      rm -rf "$SKILL_DST"
      ln -sf "$SKILL_SRC" "$SKILL_DST"
      echo "  $canonical -> $SKILL_SRC"
    else
      echo "  [DRY RUN] would link $SKILL_SRC -> $SKILL_DST"
    fi
    COUNT=$((COUNT + 1))
  else
    echo "  WARNING: Skill directory not found at $SKILL_SRC"
  fi
done < <(parse_sources)

echo ""
echo "=== Synced $COUNT skills to $SKILLS_DIR ==="
