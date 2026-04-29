import type { SyncState } from "../hooks/useClock";
import { buildDriftCopy } from "../domain/sync";

type SyncStatusProps = {
  syncState: SyncState;
};

export default function SyncStatus({ syncState }: SyncStatusProps) {
  const { driftText, precisionText, sourceText } = buildDriftCopy(syncState);

  return (
    <header className="sync-status" aria-label="授时状态">
      <div className="sync-drift">{driftText}</div>
      <div className="sync-precision">{precisionText}</div>
      <div className="sync-source">{sourceText}</div>
    </header>
  );
}
