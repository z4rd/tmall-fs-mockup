import { defaultCategoryFor } from '../data/goods';
import { floorSliceSrc } from '../data/floorAssets';
import { FLOORS, type HomeVariant } from '../data/floors';
import { floorRenderKind } from '../data/floorRender';
import type { GoodsFamily } from '../data/goods';
import { goodsLandingSrc, goodsSheetSrc } from '../data/goodsAssets';
import { preloadImage } from './preloadAssets';

function familyFromVariant(variant: HomeVariant): GoodsFamily {
  if (variant === 'women') return 'women';
  if (variant === 'commercial') return 'commercial';
  return 'men';
}

/** 主店首页前 N 个 Tier C 楼层（跳过运动专区 / Lookbook 活组件）。 */
function firstTierCFloorKeys(variant: HomeVariant, limit: number): string[] {
  const keys: string[] = [];
  for (const floor of FLOORS[variant]) {
    if (floorRenderKind(variant, floor) !== 'tier-c' && floorRenderKind(variant, floor) !== 'tier-c-static') {
      continue;
    }
    keys.push(floor.key);
    if (keys.length >= limit) break;
  }
  return keys;
}

export function preloadHomeP0(variant: HomeVariant): void {
  for (const key of firstTierCFloorKeys(variant, 3)) {
    preloadImage(floorSliceSrc(variant, key));
  }
}

export function preloadHomeP1(variant: HomeVariant): void {
  const family = familyFromVariant(variant);
  preloadImage(goodsLandingSrc('nike'));
  const category = defaultCategoryFor('nike', family);
  preloadImage(goodsSheetSrc({ store: 'nike', family, category }));
}
