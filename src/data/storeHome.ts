import type { StoreKey } from './store';

/**
 * 子店首页楼层间距（实测互不相同，不能复用主店 `FLOOR_GAP = 40`）。
 * 报告 §2.10；Stage 8c 切图堆叠时使用。
 */
export const STORE_HOME_FLOOR_GAP: Record<StoreKey, number> = {
  nike: 40,
  acg: 8,
  jordan: 24,
  kids: 40, // `4041:25654` 实测：13 个楼层之间 12 处间隙全为 40
};

/** 子店首页 Figma 根节点。 */
export const STORE_HOME_ROOT_NODE: Partial<Record<StoreKey, string>> = {
  nike: '2692:61085',
  acg: '2553:71355',
  jordan: '2472:16099',
  kids: '4041:25654',
};
