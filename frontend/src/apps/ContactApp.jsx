import { useState } from 'react';
import { Send } from 'lucide-react';
import { api } from '../services/api.js';
import { usePortfolio } from '../store/portfolioStore.js';

export default function ContactApp() {
  const socials = usePortfolio((s) => s.data.profile.socials || []);
  const [f, setF] = useState({ name: '', email: '', message: '' });
  const [state, setState] = useState({ s: 'idle', msg: '' });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const submit = async () => {
    setState({ s: 'sending', msg: '' });
    try { await api.contact(f); setF({ name: '', email: '', message: '' }); setState({ s: 'ok', msg: 'Message sent. Thank you.' }); }
    catch (e) { setState({ s: 'err', msg: e.status ? e.message : 'Could not reach the server. Try LinkedIn or GitHub below.' }); }
  };
  const valid = f.name.trim() && /\S+@\S+\.\S+/.test(f.email) && f.message.trim().length >= 5;
  return (
    <div className="p-5 max-w-lg grid gap-3">
      <h1 className="font-display text-2xl">Send a message</h1>
      <label className="grid gap-1 text-sm">Name<input className="field" value={f.name} onChange={set('name')} maxLength={80} autoComplete="name" /></label>
      <label className="grid gap-1 text-sm">Email<input type="email" className="field" value={f.email} onChange={set('email')} maxLength={120} autoComplete="email" /></label>
      <label className="grid gap-1 text-sm">Message<textarea className="field min-h-28" value={f.message} onChange={set('message')} maxLength={2000} /></label>
      <button className="btn btn-primary justify-center" disabled={!valid || state.s === 'sending'} onClick={submit}><Send size={16} />{state.s === 'sending' ? 'Sending…' : 'Send message'}</button>
      {state.msg && <p role="status" className={`text-sm ${state.s === 'ok' ? 'text-emerald-400' : 'text-red-400'}`}>{state.msg}</p>}
      <div className="flex flex-wrap gap-2 mt-2">{socials.filter((s) => s.url).map((s) => <a key={s.label} className="btn" href={s.url} target="_blank" rel="noopener noreferrer">{s.label}</a>)}</div>
    </div>
  );
}
