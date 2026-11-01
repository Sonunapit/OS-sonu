import { useEffect, useState, useCallback } from 'react';
import { Pencil, Trash2, Plus, Eye, EyeOff } from 'lucide-react';
import { api } from '../services/api.js';

const toForm = (fields, item) => Object.fromEntries(fields.map((f) => [f.key, f.type === 'list' ? (item?.[f.key] || []).join(', ') : f.type === 'lines' ? (item?.[f.key] || []).join('\n') : f.type === 'checkbox' ? item?.[f.key] ?? (f.key === 'published') : item?.[f.key] ?? (f.type === 'number' ? 0 : f.type === 'select' ? f.options[0] : '')]));
const toBody = (fields, form) => Object.fromEntries(fields.map((f) => [f.key, f.type === 'list' ? form[f.key].split(',').map((s) => s.trim()).filter(Boolean) : f.type === 'lines' ? form[f.key].split('\n').map((s) => s.trim()).filter(Boolean) : f.type === 'number' ? Number(form[f.key]) || 0 : form[f.key]]));

export function Field({ f, value, onChange }) {
  const id = `f-${f.key}`;
  if (f.type === 'checkbox') return <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!value} onChange={(e) => onChange(e.target.checked)} />{f.label}</label>;
  return (
    <label htmlFor={id} className="grid gap-1 text-sm">{f.label}
      {f.type === 'textarea' || f.type === 'lines' ? <textarea id={id} className="field min-h-24" value={value} onChange={(e) => onChange(e.target.value)} />
        : f.type === 'select' ? <select id={id} className="field" value={value} onChange={(e) => onChange(e.target.value)}>{f.options.map((o) => <option key={o}>{o}</option>)}</select>
        : <input id={id} className="field" type={f.type === 'number' ? 'number' : f.type === 'url' ? 'url' : 'text'} value={value} required={f.required} onChange={(e) => onChange(e.target.value)} />}
    </label>
  );
}

export default function ResourceManager({ resource, fields, titleKey, subKey, renderExtra }) {
  const [items, setItems] = useState(null);
  const [editing, setEditing] = useState(null); // null | 'new' | item
  const [form, setForm] = useState({});
  const [msg, setMsg] = useState('');
  const load = useCallback(() => api.list(resource).then(setItems).catch((e) => setMsg(e.message)), [resource]);
  useEffect(() => { load(); }, [load]);

  const start = (item) => { setEditing(item || 'new'); setForm(toForm(fields, item)); setMsg(''); };
  const save = async (e) => {
    e.preventDefault();
    try {
      const body = toBody(fields, form);
      editing === 'new' ? await api.create(resource, body) : await api.update(resource, editing._id, body);
      setEditing(null); setMsg('Saved.'); load();
    } catch (x) { setMsg(x.message); }
  };
  const togglePub = async (it) => { await api.update(resource, it._id, { published: !it.published }); load(); };
  const del = async (it) => { if (confirm(`Delete “${it[titleKey]}”? This cannot be undone.`)) { await api.remove(resource, it._id); load(); } };

  if (!items) return <p className="text-muted">{msg || 'Loading…'}</p>;
  return (
    <section className="max-w-3xl">
      <div className="flex items-center justify-between mb-4"><h1 className="font-display text-2xl capitalize">{resource}</h1><button className="btn btn-primary" onClick={() => start()}><Plus size={16} />Add</button></div>
      {msg && <p role="status" className="text-sm mb-3 text-accent">{msg}</p>}
      {editing && (
        <form onSubmit={save} className="glass rounded-2xl p-4 mb-5 grid gap-3">
          {fields.map((f) => <Field key={f.key} f={f} value={form[f.key]} onChange={(v) => setForm({ ...form, [f.key]: v })} />)}
          <div className="flex gap-2"><button className="btn btn-primary">Save changes</button><button type="button" className="btn" onClick={() => setEditing(null)}>Cancel</button></div>
        </form>
      )}
      {!items.length && <p className="text-muted">Nothing here yet. Use Add to create the first record.</p>}
      <ul className="grid gap-2">
        {items.map((it) => (
          <li key={it._id} className="rounded-xl border border-line bg-raised/60 p-3">
            <div className="flex items-center gap-2">
              <div className="mr-auto min-w-0"><p className="font-medium truncate">{it[titleKey]}</p>{subKey && <p className="text-xs text-muted truncate">{it[subKey]}</p>}</div>
              {'published' in it && <button className="btn" onClick={() => togglePub(it)} aria-label={it.published ? 'Unpublish' : 'Publish'}>{it.published ? <><Eye size={14} />Live</> : <><EyeOff size={14} />Hidden</>}</button>}
              <button className="btn" onClick={() => start(it)} aria-label="Edit"><Pencil size={14} /></button>
              <button className="btn" onClick={() => del(it)} aria-label="Delete"><Trash2 size={14} /></button>
            </div>
            {renderExtra?.(it, load)}
          </li>
        ))}
      </ul>
    </section>
  );
}
