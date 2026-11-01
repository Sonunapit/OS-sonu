import { Suspense } from 'react';
import { APPS } from '../../apps/registry.js';

export default function MobileAppHost({ id }) {
  const Body = APPS[id].Component;
  return (
    <div className="h-full scroll-y bg-bg">
      <Suspense fallback={<p className="p-6 text-muted text-sm">Opening {APPS[id].title}…</p>}><Body /></Suspense>
    </div>
  );
}
