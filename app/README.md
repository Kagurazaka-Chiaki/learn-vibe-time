# Time.is-Inspired Clock App

This app is a small Tauri + React project for building a clean, ad-free clock
experience inspired by Time.is. The goal is to keep the useful parts of a
precise web clock available as both a browser app and a lightweight desktop app,
without needing to keep another Chrome tab open.

This is also the trial project for the local `iota-agnt01` agent harness. The
project is intentionally small enough for task-driven agent work while still
being useful as a real desktop utility.

## Current State

- The app is based on the Tauri + React + TypeScript starter.
- `src/TimeIsWidget.tsx` contains the first Time.is-inspired clock prototype.
- `src/App.tsx` still includes starter UI around the clock widget.
- The Tauri shell is still using starter product/window metadata.
- The agent control plane has been initialized under `.agent/`.

## Tech Stack

- React 19
- TypeScript
- Vite
- Tauri 2
- Bun for frontend scripts
- Rust for the Tauri backend shell

## Development Commands

Run from this `app/` directory:

```bash
bun run dev
bun run build
bun run tauri dev
```

## Agent Workflow

Before using an agent to change this project, read:

1. `AGENTS.md`
2. `.agent/STATE.md`
3. the active batch file, if one is configured

New work should be described as small tasks under `.agent/tasks/ready/`, grouped
into a batch under `.agent/batches/ready/`, and executed through the batch
protocol. Business code changes should stay inside the active task scope.

## Suggested Next Tasks

- Make `TimeIsWidget` the primary app screen and remove starter UI.
- Rename Tauri product/window metadata from the starter `app` name.
- Add focused city/time display settings.
- Decide whether time sync should remain browser fetch based or move behind a
Tauri command.
- Add a first real agent task and batch for the UI cleanup.
