import type { GoodsRoute, GoodsView } from '../lib/goodsRoute';
import { publicAsset } from '../lib/publicAsset';
import type { GoodsFamily, KidsFamily } from './goods';
import { goodsLandingDesign } from './goodsLandingDesigns';

/** Figma 已导图的状态（@2x 全页，构建脚本裁掉顶 223px 原生区）。 */
export const GOODS_SHEET_EXPORTS: Record<string, string> = {
  'nike/men/new': '4012:13618',
  'nike/men/shoes': '4012:13808',
  'nike/men/running': '4012:14018',
  'nike/women/new': '4012:14535',
  'nike/women/shoes': '4012:14730',
  'nike/women/lifestyle': '4012:14312',
  'nike/commercial/flash30': '4012:15064',
  'nike/commercial/half50': '4012:14960',
  'nike/commercial/off70': '4012:14960',
  'acg/highlight': '4018:19240',
  'acg/shoes': '4018:19360',
  'acg/scenes': '4018:19526',
  'jordan/men': '4018:21622',
  'jordan/classic': '4018:21727',
  'jordan/basketball': '4018:21837',
  'kids/big/weekly': '4021:23596',
  'kids/big/boys-shoes': '4021:23291',
  'kids/big/boys-apparel': '4021:23427',
  'kids/big/running': '4021:23713',
  'kids/big/other': '4021:23184',
  'kids/little/weekly': '4021:23861',
  'kids/baby/weekly': '4021:23964',
};

const NIKE_FALLBACK: Record<GoodsFamily, string> = {
  men: 'nike/men/new',
  women: 'nike/women/new',
  commercial: 'nike/commercial/flash30',
};

const KIDS_FALLBACK: Record<KidsFamily, string> = {
  big: 'kids/big/weekly',
  little: 'kids/little/weekly',
  baby: 'kids/baby/weekly',
};

function sheetKey(route: GoodsRoute): string {
  const { store, family, category } = route;
  if (store === 'nike' && family && typeof family === 'string') {
    const f = family as GoodsFamily;
    const direct = `nike/${f}/${category}`;
    if (GOODS_SHEET_EXPORTS[direct]) return direct;
    return NIKE_FALLBACK[f] ?? 'nike/men/new';
  }
  if (store === 'acg') {
    const direct = `acg/${category}`;
    return GOODS_SHEET_EXPORTS[direct] ? direct : 'acg/highlight';
  }
  if (store === 'jordan') {
    const direct = `jordan/${category}`;
    return GOODS_SHEET_EXPORTS[direct] ? direct : 'jordan/men';
  }
  if (store === 'kids' && family) {
    const f = family as KidsFamily;
    const direct = `kids/${f}/${category}`;
    if (GOODS_SHEET_EXPORTS[direct]) return direct;
    return KIDS_FALLBACK[f];
  }
  return 'nike/men/new';
}

/** 裁切后的宝贝页长图（相对 public/）。 */
export function goodsSheetSrc(route: GoodsRoute): string {
  const key = sheetKey(route).replace(/\//g, '--');
  return publicAsset(`images/goods/sheets/${key}.png`);
}

/**
 * 分类态自带的 223px 顶栏切图。
 *
 * 分类稿用的原生截图和 browse 根页那张**不是同一张**：搜索词是「推荐一脚蹬运动鞋」，
 * 认证黑条下面接的是服务条（2 天内送达 / 客服平均 22 秒回复 / 平均 4 小时退款）；
 * browse 那张是「儿童拖鞋」+ 榜单数据条。切图源见 `4012:13619 IMG_6770 1`。
 * 目前只核对并导了主店，其余三店分类态暂沿用 browse 的顶栏。
 */
const GOODS_CATEGORY_CHROME: Partial<Record<GoodsRoute['store'], string>> = {
  nike: 'nike-category-top',
};

/** 宝贝页顶栏原生区（223px 高 @1x），browse / category 两态各有各的截图。 */
export function goodsChromeTopSrc(store: GoodsRoute['store'], view: GoodsView): string {
  const slug = view === 'category' ? GOODS_CATEGORY_CHROME[store] : undefined;
  return publicAsset(`images/goods/chrome/${slug ?? `${store}-top`}.png`);
}

/** 宝贝 tab 瀑布流根页整屏位图，每店一张，节点与尺寸见 `goodsLandingDesigns`。 */
export function goodsLandingSrc(store: GoodsRoute['store']): string {
  return publicAsset(`images/goods/landing/${goodsLandingDesign(store).slug}.png`);
}

/** `Header 2` 内 375×42 搜索栏位图（主店 wrapped tab 用）。 */
export function goodsHeaderSearchSrc(): string {
  return publicAsset('images/goods/chrome/header-search.png');
}
