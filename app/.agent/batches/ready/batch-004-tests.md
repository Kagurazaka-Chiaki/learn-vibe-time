# Batch 004 - Tests

Status: READY

## Mode

- conservative
- batch-driven
- dependency install allowed for Vitest
- no git push
- checkpoint commit after batch

## Max Tasks

4

## Tasks

1. `.agent/tasks/ready/T012-add-vitest.md`
2. `.agent/tasks/ready/T013-test-time-format.md`
3. `.agent/tasks/ready/T014-test-solar-domain.md`
4. `.agent/tasks/ready/T015-test-sync-state.md`

## Allowed Commands

```bash
git status --short
git diff --stat
git diff
bun install
bun run typecheck
bun run test
bun run build
git add -A
git diff --cached --stat
git commit -m "test(app): cover clock domain logic"
```

## Forbidden Commands

```bash
git push
git reset --hard
git clean
```

## Exit Conditions

Stop when tests pass and tasks are done, dependency install is unavailable, or failures require broader architecture changes.

## Completion Notes

To be filled after execution.
