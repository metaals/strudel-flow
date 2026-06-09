import { Edge } from '@xyflow/react';
import { AppNode, nodesConfig } from '@/components/nodes';
import { findConnectedComponents } from './graph-utils';
import { logger } from './logger';
import { getNodeOutput } from './node-outputs';

export function getNodeStrudelOutput(nodeType: string) {
  return getNodeOutput(nodeType);
}

const SOUND_REGEX = /\.sound\("([^"]+)"\)\.sound\("([^"]+)"\)/g;

function optimizeSoundCalls(strudelString: string): string {
  let optimized = strudelString;
  let previousLength = 0;
  let iterations = 0;
  const maxIterations = 10;

  while (optimized.length !== previousLength && iterations < maxIterations) {
    previousLength = optimized.length;
    optimized = optimized.replace(SOUND_REGEX, '.sound("$1 $2")');
    iterations++;
  }

  return optimized;
}
function isSoundSource(node: AppNode): boolean {
  const category = nodesConfig[node.type]?.category;
  return category === 'Instruments';
}

export interface GenerateResult {
  pattern: string;
  errors: Array<{ nodeId: string; type: string; message: string }>;
  durationMs: number;
}

export function generateOutput(
  nodes: AppNode[],
  edges: Edge[],
  cpm: string,
  bpc: string
): string {
  return generateOutputWithErrors(nodes, edges, cpm, bpc).pattern;
}

export function generateOutputWithErrors(
  nodes: AppNode[],
  edges: Edge[],
  cpm: string,
  bpc: string
): GenerateResult {
  const start = performance.now();
  const nodePatterns: Record<string, string> = {};
  const errors: GenerateResult['errors'] = [];
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));

  for (const node of nodes) {
    const strudelOutput = getNodeStrudelOutput(node.type);
    if (!strudelOutput) continue;

    try {
      const pattern = strudelOutput(node, '');
      if (pattern?.trim()) {
        nodePatterns[node.id] = pattern;
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      errors.push({ nodeId: node.id, type: node.type, message });
      logger.warn(`Error generating pattern for node ${node.type}:`, err, { nodeId: node.id });
    }
  }

  const components = findConnectedComponents(nodes, edges);
  const finalPatterns: { pattern: string; paused: boolean }[] = [];

  for (const componentNodeIds of components) {
    const componentNodes = componentNodeIds.map((id) => nodeMap.get(id)).filter(Boolean) as AppNode[];

    const [sources, effects] = componentNodes.reduce<[AppNode[], AppNode[]]>(
      ([src, eff], node) => {
        isSoundSource(node) ? src.push(node) : eff.push(node);
        return [src, eff];
      },
      [[], []]
    );

    if (sources.length === 0) continue;

    const allSourcesPaused = sources.every(
      (node) => node.data.state === 'paused'
    );
    const activePatterns = (
      allSourcesPaused
        ? sources
        : sources.filter((node) => node.data.state !== 'paused')
    )
      .map((node) => nodePatterns[node.id])
      .filter(Boolean);

    if (activePatterns.length === 0) continue;

    let pattern =
      activePatterns.length === 1
        ? activePatterns[0]
        : `stack(${activePatterns.join(', ')})`;

    for (const effect of effects) {
      const strudelOutput = getNodeStrudelOutput(effect.type);
      if (strudelOutput && pattern) {
        pattern = strudelOutput(effect, pattern);
      }
    }

    if (pattern) {
      finalPatterns.push({
        pattern: optimizeSoundCalls(pattern),
        paused: allSourcesPaused,
      });
    }
  }

  const durationMs = performance.now() - start;

  if (finalPatterns.length === 0) return { pattern: '', errors, durationMs };

  const result = finalPatterns
    .map(({ pattern, paused }) => {
      const line = `$: ${pattern}`;
      return paused ? `// ${line}` : line;
    })
    .join('\n');

  // Always add setcpm if there's sound (like other node outputs)
  if (result) {
    const bpm = parseInt(cpm) || 120;
    const beatsPerCycle = parseInt(bpc) || 4;
    return { pattern: `setcpm(${bpm}/${beatsPerCycle})\n${result}`, errors, durationMs };
  }

  return { pattern: result, errors, durationMs };
}