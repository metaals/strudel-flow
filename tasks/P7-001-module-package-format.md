---
id: P7-001
title: Versioned module package format
phase: 7
status: todo
priority: 1
depends_on: [P4-001]
est: M
---

## Why
To share composites/nodes between users and (later) a registry, we need a versioned, portable
package format with a manifest and declared dependencies that can be exported/imported as files —
no backend required.

## Acceptance Criteria
- [ ] A documented package schema: manifest (id, version, name, author, license) + the composite
      definition + declared dependencies.
- [ ] Export a composite to a single package file.
- [ ] Import a package file, validating the manifest and version compatibility.
- [ ] License metadata is carried (repo is AGPL-3.0); incompatible/missing license is flagged.

## Implementation Notes
- Build on composites (P4-001) and the saved-node inline-copy template pattern
  (`src/store/saved-nodes-store.ts`).
- Keep it file-based and static; the registry index (Phase 7 follow-up) is a separate task.
- Reuse `lz-string` (already a dependency) if compact encoding is useful.

## Verify
- `pnpm verify`
- Manual: export a composite, re-import into a fresh project, confirm it works.

## Files
- `src/lib/module-package.ts` (new)
- import/export UI (new)

> **Stub** — expand when P4-001 is done.
