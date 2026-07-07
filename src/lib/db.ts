import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

// Cache the pool across HMR module re-evaluations in dev to avoid leaking connections.
const globalForDb = globalThis as unknown as { pgPool?: Pool };

const pool = globalForDb.pgPool ?? new Pool({ connectionString: process.env.DATABASE_URL });

if (!globalForDb.pgPool) {
  // Required: an unhandled 'error' event from an idle client would crash the process.
  pool.on("error", (err) => {
    console.error("[db] idle client error:", err.message);
  });
  if (process.env.NODE_ENV !== "production") {
    globalForDb.pgPool = pool;
  }
}

export const db = drizzle(pool);
