# Vibe Time

[中文](README.md) | [English](README.en.md)

`Vibe Time` 是一个 desktop clock：完全由 `iota-agnt001` 驱动开发，不含人工编写的应用代码。

它基于 Tauri + React，目标是提供一个无广告、轻量、可长期运行的桌面时钟。它保留精确时间、城市时间、日期、太阳升落、授时状态等核心能力，让日常看时间不需要再打开一个 Chrome 标签页。

本仓库同时也是 agent 驱动开发工作流的试验项目。`iota-agnt01/` 是实际引入的 agent harness 参考子模块，`app/.agent/` 是当前应用自己的本地控制面。

按当前对话记录核对，本项目最长单次 agent 运行时间是 30 分 18 秒，已完成从 starter 到可用 MVP 的主要交付。这说明 `iota-agnt001` 的 task/batch/checkpoint 工作流在小型 Tauri + React 项目上是有效且合理的：任务完成后自然停止，不需要为了跑满无人值守上限而扩大 scope。

## 当前能力

- 主界面直接进入时钟体验，不再显示 Vite/Tauri/React starter UI。
- 前端已拆分为 `components/`、`domain/`、`hooks/`、`data/` 和 `styles/`。
- `TimeIsWidget.tsx` 只保留兼容导出。
- Rust/Tauri 提供 `sync_utc_time` 授时命令。
- 授时源优先尝试中国科学院国家授时中心 NTP：`ntp.ntsc.ac.cn:123`。
- 支持本地时间回退、最近同步时间和手动重新同步。
- 支持城市选择、显示秒、12/24 小时制，并用 `localStorage` 保存偏好。
- 12 小时制下，上午/下午与数字时间分开排版，避免巨大字号挤压。
- 提供 Tauri dev 资源占用采样脚本。

## 仓库结构

```text
.
  app/                 # Vibe Time 应用
  app/.agent/          # 应用本地 agent 控制面
  app/scripts/         # 本地开发与测量脚本
  iota-agnt01/         # agent harness 参考子模块
  REPORT.md            # 中文项目报告
  README.md            # 中文入口
  README.en.md         # 英文入口
```

## 技术栈

- React 19
- TypeScript
- Vite
- Tauri 2
- Rust
- Bun
- Vitest

## 开发命令

进入 `app/`：

```bash
cd app
bun install
```

常用命令：

```bash
bun run dev
bun run tauri dev
bun run typecheck
bun run test
bun run build
```

## 资源占用测量

先启动 Tauri dev：

```bash
cd app
bun run tauri dev
```

另开一个终端采样：

```bash
cd app
bun run measure:dev -- -Seconds 60 -IntervalSeconds 1
```

输出位于：

```text
app/perf-reports/
```

默认只统计 `Vibe Time` / `vibe-time` / `app` 主进程及其子进程树。如果 WebView2 没挂在主进程树下，可以使用：

```bash
bun run measure:dev -- -Seconds 60 -IntervalSeconds 1 -IncludeAllWebView2
```

## Agent 工作流

后续让 agent 修改本项目时，先读：

1. `app/AGENTS.md`
2. `app/.agent/STATE.md`
3. 当前 active batch 文件，如果存在

新工作应先拆成小任务放入 `app/.agent/tasks/ready/`，再由 batch 组织执行。业务代码修改必须受 active task scope 约束。

## 无人值守运行

当前推荐按 batch 短跑：每次 45-90 分钟，完成一个可验证 checkpoint 后停止、检查并提交。最大无人值守运行时间上限为 8 小时，但只适用于任务链已经完整拆分、检查命令明确、允许提交 checkpoint、且不需要 push、密钥、依赖安装或破坏性 git 操作的情况。

按当前对话记录核对，本项目最长单次 agent 运行时间是 30 分 18 秒。没有跑满 8 小时是预期行为：任务简单、active batch 完成后就应该停止，而不是为了耗满时间继续扩大 scope。

实际使用通常只需要三类 prompt：

1. 拆任务：把目标拆成 `.agent/tasks/ready/` 和 `.agent/batches/ready/`。
2. 跑 batch：读取 active batch，按 scope 执行、检查、提交 checkpoint。
3. 复查交接：生成 review/handoff，说明完成项、风险和下一批任务。

示例见：

```text
app/.agent/prompts/unattended-three-prompt-flow.md
```

## 许可证

MIT。
