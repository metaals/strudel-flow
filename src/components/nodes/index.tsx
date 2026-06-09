import { XYPosition } from '@xyflow/react';
import { nanoid } from 'nanoid';

import { nodesConfig, nodeTypes } from './registry';

export { nodesConfig, nodeTypes };
export type { NodeCategory, NodeConfigEntry } from './registry';
export type {
  WorkflowNodeData,
  WorkflowNodeProps,
  NodeConfig,
  AppNode,
  AppNodeType,
} from './types';

import type { AppNode, AppNodeType, WorkflowNodeData } from './types';

export function createNodeByType({
  type,
  id,
  position,
  data,
}: {
  type: AppNodeType;
  id?: string;
  position?: XYPosition;
  data?: WorkflowNodeData;
}): AppNode {
  const node = nodesConfig[type];

  const newNode = {
    id: id ?? nanoid(),
    data: data ?? {
      title: node.title,
      sound: node.sound,
      notes: node.notes,
      icon: node.icon,
      state: 'running',
    },
    position: {
      x: position?.x || 0,
      y: position?.y || 0,
    },
    type,
  } as AppNode;

  return newNode;
}
