# Prompt: Three-Step Unattended Flow

Use this when starting a fresh agent conversation for Vibe Time.

## Runtime Budget

- Default unattended budget: 45-90 minutes per batch.
- Maximum unattended runtime: 8 hours.
- Use the 8-hour maximum only when `.agent/UNATTENDED.md` readiness gates pass.
- Stop at the batch boundary, unclear failure, missing scope, or checkpoint problem.
- A simple project may finish much earlier. Based on the current conversation history, the longest single Vibe Time agent run was 30 minutes and 18 seconds, which is normal when the active batch completes.

## Prompt 1 - Split Goal Into Tasks

```text
Read `app/AGENTS.md`, `app/.agent/STATE.md`, `app/.agent/RULES.md`,
`app/.agent/STOP_CONDITIONS.md`, `app/.agent/GIT_POLICY.md`, and
`app/.agent/UNATTENDED.md`.

Goal:
<describe the next product or engineering goal>

Create decision-complete tasks under `app/.agent/tasks/ready/` and one runnable
batch under `app/.agent/batches/ready/`.

Each task must include Goal, Scope, Success Criteria, Checks, Do Not, and
Fallback. Update `app/.agent/STATE.md` only if the batch should become active.
Do not modify business code in this prompt.
```

## Prompt 2 - Run Active Batch

```text
Read `app/AGENTS.md`, all required `app/.agent/*` control files, and the active
batch listed in `app/.agent/STATE.md`.

Run only the active batch. Keep changes inside task scope. Update RUNLOG and
BLOCKERS as needed. Run the allowed checks. Create a local checkpoint commit
when the git policy allows it.

Default time budget: 45-90 minutes.
Maximum unattended runtime: 8 hours only if `app/.agent/UNATTENDED.md` readiness
gates pass.

Stop when the batch is done, blocked, outside scope, or a check fails twice for
unclear reasons. Do not push, install dependencies, use secrets, or run
destructive git commands.
```

## Prompt 3 - Review And Handoff

```text
Read `app/.agent/RUNLOG.md`, `app/.agent/BLOCKERS.md`, `app/.agent/REVIEW.md`,
the latest git diff, and the last commit.

Produce a concise handoff:
- what changed
- what checks passed or were skipped
- known risks
- whether the working tree is clean
- what the next batch should be

Update `app/.agent/HANDOFF.md` and create or update the next ready batch only
if the next work is already clear. Do not modify product code in this prompt.
```
