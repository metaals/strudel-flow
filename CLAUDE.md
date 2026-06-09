# CLAUDE.md

## Project

Strudel Flow — a visual drum machine and pattern sequencer. Fork of [xyflow/strudel-flow](https://github.com/xyflow/strudel-flow) for personal use.

## Tech Stack

React 19, React Flow v12 (`@xyflow/react`), Strudel.cc (`@strudel/web`), Zustand v5, Tailwind CSS v4, shadcn/ui (new-york style), Vite 5, TypeScript, pnpm 9.

## Commands

```bash
pnpm install        # install dependencies
pnpm dev            # start dev server
pnpm build          # typecheck + production build
pnpm lint           # eslint with zero warnings
pnpm test           # vitest watch mode
pnpm test:run       # vitest single run
```

## Architecture Overview

See [ARCHITECTURE.md](./ARCHITECTURE.md) for full details.

**Data flow**: Node UI interaction → `updateNodeData()` → Zustand `app-store` → `useWorkflowRunner` recomputes via `useMemo` → `generateOutput()` DFS-walks connected components → each node's static `strudelOutput()` builds Strudel code → `evaluate()` via `@strudel/web` → WebAudio playback.

**Two Zustand stores** (never mix concerns between them):
- `app-store.ts` — nodes, edges, colorMode, theme (graph/UI state)
- `strudel-store.ts` — pattern string, cpm, bpc (audio engine state)

## Key Conventions

- All node components wrap children in `<WorkflowNode>` which provides handles, header, play/pause/delete
- Use `updateNodeData(id, { key: value })` to persist node state changes
- Use `cn()` from `@/lib/utils` for conditional Tailwind classes
- Use Zustand selector pattern: `useAppStore((s) => s.specificSlice)` — never subscribe to the whole store
- shadcn/ui components live in `src/components/ui/`. Add new ones via `npx shadcn@latest add <component>`
- `@strudel/web` types are declared in `src/types/strudel-web.d.ts` — update if new APIs are used
- Use `logger` from `@/lib/logger` instead of bare `console.*` calls

## Adding a New Node

1. Create `src/components/nodes/{category}/{name}-node.tsx`
2. Import types from `../types` (NOT from `..` — avoids circular dependency)
3. Implement the component receiving `WorkflowNodeProps`, wrap in `<WorkflowNode>`
4. Attach a static `strudelOutput(node: AppNode, strudelString: string) => string` method
5. Export a definition object:
   ```typescript
   export const myNodeDef = {
     type: 'my-node' as const,
     component: MyNode,
     config: { title: 'My Node', category: 'Audio Effects', icon: 'Volume2' },
   };
   ```
6. Import and add to the `allNodeDefs` array in `src/components/nodes/registry.ts`
7. Add `| Node<WorkflowNodeData, 'my-node'>` to the `AppNode` union in `src/components/nodes/types.ts`
8. If the node needs new data fields, add them to `WorkflowNodeData` in `types.ts`

## Important: Circular Dependency Rules

Node files must import types from `./types` or `../types`, never from `..` (index.tsx) or `./registry`. The import chain node files → `workflow-node.tsx` → `useWorkflowRunner` → `strudel.ts` → `index.tsx` → `registry.ts` → node files creates a cycle. The `types.ts` file is the safe import target for node components.

## Node Categories

- **Instruments** — sound sources that produce base patterns (Pad, Beat Machine, Arpeggiator, Chord, Polyrhythm, Custom)
- **Synths** — attach `.sound()` to the chain (Drum Sounds, Synth Select)
- **Audio Effects** — transform sound (Gain, LPF, Distortion, Pan, Room, Phaser, Jux, Crush, PostGain, FM, ADSR)
- **Time Effects** — transform timing/rhythm (Fast, Slow, Reverse, Palindrome, Mask, Ply, Late)

## File Organization

```
src/
  main.tsx                       # entry point, Strudel init
  components/
    nodes/
      types.ts                   # shared types (WorkflowNodeData, AppNode, etc.)
      index.tsx                  # re-exports types + registry, createNodeByType
      registry.ts                # node definitions array, derived maps
      workflow-node.tsx           # universal node wrapper
      instruments/               # instrument node components
      synths/                    # synth node components
      effects/                   # effect node components
    ui/                          # shadcn/ui primitives
    workflow/                    # ReactFlow canvas + controls
    layouts/                     # app shell (sidebar)
    error-boundary.tsx           # React error boundary
  store/                         # Zustand stores
  hooks/                         # custom React hooks
  lib/                           # utilities (strudel.ts, graph-utils.ts, logger.ts)
  data/                          # static data, sounds, themes
  types/                         # ambient type declarations
```
