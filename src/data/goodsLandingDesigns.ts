import type { StoreKey } from './store';

/**
 * 「类别 → 宝贝页设计」显式映射。
 *
 * 索引页（扫码落地页 `ENTRYPOINTS`）的六个入口落到四家店：男子 / 女子 / 双 11 同属主店，
 * Jordan / Kids / ACG 各自独立。设计侧给了**四张各不相同**的宝贝页根稿，下表是唯一的对照源，
 * `GoodsPage` 的 browse 态与一级 tab 行都从这里取值，不再共用任何单一常量。
 *
 * 坐标单位一律是 @1x 375 宽设计 px；切图统一 @3x，落地时由 `u()` 换算。
 */

export type GoodsIndexTabKey = 'goods' | 'category' | 'lookbook';

export type GoodsIndexTabItem = { key: GoodsIndexTabKey; label: string };

export type GoodsLandingDesign = {
  store: StoreKey;
  /** 设计稿根节点（fileKey `Av3olXfkvEqBJOS9xK7YIi`）。 */
  figmaNode: string;
  /** `public/images/goods/landing/<slug>.png`。 */
  slug: string;
  /**
   * 整页 @1x 高度；四店各不相同，切图实测值。
   *
   * 2026-09-22 设计改版并重导 @3x：四张根稿都在原来 815 高的底图下面又压了一层更长的
   * 商品瀑布流。主店的页尾 70px 烤死导航由切图脚本裁掉；Jordan / ACG / Kids 改成设计侧
   * 在 Figma 里手删那条 button nav、整帧入库（`--no-tail-crop`），整页高 977~1012 @1x。
   * 这个值要与 `public/images/goods/landing/<slug>.png` 的真实宽高比严格一致——
   * 位图本身是 `height: auto`，对不上整页纵向对位就会整体拉伸。
   *
   * 新增内容全在 y300 以下，223px 顶栏与一级 tab 行的几何没动，所以 `indexTabRowTop`
   * 与 `browseTabRowBottom` 在新稿下实测不变（下划线 y：主店 / Jordan 263.67、
   * ACG 257.0、Kids 228.33，与改版前差 < 0.5px）。
   */
  height: number;
  /**
   * 一级 tab 行顶边的**页面绝对 y**，browse / category 两态共用。
   *
   * 逐店不同且都不是随手取的：反解式是「文案墨框顶 − 15.67」与「下划线顶 − 40.67」，
   * 两条独立反解在四店上都落到同一个值（残差 < 0.4px）——
   *   - 主店 `4012:13618`：文案 y239、下划线 y263.67 → 223（正好接在 223 顶栏之下）
   *   - ACG `4018:19240` / Jordan `4018:21622`：文案 y233、下划线 y257.67 → 217（往上压 6）
   *   - Kids `4021:23596`：文案 y197、下划线 y222 → 181（少一条「天猫官方认证」黑条，整行上移 42）
   *
   * 这一行在四店设计稿里都是手机截图栅格，容器自己铺白底把位图那条盖掉，
   * 详见 `components/goods/GoodsIndexTabs.tsx`。
   */
  indexTabRowTop: number;
  /** 一级 tab 条目：主店三项（第三项「穿搭」设计侧无对应页面，保持死区），其余两项。 */
  indexTabs: readonly GoodsIndexTabItem[];
  /**
   * browse 根稿位图里**自带**的那条位图 tab 行的下边缘（页面绝对 y）。
   *
   * 活组件要盖到这个 y 才不会漏出位图的下划线。四店的 browse 根稿和各自分类稿不一定
   * 同高：Jordan 的 browse 行画在 223..265（比分类稿低 6），Kids 的画在 189..231。
   * 实测见 `agent-runs/2026-09-22-goods-vqa/measure_landing.py`。
   */
  browseTabRowBottom: number;
  /**
   * 整屏位图页尾要裁掉的死区（@1x），缺省 0。
   *
   * 与分类态的 `*_SHEET_BOTTOM_CLIP_PX` 是同一套机制（clip-path inset + 负 margin），
   * 只是作用在 browse 的 landing 上：设计侧删掉烤死的 button nav 时，Kids 那张只删了
   * 图标文字、留下整条 #2c2c2c 的底板，画板高度也没收，重导回来就是紧贴活底栏的一条黑带。
   */
  bottomClipPx?: number;
};

/** 原生顶栏切图高度（`goods/chrome/<store>-top.png` 均为 1125×669 @3x），四店一致。 */
export const GOODS_CHROME_TOP_PX = 223;

/**
 * 历史：landing / sheet 页尾曾烤 70px Bottom Nav，现由 `crop_baked_nav.sh` 从 PNG 裁掉。
 * 保留常量 0，避免旧注释里的「shell 定高要减 70」逻辑再被误加回来。
 */
export const GOODS_LANDING_BAKED_NAV_PX = 0;

/** 一级 tab 行的共用排版常量（@3x 母版反解，见 `measure_indextabs.py`）。 */
export const GOODS_INDEX_TAB_COLUMNS = {
  rowHeight: 42,
  labelTop: 12,
  labelLine: 21,
  fontSize: 15,
  underlineTop: 40.5,
  underlineHeight: 2,
} as const;

/** 轨道左右内缩；主店实测 16.42 / 16.42，两 tab 店 16.0 / 16.0，统一取 16。 */
export const GOODS_INDEX_TAB_TRACK_INSET = 16;

const TWO_TABS: readonly GoodsIndexTabItem[] = [
  { key: 'goods', label: '宝贝' },
  { key: 'category', label: '分类' },
];

export const GOODS_LANDING_DESIGNS: Record<StoreKey, GoodsLandingDesign> = {
  // 主店：唯一一张三 tab（宝贝 / 分类 / 穿搭）的稿，列宽 114.33。
  nike: {
    store: 'nike',
    figmaNode: '4040:24331',
    slug: 'nike',
    height: 976,
    indexTabRowTop: 223,
    indexTabs: [
      { key: 'goods', label: '宝贝' },
      { key: 'category', label: '分类' },
      { key: 'lookbook', label: '穿搭' },
    ],
    // 下划线实测 y263.5..265.5，与自家分类稿完全重合。
    browseTabRowBottom: 265.5,
  },
  // ACG：6 层位图叠加后整页导一张，画板 812 高，比另外三店矮。
  acg: {
    store: 'acg',
    figmaNode: '4040:24332',
    slug: 'acg',
    // 2026-09-22 二次重导：Figma 里手删 button nav 后整帧变 1125×2940 @3x。
    height: 980,
    indexTabRowTop: 217,
    indexTabs: TWO_TABS,
    // 下划线实测 y257..258.5，与自家分类稿重合。
    browseTabRowBottom: 259,
  },
  jordan: {
    store: 'jordan',
    figmaNode: '4040:24480',
    slug: 'jordan',
    height: 977,
    // Jordan 的 browse 根稿把这一行画在 223（比自家分类稿低 6），两态统一按分类稿的 217 落地。
    indexTabRowTop: 217,
    indexTabs: TWO_TABS,
    // 下划线实测 y263.5..265.5，比 217+42 还低 6.5，所以 browse 的遮盖带要多留一段。
    browseTabRowBottom: 265.5,
  },
  // Kids：唯一没有「天猫官方认证」黑条的一张，整行 tab 因此上移 42，落在 223 顶栏切图之内。
  kids: {
    store: 'kids',
    figmaNode: '4040:24482',
    slug: 'kids',
    // 2026-09-22 二次重导：1125×3036 @3x。Kids 的画板高度没跟着 nav 一起收，
    // 页尾因此留了约 67 的白（`measure_tail.py` 实测），不是又冒出一条底栏。
    height: 1012,
    indexTabRowTop: 181,
    indexTabs: TWO_TABS,
    // Kids 的 browse 行整体比分类稿低 6：下划线实测 y228.5..230。
    browseTabRowBottom: 230,
    // 页尾 201@3x 的纯 #2c2c2c 底板（原 button nav 的背板），实测见
    // `agent-runs/2026-09-22-acg-kids-goods-export/measure_tail.py`。
    bottomClipPx: 67,
  },
};

export function goodsLandingDesign(store: StoreKey): GoodsLandingDesign {
  return GOODS_LANDING_DESIGNS[store];
}
