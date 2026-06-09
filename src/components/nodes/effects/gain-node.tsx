import { createEffectSliderNode } from './effect-slider-node';

const formatGain = (gain: number) =>
  `${gain.toFixed(1)}x ${gain > 1 ? `(+${(20 * Math.log10(gain)).toFixed(1)}dB)` : gain < 1 ? `(${(20 * Math.log10(gain)).toFixed(1)}dB)` : '(0dB)'}`;

export const GainNode = createEffectSliderNode({
  key: 'gain',
  label: 'Gain',
  min: 0.1,
  max: 5,
  step: 0.1,
  defaultValue: 1,
  formatValue: formatGain,
});

import { gainOutput } from '@/lib/node-outputs/effects';

export const gainNodeDef = {
  type: 'gain-node' as const,
  component: GainNode,
  config: { title: 'Gain', category: 'Audio Effects' as const, icon: 'Volume2' as const },
  output: gainOutput,
  defaults: { gain: '1' },
};