# T024 - Sync Copy No Overpromise

Status: DONE

## Goal

Remove overconfident "precision" language from sync status copy.

## Scope

Allowed files:
- `src/domain/sync.ts`
- `src/domain/sync.test.ts`
- `src/components/SyncStatus.tsx`
- `README.md`
- `../README.md`
- `../README.en.md`
- `../REPORT.md`
- `.agent/RUNLOG.md`
- `.agent/BLOCKERS.md`

Read-only files:
- `src/domain/timeFormat.ts`

## Steps

1. Rename UI copy from precision to estimated sync error or network delay estimate.
2. Update sync domain tests to cover the new copy.
3. Ensure no user-facing Chinese copy says `精确度` or `精度` for network sync.

## Success Criteria

- UI copy does not overpromise clock precision.
- Tests cover the new sync copy.
- Existing fallback behavior still works.

## Checks

Allowed checks:

```bash
bun run typecheck
bun run test
rg "精确度|精度" src README.md README.en.md
```

## Do Not

- Do not change transport behavior in this task.
- Do not rename unrelated time formatting helpers.
- Do not install dependencies.

## Fallback

If copy cannot be represented with current state, record a blocker and continue to the failure-details task.

## Review Notes

Completed in the continuous release and sync hardening run.
