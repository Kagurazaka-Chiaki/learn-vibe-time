import { useCallback, useEffect, useState } from "react";

export type SyncState = {
  offsetMs: number;
  precisionMs: number;
  synced: boolean;
  sourceName: string;
  lastSyncAt: number | null;
};

type TimeSourceCandidate = {
  name: string;
  url: string;
};

const RESYNC_INTERVAL_MS = 5 * 60 * 1000;
const TICK_INTERVAL_MS = 250;
const TIME_SOURCE_CANDIDATES: TimeSourceCandidate[] = [
  { name: "local-api", url: "/api/time/utc" },
  { name: "worldtimeapi", url: "https://worldtimeapi.org/api/timezone/Etc/UTC" },
  { name: "timeapi", url: "https://timeapi.io/api/Time/current/zone?timeZone=UTC" },
];

function extractEpochMs(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    if (value > 1e12) {
      return value;
    }
    if (value > 1e9) {
      return value * 1000;
    }
  }

  if (typeof value === "string") {
    const numeric = Number(value);
    if (Number.isFinite(numeric) && value.trim() !== "") {
      return extractEpochMs(numeric);
    }

    const parsed = Date.parse(value);
    if (!Number.isNaN(parsed)) {
      return parsed;
    }
  }

  if (!value || typeof value !== "object") {
    return null;
  }

  const record = value as Record<string, unknown>;
  const knownKeys = [
    "epochMs",
    "currentTimeMillis",
    "timestamp",
    "unixtime",
    "unixTime",
    "serverTime",
    "serverTimeMs",
    "datetime",
    "dateTime",
    "utc_datetime",
    "utcDateTime",
    "utcNow",
    "iso",
    "now",
  ];

  for (const key of knownKeys) {
    const result = extractEpochMs(record[key]);
    if (result !== null) {
      return result;
    }
  }

  for (const child of Object.values(record)) {
    const result = extractEpochMs(child);
    if (result !== null) {
      return result;
    }
  }

  return null;
}

async function fetchAuthoritativeUtcMs(candidates: TimeSourceCandidate[]): Promise<{
  utcMs: number;
  precisionMs: number;
  sourceName: string;
}> {
  let lastError: unknown = null;

  for (const candidate of candidates) {
    try {
      const requestStartWall = Date.now();
      const requestStartMono = performance.now();
      const response = await fetch(candidate.url, { cache: "no-store" });
      const requestEndMono = performance.now();
      const requestEndWall = Date.now();

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const text = await response.text();
      const payload = text.trim().startsWith("{") || text.trim().startsWith("[") ? JSON.parse(text) : text;
      const utcMs = extractEpochMs(payload);

      if (utcMs === null) {
        throw new Error("No recognizable timestamp in response");
      }

      const roundTripMs = Math.max(0, requestEndMono - requestStartMono);
      const midpointWall = requestStartWall + (requestEndWall - requestStartWall) / 2;
      const offsetMs = utcMs - midpointWall;

      return {
        utcMs: Date.now() + offsetMs,
        precisionMs: Math.max(1, roundTripMs / 2),
        sourceName: candidate.name,
      };
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError instanceof Error ? lastError : new Error("Unable to synchronize time");
}

export function useClock() {
  const [syncState, setSyncState] = useState<SyncState>({
    offsetMs: 0,
    precisionMs: 0,
    synced: false,
    sourceName: "browser-local",
    lastSyncAt: null,
  });
  const [renderNow, setRenderNow] = useState<number>(Date.now());

  const syncOnce = useCallback(async () => {
    try {
      const { utcMs, precisionMs, sourceName } = await fetchAuthoritativeUtcMs(TIME_SOURCE_CANDIDATES);
      const localNow = Date.now();

      setSyncState({
        offsetMs: utcMs - localNow,
        precisionMs,
        synced: true,
        sourceName,
        lastSyncAt: localNow,
      });
    } catch {
      setSyncState((prev) => ({
        ...prev,
        offsetMs: 0,
        precisionMs: 0,
        synced: false,
        sourceName: "browser-local",
        lastSyncAt: Date.now(),
      }));
    }
  }, []);

  useEffect(() => {
    void syncOnce();
    const syncId = window.setInterval(() => {
      void syncOnce();
    }, RESYNC_INTERVAL_MS);

    const tickId = window.setInterval(() => {
      setRenderNow(Date.now());
    }, TICK_INTERVAL_MS);

    return () => {
      window.clearInterval(syncId);
      window.clearInterval(tickId);
    };
  }, [syncOnce]);

  return {
    now: new Date(renderNow + syncState.offsetMs),
    syncState,
  };
}
