# 运动专区 · 面板切图（Tier C）

活 **tab 条** 由 `SportsZoneFloor` + `PillTabs`（bubble）渲染，**不要**画进面板。

## 交付数量

| 性别 | 目录 | 张数 |
|------|------|------|
| Men | `men/` | 7 |
| Women | `women/` | 7 |

## 文件名（与 `src/data/sportsThemes.ts` 的 `key` 一致）

**Men**（默认篮球）：`basketball` · `running` · `football` · `training` · `lifestyle` · `acg` · `tennis`

**Women**（默认休闲穿搭）：`lifestyle` · `running` · `training` · `tennis` · `acg` · `basketball` · `football`

扩展名：**`.png`**，覆盖本目录下同名文件即可，**无需改代码路径**。

## 导出内容（Figma）

在对应主题稿上：

1. **隐藏** `Tab - Sports`（347×40）及仅服务于 tab 的底板。
2. **保留**：品牌锁标、KV 4:3、深色商品面板、页脚 CTA 等 §2.4 右侧内容。
3. 画板宽度与现网一致：**375 @1x**（或 **750 @2x**），高度随内容，不必再凑 970 全帧。

## 对齐

- 面板顶边应与稿面 **KV 上沿（约 y108 @1x 模块内）** 对齐，或从 **品牌锁标顶（y12）** 起导出整段「锁标 + KV + 面板」——二选一，但**不要**再包含 y68–100 的 tab 带。
- 放入后若整体上下差 1–2px，在验收里注明，开发侧只调 `SportsZoneFloor` 偏移，不重导全店。

## 验收

- `#/home/men`、`#/home/women` 运动专区：切换 7 tab 无 **双 tab 叠影**；横滑 300ms linear 正常。

## 落盘状态（2026-09-22）

| 状态 | 说明 |
|------|------|
| **14/14 已入库** | `men/` 与 `women/` 各 7 张，含 **training**（本地手动导出覆盖） |

男款 **training** 约 549KB；女款约 512KB。尺寸与其它面板切图一致即可。
