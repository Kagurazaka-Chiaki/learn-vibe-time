# T031 - Optional Main Clock Milliseconds

Status: DONE

## Goal

Add an optional, default-off millisecond display for the main clock.

## Scope

Allowed files:
- `src/domain/timeFormat.ts`
- `src/domain/timeFormat.test.ts`
- `src/hooks/useClock.ts`
- `src/hooks/useClockPreferences.ts`
- `src/hooks/useClockPreferences.test.ts`
- `src/components/ClockPage.tsx`
- `src/components/SettingsPanel.tsx`
- `.agent/RUNLOG.md`
- `.agent/BLOCKERS.md`

Read-only files:
- `src/components/CityRail.tsx`

## Steps

1. Add `showMilliseconds` to preferences with default `false`.
2. Add a settings checkbox labeled `显示毫秒`.
3. Extend time formatting so milliseconds force seconds and render `HH:mm:ss.SSS`.
4. Increase clock tick rate only when milliseconds are enabled.
5. Keep city rail minute-only.
6. Run frontend checks.

## Success Criteria

- Existing users default to no milliseconds.
- Enabling milliseconds changes the main clock to include `.SSS`.
- `showMilliseconds` survives preference storage roundtrip.
- City rail output remains unchanged.

## Checks

Allowed checks:

```bash
bun run typecheck
bun run test
bun run build
```

## Do Not

- Do not make milliseconds default.
- Do not add a diagnostics panel.
- Do not add dependencies.

## Fallback

If millisecond formatting is unreliable, keep the setting out of the UI and record a blocker.

## Review Notes

Completed in batch-011.
