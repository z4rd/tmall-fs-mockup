# 资产导出备忘

**全项目 Tier C 位图统一：`download_assets` · PNG · `defaultScale: 3`（代码常量 `FIGMA_RASTER_EXPORT_SCALE`）。**

展示宽度 = 设计 px × `stageWidth/375`。在 375 预览宽 + DPR 3 下，@3 与设计宽对齐。

## 当前落盘实测

| 资产 | 设计尺寸（约） | @3 实测宽 × 高 |
|------|----------------|----------------|
| 索引卡 ×6 | 361 × 243 | **1083 × 729** |
| 产品墙 ×4 | 375 × 815 | **1125 × 2445** |
| Men 楼层 Tier C | 363 × 各层高 | **1089 × …** |
| Women 楼层 Tier C | 同 Men 363 宽 | **1089 × …**（与 Men 同 @3 规则） |

路径（运行时一律 `.webp`，@3 PNG 母版只留在 `assets-src/`）：

- `public/images/entry/<key>.webp`
- `public/images/product-wall/<store>.webp`
- `public/images/floors/<men|women>/<floorKey>.webp`

母版备份：`assets-src/` 同路径镜像，保留 `.png`（含 `@2x` 中间产物）。

节点：索引 `entryFigmaNodes.ts`；产品墙 `PRODUCT_WALL_FIGMA_NODE`；楼层 `floorFigmaNodes.ts`。

### 缺口

| 变体 | floorKey | nodeId | 状态 |
|---|---|---|---|
| men | `sports-navigation` | `2685:59161` | MCP `download_assets` / `curl` 易超时，待本地 Figma 导出 @3 |

**Women Tier C：13/13** 已在 `public/images/floors/women/`（`assets-src/floors/women/` 已镜像）。

**Men Tier C：10/11**（缺 `sports-navigation`）。

**Commercial Tier C：12/13**（缺 `sports-zone` `2728:67874`，MCP 超时）。

未导（Tier A 活组件）：`sports-zone`、`lookbook-grid`。

索引卡描边/阴影在 PNG 内，页面无 CSS `border` / `box-shadow`。

产品墙返回：位图里已烤死天猫原生 ←，页面只铺透明热区 `.pw-back`（勿叠活矢量、勿再用舞台层
`PageBackChrome`，两者都会重影）。几何走 `PRODUCT_WALL_BACK_CHROME`：墨心 (18.7, 78.2) @1x、
热区 48×48。四张图的 ← 位置实测完全一致，无需逐店偏移。
