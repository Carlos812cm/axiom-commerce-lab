import { defineConfig } from "drizzle-kit";

import { requireDatabaseUrl } from "./src/env";

export default defineConfig({
  schema: "./src/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: requireDatabaseUrl()
  }
});
