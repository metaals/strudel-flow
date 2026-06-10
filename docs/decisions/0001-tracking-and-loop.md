# 1. Tracking system & autonomous agent loop

- Status: Accepted
- Date: 2026-06-10

## Context

Strudel Flow's vision (DAW + sequencer + sound designer, collab, registry, AI) is large and will
be implemented incrementally across many sessions. Without a durable, machine-consumable plan, an
autonomous agent loses context between sessions and risks scope creep or duplicated work.

## Decision

Track the work as plain Markdown in the repo:

- `ROADMAP.md` — vision, principles, and dependency-ordered phases.
- `tasks/` — one Markdown file **per atomic task** (`P<phase>-<seq>.md`) with YAML frontmatter
  (`id`, `status`, `priority`, `depends_on`, `est`) and fixed sections (Why / Acceptance Criteria
  / Implementation Notes / Verify / Files).
- `tasks/LOOP.md` — the "ralph loop" prompt the agent runs each iteration: select the next
  eligible task → implement in scope → run `pnpm verify` → mark done → commit (one task = one
  commit).
- `tasks/STATUS.md` — an at-a-glance board mirroring task status.
- A single `pnpm verify` gate (`tsc --noEmit && pnpm lint && pnpm test:run && pnpm build`) that
  every task must pass before being marked done.

## Consequences

- Plan and code live together and are versioned; progress survives across sessions.
- The `depends_on` DAG makes eligibility deterministic so the loop never starts a blocked task.
- Everything is static (Markdown + one npm script); no backend or external tracker needed.
- Overhead: task files and `STATUS.md` must be kept in sync (the loop enforces this).
