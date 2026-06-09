import type { AppNode } from '@/components/nodes/types';

export function chain(strudelString: string, call: string, skip = false): string {
  if (skip || !call) return strudelString;
  return strudelString ? `${strudelString}.${call}` : call;
}

export function chainEffect(_node: AppNode, strudelString: string, call: string, isDefault: boolean): string {
  if (isDefault) return strudelString;
  return chain(strudelString, call);
}