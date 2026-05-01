# T027 - Display Offset Delay Source

Status: DONE

## Goal

Display sync offset, network delay estimate, source, and latest successful sync clearly.

## Scope

Allowed files:
- `src/domain/sync.ts`
- `src/domain/sync.test.ts`
- `src/components/SyncStatus.tsx`
- `src/styles/clock.css`
- `.agent/RUNLOG.md`
- `.agent/BLOCKERS.md`

Read-only files:
- `src/hooks/useClock.ts`

## Steps

1. Show offset direction and amount.
2. Show network delay estimate and estimated sync error.
3. Show source name and host when available.
4. Keep failed fallback copy explicit.

## Success Criteria

- Synced UI includes source, offset, delay, estimated error, and latest successful sync.
- Failed UI says current local system time is being used.
- Tests cover rendered copy helpers.

## Checks

Allowed checks:

```bash
bun run typecheck
bun run test
bun run build
```

## Do Not

- Do not use the word `precision` in user-facing copy.
- Do not introduce a new UI layout system.
- Do not install dependencies.

## Fallback

If the compact status becomes unreadable, record a blocker and keep the existing status layout with corrected labels.

## Review Notes

Completed in the continuous release and sync hardening run.
