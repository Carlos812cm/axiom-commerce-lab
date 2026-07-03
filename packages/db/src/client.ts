import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import { requireDatabaseUrl } from "./env";

export const dbPool = new Pool({
  connectionString: requireDatabaseUrl()
});

export const db = drizzle({ client: dbPool });

export async function closeDbConnection(): Promise<void> {
  await dbPool.end();
}
