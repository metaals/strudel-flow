import WorkflowNode from '@/components/nodes/workflow-node';
import { WorkflowNodeProps, AppNode } from '../types';
import { graphApi } from '@/lib/graph-api';
import { Slider } from '@/components/ui/slider';

export function PostGainNode({ id, data }: WorkflowNodeProps) {
  const postgain = parseFloat(data.postgain || '1');

  return (
    <WorkflowNode id={id} data={data}>
      <div className="space-y-3 p-3">
        <div>
          <label className="text-xs text-muted-foreground mb-2 block">
            Post Gain: {postgain.toFixed(1)}x
          </label>
          <Slider
            value={[postgain]}
            onValueChange={(value) =>
              graphApi.setParam(id, 'postgain', value[0].toString())
            }
            min={0.1}
            max={5}
            step={0.1}
            className="w-full"
          />
        </div>
      </div>
    </WorkflowNode>
  );
}

PostGainNode.strudelOutput = (node: AppNode, strudelString: string) => {
  const postgain = parseFloat(node.data.postgain || '1');
  if (postgain === 1) return strudelString;

  const postgainCall = `postgain(${postgain})`;
  return strudelString ? `${strudelString}.${postgainCall}` : postgainCall;
};

export const postgainNodeDef = {
  type: 'postgain-node' as const,
  component: PostGainNode,
  config: { title: 'PostGain', category: 'Audio Effects' as const, icon: 'Volume2' as const },
};
