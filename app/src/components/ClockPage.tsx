import { useEffect, useMemo, useState } from "react";
import CityRail from "./CityRail";
import ClockDisplay from "./ClockDisplay";
import DatePanel from "./DatePanel";
import InteractionProbe from "./InteractionProbe";
import SyncStatus from "./SyncStatus";
import SettingsPanel from "./SettingsPanel";
import { listTimeSources, type TimeSourceOption } from "../domain/sync";
import { buildSunLine } from "../domain/solar";
import { formatChineseDate, formatClockParts, getDayOfYear, getLocalDateParts } from "../domain/timeFormat";
import { useClock } from "../hooks/useClock";
import { useClockPreferences } from "../hooks/useClockPreferences";
import { useSelectedCity } from "../hooks/useSelectedCity";
import "../styles/clock.css";

const SHOW_INTERACTION_PROBE = import.meta.env.VITE_INTERACTION_PROBE === "1";

export default function ClockPage() {
  const { activeCity, activeCityKey, setActiveCityKey } = useSelectedCity();
  const { preferences, setShowSeconds, setHourMode, setTimeSourceId, setZenMode } = useClockPreferences();
  const { now, syncState, syncOnce } = useClock(preferences.timeSourceId);
  const [timeSources, setTimeSources] = useState<TimeSourceOption[]>([]);

  useEffect(() => {
    let alive = true;

    void listTimeSources()
      .then((sources) => {
        if (alive) {
          setTimeSources(sources);
        }
      })
      .catch(() => {
        if (alive) {
          setTimeSources([]);
        }
      });

    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (!preferences.zenMode) {
      return;
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setZenMode(false);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [preferences.zenMode, setZenMode]);

  const clockParts = useMemo(
    () => formatClockParts(now, activeCity.timeZone, preferences),
    [now, activeCity.timeZone, preferences],
  );
  const dateText = useMemo(() => formatChineseDate(now, activeCity.timeZone), [now, activeCity.timeZone]);
  const localParts = useMemo(() => getLocalDateParts(now, activeCity.timeZone), [now, activeCity.timeZone]);
  const dayOfYear = useMemo(
    () => getDayOfYear(localParts.year, localParts.month, localParts.day),
    [localParts.year, localParts.month, localParts.day],
  );
  const sunLine = useMemo(() => buildSunLine(now, activeCity), [now, activeCity]);

  if (preferences.zenMode) {
    return (
      <main className="clock-page clock-page-zen">
        <div className="clock-shell clock-shell-zen">
          <section className="clock-main clock-main-zen" aria-label="当前城市时间" onDoubleClick={() => setZenMode(false)}>
            <ClockDisplay dayPeriod={clockParts.dayPeriod} time={clockParts.time} label={clockParts.text} />
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="clock-page">
      <div className="clock-shell">
        {SHOW_INTERACTION_PROBE ? <InteractionProbe /> : null}
        <SyncStatus syncState={syncState} onResync={syncOnce} />
        <SettingsPanel
          activeCityKey={activeCityKey}
          showSeconds={preferences.showSeconds}
          hourMode={preferences.hourMode}
          timeSourceId={preferences.timeSourceId}
          timeSources={timeSources}
          zenMode={preferences.zenMode}
          onSelectCity={setActiveCityKey}
          onShowSecondsChange={setShowSeconds}
          onHourModeChange={setHourMode}
          onTimeSourceChange={setTimeSourceId}
          onZenModeChange={setZenMode}
        />
        <div className="location-line">现在的{activeCity.displayLabel ?? activeCity.label}, 时间:</div>
        <section className="clock-main" aria-label="当前城市时间">
          <ClockDisplay dayPeriod={clockParts.dayPeriod} time={clockParts.time} label={clockParts.text} />
          <DatePanel dateText={dateText} tagText={activeCity.tagline ?? `Day ${dayOfYear}`} sunLine={sunLine} />
          <CityRail activeCity={activeCity} now={now} hourMode={preferences.hourMode} onSelectCity={setActiveCityKey} />
        </section>
      </div>
    </main>
  );
}
