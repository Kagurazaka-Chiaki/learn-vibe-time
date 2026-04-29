# Batch YYYY-MM-DD-001 - Batch Title

Status: READY

## Mode

- no network
- no dependency install
- no git push
- no `git add .`
- checkpoint commits governed by `.agent/GIT_POLICY.md`
- active batch only

## Max Tasks

5

## Tasks

1. `.agent/tasks/ready/T000-task-title.md`

## Allowed Commands

```bash
git status
git diff --stat
git diff -- <path>
git add -A
git diff --cached --stat
git diff --cached
git commit -m "<message>"
git log --oneline -1
ls
find
rg
```

## Forbidden Commands

```bash
git push
git add .
npm install
pip install
uv add
scoop install
winget install
rm -rf
```

## Exit Conditions

Stop when:

- all listed tasks are done or blocked
- max task count is reached
- continuing would require an unsafe action
- every remaining task is blocked
- checkpoint commit conditions cannot be satisfied at a required checkpoint

## Completion Notes

To be filled by the agent after execution.
