import { describe, expect, it } from "vitest";
import { buildDriftCopy, createFallbackSyncState, createSyncedState, getSyncErrorMessage } from "./sync";

describe("sync", () => {
  it("uses Tauri response offset and delay estimates", () => {
    const state = createSyncedState({
      offsetMs: 1250,
      delayMs: 48,
      estimatedErrorMs: 24,
      sourceName: "worldtimeapi",
      sourceHost: "https://worldtimeapi.org/api/timezone/Etc/UTC",
    }, 1_700_000_002_000);

    expect(state.offsetMs).toBe(1250);
    expect(state.delayMs).toBe(48);
    expect(state.estimatedErrorMs).toBe(24);
    expect(state.sourceName).toBe("worldtimeapi");
    expect(state.sourceHost).toBe("https://worldtimeapi.org/api/timezone/Etc/UTC");
    expect(state.lastSuccessfulSyncAt).toBe(1_700_000_002_000);
    expect(state.synced).toBe(true);
  });

  it("describes near-zero synced drift without overpromising certainty", () => {
    const copy = buildDriftCopy(createSyncedState({
      offsetMs: 25,
      delayMs: 6,
      estimatedErrorMs: 3,
      sourceName: "worldtimeapi",
      sourceHost: "time.example",
    }));

    expect(copy.driftText).toBe("系统时间与网络授时源基本一致。");
    expect(copy.estimateText).toContain("同步估计误差");
    expect(copy.delayText).toContain("网络延迟估计");
    expect(copy.sourceText).toContain("worldtimeapi");
    expect(`${copy.driftText}${copy.estimateText}${copy.sourceText}${copy.offsetText}${copy.delayText}`).not.toMatch(/\u7cbe\u786e\u5ea6|\u7cbe\u5ea6/);
  });

  it("creates a local fallback state", () => {
    const state = createFallbackSyncState({
      lastSuccessfulSyncAt: 1_700_000_000_000,
      lastFailureAt: 1_700_000_001_000,
      lastFailureDetails: "au.pool.ntp.org timeout; time.cloudflare.com timeout",
    });
    const copy = buildDriftCopy(state);

    expect(state.synced).toBe(false);
    expect(state.sourceName).toBe("本地系统时间");
    expect(state.lastSuccessfulSyncAt).toBe(1_700_000_000_000);
    expect(state.lastFailureAt).toBe(1_700_000_001_000);
    expect(copy.estimateText).toBe("最近网络同步失败。");
    expect(copy.detailText).toContain("au.pool.ntp.org timeout");
  });

  it("normalizes thrown sync errors for UI details", () => {
    expect(getSyncErrorMessage(new Error("network failed"))).toBe("network failed");
    expect(getSyncErrorMessage("plain failure")).toBe("plain failure");
  });
});
