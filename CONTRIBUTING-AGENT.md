# Contributing as an Agent

If you are an autonomous coding agent working on Strudel Flow, **start here:**

👉 **[`tasks/LOOP.md`](./tasks/LOOP.md)** — the iteration loop you run each session.

Quick orientation:

1. Read [`ROADMAP.md`](./ROADMAP.md) for the vision and dependency-ordered phases.
2. Read [`tasks/README.md`](./tasks/README.md) for the task-file schema and lifecycle.
3. Follow [`tasks/LOOP.md`](./tasks/LOOP.md): select the next eligible task → implement in
   scope → run `pnpm verify` → mark `done` → commit (one task = one commit).
4. Respect repo conventions in [`CLAUDE.md`](./CLAUDE.md) and
   [`ARCHITECTURE.md`](./ARCHITECTURE.md). Architectural decisions are recorded in
   [`docs/decisions/`](./docs/decisions/).

**Non-negotiables:** never weaken `pnpm verify` to make it pass; stay strictly within a task's
scope; keep one task per commit; stop and ask a human before risky, ambiguous, or destructive
actions.
