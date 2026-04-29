# Batch 006 - Preferences

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

1. `.agent/tasks/ready/T019-persist-default-city.md`
2. `.agent/tasks/ready/T020-add-settings-panel.md`
3. `.agent/tasks/ready/T021-error-and-offline-states.md`

## Allowed Commands

```bash
git status --short
git diff --stat
git diff
bun run test
bun run build
git add -A
git diff --cached --stat
git commit -m "feat(app): add basic clock preferences"
```

## Forbidden Commands

```bash
git push
git reset --hard
git clean
bun install
```

## Exit Conditions

Stop when listed tasks are done or blocked, or preference scope needs product decisions.

## Completion Notes

To be filled after execution.
