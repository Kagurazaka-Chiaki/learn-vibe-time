# Batch 005 - Desktop Polish

Status: READY

## Mode

- conservative
- batch-driven
- no dependency install
- no git push
- checkpoint commit after batch

## Max Tasks

3

## Tasks

1. `.agent/tasks/ready/T016-rename-tauri-app.md`
2. `.agent/tasks/ready/T017-responsive-polish.md`
3. `.agent/tasks/ready/T018-accessibility-pass.md`

## Allowed Commands

```bash
git status --short
git diff --stat
git diff
cargo check
bun run build
git add -A
git diff --cached --stat
git commit -m "feat(app): polish desktop clock shell"
```

## Forbidden Commands

```bash
git push
git reset --hard
git clean
bun install
```

## Exit Conditions

Stop when listed tasks are done or blocked, or visual polish requires manual design decisions.

## Completion Notes

To be filled after execution.
