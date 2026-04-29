# Git Policy

This repository allows policy-governed local checkpoint commits by default.

A checkpoint commit is a recovery and review point. It is not acceptance, approval, or proof of correctness.

## Always Forbidden

The agent must not run:

```bash
git push
git pull
git fetch
git reset --hard
git clean
git rebase
git checkout -- .
git restore .
git rm
git mv
```

unless a human explicitly authorizes that operation in a task with clear scope.

## Checkpoint Commit Gate

Before staging or committing, all of these must be true:

- The active task is complete or at a coherent checkpoint.
- Modified files are inside the active task `Scope`.
- `.agent/RUNLOG.md` records the actual work.
- `.agent/BLOCKERS.md` records any unresolved blocker.
- `.agent/STATE.md` records factual progress.
- Allowed checks were run, or the runlog explains why a check could not run.
- The latest checkpoint or batch has an AI review report, or the runlog records why review was skipped.
- `git status --short` and `git diff --stat` were inspected.
- No secrets, credentials, tokens, private keys, or `.env` files are staged.
- No deletion is staged unless the active task explicitly allowed deletion.
- The commit message is specific and reviewable.

## Allowed Checkpoint Commands

When the gate is satisfied, the agent may run:

```bash
git status --short
git diff --stat
git diff
git add -A
git diff --cached --stat
git diff --cached
git commit -m "<message>"
git log --oneline -1
```

Do not use `git add .`; use `git add -A` only after reviewing the diff and deletion scope.

## Commit Cadence

Create a local checkpoint commit after:

- a completed batch
- a completed milestone
- a verified scaffold or feature
- a planning-only refinement that changes control files
- a safe stop point before a long unattended run ends

AI review should happen before the checkpoint commit when feasible. If the review happens after commit, record that ordering and the reason in `.agent/RUNLOG.md`.

Avoid commits for half-written changes unless stopping without a checkpoint would make recovery harder. If a partial checkpoint is necessary, state the residual risk in the commit message and runlog.

## Commit Message Format

Use:

```text
<type>(<scope>): <summary>
```

Recommended types:

```text
chore
docs
feat
fix
refactor
test
build
ci
```

Recommended scopes:

```text
agent
docs
tasks
batches
app
tooling
```

Avoid vague summaries:

```text
update
fix
misc
wip
done
```

## Push Policy

The agent must never push. Publishing, pushing, tagging, deploying, or changing remotes is a human decision.
