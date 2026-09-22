/**
 * 所有活文字价格一律使用半角人民币符号 U+00A5。
 *
 * Figma 源稿里 U+00A5 和全角的 U+FFE5 混用。Helvetica Now Text 没有 U+FFE5，
 * 全角符号会回落到 Noto Sans SC，字宽变成整个 em（1000/1000，而 Helvetica 是
 * 640），与旁边的数字对不齐。凡是来自 fixture 数据或 Figma 文案的价格串都要
 * 过一遍这里；这只覆盖 Tier A/B 的活文字，切图里的符号是烘死的。
 */
export const YEN = '\u00A5';

export function normalizeYen(text: string): string {
  return text.replace(/\uFFE5/g, YEN);
}

/** 设计稿中符号与数字之间留空的地方（夏日穿搭）传 ' '，其余传 ''。 */
export function formatPrice(amount: number, gap: '' | ' ' = ''): string {
  return `${YEN}${gap}${Number.isInteger(amount) ? amount : amount.toFixed(2)}`;
}
