import { useEffect, useState } from 'react';
import { api } from '../services/api.js';
import { usePortfolio } from '../store/portfolioStore.js';
import { LayoutDashboard, User, FolderGit2, Cpu, GraduationCap, Briefcase, Images, FileText, Settings, Mail, LogOut } from 'lucide-react';
import ResourceManager from './ResourceManager.jsx';
import { ProfilePanel, SettingsPanel, GalleryPanel, ResumePanel, MessagesPanel, ProjectImages } from './Panels.jsx';
import '../index.css';

const SKILL_CATS = ['Programming languages', 'Frontend', 'Backend', 'Databases', 'DevOps', 'Cloud', 'AI and GenAI', 'Tools', 'Computer science'];
const common = [{ key: 'published', label: 'Published', type: 'checkbox' }, { key: 'order', label: 'Order', type: 'number' }];

const SECTIONS = {
  profile: { label: 'Profile', icon: User, el: <ProfilePanel /> },
  projects: { label: 'Projects', icon: FolderGit2, el: <ResourceManager resource="projects" titleKey="name" renderExtra={(item, reload) => <ProjectImages item={item} reload={reload} />} fields={[
    { key: 'name', label: 'Name', required: true }, { key: 'status', label: 'Status', type: 'select', options: ['Planned', 'In progress', 'Completed', 'Maintained'] },
    { key: 'description', label: 'Description', type: 'textarea' }, { key: 'features', label: 'Features (one per line)', type: 'lines' }, { key: 'techStack', label: 'Tech stack (comma separated)', type: 'list' },
    { key: 'architecture', label: 'Architecture', type: 'textarea' }, { key: 'githubUrl', label: 'GitHub link', type: 'url' }, { key: 'liveUrl', label: 'Live demo link', type: 'url' }, ...common]} /> },
  skills: { label: 'Skills', icon: Cpu, el: <ResourceManager resource="skills" titleKey="name" subKey="category" fields={[{ key: 'name', label: 'Skill', required: true }, { key: 'category', label: 'Category', type: 'select', options: SKILL_CATS }, ...common]} /> },
  education: { label: 'Education', icon: GraduationCap, el: <ResourceManager resource="education" titleKey="institution" subKey="degree" fields={[{ key: 'institution', label: 'Institution', required: true }, { key: 'degree', label: 'Degree' }, { key: 'field', label: 'Field of study' }, { key: 'start', label: 'Start' }, { key: 'end', label: 'End' }, { key: 'coursework', label: 'Coursework (comma separated)', type: 'list' }, { key: 'description', label: 'Notes', type: 'textarea' }, ...common]} /> },
  experience: { label: 'Experience', icon: Briefcase, el: <ResourceManager resource="experience" titleKey="company" subKey="role" fields={[{ key: 'company', label: 'Company', required: true }, { key: 'role', label: 'Role' }, { key: 'type', label: 'Type', type: 'select', options: ['Full-time', 'Internship', 'Freelance', 'Open source'] }, { key: 'start', label: 'Start' }, { key: 'end', label: 'End' }, { key: 'description', label: 'Description', type: 'textarea' }, { key: 'highlights', label: 'Highlights (one per line)', type: 'lines' }, ...common]} /> },
  gallery: { label: 'Gallery', icon: Images, el: <GalleryPanel /> },
  resume: { label: 'Resume', icon: FileText, el: <ResumePanel /> },
  settings: { label: 'Website', icon: Settings, el: <SettingsPanel /> },
  messages: { label: 'Messages', icon: Mail, el: <MessagesPanel /> },
};

function Login({ onDone }) {
  const [f, setF] = useState({ email: '', password: '' });
  const [err, setErr] = useState('');
  const submit = async (e) => {
    e.preventDefault(); setErr('');
    try { await api.login(f); onDone(); } catch (x) { setErr(x.message); }
  };
  return (
    <main className="h-full grid place-items-center p-4">
      <form onSubmit={submit} className="glass w-full max-w-sm rounded-2xl p-6 grid gap-3">
        <h1 className="font-display text-2xl">Admin sign in</h1>
        <input className="field" type="email" placeholder="Email" autoComplete="username" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} required />
        <input className="field" type="password" placeholder="Password" autoComplete="current-password" value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} required />
        {err && <p className="text-sm text-red-400" role="alert">{err}</p>}
        <button className="btn btn-primary justify-center">Sign in</button>
      </form>
    </main>
  );
}

export default function AdminApp() {
  const [auth, setAuth] = useState('checking');
  const [tab, setTab] = useState('profile');
  const reloadPublic = usePortfolio((s) => s.load);
  const check = () => api.me().then(() => setAuth('in')).catch(() => setAuth('out'));
  useEffect(() => { document.documentElement.dataset.mode = 'dark'; check(); }, []);
  useEffect(() => () => reloadPublic(), [reloadPublic]);

  if (auth === 'checking') return <p className="p-8 text-muted">Checking session…</p>;
  if (auth === 'out') return <div className="os-windows h-full"><Login onDone={() => setAuth('in')} /></div>;
  return (
    <div className="os-windows h-full flex flex-col md:flex-row">
      <aside className="md:w-56 border-b md:border-b-0 md:border-r border-line p-3 flex md:flex-col gap-1 overflow-x-auto shrink-0">
        <p className="hidden md:flex items-center gap-2 font-display text-lg px-2 pb-3"><LayoutDashboard size={18} className="text-accent" />SONU OS admin</p>
        {Object.entries(SECTIONS).map(([k, s]) => (
          <button key={k} onClick={() => setTab(k)} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm whitespace-nowrap ${tab === k ? 'bg-accent/20 text-fg' : 'text-muted hover:bg-white/5'}`}><s.icon size={16} />{s.label}</button>))}
        <button onClick={async () => { await api.logout(); setAuth('out'); }} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted hover:bg-white/5 md:mt-auto"><LogOut size={16} />Sign out</button>
        <a href="/" className="px-3 py-2 text-sm text-muted hover:text-fg">View site</a>
      </aside>
      <main className="flex-1 min-w-0 scroll-y p-4 md:p-8" key={tab}>{SECTIONS[tab].el}</main>
    </div>
  );
}
