# AI Review - 2026-05-01 batch-011 sync reliability and milliseconds

## Outcome

pass-with-notes

## Scope Reviewed

- T029 stale sync overwrite prevention
- T030 SNTP validation and module split
- T031 optional main clock milliseconds

## Findings

- No blocking scope violation found.
- Sync state updates are guarded by a latest-request id.
- SNTP logic is isolated in `time_sync/sntp.rs`.
- SNTP validation covers server mode, leap indicator, stratum, originate timestamp, and empty receive/transmit timestamps.
- Millisecond display is default-off and exposed through preferences/settings.

## Residual Notes

- Stale sync behavior is covered by a pure helper test rather than a hook integration test because no hook testing utility is installed.
- Toggling milliseconds restarts the clock hook effect and may trigger an extra sync attempt; this is acceptable for the current simple design.
