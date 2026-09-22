# 手机浏览器上下栏与参考视频

`tmallref.mp4` / `tmallref2.mp4` 画幅为 **592×1280 整屏 H5**，对应 **App / 微信内置 WebView 全屏容器**，不是 iOS Safari 标签页自带底栏地址栏的形态。

## 能否用代码「隐藏」系统状态栏 / 浏览器地址栏？

| 环境 | 系统状态栏 | 浏览器地址栏 / 底栏 |
|------|------------|---------------------|
| **iOS Safari 普通标签** | 不能隐藏（系统绘制） | 不能永久隐藏；滚动时可能暂时收起，刷新会回来 |
| **添加到主屏幕（PWA standalone）** | 可合并为极简状态区 | **无 Safari 地址栏**（本项目已提供 `manifest.webmanifest` + `apple-mobile-web-app-capable`） |
| **微信 / 天猫 App 内 WebView** | 由容器控制，通常接近参考视频 | 通常无独立地址栏 |

结论：**评审要对齐参考视频，请用「主屏幕打开」或微信内打开**；在 Safari 直接访问 IP/域名时，上下系统 UI 属于浏览器行为，H5 无法像原生一样关掉。

## 本项目已做的适配

- `viewport-fit=cover` + `env(safe-area-inset-*)`（`ScaleViewport` 真机模式）
- 真机 `data-framed=false` 时 stage **100% 宽 × 100dvh**，去掉桌面手机框与灰底
- `theme-color` / PWA manifest，便于全屏添加到主屏幕
