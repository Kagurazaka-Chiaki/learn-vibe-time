# Agent State

Current batch: none
Current task: none
Last successful task: T031
Last run: 2026-05-01 T029/T031 sync reliability and milliseconds

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

No active batch is configured. Create or select the next batch before running
more agent-managed implementation work.

Update this file only with factual execution state.
Do not use this file for future planning or design discussion.
