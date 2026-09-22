import type { Floor } from './floors';

/** ACG 首页 `2553:71355`，楼层间距 8（§2.10）。 */
export const ACG_FLOORS: Floor[] = [
  { key: 'hero', title: '', height: 530 },
  { key: 'doorway-4', title: '', height: 120 },
  { key: 'new-arrivals-1', title: '当季主推', height: 650 },
  { key: 'sports-zone-a', title: '运动专区', height: 732 },
  { key: 'sports-zone-b', title: '运动专区', height: 776 },
  { key: 'story-kdoy', title: '', height: 539 },
  { key: 'grid-1', title: '', height: 820 },
  { key: 'banner-cdp', title: '', height: 833 },
  { key: 'grid-2', title: '', height: 820 },
  { key: 'new-arrivals-2', title: '', height: 586 },
  { key: 'brand-matrix', title: '品牌矩阵', height: 348 },
  { key: 'closing', title: '', height: 729 },
];

/** Jordan 首页 `2472:16099`，楼层间距 24。 */
export const JORDAN_FLOORS: Floor[] = [
  { key: 'p1', title: '', height: 613 },
  { key: 'launch-calendar', title: '尖货日历', height: 422 },
  { key: 'new-shoes', title: '新鞋亮点', height: 462 },
  { key: 'membership', title: '会员', height: 130 },
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
  { key: 'closing', title: '', height: 391 },
];

/**
 * Kids（大童 7 岁+）首页 `4041:25654`，楼层间距 40。
 *
 * 根帧 375 × 7037：顶部 88 为 chrome 位图、底部 70 为 Bottom Nav 位图，两者都由
 * 应用自身的 chrome 渲染，不入楼层；中间 `Main` 帧 363 宽 @ x6，上下各留 12。
 */
export const KIDS_FLOORS: Floor[] = [
  { key: 'p1-story', title: '', height: 533 },
  { key: 'new-product', title: '新货上架', height: 758 },
  { key: 'seasonal-picks', title: '夏日趣玩不设限', height: 545 },
  { key: 'membership', title: '耐克会员专享', height: 136 },
  { key: 'sports-shelf', title: '为体育课选购', height: 513 },
  { key: 'ranking', title: '夏日大童热销榜', height: 642 },
  { key: 'lookbook-grid', title: '夏日运动潮搭', height: 404 },
  { key: 'classic-footwear', title: '经典鞋款', height: 626 },
  { key: 'apparel', title: '必入服饰及配件', height: 625 },
  { key: 'family-pack', title: '家庭换新', height: 459 },
  { key: 'sports-navigation', title: '运动场景探索', height: 154 },
  { key: 'product-navigation', title: '商品导航', height: 660 },
  { key: 'store-navigation', title: '品牌矩阵', height: 320 },
];

export const STORE_FLOOR_GAP = { acg: 8, jordan: 24, kids: 40 } as const;

export type StoreVariant = 'acg' | 'jordan' | 'kids';

export const STORE_FLOORS: Record<StoreVariant, Floor[]> = {
  acg: ACG_FLOORS,
  jordan: JORDAN_FLOORS,
  kids: KIDS_FLOORS,
};
