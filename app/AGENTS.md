# AGENTS.md - app

This `app/` project uses a constrained file-system agent harness installed from
`../iota-agnt01`.

Treat `app/` as the project root for all paths in this file. The sibling
`../iota-agnt01/` directory is a reference submodule, not the active harness.

## Project Identity

This project is `Vibe Time`, a Tauri + React desktop clock positioned as fully
driven by `iota-agnt001`, with no human-written application code. The product
goal is an ad-free time display that can run as a web app or desktop app without
requiring a browser tab.

This repository is also a trial project for agent-driven development. Keep work
small, auditable, and easy to review.

## Role

The agent is an untrusted execution assistant. It may help create, modify, organize, and review project artifacts, but it is not an authority on correctness.

The human user remains responsible for:

- project direction
- specification quality
- acceptance decisions
- security decisions
- final review and merge decisions

## Mandatory Reading Order

Before acting, the agent must read:

1. `.agent/RULES.md`
2. `.agent/STOP_CONDITIONS.md`
3. `.agent/GIT_POLICY.md`
4. `.agent/SKILLS.md`
5. `.agent/AI_REVIEW.md`
6. `.agent/METAPLAN.md`
7. `.agent/INDEX.md`
8. `.agent/STATE.md`
9. the active batch file referenced by `.agent/STATE.md`

If `.agent/STATE.md` says there is no active batch, the agent may help plan or
create tasks when explicitly asked, but must not execute app changes under the
batch protocol.

## Default Work Mode

- Work from explicit task files.
- Treat the Time.is-inspired clock experience as the main product direction.
- Keep work scoped to this `app/` project unless a task explicitly permits
  reading the sibling harness reference.
- Prefer small, local, reversible changes.
- Respect task scope exactly.
- Record actual work in `.agent/RUNLOG.md`.
- Record uncertainty or blockers in `.agent/BLOCKERS.md`.
- Create local checkpoint commits when `.agent/GIT_POLICY.md` conditions are met.
- Create proposed skills only when task scope permits; never activate skills without review and human acceptance.
- Produce AI review reports at batch/checkpoint gates.
- Continue after local blockers when safe.
- Stop when `.agent/STOP_CONDITIONS.md` applies.
- Stop only when the active batch is complete, blocked, or unsafe to continue.

## Forbidden by Default

The agent must not:

- run `git push`
- run destructive git commands
- stage or commit files unless `.agent/GIT_POLICY.md` conditions are met
- install packages or dependencies
- access paths outside the repository
- modify `../iota-agnt01/` or other sibling paths unless explicitly asked
- modify `src/`, `src-tauri/`, package manifests, or lockfiles unless the
  active task `Scope` explicitly lists them
- delete files without explicit task permission
- modify secrets, credentials, tokens, or `.env` files
- silently expand the scope of a task
- mark a task done without satisfying its success criteria
- rewrite roadmap or planning files without explicit permission

## Allowed by Default

The agent may:

- read repository files
- edit files explicitly listed in task scope
- create files explicitly required by a task
- create local checkpoint commits under `.agent/GIT_POLICY.md`
- create proposed skills under `.agent/skills/proposed/` when explicitly in scope
- run safe read-only commands such as:
  - `git status`
  - `git diff --stat`
  - `git diff -- <file>`
  - `ls`
  - `find`
  - `rg`

## Review Principle

AI-generated work is not accepted until reviewed through:

1. `.agent/RUNLOG.md`
2. `.agent/BLOCKERS.md`
3. `.agent/STOP_CONDITIONS.md`
4. task status files
5. local checkpoint commits, when present
6. AI review reports
7. `git diff --stat`
8. `git diff`
9. human judgment
