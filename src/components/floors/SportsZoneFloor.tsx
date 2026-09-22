import { useCallback, useMemo, useRef, useState } from 'react';
import { useHorizontalPagerSwipe } from '../../hooks/useHorizontalPagerSwipe';
import type { Gender } from '../../data/floors';
import {
  DEFAULT_SPORTS_TAB,
  sportsTabLabelColor,
  sportsTabLabelColorsWhenSelected,
  sportsTabPillSkinForSelectedColor,
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
 * 切换时整页 translateX，300ms linear；活动胶囊 layoutId 同步滑动。
 * 主题色仅作数据记录；外框与 tab 以切图为准，不再叠 CSS 色框。训练切图缺失时保留深色占位。
 */
export function SportsZoneFloor({ gender, height }: SportsZoneFloorProps) {
  const themes = useMemo(() => sportsThemesFor(gender), [gender]);
  const tabWidths = useMemo(() => sportsTabWidthsFor(gender), [gender]);
  const tabSteps = useMemo(() => sportsTabStepsFor(tabWidths), [tabWidths]);
  const [activeKey, setActiveKey] = useState(DEFAULT_SPORTS_TAB[gender]);
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
  // 玻璃色调跟随选中项字色：#111（跑步 / 训练）走浅底面板那套暗玻璃。
  const activePillSkin = useMemo(
    () =>
      sportsTabPillSkinForSelectedColor(
        sportsTabLabelColorsWhenSelected(gender, activeKey).selected,
      ),
    [gender, activeKey],
  );
  const viewportRef = useRef<HTMLDivElement>(null);

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
            bubbleActiveSkin={activePillSkin}
          />
        </div>
        <div className="sports-zone__viewport" ref={viewportRef}>
          <div
            className="sports-zone__track"
            style={{ transform: `translate3d(${-index * 100}%, 0, 0)` }}
          >
            {themes.map((theme) => (
              <div className="sports-zone__page" key={theme.key}>
                {missing[theme.key] ? (
                  <div className="sports-zone__fallback">{theme.label}</div>
                ) : (
                  <img
                    className="sports-zone__shot"
                    src={publicAsset(`images/live/sports/${gender}/${theme.key}.png`)}
                    alt=""
                    draggable={false}
                    onError={() => setMissing((prev) => ({ ...prev, [theme.key]: true }))}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
