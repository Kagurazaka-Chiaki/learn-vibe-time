# Handoff

This file is a recovery snapshot for interrupted or long-running work.

It should summarize the current state without replacing `.agent/STATE.md`,
`.agent/RUNLOG.md`, or `.agent/BLOCKERS.md`.

## Current Snapshot

Active batch:
- none

Current task:
- none

Last successful task:
- bootstrap app harness

Known blockers:
- none recorded

## Recovery Order

1. `AGENTS.md`
2. `.agent/RULES.md`
3. `.agent/STOP_CONDITIONS.md`
4. `.agent/GIT_POLICY.md`
5. `.agent/SKILLS.md`
6. `.agent/AI_REVIEW.md`
7. `.agent/METAPLAN.md`
8. `.agent/INDEX.md`
9. `.agent/STATE.md`
10. active batch from `.agent/STATE.md`, if any
11. active task files listed by that batch

## Resume Notes

- Treat `app/` as the project root.
- `../iota-agnt01/` is a reference submodule, not the active control plane.
- No active batch exists yet.
- Default to conservative, batch-driven execution.
- Do not infer permission from this handoff file.
- Use active task `Scope` as the write boundary.
- No initial checkpoint commit was created because `app/` is currently untracked in the root repository.
