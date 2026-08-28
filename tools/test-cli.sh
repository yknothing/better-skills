#!/usr/bin/env bash
# Smoke tests for the better-skills CLI.
# Each test asserts (1) exit code, and (2) where applicable, file/manifest state.
# Run from repo root: bash tools/test-cli.sh

set -uo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
CLI="$REPO_ROOT/bin/better-skills.js"
SANDBOX="$(mktemp -d -t better-skills-test-XXXXXX)"
SKILLS_JSON_BAK=""
SOURCES_BAK=""
T22_SOURCE_DIR="$REPO_ROOT/skills/bs-ui-master"
T22_SOURCE_BAK=""

cleanup() {
  if [ -n "$SKILLS_JSON_BAK" ] && [ -f "$SKILLS_JSON_BAK" ]; then
    mv "$SKILLS_JSON_BAK" "$REPO_ROOT/skills.json"
  fi
  if [ -n "$SOURCES_BAK" ] && [ -f "$SOURCES_BAK" ]; then
    mv "$SOURCES_BAK" "$REPO_ROOT/external/sources.yaml"
  fi
  if [ -n "$T22_SOURCE_BAK" ] && [ -d "$T22_SOURCE_BAK" ] && [ ! -e "$T22_SOURCE_DIR" ]; then
    mv "$T22_SOURCE_BAK" "$T22_SOURCE_DIR"
  fi
  rm -rf "$SANDBOX"
}
trap cleanup EXIT

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
echo "$out" | grep -q "bs-social-card" && PASS=$((PASS + 1)) && echo "  $(green PASS) list contains 'bs-social-card'" || { FAIL=$((FAIL + 1)); echo "  $(red FAIL) list missing 'bs-social-card'"; }
echo "$out" | grep -q "bs-reflect-loop" && PASS=$((PASS + 1)) && echo "  $(green PASS) list contains 'bs-reflect-loop'" || { FAIL=$((FAIL + 1)); echo "  $(red FAIL) list missing 'bs-reflect-loop'"; }
echo "$out" | grep -q "brainstorming" && PASS=$((PASS + 1)) && echo "  $(green PASS) list contains 'brainstorming'" || { FAIL=$((FAIL + 1)); echo "  $(red FAIL) list missing 'brainstorming'"; }
node -e "
const fs = require('fs');
const path = require('path');
const resolver = require('./lib/resolver');
const registry = JSON.parse(fs.readFileSync(process.argv[1], 'utf8'));
const expectedCanonical = [
  'bs-prdefine',
  'bs-insight-product',
  'bs-prospect-customer',
  'bs-prose-master',
  'bs-ui-master',
  'bs-social-card',
  'bs-visual-article',
  'bs-sw-master',
  'bs-reflect-loop',
  'bs-skill-auditor',
  'bs-skill-forge',
  'bs-ppt-master',
  'bs-uml-master'
].sort();
const expectedH1 = {
  'bs-prdefine': 'PRDefine',
  'bs-insight-product': 'Insight Product',
  'bs-prospect-customer': 'Prospect Customer',
  'bs-prose-master': 'Prose Master',
  'bs-ui-master': 'UI Master',
  'bs-social-card': 'Social Card',
  'bs-visual-article': 'Visual Article',
  'bs-sw-master': 'SW Master',
  'bs-reflect-loop': 'Reflect Loop',
  'bs-skill-auditor': 'Skill Auditor',
  'bs-skill-forge': 'Skill Forge',
  'bs-ppt-master': 'PPT Master',
  'bs-uml-master': 'UML Master'
};
const requiredDescriptionLanguage = {
  'bs-prdefine': ['Product Requirements (PR)', 'not merely a PRD'],
  'bs-insight-product': ['product-direction decision', 'does not certify product-market fit'],
  'bs-prospect-customer': ['evidence-backed first-customer prospecting', 'not lead scraping'],
  'bs-ui-master': ['production-grade UI design', 'not a complete UX practice'],
  'bs-sw-master': ['Software (SW)', 'does not imply deployment'],
  'bs-reflect-loop': ['Use when retrospectives and future-practice learning', 'active diagnosis to reflection', 'Do not use while diagnosis, incident response, or implementation is still active', 'executable or governance surfaces'],
  'bs-skill-auditor': ['read-only', 'does not directly repair'],
  'bs-ppt-master': ['creating, revising, filling, or enhancing', 'designed and verified together'],
  'bs-uml-master': ['creating, revising, or reviewing UML or architecture diagrams', 'render-verified delivery']
};
const requiredBodyLanguage = {
  'bs-reflect-loop': ['Reclassify the request on every user turn', '收紧规则，但是必须说清楚原因和依据', 'Side-effecting replay is never allowed inside Reflect Loop', 'Stability receipt', 'Validated mechanism receipt', 'records_authorized', 'remediation_authorized', 'report it on every reflection', 'Remediation authority never determines records status', 'An authorized exact target does not require another authorization question', '- Records authorized: true | false', '- Records authorization source: exact current authority | NONE', '- Records target scope: exact non-executable record | UNSPECIFIED', '- Remediation authorized: true | false']
};
const expectedAliases = {
  'requirements-engineering': 'bs-prdefine',
  'bs-requirements-engineering': 'bs-prdefine',
  'bs-define-requirements': 'bs-prdefine',
  'product-discovery': 'bs-insight-product',
  'bs-product-discovery': 'bs-insight-product',
  'bs-shape-product-direction': 'bs-insight-product',
  'first-customer-finder': 'bs-prospect-customer',
  'bs-first-customer-finder': 'bs-prospect-customer',
  'bs-find-early-customer-prospects': 'bs-prospect-customer',
  'prose-craft': 'bs-prose-master',
  'bs-prose-craft': 'bs-prose-master',
  'bs-improve-writing': 'bs-prose-master',
  'visual-design': 'bs-ui-master',
  'bs-visual-design': 'bs-ui-master',
  'bs-design-product-interface': 'bs-ui-master',
  'social-card': 'bs-social-card',
  'bs-create-social-share-card': 'bs-social-card',
  'article-illustrate': 'bs-visual-article',
  'bs-article-illustrate': 'bs-visual-article',
  'bs-illustrate-article': 'bs-visual-article',
  'dev-flow': 'bs-sw-master',
  'bs-dev-flow': 'bs-sw-master',
  'bs-implement-code-change': 'bs-sw-master',
  'skill-health': 'bs-skill-auditor',
  'bs-skill-health': 'bs-skill-auditor',
  'bs-audit-agent-skills': 'bs-skill-auditor',
  'skill-bootstrap': 'bs-skill-forge',
  'bs-skill-bootstrap': 'bs-skill-forge',
  'bs-create-agent-skill': 'bs-skill-forge',
  'bs-ppt-architecture': 'bs-ppt-master'
};
const self = registry.skills && registry.skills['self-developed'];
const batchOne = registry.batches && registry.batches['batch-1'] && registry.batches['batch-1'].skills;
if (!self || !Array.isArray(batchOne)) throw new Error('missing self-developed registry or batch-1 list');
if (JSON.stringify(Object.keys(self).sort()) !== JSON.stringify(expectedCanonical)) {
  throw new Error('self-developed canonical set changed');
}
for (const [canonicalName, meta] of Object.entries(self)) {
  if (!/^bs-[a-z0-9]+(?:-[a-z0-9]+)*$/.test(canonicalName)) {
    throw new Error('self-developed canonical must use bs- prefix: ' + canonicalName);
  }
  const expectedPath = 'skills/' + canonicalName + '/SKILL.md';
  if (meta.path !== expectedPath) throw new Error('canonical path mismatch: ' + canonicalName);
  if (!batchOne.includes(canonicalName)) throw new Error('canonical missing from batch-1: ' + canonicalName);
  const skillSource = fs.readFileSync(path.join(process.argv[2], meta.path), 'utf8');
  if (!new RegExp('^name: ' + canonicalName + '$', 'm').test(skillSource)) {
    throw new Error('frontmatter name mismatch: ' + canonicalName);
  }
  const skillBody = skillSource.replace(/^---\\s*\\n[\\s\\S]*?\\n---\\s*\\n/, '');
  const frontmatter = skillSource.match(/^---\\s*\\n([\\s\\S]*?)\\n---\\s*\\n/)?.[1] || '';
  const h1 = skillBody.match(/^# (.+)$/m)?.[1];
  if (h1 !== expectedH1[canonicalName]) throw new Error('display name mismatch: ' + canonicalName);
  for (const phrase of requiredDescriptionLanguage[canonicalName] || []) {
    if (!frontmatter.includes(phrase)) {
      throw new Error('description lost boundary language for ' + canonicalName + ': ' + phrase);
    }
  }
  for (const phrase of requiredBodyLanguage[canonicalName] || []) {
    if (!skillBody.includes(phrase)) {
      throw new Error('skill body lost routing language for ' + canonicalName + ': ' + phrase);
    }
  }
}
if (JSON.stringify(registry.aliases) !== JSON.stringify(expectedAliases)) {
  throw new Error('historical alias map changed or is not ordered as documented');
}
for (const [legacyName, canonicalName] of Object.entries(expectedAliases)) {
  if (!self[canonicalName]) throw new Error('missing canonical registry entry: ' + canonicalName);
  if (self[legacyName]) throw new Error('historical identity is still canonical: ' + legacyName);
  if (resolver.canonicalizeName(legacyName, registry) !== canonicalName) {
    throw new Error('resolver missed historical identity: ' + legacyName);
  }
  const resolved = resolver.resolveSource(legacyName);
  if (resolved.name !== canonicalName || !resolved.aliasUsed || resolved.kind !== 'self-developed') {
    throw new Error('resolver source mismatch: ' + legacyName);
  }
}
for (const [aliasName, canonicalName] of Object.entries(registry.aliases || {})) {
  if (self[aliasName]) throw new Error('alias is also canonical: ' + aliasName);
  if (!self[canonicalName]) throw new Error('alias target is missing: ' + aliasName + ' -> ' + canonicalName);
  if (registry.aliases[canonicalName]) throw new Error('alias chain is forbidden: ' + aliasName + ' -> ' + canonicalName);
}
const expectedExternal = [
  'brainstorming', 'pptx', 'grill-me', 'grilling', 'writing-great-skills',
  'learn-skill', 'emil-design-eng', 'review-animations', 'animation-vocabulary'
].sort();
const expectedExternalLocation = {
  'brainstorming': ['superpowers', 'external/superpowers/brainstorming'],
  'pptx': ['anthropic-agent-skills', 'external/anthropic-agent-skills/pptx'],
  'grill-me': ['mattpocock-skills', 'external/mattpocock-skills/grill-me'],
  'grilling': ['mattpocock-skills', 'external/mattpocock-skills/grilling'],
  'writing-great-skills': ['mattpocock-skills', 'external/mattpocock-skills/writing-great-skills'],
  'learn-skill': ['learn-anything-skill', 'external/learn-anything-skill/learn-skill'],
  'emil-design-eng': ['emilkowalski-skills', 'external/emilkowalski-skills/emil-design-eng'],
  'review-animations': ['emilkowalski-skills', 'external/emilkowalski-skills/review-animations'],
  'animation-vocabulary': ['emilkowalski-skills', 'external/emilkowalski-skills/animation-vocabulary']
};
const actualExternal = Object.keys(registry.skills.external || {}).sort();
if (JSON.stringify(actualExternal) !== JSON.stringify(expectedExternal)) {
  throw new Error('external skill IDs changed');
}
for (const externalName of expectedExternal) {
  const [expectedSource, expectedPath] = expectedExternalLocation[externalName];
  const meta = registry.skills.external[externalName];
  if (meta.source !== expectedSource || meta.path !== expectedPath) {
    throw new Error('external source/path changed: ' + externalName);
  }
  const resolved = resolver.resolveSource(externalName);
  if (resolved.name !== externalName || resolved.aliasUsed || resolved.kind !== 'external') {
    throw new Error('external resolver identity changed: ' + externalName);
  }
}
const expectedBatchOne = [...Object.keys(self), ...expectedExternal].sort();
const actualBatchOne = [...batchOne].sort();
if (JSON.stringify(actualBatchOne) !== JSON.stringify(expectedBatchOne)) {
  throw new Error('batch-1 contains stale, missing, or duplicate skill IDs');
}
" "$REPO_ROOT/skills.json" "$REPO_ROOT"; rc=$?
assert_exit "canonical rename registry contract" 0 "$rc"
echo

echo "T3: list --installed (empty manifest)"
run_cli list --installed --target "$SANDBOX" >/dev/null 2>&1; rc=$?
assert_exit "list --installed empty exit 0" 0 "$rc"
echo

echo "T4: add bs-social-card --dry-run"
run_cli add bs-social-card --target "$SANDBOX" --dry-run >/dev/null 2>&1; rc=$?
assert_exit "dry-run exit 0" 0 "$rc"
assert_path_missing "dry-run did not write skill dir" "$SANDBOX/bs-social-card"
assert_path_missing "dry-run did not write manifest" "$SANDBOX/.better-skills.json"
echo

echo "T5: add bs-social-card (real)"
run_cli add bs-social-card --target "$SANDBOX" >/dev/null 2>&1; rc=$?
assert_exit "add exit 0" 0 "$rc"
assert_path_exists "skill dir created" "$SANDBOX/bs-social-card"
assert_path_exists "SKILL.md copied" "$SANDBOX/bs-social-card/SKILL.md"
assert_path_exists "asset copied" "$SANDBOX/bs-social-card/assets/centered.html"
assert_path_exists "manifest written" "$SANDBOX/.better-skills.json"
node -e "
const m = JSON.parse(require('fs').readFileSync(process.argv[1],'utf8'));
if (!m.installed['bs-social-card']) { console.error('manifest missing bs-social-card entry'); process.exit(1); }
if (!Array.isArray(m.installed['bs-social-card'].files) || m.installed['bs-social-card'].files.length === 0) {
  console.error('manifest files[] empty'); process.exit(1);
}
" "$SANDBOX/.better-skills.json"; rc=$?
assert_exit "manifest schema valid" 0 "$rc"
echo

echo "T6: add bs-social-card again (conflict)"
run_cli add bs-social-card --target "$SANDBOX" >/dev/null 2>&1; rc=$?
assert_exit "conflict exit 4" 4 "$rc"
echo

echo "T7: add bs-social-card --force"
sleep 1
run_cli add bs-social-card --target "$SANDBOX" --force >/dev/null 2>&1; rc=$?
assert_exit "force exit 0" 0 "$rc"
echo

echo "T8: list --installed (one skill)"
out=$(run_cli list --installed --target "$SANDBOX" 2>&1); rc=$?
assert_exit "list --installed exit 0" 0 "$rc"
echo "$out" | grep -q "bs-social-card" && PASS=$((PASS + 1)) && echo "  $(green PASS) installed list contains 'bs-social-card'" || { FAIL=$((FAIL + 1)); echo "  $(red FAIL) installed list missing 'bs-social-card'"; }
echo

echo "T9: remove bs-social-card"
run_cli remove bs-social-card --target "$SANDBOX" >/dev/null 2>&1; rc=$?
assert_exit "remove exit 0" 0 "$rc"
assert_path_missing "skill dir removed" "$SANDBOX/bs-social-card"
node -e "
const m = JSON.parse(require('fs').readFileSync(process.argv[1],'utf8'));
if (m.installed['bs-social-card']) { console.error('manifest still has bs-social-card entry'); process.exit(1); }
" "$SANDBOX/.better-skills.json"; rc=$?
assert_exit "manifest no longer tracks bs-social-card" 0 "$rc"
echo

echo "T10: remove non-installed skill (not found)"
run_cli remove bs-social-card --target "$SANDBOX" >/dev/null 2>&1; rc=$?
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
run_cli add bs-social-card --target "relative/path" >/dev/null 2>&1; rc=$?
assert_exit "relative target exit 2" 2 "$rc"
run_cli add bs-social-card --target "/tmp/foo/../../etc" >/dev/null 2>&1; rc=$?
assert_exit "target with .. exit 2" 2 "$rc"
echo

echo "T14: untracked existing dir refused without --force"
mkdir -p "$SANDBOX/bs-social-card"
echo "preexisting" > "$SANDBOX/bs-social-card/marker.txt"
run_cli add bs-social-card --target "$SANDBOX" >/dev/null 2>&1; rc=$?
assert_exit "untracked dir conflict exit 4" 4 "$rc"
# --force on untracked dir should also refuse (deliberate safety net)
run_cli add bs-social-card --target "$SANDBOX" --force >/dev/null 2>&1; rc=$?
assert_exit "untracked dir + --force still refuses (exit 4)" 4 "$rc"
rm -rf "$SANDBOX/bs-social-card"
echo

echo "T15: add + update flow"
run_cli add bs-ui-master --target "$SANDBOX" >/dev/null 2>&1; rc=$?
assert_exit "add bs-ui-master exit 0" 0 "$rc"
sleep 1
run_cli update bs-ui-master --target "$SANDBOX" >/dev/null 2>&1; rc=$?
assert_exit "update exit 0" 0 "$rc"
assert_path_exists "bs-ui-master still present after update" "$SANDBOX/bs-ui-master/SKILL.md"
echo

echo "T16: validate against self-developed skill"
run_cli validate bs-ui-master >/dev/null 2>&1; rc=$?
assert_exit "validate exit 0" 0 "$rc"
echo

echo "T17: corrupt manifest (integrity)"
echo "not-json" > "$SANDBOX/.better-skills.json"
run_cli list --installed --target "$SANDBOX" >/dev/null 2>&1; rc=$?
assert_exit "corrupt manifest exit 5" 5 "$rc"
# Restore valid manifest for cleanup
echo '{"version":"0.2.0-dev","installed":{}}' > "$SANDBOX/.better-skills.json"
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
SKILLS_JSON_BAK=""
assert_exit "corrupt skills.json exit 5" 5 "$rc"
echo

echo "T21: corrupt sources.yaml exits 5 (integrity)"
SOURCES_BAK="$REPO_ROOT/external/sources.yaml.bak.$$"
cp "$REPO_ROOT/external/sources.yaml" "$SOURCES_BAK"
printf "sources:\n\tfoo: bar\n" > "$REPO_ROOT/external/sources.yaml"
run_cli list >/dev/null 2>&1; rc=$?
mv "$SOURCES_BAK" "$REPO_ROOT/external/sources.yaml"
SOURCES_BAK=""
assert_exit "corrupt sources.yaml exit 5" 5 "$rc"
echo

echo "T22: update with missing source preserves files (no half-erase)"
T22_DIR="$SANDBOX/t22"
mkdir -p "$T22_DIR"
run_cli add bs-ui-master --target "$T22_DIR" >/dev/null 2>&1
# Move source aside so the update will fail
T22_SOURCE_BAK="${T22_SOURCE_DIR}.bak.$$"
mv "$T22_SOURCE_DIR" "$T22_SOURCE_BAK"
run_cli update bs-ui-master --target "$T22_DIR" >/dev/null 2>&1; rc=$?
mv "$T22_SOURCE_BAK" "$T22_SOURCE_DIR"
T22_SOURCE_BAK=""
assert_exit "update with missing source exit 5" 5 "$rc"
assert_path_exists "tracked file preserved on failed update" "$T22_DIR/bs-ui-master/SKILL.md"
echo

echo "T23: --target / yields friendly EINTEGRITY (not raw ENOENT)"
run_cli add bs-social-card --target / >/dev/null 2>&1; rc=$?
assert_exit "--target / exit 5" 5 "$rc"
echo

echo "T24: legacy alias installs canonical identity"
ALIAS_DIR="$SANDBOX/alias"
mkdir -p "$ALIAS_DIR"
out=$(run_cli add social-card --target "$ALIAS_DIR" 2>&1); rc=$?
assert_exit "legacy alias add exit 0" 0 "$rc"
echo "$out" | grep -q "'social-card' is deprecated; using canonical skill ID 'bs-social-card'" && PASS=$((PASS + 1)) && echo "  $(green PASS) unprefixed alias warns with current canonical" || { FAIL=$((FAIL + 1)); echo "  $(red FAIL) unprefixed alias warning missing or stale"; }
assert_path_exists "unprefixed alias created canonical directory" "$ALIAS_DIR/bs-social-card/SKILL.md"
assert_path_missing "alias did not create legacy directory" "$ALIAS_DIR/social-card"
if grep -q "^name: bs-social-card$" "$ALIAS_DIR/bs-social-card/SKILL.md"; then
  PASS=$((PASS + 1))
  echo "  $(green PASS) installed frontmatter is canonical"
else
  FAIL=$((FAIL + 1))
  echo "  $(red FAIL) installed frontmatter not canonical"
fi
echo

echo "T25: previous canonical alias installs current identity"
CURRENT_ALIAS_DIR="$SANDBOX/current-alias"
mkdir -p "$CURRENT_ALIAS_DIR"
out=$(run_cli add bs-create-social-share-card --target "$CURRENT_ALIAS_DIR" 2>&1); rc=$?
assert_exit "previous canonical alias add exit 0" 0 "$rc"
echo "$out" | grep -q "'bs-create-social-share-card' is deprecated; using canonical skill ID 'bs-social-card'" && PASS=$((PASS + 1)) && echo "  $(green PASS) previous canonical warns with current canonical" || { FAIL=$((FAIL + 1)); echo "  $(red FAIL) previous canonical warning missing or stale"; }
assert_path_exists "previous canonical alias created current directory" "$CURRENT_ALIAS_DIR/bs-social-card/SKILL.md"
assert_path_missing "previous canonical alias did not create old directory" "$CURRENT_ALIAS_DIR/bs-create-social-share-card"
echo

echo "T26: legacy installs migrate without duplicate identities"
MIGRATION_DIR="$SANDBOX/migration"
mkdir -p "$MIGRATION_DIR"
node -e "
const fs = require('fs');
const path = require('path');
const source = process.argv[1];
const target = process.argv[2];
function filesUnder(root, dir = root, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const absolute = path.join(dir, entry.name);
    if (entry.isDirectory()) filesUnder(root, absolute, out);
    else out.push(path.relative(root, absolute).split(path.sep).join('/'));
  }
  return out;
}
const files = filesUnder(source);
const installed = {};
for (const legacyName of ['requirements-engineering', 'bs-requirements-engineering', 'bs-define-requirements']) {
  fs.cpSync(source, path.join(target, legacyName), { recursive: true });
  installed[legacyName] = {
    source: 'self-developed',
    from: 'skills/' + legacyName,
    installed_at: '2026-01-01T00:00:00.000Z',
    method: 'copy',
    files
  };
}
fs.writeFileSync(path.join(target, '.better-skills.json'), JSON.stringify({ version: '0.2.0-dev', installed }, null, 2) + '\n');
" "$REPO_ROOT/skills/bs-prdefine" "$MIGRATION_DIR"; rc=$?
assert_exit "legacy fixture setup exit 0" 0 "$rc"
run_cli add bs-prdefine --target "$MIGRATION_DIR" >/dev/null 2>&1; rc=$?
assert_exit "canonical add refuses duplicate legacy install" 4 "$rc"
run_cli update bs-requirements-engineering --target "$MIGRATION_DIR" --dry-run >/dev/null 2>&1; rc=$?
assert_exit "legacy migration dry-run exit 0" 0 "$rc"
assert_path_missing "migration dry-run did not create canonical directory" "$MIGRATION_DIR/bs-prdefine"
assert_path_exists "migration dry-run kept unprefixed legacy directory" "$MIGRATION_DIR/requirements-engineering/SKILL.md"
assert_path_exists "migration dry-run kept prefixed legacy directory" "$MIGRATION_DIR/bs-requirements-engineering/SKILL.md"
assert_path_exists "migration dry-run kept previous canonical directory" "$MIGRATION_DIR/bs-define-requirements/SKILL.md"
run_cli update bs-define-requirements --target "$MIGRATION_DIR" >/dev/null 2>&1; rc=$?
assert_exit "alias-initiated update migrates legacy installs" 0 "$rc"
assert_path_exists "migration created canonical directory" "$MIGRATION_DIR/bs-prdefine/SKILL.md"
assert_path_missing "migration removed unprefixed legacy directory" "$MIGRATION_DIR/requirements-engineering"
assert_path_missing "migration removed prefixed legacy directory" "$MIGRATION_DIR/bs-requirements-engineering"
assert_path_missing "migration removed previous canonical directory" "$MIGRATION_DIR/bs-define-requirements"
node -e "
const m = JSON.parse(require('fs').readFileSync(process.argv[1], 'utf8'));
const names = Object.keys(m.installed).sort();
if (JSON.stringify(names) !== JSON.stringify(['bs-prdefine'])) {
  console.error('unexpected installed identities: ' + names.join(', '));
  process.exit(1);
}
" "$MIGRATION_DIR/.better-skills.json"; rc=$?
assert_exit "migration manifest has one canonical identity" 0 "$rc"
echo

echo "T27: update-all collapses canonical and every historical identity"
UPDATE_ALL_DIR="$SANDBOX/update-all"
mkdir -p "$UPDATE_ALL_DIR"
node -e "
const fs = require('fs');
const path = require('path');
const source = process.argv[1];
const target = process.argv[2];
function filesUnder(root, dir = root, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const absolute = path.join(dir, entry.name);
    if (entry.isDirectory()) filesUnder(root, absolute, out);
    else out.push(path.relative(root, absolute).split(path.sep).join('/'));
  }
  return out;
}
const files = filesUnder(source);
const installed = {};
for (const identity of ['requirements-engineering', 'bs-requirements-engineering', 'bs-define-requirements', 'bs-prdefine']) {
  fs.cpSync(source, path.join(target, identity), { recursive: true });
  installed[identity] = {
    source: 'self-developed',
    from: 'skills/' + identity,
    installed_at: '2026-01-01T00:00:00.000Z',
    method: 'copy',
    files
  };
}
fs.writeFileSync(path.join(target, '.better-skills.json'), JSON.stringify({ version: '0.2.0-dev', installed }, null, 2) + '\n');
" "$REPO_ROOT/skills/bs-prdefine" "$UPDATE_ALL_DIR"; rc=$?
assert_exit "update-all coexistence fixture setup exit 0" 0 "$rc"
run_cli update --target "$UPDATE_ALL_DIR" >/dev/null 2>&1; rc=$?
assert_exit "update-all converges coexistence exit 0" 0 "$rc"
assert_path_exists "update-all kept canonical directory" "$UPDATE_ALL_DIR/bs-prdefine/SKILL.md"
assert_path_missing "update-all removed unprefixed legacy directory" "$UPDATE_ALL_DIR/requirements-engineering"
assert_path_missing "update-all removed prefixed legacy directory" "$UPDATE_ALL_DIR/bs-requirements-engineering"
assert_path_missing "update-all removed previous canonical directory" "$UPDATE_ALL_DIR/bs-define-requirements"
node -e "
const m = JSON.parse(require('fs').readFileSync(process.argv[1], 'utf8'));
const names = Object.keys(m.installed).sort();
if (JSON.stringify(names) !== JSON.stringify(['bs-prdefine'])) {
  console.error('unexpected installed identities after update-all: ' + names.join(', '));
  process.exit(1);
}
" "$UPDATE_ALL_DIR/.better-skills.json"; rc=$?
assert_exit "update-all manifest has one canonical identity" 0 "$rc"
echo

echo "T28: PPT Architecture alias installs and migrates to PPT Master"
PPT_ALIAS_DIR="$SANDBOX/ppt-master-alias"
mkdir -p "$PPT_ALIAS_DIR"
out=$(run_cli add bs-ppt-architecture --target "$PPT_ALIAS_DIR" 2>&1); rc=$?
assert_exit "PPT legacy alias add exit 0" 0 "$rc"
echo "$out" | grep -q "'bs-ppt-architecture' is deprecated; using canonical skill ID 'bs-ppt-master'" && PASS=$((PASS + 1)) || FAIL=$((FAIL + 1))
assert_path_exists "PPT alias created canonical directory" "$PPT_ALIAS_DIR/bs-ppt-master/SKILL.md"
assert_path_missing "PPT alias did not create old directory" "$PPT_ALIAS_DIR/bs-ppt-architecture"

PPT_MIGRATION_DIR="$SANDBOX/ppt-master-migration"
mkdir -p "$PPT_MIGRATION_DIR"
cp -R "$REPO_ROOT/skills/bs-ppt-master" "$PPT_MIGRATION_DIR/bs-ppt-architecture"
node -e "
const fs = require('fs');
const path = require('path');
function filesUnder(root, dir = root, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const absolute = path.join(dir, entry.name);
    if (entry.isDirectory()) filesUnder(root, absolute, out);
    else out.push(path.relative(root, absolute).split(path.sep).join('/'));
  }
  return out;
}
const source = process.argv[1];
const target = process.argv[2];
const installed = {
  'bs-ppt-architecture': {
    source: 'self-developed',
    from: 'skills/bs-ppt-architecture',
    installed_at: '2026-01-01T00:00:00.000Z',
    method: 'copy',
    files: filesUnder(source)
  }
};
fs.writeFileSync(path.join(target, '.better-skills.json'), JSON.stringify({ version: '0.2.0-dev', installed }, null, 2) + '\n');
" "$REPO_ROOT/skills/bs-ppt-master" "$PPT_MIGRATION_DIR"; rc=$?
assert_exit "PPT legacy fixture setup exit 0" 0 "$rc"
run_cli add bs-ppt-master --target "$PPT_MIGRATION_DIR" >/dev/null 2>&1; rc=$?
assert_exit "PPT canonical add refuses duplicate legacy install" 4 "$rc"
run_cli update bs-ppt-architecture --target "$PPT_MIGRATION_DIR" >/dev/null 2>&1; rc=$?
assert_exit "PPT alias update migrates legacy install" 0 "$rc"
assert_path_exists "PPT migration created canonical directory" "$PPT_MIGRATION_DIR/bs-ppt-master/SKILL.md"
assert_path_missing "PPT migration removed old directory" "$PPT_MIGRATION_DIR/bs-ppt-architecture"
node -e "
const m = JSON.parse(require('fs').readFileSync(process.argv[1], 'utf8'));
const names = Object.keys(m.installed).sort();
if (JSON.stringify(names) !== JSON.stringify(['bs-ppt-master'])) process.exit(1);
" "$PPT_MIGRATION_DIR/.better-skills.json"; rc=$?
assert_exit "PPT migration manifest has one canonical identity" 0 "$rc"
echo

echo "==> Result: $(green "$PASS pass") / $(red "$FAIL fail")"
[ "$FAIL" -eq 0 ] || exit 1
