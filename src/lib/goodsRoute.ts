import {
  DEFAULT_ACG_CATEGORY,
  DEFAULT_CATEGORY,
  DEFAULT_JORDAN_CATEGORY,
  DEFAULT_KIDS_CATEGORY,
  type GoodsFamily,
  type KidsFamily,
  parseGoodsFamily,
  parseKidsFamily,
} from '../data/goods';
import { isStoreKey, type StoreKey } from '../data/store';

export type GoodsView = 'browse' | 'category';

export type GoodsRoute = {
  store: StoreKey;
  view?: GoodsView;
  /** 主店 / Commercial 族；Kids 为大童 / 幼童 / 婴童；ACG / Jordan 无此维 */
  family?: GoodsFamily | KidsFamily;
  category: string;
};

/**
 * 解析宝贝页 hash 路径段（不含 `/goods` 前缀）。
 * - `browse`：`/goods`、/goods/acg` 等根瀑布流位图
 * - `category`：`/goods/men/new`、`/goods/acg/highlight` 等 Header2 + 左导航态
 */
export function parseGoodsRoute(
  seg1?: string,
  seg2?: string,
  seg3?: string,
): GoodsRoute | null {
  if (!seg1) {
    return { store: 'nike', view: 'browse', category: '' };
  }

  if (isStoreKey(seg1)) {
    const store = seg1;
    if (store === 'nike') {
      if (!seg2) {
        return { store: 'nike', view: 'browse', category: '' };
      }
      const family = parseGoodsFamily(seg2);
      if (!family) return null;
      const category = seg3 ?? DEFAULT_CATEGORY[family];
      return { store, view: 'category', family, category };
    }
    if (store === 'kids') {
      if (!seg2) {
        return { store: 'kids', view: 'browse', category: '' };
      }
      const family = parseKidsFamily(seg2);
      if (!family) return null;
      const category = seg3 ?? DEFAULT_KIDS_CATEGORY[family];
      return { store, view: 'category', family, category };
    }
    if (!seg2) {
      return { store, view: 'browse', category: '' };
    }
    const category = seg2;
    return { store, view: 'category', category };
  }

  const family = parseGoodsFamily(seg1);
  if (!family) return null;
  const category = seg2 ?? DEFAULT_CATEGORY[family];
  return { store: 'nike', view: 'category', family, category };
}

export function goodsPath(route: GoodsRoute): string {
  const { store, view, family, category } = route;
  if (view === 'browse') {
    if (store === 'nike') return '/goods';
    return `/goods/${store}`;
  }

  if (store === 'nike') {
    if (family && parseGoodsFamily(family)) {
      return `/goods/${family}/${category}`;
    }
    return '/goods/men/new';
  }
  if (store === 'kids' && family) {
    return `/goods/kids/${family}/${category}`;
  }
  return `/goods/${store}/${category}`;
}

/** 从 browse 进入该店默认分类态（点原生「分类」）。 */
export function goodsDefaultCategoryPath(store: StoreKey): string {
  if (store === 'nike') {
    return goodsPath({ store: 'nike', view: 'category', family: 'men', category: DEFAULT_CATEGORY.men });
  }
  if (store === 'kids') {
    return goodsPath({
      store: 'kids',
      view: 'category',
      family: 'big',
      category: DEFAULT_KIDS_CATEGORY.big,
    });
  }
  if (store === 'acg') {
    return goodsPath({ store: 'acg', view: 'category', category: DEFAULT_ACG_CATEGORY });
  }
  return goodsPath({ store: 'jordan', view: 'category', category: DEFAULT_JORDAN_CATEGORY });
}
