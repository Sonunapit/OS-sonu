import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Bell, Wifi, Volume2, BatteryFull, LayoutGrid, Power } from 'lucide-react';
import gsap from 'gsap';
import { useEffect, useRef } from 'react';
import { useOS } from '../../store/osStore.js';
import { APPS, APP_IDS } from '../../apps/registry.js';
import { useClock, fmtTime, fmtDate } from '../../hooks/useClock.js';
import Wallpaper from '../shared/Wallpaper.jsx';
import WindowLayer from './WindowLayer.jsx';
import { useContextMenu, ContextMenu } from '../shared/useDesktopMenu.jsx';

const PINNED = ['about', 'projects', 'resume', 'terminal', 'gallery', 'contact'];

export default function WindowsDesktop() {
  const { windows, openApp, minimize, focus, setOS, reboot } = useOS();
  const now = useClock(30000);
  const [menu, setMenu] = useState(null); // 'start' | 'notif' | null
  const [q, setQ] = useState('');
  const ctx = useContextMenu();
  const root = useRef(null);

  useEffect(() => {
    if (useOS.getState().reduceMotion) return;
    const c = gsap.context(() => {
      gsap.from('.icon-in', { opacity: 0, y: 16, stagger: 0.05, duration: 0.5, ease: 'power2.out' });
      gsap.from('.dock-in', { yPercent: 160, duration: 0.7, ease: 'power3.out', delay: 0.15 });
    }, root);
    return () => c.revert();
  }, []);

  const results = APP_IDS.filter((id) => APPS[id].title.toLowerCase().includes(q.toLowerCase()));
  const launch = (id) => { openApp(id); setMenu(null); setQ(''); };
  const dockClick = (id) => {
    const w = windows.find((x) => x.appId === id);
    if (!w) return openApp(id);
    const top = Math.max(...windows.map((x) => x.z));
    w.minimized || w.z < top ? openApp(id) : minimize(w.id);
  };
  const dockIds = [...new Set([...PINNED, ...windows.map((w) => w.appId)])];

  return (
    <div ref={root} className="os-windows h-full relative overflow-hidden select-none" onContextMenu={ctx.onContextMenu} onPointerDown={() => setMenu(null)}>
      <Wallpaper os="windows" />
      <div className="absolute left-4 top-4 grid gap-2">
        {['about', 'projects', 'resume', 'files'].map((id) => { const A = APPS[id]; return (
          <button key={id} className="icon-in w-20 py-2 rounded-xl hover:bg-white/10 flex flex-col items-center gap-1 text-xs" onDoubleClick={() => openApp(id)} onClick={(e) => e.detail > 1 || undefined} aria-label={`Open ${A.title}`}>
            <span className="h-11 w-11 rounded-xl grid place-items-center" style={{ background: `linear-gradient(145deg, ${A.tint[0]}, ${A.tint[1]})` }}><A.icon size={22} color="#fff" /></span>{A.title}
          </button>); })}
      </div>

      <WindowLayer chrome="windows" insets={{ bottom: 76 }} />

      <AnimatePresence>
        {menu === 'start' && (
          <motion.div key="start" onPointerDown={(e) => e.stopPropagation()} initial={{ opacity: 0, y: 24, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 24 }} transition={{ duration: 0.18 }}
            className="glass absolute z-[9000] bottom-20 left-1/2 -translate-x-1/2 w-[min(560px,94vw)] rounded-2xl p-5 shadow-2xl">
            <label className="flex items-center gap-2 field !rounded-full"><Search size={16} className="text-muted" /><input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search apps" className="bg-transparent outline-none w-full" aria-label="Search apps" /></label>
            <div className="mt-4 grid grid-cols-4 sm:grid-cols-5 gap-2 max-h-72 scroll-y">
              {results.map((id) => { const A = APPS[id]; return (
                <button key={id} onClick={() => launch(id)} className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-white/10 text-xs">
                  <span className="h-10 w-10 rounded-xl grid place-items-center" style={{ background: `linear-gradient(145deg, ${A.tint[0]}, ${A.tint[1]})` }}><A.icon size={20} color="#fff" /></span>{A.title}
                </button>); })}
              {!results.length && <p className="col-span-full text-sm text-muted p-4">No app matches “{q}”.</p>}
            </div>
            <div className="mt-4 pt-3 border-t border-line flex justify-between items-center text-sm">
              <span className="font-display">Sonu Kumar Napit</span>
              <span className="flex gap-2"><button className="btn" onClick={() => setOS(null)}>Switch system</button><button className="btn" onClick={reboot} aria-label="Restart"><Power size={14} /></button></span>
            </div>
          </motion.div>
        )}
        {menu === 'notif' && (
          <motion.aside key="notif" onPointerDown={(e) => e.stopPropagation()} initial={{ x: 380, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 380, opacity: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 32 }}
            className="glass absolute z-[9000] right-3 bottom-20 top-3 w-80 rounded-2xl p-4 shadow-2xl">
            <p className="font-display text-lg">{fmtTime(now)}</p><p className="text-sm text-muted mb-4">{fmtDate(now)}</p>
            <div className="rounded-xl bg-raised p-3 text-sm"><p className="font-medium">Welcome to SONU OS</p><p className="text-muted">Open Projects to see what Sonu has built.</p></div>
          </motion.aside>
        )}
      </AnimatePresence>

      <nav className="dock-in glass absolute z-[9500] bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1 px-2 py-2 rounded-2xl shadow-2xl max-w-[96vw]" aria-label="Taskbar" onPointerDown={(e) => e.stopPropagation()}>
        <button aria-label="Start" onClick={() => setMenu(menu === 'start' ? null : 'start')} className="h-11 w-11 grid place-items-center rounded-xl hover:bg-white/10"><LayoutGrid size={22} className="text-accent" /></button>
        <button aria-label="Search" onClick={() => setMenu('start')} className="h-11 w-11 grid place-items-center rounded-xl hover:bg-white/10"><Search size={20} /></button>
        <span className="w-px h-6 bg-line mx-1" />
        {dockIds.map((id) => { const A = APPS[id]; const open = windows.some((w) => w.appId === id); return (
          <motion.button key={id} whileHover={{ y: -3 }} whileTap={{ scale: 0.92 }} onClick={() => dockClick(id)} aria-label={A.title} title={A.title} className="relative h-11 w-11 grid place-items-center rounded-xl hover:bg-white/10">
            <A.icon size={22} />{open && <span className="absolute bottom-0.5 h-1 w-3 rounded-full bg-accent" />}
          </motion.button>); })}
        <span className="w-px h-6 bg-line mx-1" />
        <div className="hidden sm:flex items-center gap-3 px-2 text-muted"><Wifi size={15} /><Volume2 size={15} /><BatteryFull size={15} /></div>
        <button onClick={() => setMenu(menu === 'notif' ? null : 'notif')} className="px-2 text-xs text-right leading-tight hover:bg-white/10 rounded-lg py-1" aria-label="Notifications and calendar">
          <div>{fmtTime(now)}</div><div className="text-muted">{fmtDate(now, { day: 'numeric', month: 'short' })}</div>
        </button>
        <button aria-label="Notifications" onClick={() => setMenu('notif')} className="h-9 w-9 grid place-items-center rounded-xl hover:bg-white/10"><Bell size={16} /></button>
      </nav>
      <ContextMenu pos={ctx.pos} />
    </div>
  );
}
