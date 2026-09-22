/**
 * Nike Swoosh —— Figma 真矢量。
 *
 * 路径取自 Figma 组件 `Nike Swoosh`（实例 `2685:59202`，原始 SVG 落盘在
 * `src/assets/icons/nike-swoosh.svg`）。原件 viewBox 是 37.125 见方、四周留白，
 * 这里把 viewBox 收到路径自身的包围盒（x4.286 y13.487 w28.198 h9.716），
 * 这样按宽度给尺寸时不会被留白稀释，宽高比固定 2.902。
 *
 * 这是全项目唯一一个能从 Figma 拿到矢量的图标：文件里的矢量组件都是 Nike 自己的
 * 设计系统件，天猫那套平台 UI 在设计稿里本身就是截图位图。
 */
const RATIO = 28.198 / 9.716;

export function NikeSwoosh({ width, color = 'currentColor' }: { width: number; color?: string }) {
  return (
    <svg
      className="swoosh"
      viewBox="4.286 13.487 28.198 9.716"
      style={{
        width: `calc(${width} * var(--u))`,
        height: `calc(${width / RATIO} * var(--u))`,
      }}
      role="img"
      aria-label="Nike"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M32.4844 13.4869L12.1213 22.1246C10.4259 22.8439 8.99972 23.2028 7.85039 23.2028C6.5572 23.2028 5.61516 22.7465 5.03663 21.8354C4.28639 20.6613 4.61433 18.7695 5.90133 16.774C6.66548 15.6077 7.63692 14.5372 8.58361 13.5132C8.36086 13.8752 6.39478 17.1468 8.54494 18.6875C8.97033 18.9969 9.57516 19.1485 10.3192 19.1485C10.9163 19.1485 11.6016 19.051 12.3549 18.8545L32.4844 13.4869Z"
        fill={color}
      />
    </svg>
  );
}
