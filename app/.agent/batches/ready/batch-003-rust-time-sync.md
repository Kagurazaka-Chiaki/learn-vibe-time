# Batch 003 - Rust Time Sync

Status: DONE

## Mode

- conservative
- batch-driven
- network allowed only for dependency download and time-source checks required by tasks
- no git push
- checkpoint commit after batch

## Max Tasks

4

## Tasks

1. `.agent/tasks/ready/T008-add-rust-time-sync-command.md`
2. `.agent/tasks/ready/T009-wire-tauri-command.md`
3. `.agent/tasks/ready/T010-replace-frontend-sync.md`
4. `.agent/tasks/ready/T011-sync-status-copy.md`

## Allowed Commands

```bash
git status --short
git diff --stat
git diff
cargo check
bun run typecheck
bun run build
git add -A
git diff --cached --stat
git commit -m "feat(time): sync clock through Tauri command"
```

## Forbidden Commands

```bash
git push
git reset --hard
git clean
```

## Exit Conditions

Stop when all listed tasks are done or blocked, dependency fetch is unavailable, or command registration cannot be verified.

## Completion Notes

Completed on 2026-04-29.

- Added Rust/Tauri `sync_utc_time` command backed by network UTC sources.
- Registered the command and removed the starter `greet` command.
- Added frontend sync domain helpers and replaced frontend fetch-based time sync with Tauri invoke.
- Added Chinese sync status copy for synced and local fallback states.
- Checks run: `bun run build`, `cargo check`.
