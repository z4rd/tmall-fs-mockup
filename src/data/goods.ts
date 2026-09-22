import type { StoreKey } from './store';

export type GoodsFamily = 'men' | 'women' | 'commercial';

/** Kids 一级 tab（大童 / 幼童 / 婴童），与主店 `GoodsFamily` 同层级深度，见 §2.7.1。 */
export type KidsFamily = 'big' | 'little' | 'baby';

export type StoreTabItem = {
  key: string;
  label: string;
  sublabel?: string;
};

export type GoodsStoreConfig = {
  store: StoreKey;
  tabs?: { variant: 'wrapped' | 'bare'; items: StoreTabItem[] };
  /** 左导航容器起点 y（报告 §3.1.1） */
  railTop: number;
  /** 一级 tab 区顶边 y；无 tab 时不设 */
  headerTop?: number;
  /** `Header 2` 或 Kids 裸 Tabs 高度 */
  headerHeight?: number;
  topImage: string;
  bottomNavImage: string;
};

export type GoodsCategory = { key: string; label: string };

export type GoodsState = {
  store: StoreKey;
  family?: GoodsFamily | KidsFamily;
  category: string;
  height: number;
  panel: string;
};

const NIKE_TABS_WRAPPED: StoreTabItem[] = [
  { key: 'men', label: '选购男子' },
  { key: 'women', label: '选购女子' },
  { key: 'kids', label: '选购儿童' },
];

const NIKE_TABS_COMMERCIAL: StoreTabItem[] = [
  { key: 'commercial', label: '双11专区' },
  { key: 'men', label: '选购男子' },
  { key: 'women', label: '选购女子' },
  { key: 'kids', label: '选购儿童' },
];

export const NIKE_CATEGORIES: Record<GoodsFamily, GoodsCategory[]> = {
  men: [
    { key: 'hot', label: '热门爆款' },
    { key: 'new', label: '当季上新' },
    { key: 'lookbook', label: '夏日穿搭' },
    { key: 'shoes', label: '鞋类' },
    { key: 'apparel', label: '服饰配件' },
    { key: 'running', label: '跑步' },
    { key: 'basketball', label: '篮球' },
    { key: 'lifestyle', label: '运动休闲' },
    { key: 'football', label: '足球' },
    { key: 'tennis', label: '网球高尔夫' },
    { key: 'outdoor', label: '户外' },
    { key: 'training', label: '健身瑜伽' },
    { key: 'skate', label: '滑板' },
    { key: 'jordan', label: 'Jordan' },
  ],
  women: [
    { key: 'hot', label: '热门爆款' },
    { key: 'new', label: '当季上新' },
    { key: 'lookbook', label: '夏日穿搭' },
    { key: 'shoes', label: '鞋类' },
    { key: 'apparel', label: '服饰配件' },
    { key: 'running', label: '跑步' },
    { key: 'basketball', label: '篮球' },
    { key: 'lifestyle', label: '运动休闲' },
    { key: 'football', label: '足球' },
    { key: 'tennis', label: '网球高尔夫' },
    { key: 'outdoor', label: '户外' },
    { key: 'training', label: '健身瑜伽' },
  ],
  commercial: [
    { key: 'flash30', label: '限时 3 折' },
    { key: 'half50', label: '5 折专区' },
    { key: 'off70', label: '7 折专区' },
  ],
};

export const DEFAULT_CATEGORY: Record<GoodsFamily, string> = {
  men: 'new',
  women: 'new',
  commercial: 'flash30',
};

/** ACG / Jordan 无族维，左导航为单维类目（Stage 8b 按稿补全条目数）。 */
export const ACG_CATEGORIES: GoodsCategory[] = [
  { key: 'highlight', label: '高光新品' },
  { key: 'shoes', label: '鞋类' },
  { key: 'scenes', label: '按场景选购' },
];

export const JORDAN_CATEGORIES: GoodsCategory[] = [
  { key: 'men', label: '男子' },
  { key: 'classic', label: '经典复刻' },
  { key: 'basketball', label: '篮球实战' },
];

export const KIDS_CATEGORIES: Record<KidsFamily, GoodsCategory[]> = {
  big: [
    { key: 'weekly', label: '每周上新' },
    { key: 'summer', label: '夏日专区' },
    { key: 'boys-shoes', label: '男童鞋类' },
    { key: 'girls-shoes', label: '女童鞋类' },
    { key: 'boys-apparel', label: '男童服配' },
    { key: 'girls-apparel', label: '女童服配' },
    { key: 'football', label: '足球' },
    { key: 'running', label: '跑步' },
    { key: 'basketball', label: '篮球' },
    { key: 'other', label: '其他运动' },
  ],
  little: [
    { key: 'weekly', label: '每周上新' },
    { key: 'summer', label: '夏日专区' },
    { key: 'shoes', label: '鞋类' },
    { key: 'apparel', label: '服配' },
  ],
  baby: [{ key: 'weekly', label: '每周上新' }],
};

export const DEFAULT_KIDS_CATEGORY: Record<KidsFamily, string> = {
  big: 'weekly',
  little: 'weekly',
  baby: 'weekly',
};

export const DEFAULT_ACG_CATEGORY = 'highlight';
export const DEFAULT_JORDAN_CATEGORY = 'men';

/** 主店宝贝页配置（四店扩展在 Stage 8b 接切图）。 */
export const GOODS_STORES: Record<StoreKey, GoodsStoreConfig> = {
  nike: {
    store: 'nike',
    tabs: { variant: 'wrapped', items: NIKE_TABS_WRAPPED },
    railTop: 325,
    headerTop: 223,
    headerHeight: 99,
    topImage: '/images/goods/nike-top.webp',
    bottomNavImage: '/images/goods/nike-bottom-nav.webp',
  },
  acg: {
    store: 'acg',
    railTop: 276,
    topImage: '/images/goods/acg-top.webp',
    bottomNavImage: '/images/goods/acg-bottom-nav.webp',
  },
  jordan: {
    store: 'jordan',
    railTop: 276,
    topImage: '/images/goods/jordan-top.webp',
    bottomNavImage: '/images/goods/jordan-bottom-nav.webp',
  },
  kids: {
    store: 'kids',
    tabs: {
      variant: 'bare',
      items: [
        { key: 'big', label: '大童', sublabel: '大童7岁+' },
        { key: 'little', label: '幼童', sublabel: '幼童3-7岁' },
        { key: 'baby', label: '婴童', sublabel: '婴童0-3岁' },
      ],
    },
    railTop: 296,
    headerTop: 240,
    headerHeight: 40,
    topImage: '/images/goods/kids-top.webp',
    bottomNavImage: '/images/goods/kids-bottom-nav.webp',
  },
};

/** 交互清单 §5.3.1：可跳转的左导航 key（其余渲染但不可点）。 */
const NIKE_CATEGORY_ENABLED: Record<GoodsFamily, ReadonlySet<string>> = {
  men: new Set(['new', 'shoes', 'running']),
  women: new Set(['new', 'shoes', 'lifestyle']),
  commercial: new Set(['flash30', 'half50', 'off70']),
};

const ACG_JORDAN_ENABLED = new Set(['highlight', 'shoes', 'scenes', 'men', 'classic', 'basketball']);

export function goodsTabsForFamily(family: GoodsFamily): StoreTabItem[] {
  if (family === 'commercial') return NIKE_TABS_COMMERCIAL;
  return NIKE_TABS_WRAPPED;
}

export function parseGoodsFamily(value: string | undefined): GoodsFamily | null {
  if (value === 'men' || value === 'women' || value === 'commercial') return value;
  return null;
}

export function parseKidsFamily(value: string | undefined): KidsFamily | null {
  if (value === 'big' || value === 'little' || value === 'baby') return value;
  return null;
}

export function goodsCategoriesFor(
  store: StoreKey,
  family?: GoodsFamily | KidsFamily,
): GoodsCategory[] {
  if (store === 'nike') {
    const f = parseGoodsFamily(family);
    return f ? NIKE_CATEGORIES[f] : NIKE_CATEGORIES.men;
  }
  if (store === 'acg') return ACG_CATEGORIES;
  if (store === 'jordan') return JORDAN_CATEGORIES;
  if (store === 'kids') {
    const f = parseKidsFamily(family) ?? 'big';
    return KIDS_CATEGORIES[f];
  }
  return NIKE_CATEGORIES.men;
}

export function defaultCategoryFor(
  store: StoreKey,
  family?: GoodsFamily | KidsFamily,
): string {
  if (store === 'nike') {
    const f = parseGoodsFamily(family);
    return f ? DEFAULT_CATEGORY[f] : DEFAULT_CATEGORY.men;
  }
  if (store === 'acg') return DEFAULT_ACG_CATEGORY;
  if (store === 'jordan') return DEFAULT_JORDAN_CATEGORY;
  if (store === 'kids') {
    const f = parseKidsFamily(family) ?? 'big';
    return DEFAULT_KIDS_CATEGORY[f];
  }
  return DEFAULT_CATEGORY.men;
}

/** 左导航条目是否响应点击（清单内 + 已有切图的状态）。 */
export function goodsCategoryIsEnabled(
  store: StoreKey,
  family: GoodsFamily | KidsFamily | undefined,
  categoryKey: string,
  hasSheet: boolean,
): boolean {
  if (!hasSheet) return false;
  if (store === 'nike') {
    const f = parseGoodsFamily(typeof family === 'string' ? family : undefined);
    if (!f) return false;
    return NIKE_CATEGORY_ENABLED[f].has(categoryKey);
  }
  if (store === 'acg' || store === 'jordan') {
    return ACG_JORDAN_ENABLED.has(categoryKey);
  }
  if (store === 'kids') return hasSheet;
  return false;
}
