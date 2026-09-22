/**
 * 微信 X5 内 autoplay：首次 play() 常被拦截，需在 WeixinJSBridgeReady 内补调。
 * 见报告 §7 / §9 与 `docs/02-copy-and-qa.md`。
 */
export function autoplayInWeixin(video: HTMLVideoElement) {
  const tryPlay = () => {
    void video.play().catch(() => {});
  };

  tryPlay();

  if (!/MicroMessenger/i.test(navigator.userAgent)) return;

  const bridge = (window as Window & { WeixinJSBridge?: { invoke: (...args: unknown[]) => void } })
    .WeixinJSBridge;

  if (bridge) {
    bridge.invoke('getNetworkType', {}, tryPlay);
  } else {
    document.addEventListener(
      'WeixinJSBridgeReady',
      () => {
        (window as Window & { WeixinJSBridge?: { invoke: (...args: unknown[]) => void } }).WeixinJSBridge?.invoke(
          'getNetworkType',
          {},
          tryPlay,
        );
      },
      { once: true },
    );
  }

  document.addEventListener('touchstart', tryPlay, { once: true, passive: true });
}
