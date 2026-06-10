import type { NodeOutputFn } from '@/components/nodes/registry';
import { padOutput, arpeggiatorOutput, chordOutput, customInstrumentOutput, polyrhythmOutput, beatMachineOutput } from './instruments';
import { drumSoundsOutput, synthSelectOutput } from './synths';
import { gainOutput, lpfOutput, distortOutput, panOutput, fastOutput, slowOutput, crushOutput, postgainOutput, fmOutput, juxOutput, revOutput, palindromeOutput, phaserOutput, roomOutput, adsrOutput, maskOutput, plyOutput, lateOutput } from './effects';

export const nodeOutputMap: Record<string, NodeOutputFn> = {
  'pad-node': padOutput,
  'arpeggiator-node': arpeggiatorOutput,
  'chord-node': chordOutput,
  'custom-instrument-node': customInstrumentOutput,
  'polyrhythm-node': polyrhythmOutput,
  'beat-machine-node': beatMachineOutput,
  'drum-sounds-node': drumSoundsOutput,
  'synth-select-node': synthSelectOutput,
  'gain-node': gainOutput,
  'lpf-node': lpfOutput,
  'distort-node': distortOutput,
  'pan-node': panOutput,
  'fast-node': fastOutput,
  'slow-node': slowOutput,
  'crush-node': crushOutput,
  'postgain-node': postgainOutput,
  'fm-node': fmOutput,
  'jux-node': juxOutput,
  'rev-node': revOutput,
  'palindrome-node': palindromeOutput,
  'phaser-node': phaserOutput,
  'room-node': roomOutput,
  'adsr-node': adsrOutput,
  'mask-node': maskOutput,
  'ply-node': plyOutput,
  'late-node': lateOutput,
};

export function getNodeOutput(type: string): NodeOutputFn | undefined {
  return nodeOutputMap[type];
}
