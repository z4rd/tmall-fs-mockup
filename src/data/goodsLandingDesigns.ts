import type { StoreKey } from './store';

/**
 * 「类别 → 宝贝页设计」显式映射。
 *
 * 索引页（扫码落地页 `ENTRYPOINTS`）的六个入口落到四家店：男子 / 女子 / 双 11 同属主店，
 * Jordan / Kids / ACG 各自独立。设计侧给了**四张各不相同**的宝贝页根稿，下表是唯一的对照源，
 * `GoodsPage` 的 browse 态与原生 tab 热区都从这里取值，不再共用任何单一常量。
 *
 * 坐标单位一律是 @1x 375 宽设计 px；切图为 @2x，落地时由 `u()` 换算。
 */

/** 宝贝 browse 根页位图上的原生 tab 热区（@1x 375 宽）。 */
export type GoodsNativeTabHit = {
  left: number;
  top: number;
  width: number;
  height: number;
};

export type GoodsLandingDesign = {
  store: StoreKey;
  /** 设计稿根节点（fileKey `Av3olXfkvEqBJOS9xK7YIi`）。 */
  figmaNode: string;
  /** `public/images/goods/landing/<slug>.png`。 */
  slug: string;
  /** 整页 @1x 高度；四店各不相同，切图实测值。 */
  height: number;
  /** 原生一级 tab 行的条目数（主店 3 条含「穿搭」，其余 3 店只有 2 条）。 */
  nativeTabCount: 2 | 3;
  /**
   * tab 行文案是否落在 223px 原生顶栏切图之内。
   *
   * 只有 Kids 是 true —— 它少了「天猫官方认证」黑条，整行上移到 y204..217。另外三店的
   * tab 行在 y232 以下，category 态下那块区域已经被 `Header 2` 或左导航接管，不能再叠热区。
   */
  tabRowInChromeCrop: boolean;
  /** 「宝贝 / 分类」两个热区，逐店按切图像素复核过。 */
  tabs: Record<'goods' | 'category', GoodsNativeTabHit>;
};

/** 原生顶栏切图高度（`goods/chrome/<store>-top.png` 均为 1125×669 @3x），四店一致。 */
export const GOODS_CHROME_TOP_PX = 223;

export const GOODS_LANDING_DESIGNS: Record<StoreKey, GoodsLandingDesign> = {
  // 主店：唯一一张三 tab（宝贝 / 分类 / 穿搭）的稿，tab 列宽 ≈114.3。
  nike: {
    store: 'nike',
    figmaNode: '4040:24331',
    slug: 'nike',
    height: 815,
    nativeTabCount: 3,
    tabRowInChromeCrop: false,
    tabs: {
      goods: { left: 15.5, top: 226, width: 114, height: 36 },
      category: { left: 129.5, top: 226, width: 114, height: 36 },
    },
  },
  // ACG：6 层位图叠加后整页导一张，画板 812 高，比另外三店矮；tab 行覆盖条落在 y216 起 54 高。
  acg: {
    store: 'acg',
    figmaNode: '4040:24332',
    slug: 'acg',
    height: 812,
    nativeTabCount: 2,
    tabRowInChromeCrop: false,
    tabs: {
      goods: { left: 15.5, top: 219.5, width: 171, height: 36 },
      category: { left: 187, top: 219.5, width: 171, height: 36 },
    },
  },
  jordan: {
    store: 'jordan',
    figmaNode: '4040:24480',
    slug: 'jordan',
    height: 815,
    nativeTabCount: 2,
    tabRowInChromeCrop: false,
    tabs: {
      goods: { left: 15.5, top: 226, width: 171, height: 36 },
      category: { left: 187, top: 226, width: 171, height: 36 },
    },
  },
  // Kids：唯一没有「天猫官方认证」黑条的一张，整行 tab 因此上移约 35px。
  kids: {
    store: 'kids',
    figmaNode: '4040:24482',
    slug: 'kids',
    height: 815.5,
    nativeTabCount: 2,
    tabRowInChromeCrop: true,
    tabs: {
      goods: { left: 15.5, top: 191, width: 171, height: 36 },
      category: { left: 187, top: 191, width: 171, height: 36 },
    },
  },
};

export function goodsLandingDesign(store: StoreKey): GoodsLandingDesign {
  return GOODS_LANDING_DESIGNS[store];
}
