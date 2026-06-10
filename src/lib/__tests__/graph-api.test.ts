import { describe, it, expect, beforeEach } from 'vitest';

import { useAppStore } from '@/store/app-store';
import { createNodeByType, AppNode } from '@/components/nodes';
import { generateOutput } from '@/lib/strudel';

import {
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
} from '../graph-api';

function makeNode(id: string): AppNode {
  return {
    id,
    type: 'pad-node',
    position: { x: 0, y: 0 },
    data: { title: 'Test', state: 'running' },
  } as AppNode;
}

describe('graph-api', () => {
  beforeEach(() => {
    useAppStore.setState({ nodes: [], edges: [] });
  });

  it('addNode appends a node and returns it', () => {
    const node = makeNode('n1');
    const returned = addNode(node);
    expect(returned).toBe(node);
    expect(getGraph().nodes).toHaveLength(1);
    expect(getNode('n1')?.id).toBe('n1');
  });

  it('getNode returns undefined for missing node', () => {
    expect(getNode('missing')).toBeUndefined();
  });

  it('getGraph returns current nodes and edges', () => {
    addNode(makeNode('n1'));
    addNode(makeNode('n2'));
    const graph = getGraph();
    expect(graph.nodes).toHaveLength(2);
    expect(graph.edges).toHaveLength(0);
  });

  it('removeNode removes the specified node', () => {
    addNode(makeNode('n1'));
    addNode(makeNode('n2'));
    removeNode('n1');
    expect(getGraph().nodes).toHaveLength(1);
    expect(getNode('n1')).toBeUndefined();
    expect(getNode('n2')?.id).toBe('n2');
  });

  it('connect adds an edge and returns true', () => {
    addNode(makeNode('n1'));
    addNode(makeNode('n2'));
    const added = connect({
      source: 'n1',
      target: 'n2',
      sourceHandle: null,
      targetHandle: null,
    });
    expect(added).toBe(true);
    expect(getGraph().edges).toHaveLength(1);
    expect(getGraph().edges[0].source).toBe('n1');
  });

  it('connect returns false for self-connections', () => {
    addNode(makeNode('n1'));
    const added = connect({
      source: 'n1',
      target: 'n1',
      sourceHandle: null,
      targetHandle: null,
    });
    expect(added).toBe(false);
    expect(getGraph().edges).toHaveLength(0);
  });

  it('connect returns false for duplicate connections', () => {
    addNode(makeNode('n1'));
    addNode(makeNode('n2'));
    const connection = {
      source: 'n1',
      target: 'n2',
      sourceHandle: null,
      targetHandle: null,
    };
    expect(connect(connection)).toBe(true);
    expect(connect(connection)).toBe(false);
    expect(getGraph().edges).toHaveLength(1);
  });

  it('disconnect removes matching edges and returns true', () => {
    addNode(makeNode('n1'));
    addNode(makeNode('n2'));
    connect({ source: 'n1', target: 'n2', sourceHandle: null, targetHandle: null });
    expect(disconnect('n1', 'n2')).toBe(true);
    expect(getGraph().edges).toHaveLength(0);
  });

  it('disconnect returns false when nothing matches', () => {
    addNode(makeNode('n1'));
    addNode(makeNode('n2'));
    expect(disconnect('n1', 'n2')).toBe(false);
  });

  it('disconnectEdge removes an edge by id and returns true', () => {
    addNode(makeNode('n1'));
    addNode(makeNode('n2'));
    connect({ source: 'n1', target: 'n2', sourceHandle: null, targetHandle: null });
    const edgeId = getGraph().edges[0].id;
    expect(disconnectEdge(edgeId)).toBe(true);
    expect(getGraph().edges).toHaveLength(0);
  });

  it('disconnectEdge returns false for missing edge id', () => {
    expect(disconnectEdge('nope')).toBe(false);
  });

  it('setParam sets a single field', () => {
    addNode(makeNode('n1'));
    setParam('n1', 'gain', '0.5');
    const node = getNode('n1');
    expect(node?.data.gain).toBe('0.5');
    expect(node?.data.title).toBe('Test');
  });

  it('setParams merges multiple fields', () => {
    addNode(makeNode('n1'));
    setParams('n1', { gain: '0.5', pan: '0.2' });
    const node = getNode('n1');
    expect(node?.data.gain).toBe('0.5');
    expect(node?.data.pan).toBe('0.2');
  });

  it('setManyParams updates many nodes at once', () => {
    addNode(makeNode('n1'));
    addNode(makeNode('n2'));
    setManyParams(['n1', 'n2'], { state: 'paused' });
    expect(getNode('n1')?.data.state).toBe('paused');
    expect(getNode('n2')?.data.state).toBe('paused');
  });

  it('produces output identical to direct store actions (parity)', () => {
    const grid = Array(8)
      .fill(null)
      .map(() => Array(8).fill(false));
    grid[0][0] = true;

    // Build via graphApi.
    const pad = createNodeByType({ type: 'pad-node', id: 'pad1' });
    const gain = createNodeByType({ type: 'gain-node', id: 'gain1' });
    addNode(pad);
    addNode(gain);
    setParam('pad1', 'grid', grid);
    setParam('gain1', 'gain', '0.5');
    connect({ source: 'pad1', target: 'gain1', sourceHandle: null, targetHandle: null });
    const viaApi = generateOutput(getGraph().nodes, getGraph().edges, '120', '4');

    // Build the same graph via direct store actions.
    useAppStore.setState({ nodes: [], edges: [] });
    const store = useAppStore.getState();
    store.addNode(createNodeByType({ type: 'pad-node', id: 'pad1' }));
    store.addNode(createNodeByType({ type: 'gain-node', id: 'gain1' }));
    store.updateNodeData('pad1', { grid });
    store.updateNodeData('gain1', { gain: '0.5' });
    store.onConnect({ source: 'pad1', target: 'gain1', sourceHandle: null, targetHandle: null });
    const viaStore = generateOutput(
      useAppStore.getState().nodes,
      useAppStore.getState().edges,
      '120',
      '4'
    );

    expect(viaApi).toBe(viaStore);
    expect(viaApi).toContain('gain(0.5)');
  });
});
