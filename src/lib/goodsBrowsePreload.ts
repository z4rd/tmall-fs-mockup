import { defaultCategoryFor } from '../data/goods';
import type { GoodsFamily, KidsFamily } from '../data/goods';
import { goodsLandingSrc, goodsSheetSrc } from '../data/goodsAssets';
import type { StoreKey } from '../data/store';
import { preloadImage } from './preloadAssets';

export function preloadGoodsBrowseP0(store: StoreKey): void {
  preloadImage(goodsLandingSrc(store));
}

export function preloadGoodsBrowseP1(
  store: StoreKey,
  family?: GoodsFamily | KidsFamily,
): void {
  const category = defaultCategoryFor(store, family);
  preloadImage(goodsSheetSrc({ store, family, category }));
}
