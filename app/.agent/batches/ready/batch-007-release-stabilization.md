# Batch 2026-05-01-007 - Release Stabilization

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

1. `.agent/tasks/ready/T022-stabilize-current-ui-diagnostics.md`
2. `.agent/tasks/ready/T023-release-security-identity.md`

## Allowed Commands

```bash
git status
git diff --stat
git diff -- <path>
bun run typecheck
bun run test
bun run build
bun run tauri build --debug
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
- a check fails and cannot be fixed within listed task scope
- CSP blocks app loading or Tauri IPC
- continuing would require install, publish, push, signing, or deletion

## Completion Notes

Completed. Current UI diagnostics were retained behind an environment gate, release identity was changed to `com.cmy20.vibetime`, CSP was made explicit, and debug artifacts now use `vibe-time` naming.
