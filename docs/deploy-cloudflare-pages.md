# Cloudflare Pages 发布（境内可访问的主链路）

## 为什么要做这件事

GitHub Pages（`https://z4rd.github.io/tmall-fs-mockup/?k=tmall2026#/`）已经部署成功，
但**在中国大陆不可用**：`index.html` 和 JS 能加载出页面骨架，156 张图片资源几乎全部
拉不下来，页面一片灰框；开 VPN 后图片瞬间全出。资源本身在线上是完好的
（`images/entry/men.webp?v=...` 返回 200），所以这不是代码问题，是 `github.io` 在
境内的可达性问题。

Cloudflare Pages 的 `*.pages.dev` 在境内的可达性明显好于 `github.io`，但**不是保证**
（见文末「诚实的预期」）。

---

## 两种接入方式：选哪个

| 方式 | 优点 | 缺点 | 建议 |
|----|----|----|----|
| **A. Git 集成**（控制台连 GitHub 仓） | 一次配置，之后每次 push 自动构建；Cloudflare 侧有构建日志、预览分支 | 需要在浏览器里授权 Cloudflare 访问 GitHub（只有你本人能做） | **推荐先走这条**，一次性成本最低 |
| **B. Wrangler 直传** | 不依赖 GitHub 授权，本机 `dist` 直接上传，最快看到结果 | 需要 API Token；每次发布要手动跑命令 | 想**马上**拿到链接验证境内可达性时走这条 |
| **C. GitHub Actions + Wrangler** | 一次 push 两边（GitHub Pages + Cloudflare Pages）都更新 | 需要在 GitHub 配两个 secret | 仓库里已备好 workflow，配好 secret 即生效 |

A 和 C 会互相打架（同一个项目既被 Git 集成构建、又被 Actions 直传，部署记录会混乱）。
**二选一**：要么 A，要么 C。B 可以随时单独用来临时发一版。

---

## 方式 A：Cloudflare 控制台 Git 集成（推荐）

1. 打开 <https://dash.cloudflare.com> → 左侧 **Workers & Pages** → **Create** → **Pages** → **Connect to Git**。
2. 授权 GitHub，选择仓库 **`z4rd/tmall-fs-mockup`**，分支 **`main`**。
3. 构建配置按下表填（**逐项照抄**）：

   | 字段 | 值 |
   |----|----|
   | Project name | `tmall-fs-mockup` |
   | Production branch | `main` |
   | Framework preset | `None`（不要选 Vite 预设，它会改构建命令） |
   | Build command | `npm run build` |
   | Build output directory | `dist` |
   | Root directory | 留空（仓库根就是项目根） |

4. **Environment variables**（Production）：

   | 变量 | 值 |
   |----|----|
   | `NODE_VERSION` | `20` |

   **不要**配 `VITE_ACCESS_CODE`。理由：`src/auth/accessCode.ts` 里写得很清楚，
   CI 上「配置了但注入空串」比「完全不配」更危险；不配时 `import.meta.env.VITE_ACCESS_CODE`
   是 `undefined`，代码会稳稳回落到内置默认口令 `tmall2026`，与 GitHub Pages 侧当前
   生效的口令完全一致。少配一个变量 = 少一个出错点。

5. **Save and Deploy**。首次构建约 1–3 分钟。
6. 拿到 `https://tmall-fs-mockup.pages.dev`，访问时带口令：

   ```
   https://tmall-fs-mockup.pages.dev/?k=tmall2026#/
   ```

> 如果走了方式 A，**请把 `.github/workflows/deploy-cloudflare-pages.yml` 删掉或不配 secret**
> （不配 secret 时它会自动跳过，不会红），避免两条链路同时往一个项目里发。

---

## 方式 B：本机 Wrangler 直传（最快）

本机当前**没有**任何 Cloudflare 凭证（`~/.wrangler` 不存在、环境变量里没有
`CLOUDFLARE_*`），所以下面的命令需要你自己跑一次登录。

```bash
cd /Users/JWa401/Documents/GitHub/Cursor-PM-Workspace/projects/nike-tmall-fs-mockup

# 1) 构建（已验证可过）
npm run build

# 2) 登录：浏览器 OAuth，一次即可，凭证存在 ~/Library/Preferences/.wrangler
npx wrangler login

# 3) 首次直传，会提示创建项目：项目名填 tmall-fs-mockup，生产分支填 main
npx wrangler pages deploy dist --project-name=tmall-fs-mockup --branch=main
```

不想走浏览器 OAuth 的话，用 API Token：

```bash
# 控制台 → My Profile → API Tokens → Create Token
#   模板 "Edit Cloudflare Workers"，或自定义权限 Account › Cloudflare Pages › Edit
export CLOUDFLARE_API_TOKEN=<你的 token>
export CLOUDFLARE_ACCOUNT_ID=<控制台右侧栏的 Account ID>
npx wrangler pages deploy dist --project-name=tmall-fs-mockup --branch=main
```

---

## 方式 C：GitHub Actions 一次 push 发两边

仓库里已新增 `.github/workflows/deploy-cloudflare-pages.yml`，
**没有改动现有的 `deploy-pages.yml`**。它在缺凭证时会自动跳过，所以现在 push 也不会变红。

要让它真正生效：

1. GitHub → 仓库 `z4rd/tmall-fs-mockup` → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**。
2. 新增两个：

   | Secret 名 | 从哪儿拿 |
   |----|----|
   | `CLOUDFLARE_API_TOKEN` | Cloudflare → My Profile → API Tokens → Create Token → 模板 **Edit Cloudflare Workers** |
   | `CLOUDFLARE_ACCOUNT_ID` | Cloudflare 控制台 → Workers & Pages 页面右侧栏 **Account ID** |

3. 先在 Cloudflare 侧建好名为 `tmall-fs-mockup` 的 Pages 项目
   （用方式 B 直传一次即可自动创建），否则 Actions 里的 `pages deploy` 会因项目不存在而失败。
4. push 到 `main`，或在 Actions 页面手动 **Run workflow**。

---

## 路径兼容：同一份 `dist/` 两边都能跑（已实测）

这是这次部署唯一的技术风险点，已经用 Playwright + 真实静态服务跑过，不是推断：

- `vite.config.ts` 用 `base: './'`（相对路径），路由是 **hash 模式**，
  资源统一走 `src/lib/publicAsset.ts`（拼 `import.meta.env.BASE_URL` + `?v=` 缓存键）。
- 用**同一份** `dist/`，分别在根路径（`http://127.0.0.1:8899/`，模拟 `*.pages.dev`）
  和子路径（`http://127.0.0.1:8898/tmall-fs-mockup/`，模拟 GitHub Pages）起静态服务，
  跑首页 `#/`、店铺首页 `#/home/men`、`#/store/jordan`、宝贝页 `#/goods`，
  滚动触发全部懒加载后统计：

  | 环境 | 图片元素 | 坏图 | 4xx/5xx | 失败请求 | manifest / icons |
  |----|----|----|----|----|----|
  | 根路径 | 83 | 0 | 0 | 0 | 全 200 |
  | 子路径 | 83 | 0 | 0 | 0 | 全 200 |

  **结论：同一份 `dist/` 在根路径和子路径下都完全可用，不需要为 Cloudflare 单独改 base。**

- **不需要** `_redirects`：hash 路由下浏览器只会向服务器请求 `/`，
  所有路由变化都在 `#` 之后，不会产生 SPA 深链 404。

---

## 诚实的预期：`*.pages.dev` 在境内到底行不行

**大概率比 GitHub Pages 好很多，但不敢打包票。**

- 支持它的理由：Cloudflare 在境内有大量 anycast 落点，`pages.dev` 的 TLS 握手与
  静态资源分发通常能通；`github.io` 的资源域在境内被干扰得更严重，这正是当前
  「HTML 能出、图片全灰」的典型特征。
- 不支持它的理由：`*.pages.dev` 属于免费共享域，**历史上被间歇性污染/限速过**，
  不同运营商（移动 / 联通 / 电信）、不同城市表现可能完全不一样。它**没有 ICP 备案**，
  不受任何 SLA 保护。同事在公司网络、4G、家宽下的结果可能各不相同。

**验证方法：部署完先自己关掉 VPN 打开一次，再让 2–3 个不同运营商的同事各试一次，
再决定要不要发群。** 不要部署完直接群发。

### 如果仍然不稳，备选按推荐顺序

1. **离线 zip**（本次已产出，见下节）。最稳，零网络依赖，代价是同事要起一个本地服务。
2. **绑自有域名 + Cloudflare**。用自己的域名 CNAME 到 Pages，规避 `*.pages.dev`
   这个共享域被整体处理的风险。**不备案的话境内 HTTP/HTTPS 依然有被阻断的可能**，
   只是概率比共享免费域低。
3. **局域网 preview**。评审都在同一栋楼时最省事：
   `npm run preview` 已配 `host: true`，同事直接开 `http://<你的内网 IP>:5276/?k=tmall2026#/`。
   真机「添加到主屏幕」的 standalone 全屏验收本来也只能这么做。
4. **国内对象存储 + 备案**（阿里云 OSS / 腾讯云 COS + CDN）。唯一真正「保证能看」的方案，
   但要域名备案，周期以周计，且要走公司合规，不适合临时评审。

---

---

## 离线包（兜底，最稳的一条路）

`vite.config.ts` 用 `base: './'` 本来就是为离线交付留的。本次已打好：

```
deliverables/nike-tmall-fs-mockup/tmall-fs-mockup-offline-20260922.zip   （38 MB）
```

解压后是 `tmall-fs-mockup-20260922/`，内含完整 `dist/` 加三个给同事用的文件：
`怎么看.txt`、`启动本地服务.command`（macOS 双击）、`启动本地服务.bat`（Windows 双击）。

### 实测结论：`file://` 直接双击打不开，必须起本地服务

已经真实解压到临时目录、用 Playwright + 系统 Chrome 走 `file://` 跑过，**不通**：

```
Access to script at 'file:///.../assets/index-*.js' from origin 'null'
has been blocked by CORS policy: Cross origin requests are only supported
for protocol schemes: chrome, chrome-extension, chrome-untrusted, data, http, https
```

Vite 产出的是 `<script type="module">`，而 ES module 在 `file://` 下受 CORS
约束（origin 为 `null`），JS 和 CSS 双双被拦，结果是白屏 —— 连图片的机会都没有。
这跟 `base: './'` 无关，改不动，是浏览器安全策略。

所以 zip 里放了 `怎么看.txt` 和一键脚本。同一份解压产物用
`python3 -m http.server 8123` 起在根路径后复测：**4 个页面、83 张图、
manifest 与 icons 全部 200，零 404、零坏图**。

同事的操作就三步：解压 → 双击 `启动本地服务.command`（Win 用 `.bat`）→
浏览器自动开 `http://127.0.0.1:8123/?k=tmall2026#/`。

---

## 相关文件

- `.github/workflows/deploy-cloudflare-pages.yml` —— 方式 C 的 workflow（本次新增）
- `.github/workflows/deploy-pages.yml` —— GitHub Pages，**未改动**
- `docs/deploy-github-pages.md` —— GitHub Pages 侧说明
- `deliverables/nike-tmall-fs-mockup/tmall-fs-mockup-offline-20260922.zip` —— 离线包（工作区根下的 `deliverables/`）
