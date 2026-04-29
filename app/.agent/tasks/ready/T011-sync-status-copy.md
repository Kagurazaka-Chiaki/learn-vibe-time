# T011 - Sync Status Copy

Status: DONE

## Goal

Polish Chinese sync status and clock drift copy.

## Scope

Allowed files:
- `src/domain/sync.ts`
- `src/components/SyncStatus.tsx`
- `src/components/ClockPage.tsx`

## Steps

1. Show synced source and precision.
2. Show local fallback message when sync fails.
3. Show `基本准确` when absolute offset is below 0.05 seconds.
4. Show fast/slow copy for larger offsets.

## Success Criteria

- Sync status is understandable in Chinese.
- Small offsets do not look alarming.

## Checks

Allowed checks:

```bash
bun run typecheck
bun run build
```

## Do Not

- Do not change sync transport behavior.

## Fallback

Record a blocker if copy cannot be represented with existing sync state.

## Review Notes

Check copy in synced and fallback states.
