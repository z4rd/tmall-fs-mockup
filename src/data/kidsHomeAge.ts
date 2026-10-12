import { publicAsset } from '../lib/publicAsset';

export type KidsHomeAge = 'big' | 'little' | 'baby';

export type KidsHomeAgeItem = {
  key: KidsHomeAge;
  label: string;
  sublabel: string;
};

export const KIDS_HOME_AGE_ITEMS: readonly KidsHomeAgeItem[] = [
  { key: 'big', label: '大童 7 岁+', sublabel: '脚长 22.5 - 25cm' },
  { key: 'little', label: '幼童', sublabel: '3 - 6 岁' },
  { key: 'baby', label: '婴童', sublabel: '0 - 3 岁' },
] as const;

export const DEFAULT_KIDS_HOME_AGE: KidsHomeAge = 'big';

export const KIDS_HOME_CHUNK_HEIGHTS: Record<KidsHomeAge, readonly number[]> = {
  big: [4000, 2990],
  little: [4000, 3484],
  baby: [4000, 3533],
};

export function kidsHomeChunkSrc(age: KidsHomeAge, index: number): string {
  return publicAsset(`images/store-home/kids-age/${age}-${index + 1}.webp`);
}
