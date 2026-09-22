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

/** 男款底部 5 张缩略图不是网格顺序（报告 §2.5）。 */
const THUMBS: Record<Gender, number[]> = {
  men: [7, 1, 3, 5, 6],
  women: [0, 1, 3, 5, 6],
};

const THUMB_X = [13, 83, 153, 223, 293];

/** §2.5 展开态几何（363 栏内） */
const CARD = { left: 22, top: 54, width: 347, height: 433 };
const HERO = { left: 22, top: 54, width: 246, height: 433 };

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
  const expandedH = gender === 'men' ? 612 : 627;
  const videoSrc = gender === 'men' ? HOME_VIDEOS.lookbookMen : HOME_VIDEOS.lookbookWomen;
  const thumbs = THUMBS[gender];

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
      style={{ height: u(expanded || leaving ? expandedH : height) }}
    >
      <SectionHeader title="夏日穿搭" />

      {expanded || leaving ? (
        <div
          className="lookbook-card"
          style={{
            left: u(CARD.left),
            top: u(CARD.top),
            width: u(CARD.width),
            height: u(CARD.height),
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
                src={publicAsset(`images/live/lookbook/${gender}/${index}.png`)}
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
            返回
          </button>
          <div className={`lookbook-rail${leaving ? ' lookbook-rail--out' : ''}`}>
            {[0, 1, 2].map((card) => (
              <img
                key={card}
                className="lookbook-rail__card"
                src={publicAsset(`images/live/lookbook/${gender}/rail-${card}.png`)}
                alt=""
              />
            ))}
          </div>
          <div className={`lookbook-thumbs${leaving ? ' lookbook-thumbs--out' : ''}`}>
            {thumbs.map((cell, thumbIndex) => {
              const selected = cell === expandedIndex;
              return (
                <button
                  key={cell}
                  type="button"
                  className={`lookbook-thumb${selected ? ' is-active' : ''}`}
                  style={{ left: u(THUMB_X[thumbIndex] ?? 13) }}
                  onClick={() => !leaving && openCell(cell)}
                  aria-label={`穿搭 ${thumbIndex + 1}`}
                >
                  <img
                    src={publicAsset(`images/live/lookbook/${gender}/${cell}.png`)}
                    alt=""
                    draggable={false}
                  />
                  {selected ? <span className="lookbook-thumb__bar" /> : null}
                </button>
              );
            })}
          </div>
        </>
      ) : null}
    </section>
  );
}
