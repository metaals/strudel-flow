import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { nanoid } from 'nanoid';

import type { iconMapping } from '@/data/icon-mapping';
import { isCustomInstrumentEffect } from '@/lib/custom-instrument';

export type SavedNodeKind = 'instrument' | 'effect';

export interface SavedNode {
  id: string;
  label: string;
  icon?: keyof typeof iconMapping;
  code: string;
  kind: SavedNodeKind;
  createdAt: number;
}

type SavedNodesStore = {
  savedNodes: SavedNode[];
  add: (entry: {
    label: string;
    icon?: keyof typeof iconMapping;
    code: string;
    kind: SavedNodeKind;
  }) => void;
  remove: (id: string) => void;
  rename: (id: string, label: string) => void;
};

export const useSavedNodesStore = create<SavedNodesStore>()(
  persist(
    (set) => ({
      savedNodes: [],
      add: ({ label, icon, code, kind }) =>
        set((state) => ({
          savedNodes: [
            ...state.savedNodes,
            { id: nanoid(), label, icon, code, kind, createdAt: Date.now() },
          ],
        })),
      remove: (id) =>
        set((state) => ({
          savedNodes: state.savedNodes.filter((n) => n.id !== id),
        })),
      rename: (id, label) =>
        set((state) => ({
          savedNodes: state.savedNodes.map((n) =>
            n.id === id ? { ...n, label } : n
          ),
        })),
    }),
    {
      name: 'sf_custom_instruments',
      version: 1,
      migrate: (persisted: unknown, version: number) => {
        const state = (persisted ?? {}) as Record<string, unknown>;
        if (version < 1) {
          const legacy = (state.instruments ?? []) as Array<{
            id: string;
            label: string;
            icon?: keyof typeof iconMapping;
            code: string;
            createdAt: number;
          }>;
          return {
            savedNodes: legacy.map((i) => ({
              ...i,
              kind: isCustomInstrumentEffect(i.code)
                ? ('effect' as const)
                : ('instrument' as const),
            })),
          };
        }
        return state as { savedNodes: SavedNode[] };
      },
    }
  )
);
