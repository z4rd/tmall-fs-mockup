import { useEffect, useRef, type RefObject } from 'react';

const MIN_SWIPE_PX = 48;
const AXIS_RATIO = 1.25;

type Options = {
  enabled?: boolean;
  onPrev: () => void;
  onNext: () => void;
};

/**
 * 内容区横向滑动手势：左滑下一页、右滑上一页；纵向滚动优先。
 */
export function useHorizontalPagerSwipe(
  targetRef: RefObject<HTMLElement | null>,
  { enabled = true, onPrev, onNext }: Options,
) {
  const start = useRef({ x: 0, y: 0, active: false });

  useEffect(() => {
    const el = targetRef.current;
    if (!el || !enabled) return;

    const onStart = (clientX: number, clientY: number) => {
      start.current = { x: clientX, y: clientY, active: true };
    };

    const onEnd = (clientX: number, clientY: number) => {
      if (!start.current.active) return;
      start.current.active = false;
      const dx = clientX - start.current.x;
      const dy = clientY - start.current.y;
      if (Math.abs(dx) < MIN_SWIPE_PX || Math.abs(dx) < Math.abs(dy) * AXIS_RATIO) return;
      if (dx < 0) onNext();
      else if (dx > 0) onPrev();
    };

    const touchStart = (e: TouchEvent) => {
      const t = e.touches.item(0);
      if (!t) return;
      onStart(t.clientX, t.clientY);
    };
    const touchEnd = (e: TouchEvent) => {
      const t = e.changedTouches.item(0);
      if (!t) return;
      onEnd(t.clientX, t.clientY);
    };

    const pointerDown = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      onStart(e.clientX, e.clientY);
    };
    const pointerUp = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      onEnd(e.clientX, e.clientY);
    };

    el.addEventListener('touchstart', touchStart, { passive: true });
    el.addEventListener('touchend', touchEnd, { passive: true });
    el.addEventListener('pointerdown', pointerDown);
    el.addEventListener('pointerup', pointerUp);

    return () => {
      el.removeEventListener('touchstart', touchStart);
      el.removeEventListener('touchend', touchEnd);
      el.removeEventListener('pointerdown', pointerDown);
      el.removeEventListener('pointerup', pointerUp);
    };
  }, [enabled, onNext, onPrev, targetRef]);
}
