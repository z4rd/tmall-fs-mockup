import { useEffect, useRef } from 'react';
import { autoplayInWeixin } from '../../lib/weixinVideoAutoplay';
import './HeroVideo.css';

type HeroVideoProps = {
  /** 例如 `/videos/acg-hero.mp4` */
  src: string;
  posterWebp: string;
  /** JPEG 兜底（极旧 WebView 若 webp poster 不显示时可换用） */
  posterJpg: string;
  /** 设计稿 hero 可见框 347×434 */
  aspectW?: number;
  aspectH?: number;
};

/**
 * ACG / Jordan / Kids 首页 P1 hero：实拍全出血，用 cover（§7.2.1）。
 * 首屏只进 poster；`preload="none"`，idle 后再拉流（§5.4.1）。
 */
export function HeroVideo({
  src,
  posterWebp,
  posterJpg: _posterJpg,
  aspectW = 347,
  aspectH = 434,
}: HeroVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const startLoad = () => {
      if (!video.getAttribute('src')) video.src = src;
      autoplayInWeixin(video);
    };

    const ric = window.requestIdleCallback?.(startLoad, { timeout: 2000 });
    if (ric !== undefined) {
      return () => window.cancelIdleCallback?.(ric);
    }
    const t = window.setTimeout(startLoad, 300);
    return () => window.clearTimeout(t);
  }, [src]);

  return (
    <div className="hero-vid" style={{ aspectRatio: `${aspectW} / ${aspectH}` }}>
      <video
        ref={videoRef}
        className="hero-vid__el"
        poster={posterWebp}
        muted
        loop
        autoPlay
        playsInline
        preload="none"
        {...({
          'webkit-playsinline': 'true',
          'x5-playsinline': 'true',
          'x5-video-player-type': 'h5',
          'x5-video-player-fullscreen': 'false',
        } as Record<string, string>)}
      />
      {/* WebP poster 在极旧内核上可能不显示时，可在 <picture> 层换 jpg；当前以 webp 为主 */}
    </div>
  );
}
