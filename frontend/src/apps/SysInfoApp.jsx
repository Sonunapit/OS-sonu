import { useEffect, useState } from 'react';
import { useOS } from '../store/osStore.js';

// Shows real browser/device values, not simulated numbers.
export default function SysInfoApp() {
  const os = useOS((s) => s.os);
  const [fps, setFps] = useState(0);
  useEffect(() => {
    let frames = 0, last = performance.now(), raf;
    const loop = (t) => { frames++; if (t - last >= 1000) { setFps(frames); frames = 0; last = t; } raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);
  const mem = performance.memory ? `${Math.round(performance.memory.usedJSHeapSize / 1048576)} MB heap` : 'not exposed by this browser';
  const rows = [['Environment', `SONU OS (${os})`], ['Frames per second', fps], ['CPU threads', navigator.hardwareConcurrency || 'unknown'], ['Device memory', navigator.deviceMemory ? `${navigator.deviceMemory} GB` : 'unknown'], ['JS memory', mem], ['Viewport', `${innerWidth} x ${innerHeight}`], ['Pixel ratio', devicePixelRatio], ['Language', navigator.language], ['Online', navigator.onLine ? 'yes' : 'no']];
  return <dl className="p-5 grid gap-2 text-sm max-w-md">{rows.map(([k, v]) => <div key={k} className="flex justify-between border-b border-line py-1.5"><dt className="text-muted">{k}</dt><dd className="font-mono">{String(v)}</dd></div>)}</dl>;
}
