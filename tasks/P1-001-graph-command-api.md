---
id: P1-001
title: Programmatic graph/command API
phase: 1
status: todo
priority: 1
depends_on: []
est: L
---

## Why
Graph mutations are spread across `app-store.ts` actions and component callbacks, so there is no
single typed entry point for changing the graph. A clean command API is the substrate the AI/MCP
layer (Phase 9) and collaboration (Phase 8) will reuse, and it makes mutations testable and
serializable.

## Acceptance Criteria
- [ ] A new module (e.g. `src/lib/graph-api.ts`) exposes typed commands: at minimum
      `addNode`, `removeNode`, `connect`, `disconnect`, `setParam` (wraps `updateNodeData`),
      and read accessors `getGraph` / `getNode`.
- [ ] All commands route through the existing `app-store` so undo/persistence/rendering keep
      working; no component bypasses the API for mutations it covers.
- [ ] Each command has unit tests in `src/store/__tests__/` or `src/lib/__tests__/`.
- [ ] Public functions are documented with TSDoc and exported from a single barrel.
- [ ] No behavior change visible to the user (pure refactor + new surface).

## Implementation Notes
- Reuse `app-store` actions: `addNode`, `removeNode`, `updateNodeData`, `onConnect`
  (`src/store/app-store.ts:32`–`100`).
- Keep param writes going through `updateNodeData(id, { ... })` per `CLAUDE.md` conventions.
- Connection shape must match React Flow `Connection`/`OnConnect` already used by `onConnect`.
- Validate edges the way `onConnect` does (e.g. ignore self-connections — see
  `app-store.test.ts`).

## Verify
- `pnpm verify`
- Manual: add/connect/param-set a node via the API in a test and confirm the graph + generated
  Strudel output match the equivalent store actions.

## Files
- `src/lib/graph-api.ts` (new)
- `src/lib/__tests__/graph-api.test.ts` (new)
- `src/store/app-store.ts` (only if exposing internals the API needs)
