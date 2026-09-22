import { useEffect, useRef } from 'react';
import { KEYWORD_ROTATE_MS, SEARCH_KEYWORDS, type StoreId } from '../data/searchKeywords';

/**
 * placeholder 定时换词。
 *
 * 与 `useCollapsibleHeader` 同一套路：**不调用 `setState`**，直接写目标节点的
 * `textContent`。换词是 3 秒一次的低频事件，走 React 状态本身开销不大，但那会让
 * 整个 chrome 子树在一个可能正处于滚动中的帧里重新协调 —— header 好不容易做到
 * 滚动期间零 React 工作，没必要为一行文字把它破掉。
 *
 * 布局影响也已封死：`.cs-keyword` 是 `flex: 1` 定宽，换词不改变胶囊几何；`.cs` 上
 * 的 `contain: layout paint style` 进一步把重排锁在 header 内，波及不到滚动内容。
 *
 * 换词本身 **1 帧硬切、无过渡**，与原站一致（tmallref2 逐帧实测）。
 */
export function useRotatingKeyword(storeId: StoreId) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const words = SEARCH_KEYWORDS[storeId];
    const el = ref.current;
    if (!el || words.length === 0) return;

    const show = (n: number) => {
      const w = words[n];
      if (w !== undefined) el.textContent = w;
    };

    // 切店时立刻回到该店首词，不要让上一家店的词残留到下一个 tick。
    let i = 0;
    show(0);
    if (words.length === 1) return;

    const timer = window.setInterval(() => {
      i = (i + 1) % words.length;
      show(i);
    }, KEYWORD_ROTATE_MS);

    return () => window.clearInterval(timer);
  }, [storeId]);

  return ref;
}
