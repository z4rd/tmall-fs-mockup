import type { HomeVariant } from './floors';

/** FS - Men `2692:61085` → `Main` 子 frame 的 nodeId（363 宽楼层块）。 */
export const MEN_FLOOR_FIGMA: Record<string, string> = {
  'p1-story': '2685:58619',
  'sports-zone': '2685:58691',
  membership: '2685:58665',
  'launch-calendar': '2685:58795',
  'new-product': '2685:58851',
  ranking: '2685:58908',
  'lookbook-grid': '2685:58986',
  'classic-footwear': '2685:59011',
  apparel: '2685:59054',
  'halo-shelf': '2685:59105',
  'sports-navigation': '2685:59161',
  'product-navigation': '2685:59213',
  'store-navigation': '2685:59295',
};

/** FS - Women `2692:61087` → `Main` 子 frame。 */
export const WOMEN_FLOOR_FIGMA: Record<string, string> = {
  'p1-story': '2685:59899',
  'sports-zone': '2685:59971',
  membership: '2685:59945',
  'launch-calendar': '2685:60071',
  'new-product': '2685:60127',
  'lookbook-grid': '2685:60184',
  'shop-by-color': '2701:51617',
  ranking: '2685:60234',
  'classic-footwear': '2685:60312',
  apparel: '2685:60357',
  'family-pack': '2685:60408',
  'halo-shelf': '2685:60464',
  'sports-navigation': '2685:60520',
  'product-navigation': '2685:60571',
  'store-navigation': '2685:60654',
};

/** FS - Commercial `4141:7877` → 13 个楼层子 frame。 */
export const COMMERCIAL_FLOOR_FIGMA: Record<string, string> = {
  'p1-story': '4141:7885',
  membership: '4141:8094',
  'flash-deals': '4141:8199',
  ranking: '4141:8349',
  apparel: '4141:8469',
  'discount-zones': '4141:8534',
  'classic-footwear': '4141:8763',
  'apparel-2': '4141:8826',
  'family-pack': '4141:8889',
  'seasonal-picks': '4141:8945',
  'sports-zone': '4141:9100',
  'product-navigation': '4141:9207',
  'store-navigation': '4141:9289',
};

export const FLOOR_FIGMA_ROOT: Record<HomeVariant, string> = {
  men: '2692:61085',
  women: '2692:61087',
  commercial: '4141:7877',
};

export function floorFigmaNode(variant: HomeVariant, floorKey: string): string | undefined {
  if (variant === 'men') return MEN_FLOOR_FIGMA[floorKey];
  if (variant === 'women') return WOMEN_FLOOR_FIGMA[floorKey];
  if (variant === 'commercial') return COMMERCIAL_FLOOR_FIGMA[floorKey];
  return undefined;
}

/** Commercial 首页 13 层全部为 Tier C（整页切图，无热区）。 */
export const TIER_C_COMMERCIAL_KEYS = Object.keys(COMMERCIAL_FLOOR_FIGMA);

/** Tier C 需导出的楼层（不含 Tier A 活组件）。 */
export const TIER_C_FLOOR_KEYS: Record<'men' | 'women', string[]> = {
  men: [
    'p1-story',
    'membership',
    'launch-calendar',
    'new-product',
    'ranking',
    'classic-footwear',
    'apparel',
    'halo-shelf',
    'sports-navigation',
    'product-navigation',
    'store-navigation',
  ],
  women: [
    'p1-story',
    'membership',
    'launch-calendar',
    'new-product',
    'shop-by-color',
    'ranking',
    'classic-footwear',
    'apparel',
    'family-pack',
    'halo-shelf',
    'sports-navigation',
    'product-navigation',
    'store-navigation',
  ],
};
