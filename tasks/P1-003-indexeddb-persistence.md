---
id: P1-003
title: IndexedDB persistence layer
phase: 1
status: todo
priority: 2
depends_on: []
est: M
---

## Why
`localStorage` cannot hold large binary data (samples, recordings) needed by Phases 2/3. We need
an IndexedDB-backed store alongside the existing `persist` stores, while keeping the established
versioned migrate-chain pattern.

## Acceptance Criteria
- [ ] An IndexedDB helper (e.g. via `idb-keyval`) provides async `get`/`set`/`del`/`keys` for
      binary blobs and large objects.
- [ ] Existing `localStorage`-backed Zustand `persist` stores are untouched for small UI/graph
      state; only large/binary data uses IndexedDB.
- [ ] A versioned schema + migration hook mirrors the `PROJECT_STATE_VERSION` pattern in
      `src/lib/project-state.ts`.
- [ ] Unit tests cover round-trip store/load and a version migration step (jsdom + a fake/in-memory
      IndexedDB).
- [ ] Graceful fallback/error path when IndexedDB is unavailable (reuse `error-store.ts`).

## Implementation Notes
- Add `idb-keyval` (small, static-friendly) — keep bundle impact minimal.
- Follow the migrate-chain in `src/lib/project-state.ts` (`PROJECT_STATE_VERSION`,
  per-version migrators).
- Do not mix concerns between stores (see `CLAUDE.md`): keep this a separate persistence module.

## Verify
- `pnpm verify`
- Manual: store a blob, reload the app, confirm it is retrievable from IndexedDB.

## Files
- `src/lib/idb-store.ts` (new)
- `src/lib/__tests__/idb-store.test.ts` (new)
- `package.json` (add `idb-keyval`)
