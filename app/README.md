# Vibe Time

Vibe Time is a Tauri + React desktop clock positioned as a fully
`iota-agnt001`-driven application with no human-written application code. It is
an ad-free desktop clock that takes design cues from Time.is for daily desktop
use, so checking the current time does not require keeping another Chrome tab
open.

This project is also the trial project for the local `iota-agnt01` agent
harness. The codebase is intentionally small enough for task-driven agent work
while still exercising frontend architecture, Rust/Tauri integration, time
correctness, desktop UX, and test coverage.

## Current State

- The app runs as a Tauri + React + TypeScript desktop/Web app.
- `src/TimeIsWidget.tsx` is now only a compatibility export.
- The main UI is split across `src/components/`, `src/domain/`, `src/hooks/`,
  `src/data/`, and `src/styles/`.
- Rust/Tauri provides the UTC synchronization command with network delay and estimated error reporting.
- The agent control plane is initialized under `.agent/`.

## Tech Stack

- React 19
- TypeScript
- Vite
- Tauri 2
- Bun for frontend scripts
- Rust for the Tauri backend shell
- Vitest for domain tests

## Development Commands

Run from this `app/` directory:

```bash
bun run dev
bun run build
bun run test
bun run typecheck
bun run tauri dev
```

Measure dev runtime resource usage after starting Tauri:

```bash
bun run measure:dev -- -Seconds 60 -IntervalSeconds 1
```

## Agent Workflow

Before using an agent to change this project, read:

1. `AGENTS.md`
2. `.agent/STATE.md`
3. the active batch file, if one is configured

New work should be described as small tasks under `.agent/tasks/ready/`, grouped
into a batch under `.agent/batches/ready/`, and executed through the batch
protocol. Business code changes should stay inside the active task scope.

## License

MIT.
