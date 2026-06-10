---
id: P9-001
title: MCP-style tool schema over command API
phase: 9
status: todo
priority: 1
depends_on: [P1-001]
est: M
---

## Why
To let an AI assistant build and edit patches, the Phase 1 command API should be formalized into
an MCP-style tool schema. Bring-your-own-key keeps it static (no backend AI proxy yet).

## Acceptance Criteria
- [ ] A tool schema wraps the command API: `addNode`, `connect`, `setParam`, `writeStrudel`,
      `getGraph`, `suggestWiring` (names may vary), each with typed inputs/outputs.
- [ ] An in-app assistant panel can call the tools to mutate the graph.
- [ ] Bring-your-own-key configuration; no key is stored server-side.
- [ ] Tool calls go through the same command API path as the UI (no bypass).

## Implementation Notes
- Build directly on P1-001 (`src/lib/graph-api.ts`); expose its commands as tool definitions.
- Keep transport client-side / BYOK per ADR `docs/decisions/0004-ai-api-first.md`.
- Backend AI proxy is deferred to Phase 10.

## Verify
- `pnpm verify`
- Manual: with a key configured, ask the assistant to add and wire a node; confirm the graph
  updates.

## Files
- `src/lib/mcp-tools.ts` (new)
- assistant panel UI (new)

> **Stub** — expand when P1-001 is done.
