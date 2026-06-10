---
id: P8-001
title: CRDT graph sync over WebRTC
phase: 8
status: todo
priority: 1
depends_on: [P1-001, P1-002]
est: L
---

## Why
Live jamming requires a shared, conflict-free graph and a shared clock so collaborators render
locally in sync. A CRDT (Yjs) over P2P WebRTC keeps this static (no backend), with passive
listeners receiving an audio stream from the DJ's master tap.

## Acceptance Criteria
- [ ] The project/graph is modeled as a Yjs document; edits via the command API (P1-001) sync to
      peers.
- [ ] P2P transport via `y-webrtc` with a minimal free signaling option; presence/cursors shown.
- [ ] Transport clock sync (shared origin) so collaborators render locally in sync.
- [ ] A read-only viewer page subscribes to the doc + clock.
- [ ] Passive listeners can receive the DJ master (P1-002 tap) via a WebRTC `MediaStream`.

## Implementation Notes
- Route all synced mutations through the command API (P1-001) so local + remote share one path.
- Stream the master node from P1-002 for audio listeners.
- See ADR `docs/decisions/0002-jam-sync-hybrid.md` for the hybrid render-locally + audio-stream
  decision and latency/TURN tradeoffs.

## Verify
- `pnpm verify`
- Manual: two browsers join a room; edits sync; clocks stay aligned; viewer + audio listener work.

## Files
- `src/lib/collab.ts` (new)
- presence/viewer UI (new)

> **Stub** — expand when P1-001 and P1-002 are done.
