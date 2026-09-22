import { parseKidsFamily } from '../data/goods';
import { parseGoodsRoute } from './goodsRoute';

/**
 * 同一路由内（宝贝页横/竖 tab）切换时不应触发路由翻页动画。
 * AnimatePresence 用此 key 而非 `location.key`。
 */
export function routeMotionKey(pathname: string): string {
  if (!pathname.startsWith('/goods')) return pathname;

  const parts = pathname.replace(/^\/goods\/?/, '').split('/').filter(Boolean);
  const parsed = parseGoodsRoute(parts[0], parts[1], parts[2]);
  if (!parsed) return '/goods';

  if (parsed.view === 'browse') {
    return parsed.store === 'nike' ? '/goods' : `/goods/${parsed.store}`;
  }

  if (parsed.store === 'nike') return '/goods/nike';
  if (parsed.store === 'kids') {
    const family = parseKidsFamily(parsed.family) ?? 'big';
    return `/goods/kids/${family}`;
  }
  return `/goods/${parsed.store}`;
}

/** 宝贝页 tab 切换：replace 且不打断 motion key */
export function isGoodsTabPath(pathname: string): boolean {
  return pathname.startsWith('/goods');
}
