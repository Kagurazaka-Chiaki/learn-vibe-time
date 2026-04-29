import { describe, expect, it } from "vitest";
import { buildDriftCopy, createFallbackSyncState, createSyncedState } from "./sync";

describe("sync", () => {
  it("calculates clock offset from Tauri response timestamps", () => {
    const state = createSyncedState({
      utcMs: 1_700_000_001_250,
      capturedAtMs: 1_700_000_000_000,
      precisionMs: 12.5,
      sourceName: "worldtimeapi",
    }, 1_700_000_002_000);

    expect(state.offsetMs).toBe(1250);
    expect(state.precisionMs).toBe(12.5);
    expect(state.sourceName).toBe("worldtimeapi");
    expect(state.synced).toBe(true);
  });

  it("describes near-zero synced drift as accurate", () => {
    const copy = buildDriftCopy(createSyncedState({
      utcMs: 1_700_000_000_025,
      capturedAtMs: 1_700_000_000_000,
      precisionMs: 3,
      sourceName: "worldtimeapi",
    }));

    expect(copy.driftText).toBe("您的系统时间基本准确。");
    expect(copy.sourceText).toContain("worldtimeapi");
  });

  it("creates a local fallback state", () => {
    const state = createFallbackSyncState(1_700_000_000_000);
    const copy = buildDriftCopy(state);

    expect(state.synced).toBe(false);
    expect(state.sourceName).toBe("本地系统时间");
    expect(copy.sourceText).toContain("网络授时不可用");
  });
});
