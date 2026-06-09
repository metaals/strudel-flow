import type { AppNode } from '@/components/nodes/types';

export function drumSoundsOutput(node: AppNode, strudelString: string): string {
  const sound = (node.data as any).sound;
  if (!sound) return strudelString;
  const call = `sound("${sound}")`;
  return strudelString ? `${strudelString}.${call}` : call;
}

export function synthSelectOutput(node: AppNode, strudelString: string): string {
  const sound = (node.data as any).sound;
  if (!sound) return strudelString;
  const call = `sound("${sound}")`;
  return strudelString ? `${strudelString}.${call}` : call;
}