import { useSwipeBack } from '../../hooks/useSwipeBack';

/** 挂载在滚动容器同级，为全站可返回路由启用右滑返回。 */
export function SwipeBack() {
  useSwipeBack();
  return null;
}
