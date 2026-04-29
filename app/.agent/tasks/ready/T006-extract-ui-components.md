# T006 - Extract UI Components

Status: READY

## Goal

Split the clock UI into small React components and move styles to CSS.

## Scope

Allowed files:
- `src/TimeIsWidget.tsx`
- `src/components/ClockPage.tsx`
- `src/components/ClockDisplay.tsx`
- `src/components/DatePanel.tsx`
- `src/components/SyncStatus.tsx`
- `src/components/CityRail.tsx`
- `src/styles/clock.css`

## Steps

1. Create focused display components.
2. Move inline styles into `src/styles/clock.css`.
3. Keep component files reasonably small.

## Success Criteria

- UI is composed from named components.
- Inline style objects are removed from the main clock implementation.
- Main clock entry is easy to read.

## Checks

Allowed checks:

```bash
bun run typecheck
bun run build
```

## Do Not

- Do not change the product layout beyond mechanical extraction.
- Do not add component test libraries.

## Fallback

Record a blocker if CSS extraction causes layout regressions that cannot be quickly corrected.

## Review Notes

Review CSS for responsive constraints and text overflow.
