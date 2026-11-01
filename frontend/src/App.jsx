import { lazy, Suspense, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useOS } from './store/osStore.js';
import { usePortfolio } from './store/portfolioStore.js';
import BootScreen from './os/boot/BootScreen.jsx';
import OSSelector from './os/selector/OSSelector.jsx';

const WindowsDesktop = lazy(() => import('./os/windows/WindowsDesktop.jsx'));
const MacDesktop = lazy(() => import('./os/macos/MacDesktop.jsx'));
const LinuxDesktop = lazy(() => import('./os/linux/LinuxDesktop.jsx'));
const IPhoneOS = lazy(() => import('./os/iphone/IPhoneOS.jsx'));
const AndroidOS = lazy(() => import('./os/android/AndroidOS.jsx'));
const AdminApp = lazy(() => import('./admin/AdminApp.jsx'));

const SYSTEMS = { windows: WindowsDesktop, macos: MacDesktop, linux: LinuxDesktop, iphone: IPhoneOS, android: AndroidOS };

function Shell() {
  const { booted, os, mode } = useOS();
  const load = usePortfolio((s) => s.load);
  useEffect(() => { load(); }, [load]);
  useEffect(() => { document.documentElement.dataset.mode = mode; }, [mode]);

  if (!booted) return <BootScreen />;
  if (!os) return <OSSelector />;
  const System = SYSTEMS[os];
  return (
    <Suspense fallback={<div className="h-full grid place-items-center text-muted">Loading {os}…</div>}>
      <System />
    </Suspense>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/admin/*" element={<Suspense fallback={null}><AdminApp /></Suspense>} />
      <Route path="*" element={<Shell />} />
    </Routes>
  );
}
