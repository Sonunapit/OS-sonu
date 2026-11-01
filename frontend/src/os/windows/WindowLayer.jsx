import { useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useOS } from '../../store/osStore.js';
import WindowFrame from './WindowFrame.jsx';

// Renders every open window for the current workspace inside the usable area of the desktop.
export default function WindowLayer({ chrome, insets = {} }) {
  const ref = useRef(null);
  const windows = useOS((s) => s.windows);
  const ws = useOS((s) => s.workspace);
  const visible = windows.filter((w) => w.ws === ws && !w.minimized);
  const topZ = Math.max(0, ...visible.map((w) => w.z));
  return (
    <div ref={ref} className="absolute pointer-events-none" style={{ top: insets.top || 0, bottom: insets.bottom || 0, left: insets.left || 0, right: 0 }}>
      <AnimatePresence>
        {visible.map((w) => <WindowFrame key={w.id} win={w} chrome={chrome} layerRef={ref} active={w.z === topZ} />)}
      </AnimatePresence>
    </div>
  );
}
