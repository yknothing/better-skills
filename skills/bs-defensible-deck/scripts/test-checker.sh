#!/usr/bin/env bash
# Regression suite for check-claim-ledger.js.
#
# "The gate actually fails" is a load-bearing claim of bs-defensible-deck, so it
# needs an assertion rather than a promise. A Gate 2 adversary review produced a
# hollow ledger that scored 16/16; these tests pin the fixes so no future edit
# can quietly reopen those holes.
#
# Usage: bash scripts/test-checker.sh
# Exit: 0 if every assertion holds, 1 otherwise.
set -uo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SKILL_DIR="$(dirname "$HERE")"
CHECKER="$HERE/check-claim-ledger.js"
ASSETS="$SKILL_DIR/assets"

PASS=0
FAIL=0

# Assert the checker's exit code for a fixture.
# $1 fixture path, $2 expected exit code, $3 description
assert_exit() {
  local fixture="$1" expected="$2" desc="$3" actual
  node "$CHECKER" "$fixture" >/dev/null 2>&1
  actual=$?
  if [ "$actual" -eq "$expected" ]; then
    echo "  PASS  $desc (exit $actual)"
    PASS=$((PASS + 1))
  else
    echo "  FAIL  $desc (expected exit $expected, got $actual)"
    FAIL=$((FAIL + 1))
  fi
}

# Assert that the checker's output contains a given string for a fixture.
# Output is captured into a variable rather than piped: `grep -q` exits on first
# match, which sends SIGPIPE to node, which under `pipefail` turns a successful
# assertion into a failing one.
# $1 fixture path, $2 needle, $3 description
assert_reports() {
  local fixture="$1" needle="$2" desc="$3" out
  out="$(node "$CHECKER" "$fixture" 2>&1)"
  if printf '%s' "$out" | grep -qF -- "$needle"; then
    echo "  PASS  $desc"
    PASS=$((PASS + 1))
  else
    echo "  FAIL  $desc (output did not contain: $needle)"
    FAIL=$((FAIL + 1))
  fi
}

echo "T1: fixtures exit as documented"
assert_exit "$ASSETS/claims.example.md" 0 "compliant L2 ledger passes"
assert_exit "$ASSETS/claims.l0-example.md" 0 "legitimate L0 ledger passes (tier-aware cardinality)"
assert_exit "$ASSETS/claims.noncompliant-example.md" 1 "format-broken ledger fails"
assert_exit "$ASSETS/claims.exploit-probe.md" 1 "format-clean but hollow ledger fails"

echo
echo "T2: each Gate 2 exploit is caught"
PROBE="$ASSETS/claims.exploit-probe.md"
assert_reports "$PROBE" "malformed: c3" "lowercase entry ID is reported, not skipped"
assert_reports "$PROBE" "does not match its governing range" "band and declared range are cross-validated"
assert_reports "$PROBE" "denies a counterfactual exists" "counterfactual evasion is caught"
assert_reports "$PROBE" "no numeric threshold outside its date" "an ISO date no longer supplies the threshold digits"
assert_reports "$PROBE" "names no specific system or dataset" "vague falsifier source is caught"
assert_reports "$PROBE" "signpost contains a placeholder" "placeholder signpost fields are caught"
assert_reports "$PROBE" "response is a placeholder" "placeholder rebuttal response is caught"
assert_reports "$PROBE" "E1 missing source" "empty evidence entry is caught"
assert_reports "$PROBE" 'C2 uses "proves"' "a wrapped continuation line is parsed, not silently dropped"

echo
echo "T3: commitment ordering is never claimed without evidence"
assert_reports "$ASSETS/claims.example.md" "UNVERIFIED" "G1 ordering reports UNVERIFIED without --deck"

echo
echo "T4: bold field names do not produce false failures"
PROBE_OUT="$(node "$CHECKER" "$PROBE" 2>&1)"
if printf '%s' "$PROBE_OUT" | grep -qF "C1 missing claim"; then
  echo "  FAIL  bold field name '- **claim**:' must still parse"
  FAIL=$((FAIL + 1))
else
  echo "  PASS  bold field name '- **claim**:' parses correctly"
  PASS=$((PASS + 1))
fi

echo
if [ "$FAIL" -eq 0 ]; then
  echo "==> Result: $PASS pass / 0 fail"
  exit 0
fi
echo "==> Result: $PASS pass / $FAIL fail"
exit 1
