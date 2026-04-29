# T008 - Add Rust Time Sync Command

Status: DONE

## Goal

Add a Tauri command that synchronizes UTC time from network sources.

## Scope

Allowed files:
- `src-tauri/src/time_sync.rs`
- `src-tauri/Cargo.toml`
- `src-tauri/Cargo.lock`

## Steps

1. Add `sync_utc_time` command implementation.
2. Query worldtimeapi first, then timeapi.
3. Parse UTC epoch from known JSON fields.
4. Return `utcMs`, `capturedAtMs`, `precisionMs`, and `sourceName`.

## Success Criteria

- Rust code compiles.
- Failures return a readable error string.
- No frontend behavior is changed in this task.

## Checks

Allowed checks:

```bash
cargo check
```

## Do Not

- Do not call the command from frontend yet.
- Do not add secrets or paid services.

## Fallback

Record a blocker if dependency download or network access is unavailable.

## Review Notes

Check that dependencies use Rustls and do not require native TLS setup.
