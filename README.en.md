# Vibe Time

[中文](README.md) | [English](README.en.md)

`Vibe Time` is a desktop clock fully driven by `iota-agnt001`, with no human-written application code.

It is built with Tauri + React and takes design cues from the clear large-time experience of Time.is, while aiming to provide a clean, lightweight, long-running desktop clock. It keeps current time, city time, date, sunrise/sunset information, sync status, and local fallback, without requiring another Chrome tab.

This repository is also an experiment in agent-driven development. `iota-agnt01/` is the referenced agent harness submodule, and `app/.agent/` is the application-specific local control plane.

Based on the current conversation history, the longest single agent run for this project was 30 minutes and 18 seconds, completing the main delivery from starter scaffold to usable MVP. This indicates that the `iota-agnt001` task/batch/checkpoint workflow is effective and reasonable for a small Tauri + React project: the run stops when the task scope is complete instead of expanding scope to consume the unattended runtime cap.

## Current Capabilities

- The app opens directly into the clock experience, with starter Vite/Tauri/React UI removed.
- The frontend is split into `components/`, `domain/`, `hooks/`, `data/`, and `styles/`.
- `TimeIsWidget.tsx` is only a compatibility export.
- Rust/Tauri provides the `sync_utc_time` command.
- The first time source is China National Time Service Center NTP: `ntp.ntsc.ac.cn:123`.
- The app supports local-time fallback, last successful sync time, sync failure details, and manual resync.
- City selection, seconds display, and 12/24-hour mode are persisted with `localStorage`.
- In 12-hour mode, the day period label is rendered separately from the large numeric time.
- A Tauri dev resource measurement script is included.

## Repository Layout

```text
.
  app/                 # Vibe Time application
  app/.agent/          # Application-local agent control plane
  app/scripts/         # Local development and measurement scripts
  iota-agnt01/         # Agent harness reference submodule
  REPORT.md            # Chinese project report
  README.md            # Chinese entry
  README.en.md         # English entry
```

## Tech Stack

- React 19
- TypeScript
- Vite
- Tauri 2
- Rust
- Bun
- Vitest

## Development

From `app/`:

```bash
cd app
bun install
```

Common commands:

```bash
bun run dev
bun run tauri dev
bun run typecheck
bun run test
bun run build
```

## Resource Measurement

Start Tauri dev first:

```bash
cd app
bun run tauri dev
```

Then sample from another terminal:

```bash
cd app
bun run measure:dev -- -Seconds 60 -IntervalSeconds 1
```

Reports are written to:

```text
app/perf-reports/
```

By default the script measures the `Vibe Time` / `vibe-time` / `app` root process and its process tree. If WebView2 is not attached to that tree, use:

```bash
bun run measure:dev -- -Seconds 60 -IntervalSeconds 1 -IncludeAllWebView2
```

## Agent Workflow

Before asking an agent to modify this project, read:

1. `app/AGENTS.md`
2. `app/.agent/STATE.md`
3. the active batch file, if one is configured

New work should be split into small task files under `app/.agent/tasks/ready/`, then grouped and executed through batches. Business code changes must stay within the active task scope.

## Unattended Runs

The recommended mode is a short batch run: 45-90 minutes, then stop at a verified checkpoint, review, and commit. The maximum unattended runtime is 8 hours, but only when the full task chain is already split, checks are explicit, checkpoint commits are allowed, and the run does not require push, secrets, dependency installation, or destructive git operations.

Based on the current conversation history, the longest single agent run for this project was 30 minutes and 18 seconds. Not reaching the 8-hour cap is expected: the tasks were small, and the run should stop when the active batch is complete instead of expanding scope to consume the budget.

In practice, most sessions use three prompt types:

1. Split the goal into `.agent/tasks/ready/` and `.agent/batches/ready/`.
2. Run the active batch within scope, with checks and checkpoint commits.
3. Review and hand off the result, including completed work, risks, and the next batch.

Examples:

```text
app/.agent/prompts/unattended-three-prompt-flow.md
```

## License

MIT.
