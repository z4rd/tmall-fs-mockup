import { useEffect } from 'react';
import { HashRouter, useLocation } from 'react-router-dom';
import { setLastShopPath } from './router/shopContext';
import { PasswordGate } from './auth/PasswordGate';
import { ScaleViewport } from './components/layout/ScaleViewport';
import { RouteMotion } from './router/RouteMotion';

function ShopPathTracker() {
  const { pathname } = useLocation();
  useEffect(() => {
    setLastShopPath(pathname);
  }, [pathname]);
  return null;
}

export function App() {
  return (
    <PasswordGate>
      <HashRouter>
        <ShopPathTracker />
        <ScaleViewport>
          <RouteMotion />
        </ScaleViewport>
      </HashRouter>
    </PasswordGate>
  );
}
