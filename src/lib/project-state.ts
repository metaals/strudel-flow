import { compressToBase64, decompressFromBase64 } from 'lz-string';
import { Node, Edge, ColorMode } from '@xyflow/react';
import { logger } from './logger';
import { NODE_DEFAULTS, type AppNodeType } from '@/components/nodes/data';

export const PROJECT_STATE_VERSION = 2;

export interface ProjectState {
  version?: number;
  nodes: Node[];
  edges: Edge[];
  theme: string;
  colorMode: ColorMode;
  cpm: string;
  bpc?: string;
}

function migrateV1toV2(state: ProjectState): ProjectState {
  const migratedNodes = state.nodes.map((node) => {
    const type = node.type as AppNodeType | undefined;
    if (!type || !(type in NODE_DEFAULTS)) return node;
    const defaults = NODE_DEFAULTS[type];
    return {
      ...node,
      data: { ...defaults, ...(node.data || {}) },
    };
  });
  return { ...state, version: PROJECT_STATE_VERSION, nodes: migratedNodes };
}

function migrate(state: ProjectState): ProjectState {
  const version = state.version ?? 1;
  let current = state;
  if (version < 2) current = migrateV1toV2(current);
  current.version = PROJECT_STATE_VERSION;
  return current;
}

// --- URL (compressed for sharing) ---

export function encodeState(state: ProjectState): string {
  return compressToBase64(JSON.stringify(state));
}

export function decodeState(encoded: string): ProjectState | null {
  try {
    const json = decompressFromBase64(encoded);
    if (!json) return null;
    const parsed = JSON.parse(json) as ProjectState;
    return migrate(parsed);
  } catch (error) {
    logger.error('Failed to decode state:', error, { context: 'decodeState' });
    return null;
  }
}

export function getShareUrl(state: ProjectState): string {
  const url = new URL(window.location.href);
  url.searchParams.set('state', encodeState(state));
  return url.toString();
}

export function loadFromUrl(): ProjectState | null {
  const param = new URLSearchParams(window.location.search).get('state');
  return param ? decodeState(param) : null;
}

// --- File (readable JSON for saving/loading) ---

export function stateToJson(state: ProjectState): string {
  const withVersion = { ...state, version: PROJECT_STATE_VERSION };
  return JSON.stringify(withVersion, null, 2);
}

export function stateFromJson(json: string): ProjectState | null {
  try {
    const parsed = JSON.parse(json) as ProjectState;
    return migrate(parsed);
  } catch (error) {
    logger.error('Failed to parse state from JSON:', error, { context: 'stateFromJson' });
    return null;
  }
}

export function downloadState(state: ProjectState, filename = 'strudel-flow-project.json'): void {
  const blob = new Blob([stateToJson(state)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}