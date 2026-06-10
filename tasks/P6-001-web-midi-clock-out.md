---
id: P6-001
title: Web MIDI clock + note out
phase: 6
status: todo
priority: 1
depends_on: [P1-002]
est: M
---

## Why
Producers want to drive external hardware/software. Web MIDI clock + note output lets Strudel
Flow act as a sequencer for outboard gear, synced to the transport.

## Acceptance Criteria
- [ ] Enumerate and select a Web MIDI output device.
- [ ] Emit MIDI clock locked to the transport.
- [ ] At least one node can send note-on/note-off to the selected device in time.
- [ ] Graceful no-op + user notice when Web MIDI is unavailable.

## Implementation Notes
- Sync to the transport via `getSchedulerNow()` (`src/lib/strudel-clock.ts`); reuse the engine
  timing from P1-002 rather than a separate clock.
- Use the Web MIDI API directly (static-friendly, no backend).
- Surface availability errors via `error-store.ts`.

## Verify
- `pnpm verify`
- Manual: connect a MIDI monitor, confirm clock + notes arrive in time.

## Files
- `src/lib/midi.ts` (new)
- MIDI out node + settings UI (new)

> **Stub** — expand when P1-002 is done.
