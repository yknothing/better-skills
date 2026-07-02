// CLI orchestrator: parse argv, dispatch to commands, map errors to exit codes.
"use strict";

const log = require("./log");
const help = require("./commands/help");

const COMMANDS = {
  list: () => require("./commands/list"),
  add: () => require("./commands/add"),
  remove: () => require("./commands/remove"),
  update: () => require("./commands/update"),
  validate: () => require("./commands/validate"),
  help: () => help,
};

const ERR_EXIT = {
  EUSAGE: 2,
  ENOTFOUND: 3,
  ECONFLICT: 4,
  EINTEGRITY: 5,
};

// argv parser — minimal, hand-rolled. Returns { _: [positional], flags: {...} }.
// Boolean flags: --force, --installed, --dry-run, --debug, --help, --version
// Value flags: --target <x>
const BOOL_FLAGS = new Set([
  "force",
  "installed",
  "dry-run",
  "debug",
  "help",
  "version",
]);
const VALUE_FLAGS = new Set(["target"]);

function parseArgs(argv) {
  const out = { _: [], flags: {} };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith("--")) {
      const eq = a.indexOf("=");
      let key, val;
      if (eq > -1) {
        key = a.slice(2, eq);
        val = a.slice(eq + 1);
      } else {
        key = a.slice(2);
        val = undefined;
      }
      if (BOOL_FLAGS.has(key)) {
        out.flags[key] = true;
      } else if (VALUE_FLAGS.has(key)) {
        if (val === undefined) {
          val = argv[++i];
          if (val === undefined) {
            const e = new Error(`flag --${key} requires a value`);
            e.code = "EUSAGE";
            throw e;
          }
        }
        out.flags[key] = val;
      } else {
        const e = new Error(`unknown flag: --${key}`);
        e.code = "EUSAGE";
        throw e;
      }
    } else if (a.startsWith("-") && a.length > 1) {
      const e = new Error(`short flags are not supported: ${a}`);
      e.code = "EUSAGE";
      throw e;
    } else {
      out._.push(a);
    }
  }
  return out;
}

function pkgVersion() {
  try {
    return require("../package.json").version;
  } catch (_) {
    return "unknown";
  }
}

async function run(argv) {
  let parsed;
  try {
    parsed = parseArgs(argv);
  } catch (e) {
    log.err(e.message);
    log.info("run `better-skills help` for usage");
    return 2;
  }

  if (parsed.flags.debug) process.env.BETTER_SKILLS_DEBUG = "1";

  if (parsed.flags.version) {
    process.stdout.write(pkgVersion() + "\n");
    return 0;
  }

  const cmd = parsed._[0];

  if (!cmd || parsed.flags.help) {
    if (cmd && parsed.flags.help) {
      help.run({ _: [cmd], flags: {} });
    } else {
      help.run({ _: [], flags: {} });
    }
    return 0;
  }

  const factory = COMMANDS[cmd];
  if (!factory) {
    log.err(`unknown command: ${cmd}`);
    log.info("run `better-skills help` to see available commands");
    return 2;
  }

  const handler = factory();
  parsed._ = parsed._.slice(1);

  try {
    const code = await handler.run(parsed);
    return typeof code === "number" ? code : 0;
  } catch (e) {
    log.err(e.message);
    if (process.env.BETTER_SKILLS_DEBUG && e.stack) {
      process.stderr.write(e.stack + "\n");
    }
    return ERR_EXIT[e.code] || 1;
  }
}

module.exports = { run, parseArgs, pkgVersion };
