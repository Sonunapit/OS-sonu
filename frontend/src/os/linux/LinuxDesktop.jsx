import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Grid3x3, Wifi, Volume2, BatteryFull, Search } from 'lucide-react';
import gsap from 'gsap';
import { useOS } from '../../store/osStore.js';
import { APPS, APP_IDS } from '../../apps/registry.js';
import { useClock, fmtTime, fmtDate } from '../../hooks/useClock.js';
import Wallpaper from '../shared/Wallpaper.jsx';
import WindowLayer from '../windows/WindowLayer.jsx';
import { useContextMenu, ContextMenu } from '../shared/useDesktopMenu.jsx';

const FAV = ['terminal', 'files', 'projects', 'about', 'resume', 'sysinfo'];

export default function LinuxDesktop() {
  const { windows, workspace, setWorkspace, openApp, setOS, reboot } = useOS();
  const now = useClock(30000);
  const [overview, setOverview] = useState(false);
  const [q, setQ] = useState('');
  const ctx = useContextMenu();
  const root = useRef(null);

  useEffect(() => {
    if (useOS.getState().reduceMotion) return;
    const c = gsap.context(() => {
      gsap.from('.panel-in', { yPercent: -100, duration: 0.45, ease: 'power3.out' });
      gsap.from('.side-in', { xPercent: -100, duration: 0.55, ease: 'power3.out', delay: 0.1 });
    }, root);
    return () => c.revert();
  }, []);

  const apps = APP_IDS.filter((id) => APPS[id].title.toLowerCase().includes(q.toLowerCase()));
  const launch = (id) => { openApp(id); setOverview(false); setQ(''); };
  const countIn = (n) => windows.filter((w) => w.ws === n).length;

  return (
    <div ref={root} className="os-linux h-full relative overflow-hidden select-none font-mono" onContextMenu={ctx.onContextMenu}>
      <Wallpaper os="linux" />
      <header className="panel-in absolute top-0 inset-x-0 h-8 z-[9500] bg-black/55 backdrop-blur-md border-b border-white/10 flex items-center justify-between px-2 text-xs text-white">
        <div className="flex items-center gap-2">
          <button onClick={() => setOverview(!overview)} className="px-2 py-1 rounded hover:bg-white/10 text-accent">Activities</button>
          <div className="flex gap-1" role="tablist" aria-label="Workspaces">
            {[1, 2, 3, 4].map((n) => (
              <button key={n} role="tab" aria-selected={workspace === n} onClick={() => setWorkspace(n)} className={`h-5 min-w-5 px-1.5 rounded-full grid place-items-center ${workspace === n ? 'bg-accent text-black' : 'bg-white/10 hover:bg-white/20'}`}>
                {n}{countIn(n) > 0 && workspace !== n ? <span className="ml-1 h-1 w-1 rounded-full bg-accent" /> : null}
              </button>))}
          </div>
        </div>
        <span>{fmtDate(now, { weekday: 'short', day: 'numeric', month: 'short' })}  {fmtTime(now)}</span>
        <div className="flex items-center gap-3"><Wifi size={13} /><Volume2 size={13} /><BatteryFull size={13} /></div>
      </header>

      <nav className="side-in absolute z-[9400] left-0 top-8 bottom-0 w-14 bg-black/45 backdrop-blur-md border-r border-white/10 flex flex-col items-center gap-2 py-3" aria-label="Favorites">
        {FAV.map((id) => { const A = APPS[id]; const run = windows.some((w) => w.appId === id); return (
          <button key={id} onClick={() => openApp(id)} aria-label={A.title} title={A.title} className="relative h-10 w-10 rounded-lg grid place-items-center hover:bg-white/10 text-white">
            <A.icon size={20} />{run && <span className="absolute left-[-8px] h-2 w-1 rounded-full bg-accent" />}
          </button>); })}
        <button onClick={() => setOverview(true)} aria-label="Show all apps" className="mt-auto h-10 w-10 rounded-lg grid place-items-center hover:bg-white/10 text-white"><Grid3x3 size={20} /></button>
      </nav>

      <div className="absolute left-16 top-12 text-xs text-white/70 hidden md:block">
        <p className="text-accent">sonu@sonu-os:~$</p><p>Open the terminal and type <span className="text-white">help</span></p>
      </div>

      <WindowLayer chrome="linux" insets={{ top: 32, left: 56 }} />

      <AnimatePresence>
        {overview && (
          <motion.div key="ov" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-[9800] bg-black/70 backdrop-blur-xl pt-16 px-6 overflow-auto" onClick={() => setOverview(false)}>
            <div className="max-w-3xl mx-auto" onClick={(e) => e.stopPropagation()}>
              <label className="flex items-center gap-2 field !rounded-full max-w-md mx-auto"><Search size={16} className="text-muted" /><input autoFocus value={q} onChange={(e) => setQ(e.target.value)} className="bg-transparent outline-none w-full" placeholder="Type to search" aria-label="Search apps" /></label>
              <div className="mt-10 grid grid-cols-3 sm:grid-cols-5 gap-4 text-white">
                {apps.map((id) => { const A = APPS[id]; return (
                  <button key={id} onClick={() => launch(id)} className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-white/10 text-xs"><A.icon size={30} className="text-accent" />{A.title}</button>); })}
              </div>
              <div className="mt-10 flex justify-center gap-2"><button className="btn" onClick={() => setOS(null)}>Switch system</button><button className="btn" onClick={reboot}>Reboot</button></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <ContextMenu pos={ctx.pos} />
    </div>
  );
}
