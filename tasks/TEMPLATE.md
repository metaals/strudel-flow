---
id: PX-000
title: Short imperative title
phase: 0
status: todo            # todo | doing | done | blocked
priority: 1             # lower runs first within the eligible set
depends_on: []          # task IDs that must be `done` first
est: M                  # S | M | L
---

## Why
One-paragraph problem statement and the user-facing outcome.

## Acceptance Criteria
- [ ] Testable, unambiguous condition for "done".
- [ ] Another condition.

## Implementation Notes
Concrete pointers to real files/functions to reuse (e.g. `getSchedulerNow` in
`src/lib/strudel-clock.ts`, the `app-store` actions in `src/store/app-store.ts`).

## Verify
- `pnpm verify`
- Manual: <step-by-step check the human/agent can perform>

## Files
- `path/to/file.ts` — what changes
