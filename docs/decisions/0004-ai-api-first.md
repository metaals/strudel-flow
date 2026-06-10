# 4. AI integration is API-first

- Status: Accepted
- Date: 2026-06-10

## Context

AI helpers (Phase 9) should be able to build and edit patches. Bolting an assistant directly onto
UI callbacks would be brittle and untestable. The same mutation surface is also needed by
collaboration (Phase 8).

## Decision

Build **API-first**: a single, well-typed programmatic graph/command API (Phase 1, task
`P1-001`) is the substrate for everything. The AI layer (Phase 9) formalizes that API into an
**MCP-style tool schema** (`addNode`, `connect`, `setParam`, `writeStrudel`, `getGraph`,
`suggestWiring`…) and an in-app assistant calls those tools.

Start **bring-your-own-key**, fully client-side (consistent with ADR `0003-stay-static`); a
server-side AI proxy is deferred to Phase 10 and only if a trigger is hit.

## Consequences

- One mutation path shared by UI, collaboration, and AI → consistent, testable, serializable.
- The command API must be designed cleanly and early (it gates Phases 4, 8, 9).
- BYOK avoids a backend and key-management burden initially; UX cost is users supplying a key.
- MCP-style schema keeps the door open to external agents/tools later.
