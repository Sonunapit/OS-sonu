import { useState, useEffect } from 'react';
import { useOS } from '../../store/osStore.js';

// Right-click menu shared by all desktop systems.
export function useContextMenu() {
  const [pos, setPos] = useState(null);
  useEffect(() => {
    const close = () => setPos(null);
    window.addEventListener('pointerdown', close);
    window.addEventListener('keydown', (e) => e.key === 'Escape' && close());
    return () => window.removeEventListener('pointerdown', close);
  }, []);
  return { pos, onContextMenu: (e) => { e.preventDefault(); setPos({ x: Math.min(e.clientX, innerWidth - 200), y: Math.min(e.clientY, innerHeight - 190) }); } };
}

export function ContextMenu({ pos }) {
  const { openApp, toggleMode, setOS } = useOS();
  if (!pos) return null;
  const item = 'block w-full text-left px-3 py-1.5 rounded-md text-sm hover:bg-accent/25';
  return (
    <div className="glass fixed z-[9999] w-48 p-1 rounded-xl shadow-2xl" style={{ left: pos.x, top: pos.y }} onPointerDown={(e) => e.stopPropagation()} role="menu">
      <button className={item} onClick={() => openApp('terminal')}>Open Terminal</button>
      <button className={item} onClick={() => openApp('about')}>About Sonu</button>
      <button className={item} onClick={toggleMode}>Toggle light / dark</button>
      <button className={item} onClick={() => openApp('settings')}>Settings</button>
      <div className="my-1 h-px bg-line" />
      <button className={item} onClick={() => setOS(null)}>Switch system</button>
    </div>
  );
}
