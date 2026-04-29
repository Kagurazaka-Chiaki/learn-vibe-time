# Batch Schema

Every batch file should contain these sections:

```markdown
# Batch YYYY-MM-DD-001 - Batch Title

Status: READY | DONE | BLOCKED

## Mode
## Max Tasks
## Tasks
## Allowed Commands
## Forbidden Commands
## Exit Conditions
## Completion Notes
```

## Required Constraints

- A batch must list explicit task paths.
- The agent must not execute unlisted tasks.
- A batch must define exit conditions.
- A batch must forbid commit, push, install, and broad deletion unless explicitly intended.
