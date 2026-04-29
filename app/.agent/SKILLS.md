# Skills Registry

This file indexes project-local skills under `.agent/skills/`.

Skills are reusable agent procedures, project knowledge, and tool workflows. They are not global Codex skills and do not grant permissions by themselves.

## Rules

- Only skills under `.agent/skills/active/` may be used by default.
- Skills under `.agent/skills/proposed/` require explicit task permission.
- AI may propose skills, but may not activate them automatically.
- Human acceptance is required before moving a skill to `active`.
- Keep this registry under the 800-1000 line soft limit; archive old entries when needed.

## Registry Columns

Use this format:

```markdown
| Name | Status | Source | Trigger | Review State | Last Updated |
| --- | --- | --- | --- | --- | --- |
| example-skill | proposed | run observation | when ... | pending-ai-review | YYYY-MM-DD |
```

## Active Skills

No active skills yet.

## Proposed Skills

No proposed skills yet.

## Archived Skills

No archived skills yet.
