import { useMemo, useState } from "react";
import { DEFAULT_CITY_KEY, getCityByKey } from "../data/cities";

export function useSelectedCity() {
  const [activeCityKey, setActiveCityKey] = useState<string>(DEFAULT_CITY_KEY);

  const activeCity = useMemo(() => getCityByKey(activeCityKey), [activeCityKey]);

  return {
    activeCity,
    activeCityKey,
    setActiveCityKey,
  };
}
