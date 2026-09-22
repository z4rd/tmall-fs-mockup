/** 相对 `public/` 的资源路径，配合 Vite `base: './'`，子目录托管也能打开。 */
export function publicAsset(path: string): string {
  const base = import.meta.env.BASE_URL || './';
  const clean = path.replace(/^\.?\//, '');
  return `${base}${clean}`;
}
