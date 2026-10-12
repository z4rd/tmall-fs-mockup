import type { Gender } from './floors';

export type LookbookSkuVideo = {
  sku: string;
  cell: number;
  video: string;
};

export const LOOKBOOK_SKU_VIDEOS: Record<Gender, readonly LookbookSkuVideo[]> = {
  men: [
    { sku: 'IU5680-053', cell: 0, video: '/videos/lookbook-sku/IU5680-053.mp4' },
    { sku: 'FN3894-064', cell: 6, video: '/videos/lookbook-sku/FN3894-064.mp4' },
    { sku: 'IW1203-410', cell: 4, video: '/videos/lookbook-sku/IW1203-410.mp4' },
  ],
  women: [
    { sku: 'IR1925-236', cell: 0, video: '/videos/lookbook-sku/IR1925-236.mp4' },
    { sku: 'II3434-452', cell: 4, video: '/videos/lookbook-sku/II3434-452.mp4' },
    { sku: 'FV5509-236', cell: 6, video: '/videos/lookbook-sku/FV5509-236.mp4' },
  ],
} as const;
