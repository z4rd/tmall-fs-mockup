/**
 * 位图格式协商：切图同时落 `.webp` 与同名 `.avif`（见
 * `automation/nike-tmall-fs-mockup/image-tools/recompress.mjs`），AVIF 同画质比 WebP 再小
 * 六七成，是国内扫码加载慢的主要抓手。
 *
 * 页面上的选择交给 `<picture>` + `<source type="image/avif">`，浏览器原生降级、零 JS 成本。
 * 这里这套运行时探测只服务于 `preloadAssets.ts` 里的 `new Image()` 预取 —— 预取拿不到
 * `<picture>` 的协商结果，如果它固定去拉 WebP，就会和页面真正渲染的 AVIF 各下一份，
 * 本来想省的字节反而翻倍。
 */

/** 2×2 白色 AVIF（seq_profile 1 / 4:4:4），与线上切图同 profile，避免只支持 4:2:0 的解码器误判。 */
const AVIF_PROBE =
  'data:image/avif;base64,AAAAHGZ0eXBhdmlmAAAAAG1pZjFhdmlmbWlhZgAAANZtZXRhAAAAAAAAACFoZGxyAAAAAAAAAABwaWN0AAAAAAAAAAAAAAAAAAAAACJpbG9jAAAAAERAAAEAAQAAAAAA+gABAAAAAAAAAB8AAAAjaWluZgAAAAAAAQAAABVpbmZlAgAAAAABAABhdjAxAAAAAA5waXRtAAAAAAABAAAAVmlwcnAAAAA4aXBjbwAAAAxhdjFDgSACAAAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAABZpcG1hAAAAAAAAAAEAAQOBAgMAAAAnbWRhdBIACgc4ADaQENBpMhIdgmLE7jjjgWVgAJA1jjx9IcA=';

/** 把 `xxx.webp?v=key` 换成 `xxx.avif?v=key`；非 WebP 路径原样返回。 */
export function avifSrcFor(webpSrc: string): string {
  return webpSrc.replace(/\.webp(?=$|[?#])/, '.avif');
}

let avifSupport: Promise<boolean> | null = null;

function detectAvif(): Promise<boolean> {
  if (typeof Image === 'undefined') return Promise.resolve(false);
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img.naturalWidth > 0);
    img.onerror = () => resolve(false);
    img.src = AVIF_PROBE;
  });
}

/** 探测只跑一次，结果全局复用。 */
export function supportsAvif(): Promise<boolean> {
  avifSupport ??= detectAvif();
  return avifSupport;
}

/** 预取用：解析出这台设备实际会下载的那个 URL。 */
export async function resolvePreferredSrc(webpSrc: string): Promise<string> {
  if (!/\.webp(?=$|[?#])/.test(webpSrc)) return webpSrc;
  return (await supportsAvif()) ? avifSrcFor(webpSrc) : webpSrc;
}

// 模块加载即开跑，等到真正预取时基本已经有结果了。
void supportsAvif();
