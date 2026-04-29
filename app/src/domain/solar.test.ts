import { describe, expect, it } from "vitest";
import { formatDayLength, getSunTimesForDate } from "./solar";

describe("solar", () => {
  it("returns valid Sydney sunrise and sunset for a fixed date", () => {
    const result = getSunTimesForDate(new Date(Date.UTC(2024, 0, 1)), -33.8688, 151.2093);

    expect(result).not.toBeNull();
    expect(result?.sunrise.getTime()).toBeGreaterThan(0);
    expect(result?.sunset.getTime()).toBeGreaterThan(result?.sunrise.getTime() ?? 0);
    expect(result?.daylightMs).toBeGreaterThan(0);
  });

  it("returns null instead of crashing for unavailable solar geometry", () => {
    expect(getSunTimesForDate(new Date(Date.UTC(2024, 0, 1)), 90, 0)).toBeNull();
  });

  it("formats daylight duration", () => {
    expect(formatDayLength(12 * 60 * 60 * 1000 + 34 * 60 * 1000)).toBe("12时 34分");
  });
});
