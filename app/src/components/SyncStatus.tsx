import type { SyncState } from "../hooks/useClock";
import { buildDriftCopy } from "../domain/sync";

type SyncStatusProps = {
  syncState: SyncState;
  onResync: () => void;
};

function formatLastSync(lastSyncAt: number | null): string {
  if (lastSyncAt === null) {
    return "尚未同步";
  }

  return new Intl.DateTimeFormat("zh-CN", {
    hourCycle: "h23",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(new Date(lastSyncAt));
}

export default function SyncStatus({ syncState, onResync }: SyncStatusProps) {
  const { driftText, precisionText, sourceText } = buildDriftCopy(syncState);

  return (
    <header className="sync-status" aria-label="授时状态">
      <div className="sync-drift">{driftText}</div>
      <div className="sync-precision">{precisionText}</div>
      <div className="sync-meta">
        <span>{sourceText}</span>
        <span>最近同步: {formatLastSync(syncState.lastSyncAt)}</span>
        <button type="button" onClick={onResync}>重新同步</button>
      </div>
    </header>
  );
}
