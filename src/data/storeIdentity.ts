import type { StoreKey } from './store';

/**
 * 逐店店铺身份：天猫 chrome 与店铺信息卡上「这是哪家店」的唯一对照源。
 *
 * 索引页六个入口落到四家店（男子 / 女子 / 双 11 同属主店），而 chrome 与店铺卡是活组件、
 * 不是切图，所以名称、头像、评分、粉丝数、认证条、数据条必须在这里按店分开，
 * 不能像此前那样写死主店。
 *
 * 依据（fileKey `Av3olXfkvEqBJOS9xK7YIi`，坐标一律 @1x 375 宽设计 px）：
 *
 * | 店 | 首页 header 节点 | 形态 |
 * | --- | --- | --- |
 * | nike   | `2787:11289` | 375×123 位图 `4729f888…`，整卡拍平 |
 * | acg    | `2768:39886` | **同一张主店位图** + 叠一层 ACG 店招（36×36 头像 @ (14,8)、118×17 白条 + 文字「ACG官方旗舰店」@ (57,7)） |
 * | jordan | `2760:39875` | 375×122 位图 `b9ad34ba…`，Jordan 自己的整卡 |
 * | kids   | `4041:25655` | 375×**88** 位图 `e6dc24ae…`，整卡但**没有天猫认证黑条** |
 *
 * ⚠️ ACG 的坑：设计师只替换了名称与头像，评分 / 粉丝数 / 认证条 / 数据条仍是底下那张
 * 主店位图透出来的，等于没给 ACG 的值。宝贝页那张 `acg-top.png` 也帮不上忙 —— 它除名称与
 * 头像外整页都是从 Jordan 复制的（1461万粉丝 / 9年老店 / 板鞋品牌榜 / 认证条写 JORDAN）。
 * 因此 ACG 这几项**按首页稿的像素原样沿用主店值**，并在此标注为待设计补值，
 * 而不是从 Jordan 那张抄一份同样不属于 ACG 的数字过来。
 */

export type StoreChipIcon = 'laurel' | 'shop' | 'thumb';

/** 店铺卡底部走马灯里的一枚数据条。 */
export type StoreChip = {
  key: string;
  icon: StoreChipIcon;
  text: string;
};

export type StoreIdentity = {
  store: StoreKey;
  /** 该店首页 header 的 Figma 节点，改文案前先回这里核。 */
  figmaNode: string;
  name: string;
  /** 店铺头像切图，相对 `public/`，渲染时走 `publicAsset()`。 */
  logoSrc: string;
  score: string;
  fans: string;
  /** 天猫认证黑条文案；Kids 首页稿没有这条，为 `null`。 */
  verified: string | null;
  /** 关注按钮状态。四店首页稿一致都是灰色「已关注」。 */
  followed: boolean;
  /**
   * 店铺卡总高（@1x）。Kids 少一条认证条，比另外三店矮 35。
   * Jordan 稿实测 122，与主店的 123 只差 1px 舍入，不单独区分。
   */
  cardHeight: number;
  chips: readonly StoreChip[];
};

/** 认证条文案模板；四店稿子里都是同一句，只换店名。 */
function verifiedText(name: string): string {
  return `天猫官方认证的 ${name}`;
}

export const STORE_IDENTITIES: Record<StoreKey, StoreIdentity> = {
  nike: {
    store: 'nike',
    figmaNode: '2787:11289',
    name: 'NIKE 官方旗舰店',
    logoSrc: 'images/chrome/store-logo/nike.png',
    score: '4.9',
    fans: '4920万粉丝',
    verified: verifiedText('NIKE 官方旗舰店'),
    followed: true,
    cardHeight: 123,
    chips: [
      // 名次按用户口径为 TOP1；作为像素基准的天猫截图里写的是 TOP3，这处差异是**有意的**。
      { key: 'rank', icon: 'laurel', text: '本店荣登运动鞋品牌榜TOP1' },
      { key: 'age', icon: 'shop', text: '14年老店' },
      { key: 'reviews', icon: 'thumb', text: '1万人评价' },
    ],
  },
  acg: {
    store: 'acg',
    figmaNode: '2768:39886',
    // 名称与头像是 ACG 店招覆盖层给的（`2553:71928` / `2553:71926`），高置信。
    name: 'ACG 官方旗舰店',
    logoSrc: 'images/chrome/store-logo/acg.png',
    // ↓ 以下四项设计稿未替换，沿用主店位图，**待设计补 ACG 实际值**。
    score: '4.9',
    fans: '4920万粉丝',
    // 稿上透出来的是「…认证的 NIKE 官方旗舰店」，那是覆盖层没盖住的主店文案，按本店店名改写。
    verified: verifiedText('ACG 官方旗舰店'),
    followed: true,
    cardHeight: 123,
    chips: [
      { key: 'rank', icon: 'laurel', text: '本店荣登运动鞋品牌榜TOP1' },
      { key: 'age', icon: 'shop', text: '14年老店' },
      { key: 'reviews', icon: 'thumb', text: '1万人评价' },
    ],
  },
  jordan: {
    store: 'jordan',
    figmaNode: '2760:39875',
    name: 'JORDAN 官方旗舰店',
    logoSrc: 'images/chrome/store-logo/jordan.png',
    score: '4.9',
    fans: '1461万粉丝',
    verified: verifiedText('JORDAN 官方旗舰店'),
    followed: true,
    cardHeight: 123,
    chips: [
      { key: 'rank', icon: 'laurel', text: '本店荣登板鞋品牌榜' },
      { key: 'age', icon: 'shop', text: '9年老店' },
      { key: 'reviews', icon: 'thumb', text: '1千人评价' },
    ],
  },
  kids: {
    store: 'kids',
    figmaNode: '4041:25655',
    name: 'NIKE 儿童官方旗舰店',
    logoSrc: 'images/chrome/store-logo/kids.png',
    score: '5.0',
    fans: '693万粉丝',
    // 稿上确实没有认证黑条，数据条直接接在店名行下面，整卡因此只有 88 高。
    verified: null,
    followed: true,
    cardHeight: 88,
    chips: [
      { key: 'rank', icon: 'laurel', text: '本店荣登学步鞋品牌榜' },
      { key: 'age', icon: 'shop', text: '8年老店' },
      { key: 'reviews', icon: 'thumb', text: '1千人评价' },
    ],
  },
};

export function storeIdentity(store: StoreKey): StoreIdentity {
  return STORE_IDENTITIES[store];
}
