import { useEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';
import { useScroller } from '../components/layout/ScrollerContext';
import { ROUTE_MOTION_MS } from './RouteMotion';

const positions = new Map<string, number>();

/**
 * 按路由记忆滚动位置。
 *
 * 后退时恢复到离开时的位置，前进时从顶部开始。浏览器帮不了我们，因为滚动发生
 * 源可能是内部 div，也可能是移动端 window。
 */
export function useScrollRestore() {
  const scroller = useScroller();
  const { key, pathname } = useLocation();
  const navType = useNavigationType();

  useEffect(() => {
    if (!scroller) return;

    const applyScroll = () => {
      if (navType === 'POP') {
        scroller.setScrollTop(positions.get(key) ?? 0);
      } else {
        scroller.setScrollTop(0);
      }
    };

    // 与 §6.9 路由动效同拍，避免 back 时滚动位置在动画中途跳动。
    const delay = navType === 'POP' ? ROUTE_MOTION_MS : 0;
    const timer = window.setTimeout(applyScroll, delay);
    if (delay === 0) applyScroll();

    const save = () => positions.set(key, scroller.getScrollTop());
    const onScroll = save;
    const removeScrollListener = scroller.addScrollListener(onScroll);
    return () => {
      save();
      window.clearTimeout(timer);
      removeScrollListener();
    };
  }, [scroller, key, pathname, navType]);
}
