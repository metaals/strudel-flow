import { useCallback, useMemo } from 'react';
import { useReactFlow } from '@xyflow/react';

import { AppNode, createNodeByType } from '@/components/nodes';
import { graphApi } from '@/lib/graph-api';

export function useDragAndDrop() {
  const { screenToFlowPosition } = useReactFlow();

  const onDrop: React.DragEventHandler = useCallback(
    (event) => {
      const nodeProps = JSON.parse(
        event.dataTransfer.getData('application/reactflow')
      );

      if (!nodeProps) return;

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode: AppNode = createNodeByType({
        type: nodeProps.id,
        position,
        data: nodeProps.data,
      });
      graphApi.addNode(newNode);
    },
    [screenToFlowPosition]
  );

  const onDragOver: React.DragEventHandler = useCallback(
    (event) => event.preventDefault(),
    []
  );

  return useMemo(() => ({ onDrop, onDragOver }), [onDrop, onDragOver]);
}
