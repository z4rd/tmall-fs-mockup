const LAST_SHOP_PATH_KEY = 'tmall-mockup:last-shop-path';

/** 最近一次进入的店铺首页（`/home/*` 或 `/store/*`），供二级页返回。 */
export function getLastShopPath(): string | null {
  try {
    return sessionStorage.getItem(LAST_SHOP_PATH_KEY);
  } catch {
    return null;
  }
}

export function setLastShopPath(pathname: string) {
  if (pathname === '/') return;
  if (!pathname.startsWith('/home/') && !pathname.startsWith('/store/')) return;
  try {
    sessionStorage.setItem(LAST_SHOP_PATH_KEY, pathname);
  } catch {
    /* 隐私模式等场景忽略 */
  }
}
