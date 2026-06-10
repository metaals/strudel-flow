---
id: P1-002
title: AudioContext / master output tap
phase: 1
status: todo
priority: 1
depends_on: []
est: M
---

## Why
Recording (Phase 2) and audio streaming (Phase 8) both need access to the engine's `AudioContext`
and a single master node to tap. Today the Strudel engine owns the audio graph internally with no
exposed handle.

## Acceptance Criteria
- [ ] A `getAudioContext()` accessor returns the live `AudioContext` used by `@strudel/web`.
- [ ] A master gain node sits between Strudel output and the destination and is retrievable
      (e.g. `getMasterNode()`), so downstream taps can connect without altering audible output.
- [ ] Adding a tap (e.g. an `AnalyserNode`) to the master does **not** change playback level.
- [ ] Initialization happens once during engine setup; repeated calls return the same nodes.
- [ ] Types are declared in `src/types/strudel-web.d.ts` if new `@strudel/web` APIs are used.

## Implementation Notes
- Engine init lives in `src/lib/strudel-engine.ts` and `src/main.tsx`.
- Reuse the transport hook `getSchedulerNow()` (`src/lib/strudel-clock.ts`) for bar/cycle timing
  in later phases — don't duplicate clock logic here.
- `@strudel/web` exposes the WebAudio context; surface it rather than creating a second context.

## Verify
- `pnpm verify`
- Manual: start playback, attach an `AnalyserNode` to the master tap, confirm non-zero levels and
  unchanged perceived volume.

## Files
- `src/lib/strudel-engine.ts`
- `src/main.tsx`
- `src/types/strudel-web.d.ts` (if needed)
