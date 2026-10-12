import type { FloorAssetVariant } from './floorAssets';

/** 品牌矩阵横幅目标；「Nike 官方旗舰店」统一进男子首页。 */
export type BrandMatrixTarget = 'nike-men' | 'kids' | 'jordan' | 'acg';

export type BrandMatrixHit = {
  target: BrandMatrixTarget;
  /** 相对楼层顶边，375 设计稿 px */
  top: number;
  height: number;
};

const ROW_H = 88;
const ROW_STEP = 94;

/** 主店 / Kids 店 `Store Navigation`：`2685:59295` / `4069:2720`，内容区自 y44 起。 */
const MAIN_STORE_NAV_ROWS: BrandMatrixHit[] = [
  { target: 'kids', top: 44, height: ROW_H },
  { target: 'jordan', top: 44 + ROW_STEP, height: ROW_H },
  { target: 'acg', top: 44 + ROW_STEP * 2, height: ROW_H },
];

/** ACG `brand-matrix` `2553:71846`，标题 y24，列表自 y72。 */
const ACG_BRAND_MATRIX_ROWS: BrandMatrixHit[] = [
  { target: 'nike-men', top: 72, height: ROW_H },
  { target: 'jordan', top: 72 + ROW_STEP, height: ROW_H },
  { target: 'kids', top: 72 + ROW_STEP * 2, height: ROW_H },
];

/**
 * ACG 新版首页把底部「官方店铺」并进了 `grid-2 / Total Look` 的可见溢出长图。
 * 坐标相对 `4138:3808`：溢出组 `4136:3163` y=-666，Doorway y=4603，列表自 y72。
 */
const ACG_GRID2_STORE_ROWS: BrandMatrixHit[] = [
  { target: 'nike-men', top: 4009, height: ROW_H },
  { target: 'jordan', top: 4009 + ROW_STEP, height: ROW_H },
  { target: 'kids', top: 4009 + ROW_STEP * 2, height: ROW_H },
];

/** Jordan `brand-matrix` `2472:16274`，列表自 y36。 */
const JORDAN_BRAND_MATRIX_ROWS: BrandMatrixHit[] = [
  { target: 'nike-men', top: 36, height: ROW_H },
  { target: 'kids', top: 36 + ROW_STEP, height: ROW_H },
  { target: 'acg', top: 36 + ROW_STEP * 2, height: ROW_H },
];

/** Kids 与主店同构的三行，顺序为 Nike / Jordan / ACG。 */
const KIDS_STORE_NAV_ROWS: BrandMatrixHit[] = [
  { target: 'nike-men', top: 44, height: ROW_H },
  { target: 'jordan', top: 44 + ROW_STEP, height: ROW_H },
  { target: 'acg', top: 44 + ROW_STEP * 2, height: ROW_H },
];

export function brandMatrixPath(target: BrandMatrixTarget): string {
  switch (target) {
    case 'nike-men':
      return '/home/men';
    case 'kids':
      return '/store/kids';
    case 'jordan':
      return '/store/jordan';
    case 'acg':
      return '/store/acg';
  }
}

/**
 * 六个索引页底部的「品牌矩阵」/「官方店铺」楼层热区。
 * `floorKey` 在主店为 `store-navigation`，ACG/Jordan 为 `brand-matrix`，Kids 为 `store-navigation`。
 */
export function brandMatrixHitsFor(
  variant: FloorAssetVariant,
  floorKey: string,
): BrandMatrixHit[] | null {
  if (variant === 'acg' && floorKey === 'grid-2') return ACG_GRID2_STORE_ROWS;
  if (floorKey !== 'store-navigation' && floorKey !== 'brand-matrix') return null;

  if (floorKey === 'brand-matrix') {
    if (variant === 'acg') return ACG_BRAND_MATRIX_ROWS;
    if (variant === 'jordan') return JORDAN_BRAND_MATRIX_ROWS;
    return null;
  }

  if (variant === 'kids') return KIDS_STORE_NAV_ROWS;
  if (variant === 'men' || variant === 'women' || variant === 'commercial') {
    return MAIN_STORE_NAV_ROWS;
  }
  return null;
}
