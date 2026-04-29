# Stop Conditions

These conditions require the agent to stop, record the reason, and avoid further changes unless the active task explicitly resolves the risk.

## Scope Risk

- A required change is outside the active task `Scope`.
- A task lacks clear `Scope`, `Success Criteria`, `Checks`, or `Fallback`.
- Completing the task would require rewriting broad documents or refactoring unrelated areas.
- The agent would need to overwrite user-authored content whose purpose is unclear.

## Safety Risk

- A task requires secrets, credentials, private keys, tokens, or `.env` files.
- A task requires network access, dependency installation, deployment, publishing, or paid services.
- A task requires modifying generated lockfiles without explicit permission.

## File-System Risk

- A task requires deleting files or directories without explicit permission.
- A task requires moving many files or reorganizing repository structure.
- A file is too large or too ambiguous to inspect safely within the task.

## Git Risk

- A task requires `git push`, `git pull`, `git fetch`, `git reset --hard`, `git clean`, `git rebase`, or overwriting the working tree.
- A task requires staging or committing files without satisfying `.agent/GIT_POLICY.md`.
- The working tree contains unrelated changes that would be mixed into the task result.

## Verification Risk

- The same check fails twice for the same unclear reason.
- The required check cannot be run and the task has no acceptable fallback.
- The result cannot be reviewed through `RUNLOG`, `BLOCKERS`, task status, and `git diff`.

## Stop Procedure

1. Record the issue in `.agent/BLOCKERS.md`.
2. Record partial work in `.agent/RUNLOG.md`.
3. Mark or move the task to blocked when the active batch permits it.
4. Continue only if another active-batch task can proceed safely.
