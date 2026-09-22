import type { Gender } from './floors';

export type SportsTheme = {
  key: string;
  label: string;
  /** 模块外框主题色（报告 §2.4） */
  accent: string;
};

/** Home - Men tab 顺序，默认篮球 */
export const SPORTS_THEMES_MEN: SportsTheme[] = [
  { key: 'basketball', label: '篮球', accent: '#111111' },
  { key: 'running', label: '跑步', accent: '#ceff00' },
  { key: 'football', label: '足球', accent: '#FF02FB' },
  { key: 'training', label: '训练', accent: '#707072' },
  { key: 'lifestyle', label: '休闲穿搭', accent: '#ee0005' },
  { key: 'acg', label: 'ACG 户外', accent: '#ff6a00' },
  { key: 'tennis', label: '网球', accent: '#111111' },
];

/** Home - Women tab 顺序，默认休闲穿搭 */
export const SPORTS_THEMES_WOMEN: SportsTheme[] = [
  { key: 'lifestyle', label: '休闲穿搭', accent: '#ee0005' },
  { key: 'running', label: '跑步', accent: '#ceff00' },
  { key: 'training', label: '训练', accent: '#707072' },
  { key: 'tennis', label: '网球', accent: '#111111' },
  { key: 'acg', label: 'ACG 户外', accent: '#ff6a00' },
  { key: 'basketball', label: '篮球', accent: '#111111' },
  { key: 'football', label: '足球', accent: '#FF02FB' },
];

export const DEFAULT_SPORTS_TAB: Record<Gender, string> = {
  men: 'basketball',
  women: 'lifestyle',
};

export function sportsThemesFor(gender: Gender): SportsTheme[] {
  return gender === 'men' ? SPORTS_THEMES_MEN : SPORTS_THEMES_WOMEN;
}

/** 当某 theme 为选中 tab 时：选中 pill 与其余 pill 的字色 */
export type SportsTabWhenSelectedLabelColors = {
  selected: string;
  others: string;
};

const WHITE = '#ffffff';
const DARK = '#111111';
const FOOTBALL_SELECTED = '#FF02FB';

/** 各 theme 被选中时的字色规则（男女同 key 同色；Women 仅 tab 顺序不同） */
const SPORTS_TAB_LABEL_COLORS_WHEN_SELECTED_BY_KEY: Record<
  string,
  SportsTabWhenSelectedLabelColors
> = {
  basketball: { selected: WHITE, others: WHITE },
  running: { selected: DARK, others: DARK },
  football: { selected: FOOTBALL_SELECTED, others: WHITE },
  training: { selected: DARK, others: DARK },
  lifestyle: { selected: WHITE, others: WHITE },
  acg: { selected: WHITE, others: WHITE },
  tennis: { selected: WHITE, others: WHITE },
};

/** Home - Men：按「当前选中的 theme key」查字色 */
export const SPORTS_TAB_LABEL_COLORS_WHEN_SELECTED_MEN: Record<
  string,
  SportsTabWhenSelectedLabelColors
> = { ...SPORTS_TAB_LABEL_COLORS_WHEN_SELECTED_BY_KEY };

/** Home - Women：与 Men 同规则 */
export const SPORTS_TAB_LABEL_COLORS_WHEN_SELECTED_WOMEN: Record<
  string,
  SportsTabWhenSelectedLabelColors
> = { ...SPORTS_TAB_LABEL_COLORS_WHEN_SELECTED_BY_KEY };

const SPORTS_TAB_LABEL_COLORS_WHEN_SELECTED_BY_GENDER: Record<
  Gender,
  Record<string, SportsTabWhenSelectedLabelColors>
> = {
  men: SPORTS_TAB_LABEL_COLORS_WHEN_SELECTED_MEN,
  women: SPORTS_TAB_LABEL_COLORS_WHEN_SELECTED_WOMEN,
};

/** 当前选中 tab 对应的 selected / others 字色对；缺 key 时回退全白 */
export function sportsTabLabelColorsWhenSelected(
  gender: Gender,
  selectedKey: string,
): SportsTabWhenSelectedLabelColors {
  const entry = SPORTS_TAB_LABEL_COLORS_WHEN_SELECTED_BY_GENDER[gender][selectedKey];
  if (!entry) return { selected: WHITE, others: WHITE };
  return entry;
}

/** 给定当前选中 tab，解析某一 pill 的字色（选中用 selected，其余用 others） */
export function sportsTabLabelColor(
  gender: Gender,
  selectedKey: string,
  tabKey: string,
): string {
  const { selected, others } = sportsTabLabelColorsWhenSelected(gender, selectedKey);
  return tabKey === selectedKey ? selected : others;
}

/**
 * tab 宽 = **标签渲染宽 + 左右各 18.5 的内边距，下限 72**，高恒 32，相邻间隙 2。
 *
 * 标签渲染宽是浏览器实测值（viewport 420、`--u` = 1.12，读数已除回设计 px）：
 * `.pill-tabs--bubble` 的字号 14 / 字重 500 / `Noto Sans SC`，4 字以上还带
 * `--tight` 的 `letter-spacing: -0.02em`。取 `Range.getBoundingClientRect()`
 * 的**字进宽**（advance），不是墨迹宽 —— 墨迹比字进窄约 2（CJK 字面留白）。
 *
 * 规则与 Figma 新一代 tab 条对账（`4001:19818` men ACG 户外，整帧渲染逐行游程）：
 *   - 2 字（28.56）→ 65.56，被下限夹到 **72** ✓ 实测 72
 *   - ACG 户外（62.89）→ 99.89，取整 **100** ✓ 实测 100（胶囊 x 201..300，左右内边距各 20 墨迹 / 18.55 字进）
 *   - 休闲穿搭（56.01）→ 93.01，取整 **93**（新一代无直接实测，见下）
 * 取整用 `Math.round`：ACG 的 99.89 只有四舍五入才落到实测的 100，`ceil` 会多 1。
 *
 * **「休闲穿搭 = 80」不作为依据**。那个值来自 `4020:9448`（women 休闲穿搭），
 * 该帧是**老一代**布局：逐行游程量到未选中 tab 步进 68（= 52 + 16 间隙）、选中的
 * 休闲穿搭 80。而 `4001:19818` 量到未选中步进 74（= 72 + 2）、选中 100。两张稿的
 * 未选中宽与间隙都不同，不能混用同一条 padding 规则 —— 老一代那 80 反解出的
 * padding 是 12，恰好对应早已删掉的那套硬编码宽度 52 / 80 / 94。
 *
 * ── 每个 tab 恒定宽：**对设计稿的一处有意偏离，别再「纠正」回去** ────────────
 * 设计稿里只有**选中项**按字宽撑开，未选中一律 72（`4004:8015` 里选中的「训练」是 72，
 * 同帧未选中的「ACG 户外」也是 72；`4001:19818` 里未选中的「休闲穿搭」同样是 72）。
 * 之前照这条实现过：宽度数组依赖当前选中项，选中谁谁变宽。
 *
 * 但那样**整条轨道会随选中项重排** —— 选中项一变宽，它右边所有 tab 的 left 全部推移，
 * 最不利的一次位移 28px。动画层面是同步的（left/width 与胶囊同走 300ms linear，
 * 不跳帧），但用户在真实使用里判定「后面几个有明显的位置挤压位移」是缺陷，
 * 明确要求改成恒定布局，并已知这是偏离设计稿。
 *
 * 所以现在**每个 tab 一律按自己标签的字进宽定宽**（padding 仍 18.5、下限仍 72，
 * 七主题得 72 / 93 / 100），与选中状态无关。选中只是胶囊在固定的格子之间滑动，
 * 轨道本身一动不动：任意选中项下七个 tab 的 `offsetLeft` 完全相同、`scrollWidth` 恒定。
 * 代价是未选中的「休闲穿搭 / ACG 户外」比设计稿宽（93 / 100 而非 72），这是那次取舍
 * 换来的东西。
 */
const SPORTS_TAB_MIN_WIDTH = 72;
const SPORTS_TAB_PAD_X = 18.5;
const SPORTS_TAB_GAP = 2;

/** 各标签的实测字进宽（设计 px）。2 字标签都是 28.56，不必逐个列。 */
const SPORTS_TAB_LABEL_WIDTH_CJK2 = 28.56;
const SPORTS_TAB_LABEL_WIDTH: Record<string, number> = {
  lifestyle: 56.01,
  acg: 62.89,
};

/** 单个 tab 宽：字进宽 + 2×18.5，四舍五入，下限 72。**与是否选中无关**（见上文取舍）。 */
export function sportsTabWidthForKey(key: string): number {
  const labelWidth = SPORTS_TAB_LABEL_WIDTH[key] ?? SPORTS_TAB_LABEL_WIDTH_CJK2;
  return Math.max(SPORTS_TAB_MIN_WIDTH, Math.round(labelWidth + 2 * SPORTS_TAB_PAD_X));
}

/** 七个 tab 的宽度数组。不接受选中项入参 —— 布局恒定，换选中项不会改变任何一格。 */
export function sportsTabWidthsFor(gender: Gender): number[] {
  return sportsThemesFor(gender).map((theme) => sportsTabWidthForKey(theme.key));
}

/** 相邻 tab 左缘步进（与 PillTabs `step` 一致） */
export function sportsTabStepsFor(widths: number[]): number[] {
  if (widths.length < 2) return [];
  return widths.slice(0, -1).map((w) => w + SPORTS_TAB_GAP);
}

/**
 * 选中胶囊的玻璃档位，共三档。
 *
 * 设计稿里选中胶囊的 `BG` 用了三个不同的 Liquid Glass 实例，**不是**一套玻璃：
 *   - `white`      「叠白」    Figma `4001:19378`（`Fill + Shadow` = `I4001:19378;10411:17582`）
 *   - `lightWhite` 「叠浅白」  Figma `4020:9323`（`Fill + Shadow` = `I4020:9323;10411:17582`）
 *   - `black`      「叠黑」    Figma `4003:20247`（`Fill + Shadow` = `I4003:20247;10411:18287`）
 *
 * 分档是设计给的主题级规格，不能从字色或面板明度反推 —— 例如跑步（Volt 底，明度 215）
 * 和训练（近白底，明度 246）都走 `white`，而篮球（明度 17）和足球（明度 0）走 `lightWhite`，
 * 二元的「浅底 / 深底」判据必然得出错误结论。
 *
 * 男女两页同 key 同档，仅 tab 顺序与默认选中项不同。
 *
 * **名字说的是叠色，不是观感**，别被误导：`white` 和 `lightWhite` 实际效果都是**提亮**
 * （`lightWhite` 在纯黑底上把 0 提到 36），只有 `black` 是压暗。沿用「叠白 / 叠浅白 / 叠黑」
 * 是为了和设计的沟通口径一致。
 *
 * 档位不完全决定样式：训练在 #1 叠白基础上还多一条描边环，原因见 PillTabs.css。
 */
export type SportsTabPillGlass = 'white' | 'lightWhite' | 'black';

const SPORTS_TAB_PILL_GLASS_BY_KEY: Record<string, SportsTabPillGlass> = {
  running: 'white',
  training: 'white',
  basketball: 'lightWhite',
  football: 'lightWhite',
  tennis: 'lightWhite',
  lifestyle: 'black',
  acg: 'black',
};

/** 当前选中 theme 对应的玻璃档位；缺 key 时回退到覆盖面最广的「叠浅白」 */
export function sportsTabPillGlassFor(selectedKey: string): SportsTabPillGlass {
  return SPORTS_TAB_PILL_GLASS_BY_KEY[selectedKey] ?? 'lightWhite';
}

