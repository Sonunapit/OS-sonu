import { usePortfolio } from '../../store/portfolioStore.js';

export default function Wallpaper({ os }) {
  const url = usePortfolio((s) => s.data.settings?.wallpaperUrl);
  return <div className={`absolute inset-0 wp-${os}`} style={url ? { background: `center / cover url(${url})` } : undefined} aria-hidden="true" />;
}
