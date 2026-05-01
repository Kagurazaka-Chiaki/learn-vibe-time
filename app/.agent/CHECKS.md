# Checks

This file defines project-neutral check expectations. The active batch and active task remain the authority for which commands may be run.

## Principles

- Run the smallest check that can verify the task result.
- Prefer read-only checks unless the task explicitly permits writes.
- If a check cannot run, record why instead of inventing success.
- Validation does not make agent work accepted; human review remains required.

## Common Read-Only Checks

```bash
git status --short
git diff --stat
git diff
find .agent -maxdepth 3 -type f
rg "<pattern>"
```

## App Checks

`bun run build` may be used for this Tauri + React app only when an active task
or batch explicitly allows it. Do not run dependency install commands as a
fallback for build failures unless the active task explicitly permits it.

Release-facing app changes should additionally run a Tauri debug build when the
active batch allows it:

```bash
bun run tauri build --debug
```

The reviewer should inspect the resulting executable and installer names for
version and product-name consistency.

Time-sync changes should run both frontend and Rust checks when the active batch
allows them:

```bash
bun run test
cargo test
```

For sync UI work, search user-facing files for overconfident wording:

```bash
rg "精确度|精度|precision" src README.md README.en.md
```

## Failure Record

When a check fails, record:

- command
- exit code when available
- short error summary
- likely category: environment, dependency, code, scope, or unknown
- next safe action

## Review Record

After checks, `.agent/RUNLOG.md` should state:

- checks run
- result
- modified files
- blockers or residual risks
- checkpoint commit hash, if one was created
- AI review report path, if one was created

## Checkpoint Commit Checks

Before a local checkpoint commit, inspect:

```bash
git status --short
git diff --stat
git diff
```

After staging under `.agent/GIT_POLICY.md`, inspect:

```bash
git diff --cached --stat
git diff --cached
```

If any staged file is outside task scope, contains secrets, or includes an unauthorized deletion, stop and unstage or ask the user.

## AI Review Checks

At a batch/checkpoint gate, confirm:

- `.agent/RUNLOG.md` describes actual work.
- `.agent/BLOCKERS.md` is current.
- task and batch status match the runlog.
- checks are recorded.
- proposed skills are listed in `.agent/SKILLS.md`.
- the AI review report is written under `.agent/reports/`.
