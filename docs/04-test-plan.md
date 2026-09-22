# Mockup 测试方案

面向当前 `nike-tmall-fs-mockup`（截至 2026-09-21）。保真分层以 `02-copy-and-qa.md` §3 与 `03-stage3-plan.md` 为准。本文件是验收清单，不是新功能规格。

## 1. 范围

| 纳入本轮 | 不纳入本轮（见 §6，不判失败） |
|---|---|
| 口令闸、索引页、Hash 路由、底栏、返回、右滑返回 | Men `sports-navigation` 缺图 |
| Men / Women 已落盘的 Tier C 楼层 | Commercial 13 层切图（Stage 8a，现为占位高度） |
| 产品墙四店位图与返回热区 | 夏日穿搭 FLIP 深化、Sports Zone 接切图（Stage 6） |
| 路由 push/back 整屏位移 + 下层遮罩 | — |
| 搜索词库轮换、ACG hero 视频 | WebP/AVIF 压缩、设计师补系统图标 |
| `npm run typecheck` / `npm run build` | 真机天猫 App 内嵌、直播间下拉 |

预览地址：`npm run dev` 后打开 `http://localhost:5273/#/`（端口以终端为准）。全程用 **Hash**（`#/home/men`），刷新不应 404。

视口：桌面浏览器把窗口拉到手机宽，或用设备模式 **375 宽**。缩放由 `ScaleViewport` 的 `--u` 承担，不要用浏览器缩放代替。

## 2. 通过标准

一轮验收通过，需同时满足：

1. §4 自动化命令退出码为 0。
2. §5 用例全部为「通过」或「已知缺口」。
3. 无控制台未捕获异常；图片 `onError` 只允许出现在 §6 列出的缺图楼层。
4. 可点热区点在设计区域内，不误触底栏或返回条。

记录：在本文件末尾「验收记录」追加一行日期、执行人、结论（通过 / 有缺陷）。缺陷写清路由、操作、期望、实际。

## 3. 环境

| 项 | 要求 |
|---|---|
| Node | 能跑项目 `package.json` 的 Vite 6 |
| 浏览器 | Chrome 或 Safari，桌面 + 一次 iOS Safari（右滑、视频自动播放） |
| 口令 | **dev 不拦**；`build`/`preview` 用 `?k=tmall2026`（或 `VITE_ACCESS_CODE`）解锁，见 `tools/preview-routes.md` |
| 构建 | 验收前在项目目录执行 `npm run test`（typecheck + 资产抽查 + build） |

微信内视频自动播放（`weixinVideoAutoplay.ts`）仅在 UA 含 `MicroMessenger` 时生效，桌面 Chrome 不测这一支。

## 4. 自动化（当前已有）

```bash
cd projects/nike-tmall-fs-mockup
npm run typecheck
npm run build
```

`build` 已包含 `tsc --noEmit`。失败即本轮不通过，先修类型或打包，再跑手工用例。

资产抽查（Women 13 张、Men 除 `sports-navigation` 外 10 张、索引 6 张、产品墙 4 张应存在且为 PNG）：

```bash
cd projects/nike-tmall-fs-mockup && npm run test:assets
# 或：python3 automation/nike-tmall-fs-mockup/test-assets.py（仓库根目录）
```

Commercial 13 张在脚本中**可选**：未齐时打印 `WARN` 但不阻断 Men/Women 基线。Men 的 `sports-navigation.png` **故意不在必检清单**。

暂不引入 Playwright。路由与动效仍以 §5 手工为主；资产与类型用上面两条守住回归。

## 5. 手工用例

每条：操作 → 期望。标「缺口」的项对照 §6，出现占位不算失败。

### 5.1 闸门与索引 `#/`

| ID | 操作 | 期望 |
|---|---|---|
| G1 | 清站点存储后打开 `#/` | 只见「内部设计预览」，页面里没有首页楼层 DOM |
| G2 | 错误口令提交 | 提示「口令不正确」，仍停留闸门 |
| G3 | 正确口令 | 进入六张索引卡：男子、女子、双 11、Jordan、儿童、ACG |
| E1 | 点男子 / 女子 / 双 11 | 分别到 `#/home/men`、`#/home/women`、`#/home/commercial`，整屏从右滑入约 300ms |
| E2 | 点 Jordan / ACG | `#/store/jordan`、`#/store/acg` |
| E3 | 点儿童 | `#/store/kids`，标题为「NIKE 儿童官方旗舰店」 |
| E4 | 索引页 | **无**底栏 |

### 5.2 首页 Men `#/home/men`、Women `#/home/women`

| ID | 操作 | 期望 |
|---|---|---|
| H1 | 首屏 | 天猫头（状态栏 + 店招）在视口内；向下滚，头收起，搜索词约 3s 硬切（主店词：飞马 → 空军一号 → 充2500得2580 → 斜挎包） |
| H2 | 滚过已导图楼层 | 位图铺满楼层高度，无拉伸条、无「Tier C · …」占位文案 |
| H3 | Women 全页 | 13 个 Tier C 楼层均有图（含 `p1-story`、`sports-navigation`、`store-navigation`） |
| H4 | Men `sports-navigation` | **缺口**：允许占位「Tier C · sports-navigation」 |
| H5 | 点任一可点 Tier C 楼层 | 进入 `#/list/nike?from=<floorKey>`，`state.backTo` 回到当前性别首页 |
| H6 | 运动专区、夏日穿搭 | 活组件，不是整张楼层热区；穿搭有视频素材时可展开播放 |
| H7 | 底栏五项 | 首页回 `#/home/men`（带「新风潮」）；宝贝 → `#/goods/men`；运动空间 / 新品 / 会员为 Coming soon 标题页 |
| H8 | 页内返回 | 回到 `#/`，下层有遮罩、当前层向右退出 |

Commercial `#/home/commercial`：楼层**不可点**（无热区进产品墙）。切图未导之前允许占位，只确认能打开、能滚、底栏与返回可用。旧链 `#/campaign/1111` 应替换到 `#/home/commercial`。

### 5.3 产品墙 `#/list/:store`

| ID | 操作 | 期望 |
|---|---|---|
| L1 | 从 Men/Women 楼层进入 | 店为 nike，整页一张产品墙，**无**底栏 |
| L2 | 直接打开 `#/list/acg`、`jordan`、`kids`、`nike` | 四张图互不相同；未知 store 不白屏 |
| L3 | 点左上返回热区（约 x16 y68、44×44 设计 px） | 回到进入前的首页（有 `backTo` 时）；无历史时有明确退路，不停在空白 |
| L4 | 从屏幕左缘向右滑 | 与点返回同效，整屏退出 |

`from` 只用于来源标记，不改变产品墙画面。

### 5.4 宝贝 `#/goods/...`

| ID | 操作 | 期望 |
|---|---|---|
| B1 | `#/goods` | 替换到 `#/goods/men` |
| B2 | 切换店铺 tab、左侧类目 | URL 变为 `/goods/:store/...`，右侧内容区跟随；非法组合被纠正到合法路径 |
| B3 | 类目进入产品墙 | `#/list/<store>?from=goods-…`，返回能回到宝贝页 |
| B4 | 底栏仍在 | 可切回首页 / Coming soon 页 |

右侧若仍是占位或未齐切图，只记缺陷等级，不阻断导航用例。

### 5.5 路由动效与滚动

| ID | 操作 | 期望 |
|---|---|---|
| M1 | 索引 → 首页 → 产品墙，再逐级返回 | 每次 push 整屏（含天猫头与底栏）向左进入；返回向右退出；下层遮罩约 0.55，时长约 300ms，曲线偏慢入慢出 |
| M2 | 动效进行中 | 不出现两套底栏错位、头与内容分离滑动 |
| M3 | 首页滚到中部，进产品墙再返回 | 首页滚动位置恢复，不跳回顶（`useScrollRestore`） |
| M4 | 未知路径 `#/nope` | 回到 `#/` |
| M5 | 浏览器刷新当前 hash | 仍停在该页，不 404 |

### 5.6 预览店

| ID | 操作 | 期望 |
|---|---|---|
| P1 | `#/store/acg` | hero 视频可播（桌面需手势或策略允许自动播放；失败时应有静帧，不撑破布局） |
| P2 | `#/store/jordan` | 预览页可开、可返回索引 |
| P3 | 这两页与儿童页 | 有底栏；返回到索引 |

## 6. 已知缺口（本轮标「已知」，不判失败）

| 项 | 现象 | 何时改为失败 |
|---|---|---|
| Men `sports-navigation` | 占位文案 | 文件 `public/images/floors/men/sports-navigation.png` 落盘且宽 1089 之后 |
| Commercial 楼层 | 占位高度 / 无切图 | Stage 8a 导图完成后，按 Women 同样要求「有图、不可点」 |
| 夏日穿搭 FLIP | 展开/视频未对齐设计 | Stage 6 声明完成后 |
| Kids 首页、Jordan/Kids hero | Coming soon 或无视频 | 素材与节点补齐后单开用例 |
| Header 系统图标 | 手绘近似 | 设计师替换件接入后做视觉对比，不挡功能 |

新发现的白屏、点错店、返回丢失、动效拆层，即使发生在缺口页面上，仍算失败。

## 7. 建议执行顺序

1. `typecheck` + `build` + §4 资产脚本。
2. 闸门 → 索引六卡（§5.1）。
3. Women 全页滚图 + 抽 2 个楼层进产品墙再返回（§5.2 H3、H5、§5.3、§5.5）。
4. Men 同样走一遍，并确认唯一占位是 `sports-navigation`。
5. 宝贝 tab / 类目 / 进墙返回（§5.4）。
6. ACG 视频、Jordan、儿童、未知路由（§5.6、M4）。
7. 有 iPhone 时补一次 Safari：右滑返回、375 宽缩放、ACG 视频。

## 8. 验收记录

| 日期 | 执行人 | 结论 | 备注 |
|---|---|---|---|
| 2026-09-21 | Agent | 自动化通过 | `npm run test` OK；Commercial 12/13；Men 缺 sports-navigation；手工 §5 待用户 |
