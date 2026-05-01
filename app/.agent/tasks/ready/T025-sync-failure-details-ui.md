# T025 - Sync Failure Details UI

Status: DONE

## Goal

Carry network sync failure details from Rust/Tauri errors into the visible UI without blocking the clock.

## Scope

Allowed files:
- `src/domain/sync.ts`
- `src/domain/sync.test.ts`
- `src/hooks/useClock.ts`
- `src/components/SyncStatus.tsx`
- `src/styles/clock.css`
- `src-tauri/src/time_sync.rs`
- `.agent/RUNLOG.md`
- `.agent/BLOCKERS.md`

Read-only files:
- `src/domain/timeFormat.ts`

## Steps

1. Preserve error details from rejected `sync_utc_time` invokes.
2. Track last successful sync separately from last failure.
3. Show current local fallback, latest failure, and detail text.
4. Keep the clock ticking from local system time when sync fails.

## Success Criteria

- Failure details are visible in sync status.
- A failed sync does not update the last successful sync timestamp.
- Tests cover success and failure states.

## Checks

Allowed checks:

```bash
bun run typecheck
bun run test
bun run build
```

## Do Not

- Do not block rendering while network sync retries.
- Do not hide the manual resync action.
- Do not install dependencies.

## Fallback

If the Tauri error payload cannot be structured safely, preserve and display the string error message.

## Review Notes

Completed in the continuous release and sync hardening run.
