import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useOS } from '../../store/osStore.js';

const STEPS = ['Starting kernel', 'Loading profile', 'Mounting projects', 'Preparing desktop'];

export default function BootScreen() {
  const root = useRef(null);
  const finish = useOS((s) => s.finishBoot);
  const reduce = useOS((s) => s.reduceMotion);

  useEffect(() => {
    if (reduce) { const t = setTimeout(finish, 400); return () => clearTimeout(t); }
    const ctx = gsap.context(() => {
      const path = root.current.querySelector('.logo-path');
      const len = path.getTotalLength();
      gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
      const bar = { v: 0 };
      const label = root.current.querySelector('.status');
      const fill = root.current.querySelector('.fill');
      gsap.timeline({ onComplete: finish })
        .to(path, { strokeDashoffset: 0, duration: 1.1, ease: 'power2.inOut' })
        .from('.word span', { yPercent: 110, opacity: 0, stagger: 0.06, duration: 0.5, ease: 'power3.out' }, '-=0.4')
        .to('.progress', { opacity: 1, duration: 0.3 }, '-=0.2')
        .to(bar, { v: 100, duration: 1.8, ease: 'power1.inOut', onUpdate: () => {
          fill.style.width = `${bar.v}%`;
          label.textContent = STEPS[Math.min(STEPS.length - 1, Math.floor((bar.v / 100) * STEPS.length))];
        } })
        .to(root.current, { opacity: 0, duration: 0.5, ease: 'power1.in' });
    }, root);
    return () => ctx.revert();
  }, [finish, reduce]);

  return (
    <div ref={root} className="h-full grid place-items-center bg-[#07090c] text-white" role="status" aria-label="Starting SONU OS">
      <div className="flex flex-col items-center gap-8">
        <svg width="72" height="96" viewBox="0 0 48 64" fill="none" aria-hidden="true">
          <path className="logo-path" d="M38 20 C38 8 10 8 10 22 C10 37 38 29 38 43 C38 57 10 57 10 45" stroke="#7fb0ff" strokeWidth="4.5" strokeLinecap="round" />
        </svg>
        <h1 className="word font-display text-4xl tracking-tight flex overflow-hidden" aria-label="SONU OS">
          {'SONU OS'.split('').map((c, i) => <span key={i} className="inline-block">{c === ' ' ? '\u00A0' : c}</span>)}
        </h1>
        <div className="progress opacity-0 w-56">
          <div className="h-[3px] rounded bg-white/10 overflow-hidden"><div className="fill h-full w-0 bg-[#7fb0ff]" /></div>
          <p className="status mt-3 text-center text-xs text-white/50 font-mono">Starting kernel</p>
        </div>
      </div>
    </div>
  );
}
