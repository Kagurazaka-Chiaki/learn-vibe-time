# T020 - Add Settings Panel

Status: READY

## Goal

Add a minimal settings surface for clock preferences.

## Scope

Allowed files:
- `src/components/ClockPage.tsx`
- `src/components/SettingsPanel.tsx`
- `src/hooks/useClockPreferences.ts`
- `src/styles/clock.css`

## Steps

1. Add settings for default city, show seconds, and 12/24-hour mode.
2. Keep settings compact and unobtrusive.
3. Persist preferences locally.

## Success Criteria

- User can change basic display preferences.
- Preferences survive refresh.

## Checks

Allowed checks:

```bash
bun run build
```

## Do Not

- Do not build nested cards or a marketing-style settings page.

## Fallback

Record a blocker if preferences conflict with existing clock formatting.

## Review Notes

Keep interaction simple for MVP.
