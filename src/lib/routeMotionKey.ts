import { goodsContextFromPath } from './goodsRoute';

/**
 * `AnimatePresence` 用此 key 而非 `location.key`，同 key 内的导航不触发整屏翻页动画。
 *
 * 宝贝页「宝贝 / 分类」是**同一页里的一级 tab**，族切换（选购男子 / 女子、大童 / 幼童 / 婴童）
 * 和左导航切类目同理，全部收敛到同一个 key —— 四家店各一层，双 11 会场因为共用主店根稿也算
 * 主店。这样整条宝贝页链路内部零转场，只有进出宝贝页时才走 §6.9 的叠层平移。
 */
export function routeMotionKey(pathname: string): string {
  if (!pathname.startsWith('/goods')) return pathname;
  return `/goods:${goodsContextFromPath(pathname).store}`;
}

/** 宝贝页 tab 切换：replace 且不打断 motion key */
export function isGoodsTabPath(pathname: string): boolean {
  return pathname.startsWith('/goods');
}
