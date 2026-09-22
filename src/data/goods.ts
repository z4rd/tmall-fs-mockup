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
  /**
   * 左导航容器起点 y（报告 §3.1.1）。
   *
   * 这是 category 态纵向对账的**唯一出口**：`Header 2` 的高度由
   * `railTop − goodsLandingDesigns.indexTabRowTop` 直接算出，不再另记一个 `headerHeight`。
   * 之前两者各记一份，ACG / Jordan 的 53 与 DOM 实际的 42 不一致，导轨就高了 11px。
   */
  railTop: number;
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

/**
 * 左导航条目逐稿抄录，六个索引入口各不相同，不能互相套用。
 *
 * 男子 `4012:13618` 13 条、女子 `4012:14535` 11 条 —— 女子把男子的「篮球 / 足球」并成
 * 一条「篮球足球」、「健身瑜伽」写作「训练瑜伽」，顺序也不同。两稿都**没有**「热门爆款」，
 * 此前代码在两族头部各多塞了一条。
 */
export const NIKE_CATEGORIES: Record<GoodsFamily, GoodsCategory[]> = {
  men: [
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
    { key: 'new', label: '当季上新' },
    { key: 'lookbook', label: '夏日穿搭' },
    { key: 'shoes', label: '鞋类' },
    { key: 'apparel', label: '服饰配件' },
    { key: 'running', label: '跑步' },
    { key: 'lifestyle', label: '运动休闲' },
    { key: 'tennis', label: '网球高尔夫' },
    { key: 'outdoor', label: '户外' },
    { key: 'training', label: '训练瑜伽' },
    { key: 'basketball-football', label: '篮球足球' },
    { key: 'jordan', label: 'Jordan' },
  ],
  // 双 11 `4012:15064`：左导航是折扣人群维，「限时 3 折 / 5 折 / 7 折」是页面内的卡片不是导航项。
  commercial: [
    { key: 'all', label: '全部折扣' },
    { key: 'men', label: '男子折扣' },
    { key: 'women', label: '女子折扣' },
  ],
};

export const DEFAULT_CATEGORY: Record<GoodsFamily, string> = {
  men: 'new',
  women: 'new',
  commercial: 'all',
};

/** ACG / Jordan 无族维，左导航为单维类目。ACG `4018:19240` 9 条、Jordan `4018:21622` 8 条。 */
export const ACG_CATEGORIES: GoodsCategory[] = [
  { key: 'highlight', label: '高光新品' },
  { key: 'shoes', label: '鞋类' },
  { key: 'apparel', label: '服饰' },
  { key: 'gear', label: '装备' },
  { key: 'men', label: '男子' },
  { key: 'women', label: '女子' },
  { key: 'kids', label: '儿童' },
  { key: 'scenes', label: '按场景选购' },
  { key: 'function', label: '按功能选购' },
];

export const JORDAN_CATEGORIES: GoodsCategory[] = [
  { key: 'featured', label: '好货推荐' },
  { key: 'men', label: '男子' },
  { key: 'women', label: '女子' },
  { key: 'kids', label: '儿童' },
  { key: 'classic', label: '经典复刻' },
  { key: 'street', label: '街头潮流' },
  { key: 'basketball', label: '篮球实战' },
  { key: 'golf', label: '高尔夫' },
];

/**
 * Kids 三族各有一份左导航，逐稿抄录：大童 `4021:23596` 10 条、幼童 `4021:23861` 8 条、
 * 婴童 `4021:23964` 5 条。
 *
 * 三份都是完整列表 —— 没有素材页的条目由 `goodsCategoryIsEnabled` 渲染成死区，**不要**
 * 因为某条点不动就把它从这里删掉。此前幼童只留了 4 条、婴童只留 1 条，正是照着「有没有
 * 切图」裁的，结果左导航短得和设计稿对不上。
 */
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
    { key: 'apparel', label: '服饰配件' },
    { key: 'football', label: '足球' },
    { key: 'running', label: '跑步' },
    { key: 'basketball', label: '篮球' },
    { key: 'other', label: '其他运动' },
  ],
  baby: [
    { key: 'weekly', label: '每周上新' },
    { key: 'summer', label: '夏日专区' },
    { key: 'shoes', label: '鞋类' },
    { key: 'apparel', label: '服饰配件' },
    { key: 'scenes', label: '生活场景' },
  ],
};

export const DEFAULT_KIDS_CATEGORY: Record<KidsFamily, string> = {
  big: 'weekly',
  little: 'weekly',
  baby: 'weekly',
};

export const DEFAULT_ACG_CATEGORY = 'highlight';
/**
 * 四店的默认项一律是左导航第一条。
 *
 * Jordan 这条此前是 `men`（第二条），原因是「好货推荐」当时没有素材页、点进去就是空白。
 * `4018:21533` 已补导为 `jordan--featured`，回到与主店 / ACG / Kids 一致的第一条。
 */
export const DEFAULT_JORDAN_CATEGORY = 'featured';

/**
 * 分类态右侧 sheet 列底部裁切（@1x）。
 *
 * 只能裁**右侧栏实测死区**（`x117..359` 列、方差阈值见 agent 脚本），不能按店取 max —
 * Jordan 四张 sheet 死区 104–129 不等，统一 130 会把「篮球服饰/装备」等底行切掉。
 * 主店已由 `install_goods_png.py` 裁净，此处为 0。
 */
export const JORDAN_SHEET_BOTTOM_CLIP_PX: Record<string, number> = {
  featured: 104,
  classic: 110,
  basketball: 119,
  men: 129,
};

/**
 * ACG 三张 sheet 的死区（2026-09-22 去底栏重导后实测，尺子同上：
 * `agent-runs/2026-09-22-acg-kids-goods-export/measure_tail.py`）。
 *
 * 设计侧删掉烤死的 button nav 后**帧高没跟着收**，页尾多出一整条约 105 的白，
 * 所以这三张也要走 Jordan 那套 clip-path + 负 margin，不是「重导即净」。
 */
export const ACG_SHEET_BOTTOM_CLIP_PX: Record<string, number> = {
  highlight: 103,
  shoes: 105,
  scenes: 106,
};

/**
 * Kids 七张 sheet 的死区，按 `<族>/<分类>` 索引 —— 三张 `weekly` 同名不同族，
 * 只看 category 会串门。`big/other` 的 473 不是异常：那张稿右侧只排到「网球 / 户外 / 其他」
 * 一行，下面全是左导轨（活组件）对应的空白，右侧栏必须整段收掉。
 */
export const KIDS_SHEET_BOTTOM_CLIP_PX: Record<string, number> = {
  'big/weekly': 104,
  'big/boys-shoes': 103,
  'big/boys-apparel': 105,
  'big/running': 103,
  'big/other': 473,
  'little/weekly': 104,
  'baby/weekly': 105,
};

export function goodsSheetBottomClipPx(
  store: StoreKey,
  category: string,
  family?: string,
): number {
  if (store === 'jordan') {
    return JORDAN_SHEET_BOTTOM_CLIP_PX[category] ?? 0;
  }
  if (store === 'acg') {
    return ACG_SHEET_BOTTOM_CLIP_PX[category] ?? 0;
  }
  if (store === 'kids' && family) {
    return KIDS_SHEET_BOTTOM_CLIP_PX[`${family}/${category}`] ?? 0;
  }
  return 0;
}

/** 主店宝贝页配置（四店扩展在 Stage 8b 接切图）。 */
export const GOODS_STORES: Record<StoreKey, GoodsStoreConfig> = {
  nike: {
    store: 'nike',
    tabs: { variant: 'wrapped', items: NIKE_TABS_WRAPPED },
    railTop: 325,
  },
  // ACG / Jordan 没有族 tab，Header 2 里只剩一级 tab 行（217..259）+ 到左导轨之间的 17px 白底。
  acg: {
    store: 'acg',
    railTop: 276,
  },
  jordan: {
    store: 'jordan',
    railTop: 276,
  },
  kids: {
    store: 'kids',
    // 文案逐字抄自 `4021:23596`：主标题带年龄段，副标题是脚长区间。
    tabs: {
      variant: 'bare',
      items: [
        { key: 'big', label: '大童7岁+', sublabel: '脚长22.5-25cm' },
        { key: 'little', label: '幼童3-6岁', sublabel: '脚长17-22cm' },
        { key: 'baby', label: '婴童0-36个月', sublabel: '脚长11-16cm' },
      ],
    },
    railTop: 296,
  },
};

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

/**
 * 左导航条目是否响应点击。
 *
 * 唯一判据就是「这个类目有没有素材页」——有切图就可点，没有就渲染成死区。此前另有一张
 * 手写的白名单，和 `GOODS_SHEET_EXPORTS` 各记一份、改一边漏一边，已删除。
 */
export function goodsCategoryIsEnabled(hasSheet: boolean): boolean {
  return hasSheet;
}
