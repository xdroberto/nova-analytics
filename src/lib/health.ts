export type HealthResult = {
  status: number;
  body: { status: "ok" | "degraded"; db: "up" | "down"; ts?: string };
};

/**
 * Pure health-check decision: given whether the DB responded and the current
 * timestamp, return the JSON body + HTTP status. Kept side-effect-free so it can
 * be unit-tested without a database (the route wires in the live DB probe + clock).
 */
export function evaluateHealth(dbReachable: boolean, timestamp: string): HealthResult {
  if (dbReachable) {
    return { status: 200, body: { status: "ok", db: "up", ts: timestamp } };
  }
  return { status: 503, body: { status: "degraded", db: "down" } };
}
