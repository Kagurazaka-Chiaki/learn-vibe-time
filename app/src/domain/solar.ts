import type { City } from "../data/cities";
import { formatHm, getLocalDateParts } from "./timeFormat";

const dayMs = 86400000;
const J1970 = 2440588;
const J2000 = 2451545;
const rad = Math.PI / 180;
const solarObliquity = rad * 23.4397;
const sunAltitude = -0.833 * rad;
const J0 = 0.0009;

export type SunTimes = {
  sunrise: Date;
  sunset: Date;
  daylightMs: number;
};

function toJulian(date: Date): number {
  return date.valueOf() / dayMs - 0.5 + J1970;
}

function fromJulian(julian: number): Date {
  return new Date((julian + 0.5 - J1970) * dayMs);
}

function toDays(date: Date): number {
  return toJulian(date) - J2000;
}

function declination(l: number, b: number): number {
  return Math.asin(Math.sin(b) * Math.cos(solarObliquity) + Math.cos(b) * Math.sin(solarObliquity) * Math.sin(l));
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

function hourAngle(height: number, phi: number, d: number): number | null {
  const value = (Math.sin(height) - Math.sin(phi) * Math.sin(d)) / (Math.cos(phi) * Math.cos(d));
  if (!Number.isFinite(value) || value < -1 || value > 1) {
    return null;
  }

  return Math.acos(value);
}

function getSetJ(height: number, lw: number, phi: number, dec: number, n: number, M: number, L: number): number | null {
  const w = hourAngle(height, phi, dec);
  if (w === null) {
    return null;
  }

  const a = approxTransit(w, lw, n);
  return solarTransitJ(a, M, L);
}

export function getSunTimesForDate(date: Date, latitude: number, longitude: number): SunTimes | null {
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

  if (Jset === null) {
    return null;
  }

  const Jrise = Jnoon - (Jset - Jnoon);
  const sunrise = fromJulian(Jrise);
  const sunset = fromJulian(Jset);
  const daylightMs = sunset.getTime() - sunrise.getTime();

  if (!Number.isFinite(daylightMs) || daylightMs < 0) {
    return null;
  }

  return {
    sunrise,
    sunset,
    daylightMs,
  };
}

export function formatDayLength(durationMs: number): string {
  const totalMinutes = Math.max(0, Math.round(durationMs / 60000));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}时 ${minutes}分`;
}

export function buildSunLine(now: Date, city: City): string {
  const parts = getLocalDateParts(now, city.timeZone);
  const dateForSolarCalc = new Date(Date.UTC(parts.year, parts.month - 1, parts.day));
  const sunTimes = getSunTimesForDate(dateForSolarCalc, city.latitude, city.longitude);

  if (!sunTimes) {
    return "太阳数据暂不可用";
  }

  return `太阳: ↑ ${formatHm(sunTimes.sunrise, city.timeZone)} ↓ ${formatHm(sunTimes.sunset, city.timeZone)} (${formatDayLength(sunTimes.daylightMs)}) - 更多信息 - 将${city.label}时间设为默认 - 取消关注此位置`;
}
