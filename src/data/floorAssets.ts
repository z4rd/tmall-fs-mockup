import type { HomeVariant } from './floors';
import type { StoreVariant } from './storeFloors';
import { publicAsset } from '../lib/publicAsset';

export type FloorAssetVariant = HomeVariant | StoreVariant;

/**
 * Tier C 楼层切图：`public/images/floors/<variant>/<floorKey>.png`。
 */
export function floorSliceSrc(variant: FloorAssetVariant, floorKey: string): string {
  return publicAsset(`images/floors/${variant}/${floorKey}.png`);
}
