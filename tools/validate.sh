#!/bin/bash
# Backward-compatible wrapper around tools/validate.js.
# Use `node tools/validate.js` directly for new workflows.
exec node "$(dirname "$0")/validate.js" "$@"
