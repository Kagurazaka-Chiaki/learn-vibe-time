# Unattended Runs

This file defines rules for long-running agent sessions.

The maximum unattended runtime is 8 hours for small, well-scoped projects. This is an upper bound, not the default. It is only safe when the task chain is already decision-complete, auditable, recoverable, and backed by local checkpoint commits.

For this project, prefer 45-90 minute batch runs until the task queue, checks, and checkpoint cadence have proven stable.

Observed project note: based on the current conversation history, the longest single Vibe Time agent run was 30 minutes and 18 seconds. That is a valid unattended outcome because the active scope was small and finished early. Do not expand scope just to consume the 8-hour maximum.

## Run Modes

### Conservative

- Default recommendation.
- Use for new projects, broad scaffolds, or unclear risk.
- Stop after each verified checkpoint unless the active batch explicitly allows continuing.
- Create a local checkpoint commit after each coherent verified checkpoint.
- Produce an AI review report at each batch/checkpoint boundary.
- Stop when a retry threshold or stop condition is reached.

### Time-First

- Use only when tasks are decision-complete and low risk.
- Continue across checkpoints only when the next task is inside the active batch and has clear scope.
- Create local checkpoint commits often enough that recovery remains easy.
- Run AI review often enough that risky drift is caught before it compounds.
- Stop at the time budget, retry threshold, plan boundary, or any stop condition.

## Scheduler Modes

### Batch-Driven

- Execute only tasks listed in the active batch.
- Stop when listed tasks are done or blocked.
- This is the default mode.

### Ready-Queue-Driven

- Pull tasks from `.agent/tasks/ready/` only when a batch explicitly permits it.
- Requires stronger task quality, clearer stop rules, and clean checkpoint commits.

## 8-Hour Readiness Gate

Do not attempt a sleep-length unattended run unless:

- At least one full task chain is decision-complete.
- Each task has `Scope`, `Success Criteria`, `Checks`, `Do Not`, and `Fallback`.
- Allowed checks are clear and can run without secrets or paid services.
- Commit cadence is clear and `.agent/GIT_POLICY.md` can be followed.
- AI review cadence is clear and `.agent/AI_REVIEW.md` can be followed.
- Failure retry threshold is explicit.
- `.agent/RUNLOG.md` and archive files can stay readable under the 800-1000 line soft limit.
- The working tree has no unrelated changes that would pollute checkpoint commits.
- No task requires push, deploy, destructive git, credentials, or broad deletion.

If any gate fails, do a planning-only or bootstrap batch first.

## Required Metadata

An unattended run must record:

- run mode
- scheduler mode
- active batch
- intended time budget
- retry threshold
- checkpoint target
- allowed checks
- commit cadence
- AI review cadence
- final reporting obligations

Record this in `.agent/STATE.md` and `.agent/RUNLOG.md`, with detailed long-form notes in `.agent/logs/` when needed.

## Stop Rules

Stop or block when:

- `.agent/STOP_CONDITIONS.md` applies.
- The next task is outside the active batch.
- The next task is not decision-complete.
- The same check fails twice for unclear reasons.
- Checkpoint commit conditions cannot be satisfied.
- AI review gate cannot be completed or explicitly deferred.
- The time budget is exhausted.

## Default Recommendation

For early use, choose:

- `conservative`
- `batch-driven`
- 45-90 minute time budget per normal batch
- 8 hours maximum only when the readiness gate passes
- checkpoint commit after each verified batch or milestone
- AI review after each verified batch or milestone
- detailed run shards in `.agent/logs/` for long sessions
