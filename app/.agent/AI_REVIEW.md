# AI Review

AI review is a checkpoint gate for agent-generated work.

It helps find errors before human review, but it is not acceptance. The human user remains responsible for final decisions.

## When to Review

Run AI review after:

- a completed batch
- a coherent checkpoint before a local commit
- a long unattended run checkpoint
- a proposed skill is created or updated

For small tasks inside a batch, one checkpoint review at the batch boundary is enough unless the task is risky.

## Reviewer Duties

The reviewer checks:

- scope violations
- missing or weak checks
- dangerous commands or policy violations
- `RUNLOG`, `BLOCKERS`, task status, and diff consistency
- checkpoint commit risk
- proposed skill quality, overfitting, secret leakage, and permission expansion
- unresolved human decisions

## Report Output

Write reports under `.agent/reports/`.

Suggested name:

```text
ai-review-YYYYMMDD-<batch-or-run>.md
```

Use `.agent/reports/templates/ai-review.template.md` when available.

## Review Outcomes

Use one of:

- `pass`: no blocking findings found
- `pass-with-notes`: minor risks or follow-ups
- `needs-human-review`: non-blocking but requires human judgment
- `block`: unsafe, inconsistent, or outside scope

## Skill Review

For proposed skills, check:

- `SKILL.md` has clear frontmatter and trigger description
- instructions are concise and reusable
- references/assets/scripts are only included when useful
- project secrets or credentials are not embedded
- the skill does not expand agent permissions
- the skill is not too specific to one accidental run

AI review may recommend activation, revision, or archive. Only a human may accept activation into `.agent/skills/active/`.
