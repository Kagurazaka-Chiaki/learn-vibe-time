# Review Checklist

Use this checklist after each agent run.

## Review Order

1. Read `.agent/RUNLOG.md`.
2. Read `.agent/BLOCKERS.md`.
3. Read the latest `.agent/reports/ai-review-*.md`, if present.
4. Read `.agent/SKILLS.md` if skills were added or changed.
5. Run `git status`.
6. Run `git diff --stat`.
7. Run `git diff`.
8. Check tasks moved to `.agent/tasks/done/`.
9. Check tasks moved to `.agent/tasks/blocked/`.
10. Decide whether to accept, revert, activate skills, or create a follow-up batch.

## Acceptance Criteria

A task can be accepted only if:

- its declared Success Criteria are satisfied
- only files in its Scope were modified
- unsafe commands were not executed
- RUNLOG matches actual diff
- blockers are not silently ignored
- AI review findings are addressed or explicitly accepted as residual risk
- proposed skills are not active unless accepted by a human

## Rejection Criteria

Reject or revert work if:

- task scope was silently expanded
- unrelated files were modified
- a task was marked done without evidence
- the agent modified credentials or environment files
- generated content conflicts with repository goals
- proposed skills contain secrets, overfit one run, or expand agent permissions
