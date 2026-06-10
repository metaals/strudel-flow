# 2. Hybrid jam sync (render-locally + audio stream)

- Status: Accepted
- Date: 2026-06-10

## Context

Collaborative live jamming (Phase 8) has two distinct audiences: **active collaborators** who edit
the patch, and **passive listeners** who just want to hear it. Streaming full audio to everyone is
simple but bandwidth-heavy and latency-prone; syncing only state is cheap but requires every client
to render audio locally.

## Decision

Use a **hybrid** model:

- **Collaborators render locally.** Share the project/graph as a CRDT (Yjs) plus a shared
  transport clock (common origin) so each collaborator's engine renders the same pattern in sync.
  Transport derives from `getSchedulerNow()` (`src/lib/strudel-clock.ts`).
- **Passive listeners get an audio stream.** Stream the DJ's master output (the Phase 1 master
  tap, ADR-independent) over a WebRTC `MediaStream` for those who don't render locally.

Transport favors P2P WebRTC (`y-webrtc`) with a minimal free signaling option, consistent with
ADR `0003-stay-static`.

## Consequences

- Low-bandwidth, low-latency for editors; zero-setup listening for everyone else.
- Requires reliable clock sync and latency/count-in calibration (a cross-cutting task).
- Audio streaming may need TURN for restrictive NATs; this is a known trigger toward a possible
  backend (ADR `0003`, Phase 10).
