# 3. Stay static as long as possible

- Status: Accepted
- Date: 2026-06-10

## Context

Strudel Flow is deployed to GitHub Pages with no backend. A backend adds cost, ops burden, auth,
and privacy surface. Many "DAW" features (persistence of large binary, sharing, even collaboration)
can be delivered with browser-native capabilities.

## Decision

Prefer static, client-side solutions and defer a backend to the last possible phase (Phase 10):

- **Persistence:** IndexedDB for large/binary data (samples, recordings) alongside the existing
  `localStorage` `persist` stores; file export/import for portability.
- **Collaboration:** P2P WebRTC (`y-webrtc`) with a minimal free signaling option (ADR `0002`).
- **Registry:** a GitHub-hosted JSON index (read path); writes deferred.
- **AI:** bring-your-own-key, client-side (ADR `0004`).

A backend is introduced **only** when a concrete trigger is hit (tracked in Phase 10 / task
`P10-001`): unreliable signaling/TURN, shared cloud persistence, registry writes, or server-side
AI keys. The specific platform (Cloudflare / Supabase / PartyKit) is left open until then.

## Consequences

- Zero hosting cost and minimal ops for the foreseeable future.
- Constraints to accept: no offline/faster-than-realtime audio bounce (Strudel's scheduler is
  real-time, so audio export uses realtime capture); P2P NAT traversal may need TURN; no shared
  server-side state.
- The migration path is explicit and deferred, not accidental.
