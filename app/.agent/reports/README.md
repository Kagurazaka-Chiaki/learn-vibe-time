# Reports

This folder stores human-readable review reports after agent runs.

Suggested report name:

```text
review-YYYY-MM-DD-batch-001.md
ai-review-YYYYMMDD-batch-001.md
```

A report should include:

- batch reviewed
- tasks completed
- tasks blocked
- files changed
- scope violations
- suspicious changes
- accepted changes
- recommended follow-up tasks

AI review reports should additionally include:

- outcome: pass, pass-with-notes, needs-human-review, or block
- risk level
- scope audit
- checks audit
- commit audit
- skill audit
- human decisions needed
