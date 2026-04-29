import { useMemo } from "react";
import CityRail from "./CityRail";
import ClockDisplay from "./ClockDisplay";
import DatePanel from "./DatePanel";
import SyncStatus from "./SyncStatus";
import { buildSunLine } from "../domain/solar";
import { formatChineseDate, formatClock, getDayOfYear, getLocalDateParts } from "../domain/timeFormat";
import { useClock } from "../hooks/useClock";
import { useSelectedCity } from "../hooks/useSelectedCity";
import "../styles/clock.css";

export default function ClockPage() {
  const { now, syncState } = useClock();
  const { activeCity, setActiveCityKey } = useSelectedCity();

  const clockText = useMemo(() => formatClock(now, activeCity.timeZone), [now, activeCity.timeZone]);
  const dateText = useMemo(() => formatChineseDate(now, activeCity.timeZone), [now, activeCity.timeZone]);
  const localParts = useMemo(() => getLocalDateParts(now, activeCity.timeZone), [now, activeCity.timeZone]);
  const dayOfYear = useMemo(
    () => getDayOfYear(localParts.year, localParts.month, localParts.day),
    [localParts.year, localParts.month, localParts.day],
  );
  const sunLine = useMemo(() => buildSunLine(now, activeCity), [now, activeCity]);

  return (
    <main className="clock-page">
      <div className="clock-shell">
        <SyncStatus syncState={syncState} />
        <div className="location-line">现在的{activeCity.displayLabel ?? activeCity.label}, 时间:</div>

        <section className="clock-main" aria-label="当前城市时间">
          <ClockDisplay clockText={clockText} />
          <DatePanel dateText={dateText} tagText={activeCity.tagline ?? `Day ${dayOfYear}`} sunLine={sunLine} />
          <CityRail activeCity={activeCity} now={now} onSelectCity={setActiveCityKey} />
        </section>
      </div>
    </main>
  );
}
