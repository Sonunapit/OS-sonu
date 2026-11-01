import { useState, useRef, useEffect } from 'react';
import { useOS } from '../store/osStore.js';
import { usePortfolio } from '../store/portfolioStore.js';
import { APPS } from './registry.js';

// Simulated shell. No input is ever sent to a real system shell.
const buildFS = (d) => ({
  'about.txt': d.profile.intro,
  'contact.txt': (d.profile.socials || []).map((s) => `${s.label}: ${s.url}`).join('\n'),
  'resume.pdf': d.resume ? 'published' : 'not published yet',
  projects: Object.fromEntries(d.projects.map((p) => [`${p.name.toLowerCase().replace(/\s+/g, '-')}.md`, p.description || p.name])),
  skills: Object.fromEntries(d.skills.map((s) => [`${s.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.txt`, s.category])),
});
const resolve = (fs, path) => path.reduce((n, k) => (n && typeof n === 'object' ? n[k] : undefined), fs);
const tree = (node, pre = '') => Object.entries(node).flatMap(([k, v], i, a) => {
  const last = i === a.length - 1; const line = `${pre}${last ? '└── ' : '├── '}${k}`;
  return typeof v === 'object' ? [line, ...tree(v, pre + (last ? '    ' : '│   '))] : [line];
});

export default function TerminalApp() {
  const data = usePortfolio((s) => s.data);
  const { openApp, toggleMode, mode, reboot } = useOS();
  const fs = buildFS(data);
  const [cwd, setCwd] = useState([]);
  const [lines, setLines] = useState([{ t: 'SONU OS terminal. Type "help" for commands.' }]);
  const [hist, setHist] = useState([]);
  const [hi, setHi] = useState(-1);
  const [val, setVal] = useState('');
  const box = useRef(null);
  useEffect(() => { box.current?.scrollTo({ top: 1e6 }); }, [lines]);

  const run = (raw) => {
    const [cmd, ...args] = raw.trim().split(/\s+/);
    const node = resolve(fs, cwd);
    const out = [];
    const say = (t) => out.push({ t });
    switch ((cmd || '').toLowerCase()) {
      case '': break;
      case 'help': say('help about whoami ls dir pwd cd tree projects skills experience contact resume date time clear history echo neofetch open <app> theme reboot'); break;
      case 'about': say(`${data.profile.name} - ${data.profile.headline}\n${data.profile.intro}`); break;
      case 'whoami': say('visitor'); break;
      case 'ls': case 'dir': say(Object.entries(node).map(([k, v]) => (typeof v === 'object' ? `${k}/` : k)).join('  ') || '(empty)'); break;
      case 'pwd': say('/home/sonu' + (cwd.length ? `/${cwd.join('/')}` : '')); break;
      case 'cd': {
        const t = args[0];
        if (!t || t === '~' || t === '/') setCwd([]); else if (t === '..') setCwd(cwd.slice(0, -1));
        else if (typeof node[t] === 'object') setCwd([...cwd, t]); else say(`cd: ${t}: No such directory`);
        break;
      }
      case 'cat': { const f = node[args[0]]; say(typeof f === 'string' ? f : `cat: ${args[0] || ''}: No such file`); break; }
      case 'tree': say(['.', ...tree(node)].join('\n')); break;
      case 'projects': say(data.projects.map((p) => `- ${p.name} [${p.status}]`).join('\n') || 'No projects published.'); break;
      case 'skills': say([...new Set(data.skills.map((s) => s.name))].join(', ') || 'No skills published.'); break;
      case 'experience': say(data.experience.length ? data.experience.map((e) => `- ${e.role || ''} @ ${e.company}`).join('\n') : 'No experience records published yet.'); break;
      case 'contact': say(fs['contact.txt']); break;
      case 'resume': if (data.resume) { openApp('resume'); say('Opening resume…'); } else say('Resume has not been published yet.'); break;
      case 'date': say(new Date().toDateString()); break;
      case 'time': say(new Date().toLocaleTimeString()); break;
      case 'clear': setLines([]); return;
      case 'history': say(hist.map((h, i) => `${i + 1}  ${h}`).join('\n') || '(empty)'); break;
      case 'echo': say(args.join(' ')); break;
      case 'neofetch': say(`sonu@sonu-os\n-----------\nOS: SONU OS (browser)\nHost: ${navigator.platform || 'web'}\nShell: sonu-sh (simulated)\nTheme: ${mode}\nCPU cores: ${navigator.hardwareConcurrency || '?'}\nResolution: ${innerWidth}x${innerHeight}`); break;
      case 'open': {
        const target = args[0] === 'projects' || APPS[args[0]] ? args[0] : null;
        if (target) { openApp(target); say(`Opening ${target}…`); } else say(`open: unknown app "${args[0] || ''}". Try: ${Object.keys(APPS).join(', ')}`);
        break;
      }
      case 'theme': toggleMode(); say(`Theme switched to ${mode === 'dark' ? 'light' : 'dark'}.`); break;
      case 'reboot': say('Rebooting…'); setTimeout(reboot, 500); break;
      default: say(`${cmd}: command not found. Type "help".`);
    }
    setLines((l) => [...l, { t: raw, prompt: true }, ...out]);
  };

  const onKey = (e) => {
    if (e.key === 'Enter') { if (val.trim()) setHist((h) => [...h, val]); run(val); setVal(''); setHi(-1); }
    else if (e.key === 'ArrowUp' && hist.length) { const n = hi < 0 ? hist.length - 1 : Math.max(0, hi - 1); setHi(n); setVal(hist[n]); e.preventDefault(); }
    else if (e.key === 'ArrowDown' && hi >= 0) { const n = hi + 1; setHi(n >= hist.length ? -1 : n); setVal(n >= hist.length ? '' : hist[n]); }
  };

  return (
    <div ref={box} onClick={() => box.current?.querySelector('input')?.focus()} className="h-full scroll-y bg-[#0a0e12] text-[#cfe8dc] font-mono text-[13px] p-4">
      {lines.map((l, i) => <pre key={i} className="whitespace-pre-wrap break-words">{l.prompt ? <><span className="text-emerald-400">sonu@sonu-os</span>:<span className="text-sky-400">~/{cwd.join('/')}</span>$ {l.t}</> : l.t}</pre>)}
      <label className="flex gap-2"><span className="text-emerald-400 shrink-0">sonu@sonu-os:~/{cwd.join('/')}$</span>
        <input autoFocus value={val} onChange={(e) => setVal(e.target.value)} onKeyDown={onKey} className="flex-1 bg-transparent outline-none min-w-0" aria-label="Terminal input" autoCapitalize="off" autoComplete="off" spellCheck="false" /></label>
    </div>
  );
}
