/**
 * 设计 px → 缩放后的长度，仅供内联样式使用。
 *
 * CSS 文件里的换算由 PostCSS 插件自动完成，但 React 内联样式完全绕过 PostCSS，
 * 在那里写裸数字会被当成未缩放的物理 px。凡是由实测几何驱动的内联长度，都必须
 * 经过这个函数。
 */
export function u(designPx: number): string {
  return `calc(${designPx} * var(--u))`;
}
