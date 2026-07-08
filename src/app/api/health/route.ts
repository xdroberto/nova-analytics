import { sql } from "drizzle-orm";

import { db } from "@/lib/db";
import { evaluateHealth } from "@/lib/health";

// Never cache/prerender: a monitored health check must reflect live DB state.
// (Next 16 already doesn't cache GET handlers by default — this pins it against
// a future default change or downgrade.)
export const dynamic = "force-dynamic";

export async function GET() {
  let dbReachable = true;
  try {
    await db.execute(sql`select 1`);
  } catch {
    dbReachable = false;
  }
  const { body, status } = evaluateHealth(dbReachable, new Date().toISOString());
  return Response.json(body, { status });
}
