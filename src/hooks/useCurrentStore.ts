import { useLocation } from 'react-router-dom';
import { storeIdFromPath } from '../data/searchKeywords';
import type { StoreKey } from '../data/store';

/**
 * 由当前路由推导所在店铺。
 *
 * chrome 与店铺信息卡挂在多个页面下（`Home` / `StoreHome` 各自裸调用），把店铺做成 prop
 * 就得改每一个调用点。这些组件在整棵树里只可能出现在某一家店的页面上，路由本身已经带足
 * 信息，所以直接在组件内部推导，调用点一行都不用动。
 *
 * 解析规则复用 `storeIdFromPath`（搜索词库那边已经在用同一套），推不出来一律回退主店。
 */
export function useCurrentStore(): StoreKey {
  const { pathname } = useLocation();
  return storeIdFromPath(pathname);
}
