# T012 - Add Vitest

Status: READY

## Goal

Add minimal test tooling for domain logic.

## Scope

Allowed files:
- `package.json`
- `bun.lock`
- `vite.config.ts`

## Steps

1. Add `vitest` as a dev dependency.
2. Add scripts: `test`, `test:watch`, `typecheck`.
3. Keep test config minimal.

## Success Criteria

- `bun run typecheck` works.
- `bun run test` runs.

## Checks

Allowed checks:

```bash
bun install
bun run typecheck
bun run test
```

## Do Not

- Do not add React Testing Library in this task.

## Fallback

Record a blocker if dependency installation is unavailable.

## Review Notes

Keep dependency footprint small.
