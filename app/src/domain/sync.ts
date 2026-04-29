import { invoke } from "@tauri-apps/api/core";
import { formatAbsoluteSeconds, formatPrecision } from "./timeFormat";

export type TimeSyncResponse = {
  utcMs: number;
  capturedAtMs: number;
  precisionMs: number;
  sourceName: string;
};

export type SyncState = {
  offsetMs: number;
  precisionMs: number;
  synced: boolean;
  sourceName: string;
  lastSyncAt: number | null;
};

export type DriftCopy = {
  driftText: string;
  precisionText: string;
  sourceText: string;
};

export function createFallbackSyncState(lastSyncAt: number | null = Date.now()): SyncState {
  return {
    offsetMs: 0,
    precisionMs: 0,
    synced: false,
    sourceName: "本地系统时间",
    lastSyncAt,
  };
}

export function createSyncedState(response: TimeSyncResponse, lastSyncAt = Date.now()): SyncState {
  return {
    offsetMs: response.utcMs - response.capturedAtMs,
    precisionMs: response.precisionMs,
    synced: true,
    sourceName: response.sourceName,
    lastSyncAt,
  };
}

export async function syncUtcTime(): Promise<SyncState> {
  const response = await invoke<TimeSyncResponse>("sync_utc_time");
  return createSyncedState(response);
}

export function buildDriftCopy(syncState: SyncState): DriftCopy {
  if (!syncState.synced) {
    return {
      driftText: "正在使用本地系统时间。",
      precisionText: "网络授时不可用。",
      sourceText: "授时源: 本地系统时间 · 网络授时不可用",
    };
  }

  const offsetAbsMs = Math.abs(syncState.offsetMs);
  const driftText = offsetAbsMs < 50
    ? "您的系统时间基本准确。"
    : `您的系统时间${syncState.offsetMs >= 0 ? "慢了" : "快了"} ${formatAbsoluteSeconds(syncState.offsetMs)} 秒钟。`;

  return {
    driftText,
    precisionText: `同步精确度为 ±${formatPrecision(syncState.precisionMs)} 秒钟。`,
    sourceText: `授时源: ${syncState.sourceName} · 精度 ±${formatPrecision(syncState.precisionMs)} 秒`,
  };
}
