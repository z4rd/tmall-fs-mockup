import { goodsBrowsePath, goodsContextFromPath } from '../lib/goodsRoute';
import { publicAsset } from '../lib/publicAsset';
import type { GoodsFamily } from './goods';
import { storeIdFromPath } from './searchKeywords';
import { storeHomePath, type StoreKey } from './store';

/**
 * 中间那一项的形态。四家店各不相同，ACG 干脆没有这一项（见 `BOTTOM_NAV_BY_STORE`）。
 *
 * - `pill`：主店的橙色胶囊，渐变 + `NikeSwoosh` 矢量 + 文字，全 DOM。
 * - `art`：切图。`card` 给出时先画一张白色圆角卡再把切图叠上去（Jordan）。
 *
 * 四店的凸起图形横向中心实测都落在格心 ±0.5px 内，所以这里只记 `top` 与尺寸，
 * 横向一律居中，不再逐张存绝对 x。
 */
export type BottomNavCenter =
  | { kind: 'pill' }
  | {
      kind: 'art';
      /** 切图相对 `public/` 的路径，已经过 `publicAsset()`。 */
      src: string;
      /** 切图尺寸与距条身顶边的距离，单位 375 设计 px。 */
      art: { top: number; width: number; height: number };
      /** Jordan 专有：切图底下那张纯白圆角卡。 */
      card?: { top: number; width: number; height: number; radius: number };
    };

export type BottomNavItem = {
  key: string;
  label: string;
  /**
   * active 态的前缀匹配键。
   *
   * 原来这里复用 `path` 一个字段兼作跳转目标与高亮判定；「运动空间」「新品」「会员」
   * 改成死区后跳转目标没有了，若连带把 `path` 删掉，高亮判定会一起失效，所以拆成两件事：
   * 目标由 `bottomNavTarget()` 按店算，高亮只看这个字段。
   */
  activePrefix?: readonly string[];
  /** 死区：设计稿里在，本轮不接路由，点了不响应。 */
  dead?: boolean;
  /** 「首页」右上角的角标文案，逐店不同（见 `home()`）。 */
  badge?: string;
  /** 中间的凸起项。 */
  center?: BottomNavCenter;
};

export type BottomNavVariant = {
  /** 该店导航条的 Figma 节点，改几何前先回这里核。 */
  figmaNode: string;
  items: readonly BottomNavItem[];
};

/** 扫码落地页与产品墙不带底部导航（报告 §2.9）。 */
export function showsBottomNav(pathname: string) {
  if (pathname === '/') return false;
  if (pathname.startsWith('/list')) return false;
  return true;
}

/**
 * 几何全部量自各店导航条的 Figma 节点（fileKey `Av3olXfkvEqBJOS9xK7YIi`）：
 *
 * | 店 | 节点 | 画布 |
 * | --- | --- | --- |
 * | nike（男子 / 女子 / 双 11 共用） | `4001:19200` | 375×70 |
 * | jordan | `4072:12158` | 375×70 |
 * | kids   | `4072:12157` | 375×**71** |
 * | acg    | `4072:12159` | 375×**71** |
 *
 * 四个节点都是拍平的位图（设计师从真机整屏截图上裁的矩形），拿不到组件树，只能导 @3x
 * 后量像素。下列数值都是在 @3x 导出图上测量后除以 3 得到的，精度约 ±0.2 设计 px。
 *
 * ⚠️ kids / acg 的 71 是**裁剪取整**，不是真实差异：三张图内部几何完全对齐
 * （分隔线 x 84.2 / 152.9 / 221.6 / 290.4 逐条一致，凸起项顶边同为 y8.67），
 * 多出来的 1px 落在所有内容下方（kids / acg 的最低墨行分别在 y38.3 / y33.3，
 * 末尾 3 个 @3x 行是纯背景）。另有一条独立旁证：宝贝页 landing 与分类 sheet 共 25 张切图
 * 页尾都烤着同一条原生导航，四店**一律**占最后 70 设计 px 整（背景突变行严丝合缝落在
 * 210/211 @3x 的交界上）。因此条身高度四店统一按 70 走，
 * `--bottom-nav-height` 与 `RouteMotion` 的占位块都不需要分店。
 *
 * ---
 *
 * 下面这个常量是各项横向排布的可用区间。
 *
 * ⚠️ 反直觉的一点：ACG 少一项之后**并没有沿用五等分、把中间那格空着**，而是把同一段区间
 * 重新四等分。实测三条分隔线中心 x = 101.2 / 187.0 / 273.2，步进 86.0；若是五等分留空，
 * 分隔线应落在 84 / 152.7 / 221.4 / 290.1，差出 17px，不可能是测量误差。
 * 文字块中心（宝贝 143.7 / 会员 315.5）也与四等分的 144.1 / 315.9 对得上。
 * 第二个信源同样指向四等分：ACG 的 3 张分类 sheet 与 landing 页尾烤死的那条原生导航，
 * 文字块中心实测 宝贝 143.7 / 新品 229.3 / 会员 315.5，与四等分预测逐项差 < 0.7px；
 * 若按五等分留空则应是 118.4 / 255.8 / 324.5。
 *
 * 两种分法起止完全相同，所以这里只存区间，格宽按项数算。
 */
const NAV_SPAN = { x0: 15.3, x1: 358.8 } as const;

/** 五项 68.7，四项 85.875。 */
export function navCell(count: number) {
  return (NAV_SPAN.x1 - NAV_SPAN.x0) / count;
}

/** 第 i 项的中心 x。 */
export function navCenter(i: number, count: number) {
  return NAV_SPAN.x0 + navCell(count) * (i + 0.5);
}

/** 分隔线中心 x，共 `count - 1` 条，落在格线上。 */
export function navDividers(count: number): number[] {
  const cell = navCell(count);
  return Array.from({ length: count - 1 }, (_, i) => NAV_SPAN.x0 + cell * (i + 1));
}

/**
 * 「首页」四店同形，只有角标文案分两派：nike / acg 是「新风潮」，jordan / kids 是「狂暑季」。
 * 这条是导出 @3x 放大 5 倍逐字认出来的，四张稿的角标胶囊尺寸、位置、渐变完全一致，只换文字。
 */
function home(badge: '新风潮' | '狂暑季'): BottomNavItem {
  return {
    key: 'home',
    label: '首页',
    // 子店首页走 `/store/*`，主店走 `/home/*`，两者都算「首页」。
    activePrefix: ['/home', '/store'],
    badge,
  };
}

const GOODS: BottomNavItem = { key: 'goods', label: '宝贝', activePrefix: ['/goods'] };

/** 尾部两项四店同文案，且都是死区。 */
const TAIL: readonly BottomNavItem[] = [
  { key: 'new', label: '新品', dead: true },
  { key: 'member', label: '会员', dead: true },
];

/**
 * 四种导航条变体。
 *
 * 中间项在四家店里是四种完全不同的东西，且**一律死区**（用户口径：本轮只有「首页」「宝贝」
 * 可点），所以它既不需要 active 配色也不需要跳转目标，这是下面 Jordan / Kids 敢整块走切图
 * 的前提。
 */
export const BOTTOM_NAV_BY_STORE: Record<StoreKey, BottomNavVariant> = {
  nike: {
    figmaNode: '4001:19200',
    items: [
      home('新风潮'),
      GOODS,
      { key: 'sports', label: '运动空间', dead: true, center: { kind: 'pill' } },
      ...TAIL,
    ],
  },
  jordan: {
    figmaNode: '4072:12158',
    items: [
      home('狂暑季'),
      GOODS,
      {
        key: 'sports',
        label: '正代系列',
        dead: true,
        center: {
          kind: 'art',
          src: publicAsset('images/chrome/bottom-nav/jordan-center.png'),
          // Jumpman + 「正代系列」是一整块纯黑图形（实测整块色度差为 0），
          // 按白卡底色反相成 alpha 导出，铺在下面这张 DOM 白卡上等价于原稿。
          art: { top: 7.33, width: 38.67, height: 34.67 },
          card: { top: 5, width: 65, height: 39.67, radius: 8 },
        },
      },
      ...TAIL,
    ],
  },
  kids: {
    figmaNode: '4072:12157',
    items: [
      home('狂暑季'),
      GOODS,
      {
        key: 'sports',
        label: '足球主场',
        dead: true,
        center: {
          kind: 'art',
          src: publicAsset('images/chrome/bottom-nav/kids-center.png'),
          // volt 胶囊是一团带模糊辉光的渐变，足球是实拍球面，文字又压在辉光上——三者无法拆开，
          // 只能整块出图。切图是不透明矩形，靠 Kids 条身底色恰好是平涂 #FCFCFC 才看不出接缝。
          art: { top: 4, width: 66, height: 43 },
        },
      },
      ...TAIL,
    ],
  },
  acg: {
    figmaNode: '4072:12159',
    // 只有四项，中间那项整个不存在，剩下四项重新四等分。
    items: [home('新风潮'), GOODS, ...TAIL],
  },
};

export function bottomNavVariant(store: StoreKey): BottomNavVariant {
  return BOTTOM_NAV_BY_STORE[store];
}

/**
 * 主店的首页变体（男子 / 女子 / 双 11）。
 *
 * 索引页六个入口里有三个落在主店，它们共用同一张宝贝页根稿 `4040:24331`，但左导航各不相同
 * （男子 13 项 / 女子 11 项 / 双 11 3 项），所以这个上下文必须一路带着走。
 */
function nikeVariantFromPath(pathname: string): GoodsFamily {
  if (pathname.startsWith('/home/women')) return 'women';
  if (pathname.startsWith('/home/commercial') || pathname.startsWith('/campaign/1111')) {
    return 'commercial';
  }
  return goodsContextFromPath(pathname).family ?? 'men';
}

/**
 * 导航目标按当前所处店铺 + 主店首页变体解析；死区项返回 `null`。
 *
 * 真正跳哪里要看用户是从索引页的哪个入口进来的 —— 固定跳 `/goods` 会把 ACG / Jordan / Kids
 * 全部甩回主店，也会让女子首页和双 11 会场的「分类」都落到男子当季上新。
 */
export function bottomNavTarget(item: BottomNavItem, pathname: string): string | null {
  if (item.dead) return null;
  const store = storeIdFromPath(pathname);
  const variant = store === 'nike' ? nikeVariantFromPath(pathname) : undefined;

  if (item.key === 'goods') {
    return goodsBrowsePath({ store, family: variant });
  }
  if (item.key === 'home') {
    return storeHomePath(store, variant);
  }
  return null;
}

/** 当前高亮项；没有匹配时返回空串。 */
export function bottomNavActiveKey(items: readonly BottomNavItem[], pathname: string): string {
  return items.find((i) => i.activePrefix?.some((p) => pathname.startsWith(p)))?.key ?? '';
}
