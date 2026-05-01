import { invoke } from "@tauri-apps/api/core";
import { formatAbsoluteSeconds, formatPrecision } from "./timeFormat";

export type TimeSyncResponse = {
  offsetMs: number;
  delayMs: number;
  estimatedErrorMs: number;
  sourceName: string;
  sourceHost: string;
};

export type TimeSourceOption = {
  id: string;
  name: string;
  kind: "ntp" | "httpJson";
};

export type SyncState = {
  offsetMs: number;
  delayMs: number;
  estimatedErrorMs: number;
  synced: boolean;
  sourceName: string;
  sourceHost: string;
  lastSuccessfulSyncAt: number | null;
  lastFailureAt: number | null;
  lastFailureDetails: string | null;
};

export type DriftCopy = {
  driftText: string;
  estimateText: string;
  sourceText: string;
  offsetText: string;
  delayText: string;
  detailText: string | null;
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

type FallbackSyncOptions = {
  lastSuccessfulSyncAt?: number | null;
  lastFailureAt?: number | null;
  lastFailureDetails?: string | null;
};

export function createFallbackSyncState(options: FallbackSyncOptions = {}): SyncState {
  return {
    offsetMs: 0,
    delayMs: 0,
    estimatedErrorMs: 0,
    synced: false,
    sourceName: "本地系统时间",
    sourceHost: "",
    lastSuccessfulSyncAt: options.lastSuccessfulSyncAt ?? null,
    lastFailureAt: options.lastFailureAt ?? null,
    lastFailureDetails: options.lastFailureDetails ?? null,
  };
}

export function createSyncedState(response: TimeSyncResponse, lastSuccessfulSyncAt = Date.now()): SyncState {
  return {
    offsetMs: response.offsetMs,
    delayMs: response.delayMs,
    estimatedErrorMs: response.estimatedErrorMs,
    synced: true,
    sourceName: response.sourceName,
    sourceHost: response.sourceHost,
    lastSuccessfulSyncAt,
    lastFailureAt: null,
    lastFailureDetails: null,
  };
}

export function getSyncErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  try {
    return JSON.stringify(error);
  } catch {
    return "unknown sync error";
  }
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
      estimateText: syncState.lastFailureAt === null ? "尚未完成网络同步。" : "最近网络同步失败。",
      sourceText: "授时源: 本地系统时间",
      offsetText: "本地偏移: 未使用网络估计",
      delayText: "网络延迟估计: 不可用",
      detailText: syncState.lastFailureDetails ? `详情：${syncState.lastFailureDetails}` : null,
    };
  }

  const offsetAbsMs = Math.abs(syncState.offsetMs);
  const driftText = offsetAbsMs < 50
    ? "系统时间与网络授时源基本一致。"
    : `您的系统时间${syncState.offsetMs >= 0 ? "慢了" : "快了"} ${formatAbsoluteSeconds(syncState.offsetMs)} 秒钟。`;
  const sourceHost = syncState.sourceHost ? ` (${syncState.sourceHost})` : "";

  return {
    driftText,
    estimateText: `同步估计误差约 ±${formatPrecision(syncState.estimatedErrorMs)} 秒钟。`,
    sourceText: `授时源: ${syncState.sourceName}${sourceHost}`,
    offsetText: offsetAbsMs < 50 ? "本地偏移: 小于 0.1 秒" : `本地偏移: ${syncState.offsetMs >= 0 ? "慢" : "快"} ${formatAbsoluteSeconds(syncState.offsetMs)} 秒`,
    delayText: `网络延迟估计: ${formatPrecision(syncState.delayMs)} 秒`,
    detailText: null,
  };
}
