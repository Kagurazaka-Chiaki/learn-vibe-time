# T022 - Stabilize Current UI Diagnostics

Status: DONE

## Goal

Keep the current desktop interaction fixes reviewable and ensure the diagnostic probe never appears in normal release builds.

## Scope

Allowed files:
- `src/components/ClockPage.tsx`
- `src/components/InteractionProbe.tsx`
- `src/components/SettingsPanel.tsx`
- `src/styles/clock.css`
- `.agent/RUNLOG.md`
- `.agent/BLOCKERS.md`

Read-only files:
- `src/components/CityRail.tsx`
- `src/components/ClockDisplay.tsx`

## Steps

1. Review the existing dirty UI and diagnostic changes.
2. Keep `InteractionProbe` gated behind `VITE_INTERACTION_PROBE=1`.
3. Keep settings inputs explicitly labeled and clickable on desktop.
4. Keep non-interactive clock/date display elements from intercepting pointer events.
5. Run allowed checks and record the result.

## Success Criteria

- Normal builds do not render the interaction probe.
- Diagnostic builds can render pointer/click/key counters.
- Settings controls and city buttons remain clickable.
- No unrelated UI files are modified.

## Checks

Allowed checks:

```bash
bun run typecheck
bun run test
bun run build
git diff -- src/components/ClockPage.tsx src/components/InteractionProbe.tsx src/components/SettingsPanel.tsx src/styles/clock.css
```

## Do Not

- Do not remove the desktop interaction fixes without a replacement.
- Do not show diagnostic UI in normal builds.
- Do not run `git push`.
- Do not install dependencies.
- Do not delete files.

## Fallback

If the interaction probe or click fixes cannot be kept safely, record a blocker and leave the probe disabled in normal builds.

## Review Notes

Completed in the continuous release and sync hardening run.
