# T023 - Release Security Identity

Status: DONE

## Goal

Make release metadata and security configuration suitable for local release builds.

## Scope

Allowed files:
- `src-tauri/tauri.conf.json`
- `src-tauri/Cargo.toml`
- `README.md`
- `../README.md`
- `../README.en.md`
- `.agent/RUNLOG.md`
- `.agent/BLOCKERS.md`

Read-only files:
- `package.json`
- `src-tauri/src/main.rs`

## Steps

1. Replace the `.app`-suffixed identifier with `com.cmy20.vibetime`.
2. Set the product name to the user-visible `Vibe Time`.
3. Replace `csp: null` with an explicit Tauri-compatible CSP.
4. Align README release paths and naming with generated artifacts.
5. Run allowed checks.

## Success Criteria

- Tauri no longer warns about an `.app` suffix identifier.
- CSP is not `null`.
- Version remains `0.1.0` across Tauri, Cargo, and package metadata.
- README release paths match expected artifact naming.

## Checks

Allowed checks:

```bash
bun run build
bun run tauri build --debug
git diff -- src-tauri/tauri.conf.json src-tauri/Cargo.toml README.md ../README.md ../README.en.md
```

## Do Not

- Do not publish, sign, or push artifacts.
- Do not change the release version from `0.1.0`.
- Do not install dependencies.
- Do not delete bundle outputs.

## Fallback

If CSP blocks the app or Tauri IPC, record the failure and revert only the CSP line to the safest known working explicit policy.

## Review Notes

Completed in the continuous release and sync hardening run.
