# Prompt: Review Agent Run

```text
Review the latest agent run.

Read:
- `.agent/RUNLOG.md`
- `.agent/BLOCKERS.md`
- `.agent/AI_REVIEW.md`
- `.agent/SKILLS.md`
- active batch file
- completed task files
- blocked task files

Then inspect:
- `git status`
- `git diff --stat`
- `git diff`
- recent checkpoint commits, if present

Produce an AI review report under `.agent/reports/` with:
- outcome
- accepted changes
- suspicious changes
- scope violations
- blockers needing human decision
- checkpoint commit notes
- skill audit
- recommended revert or follow-up tasks

AI review is advisory. It does not accept the work for the human.
```
