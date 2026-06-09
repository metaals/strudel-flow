import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface NodeError {
  nodeId: string;
  type: string;
  message: string;
  ts: number;
}

interface ErrorState {
  errors: NodeError[];
  pushError: (e: Omit<NodeError, 'ts'>) => void;
  clearErrors: () => void;
}

export const useErrorStore = create<ErrorState>()(
  devtools((set) => ({
    errors: [],
    pushError: (e) => set((s) => ({ errors: [...s.errors.slice(-49), { ...e, ts: Date.now() }] })),
    clearErrors: () => set({ errors: [] }),
  }), { name: 'error-store' })
);