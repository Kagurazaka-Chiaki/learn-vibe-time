# T019 - Persist Default City

Status: DONE

## Goal

Persist the selected city locally.

## Scope

Allowed files:
- `src/hooks/useSelectedCity.ts`
- `src/data/cities.ts`

## Steps

1. Store selected city key in `localStorage`.
2. Validate stored keys against known cities.
3. Fall back to Sydney for missing or invalid values.

## Success Criteria

- Refreshing the app preserves selected city.
- Invalid stored values do not break the app.

## Checks

Allowed checks:

```bash
bun run test
bun run build
```

## Do Not

- Do not add cloud sync or accounts.

## Fallback

Record a blocker if localStorage is unavailable in the target context.

## Review Notes

Keep storage key stable and documented in code.
