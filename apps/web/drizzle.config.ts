import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "mysql",
  schema: "./src/server/schema/*",
  out: "./src/server/migrations",
  dbCredentials: {
    url: process.env.DB_URI as string,
  },
  strict: true,
});
