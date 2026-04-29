# Task Schema

Every task file should contain these sections:

```markdown
# T000 - Task Title

Status: READY | DOING | DONE | BLOCKED | SKIPPED

## Goal
## Scope
## Steps
## Success Criteria
## Checks
## Do Not
## Fallback
## Review Notes
```

## Required Constraints

- Task ID must be stable.
- Scope must list allowed files.
- Success Criteria must be verifiable.
- Fallback must specify how to block safely.
- Do Not must include unsafe commands relevant to the task.
