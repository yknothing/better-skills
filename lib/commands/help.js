"use strict";

const HELP = {
  _: `better-skills — install Agent Skills from the better-skills toolkit

Usage:
  better-skills <command> [options]

Commands:
  list                       List all skills in the registry
  add <name>                 Install a skill into the target dir
  remove <name>              Remove a previously installed skill
  update [<name>]            Re-copy a skill (or all installed) from source
  validate <name>            Run Gate 1 validation on a skill
  help [<command>]           Show usage for a command

Common options:
  --target <claude|codex|cursor|/abs/path>   Default: claude
  --force                                     Overwrite existing install
  --dry-run                                   Print actions, write nothing
  --debug                                     Verbose error output
  --version                                   Print CLI version

Examples:
  better-skills list
  better-skills add bs-social-card
  better-skills add brainstorming --target cursor
  better-skills add bs-visual-design --force
  better-skills remove bs-social-card
`,

  list: `better-skills list — list registered skills

Usage:
  better-skills list [--target <X>] [--installed]

Options:
  --installed   Only list skills present in the target manifest
  --target <X>  Target dir; only meaningful with --installed
`,

  add: `better-skills add <name> — install a skill

Usage:
  better-skills add <name> [--target <X>] [--force] [--dry-run]

Behavior:
  - Resolves <name> via skills.json and copies the source tree to <target>/<name>/
  - For external skills, clones the upstream repo into ~/.cache/better-skills/<source>/ on first use
  - Records every copied file in <target>/.better-skills.json (the manifest)
  - Errors with exit 4 if <name> is already installed; --force overwrites
`,

  remove: `better-skills remove <name> — remove an installed skill

Usage:
  better-skills remove <name> [--target <X>]

Behavior:
  - Only removes files tracked in the manifest — never rm -rf an unknown directory
  - Cleans up empty parent dirs
  - Errors with exit 3 if <name> is not in the manifest
`,

  update: `better-skills update [<name>] — re-copy from source

Usage:
  better-skills update [<name>] [--target <X>] [--dry-run]

Behavior:
  - Removes tracked files for <name>, then re-installs from current source
  - With no <name>: updates every skill in the manifest
`,

  validate: `better-skills validate <name> — run Gate 1 validation

Usage:
  better-skills validate <name>

Behavior:
  - Resolves <name> in skills.json
  - Delegates to tools/validate.sh against the source path
`,
};

function run({ _, flags } = { _: [], flags: {} }) {
  const sub = _[0];
  const text = HELP[sub] || HELP._;
  process.stdout.write(text);
  return 0;
}

module.exports = { run, HELP };
