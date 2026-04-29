# Project Report

## Initial Repository State

This repository starts as a small Tauri + React application plus an
`iota-agnt01` reference submodule.

- `app/` is the real application project.
- `iota-agnt01/` is the agent harness reference submodule.
- `app/.agent/` is the project-local harness used for future agent work.
- Root `.gitignore` keeps generated files, dependencies, secrets, and build
  outputs out of source control.

## App Direction

The app is intended to become a Time.is-inspired clock experience without ads.
It should work in the browser during development and as a Tauri desktop app for
daily use, avoiding the need to keep a separate Chrome tab open.

Current app state:

- `app/src/TimeIsWidget.tsx` contains the first clock prototype.
- `app/src/App.tsx` still includes starter Tauri/React UI around the widget.
- Tauri metadata still uses starter names such as `app`.
- No production polish or app-specific task batch has been created yet.

## Agent Harness State

The app has a local `.agent/` control plane and `app/AGENTS.md`. Future agent
work should start from explicit task and batch files rather than broad,
unscoped edits.

Recommended first agent tasks:

- Remove starter UI and make `TimeIsWidget` the primary screen.
- Rename product/window metadata for the desktop app.
- Create a focused UI cleanup batch under `app/.agent/batches/ready/`.
- Decide whether time synchronization should stay in frontend fetch code or move
  behind a Tauri command.

## Commit Strategy

The first commit is an initial scaffold checkpoint. It records the current app,
the agent harness setup, root ignore policy, and repository report. It does not
mean the Time.is-inspired app is complete.
