# Batch 2026-05-01-008 - Sync Copy Failure UI

Status: DONE

## Mode

- no network
- no dependency install
- no git push
- no `git add .`
- checkpoint commits governed by `.agent/GIT_POLICY.md`
- active batch only

## Max Tasks

2

## Tasks

1. `.agent/tasks/ready/T024-sync-copy-no-overpromise.md`
2. `.agent/tasks/ready/T025-sync-failure-details-ui.md`

## Allowed Commands

```bash
git status
git diff --stat
git diff -- <path>
rg
bun run typecheck
bun run test
bun run build
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

- both listed tasks are done or blocked
- sync failure details cannot be represented without losing local fallback behavior
- a check fails and cannot be fixed within listed task scope

## Completion Notes

Completed. Sync copy now uses estimated-error wording, and failed sync details are preserved and displayed while the clock falls back to local system time.
