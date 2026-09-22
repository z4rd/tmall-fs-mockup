import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useHorizontalPagerSwipe } from '../../hooks/useHorizontalPagerSwipe';
import type { Gender } from '../../data/floors';
import {
  DEFAULT_SPORTS_TAB,
  sportsTabLabelColor,
  sportsTabLabelColorsWhenSelected,
  sportsTabPillGlassFor,
  sportsTabStepsFor,
  sportsTabWidthsFor,
  sportsThemesFor,
} from '../../data/sportsThemes';
import { publicAsset } from '../../lib/publicAsset';
import { PillTabs } from '../common/PillTabs';
import { SectionHeader } from '../common/SectionHeader';
import { u } from '../../lib/u';
import './SportsZoneFloor.css';

type SportsZoneFloorProps = {
  gender: Gender;
  height: number;
};

/**
 * 运动专区：每个主题一页切图（KV + 商品面板）。
 * 七页叠放在同一位置，切换走交叉淡入淡出；活动胶囊仍在 tab 条上滑动。
 * 主题色仅作数据记录；外框与 tab 以切图为准，不再叠 CSS 色框。训练切图缺失时保留深色占位。
 */
export function SportsZoneFloor({ gender, height }: SportsZoneFloorProps) {
  const themes = useMemo(() => sportsThemesFor(gender), [gender]);
  const [activeKey, setActiveKey] = useState(DEFAULT_SPORTS_TAB[gender]);
  // 布局恒定：每个 tab 按自己的标签定宽，与选中项无关，所以只依赖 gender。
  const tabWidths = useMemo(() => sportsTabWidthsFor(gender), [gender]);
  const tabSteps = useMemo(() => sportsTabStepsFor(tabWidths), [tabWidths]);
  const [missing, setMissing] = useState<Record<string, boolean>>({});

  const index = Math.max(
    0,
    themes.findIndex((theme) => theme.key === activeKey),
  );
  const resolveActiveLabelColor = useCallback(
    (key: string) => sportsTabLabelColor(gender, activeKey, key),
    [gender, activeKey],
  );
  const resolveInactiveLabelColor = useCallback(
    () => sportsTabLabelColorsWhenSelected(gender, activeKey).others,
    [gender, activeKey],
  );
  // 玻璃档位按主题 key 显式查表，男女同 key 同档。
  const activePillGlass = useMemo(() => sportsTabPillGlassFor(activeKey), [activeKey]);
  const viewportRef = useRef<HTMLDivElement>(null);

  /*
   * ── 叠放 + 交叉淡入淡出的挂载策略 ─────────────────────────────────────
   * 面板切图每张 1.2~2MB，七张合计约 10MB。改成叠放后若把七页一次性渲染出来，首屏就会
   * 并发下载这十兆 —— 原来的 translateX 版本正是如此（七个 `<img>` 全在 DOM 里）。
   * 所以只挂载**访问过的主题**：首屏只挂 1 张，切到哪张才挂哪张。
   *
   * 代价是首次切到某主题要等它下载完。为了不把横滑手势的手感做没，等当前这张 load 完
   * 之后再把**左右邻居**补挂进来预热 —— 预热发生在当前页就绪之后，不和首屏抢带宽。
   * 于是稳态最多常驻 3 张（首尾主题只有一个邻居，是 2 张），而不是 7 张。
   *
   * gender 变化时这几份状态不会变脏：/home/men 与 /home/women 是两条独立路由，
   * 切性别会整棵重挂，useState 的初值因此总是对的。
   */
  const [mounted, setMounted] = useState<string[]>(() => [DEFAULT_SPORTS_TAB[gender]]);
  const [loaded, setLoaded] = useState<Record<string, boolean>>({});
  /*
   * 真正显示的那一页。它**落后于** activeKey：只有目标图就绪了才跟上。
   * 不这样做的话，切到一张还没下载完的图会淡入到一个空的 `<img>`，也就是卡片底色 #111，
   * 出现一次背景穿帮。（另一道保险在 CSS 侧：淡出页整段时长保持不透明，见 .css）
   */
  const [shownKey, setShownKey] = useState(DEFAULT_SPORTS_TAB[gender]);

  const ensureMounted = useCallback((key: string) => {
    setMounted((prev) => (prev.includes(key) ? prev : [...prev, key]));
  }, []);

  // 点 tab 后立刻挂载目标页、开始下载，但先不切换显示
  useEffect(() => {
    ensureMounted(activeKey);
  }, [activeKey, ensureMounted]);

  // 切图缺失（onError）也算「就绪」，否则会一直卡在旧页、深色占位永远出不来
  const activeReady = Boolean(loaded[activeKey] || missing[activeKey]);

  useEffect(() => {
    if (activeReady) setShownKey(activeKey);
  }, [activeKey, activeReady]);

  useEffect(() => {
    if (!activeReady) return;
    const prev = themes[index - 1];
    const next = themes[index + 1];
    if (prev) ensureMounted(prev.key);
    if (next) ensureMounted(next.key);
  }, [activeReady, ensureMounted, index, themes]);

  const goPrev = useCallback(() => {
    const prev = themes[Math.max(0, index - 1)];
    if (prev) setActiveKey(prev.key);
  }, [index, themes]);

  const goNext = useCallback(() => {
    const next = themes[Math.min(themes.length - 1, index + 1)];
    if (next) setActiveKey(next.key);
  }, [index, themes]);

  useHorizontalPagerSwipe(viewportRef, { onPrev: goPrev, onNext: goNext });

  return (
    <section className="sports-zone" style={{ height: u(height) }}>
      <SectionHeader title="运动专区" />
      <div className="sports-zone__card">
        <div className="sports-zone__tabs">
          <PillTabs
            items={themes}
            activeKey={activeKey}
            onChange={setActiveKey}
            itemWidth={tabWidths}
            step={tabSteps}
            startX={0}
            variant="bubble"
            layoutId={`sports-pill-${gender}`}
            getActiveLabelColor={resolveActiveLabelColor}
            getInactiveLabelColor={resolveInactiveLabelColor}
            bubbleActiveGlass={activePillGlass}
          />
        </div>
        <div className="sports-zone__viewport" ref={viewportRef}>
          {themes.map((theme) => {
            if (!mounted.includes(theme.key)) return null;
            const isShown = theme.key === shownKey;
            return (
              <div
                className={`sports-zone__page${isShown ? ' is-shown' : ''}`}
                key={theme.key}
                aria-hidden={isShown ? undefined : true}
              >
                {missing[theme.key] ? (
                  <div className="sports-zone__fallback">{theme.label}</div>
                ) : (
                  <img
                    className="sports-zone__shot"
                    src={publicAsset(`images/live/sports/${gender}/${theme.key}.webp`)}
                    alt=""
                    draggable={false}
                    onLoad={() => setLoaded((prev) => ({ ...prev, [theme.key]: true }))}
                    onError={() => setMissing((prev) => ({ ...prev, [theme.key]: true }))}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
