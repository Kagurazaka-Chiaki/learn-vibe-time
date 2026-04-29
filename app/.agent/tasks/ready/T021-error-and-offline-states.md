# T021 - Error and Offline States

Status: READY

## Goal

Make time sync failure states clear without disrupting the clock.

## Scope

Allowed files:
- `src/hooks/useClock.ts`
- `src/components/SyncStatus.tsx`
- `src/styles/clock.css`

## Steps

1. Show last successful sync time when available.
2. Add manual resync action.
3. Keep local-time fallback visually calm.

## Success Criteria

- Offline use remains readable.
- User can retry sync manually.
- Status clearly explains current source.

## Checks

Allowed checks:

```bash
bun run test
bun run build
```

## Do Not

- Do not block the clock while sync retries.

## Fallback

Record a blocker if manual retry requires broader state refactor.

## Review Notes

Network errors should be visible but not alarming.
