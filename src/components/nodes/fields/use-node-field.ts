import { useCallback } from 'react';
import { useAppStore } from '@/store/app-store';
import { graphApi } from '@/lib/graph-api';
import type { WorkflowNodeData } from '../types';

export function useNodeField<K extends keyof WorkflowNodeData>(
  id: string,
  key: K,
  defaultValue: WorkflowNodeData[K],
  parser?: (v: string) => WorkflowNodeData[K],
  serializer?: (v: WorkflowNodeData[K]) => string | WorkflowNodeData[K]
) {
  const value = useAppStore((s) => {
    const node = s.nodes.find((n) => n.id === id);
    return (node?.data?.[key] ?? defaultValue) as WorkflowNodeData[K];
  });

  const setValue = useCallback(
    (next: WorkflowNodeData[K] | ((prev: WorkflowNodeData[K]) => WorkflowNodeData[K])) => {
      const resolved = typeof next === 'function' ? (next as (p: WorkflowNodeData[K]) => WorkflowNodeData[K])(value) : next;
      const stored = serializer ? serializer(resolved) : resolved;
      graphApi.setParam(id, key, stored as WorkflowNodeData[K]);
    },
    [id, key, value, serializer]
  );

  const setFromString = useCallback(
    (str: string) => {
      const parsed = parser ? parser(str) : (str as unknown as WorkflowNodeData[K]);
      setValue(parsed);
    },
    [parser, setValue]
  );

  return [value, setValue, setFromString] as const;
}

export function useNodeData(id: string) {
  const data = useAppStore((s) => s.nodes.find((n) => n.id === id)?.data);
  const setField = useCallback(
    <K extends keyof WorkflowNodeData>(key: K, value: WorkflowNodeData[K]) => {
      graphApi.setParam(id, key, value);
    },
    [id]
  );
  const setFields = useCallback(
    (partial: Partial<WorkflowNodeData>) => {
      graphApi.setParams(id, partial);
    },
    [id]
  );
  return { data, setField, setFields };
}
