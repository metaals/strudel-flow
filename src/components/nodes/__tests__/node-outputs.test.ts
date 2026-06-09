import { describe, it, expect, vi } from 'vitest';
import { AppNode } from '@/components/nodes/types';

vi.mock('@/components/nodes/workflow-node', () => ({
  default: () => null,
}));

import { revOutput, gainOutput, fastOutput, palindromeOutput } from '@/lib/node-outputs/effects';
import { synthSelectOutput } from '@/lib/node-outputs/synths';

function makeNode(overrides: Partial<AppNode> = {}): AppNode {
  return {
    id: 'test',
    type: 'rev-node',
    position: { x: 0, y: 0 },
    data: { title: 'Test', state: 'running' },
    ...overrides,
  } as AppNode;
}

describe('RevNode.strudelOutput', () => {
  it('appends .rev() to an existing pattern', () => {
    const result = revOutput(makeNode(), 'sound("bd")');
    expect(result).toBe('sound("bd").rev()');
  });

  it('returns rev() when no input pattern', () => {
    const result = revOutput(makeNode(), '');
    expect(result).toBe('rev()');
  });
});

describe('GainNode.strudelOutput', () => {
  it('appends .gain() with the node value', () => {
    const node = makeNode({ data: { gain: '0.8' } } as any);
    const result = gainOutput(node, 'sound("bd")');
    expect(result).toBe('sound("bd").gain(0.8)');
  });

  it('passes through input unchanged when gain is not set', () => {
    const node = makeNode({ data: {} } as any);
    const result = gainOutput(node, 'sound("bd")');
    expect(result).toBe('sound("bd")');
  });
});

describe('FastNode.strudelOutput', () => {
  it('appends .fast() with the node value', () => {
    const node = makeNode({ data: { fast: '3' } } as any);
    const result = fastOutput(node, 'sound("bd")');
    expect(result).toBe('sound("bd").fast(3)');
  });
});

describe('PalindromeNode.strudelOutput', () => {
  it('appends .palindrome()', () => {
    const result = palindromeOutput(makeNode(), 'sound("bd")');
    expect(result).toBe('sound("bd").palindrome()');
  });
});

describe('SynthSelectNode.strudelOutput', () => {
  it('appends .sound() with the selected sound', () => {
    const node = makeNode({ data: { sound: 'arpy' } } as any);
    const result = synthSelectOutput(node, 'n("0 1 2")');
    expect(result).toBe('n("0 1 2").sound("arpy")');
  });
});