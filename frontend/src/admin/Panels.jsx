import { useEffect, useState, useCallback } from 'react';
import { Upload, Trash2, Replace, Check } from 'lucide-react';
import { api } from '../services/api.js';
import { Field } from './ResourceManager.jsx';

const useMsg = () => { const [m, setM] = useState(''); return [m, setM, m && <p role="status" className="text-sm text-accent my-2">{m}</p>]; };
const FileButton = ({ label, accept = 'image/jpeg,image/png,image/webp', multiple, onFiles, icon: I = Upload }) => (
  <label className="btn cursor-pointer"><I size={14} />{label}<input type="file" hidden accept={accept} multiple={multiple} onChange={(e) => { const f = [...e.target.files]; e.target.value = ''; if (f.length) onFiles(multiple ? f : f[0]); }} /></label>
);

export function ProfilePanel() {
  const [p, setP] = useState(null);
  const [msg, setMsg, note] = useMsg();
  useEffect(() => { api.list('profile').then(setP).catch((e) => setMsg(e.message)); }, [setMsg]);
  if (!p) return <p className="text-muted">{msg || 'Loading…'}</p>;
  const set = (k) => (v) => setP({ ...p, [k]: v });
  const socials = (p.socials || []).map((s) => `${s.label} | ${s.url}`).join('\n');
  const save = async (e) => {
    e.preventDefault();
    try {
      const body = { name: p.name || '', headline: p.headline || '', intro: p.intro || '', bio: p.bio || '', goals: p.goals || '', interests: p.interests || [],
        socials: (p.socialsText ?? socials).split('\n').map((l) => l.split('|').map((s) => s.trim())).filter((a) => a[0]).map(([label, url = '']) => ({ label, url })) };
      setP(await api.saveSingleton('profile', body)); setMsg('Profile saved. The public site updates on next load.');
    } catch (x) { setMsg(x.message); }
  };
  return (
    <form onSubmit={save} className="max-w-2xl grid gap-3">
      <h1 className="font-display text-2xl">Profile</h1>{note}
      <div className="flex items-center gap-4">
        {p.image ? <img src={p.image} alt="Profile" className="h-20 w-20 rounded-2xl object-cover" /> : <div className="h-20 w-20 rounded-2xl bg-accent/20" />}
        <FileButton label="Upload photo" onFiles={async (f) => { try { setP(await api.uploadProfileImage(f)); setMsg('Photo updated.'); } catch (x) { setMsg(x.message); } }} />
      </div>
      <Field f={{ key: 'name', label: 'Name' }} value={p.name || ''} onChange={set('name')} />
      <Field f={{ key: 'headline', label: 'Headline' }} value={p.headline || ''} onChange={set('headline')} />
      <Field f={{ key: 'intro', label: 'Short introduction', type: 'textarea' }} value={p.intro || ''} onChange={set('intro')} />
      <Field f={{ key: 'bio', label: 'Biography', type: 'textarea' }} value={p.bio || ''} onChange={set('bio')} />
      <Field f={{ key: 'goals', label: 'Career goals', type: 'textarea' }} value={p.goals || ''} onChange={set('goals')} />
      <Field f={{ key: 'interests', label: 'Developer interests (comma separated)' }} value={p.interestsText ?? (p.interests || []).join(', ')} onChange={(v) => setP({ ...p, interestsText: v, interests: v.split(',').map((s) => s.trim()).filter(Boolean) })} />
      <Field f={{ key: 'socials', label: 'Social links (one per line: Label | URL)', type: 'textarea' }} value={p.socialsText ?? socials} onChange={set('socialsText')} />
      <button className="btn btn-primary justify-self-start">Save profile</button>
    </form>
  );
}

export function SettingsPanel() {
  const [s, setS] = useState(null);
  const [msg, setMsg, note] = useMsg();
  useEffect(() => { api.list('settings').then(setS).catch((e) => setMsg(e.message)); }, [setMsg]);
  if (!s) return <p className="text-muted">{msg || 'Loading…'}</p>;
  return (
    <div className="max-w-xl grid gap-3">
      <h1 className="font-display text-2xl">Website settings</h1>{note}
      <Field f={{ key: 'siteTitle', label: 'Site title' }} value={s.siteTitle || ''} onChange={(v) => setS({ ...s, siteTitle: v })} />
      <Field f={{ key: 'publicEmail', label: 'Public contact email' }} value={s.publicEmail || ''} onChange={(v) => setS({ ...s, publicEmail: v })} />
      <Field f={{ key: 'defaultMode', label: 'Default theme', type: 'select', options: ['dark', 'light'] }} value={s.defaultMode || 'dark'} onChange={(v) => setS({ ...s, defaultMode: v })} />
      <div className="flex items-center gap-3">{s.wallpaperUrl && <img src={s.wallpaperUrl} alt="Wallpaper" className="h-14 w-24 rounded-lg object-cover" />}
        <FileButton label="Upload wallpaper" onFiles={async (f) => { try { setS(await api.uploadWallpaper(f)); setMsg('Wallpaper updated.'); } catch (x) { setMsg(x.message); } }} /></div>
      <button className="btn btn-primary justify-self-start" onClick={async () => { try { setS(await api.saveSingleton('settings', { siteTitle: s.siteTitle, publicEmail: s.publicEmail || '', defaultMode: s.defaultMode })); setMsg('Settings saved.'); } catch (x) { setMsg(x.message); } }}>Save settings</button>
    </div>
  );
}

export function GalleryPanel() {
  const [items, setItems] = useState([]);
  const [cat, setCat] = useState('General');
  const [msg, setMsg, note] = useMsg();
  const load = useCallback(() => api.list('gallery').then(setItems).catch((e) => setMsg(e.message)), [setMsg]);
  useEffect(() => { load(); }, [load]);
  const patch = async (it, body) => { await api.update('gallery', it._id, body); load(); };
  return (
    <section className="max-w-4xl">
      <h1 className="font-display text-2xl mb-3">Gallery</h1>{note}
      <div className="flex flex-wrap items-center gap-2 mb-5">
        <input className="field !w-48" value={cat} onChange={(e) => setCat(e.target.value)} aria-label="Category for new uploads" placeholder="Category" />
        <FileButton label="Upload images" multiple onFiles={async (files) => { try { setMsg('Uploading…'); await api.uploadGallery(files, cat); setMsg(`${files.length} image(s) uploaded.`); load(); } catch (x) { setMsg(x.message); } }} />
      </div>
      {!items.length && <p className="text-muted">No images yet.</p>}
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {items.map((it) => (
          <li key={it._id} className="rounded-xl border border-line bg-raised/60 p-3 grid gap-2">
            <img src={it.url} alt={it.caption || ''} className="h-40 w-full object-cover rounded-lg" loading="lazy" />
            <input className="field" defaultValue={it.caption || ''} placeholder="Caption" onBlur={(e) => e.target.value !== (it.caption || '') && patch(it, { caption: e.target.value })} aria-label="Caption" />
            <input className="field" defaultValue={it.category} placeholder="Category" onBlur={(e) => e.target.value !== it.category && patch(it, { category: e.target.value })} aria-label="Category" />
            <div className="flex gap-2 flex-wrap">
              <button className="btn" onClick={() => patch(it, { published: !it.published })}>{it.published ? 'Live' : 'Hidden'}</button>
              <FileButton label="Replace" icon={Replace} onFiles={async (f) => { try { await api.replaceGallery(it._id, f); load(); } catch (x) { setMsg(x.message); } }} />
              <button className="btn" onClick={async () => { if (confirm('Delete this image?')) { await api.remove('gallery', it._id); load(); } }}><Trash2 size={14} />Delete</button>
            </div>
          </li>))}
      </ul>
    </section>
  );
}

export function ResumePanel() {
  const [items, setItems] = useState([]);
  const [msg, setMsg, note] = useMsg();
  const load = useCallback(() => api.list('resumes').then(setItems).catch((e) => setMsg(e.message)), [setMsg]);
  useEffect(() => { load(); }, [load]);
  const active = items.find((r) => r.active);
  return (
    <section className="max-w-3xl">
      <h1 className="font-display text-2xl mb-3">Resume</h1>{note}
      <FileButton label="Upload PDF and publish" accept="application/pdf" onFiles={async (f) => { try { setMsg('Uploading…'); await api.uploadResume(f); setMsg('Resume uploaded and published.'); load(); } catch (x) { setMsg(x.message); } }} />
      {active && <iframe title="Current resume" src={active.url} className="w-full h-96 mt-5 rounded-xl border border-line bg-white" />}
      <ul className="grid gap-2 mt-5">
        {items.map((r) => (
          <li key={r._id} className="rounded-xl border border-line bg-raised/60 p-3 flex flex-wrap items-center gap-2">
            <span className="mr-auto truncate">{r.title} <span className="text-xs text-muted">{new Date(r.createdAt).toLocaleDateString()}</span></span>
            {r.active ? <span className="chip"><Check size={12} />Published</span> : <button className="btn" onClick={async () => { await api.publishResume(r._id); load(); }}>Publish this</button>}
            <a className="btn" href={r.url} target="_blank" rel="noopener noreferrer">Verify file</a>
            {!r.active && <button className="btn" onClick={async () => { if (confirm('Delete this file?')) { await api.remove('resumes', r._id); load(); } }}><Trash2 size={14} /></button>}
          </li>))}
      </ul>
    </section>
  );
}

export function MessagesPanel() {
  const [items, setItems] = useState(null);
  const load = useCallback(() => api.list('messages').then(setItems).catch(() => setItems([])), []);
  useEffect(() => { load(); }, [load]);
  if (!items) return <p className="text-muted">Loading…</p>;
  return (
    <section className="max-w-3xl"><h1 className="font-display text-2xl mb-3">Messages</h1>
      {!items.length && <p className="text-muted">No messages yet.</p>}
      <ul className="grid gap-2">{items.map((m) => (
        <li key={m._id} className="rounded-xl border border-line bg-raised/60 p-3"><div className="flex gap-2"><p className="mr-auto font-medium">{m.name} <a className="text-accent text-sm" href={`mailto:${m.email}`}>{m.email}</a></p><button className="btn" aria-label="Delete message" onClick={async () => { await api.remove('messages', m._id); load(); }}><Trash2 size={14} /></button></div><p className="mt-1 text-sm whitespace-pre-wrap">{m.message}</p></li>))}</ul>
    </section>
  );
}

export function ProjectImages({ item, reload }) {
  const [msg, setMsg] = useState('');
  return (
    <div className="mt-3 pt-3 border-t border-line">
      <div className="flex flex-wrap gap-2 items-center">
        {item.cover && <img src={item.cover} alt="Cover" className="h-12 w-20 object-cover rounded" />}
        <FileButton label="Cover" onFiles={async (f) => { try { await api.uploadProjectImage(item._id, f, 'cover'); reload(); } catch (x) { setMsg(x.message); } }} />
        <FileButton label="Add screenshot" onFiles={async (f) => { try { await api.uploadProjectImage(item._id, f, 'shot'); reload(); } catch (x) { setMsg(x.message); } }} />
        {msg && <span className="text-xs text-red-400">{msg}</span>}
      </div>
      {!!item.screenshots?.length && <div className="flex flex-wrap gap-2 mt-2">{item.screenshots.map((s) => (
        <div key={s._id} className="relative"><img src={s.url} alt="Screenshot" className="h-14 w-24 object-cover rounded" /><button aria-label="Remove screenshot" className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs" onClick={async () => { await api.removeScreenshot(item._id, s._id); reload(); }}>×</button></div>))}</div>}
    </div>
  );
}
