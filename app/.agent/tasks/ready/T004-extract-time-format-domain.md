# T004 - Extract Time Format Domain

Status: DONE

## Goal

Move date/time formatting helpers into a domain module and fix midnight formatting risk.

## Scope

Allowed files:
- `src/TimeIsWidget.tsx`
- `src/domain/timeFormat.ts`

## Steps

1. Extract local date parts, clock, city time, Chinese date, ISO week, and day-of-year helpers.
2. Use `hourCycle: "h23"` where hour formatting is needed.
3. Normalize formatted hour `"24"` to `"00"`.

## Success Criteria

- Formatting helpers are reusable and typed.
- `24:xx:xx` does not appear for midnight.
- Current UI strings are preserved except for corrected midnight behavior.

## Checks

Allowed checks:

```bash
bun run typecheck
bun run build
```

## Do Not

- Do not add test dependencies in this task.
- Do not change visual layout.

## Fallback

Record a blocker if browser Intl behavior cannot be normalized safely.

## Review Notes

Prioritize correctness over locale cleverness.
