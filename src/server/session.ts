import { headers } from "next/headers";
import { auth } from "./auth";
import { cache } from "react";
import { db } from "./drizzle";
import { shop, user, USER_ROLES } from "./schema/auth-schema";
import { eq } from "drizzle-orm";

// Hard-coded permanent elevated account(s)
const PERMANENT_ADMINS = new Set<string>(["yf2toG5dDFJp5Aoq7Sc5pNrXoO772cM1"]);
const PERMANENT_ADMIN_EMAILS = new Set<string>(["quintelamark10@gmail.com"]);

export const getServerSession = cache(async () => {
  try {
    const hdrs = await headers();
    const session = await auth.api.getSession({ headers: hdrs });

    // No session or no user to sync
    if (!session?.user?.id) {
      return session;
    }

    // Fetch the latest user + shop status to keep roles in sync
    const [dbUser] = await db
      .select()
      .from(user)
      .where(eq(user.id, session.user.id))
      .limit(1);

    if (!dbUser) {
      return null;
    }

    let nextRole = dbUser.role ?? USER_ROLES.CUSTOMER;

    // Force permanent admins to ADMIN (prevents accidental demotion)
    const isPermanentAdmin =
      PERMANENT_ADMINS.has(dbUser.id) ||
      (dbUser.email && PERMANENT_ADMIN_EMAILS.has(dbUser.email));
    if (isPermanentAdmin) {
      nextRole = USER_ROLES.ADMIN;
    }

    // Align seller-related roles with current shop status
    if (nextRole !== USER_ROLES.ADMIN) {
      const [shopRow] = await db
        .select({ status: shop.status })
        .from(shop)
        .where(eq(shop.sellerId, dbUser.id))
        .limit(1);

      const shopStatus = shopRow?.status;

      if (shopStatus === "suspended") {
        nextRole = USER_ROLES.SUSPENDED;
      } else if (shopStatus === "approved") {
        nextRole = USER_ROLES.SELLER;
      } else if (shopStatus === "pending") {
        nextRole = USER_ROLES.PENDING_SELLER;
      } else if (!shopStatus) {
        // If seller has no shop, fallback to customer
        nextRole = USER_ROLES.CUSTOMER;
      }
    }

    // Persist corrected role if it changed
    if (nextRole !== dbUser.role) {
      await db.update(user).set({ role: nextRole }).where(eq(user.id, dbUser.id));
    }

    // Return session with synced role for callers
    if (session.user.role !== nextRole) {
      return { ...session, user: { ...session.user, role: nextRole } };
    }

    return session;
  } catch (error: any) {
    const isConnectionError =
      error?.cause?.code === "ECONNRESET" ||
      error?.cause?.code === "PROTOCOL_CONNECTION_LOST" ||
      error?.cause?.code === "ETIMEDOUT" ||
      error?.cause?.errno === -4077 || // ECONNRESET errno on Windows
      error?.message?.includes("ECONNRESET") ||
      error?.message?.includes("Connection lost") ||
      error?.message?.includes("Failed query");

    // Only log unexpected non-connection issues; otherwise stay silent
    if (!isConnectionError && error?.message) {
      console.warn("Session error:", error.message);
    }

    // Never throw from here; let pages render unauthenticated
    return null;
  }
});
