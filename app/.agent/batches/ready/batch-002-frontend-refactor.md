# Batch 002 - Frontend Refactor

Status: READY

## Mode

- conservative
- batch-driven
- no git push
- dependency install not required
- checkpoint commit after batch

## Max Tasks

5

## Tasks

1. `.agent/tasks/ready/T003-extract-city-data.md`
2. `.agent/tasks/ready/T004-extract-time-format-domain.md`
3. `.agent/tasks/ready/T005-extract-solar-domain.md`
4. `.agent/tasks/ready/T006-extract-ui-components.md`
5. `.agent/tasks/ready/T007-clean-app-entry.md`

## Allowed Commands

```bash
git status --short
git diff --stat
git diff
bun run typecheck
bun run build
git add -A
git diff --cached --stat
git commit -m "refactor(app): split clock UI and remove starter screen"
```

## Forbidden Commands

```bash
git push
git reset --hard
git clean
bun install
```

## Exit Conditions

Stop when all listed tasks are done or blocked, checks fail twice for unclear reasons, or scope must expand.

## Completion Notes

To be filled after execution.
