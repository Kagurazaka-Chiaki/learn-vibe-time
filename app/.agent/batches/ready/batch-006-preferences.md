# Batch 006 - Preferences

Status: DONE

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

Completed on 2026-04-30.

- Persisted selected city in localStorage.
- Added a compact settings panel for city, seconds visibility, and 12/24-hour mode.
- Added last-sync display and manual resync action.
- Kept local-time fallback calm and non-blocking.
- Checks run: `bun run test`, `bun run build`.
