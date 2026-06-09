import { describe, it, expect } from 'vitest';
import { findConnectedComponents } from '../graph-utils';
import { AppNode } from '@/components/nodes';

function makeNode(id: string): AppNode {
  return {
    id,
    type: 'pad-node',
    position: { x: 0, y: 0 },
    data: { title: id, state: 'running' },
  } as AppNode;
}

function makeEdge(source: string, target: string) {
  return { id: `${source}-${target}`, source, target };
}

describe('findConnectedComponents', () => {
  it('returns each node as its own component when there are no edges', () => {
    const nodes = [makeNode('a'), makeNode('b'), makeNode('c')];
    const components = findConnectedComponents(nodes, []);

    expect(components).toHaveLength(3);
    expect(components.map((c) => c.sort())).toEqual(
      expect.arrayContaining([['a'], ['b'], ['c']])
    );
  });

  it('groups connected nodes into one component', () => {
    const nodes = [makeNode('a'), makeNode('b'), makeNode('c')];
    const edges = [makeEdge('a', 'b'), makeEdge('b', 'c')];
    const components = findConnectedComponents(nodes, edges);

    expect(components).toHaveLength(1);
    expect(components[0].sort()).toEqual(['a', 'b', 'c']);
  });

  it('returns separate components for disconnected subgraphs', () => {
    const nodes = [makeNode('a'), makeNode('b'), makeNode('c'), makeNode('d')];
    const edges = [makeEdge('a', 'b'), makeEdge('c', 'd')];
    const components = findConnectedComponents(nodes, edges);

    expect(components).toHaveLength(2);
    const sorted = components.map((c) => c.sort()).sort();
    expect(sorted).toEqual([['a', 'b'], ['c', 'd']]);
  });

  it('returns empty array for no nodes', () => {
    expect(findConnectedComponents([], [])).toEqual([]);
  });
});