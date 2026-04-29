# T013 - Test Time Format

Status: DONE

## Goal

Cover core date/time formatting behavior with Vitest.

## Scope

Allowed files:
- `src/domain/timeFormat.ts`
- `src/domain/timeFormat.test.ts`

## Steps

1. Test ISO week calculation.
2. Test day-of-year calculation.
3. Test midnight formatting does not emit `24`.
4. Test representative time zones.

## Success Criteria

- Tests cover known formatting risks.
- Tests pass under `bun run test`.

## Checks

Allowed checks:

```bash
bun run test
bun run build
```

## Do Not

- Do not test implementation details that make refactoring harder.

## Fallback

Record a blocker if local Intl output differs unexpectedly.

## Review Notes

Use fixed UTC Date inputs.
