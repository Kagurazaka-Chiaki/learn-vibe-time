# T003 - Extract City Data

Status: DONE

## Goal

Move city metadata out of `TimeIsWidget.tsx`.

## Scope

Allowed files:
- `src/TimeIsWidget.tsx`
- `src/data/cities.ts`

## Steps

1. Create `src/data/cities.ts`.
2. Move `City`, `CITIES`, and default city key there.
3. Update imports without changing behavior.

## Success Criteria

- City data has a single source of truth.
- Default city remains Sydney.
- UI behavior is unchanged.

## Checks

Allowed checks:

```bash
bun run typecheck
bun run build
```

## Do Not

- Do not change city labels or time zones.
- Do not modify Rust/Tauri files.

## Fallback

Record a blocker in `.agent/BLOCKERS.md` if extraction causes type or runtime ambiguity.

## Review Notes

Check for accidental data changes.
