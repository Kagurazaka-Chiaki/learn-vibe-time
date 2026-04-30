# T016 - Rename Tauri App

Status: DONE

## Goal

Rename starter Tauri metadata for the desktop clock app.

## Scope

Allowed files:
- `src-tauri/tauri.conf.json`
- `src-tauri/Cargo.toml`

## Steps

1. Set product name and window title to `Vibe Time`.
2. Set default window size to `1100x720`.
3. Set minimum window size to `720x480`.
4. Update Cargo package description.

## Success Criteria

- Desktop metadata no longer uses starter `app` text.
- Window defaults suit a clock app.

## Checks

Allowed checks:

```bash
cargo check
bun run build
```

## Do Not

- Do not regenerate icons.

## Fallback

Record a blocker if Tauri config rejects minimum size fields.

## Review Notes

Check Tauri v2 config schema compatibility.
