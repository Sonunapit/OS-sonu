import { useState } from 'react';
import { Folder, File, ChevronLeft } from 'lucide-react';
import { usePortfolio } from '../store/portfolioStore.js';
import { useOS } from '../store/osStore.js';

export default function FilesApp() {
  const data = usePortfolio((s) => s.data);
  const openApp = useOS((s) => s.openApp);
  const [path, setPath] = useState('Home');
  const items = {
    Home: [['Projects', 'dir'], ['Skills', 'dir'], ['Gallery', 'app:gallery'], ['Resume.pdf', 'app:resume'], ['About.txt', 'app:about'], ['Contact.txt', 'app:contact']],
    Projects: data.projects.map((p) => [p.name, 'app:projects']),
    Skills: [...new Set(data.skills.map((s) => s.category))].map((c) => [c, 'app:skills']),
  }[path] || [];
  return (
    <div className="p-4">
      <div className="flex items-center gap-2 mb-4 text-sm">{path !== 'Home' && <button className="btn" onClick={() => setPath('Home')} aria-label="Back"><ChevronLeft size={16} /></button>}<span className="text-muted">/{path}</span></div>
      <ul className="grid grid-cols-3 sm:grid-cols-4 gap-3">
        {items.map(([name, kind]) => (
          <li key={name}><button onDoubleClick={() => kind === 'dir' ? setPath(name) : openApp(kind.slice(4))} onClick={(e) => e.detail === 1 && matchMedia('(pointer: coarse)').matches && (kind === 'dir' ? setPath(name) : openApp(kind.slice(4)))} className="w-full flex flex-col items-center gap-1 p-3 rounded-xl hover:bg-accent/10 text-xs text-center">
            {kind === 'dir' ? <Folder size={34} className="text-accent" /> : <File size={34} className="text-muted" />}<span className="break-words w-full">{name}</span></button></li>))}
      </ul>
      {!items.length && <p className="text-muted">Empty folder.</p>}
      <p className="text-xs text-muted mt-6">Double-click to open.</p>
    </div>
  );
}
