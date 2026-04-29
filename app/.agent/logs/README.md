# Logs

This folder stores detailed run logs, long-form notes, and structured records that would make `.agent/RUNLOG.md` too large.

Use `.agent/RUNLOG.md` as the index and recent-summary file. When a run needs more detail, create a shard here.

Suggested names:

```text
YYYY-MM-DD-batch-001.md
YYYYMMDD-HHMM-<run-slug>.md
```

Each shard should include:

- goal
- active batch and tasks
- files changed
- checks run
- checkpoint commits
- blockers
- stop reason
- next recovery point

Keep long-running files under an 800-1000 line soft limit. If a log grows beyond that, split it by date, batch, or run id and leave an index entry in `.agent/RUNLOG.md`.
