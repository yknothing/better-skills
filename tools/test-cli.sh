#!/usr/bin/env bash
# Smoke tests for the better-skills CLI.
# Each test asserts (1) exit code, and (2) where applicable, file/manifest state.
# Run from repo root: bash tools/test-cli.sh

set -uo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
CLI="$REPO_ROOT/bin/better-skills.js"
SANDBOX="$(mktemp -d -t better-skills-test-XXXXXX)"
trap 'rm -rf "$SANDBOX"' EXIT

PASS=0
FAIL=0

red()   { printf "\033[31m%s\033[0m" "$*"; }
green() { printf "\033[32m%s\033[0m" "$*"; }
gray()  { printf "\033[90m%s\033[0m" "$*"; }

assert_exit() {
  local label="$1"; local expected="$2"; local got="$3"
  if [ "$expected" = "$got" ]; then
    echo "  $(green PASS) $label  (exit $got)"
    PASS=$((PASS + 1))
  else
    echo "  $(red FAIL) $label  (expected $expected, got $got)"
    FAIL=$((FAIL + 1))
  fi
}

assert_eq() {
  local label="$1"; local expected="$2"; local got="$3"
  if [ "$expected" = "$got" ]; then
    echo "  $(green PASS) $label"
    PASS=$((PASS + 1))
  else
    echo "  $(red FAIL) $label  (expected '$expected', got '$got')"
    FAIL=$((FAIL + 1))
  fi
}

assert_path_exists() {
  local label="$1"; local p="$2"
  if [ -e "$p" ]; then
    echo "  $(green PASS) $label  (path exists: $p)"
    PASS=$((PASS + 1))
  else
    echo "  $(red FAIL) $label  (missing: $p)"
    FAIL=$((FAIL + 1))
  fi
}

assert_path_missing() {
  local label="$1"; local p="$2"
  if [ ! -e "$p" ]; then
    echo "  $(green PASS) $label  (path absent: $p)"
    PASS=$((PASS + 1))
  else
    echo "  $(red FAIL) $label  (still exists: $p)"
    FAIL=$((FAIL + 1))
  fi
}

run_cli() {
  node "$CLI" "$@"
}

echo "==> sandbox: $SANDBOX"
echo

echo "T1: --version"
out=$(run_cli --version 2>&1); rc=$?
assert_exit "--version exit 0" 0 "$rc"
[ -n "$out" ] && echo "  $(gray "version: $out")"
echo

echo "T2: list (registry)"
out=$(run_cli list 2>&1); rc=$?
assert_exit "list exit 0" 0 "$rc"
echo "$out" | grep -q "social-card" && PASS=$((PASS + 1)) && echo "  $(green PASS) list contains 'social-card'" || { FAIL=$((FAIL + 1)); echo "  $(red FAIL) list missing 'social-card'"; }
echo "$out" | grep -q "brainstorming" && PASS=$((PASS + 1)) && echo "  $(green PASS) list contains 'brainstorming'" || { FAIL=$((FAIL + 1)); echo "  $(red FAIL) list missing 'brainstorming'"; }
echo

echo "T3: list --installed (empty manifest)"
run_cli list --installed --target "$SANDBOX" >/dev/null 2>&1; rc=$?
assert_exit "list --installed empty exit 0" 0 "$rc"
echo

echo "T4: add social-card --dry-run"
run_cli add social-card --target "$SANDBOX" --dry-run >/dev/null 2>&1; rc=$?
assert_exit "dry-run exit 0" 0 "$rc"
assert_path_missing "dry-run did not write skill dir" "$SANDBOX/social-card"
assert_path_missing "dry-run did not write manifest" "$SANDBOX/.better-skills.json"
echo

echo "T5: add social-card (real)"
run_cli add social-card --target "$SANDBOX" >/dev/null 2>&1; rc=$?
assert_exit "add exit 0" 0 "$rc"
assert_path_exists "skill dir created" "$SANDBOX/social-card"
assert_path_exists "SKILL.md copied" "$SANDBOX/social-card/SKILL.md"
assert_path_exists "asset copied" "$SANDBOX/social-card/assets/centered.html"
assert_path_exists "manifest written" "$SANDBOX/.better-skills.json"
node -e "
const m = JSON.parse(require('fs').readFileSync(process.argv[1],'utf8'));
if (!m.installed['social-card']) { console.error('manifest missing social-card entry'); process.exit(1); }
if (!Array.isArray(m.installed['social-card'].files) || m.installed['social-card'].files.length === 0) {
  console.error('manifest files[] empty'); process.exit(1);
}
" "$SANDBOX/.better-skills.json"; rc=$?
assert_exit "manifest schema valid" 0 "$rc"
echo

echo "T6: add social-card again (conflict)"
run_cli add social-card --target "$SANDBOX" >/dev/null 2>&1; rc=$?
assert_exit "conflict exit 4" 4 "$rc"
echo

echo "T7: add social-card --force"
sleep 1
run_cli add social-card --target "$SANDBOX" --force >/dev/null 2>&1; rc=$?
assert_exit "force exit 0" 0 "$rc"
echo

echo "T8: list --installed (one skill)"
out=$(run_cli list --installed --target "$SANDBOX" 2>&1); rc=$?
assert_exit "list --installed exit 0" 0 "$rc"
echo "$out" | grep -q "social-card" && PASS=$((PASS + 1)) && echo "  $(green PASS) installed list contains 'social-card'" || { FAIL=$((FAIL + 1)); echo "  $(red FAIL) installed list missing 'social-card'"; }
echo

echo "T9: remove social-card"
run_cli remove social-card --target "$SANDBOX" >/dev/null 2>&1; rc=$?
assert_exit "remove exit 0" 0 "$rc"
assert_path_missing "skill dir removed" "$SANDBOX/social-card"
node -e "
const m = JSON.parse(require('fs').readFileSync(process.argv[1],'utf8'));
if (m.installed['social-card']) { console.error('manifest still has social-card entry'); process.exit(1); }
" "$SANDBOX/.better-skills.json"; rc=$?
assert_exit "manifest no longer tracks social-card" 0 "$rc"
echo

echo "T10: remove non-installed skill (not found)"
run_cli remove social-card --target "$SANDBOX" >/dev/null 2>&1; rc=$?
assert_exit "remove not-found exit 3" 3 "$rc"
echo

echo "T11: add nonexistent skill"
run_cli add does-not-exist-anywhere --target "$SANDBOX" >/dev/null 2>&1; rc=$?
assert_exit "not-found exit 3" 3 "$rc"
echo

echo "T12: path-traversal name rejected"
run_cli add ../../../etc/passwd --target "$SANDBOX" >/dev/null 2>&1; rc=$?
assert_exit "traversal exit 2" 2 "$rc"
run_cli add 'evil; rm -rf /' --target "$SANDBOX" >/dev/null 2>&1; rc=$?
assert_exit "shell-meta exit 2" 2 "$rc"
echo

echo "T13: bad target rejected"
run_cli add social-card --target "relative/path" >/dev/null 2>&1; rc=$?
assert_exit "relative target exit 2" 2 "$rc"
run_cli add social-card --target "/tmp/foo/../../etc" >/dev/null 2>&1; rc=$?
assert_exit "target with .. exit 2" 2 "$rc"
echo

echo "T14: untracked existing dir refused without --force"
mkdir -p "$SANDBOX/social-card"
echo "preexisting" > "$SANDBOX/social-card/marker.txt"
run_cli add social-card --target "$SANDBOX" >/dev/null 2>&1; rc=$?
assert_exit "untracked dir conflict exit 4" 4 "$rc"
# --force on untracked dir should also refuse (deliberate safety net)
run_cli add social-card --target "$SANDBOX" --force >/dev/null 2>&1; rc=$?
assert_exit "untracked dir + --force still refuses (exit 4)" 4 "$rc"
rm -rf "$SANDBOX/social-card"
echo

echo "T15: add + update flow"
run_cli add visual-design --target "$SANDBOX" >/dev/null 2>&1; rc=$?
assert_exit "add visual-design exit 0" 0 "$rc"
sleep 1
run_cli update visual-design --target "$SANDBOX" >/dev/null 2>&1; rc=$?
assert_exit "update exit 0" 0 "$rc"
assert_path_exists "visual-design still present after update" "$SANDBOX/visual-design/SKILL.md"
echo

echo "T16: validate against self-developed skill"
run_cli validate visual-design >/dev/null 2>&1; rc=$?
assert_exit "validate exit 0" 0 "$rc"
echo

echo "T17: corrupt manifest (integrity)"
echo "not-json" > "$SANDBOX/.better-skills.json"
run_cli list --installed --target "$SANDBOX" >/dev/null 2>&1; rc=$?
assert_exit "corrupt manifest exit 5" 5 "$rc"
# Restore valid manifest for cleanup
echo '{"version":"0.1.0-dev","installed":{}}' > "$SANDBOX/.better-skills.json"
echo

echo "T18: help variants"
run_cli help >/dev/null 2>&1; rc=$?; assert_exit "help exit 0" 0 "$rc"
run_cli --help >/dev/null 2>&1; rc=$?; assert_exit "--help exit 0" 0 "$rc"
run_cli help add >/dev/null 2>&1; rc=$?; assert_exit "help add exit 0" 0 "$rc"
run_cli no-such-cmd >/dev/null 2>&1; rc=$?; assert_exit "unknown cmd exit 2" 2 "$rc"
run_cli list --bogus-flag >/dev/null 2>&1; rc=$?; assert_exit "unknown flag exit 2" 2 "$rc"
echo

echo "T19: source symlink leak rejected (security)"
EVIL_SRC="$SANDBOX/evil-skill-src"
mkdir -p "$EVIL_SRC"
echo "# evil" > "$EVIL_SRC/SKILL.md"
ln -s /etc/passwd "$EVIL_SRC/leaked-passwd" 2>/dev/null || true
# Direct invocation of installer.copyTree to trigger the symlink check
node -e "
const { copyTree } = require('./lib/installer');
try {
  copyTree(process.argv[1], '/tmp/should-not-be-written-' + Date.now());
  console.error('ERROR: copyTree did not reject unsafe symlink');
  process.exit(99);
} catch (e) {
  if (e.code === 'EINTEGRITY' && /unsafe symlink/.test(e.message)) {
    process.exit(0);
  }
  console.error('ERROR: wrong error: ' + e.message + ' (code=' + e.code + ')');
  process.exit(98);
}
" "$EVIL_SRC"; rc=$?
assert_exit "symlink-out-of-tree blocked" 0 "$rc"
rm -rf "$EVIL_SRC"
echo

echo "T20: corrupt skills.json exits 5 (integrity)"
SKILLS_JSON_BAK="$REPO_ROOT/skills.json.bak.$$"
cp "$REPO_ROOT/skills.json" "$SKILLS_JSON_BAK"
echo 'not-valid-json' > "$REPO_ROOT/skills.json"
run_cli list >/dev/null 2>&1; rc=$?
mv "$SKILLS_JSON_BAK" "$REPO_ROOT/skills.json"
assert_exit "corrupt skills.json exit 5" 5 "$rc"
echo

echo "T21: corrupt sources.yaml exits 5 (integrity)"
SOURCES_BAK="$REPO_ROOT/external/sources.yaml.bak.$$"
cp "$REPO_ROOT/external/sources.yaml" "$SOURCES_BAK"
printf "sources:\n\tfoo: bar\n" > "$REPO_ROOT/external/sources.yaml"
run_cli list >/dev/null 2>&1; rc=$?
mv "$SOURCES_BAK" "$REPO_ROOT/external/sources.yaml"
assert_exit "corrupt sources.yaml exit 5" 5 "$rc"
echo

echo "T22: update with missing source preserves files (no half-erase)"
T22_DIR="$SANDBOX/t22"
mkdir -p "$T22_DIR"
run_cli add visual-design --target "$T22_DIR" >/dev/null 2>&1
# Move source aside so the update will fail
mv "$REPO_ROOT/skills/visual-design" "$REPO_ROOT/skills/visual-design.bak.$$"
run_cli update visual-design --target "$T22_DIR" >/dev/null 2>&1; rc=$?
mv "$REPO_ROOT/skills/visual-design.bak.$$" "$REPO_ROOT/skills/visual-design"
assert_exit "update with missing source exit 5" 5 "$rc"
assert_path_exists "tracked file preserved on failed update" "$T22_DIR/visual-design/SKILL.md"
echo

echo "T23: --target / yields friendly EINTEGRITY (not raw ENOENT)"
run_cli add social-card --target / >/dev/null 2>&1; rc=$?
assert_exit "--target / exit 5" 5 "$rc"
echo

echo "==> Result: $(green "$PASS pass") / $(red "$FAIL fail")"
[ "$FAIL" -eq 0 ] || exit 1
