/**
 * 天猫 chrome 的几何参数与 header 传递函数。
 *
 * 所有数值单位统一为 375 设计 px。
 *
 * 两个彼此独立的来源互相印证，这是这组数值可信的依据：
 *   - Figma 位图 8ee0d321…（375×139 chrome）与 4729f888…（375×123 店铺卡）
 *   - tmallref.mp4，其 592 px 帧宽按 ×375/592 换算到设计空间
 * 换算已核对：店铺卡起始位置视频测得 y139.4、Figma 为 y141；展开态搜索胶囊
 * 两边都是 x42→331（宽 289）。
 *
 * 注意报告 §6.3 把展开态胶囊右边缘记为 469 @592（换算 297 设计 px）。直接测
 * f0 得 521 @592（换算 330），与 Figma 位图一致，故 469 疑为量到了放大镜而非
 * 胶囊本体。收起态 §6.3 记 423、实测 425，一致，予以保留。
 */

/** chrome 高度：展开态与完全收起态。仲裁实测 138.8 / 100.6，两段视频一致。 */
export const EXPANDED_H = 139;
export const COMPACT_H = 100;

/** 搜索胶囊。纵向位置与高度两态不变，只变宽度。 */
export const PILL_Y = 61;
export const PILL_H = 35;
export const PILL_EXPANDED_X = 42;
export const PILL_EXPANDED_W = 289;
export const PILL_COMPACT_X = 96;
export const PILL_COMPACT_W = 174;

/** 胶囊内部（两态相同）：分隔竖条与放大镜，均右对齐。 */
export const PILL_DIVIDER_INSET = 38.5;
export const PILL_ICON_INSET = 20.5;

/** 固定元素，两态完全一致。 */
export const BACK_X = 16;
export const BACK_W = 15;
export const DOTS_X = 339;
export const DOTS_W = 19;

/** 仅收起态出现的元素。 */
export const LOGO_TILE = { x: 42, y: 61, w: 36, h: 35, r: 8 };
export const FOLLOW_PILL = { x: 275, y: 64, w: 54, h: 29, r: 14.5 };

/**
 * 传递函数的阶段分界。数值取自 header 阈值仲裁
 * （`agent-runs/2026-09-21-tmall-mockup/header-arbitration/RESULT.md`），
 * 是同时用 tmallref.mp4 与 tmallref2.mp4、去掉真机滞后后拟合出的唯一权威解。
 *
 * **真机 Header 并不是 scrollTop 的纯函数**：它落后滚动约 140 ms（一阶滞后
 * τ≈149ms，RMSE 0.080；纯函数模型 RMSE 0.204，被排除）。这个滞后把下滑素材
 * 量出的区间系统性拉大、把上滑素材量出的拉小 —— 这就是早先三套数值
 * （旧 §6.3 的 160→350、本文件曾用的 100→360、§6.11 的 0→170）互相矛盾的
 * 唯一根源，它们并非互相推翻，而是同一条曲线的两个方向的投影。
 *
 * 本项目**有意不复刻这 140 ms 滞后**：它几乎可以肯定是真机 JS 滚动监听的
 * 延迟产物而非设计意图，照搬只会让手感发粘。因此 headerState 保持纯函数，
 * 不引入任何时间常数、阻尼、transition 或帧延迟。
 *
 * 副作用需知悉：任何人拿视频帧与本实现逐帧对比，都会看到一个系统性偏差，
 * 那是上述取舍的**预期行为，不是 bug**。
 *
 * 提示行收起区间（0→70）与 morph 起点（50）基本首尾相接，早先 60→100 之间
 * 那段「空档」不存在。
 */
export const PROMPT_COLLAPSE_START = 0;
export const PROMPT_COLLAPSE_END = 70;
export const MORPH_START = 50;
export const MORPH_END = 245;

/**
 * 背景由渐变硬切为纯白，1 帧完成，不插值。
 *
 * **低置信度值，可信区间 120–170。** 全片仅四次硬切：两次「→白」发生在滚动
 * **完全停住之后**（分别停在 393 和 318），那不是阈值而是「停在哪就在哪翻」
 * 的延迟提交；本文件此前的 393 正是误取了其中一帧。只有两次「→渐变」是滚动
 * 中即时发生的，计入 3 帧延迟后交叉区间为 120–170，取中值 140。
 */
export const BG_SWITCH = 140;

/** 店铺信息卡，取自 375×123 的 Figma 位图。 */
export const CARD_Y = 141;
export const CARD_H = 123;

/** 走马灯：§6.6 实测 −12.4 px/s @390，换算到 375 空间为 −11.9 px/s，线性无限循环。 */
export const MARQUEE_PX_PER_SEC = 11.9;

export function clamp01(v: number) {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}

/** 纯粹的「滚动位置 → 状态」映射。无历史、无缓动，反向对称由构造保证。 */
export function headerState(scrollTop: number) {
  const collapse = clamp01(
    (scrollTop - PROMPT_COLLAPSE_START) / (PROMPT_COLLAPSE_END - PROMPT_COLLAPSE_START),
  );
  const morph = clamp01((scrollTop - MORPH_START) / (MORPH_END - MORPH_START));
  return { collapse, morph, dark: scrollTop < BG_SWITCH };
}
