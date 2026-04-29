# T007 - Clean App Entry

Status: DONE

## Goal

Remove starter UI and make the clock app the only screen.

## Scope

Allowed files:
- `src/App.tsx`
- `src/App.css`
- `src/TimeIsWidget.tsx`

## Steps

1. Remove Vite/Tauri/React logo UI.
2. Remove greet form and frontend `invoke("greet")` usage.
3. Render the clock page directly.
4. Keep `TimeIsWidget.tsx` only as a tiny compatibility wrapper if needed.

## Success Criteria

- App launches directly into the clock experience.
- No starter greet UI remains.
- `TimeIsWidget.tsx` is no longer a large file.

## Checks

Allowed checks:

```bash
bun run typecheck
bun run build
```

## Do Not

- Do not modify Rust command registration in this task.

## Fallback

Record a blocker if removing starter UI exposes unresolved imports.

## Review Notes

Confirm app entry is obvious for new maintainers.
