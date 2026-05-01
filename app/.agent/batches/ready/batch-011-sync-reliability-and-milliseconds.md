# Batch 2026-05-01-011 - Sync Reliability and Milliseconds

Status: DONE

## Mode

- no network
- no dependency install
- no git push
- no `git add .`
- checkpoint commits governed by `.agent/GIT_POLICY.md`
- active batch only

## Max Tasks

3

## Tasks

1. `.agent/tasks/ready/T029-prevent-stale-sync-overwrite.md`
2. `.agent/tasks/ready/T030-validate-and-split-sntp.md`
3. `.agent/tasks/ready/T031-optional-main-clock-milliseconds.md`

## Allowed Commands

```bash
git status
git diff --stat
git diff -- <path>
bun run typecheck
bun run test
bun run build
cargo test
bun run tauri build --debug
git add -A
git diff --cached --stat
git diff --cached
git commit -m "<message>"
git log --oneline -1
```

## Forbidden Commands

```bash
git push
git add .
npm install
pip install
uv add
scoop install
winget install
rm -rf
```

## Exit Conditions

Stop when:

- all listed tasks are done or blocked
- a check fails and cannot be fixed within listed task scope
- continuing would require install, publish, push, signing, or deletion
- checkpoint commit safety checks fail

## Completion Notes

Completed. Sync requests now ignore stale async results, SNTP implementation is split into `time_sync/sntp.rs` with response validation tests, and the main clock has a default-off milliseconds setting.
