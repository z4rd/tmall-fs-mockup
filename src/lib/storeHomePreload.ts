import { defaultCategoryFor } from '../data/goods';
import { floorSliceSrc } from '../data/floorAssets';
import { goodsLandingSrc, goodsSheetSrc } from '../data/goodsAssets';
import type { StoreKey } from '../data/store';
import { STORE_FLOORS, type StoreVariant } from '../data/storeFloors';
import { preloadImage } from './preloadAssets';

/** StoreHome 里由 `FloorSlice` 请求的楼层（ACG hero 为实拍视频）。 */
function firstFloorSliceKeys(variant: StoreVariant, limit: number): string[] {
  const keys: string[] = [];
  for (const floor of STORE_FLOORS[variant]) {
    if (variant === 'acg' && floor.key === 'hero') continue;
    keys.push(floor.key);
    if (keys.length >= limit) break;
  }
  return keys;
}

export function preloadStoreHomeP0(variant: StoreVariant): void {
  for (const key of firstFloorSliceKeys(variant, 3)) {
    preloadImage(floorSliceSrc(variant, key));
  }
}

const STORE_VARIANT_TO_KEY: Record<StoreVariant, StoreKey> = {
  acg: 'acg',
  jordan: 'jordan',
  kids: 'kids',
};

export function preloadStoreHomeP1(variant: StoreVariant): void {
  const store = STORE_VARIANT_TO_KEY[variant];
  const landing = goodsLandingSrc(store);
  preloadImage(landing);

  const family = store === 'kids' ? ('big' as const) : undefined;
  const category = defaultCategoryFor(store, family);
  preloadImage(goodsSheetSrc({ store, family, category }));
}
