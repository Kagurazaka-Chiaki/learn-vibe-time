# Project Skills

This directory stores project-local skills for the file-system harness.

These are reusable instructions for this project. They are separate from any global Codex skill installation.

## Lifecycle

1. Import or propose a skill under `.agent/skills/proposed/<skill-name>/`.
2. Record it in `.agent/SKILLS.md`.
3. Run AI review and record the report under `.agent/reports/`.
4. Human reviewer accepts, requests changes, or rejects it.
5. Accepted skills move to `.agent/skills/active/`.
6. Rejected or obsolete skills move to `.agent/skills/archive/`.

## Default Use

- Active skills may be used by default when their trigger matches.
- Proposed skills may only be used when an active task explicitly permits it.
- Archived skills are historical reference only.

## Skill Shape

Each skill should use:

```text
skill-name/
  SKILL.md
  references/
  scripts/
  assets/
```

Only `SKILL.md` is required. Keep it concise and use progressive disclosure: core workflow in `SKILL.md`, optional detail in `references/`, deterministic helpers in `scripts/`, reusable output resources in `assets/`.
