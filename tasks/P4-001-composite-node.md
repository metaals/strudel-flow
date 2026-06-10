---
id: P4-001
title: Composite node with typed I/O ports
phase: 4
status: todo
priority: 1
depends_on: [P1-001]
est: L
---

## Why
Complex patches become unmanageable as flat graphs. A composite/group node wrapping an inner
subgraph with typed input/output ports enables reuse and abstraction, and is a prerequisite for
song-mode arrangement (Phase 5) and the module registry (Phase 7).

## Acceptance Criteria
- [ ] A composite node wraps an inner graph and exposes typed input/output ports.
- [ ] Collapse/expand using React Flow subflows.
- [ ] The compiler resolves nested graphs and maps exposed ports to inner sources/effects.
- [ ] Composites save/load via the saved-node library with inline-copy templates (shares keep
      working).

## Implementation Notes
- Build on the command API (P1-001) for nested mutations.
- Extend `generateOutput` (`src/lib/strudel.ts`) and `findConnectedComponents`
  (`src/lib/graph-utils.ts`) to walk nested graphs.
- Reuse `src/store/saved-nodes-store.ts` inline-copy template pattern for portability.

## Verify
- `pnpm verify`
- Manual: build a composite, collapse it, confirm generated Strudel output is unchanged vs. the
  flat equivalent.

## Files
- composite node component (new)
- `src/lib/strudel.ts`, `src/lib/graph-utils.ts`
- `src/store/saved-nodes-store.ts`

> **Stub** — expand when P1-001 is done.
