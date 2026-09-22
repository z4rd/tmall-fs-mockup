# GitHub Pages 发布（私有仓库）

将 `nike-tmall-fs-mockup` 通过 GitHub Actions 部署到 **GitHub Pages**。站点 URL 一般为：

`https://<GitHub 用户名>.github.io/Cursor-PM-Workspace/?k=<口令>#/`

（口令默认 `tmall2026`，见下文 Secrets。）

## 前提（请自行确认）

| 项 | 说明 |
|----|------|
| **私有仓 + Pages** | 从**私有**个人仓库发布 Pages，通常需要 **GitHub Pro**（或 Team/Enterprise）。Free 账号仅支持 **公开** 仓库的 Pages。 |
| **站点仍公网可访问** | Pages 部署后的 **URL 本身公开**；`?k=` 仅为前端门禁，**不是**安全边界。勿在仓库或 Pages 上放未脱敏密钥。 |
| **Actions 已开启** | 仓库 Settings → Actions → General → 允许 workflow 运行。 |
| **Pages 源** | Settings → Pages → Build and deployment → **Source: GitHub Actions**。 |

## 仓库内已配置

- Workflow：`.github/workflows/deploy-nike-tmall-mockup-pages.yml`
- 触发：`main` 分支变更 `projects/nike-tmall-fs-mockup/**` 时自动构建；也可在 Actions 里 **Run workflow** 手动触发。
- 构建：`npm ci` → `npm run test`（typecheck + test:assets + build）→ 上传 `dist/`。

## 需要你提供 / 在 GitHub 完成的

1. **本机 GitHub CLI（可选）**  
   若希望由我方用 `gh` 查状态、开 PR：在本机执行 `gh auth login`，并告知已登录。

2. **确认发布范围**  
   - 当前方案：只发布 **mockup 的 `dist`**（不是整个 monorepo 根目录）。  
   - 若你希望独立仓库（例如 `nike-tmall-mockup` 单仓 Pages），请说明，需改 workflow 与 `vite` `base`。

3. **访问口令（可选）**  
   - 默认构建口令：`tmall2026`（与本地 preview 一致）。  
   - 若要更换：在仓库 **Settings → Secrets and variables → Actions** 新增  
     `VITE_ACCESS_CODE` = 你的口令（workflow 已传入构建环境）。

4. **推送代码**  
   - 将含 workflow 与 mockup 改动的提交 **push 到 `origin/main`**（你未要求前我不会自动 commit）。  
   - 首次 push 后打开 **Actions** 查看 *Deploy Nike Tmall Mockup (Pages)* 是否绿。

5. **（可选）Pages 可见性**  
   - 若账号支持 **GitHub Enterprise / 受限 Pages**，再说明是要「仅组织内」还是「公开 URL」；标准个人 Pages 一般为公开 URL。

6. **（可选）自定义域名**  
   - 若有域名：在 Pages 设置里填 CNAME，并把 DNS 记录发我或自行配置。

## 验收

- Actions 中 `deploy` job 输出的 **page_url**。  
- 浏览器打开：`page_url + ?k=tmall2026#/`（口令与 Secret 一致）。  
- 抽查：`#/goods`、`#/home/men`、资源与视频是否 200（大陆微信内访问需自行试网速）。

## 与本地 preview 的差异

- 本地：`npm run preview`（端口如 5276）。  
- Pages：每次 push 触发重新 `npm run test` + 部署；大资源在 `public/` 会随 `dist` 一起发布，注意体积与合规。
