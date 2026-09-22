/**
 * 视频资源（相对 `public/`）。
 *
 * `lookbookMen` / `lookbookWomen` 是主店穿搭楼层的视频；`acgHero` 是 ACG 首页
 * hero。Jordan 与 Kids 首页全静态，不设 hero 视频。
 */
export const HOME_VIDEOS = {
  lookbookMen: '/videos/menactived.mp4',
  lookbookWomen: '/videos/womenactived.mp4',
  acgHero: '/videos/acg-hero.mp4',
} as const;
