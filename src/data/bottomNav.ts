import { goodsPath } from '../lib/goodsRoute';
import { storeIdFromPath } from './searchKeywords';
import { storeHomePath } from './store';

export type BottomNavItem = {
  key: string;
  label: string;
  path: string;
  /** 中间的「运动空间」是橙色胶囊，不是普通文字项。 */
  raised?: boolean;
  /** 「首页」右上角的「新风潮」角标。 */
  badge?: string;
};

/** 扫码落地页与产品墙不带底部导航（报告 §2.9）。 */
export function showsBottomNav(pathname: string) {
  if (pathname === '/') return false;
  if (pathname.startsWith('/list')) return false;
  return true;
}

/**
 * 几何全部量自 Figma `4001:19200` 指向的那张原始截图。
 *
 * 该位图是一张 iPhone 16 Pro 整屏截图（1206×2622），在设计稿里被缩放到 375 宽，
 * 换算比 1206/375 = 3.216。下列数值都是在 3.216x 原图上测量后除以该比例得到的，
 * 精度约 ±0.3 设计 px。
 *
 * 位图里有四条极淡的竖分隔线，实测中心 x = 84.0 / 152.7 / 221.4 / 290.1，
 * 步进 68.7 完全均匀 —— 即五项在 x15.3..358.8 区间内五等分，而不是按 375 整宽
 * 等分（375/5=75 与实测不符）。
 */

/** 五等分网格：起点与格宽，供分隔线与各项定位共用。 */
export const NAV_GRID = { x0: 15.3, cell: 68.7, count: 5 } as const;

/** 第 i 项的中心 x。 */
export function navCenter(i: number) {
  return NAV_GRID.x0 + NAV_GRID.cell * (i + 0.5);
}

/** 四条分隔线的中心 x。 */
export const NAV_DIVIDERS = [1, 2, 3, 4].map((i) => NAV_GRID.x0 + NAV_GRID.cell * i);

export const BOTTOM_NAV: BottomNavItem[] = [
  { key: 'home', label: '首页', path: '/home/men', badge: '新风潮' },
  { key: 'goods', label: '宝贝', path: '/goods' },
  { key: 'sports', label: '运动空间', path: '/sports', raised: true },
  { key: 'new', label: '新品', path: '/new' },
  { key: 'member', label: '会员', path: '/member' },
];

/**
 * 导航目标按当前所处店铺解析。
 *
 * `BOTTOM_NAV.path` 里写的是主店基线，同时兼作 active 态的前缀匹配键；真正跳哪里要看
 * 用户是从索引页的哪个入口进来的 —— 四家店各有一张宝贝页根稿（见 `goodsLandingDesigns`），
 * 固定跳 `/goods` 会把 ACG / Jordan / Kids 全部甩回主店。
 */
export function bottomNavTarget(item: BottomNavItem, pathname: string): string {
  const store = storeIdFromPath(pathname);
  if (item.key === 'goods') {
    return goodsPath({ store, view: 'browse', category: '' });
  }
  if (item.key === 'home') {
    return storeHomePath(store);
  }
  return item.path;
}
