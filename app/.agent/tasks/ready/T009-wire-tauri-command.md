# T009 - Wire Tauri Command

Status: DONE

## Goal

Register the Rust time sync command with Tauri.

## Scope

Allowed files:
- `src-tauri/src/lib.rs`
- `src-tauri/src/time_sync.rs`

## Steps

1. Add the `time_sync` module.
2. Register `sync_utc_time` in `generate_handler`.
3. Remove `greet` if it is no longer used after frontend cleanup.

## Success Criteria

- Tauri command is callable as `sync_utc_time`.
- Unused starter command is removed when safe.

## Checks

Allowed checks:

```bash
cargo check
```

## Do Not

- Do not change Tauri window config.

## Fallback

Record a blocker if command registration conflicts with Tauri macro constraints.

## Review Notes

Keep Rust module boundaries simple.
