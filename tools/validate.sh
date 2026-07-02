#!/bin/bash
# Validate a skill's SKILL.md against better-skills quality standards.
# Usage: bash tools/validate.sh <path-to-skill-directory>

set -euo pipefail

SKILL_DIR="${1:-}"
if [ -z "$SKILL_DIR" ]; then
  echo "Usage: bash tools/validate.sh <path-to-skill-directory>"
  exit 1
fi

SKILL_FILE="$SKILL_DIR/SKILL.md"
PASS=0
FAIL=0

red() { printf '\033[31m%s\033[0m\n' "$1"; }
green() { printf '\033[32m%s\033[0m\n' "$1"; }
check() {
  if [ "$1" -eq 0 ]; then
    green "  PASS: $2"
    PASS=$((PASS + 1))
  else
    red "  FAIL: $2"
    FAIL=$((FAIL + 1))
  fi
}

echo "=== Validating: $SKILL_FILE ==="
echo ""

# 1. File exists
if [ -f "$SKILL_FILE" ]; then
  check 0 "SKILL.md exists"
else
  check 1 "SKILL.md exists"
  echo ""
  echo "=== Results: 0 passed, 1 failed ==="
  exit 1
fi

# 2. YAML frontmatter delimiters
head -1 "$SKILL_FILE" | grep -q '^---$'; check $? "Frontmatter opening delimiter (---)"

# 3. Required frontmatter fields
grep -q '^name:' "$SKILL_FILE"; check $? "Required field: name"
grep -q '^description:' "$SKILL_FILE"; check $? "Required field: description"

# 4. Name format (kebab-case)
NAME=$(grep '^name:' "$SKILL_FILE" | head -1 | sed 's/^name:\s*//')
echo "$NAME" | grep -qE '^[a-z0-9-]+$'; check $? "Name is kebab-case: $NAME"

# 5. Description starts with "Use when" (third person, trigger-focused)
DESC=$(grep '^description:' "$SKILL_FILE" | head -1 | sed 's/^description:\s*//')
echo "$DESC" | grep -qi 'use when'; check $? "Description starts with 'Use when'"

# 6. Minimum body size (at least 500 bytes of actual content)
BODY_SIZE=$(tail -n +2 "$SKILL_FILE" | wc -c | tr -d ' ')
[ "$BODY_SIZE" -ge 500 ]; check $? "Body size >= 500 bytes (actual: $BODY_SIZE)"

# 7. No more than 5000 words (token budget)
WORD_COUNT=$(wc -w < "$SKILL_FILE" | tr -d ' ')
[ "$WORD_COUNT" -le 5000 ]; check $? "Word count <= 5000 (actual: $WORD_COUNT)"

# 8. Safety scan — no hardcoded secrets
if grep -qiE '(api_key|api_secret|password|token)\s*[:=]\s*["'"'"'][a-zA-Z0-9_-]{20,}' "$SKILL_FILE"; then
  check 1 "No hardcoded secrets"
else
  check 0 "No hardcoded secrets"
fi

# 9. Safety scan — no destructive commands without warnings
if grep -qE 'rm\s+-rf\s+/(\s|$)' "$SKILL_FILE"; then
  check 1 "No destructive filesystem commands"
else
  check 0 "No destructive filesystem commands"
fi

echo ""
echo "=== Results: $PASS passed, $FAIL failed ==="

if [ "$FAIL" -gt 0 ]; then
  exit 1
fi
