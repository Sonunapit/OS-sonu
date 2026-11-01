import { describe, it, expect, beforeEach } from 'vitest';
import { useOS } from '../store/osStore.js';

describe('window manager', () => {
  beforeEach(() => useOS.setState({ os: 'windows', windows: [], workspace: 1, mobileApp: null }));

  it('opens an app once and re-focuses it instead of duplicating', () => {
    useOS.getState().openApp('about');
    useOS.getState().openApp('about');
    expect(useOS.getState().windows).toHaveLength(1);
  });
  it('keeps several windows with distinct stacking order', () => {
    ['about', 'projects', 'skills'].forEach((id) => useOS.getState().openApp(id));
    const zs = useOS.getState().windows.map((w) => w.z);
    expect(new Set(zs).size).toBe(3);
  });
  it('minimize, restore, maximize and close work independently', () => {
    useOS.getState().openApp('about'); useOS.getState().openApp('projects');
    const [a, b] = useOS.getState().windows;
    useOS.getState().minimize(a.id);
    useOS.getState().toggleMax(b.id);
    let s = useOS.getState().windows;
    expect(s[0].minimized).toBe(true); expect(s[1].maximized).toBe(true); expect(s[0].maximized).toBe(false);
    useOS.getState().openApp('about');
    expect(useOS.getState().windows[0].minimized).toBe(false);
    useOS.getState().toggleMax(b.id);
    expect(useOS.getState().windows[1].maximized).toBe(false);
    useOS.getState().closeWindow(a.id);
    expect(useOS.getState().windows).toHaveLength(1);
  });
  it('uses full-screen app on mobile systems', () => {
    useOS.setState({ os: 'iphone' });
    useOS.getState().openApp('resume');
    expect(useOS.getState().mobileApp).toBe('resume');
    expect(useOS.getState().windows).toHaveLength(0);
  });
  it('switching system clears open windows', () => {
    useOS.getState().openApp('about');
    useOS.getState().setOS('linux');
    expect(useOS.getState().windows).toHaveLength(0);
  });
});
