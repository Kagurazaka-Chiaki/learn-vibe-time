import { useCallback, useState } from "react";
import { AUTO_TIME_SOURCE_ID } from "../domain/sync";
import type { ClockHourMode } from "../domain/timeFormat";

const PREFERENCES_STORAGE_KEY = "vibe-time.preferences";

export type ClockPreferences = {
  showSeconds: boolean;
  showMilliseconds: boolean;
  hourMode: ClockHourMode;
  timeSourceId: string;
  zenMode: boolean;
};

export const DEFAULT_PREFERENCES: ClockPreferences = {
  showSeconds: true,
  showMilliseconds: false,
  hourMode: "24",
  timeSourceId: AUTO_TIME_SOURCE_ID,
  zenMode: false,
};

type PreferencesReader = Pick<Storage, "getItem">;
type PreferencesWriter = Pick<Storage, "setItem">;

export function normalizePreferences(value: unknown): ClockPreferences {
  if (!value || typeof value !== "object") {
    return DEFAULT_PREFERENCES;
  }

  const record = value as Partial<ClockPreferences>;
  return {
    showSeconds: typeof record.showSeconds === "boolean" ? record.showSeconds : DEFAULT_PREFERENCES.showSeconds,
    showMilliseconds: typeof record.showMilliseconds === "boolean" ? record.showMilliseconds : DEFAULT_PREFERENCES.showMilliseconds,
    hourMode: record.hourMode === "12" || record.hourMode === "24" ? record.hourMode : DEFAULT_PREFERENCES.hourMode,
    timeSourceId: typeof record.timeSourceId === "string" ? record.timeSourceId : DEFAULT_PREFERENCES.timeSourceId,
    zenMode: typeof record.zenMode === "boolean" ? record.zenMode : DEFAULT_PREFERENCES.zenMode,
  };
}

export function readPreferencesFromStorage(storage: PreferencesReader): ClockPreferences {
  const raw = storage.getItem(PREFERENCES_STORAGE_KEY);
  return raw ? normalizePreferences(JSON.parse(raw)) : DEFAULT_PREFERENCES;
}

export function writePreferencesToStorage(storage: PreferencesWriter, preferences: ClockPreferences) {
  storage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(preferences));
}

function readInitialPreferences(): ClockPreferences {
  try {
    return readPreferencesFromStorage(window.localStorage);
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

export function useClockPreferences() {
  const [preferences, setPreferencesState] = useState<ClockPreferences>(readInitialPreferences);

  const setPreferences = useCallback((buildNextPreferences: (currentPreferences: ClockPreferences) => ClockPreferences) => {
    setPreferencesState((currentPreferences) => {
      const nextPreferences = buildNextPreferences(currentPreferences);

      try {
        writePreferencesToStorage(window.localStorage, nextPreferences);
      } catch {
        // Persistence is optional; preferences still update for this session.
      }

      return nextPreferences;
    });
  }, []);

  return {
    preferences,
    setShowSeconds: useCallback(
      (showSeconds: boolean) => setPreferences((currentPreferences) => ({ ...currentPreferences, showSeconds })),
      [setPreferences],
    ),
    setShowMilliseconds: useCallback(
      (showMilliseconds: boolean) => setPreferences((currentPreferences) => ({ ...currentPreferences, showMilliseconds })),
      [setPreferences],
    ),
    setHourMode: useCallback(
      (hourMode: ClockHourMode) => setPreferences((currentPreferences) => ({ ...currentPreferences, hourMode })),
      [setPreferences],
    ),
    setTimeSourceId: useCallback(
      (timeSourceId: string) => setPreferences((currentPreferences) => ({ ...currentPreferences, timeSourceId })),
      [setPreferences],
    ),
    setZenMode: useCallback(
      (zenMode: boolean) => setPreferences((currentPreferences) => ({ ...currentPreferences, zenMode })),
      [setPreferences],
    ),
  };
}
