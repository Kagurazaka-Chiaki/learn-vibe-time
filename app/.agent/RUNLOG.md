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

### 2026-05-01 - T029/T031 sync reliability and milliseconds

Status: DONE

Modified files:
- `src/hooks/useClock.ts`
- `src/hooks/useClock.test.ts`
- `src/hooks/useClockPreferences.ts`
- `src/hooks/useClockPreferences.test.ts`
- `src/domain/timeFormat.ts`
- `src/domain/timeFormat.test.ts`
- `src/components/ClockPage.tsx`
- `src/components/SettingsPanel.tsx`
- `src-tauri/src/time_sync.rs`
- `src-tauri/src/time_sync/sntp.rs`
- `.agent/STATE.md`
- `.agent/RUNLOG.md`
- `.agent/tasks/ready/T029-prevent-stale-sync-overwrite.md`
- `.agent/tasks/ready/T030-validate-and-split-sntp.md`
- `.agent/tasks/ready/T031-optional-main-clock-milliseconds.md`
- `.agent/batches/ready/batch-011-sync-reliability-and-milliseconds.md`
- `.agent/reports/ai-review-20260501-batch-011-sync-reliability.md`

Checks run:
- `bun run typecheck`
- `bun run test`
- `bun run build`
- `cargo fmt --check`
- `cargo test`
- `bun run tauri build --debug`
- `git diff --check`

Result:
- Added latest-request guarding so stale sync success or failure cannot overwrite newer sync state.
- Split SNTP query, timestamp conversion, formula, response validation, and tests into `src-tauri/src/time_sync/sntp.rs`.
- Added SNTP response validation for mode, leap indicator, stratum, originate timestamp, receive timestamp, and transmit timestamp.
- Added a default-off `showMilliseconds` preference and settings checkbox.
- Main clock can render `HH:mm:ss.SSS`; city rail remains minute-only.
- All listed checks passed after rerunning Rust/Tauri checks outside the sandbox due to Windows target cache access errors.

Notes:
- No dependency install, push, signing, release publishing, or artifact cleanup was performed.
- AI review report: `.agent/reports/ai-review-20260501-batch-011-sync-reliability.md`.

### 2026-05-01 - T022/T028 continuous release and sync hardening

Status: DONE

Modified files:
- `src/components/ClockPage.tsx`
- `src/components/InteractionProbe.tsx`
- `src/components/SettingsPanel.tsx`
- `src/components/SyncStatus.tsx`
- `src/domain/sync.ts`
- `src/domain/sync.test.ts`
- `src/hooks/useClock.ts`
- `src/styles/clock.css`
- `src-tauri/tauri.conf.json`
- `src-tauri/Cargo.toml`
- `src-tauri/Cargo.lock`
- `src-tauri/src/time_sync.rs`
- `README.md`
- `README.en.md`
- `app/README.md`
- `../REPORT.md`
- `.agent/STATE.md`
- `.agent/RUNLOG.md`
- `.agent/REVIEW.md`
- `.agent/AI_REVIEW.md`
- `.agent/CHECKS.md`
- `.agent/tasks/ready/T022-stabilize-current-ui-diagnostics.md`
- `.agent/tasks/ready/T023-release-security-identity.md`
- `.agent/tasks/ready/T024-sync-copy-no-overpromise.md`
- `.agent/tasks/ready/T025-sync-failure-details-ui.md`
- `.agent/tasks/ready/T026-sntp-four-timestamps.md`
- `.agent/tasks/ready/T027-display-offset-delay-source.md`
- `.agent/tasks/ready/T028-agent-review-docs.md`
- `.agent/batches/ready/batch-007-release-stabilization.md`
- `.agent/batches/ready/batch-008-sync-copy-failure-ui.md`
- `.agent/batches/ready/batch-009-sntp-four-timestamps.md`
- `.agent/batches/ready/batch-010-agent-review-docs.md`
- `.agent/reports/ai-review-20260501-continuous-release-sync-hardening.md`

Checks run:
- `bun run typecheck`
- `bun run test`
- `bun run build`
- `cargo test`
- `bun run tauri build --debug`
- `rg "精确度|精度" app/src README.md README.en.md app/README.md REPORT.md -n`
- `git diff --stat`

Result:
- Added environment-gated interaction diagnostics and kept normal builds from rendering the probe.
- Updated release identity to `com.cmy20.vibetime` and changed debug artifacts to `vibe-time` naming.
- Replaced disabled CSP with an explicit Tauri-compatible CSP and dev CSP.
- Replaced sync precision copy with estimated-error and network-delay wording.
- Added sync failure details and separated latest successful sync from latest failure.
- Implemented SNTP four-timestamp offset and delay calculation in Rust.
- Updated review docs to check release security and sync-trust claims.
- All listed build and test checks passed after rerunning Rust checks outside the sandbox due to Windows target cache access errors.

Notes:
- No dependency install, push, signing, or checkpoint commit was performed.
- Old debug artifacts named `vibe_time_*` may still exist in `target/` from previous builds; new artifacts are named `vibe-time_*`.
- AI review report: `.agent/reports/ai-review-20260501-continuous-release-sync-hardening.md`.

### 2026-04-30 - T019/T021 preferences and offline states

Status: DONE

Modified files:
- `src/domain/timeFormat.ts`
- `src/hooks/useSelectedCity.ts`
- `src/hooks/useClockPreferences.ts`
- `src/components/SettingsPanel.tsx`
- `src/components/CityRail.tsx`
- `src/components/SyncStatus.tsx`
- `src/components/ClockPage.tsx`
- `src/styles/clock.css`
- `.agent/STATE.md`
- `.agent/RUNLOG.md`
- `.agent/tasks/ready/T019-persist-default-city.md`
- `.agent/tasks/ready/T020-add-settings-panel.md`
- `.agent/tasks/ready/T021-error-and-offline-states.md`
- `.agent/batches/ready/batch-006-preferences.md`

Checks run:
- `bun run test`
- `bun run build`
- `git status --short`

Result:
- Persisted selected city in `localStorage` with invalid-key fallback to Sydney.
- Added compact settings for city, seconds visibility, and 12/24-hour mode.
- Added last-sync display and manual resync action.
- Kept network failure as a local-system-time fallback instead of blocking the clock.
- `bun run test` and `bun run build` passed.

Notes:
- No cloud sync, accounts, or additional dependencies were added.
- Checkpoint commit planned: `feat(app): add basic clock preferences`.

### 2026-04-29 - T016/T018 desktop polish

Status: DONE

Modified files:
- `src-tauri/tauri.conf.json`
- `src-tauri/Cargo.toml`
- `src/components/ClockDisplay.tsx`
- `src/components/SyncStatus.tsx`
- `src/styles/clock.css`
- `.agent/STATE.md`
- `.agent/RUNLOG.md`
- `.agent/tasks/ready/T016-rename-tauri-app.md`
- `.agent/tasks/ready/T017-responsive-polish.md`
- `.agent/tasks/ready/T018-accessibility-pass.md`
- `.agent/batches/ready/batch-005-desktop-polish.md`

Checks run:
- `bun run build`
- `cargo check`
- `git status --short`

Result:
- Renamed the desktop app metadata to `Vibe Time`.
- Set a more suitable default and minimum Tauri window size.
- Improved responsive clock and city rail sizing.
- Added semantic clock/status markup and focus-visible city button behavior.
- `bun run build` and `cargo check` passed.

Notes:
- No icon regeneration was performed.
- `cargo check` needed escalated filesystem permission to write under `src-tauri/target`.
- Checkpoint commit planned: `feat(app): polish desktop clock shell`.

### 2026-04-29 - T012/T015 domain tests

Status: DONE

Modified files:
- `package.json`
- `bun.lock`
- `src/domain/timeFormat.test.ts`
- `src/domain/solar.test.ts`
- `src/domain/sync.test.ts`
- `.agent/STATE.md`
- `.agent/RUNLOG.md`
- `.agent/tasks/ready/T012-add-vitest.md`
- `.agent/tasks/ready/T013-test-time-format.md`
- `.agent/tasks/ready/T014-test-solar-domain.md`
- `.agent/tasks/ready/T015-test-sync-state.md`
- `.agent/batches/ready/batch-004-tests.md`

Checks run:
- `bun install`
- `bun run typecheck`
- `bun run test`
- `bun run build`
- `git status --short`

Result:
- Added Vitest 3.2.4 and package scripts for typecheck and tests.
- Added 10 passing tests across time formatting, solar calculations, and sync state helpers.
- Updated `bun.lock`.
- `bun run typecheck`, `bun run test`, and `bun run build` passed.

Notes:
- No React component test dependency was added.
- Checkpoint commit planned: `test(app): cover clock domain logic`.

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
