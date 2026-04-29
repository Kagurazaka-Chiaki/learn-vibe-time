# Agent State

Current batch: none
Current task: none
Last successful task: none
Last run: 2026-04-29 bootstrap app harness

## Mode

- conservative
- batch-driven
- no network
- no dependency install
- no git push
- no `git add .`
- local checkpoint commits are governed by `.agent/GIT_POLICY.md`
- active batch only

## Notes

This harness controls the `app/` project. The sibling `../iota-agnt01/`
submodule remains a reference source for templates and policy language.

No active batch is configured yet. Create tasks under `.agent/tasks/ready/`,
create a batch under `.agent/batches/ready/`, then update `Current batch` before
running the batch protocol.

Update this file only with factual execution state.
Do not use this file for future planning or design discussion.
