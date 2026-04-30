import { invoke } from "@tauri-apps/api/core";
import { formatAbsoluteSeconds, formatPrecision } from "./timeFormat";

export type TimeSyncResponse = {
  utcMs: number;
  capturedAtMs: number;
  precisionMs: number;
  sourceName: string;
};

export type TimeSourceOption = {
  id: string;
  name: string;
  kind: "ntp" | "httpJson";
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

export const AUTO_TIME_SOURCE_ID = "auto";

export const FALLBACK_TIME_SOURCES: TimeSourceOption[] = [
  { id: "au-pool", name: "澳大利亚 NTP Pool", kind: "ntp" },
  { id: "cloudflare", name: "Cloudflare Time", kind: "ntp" },
  { id: "google", name: "Google Public NTP", kind: "ntp" },
  { id: "cn-pool", name: "中国 NTP Pool", kind: "ntp" },
  { id: "tencent", name: "腾讯云 NTP", kind: "ntp" },
  { id: "aliyun", name: "阿里云 NTP", kind: "ntp" },
  { id: "global-pool", name: "全球 NTP Pool", kind: "ntp" },
  { id: "ntsc", name: "国家授时中心 NTP", kind: "ntp" },
  { id: "worldtimeapi", name: "worldtimeapi", kind: "httpJson" },
  { id: "timeapi", name: "timeapi", kind: "httpJson" },
];

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

export async function listTimeSources(): Promise<TimeSourceOption[]> {
  try {
    const sources = await invoke<TimeSourceOption[]>("list_time_sources");
    return sources.length > 0 ? sources : FALLBACK_TIME_SOURCES;
  } catch {
    return FALLBACK_TIME_SOURCES;
  }
}

export async function syncUtcTime(sourceId = AUTO_TIME_SOURCE_ID): Promise<SyncState> {
  const response = await invoke<TimeSyncResponse>("sync_utc_time", {
    sourceId: sourceId === AUTO_TIME_SOURCE_ID ? null : sourceId,
  });

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
