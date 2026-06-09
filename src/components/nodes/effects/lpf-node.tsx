import WorkflowNode from '@/components/nodes/workflow-node';
import type { WorkflowNodeProps } from '../types';
import { NodeCard, ParamSlider, useNodeField } from '../fields';
import { lpfOutput } from '@/lib/node-outputs/effects';

export function LpfNode({ id, data, type }: WorkflowNodeProps) {
  const [lpfValue, setLpf] = useNodeField(id, 'lpf', '20000');
  const parts = (lpfValue as string).split(' ');
  const frequency = parseFloat(parts[0]) || 20000;
  const resonance = parseFloat(parts[1]) || 1;

  const handleFrequency = (v: number) => setLpf(`${v} ${resonance}` as any);
  const handleResonance = (v: number) => setLpf(`${frequency} ${v}` as any);

  return (
    <WorkflowNode id={id} data={data} type={type}>
      <NodeCard>
        <ParamSlider label="Frequency" value={frequency} onChange={handleFrequency} min={100} max={20000} step={100} unit="Hz" />
        <ParamSlider label="Resonance" value={resonance} onChange={handleResonance} min={0.1} max={10} step={0.1} />
      </NodeCard>
    </WorkflowNode>
  );
}

export const lpfNodeDef = {
  type: 'lpf-node' as const,
  component: LpfNode,
  config: { title: 'LPF', category: 'Audio Effects' as const, icon: 'Filter' as const },
  output: lpfOutput,
  defaults: { lpf: '20000' },
};