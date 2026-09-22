import type { HomeVariant } from './floors';
import type { StoreVariant } from './storeFloors';
import { publicAsset } from '../lib/publicAsset';

export type FloorAssetVariant = HomeVariant | StoreVariant;

/** 换图但需避开浏览器对旧路径的长期缓存时，改文件名而非只 bump `?v=`。 */
const FLOOR_SLICE_FILE_OVERRIDES: Partial<
  Record<FloorAssetVariant, Partial<Record<string, string>>>
> = {
  men: { 'product-navigation': 'product-navigation-v2.webp' },
};

/**
 * Tier C 楼层切图：`public/images/floors/<variant>/<floorKey>.webp`（@q95）。
 */
export function floorSliceSrc(variant: FloorAssetVariant, floorKey: string): string {
  const file =
    FLOOR_SLICE_FILE_OVERRIDES[variant]?.[floorKey] ?? `${floorKey}.webp`;
  return publicAsset(`images/floors/${variant}/${file}`);
}
