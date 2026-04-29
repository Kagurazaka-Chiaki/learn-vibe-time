# T014 - Test Solar Domain

Status: READY

## Goal

Cover solar calculation behavior and invalid-case fallback.

## Scope

Allowed files:
- `src/domain/solar.ts`
- `src/domain/solar.test.ts`

## Steps

1. Test Sydney sunrise/sunset for a fixed date returns finite values.
2. Test daylight duration is positive.
3. Test extreme invalid cases return unavailable data instead of crashing.

## Success Criteria

- Normal solar data is valid.
- Invalid data path is tested.

## Checks

Allowed checks:

```bash
bun run test
bun run build
```

## Do Not

- Do not assert exact minute-level astronomy unless necessary.

## Fallback

Record a blocker if calculations are too unstable for useful tests.

## Review Notes

Prefer broad correctness assertions.
