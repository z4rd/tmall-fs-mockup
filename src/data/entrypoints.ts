export type EntrypointStatus = 'live' | 'preview' | 'soon';

export type Entrypoint = {
  key: string;
  store: string;
  tagline: string;
  path: string;
  /** Tier C 卡面（Figma `4001:19172` 子帧）；导出倍率见 `tools/README-assets.md`。 */
  cardSrc: string;
  /** @deprecated 用 `status` 展示；路由仍以 `path` 为准。 */
  designed: boolean;
  status: EntrypointStatus;
  statusLabel: string;
};

/** 顺序读自 Shop Home Entrypoints 画板（即扫码落地页）。 */
export const ENTRYPOINTS: Entrypoint[] = [
  {
    key: 'men',
    store: 'NIKE 官方旗舰店',
    tagline: 'Aero-FIT 跑出穿堂风（男子）',
    path: '/home/men',
    cardSrc: './images/entry/men.webp',
    designed: true,
    status: 'live',
    statusLabel: '男子首页',
  },
  {
    key: 'women',
    store: 'NIKE 官方旗舰店',
    tagline: 'Aero-FIT 跑出穿堂风（女子）',
    path: '/home/women',
    cardSrc: './images/entry/women.webp',
    designed: true,
    status: 'live',
    statusLabel: '女子首页',
  },
  {
    key: 'double11',
    store: 'NIKE 官方旗舰店',
    tagline: '双 11 震撼来袭 全场低至 5 折',
    path: '/home/commercial',
    cardSrc: './images/entry/commercial.webp',
    designed: true,
    status: 'live',
    statusLabel: '双 11 会场',
  },
  {
    key: 'jordan',
    store: 'JORDAN 官方旗舰店',
    tagline: '独有一套',
    path: '/store/jordan',
    cardSrc: './images/entry/jordan.webp',
    designed: true,
    status: 'live',
    statusLabel: 'Jordan 首页',
  },
  {
    key: 'kids',
    store: 'NIKE 儿童官方旗舰店',
    tagline: '好搭小怪兽系列',
    path: '/store/kids',
    cardSrc: './images/entry/kids.webp',
    designed: true,
    status: 'live',
    statusLabel: '儿童首页',
  },
  {
    key: 'acg',
    store: 'ACG 官方旗舰店',
    tagline: '穿上去就野',
    path: '/store/acg',
    cardSrc: './images/entry/acg.webp',
    designed: true,
    status: 'live',
    statusLabel: 'ACG 首页',
  },
];
