import { usePortfolio } from '../store/portfolioStore.js';

export default function SkillsApp() {
  const skills = usePortfolio((s) => s.data.skills);
  const groups = skills.reduce((acc, s) => ((acc[s.category] ||= []).push(s), acc), {});
  if (!skills.length) return <p className="p-8 text-muted">No skills are published yet.</p>;
  return (
    <div className="p-5 grid gap-4 sm:grid-cols-2 content-start">
      {Object.entries(groups).map(([cat, list]) => (
        <section key={cat} className="rounded-2xl border border-line bg-raised/60 p-4">
          <h2 className="font-display text-lg mb-3">{cat}</h2>
          <div className="flex flex-wrap gap-2">{list.map((s) => <span key={s._id} className="chip">{s.name}</span>)}</div>
        </section>
      ))}
    </div>
  );
}
