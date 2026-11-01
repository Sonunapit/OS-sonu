import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Signal, Wifi, BatteryFull, ChevronLeft, Lock } from 'lucide-react';
import { useOS } from '../../store/osStore.js';
import { APPS, MOBILE_APP_IDS } from '../../apps/registry.js';
import { usePortfolio } from '../../store/portfolioStore.js';
import { useClock, fmtTime, fmtDate } from '../../hooks/useClock.js';
import MobileAppHost from '../shared/MobileAppHost.jsx';

const DOCK = ['about', 'projects', 'resume', 'contact'];

function Icon({ id, label = true, onOpen }) {
  const A = APPS[id];
  return (
    <motion.button whileTap={{ scale: 0.88 }} onClick={() => onOpen(id)} className="flex flex-col items-center gap-1.5" aria-label={A.title}>
      <span className="h-[60px] w-[60px] rounded-[16px] grid place-items-center shadow-lg" style={{ background: `linear-gradient(150deg, ${A.tint[0]}, ${A.tint[1]})` }}><A.icon size={28} color="#fff" /></span>
      {label && <span className="text-[11px] text-white">{A.title}</span>}
    </motion.button>
  );
}

export default function IPhoneOS() {
  const { mobileApp, openApp, closeMobileApp, setOS } = useOS();
  const profile = usePortfolio((s) => s.data.profile);
  const now = useClock(15000);
  const [locked, setLocked] = useState(true);
  const [center, setCenter] = useState(false);

  const Status = ({ dark }) => (
    <button onClick={() => !locked && setCenter(true)} className={`safe-top absolute top-0 inset-x-0 z-30 flex items-center justify-between px-7 pb-1 pt-2 text-[13px] font-semibold ${dark ? 'text-fg' : 'text-white'}`} aria-label="Status bar. Open notifications">
      <span>{fmtTime(now)}</span><span className="flex items-center gap-1"><Signal size={14} /><Wifi size={14} /><BatteryFull size={18} /></span>
    </button>
  );

  return (
    <div className="os-iphone h-full relative overflow-hidden wp-iphone text-white select-none">
      <AnimatePresence>
        {locked && (
          <motion.section key="lock" className="absolute inset-0 z-40 wp-iphone flex flex-col items-center safe-top safe-bottom" drag="y" dragConstraints={{ top: 0, bottom: 0 }} dragElastic={{ top: 0.6, bottom: 0 }}
            onDragEnd={(_, i) => i.offset.y < -110 && setLocked(false)} exit={{ y: '-100%', opacity: 0.6 }} transition={{ duration: 0.45, ease: [0.3, 0.7, 0.2, 1] }}>
            <Lock size={16} className="mt-14 opacity-80" />
            <p className="mt-2 text-lg opacity-90">{fmtDate(now)}</p>
            <p className="font-display text-[88px] leading-none font-bold tracking-tight">{fmtTime(now).replace(/\s?[AP]M/i, '')}</p>
            <div className="glass mt-8 mx-6 rounded-3xl p-4 w-[calc(100%-3rem)] max-w-sm text-white">
              <p className="text-xs opacity-70">SONU OS</p><p className="font-medium">{profile?.name}</p><p className="text-sm opacity-80">{profile?.headline}</p>
            </div>
            <button onClick={() => setLocked(false)} className="mt-auto mb-8 text-sm opacity-90 animate-pulse">Swipe up to unlock</button>
          </motion.section>
        )}
      </AnimatePresence>

      <Status />
      <main className="absolute inset-0 safe-top pt-14 px-6 flex flex-col">
        <div className="glass rounded-3xl p-4 text-white mb-6">
          <p className="text-xs opacity-70">{fmtDate(now)}</p>
          <p className="font-display text-2xl leading-tight">{profile?.name}</p><p className="text-sm opacity-80">{profile?.headline}</p>
        </div>
        <div className="grid grid-cols-4 gap-y-5 gap-x-3 justify-items-center">
          {MOBILE_APP_IDS.map((id) => <Icon key={id} id={id} onOpen={openApp} />)}
        </div>
        <div className="mt-auto mb-3 glass rounded-[30px] p-3 flex justify-around safe-bottom !mb-6">{DOCK.map((id) => <Icon key={id} id={id} label={false} onOpen={openApp} />)}</div>
      </main>

      <AnimatePresence>
        {mobileApp && (
          <motion.div key={mobileApp} className="absolute inset-0 z-20 bg-bg text-fg flex flex-col" initial={{ scale: 0.7, opacity: 0, borderRadius: 40 }} animate={{ scale: 1, opacity: 1, borderRadius: 0 }} exit={{ scale: 0.7, opacity: 0, borderRadius: 40 }} transition={{ type: 'spring', stiffness: 320, damping: 32 }}>
            <header className="safe-top pt-10 px-3 pb-2 flex items-center border-b border-line">
              <button onClick={closeMobileApp} className="flex items-center text-accent text-[15px]" aria-label="Back to home"><ChevronLeft size={22} />Home</button>
              <p className="absolute inset-x-0 text-center font-semibold pointer-events-none pt-10 top-0">{APPS[mobileApp].title}</p>
            </header>
            <div className="flex-1 min-h-0"><MobileAppHost id={mobileApp} /></div>
            <button onClick={closeMobileApp} className="safe-bottom py-2 grid place-items-center" aria-label="Go home"><span className="h-1.5 w-32 rounded-full bg-fg/70" /></button>
          </motion.div>
        )}
        {center && (
          <motion.section key="nc" className="absolute inset-0 z-50 glass !rounded-none safe-top p-5 pt-14" initial={{ y: '-100%' }} animate={{ y: 0 }} exit={{ y: '-100%' }} transition={{ type: 'spring', stiffness: 300, damping: 34 }} drag="y" dragConstraints={{ top: 0, bottom: 0 }} onDragEnd={(_, i) => i.offset.y < -80 && setCenter(false)}>
            <p className="font-display text-2xl">Notifications</p>
            <div className="mt-4 rounded-2xl bg-raised p-3 text-sm text-fg"><p className="font-medium">Welcome to SONU OS</p><p className="text-muted">Tap Projects to see what Sonu has built.</p></div>
            <div className="mt-3 flex gap-2"><button className="btn" onClick={() => { setCenter(false); setOS(null); }}>Switch system</button><button className="btn" onClick={() => setCenter(false)}>Close</button></div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
}
