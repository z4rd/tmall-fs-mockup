/**
 * 把设计空间的 px 值改写成 `calc(N * var(--u))`。
 *
 * 本项目所有 CSS 都直接用从 375 宽 Figma 画板上读到的原始像素值书写。运行时
 * `--u` 被设为 (stageWidth / 375)，于是整页等比缩放，导出的切图也不会变形。
 *
 * 需要某条声明不被改写时，在它前面加一行 `/* no-scale *\/` 注释。
 */
const PX = /(-?\d*\.?\d+)px/g;

module.exports = (opts = {}) => {
  const unit = opts.unitVar || '--u';
  const skipProps = new Set(opts.skipProps || []);

  return {
    postcssPlugin: 'postcss-px-to-u',
    Declaration(decl) {
      if (!decl.value.includes('px')) return;
      if (skipProps.has(decl.prop)) return;

      // @font-face 的 src URL 与字体度量必须原样保留，不能改写。
      let parent = decl.parent;
      while (parent) {
        if (parent.type === 'atrule' && parent.name === 'font-face') return;
        parent = parent.parent;
      }

      const prev = decl.prev();
      if (prev && prev.type === 'comment' && prev.text.trim() === 'no-scale') return;

      decl.value = decl.value.replace(PX, (_m, n) => `calc(${n} * var(${unit}))`);
    },
  };
};
