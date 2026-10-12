import type { Floor } from './floors';

/** ACG 首页 `2553:71355` / 内容帧 `4138:3243`，楼层间距 8（§2.10）。 */
export const ACG_FLOORS: Floor[] = [
  { key: 'hero', title: '', height: 522 },
  { key: 'doorway-4', title: '', height: 120 },
  { key: 'new-arrivals-1', title: '当季主推', height: 612 },
  { key: 'membership', title: '耐克会员专享', height: 222 },
  { key: 'sports-zone-a', title: '', height: 643 },
  { key: 'sports-zone-b', title: '', height: 751 },
  { key: 'grid-1', title: '', height: 664 },
  { key: 'grid-2', title: '', height: 4951 },
];

export const ACG_FLOOR_GAP_BEFORE: Record<string, number> = {
  hero: 0,
  'doorway-4': 8,
  'new-arrivals-1': 8,
  membership: 20,
  'sports-zone-a': 20,
  'sports-zone-b': 0,
  'grid-1': 0,
  'grid-2': 0,
};

/**
 * Jordan 首页 `2472:16099`，楼层间距 24。
 *
 * `aj1` / `ranking` / `seasonal` / `street` 右上角有 Liquid Glass 的「男子 / 女子」胶囊，
 * 它的 blur 溢出楼层帧、帧又不裁剪子层，所以按 frame 导出会得到 369 ×（声明高 + 26）
 * 的画布。重导这四层后必须把顶部 26 和右侧 6 裁掉再入库：`FloorSlice` 用
 * `object-fit: cover`，多出来的空白会让整层缩到 98.4% 并把底部圆角吃掉。
 * `test-assets.py` 的 `JORDAN_FLOOR_WH` 锁死了逐层精确尺寸来拦这件事。
 *
 * `membership` 与 `closing` 的设计帧是 375 满宽（其余层 363 @ x6），卡片本身仍是居中的
 * 363，两侧 6 是页面底色 —— 被 363 栏裁掉的正好是这圈底色，不要误当成出血去裁图。
 */
export const JORDAN_FLOORS: Floor[] = [
  { key: 'p1', title: '', height: 613 },
  { key: 'launch-calendar', title: '尖货日历', height: 422 },
  { key: 'new-shoes', title: '新鞋亮点', height: 462 },
  { key: 'membership', title: '耐克会员专享', height: 222 },
  { key: 'aj1', title: 'Air Jordan 1', height: 448 },
  { key: 'aj-line', title: '正代系列', height: 360 },
  { key: 'ranking', title: '热销鞋榜', height: 538 },
  { key: 'dongdan', title: '下站东单', height: 440 },
  { key: 'seasonal', title: '当季甄选', height: 558 },
  { key: 'street', title: '出街潮鞋', height: 576 },
  { key: 'shelf-11', title: '', height: 451 },
  { key: 'shelf-12', title: '', height: 398 },
  { key: 'shelf-13', title: '', height: 543 },
  { key: 'shelf-14', title: '', height: 579 },
  { key: 'product-finder', title: '', height: 486 },
  { key: 'brand-matrix', title: '品牌矩阵', height: 312 },
  /** `2472:16681` 2026-09-22 重导：Figma 已去掉烤死底栏，@3x 导出 1125×960（320@1x）。 */
  { key: 'closing', title: '', height: 320 },
];

/**
 * Kids（大童 7 岁+）首页 `4069:2030`，楼层间距 40。
 *
 * 根帧 375 × 7065：顶部 88 为 chrome 位图、底部 71 为 Bottom Nav 位图，两者都由
 * 应用自身的 chrome 渲染，不入楼层；中间 `Main` 帧 363 宽 @ x6，上下各留 12。
 *
 * 设计稿只有「GS - 7+」这一个家庭页。幼童 / 婴童只在宝贝页 `KidsFamily` 一级 tab
 * 里出现（各自有切图，见 `goodsAssets.ts`），店铺首页没有分族路由，本表即全部。
 */
export const KIDS_FLOORS: Floor[] = [
  { key: 'p1-story', title: '', height: 533 },
  { key: 'new-product', title: '新货上架', height: 758 },
  { key: 'seasonal-picks', title: '夏日趣玩不设限', height: 545 },
  { key: 'membership', title: '耐克会员专享', height: 222 },
  { key: 'sports-shelf', title: '为体育课选购', height: 540 },
  { key: 'ranking', title: '夏日大童热销榜', height: 642 },
  { key: 'lookbook-grid', title: '夏日运动潮搭', height: 404 },
  { key: 'classic-footwear', title: '经典鞋款', height: 626 },
  { key: 'apparel', title: '必入服饰及配件', height: 625 },
  { key: 'family-pack', title: '家庭换新', height: 459 },
  { key: 'sports-navigation', title: '运动场景探索', height: 154 },
  { key: 'product-navigation', title: '商品导航', height: 660 },
  { key: 'store-navigation', title: '品牌矩阵', height: 320 },
];

export const STORE_FLOOR_GAP = { acg: 0, jordan: 24, kids: 40 } as const;

export type StoreVariant = 'acg' | 'jordan' | 'kids';

export const STORE_FLOORS: Record<StoreVariant, Floor[]> = {
  acg: ACG_FLOORS,
  jordan: JORDAN_FLOORS,
  kids: KIDS_FLOORS,
};
