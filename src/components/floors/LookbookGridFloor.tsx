import { useEffect, useRef, useState } from 'react';
import type { Gender } from '../../data/floors';
import { HOME_VIDEOS } from '../../data/videos';
import { publicAsset } from '../../lib/publicAsset';
import { autoplayInWeixin } from '../../lib/weixinVideoAutoplay';
import { u } from '../../lib/u';
import { SectionHeader } from '../common/SectionHeader';
import './LookbookGridFloor.css';

const CELL_W = [118, 119, 118];
const COL_X = [0, 122, 245];
const ROW_Y = [0, 180, 360];

/**
 * 展开态几何（363 栏内，原点 = 楼层左上角）。
 *
 * 实测自 Figma `Av3olXfkvEqBJOS9xK7YIi`，男 `2340:10037` / 女 `4003:20256`，
 * 并用 `agent-runs/2026-09-22-lookbook/measure.py` 逐像素复核过导出的 375×612 PNG。
 * 设计稿画板在标题上方多留了 16px 留白，且底板从 y54 起；折叠态 `2685:58986`
 * 的九宫格从 y44 起 —— 这里统一取 44，让展开态与折叠态的标题间距一致（用户第 1 条），
 * 同时保证被点格 FLIP 到大卡时首行不跳。画板 y54 → 楼层 y44，整体上移 10px。
 */
const PANEL = { left: 0, top: 44, width: 363, height: 433 };
/** 视频槽位：画板 (6,54) 246×433（男 `2340:10047`，设计师标注「这个是 video」）。 */
const HERO = { left: 0, top: 44, width: 246, height: 433 };

/**
 * 展开态楼层总高 = 底部穿搭条下缘。
 * 画板里底条是 (6,489) 363×103 → 楼层 y479，479 + 103 = 582。男女画板高度
 * 612 / 627 只是画板下方留白，内容完全一致，因此两边同高。
 */
const EXPANDED_H = 582;

type LookbookGridFloorProps = {
  gender: Gender;
  height: number;
};

function manhattan(a: number, b: number) {
  return Math.abs(Math.floor(a / 3) - Math.floor(b / 3)) + Math.abs((a % 3) - (b % 3));
}

function gridBox(index: number) {
  const col = index % 3;
  const row = Math.floor(index / 3);
  return {
    left: COL_X[col] ?? 0,
    top: (ROW_Y[row] ?? 0) + 44,
    width: CELL_W[col] ?? 118,
    height: 176,
  };
}

/**
 * 夏日穿搭：9 格 → 大卡 FLIP；展开 420ms，收起 320ms。
 * 仅被点格参与位移动画，避免收起时 9 格 layout 牵连。
 */
export function LookbookGridFloor({ gender, height }: LookbookGridFloorProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [leaving, setLeaving] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const savedTime = useRef(0);
  const collapseTimer = useRef<number | null>(null);

  const expanded = expandedIndex !== null;
  const videoSrc = gender === 'men' ? HOME_VIDEOS.lookbookMen : HOME_VIDEOS.lookbookWomen;

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !expanded || leaving) return;
    video.currentTime = savedTime.current;
    autoplayInWeixin(video);
  }, [expanded, leaving, gender]);

  useEffect(() => {
    return () => {
      if (collapseTimer.current !== null) window.clearTimeout(collapseTimer.current);
    };
  }, []);

  function collapse() {
    const video = videoRef.current;
    if (video) {
      savedTime.current = video.currentTime;
      video.pause();
    }
    if (collapseTimer.current !== null) window.clearTimeout(collapseTimer.current);
    setLeaving(true);
    collapseTimer.current = window.setTimeout(() => {
      setExpandedIndex(null);
      setLeaving(false);
      collapseTimer.current = null;
    }, 320);
  }

  function openCell(index: number) {
    if (collapseTimer.current !== null) {
      window.clearTimeout(collapseTimer.current);
      collapseTimer.current = null;
    }
    setLeaving(false);
    setExpandedIndex(index);
  }

  return (
    <section
      className={`lookbook${expanded || leaving ? ' lookbook--open' : ''}${leaving ? ' lookbook--leaving' : ''}`}
      style={{ height: u(expanded || leaving ? EXPANDED_H : height) }}
    >
      <SectionHeader title="夏日穿搭" />

      {expanded || leaving ? (
        <div
          className="lookbook-card"
          style={{
            left: u(PANEL.left),
            top: u(PANEL.top),
            width: u(PANEL.width),
            height: u(PANEL.height),
          }}
          aria-hidden="true"
        />
      ) : null}

      {Array.from({ length: 9 }, (_, index) => {
        const active = (expanded || leaving) && index === expandedIndex;
        const hidden = (expanded || leaving) && index !== expandedIndex;
        const box = active ? HERO : gridBox(index);
        const delay = expanded && !leaving && hidden ? manhattan(index, expandedIndex!) * 12 : 0;

        return (
          <button
            key={index}
            type="button"
            className={`lookbook-cell${active ? ' lookbook-cell--hero' : ''}${hidden ? ' lookbook-cell--hidden' : ''}`}
            style={{
              left: u(box.left),
              top: u(box.top),
              width: u(box.width),
              height: u(box.height),
              zIndex: active ? 3 : 1,
              transitionDelay: hidden ? `${delay}ms` : '0ms',
              pointerEvents: expanded && !active ? 'none' : 'auto',
            }}
            onClick={() => !expanded && openCell(index)}
            aria-label="展开夏日穿搭"
          >
            {!active ? (
              <img
                src={publicAsset(`images/live/lookbook/${gender}/${index}.webp`)}
                alt=""
                draggable={false}
              />
            ) : null}
          </button>
        );
      })}

      {(expanded || leaving) && expandedIndex !== null ? (
        <>
          <div
            className="lookbook-slot"
            style={{
              left: u(HERO.left),
              top: u(HERO.top),
              width: u(HERO.width),
              height: u(HERO.height),
            }}
          >
            <video
              ref={videoRef}
              className="lookbook-slot__video"
              src={publicAsset(videoSrc)}
              muted
              loop
              playsInline
              preload="metadata"
              {...({
                'webkit-playsinline': 'true',
                'x5-playsinline': 'true',
                'x5-video-player-type': 'h5',
                'x5-video-player-fullscreen': 'false',
              } as Record<string, string>)}
            />
          </div>
          <button
            type="button"
            className={`lookbook-back${leaving ? ' lookbook-back--out' : ''}`}
            onClick={collapse}
          >
            <span className="lookbook-back__icon" aria-hidden="true" />
            <span className="lookbook-back__label">返回</span>
          </button>
          <div className={`lookbook-rail${leaving ? ' lookbook-rail--out' : ''}`}>
            {[0, 1, 2].map((card) => (
              <img
                key={card}
                className="lookbook-rail__card"
                src={publicAsset(`images/live/lookbook/${gender}/rail-${card}.webp`)}
                alt=""
              />
            ))}
          </div>
          <div className={`lookbook-thumbs${leaving ? ' lookbook-thumbs--out' : ''}`}>
            {/* 设计稿只摆得下 5 张（57 宽 + 13 间距，363 的条内放不下 9 张），
                这里改成横滑，内容换成折叠态九宫格的同一批 9 张。 */}
            <div className="lookbook-thumbs__track">
              {Array.from({ length: 9 }, (_, cell) => (
                <button
                  key={cell}
                  type="button"
                  className="lookbook-thumb"
                  onClick={() => !leaving && openCell(cell)}
                  aria-label={`穿搭 ${cell + 1}`}
                  aria-current={cell === expandedIndex}
                >
                  <img
                    src={publicAsset(`images/live/lookbook/${gender}/${cell}.webp`)}
                    alt=""
                    draggable={false}
                  />
                </button>
              ))}
            </div>
            <span className="lookbook-thumbs__bar" aria-hidden="true" />
          </div>
        </>
      ) : null}
    </section>
  );
}
