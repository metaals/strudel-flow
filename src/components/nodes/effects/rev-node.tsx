import WorkflowNode from '@/components/nodes/workflow-node';
import { WorkflowNodeProps, AppNode } from '../types';

export function RevNode({ id, data }: WorkflowNodeProps) {
  return <WorkflowNode id={id} data={data}></WorkflowNode>;
}

RevNode.strudelOutput = (_: AppNode, strudelString: string) => {
  // Rev effect is always active when node exists
  const revCall = `rev()`;
  return strudelString ? `${strudelString}.${revCall}` : revCall;
};

export const revNodeDef = {
  type: 'rev-node' as const,
  component: RevNode,
  config: { title: 'Reverse', category: 'Time Effects' as const, icon: 'Radio' as const },
};
