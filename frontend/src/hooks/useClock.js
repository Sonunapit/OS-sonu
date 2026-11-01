import { useEffect, useState } from 'react';

export function useClock(interval = 1000) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), interval);
    return () => clearInterval(id);
  }, [interval]);
  return now;
}
export const fmtTime = (d, sec = false) => d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', ...(sec ? { second: '2-digit' } : {}) });
export const fmtDate = (d, opts = { weekday: 'long', day: 'numeric', month: 'long' }) => d.toLocaleDateString([], opts);
