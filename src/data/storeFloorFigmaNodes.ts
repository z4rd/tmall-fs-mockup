import type { StoreVariant } from './storeFloors';

/** ACG 首页楼层子 frame（hero 由实拍视频替代，见 `StoreHome`）。 */
export const ACG_FLOOR_FIGMA: Record<string, string> = {
  'doorway-4': '2553:71386',
  'new-arrivals-1': '2553:71885',
  'sports-zone-a': '2553:71407',
  'sports-zone-b': '2553:71448',
  'story-kdoy': '2553:71511',
  'grid-1': '2553:71566',
  'banner-cdp': '2553:71645',
  'grid-2': '2553:71719',
  'new-arrivals-2': '2553:71785',
  'brand-matrix': '2553:71846',
  closing: '2553:71883',
};

/** Jordan 首页楼层（P1 含 hero 位图；无独立 hero 视频）。 */
export const JORDAN_FLOOR_FIGMA: Record<string, string> = {
  p1: '4022:8324',
  'launch-calendar': '2553:69248',
  'new-shoes': '2553:69249',
  membership: '2553:69278',
  aj1: '2553:69250',
  'aj-line': '2553:69251',
  ranking: '2472:16707',
  dongdan: '2553:69247',
  seasonal: '2553:69252',
  street: '2553:69254',
  'shelf-11': '2553:69256',
  'shelf-12': '2553:69257',
  'shelf-13': '2553:69258',
  'shelf-14': '2553:69255',
  'product-finder': '2553:69259',
  'brand-matrix': '2472:16274',
  closing: '2472:16681',
};

/** Kids（大童 7 岁+）首页楼层，取自 `4041:25654` 的 `Main` 帧直接子层；无 hero 视频。 */
export const KIDS_FLOOR_FIGMA: Record<string, string> = {
  'p1-story': '4041:25659',
  'new-product': '4041:25743',
  'seasonal-picks': '4041:25805',
  membership: '4041:25717',
  'sports-shelf': '4041:25859',
  ranking: '4041:25936',
  'lookbook-grid': '4041:26016',
  'classic-footwear': '4041:26043',
  apparel: '4041:26087',
  'family-pack': '4041:26138',
  'sports-navigation': '4041:26196',
  'product-navigation': '4041:26228',
  'store-navigation': '4041:26340',
};

export const STORE_FLOOR_FIGMA: Record<StoreVariant, Record<string, string>> = {
  acg: ACG_FLOOR_FIGMA,
  jordan: JORDAN_FLOOR_FIGMA,
  kids: KIDS_FLOOR_FIGMA,
};

export const GOODS_CHROME_FIGMA: Record<string, string> = {
  nike: '4040:24331',
  acg: '4040:24332',
  jordan: '4040:24480',
  kids: '4040:24482',
};
