import { CITIES } from "../data/cities";
import { AUTO_TIME_SOURCE_ID, type TimeSourceOption } from "../domain/sync";
import type { ClockHourMode } from "../domain/timeFormat";

type SettingsPanelProps = {
  activeCityKey: string;
  showSeconds: boolean;
  hourMode: ClockHourMode;
  timeSourceId: string;
  timeSources: TimeSourceOption[];
  zenMode: boolean;
  onSelectCity: (cityKey: string) => void;
  onShowSecondsChange: (showSeconds: boolean) => void;
  onHourModeChange: (hourMode: ClockHourMode) => void;
  onTimeSourceChange: (sourceId: string) => void;
  onZenModeChange: (zenMode: boolean) => void;
};

export default function SettingsPanel({
  activeCityKey,
  showSeconds,
  hourMode,
  timeSourceId,
  timeSources,
  zenMode,
  onSelectCity,
  onShowSecondsChange,
  onHourModeChange,
  onTimeSourceChange,
  onZenModeChange,
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

      <label className="settings-field settings-source">
        <span>授时源</span>
        <select value={timeSourceId} onChange={(event) => onTimeSourceChange(event.currentTarget.value)}>
          <option value={AUTO_TIME_SOURCE_ID}>自动选择</option>
          {timeSources.map((source) => (
            <option key={source.id} value={source.id}>
              {source.name}
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

      <label className="settings-check">
        <input
          type="checkbox"
          checked={zenMode}
          onChange={(event) => onZenModeChange(event.currentTarget.checked)}
        />
        <span>纯净模式</span>
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
