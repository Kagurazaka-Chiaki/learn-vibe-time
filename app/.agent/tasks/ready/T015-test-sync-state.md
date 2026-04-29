# T015 - Test Sync State

Status: READY

## Goal

Cover sync offset and fallback pure functions.

## Scope

Allowed files:
- `src/domain/sync.ts`
- `src/domain/sync.test.ts`

## Steps

1. Test offset calculation from `utcMs` and `capturedAtMs`.
2. Test precision formatting.
3. Test drift label behavior including near-zero offsets.
4. Test local fallback state shape.

## Success Criteria

- Sync status logic is covered without mocking network.
- Tests pass under `bun run test`.

## Checks

Allowed checks:

```bash
bun run test
bun run build
```

## Do Not

- Do not integration-test Tauri invoke in Vitest.

## Fallback

Record a blocker if sync logic is not yet factored into pure functions.

## Review Notes

Keep command invocation separate from pure state calculations.
