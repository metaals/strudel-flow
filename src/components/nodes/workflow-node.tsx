import { useCallback, useState, useMemo, lazy, Suspense } from 'react';
import { Play, Pause, Trash, NotebookText } from 'lucide-react';

import {
  NodeHeaderTitle,
  NodeHeader,
  NodeHeaderActions,
  NodeHeaderAction,
  NodeHeaderIcon,
} from '@/components/node-header';
import { WorkflowNodeData, AppNodeType } from '@/components/nodes/types';

const INSTRUMENT_TYPES: Set<string> = new Set([
  'pad-node', 'arpeggiator-node', 'chord-node',
  'polyrhythm-node', 'beat-machine-node', 'custom-node',
]);
import { useWorkflowRunner } from '@/hooks/use-workflow-runner';
import { iconMapping } from '@/data/icon-mapping';
import { BaseNode } from '@/components/base-node';
import { useAppStore } from '@/store/app-store';
import { ErrorBoundary } from '@/components/error-boundary';
const PatternPopup = lazy(() => import('@/components/pattern-popup'));
import { BaseHandle } from '@/components/base-handle';
import { Position } from '@xyflow/react';
import { findConnectedComponents } from '@/lib/graph-utils';

function WorkflowNode({
  id,
  data,
  type,
  children,
}: {
  id: string;
  data: WorkflowNodeData;
  type?: AppNodeType;
  children?: React.ReactNode;
}) {
  const { forceEvaluate } = useWorkflowRunner();
  const [show, setShow] = useState(false);

  const { removeNode, edges, nodes, updateNodeData } = useAppStore(
    (state) => state
  );
  const nodeState = useAppStore((state) => state.nodes.find((n) => n.id === id))
    ?.data?.state;

  const isPaused = nodeState === 'paused';

  // Determine if this node is an instrument based on its type
  const isInstrument = type ? INSTRUMENT_TYPES.has(type) : false;

  // Find all connected nodes for this group using findConnectedComponents
  const { connectedNodeIds } = useMemo(() => {
    const allComponents = findConnectedComponents(nodes, edges);
    const connectedComponent = allComponents.find((component) =>
      component.includes(id)
    ) || [id];
    const nodeIds = new Set(connectedComponent);
    return { connectedNodeIds: nodeIds };
  }, [nodes, edges, id]);

  const onPlay = useCallback(() => {
    connectedNodeIds.forEach((nodeId) => {
      updateNodeData(nodeId, { state: 'running' });
    });
    forceEvaluate();
  }, [forceEvaluate, connectedNodeIds, updateNodeData]);

  const onPause = useCallback(() => {
    connectedNodeIds.forEach((nodeId) => {
      updateNodeData(nodeId, { state: 'paused' });
    });
    forceEvaluate();
  }, [forceEvaluate, connectedNodeIds, updateNodeData]);

  const onDelete = useCallback(() => {
    removeNode(id);
  }, [id, removeNode]);

  const IconComponent = data?.icon ? iconMapping[data.icon] : undefined;

  return (
    <BaseNode>
      <BaseHandle position={Position.Top} type="target" />
      <BaseHandle position={Position.Bottom} type="source" />
      <NodeHeader>
        <NodeHeaderIcon>
          {IconComponent ? <IconComponent aria-label={data?.icon} /> : null}
        </NodeHeaderIcon>
        <NodeHeaderTitle>{data?.title}</NodeHeaderTitle>
        <NodeHeaderActions>
          {isInstrument && (
            <NodeHeaderAction
              onClick={isPaused ? onPlay : onPause}
              label={isPaused ? 'Resume group' : 'Pause group'}
              variant={isPaused ? 'default' : 'ghost'}
            >
              {isPaused ? <Play /> : <Pause />}
            </NodeHeaderAction>
          )}
          <NodeHeaderAction
            label="Pattern Preview"
            onClick={() => setShow(!show)}
          >
            <NotebookText />
          </NodeHeaderAction>
          <NodeHeaderAction
            onClick={onDelete}
            variant="ghost"
            label="Delete node"
          >
            <Trash />
          </NodeHeaderAction>
        </NodeHeaderActions>
      </NodeHeader>
      <ErrorBoundary>{children}</ErrorBoundary>
      {show && (
        <Suspense>
          <PatternPopup id={id} />
        </Suspense>
      )}
    </BaseNode>
  );
}

export default WorkflowNode;
