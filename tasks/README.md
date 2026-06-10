# Tasks

This directory is the **machine-actionable backlog** for Strudel Flow. Each unit of work is a
single self-contained Markdown file, `P<phase>-<seq>.md`, that an autonomous agent (or a human)
can act on without extra context. The vision and phase overview live in
[`../ROADMAP.md`](../ROADMAP.md); the iteration loop lives in [`LOOP.md`](./LOOP.md).

## Files in this directory

| File | Purpose |
| ---- | ------- |
| [`LOOP.md`](./LOOP.md) | The "ralph loop" prompt the agent runs each iteration. |
| [`TEMPLATE.md`](./TEMPLATE.md) | Copy this to create a new task. |
| [`STATUS.md`](./STATUS.md) | At-a-glance board mirroring each task's `status`. |
| `P<phase>-<seq>.md` | One atomic task per file. |

## ID convention

`P<phase>-<seq>` — e.g. `P1-001`, `P4-003`. `<phase>` matches a ROADMAP phase (0–10); `<seq>`
is a zero-padded sequence within the phase. IDs are stable and never reused.

## Task-file schema

Every task file has YAML frontmatter followed by fixed sections:

```markdown
---
id: P2-001
title: Tap superdough master output for recording
phase: 2
status: todo            # todo | doing | done | blocked
priority: 1             # lower runs first within the eligible set
depends_on: [P1-002]    # task IDs that must be `done` first ([] if none)
est: M                  # S | M | L
---

## Why
One-paragraph problem statement and the user-facing outcome.

## Acceptance Criteria
- [ ] Testable, unambiguous conditions for "done".

## Implementation Notes
Concrete pointers to real files/functions to reuse.

## Verify
Commands to run + manual check steps (always includes `pnpm verify`).

## Files
Likely files to add/modify.
```

### Frontmatter fields

- **id** — must equal the filename stem.
- **status** — `todo` | `doing` | `done` | `blocked`. This is the **authoritative** status.
- **priority** — integer; within the eligible set, lower runs first.
- **depends_on** — list of task IDs that must be `done` before this task is eligible. Encodes the
  DAG so the loop never starts a blocked task.
- **est** — rough size, `S` | `M` | `L`.

## Lifecycle

```
todo ──pick──> doing ──verify+accept──> done
                 │
                 └──can't proceed──> blocked ──(unblocked)──> todo
```

- A task is **eligible** when `status: todo` and every `depends_on` task is `done`.
- The loop sets `doing` when it starts, `done` when `pnpm verify` is green and all acceptance
  criteria are ticked, or `blocked` (with a note appended under a `## Blocked` heading) if it
  can't proceed.
- Whenever a task's `status` changes, update [`STATUS.md`](./STATUS.md) to match.

## Adding a task

1. Copy [`TEMPLATE.md`](./TEMPLATE.md) to `P<phase>-<seq>.md`.
2. Fill in frontmatter (especially `depends_on`) and all sections.
3. Add a row to [`STATUS.md`](./STATUS.md).
