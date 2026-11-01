import { useState } from 'react';
import { motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import { useOS } from '../../store/osStore.js';
import { useDeviceClass, prefersIOS } from '../../hooks/useDeviceClass.js';

const SYSTEMS = {
  windows: { name: 'Windows', blurb: 'Floating taskbar, Start menu, snap layouts.', device: 'desktop' },
  macos:   { name: 'macOS',   blurb: 'Menu bar, magnifying dock, desktop widgets.', device: 'desktop' },
  linux:   { name: 'Linux',   blurb: 'Top panel, workspaces, terminal first.', device: 'desktop' },
  iphone:  { name: 'iPhone',  blurb: 'Lock screen, home grid, swipe to open.', device: 'mobile' },
  android: { name: 'Android', blurb: 'App drawer, quick settings, gesture bar.', device: 'mobile' },
};

// Tiny CSS mock of each system so the card previews its real layout.
function Preview({ id }) {
  const bar = 'absolute rounded-full bg-white/70';
  return (
    <div className={`os-${id} wp-${id} relative h-36 rounded-xl overflow-hidden border border-white/10`}>
      {id === 'windows' && (<><div className="absolute left-6 top-6 w-24 h-16 rounded-lg bg-white/15 border border-white/20" /><div className="absolute bottom-2 left-1/2 -translate-x-1/2 h-4 w-28 rounded-lg bg-white/25" /></>)}
      {id === 'macos' && (<><div className="absolute top-0 inset-x-0 h-3 bg-white/20" /><div className="absolute left-8 top-8 w-24 h-16 rounded-lg bg-white/15 border border-white/20" /><div className="absolute bottom-2 left-1/2 -translate-x-1/2 h-5 w-24 rounded-xl bg-white/25" /></>)}
      {id === 'linux' && (<><div className="absolute top-0 inset-x-0 h-3 bg-black/50" /><div className="absolute left-0 top-3 bottom-0 w-4 bg-black/40" /><div className="absolute left-10 top-8 w-28 h-16 rounded-md bg-black/50 border border-emerald-300/30" /></>)}
      {id === 'iphone' && (<div className="absolute inset-y-3 left-1/2 -translate-x-1/2 w-20 rounded-2xl border border-white/30 bg-black/20"><div className={`${bar} top-2 left-1/2 -translate-x-1/2 h-1.5 w-6`} /><div className="absolute bottom-3 inset-x-2 grid grid-cols-3 gap-1">{[...Array(6)].map((_, i) => <div key={i} className="aspect-square rounded-md bg-white/40" />)}</div></div>)}
      {id === 'android' && (<div className="absolute inset-y-3 left-1/2 -translate-x-1/2 w-20 rounded-xl border border-white/30 bg-black/20"><div className="absolute top-3 left-2 h-3 w-10 rounded bg-white/50" /><div className="absolute bottom-3 inset-x-2 grid grid-cols-3 gap-1">{[...Array(6)].map((_, i) => <div key={i} className="aspect-square rounded-full bg-white/40" />)}</div></div>)}
    </div>
  );
}

export default function OSSelector() {
  const device = useDeviceClass();
  const { setOS, mode, toggleMode } = useOS();
  const list = Object.entries(SYSTEMS).filter(([, s]) => s.device === device);
  const [picked, setPicked] = useState(device === 'mobile' ? (prefersIOS() ? 'iphone' : 'android') : 'windows');
  const active = SYSTEMS[picked]?.device === device ? picked : list[0][0];

  return (
    <main className="h-full scroll-y wp-windows os-windows relative">
      <div className="min-h-full max-w-5xl mx-auto px-5 py-8 sm:py-14 flex flex-col">
        <header className="flex items-center justify-between">
          <p className="font-display text-xl">SONU OS</p>
          <button className="btn" onClick={toggleMode} aria-label="Toggle light and dark theme">{mode === 'dark' ? <Sun size={16} /> : <Moon size={16} />}</button>
        </header>
        <section className="my-auto py-10">
          <h1 className="font-display text-3xl sm:text-5xl max-w-xl leading-tight">Choose the system you want to explore my work in.</h1>
          <p className="mt-3 text-muted max-w-lg">Same portfolio, different operating system. You can switch any time from Settings.</p>
          <div className={`mt-8 grid gap-4 ${device === 'desktop' ? 'md:grid-cols-3' : 'grid-cols-1'}`} role="radiogroup" aria-label="Operating system">
            {list.map(([id, s]) => (
              <motion.button key={id} role="radio" aria-checked={active === id} onClick={() => setPicked(id)} onDoubleClick={() => setOS(id)}
                whileHover={{ y: -4 }} whileTap={{ scale: 0.98 }} transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                className={`glass text-left rounded-2xl p-3 transition-shadow ${active === id ? 'ring-2 ring-white/70 shadow-2xl' : ''}`}>
                <Preview id={id} />
                <div className="px-1 pt-3 pb-1"><p className="font-display text-lg">{s.name}</p><p className="text-sm text-muted">{s.blurb}</p></div>
              </motion.button>
            ))}
          </div>
          <button className="btn btn-primary mt-8 !px-6 !py-3 text-base" onClick={() => setOS(active)}>Enter {SYSTEMS[active].name}</button>
        </section>
      </div>
    </main>
  );
}
