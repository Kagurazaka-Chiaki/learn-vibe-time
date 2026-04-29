import React, { useCallback, useEffect, useMemo, useState } from "react";

type City = {
  key: string;
  label: string;
  displayLabel?: string;
  timeZone: string;
  latitude: number;
  longitude: number;
  tagline?: string;
};

type SyncState = {
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

const CITIES: City[] = [
  {
    key: "newyork",
    label: "纽约",
    displayLabel: "美国纽约",
    timeZone: "America/New_York",
    latitude: 40.7128,
    longitude: -74.006,
  },
  {
    key: "london",
    label: "伦敦",
    displayLabel: "英国伦敦",
    timeZone: "Europe/London",
    latitude: 51.5072,
    longitude: -0.1276,
  },
  {
    key: "paris",
    label: "巴黎",
    displayLabel: "法国巴黎",
    timeZone: "Europe/Paris",
    latitude: 48.8566,
    longitude: 2.3522,
  },
  {
    key: "perth",
    label: "珀斯",
    displayLabel: "澳大利亚珀斯",
    timeZone: "Australia/Perth",
    latitude: -31.9523,
    longitude: 115.8613,
  },
  {
    key: "beijing",
    label: "北京",
    displayLabel: "中国北京",
    timeZone: "Asia/Shanghai",
    latitude: 39.9042,
    longitude: 116.4074,
  },
  {
    key: "tokyo",
    label: "东京",
    displayLabel: "日本东京",
    timeZone: "Asia/Tokyo",
    latitude: 35.6762,
    longitude: 139.6503,
  },
  {
    key: "adelaide",
    label: "阿德莱德",
    displayLabel: "澳大利亚阿德莱德",
    timeZone: "Australia/Adelaide",
    latitude: -34.9285,
    longitude: 138.6007,
  },
  {
    key: "sydney",
    label: "悉尼",
    displayLabel: "澳大利亚悉尼",
    timeZone: "Australia/Sydney",
    latitude: -33.8688,
    longitude: 151.2093,
    tagline: "Bat Appreciation Day",
  },
];

const DEFAULT_CITY_KEY = "sydney";
const RESYNC_INTERVAL_MS = 5 * 60 * 1000;
const TICK_INTERVAL_MS = 250;
const TIME_SOURCE_CANDIDATES: TimeSourceCandidate[] = [
  { name: "local-api", url: "/api/time/utc" },
  { name: "worldtimeapi", url: "https://worldtimeapi.org/api/timezone/Etc/UTC" },
  { name: "timeapi", url: "https://timeapi.io/api/Time/current/zone?timeZone=UTC" },
];

const pageStyle: React.CSSProperties = {
  minHeight: "100vh",
  width: "100%",
  background: "#ececec",
  color: "#2f2f31",
  fontFamily: 'Arial, "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif',
};

const shellStyle: React.CSSProperties = {
  maxWidth: 2048,
  minHeight: "100vh",
  margin: "0 auto",
  padding: "18px 26px 20px 26px",
  display: "flex",
  flexDirection: "column",
};

const topLineStyle: React.CSSProperties = {
  fontSize: "clamp(36px, 3.2vw, 74px)",
  lineHeight: 1,
  fontWeight: 800,
  letterSpacing: "-0.055em",
};

const subLineStyle: React.CSSProperties = {
  marginTop: 10,
  fontSize: "clamp(26px, 2vw, 54px)",
  lineHeight: 1.05,
  fontWeight: 400,
  letterSpacing: "-0.03em",
};

const locationLineStyle: React.CSSProperties = {
  marginTop: 8,
  fontSize: "clamp(30px, 2.25vw, 58px)",
  lineHeight: 1.08,
  fontWeight: 400,
  letterSpacing: "-0.03em",
};

const clockStyle: React.CSSProperties = {
  fontSize: "clamp(150px, 31vw, 465px)",
  lineHeight: 0.84,
  fontWeight: 900,
  letterSpacing: "-0.095em",
  color: "#2d2d2f",
  textAlign: "center",
  fontVariantNumeric: "tabular-nums lining-nums",
  userSelect: "none",
  textRendering: "geometricPrecision",
};

const dateBlockStyle: React.CSSProperties = {
  width: "100%",
  marginTop: 20,
  textAlign: "right",
  color: "#333333",
};

const dateLineStyle: React.CSSProperties = {
  fontSize: "clamp(28px, 2.8vw, 68px)",
  lineHeight: 1.05,
  fontWeight: 400,
  letterSpacing: "-0.045em",
};

const tagLineStyle: React.CSSProperties = {
  marginTop: 2,
  fontSize: "clamp(18px, 1.45vw, 36px)",
  lineHeight: 1.05,
  fontWeight: 400,
  color: "#3d3d3d",
};

const sunLineStyle: React.CSSProperties = {
  width: "100%",
  marginTop: 10,
  textAlign: "right",
  fontSize: "clamp(17px, 1.25vw, 31px)",
  lineHeight: 1.2,
  fontWeight: 400,
  letterSpacing: "-0.025em",
  color: "#333333",
};

const cityRailStyle: React.CSSProperties = {
  width: "100%",
  marginTop: 30,
  display: "flex",
  justifyContent: "flex-end",
  gap: 14,
  flexWrap: "wrap",
};

const cardBaseStyle: React.CSSProperties = {
  width: 145,
  height: 95,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  border: "none",
  borderRadius: 0,
  cursor: "pointer",
  transition: "background 120ms ease, color 120ms ease, transform 120ms ease",
  paddingTop: 4,
  paddingBottom: 2,
};

const cardLabelStyle: React.CSSProperties = {
  fontSize: 23,
  lineHeight: 1,
  fontWeight: 700,
  letterSpacing: "-0.03em",
};

const cardTimeStyle: React.CSSProperties = {
  marginTop: 8,
  fontSize: 28,
  lineHeight: 1,
  fontWeight: 400,
  fontVariantNumeric: "tabular-nums lining-nums",
  letterSpacing: "-0.045em",
};

function pad2(value: number): string {
  return String(value).padStart(2, "0");
}

function toSignedFixedSeconds(ms: number): string {
  return (Math.abs(ms) / 1000).toFixed(1);
}

function getLocalDateParts(date: Date, timeZone: string): {
  year: number;
  month: number;
  day: number;
  weekday: string;
  hour: string;
  minute: string;
  second: string;
} {
  const formatter = new Intl.DateTimeFormat("zh-CN", {
    timeZone,
    hour12: false,
    year: "numeric",
    month: "numeric",
    day: "numeric",
    weekday: "long",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const parts = formatter.formatToParts(date);
  const map: Record<string, string> = {};
  for (const part of parts) {
    if (part.type !== "literal") {
      map[part.type] = part.value;
    }
  }

  return {
    year: Number(map.year),
    month: Number(map.month),
    day: Number(map.day),
    weekday: map.weekday,
    hour: map.hour,
    minute: map.minute,
    second: map.second,
  };
}

function getIsoWeek(year: number, month: number, day: number): number {
  const working = new Date(Date.UTC(year, month - 1, day));
  const dayNum = working.getUTCDay() || 7;
  working.setUTCDate(working.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(working.getUTCFullYear(), 0, 1));
  return Math.ceil((((working.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

function getDayOfYear(year: number, month: number, day: number): number {
  const current = new Date(Date.UTC(year, month - 1, day));
  const start = new Date(Date.UTC(year, 0, 0));
  return Math.floor((current.getTime() - start.getTime()) / 86400000);
}

function formatClock(date: Date, timeZone: string): string {
  const parts = getLocalDateParts(date, timeZone);
  return `${parts.hour}:${parts.minute}:${parts.second}`;
}

function formatCityTime(date: Date, timeZone: string): string {
  const parts = getLocalDateParts(date, timeZone);
  return `${parts.hour}:${parts.minute}`;
}

function formatChineseDate(date: Date, timeZone: string): string {
  const parts = getLocalDateParts(date, timeZone);
  const week = getIsoWeek(parts.year, parts.month, parts.day);
  return `${parts.year}年${parts.month}月${parts.day}日${parts.weekday}， 第${week}周`;
}

function formatPrecision(ms: number): string {
  if (!Number.isFinite(ms) || ms <= 0) {
    return "0.000";
  }
  return (ms / 1000).toFixed(3);
}

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
      const payload = text.trim().startsWith("{") || text.trim().startsWith("[")
        ? JSON.parse(text)
        : text;

      const utcMs = extractEpochMs(payload);
      if (utcMs === null) {
        throw new Error("No recognizable timestamp in response");
      }

      const roundTripMs = Math.max(0, requestEndMono - requestStartMono);
      const midpointWall = requestStartWall + (requestEndWall - requestStartWall) / 2;
      const offsetMs = utcMs - midpointWall;
      const correctedUtcMs = Date.now() + offsetMs;
      const precisionMs = Math.max(1, roundTripMs / 2);

      return {
        utcMs: correctedUtcMs,
        precisionMs,
        sourceName: candidate.name,
      };
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError instanceof Error ? lastError : new Error("Unable to synchronize time");
}

function useSynchronizedClock() {
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
      const offsetMs = utcMs - localNow;

      setSyncState({
        offsetMs,
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

  const authoritativeNow = renderNow + syncState.offsetMs;

  return {
    now: new Date(authoritativeNow),
    syncState,
  };
}

const dayMs = 86400000;
const J1970 = 2440588;
const J2000 = 2451545;
const rad = Math.PI / 180;
const e = rad * 23.4397;
const sunAltitude = -0.833 * rad;
const J0 = 0.0009;

function toJulian(date: Date): number {
  return date.valueOf() / dayMs - 0.5 + J1970;
}

function fromJulian(julian: number): Date {
  return new Date((julian + 0.5 - J1970) * dayMs);
}

function toDays(date: Date): number {
  return toJulian(date) - J2000;
}

function rightAscension(l: number, b: number): number {
  return Math.atan2(Math.sin(l) * Math.cos(e) - Math.tan(b) * Math.sin(e), Math.cos(l));
}

function declination(l: number, b: number): number {
  return Math.asin(Math.sin(b) * Math.cos(e) + Math.cos(b) * Math.sin(e) * Math.sin(l));
}

function solarMeanAnomaly(d: number): number {
  return rad * (357.5291 + 0.98560028 * d);
}

function eclipticLongitude(M: number): number {
  const C = rad * (1.9148 * Math.sin(M) + 0.02 * Math.sin(2 * M) + 0.0003 * Math.sin(3 * M));
  const P = rad * 102.9372;
  return M + C + P + Math.PI;
}

function julianCycle(d: number, lw: number): number {
  return Math.round(d - J0 - lw / (2 * Math.PI));
}

function approxTransit(Ht: number, lw: number, n: number): number {
  return J0 + (Ht + lw) / (2 * Math.PI) + n;
}

function solarTransitJ(ds: number, M: number, L: number): number {
  return J2000 + ds + 0.0053 * Math.sin(M) - 0.0069 * Math.sin(2 * L);
}

function hourAngle(height: number, phi: number, d: number): number {
  return Math.acos((Math.sin(height) - Math.sin(phi) * Math.sin(d)) / (Math.cos(phi) * Math.cos(d)));
}

function getSetJ(height: number, lw: number, phi: number, dec: number, n: number, M: number, L: number): number {
  const w = hourAngle(height, phi, dec);
  const a = approxTransit(w, lw, n);
  return solarTransitJ(a, M, L);
}

function getSunTimesForDate(date: Date, latitude: number, longitude: number): { sunrise: Date; sunset: Date } {
  const lw = rad * -longitude;
  const phi = rad * latitude;
  const d = toDays(date);
  const n = julianCycle(d, lw);
  const ds = approxTransit(0, lw, n);
  const M = solarMeanAnomaly(ds);
  const L = eclipticLongitude(M);
  const dec = declination(L, 0);
  const Jnoon = solarTransitJ(ds, M, L);
  const Jset = getSetJ(sunAltitude, lw, phi, dec, n, M, L);
  const Jrise = Jnoon - (Jset - Jnoon);

  return {
    sunrise: fromJulian(Jrise),
    sunset: fromJulian(Jset),
  };
}

function formatHm(date: Date, timeZone: string): string {
  const parts = new Intl.DateTimeFormat("zh-CN", {
    timeZone,
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
  }).formatToParts(date);

  const map: Record<string, string> = {};
  for (const part of parts) {
    if (part.type !== "literal") {
      map[part.type] = part.value;
    }
  }

  return `${map.hour}:${map.minute}`;
}

function formatDayLength(durationMs: number): string {
  const totalMinutes = Math.max(0, Math.round(durationMs / 60000));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}时 ${minutes}分`;
}

function buildSunLine(now: Date, city: City): string {
  const parts = getLocalDateParts(now, city.timeZone);
  const dateForSolarCalc = new Date(Date.UTC(parts.year, parts.month - 1, parts.day));
  const { sunrise, sunset } = getSunTimesForDate(dateForSolarCalc, city.latitude, city.longitude);
  const daylightMs = sunset.getTime() - sunrise.getTime();

  return `太阳: ↑ ${formatHm(sunrise, city.timeZone)} ↓ ${formatHm(sunset, city.timeZone)} (${formatDayLength(daylightMs)}) - 更多信息 - 将${city.label}时间设为默认 - 取消关注此位置`;
}

export default function TimeIsReplica() {
  const { now, syncState } = useSynchronizedClock();
  const [activeCityKey, setActiveCityKey] = useState<string>(DEFAULT_CITY_KEY);

  const activeCity = useMemo(
    () => CITIES.find((city) => city.key === activeCityKey) ?? CITIES[CITIES.length - 1],
    [activeCityKey]
  );

  const driftLabel = syncState.offsetMs >= 0 ? "慢了" : "快了";
  const driftSeconds = toSignedFixedSeconds(syncState.offsetMs);
  const clockText = useMemo(() => formatClock(now, activeCity.timeZone), [now, activeCity.timeZone]);
  const dateText = useMemo(() => formatChineseDate(now, activeCity.timeZone), [now, activeCity.timeZone]);
  const localParts = useMemo(() => getLocalDateParts(now, activeCity.timeZone), [now, activeCity.timeZone]);
  const dayOfYear = useMemo(
    () => getDayOfYear(localParts.year, localParts.month, localParts.day),
    [localParts.year, localParts.month, localParts.day]
  );
  const sunLine = useMemo(() => buildSunLine(now, activeCity), [now, activeCity]);

  return (
    <div style={pageStyle}>
      <div style={shellStyle}>
        <div style={topLineStyle}>
          您的系统时间{driftLabel} <span style={{ fontWeight: 900 }}>{driftSeconds}</span> 秒钟。
        </div>

        <div style={subLineStyle}>
          同步精确度为 ±{formatPrecision(syncState.precisionMs)} 秒钟。
        </div>

        <div style={locationLineStyle}>现在的{activeCity.displayLabel ?? activeCity.label}, 时间:</div>

        <div
          style={{
            marginTop: 16,
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <div style={clockStyle}>{clockText}</div>

          <div style={dateBlockStyle}>
            <div style={dateLineStyle}>{dateText}</div>
            <div style={tagLineStyle}>{activeCity.tagline ?? `Day ${dayOfYear}`}</div>
          </div>

          <div style={sunLineStyle}>{sunLine}</div>

          <div style={cityRailStyle}>
            {CITIES.map((city) => {
              const active = city.key === activeCity.key;

              return (
                <button
                  key={city.key}
                  type="button"
                  onClick={() => setActiveCityKey(city.key)}
                  style={{
                    ...cardBaseStyle,
                    background: active ? "#ababaf" : "#e3e3e3",
                    color: active ? "#ffffff" : "#2f2f31",
                  }}
                  aria-pressed={active}
                  title={`${city.label} ${formatCityTime(now, city.timeZone)}`}
                >
                  <div style={cardLabelStyle}>{city.label}</div>
                  <div style={cardTimeStyle}>{formatCityTime(now, city.timeZone)}</div>
                </button>
              );
            })}
          </div>

          <div
            style={{
              marginTop: 14,
              textAlign: "right",
              fontSize: 12,
              color: "#7b7b7b",
              letterSpacing: "0.01em",
            }}
          >
            授时源: {syncState.sourceName} · {syncState.synced ? "已同步" : "本地回退"}
          </div>
        </div>
      </div>
    </div>
  );
}
