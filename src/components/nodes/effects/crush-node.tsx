import WorkflowNode from '@/components/nodes/workflow-node';
import { WorkflowNodeProps, AppNode } from '../types';
import { useAppStore } from '@/store/app-store';
import { Slider } from '@/components/ui/slider';

export function CrushNode({ id, data }: WorkflowNodeProps) {
  const updateNodeData = useAppStore((state) => state.updateNodeData);
  const crush = parseFloat(data.crush || '4');

  return (
    <WorkflowNode id={id} data={data}>
      <div className="space-y-3 p-3">
        <div>
          <label className="text-xs text-muted-foreground mb-2 block">
            Bit Crush: {crush.toFixed(1)} bits
          </label>
          <Slider
            value={[crush]}
            onValueChange={(value) =>
              updateNodeData(id, { crush: value[0].toString() })
            }
            min={1}
            max={16}
            step={0.1}
            className="w-full"
          />
        </div>
      </div>
    </WorkflowNode>
  );
}

CrushNode.strudelOutput = (node: AppNode, strudelString: string) => {
  const crush = parseFloat(node.data.crush || '4');
  if (crush === 4) return strudelString;

  const crushCall = `crush(${crush})`;
  return strudelString ? `${strudelString}.${crushCall}` : crushCall;
};

export const crushNodeDef = {
  type: 'crush-node' as const,
  component: CrushNode,
  config: { title: 'Crush', category: 'Audio Effects' as const, icon: 'Hash' as const },
};