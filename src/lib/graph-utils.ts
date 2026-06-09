import { Edge } from '@xyflow/react';
import { AppNode } from '@/components/nodes';

export function buildAdjacencyMap(edges: Edge[]): Map<string, string[]> {
  const adj = new Map<string, string[]>();
  for (const edge of edges) {
    if (!adj.has(edge.source)) adj.set(edge.source, []);
    if (!adj.has(edge.target)) adj.set(edge.target, []);
    adj.get(edge.source)!.push(edge.target);
    adj.get(edge.target)!.push(edge.source);
  }
  return adj;
}

export function findConnectedComponents(
  nodes: AppNode[],
  edges: Edge[]
): string[][] {
  const adj = buildAdjacencyMap(edges);
  const visited = new Set<string>();
  const components: string[][] = [];

  for (const node of nodes) {
    if (visited.has(node.id)) continue;
    const component: string[] = [];
    const stack = [node.id];
    visited.add(node.id);
    while (stack.length) {
      const current = stack.pop()!;
      component.push(current);
      const neighbors = adj.get(current) || [];
      for (const nb of neighbors) {
        if (!visited.has(nb)) {
          visited.add(nb);
          stack.push(nb);
        }
      }
    }
    if (component.length > 0) components.push(component);
  }

  return components;
}