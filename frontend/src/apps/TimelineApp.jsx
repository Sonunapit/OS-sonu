import { useState } from 'react';
import { usePortfolio } from '../store/portfolioStore.js';

export default function TimelineApp() {
  const { education, experience } = usePortfolio((s) => s.data);
  const [tab, setTab] = useState('education');
  const rows = tab === 'education' ? education : experience;
  return (
    <div className="p-5 max-w-2xl">
      <div className="flex gap-2 mb-5" role="tablist">
        {['education', 'experience'].map((t) => <button key={t} role="tab" aria-selected={tab === t} onClick={() => setTab(t)} className={`btn capitalize ${tab === t ? 'btn-primary' : ''}`}>{t}</button>)}
      </div>
      {!rows.length ? <p className="text-muted">No {tab} records are published yet.</p> : (
        <ol className="border-l border-line ml-2 grid gap-6">
          {rows.map((r) => (
            <li key={r._id} className="pl-5 relative">
              <span className="absolute -left-[5px] top-2 h-2.5 w-2.5 rounded-full bg-accent" />
              <h2 className="font-semibold">{r.institution || r.company}</h2>
              <p className="text-sm text-accent">{[r.degree || r.role, r.field, r.type].filter(Boolean).join(' · ')}</p>
              <p className="text-xs text-muted">{[r.start, r.end].filter(Boolean).join(' – ')}</p>
              {r.description && <p className="mt-2 text-muted">{r.description}</p>}
              {!!(r.coursework || r.highlights)?.length && <div className="flex flex-wrap gap-2 mt-2">{(r.coursework || r.highlights).map((c) => <span key={c} className="chip">{c}</span>)}</div>}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
