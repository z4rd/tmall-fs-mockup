/**
 * ⚠️ 待设计师替换的手绘近似图标 —— 全项目仅此一处，替换时按本文件清点即可。
 *
 * 这六个图形都属于天猫平台 UI 或 iOS 系统 UI，在 Figma 源文件里**没有矢量可导**：
 * header、状态栏、店铺卡、底部导航这几块在设计稿里都是拍平的 iPhone 截图
 * （`8ee0d321…` / `4729f888…`），文件内的矢量组件全是 Nike 自己的设计系统件。
 *
 * 店铺卡里那批固定色图形（天猫徽标、五角星、盾形认证标、花枝等）已经改用从
 * 3.216x 原始截图切出的高清位图，见 `src/assets/icons/`。**下面这六个不能那样处理**，
 * 因为 chrome 收起时底色由深转浅，它们必须同步从白翻成深色 —— 靠继承
 * `currentColor` 实现。换成单套位图切片会在白底上留下白图标，直接破坏已验收的
 * 收缩动效。
 *
 * 【交付给设计师的约束】若补**矢量**，一套即可（用 `fill="currentColor"` /
 * `stroke="currentColor"`，不要写死颜色）；若补**位图**，必须给**深浅两套**，
 * 届时需把这里改成按 `data-chrome-dark` 交叉淡出。
 *
 * 所有 viewBox 的尺寸即设计 px 下的目标尺寸，实际渲染尺寸由调用处的 class 决定。
 */

/** 状态栏：定位箭头。 */
export function LocateArrowIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 12 12" aria-hidden="true">
      <path d="M11.5.5 1 5.1l4.2 1.7L6.9 11z" fill="currentColor" />
    </svg>
  );
}

/** 状态栏：信号格。 */
export function SignalBarsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 18 11" aria-hidden="true">
      <rect x="0" y="7.5" width="3" height="3.5" rx="0.8" fill="currentColor" />
      <rect x="5" y="5" width="3" height="6" rx="0.8" fill="currentColor" />
      <rect x="10" y="2.5" width="3" height="8.5" rx="0.8" fill="currentColor" />
      <rect x="15" y="0" width="3" height="11" rx="0.8" fill="currentColor" />
    </svg>
  );
}

/** 状态栏：电量。 */
export function BatteryIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 27 13" aria-hidden="true">
      <rect
        x="0.6"
        y="0.6"
        width="23"
        height="11.8"
        rx="3.6"
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.45"
        strokeWidth="1.1"
      />
      <rect x="2.2" y="2.2" width="14" height="8.6" rx="2.2" fill="currentColor" />
      <path d="M25.2 4.4c1 .5 1 3.7 0 4.2z" fill="currentColor" fillOpacity="0.45" />
    </svg>
  );
}

/** header：返回箭头。几何由 `.cs-back` / `.gcs-back` 的 padding + margin 锚定，勿 flex 居中。 */
export function BackChevronIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 15 14" aria-hidden="true">
      <path
        d="M6.6 1 1 7l5.6 6M1 7h13.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** header：搜索胶囊右端的放大镜。 */
export function SearchGlassIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 18 18" aria-hidden="true">
      <circle cx="7.6" cy="7.6" r="6.1" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="m12.3 12.3 4.2 4.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

/**
 * header：宝贝页搜索框左端的四芒星（「AI 推荐词」标记）。
 *
 * 母版是**描边**而非实心（@3x 放大可见中心镂空，笔画约 1.3 设计 px），四个尖角之间
 * 是向内凹的弧。切图源见四张 `*-category-top.png` 的 x56.67..68.67 / y68.33..80.33，
 * 实测 12×12。只在宝贝页出现，首页 chrome 没有这一枚。
 */
export function SparkleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 12 12" aria-hidden="true">
      <path
        d="M6 .6Q7 5 11.4 6Q7 7 6 11.4Q5 7 .6 6Q5 5 6 .6Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** header：右上角的「⋯」。 */
export function DotsMenuIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 19 4" aria-hidden="true">
      <circle cx="2" cy="2" r="1.9" fill="currentColor" />
      <circle cx="9.5" cy="2" r="1.9" fill="currentColor" />
      <circle cx="17" cy="2" r="1.9" fill="currentColor" />
    </svg>
  );
}

/*
 * 提示行的双 V 形曾经也在这里，现已换成 3.216x 原稿切片
 * （`src/assets/icons/prompt-chevrons.png`，在 `.cs-prompt-icon` 里以 mask +
 * currentColor 渲染）。手绘版做不出原稿「上 V 半透明、下 V 全白、两者交叠」的
 * 层次，故不再保留。
 */
