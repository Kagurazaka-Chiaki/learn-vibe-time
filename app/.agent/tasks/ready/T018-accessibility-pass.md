# T018 - Accessibility Pass

Status: DONE

## Goal

Improve basic accessibility of the clock UI.

## Scope

Allowed files:
- `src/components/ClockDisplay.tsx`
- `src/components/CityRail.tsx`
- `src/components/SyncStatus.tsx`

## Steps

1. Ensure city buttons have clear labels and `aria-pressed`.
2. Avoid screen reader announcements every second.
3. Check text contrast and focus states.

## Success Criteria

- Clock is not noisy for assistive tech.
- Buttons are understandable and keyboard reachable.

## Checks

Allowed checks:

```bash
bun run build
```

## Do Not

- Do not add external accessibility libraries.

## Fallback

Record a blocker if accessibility behavior requires manual tooling not available locally.

## Review Notes

Prefer semantic HTML over ARIA where possible.
