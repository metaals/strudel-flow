import { describe, it, expect, vi } from 'vitest';
import { AppNode } from '@/components/nodes/types';

vi.mock('@/components/nodes/workflow-node', () => ({
  default: () => null,
}));

import { RevNode } from '../effects/rev-node';
import { GainNode } from '../effects/gain-node';
import { FastNode } from '../effects/fast-node';
import { PalindromeNode } from '../effects/palindrome-node';
import { SynthSelectNode } from '../synths/synth-select-node';

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
    const result = RevNode.strudelOutput(makeNode(), 'sound("bd")');
    expect(result).toBe('sound("bd").rev()');
  });

  it('returns rev() when no input pattern', () => {
    const result = RevNode.strudelOutput(makeNode(), '');
    expect(result).toBe('rev()');
  });
});

describe('GainNode.strudelOutput', () => {
  it('appends .gain() with the node value', () => {
    const node = makeNode({ data: { gain: '0.8' } } as any);
    const result = GainNode.strudelOutput(node, 'sound("bd")');
    expect(result).toBe('sound("bd").gain(0.8)');
  });

  it('passes through input unchanged when gain is not set', () => {
    const node = makeNode({ data: {} } as any);
    const result = GainNode.strudelOutput(node, 'sound("bd")');
    expect(result).toBe('sound("bd")');
  });
});

describe('FastNode.strudelOutput', () => {
  it('appends .fast() with the node value', () => {
    const node = makeNode({ data: { fast: '3' } } as any);
    const result = FastNode.strudelOutput(node, 'sound("bd")');
    expect(result).toBe('sound("bd").fast(3)');
  });
});

describe('PalindromeNode.strudelOutput', () => {
  it('appends .palindrome()', () => {
    const result = PalindromeNode.strudelOutput(makeNode(), 'sound("bd")');
    expect(result).toBe('sound("bd").palindrome()');
  });
});

describe('SynthSelectNode.strudelOutput', () => {
  it('appends .sound() with the selected sound', () => {
    const node = makeNode({ data: { sound: 'arpy' } } as any);
    const result = SynthSelectNode.strudelOutput(node, 'n("0 1 2")');
    expect(result).toBe('n("0 1 2").sound("arpy")');
  });
});
