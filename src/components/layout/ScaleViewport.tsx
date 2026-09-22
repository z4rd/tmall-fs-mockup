import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import './ScaleViewport.css';

const DESIGN_WIDTH = 375;
const PREVIEW_WIDTHS = [375, 390, 430] as const;

/** 桌面端显示手机外框和宽度切换器；真机上两者都不显示。 */
function useFramed() {
  const [framed, setFramed] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(min-width: 560px)').matches,
  );
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 560px)');
    const onChange = () => setFramed(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return framed;
}

export function ScaleViewport({ children }: { children: ReactNode }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const framed = useFramed();
  const [previewWidth, setPreviewWidth] = useState<number>(DESIGN_WIDTH);

  // --u 是缩放的唯一来源：1 设计 px === 1 * var(--u)。
  //
  // 它必须挂在 :root 上，不能挂在 stage 上。自定义属性是在**声明处**做替换的，
  // 所以 tokens.css 里的 `--floor-gap: 40px`（会被改写成 :root 上的
  // calc(40 * var(--u))）否则会按 html 元素求值，然后以一个固定长度继承下来，
  // 完全无视 stage 的实际宽度。
  //
  // 不会形成循环依赖，因为 stage 自身的宽度规则（100%、430 上限、桌面预览
  // 宽度）用的都是物理 px。
  useLayoutEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const apply = () => {
      const w = stage.getBoundingClientRect().width;
      if (w > 0) {
        document.documentElement.style.setProperty('--u', `${w / DESIGN_WIDTH}px`);
      }
    };

    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(stage);
    return () => ro.disconnect();
  }, []);

  return (
    <div className="sv-root" data-framed={framed}>
      <div
        ref={stageRef}
        className="sv-stage"
        style={framed ? { width: previewWidth, maxWidth: previewWidth } : undefined}
      >
        {children}
      </div>

      <div className="sv-build">
        375 design px &rarr; {previewWidth}px
        <br />
        internal scroller
      </div>

      <div className="sv-widths">
        {PREVIEW_WIDTHS.map((w) => (
          <button
            key={w}
            type="button"
            data-active={previewWidth === w}
            onClick={() => setPreviewWidth(w)}
          >
            {w}
          </button>
        ))}
      </div>
    </div>
  );
}
