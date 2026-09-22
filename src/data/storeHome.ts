import type { StoreKey } from './store';

/**
 * 子店首页楼层间距（实测互不相同，不能复用主店 `FLOOR_GAP = 40`）。
 * 报告 §2.10；Stage 8c 切图堆叠时使用。
 */
export const STORE_HOME_FLOOR_GAP: Record<StoreKey, number> = {
  nike: 40,
  acg: 8,
  jordan: 24,
  kids: 40, // `4069:2030` 实测：13 个楼层之间 12 处间隙全为 40
};

/**
 * 子店首页 Figma 根节点 —— 一律记**手机帧**（375 宽的整页画板），不是它外层的看板。
 * Kids 的 `4069:2030`（「GS - 7+」375 × 7065）挂在 `4041:24483`（Overview 看板
 * 3083 × 10845）下，这里取手机帧，与其余三条保持同一量级。
 */
export const STORE_HOME_ROOT_NODE: Partial<Record<StoreKey, string>> = {
  nike: '2692:61085',
  acg: '2553:71355',
  jordan: '2472:16099',
  kids: '4069:2030',
};
