# Strudel Flow

A visual drum machine and pattern sequencer built with [Strudel.cc](https://strudel.cc), [React Flow](https://reactflow.dev), and styled using [Tailwind CSS](https://tailwindcss.com/) and [shadcn/ui](https://ui.shadcn.com/). Create complex musical patterns by connecting instrument nodes to effect nodes with a drag-and-drop interface.

> Fork of [xyflow/strudel-flow](https://github.com/xyflow/strudel-flow).

## Getting Started

```bash
pnpm install
pnpm dev
```

## Tech Stack

- **Audio Engine**: [Strudel.cc](https://strudel.cc) — web-based live coding environment
- **Node Graph**: [React Flow](https://reactflow.dev) v12 — drag-and-drop node canvas
- **UI**: [shadcn/ui](https://ui.shadcn.com/) + [Tailwind CSS](https://tailwindcss.com/) v4
- **State**: [Zustand](https://github.com/pmndrs/zustand) v5

## Node Types

### Instruments

- **Pad** — Grid-based step sequencer with scales and modifiers
- **Beat Machine** — Classic drum machine with multiple instrument tracks
- **Arpeggiator** — Pattern-based arpeggiated sequences with visual feedback
- **Chords** — Interactive chord player with scale selection
- **Polyrhythm** — Multiple overlapping rhythmic patterns
- **Custom Code** — Direct Strudel pattern input

### Synths

- **Drums** — Sample-based drum sound selection
- **Synths** — Synthesizer sound selection

### Audio Effects

- **Gain** / **PostGain** — Volume control
- **Distortion** — Saturation and harmonic distortion
- **LPF** — Low-pass filter with cutoff and resonance
- **Pan** — Stereo positioning
- **Phaser** — Sweeping phase modulation
- **Crush** — Bit-crushing
- **Jux** — Stereo channel effects
- **FM** — Frequency modulation synthesis
- **Room** — Reverb with size, fade, and filtering controls
- **ADSR** — Envelope (attack, decay, sustain, release)

### Time Effects

- **Fast** / **Slow** — Speed multiplication and division
- **Late** — Pattern delay and offset
- **Reverse** — Reverse playback
- **Palindrome** — Bidirectional playback
- **Mask** — Probabilistic pattern masking
- **Ply** — Pattern subdivision

## Usage

### Creating Patterns

1. Add an instrument node from the sidebar (click or drag)
2. Click grid buttons to activate steps
3. Adjust tempo with BPM control

### Connecting Nodes

- Drag from a source handle (bottom) to an effect handle (top)
- Chain multiple effects in series
- Connect multiple sources to the same effect chain

### Pattern Modifiers

Each step in Pad/Beat Machine nodes supports modifiers:
- **Fast** (×2, ×3, ×4) — speed multiplication
- **Slow** (/2, /3, /4) — speed division
- **Replicate** (!2, !3, !4) — note repetition
- **Elongate** (@2, @3, @4) — note duration extension

### Keyboard Shortcuts

- **Spacebar** — global play/pause
- **Shift+Click** — multi-select grid cells for grouping (Pad nodes)
- **Right-click** — context menu for pattern modifiers

## Development

See [ARCHITECTURE.md](./ARCHITECTURE.md) for how the system works and [CLAUDE.md](./CLAUDE.md) for development conventions.

```bash
pnpm dev            # start dev server
pnpm build          # typecheck + production build
pnpm lint           # eslint
pnpm test           # vitest watch mode
pnpm test:run       # vitest single run
```

### Project Structure

```
src/
├── components/
│   ├── nodes/          # node components + registry
│   │   ├── instruments/ 
│   │   ├── effects/    
│   │   └── synths/     
│   ├── ui/             # shadcn/ui components
│   ├── workflow/       # ReactFlow canvas + controls
│   └── layouts/        # app shell
├── store/              # Zustand state management
├── hooks/              # custom React hooks
├── lib/                # core logic + utilities
├── data/               # sounds, themes, static config
└── types/              # ambient type declarations
```

## Acknowledgments

- [Strudel.cc](https://strudel.cc)
- [React Flow](https://reactflow.dev)
- [shadcn/ui](https://ui.shadcn.com)
- [tweakcn](https://tweakcn.com)

## License

[AGPL-3.0](./LICENSE)
