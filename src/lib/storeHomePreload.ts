import { defaultCategoryFor } from '../data/goods';
import { floorSliceSrc } from '../data/floorAssets';
import { goodsLandingSrc, goodsSheetSrc } from '../data/goodsAssets';
import {
  DEFAULT_KIDS_HOME_AGE,
  KIDS_HOME_CHUNK_HEIGHTS,
  kidsHomeChunkSrc,
} from '../data/kidsHomeAge';
import type { StoreKey } from '../data/store';
import { STORE_FLOORS, type StoreVariant } from '../data/storeFloors';
import { preloadImage } from './preloadAssets';

/** StoreHome 里由 `FloorSlice` 请求的楼层（ACG hero 由视频组件自己加载）。 */
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
  if (variant === 'kids') {
    preloadImage(kidsHomeChunkSrc(DEFAULT_KIDS_HOME_AGE, 0));
    return;
  }
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
  if (variant === 'kids') {
    for (const age of ['big', 'little', 'baby'] as const) {
      for (let index = 0; index < KIDS_HOME_CHUNK_HEIGHTS[age].length; index += 1) {
        if (age === DEFAULT_KIDS_HOME_AGE && index === 0) continue;
        preloadImage(kidsHomeChunkSrc(age, index));
      }
    }
  }

  const store = STORE_VARIANT_TO_KEY[variant];
  const landing = goodsLandingSrc(store);
  preloadImage(landing);

  const family = store === 'kids' ? ('big' as const) : undefined;
  const category = defaultCategoryFor(store, family);
  preloadImage(goodsSheetSrc({ store, family, category }));
}
