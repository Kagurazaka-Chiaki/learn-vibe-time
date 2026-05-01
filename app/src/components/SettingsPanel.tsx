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

type SettingsCheckboxProps = {
  checked: boolean;
  label: string;
  onCheckedChange: (checked: boolean) => void;
};

function SettingsCheckbox({ checked, label, onCheckedChange }: SettingsCheckboxProps) {
  return (
    <label
      className="settings-check"
      onClick={(event) => {
        if (event.target instanceof HTMLInputElement) {
          return;
        }

        event.preventDefault();
        onCheckedChange(!checked);
      }}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onCheckedChange(event.currentTarget.checked)}
      />
      <span>{label}</span>
    </label>
  );
}

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
      <label className="settings-field" htmlFor="settings-city">
        <span>城市</span>
        <select
          id="settings-city"
          name="city"
          value={activeCityKey}
          onChange={(event) => onSelectCity(event.currentTarget.value)}
        >
          {CITIES.map((city) => (
            <option key={city.key} value={city.key}>
              {city.displayLabel ?? city.label}
            </option>
          ))}
        </select>
      </label>

      <label className="settings-field settings-source" htmlFor="settings-time-source">
        <span>授时源</span>
        <select
          id="settings-time-source"
          name="timeSource"
          value={timeSourceId}
          onChange={(event) => onTimeSourceChange(event.currentTarget.value)}
        >
          <option value={AUTO_TIME_SOURCE_ID}>自动选择</option>
          {timeSources.map((source) => (
            <option key={source.id} value={source.id}>
              {source.name}
            </option>
          ))}
        </select>
      </label>

      <SettingsCheckbox checked={showSeconds} label="显示秒" onCheckedChange={onShowSecondsChange} />

      <SettingsCheckbox checked={zenMode} label="纯净模式" onCheckedChange={onZenModeChange} />

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
