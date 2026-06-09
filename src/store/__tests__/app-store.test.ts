import { describe, it, expect, beforeEach } from 'vitest';
import { useAppStore } from '../app-store';
import { AppNode } from '@/components/nodes';

function makeNode(id: string): AppNode {
  return {
    id,
    type: 'pad-node',
    position: { x: 0, y: 0 },
    data: { title: 'Test', state: 'running' },
  } as AppNode;
}

describe('useAppStore', () => {
  beforeEach(() => {
    useAppStore.setState({
      nodes: [],
      edges: [],
      theme: 'supabase',
      colorMode: 'light',
    });
  });

  it('addNode appends a node', () => {
    const node = makeNode('n1');
    useAppStore.getState().addNode(node);
    expect(useAppStore.getState().nodes).toHaveLength(1);
    expect(useAppStore.getState().nodes[0].id).toBe('n1');
  });

  it('removeNode removes the specified node', () => {
    useAppStore.setState({ nodes: [makeNode('n1'), makeNode('n2')] });
    useAppStore.getState().removeNode('n1');
    expect(useAppStore.getState().nodes).toHaveLength(1);
    expect(useAppStore.getState().nodes[0].id).toBe('n2');
  });

  it('updateNodeData merges data into the correct node', () => {
    useAppStore.setState({ nodes: [makeNode('n1')] });
    useAppStore.getState().updateNodeData('n1', { gain: '0.5' });
    const node = useAppStore.getState().nodes[0];
    expect(node.data.gain).toBe('0.5');
    expect(node.data.title).toBe('Test');
  });

  it('onConnect adds an edge between different nodes', () => {
    useAppStore.setState({ nodes: [makeNode('n1'), makeNode('n2')] });
    useAppStore.getState().onConnect({
      source: 'n1',
      target: 'n2',
      sourceHandle: null,
      targetHandle: null,
    });
    expect(useAppStore.getState().edges).toHaveLength(1);
    expect(useAppStore.getState().edges[0].source).toBe('n1');
  });

  it('onConnect ignores self-connections', () => {
    useAppStore.setState({ nodes: [makeNode('n1')] });
    useAppStore.getState().onConnect({
      source: 'n1',
      target: 'n1',
      sourceHandle: null,
      targetHandle: null,
    });
    expect(useAppStore.getState().edges).toHaveLength(0);
  });

  it('setTheme updates the theme', () => {
    useAppStore.getState().setTheme('doom-64');
    expect(useAppStore.getState().theme).toBe('doom-64');
  });
});
