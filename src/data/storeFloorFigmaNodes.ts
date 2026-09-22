import type { StoreVariant } from './storeFloors';

/** ACG 首页楼层子 frame（hero 由实拍视频替代，见 `StoreHome`）。 */
export const ACG_FLOOR_FIGMA: Record<string, string> = {
  'doorway-4': '2553:71386',
  'new-arrivals-1': '2553:71885',
  'sports-zone-a': '2553:71407',
  'sports-zone-b': '2553:71448',
  'story-kdoy': '2553:71511',
  'grid-1': '2553:71566',
  'banner-cdp': '2553:71645',
  'grid-2': '2553:71719',
  'new-arrivals-2': '2553:71785',
  'brand-matrix': '2553:71846',
  // 设计稿里还有一个 `2553:71883`「closing」帧，声明 375×729 但隔离渲染只有 375×6，
  // 是空的废弃帧，不入楼层表。见 `storeFloors.ts` 的 `ACG_FLOORS` 注释。
  // 注意 Jordan 也有一个 `closing`（`2472:16681`，391 高），那个是正常楼层，别一起清掉。
};

/** Jordan 首页楼层（P1 含 hero 位图；无独立 hero 视频）。 */
export const JORDAN_FLOOR_FIGMA: Record<string, string> = {
  p1: '4022:8324',
  'launch-calendar': '2553:69248',
  'new-shoes': '2553:69249',
  membership: '2553:69278',
  aj1: '2553:69250',
  'aj-line': '2553:69251',
  ranking: '2472:16707',
  dongdan: '2553:69247',
  seasonal: '2553:69252',
  street: '2553:69254',
  'shelf-11': '2553:69256',
  'shelf-12': '2553:69257',
  'shelf-13': '2553:69258',
  'shelf-14': '2553:69255',
  'product-finder': '2553:69259',
  'brand-matrix': '2472:16274',
  closing: '2472:16681',
};

/**
 * Kids（大童 7 岁+）首页楼层，取自 `4069:2030` 的 `Main` 帧（`4069:2034`）直接子层；无 hero 视频。
 *
 * 2026-09-22 设计师整体重发了一代节点（旧 `4041:257xx` / `4041:26xxx`）。十三层的 key、
 * 顺序与 40 的层间距都没变，逐层 @3 导出也与旧切图逐像素一致，**只有 `sports-shelf`
 * 由 513 改成 540**（旧稿把卡片底边裁掉了 27）。
 */
export const KIDS_FLOOR_FIGMA: Record<string, string> = {
  'p1-story': '4069:2035',
  'new-product': '4069:2092',
  'seasonal-picks': '4069:2154',
  membership: '4069:2208',
  'sports-shelf': '4069:2234',
  ranking: '4069:2314',
  'lookbook-grid': '4069:2394',
  'classic-footwear': '4069:2421',
  apparel: '4069:2465',
  'family-pack': '4069:2516',
  'sports-navigation': '4069:2576',
  'product-navigation': '4069:2608',
  'store-navigation': '4069:2720',
};

export const STORE_FLOOR_FIGMA: Record<StoreVariant, Record<string, string>> = {
  acg: ACG_FLOOR_FIGMA,
  jordan: JORDAN_FLOOR_FIGMA,
  kids: KIDS_FLOOR_FIGMA,
};

export const GOODS_CHROME_FIGMA: Record<string, string> = {
  nike: '4040:24331',
  acg: '4040:24332',
  jordan: '4040:24480',
  kids: '4040:24482',
};
