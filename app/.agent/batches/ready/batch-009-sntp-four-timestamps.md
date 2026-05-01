# Batch 2026-05-01-009 - SNTP Four Timestamps

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

1. `.agent/tasks/ready/T026-sntp-four-timestamps.md`
2. `.agent/tasks/ready/T027-display-offset-delay-source.md`

## Allowed Commands

```bash
git status
git diff --stat
git diff -- <path>
cargo test
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
- SNTP four-timestamp math cannot be verified with tests
- a check fails and cannot be fixed within listed task scope

## Completion Notes

Completed. Rust SNTP now calculates offset and delay from T1/T2/T3/T4, and the frontend displays source, offset, delay, estimated error, and last successful sync.
