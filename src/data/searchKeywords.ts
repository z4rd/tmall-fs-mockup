/**
 * 搜索框 placeholder 的词库与轮换参数。权威文案见 `docs/02-copy-and-qa.md` §1.2。
 */

import type { StoreKey } from './store';

/**
 * 店铺标识，与 `StoreKey` 同义，保留此别名是因为 chrome / hooks 一侧已按这个名字
 * 接好了线。
 *
 * 它**刻意与 `HomeVariant` / `Gender` 正交**：词库按**店铺**绑定，而主店一家店下面
 * 挂着 men / women / commercial 三个首页变体，它们共用同一套词。若把词库挂在
 * `HomeVariant` 上，ACG / JORDAN / 儿童这三家独立店铺就无处存放。因此 `HomeVariant`
 * 之后无论怎么改名或增减变体，这里都不需要跟着动。
 */
export type StoreId = StoreKey;

/**
 * 轮换间隔。**改这一个常量即可，全项目没有第二处。**
 *
 * ⚠️ 3000 是用户指示值，**不是实测值**：`tmallref2.mp4` 逐帧实测约 **5300 ms**，
 * 用户已知悉该分歧并指示先按 3s 走（见 `docs/02-copy-and-qa.md` §1.1，标记为待定）。
 * 后人请勿把 3000 当作从视频量出来的结论。
 */
export const KEYWORD_ROTATE_MS = 3000;

/**
 * 词库。换词是 **1 帧硬切、无任何过渡动画**（tmallref2 逐帧实测），
 * 所以渲染侧不要加 fade / slide / transition。
 */
export const SEARCH_KEYWORDS: Record<StoreId, readonly string[]> = {
  // Commercial（双 11）未单独提供词库，暂与主店共用 —— 「充2500得2580」本身即促销词。待确认。
  nike: ['飞马', '空军一号', '充2500得2580', '斜挎包'],
  acg: ['越野背心', '冲锋衣', '防水运动鞋'],
  jordan: ['aj4', '小飞人卫衣', '充3000得3100'],
  kids: ['儿童拖鞋', '儿童篮球鞋', '爬爬服'],
};

/**
 * 由路由推导店铺。主店的三个首页变体（含未来的 commercial）与双 11 会场都归 `nike`。
 *
 * 注意：`/home/*` 一律落到主店，这也是此前 placeholder 被写死成「儿童拖鞋」那个
 * 串店 bug 的正确修法 —— 那是 kids 的词，推测从 Kids 截图取样时带进来的。
 */
export function storeIdFromPath(pathname: string): StoreId {
  if (pathname.startsWith('/store/acg') || pathname.startsWith('/home/acg')) return 'acg';
  if (pathname.startsWith('/store/jordan') || pathname.startsWith('/home/jordan')) return 'jordan';
  if (pathname.startsWith('/store/kids') || pathname.startsWith('/home/kids')) return 'kids';
  if (pathname.startsWith('/goods/acg')) return 'acg';
  if (pathname.startsWith('/goods/jordan')) return 'jordan';
  if (pathname.startsWith('/goods/kids')) return 'kids';
  return 'nike';
}
