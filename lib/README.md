# better-skills CLI — design contract

Phase 1.D ships an MVP CLI: `npx better-skills <cmd>` for install / list / remove / update / validate flows.
This file is the **design contract**. All implementation under `bin/` and `lib/` must conform; deviations require updating this doc first.

## Goals

1. **Zero runtime dependencies.** Built-ins only (`fs`, `path`, `child_process`). Reason: `npx better-skills` must be near-instant, and a v0.1 footprint should not pull in 50 MB of node_modules.
2. **Self-contained per target.** Each agent skill directory tracks its own installed-skills manifest. `better-skills` operations on `~/.claude/skills/` never touch `~/.cursor/skills/`.
3. **Explicit over magic.** Conflicts error by default; `--force` is the explicit override. No silent overwrites.
4. **Reuse the canonical registry.** `skills.json` is the single source of truth for what skills exist. The CLI does not maintain a parallel registry.

## Non-goals (deferred)

- Plugin/marketplace ecosystem
- Versioned skill installs (we copy `main`)
- Rollback / atomic transactions
- Watch mode

## Directory layout

```
bin/
  better-skills.js          # entrypoint; arg parsing + dispatch
lib/
  cli.js                    # orchestrator (help, version, error wrapping, exit codes)
  paths.js                  # target dir resolution
  resolver.js               # name → source location lookup
  installer.js              # copy semantics + dry-run
  manifest.js               # .better-skills.json read/write
  log.js                    # minimal ANSI-colored stderr/stdout
  yaml.js                   # tiny YAML parser for external/sources.yaml
  commands/
    add.js
    list.js
    remove.js
    update.js
    validate.js
    help.js
```

## Subcommands

| Command | Syntax | Behavior |
|---------|--------|----------|
| `list` | `better-skills list [--target X] [--installed]` | Default: list all skills from `skills.json` (self-developed + external). With `--installed`: only skills listed in the target manifest. |
| `add` | `better-skills add <name> [--target X] [--force] [--dry-run]` | Resolve `<name>` → source path; copy to `<target>/<name>/`; record in manifest. |
| `remove` | `better-skills remove <name> [--target X]` | Remove only files tracked in manifest; clean up empty dirs; update manifest. |
| `update` | `better-skills update [<name>] [--target X]` | Re-copy from source. With no `<name>`: update everything in manifest. |
| `validate` | `better-skills validate <name>` | Delegate to `tools/validate.sh skills/<name>/`. |
| `help` | `better-skills [--help \| help [<cmd>]]` | Print usage. |

## Targets

| `--target` | Resolved path |
|------------|---------------|
| `claude` (default) | `~/.claude/skills` |
| `codex` | `~/.agents/skills` |
| `cursor` | `~/.cursor/skills` |
| `<absolute path>` | as-is |
| `<relative path>` | error — be explicit |

`paths.js` exports `resolveTarget(targetArg)` returning `{ kind, dir }`.

## Manifest format — `<target>/.better-skills.json`

Single file per target dir. Atomic write via temp + rename.

```json
{
  "version": "0.1.0-dev",
  "updated_at": "2026-06-18T12:34:56Z",
  "installed": {
    "social-card": {
      "source": "self-developed",
      "from": "skills/social-card",
      "installed_at": "2026-06-18T12:34:56Z",
      "method": "copy",
      "files": ["SKILL.md", "assets/centered.html"]
    }
  }
}
```

`files` is the relative-to-`<target>/<name>/` list of every file installed by this CLI. `remove` uses this list verbatim — never `rm -rf` a directory the manifest hasn't accounted for.

## Conflict & error semantics

### `add <name>`

| Precondition | Behavior | Exit |
|--------------|----------|:---:|
| `<name>` not in `skills.json` | error: "skill not found in registry" | 3 |
| `<name>` already in target manifest | error: "already installed; use `--force` or `update`" | 4 |
| `<target>/<name>/` exists on disk but not in manifest | error: "directory exists but isn't tracked; rerun with `--force` to overwrite" | 4 |
| `<target>/<name>/` exists in manifest, `--force` set | remove tracked files, then copy | 0 |
| External skill source not yet cached | run `git clone --depth 1 --branch <ref> <repo>` into `~/.cache/better-skills/<source>/` then proceed | 0 |
| Source path missing on disk | error: "source path not found" | 5 |

### `remove <name>`

| Precondition | Behavior | Exit |
|--------------|----------|:---:|
| `<name>` not in manifest | error: "not installed" | 3 |
| File listed in manifest missing on disk | warn, continue | 0 |
| Manifest write fails after partial remove | error with recovery instructions | 5 |

## Exit codes

| Code | Meaning |
|:---:|---------|
| 0 | success |
| 1 | generic failure |
| 2 | usage error (bad args) |
| 3 | not found |
| 4 | conflict |
| 5 | integrity (corrupt manifest, missing source) |

## Path safety (hostile-input rules)

The CLI accepts `<name>` from argv and uses it to construct paths. To prevent path traversal:

1. **Validate `<name>`** against `^[a-z][a-z0-9-]*$` (kebab-case, lowercase). Reject anything else with usage error.
2. **Validate `--target` absolute paths**: must not contain `..` after normalization.
3. **`installer.js` enforces a sandbox**: every write target must be `path.resolve(targetDir, name, file)` and must start with `path.resolve(targetDir, name) + path.sep`. If not, abort.
4. **Source path resolution**: only paths read from `skills.json` are trusted; `<name>` argv is used solely as the registry key, never concatenated into a path.

## Testing surface

`tools/test-cli.sh` exercises:

1. `list` — output contains all 8 self-developed + 2 external skills
2. `list --installed` — empty manifest case
3. `add social-card --target /tmp/<sandbox>` — files appear, manifest is valid JSON, `installed.social-card.files` matches
4. `add social-card --target /tmp/<sandbox>` again → exit 4
5. `add social-card --target /tmp/<sandbox> --force` → exit 0, manifest timestamp updated
6. `remove social-card --target /tmp/<sandbox>` → files gone, manifest entry gone
7. `add ../../../etc/passwd` → exit 2 (usage error from name validation)
8. `add nonexistent` → exit 3
9. `add social-card --dry-run` → no files written, no manifest change

## Out of scope for v0.1 (future phases)

- `npm publish` mechanics — Phase 3
- CLI subcommands for batch ops (`add --batch batch-1`)
- Multi-target install (`--target claude,cursor`)
- Skill version pinning by git ref
- Conflict resolution UX (interactive prompt)
- Telemetry

## Known limitations (acknowledged, deferred)

These came up in the Phase 1.D adversarial review and are documented here rather than fixed because the fix expands scope beyond an MVP:

- **Concurrent `add` race.** Manifest read-modify-write is not locked. Two simultaneous `add` operations on the same target dir can lose one entry. Low probability for a single-user CLI; acceptable for v0.1. A lockfile or `O_EXCL` write would close the race in a future revision.
- **Stale external cache.** `~/.cache/better-skills/<source>/` is only populated on first miss; subsequent `add` of the same source uses the existing clone without `git fetch`. Users wanting fresh upstream must `rm -rf` the cache. Phase 3 will add an explicit `cache prune` / refresh policy.
- **`--target` symlink components.** A `--target` that contains a symlink resolves to its real path inside the manifest write but uses the symlink path elsewhere. Behavior is consistent but undocumented; users should pass real paths.
- **Mode preservation TOCTOU.** `chmod` is best-effort after `copyFileSync`. Source files with unusual modes (`0o000`) propagate to the destination.

## Phase 1.D adversarial review results

The CLI was reviewed by two independent agents in Phase 1.D.5. Critical and key Major findings were fixed in-phase:

| ID | Finding | Status |
|---|---------|:---:|
| C1 | Symlink in source tree could leak `/etc/passwd` content via `copyFileSync` | fixed (real-path check in `listRecursive`) |
| C2 | Corrupt `skills.json` exited 1 instead of 5 | fixed (`JSON.parse` wrapped) |
| C3 | `update` with missing source half-erased the install | fixed (`ensureSourceExists` before remove) |
| M3 | Corrupt `sources.yaml` exited 1 | fixed (yaml errors carry `EINTEGRITY`) |
| M4 | `resolveTarget(null)` defaulted silently | fixed (typed input check) |
| M5 | `safeJoin` accepted empty/`.` rel paths | fixed (explicit reject) |
| M6 | Partial `copyTree` failure left orphan files | fixed (rollback in `add`) |
| M9 | `--target /` returned raw `ENOENT` | fixed (wrapped as `EINTEGRITY`) |
| YAML | Tab indent silently produced wrong tree; inline comments included | fixed (tab rejected, inline stripped) |
