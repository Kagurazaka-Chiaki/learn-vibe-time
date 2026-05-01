import { describe, expect, it } from "vitest";
import { isLatestSyncRequest } from "./useClock";

describe("useClock helpers", () => {
  it("only treats the newest sync request as current", () => {
    expect(isLatestSyncRequest(3, 3)).toBe(true);
    expect(isLatestSyncRequest(2, 3)).toBe(false);
  });
});
