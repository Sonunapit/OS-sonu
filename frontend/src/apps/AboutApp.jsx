import { Github, Linkedin, Code2, Trophy, Link as LinkIcon } from 'lucide-react';
import { usePortfolio } from '../store/portfolioStore.js';

const ICONS = { github: Github, linkedin: Linkedin, leetcode: Code2, hackerrank: Trophy };

export default function AboutApp() {
  const p = usePortfolio((s) => s.data.profile);
  const initials = (p.name || 'S').split(' ').map((w) => w[0]).slice(0, 2).join('');
  return (
    <article className="p-5 sm:p-8 grid gap-6 sm:grid-cols-[180px_1fr] max-w-4xl">
      <div>
        {p.image
          ? <img src={p.image} alt={p.name} className="w-32 h-32 sm:w-44 sm:h-44 rounded-3xl object-cover" loading="lazy" />
          : <div className="w-32 h-32 sm:w-44 sm:h-44 rounded-3xl grid place-items-center bg-accent/20 font-display text-5xl" aria-label="No profile photo yet">{initials}</div>}
      </div>
      <div className="min-w-0">
        <h1 className="font-display text-3xl sm:text-4xl leading-tight">{p.name}</h1>
        <p className="text-accent mt-1">{p.headline}</p>
        <p className="mt-4 text-[15px] leading-relaxed">{p.intro}</p>
        {p.bio && <p className="mt-3 text-muted leading-relaxed max-w-prose">{p.bio}</p>}
        {p.goals && <section className="mt-5"><h2 className="font-semibold">Career goals</h2><p className="text-muted mt-1 max-w-prose">{p.goals}</p></section>}
        {!!p.interests?.length && <section className="mt-5"><h2 className="font-semibold mb-2">Developer interests</h2><div className="flex flex-wrap gap-2">{p.interests.map((i) => <span key={i} className="chip">{i}</span>)}</div></section>}
        {!!p.socials?.length && (
          <nav className="mt-6 flex flex-wrap gap-2" aria-label="Social links">
            {p.socials.filter((s) => s.url).map((s) => { const I = ICONS[s.label.toLowerCase()] || LinkIcon; return (
              <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer" className="btn"><I size={16} />{s.label}</a>); })}
          </nav>
        )}
      </div>
    </article>
  );
}
