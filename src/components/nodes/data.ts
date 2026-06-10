import type { iconMapping } from '@/data/icon-mapping';
import type { CellState } from './instruments/pad-utils';

export type NodeState = 'running' | 'paused' | 'stopped';

export interface BaseNodeData extends Record<string, unknown> {
  title?: string;
  label?: string;
  icon?: keyof typeof iconMapping;
  sound?: string;
  state?: NodeState;
}

// Instruments
export interface PadNodeData extends BaseNodeData {
  steps?: number;
  mode?: 'arp' | 'chord';
  octave?: number;
  octaveRange?: number;
  selectedKey?: string;
  selectedScaleType?: string;
  grid?: boolean[][];
  buttonModifiers?: Record<string, CellState>;
  columnModifiers?: Record<number, CellState>;
  selectedButtons?: string[];
  noteGroups?: Record<number, number[][]>;
}

export interface ArpeggiatorNodeData extends BaseNodeData {
  selectedKey?: string;
  selectedScaleType?: string;
  octave?: number;
  octaveRange?: number;
  selectedPattern?: string;
  selectedChordType?: string;
}

export interface ChordNodeData extends BaseNodeData {
  selectedKey?: string;
  selectedScaleType?: string;
  octave?: number;
  scaleType?: 'major' | 'minor';
  chordComplexity?: 'triad' | 'seventh' | 'ninth' | 'eleventh';
  pressedKeys?: number[];
}

export interface PolyrhythmNodeData extends BaseNodeData {
  polyPattern1?: string;
  polyPattern2?: string;
  polyPattern3?: string;
  polySound1?: string;
  polySound2?: string;
  polySound3?: string;
  pattern1Active?: boolean;
  pattern2Active?: boolean;
  pattern3Active?: boolean;
}

export interface BeatMachineNodeData extends BaseNodeData {
  rows?: Array<{ instrument: string; pattern: boolean[] }>;
  modifiersEnabled?: boolean;
}

export interface CustomInstrumentNodeData extends BaseNodeData {
  code?: string;
  templateId?: string;
  role?: 'instrument' | 'effect';
  paramValues?: Record<string, number | string | boolean>;
}

// Synths
export interface DrumSoundsNodeData extends BaseNodeData {}
export interface SynthSelectNodeData extends BaseNodeData {}

// Effects - single param slider
export interface GainNodeData extends BaseNodeData { gain?: string }
export interface LpfNodeData extends BaseNodeData { lpf?: string }
export interface DistortNodeData extends BaseNodeData { distort?: string }
export interface PanNodeData extends BaseNodeData { pan?: string }
export interface FastNodeData extends BaseNodeData { fast?: string }
export interface SlowNodeData extends BaseNodeData { slow?: string }
export interface CrushNodeData extends BaseNodeData { crush?: string }
export interface PostGainNodeData extends BaseNodeData { postgain?: string }
export interface FmNodeData extends BaseNodeData { fm?: string }
export interface JuxNodeData extends BaseNodeData { jux?: string }
export interface RevNodeData extends BaseNodeData {}
export interface PalindromeNodeData extends BaseNodeData {}

// Multi param effects
export interface PhaserNodeData extends BaseNodeData { phaser?: string; phaserdepth?: string }
export interface RoomNodeData extends BaseNodeData { room?: string; roomsize?: string; roomfade?: string; roomlp?: string; roomdim?: string }
export interface AdsrNodeData extends BaseNodeData { attack?: string; decay?: string; sustain?: string; release?: string }
export interface MaskNodeData extends BaseNodeData { maskPattern?: string; maskProbability?: string; maskPatternId?: string; maskProbabilityId?: string }
export interface PlyNodeData extends BaseNodeData { plyMultiplier?: string; plyProbability?: string; plyMultiplierId?: string; plyProbabilityId?: string }
export interface LateNodeData extends BaseNodeData { lateOffset?: string; latePattern?: string; lateOffsetId?: string; latePatternId?: string }

export interface WorkflowNodeData extends BaseNodeData {
  attack?: string;
  decay?: string;
  sustain?: string;
  release?: string;
  steps?: number;
  mode?: 'arp' | 'chord';
  octave?: number;
  octaveRange?: number;
  selectedKey?: string;
  selectedScaleType?: string;
  grid?: boolean[][];
  buttonModifiers?: Record<string, CellState>;
  columnModifiers?: Record<number, CellState>;
  selectedButtons?: string[];
  noteGroups?: Record<number, number[][]>;
  polyPattern1?: string;
  polyPattern2?: string;
  polyPattern3?: string;
  polySound1?: string;
  polySound2?: string;
  polySound3?: string;
  pattern1Active?: boolean;
  pattern2Active?: boolean;
  pattern3Active?: boolean;
  code?: string;
  templateId?: string;
  role?: 'instrument' | 'effect';
  paramValues?: Record<string, number | string | boolean>;
  scaleType?: 'major' | 'minor';
  chordComplexity?: 'triad' | 'seventh' | 'ninth' | 'eleventh';
  pressedKeys?: number[];
  rows?: Array<{ instrument: string; pattern: boolean[] }>;
  modifiersEnabled?: boolean;
  selectedPattern?: string;
  selectedChordType?: string;
  gain?: string;
  pan?: string;
  fast?: string;
  slow?: string;
  crush?: string;
  postgain?: string;
  fm?: string;
  distort?: string;
  lpf?: string;
  jux?: string;
  phaser?: string;
  phaserdepth?: string;
  room?: string;
  roomsize?: string;
  roomfade?: string;
  roomlp?: string;
  roomdim?: string;
  maskPattern?: string;
  maskProbability?: string;
  maskPatternId?: string;
  maskProbabilityId?: string;
  plyMultiplier?: string;
  plyProbability?: string;
  plyMultiplierId?: string;
  plyProbabilityId?: string;
  lateOffset?: string;
  latePattern?: string;
  lateOffsetId?: string;
  latePatternId?: string;
}

export type AppNodeType =
  | 'pad-node'
  | 'arpeggiator-node'
  | 'chord-node'
  | 'polyrhythm-node'
  | 'beat-machine-node'
  | 'custom-instrument-node'
  | 'drum-sounds-node'
  | 'synth-select-node'
  | 'gain-node'
  | 'lpf-node'
  | 'distort-node'
  | 'pan-node'
  | 'fast-node'
  | 'slow-node'
  | 'crush-node'
  | 'postgain-node'
  | 'fm-node'
  | 'jux-node'
  | 'rev-node'
  | 'palindrome-node'
  | 'phaser-node'
  | 'room-node'
  | 'adsr-node'
  | 'mask-node'
  | 'ply-node'
  | 'late-node';

export const NODE_DEFAULTS: Record<AppNodeType, Partial<WorkflowNodeData>> = {
  'pad-node': { steps: 8, mode: 'arp', octave: 4, octaveRange: 1, selectedKey: 'C', selectedScaleType: 'major', buttonModifiers: {}, columnModifiers: {}, selectedButtons: [], noteGroups: {} },
  'arpeggiator-node': { selectedKey: 'C', selectedScaleType: 'major', octave: 4, octaveRange: 2, selectedPattern: 'up', selectedChordType: 'major' },
  'chord-node': { selectedKey: 'C', selectedScaleType: 'major', octave: 4, scaleType: 'major', chordComplexity: 'triad', pressedKeys: [] },
  'polyrhythm-node': { polyPattern1: 'x*4', polyPattern2: 'x*3', polyPattern3: 'x*5', polySound1: 'bd', polySound2: 'sd', polySound3: 'hh', pattern1Active: true, pattern2Active: true, pattern3Active: false },
  'beat-machine-node': { rows: [], modifiersEnabled: false },
  'custom-instrument-node': {
    code: '@param GAIN: dial(0..1) = 0.8\n@param INST: dropdown(bd, sd, hh) = bd\n@param REPEAT: stepper(1..8) = 2\n---\nsound("$INST*$REPEAT").gain($GAIN)',
    paramValues: {},
  },
  'drum-sounds-node': {},
  'synth-select-node': {},
  'gain-node': { gain: '1' },
  'lpf-node': { lpf: '20000' },
  'distort-node': { distort: '0' },
  'pan-node': { pan: '0.5' },
  'fast-node': { fast: '1' },
  'slow-node': { slow: '1' },
  'crush-node': { crush: '0' },
  'postgain-node': { postgain: '1' },
  'fm-node': { fm: '0' },
  'jux-node': { jux: '0' },
  'rev-node': {},
  'palindrome-node': {},
  'phaser-node': { phaser: '0', phaserdepth: '0.5' },
  'room-node': { room: '0', roomsize: '0.5', roomfade: '0.5', roomlp: '20000', roomdim: '0.5' },
  'adsr-node': { attack: '0.01', decay: '0.1', sustain: '0.8', release: '0.1' },
  'mask-node': { maskPattern: 'x', maskProbability: '0.5', maskPatternId: 'pattern1', maskProbabilityId: 'prob1' },
  'ply-node': { plyMultiplier: '2', plyProbability: '1', plyMultiplierId: 'mult1', plyProbabilityId: 'prob1' },
  'late-node': { lateOffset: '0.1', latePattern: 'x', lateOffsetId: 'offset1', latePatternId: 'pattern1' },
};
