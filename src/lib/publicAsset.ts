/**
 * 替换 `public/` 下位图后递增，避免浏览器长期缓存旧 PNG（路径不变时 Vite 不会自动换 hash）。
 * 2026-09-22：ACG / Kids 也在 Figma 去掉烤死底栏后重导（`20260922-acg-kids-reexport`）。
 * 2026-09-22：主店三个变体（男子 / 女子 / 双 11）的宝贝页 landing + 八张 sheet 同样重导。
 * 2026-09-22：全量二次压缩 —— WebP 从 q95 降到 q85，并新增同名 AVIF（`<picture>` 优先）。
 *   每张位图的字节都变了，这个键必须跟着换，否则 `_headers` 里新加的一年 immutable
 *   会把旧的大图永久钉在同事的手机上。
 * 2026-10-12：入口页 6 张 banner 从 Figma `4001:19172` 重导。
 * 2026-10-12：全店 Nike 会员专享 banner 从 Figma `4135:2156` 统一重导。
 * 2026-10-12：ACG 首页从 Figma `2553:71355` 完整更新。
 * 2026-10-12：宝贝分类页 8 张 detail sheet 从 Figma `4137:*` 重导。
 * 2026-10-12：拆分 Nike 旗舰店儿童分类页与 Kids 独立店大童页资源。
 * 2026-10-12：Jordan 宝贝分类页 4 张 detail sheet 更新。
 * 2026-10-12：Kids 首页三年龄版本与 7 张宝贝分类 detail sheet 更新。
 * 2026-10-12：ACG 首页 grid-2 改为按可见溢出完整导出，修复尾部截断。
 * 2026-10-12：男子 / 女子夏日穿搭右侧 SKU 小卡接入 6 支动态视频。
 */
export const PUBLIC_ASSET_CACHE_KEY = '20261012-lookbook-sku-v1';

/** 相对 `public/` 的资源路径，配合 Vite `base: './'`，子目录托管也能打开。 */
export function publicAsset(path: string): string {
  const base = import.meta.env.BASE_URL || './';
  const clean = path.replace(/^\.?\//, '');
  const q = PUBLIC_ASSET_CACHE_KEY ? `?v=${encodeURIComponent(PUBLIC_ASSET_CACHE_KEY)}` : '';
  return `${base}${clean}${q}`;
}
