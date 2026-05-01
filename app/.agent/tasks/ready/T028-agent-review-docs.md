# T028 - Agent Review Docs

Status: DONE

## Goal

Update agent review documentation so future runs check release security and sync-trust claims.

## Scope

Allowed files:
- `.agent/REVIEW.md`
- `.agent/AI_REVIEW.md`
- `.agent/CHECKS.md`
- `.agent/RUNLOG.md`
- `.agent/BLOCKERS.md`

Read-only files:
- `.agent/STATE.md`

## Steps

1. Add release security and identity review checks.
2. Add sync estimate wording checks.
3. Add sync failure detail and SNTP schema checks.
4. Record the documentation update in the run log.

## Success Criteria

- Review docs mention CSP, identifier, version/artifact consistency, sync estimate wording, failure details, and SNTP fields.
- No agent permissions are expanded.

## Checks

Allowed checks:

```bash
git diff -- .agent/REVIEW.md .agent/AI_REVIEW.md .agent/CHECKS.md
```

## Do Not

- Do not loosen agent safety policy.
- Do not permit publishing or pushing.
- Do not edit unrelated `.agent` files except run records.

## Fallback

If documentation changes become too broad, record a blocker and keep only the review checklist additions.

## Review Notes

Completed in the continuous release and sync hardening run.
