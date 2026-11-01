import { create } from 'zustand';
import { api } from '../services/api.js';
import { FALLBACK } from '../data/fallback.js';

export const usePortfolio = create((set, get) => ({
  data: FALLBACK,
  status: 'idle', // idle | loading | ready | offline
  async load() {
    if (get().status === 'loading') return;
    set({ status: 'loading' });
    try {
      const remote = await api.publicAll();
      // Arrays come straight from the server so unpublished content never reappears from fallback.
      set({ data: { ...FALLBACK, ...Object.fromEntries(Object.entries(remote).filter(([, v]) => v !== null)) }, status: 'ready' });
    } catch {
      set({ data: FALLBACK, status: 'offline' });
    }
  },
}));
