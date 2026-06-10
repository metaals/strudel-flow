# Status board

At-a-glance mirror of each task's `status` frontmatter. Keep this in sync whenever a task's
status changes. The task file frontmatter is authoritative if they ever disagree.

Legend: `todo` · `doing` · `done` · `blocked`

## Phase 0 — Tracking & loop harness
| ID | Title | Status | Priority | Depends on |
| -- | ----- | ------ | -------- | ---------- |
| [P0-001](./P0-001-bootstrap-tracking-and-loop.md) | Bootstrap roadmap, tasks, loop & verify gate | done | 1 | — |

## Phase 1 — Foundations
| ID | Title | Status | Priority | Depends on |
| -- | ----- | ------ | -------- | ---------- |
| [P1-001](./P1-001-graph-command-api.md) | Programmatic graph/command API | todo | 1 | — |
| [P1-002](./P1-002-audiocontext-master-tap.md) | AudioContext / master output tap | todo | 1 | — |
| [P1-003](./P1-003-indexeddb-persistence.md) | IndexedDB persistence layer | todo | 2 | — |
| [P1-004](./P1-004-compiler-test-coverage.md) | Expand compiler test coverage | todo | 3 | — |

## Phase 2 — Audio export
| ID | Title | Status | Priority | Depends on |
| -- | ----- | ------ | -------- | ---------- |
| [P2-001](./P2-001-record-master-to-wav.md) | Record master output to WAV | todo | 1 | P1-002 |

## Phase 3 — Projects & samples
| ID | Title | Status | Priority | Depends on |
| -- | ----- | ------ | -------- | ---------- |
| [P3-001](./P3-001-multi-project-model.md) | Multi-project model + switcher | todo | 1 | P1-003 |

## Phase 4 — Composite nodes
| ID | Title | Status | Priority | Depends on |
| -- | ----- | ------ | -------- | ---------- |
| [P4-001](./P4-001-composite-node.md) | Composite node with typed I/O ports | todo | 1 | P1-001 |

## Phase 5 — Arrangement & control signals
| ID | Title | Status | Priority | Depends on |
| -- | ----- | ------ | -------- | ---------- |
| [P5-001](./P5-001-scene-timeline.md) | Scene timeline (song mode) | todo | 1 | P4-001 |

## Phase 6 — MIDI & visual hooks
| ID | Title | Status | Priority | Depends on |
| -- | ----- | ------ | -------- | ---------- |
| [P6-001](./P6-001-web-midi-clock-out.md) | Web MIDI clock + note out | todo | 1 | P1-002 |

## Phase 7 — Module import/export & registry
| ID | Title | Status | Priority | Depends on |
| -- | ----- | ------ | -------- | ---------- |
| [P7-001](./P7-001-module-package-format.md) | Versioned module package format | todo | 1 | P4-001 |

## Phase 8 — Collaboration
| ID | Title | Status | Priority | Depends on |
| -- | ----- | ------ | -------- | ---------- |
| [P8-001](./P8-001-crdt-graph-sync.md) | CRDT graph sync over WebRTC | todo | 1 | P1-001, P1-002 |

## Phase 9 — AI helpers / MCP
| ID | Title | Status | Priority | Depends on |
| -- | ----- | ------ | -------- | ---------- |
| [P9-001](./P9-001-mcp-tool-schema.md) | MCP-style tool schema over command API | todo | 1 | P1-001 |

## Phase 10 — Backend
| ID | Title | Status | Priority | Depends on |
| -- | ----- | ------ | -------- | ---------- |
| [P10-001](./P10-001-backend-trigger-adr.md) | Backend trigger evaluation + ADR | todo | 1 | P8-001 |

---

## Next eligible task

Lowest `priority`, then lowest ID, among `todo` tasks whose `depends_on` are all `done`:
**→ [P1-001](./P1-001-graph-command-api.md)**

## Progress log

- 2026-06-10 — P0-001 — Bootstrap roadmap, tasks, loop & verify gate.
