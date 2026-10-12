/**
 * 路由级图片预加载：P0 进页即拉小批量关键图；P1 在空闲时拉下一跳候选图。
 * 弱网 / 省流（`saveData`、`2g`）只关 P1 后台预取，P0 仍跑（用户在当前页、量很小）。
 */

import { resolvePreferredSrc } from './imageFormat';

type NetworkInformationLike = {
  saveData?: boolean;
  effectiveType?: string;
};

const startedUrls = new Set<string>();
const decodedUrls = new Map<string, Promise<void>>();
const preloaders = new Map<string, HTMLImageElement>();

export function canBackgroundPreload(): boolean {
  const conn = (navigator as Navigator & { connection?: NetworkInformationLike }).connection;
  if (!conn) return true;
  if (conn.saveData) return false;
  const et = conn.effectiveType;
  if (et === 'slow-2g' || et === '2g') return false;
  return true;
}

/**
 * 与 `<img src>` 同 URL 时走浏览器缓存；进行中请求用 Set 去重。
 *
 * 传进来的永远是 `.webp`，但页面上真正渲染的是 `<picture>` 协商后的结果。这里必须先问一遍
 * `resolvePreferredSrc`，否则支持 AVIF 的设备会预取 WebP、渲染 AVIF，同一张图下载两次。
 */
export function preloadImage(url: string): void {
  if (!url || startedUrls.has(url)) return;
  startedUrls.add(url);
  void resolvePreferredSrc(url).then((src) => {
    const img = new Image();
    img.decoding = 'async';
    preloaders.set(url, img);
    img.onload = img.onerror = () => preloaders.delete(url);
    img.src = src;
  });
}

export function preloadImageDecoded(url: string): Promise<void> {
  if (!url) return Promise.resolve();
  const existing = decodedUrls.get(url);
  if (existing) return existing;

  const request = resolvePreferredSrc(url).then(
    (src) =>
      new Promise<void>((resolve) => {
        const img = new Image();
        img.decoding = 'async';
        preloaders.set(url, img);

        const done = () => {
          preloaders.delete(url);
          resolve();
        };

        img.onload = () => {
          if (typeof img.decode === 'function') {
            void img.decode().then(done, done);
          } else {
            done();
          }
        };
        img.onerror = done;
        img.src = src;
      }),
  );

  decodedUrls.set(url, request);
  return request;
}

const P1_IDLE_DELAY_MS = 1500;

export function scheduleBackgroundPreload(run: () => void): () => void {
  let cancelled = false;
  let idleHandle = 0;

  const timeoutId = window.setTimeout(() => {
    if (cancelled) return;
    const work = () => {
      if (cancelled || !canBackgroundPreload()) return;
      run();
    };
    if ('requestIdleCallback' in window) {
      idleHandle = window.requestIdleCallback(work);
    } else {
      work();
    }
  }, P1_IDLE_DELAY_MS);

  return () => {
    cancelled = true;
    window.clearTimeout(timeoutId);
    if (idleHandle && 'cancelIdleCallback' in window) {
      window.cancelIdleCallback(idleHandle);
    }
  };
}
