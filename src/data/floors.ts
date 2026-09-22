/** 店铺首页变体（路由键），与楼层内男子/女子分段器的 `Gender` 正交。 */
export type HomeVariant = 'men' | 'women' | 'commercial';

/** 楼层内 Gender 分段器维度，仅男子/女子。 */
export type Gender = 'men' | 'women';

export type Floor = {
  key: string;
  /** 楼层在页面上的标题；通栏 KV 没有标题，留空。 */
  title: string;
  /** 375 空间下的设计高度，量自 Figma 画板。 */
  height: number;
};

/**
 * 楼层顺序与高度量自 FS - Men（2692:61085）与 FS - Women（2692:61087）。
 * 内容宽 363、左右各 6px 槽、楼层间固定 40px 间距，因此整页高度可由此推算。
 */
const MEN: Floor[] = [
  { key: 'p1-story', title: '', height: 552 },
  { key: 'sports-zone', title: '运动专区', height: 990 },
  { key: 'membership', title: '耐克会员专享', height: 136 },
  { key: 'launch-calendar', title: '尖货日历', height: 403 },
  { key: 'new-product', title: '新货上架', height: 622 },
  { key: 'ranking', title: '热卖榜单', height: 642 },
  { key: 'lookbook-grid', title: '夏日穿搭', height: 580 },
  { key: 'classic-footwear', title: '经典鞋款', height: 626 },
  { key: 'apparel', title: '必入服饰', height: 625 },
  { key: 'halo-shelf', title: '为你甄选', height: 552 },
  { key: 'sports-navigation', title: '', height: 283 },
  { key: 'product-navigation', title: '商品导航', height: 514 },
  { key: 'store-navigation', title: '品牌矩阵', height: 320 },
];

/**
 * 女子页多出 Shop By Color 与 Family Pack，并把 Ranking 移到 Lookbook 之后。
 * 尚未在女子画板上实测的高度暂时沿用男子页的值，会在逐层搭建时逐个修正。
 */
const WOMEN: Floor[] = [
  { key: 'p1-story', title: '', height: 552 },
  { key: 'sports-zone', title: '运动专区', height: 990 },
  { key: 'membership', title: '耐克会员专享', height: 136 },
  { key: 'launch-calendar', title: '尖货日历', height: 403 },
  { key: 'new-product', title: '新货上架', height: 622 },
  { key: 'lookbook-grid', title: '夏日穿搭', height: 580 },
  { key: 'shop-by-color', title: '按色彩选购', height: 648 },
  { key: 'ranking', title: '热卖榜单', height: 642 },
  { key: 'classic-footwear', title: '经典鞋款', height: 626 },
  { key: 'apparel', title: '必入服饰', height: 625 },
  { key: 'family-pack', title: '儿童专区', height: 552 },
  { key: 'halo-shelf', title: '为你甄选', height: 552 },
  { key: 'sports-navigation', title: '', height: 283 },
  { key: 'product-navigation', title: '商品导航', height: 514 },
  { key: 'store-navigation', title: '品牌矩阵', height: 320 },
];

/** Home - Commercial（`2728:67015`）13 层，高度量自报告 §2.6。 */
const COMMERCIAL: Floor[] = [
  { key: 'p1-story', title: '', height: 650 },
  { key: 'membership', title: '耐克会员专享', height: 238 },
  { key: 'flash-deals', title: '限时惊喜折扣', height: 722 },
  { key: 'ranking', title: '热卖榜单', height: 642 },
  { key: 'apparel', title: '必入服饰', height: 577 },
  { key: 'discount-zones', title: '折扣专区', height: 576 },
  { key: 'classic-footwear', title: '经典鞋款', height: 545 },
  { key: 'apparel-2', title: '必入服饰', height: 545 },
  { key: 'seasonal-picks', title: '夏季精选', height: 610 },
  { key: 'family-pack', title: '儿童专区', height: 552 },
  // 切图 `sportszone.png` @3x 2109 → 703 设计高；Figma 帧 `2728:67874` 声明 747，以实导为准。
  { key: 'sports-zone', title: '运动专区', height: 703 },
  { key: 'product-navigation', title: '商品导航', height: 514 },
  { key: 'store-navigation', title: '品牌矩阵', height: 320 },
];

export const FLOORS: Record<HomeVariant, Floor[]> = {
  men: MEN,
  women: WOMEN,
  commercial: COMMERCIAL,
};

export const FLOOR_GAP = 40;

export function pageHeight(variant: HomeVariant) {
  const floors = FLOORS[variant];
  return floors.reduce((sum, f) => sum + f.height, 0) + FLOOR_GAP * (floors.length - 1);
}
