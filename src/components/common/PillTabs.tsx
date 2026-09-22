import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { u } from '../../lib/u';
import './PillTabs.css';

export type PillTabItem = { key: string; label: string };

export type PillTabsProps = {
  items: PillTabItem[];
  activeKey: string;
  onChange: (key: string) => void;
  itemWidth: number | number[];
  step: number | number[];
  startX?: number;
  /** 活动胶囊在页间滑动。同一时刻只能有一个实例使用同一个 id。 */
  layoutId?: string;
  /** 深色运动专区底上的浅字胶囊 */
  tone?: 'light' | 'dark';
  /** 运动专区：圆角 bubble 底 + 滑动高亮块 */
  variant?: 'default' | 'bubble';
  /** bubble：按 tab key 解析选中字色（避免仅靠继承 CSS 变量在切换时错位） */
  getActiveLabelColor?: (key: string) => string;
  /** bubble：未选中字色；入参为 tab key，但通常应基于当前 activeKey 统一返回 others 色，而非按 inactive tab 的 key 查表 */
  getInactiveLabelColor?: (key: string) => string;
  /** bubble：未选中字色默认值，默认 #ffffff */
  inactiveLabelColor?: string;
  /** bubble：选中胶囊玻璃色调，反相于面板（浅底配暗玻璃 / 深底配亮玻璃） */
  bubbleActiveSkin?: 'onLight' | 'onDark';
};

function widthAt(index: number, widths: number | number[]): number {
  if (!Array.isArray(widths)) return widths;
  const v = widths[index] ?? widths[widths.length - 1];
  return v ?? 72;
}

function stepAt(index: number, steps: number | number[]): number {
  if (!Array.isArray(steps)) return steps;
  const v = steps[index] ?? steps[steps.length - 1];
  return v ?? 74;
}

function trackWidth(
  items: PillTabItem[],
  itemWidth: number | number[],
  step: number | number[],
  startX: number,
) {
  if (items.length === 0) return startX;
  let x = startX;
  for (let i = 0; i < items.length; i++) {
    const w = widthAt(i, itemWidth);
    x += w;
    if (i < items.length - 1) {
      const st = stepAt(i, step);
      x += st - w;
    }
  }
  return x + 8;
}

/**
 * 横向可滚动的胶囊 tab（Sports Zone 72×32 / 步进 74 等），激活项自动滚入可视区。
 */
export function PillTabs({
  items,
  activeKey,
  onChange,
  itemWidth,
  step,
  startX = 8,
  layoutId,
  tone = 'light',
  variant = 'default',
  getActiveLabelColor,
  getInactiveLabelColor,
  inactiveLabelColor = '#ffffff',
  bubbleActiveSkin = 'onDark',
}: PillTabsProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const btnRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  useEffect(() => {
    const btn = btnRefs.current[activeKey];
    const scroller = scrollerRef.current;
    if (!btn || !scroller) return;
    const left = btn.offsetLeft - scroller.clientWidth / 2 + btn.clientWidth / 2;
    scroller.scrollTo({ left: Math.max(0, left), behavior: 'smooth' });
  }, [activeKey]);

  // bubble 的选中胶囊走 left/width 过渡：layoutId 的 scale 动画会把圆角端帽拉变形。
  const positions: { left: number; width: number }[] = [];
  {
    let x = startX;
    for (let i = 0; i < items.length; i++) {
      const w = widthAt(i, itemWidth);
      positions.push({ left: x, width: w });
      if (i < items.length - 1) x += stepAt(i, step);
    }
  }
  const activeIndex = items.findIndex((it) => it.key === activeKey);
  const activeBox = positions[activeIndex >= 0 ? activeIndex : 0];
  const useSkinBar = variant === 'bubble' && activeBox != null;

  return (
    <div
      className={`pill-tabs${tone === 'dark' && variant !== 'bubble' ? ' pill-tabs--dark' : ''}${variant === 'bubble' ? ' pill-tabs--bubble' : ''}`}
      ref={scrollerRef}
    >
      <div className="pill-tabs__track" style={{ width: u(trackWidth(items, itemWidth, step, startX)) }}>
        {useSkinBar ? (
          <span
            className="pill-tabs__active--skin"
            aria-hidden="true"
            data-pill-skin={bubbleActiveSkin}
            style={{ left: u(activeBox.left), width: u(activeBox.width) }}
          />
        ) : null}
        {items.map((item, i) => {
          const { left, width: w } = positions[i] ?? { left: startX, width: 0 };

          const isActive = item.key === activeKey;
          const labelColor =
            variant === 'bubble'
              ? isActive
                ? (getActiveLabelColor?.(item.key) ?? inactiveLabelColor)
                : (getInactiveLabelColor?.(item.key) ?? inactiveLabelColor)
              : undefined;

          return (
            <button
              key={item.key}
              type="button"
              ref={(el) => {
                btnRefs.current[item.key] = el;
              }}
              className={`pill-tabs__item${isActive ? ' is-active' : ''}`}
              style={{
                left: u(left),
                width: u(w),
              }}
              onClick={() => onChange(item.key)}
            >
              {layoutId && isActive && !useSkinBar ? (
                <motion.span
                  className="pill-tabs__active"
                  layoutId={layoutId}
                  transition={{ duration: 0.3, ease: 'linear' }}
                  aria-hidden="true"
                />
              ) : null}
              <span
                className={`pill-tabs__label${
                  variant === 'bubble' && item.label.length >= 4 ? ' pill-tabs__label--tight' : ''
                }`}
                style={labelColor ? { color: labelColor } : undefined}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
