# Review Checklist

Use this checklist after each agent run.

## Review Order

1. Read `.agent/RUNLOG.md`.
2. Read `.agent/BLOCKERS.md`.
3. Read the latest `.agent/reports/ai-review-*.md`, if present.
4. Read `.agent/SKILLS.md` if skills were added or changed.
5. Run `git status`.
6. Run `git diff --stat`.
7. Run `git diff`.
8. Check tasks moved to `.agent/tasks/done/`.
9. Check tasks moved to `.agent/tasks/blocked/`.
10. Decide whether to accept, revert, activate skills, or create a follow-up batch.

## Release Review Additions

For release-facing changes, also verify:

- Tauri `identifier` is stable, formal, and does not end with `.app`.
- Tauri CSP is explicit; `csp: null` is not accepted for release.
- Package version, Cargo version, Tauri version, executable name, and installer names are consistent.
- The app title/user-facing name and artifact naming are intentionally different only when documented.

## Time Sync Review Additions

For sync-related changes, also verify:

- UI copy says estimated error or network delay estimate, not clock precision.
- SNTP responses expose offset, delay, estimated error, source, and source host.
- Failure UI preserves the latest error details and does not present failed attempts as successful syncs.
- Local fallback keeps the clock running and clearly says local system time is being used.

## Acceptance Criteria

A task can be accepted only if:

- its declared Success Criteria are satisfied
- only files in its Scope were modified
- unsafe commands were not executed
- RUNLOG matches actual diff
- blockers are not silently ignored
- AI review findings are addressed or explicitly accepted as residual risk
- proposed skills are not active unless accepted by a human

## Rejection Criteria

Reject or revert work if:

- task scope was silently expanded
- unrelated files were modified
- a task was marked done without evidence
- the agent modified credentials or environment files
- generated content conflicts with repository goals
- proposed skills contain secrets, overfit one run, or expand agent permissions
- release changes disable CSP or weaken Tauri IPC/security boundaries without explicit human acceptance
- sync UI overstates accuracy or hides failure details needed for diagnosis
