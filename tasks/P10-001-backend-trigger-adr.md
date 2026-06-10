---
id: P10-001
title: Backend trigger evaluation + ADR
phase: 10
status: todo
priority: 1
depends_on: [P8-001]
est: S
---

## Why
The project stays static as long as possible. Before introducing any backend, we must document
the exact triggers that force one and evaluate the options, so the decision is deliberate rather
than incidental.

## Acceptance Criteria
- [ ] An ADR records the concrete triggers that justify a backend (e.g. signaling/TURN reliability,
      shared cloud persistence, registry writes, server-side AI keys).
- [ ] The ADR evaluates candidate options (Cloudflare / Supabase / PartyKit) against the triggers.
- [ ] No backend is introduced unless at least one trigger is demonstrably hit.
- [ ] The ADR is linked from `ROADMAP.md` Phase 10.

## Implementation Notes
- This is primarily a decision task; depends on real-world limits surfaced by collaboration
  (P8-001).
- Update `docs/decisions/0003-stay-static.md` with the realized triggers, or add a new ADR.

## Verify
- `pnpm verify` (docs-only; gate must still pass)
- Manual: review the ADR captures triggers + option tradeoffs.

## Files
- `docs/decisions/00XX-backend.md` (new) or update `0003-stay-static.md`
- `ROADMAP.md` (link)

> **Stub** — expand when P8-001 surfaces real static-hosting limits.
