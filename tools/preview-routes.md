# 预览路由清单（Hash）

构建预览需口令时，在 **hash 前** 加 `?k=tmall2026`（见 `src/auth/accessCode.ts`）。

## 索引与主店

- `#/` — 六卡入口
- `#/home/men` `#/home/women` `#/home/commercial`
- `#/campaign/1111` → commercial 重定向

## 产品墙

- `#/list/nike` `#/list/acg` `#/list/jordan` `#/list/kids`

## 宝贝（示例）

- `#/goods` — browse 瀑布流（原生 tab「宝贝」）；顶栏热区点「分类」进分类态
- `#/goods/men/new` — 分类态（左 nav + 选购男子/女子 tab）
- `#/goods/women/shoes`
- `#/goods/commercial/flash30`（commercial 左 nav 含 `off70`）
- `#/goods/acg/highlight`
- `#/goods/jordan/men`
- `#/goods/kids/big/weekly`

## 分店预览

- `#/store/acg` `#/store/jordan` `#/store/kids`

## 底栏占位

- `#/sports` `#/new` `#/member`
