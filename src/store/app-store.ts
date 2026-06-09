import { create } from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  ColorMode,
  OnConnect,
  OnEdgesChange,
  OnNodesChange,
  Edge,
} from '@xyflow/react';

import { AppNode } from '@/components/nodes';
import { initialEdges, initialNodes } from '@/data/workflow-data';

import type { WorkflowNodeData } from '@/components/nodes/types';

export type AppState = {
  nodes: AppNode[];
  edges: Edge[];
  colorMode: ColorMode;
  theme: string;
  nodesVersion: number;
};

export type AppActions = {
  toggleDarkMode: () => void;
  setColorMode: (colorMode: ColorMode) => void;
  onNodesChange: OnNodesChange<AppNode>;
  setNodes: (nodes: AppNode[]) => void;
  addNode: (node: AppNode) => void;
  removeNode: (nodeId: string) => void;
  updateNodeData: (nodeId: string, updates: Partial<WorkflowNodeData>) => void;
  updateManyNodeData: (nodeIds: string[], updates: Partial<WorkflowNodeData>) => void;
  setEdges: (edges: Edge[]) => void;
  onConnect: OnConnect;
  setTheme: (theme: string) => void;
  onEdgesChange: OnEdgesChange<Edge>;
};

export type AppStore = AppState & AppActions;

export const useAppStore = create<AppStore>()(
  devtools(subscribeWithSelector((set, get) => ({
    nodes: initialNodes,
    edges: initialEdges,
    colorMode: 'light',
    theme: 'supabase',
    nodesVersion: 0,

    onNodesChange: async (changes) => {
      const hasDataChange = changes.some((c) => c.type !== 'position' && c.type !== 'select');
      set({ nodes: applyNodeChanges(changes, get().nodes), nodesVersion: hasDataChange ? get().nodesVersion + 1 : get().nodesVersion });
    },

    setNodes: (nodes) => set({ nodes, nodesVersion: get().nodesVersion + 1 }),

    addNode: (node) => set({ nodes: [...get().nodes, node], nodesVersion: get().nodesVersion + 1 }),

    removeNode: (nodeId) =>
      set({ nodes: get().nodes.filter((node) => node.id !== nodeId), nodesVersion: get().nodesVersion + 1 }),

    setEdges: (edges) => set({ edges, nodesVersion: get().nodesVersion + 1 }),

    onEdgesChange: (changes) =>
      set({ edges: applyEdgeChanges(changes, get().edges), nodesVersion: get().nodesVersion + 1 }),

    onConnect: (connection) => {
      if (connection.source === connection.target) return;
      const { source, target, sourceHandle, targetHandle } = connection;
      const edgeId = `${source}-${target}`;
      const exists = get().edges.some((e) => e.id === edgeId || (e.source === source && e.target === target));
      if (exists) return;
      set({
        edges: addEdge(
          {
            id: edgeId,
            source,
            target,
            type: 'default',
            ...(sourceHandle ? { sourceHandle } : {}),
            ...(targetHandle ? { targetHandle } : {}),
          },
          get().edges
        ),
        nodesVersion: get().nodesVersion + 1,
      });
    },

    setTheme: (theme) => set({ theme }),

    toggleDarkMode: () =>
      set((state) => ({
        colorMode: state.colorMode === 'dark' ? 'light' : 'dark',
      })),

    setColorMode: (colorMode) => set({ colorMode }),

    updateNodeData: (nodeId, updates) =>
      set((state) => ({
        nodes: state.nodes.map((node) =>
          node.id === nodeId
            ? { ...node, data: { ...node.data, ...updates } }
            : node
        ),
        nodesVersion: state.nodesVersion + 1,
      })),

    updateManyNodeData: (nodeIds, updates) =>
      set((state) => ({
        nodes: state.nodes.map((node) =>
          nodeIds.includes(node.id) ? { ...node, data: { ...node.data, ...updates } } : node
        ),
        nodesVersion: state.nodesVersion + 1,
      })),
  })), { name: 'app-store' })
);

useAppStore.subscribe(
  (state) => state.colorMode,
  (colorMode: ColorMode) => {
    document.querySelector('html')?.classList.toggle('dark', colorMode === 'dark');
  }
);