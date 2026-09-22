import { useLayoutEffect } from 'react';
import { useScroller } from '../components/layout/ScrollerContext';
import { headerState } from '../data/chromeGeometry';

/**
 * 直接由滚动位置驱动 chrome。
 *
 * 刻意完全不调用 setState：让 React 在每个滚动帧上重渲染 header，正是会把
 * 60fps 吃掉的那件事。这个 hook 每帧只写两个无量纲自定义属性和一个布尔属性，
 * 所有动画长度都由 CSS calc() 从它们推导，滚动期间不发生任何协调。
 *
 * 属性写在 :root 而不是 header 上，因为店铺信息卡属于滚动内容、位于 header
 * 之外，却需要按同一个进度值淡出。
 *
 * §6.3：header 不含任何基于时间的动画，且上下行共用同一组阈值，所以它是
 * scrollTop 的纯函数，反向对称无需额外处理即成立。
 */
export function useCollapsibleHeader() {
  const scroller = useScroller();

  useLayoutEffect(() => {
    if (!scroller) return;
    const el = document.documentElement;

    // --u 带 px 量纲，所以 scrollTop 要除以它才能得到设计 px。
    const unit = () => {
      const u = parseFloat(getComputedStyle(el).getPropertyValue('--u'));
      return Number.isFinite(u) && u > 0 ? u : 1;
    };

    let u = unit();
    let frame = 0;
    let lastDark: boolean | null = null;

    const apply = () => {
      frame = 0;
      const { collapse, morph, dark } = headerState(scroller.scrollTop / u);
      el.style.setProperty('--collapse', collapse.toFixed(4));
      el.style.setProperty('--morph', morph.toFixed(4));
      // 写属性本身便宜，但会触发更大范围的失效，所以只在翻转的那一帧写。
      if (dark !== lastDark) {
        lastDark = dark;
        el.dataset.chromeDark = String(dark);
      }
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(apply);
    };

    const onResize = () => {
      u = unit();
      apply();
    };

    apply();
    scroller.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      scroller.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, [scroller]);
}
