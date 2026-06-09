import { Node, NodeProps } from '@xyflow/react';
import { iconMapping } from '@/data/icon-mapping';
import { CellState } from './instruments/pad-utils';

export type WorkflowNodeData = {
  attack?: string;
  decay?: string;
  sustain?: string;
  release?: string;
  title?: string;
  label?: string;
  icon?: keyof typeof iconMapping;
  sound?: string;
  state?: 'running' | 'paused' | 'stopped';

  // Pad node specific data
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

  // Polyrhythm node data
  polyPattern1?: string;
  polyPattern2?: string;
  polyPattern3?: string;
  polySound1?: string;
  polySound2?: string;
  polySound3?: string;
  pattern1Active?: boolean;
  pattern2Active?: boolean;
  pattern3Active?: boolean;

  // Custom node data
  customPattern?: string;

  // Chord node data
  scaleType?: 'major' | 'minor';
  chordComplexity?: 'triad' | 'seventh' | 'ninth' | 'eleventh';
  pressedKeys?: number[];

  // Beat machine node data
  rows?: Array<{ instrument: string; pattern: boolean[] }>;
    modifiersEnabled?: boolean;

  // Arpeggiator node data
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
};

export type AppNode =
  | Node<WorkflowNodeData, 'pad-node'>
  | Node<WorkflowNodeData, 'arpeggiator-node'>
  | Node<WorkflowNodeData, 'lpf-node'>
  | Node<WorkflowNodeData, 'distort-node'>
  | Node<WorkflowNodeData, 'gain-node'>
  | Node<WorkflowNodeData, 'pan-node'>
  | Node<WorkflowNodeData, 'rev-node'>
  | Node<WorkflowNodeData, 'jux-node'>
  | Node<WorkflowNodeData, 'phaser-node'>
  | Node<WorkflowNodeData, 'palindrome-node'>
  | Node<WorkflowNodeData, 'room-node'>
  | Node<WorkflowNodeData, 'postgain-node'>
  | Node<WorkflowNodeData, 'crush-node'>
  | Node<WorkflowNodeData, 'fast-node'>
  | Node<WorkflowNodeData, 'slow-node'>
  | Node<WorkflowNodeData, 'drum-sounds-node'>
  | Node<WorkflowNodeData, 'chord-node'>
  | Node<WorkflowNodeData, 'custom-node'>
  | Node<WorkflowNodeData, 'polyrhythm-node'>
  | Node<WorkflowNodeData, 'beat-machine-node'>
  | Node<WorkflowNodeData, 'mask-node'>
  | Node<WorkflowNodeData, 'ply-node'>
  | Node<WorkflowNodeData, 'fm-node'>
  | Node<WorkflowNodeData, 'synth-select-node'>
  | Node<WorkflowNodeData, 'late-node'>
  | Node<WorkflowNodeData, 'adsr-node'>;

export type AppNodeType = NonNullable<AppNode['type']>;

export type WorkflowNodeProps = NodeProps<Node<WorkflowNodeData>> & {
  type: AppNodeType;
  children?: React.ReactNode;
};

export type NodeConfig = {
  id: AppNodeType;
  title: string;
  category: 'Instruments' | 'Synths' | 'Audio Effects' | 'Time Effects';
  sound?: string;
  notes?: string;
  icon: keyof typeof iconMapping;
};
