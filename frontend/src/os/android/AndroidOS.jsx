import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wifi, BatteryFull, ChevronLeft, Circle, Square, Moon, RefreshCw, Search, LayoutGrid, FileText } from 'lucide-react';
import { useOS } from '../../store/osStore.js';
import { APPS, MOBILE_APP_IDS } from '../../apps/registry.js';
import { usePortfolio } from '../../store/portfolioStore.js';
import { useClock, fmtTime, fmtDate } from '../../hooks/useClock.js';
import MobileAppHost from '../shared/MobileAppHost.jsx';

const DOCK = ['about', 'projects', 'resume', 'contact'];

function Icon({ id, label = true, onOpen }) {
  const A = APPS[id];
  return (
    <motion.button whileTap={{ scale: 0.88 }} onClick={() => onOpen(id)} className="flex flex-col items-center gap-1" aria-label={A.title}>
      <span className="h-14 w-14 rounded-full grid place-items-center shadow-md" style={{ background: `linear-gradient(150deg, ${A.tint[0]}, ${A.tint[1]})` }}><A.icon size={26} color="#fff" /></span>
      {label && <span className="text-[11px] text-white/90">{A.title}</span>}
    </motion.button>
  );
}

export default function AndroidOS() {
  const { mobileApp, openApp, closeMobileApp, setOS, mode, toggleMode, recents, reduceMotion, setReduceMotion } = useOS();
  const profile = usePortfolio((s) => s.data.profile);
  const now = useClock(15000);
  const [locked, setLocked] = useState(true);
  const [shade, setShade] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [showRecents, setShowRecents] = useState(false);
  const [q, setQ] = useState('');

  const tile = (on, label, Icon_, fn) => (
    <button onClick={fn} aria-pressed={on} className={`rounded-3xl p-3 text-left text-sm flex flex-col gap-2 ${on ? 'bg-accent text-black' : 'bg-white/10'}`}><Icon_ size={18} />{label}</button>
  );
  const go = (id) => { openApp(id); setDrawer(false); setShowRecents(false); };
  const home = () => { closeMobileApp(); setDrawer(false); setShowRecents(false); };

  return (
    <div className="os-android h-full relative overflow-hidden wp-android text-white select-none">
      <AnimatePresence>
        {locked && (
          <motion.section key="lock" className="absolute inset-0 z-40 wp-android px-8 safe-top safe-bottom flex flex-col" drag="y" dragConstraints={{ top: 0, bottom: 0 }} dragElastic={{ top: 0.6, bottom: 0 }} onDragEnd={(_, i) => i.offset.y < -110 && setLocked(false)} exit={{ opacity: 0, scale: 1.05 }} transition={{ duration: 0.3 }}>
            <p className="mt-24 font-display text-8xl leading-none">{fmtTime(now).replace(/\s?[AP]M/i, '')}</p>
            <p className="mt-2 text-lg opacity-90">{fmtDate(now)}</p>
            <button onClick={() => setLocked(false)} className="mt-auto mb-10 mx-auto rounded-full px-6 py-3 bg-white/15 text-sm">Swipe up or tap to unlock</button>
          </motion.section>
        )}
      </AnimatePresence>

      <button onClick={() => setShade(true)} className="safe-top absolute top-0 inset-x-0 z-30 flex justify-between items-center px-5 pt-2 pb-1 text-xs" aria-label="Status bar. Open quick settings">
        <span>{fmtTime(now)}</span><span className="flex items-center gap-2"><Wifi size={13} /><BatteryFull size={15} /></span>
      </button>

      <main className="absolute inset-0 safe-top pt-12 px-5 flex flex-col">
        <div className="mt-2"><p className="font-display text-6xl leading-none">{fmtTime(now).replace(/\s?[AP]M/i, '')}</p><p className="mt-1 opacity-80">{fmtDate(now)}</p></div>
        <button onClick={() => openApp('about')} className="glass rounded-[28px] p-4 mt-6 text-left text-white"><p className="text-xs opacity-70">Portfolio of</p><p className="font-display text-xl">{profile?.name}</p><p className="text-sm opacity-80">{profile?.headline}</p></button>
        <div className="grid grid-cols-4 gap-y-4 mt-6">{MOBILE_APP_IDS.slice(0, 8).map((id) => <Icon key={id} id={id} onOpen={openApp} />)}</div>
        <div className="mt-auto flex justify-around mb-3">{DOCK.map((id) => <Icon key={id} id={id} label={false} onOpen={openApp} />)}</div>
        <button onClick={() => setDrawer(true)} className="glass rounded-full px-4 py-3 mb-24 flex items-center gap-3 text-sm text-white/80"><Search size={16} />Search apps<LayoutGrid size={16} className="ml-auto" /></button>
      </main>

      <AnimatePresence>
        {mobileApp && (
          <motion.div key={mobileApp} className="absolute inset-0 z-20 bg-bg text-fg flex flex-col" initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', stiffness: 320, damping: 36 }}>
            <header className="safe-top pt-9 px-4 pb-2 flex items-center gap-3 border-b border-line"><button onClick={closeMobileApp} aria-label="Back"><ChevronLeft /></button><p className="font-medium text-lg">{APPS[mobileApp].title}</p></header>
            <div className="flex-1 min-h-0"><MobileAppHost id={mobileApp} /></div>
            <div className="h-14" />
          </motion.div>
        )}
        {drawer && (
          <motion.section key="drawer" className="absolute inset-0 z-[25] glass !rounded-none safe-top pt-14 px-5" initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', stiffness: 300, damping: 34 }}>
            <input className="field !rounded-full !py-3" placeholder="Search apps" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search apps" />
            <div className="grid grid-cols-4 gap-y-5 mt-6 pb-28 scroll-y max-h-[calc(100%-5rem)]">{MOBILE_APP_IDS.filter((id) => APPS[id].title.toLowerCase().includes(q.toLowerCase())).map((id) => <Icon key={id} id={id} onOpen={go} />)}</div>
          </motion.section>
        )}
        {showRecents && (
          <motion.section key="rec" className="absolute inset-0 z-[26] bg-black/70 backdrop-blur-md safe-top pt-16 px-5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <p className="font-display text-xl mb-4">Recent</p>
            {recents.length ? recents.map((id) => <button key={id} onClick={() => go(id)} className="glass w-full rounded-3xl p-4 mb-3 flex items-center gap-3 text-white">{(() => { const A = APPS[id]; return <A.icon size={20} />; })()}{APPS[id].title}</button>) : <p className="text-white/70">Nothing opened yet.</p>}
          </motion.section>
        )}
        {shade && (
          <motion.section key="shade" className="absolute inset-0 z-50 bg-black/80 backdrop-blur-xl safe-top p-5 pt-12" initial={{ y: '-100%' }} animate={{ y: 0 }} exit={{ y: '-100%' }} transition={{ type: 'spring', stiffness: 300, damping: 34 }} drag="y" dragConstraints={{ top: 0, bottom: 0 }} onDragEnd={(_, i) => i.offset.y < -80 && setShade(false)}>
            <p className="font-display text-3xl">{fmtTime(now)}</p>
            <div className="grid grid-cols-2 gap-3 mt-5">
              {tile(mode === 'dark', 'Dark theme', Moon, toggleMode)}
              {tile(reduceMotion, 'Reduce motion', RefreshCw, () => setReduceMotion(!reduceMotion))}
              {tile(false, 'Switch system', LayoutGrid, () => { setShade(false); setOS(null); })}
              {tile(false, 'Open resume', FileText, () => { setShade(false); openApp('resume'); })}
            </div>
            <div className="mt-5 rounded-3xl bg-white/10 p-4 text-sm"><p className="font-medium">Welcome to SONU OS</p><p className="opacity-70">Open the app drawer to browse every app.</p></div>
            <button className="btn mt-5" onClick={() => setShade(false)}>Close</button>
          </motion.section>
        )}
      </AnimatePresence>

      <nav className="safe-bottom absolute z-[45] bottom-0 inset-x-0 h-14 bg-black/35 backdrop-blur-md flex items-center justify-center gap-14 text-white/90" aria-label="Navigation">
        <button onClick={() => (mobileApp ? closeMobileApp() : drawer ? setDrawer(false) : setShowRecents(false))} aria-label="Back"><ChevronLeft size={22} /></button>
        <button onClick={home} aria-label="Home"><Circle size={20} /></button>
        <button onClick={() => setShowRecents(!showRecents)} aria-label="Recent apps"><Square size={18} /></button>
      </nav>
    </div>
  );
}
