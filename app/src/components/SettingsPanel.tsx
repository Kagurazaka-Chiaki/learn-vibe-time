import { CITIES } from "../data/cities";
import type { ClockHourMode } from "../domain/timeFormat";

type SettingsPanelProps = {
  activeCityKey: string;
  showSeconds: boolean;
  hourMode: ClockHourMode;
  onSelectCity: (cityKey: string) => void;
  onShowSecondsChange: (showSeconds: boolean) => void;
  onHourModeChange: (hourMode: ClockHourMode) => void;
};

export default function SettingsPanel({
  activeCityKey,
  showSeconds,
  hourMode,
  onSelectCity,
  onShowSecondsChange,
  onHourModeChange,
}: SettingsPanelProps) {
  return (
    <section className="settings-panel" aria-label="时钟设置">
      <label className="settings-field">
        <span>城市</span>
        <select value={activeCityKey} onChange={(event) => onSelectCity(event.currentTarget.value)}>
          {CITIES.map((city) => (
            <option key={city.key} value={city.key}>
              {city.displayLabel ?? city.label}
            </option>
          ))}
        </select>
      </label>

      <label className="settings-check">
        <input
          type="checkbox"
          checked={showSeconds}
          onChange={(event) => onShowSecondsChange(event.currentTarget.checked)}
        />
        <span>显示秒</span>
      </label>

      <div className="settings-segment" role="group" aria-label="小时制">
        <button
          type="button"
          className={hourMode === "24" ? "segment-active" : ""}
          onClick={() => onHourModeChange("24")}
          aria-pressed={hourMode === "24"}
        >
          24
        </button>
        <button
          type="button"
          className={hourMode === "12" ? "segment-active" : ""}
          onClick={() => onHourModeChange("12")}
          aria-pressed={hourMode === "12"}
        >
          12
        </button>
      </div>
    </section>
  );
}
