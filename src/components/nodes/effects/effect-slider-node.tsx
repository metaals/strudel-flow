import WorkflowNode from '@/components/nodes/workflow-node';
import type { WorkflowNodeProps } from '../types';
import { ParamSlider, NodeCard, useNodeField } from '../fields';

export interface EffectSliderConfig {
  key: string;
  label: string;
  min: number;
  max: number;
  step?: number;
  defaultValue: number;
  formatValue?: (v: number) => string;
  unit?: string;
}

export function createEffectSliderNode(config: EffectSliderConfig) {
  const Component = ({ id, data, type }: WorkflowNodeProps) => {
    const [value, setValue] = useNodeField(id, config.key as any, String(config.defaultValue), (v) => v, (v) => String(v));
    const numeric = parseFloat(value as string) || config.defaultValue;

    return (
      <WorkflowNode id={id} data={data} type={type}>
        <NodeCard>
          <ParamSlider
            label={config.label}
            value={numeric}
            onChange={(v) => setValue(String(v) as any)}
            min={config.min}
            max={config.max}
            step={config.step}
            formatValue={config.formatValue}
            unit={config.unit}
          />
        </NodeCard>
      </WorkflowNode>
    );
  };
  return Component;
}