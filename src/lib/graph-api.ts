import type { Connection, Edge } from '@xyflow/react';

import { useAppStore } from '@/store/app-store';

import type { AppNode, WorkflowNodeData } from '@/components/nodes/types';

/**
 * Imperative command API for mutating the workflow graph. Every mutation routes
 * through the `app-store` actions so undo/persistence/rendering/`nodesVersion`
 * keep working. This is the single typed entry point reused by future AI/MCP and
 * collaboration layers, and it keeps mutations testable and serializable.
 *
 * Note: to avoid the documented node import cycle, this module never imports the
 * node barrel/registry at runtime. `addNode` takes a prebuilt `AppNode`; callers
 * that need to build nodes use `createNodeByType` locally.
 */

/** Add a prebuilt node to the graph; returns the same node. */
export function addNode(node: AppNode): AppNode {
  useAppStore.getState().addNode(node);
  return node;
}

/** Remove a node by id (incident edges are left untouched, as before). */
export function removeNode(id: string): void {
  useAppStore.getState().removeNode(id);
}

/** Create an edge for a connection; returns whether an edge was added (false on self/duplicate). */
export function connect(connection: Connection): boolean {
  const before = useAppStore.getState().edges.length;
  useAppStore.getState().onConnect(connection);
  return useAppStore.getState().edges.length > before;
}

/** Remove any edge(s) matching source→target; returns whether anything was removed. */
export function disconnect(source: string, target: string): boolean {
  const { edges, setEdges } = useAppStore.getState();
  const remaining = edges.filter(
    (edge) => !(edge.source === source && edge.target === target)
  );
  if (remaining.length === edges.length) return false;
  setEdges(remaining);
  return true;
}

/** Remove an edge by its id; returns whether anything was removed. */
export function disconnectEdge(edgeId: string): boolean {
  const { edges, setEdges } = useAppStore.getState();
  const remaining = edges.filter((edge) => edge.id !== edgeId);
  if (remaining.length === edges.length) return false;
  setEdges(remaining);
  return true;
}

/** Set a single data field on a node. */
export function setParam<K extends keyof WorkflowNodeData>(
  id: string,
  key: K,
  value: WorkflowNodeData[K]
): void {
  useAppStore.getState().updateNodeData(id, { [key]: value } as Partial<WorkflowNodeData>);
}

/** Merge a partial data update into a node. */
export function setParams(id: string, updates: Partial<WorkflowNodeData>): void {
  useAppStore.getState().updateNodeData(id, updates);
}

/** Merge a partial data update into many nodes at once. */
export function setManyParams(ids: string[], updates: Partial<WorkflowNodeData>): void {
  useAppStore.getState().updateManyNodeData(ids, updates);
}

/** Read the current nodes and edges from the store. */
export function getGraph(): { nodes: AppNode[]; edges: Edge[] } {
  const { nodes, edges } = useAppStore.getState();
  return { nodes, edges };
}

/** Read a single node by id from the store. */
export function getNode(id: string): AppNode | undefined {
  return useAppStore.getState().nodes.find((node) => node.id === id);
}

// `connect` is assignable to React Flow's OnConnect (its boolean return widens
// to void); enforced where it is wired in `workflow/index.tsx`.
export const graphApi = {
  addNode,
  removeNode,
  connect,
  disconnect,
  disconnectEdge,
  setParam,
  setParams,
  setManyParams,
  getGraph,
  getNode,
} as const;
