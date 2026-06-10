# Strudel Flow — Roadmap

> Vision, principles, and dependency-ordered phases for turning Strudel Flow from a
> static single-graph pattern sequencer into a full **DAW + Pattern Sequencer + Sound
> Designer** — staying on static hosting (GitHub Pages) as long as possible.

This file is the human-readable map. The machine-actionable backlog lives in [`tasks/`](./tasks/),
and an autonomous agent drives implementation via [`tasks/LOOP.md`](./tasks/LOOP.md).

---

## Where we are today

Strudel Flow is a React 19 + Vite SPA that compiles a [React Flow](https://reactflow.dev)
node graph into [Strudel](https://strudel.cc) mini-notation and plays it via `@strudel/web`
(WebAudio). State is a single graph persisted to `localStorage` (`saved-nodes-store`) and
shareable via an `lz-string`-compressed `?state=` URL (`src/lib/project-state.ts`). Deployed
to GitHub Pages. See [ARCHITECTURE.md](./ARCHITECTURE.md) and [CLAUDE.md](./CLAUDE.md).

## Where we are going

A creative tool that is simultaneously a DAW, a pattern sequencer, and a sound designer:
audio export (MP3/WAV), **projects** (sample import / "save as sample"), **composite nodes**
(subgraphs exposing inner I/O), **arrangement / song mode** with control signals, **MIDI &
visual hooks**, a **shareable module registry**, **collaborative live-jam + viewer**, and
eventually **AI helpers via an MCP-like interface**.

## Guiding principles

1. **Stay static as long as possible.** Prefer IndexedDB + file export + P2P (WebRTC) over a
   backend. A real backend is the *last* phase, added only when static limits are hit. (ADR
   [`0003`](./docs/decisions/0003-stay-static.md))
2. **API-first.** Build a clean programmatic graph/command API now so collaboration and AI can
   reuse it later. (ADR [`0004`](./docs/decisions/0004-ai-api-first.md))
3. **Foundations before features.** A mutation API, an AudioContext tap, and IndexedDB
   persistence unlock nearly everything else, so they come first.
4. **One green gate.** Every change must pass `pnpm verify`
   (`tsc --noEmit && pnpm lint && pnpm test:run && pnpm build`). Never weaken the gate to pass.
5. **Atomic, reviewable progress.** One task = one commit. No scope creep. Respect repo
   conventions in [CLAUDE.md](./CLAUDE.md) / [ARCHITECTURE.md](./ARCHITECTURE.md).

## Status legend

| Symbol | Meaning |
| ------ | ------- |
| `todo` | Eligible to be picked up (once `depends_on` are all `done`) |
| `doing` | In progress (claimed by the loop) |
| `done` | Acceptance criteria met and verified |
| `blocked` | Cannot proceed; see the note in the task file |

The authoritative status for each task is the `status:` field in its `tasks/<ID>.md`
frontmatter. [`tasks/STATUS.md`](./tasks/STATUS.md) mirrors it as an at-a-glance board.

---

## Phases (dependency-ordered)

Each phase expands into atomic task files (`tasks/P<phase>-<seq>.md`). Existing code to reuse
is named inline so tasks can be acted on without rediscovery.

### Phase 0 — Tracking & loop harness *(this change)*
Create ROADMAP, the `tasks/` schema, `LOOP.md`, `STATUS.md`, the ADRs, and the `pnpm verify`
gate. **Acceptance:** an agent can read `tasks/LOOP.md`, deterministically pick `P1-001`, and
`pnpm verify` runs clean on `main`.

### Phase 1 — Foundations (unlocks everything)
- **Programmatic graph/command API** — centralize all graph mutations (currently spread across
  `app-store.ts` actions `addNode`/`removeNode`/`updateNodeData`/`onConnect`) behind one
  well-typed module (`addNode`/`connect`/`setParam`/`getGraph`/…). Substrate for AI/MCP
  (Phase 9) and collab (Phase 8).
- **AudioContext / master tap** — expose `getAudioContext()` and a master gain node from the
  Strudel engine (`src/lib/strudel-engine.ts`, `src/main.tsx`) so recording (Phase 2) and
  audio streaming (Phase 8) can tap output. Reuse the transport hook `getSchedulerNow()`
  (`src/lib/strudel-clock.ts`).
- **Persistence upgrade** — introduce IndexedDB (e.g. `idb-keyval`) alongside the existing
  `persist` stores to hold large binary (samples, recordings) that `localStorage` can't. Keep
  the `project-state.ts` migrate-chain pattern (`PROJECT_STATE_VERSION`).
- **Testing/CI baseline** — make `pnpm verify` the single source of truth; expand `vitest`
  coverage of the compiler (`src/lib/strudel.ts`).

### Phase 2 — Audio export (MP3 / WAV)
Route master through a `MediaStreamAudioDestinationNode` + `MediaRecorder`. **WAV** via PCM
encode; **MP3** via `lamejs` in a Web Worker. "Bounce region" records N cycles/bars using the
transport counter; export dialog with format + length. (Realtime capture is the supported path;
offline/faster-than-realtime bounce is constrained by Strudel's real-time scheduler — see ADR
[`0003`](./docs/decisions/0003-stay-static.md).)

### Phase 3 — Projects & samples
- **Projects**: multi-project model + switcher + metadata, persisted to IndexedDB; generalize
  the single-graph URL/file state (`project-state.ts`, `save-project-dialog.tsx`).
- **Import samples**: user audio files → IndexedDB blobs → register with Strudel `samples()`; a
  sampler instrument node + a "Samples" sidebar group (mirror `saved-nodes-store` patterns).
- **Save as sample**: capture an output region (Phase 2) and store it as a reusable sample.

### Phase 4 — Composite nodes (subgraphs with exposed I/O)
A composite/group node wrapping an inner graph, with typed input/output ports;
collapse/expand using React Flow subflows. Extend the compiler (`generateOutput`,
`findConnectedComponents` in `src/lib/strudel.ts` / `graph-utils.ts`) to resolve **nested**
graphs and map exposed ports to inner sources/effects. Save/load composites via the saved-node
library (`saved-nodes-store.ts`) with inline-copy templates so shares keep working.

### Phase 5 — Arrangement & control signals (song mode)
A timeline / scene sequencer: arrange composites/sections over bars (e.g. "after 4× 8-beat
staffs switch composite 1 → composite 2"); automation lanes; transport bar counter from
`getSchedulerNow()`. Control-signal routing between nodes (modulation) leveraging Strudel
`arrange()`/scene swapping or mute/gain automation.

### Phase 6 — MIDI & visual hooks
- **Web MIDI**: MIDI clock + note out to hardware; MIDI in → control nodes; CC→param mapping
  with MIDI-learn.
- **Visual hooks**: scopes/analyzers, value monitors, pattern visualizers (reuse
  `pattern-panel.tsx` / `pattern-popup.tsx` patterns).

### Phase 7 — Module import/export & registry
Versioned **package format** (manifest + deps) for composites/nodes; import/export as files. A
**static-first registry**: a GitHub-hosted JSON index of publishable modules; browse/install
UI. (Stays static; backend write deferred to Phase 10.)

### Phase 8 — Collaboration: live jam + viewer (hybrid)
**CRDT** (Yjs) over the project/graph; **P2P WebRTC** (`y-webrtc`) with a minimal free
signaling option; presence/cursors. **Transport clock sync** (shared origin) so collaborators
**render locally** in sync. A read-only **viewer page** subscribes to the DJ's doc + clock.
**Audio-stream listeners** receive the DJ master (Phase 1 tap) via WebRTC `MediaStream`. ADR
[`0002`](./docs/decisions/0002-jam-sync-hybrid.md) documents the hybrid choice and latency/TURN
tradeoffs.

### Phase 9 — AI helpers / MCP-like interface
Formalize the Phase 1 command API into an **MCP-style tool schema** (addNode, connect, setParam,
writeStrudel, suggest-wiring…); in-app assistant panel; **bring-your-own-key** first (no
backend). Backend AI proxy deferred to Phase 10. (ADR
[`0004`](./docs/decisions/0004-ai-api-first.md))

### Phase 10 — Backend (only when forced)
Introduce a minimal backend **only** when static limits are hit: shared/cloud persistence,
robust signaling + TURN, registry writes, server-side AI keys. Keep optional; document the exact
triggers in an ADR. (Choice among Cloudflare / Supabase / PartyKit left open until then.)

---

## Cross-cutting ideas (folded into tasks across phases)

Undo/redo & project version history; mobile/perf passes (AudioWorklet, large-graph rendering);
accessibility & keyboard-driven workflow; count-in/metronome & latency calibration (needed for
collab); template/preset browser; module **licensing** metadata (repo is AGPL-3.0); onboarding
tutorial; error reporting (reuse `error-store.ts`, `error-boundary.tsx`); telemetry opt-in.

## Critical files (referenced by the roadmap)

- `src/store/app-store.ts` — graph mutation actions → basis for the Phase 1 command API.
- `src/lib/strudel-engine.ts`, `src/main.tsx`, `src/lib/strudel-clock.ts` — audio engine/clock
  → master tap + transport for Phases 2/5/8.
- `src/lib/strudel.ts` (`generateOutput`), `src/lib/graph-utils.ts` (`findConnectedComponents`)
  — compiler → nested composites in Phase 4.
- `src/lib/project-state.ts`, `src/store/saved-nodes-store.ts` — persistence/migrate + saved
  library → Projects/samples/composites/registry (Phases 3/4/7).
