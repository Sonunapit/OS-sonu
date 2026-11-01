import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Sun, Moon, Wifi, BatteryFull, Search } from 'lucide-react';
import gsap from 'gsap';
import { useOS } from '../../store/osStore.js';
import { APPS } from '../../apps/registry.js';
import { usePortfolio } from '../../store/portfolioStore.js';
import { useClock, fmtTime, fmtDate } from '../../hooks/useClock.js';
import Wallpaper from '../shared/Wallpaper.jsx';
import WindowLayer from '../windows/WindowLayer.jsx';
import { useContextMenu, ContextMenu } from '../shared/useDesktopMenu.jsx';

const DOCK = ['about', 'projects', 'skills', 'resume', 'gallery', 'terminal', 'files', 'contact', 'settings'];

// Dock icon that grows as the pointer gets close (magnification).
function DockIcon({ id, mouseX, running, onOpen }) {
  const ref = useRef(null);
  const A = APPS[id];
  const dist = useTransform(mouseX, (x) => { const b = ref.current?.getBoundingClientRect(); return b ? x - (b.left + b.width / 2) : 999; });
  const size = useSpring(useTransform(dist, [-130, 0, 130], [46, 72, 46]), { mass: 0.1, stiffness: 200, damping: 14 });
  return (
    <motion.button ref={ref} style={{ width: size, height: size }} onClick={() => onOpen(id)} aria-label={A.title} title={A.title}
      className="relative rounded-[22%] grid place-items-center shadow-lg shrink-0" whileTap={{ scale: 0.9 }}>
      <span className="absolute inset-0 rounded-[22%]" style={{ background: `linear-gradient(145deg, ${A.tint[0]}, ${A.tint[1]})` }} />
      <A.icon className="relative" size="52%" color="#fff" />
      {running && <span className="absolute -bottom-2 h-1 w-1 rounded-full bg-white/80" />}
    </motion.button>
  );
}

export default function MacDesktop() {
  const { windows, openApp, toggleMode, mode, setOS, reboot, focus } = useOS();
  const profile = usePortfolio((s) => s.data.profile);
  const now = useClock(30000);
  const mouseX = useMotionValue(-999);
  const ctx = useContextMenu();
  const root = useRef(null);
  const [apple, setApple] = useState(false);
  const topWin = [...windows].filter((w) => !w.minimized).sort((a, b) => b.z - a.z)[0];

  useEffect(() => {
    if (useOS.getState().reduceMotion) return;
    const c = gsap.context(() => {
      gsap.from('.bar-in', { yPercent: -100, duration: 0.5, ease: 'power3.out' });
      gsap.from('.widget-in', { opacity: 0, x: 24, stagger: 0.1, duration: 0.6, ease: 'power2.out', delay: 0.2 });
      gsap.from('.dock-in', { yPercent: 140, duration: 0.7, ease: 'back.out(1.2)', delay: 0.1 });
    }, root);
    return () => c.revert();
  }, []);

  const open = (id) => { const w = windows.find((x) => x.appId === id); if (w && !w.minimized) focus(w.id); else openApp(id); };

  return (
    <div ref={root} className="os-macos h-full relative overflow-hidden select-none" onContextMenu={ctx.onContextMenu} onPointerDown={() => setApple(false)}>
      <Wallpaper os="macos" />
      <header className="bar-in glass absolute top-0 inset-x-0 h-7 z-[9500] flex items-center justify-between px-3 text-[13px] !border-x-0 !border-t-0" onPointerDown={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-4">
          <button onClick={() => setApple(!apple)} className="font-display font-bold text-base leading-none" aria-label="System menu">S</button>
          <span className="font-semibold">{topWin ? APPS[topWin.appId].title : 'Finder'}</span>
          <span className="hidden md:flex gap-4 text-muted"><span>File</span><span>Edit</span><span>View</span><span>Window</span><span>Help</span></span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={toggleMode} aria-label="Toggle theme">{mode === 'dark' ? <Sun size={14} /> : <Moon size={14} />}</button>
          <Wifi size={14} className="hidden sm:block" /><BatteryFull size={14} className="hidden sm:block" /><Search size={14} />
          <span>{fmtDate(now, { weekday: 'short', day: 'numeric', month: 'short' })} {fmtTime(now)}</span>
        </div>
        {apple && (
          <div className="glass absolute left-2 top-8 w-52 p-1 rounded-xl shadow-2xl">
            {[['About Sonu', () => openApp('about')], ['System info', () => openApp('sysinfo')], ['Switch system', () => setOS(null)], ['Restart…', reboot]].map(([t, fn]) => (
              <button key={t} className="block w-full text-left px-3 py-1.5 rounded-md text-sm hover:bg-accent/30" onClick={() => { fn(); setApple(false); }}>{t}</button>))}
          </div>
        )}
      </header>

      <aside className="absolute right-5 top-12 w-60 grid gap-3 hidden md:grid" aria-label="Widgets">
        <div className="widget-in glass rounded-3xl p-4"><p className="text-xs text-muted">{fmtDate(now)}</p><p className="font-display text-4xl">{fmtTime(now)}</p></div>
        <button onClick={() => openApp('about')} className="widget-in glass rounded-3xl p-4 text-left hover:bg-white/10 transition-colors">
          <p className="font-display text-lg leading-tight">{profile?.name}</p><p className="text-sm text-muted">{profile?.headline}</p>
        </button>
      </aside>

      <WindowLayer chrome="macos" insets={{ top: 28 }} />

      <nav className="dock-in absolute z-[9400] bottom-2 left-1/2 -translate-x-1/2 glass rounded-[26px] px-3 py-2 flex items-end gap-2.5 max-w-[96vw] overflow-x-auto"
        onMouseMove={(e) => mouseX.set(e.clientX)} onMouseLeave={() => mouseX.set(-999)} aria-label="Dock" onPointerDown={(e) => e.stopPropagation()}>
        {DOCK.map((id) => <DockIcon key={id} id={id} mouseX={mouseX} running={windows.some((w) => w.appId === id)} onOpen={open} />)}
      </nav>
      <ContextMenu pos={ctx.pos} />
    </div>
  );
}
