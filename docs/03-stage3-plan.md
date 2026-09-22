# Stage 3 及后续开发计划

依据 `00-phase1-analysis.md`、`02-copy-and-qa.md` 与用户 2026-09-21 确认的保真分层。节点清单见 `01-figma-node-manifest.md`。当前验收清单见 `04-test-plan.md`。

## 已落地（本轮继续）

| 项 | 说明 |
|---|---|
| `HomeVariant` | `men` / `women` / `commercial`，`src/data/floors.ts` |
| `/home/commercial` | 13 层占位高度 + Entrypoint 双 11 卡指向 |
| `/list/:store` | 四店产品墙 **2x PNG 已导**（`public/images/product-wall/` + `assets-src/`） |
| 搜索 placeholder | `StoreId` 词库 + `useRotatingKeyword`（3s 硬切，见 QA 文档） |
| Header | 权威阈值、`已关注` 竖直换位、直播间 icon 切片（mask + `prompt-chevrons.png`，见 `02-copy-and-qa.md` §2） |
| ACG hero 视频 | `public/videos/acg-hero.mp4` + `HeroVideo`；验收 `#/store/acg` |
| 穿搭视频 | `menactived.mp4` / `womenactived.mp4`；`LookbookGridFloor` 展开态播放 |
| Stage 3 骨架 | `PillTabs` / `SectionHeader` / `FloorSlice` / `SportsZoneFloor` / `CategoryRail` / `StoreTabs` / `GoodsPage` |
| 四店合流（代码） | `StoreKey` @ `store.ts`；`/goods/:p1…` 解析；`PRODUCT_WALL_FIGMA_NODE`；`STORE_HOME_FLOOR_GAP`；Jordan `#/store/jordan` 预览 |

**四店分析结论（文档已写入 §2.7.1 / §2.8）**：`CategoryRail` 接口不变；`StoreTabs` 三种形态；产品墙 `store` 选图、`from` 仅埋点；Kids 类目**两层**非三层。Kids 首页 node `4041:25654` 已补齐；Jordan / Kids 首页确认全静态，hero 视频预留已撤销。

本地验证：

- `http://localhost:5273/#/home/commercial`
- `http://localhost:5273/#/list/nike?from=shoes`

## 保真分层（权威）

| 页面 | 策略 |
|---|---|
| Home - Commercial | **全 Tier C** |
| Home - Men / Women | **仅运动专区 + 夏日穿搭 Tier A**；其余楼层 **Tier C + 热区 → `/list/:store`** |
| `/goods` 宝贝支线 | `StoreTabs` + `CategoryRail` Tier A；右侧 Tier C |
| 四店首页（ACG/Jordan/Kids） | 分析已完成；hero 视频 autoplay（素材见 §12） |
| 产品墙 | 每店一张 375×815 位图 |

## Stage 3：通用组件层（建议顺序）

1. **`SectionHeader` / `CtaPill` / `GenderTab`** — Men/Women 楼层切图前可先用于 Sports Zone 外围文案（若仍 Tier A）。
2. **`PillTabs`** — 参数化 `itemWidth` / `step`（72/80/52 三族）；Sports Zone 7 tab + Commercial 3 tab。
3. **`PriceTag` + `ProductCard.originalPrice`** — 仅当某楼层仍走活组件时；Commercial 全 C 时可延后。
4. **`Doorway`** — Commercial P1 第二排双格入口（Men 仅一排）。
5. **`Carousel`** — P1 KV 指示点；**不 autoplay**（实测无自动轮播）；ACG/Jordan/Kids hero 为 **video autoplay**（单独组件）。
6. **`CategoryRail` + `StoreTabs`** — 宝贝页唯一大块 Tier A（`src/data/goods.ts` 配置驱动）。
7. **`ProductWall`** — 接入四张 WebP/AVIF 切图；`store` 选图，`from` 仅埋点。

**明确不做 / 降级**

- `BentoGrid` 抽象（报告结论：三处拓扑无公因子）。
- `SportsZoneCommercial` 活组件（Commercial 首页全 C）。
- 产品墙 DOM 化（设计仅给位图）。

## Stage 4–7（主店 Men/Women，与原计划一致）

| 阶段 | 内容 |
|---|---|
| 4 | Men 楼层切图 + Sports Zone Tier A + 热区链 `/list/nike`（**Tier C 10/11 已落盘**，缺 `sports-navigation`） |
| 5 | Women 楼层（**Tier C 13/13 已落盘**；`WOMEN_FLOOR_FIGMA` 已登记；Tier A `sports-zone` / `lookbook-grid` 仍为活组件） |
| 6 | 夏日穿搭 FLIP + 视频 |
| 7 | 路由 push/back（**已接** `RouteMotion` 300ms · §6.9，含 header/底栏同框 + 下层 0.55 遮罩） |

## Stage 8 支线（可与 4–7 并行）

| 子阶段 | 内容 |
|---|---|
| 8a | Commercial 13 层切图（**12/13 已落盘**，缺 `sports-zone` `2728:67874`） |
| 8b | 宝贝页 9 态 + 根页切图 + `CategoryRail` / `StoreTabs` |
| 8c | ACG / Jordan / Kids 首页 + 宝贝 + 各店产品墙切图；Kids 首页 node 待补 |

## 资产与阻塞项

见 `00-phase1-analysis.md` §12 与 `01-figma-node-manifest.md`「缺口」：

- 产品墙 WebP/AVIF 压缩管线（母版 PNG 已有）；首页楼层 Tier C 批量导图
- 设计师补 header 系统图标（可选深浅两套位图）
- Modal 参考视频（可选）

## 代码约定

- 样式：原生 CSS + PostCSS `px → calc(N * var(--u))`，不用 Tailwind。
- React 18；滚动在 `ScaleViewport` 内部 div，不用 `window`。
- 评论与文档默认中文。
