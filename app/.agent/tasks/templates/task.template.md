# T000 - Task Title

Status: READY

## Goal

Describe the smallest useful outcome of this task.

## Scope

Allowed files:
- path/to/file.md

Read-only files:
- path/to/context.md

## Steps

1. Read the relevant files.
2. Make the smallest safe change.
3. Run allowed checks.
4. Update `.agent/RUNLOG.md`.
5. Create a local checkpoint commit if `.agent/GIT_POLICY.md` conditions are met.

## Success Criteria

- The target change exists.
- No unrelated file is modified.
- RUNLOG records the task result.
- Checkpoint commit is created or the reason for skipping it is recorded.

## Checks

Allowed checks:

```bash
git diff --stat
git diff -- path/to/file.md
```

## Do Not

- Do not modify files outside Scope.
- Do not run `git push`.
- Do not stage or commit files unless `.agent/GIT_POLICY.md` conditions are met.
- Do not install dependencies.
- Do not delete files.

## Fallback

If this task cannot be completed safely:

1. Write an entry to `.agent/BLOCKERS.md`.
2. Mark or move this task as blocked.
3. Continue to the next task if safe.

## Review Notes

To be filled during human review.

## Reusable Skill Notes

- Proposed skill candidate: none
- Skill registry update needed: no
- AI review focus: scope, checks, commit gate, and skill risk
