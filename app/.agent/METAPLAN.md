# METAPLAN

## Purpose

This file defines how planning artifacts are created, updated, executed, reviewed, and archived.

It does not define project goals directly. It defines the rules for managing goals, plans, tasks, batches, blockers, logs, and reports.

## Planning Layers

1. `README.md`
   - Human-facing project entry.
   - Explains what this repository is.

2. `AGENTS.md`
   - Repository-level agent behavior rules.
   - Defines global boundaries and review expectations.

3. `.agent/RULES.md`
   - Runtime restrictions for agent execution.
   - Defines allowed and forbidden actions.

4. `.agent/STOP_CONDITIONS.md`
   - Generic conditions that require blocking or stopping.
   - Defines risks that must not be silently absorbed.

5. `.agent/CHECKS.md`
   - Generic check principles and failure-record format.
   - Active tasks and batches still decide which commands are allowed.

6. `.agent/SKILLS.md`
   - Registry for project-local active, proposed, and archived skills.
   - Does not install global Codex skills.

7. `.agent/AI_REVIEW.md`
   - Rules for batch/checkpoint AI review reports.
   - Does not replace human acceptance.

8. `.agent/DECISIONS.md`
   - Durable decision records for control-plane policy.
   - Not for run logs or roadmaps.

9. `.agent/HANDOFF.md`
   - Recovery snapshot for interrupted work.
   - Does not replace `STATE`, `RUNLOG`, or `BLOCKERS`.

10. `.agent/UNATTENDED.md`
   - Optional protocol for long-running sessions.
   - Disabled unless an active batch explicitly enables it.

11. `.agent/GIT_POLICY.md`
   - Local checkpoint commit policy.
   - Allows audited local commits and forbids push.

12. `.agent/STATE.md`
   - Current execution state.
   - Records active batch, mode, and last progress.

13. `.agent/batches/`
   - Bounded execution windows.
   - Each batch lists specific tasks for one run.

14. `.agent/tasks/`
   - Atomic task files.
   - Each task should be small, scoped, reviewable, and recoverable.

15. `.agent/skills/`
   - Project-local reusable workflows and knowledge.
   - Proposed skills require review before activation.

16. `.agent/RUNLOG.md`
   - Factual index and recent-summary record of executed work.

17. `.agent/BLOCKERS.md`
   - Factual record of skipped or unsafe work.

18. `.agent/logs/`
   - Detailed run shards when `RUNLOG.md` would become too long.

## Task Granularity Rules

A task should be completable in 3–8 minutes.

Each task must include:

- Goal
- Scope
- Steps
- Success Criteria
- Checks
- Do Not
- Fallback
- Review Notes

Avoid vague tasks such as:

- Improve documentation
- Clean the project
- Refactor everything
- Make it better

Prefer bounded tasks such as:

- Add a `Quick Start` section to `README.md`.
- Create `.agent/BLOCKERS.md` with a blocker template.
- Check whether every ready task contains `Success Criteria`.

## File Size and Archive Rules

Long-running text files should stay easy to review.

- Treat 800-1000 lines as a soft limit for primary control files.
- Keep `.agent/RUNLOG.md`, planning files, history files, and TODO-style files as indexes plus recent summaries.
- Move detailed run records into `.agent/logs/`, review outputs into `.agent/reports/`, and historical task or batch artifacts into their archive folders.
- When sharding, leave a clear index entry pointing to the detailed file.

## Batch Rules

Each batch must specify:

- mode
- task list
- max tasks
- allowed commands
- forbidden commands
- exit conditions

The agent must not execute tasks outside the active batch.

## Update Rules

The agent may update:

- `.agent/STATE.md`
- `.agent/RUNLOG.md`
- `.agent/BLOCKERS.md`
- `.agent/HANDOFF.md`
- `.agent/SKILLS.md`
- task status fields
- batch completion notes

The agent must not rewrite:

- `AGENTS.md`
- `.agent/RULES.md`
- `.agent/METAPLAN.md`
- `README.md`

unless the active task explicitly permits it.

## Blocker Rules

If a task cannot be completed safely:

1. Record the blocker in `.agent/BLOCKERS.md`.
2. Mark or move the task to `.agent/tasks/blocked/`.
3. Record the decision in `.agent/RUNLOG.md`.
4. Continue with the next task if safe.

## Review Rules

After a run, review in this order:

1. `.agent/RUNLOG.md`
2. `.agent/BLOCKERS.md`
3. `git diff --stat`
4. `git diff`
5. local checkpoint commits, when present
6. AI review reports
7. completed task files
8. blocked task files
9. `.agent/reports/`

A task is accepted only if:

- its Success Criteria are met
- its Scope was respected
- its changes are visible in the diff
- its RUNLOG entry is accurate
