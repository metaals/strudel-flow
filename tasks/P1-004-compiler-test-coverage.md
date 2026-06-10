---
id: P1-004
title: Expand compiler test coverage
phase: 1
status: todo
priority: 3
depends_on: []
est: S
---

## Why
The compiler (`generateOutput` / `generateOutputWithErrors`) is the core of the app and the
foundation later phases (composites, arrangement) extend. Broadening test coverage makes those
extensions safe and keeps `pnpm verify` a meaningful gate.

## Acceptance Criteria
- [ ] New `vitest` cases cover multi-component graphs, effect chaining order, and error paths in
      `generateOutputWithErrors`.
- [ ] Time-effect and audio-effect nodes each have at least one compile assertion.
- [ ] Edge cases covered: empty graph, disconnected nodes, self-connection rejection.
- [ ] All tests pass under `pnpm test:run`; no production code changes required.

## Implementation Notes
- Extend `src/lib/__tests__/strudel.test.ts` and `src/lib/__tests__/graph-utils.test.ts`.
- Reuse existing fixtures/builders in those test files.
- Compiler entry points: `generateOutput` / `generateOutputWithErrors` (`src/lib/strudel.ts:45`,
  `:54`); component grouping `findConnectedComponents` (`src/lib/graph-utils.ts:15`).

## Verify
- `pnpm verify`
- Manual: review the new assertions describe real, expected Strudel output.

## Files
- `src/lib/__tests__/strudel.test.ts`
- `src/lib/__tests__/graph-utils.test.ts`
