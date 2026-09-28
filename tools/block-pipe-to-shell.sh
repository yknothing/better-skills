#!/usr/bin/env bash
# PreToolUse hook: block unsafe patterns where a downloader feeds a shell.
#
# Catches 3 shapes:
#  P1  pipe:      curl … | [sudo|env|nice|…] [/bin/]sh
#  P2  eval:      eval "$(curl …)"  /  sh -c "$(curl …)"
#  P3  proc-sub:  sh <(curl …)
#
# Exit 2  → Claude Code and Codex deny the call and surfaces stderr to the model.
# Exit 0  → allowed (or fail-open if the hook itself can't parse the input).
# This is a best-effort pattern guard, not a shell parser or security boundary.
# Requires jq; malformed input or a missing jq deliberately fails open.
# ---------------------------------------------------------------------------

# --- helpers ---------------------------------------------------------------
die()  { printf 'HOOK BLOCK: %s\n' "$*" >&2; exit 2; }

# Extract the command string from the JSON payload.  Fail-open: if jq is
# missing or the payload is malformed we allow the command through rather
# than blocking every Bash call.
extract_cmd() {
  local raw
  if ! raw=$(jq -r '.tool_input.command // ""' 2>/dev/null); then
    echo "Hook: jq unavailable or malformed payload — allowing (fail-open)" >&2
    exit 0
  fi
  printf '%s' "$raw"
}

# --- main ------------------------------------------------------------------
cmd=$(extract_cmd)
[[ -z "$cmd" ]] && exit 0          # empty command → allow

# Normalise: strip backslash-escapes from word-characters so \sh → sh.
# This closes the `curl … | \sh` bypass while leaving intentional
# backslashes (e.g. in strings) alone.
norm=$(printf '%s' "$cmd" | sed 's/\\\([a-zA-Z]\)/\1/g')

# P1 — downloader piped into a shell.
#      .*\|  greedily consumes everything up to the *last* pipe, so
#      `curl … | grep … | sudo /bin/sh` is caught.
#      Between the last pipe and the shell we allow optional "prefix
#      commands" (sudo, env, command, timeout, …) each with optional
#      arguments.  KNOWN-LIMITATION: POSIX ERE (grep -E) doesn't support
#      non-greedy quantifiers, so a shell name appearing as a substring
#      inside a quoted prefix argument (e.g. `sudo -c 'run sh now'`) may
#      false-positive.  This pattern is vanishingly rare in practice.
if printf '%s' "$norm" | grep -qE \
  '\b(curl|wget|fetch)\b.*\|[[:space:]]*((sudo|env|exec|nice|nohup|timeout|command)([[:space:]]+[^|;<>]*?)?[[:space:]]+)*(/usr/bin/|/bin/|\./)?(sh|bash|zsh|ksh|dash|ash)\b'; then
  die "piping a downloader into a shell is unsafe. Save the script, inspect it, then execute."
fi

# P2 — command substitution fed to eval or a shell
#      eval "$(curl …)"  |  bash -c "$(curl …)"  |  sh <<< "$(curl …)"
if printf '%s' "$norm" | grep -qE \
  '\b(eval|sh|bash|zsh|ksh|dash|ash)\b.*\$\([^)]*\b(curl|wget|fetch)\b'; then
  die "command substitution of a downloader into a shell is unsafe."
fi

# P3 — process substitution feeding a shell
#      sh <(curl …)  |  bash <(wget …)
if printf '%s' "$norm" | grep -qE \
  '\b(sh|bash|zsh|ksh|dash|ash)\b[^|;<>]*<\([^)]*\b(curl|wget|fetch)\b'; then
  die "process substitution feeding a downloader into a shell is unsafe."
fi

exit 0
