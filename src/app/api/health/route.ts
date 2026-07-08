import { sql } from "drizzle-orm";

import { db } from "@/lib/db";

// Never cache/prerender: a monitored health check must reflect live DB state.
// (Next 16 already doesn't cache GET handlers by default — this pins it against
// a future default change or downgrade.)
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await db.execute(sql`select 1`);
    return Response.json({ status: "ok", db: "up", ts: new Date().toISOString() });
  } catch {
    return Response.json({ status: "degraded", db: "down" }, { status: 503 });
  }
}
