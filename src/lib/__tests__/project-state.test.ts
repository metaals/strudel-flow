import { describe, it, expect } from 'vitest';
import { stateFromJson } from '../project-state';
import type { ProjectState } from '../project-state';

function baseState(partial: Partial<ProjectState>): ProjectState {
  return {
    version: 3,
    nodes: [],
    edges: [],
    theme: 'supabase',
    colorMode: 'light',
    cpm: '120',
    ...partial,
  };
}

describe('project-state migration', () => {
  it('migrates a legacy custom-node to a custom-instrument-node', () => {
    const json = JSON.stringify(
      baseState({
        nodes: [
          {
            id: 'n1',
            type: 'custom-node',
            position: { x: 0, y: 0 },
            data: { customPattern: 'sound("bd sd")' },
          },
        ],
      })
    );

    const state = stateFromJson(json);
    expect(state).not.toBeNull();
    const node = state!.nodes[0];
    expect(node.type).toBe('custom-instrument-node');
    expect(node.data.code).toBe('sound("bd sd")');
    expect(node.data.paramValues).toEqual({});
    expect(node.data.customPattern).toBeUndefined();
    expect(state!.version).toBe(4);
  });

  it('falls back to the default code when customPattern is missing', () => {
    const json = JSON.stringify(
      baseState({
        nodes: [
          {
            id: 'n1',
            type: 'custom-node',
            position: { x: 0, y: 0 },
            data: {},
          },
        ],
      })
    );

    const state = stateFromJson(json);
    const node = state!.nodes[0];
    expect(node.type).toBe('custom-instrument-node');
    expect(typeof node.data.code).toBe('string');
    expect((node.data.code as string).length).toBeGreaterThan(0);
  });
});
