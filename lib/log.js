// Minimal ANSI-colored logger. No deps; respects NO_COLOR + non-TTY stderr.
"use strict";

const isTTY = process.stderr.isTTY === true;
const noColor =
  process.env.NO_COLOR !== undefined || process.env.TERM === "dumb" || !isTTY;

const wrap = (code) => (noColor ? (s) => s : (s) => `\x1b[${code}m${s}\x1b[0m`);

const c = {
  red: wrap(31),
  green: wrap(32),
  yellow: wrap(33),
  blue: wrap(34),
  gray: wrap(90),
  bold: wrap(1),
};

function info(msg) {
  process.stderr.write(`${c.blue("info")}  ${msg}\n`);
}
function ok(msg) {
  process.stderr.write(`${c.green("ok")}    ${msg}\n`);
}
function warn(msg) {
  process.stderr.write(`${c.yellow("warn")}  ${msg}\n`);
}
function err(msg) {
  process.stderr.write(`${c.red("error")} ${msg}\n`);
}
function debug(msg) {
  if (process.env.BETTER_SKILLS_DEBUG) {
    process.stderr.write(`${c.gray("debug")} ${msg}\n`);
  }
}

module.exports = { info, ok, warn, err, debug, c };
