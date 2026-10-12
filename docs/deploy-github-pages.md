# GitHub Pages 发布

将 `nike-tmall-fs-mockup` 通过 GitHub Actions 部署到 **GitHub Pages**。

**当前线上地址（已部署成功）：**

```
https://z4rd.github.io/tmall-fs-mockup/?k=tmall2026#/
```

> ⚠️ **境内不可用。** 这个地址在中国大陆打开时 HTML 与 JS 能加载（页面骨架出得来），
> 但图片资源几乎全部拉不下来，整页灰框；开 VPN 后图片瞬间全出。资源本身在线上完好
> （`images/entry/men.webp?v=...` 返回 200），是 `github.io` 的境内可达性问题，不是代码问题。
> **给境内同事的链接请用 Cloudflare Pages 或离线包，见 `docs/deploy-cloudflare-pages.md`。**

## 前提

| 项 | 说明 |
|----|----|
| **仓库可见性** | 从**私有**个人仓库发布 Pages 需要 **GitHub Pro**；Free 账号只支持**公开**仓库。 |
| **站点 URL 是公开的** | `?k=` 只是前端劝退门禁，**不是**安全边界。勿放未脱敏内容。 |
| **Actions 已开启** | Settings → Actions → General → 允许 workflow 运行。 |
| **Pages 源** | Settings → Pages → Build and deployment → **Source: GitHub Actions**。 |

## 仓库内已配置

- Workflow：**`.github/workflows/deploy-pages.yml`**
- 触发：push 到 `main` 自动构建；也可在 Actions 里 **Run workflow** 手动触发。
- 构建：`npm ci` → `npm run build`（`tsc --noEmit && vite build`）→ 上传 `dist/`。
- 部署单元是 **mockup 自己的 `dist/`**。本项目是独立仓库 `z4rd/tmall-fs-mockup`，
  不是 monorepo 子目录，所以 workflow 里没有 `working-directory`。

## 访问口令

- 默认口令 **`tmall2026`**，来自 `src/auth/accessCode.ts` 的内置兜底值。
- 仓库 Secret `VITE_ACCESS_CODE` 目前也设为 `tmall2026`，与兜底值一致。
- 要换口令：Settings → Secrets and variables → Actions → 改 `VITE_ACCESS_CODE`，
  然后重跑 workflow。
- ⚠️ `accessCode.ts` 里注明：CI 上 secret **未配置时注入的是空字符串而非 `undefined`**，
  代码用 `INJECTED ? INJECTED : 'tmall2026'` 挡住了这种情况。不要改成 `??`。

## 验收

- Actions 里 `deploy` job 输出的 **page_url**。
- 浏览器打开 `page_url + ?k=tmall2026#/`。
- 抽查 `#/home/men`、`#/store/jordan`、`#/goods`：图片、manifest、图标应全部 200。
  （同一份 `dist/` 在根路径和子路径下都已实测无 404，见 `docs/deploy-cloudflare-pages.md`。）

## 与本地 preview 的差异

- 本地：`npm run preview`（端口 5276，已配 `host: true`，同事可从局域网访问）。
- Pages：每次 push 触发重新构建并部署；`public/` 下的大资源会随 `dist` 一起发布，注意体积与合规。

## 相关文档

- `docs/deploy-cloudflare-pages.md` —— **境内访问用这条链路**，含 Cloudflare Pages 配置与离线包说明。
