import { storeIdFromPath } from '../data/searchKeywords';
import type { StoreKey } from '../data/store';
import { parseStoreKey, storeHomePath } from '../data/store';
import { goodsBrowsePath, goodsContextFromPath, goodsPath } from '../lib/goodsRoute';
import { getLastShopPath } from './shopContext';

export type NavBackState = {
  backTo?: string;
};

export function readBackTo(state: unknown): string | undefined {
  if (state && typeof state === 'object' && 'backTo' in state) {
    const v = (state as NavBackState).backTo;
    return typeof v === 'string' ? v : undefined;
  }
  return undefined;
}

/** 产品墙左上角返回：优先路由 state，其次最近店铺页，再按 `from` / 店铺兜底。 */
export function resolveListBackPath(
  state: unknown,
  from: string | undefined,
  store: StoreKey,
): string {
  const explicit = readBackTo(state);
  if (explicit) return explicit;

  const last = getLastShopPath();
  if (last) return last;

  if (from?.startsWith('goods-')) {
    const lastGoods = getLastShopPath();
    if (lastGoods?.startsWith('/goods')) return lastGoods;
    const category = from.slice('goods-'.length);
    return goodsPath({ store, view: 'category', family: 'men', category });
  }

  return storeHomePath(store);
}

/**
 * 宝贝页顶部返回。
 *
 * 宝贝 / 分类是同一页里的两个 tab，所以分类态的 ← 先回本上下文的宝贝首页，再按一次才离开
 * 宝贝页。browse 态才回店铺首页，且必须带上当前店铺 —— 此前这里只看 `getLastShopPath()`、
 * 兜底写死 `/home/men`，深链或刷新后从 ACG / Jordan / Kids 的宝贝页返回会串到主店。
 */
export function resolveGoodsBackPath(pathname: string, state: unknown): string {
  const explicit = readBackTo(state);
  if (explicit) return explicit;

  const { store, family } = goodsContextFromPath(pathname);
  const browse = goodsBrowsePath({ store, family });
  if (pathname !== browse) return browse;

  const home = storeHomePath(store, family);
  const last = getLastShopPath();
  // 最近店铺页只有在同属当前店铺时才可信，否则宁可回该店的规范首页。
  return last && storeIdFromPath(last) === store ? last : home;
}

/** Bottom Nav 占位页等：回到最近店铺或索引。 */
export function resolvePlaceholderBackPath(): string {
  return getLastShopPath() ?? '/';
}

/** 店铺 chrome 左上角：统一回扫码索引。 */
export const ENTRY_PATH = '/';

export type PageBackContext = {
  pathname: string;
  state: unknown;
  search: URLSearchParams;
};

/** 当前路由是否支持返回（含右滑）。 */
export function canPageGoBack(pathname: string): boolean {
  return pathname !== '/';
}

/**
 * 全站统一返回目标：索引无返回；店铺首页回索引；二级页走 state / 最近店铺 / 兜底。
 */
export function resolvePageBackPath(ctx: PageBackContext): string | null {
  const { pathname, state, search } = ctx;
  if (pathname === '/') return null;

  if (pathname.startsWith('/home/') || pathname.startsWith('/store/')) {
    return ENTRY_PATH;
  }

  if (pathname.startsWith('/list')) {
    const segment = pathname.split('/')[2];
    const store = parseStoreKey(segment);
    return resolveListBackPath(state, search.get('from') ?? undefined, store);
  }

  if (pathname.startsWith('/goods')) {
    return resolveGoodsBackPath(pathname, state);
  }

  return resolvePlaceholderBackPath();
}

/** 带天猫 chrome 的店铺页：左上角返回由 header 承担，不再叠二级返回条。 */
export function showsShopChromeBack(pathname: string): boolean {
  return pathname.startsWith('/home/') || pathname.startsWith('/store/');
}

/** 无 chrome 的二级页：支持返回逻辑与右滑（含产品墙）。 */
export function showsSecondaryPageBack(pathname: string): boolean {
  if (!canPageGoBack(pathname)) return false;
  if (showsShopChromeBack(pathname)) return false;
  return true;
}

/**
 * 舞台层 ←：占位页等。产品墙 `/list` 热区在 `ProductWall` 内与位图同层滚动，避免与
 * 舞台层叠出重影；宝贝 / 店铺首页由 `GoodsChrome` / `TmallChrome` 承担。
 */
export function showsPageBackChrome(pathname: string): boolean {
  if (!showsSecondaryPageBack(pathname)) return false;
  if (pathname.startsWith('/goods')) return false;
  if (pathname.startsWith('/list')) return false;
  return true;
}
