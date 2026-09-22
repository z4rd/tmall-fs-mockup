import { useEffect, useRef } from 'react';
import { useScroller } from '../components/layout/ScrollerContext';
import { usePageBack } from './usePageBack';

const EDGE_PX = 22;
const TRIGGER_PX = 72;

/**
 * 从左缘右滑触发与左上角相同的 `resolvePageBackPath` 导航。
 */
export function useSwipeBack() {
  const scroller = useScroller();
  const { canBack, goBack } = usePageBack();
  const tracking = useRef(false);
  const startX = useRef(0);
  const startY = useRef(0);

  useEffect(() => {
    if (!scroller || !canBack) return;

    const onStart = (e: TouchEvent) => {
      const t = e.touches.item(0);
      if (!t) return;
      const rect = scroller.getBoundingClientRect();
      const localX = t.clientX - rect.left;
      if (localX > EDGE_PX) return;

      tracking.current = true;
      startX.current = t.clientX;
      startY.current = t.clientY;
    };

    const onMove = (e: TouchEvent) => {
      if (!tracking.current) return;
      const t = e.touches.item(0);
      if (!t) return;
      const dx = t.clientX - startX.current;
      const dy = Math.abs(t.clientY - startY.current);
      if (dx > 12 && dx > dy * 1.35) {
        e.preventDefault();
      }
    };

    const onEnd = (e: TouchEvent) => {
      if (!tracking.current) return;
      tracking.current = false;
      const t = e.changedTouches[0];
      if (!t) return;
      const dx = t.clientX - startX.current;
      const dy = Math.abs(t.clientY - startY.current);
      if (dx >= TRIGGER_PX && dx > dy * 1.2) {
        goBack();
      }
    };

    const onCancel = () => {
      tracking.current = false;
    };

    scroller.addEventListener('touchstart', onStart, { passive: true });
    scroller.addEventListener('touchmove', onMove, { passive: false });
    scroller.addEventListener('touchend', onEnd, { passive: true });
    scroller.addEventListener('touchcancel', onCancel, { passive: true });

    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      const rect = scroller.getBoundingClientRect();
      const localX = e.clientX - rect.left;
      if (localX > EDGE_PX) return;
      tracking.current = true;
      startX.current = e.clientX;
      startY.current = e.clientY;
      scroller.setPointerCapture(e.pointerId);
    };

    const onPointerUp = (e: PointerEvent) => {
      if (e.pointerType === 'touch' || !tracking.current) return;
      tracking.current = false;
      const dx = e.clientX - startX.current;
      const dy = Math.abs(e.clientY - startY.current);
      if (dx >= TRIGGER_PX && dx > dy * 1.2) goBack();
      try {
        scroller.releasePointerCapture(e.pointerId);
      } catch {
        /* already released */
      }
    };

    scroller.addEventListener('pointerdown', onPointerDown);
    scroller.addEventListener('pointerup', onPointerUp);
    const onPointerCancel = () => {
      tracking.current = false;
    };

    scroller.addEventListener('pointercancel', onPointerCancel);

    return () => {
      scroller.removeEventListener('touchstart', onStart);
      scroller.removeEventListener('touchmove', onMove);
      scroller.removeEventListener('touchend', onEnd);
      scroller.removeEventListener('touchcancel', onCancel);
      scroller.removeEventListener('pointerdown', onPointerDown);
      scroller.removeEventListener('pointerup', onPointerUp);
      scroller.removeEventListener('pointercancel', onPointerCancel);
    };
  }, [scroller, canBack, goBack]);
}
