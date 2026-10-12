import { useEffect } from 'react';
import { HashRouter, useLocation } from 'react-router-dom';
import { setLastShopPath } from './router/shopContext';
import { PasswordGate } from './auth/PasswordGate';
import { ScaleViewport } from './components/layout/ScaleViewport';
import { RouteMotion } from './router/RouteMotion';

const LIGHT_THEME_COLOR = '#FEFEFE';
const DARK_THEME_COLOR = '#5F6062';
const PRODUCT_WALL_THEME_COLOR = '#F4B37D';

const THEME_COLOR_BY_TONE = {
  light: LIGHT_THEME_COLOR,
  dark: DARK_THEME_COLOR,
  'product-wall': PRODUCT_WALL_THEME_COLOR,
} as const;

const THEME_COLOR_MEDIA = ['(prefers-color-scheme: light)', '(prefers-color-scheme: dark)'] as const;

function findThemeColorMeta(media?: string) {
  return Array.from(document.head.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]')).find(
    (meta) => (media ? meta.getAttribute('media') === media : !meta.hasAttribute('media')),
  );
}

function createThemeColorMeta(color: string, media?: string) {
  const meta = document.createElement('meta');
  meta.setAttribute('name', 'theme-color');
  if (media) meta.setAttribute('media', media);
  meta.setAttribute('content', color);
  return meta;
}

function replaceThemeColorMeta(meta: HTMLMetaElement, color: string) {
  if (meta.getAttribute('content') === color) return meta;
  const replacement = meta.cloneNode(false) as HTMLMetaElement;
  replacement.setAttribute('content', color);
  meta.replaceWith(replacement);
  return replacement;
}

function applyThemeColor(color: string) {
  const primary = replaceThemeColorMeta(
    findThemeColorMeta() ?? document.head.appendChild(createThemeColorMeta(color)),
    color,
  );

  for (const media of THEME_COLOR_MEDIA) {
    const existing = findThemeColorMeta(media);
    const meta = existing ?? createThemeColorMeta(color, media);
    if (!existing) primary.after(meta);
    replaceThemeColorMeta(meta, color);
  }
}

function ShopPathTracker() {
  const { pathname } = useLocation();
  useEffect(() => {
    setLastShopPath(pathname);
  }, [pathname]);
  return null;
}

function MobileChromeTone() {
  const { pathname } = useLocation();

  useEffect(() => {
    const root = document.documentElement;
    const apply = () => {
      const tone = pathname.startsWith('/list')
        ? 'product-wall'
        : (pathname.startsWith('/home/') || pathname.startsWith('/store/')) &&
            root.dataset.chromeDark === 'true'
          ? 'dark'
          : 'light';
      root.dataset.mobileChromeTone = tone;
      // 底部地址栏由 html/body canvas 保持白色；theme-color 尽量驱动顶部系统栏。
      applyThemeColor(THEME_COLOR_BY_TONE[tone]);
    };

    apply();
    const observer = new MutationObserver(apply);
    observer.observe(root, { attributes: true, attributeFilter: ['data-chrome-dark'] });

    return () => observer.disconnect();
  }, [pathname]);

  return null;
}

export function App() {
  return (
    <PasswordGate>
      <HashRouter>
        <ShopPathTracker />
        <MobileChromeTone />
        <ScaleViewport>
          <RouteMotion />
        </ScaleViewport>
      </HashRouter>
    </PasswordGate>
  );
}
