import { useState } from "react";
import type { ClockHourMode } from "../domain/timeFormat";

const PREFERENCES_STORAGE_KEY = "vibe-time.preferences";

export type ClockPreferences = {
  showSeconds: boolean;
  hourMode: ClockHourMode;
};

const DEFAULT_PREFERENCES: ClockPreferences = {
  showSeconds: true,
  hourMode: "24",
};

function normalizePreferences(value: unknown): ClockPreferences {
  if (!value || typeof value !== "object") {
    return DEFAULT_PREFERENCES;
  }

  const record = value as Partial<ClockPreferences>;
  return {
    showSeconds: typeof record.showSeconds === "boolean" ? record.showSeconds : DEFAULT_PREFERENCES.showSeconds,
    hourMode: record.hourMode === "12" || record.hourMode === "24" ? record.hourMode : DEFAULT_PREFERENCES.hourMode,
  };
}

function readInitialPreferences(): ClockPreferences {
  try {
    const raw = window.localStorage.getItem(PREFERENCES_STORAGE_KEY);
    return raw ? normalizePreferences(JSON.parse(raw)) : DEFAULT_PREFERENCES;
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

export function useClockPreferences() {
  const [preferences, setPreferencesState] = useState<ClockPreferences>(readInitialPreferences);

  function setPreferences(nextPreferences: ClockPreferences) {
    setPreferencesState(nextPreferences);

    try {
      window.localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(nextPreferences));
    } catch {
      // Persistence is optional; preferences still update for this session.
    }
  }

  return {
    preferences,
    setShowSeconds: (showSeconds: boolean) => setPreferences({ ...preferences, showSeconds }),
    setHourMode: (hourMode: ClockHourMode) => setPreferences({ ...preferences, hourMode }),
  };
}
