# 项目报告

## 项目定位

`Vibe Time` 是一个 desktop clock：完全由 `iota-agnt001` 驱动开发，不含人工编写的应用代码。它基于 Tauri + React，目标是提供一个无广告、轻量、可长期运行的桌面时钟，不需要为了看时间再打开一个 Chrome 标签页。

本仓库仍保留 `iota-agnt01/` 作为实际 agent harness 参考子模块；`iota-agnt001` 是当前项目对外描述中的 agent 驱动开发定位。

## 仓库结构

- `app/`：真实应用项目，产品名为 `Vibe Time`。
- `iota-agnt01/`：agent harness 参考子模块，不是当前 app 的执行控制面。
- `app/.agent/`：本项目后续 agent 开发使用的本地控制面。
- `app/scripts/measure-tauri-dev.ps1`：Tauri dev 资源占用采样脚本。
- 根目录 `.gitignore`：排除依赖、构建产物、临时文件、日志和密钥。

## 当前能力

- 主界面已移除 starter UI，直接进入时钟体验。
- 前端已拆分为 `components/`、`domain/`、`hooks/`、`data/` 和 `styles/`。
- `TimeIsWidget.tsx` 只保留兼容导出，不再是巨型文件。
- Rust/Tauri 提供 `sync_utc_time` 授时命令。
- 授时源优先尝试中国科学院国家授时中心 NTP：`ntp.ntsc.ac.cn:123`。
- 前端支持本地时间回退、最近同步时间、手动重新同步。
- 支持城市选择、显示秒、12/24 小时制，并用 `localStorage` 保存偏好。
- 已加入 Vitest 覆盖时间格式、太阳计算和同步状态。

## 当前注意事项

- 12 小时制下，上午/下午与数字时间已拆分为不同元素，避免巨大字号挤压。
- Tauri dev 资源测量脚本默认只统计 `Vibe Time` / `vibe-time` / `app` 主进程及其子进程树。
- 如果 WebView2 不挂在主进程树下，可使用 `-IncludeAllWebView2` 做保守估算。
- `iota-agnt01` 是实际目录名和 submodule 名，暂不重命名。

## 验收原则

- 主界面不显示 Vite/Tauri/React starter UI。
- 网络授时成功时显示授时源与精度。
- 网络授时失败时继续显示本地时间，并明确提示本地回退。
- 城市切换、日期、太阳信息在 Sydney/Beijing/Tokyo 等城市下可用。
- `bun run typecheck`、`bun run test`、`bun run build` 通过。
- Rust/Tauri 相关改动通过 `cargo check`。
- 资源占用应接近：主进程空闲 CPU < 1%，主进程 WorkingSet 约几十 MB；完整占用需包含 WebView2。

## 不做事项

- 不做官方 Time.is 的像素级复制。
- 不使用 Time.is 品牌、商标或官方关联表述。
- MVP 阶段不做账号、云同步、广告、付费服务或自动发布。
- 不引入大型状态管理、后端服务或复杂 UI 框架。

## 提交策略

本项目采用小步提交。每个 batch 完成后先检查 `git status`、相关 build/test，再提交。提交是复查 checkpoint，不代表人工验收通过。
