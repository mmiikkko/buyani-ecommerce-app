import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { betterAuth } from "better-auth";
import { db } from "./drizzle";
import {
  account,
  user,
  session,
  verification,
} from "@/server/schema/auth-schema";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "mysql",
    schema: { user, account, session, verification },
  }),
});
