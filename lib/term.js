// Tiny ANSI color helper shared across CLI / validate.js / runner.js.
// Honors NO_COLOR (https://no-color.org) and only emits escapes when stdout
// is a TTY — no leaked color codes when output is piped or redirected.
"use strict";

const COLORS = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  dim: "\x1b[90m",
  bold: "\x1b[1m",
};

function useColor() {
  return Boolean(process.stdout.isTTY) && !process.env.NO_COLOR;
}

function color(code, text) {
  return useColor() ? `${code}${text}${COLORS.reset}` : text;
}

module.exports = { COLORS, useColor, color };
