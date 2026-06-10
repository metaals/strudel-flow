---
id: P2-001
title: Record master output to WAV
phase: 2
status: todo
priority: 1
depends_on: [P1-002]
est: M
---

## Why
Users want to export audio. The first export path is realtime capture of the master output to a
downloadable WAV file. This is the foundation for MP3 export and "save as sample".

## Acceptance Criteria
- [ ] A record control captures the master tap via `MediaStreamAudioDestinationNode` +
      `MediaRecorder` (or PCM capture) while playback runs.
- [ ] Captured audio is PCM-encoded to a valid WAV and downloaded.
- [ ] Recording start/stop is bounded by a user action (and later, N cycles via the transport).
- [ ] Exported WAV plays back correctly in a standard player.

## Implementation Notes
- Tap the master node from P1-002 (`getMasterNode()` / `getAudioContext()`).
- Use the transport counter `getSchedulerNow()` (`src/lib/strudel-clock.ts`) for cycle-bounded
  capture later.
- See ADR `docs/decisions/0003-stay-static.md`: realtime capture is the supported path (no offline
  bounce).

## Verify
- `pnpm verify`
- Manual: record 4 cycles → download WAV → confirm playback matches what was heard.

## Files
- `src/lib/audio-export.ts` (new)
- export UI component (new)

> **Stub** — expand acceptance criteria when P1-002 is done.
