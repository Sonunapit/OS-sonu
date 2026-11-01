import { create } from 'zustand';
import { APPS } from '../apps/registry.js';

const MOBILE = ['iphone', 'android'];
let z = 10;
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

export const useOS = create((set, get) => ({
  booted: false,
  os: null, // 'windows' | 'macos' | 'linux' | 'iphone' | 'android' | null (selector)
  mode: 'dark',
  reduceMotion: typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches,
  workspace: 1,
  windows: [],
  mobileApp: null,
  recents: [],

  finishBoot: () => set({ booted: true }),
  setOS: (os) => set({ os, windows: [], mobileApp: null, workspace: 1, recents: [] }),
  reboot: () => set({ booted: false, os: null, windows: [], mobileApp: null, workspace: 1, recents: [] }),
  setMode: (mode) => set({ mode }),
  toggleMode: () => set((s) => ({ mode: s.mode === 'dark' ? 'light' : 'dark' })),
  setReduceMotion: (reduceMotion) => set({ reduceMotion }),
  setWorkspace: (workspace) => set({ workspace }),

  openApp: (id) => {
    const app = APPS[id];
    if (!app) return;
    const { os, windows, workspace } = get();
    if (MOBILE.includes(os)) {
      set((s) => ({ mobileApp: id, recents: [id, ...s.recents.filter((x) => x !== id)].slice(0, 8) }));
      return;
    }
    const existing = windows.find((w) => w.appId === id);
    if (existing) {
      set({ windows: windows.map((w) => (w.id === existing.id ? { ...w, minimized: false, ws: workspace, z: ++z } : w)) });
      return;
    }
    const n = windows.length % 6;
    const vw = window.innerWidth, vh = window.innerHeight;
    const w = Math.min(app.size.w, vw - 32), h = Math.min(app.size.h, vh - 140);
    set({ windows: [...windows, { id: `${id}-${Date.now()}`, appId: id, x: Math.max(8, 110 + n * 30), y: 24 + n * 26, w, h, z: ++z, minimized: false, maximized: false, snapped: false, prev: null, ws: workspace }] });
  },
  closeMobileApp: () => set({ mobileApp: null }),

  patch: (id, fn) => set((s) => ({ windows: s.windows.map((w) => (w.id === id ? { ...w, ...fn(w) } : w)) })),
  focus: (id) => get().patch(id, () => ({ z: ++z })),
  closeWindow: (id) => set((s) => ({ windows: s.windows.filter((w) => w.id !== id) })),
  minimize: (id) => get().patch(id, () => ({ minimized: true })),
  move: (id, x, y) => get().patch(id, () => ({ x, y })),
  resize: (id, rect) => get().patch(id, () => rect),
  toggleMax: (id) =>
    get().patch(id, (w) =>
      w.maximized ? { maximized: false, ...(w.prev || {}), prev: null } : { maximized: true, prev: w.snapped ? w.prev : { x: w.x, y: w.y, w: w.w, h: w.h }, snapped: false }
    ),
  snap: (id, side, b) =>
    get().patch(id, (w) => {
      if (side === 'max') return { maximized: true, prev: w.snapped ? w.prev : { x: w.x, y: w.y, w: w.w, h: w.h } };
      const half = Math.floor(b.width / 2);
      return { snapped: true, maximized: false, prev: w.prev || { x: w.x, y: w.y, w: w.w, h: w.h }, x: side === 'left' ? 0 : half, y: 0, w: half, h: b.height };
    }),
  unsnap: (id, pointerX, bounds) =>
    get().patch(id, (w) => {
      const p = w.prev || { w: 640, h: 440 };
      return { snapped: false, prev: null, w: p.w, h: p.h, x: clamp(pointerX - p.w / 2, 0, Math.max(0, bounds.width - p.w)), y: 0 };
    }),
  isMobile: () => MOBILE.includes(get().os),
}));
