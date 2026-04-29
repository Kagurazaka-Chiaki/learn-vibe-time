# T010 - Replace Frontend Sync

Status: READY

## Goal

Use the Tauri time sync command from the frontend clock hook.

## Scope

Allowed files:
- `src/domain/sync.ts`
- `src/hooks/useClock.ts`
- `src/components/SyncStatus.tsx`

## Steps

1. Define `TimeSyncResponse` and sync result helpers.
2. Call `invoke("sync_utc_time")` from the clock hook.
3. Remove frontend network fetch time sources.
4. Fall back to local time on command failure.

## Success Criteria

- Frontend uses Rust/Tauri sync when available.
- Browser/dev fallback does not crash when invoke fails.
- Sync state clearly distinguishes synced and local fallback.

## Checks

Allowed checks:

```bash
bun run typecheck
bun run build
```

## Do Not

- Do not add React component testing dependencies.

## Fallback

Record a blocker if Tauri invoke is not available in browser dev mode and no safe fallback is possible.

## Review Notes

Ensure offset calculation uses `utcMs - capturedAtMs`.
