import { Node, NodeProps } from '@xyflow/react';
import { iconMapping } from '@/data/icon-mapping';
export type { WorkflowNodeData, AppNodeType, BaseNodeData, NodeState } from './data';
import type { WorkflowNodeData, AppNodeType } from './data';
export { NODE_DEFAULTS } from './data';

export type AppNode = Node<WorkflowNodeData, AppNodeType>;

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