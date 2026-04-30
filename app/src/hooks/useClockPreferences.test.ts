import { describe, expect, it } from "vitest";
import {
  DEFAULT_PREFERENCES,
  normalizePreferences,
  readPreferencesFromStorage,
  writePreferencesToStorage,
  type ClockPreferences,
} from "./useClockPreferences";

class MemoryStorage {
  private values = new Map<string, string>();

  getItem(key: string): string | null {
    return this.values.get(key) ?? null;
  }

  setItem(key: string, value: string) {
    this.values.set(key, value);
  }
}

describe("useClockPreferences helpers", () => {
  it("defaults clean mode to false for legacy preferences", () => {
    const preferences = normalizePreferences({
      showSeconds: false,
      hourMode: "12",
      timeSourceId: "cloudflare",
    });

    expect(preferences).toEqual({
      showSeconds: false,
      hourMode: "12",
      timeSourceId: "cloudflare",
      zenMode: false,
    });
  });

  it("reads default preferences when storage is empty", () => {
    const storage = new MemoryStorage();

    expect(readPreferencesFromStorage(storage)).toEqual(DEFAULT_PREFERENCES);
  });

  it("persists clean mode with preferences", () => {
    const storage = new MemoryStorage();
    const preferences: ClockPreferences = {
      showSeconds: true,
      hourMode: "24",
      timeSourceId: "auto",
      zenMode: true,
    };

    writePreferencesToStorage(storage, preferences);

    expect(readPreferencesFromStorage(storage)).toEqual(preferences);
  });
});
