import { describe, it, expect } from 'vitest';
import { generateOutput, getNodeStrudelOutput } from '../strudel';
import { AppNode } from '@/components/nodes';

function makeInstrumentNode(
  id: string,
  type: 'pad-node' | 'custom-instrument-node' = 'custom-instrument-node',
  data: Record<string, unknown> = {}
): AppNode {
  return {
    id,
    type,
    position: { x: 0, y: 0 },
    data: {
      title: 'Test',
      state: 'running',
      code: 'sound("bd sd")',
      paramValues: {},
      ...data,
    },
  } as AppNode;
}

function makeEffectNode(
  id: string,
  type: 'gain-node' | 'rev-node' | 'fast-node' = 'gain-node',
  data: Record<string, unknown> = {}
): AppNode {
  return {
    id,
    type,
    position: { x: 0, y: 0 },
    data: { title: 'Effect', state: 'running', gain: '0.5', ...data },
  } as AppNode;
}

function makeEdge(source: string, target: string) {
  return { id: `${source}-${target}`, source, target };
}

describe('generateOutput', () => {
  it('returns empty string for no nodes', () => {
    expect(generateOutput([], [], '120', '4')).toBe('');
  });

  it('returns empty string for effect-only nodes with no sources', () => {
    const nodes = [makeEffectNode('e1')];
    expect(generateOutput(nodes, [], '120', '4')).toBe('');
  });

  it('generates output for a single instrument node', () => {
    const nodes = [makeInstrumentNode('i1')];
    const result = generateOutput(nodes, [], '120', '4');
    expect(result).toContain('setcpm(120/4)');
    expect(result).toContain('sound("bd sd")');
  });

  it('chains effects onto instrument nodes when connected', () => {
    const nodes = [
      makeInstrumentNode('i1'),
      makeEffectNode('e1', 'gain-node', { gain: '0.8' }),
    ];
    const edges = [makeEdge('i1', 'e1')];
    const result = generateOutput(nodes, edges, '120', '4');
    expect(result).toContain('.gain(0.8)');
  });

  it('comments out patterns when all sources are paused', () => {
    const nodes = [
      makeInstrumentNode('i1', 'custom-instrument-node', { state: 'paused' }),
    ];
    const result = generateOutput(nodes, [], '120', '4');
    expect(result).toContain('// $:');
  });

  it('generates separate lines for disconnected components', () => {
    const nodes = [makeInstrumentNode('i1'), makeInstrumentNode('i2')];
    const result = generateOutput(nodes, [], '120', '4');
    const lines = result.split('\n').filter((l) => l.startsWith('$:'));
    expect(lines).toHaveLength(2);
  });

  it('treats a custom node with an effect body as an effect, not a source', () => {
    const nodes = [
      makeInstrumentNode('i1'),
      makeInstrumentNode('e1', 'custom-instrument-node', {
        code: '.gain(0.5)',
      }),
    ];
    const edges = [makeEdge('i1', 'e1')];
    const result = generateOutput(nodes, edges, '120', '4');
    const lines = result.split('\n').filter((l) => l.startsWith('$:'));
    expect(lines).toHaveLength(1);
    expect(result).toContain('.gain(0.5)');
  });

  it('honors an explicit role:effect override on a non-dot body', () => {
    const nodes = [
      makeInstrumentNode('i1'),
      makeInstrumentNode('e1', 'custom-instrument-node', {
        code: 'sound("hh")',
        role: 'effect',
      }),
    ];
    const edges = [makeEdge('i1', 'e1')];
    const result = generateOutput(nodes, edges, '120', '4');
    const lines = result.split('\n').filter((l) => l.startsWith('$:'));
    expect(lines).toHaveLength(1);
  });
});

describe('getNodeStrudelOutput', () => {
  it('returns a function for known node types', () => {
    expect(typeof getNodeStrudelOutput('rev-node')).toBe('function');
    expect(typeof getNodeStrudelOutput('gain-node')).toBe('function');
  });

  it('returns undefined for unknown node types', () => {
    expect(getNodeStrudelOutput('nonexistent-node')).toBeUndefined();
  });
});
