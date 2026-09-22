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
 *
 * - `browse`：`/goods`、`/goods/commercial`、`/goods/acg` 等根瀑布流位图
 * - `category`：`/goods/men/new`、`/goods/commercial/all`、`/goods/acg/highlight` 等
 *
 * browse 态也带 `family`：双 11 会场和男女首页共用同一张根稿（`4040:24331`），但点「分类」
 * 之后要分别落到 `/goods/commercial/all` 和 `/goods/men/new`，所以那个上下文必须写进 URL。
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
      if (!family) return { store: 'nike', view: 'browse', category: '' };
      const category = seg3 ?? DEFAULT_CATEGORY[family];
      return { store, view: 'category', family, category };
    }
    if (store === 'kids') {
      if (!seg2) {
        return { store: 'kids', view: 'browse', category: '' };
      }
      const family = parseKidsFamily(seg2);
      // 族名不认识时留在本店的 browse，而不是甩回主店。
      if (!family) return { store: 'kids', view: 'browse', category: '' };
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
  // 只有族名没有类目 = 该族的 browse 根页（`/goods/commercial` 即双 11 上下文的宝贝首页）。
  if (!seg2) return { store: 'nike', view: 'browse', family, category: '' };
  return { store: 'nike', view: 'category', family, category: seg2 };
}

export function goodsPath(route: GoodsRoute): string {
  const { store, view, family, category } = route;
  if (view === 'browse') {
    if (store !== 'nike') return `/goods/${store}`;
    // 主店三个入口共用同一张根稿，但「分类」要各回各族，所以除默认的男子外都在 URL 里留痕。
    const f = parseGoodsFamily(family);
    return f && f !== 'men' ? `/goods/${f}` : '/goods';
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

/** 同一上下文的 browse 根页（点原生「宝贝」回程用）。 */
export function goodsBrowsePath(route: Pick<GoodsRoute, 'store' | 'family'>): string {
  return goodsPath({ ...route, view: 'browse', category: '' });
}

/** 从 browse 进入该上下文的默认分类态（点原生「分类」）。 */
export function goodsDefaultCategoryPath(
  store: StoreKey,
  family?: GoodsFamily | KidsFamily,
): string {
  if (store === 'nike') {
    const f = parseGoodsFamily(family) ?? 'men';
    return goodsPath({ store: 'nike', view: 'category', family: f, category: DEFAULT_CATEGORY[f] });
  }
  if (store === 'kids') {
    const f = parseKidsFamily(family) ?? 'big';
    return goodsPath({
      store: 'kids',
      view: 'category',
      family: f,
      category: DEFAULT_KIDS_CATEGORY[f],
    });
  }
  if (store === 'acg') {
    return goodsPath({ store: 'acg', view: 'category', category: DEFAULT_ACG_CATEGORY });
  }
  return goodsPath({ store: 'jordan', view: 'category', category: DEFAULT_JORDAN_CATEGORY });
}

/** 由宝贝页路径推回它的 browse 上下文（底部导航 / 返回共用）。 */
export function goodsContextFromPath(pathname: string): { store: StoreKey; family?: GoodsFamily } {
  const parts = pathname.replace(/^\/goods\/?/, '').split('/').filter(Boolean);
  const parsed = parseGoodsRoute(parts[0], parts[1], parts[2]);
  if (!parsed) return { store: 'nike' };
  const family = parseGoodsFamily(parsed.family);
  return { store: parsed.store, family: family ?? undefined };
}
