import { useEffect, useState } from 'react';

// "mobile" shows iPhone + Android. Everything wider shows Windows, macOS and Linux.
const query = '(max-width: 767px), (pointer: coarse) and (max-width: 900px)';
export function useDeviceClass() {
  const [mobile, setMobile] = useState(() => matchMedia(query).matches);
  useEffect(() => {
    const mq = matchMedia(query);
    const on = () => setMobile(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return mobile ? 'mobile' : 'desktop';
}
export const prefersIOS = () => /iPhone|iPad|iPod/i.test(navigator.userAgent);
