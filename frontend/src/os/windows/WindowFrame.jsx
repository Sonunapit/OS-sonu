import { memo, Suspense } from 'react';
import { motion } from 'framer-motion';
import { X, Minus, Square, Copy } from 'lucide-react';
import { useOS } from '../../store/osStore.js';
import { APPS } from '../../apps/registry.js';

const MIN_W = 340, MIN_H = 240;

function track(e, onMove, onUp) {
  const move = (ev) => onMove(ev);
  const up = (ev) => { window.removeEventListener('pointermove', move); onUp?.(ev); };
  window.addEventListener('pointermove', move);
  window.addEventListener('pointerup', up, { once: true });
}

function Controls({ chrome, win }) {
  const { closeWindow, minimize, toggleMax } = useOS.getState();
  const stop = (e) => e.stopPropagation();
  if (chrome === 'macos') {
    const dot = 'h-3 w-3 rounded-full border border-black/10';
    return (
      <div className="flex gap-2 pl-3" data-nodrag onPointerDown={stop}>
        <button aria-label="Close" className={`${dot} bg-[#ff5f57]`} onClick={() => closeWindow(win.id)} />
        <button aria-label="Minimize" className={`${dot} bg-[#febc2e]`} onClick={() => minimize(win.id)} />
        <button aria-label="Maximize" className={`${dot} bg-[#28c840]`} onClick={() => toggleMax(win.id)} />
      </div>
    );
  }
  const base = chrome === 'windows' ? 'h-9 w-11 grid place-items-center hover:bg-white/10' : 'h-6 w-6 rounded-full grid place-items-center bg-white/10 hover:bg-white/20';
  return (
    <div className={`flex items-center ${chrome === 'linux' ? 'gap-1.5 pr-2' : ''}`} data-nodrag onPointerDown={stop}>
      <button aria-label="Minimize" className={base} onClick={() => minimize(win.id)}><Minus size={14} /></button>
      <button aria-label={win.maximized ? 'Restore' : 'Maximize'} className={base} onClick={() => toggleMax(win.id)}>{win.maximized ? <Copy size={12} /> : <Square size={12} />}</button>
      <button aria-label="Close" className={`${base} ${chrome === 'windows' ? 'hover:!bg-red-500' : 'hover:!bg-red-500/80'}`} onClick={() => closeWindow(win.id)}><X size={15} /></button>
    </div>
  );
}

const WindowFrame = memo(function WindowFrame({ win, chrome, layerRef, active }) {
  const app = APPS[win.appId];
  const Body = app.Component;
  const { focus, move, resize, snap, unsnap, toggleMax } = useOS.getState();
  const reduce = useOS((s) => s.reduceMotion);
  const radius = chrome === 'windows' ? 12 : chrome === 'macos' ? 14 : 10;

  const style = win.maximized
    ? { left: 0, top: 0, width: '100%', height: '100%', borderRadius: 0 }
    : { left: win.x, top: win.y, width: win.w, height: win.h, borderRadius: radius };

  const onDragStart = (e) => {
    if (e.button !== 0 || e.target.closest('[data-nodrag]')) return;
    focus(win.id);
    if (win.maximized) return;
    const el = e.currentTarget.parentElement;
    const b = layerRef.current.getBoundingClientRect();
    let { x, y, w } = win;
    if (win.snapped) { unsnap(win.id, e.clientX - b.left, b); const s = useOS.getState().windows.find((q) => q.id === win.id); x = s.x; y = s.y; w = s.w; }
    const sx = e.clientX, sy = e.clientY;
    let nx = x, ny = y;
    track(e, (ev) => {
      nx = Math.min(Math.max(x + ev.clientX - sx, 120 - w), b.width - 120);
      ny = Math.min(Math.max(y + ev.clientY - sy, 0), b.height - 36);
      el.style.left = `${nx}px`; el.style.top = `${ny}px`;
    }, (ev) => {
      move(win.id, nx, ny);
      const px = ev.clientX - b.left, py = ev.clientY - b.top;
      if (py < 6) snap(win.id, 'max', b);
      else if (px < 6) snap(win.id, 'left', b);
      else if (px > b.width - 6) snap(win.id, 'right', b);
    });
  };

  const onResize = (dir) => (e) => {
    e.stopPropagation(); e.preventDefault();
    focus(win.id);
    const sx = e.clientX, sy = e.clientY, { w, h } = win;
    const el = e.currentTarget.parentElement;
    let nw = w, nh = h;
    track(e, (ev) => {
      if (dir.includes('r')) nw = Math.max(MIN_W, w + ev.clientX - sx);
      if (dir.includes('b')) nh = Math.max(MIN_H, h + ev.clientY - sy);
      el.style.width = `${nw}px`; el.style.height = `${nh}px`;
    }, () => resize(win.id, { w: nw, h: nh, snapped: false }));
  };

  const titleBar = {
    windows: 'h-9 pl-3 justify-between',
    macos: 'h-10 justify-start',
    linux: 'h-9 justify-between',
  }[chrome];

  return (
    <motion.div
      role="dialog" aria-label={app.title}
      onPointerDown={() => !active && focus(win.id)}
      initial={reduce ? false : { opacity: 0, scale: 0.94, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.9, y: 24 }}
      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
      style={{ position: 'absolute', zIndex: win.z, pointerEvents: 'auto', ...style }}
      className={`glass flex flex-col overflow-hidden shadow-[0_24px_60px_-12px_rgba(0,0,0,0.55)] ${active ? '' : 'opacity-95 saturate-75'}`}
    >
      <div className={`relative flex items-center shrink-0 select-none touch-none border-b border-line ${titleBar}`} onPointerDown={onDragStart} onDoubleClick={() => toggleMax(win.id)}>
        {chrome === 'macos' && <Controls chrome={chrome} win={win} />}
        <div className={`flex items-center gap-2 text-[13px] ${chrome === 'macos' || chrome === 'linux' ? 'absolute inset-x-0 justify-center pointer-events-none' : ''}`}>
          {chrome === 'windows' && <app.icon size={15} />}
          <span className="font-medium">{app.title}</span>
        </div>
        {chrome !== 'macos' && <Controls chrome={chrome} win={win} />}
      </div>
      <div className="flex-1 min-h-0 scroll-y bg-bg/40">
        <Suspense fallback={<p className="p-6 text-muted text-sm">Opening {app.title}…</p>}><Body /></Suspense>
      </div>
      {!win.maximized && (<>
        <div onPointerDown={onResize('r')} className="absolute right-0 top-8 bottom-3 w-1.5 cursor-ew-resize" />
        <div onPointerDown={onResize('b')} className="absolute bottom-0 left-3 right-3 h-1.5 cursor-ns-resize" />
        <div onPointerDown={onResize('rb')} className="absolute right-0 bottom-0 h-4 w-4 cursor-nwse-resize" />
      </>)}
    </motion.div>
  );
});
export default WindowFrame;
