---
id: P3-001
title: Multi-project model + switcher
phase: 3
status: todo
priority: 1
depends_on: [P1-003]
est: L
---

## Why
The app holds a single graph. To support multiple songs/sketches (and later samples per project),
we need a multi-project model with a switcher, persisted to IndexedDB.

## Acceptance Criteria
- [ ] A project model (id, name, metadata, graph, created/updated) persisted via the IndexedDB
      layer (P1-003).
- [ ] UI to create, rename, switch, and delete projects.
- [ ] The current single-graph URL/file share state is generalized to reference a project.
- [ ] Existing saved state migrates into a default project without data loss.

## Implementation Notes
- Generalize `src/lib/project-state.ts` and `src/components/save-project-dialog.tsx`.
- Persist via P1-003 IndexedDB store; keep the versioned migrate-chain pattern.
- Mirror `saved-nodes-store.ts` patterns for the library/listing UI.

## Verify
- `pnpm verify`
- Manual: create two projects, switch between them, reload, confirm both persist.

## Files
- `src/store/projects-store.ts` (new)
- `src/lib/project-state.ts`
- project switcher UI (new)

> **Stub** — expand when P1-003 is done.
