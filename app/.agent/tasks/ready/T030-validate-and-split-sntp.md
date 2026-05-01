# T030 - Validate and Split SNTP

Status: DONE

## Goal

Move SNTP implementation into its own Rust module and reject invalid SNTP responses.

## Scope

Allowed files:
- `src-tauri/src/time_sync.rs`
- `src-tauri/src/time_sync/sntp.rs`
- `.agent/RUNLOG.md`
- `.agent/BLOCKERS.md`

Read-only files:
- `src-tauri/Cargo.toml`

## Steps

1. Create `time_sync/sntp.rs`.
2. Move NTP timestamp encoding, decoding, formula, UDP query, and SNTP tests into the new module.
3. Validate response length, mode, leap indicator, stratum, originate timestamp, receive timestamp, and transmit timestamp.
4. Keep `time_sync.rs` as command/source orchestration.
5. Run Rust checks.

## Success Criteria

- SNTP implementation is isolated in `time_sync/sntp.rs`.
- Invalid SNTP packets are rejected by tests.
- `sync_utc_time` behavior and command name stay unchanged.

## Checks

Allowed checks:

```bash
cargo test
bun run tauri build --debug
```

## Do Not

- Do not add Rust dependencies.
- Do not remove HTTP JSON fallback.
- Do not publish, sign, or push artifacts.

## Fallback

If module split causes compile risk, keep orchestration in `time_sync.rs` and block only the split portion while preserving validation fixes.

## Review Notes

Completed in batch-011.
