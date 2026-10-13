import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';

/**
 * 桌面预览仍在内部 div 滚动；真机窄屏切到 window 滚动，让浏览器地址栏可以自然收起。
 * 对上层暴露统一接口，避免各 hook 直接假定滚动源。
 */
export type AppScroller = {
  mode: 'element' | 'window';
  /** 手势命中仍挂在当前路由内容层上；window 模式下它不是滚动源。 */
  element: HTMLElement;
  getScrollTop: () => number;
  setScrollTop: (top: number) => void;
  addScrollListener: (listener: () => void) => () => void;
};

export function createElementScroller(element: HTMLElement): AppScroller {
  return {
    mode: 'element',
    element,
    getScrollTop: () => element.scrollTop,
    setScrollTop: (top) => {
      element.scrollTop = top;
    },
    addScrollListener: (listener) => {
      element.addEventListener('scroll', listener, { passive: true });
      return () => element.removeEventListener('scroll', listener);
    },
  };
}

export function createWindowScroller(element: HTMLElement): AppScroller {
  const scrollingElement = () => document.scrollingElement ?? document.documentElement;
  return {
    mode: 'window',
    element,
    getScrollTop: () => window.scrollY || scrollingElement().scrollTop,
    setScrollTop: (top) => {
      window.scrollTo(0, top);
    },
    addScrollListener: (listener) => {
      window.addEventListener('scroll', listener, { passive: true });
      return () => window.removeEventListener('scroll', listener);
    },
  };
}

const ScrollerContext = createContext<AppScroller | null>(null);

export function ScrollerProvider({
  value,
  children,
}: {
  value: AppScroller | null;
  children: ReactNode;
}) {
  return <ScrollerContext.Provider value={value}>{children}</ScrollerContext.Provider>;
}

export function useScroller() {
  return useContext(ScrollerContext);
}
