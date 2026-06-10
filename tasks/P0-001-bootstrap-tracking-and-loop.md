---
id: P0-001
title: Bootstrap roadmap, tasks, loop & verify gate
phase: 0
status: done
priority: 1
depends_on: []
est: M
---

## Why
There is no machine-consumable planning system in the repo, so autonomous implementation cannot
proceed incrementally without losing context between sessions. This task establishes the roadmap,
the per-task backlog, the agent loop, the decision records, and the single verification gate.

## Acceptance Criteria
- [x] `ROADMAP.md` describes the vision, principles, status legend, and all phases (0–10).
- [x] `tasks/README.md` documents the task-file schema and lifecycle.
- [x] `tasks/LOOP.md` describes the select → implement → verify → mark-done → commit loop
      unambiguously.
- [x] `tasks/TEMPLATE.md` and `tasks/STATUS.md` exist and match the schema.
- [x] An example Phase 1 task (`P1-001`) follows the schema with `depends_on`.
- [x] `package.json` has a `verify` script:
      `tsc --noEmit && pnpm lint && pnpm test:run && pnpm build`.
- [x] The four ADRs exist in `docs/decisions/`.
- [x] `pnpm verify` passes on a clean tree.
- [x] Starting only from `tasks/LOOP.md`, a reader can deterministically identify the next task
      as `P1-001`.

## Implementation Notes
Pure docs + one npm script. No product feature code. Grounded against real symbols:
`generateOutput` (`src/lib/strudel.ts`), `findConnectedComponents` (`src/lib/graph-utils.ts`),
`getSchedulerNow` (`src/lib/strudel-clock.ts`), `PROJECT_STATE_VERSION`
(`src/lib/project-state.ts`), and the `app-store` actions in `src/store/app-store.ts`.

## Verify
- `pnpm verify`
- Manual: read `tasks/LOOP.md` cold and confirm the next eligible task resolves to `P1-001`.

## Files
- `ROADMAP.md`, `CONTRIBUTING-AGENT.md`
- `tasks/README.md`, `tasks/LOOP.md`, `tasks/TEMPLATE.md`, `tasks/STATUS.md`, `tasks/P*-*.md`
- `docs/decisions/0001..0004-*.md`
- `package.json`
