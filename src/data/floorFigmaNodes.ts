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

/** FS - Commercial `2728:67015` → 13 个楼层子 frame（§2.6）。 */
export const COMMERCIAL_FLOOR_FIGMA: Record<string, string> = {
  'p1-story': '2728:67022',
  membership: '2728:67092',
  'flash-deals': '2728:67133',
  ranking: '2728:67200',
  apparel: '2728:67281',
  'discount-zones': '2728:67341',
  'classic-footwear': '2728:67568',
  'apparel-2': '2728:67628',
  'seasonal-picks': '2728:67688',
  'family-pack': '2728:67818',
  'sports-zone': '2728:67874',
  'product-navigation': '2728:67981',
  'store-navigation': '2728:68063',
};

export const FLOOR_FIGMA_ROOT: Record<HomeVariant, string> = {
  men: '2692:61085',
  women: '2692:61087',
  commercial: '2728:67015',
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
