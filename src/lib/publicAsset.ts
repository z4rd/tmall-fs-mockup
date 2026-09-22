/**
 * 替换 `public/` 下位图后递增，避免浏览器长期缓存旧 PNG（路径不变时 Vite 不会自动换 hash）。
 * 2026-09-22：ACG / Kids 也在 Figma 去掉烤死底栏后重导（`20260922-acg-kids-reexport`）。
 */
export const PUBLIC_ASSET_CACHE_KEY = '20260922-acg-kids-reexport';

/** 相对 `public/` 的资源路径，配合 Vite `base: './'`，子目录托管也能打开。 */
export function publicAsset(path: string): string {
  const base = import.meta.env.BASE_URL || './';
  const clean = path.replace(/^\.?\//, '');
  const q = PUBLIC_ASSET_CACHE_KEY ? `?v=${encodeURIComponent(PUBLIC_ASSET_CACHE_KEY)}` : '';
  return `${base}${clean}${q}`;
}
