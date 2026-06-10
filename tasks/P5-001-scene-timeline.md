---
id: P5-001
title: Scene timeline (song mode)
phase: 5
status: todo
priority: 1
depends_on: [P4-001]
est: L
---

## Why
Live patches need arrangement: sequencing sections/composites over time (e.g. "after 4× 8-beat
staffs, switch composite 1 → composite 2") turns a looping patch into a song.

## Acceptance Criteria
- [ ] A timeline / scene sequencer arranges composites/sections over bars.
- [ ] Transport bar counter drives scene switches, derived from `getSchedulerNow()`.
- [ ] At least one automation lane (e.g. mute/gain) can be scheduled across bars.
- [ ] Arrangement persists with the project.

## Implementation Notes
- Depends on composites (P4-001) as the arrangeable unit.
- Use Strudel `arrange()` / scene swapping or mute/gain automation.
- Transport timing from `getSchedulerNow()` (`src/lib/strudel-clock.ts`); do not duplicate clock
  logic.

## Verify
- `pnpm verify`
- Manual: arrange two composites over 8 bars; confirm the switch happens on the right bar.

## Files
- scene/timeline UI + store (new)
- `src/lib/strudel.ts` (arrangement compile)

> **Stub** — expand when P4-001 is done.
