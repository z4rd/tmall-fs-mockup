import { parseStoreKey, type StoreKey } from './store';

export type { StoreKey };

/**
 * 通用二级产品墙：每店一张 375×815 切图（见报告 §2.8）。
 * 资产路径在导图后填入 `public/images/product-wall/`。
 */
/** @3 母版落 `assets-src/product-wall/`；运行时 `public/images/product-wall/*.webp`。 */
export const PRODUCT_WALL_SLICE: Record<StoreKey, string> = {
  nike: '/images/product-wall/nike.webp',
  acg: '/images/product-wall/acg.webp',
  jordan: '/images/product-wall/jordan.webp',
  kids: '/images/product-wall/kids.webp',
};

/**
 * 产品墙左上角返回热区的几何（全部单位 = 375 宽设计 px，即位图 @1x 像素）。
 *
 * 位图里已经烤死了天猫原生的 ← 雪佛龙，所以这里只铺**透明热区**、不叠活矢量（叠了会重影）。
 *
 * 锚点怎么来的：把四张 `public/images/product-wall/*.webp`（@3，1125×2445）解码后逐像素
 * 扫左上角，四张完全一致 —— 雪佛龙墨框 x14.67..22.67 / y71.00..85.33 @1x，
 * 故墨心 = 墨框中点 ≈ (18.7, 78.2)。四店同模板，无需逐店偏移。
 * 量法见 `agent-runs/2026-09-22-pw-back/measure_chevron.py`。
 *
 * 热区尺寸怎么来的：雪佛龙本体只有 8×14.3，远小于可点下限，所以热区独立给 48×48
 * （> 44×44 最小可点面积，留出余量好点中），以墨心为中心摆放；
 * `ProductWall.tsx` 里 `left/top = 锚点 − 尺寸/2`，再夹到 ≥ 0，免得热区溢出屏幕左沿白白浪费面积。
 */
export const PRODUCT_WALL_BACK_CHROME = {
  /** 位图 ← 墨心（@1x）。 */
  anchorX: 18.7,
  anchorY: 78.2,
  /** 热区尺寸（@1x）。 */
  w: 48,
  h: 48,
} as const;

/** Figma 导出用 nodeId（`01-figma-node-manifest.md` §1–4）。 */
export const PRODUCT_WALL_FIGMA_NODE: Record<StoreKey, string> = {
  nike: '4015:15580',
  acg: '4021:22726',
  jordan: '4021:22736',
  kids: '4021:24177',
};

export { parseStoreKey };
