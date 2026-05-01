# T026 - SNTP Four Timestamps

Status: DONE

## Goal

Implement SNTP offset and delay calculation from T1/T2/T3/T4 timestamps in Rust.

## Scope

Allowed files:
- `src-tauri/src/time_sync.rs`
- `src/domain/sync.ts`
- `src/domain/sync.test.ts`
- `.agent/RUNLOG.md`
- `.agent/BLOCKERS.md`

Read-only files:
- `src-tauri/Cargo.toml`

## Steps

1. Encode client transmit time into the NTP request.
2. Parse server receive and transmit timestamps from the response.
3. Compute offset and delay with SNTP formulas.
4. Return `offsetMs`, `delayMs`, `estimatedErrorMs`, `sourceName`, and `sourceHost`.
5. Add Rust unit tests for timestamp conversion and formulas.

## Success Criteria

- NTP responses use four timestamps.
- Frontend no longer derives offset from `utcMs - capturedAtMs`.
- HTTP JSON fallback remains available and marked as an estimate.

## Checks

Allowed checks:

```bash
cargo test
bun run typecheck
bun run test
```

## Do Not

- Do not add dependencies.
- Do not remove HTTP JSON fallback.
- Do not change the Tauri command name.

## Fallback

If four-timestamp parsing cannot be completed safely, keep the old transport but block the task and do not claim SNTP support.

## Review Notes

Completed in the continuous release and sync hardening run.
