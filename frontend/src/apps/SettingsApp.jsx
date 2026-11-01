import { useOS } from '../store/osStore.js';
import { usePortfolio } from '../store/portfolioStore.js';

export default function SettingsApp() {
  const { mode, setMode, reduceMotion, setReduceMotion, setOS, os, reboot } = useOS();
  const status = usePortfolio((s) => s.status);
  const load = usePortfolio((s) => s.load);
  const row = 'flex items-center justify-between gap-4 py-3 border-b border-line';
  return (
    <div className="p-5 max-w-lg">
      <h1 className="font-display text-2xl mb-2">Settings</h1>
      <div className={row}><span>Appearance</span><div className="flex gap-2">{['dark', 'light'].map((m) => <button key={m} onClick={() => setMode(m)} className={`btn capitalize ${mode === m ? 'btn-primary' : ''}`} aria-pressed={mode === m}>{m}</button>)}</div></div>
      <div className={row}><span>Reduce motion</span><button className={`btn ${reduceMotion ? 'btn-primary' : ''}`} aria-pressed={reduceMotion} onClick={() => setReduceMotion(!reduceMotion)}>{reduceMotion ? 'On' : 'Off'}</button></div>
      <div className={row}><span>System<br /><span className="text-xs text-muted capitalize">Current: {os}</span></span><button className="btn" onClick={() => setOS(null)}>Switch system</button></div>
      <div className={row}><span>Content<br /><span className="text-xs text-muted">{status === 'offline' ? 'Offline: showing built-in content' : 'Synced with the server'}</span></span><button className="btn" onClick={load}>Refresh</button></div>
      <div className={row}><span>Restart</span><button className="btn" onClick={reboot}>Reboot SONU OS</button></div>
    </div>
  );
}
