import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';

/**
 * 应用滚动发生在一个 div 内部而不是 window 上，所以由滚动驱动的 hook 需要拿到
 * 那个元素，而不能去读 window.scrollY。
 */
const ScrollerContext = createContext<HTMLElement | null>(null);

export function ScrollerProvider({
  value,
  children,
}: {
  value: HTMLElement | null;
  children: ReactNode;
}) {
  return <ScrollerContext.Provider value={value}>{children}</ScrollerContext.Provider>;
}

export function useScroller() {
  return useContext(ScrollerContext);
}
