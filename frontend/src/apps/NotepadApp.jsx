import { useEffect, useState } from 'react';

const KEY = 'sonu-os-notes';
export default function NotepadApp() {
  const [text, setText] = useState(() => { try { return localStorage.getItem(KEY) || ''; } catch { return ''; } });
  useEffect(() => { try { localStorage.setItem(KEY, text); } catch { /* storage unavailable */ } }, [text]);
  return (
    <div className="h-full flex flex-col">
      <textarea className="flex-1 p-4 bg-transparent outline-none resize-none font-mono text-sm" value={text} onChange={(e) => setText(e.target.value)} placeholder="Notes stay in this browser only." aria-label="Notes" />
      <p className="text-xs text-muted px-4 py-2 border-t border-line">{text.length} characters · saved in this browser</p>
    </div>
  );
}
