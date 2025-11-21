import { defineConfig } from "drizzle-kit";
import { env } from "@/lib/env";

export default defineConfig({
  dialect: "mysql",
  schema: "./src/server/schema/*",
  out: "./src/server/migrations",
  dbCredentials: {
    url: env.DB_URI,
  },
  strict: true,
});
