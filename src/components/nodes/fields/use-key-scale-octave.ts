import { useNodeField } from './use-node-field';

export function useKeyScaleOctave(id: string) {
  const [selectedKey, setKey] = useNodeField(id, 'selectedKey', 'C');
  const [selectedScaleType, setScale] = useNodeField(id, 'selectedScaleType', 'major');
  const [octave, setOctave] = useNodeField(id, 'octave', 4, (v) => parseInt(v, 10), (v) => v as number);
  const [octaveRange, setOctaveRange] = useNodeField(id, 'octaveRange', 1, (v) => parseInt(v, 10), (v) => v as number);

  return {
    selectedKey: selectedKey as string,
    onKeyChange: (k: string) => setKey(k),
    selectedScaleType: selectedScaleType as string,
    onScaleTypeChange: (s: string) => setScale(s),
    octave: octave as number,
    onOctaveChange: (o: number) => setOctave(o),
    octaveRange: octaveRange as number,
    onOctaveRangeChange: (r: number) => setOctaveRange(r),
  };
}