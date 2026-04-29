# Prompt: Run Active Batch

```text
Read `AGENTS.md`, `.agent/RULES.md`, `.agent/STOP_CONDITIONS.md`, `.agent/GIT_POLICY.md`, `.agent/SKILLS.md`, `.agent/AI_REVIEW.md`, `.agent/METAPLAN.md`, `.agent/INDEX.md`, `.agent/STATE.md`, and the active batch listed in `.agent/STATE.md`.

Execute only the tasks listed in the active batch.

For each task:
- Respect Scope.
- Apply the smallest safe change.
- Update `.agent/RUNLOG.md`.
- If blocked, update `.agent/BLOCKERS.md` and continue.
- If reusable knowledge emerges and task scope permits it, create a proposed skill and update `.agent/SKILLS.md`.
- At batch/checkpoint boundaries, create an AI review report.
- If `.agent/GIT_POLICY.md` conditions are met, create a local checkpoint commit.

Do not ask the user unless all remaining active-batch tasks are blocked.
Do not push.
Do not run destructive git commands.
Do not install dependencies.
```
