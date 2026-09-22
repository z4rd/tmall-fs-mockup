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

/** Figma `4020:9321` / §2.4：2 字 52×32，4 字 80×32，「ACG 户外」94×32；相邻 tab 间距 16 */
export function sportsTabWidthForKey(key: string): number {
  if (key === 'lifestyle') return 80;
  if (key === 'acg') return 94;
  return 52;
}

export function sportsTabWidthsFor(gender: Gender): number[] {
  return sportsThemesFor(gender).map((t) => sportsTabWidthForKey(t.key));
}

const SPORTS_TAB_GAP = 16;

/** 相邻 tab 左缘步进（与 PillTabs `step` 一致） */
export function sportsTabStepsFor(widths: number[]): number[] {
  if (widths.length < 2) return [];
  return widths.slice(0, -1).map((w) => w + SPORTS_TAB_GAP);
}

/**
 * 选中胶囊的玻璃色调，**反相于面板**：浅底面板配暗玻璃，深底面板配亮玻璃。
 *
 * 命名沿用设计师给的切图：`pill-light.png` 指「用于浅底面板」而非胶囊本身偏浅 ——
 * 它实测 151，叠在 215 的浅底上是压暗的；`pill-dark.png` 实测 57，叠在 17 的深底上是提亮的。
 * 判定依据取选中项的字色：#111 只出现在跑步 / 训练这两张浅底稿上。
 *
 * 注意 Figma 侧三个选中 BG 实例（4020:9323 / 4020:9398 / 4001:19378）的 `variantMode`
 * 全是 Light，组件变体上看不出这个区分，所以只能按切图实测值校准。
 */
export type SportsTabPillSkin = 'onLight' | 'onDark';

export function sportsTabPillSkinForSelectedColor(selectedColor: string): SportsTabPillSkin {
  const normalized = selectedColor.trim().toLowerCase();
  return normalized === '#111' || normalized === '#111111' ? 'onLight' : 'onDark';
}

