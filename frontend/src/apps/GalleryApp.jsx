import { useEffect, useState, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';
import { usePortfolio } from '../store/portfolioStore.js';

export default function GalleryApp() {
  const gallery = usePortfolio((s) => s.data.gallery);
  const cats = ['All', ...new Set(gallery.map((g) => g.category))];
  const [cat, setCat] = useState('All');
  const [idx, setIdx] = useState(null);
  const [zoom, setZoom] = useState(1);
  const list = cat === 'All' ? gallery : gallery.filter((g) => g.category === cat);

  const step = useCallback((d) => { setZoom(1); setIdx((i) => (i + d + list.length) % list.length); }, [list.length]);
  useEffect(() => {
    if (idx === null) return;
    const key = (e) => { if (e.key === 'Escape') setIdx(null); if (e.key === 'ArrowRight') step(1); if (e.key === 'ArrowLeft') step(-1); };
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  }, [idx, step]);

  if (!gallery.length) return <p className="p-8 text-muted">No images are published yet.</p>;
  const cur = idx !== null ? list[idx] : null;
  return (
    <div className="p-4">
      <div className="flex flex-wrap gap-2 mb-4">{cats.map((c) => <button key={c} onClick={() => setCat(c)} className={`btn ${cat === c ? 'btn-primary' : ''}`}>{c}</button>)}</div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {list.map((g, i) => <button key={g._id} onClick={() => { setIdx(i); setZoom(1); }} className="aspect-square overflow-hidden rounded-xl border border-line"><img src={g.url} alt={g.caption || g.category} loading="lazy" className="h-full w-full object-cover hover:scale-105 transition-transform" /></button>)}
      </div>
      {cur && (
        <div className="fixed inset-0 z-[99999] bg-black/90 flex flex-col" role="dialog" aria-label="Image viewer">
          <div className="flex justify-end gap-2 p-3 text-white">
            <button className="btn" onClick={() => setZoom((z) => Math.min(4, z + 0.5))} aria-label="Zoom in"><ZoomIn size={16} /></button>
            <button className="btn" onClick={() => setZoom((z) => Math.max(1, z - 0.5))} aria-label="Zoom out"><ZoomOut size={16} /></button>
            <button className="btn" onClick={() => setIdx(null)} aria-label="Close viewer"><X size={16} /></button>
          </div>
          <div className="flex-1 min-h-0 overflow-auto grid place-items-center">
            <img src={cur.url} alt={cur.caption || cur.category} style={{ transform: `scale(${zoom})`, transition: 'transform .2s' }} className="max-h-full max-w-full object-contain" />
          </div>
          <div className="flex items-center justify-between p-4 text-white">
            <button className="btn" onClick={() => step(-1)} aria-label="Previous"><ChevronLeft size={16} /></button>
            <p className="text-sm text-center px-3">{cur.caption || cur.category} <span className="opacity-60">({idx + 1}/{list.length})</span></p>
            <button className="btn" onClick={() => step(1)} aria-label="Next"><ChevronRight size={16} /></button>
          </div>
        </div>
      )}
    </div>
  );
}
