# 项目报告

## 初始状态

这个仓库是一个小型 Tauri + React 应用，加上 `iota-agnt01` agent harness 参考子模块。

- `app/` 是真实应用项目。
- `iota-agnt01/` 是 agent harness 参考子模块，不是当前 app 的执行控制面。
- `app/.agent/` 是本项目后续 agent 开发使用的本地控制面。
- 根目录 `.gitignore` 用来排除依赖、构建产物、临时文件、日志和密钥。

当前已有一次初始化提交：`chore(repo): initial project scaffold`。

## 产品方向

目标是做一个 Time.is-inspired 的无广告时钟应用。它应当保留精确时间、城市时间、日期、太阳升落等核心价值，同时避免广告和无关信息；开发时可以作为 Web app 运行，日常使用时可以通过 Tauri 作为桌面 app 运行，不需要额外开一个 Chrome 标签页。

这个项目也是 agent 工作流试验项目。它足够小，适合拆成清晰任务；又有前端、Rust/Tauri、时间正确性、桌面体验和测试，能检验 agent 是否能长期保持工程质量。

## 当前问题

- `app/src/TimeIsWidget.tsx` 有 684 行，把城市数据、时间同步、日期格式化、太阳计算、样式和 UI 都塞在一个文件里，维护成本过高。
- `app/src/App.tsx` 仍保留 Vite/Tauri/React starter UI 和 greet 示例。
- 时间同步逻辑在前端 fetch 中，桌面 app 场景下不够稳定，也不利于复用 Rust 能力。
- 太阳时间计算缺少极端情况保护，`hourAngle` 可能产生不可用结果。
- 日期格式化需要修复午夜 `24:xx:xx` 风险。
- 没有单元测试，重构时间逻辑风险较高。
- Tauri 产品名、窗口标题和窗口尺寸仍是 starter 配置。

## MVP 路线

| MVP | 目标 | 完成标准 | 预计 |
| --- | --- | --- | --- |
| MVP 0 | 项目可交接 | 中文报告、任务队列、后续 batch 清晰 | 1-1.5h |
| MVP 1 | 可维护前端 | 拆分巨型组件，移除 starter UI | 3-4h |
| MVP 2 | 正确时间核心 | Rust/Tauri 授时，前端展示和回退 | 3-5h |
| MVP 3 | 桌面产品化 | Tauri 名称、窗口、响应式和可访问性 | 1.5-2h |
| MVP 4 | 测试稳定性 | Vitest 覆盖时间、太阳、同步纯函数 | 2-3h |
| MVP 5 | 可用性增强 | 默认城市持久化、基础设置、离线状态 | 3-4h |
| MVP N | 后续扩展 | 多城市管理、置顶小窗、托盘、快捷键、主题、发布包 | 按批推进 |

## 目标架构

前端目标结构：

```text
app/src/
  App.tsx
  styles/clock.css
  data/cities.ts
  domain/timeFormat.ts
  domain/solar.ts
  domain/sync.ts
  hooks/useClock.ts
  hooks/useSelectedCity.ts
  components/ClockPage.tsx
  components/ClockDisplay.tsx
  components/DatePanel.tsx
  components/SyncStatus.tsx
  components/CityRail.tsx
```

Rust/Tauri 目标：

```text
app/src-tauri/src/time_sync.rs
```

Tauri command：

```text
sync_utc_time -> { utcMs, capturedAtMs, precisionMs, sourceName }
```

前端只根据返回值计算 offset 并展示：

```text
offsetMs = utcMs - capturedAtMs
displayNow = Date.now() + offsetMs
```

## 执行队列

1. Batch 001：中文报告与任务控制面。
2. Batch 002：前端拆分与 starter 清理。
3. Batch 003：Rust 授时核心。
4. Batch 004：测试与正确性。
5. Batch 005：桌面产品化。
6. Batch 006：基础可用性增强。

每个 batch 完成后创建本地 commit。后续如果使用 5.4 medium，应按 batch 顺序推进，不跨 batch 做额外重构。

## 验收原则

- 主界面不再显示 starter UI。
- `TimeIsWidget.tsx` 不再是巨型文件；如果保留，只作为兼容导出。
- 网络授时成功时显示授时源与精度。
- 网络授时失败时继续显示本地时间，并明确提示本地回退。
- 城市切换、日期、太阳信息在 Sydney/Beijing/Tokyo 等城市下可用。
- `bun run build`、`bun run typecheck`、`bun run test` 在相关 batch 后通过。
- Rust/Tauri 相关改动通过 `cargo check`。

## 不做事项

- 不做官方 Time.is 的像素级复制。
- 不使用 Time.is 品牌、商标或官方关联表述。
- MVP 阶段不做账号、云同步、广告、付费服务或自动发布。
- 不引入大型状态管理、后端服务或复杂 UI 框架。

## 提交策略

本项目采用小步提交。每个 batch 完成后先检查 `git status`、相关 build/test，再提交。提交是复查 checkpoint，不代表人工验收通过。
