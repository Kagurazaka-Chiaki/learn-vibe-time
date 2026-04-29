# Prompt: Bootstrap Agent Workspace

Use this prompt when installing this harness into a new project.

```text
Create or update the `.agent/` workspace for this project.

Do not modify business code.
Do not install dependencies.
Do not push.
Create a local checkpoint commit only if `.agent/GIT_POLICY.md` conditions are met.

Create the following if missing:
- `.agent/RULES.md`
- `.agent/STOP_CONDITIONS.md`
- `.agent/GIT_POLICY.md`
- `.agent/SKILLS.md`
- `.agent/AI_REVIEW.md`
- `.agent/CHECKS.md`
- `.agent/METAPLAN.md`
- `.agent/INDEX.md`
- `.agent/STATE.md`
- `.agent/RUNLOG.md`
- `.agent/BLOCKERS.md`
- `.agent/REVIEW.md`
- `.agent/UNATTENDED.md`
- `.agent/HANDOFF.md`
- `.agent/DECISIONS.md`
- `.agent/tasks/ready/`
- `.agent/tasks/doing/`
- `.agent/tasks/done/`
- `.agent/tasks/blocked/`
- `.agent/tasks/archive/`
- `.agent/tasks/templates/`
- `.agent/skills/active/`
- `.agent/skills/proposed/`
- `.agent/skills/archive/`
- `.agent/skills/templates/`
- `.agent/batches/ready/`
- `.agent/batches/done/`
- `.agent/batches/archive/`
- `.agent/batches/templates/`
- `.agent/logs/`
- `.agent/reports/`
- `.agent/reports/templates/`
- `.agent/prompts/`
- `.agent/schemas/`

After creating files, write a short bootstrap summary to `.agent/RUNLOG.md`.
```
