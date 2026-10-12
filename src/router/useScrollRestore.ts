import { useEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';
import { useScroller } from '../components/layout/ScrollerContext';
import { ROUTE_MOTION_MS } from './RouteMotion';

const positions = new Map<string, number>();

/**
 * 内部滚动容器的按路由滚动位置记忆。
 *
 * 后退时恢复到离开时的位置，前进时从顶部开始。浏览器帮不了我们，因为滚动发生
 * 在一个 div 里而不是 window 上。
 */
export function useScrollRestore() {
  const scroller = useScroller();
  const { key, pathname } = useLocation();
  const navType = useNavigationType();

  useEffect(() => {
    if (!scroller) return;

    const applyScroll = () => {
      if (navType === 'POP') {
        scroller.scrollTop = positions.get(key) ?? 0;
      } else {
        scroller.scrollTop = 0;
      }
    };

    // 与 §6.9 路由动效同拍，避免 back 时滚动位置在动画中途跳动。
    const delay = navType === 'POP' ? ROUTE_MOTION_MS : 0;
    const timer = window.setTimeout(applyScroll, delay);
    if (delay === 0) applyScroll();

    const save = () => positions.set(key, scroller.scrollTop);
    const onScroll = save;
    scroller.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      save();
      window.clearTimeout(timer);
      scroller.removeEventListener('scroll', onScroll);
    };
  }, [scroller, key, pathname, navType]);
}
