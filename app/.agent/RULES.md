# Agent Runtime Rules

## Purpose

This file defines the runtime restrictions for AI-assisted work in this repository.

The agent is useful but not trusted. All outputs must remain auditable.

## Core Rule

The agent must only work on the active batch listed in `.agent/STATE.md`.

## Default Behavior

When uncertain:

1. Prefer the smallest safe change.
2. Check `.agent/STOP_CONDITIONS.md`.
3. If safe completion is impossible, write a blocker to `.agent/BLOCKERS.md`.
4. Mark or move the task as blocked.
5. Continue to the next task if safe.
6. Do not ask the user unless all remaining active-batch tasks are blocked.

## Allowed Actions

The agent may:

- read files inside the repository
- modify files listed in task `Scope`
- create files explicitly required by a task
- update `.agent/RUNLOG.md`
- update `.agent/BLOCKERS.md`
- update `.agent/STATE.md` with factual progress
- move task files between `.agent/tasks/ready/`, `.agent/tasks/doing/`, `.agent/tasks/done/`, and `.agent/tasks/blocked/` when the active batch permits it
- create local checkpoint commits when `.agent/GIT_POLICY.md` conditions are met
- create proposed project skills under `.agent/skills/proposed/` when the active task permits it
- create AI review reports under `.agent/reports/` at batch/checkpoint gates

## Forbidden Actions

The agent must not:

- run `git push`
- run `git add .`
- run destructive git commands
- stage or commit files unless `.agent/GIT_POLICY.md` conditions are met
- install dependencies
- run package managers unless explicitly allowed
- access files outside the repository
- delete files unless explicitly allowed by a task
- modify secrets or environment files
- modify generated lockfiles unless explicitly allowed
- rewrite entire documents unless explicitly allowed
- perform broad refactors without a scoped task
- activate proposed skills without AI review and human acceptance
- treat AI review as final acceptance
- continue beyond the active batch

## Safe Read-Only Commands

Allowed by default:

```bash
git status
git diff --stat
git diff -- <path>
ls
find
rg
```

Any command that writes files, changes system state, installs dependencies, or accesses the network requires explicit task permission, except policy-governed local checkpoint commits.

## Conditional Control Files

Additional control files may define review, stop, handoff, unattended-run, check, decision, or git checkpoint policies. They do not override active task scope.

The active batch and active task remain the authority for write scope and executable commands.

## Skill Rules

Project-local skills live under `.agent/skills/`.

- `active/` skills may be used by default when their trigger matches.
- `proposed/` skills require explicit task permission.
- `archive/` skills are historical reference only.
- AI may propose skills but must not activate them.
- Skills do not grant permissions beyond the active task and repository rules.
