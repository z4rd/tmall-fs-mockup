import type { GoodsRoute } from '../lib/goodsRoute';
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
  'nike/commercial/all': '4012:15064',
  'nike/commercial/men': '4012:14960',
  'acg/highlight': '4018:19240',
  'acg/shoes': '4018:19360',
  'acg/scenes': '4018:19526',
  'jordan/featured': '4018:21533',
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
  commercial: 'nike/commercial/all',
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
    return GOODS_SHEET_EXPORTS[direct] ? direct : 'jordan/featured';
  }
  if (store === 'kids' && family) {
    const f = family as KidsFamily;
    const direct = `kids/${f}/${category}`;
    if (GOODS_SHEET_EXPORTS[direct]) return direct;
    return KIDS_FALLBACK[f];
  }
  return 'nike/men/new';
}

/** 裁切后的宝贝页长图（相对 public/，Tier C 已转 WebP @q95）。 */
export function goodsSheetSrc(route: GoodsRoute): string {
  const key = sheetKey(route).replace(/\//g, '--');
  return publicAsset(`images/goods/sheets/${key}.webp`);
}

/**
 * 宝贝页顶栏原生区（223px 高 @1x）—— **browse / category 两态共用同一张白头**。
 *
 * 宝贝页有一套专有的白色头部（白底 + 橙描边搜索胶囊 + 店铺卡 + 认证黑条 + 服务条），
 * 四张分类稿一致；而 nike / jordan / kids 的 browse 根稿沿用的是店铺首页那张**粉色渐变**头。
 * 产品侧已决定白头覆盖宝贝页与分类页，所以两态都取 `<store>-category-top`。
 * `*-top.png`（粉头）保留在仓库里，只是不再被引用。
 *
 * 切图源：主店 `4012:13619 IMG_6770`、ACG `4018:19240`、Jordan `4018:21622`、
 * Kids `4021:23599 IMG_6878`（本轮新导，脚本见
 * `agent-runs/2026-09-22-goods-vqa/build_kids_chrome.py`）。
 */
export function goodsChromeTopSrc(store: GoodsRoute['store']): string {
  return publicAsset(`images/goods/chrome/${store}-category-top.png`);
}

/** 宝贝 tab 瀑布流根页整屏位图，每店一张，节点与尺寸见 `goodsLandingDesigns`。 */
export function goodsLandingSrc(store: GoodsRoute['store']): string {
  return publicAsset(`images/goods/landing/${goodsLandingDesign(store).slug}.webp`);
}

/*
 * 一级 tab 行（「宝贝 / 分类」+ 选中下划线）此前是三张 375×42 位图
 * （`header-search` / `acg-category-tabs` / `jordan-category-tabs`），Kids 那条则画在
 * 223 顶栏切图里。现已整体换成活组件 `components/goods/GoodsIndexTabs`：字号、字重、
 * 对齐、底色都要能改，位图模拟不到位（本轮 VQA 第 2 条）。三张 PNG 仍留在仓库与资产
 * 校验表里作为对照母版，代码不再引用。
 */
