import { forwardRef, type ImgHTMLAttributes, type ReactNode } from 'react';
import { avifSrcFor } from '../../lib/imageFormat';
import './ResponsiveImage.css';

/**
 * `<source type="image/avif">` 本体。抽出来是给那些没法直接用 `ResponsiveImage` 的地方
 * （比如宝贝页里被 `AnimatePresence` 管着的 `motion.img`）复用同一套 URL 推导。
 */
export function AvifSource({ src }: { src: string }) {
  return <source srcSet={avifSrcFor(src)} type="image/avif" />;
}

/**
 * `<picture>` 外壳：`display: contents`，对布局完全透明，所以内层 `<img>` 原有的
 * 定位 / 尺寸 / object-fit 一律不受影响，接入时不用动任何既有 CSS。
 */
export function PictureShell({ className, children }: { className?: string; children: ReactNode }) {
  return <picture className={`rimg${className ? ` ${className}` : ''}`}>{children}</picture>;
}

type ResponsiveImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  /** WebP 路径（已过 `publicAsset`）。同名 `.avif` 由 `avifSrcFor` 推出，必须确实存在。 */
  src: string;
};

/**
 * 切图统一入口：AVIF 优先、WebP 兜底。
 *
 * 两条硬约束：
 * - 每张走这里的 `.webp` 都必须有同名 `.avif`。`<picture>` 不会因为 `<source>` 404 而回退到
 *   `<img src>`，缺文件的后果是整张图裂掉，所以 `recompress.mjs` 是对 `public/` 下全部
 *   WebP 无差别生成 AVIF 的。
 * - WebP 这一支不能删。AVIF 在 iOS 15 以下、Chrome 85 以下、以及部分国产内核上不可用。
 */
export const ResponsiveImage = forwardRef<HTMLImageElement, ResponsiveImageProps>(
  function ResponsiveImage({ src, fetchPriority, ...imgProps }, ref) {
    const priorityAttrs = fetchPriority
      ? ({ fetchpriority: fetchPriority } as Record<string, string>)
      : undefined;

    return (
      <picture className="rimg">
        <AvifSource src={src} />
        <img ref={ref} src={src} {...imgProps} {...priorityAttrs} />
      </picture>
    );
  },
);
