import { describe, expect, it } from "vitest";
import { formatCityTime, formatClock, getDayOfYear, getIsoWeek } from "./timeFormat";

describe("timeFormat", () => {
  it("calculates ISO week numbers", () => {
    expect(getIsoWeek(2026, 1, 1)).toBe(1);
    expect(getIsoWeek(2024, 12, 31)).toBe(1);
  });

  it("calculates day of year including leap years", () => {
    expect(getDayOfYear(2024, 3, 1)).toBe(61);
    expect(getDayOfYear(2025, 3, 1)).toBe(60);
  });

  it("formats midnight with 00 instead of 24", () => {
    expect(formatClock(new Date("2024-01-01T00:00:00.000Z"), "UTC")).toBe("00:00:00");
  });

  it("formats representative time zones", () => {
    const date = new Date("2024-01-01T00:00:00.000Z");

    expect(formatCityTime(date, "Asia/Shanghai")).toBe("08:00");
    expect(formatCityTime(date, "Asia/Tokyo")).toBe("09:00");
    expect(formatCityTime(date, "Australia/Sydney")).toBe("11:00");
  });
});
