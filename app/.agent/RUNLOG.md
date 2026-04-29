# Run Log

This file records factual execution history for the `app/` agent harness.

## Entry Template

```markdown
### YYYY-MM-DD HH:MM - T000 task-title

Status: DONE | BLOCKED | SKIPPED

Modified files:
- path/to/file

Checks run:
- command or manual check

Result:
- concise factual result

Notes:
- risks, limitations, or follow-up items
```

## Entries

### 2026-04-29 - T008/T011 Rust time sync

Status: DONE

Modified files:
- `src-tauri/Cargo.toml`
- `src-tauri/Cargo.lock`
- `src-tauri/src/lib.rs`
- `src-tauri/src/time_sync.rs`
- `src/domain/sync.ts`
- `src/hooks/useClock.ts`
- `src/components/SyncStatus.tsx`
- `src/components/ClockPage.tsx`
- `src/styles/clock.css`
- `.agent/STATE.md`
- `.agent/RUNLOG.md`
- `.agent/tasks/ready/T008-add-rust-time-sync-command.md`
- `.agent/tasks/ready/T009-wire-tauri-command.md`
- `.agent/tasks/ready/T010-replace-frontend-sync.md`
- `.agent/tasks/ready/T011-sync-status-copy.md`
- `.agent/batches/ready/batch-003-rust-time-sync.md`

Checks run:
- `bun run build`
- `cargo check`
- `git status --short`

Result:
- Added `sync_utc_time` Tauri command using `reqwest` with Rustls.
- Added UTC timestamp extraction from numeric and date/time JSON fields.
- Registered the command and removed the unused starter `greet` command.
- Replaced frontend network fetch synchronization with Tauri invoke and local fallback.
- Added Chinese sync copy for synced, fallback, and near-zero drift states.
- `bun run build` and `cargo check` passed.

Notes:
- `cargo check` required dependency download and updated `Cargo.lock`.
- Browser-only dev fallback catches failed `invoke` and uses local system time.
- Checkpoint commit planned: `feat(time): sync clock through Tauri command`.

### 2026-04-29 - T003/T007 frontend refactor

Status: DONE

Modified files:
- `src/App.tsx`
- `src/App.css`
- `src/TimeIsWidget.tsx`
- `src/data/cities.ts`
- `src/domain/timeFormat.ts`
- `src/domain/solar.ts`
- `src/hooks/useClock.ts`
- `src/hooks/useSelectedCity.ts`
- `src/components/ClockPage.tsx`
- `src/components/ClockDisplay.tsx`
- `src/components/DatePanel.tsx`
- `src/components/SyncStatus.tsx`
- `src/components/CityRail.tsx`
- `src/styles/clock.css`
- `.agent/STATE.md`
- `.agent/RUNLOG.md`
- `.agent/tasks/ready/T003-extract-city-data.md`
- `.agent/tasks/ready/T004-extract-time-format-domain.md`
- `.agent/tasks/ready/T005-extract-solar-domain.md`
- `.agent/tasks/ready/T006-extract-ui-components.md`
- `.agent/tasks/ready/T007-clean-app-entry.md`
- `.agent/batches/ready/batch-002-frontend-refactor.md`

Checks run:
- `bun run build`
- line count check for `TimeIsWidget.tsx`, `ClockPage.tsx`, and `useClock.ts`
- `git status --short`
- `git diff --stat`

Result:
- Split the 684-line `TimeIsWidget.tsx` into focused data, domain, hook, component, and style modules.
- Reduced `TimeIsWidget.tsx` to a 3-line compatibility export.
- Removed starter Vite/Tauri/React greet UI from `App.tsx`.
- Fixed time formatting helper to use `hourCycle: "h23"` and normalize `24` to `00`.
- Added safe solar fallback text when sun-time data is unavailable.
- `bun run build` passed.

Notes:
- `useClock.ts` still contains the old frontend network sync path. Batch 003 will replace it with the Rust/Tauri command.
- `bun run typecheck` was not run because `package.json` does not define a `typecheck` script yet; `bun run build` runs `tsc && vite build`.
- Checkpoint commit planned: `refactor(app): split clock UI and remove starter screen`.

### 2026-04-29 - T001/T002 MVP roadmap and task queue

Status: DONE

Modified files:
- `../REPORT.md`
- `.agent/STATE.md`
- `.agent/RUNLOG.md`
- `.agent/tasks/ready/T003-extract-city-data.md`
- `.agent/tasks/ready/T004-extract-time-format-domain.md`
- `.agent/tasks/ready/T005-extract-solar-domain.md`
- `.agent/tasks/ready/T006-extract-ui-components.md`
- `.agent/tasks/ready/T007-clean-app-entry.md`
- `.agent/tasks/ready/T008-add-rust-time-sync-command.md`
- `.agent/tasks/ready/T009-wire-tauri-command.md`
- `.agent/tasks/ready/T010-replace-frontend-sync.md`
- `.agent/tasks/ready/T011-sync-status-copy.md`
- `.agent/tasks/ready/T012-add-vitest.md`
- `.agent/tasks/ready/T013-test-time-format.md`
- `.agent/tasks/ready/T014-test-solar-domain.md`
- `.agent/tasks/ready/T015-test-sync-state.md`
- `.agent/tasks/ready/T016-rename-tauri-app.md`
- `.agent/tasks/ready/T017-responsive-polish.md`
- `.agent/tasks/ready/T018-accessibility-pass.md`
- `.agent/tasks/ready/T019-persist-default-city.md`
- `.agent/tasks/ready/T020-add-settings-panel.md`
- `.agent/tasks/ready/T021-error-and-offline-states.md`
- `.agent/batches/ready/batch-002-frontend-refactor.md`
- `.agent/batches/ready/batch-003-rust-time-sync.md`
- `.agent/batches/ready/batch-004-tests.md`
- `.agent/batches/ready/batch-005-desktop-polish.md`
- `.agent/batches/ready/batch-006-preferences.md`

Checks run:
- `Get-Content REPORT.md`
- task and batch file structure inspection
- `git status --short`

Result:
- Converted the project report to Chinese.
- Added MVP 0-N roadmap, target architecture, technical debt, and execution queue.
- Created decision-complete task files for frontend refactor, Rust time sync, tests, desktop polish, and preferences.
- Set the next active batch to Batch 002.

Notes:
- No app source code was changed in this documentation/control-plane step.
- Checkpoint commit planned: `docs(agent): add Chinese MVP roadmap`.

### 2026-04-29 - document-project-bootstrap

Status: DONE

Modified files:
- `README.md`
- `AGENTS.md`
- `../REPORT.md`
- `../.gitignore`

Checks run:
- `Get-Content app/README.md`
- `Get-Content app/AGENTS.md`
- `Get-Content REPORT.md`
- `git status --ignored --short`
- `git diff --cached --stat`

Result:
- Replaced the starter README with a Time.is-inspired Tauri clock app project description.
- Added a root project report and root ignore policy.
- Updated agent instructions with the app identity and business-code scope guard.
- Prepared the repository for the initial local scaffold commit.

Notes:
- No app source code, Tauri/Rust source, dependency manifest, or lockfile was modified for this documentation step.
- Commit message planned for the root initial commit: `chore(repo): initial project scaffold`.

### 2026-04-29 - bootstrap-app-agent-harness

Status: DONE

Modified files:
- `AGENTS.md`
- `.agent/`
- `.gitignore`

Checks run:
- structure checks for expected `.agent/` files and directories
- content scan for stale `iota-agnt01` active batch references
- `git status --short`
- `git diff --stat`
- `git diff -- app/AGENTS.md app/.agent app/.gitignore`

Result:
- Initialized a project-local agent harness under `app/.agent/`.
- Added `app/AGENTS.md` with `app/` as the project root.
- Preserved `../iota-agnt01/` as a reference submodule and did not copy its historical tasks, ready batches, or reports.
- Updated `.gitignore` so `.agent/`, `.agent/logs/`, and `.agent/reports/` remain auditable.

Notes:
- No business code, Tauri/Rust source, dependency manifest, or lockfile was modified.
- No checkpoint commit was created because the root repository currently shows `app/` as an untracked directory; committing now would mix the harness bootstrap with the existing app scaffold.
