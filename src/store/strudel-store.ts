import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

type StrudelStore = {
  pattern: string;
  cpm: string;
  bpc: string;
  masterVolume: number;
  setPattern: (pattern: string) => void;
  setCpm: (cpm: string) => void;
  setBpc: (bpc: string) => void;
  setMasterVolume: (masterVolume: number) => void;
};

export const useStrudelStore = create<StrudelStore>()(devtools((set) => ({
  pattern: '',
  cpm: '120',
  bpc: '4',
  masterVolume: 100,
  setPattern: (pattern) => set({ pattern }),
  setCpm: (cpm) => set({ cpm }),
  setBpc: (bpc) => set({ bpc }),
  setMasterVolume: (masterVolume) => set({ masterVolume }),
}), { name: 'strudel-store' }));