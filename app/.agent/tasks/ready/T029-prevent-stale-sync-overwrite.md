# T029 - Prevent Stale Sync Overwrite

Status: DONE

## Goal

Ensure older async sync requests cannot overwrite newer sync state.

## Scope

Allowed files:
- `src/hooks/useClock.ts`
- `src/hooks/useClock.test.ts`
- `.agent/RUNLOG.md`
- `.agent/BLOCKERS.md`

Read-only files:
- `src/domain/sync.ts`

## Steps

1. Add a latest-request guard around `syncOnce`.
2. Apply successful and failed sync results only if they belong to the latest request.
3. Add a small testable helper for stale-result decisions if hook-level tests are not available.
4. Run frontend checks.

## Success Criteria

- A stale success cannot overwrite a newer result.
- A stale failure cannot overwrite a newer success.
- Manual resync still uses the same `syncOnce` callback.

## Checks

Allowed checks:

```bash
bun run typecheck
bun run test
```

## Do Not

- Do not add testing dependencies.
- Do not change the Tauri command shape.
- Do not run `git push`.

## Fallback

If hook-level testing is not feasible without dependencies, test a pure helper and document the remaining hook wiring risk.

## Review Notes

Completed in batch-011.
