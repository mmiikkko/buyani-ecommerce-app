import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { betterAuth } from "better-auth";
import { db } from "./drizzle";

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "mysql" }),
});
