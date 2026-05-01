import { useCallback, useEffect, useRef, useState } from "react";
import { createFallbackSyncState, getSyncErrorMessage, syncUtcTime, type SyncState } from "../domain/sync";

const RESYNC_INTERVAL_MS = 5 * 60 * 1000;
const TICK_INTERVAL_MS = 250;
const MILLIS_TICK_INTERVAL_MS = 33;

export function isLatestSyncRequest(requestId: number, latestRequestId: number): boolean {
  return requestId === latestRequestId;
}

export function useClock(timeSourceId: string, showMilliseconds = false) {
  const [syncState, setSyncState] = useState<SyncState>(() => createFallbackSyncState());
  const [renderNow, setRenderNow] = useState<number>(Date.now());
  const latestSyncRequestIdRef = useRef(0);

  const syncOnce = useCallback(async () => {
    const requestId = latestSyncRequestIdRef.current + 1;
    latestSyncRequestIdRef.current = requestId;

    try {
      const nextSyncState = await syncUtcTime(timeSourceId);
      if (isLatestSyncRequest(requestId, latestSyncRequestIdRef.current)) {
        setSyncState(nextSyncState);
      }
    } catch (error) {
      if (!isLatestSyncRequest(requestId, latestSyncRequestIdRef.current)) {
        return;
      }

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
    }, showMilliseconds ? MILLIS_TICK_INTERVAL_MS : TICK_INTERVAL_MS);

    return () => {
      window.clearInterval(syncId);
      window.clearInterval(tickId);
    };
  }, [showMilliseconds, syncOnce]);

  return {
    now: new Date(renderNow + syncState.offsetMs),
    syncState,
    syncOnce,
  };
}

export type { SyncState };
