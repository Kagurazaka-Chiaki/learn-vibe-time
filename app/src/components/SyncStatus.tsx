import type { SyncState } from "../hooks/useClock";
import { formatAbsoluteSeconds, formatPrecision } from "../domain/timeFormat";

type SyncStatusProps = {
  syncState: SyncState;
};

export default function SyncStatus({ syncState }: SyncStatusProps) {
  const driftLabel = syncState.offsetMs >= 0 ? "慢了" : "快了";
  const driftText = `您的系统时间${driftLabel} ${formatAbsoluteSeconds(syncState.offsetMs)} 秒钟。`;
  const precisionText = `同步精确度为 ±${formatPrecision(syncState.precisionMs)} 秒钟。`;

  return (
    <header className="sync-status">
      <div className="sync-drift">
        {driftText}
      </div>
      <div className="sync-precision">{precisionText}</div>
    </header>
  );
}
