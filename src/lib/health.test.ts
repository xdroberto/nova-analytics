import { describe, expect, it } from "vitest";

import { evaluateHealth } from "./health";

describe("evaluateHealth", () => {
  it("returns 200 ok + db up + the given timestamp when the DB is reachable", () => {
    expect(evaluateHealth(true, "2026-07-08T00:00:00.000Z")).toEqual({
      status: 200,
      body: { status: "ok", db: "up", ts: "2026-07-08T00:00:00.000Z" },
    });
  });

  it("returns 503 degraded + db down (and NO timestamp) when the DB is unreachable", () => {
    expect(evaluateHealth(false, "2026-07-08T00:00:00.000Z")).toEqual({
      status: 503,
      body: { status: "degraded", db: "down" },
    });
  });
});
