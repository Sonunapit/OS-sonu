import { useState } from 'react';
import { Github, ExternalLink, ChevronLeft } from 'lucide-react';
import { usePortfolio } from '../store/portfolioStore.js';

export default function ProjectsApp() {
  const projects = usePortfolio((s) => s.data.projects);
  const [id, setId] = useState(null);
  const cur = projects.find((p) => p._id === id);

  if (!projects.length) return <p className="p-8 text-muted">No projects are published yet.</p>;
  return (
    <div className="h-full flex flex-col sm:flex-row">
      <ul className={`sm:w-64 sm:border-r border-line p-3 grid gap-2 content-start scroll-y ${cur ? 'hidden sm:grid' : ''}`}>
        {projects.map((p) => (
          <li key={p._id}>
            <button onClick={() => setId(p._id)} className={`w-full text-left rounded-xl p-3 border border-line hover:bg-accent/10 ${id === p._id ? 'bg-accent/15' : 'bg-raised/60'}`}>
              {p.cover && <img src={p.cover} alt="" className="rounded-lg mb-2 h-24 w-full object-cover" loading="lazy" />}
              <p className="font-medium leading-snug">{p.name}</p><p className="text-xs text-muted mt-1">{p.status}</p>
            </button>
          </li>
        ))}
      </ul>
      <section className={`flex-1 min-w-0 scroll-y p-5 ${cur ? '' : 'hidden sm:block'}`}>
        {!cur ? <p className="text-muted">Select a project to see its details.</p> : (
          <article className="max-w-2xl">
            <button className="sm:hidden btn mb-4" onClick={() => setId(null)}><ChevronLeft size={16} />All projects</button>
            {cur.cover && <img src={cur.cover} alt={`${cur.name} cover`} className="rounded-2xl w-full max-h-64 object-cover" />}
            <h1 className="font-display text-2xl mt-4">{cur.name}</h1>
            <span className="chip mt-2">{cur.status}</span>
            <p className="mt-4 leading-relaxed">{cur.description}</p>
            {!!cur.features?.length && <><h2 className="font-semibold mt-5">Features</h2><ul className="list-disc pl-5 mt-1 text-muted grid gap-1">{cur.features.map((f) => <li key={f}>{f}</li>)}</ul></>}
            {!!cur.techStack?.length && <><h2 className="font-semibold mt-5 mb-2">Tech stack</h2><div className="flex flex-wrap gap-2">{cur.techStack.map((t) => <span key={t} className="chip">{t}</span>)}</div></>}
            {cur.architecture && <><h2 className="font-semibold mt-5">Architecture</h2><p className="text-muted mt-1 whitespace-pre-line">{cur.architecture}</p></>}
            {!!cur.screenshots?.length && <><h2 className="font-semibold mt-5 mb-2">Screenshots</h2><div className="grid sm:grid-cols-2 gap-3">{cur.screenshots.map((s) => <img key={s._id || s.url} src={s.url} alt={`${cur.name} screenshot`} className="rounded-xl border border-line" loading="lazy" />)}</div></>}
            <div className="flex flex-wrap gap-2 mt-6">
              {cur.githubUrl && <a className="btn" href={cur.githubUrl} target="_blank" rel="noopener noreferrer"><Github size={16} />Source</a>}
              {cur.liveUrl && <a className="btn btn-primary" href={cur.liveUrl} target="_blank" rel="noopener noreferrer"><ExternalLink size={16} />Live demo</a>}
            </div>
          </article>
        )}
      </section>
    </div>
  );
}
