import { useMemo, useState } from "react";
import { CITIES, DEFAULT_CITY_KEY, getCityByKey } from "../data/cities";

const SELECTED_CITY_STORAGE_KEY = "clean-time.selectedCity";

function isKnownCityKey(value: string | null): value is string {
  return value !== null && CITIES.some((city) => city.key === value);
}

function readInitialCityKey(): string {
  try {
    const stored = window.localStorage.getItem(SELECTED_CITY_STORAGE_KEY);
    return isKnownCityKey(stored) ? stored : DEFAULT_CITY_KEY;
  } catch {
    return DEFAULT_CITY_KEY;
  }
}

export function useSelectedCity() {
  const [activeCityKey, setActiveCityKeyState] = useState<string>(readInitialCityKey);

  const activeCity = useMemo(() => getCityByKey(activeCityKey), [activeCityKey]);

  function setActiveCityKey(cityKey: string) {
    const nextCityKey = isKnownCityKey(cityKey) ? cityKey : DEFAULT_CITY_KEY;
    setActiveCityKeyState(nextCityKey);

    try {
      window.localStorage.setItem(SELECTED_CITY_STORAGE_KEY, nextCityKey);
    } catch {
      // Persistence is optional; the selected city still updates in memory.
    }
  }

  return {
    activeCity,
    activeCityKey,
    setActiveCityKey,
  };
}
