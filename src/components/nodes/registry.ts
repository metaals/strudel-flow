import { iconMapping } from '@/data/icon-mapping';

import { padNodeDef } from './instruments/pad-node';
import { arpeggiatorNodeDef } from './instruments/arpeggiator-node';
import { chordNodeDef } from './instruments/chord-node';
import { customNodeDef } from './instruments/custom-node';
import { polyrhythmNodeDef } from './instruments/polyrhythm-node';
import { beatMachineNodeDef } from './instruments/beat-machine-node';

import { synthSelectNodeDef } from './synths/synth-select-node';
import { drumSoundsNodeDef } from './synths/drum-sounds-node';

import { gainNodeDef } from './effects/gain-node';
import { lpfNodeDef } from './effects/lpf-node';
import { distortNodeDef } from './effects/distort-node';
import { panNodeDef } from './effects/pan-node';
import { revNodeDef } from './effects/rev-node';
import { juxNodeDef } from './effects/jux-node';
import { phaserNodeDef } from './effects/phaser-node';
import { palindromeNodeDef } from './effects/palindrome-node';
import { roomNodeDef } from './effects/room-node';
import { postgainNodeDef } from './effects/postgain-node';
import { crushNodeDef } from './effects/crush-node';
import { fastNodeDef } from './effects/fast-node';
import { slowNodeDef } from './effects/slow-node';
import { maskNodeDef } from './effects/mask-node';
import { plyNodeDef } from './effects/ply-node';
import { fmNodeDef } from './effects/fm-node';
import { lateNodeDef } from './effects/late-node';
import { adsrNodeDef } from './effects/adsr-node';

import type { AppNode, WorkflowNodeData } from './types';
import { NODE_DEFAULTS } from './data';

export type NodeCategory = 'Instruments' | 'Synths' | 'Audio Effects' | 'Time Effects';

export type NodeOutputFn = (node: AppNode, strudelString: string) => string;

export type NodeDefinition = {
  type: string;
  component: React.ComponentType<any>;
  config: {
    title: string;
    category: NodeCategory;
    icon: keyof typeof iconMapping;
    sound?: string;
    notes?: string;
  };
  output?: NodeOutputFn;
  defaults?: Partial<WorkflowNodeData>;
};

const allNodeDefs: NodeDefinition[] = [
  padNodeDef,
  arpeggiatorNodeDef,
  chordNodeDef,
  polyrhythmNodeDef,
  beatMachineNodeDef,
  customNodeDef,
  drumSoundsNodeDef,
  synthSelectNodeDef,
  lpfNodeDef,
  distortNodeDef,
  gainNodeDef,
  panNodeDef,
  phaserNodeDef,
  roomNodeDef,
  fastNodeDef,
  slowNodeDef,
  revNodeDef,
  palindromeNodeDef,
  juxNodeDef,
  crushNodeDef,
  postgainNodeDef,
  maskNodeDef,
  plyNodeDef,
  fmNodeDef,
  lateNodeDef,
  adsrNodeDef,
];

export type NodeConfigEntry = {
  id: string;
  title: string;
  category: NodeCategory;
  icon: keyof typeof iconMapping;
  sound?: string;
  notes?: string;
};

export const nodesConfig: Record<string, NodeConfigEntry> = Object.fromEntries(
  allNodeDefs.map((d) => [
    d.type,
    {
      id: d.type,
      title: d.config.title,
      category: d.config.category,
      icon: d.config.icon,
      sound: d.config.sound,
      notes: d.config.notes,
    },
  ])
);

export const nodeTypes = Object.fromEntries(
  allNodeDefs.map((d) => [d.type, d.component])
);

export const nodeDefaults: Record<string, Partial<WorkflowNodeData>> = Object.fromEntries(
  allNodeDefs.map((d) => [d.type, d.defaults ?? NODE_DEFAULTS[d.type as keyof typeof NODE_DEFAULTS] ?? {}])
);

export const nodeOutputs: Record<string, NodeOutputFn | undefined> = Object.fromEntries(
  allNodeDefs.map((d) => [d.type, d.output])
);