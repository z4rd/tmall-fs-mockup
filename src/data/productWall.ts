import { parseStoreKey, type StoreKey } from './store';

export type { StoreKey };

/**
 * 通用二级产品墙：每店一张 375×815 切图（见报告 §2.8）。
 * 资产路径在导图后填入 `public/images/product-wall/`。
 */
/** @3 PNG 母版落 `assets-src/product-wall/`；运行时 `public/images/product-wall/*.png`。 */
export const PRODUCT_WALL_SLICE: Record<StoreKey, string> = {
  nike: '/images/product-wall/nike.png',
  acg: '/images/product-wall/acg.png',
  jordan: '/images/product-wall/jordan.png',
  kids: '/images/product-wall/kids.png',
};

/** Figma 导出用 nodeId（`01-figma-node-manifest.md` §1–4）。 */
/** 位图内天猫原生 ← 热区（375 设计 px，与 `TmallChrome` `.cs-back` 一致）。 */
export const PRODUCT_WALL_BACK_HIT = { x: 16, y: 68, w: 44, h: 44, pad: 14 } as const;

export const PRODUCT_WALL_FIGMA_NODE: Record<StoreKey, string> = {
  nike: '4015:15580',
  acg: '4021:22726',
  jordan: '4021:22736',
  kids: '4021:24177',
};

export { parseStoreKey };
