# Architecture

## System Overview

```
┌─ main.tsx ─────────────────────────────────────────────────┐
│  initStrudel() → captures scheduler.now() for clock sync   │
│  samples('github:tidalcycles/dirt-samples')                │
│                                                            │
│  <ErrorBoundary>                                           │
│    <ReactFlowProvider>                                     │
│      <SidebarLayout>         ← sidebar with draggable      │
│        <Workflow />            node palette                 │
│      </SidebarLayout>                                      │
│    </ReactFlowProvider>                                    │
│  </ErrorBoundary>                                          │
│  <Toaster />                 ← toast notifications          │
└────────────────────────────────────────────────────────────┘
```

The `Workflow` component renders a `<ReactFlow>` canvas with custom node types and edge types. Users drag nodes from the sidebar, connect them with edges, and configure parameters. The app compiles the node graph into Strudel mini-notation code and evaluates it for real-time audio playback.

## Pattern Compilation Pipeline

This is the core of the app — how visual nodes become sound.

```
1. Node UI interaction
   └→ updateNodeData(id, {...})           [Zustand app-store]

2. Store change triggers recomputation
   └→ useWorkflowRunner                   [src/hooks/use-workflow-runner.tsx]
      └→ useMemo(generateOutput(nodes, edges, cpm, bpc))

3. generateOutput() walks the graph        [src/lib/strudel.ts]
   ├→ For each node: call strudelOutput(node, '') to get individual pattern
   ├→ findConnectedComponents() via DFS    [src/lib/graph-utils.ts]
   ├→ For each connected component:
   │   ├→ Separate sources (Instruments) from effects (everything else)
   │   ├→ Stack active source patterns: stack(pattern1, pattern2)
   │   └→ Chain effects sequentially: pattern.gain(0.8).lpf(1000)
   ├→ optimizeSoundCalls() merges consecutive .sound() calls
   └→ Prepend setcpm(BPM/beatsPerCycle) for tempo control

4. Debounced evaluation (50ms, immediate for tempo/scale)
   └→ evaluate(pattern)                   [@strudel/web]
      └→ WebAudio playback
```

### The `strudelOutput` Contract

Every node component has a static method:

```typescript
MyNode.strudelOutput = (node: AppNode, strudelString: string) => string
```

- **Instrument nodes**: ignore `strudelString`, return a new pattern (e.g., `n("0 1 2").scale("C4:major")`)
- **Effect/Synth nodes**: append to `strudelString` (e.g., `${strudelString}.gain(0.8)`)
- The function is accessed at runtime via `nodeTypes[type].strudelOutput`

### Connected Component Grouping

`findConnectedComponents()` in `src/lib/graph-utils.ts` uses DFS to find groups of connected nodes. Each connected component becomes one `$:` line in the output. Play/pause operates on entire components — clicking pause on any node pauses the whole chain.

## State Architecture

### app-store (src/store/app-store.ts)

Primary store for the graph and UI:
- `nodes: AppNode[]` — React Flow node state
- `edges: Edge[]` — React Flow edge state
- `colorMode: ColorMode` — light/dark mode
- `theme: string` — active CSS theme name

Key actions: `onNodesChange`, `onEdgesChange`, `onConnect`, `addNode`, `removeNode`, `updateNodeData`, `setTheme`, `toggleDarkMode`.

Uses `subscribeWithSelector` middleware for fine-grained subscriptions. A top-level subscription syncs the `dark` CSS class on `<html>` when `colorMode` changes.

### strudel-store (src/store/strudel-store.ts)

Audio engine state:
- `pattern: string` — the compiled Strudel code
- `cpm: string` — cycles per minute (default "120")
- `bpc: string` — beats per cycle (default "4")

## Node System

### Categories

| Category | Role | Example Output |
|----------|------|----------------|
| Instruments | Produce base patterns | `n("0 1 2").scale("C4:major")` |
| Synths | Attach sound sources | `.sound("arpy")` |
| Audio Effects | Transform sound | `.gain(0.8).lpf(1000)` |
| Time Effects | Transform rhythm/timing | `.fast(2).rev()` |

### Node Registration

Nodes are registered in `src/components/nodes/registry.ts`. Each node file exports a definition object containing the component, type string, and config metadata. The registry builds `nodesConfig` (for sidebar grouping, factory defaults) and `nodeTypes` (for React Flow) from a single array.

Types (`AppNode`, `WorkflowNodeData`, etc.) remain in `src/components/nodes/index.tsx`.

### Shared Node Infrastructure

- **`WorkflowNode`** (`workflow-node.tsx`) — universal wrapper providing handles, header (icon, title, play/pause, delete), error boundary for children, pattern preview popup
- **`BaseNode`** (`base-node.tsx`) — styled container with rounded borders, selection ring
- **`BaseHandle`** (`base-handle.tsx`) — styled React Flow connection handle
- **`NodeHeader`** (`node-header.tsx`) — composable header with title, icon, action buttons

### Custom Code Node

`custom-instrument-node` (`src/components/nodes/instruments/custom-instrument-node.tsx`, titled **"Custom Code"**) lets users author a reusable node that declares its own inputs. The authoring syntax is a header of `@param` declarations, a `---` separator, then a body that references params with `$NAME`:

```
@param GAIN: dial(0..1) = 0.5
@param INST: dropdown(bd, sd, hh) = bd
@param REPEAT: stepper(1..8) = 2
---
sound("$INST*$REPEAT").gain($GAIN)
```

`src/lib/custom-instrument.ts` parses the header into a param schema (`dial`/`slider`, `stepper`, `dropdown`, `toggle`, `text`), renders one control per param (re-derived live via `useMemo` on `data.code`), and textually substitutes values into the body (so arithmetic like `.gain(0.1 * $GAIN)` is evaluated by Strudel, not us). A body starting with `.` appends to the incoming chain (effect), otherwise it is a base pattern source. `isSoundSource()` in `src/lib/strudel.ts` buckets the node by `data.role` when set (`'instrument'` ⇒ source, `'effect'` ⇒ effect) and otherwise falls back to body auto-detection via `isCustomInstrumentEffect()`.

The legacy raw-textarea `custom-node` has been retired; older projects are migrated to `custom-instrument-node` (see Persistence).

## Theming

12 themes defined as CSS files in `src/data/css/`, each overriding CSS custom properties using `oklch()` color space for both `:root` (light) and `.dark` (dark) modes.

Themes are imported as raw CSS strings via Vite's `?inline` suffix in `src/data/css/themes.ts`. The `useThemeCss` hook dynamically injects the selected theme into a `<style id="theme-css">` element in `<head>`.

Available: supabase (default), sunset-horizon, bold-tech, catppuccin, claymorphism, cosmic-night, doom-64, mono, neo-brutalism, pastel-dreams, quantum-rose, soft-pop.

## Persistence

### Saved Node Library
`src/store/saved-nodes-store.ts` is a `persist`-backed Zustand store (localStorage key `sf_custom_instruments`, `version: 1`) holding user-saved custom nodes. Each `SavedNode` carries a `kind` of `'instrument'` or `'effect'`, defaulted from the body via `isCustomInstrumentEffect()` and overridable in the **"Save as Node"** dialog. The sidebar renders two groups — **"My Instruments"** and **"My Effects"** — of draggable entries that stamp a `custom-instrument-node` pre-filled with the saved `code` and a matching `data.role`. The full template is also copied inline into each node's `data`, so shared URLs and downloaded files keep working for viewers who never saved that node. The store's `migrate` upgrades the old `{ instruments: [...] }` shape and backfills missing `kind`.

### URL Sharing
`src/lib/project-state.ts` serializes `ProjectState` (nodes, edges, theme, colorMode, cpm, bpc) to JSON, compresses via `lz-string.compressToBase64()`, and places it in the `?state=` URL parameter. `useUrlStateLoader` hook restores state on page load. A versioned `migrate` chain (`PROJECT_STATE_VERSION = 4`) upgrades older payloads; `migrateV3toV4` rewrites any legacy `custom-node` into a `custom-instrument-node`, mapping its `customPattern` to `code`.

### File Save/Load
`downloadState()` creates a JSON blob and triggers a browser download. The sidebar's load button reads `.json` files via `FileReader`.

## Key Hooks

| Hook | Purpose |
|------|---------|
| `useWorkflowRunner` | Reactive pattern compilation + evaluation with debouncing |
| `useGlobalPlayback` | Global play/pause (spacebar), per-node state management |
| `useDragAndDrop` | Drag nodes from sidebar to canvas via HTML5 DnD |
| `useUrlStateLoader` | Restore state from URL on mount |
| `useThemeCss` | Dynamic theme CSS injection |
| `useIsMobile` | Mobile detection (768px breakpoint) |

## External Dependencies

| Package | Purpose |
|---------|---------|
| `@xyflow/react` v12 | Node-graph canvas |
| `@strudel/web` v1.2 | Live-coding audio engine (no TS types — ambient declarations in `src/types/`) |
| `zustand` v5 | State management |
| `@dagrejs/dagre` | Graph layout algorithm |
| `lz-string` | URL state compression |
| `nanoid` | Unique ID generation |
| `lucide-react` | Icons |
| Radix UI | Accessible UI primitives |
| `sonner` | Toast notifications |
| `tailwindcss` v4 | Utility-first CSS |
