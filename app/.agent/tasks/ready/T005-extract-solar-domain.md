# T005 - Extract Solar Domain

Status: READY

## Goal

Move solar calculations into a domain module and handle invalid sun-time cases safely.

## Scope

Allowed files:
- `src/TimeIsWidget.tsx`
- `src/domain/solar.ts`

## Steps

1. Extract sunrise, sunset, and day-length calculations.
2. Remove unused solar helpers.
3. Return `null` for invalid hour-angle or non-finite results.
4. Display `太阳数据暂不可用` when solar data is unavailable.

## Success Criteria

- Solar logic is isolated.
- Invalid coordinates or extreme conditions do not crash UI.
- Normal city solar output remains available.

## Checks

Allowed checks:

```bash
bun run typecheck
bun run build
```

## Do Not

- Do not introduce external astronomy dependencies.
- Do not redesign the UI.

## Fallback

Record a blocker if extracted calculations disagree with current normal-city behavior.

## Review Notes

Check Sydney output manually after extraction.
