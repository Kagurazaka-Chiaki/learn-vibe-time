# Agent State

Current batch: `.agent/batches/ready/batch-006-preferences.md`
Current task: none
Last successful task: T018
Last run: 2026-04-29 T018 desktop polish

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

The next active batch is the preferences batch. Execute only tasks listed by
`.agent/batches/ready/batch-006-preferences.md` unless the user gives a new
explicit scope.

Update this file only with factual execution state.
Do not use this file for future planning or design discussion.
