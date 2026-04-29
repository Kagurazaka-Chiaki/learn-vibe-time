# T017 - Responsive Polish

Status: READY

## Goal

Improve the clock layout across desktop and smaller windows.

## Scope

Allowed files:
- `src/styles/clock.css`
- `src/components/ClockPage.tsx`
- `src/components/CityRail.tsx`

## Steps

1. Prevent clock text overflow in narrow windows.
2. Make city rail usable on small widths.
3. Keep UI dense and work-focused, not a landing page.

## Success Criteria

- Main clock remains readable at `720x480`.
- City rail does not overlap content.

## Checks

Allowed checks:

```bash
bun run build
```

## Do Not

- Do not add decorative hero sections or marketing copy.

## Fallback

Record a blocker if responsive behavior cannot be validated without a browser run.

## Review Notes

Manual screenshot verification is recommended.
