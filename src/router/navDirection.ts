import type { NavigationType } from 'react-router-dom';

/** 1 = 前进（左撤右进），-1 = 后退（右撤左进）。 */
export type NavDirection = 1 | -1;

/**
 * 站内返回的方向标记。
 *
 * 站内所有返回入口（天猫头 ←、二级返回条、宝贝页 ←、产品墙 ←、右滑手势）都走
 * `usePageBack().goBack`，而返回目标是 `resolvePageBackPath` **语义推导**出来的：深链进来
 * 或刷新后历史里根本没有那条记录，所以不能用 `navigate(-1)`（会退出应用或退到无关页面，
 * 见 `resolveGoodsBackPath` 的注释）。于是这些返回在 history 层面都是一次 PUSH，
 * `useNavigationType()` 只会报 `PUSH`，`RouteMotion` 没法靠它认出后退。
 *
 * 标记刻意放在模块变量而不是 `navigate` 的 `state` 里：
 * 1. `state` 已经被 `backTo` 占用（见 `readBackTo`），叠字段容易互相覆盖；
 * 2. 更要紧的是 `state` 会**持久化在那条 history entry 上**。一旦写进去，之后用浏览器
 *    前进 / 后退再落回这条 entry 时会读到这枚陈旧的标记 —— 尤其是「浏览器前进」，
 *    本该放前进动画，却会被旧标记判成后退。一次性的模块变量不留痕，从源头避免这类误判。
 */
let pendingBack = false;

/** 供 `goBack` 在 `navigate` 之前调用：声明「接下来这一次 PUSH 其实是返回」。 */
export function markBackNavigation(): void {
  pendingBack = true;
}

let lastKey: string | null = null;
let lastDir: NavDirection = 1;

/**
 * 按 `location.key` 记忆方向：同一条 location 的重复渲染必须拿到同一个方向，
 * 否则退场动画演到一半方向会翻过来。
 */
export function routeDirection(locationKey: string, navType: NavigationType): NavDirection {
  if (locationKey === lastKey) return lastDir;
  lastKey = locationKey;
  lastDir = navType === 'POP' || pendingBack ? -1 : 1;
  pendingBack = false;
  return lastDir;
}

/** 仅供测试 / 调试重置模块状态。 */
export function resetNavDirection(): void {
  pendingBack = false;
  lastKey = null;
  lastDir = 1;
}
