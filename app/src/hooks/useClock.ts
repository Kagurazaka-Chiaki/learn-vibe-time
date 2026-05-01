import { useCallback, useEffect, useState } from "react";
import { createFallbackSyncState, getSyncErrorMessage, syncUtcTime, type SyncState } from "../domain/sync";

const RESYNC_INTERVAL_MS = 5 * 60 * 1000;
const TICK_INTERVAL_MS = 250;

export function useClock(timeSourceId: string) {
  const [syncState, setSyncState] = useState<SyncState>(() => createFallbackSyncState());
  const [renderNow, setRenderNow] = useState<number>(Date.now());

  const syncOnce = useCallback(async () => {
    try {
      setSyncState(await syncUtcTime(timeSourceId));
    } catch (error) {
      const lastFailureAt = Date.now();
      const lastFailureDetails = getSyncErrorMessage(error);
      setSyncState((currentState) =>
        createFallbackSyncState({
          lastSuccessfulSyncAt: currentState.lastSuccessfulSyncAt,
          lastFailureAt,
          lastFailureDetails,
        }),
      );
    }
  }, [timeSourceId]);

  useEffect(() => {
    void syncOnce();
    const syncId = window.setInterval(() => {
      void syncOnce();
    }, RESYNC_INTERVAL_MS);

    const tickId = window.setInterval(() => {
      setRenderNow(Date.now());
    }, TICK_INTERVAL_MS);

    return () => {
      window.clearInterval(syncId);
      window.clearInterval(tickId);
    };
  }, [syncOnce]);

  return {
    now: new Date(renderNow + syncState.offsetMs),
    syncState,
    syncOnce,
  };
}

export type { SyncState };
